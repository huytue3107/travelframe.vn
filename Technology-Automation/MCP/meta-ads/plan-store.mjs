import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import { constants as fsConstants } from "node:fs";
import * as defaultFs from "node:fs/promises";
import path from "node:path";

import { redactSecrets } from "./redact.mjs";

const DIRECTORY_MODE = 0o700;
const FILE_MODE = 0o600;
const PLAN_TTL_MS = 10 * 60 * 1000;
const SIGNING_KEY_BYTES = 32;
const LOCK_RETRY_MS = 5;
const LOCK_MAX_ATTEMPTS = 80;
const LOCK_STALE_MS = 5 * 60 * 1000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NOFOLLOW = fsConstants.O_NOFOLLOW ?? 0;

function canonicalValue(value, ancestors, location) {
  if (value === null) {
    return "null";
  }

  switch (typeof value) {
    case "string":
    case "boolean":
      return JSON.stringify(value);
    case "number":
      if (!Number.isFinite(value)) {
        throw new TypeError(`Canonical JSON requires a finite number at ${location}`);
      }
      return JSON.stringify(value);
    case "undefined":
      throw new TypeError(`Canonical JSON does not allow undefined at ${location}`);
    case "bigint":
    case "function":
    case "symbol":
      throw new TypeError(
        `Canonical JSON does not support ${typeof value} at ${location}`,
      );
    case "object":
      break;
    default:
      throw new TypeError(`Unsupported canonical JSON value at ${location}`);
  }

  if (ancestors.has(value)) {
    throw new TypeError(`Canonical JSON cycle detected at ${location}`);
  }

  const prototype = Object.getPrototypeOf(value);
  if (Array.isArray(value)) {
    if (prototype !== Array.prototype) {
      throw new TypeError(`Canonical JSON requires a plain array at ${location}`);
    }

    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some((key) => typeof key === "symbol")) {
      throw new TypeError(`Canonical JSON does not allow symbol keys at ${location}`);
    }
    for (const key of ownKeys) {
      if (
        key !== "length" &&
        (!/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= value.length)
      ) {
        throw new TypeError(
          `Canonical JSON does not allow custom array keys at ${location}`,
        );
      }
    }

    ancestors.add(value);
    try {
      const items = [];
      for (let index = 0; index < value.length; index += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
        if (
          !descriptor ||
          !descriptor.enumerable ||
          !Object.hasOwn(descriptor, "value")
        ) {
          throw new TypeError(
            `Canonical JSON requires defined array values at ${location}[${index}]`,
          );
        }
        items.push(
          canonicalValue(descriptor.value, ancestors, `${location}[${index}]`),
        );
      }
      return `[${items.join(",")}]`;
    } finally {
      ancestors.delete(value);
    }
  }

  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError(
      `Canonical JSON requires a plain object at ${location}`,
    );
  }

  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.some((key) => typeof key === "symbol")) {
    throw new TypeError(`Canonical JSON does not allow symbol keys at ${location}`);
  }

  ancestors.add(value);
  try {
    const entries = [];
    for (const key of ownKeys.sort()) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (
        !descriptor.enumerable ||
        !Object.hasOwn(descriptor, "value")
      ) {
        throw new TypeError(
          `Canonical JSON requires enumerable data properties at ${location}.${key}`,
        );
      }
      entries.push(
        `${JSON.stringify(key)}:${canonicalValue(
          descriptor.value,
          ancestors,
          `${location}.${key}`,
        )}`,
      );
    }
    return `{${entries.join(",")}}`;
  } finally {
    ancestors.delete(value);
  }
}

export function canonicalJson(value) {
  return canonicalValue(value, new WeakSet(), "$");
}

export function sha256Digest(value) {
  return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex");
}

function canonicalClone(value) {
  return JSON.parse(canonicalJson(value));
}

function assertUuid(value, label) {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new TypeError(`${label} must be a UUID`);
  }
}

function clockNow(clock) {
  const value = clock.now();
  if (!Number.isFinite(value)) {
    throw new TypeError("clock.now() must return a finite timestamp");
  }
  return value;
}

function isMissing(error) {
  return error?.code === "ENOENT";
}

function symlinkError(target) {
  const error = new Error(`Refusing to use symlink path: ${target}`);
  error.code = "SYMLINK_REFUSED";
  return error;
}

export function createPlanStore({
  stateDir,
  clock = Date,
  randomUUIDImpl = randomUUID,
  fsImpl = defaultFs,
}) {
  if (typeof stateDir !== "string" || stateDir.trim() === "") {
    throw new TypeError("stateDir is required");
  }
  if (!clock || typeof clock.now !== "function") {
    throw new TypeError("clock must provide now()");
  }
  if (typeof randomUUIDImpl !== "function") {
    throw new TypeError("randomUUIDImpl must be a function");
  }

  const root = path.resolve(stateDir);
  const plansDir = path.join(root, "plans");
  const approvalsDir = path.join(root, "approvals");
  const auditDir = path.join(root, "audit");
  const auditPath = path.join(auditDir, "events.jsonl");
  const auditLockPath = path.join(auditDir, "events.lock");
  const signingKeyPath = path.join(root, "receipt-signing.key");
  const locks = new Map();

  async function lstatMaybe(target) {
    try {
      return await fsImpl.lstat(target);
    } catch (error) {
      if (isMissing(error)) {
        return null;
      }
      throw error;
    }
  }

  async function assertNotSymlink(target) {
    const resolved = path.resolve(target);
    const parsed = path.parse(resolved);
    const segments = resolved
      .slice(parsed.root.length)
      .split(path.sep)
      .filter(Boolean);
    let current = parsed.root;
    let stat = await lstatMaybe(current);
    if (stat?.isSymbolicLink()) {
      throw symlinkError(current);
    }

    for (const segment of segments) {
      current = path.join(current, segment);
      stat = await lstatMaybe(current);
      if (!stat) {
        return null;
      }
      if (stat.isSymbolicLink()) {
        throw symlinkError(current);
      }
    }
    return stat;
  }

  async function ensureDirectory(directory) {
    const existing = await assertNotSymlink(directory);
    if (!existing) {
      await fsImpl.mkdir(directory, {
        mode: DIRECTORY_MODE,
        recursive: true,
      });
    }

    const stat = await assertNotSymlink(directory);
    if (!stat?.isDirectory()) {
      throw new Error(`State path is not a directory: ${directory}`);
    }
    await fsImpl.chmod(directory, DIRECTORY_MODE);
  }

  async function ensureStateDirectories() {
    await ensureDirectory(root);
    await ensureDirectory(plansDir);
    await ensureDirectory(approvalsDir);
    await ensureDirectory(auditDir);
  }

  async function syncDirectory(directory) {
    let handle;
    try {
      await assertNotSymlink(directory);
      handle = await fsImpl.open(directory, fsConstants.O_RDONLY | NOFOLLOW);
      await handle.sync();
    } catch (error) {
      if (!["EINVAL", "ENOTSUP", "EBADF", "EISDIR"].includes(error?.code)) {
        throw error;
      }
    } finally {
      await handle?.close();
    }
  }

  async function atomicWriteJson(target, value, { replace = true } = {}) {
    const existing = await assertNotSymlink(target);
    if (existing && !replace) {
      throw new Error(`State file already exists: ${target}`);
    }

    const temporary = path.join(
      path.dirname(target),
      `.${path.basename(target)}.tmp-${process.pid}-${randomUUID()}`,
    );
    let handle;
    let renamed = false;
    try {
      handle = await fsImpl.open(
        temporary,
        fsConstants.O_WRONLY |
          fsConstants.O_CREAT |
          fsConstants.O_EXCL |
          NOFOLLOW,
        FILE_MODE,
      );
      await handle.writeFile(`${canonicalJson(value)}\n`, "utf8");
      await handle.chmod(FILE_MODE);
      await handle.sync();
      await handle.close();
      handle = null;

      const current = await assertNotSymlink(target);
      if (current && !replace) {
        throw new Error(`State file already exists: ${target}`);
      }
      await fsImpl.rename(temporary, target);
      renamed = true;
      await fsImpl.chmod(target, FILE_MODE);
      await syncDirectory(path.dirname(target));
    } finally {
      await handle?.close();
      if (!renamed) {
        try {
          await fsImpl.unlink(temporary);
        } catch (error) {
          if (!isMissing(error)) {
            throw error;
          }
        }
      }
    }
  }

  async function atomicCreateJson(target, value) {
    await assertNotSymlink(target);
    const temporary = path.join(
      path.dirname(target),
      `.${path.basename(target)}.tmp-${process.pid}-${randomUUID()}`,
    );
    let handle;
    let published = false;
    try {
      handle = await fsImpl.open(
        temporary,
        fsConstants.O_WRONLY |
          fsConstants.O_CREAT |
          fsConstants.O_EXCL |
          NOFOLLOW,
        FILE_MODE,
      );
      await handle.writeFile(`${canonicalJson(value)}\n`, "utf8");
      await handle.chmod(FILE_MODE);
      await handle.sync();
      await handle.close();
      handle = null;

      await assertNotSymlink(target);
      try {
        await fsImpl.link(temporary, target);
      } catch (error) {
        if (error?.code === "EEXIST") {
          await assertNotSymlink(target);
          throw new Error(`State file already exists: ${target}`);
        }
        throw error;
      }
      published = true;
      await syncDirectory(path.dirname(target));
    } finally {
      await handle?.close();
      try {
        await fsImpl.unlink(temporary);
      } catch (error) {
        if (!isMissing(error)) {
          throw error;
        }
      }
    }

    if (!published) {
      throw new Error(`Failed to publish state file: ${target}`);
    }
  }

  async function readJson(target, { missing = null } = {}) {
    const stat = await assertNotSymlink(target);
    if (!stat) {
      return missing;
    }
    if (!stat.isFile()) {
      throw new Error(`State path is not a regular file: ${target}`);
    }

    const handle = await fsImpl.open(
      target,
      fsConstants.O_RDONLY | NOFOLLOW,
    );
    try {
      const openedStat = await handle.stat();
      if (!openedStat.isFile()) {
        throw new Error(`State path is not a regular file: ${target}`);
      }
      return JSON.parse(await handle.readFile("utf8"));
    } finally {
      await handle.close();
    }
  }

  function signingKeyError(message, code) {
    const error = new Error(`Receipt signing key ${message}`);
    error.code = code;
    return error;
  }

  async function readSigningKey() {
    const stat = await assertNotSymlink(signingKeyPath);
    if (!stat) {
      throw signingKeyError("is missing", "SIGNING_KEY_MISSING");
    }
    if (!stat.isFile()) {
      throw signingKeyError(
        "is not a regular file",
        "SIGNING_KEY_INVALID",
      );
    }
    if ((stat.mode & 0o777) !== FILE_MODE) {
      throw signingKeyError(
        "has unsafe permissions",
        "SIGNING_KEY_INVALID",
      );
    }

    const handle = await fsImpl.open(
      signingKeyPath,
      fsConstants.O_RDONLY | NOFOLLOW,
    );
    try {
      const openedStat = await handle.stat();
      if (
        !openedStat.isFile() ||
        openedStat.dev !== stat.dev ||
        openedStat.ino !== stat.ino ||
        (openedStat.mode & 0o777) !== FILE_MODE
      ) {
        throw signingKeyError(
          "changed during read",
          "SIGNING_KEY_INVALID",
        );
      }
      const text = await handle.readFile("utf8");
      if (!/^[a-f0-9]{64}\n$/.test(text)) {
        throw signingKeyError("is corrupted", "SIGNING_KEY_INVALID");
      }
      return Buffer.from(text.slice(0, -1), "hex");
    } finally {
      await handle.close();
    }
  }

  async function createSigningKey() {
    const key = randomBytes(SIGNING_KEY_BYTES);
    const temporary = path.join(
      root,
      `.receipt-signing.key.tmp-${process.pid}-${randomUUID()}`,
    );
    let handle;
    let published = false;
    try {
      handle = await fsImpl.open(
        temporary,
        fsConstants.O_WRONLY |
          fsConstants.O_CREAT |
          fsConstants.O_EXCL |
          NOFOLLOW,
        FILE_MODE,
      );
      await handle.writeFile(`${key.toString("hex")}\n`, "utf8");
      await handle.chmod(FILE_MODE);
      await handle.sync();
      await handle.close();
      handle = null;

      await assertNotSymlink(signingKeyPath);
      try {
        await fsImpl.link(temporary, signingKeyPath);
        published = true;
        await syncDirectory(root);
      } catch (error) {
        if (error?.code !== "EEXIST") {
          throw error;
        }
      }
    } finally {
      await handle?.close();
      try {
        await fsImpl.unlink(temporary);
      } catch (error) {
        if (!isMissing(error)) {
          throw error;
        }
      }
    }

    return published ? key : readSigningKey();
  }

  async function getOrCreateSigningKey() {
    try {
      return await readSigningKey();
    } catch (error) {
      if (error?.code !== "SIGNING_KEY_MISSING") {
        throw error;
      }
      return createSigningKey();
    }
  }

  function planPath(planId) {
    assertUuid(planId, "planId");
    return path.join(plansDir, `${planId}.json`);
  }

  function approvalPath(planId) {
    assertUuid(planId, "planId");
    return path.join(approvalsDir, `${planId}.json`);
  }

  function claimedApprovalPath(planId) {
    assertUuid(planId, "planId");
    return path.join(approvalsDir, `${planId}.claimed.json`);
  }

  function consumedApprovalPath(planId) {
    assertUuid(planId, "planId");
    return path.join(approvalsDir, `${planId}.consumed.json`);
  }

  function lifecycleLockPath(planId) {
    assertUuid(planId, "planId");
    return path.join(plansDir, `${planId}.lifecycle.lock`);
  }

  function receiptError(message) {
    const error = new Error(`Approval receipt ${message}`);
    error.code = "INVALID_APPROVAL_RECEIPT";
    return error;
  }

  function receiptSigningFields(receipt) {
    const fields = {
      plan_id: receipt.plan_id,
      plan_version: receipt.plan_version,
      plan_digest: receipt.plan_digest,
      approver: receipt.approver,
      approved_at: receipt.approved_at,
      expires_at: receipt.expires_at,
    };
    if (Object.hasOwn(receipt, "before_state_digest")) {
      fields.before_state_digest = receipt.before_state_digest;
    }
    return fields;
  }

  function signReceipt(receipt, signingKey) {
    return createHmac("sha256", signingKey)
      .update(canonicalJson(receiptSigningFields(receipt)), "utf8")
      .digest("hex");
  }

  async function verifyReceiptHmac(receipt) {
    if (
      typeof receipt.receipt_hmac !== "string" ||
      !/^[a-f0-9]{64}$/.test(receipt.receipt_hmac)
    ) {
      throw receiptError("HMAC integrity check failed");
    }

    const signingKey = await readSigningKey();
    const expected = Buffer.from(signReceipt(receipt, signingKey), "hex");
    const actual = Buffer.from(receipt.receipt_hmac, "hex");
    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      throw receiptError("HMAC integrity check failed");
    }
  }

  function parseReceiptTimestamp(value, label) {
    if (typeof value !== "string") {
      throw receiptError(`has invalid ${label}`);
    }
    const milliseconds = Date.parse(value);
    if (
      !Number.isFinite(milliseconds) ||
      new Date(milliseconds).toISOString() !== value
    ) {
      throw receiptError(`has invalid ${label}`);
    }
    return milliseconds;
  }

  function validateReceipt(receipt, plan, digest, nowMs) {
    if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
      throw receiptError("is malformed");
    }
    const planHasBeforeState = Object.hasOwn(
      plan.input,
      "before_state_digest",
    );
    const allowedFields = new Set([
      "plan_id",
      "plan_version",
      "plan_digest",
      "approver",
      "approved_at",
      "expires_at",
      "consumed_at",
      "receipt_hmac",
    ]);
    if (planHasBeforeState) {
      allowedFields.add("before_state_digest");
    }
    const unknownField = Object.keys(receipt).find(
      (field) => !allowedFields.has(field),
    );
    if (unknownField) {
      throw receiptError(`has unknown field: ${unknownField}`);
    }
    if (plan.status !== "approved") {
      throw receiptError("does not match an approved plan");
    }
    if (receipt.plan_id !== plan.plan_id) {
      throw receiptError("plan ID mismatch");
    }
    if (receipt.plan_version !== plan.plan_version) {
      throw receiptError("plan version mismatch");
    }
    if (
      digest !== plan.plan_digest ||
      receipt.plan_digest !== plan.plan_digest
    ) {
      throw receiptError("plan digest mismatch");
    }
    if (
      typeof receipt.approver !== "string" ||
      receipt.approver.trim() === ""
    ) {
      throw receiptError("has an invalid approver");
    }
    if (
      planHasBeforeState &&
      receipt.before_state_digest !== plan.input.before_state_digest
    ) {
      throw receiptError("before-state digest mismatch");
    }
    if (
      !planHasBeforeState &&
      Object.hasOwn(receipt, "before_state_digest")
    ) {
      throw receiptError("has an unexpected before-state digest");
    }
    if (receipt.consumed_at !== null) {
      throw new Error("Approval receipt was already consumed; replay rejected");
    }

    const approvedAtMs = parseReceiptTimestamp(
      receipt.approved_at,
      "approved_at",
    );
    const receiptExpiresAtMs = parseReceiptTimestamp(
      receipt.expires_at,
      "expires_at",
    );
    const planCreatedAtMs = Date.parse(plan.created_at);
    const planExpiresAtMs = Date.parse(plan.expires_at);
    if (
      !Number.isFinite(planCreatedAtMs) ||
      !Number.isFinite(planExpiresAtMs)
    ) {
      throw receiptError("cannot bind to invalid plan timestamps");
    }
    if (approvedAtMs < planCreatedAtMs || approvedAtMs > nowMs) {
      throw receiptError("has an invalid approval time");
    }
    if (
      receipt.expires_at !== plan.expires_at ||
      receiptExpiresAtMs !== planExpiresAtMs ||
      approvedAtMs >= receiptExpiresAtMs
    ) {
      throw receiptError("expiry does not match the plan");
    }

    return receipt;
  }

  async function rejectExistingClaim(planId) {
    if (
      (await readJson(consumedApprovalPath(planId))) ||
      (await readJson(claimedApprovalPath(planId)))
    ) {
      throw new Error("Approval receipt was already consumed; replay rejected");
    }
  }

  async function claimApproval(planId, beforeClaim) {
    const activePath = approvalPath(planId);
    const claimedPath = claimedApprovalPath(planId);
    await assertNotSymlink(activePath);
    await assertNotSymlink(claimedPath);
    const claimValue = beforeClaim();
    try {
      await fsImpl.rename(activePath, claimedPath);
      await syncDirectory(approvalsDir);
    } catch (error) {
      if (isMissing(error)) {
        await rejectExistingClaim(planId);
        throw new Error("Approval receipt is missing");
      }
      throw error;
    }
    return { claimedPath, claimValue };
  }

  function validatePlanIntegrity(plan, expectedPlanId) {
    try {
      if (plan.plan_id !== expectedPlanId) {
        throw new Error("Plan ID mismatch");
      }
      const digest = sha256Digest({
        plan_id: plan.plan_id,
        plan_version: plan.plan_version,
        created_at: plan.created_at,
        expires_at: plan.expires_at,
        input: plan.input,
      });
      if (digest !== plan.plan_digest) {
        throw new Error("Plan digest mismatch");
      }
    } catch {
      throw new Error("Plan integrity check failed: plan digest mismatch");
    }
    return plan;
  }

  async function requirePlan(planId) {
    const plan = await readJson(planPath(planId));
    if (!plan) {
      throw new Error(`Plan not found: ${planId}`);
    }
    return validatePlanIntegrity(plan, planId);
  }

  function parseLockOwner(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }
    if (
      Object.keys(value).sort().join(",") !==
      "created_at,pid,token"
    ) {
      return null;
    }
    if (!Number.isSafeInteger(value.pid) || value.pid <= 0) {
      return null;
    }
    if (
      typeof value.created_at !== "string" ||
      !Number.isFinite(Date.parse(value.created_at)) ||
      new Date(Date.parse(value.created_at)).toISOString() !==
        value.created_at
    ) {
      return null;
    }
    if (
      typeof value.token !== "string" ||
      !UUID_PATTERN.test(value.token)
    ) {
      return null;
    }
    return value;
  }

  async function readLockSnapshot(lockPath) {
    const stat = await assertNotSymlink(lockPath);
    if (!stat) {
      return null;
    }
    if (!stat.isFile()) {
      throw new Error(`Lock path is not a regular file: ${lockPath}`);
    }

    const handle = await fsImpl.open(
      lockPath,
      fsConstants.O_RDONLY | NOFOLLOW,
    );
    try {
      const openedStat = await handle.stat();
      if (
        !openedStat.isFile() ||
        openedStat.dev !== stat.dev ||
        openedStat.ino !== stat.ino
      ) {
        throw new Error(`Lock path changed during read: ${lockPath}`);
      }
      let owner = null;
      try {
        owner = parseLockOwner(
          JSON.parse(await handle.readFile("utf8")),
        );
      } catch {
        owner = null;
      }
      const current = await assertNotSymlink(lockPath);
      if (
        !current ||
        current.dev !== openedStat.dev ||
        current.ino !== openedStat.ino
      ) {
        return null;
      }
      return {
        dev: openedStat.dev,
        ino: openedStat.ino,
        mtimeMs: openedStat.mtimeMs,
        owner,
      };
    } finally {
      await handle.close();
    }
  }

  function lockSnapshotsMatch(left, right) {
    if (!left || !right) {
      return left === right;
    }
    if (left.dev !== right.dev || left.ino !== right.ino) {
      return false;
    }
    if (!left.owner || !right.owner) {
      return left.owner === right.owner;
    }
    return (
      left.owner.pid === right.owner.pid &&
      left.owner.created_at === right.owner.created_at &&
      left.owner.token === right.owner.token
    );
  }

  function processIsAlive(pid) {
    try {
      process.kill(pid, 0);
      return true;
    } catch (error) {
      if (error?.code === "ESRCH") {
        return false;
      }
      if (error?.code === "EPERM") {
        return true;
      }
      throw error;
    }
  }

  function lockIsRecoverable(snapshot, nowMs = Date.now()) {
    if (!snapshot) {
      return false;
    }
    if (snapshot.owner && !processIsAlive(snapshot.owner.pid)) {
      return true;
    }
    const createdAtMs = snapshot.owner
      ? Date.parse(snapshot.owner.created_at)
      : snapshot.mtimeMs;
    return (
      Number.isFinite(createdAtMs) &&
      nowMs - createdAtMs > LOCK_STALE_MS
    );
  }

  async function removeRecoverableLock(lockPath) {
    const first = await readLockSnapshot(lockPath);
    if (!lockIsRecoverable(first)) {
      return false;
    }
    const verified = await readLockSnapshot(lockPath);
    if (
      !lockSnapshotsMatch(first, verified) ||
      !lockIsRecoverable(verified)
    ) {
      return false;
    }
    const current = await assertNotSymlink(lockPath);
    if (
      !current ||
      current.dev !== verified.dev ||
      current.ino !== verified.ino
    ) {
      return false;
    }
    await fsImpl.unlink(lockPath);
    await syncDirectory(path.dirname(lockPath));
    return true;
  }

  async function createOwnedLock(lockPath) {
    const owner = {
      pid: process.pid,
      created_at: new Date().toISOString(),
      token: randomUUID(),
    };
    let handle;
    let openedStat;
    try {
      handle = await fsImpl.open(
        lockPath,
        fsConstants.O_WRONLY |
          fsConstants.O_CREAT |
          fsConstants.O_EXCL |
          NOFOLLOW,
        FILE_MODE,
      );
      openedStat = await handle.stat();
      await handle.writeFile(`${canonicalJson(owner)}\n`, "utf8");
      await handle.chmod(FILE_MODE);
      await handle.sync();
      await handle.close();
      handle = null;
      await syncDirectory(path.dirname(lockPath));
      return {
        path: lockPath,
        dev: openedStat.dev,
        ino: openedStat.ino,
        owner,
      };
    } catch (error) {
      await handle?.close();
      if (error?.code !== "EEXIST" && openedStat) {
        const current = await assertNotSymlink(lockPath);
        if (
          current?.dev === openedStat.dev &&
          current?.ino === openedStat.ino
        ) {
          await fsImpl.unlink(lockPath);
        }
      }
      throw error;
    }
  }

  async function acquireFileLock(lockPath, label) {
    for (let attempt = 0; attempt < LOCK_MAX_ATTEMPTS; attempt += 1) {
      await assertNotSymlink(lockPath);
      try {
        return await createOwnedLock(lockPath);
      } catch (error) {
        if (error?.code !== "EEXIST") {
          throw error;
        }
      }
      if (await removeRecoverableLock(lockPath)) {
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, LOCK_RETRY_MS));
    }
    throw new Error(`Timed out waiting for the ${label} lock`);
  }

  async function releaseFileLock(lock) {
    const snapshot = await readLockSnapshot(lock.path);
    if (
      !snapshot ||
      snapshot.dev !== lock.dev ||
      snapshot.ino !== lock.ino ||
      !snapshot.owner ||
      snapshot.owner.pid !== lock.owner.pid ||
      snapshot.owner.created_at !== lock.owner.created_at ||
      snapshot.owner.token !== lock.owner.token
    ) {
      return false;
    }
    const verified = await readLockSnapshot(lock.path);
    if (!lockSnapshotsMatch(snapshot, verified)) {
      return false;
    }
    const current = await assertNotSymlink(lock.path);
    if (
      !current ||
      current.dev !== verified.dev ||
      current.ino !== verified.ino
    ) {
      return false;
    }
    await fsImpl.unlink(lock.path);
    await syncDirectory(path.dirname(lock.path));
    return true;
  }

  async function withPlanLock(planId, operation) {
    const previous = locks.get(planId) ?? Promise.resolve();
    let releaseLocal;
    const gate = new Promise((resolve) => {
      releaseLocal = resolve;
    });
    const queued = previous.then(() => gate);
    locks.set(planId, queued);

    await previous;
    let lifecycleLock;
    try {
      await ensureStateDirectories();
      lifecycleLock = await acquireFileLock(
        lifecycleLockPath(planId),
        "plan lifecycle",
      );
      return await operation();
    } finally {
      if (lifecycleLock) {
        await releaseFileLock(lifecycleLock);
      }
      releaseLocal();
      if (locks.get(planId) === queued) {
        locks.delete(planId);
      }
    }
  }

  async function createPlan(planInput) {
    const input = canonicalClone(planInput);
    await ensureStateDirectories();

    const planId = randomUUIDImpl();
    assertUuid(planId, "Generated plan_id");
    const createdAtMs = clockNow(clock);
    const immutablePlan = {
      plan_id: planId,
      plan_version: 1,
      created_at: new Date(createdAtMs).toISOString(),
      expires_at: new Date(createdAtMs + PLAN_TTL_MS).toISOString(),
      input,
    };
    const plan = {
      ...immutablePlan,
      status: "pending",
      plan_digest: sha256Digest(immutablePlan),
    };

    await atomicWriteJson(planPath(planId), plan, { replace: false });
    return canonicalClone(plan);
  }

  async function getPlan(planId) {
    await ensureStateDirectories();
    const plan = await readJson(planPath(planId));
    return plan ? validatePlanIntegrity(plan, planId) : null;
  }

  async function approvePlan(planId, approver) {
    if (typeof approver !== "string" || approver.trim() === "") {
      throw new TypeError("approver must be a non-empty string");
    }

    return withPlanLock(planId, async () => {
      await ensureStateDirectories();
      const plan = await requirePlan(planId);
      if (plan.status === "discarded") {
        throw new Error("Cannot approve a discarded plan");
      }
      if (plan.status === "consumed") {
        throw new Error("Cannot approve a consumed plan");
      }
      if (plan.status === "approved") {
        throw new Error("Plan already has an approval receipt");
      }
      if (plan.status !== "pending") {
        throw new Error(`Cannot approve an ${plan.status} plan`);
      }
      if (
        (await readJson(approvalPath(planId))) ||
        (await readJson(claimedApprovalPath(planId))) ||
        (await readJson(consumedApprovalPath(planId)))
      ) {
        throw new Error("Plan already has an approval receipt");
      }

      const approvedAtMs = clockNow(clock);
      const createdAtMs = Date.parse(plan.created_at);
      const expiresAtMs = Date.parse(plan.expires_at);
      if (approvedAtMs < createdAtMs) {
        throw new Error("Plan approval is outside the plan validity window");
      }
      if (approvedAtMs >= expiresAtMs) {
        throw new Error("Plan approval has expired");
      }

      const unsignedReceipt = {
        plan_id: plan.plan_id,
        plan_version: plan.plan_version,
        plan_digest: plan.plan_digest,
        approver: approver.trim(),
        approved_at: new Date(approvedAtMs).toISOString(),
        expires_at: plan.expires_at,
        consumed_at: null,
      };
      if (Object.hasOwn(plan.input, "before_state_digest")) {
        unsignedReceipt.before_state_digest =
          plan.input.before_state_digest;
      }
      const signingKey = await getOrCreateSigningKey();
      const receipt = {
        ...unsignedReceipt,
        receipt_hmac: signReceipt(unsignedReceipt, signingKey),
      };
      const approvedPlan = {
        ...plan,
        status: "approved",
      };

      await atomicWriteJson(planPath(planId), approvedPlan);
      await atomicCreateJson(approvalPath(planId), receipt);
      return canonicalClone(receipt);
    });
  }

  async function consumeApproval(planId, digest, currentBeforeState) {
    return withPlanLock(planId, async () => {
      await ensureStateDirectories();
      const plan = await requirePlan(planId);
      if (plan.status === "discarded") {
        throw new Error("Cannot consume approval for a discarded plan");
      }
      if (plan.status === "consumed") {
        throw new Error(
          "Approval receipt was already consumed; replay rejected",
        );
      }

      await rejectExistingClaim(planId);
      const receipt = await readJson(approvalPath(planId));
      if (!receipt) {
        throw new Error("Approval receipt is missing");
      }

      const validationNowMs = clockNow(clock);
      validateReceipt(receipt, plan, digest, validationNowMs);
      await verifyReceiptHmac(receipt);
      if (
        validationNowMs >= Date.parse(plan.expires_at) ||
        validationNowMs >= Date.parse(receipt.expires_at)
      ) {
        throw new Error("Approval receipt has expired");
      }

      if (Object.hasOwn(plan.input, "before_state_digest")) {
        if (currentBeforeState === undefined) {
          throw new Error("Current before-state is required");
        }
        if (
          sha256Digest(currentBeforeState) !== plan.input.before_state_digest
        ) {
          throw new Error("Stale before-state digest");
        }
      }

      const { claimedPath, claimValue: consumedAtMs } =
        await claimApproval(planId, () => {
          const nowMs = clockNow(clock);
          validateReceipt(receipt, plan, digest, nowMs);
          if (
            nowMs >= Date.parse(plan.expires_at) ||
            nowMs >= Date.parse(receipt.expires_at)
          ) {
            throw new Error("Approval receipt has expired");
          }
          return nowMs;
        });
      const claimedReceipt = await readJson(claimedPath);
      validateReceipt(claimedReceipt, plan, digest, consumedAtMs);
      await verifyReceiptHmac(claimedReceipt);
      const consumedReceipt = {
        ...claimedReceipt,
        consumed_at: new Date(consumedAtMs).toISOString(),
      };
      await atomicWriteJson(claimedPath, consumedReceipt);

      const consumedPath = consumedApprovalPath(planId);
      const existingConsumed = await assertNotSymlink(consumedPath);
      if (existingConsumed) {
        throw new Error("Approval receipt was already consumed; replay rejected");
      }
      await fsImpl.rename(claimedPath, consumedPath);
      await syncDirectory(approvalsDir);

      const consumedPlan = {
        ...plan,
        status: "consumed",
      };
      await atomicWriteJson(planPath(planId), consumedPlan);
      return canonicalClone(consumedReceipt);
    });
  }

  async function discardPlan(planId) {
    return withPlanLock(planId, async () => {
      await ensureStateDirectories();
      const plan = await requirePlan(planId);
      if (plan.status === "consumed") {
        throw new Error("Cannot discard a consumed plan");
      }
      if (plan.status === "approved") {
        throw new Error("Cannot discard an approved plan");
      }
      if (plan.status !== "pending") {
        throw new Error(`Cannot discard a ${plan.status} plan`);
      }
      const discarded = {
        ...plan,
        status: "discarded",
      };
      await atomicWriteJson(planPath(planId), discarded);
      return canonicalClone(discarded);
    });
  }

  async function appendAudit(event) {
    canonicalJson(event);
    const redacted = redactSecrets(event);
    const line = `${canonicalJson(redacted)}\n`;
    await ensureStateDirectories();
    const auditLock = await acquireFileLock(
      auditLockPath,
      "audit append",
    );
    try {
      let existing = await assertNotSymlink(auditPath);
      if (existing && !existing.isFile()) {
        throw new Error(`State path is not a regular file: ${auditPath}`);
      }

      let handle;
      let created = false;
      try {
        if (!existing) {
          try {
            handle = await fsImpl.open(
              auditPath,
              fsConstants.O_WRONLY |
                fsConstants.O_CREAT |
                fsConstants.O_EXCL |
                fsConstants.O_APPEND |
                NOFOLLOW,
              FILE_MODE,
            );
            created = true;
          } catch (error) {
            if (error?.code !== "EEXIST") {
              throw error;
            }
            existing = await assertNotSymlink(auditPath);
          }
        }
        if (!handle) {
          handle = await fsImpl.open(
            auditPath,
            fsConstants.O_WRONLY |
              fsConstants.O_APPEND |
              NOFOLLOW,
            FILE_MODE,
          );
        }

        const openedStat = await handle.stat();
        if (
          !openedStat.isFile() ||
          (existing &&
            (openedStat.dev !== existing.dev ||
              openedStat.ino !== existing.ino))
        ) {
          throw new Error(`State path changed during open: ${auditPath}`);
        }
        await handle.chmod(FILE_MODE);
        await handle.writeFile(line, "utf8");
        await handle.sync();
      } finally {
        await handle?.close();
      }
      if (created) {
        await syncDirectory(auditDir);
      }
    } finally {
      await releaseFileLock(auditLock);
    }
  }

  return Object.freeze({
    createPlan,
    getPlan,
    approvePlan,
    consumeApproval,
    discardPlan,
    appendAudit,
  });
}
