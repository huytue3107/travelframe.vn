import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  canonicalJson,
  createPlanStore,
  sha256Digest,
} from "../../MCP/meta-ads/plan-store.mjs";
import { requestNativeApproval } from "../../MCP/meta-ads/approval.mjs";

const UUIDS = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
];

const APPROVAL_SCRIPT = [
  "on run argv",
  "  set dialogText to item 1 of argv",
  '  set dialogResult to display dialog dialogText with title "TravelFrame Meta Ads Approval" buttons {"Deny", "Approve"} default button "Deny" with icon caution',
  "  return button returned of dialogResult",
  "end run",
].join("\n");

class FakeClock {
  constructor(iso = "2026-09-17T02:00:00.000Z") {
    this.value = Date.parse(iso);
  }

  now() {
    return this.value;
  }

  advance(milliseconds) {
    this.value += milliseconds;
  }
}

class SequenceClock {
  constructor(values) {
    this.values = values.map((value) =>
      typeof value === "string" ? Date.parse(value) : value
    );
    this.index = 0;
  }

  now() {
    const value =
      this.values[Math.min(this.index, this.values.length - 1)];
    this.index += 1;
    return value;
  }
}

function uuidSequence(values = UUIDS) {
  let index = 0;
  return () => {
    const value = values[index];
    index += 1;
    return value;
  };
}

function samplePlan(overrides = {}) {
  return {
    action: "create_campaign",
    targets: ["act_123456789"],
    budget: {
      currency: "USD",
      daily: 25,
    },
    max_spend: 250,
    ...overrides,
  };
}

async function makeFixture(t, options = {}) {
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const root = await fs.mkdtemp(
    path.join(temporaryRoot, "meta-ads-plan-store-"),
  );
  t.after(async () => {
    await fs.rm(root, { force: true, recursive: true });
  });
  const stateDir = path.join(root, "state");
  const clock = options.clock ?? new FakeClock();
  const store = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: options.randomUUIDImpl ?? uuidSequence(),
    fsImpl: options.fsImpl,
  });

  return { root, stateDir, clock, store };
}

function modeBits(stat) {
  return stat.mode & 0o777;
}

function createReceiptReadBarrierFs(receiptPath) {
  let readCount = 0;
  let release;
  const bothRead = new Promise((resolve) => {
    release = resolve;
  });

  return {
    ...fs,
    async open(file, flags, mode) {
      const handle = await fs.open(file, flags, mode);
      if (
        String(file) !== receiptPath ||
        (flags & fsConstants.O_WRONLY) === fsConstants.O_WRONLY
      ) {
        return handle;
      }

      return new Proxy(handle, {
        get(target, property) {
          if (property === "readFile") {
            return async (...args) => {
              const value = await target.readFile(...args);
              readCount += 1;
              if (readCount === 2) {
                release();
              }
              await Promise.race([
                bothRead,
                new Promise((resolve) => setTimeout(resolve, 100)),
              ]);
              return value;
            };
          }
          const value = Reflect.get(target, property, target);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    },
  };
}

function createMissingPathBarrierFs(targetPath) {
  let missingCount = 0;
  let release;
  const bothMissing = new Promise((resolve) => {
    release = resolve;
  });

  return {
    ...fs,
    async lstat(target) {
      try {
        return await fs.lstat(target);
      } catch (error) {
        if (String(target) === targetPath && error?.code === "ENOENT") {
          missingCount += 1;
          if (missingCount === 2) {
            release();
          }
          await bothMissing;
        }
        throw error;
      }
    },
  };
}

function createPublishBarrierFs(targetPath) {
  let arrivals = 0;
  let release;
  const bothReady = new Promise((resolve) => {
    release = resolve;
  });

  async function waitForBoth(target) {
    if (String(target) !== targetPath) {
      return;
    }
    arrivals += 1;
    if (arrivals === 2) {
      release();
    }
    await Promise.race([
      bothReady,
      new Promise((resolve) => setTimeout(resolve, 100)),
    ]);
  }

  return {
    ...fs,
    async link(source, target) {
      await waitForBoth(target);
      return fs.link(source, target);
    },
    async rename(source, target) {
      await waitForBoth(target);
      return fs.rename(source, target);
    },
  };
}

function createSplitAuditWriteFs(auditPath) {
  let halfWriters = 0;
  let release;
  const secondWriterReady = new Promise((resolve) => {
    release = resolve;
  });

  return {
    ...fs,
    async open(file, flags, mode) {
      const handle = await fs.open(file, flags, mode);
      if (String(file) !== auditPath) {
        return handle;
      }

      return new Proxy(handle, {
        get(target, property) {
          if (property === "writeFile") {
            return async (data, encoding) => {
              const text = String(data);
              const midpoint = Math.floor(text.length / 2);
              await target.writeFile(text.slice(0, midpoint), encoding);
              halfWriters += 1;
              if (halfWriters === 2) {
                release();
              }
              await Promise.race([
                secondWriterReady,
                new Promise((resolve) => setTimeout(resolve, 100)),
              ]);
              await target.writeFile(text.slice(midpoint), encoding);
            };
          }
          const value = Reflect.get(target, property, target);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    },
  };
}

function createLockReplacementFs(auditPath, lockPath, replacement) {
  let replaced = false;

  return {
    ...fs,
    async open(file, flags, mode) {
      const handle = await fs.open(file, flags, mode);
      if (String(file) !== auditPath) {
        return handle;
      }

      return new Proxy(handle, {
        get(target, property) {
          if (property === "sync") {
            return async () => {
              await target.sync();
              if (!replaced) {
                replaced = true;
                const temporary = `${lockPath}.replacement`;
                await fs.writeFile(
                  temporary,
                  `${canonicalJson(replacement)}\n`,
                  { mode: 0o600 },
                );
                await fs.rename(temporary, lockPath);
              }
            };
          }
          const value = Reflect.get(target, property, target);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    },
  };
}

async function writeLock(lockPath, metadata) {
  await fs.mkdir(path.dirname(lockPath), {
    mode: 0o700,
    recursive: true,
  });
  await fs.writeFile(
    lockPath,
    `${canonicalJson(metadata)}\n`,
    { mode: 0o600 },
  );
  await fs.chmod(lockPath, 0o600);
}

function createDirectorySyncTrackingFs(directory) {
  let syncCount = 0;

  return {
    fsImpl: {
      ...fs,
      async open(file, flags, mode) {
        const handle = await fs.open(file, flags, mode);
        if (String(file) !== directory) {
          return handle;
        }

        return new Proxy(handle, {
          get(target, property) {
            if (property === "sync") {
              return async () => {
                syncCount += 1;
                return target.sync();
              };
            }
            const value = Reflect.get(target, property, target);
            return typeof value === "function" ? value.bind(target) : value;
          },
        });
      },
    },
    getSyncCount() {
      return syncCount;
    },
  };
}

test("canonicalJson sorts object keys recursively and preserves array order", () => {
  const value = {
    z: 3,
    a: {
      second: true,
      first: [
        { y: 2, x: 1 },
        "second",
        "first",
      ],
    },
    m: null,
  };

  assert.equal(
    canonicalJson(value),
    '{"a":{"first":[{"x":1,"y":2},"second","first"],"second":true},"m":null,"z":3}',
  );
});

test("sha256Digest is stable across insertion order and returns lowercase hex", () => {
  const first = {
    action: "pause",
    target: { id: "1201", type: "campaign" },
  };
  const second = {
    target: { type: "campaign", id: "1201" },
    action: "pause",
  };
  const expected = createHash("sha256")
    .update(canonicalJson(first), "utf8")
    .digest("hex");

  assert.equal(sha256Digest(first), expected);
  assert.equal(sha256Digest(second), expected);
  assert.match(expected, /^[a-f0-9]{64}$/);
});

test("canonicalJson rejects cycles and unsupported JSON values", () => {
  const circular = { id: "1201" };
  circular.self = circular;

  const customPrototype = Object.create({ inherited: true });
  customPrototype.id = "1201";

  const symbolKeyed = { id: "1201" };
  symbolKeyed[Symbol("secret")] = "hidden";

  const cases = [
    ["cycle", circular],
    ["BigInt", { value: 1n }],
    ["function", { value() {} }],
    ["symbol", { value: Symbol("value") }],
    ["undefined object value", { value: undefined }],
    ["undefined array value", [undefined]],
    ["NaN", { value: Number.NaN }],
    ["Infinity", { value: Number.POSITIVE_INFINITY }],
    ["Date", { value: new Date("2026-09-17T00:00:00.000Z") }],
    ["custom prototype", customPrototype],
    ["symbol key", symbolKeyed],
  ];

  for (const [label, value] of cases) {
    assert.throws(
      () => canonicalJson(value),
      /canonical|cycle|unsupported|plain|finite|undefined/i,
      label,
    );
  }
});

test("createPlan persists a ten-minute immutable-input plan and stable digest", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const input = samplePlan({
    nested: { z: 2, a: 1 },
  });

  const plan = await store.createPlan(input);

  assert.deepEqual(plan, {
    plan_id: UUIDS[0],
    plan_version: 1,
    created_at: "2026-09-17T02:00:00.000Z",
    expires_at: "2026-09-17T02:10:00.000Z",
    status: "pending",
    plan_digest: plan.plan_digest,
    input,
  });
  assert.equal(
    plan.plan_digest,
    sha256Digest({
      plan_id: plan.plan_id,
      plan_version: plan.plan_version,
      created_at: plan.created_at,
      expires_at: plan.expires_at,
      input,
    }),
  );

  input.nested.a = 999;
  const persisted = await store.getPlan(plan.plan_id);
  assert.equal(persisted.input.nested.a, 1);
  assert.equal(persisted.plan_digest, plan.plan_digest);

  const raw = await fs.readFile(
    path.join(stateDir, "plans", `${plan.plan_id}.json`),
    "utf8",
  );
  assert.equal(raw, `${canonicalJson(persisted)}\n`);
});

test("state directories and persisted files use private permissions", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");
  await store.appendAudit({ event: "plan_approved", plan_id: plan.plan_id });

  for (const directory of [
    stateDir,
    path.join(stateDir, "plans"),
    path.join(stateDir, "approvals"),
    path.join(stateDir, "audit"),
  ]) {
    assert.equal(modeBits(await fs.stat(directory)), 0o700, directory);
  }

  for (const file of [
    path.join(stateDir, "plans", `${plan.plan_id}.json`),
    path.join(stateDir, "approvals", `${plan.plan_id}.json`),
    path.join(stateDir, "audit", "events.jsonl"),
  ]) {
    assert.equal(modeBits(await fs.stat(file)), 0o600, file);
  }
});

test("plan writes publish through a temporary file and rename", async (t) => {
  const operations = [];
  const observedFs = {
    ...fs,
    async open(file, flags, mode) {
      operations.push({ type: "open", file: String(file), flags, mode });
      return fs.open(file, flags, mode);
    },
    async rename(from, to) {
      operations.push({ type: "rename", from: String(from), to: String(to) });
      await assert.rejects(() => fs.access(to), /ENOENT/);
      const temporary = await fs.readFile(from, "utf8");
      assert.doesNotThrow(() => JSON.parse(temporary));
      return fs.rename(from, to);
    },
  };
  const { stateDir, store } = await makeFixture(t, { fsImpl: observedFs });

  const plan = await store.createPlan(samplePlan());
  const finalPath = path.join(stateDir, "plans", `${plan.plan_id}.json`);
  const rename = operations.find(
    (operation) => operation.type === "rename" && operation.to === finalPath,
  );

  assert.ok(rename);
  assert.match(rename.from, /\.tmp-/);
  assert.equal(
    operations.some(
      (operation) => operation.type === "open" && operation.file === finalPath,
    ),
    false,
  );
});

test("failed atomic rename leaves no final or temporary plan file", async (t) => {
  const failingFs = {
    ...fs,
    async rename(from, to) {
      if (String(to).includes(`${path.sep}plans${path.sep}`)) {
        const error = new Error("simulated rename failure");
        error.code = "EIO";
        throw error;
      }
      return fs.rename(from, to);
    },
  };
  const { stateDir, store } = await makeFixture(t, { fsImpl: failingFs });

  await assert.rejects(
    () => store.createPlan(samplePlan()),
    /simulated rename failure/,
  );

  const plansDir = path.join(stateDir, "plans");
  assert.deepEqual(await fs.readdir(plansDir), []);
});

test("approvePlan records a receipt bound to plan identity and expiry", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());

  const receipt = await store.approvePlan(
    plan.plan_id,
    "rocky@example.test",
  );

  assert.deepEqual(receipt, {
    plan_id: plan.plan_id,
    plan_version: 1,
    plan_digest: plan.plan_digest,
    approver: "rocky@example.test",
    approved_at: "2026-09-17T02:00:00.000Z",
    expires_at: plan.expires_at,
    consumed_at: null,
    receipt_hmac: receipt.receipt_hmac,
  });
  assert.match(receipt.receipt_hmac, /^[a-f0-9]{64}$/);
  assert.equal((await store.getPlan(plan.plan_id)).status, "approved");

  const persisted = JSON.parse(
    await fs.readFile(
      path.join(stateDir, "approvals", `${plan.plan_id}.json`),
      "utf8",
    ),
  );
  assert.deepEqual(persisted, receipt);
});

test("approval signing key is private and independent of plan inputs", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(
    samplePlan({
      access_token: "must-not-be-used-as-signing-key",
    }),
  );

  await store.approvePlan(plan.plan_id, "rocky@example.test");

  const keyPath = path.join(stateDir, "receipt-signing.key");
  const keyStat = await fs.stat(keyPath);
  const keyText = await fs.readFile(keyPath, "utf8");
  assert.equal(modeBits(keyStat), 0o600);
  assert.match(keyText, /^[a-f0-9]{64}\n$/);
  assert.doesNotMatch(keyText, /must-not-be-used-as-signing-key/);
});

test("concurrent stores initialize one signing key and produce verifiable receipts", async (t) => {
  const { stateDir, clock, store } = await makeFixture(t);
  const firstPlan = await store.createPlan(samplePlan({ sequence: 1 }));
  const secondPlan = await store.createPlan(samplePlan({ sequence: 2 }));
  const keyPath = path.join(stateDir, "receipt-signing.key");
  const barrierFs = createMissingPathBarrierFs(keyPath);
  const firstStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[2]]),
    fsImpl: barrierFs,
  });
  const secondStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[3]]),
    fsImpl: barrierFs,
  });

  const [firstReceipt, secondReceipt] = await Promise.all([
    firstStore.approvePlan(firstPlan.plan_id, "first@example.test"),
    secondStore.approvePlan(secondPlan.plan_id, "second@example.test"),
  ]);

  assert.match(firstReceipt.receipt_hmac, /^[a-f0-9]{64}$/);
  assert.match(secondReceipt.receipt_hmac, /^[a-f0-9]{64}$/);
  assert.notEqual(firstReceipt.receipt_hmac, secondReceipt.receipt_hmac);
  assert.match(await fs.readFile(keyPath, "utf8"), /^[a-f0-9]{64}\n$/);
  assert.deepEqual(
    (await fs.readdir(stateDir)).filter((name) =>
      name.startsWith(".receipt-signing.key.tmp-")
    ),
    [],
  );

  await firstStore.consumeApproval(
    firstPlan.plan_id,
    firstPlan.plan_digest,
  );
  await secondStore.consumeApproval(
    secondPlan.plan_id,
    secondPlan.plan_digest,
  );
});

test("separate stores cannot both publish approval receipts", async (t) => {
  const { stateDir, clock, store } = await makeFixture(t);
  const seedPlan = await store.createPlan(samplePlan({ seed: true }));
  await store.approvePlan(seedPlan.plan_id, "seed@example.test");
  const plan = await store.createPlan(samplePlan({ seed: false }));
  const receiptPath = path.join(
    stateDir,
    "approvals",
    `${plan.plan_id}.json`,
  );
  const barrierFs = createPublishBarrierFs(receiptPath);
  const firstStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[2]]),
    fsImpl: barrierFs,
  });
  const secondStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[3]]),
    fsImpl: barrierFs,
  });

  const results = await Promise.allSettled([
    firstStore.approvePlan(plan.plan_id, "first@example.test"),
    secondStore.approvePlan(plan.plan_id, "second@example.test"),
  ]);

  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );
  assert.equal(
    results.filter((result) => result.status === "rejected").length,
    1,
  );
  assert.match(
    results.find((result) => result.status === "rejected").reason.message,
    /already.*approval|exists/i,
  );
  const persisted = JSON.parse(await fs.readFile(receiptPath, "utf8"));
  assert.equal(
    persisted.approver,
    results.find((result) => result.status === "fulfilled").value.approver,
  );
});

test("separate stores serialize approve and discard transitions", async (t) => {
  const { stateDir, clock, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  const planPath = path.join(
    stateDir,
    "plans",
    `${plan.plan_id}.json`,
  );
  const receiptPath = path.join(
    stateDir,
    "approvals",
    `${plan.plan_id}.json`,
  );
  const barrierFs = createReceiptReadBarrierFs(planPath);
  const approvingStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[1]]),
    fsImpl: barrierFs,
  });
  const discardingStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[2]]),
    fsImpl: barrierFs,
  });

  const results = await Promise.allSettled([
    approvingStore.approvePlan(plan.plan_id, "rocky@example.test"),
    discardingStore.discardPlan(plan.plan_id),
  ]);

  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );
  assert.equal(
    results.filter((result) => result.status === "rejected").length,
    1,
  );
  const persisted = JSON.parse(await fs.readFile(planPath, "utf8"));
  assert.ok(["approved", "discarded"].includes(persisted.status));
  if (persisted.status === "discarded") {
    await assert.rejects(() => fs.access(receiptPath), /ENOENT/);
  } else {
    await fs.access(receiptPath);
  }
});

test("approvePlan recovers an orphaned lifecycle lock", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  const lockPath = path.join(
    stateDir,
    "plans",
    `${plan.plan_id}.lifecycle.lock`,
  );
  await writeLock(lockPath, {
    pid: 999999999,
    created_at: new Date().toISOString(),
    token: UUIDS[1],
  });

  const receipt = await store.approvePlan(
    plan.plan_id,
    "rocky@example.test",
  );

  assert.equal(receipt.plan_id, plan.plan_id);
  await assert.rejects(() => fs.access(lockPath), /ENOENT/);
});

test("expired plans cannot be approved or consumed", async (t) => {
  const first = await makeFixture(t, {
    randomUUIDImpl: uuidSequence([UUIDS[0]]),
  });
  const expiredBeforeApproval = await first.store.createPlan(samplePlan());
  first.clock.advance(10 * 60 * 1000);

  await assert.rejects(
    () =>
      first.store.approvePlan(
        expiredBeforeApproval.plan_id,
        "rocky@example.test",
      ),
    /expired/i,
  );

  const second = await makeFixture(t, {
    randomUUIDImpl: uuidSequence([UUIDS[1]]),
  });
  const expiredAfterApproval = await second.store.createPlan(samplePlan());
  await second.store.approvePlan(
    expiredAfterApproval.plan_id,
    "rocky@example.test",
  );
  second.clock.advance(10 * 60 * 1000);

  await assert.rejects(
    () =>
      second.store.consumeApproval(
        expiredAfterApproval.plan_id,
        expiredAfterApproval.plan_digest,
      ),
    /expired/i,
  );
});

test("approvePlan rejects a clock rollback before plan creation", async (t) => {
  const { clock, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  clock.value -= 1;

  await assert.rejects(
    () => store.approvePlan(plan.plan_id, "rocky@example.test"),
    /before.*creation|validity window/i,
  );
});

test("consumeApproval marks a receipt consumed before resolving and rejects replay", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");

  const consumed = await store.consumeApproval(
    plan.plan_id,
    plan.plan_digest,
  );

  assert.equal(consumed.consumed_at, "2026-09-17T02:00:00.000Z");
  const persisted = JSON.parse(
    await fs.readFile(
      path.join(
        stateDir,
        "approvals",
        `${plan.plan_id}.consumed.json`,
      ),
      "utf8",
    ),
  );
  assert.equal(persisted.consumed_at, consumed.consumed_at);
  assert.equal((await store.getPlan(plan.plan_id)).status, "consumed");

  await assert.rejects(
    () => store.consumeApproval(plan.plan_id, plan.plan_digest),
    /consumed|replay/i,
  );
});

test("concurrent consumption allows only one caller", async (t) => {
  const { store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");

  const results = await Promise.allSettled([
    store.consumeApproval(plan.plan_id, plan.plan_digest),
    store.consumeApproval(plan.plan_id, plan.plan_digest),
  ]);

  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );
  assert.equal(
    results.filter((result) => result.status === "rejected").length,
    1,
  );
  assert.match(
    results.find((result) => result.status === "rejected").reason.message,
    /consumed|replay/i,
  );
});

test("separate plan-store instances cannot both consume one approval", async (t) => {
  const { stateDir, clock, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");
  const receiptPath = path.join(
    stateDir,
    "approvals",
    `${plan.plan_id}.json`,
  );
  const barrierFs = createReceiptReadBarrierFs(receiptPath);
  const firstStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[1]]),
    fsImpl: barrierFs,
  });
  const secondStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[2]]),
    fsImpl: barrierFs,
  });

  const results = await Promise.allSettled([
    firstStore.consumeApproval(plan.plan_id, plan.plan_digest),
    secondStore.consumeApproval(plan.plan_id, plan.plan_digest),
  ]);

  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );
  assert.equal(
    results.filter((result) => result.status === "rejected").length,
    1,
  );
  assert.match(
    results.find((result) => result.status === "rejected").reason.message,
    /already consumed|replay/i,
  );
  await fs.access(
    path.join(
      stateDir,
      "approvals",
      `${plan.plan_id}.consumed.json`,
    ),
  );
  await assert.rejects(() => fs.access(receiptPath), /ENOENT/);
});

test("consumeApproval rechecks expiry immediately before claiming", async (t) => {
  const clock = new SequenceClock([
    "2026-09-17T02:00:00.000Z",
    "2026-09-17T02:00:00.000Z",
    "2026-09-17T02:09:59.999Z",
    "2026-09-17T02:10:00.000Z",
  ]);
  const { stateDir, store } = await makeFixture(t, { clock });
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");

  await assert.rejects(
    () => store.consumeApproval(plan.plan_id, plan.plan_digest),
    /expired/i,
  );
  await fs.access(
    path.join(stateDir, "approvals", `${plan.plan_id}.json`),
  );
  await assert.rejects(
    () =>
      fs.access(
        path.join(
          stateDir,
          "approvals",
          `${plan.plan_id}.claimed.json`,
        ),
      ),
    /ENOENT/,
  );
});

test("consumeApproval rejects missing receipts and digest mismatches", async (t) => {
  const { store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());

  await assert.rejects(
    () => store.consumeApproval(plan.plan_id, plan.plan_digest),
    /approval.*missing|missing.*approval/i,
  );

  await store.approvePlan(plan.plan_id, "rocky@example.test");
  await assert.rejects(
    () => store.consumeApproval(plan.plan_id, "0".repeat(64)),
    /digest/i,
  );
});

test("consumeApproval rejects receipt version mismatches", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");
  const receiptPath = path.join(
    stateDir,
    "approvals",
    `${plan.plan_id}.json`,
  );
  const receipt = JSON.parse(await fs.readFile(receiptPath, "utf8"));
  receipt.plan_version = 2;
  await fs.writeFile(receiptPath, `${JSON.stringify(receipt)}\n`, {
    mode: 0o600,
  });

  await assert.rejects(
    () => store.consumeApproval(plan.plan_id, plan.plan_digest),
    /version/i,
  );
});

test("consumeApproval rejects malformed or tampered receipt bindings", async (t) => {
  const cases = [
    ["plan ID", (receipt) => {
      receipt.plan_id = UUIDS[1];
    }],
    ["plan version", (receipt) => {
      receipt.plan_version = 2;
    }],
    ["plan digest", (receipt) => {
      receipt.plan_digest = "0".repeat(64);
    }],
    ["approver", (receipt) => {
      receipt.approver = "   ";
    }],
    ["invalid approval time", (receipt) => {
      receipt.approved_at = "not-a-date";
    }],
    ["future approval time", (receipt) => {
      receipt.approved_at = "2026-09-17T02:01:00.000Z";
    }],
    ["approval before plan creation", (receipt) => {
      receipt.approved_at = "2026-09-17T01:59:59.999Z";
    }],
    ["extended expiry", (receipt) => {
      receipt.expires_at = "2026-09-17T02:11:00.000Z";
    }],
    ["shortened expiry", (receipt) => {
      receipt.expires_at = "2026-09-17T02:09:00.000Z";
    }],
  ];

  for (const [label, tamper] of cases) {
    await t.test(label, async (subtest) => {
      const { stateDir, store } = await makeFixture(subtest);
      const plan = await store.createPlan(samplePlan());
      await store.approvePlan(plan.plan_id, "rocky@example.test");
      const receiptPath = path.join(
        stateDir,
        "approvals",
        `${plan.plan_id}.json`,
      );
      const receipt = JSON.parse(await fs.readFile(receiptPath, "utf8"));
      tamper(receipt);
      await fs.writeFile(receiptPath, `${JSON.stringify(receipt)}\n`, {
        mode: 0o600,
      });

      await assert.rejects(
        () => store.consumeApproval(plan.plan_id, plan.plan_digest),
        /receipt/i,
      );
    });
  }
});

test("receipt HMAC rejects plausible approver and approval-time substitutions", async (t) => {
  const cases = [
    ["approver", (receipt) => {
      receipt.approver = "substitute@example.test";
    }],
    ["approved_at", (receipt) => {
      receipt.approved_at = "2026-09-17T02:00:30.000Z";
    }],
  ];

  for (const [label, tamper] of cases) {
    await t.test(label, async (subtest) => {
      const { stateDir, clock, store } = await makeFixture(subtest);
      const plan = await store.createPlan(samplePlan());
      clock.advance(60 * 1000);
      await store.approvePlan(plan.plan_id, "rocky@example.test");
      const receiptPath = path.join(
        stateDir,
        "approvals",
        `${plan.plan_id}.json`,
      );
      const receipt = JSON.parse(await fs.readFile(receiptPath, "utf8"));
      tamper(receipt);
      await fs.writeFile(receiptPath, `${JSON.stringify(receipt)}\n`, {
        mode: 0o600,
      });

      await assert.rejects(
        () => store.consumeApproval(plan.plan_id, plan.plan_digest),
        /receipt.*(HMAC|signature|integrity)/i,
      );
      await fs.access(receiptPath);
      await assert.rejects(
        () =>
          fs.access(
            path.join(
              stateDir,
              "approvals",
              `${plan.plan_id}.claimed.json`,
            ),
          ),
        /ENOENT/,
      );
    });
  }
});

test("receipt schema rejects unsigned unknown fields before claiming", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");
  const receiptPath = path.join(
    stateDir,
    "approvals",
    `${plan.plan_id}.json`,
  );
  const receipt = JSON.parse(await fs.readFile(receiptPath, "utf8"));
  receipt.approval_scope = "all_accounts";
  await fs.writeFile(receiptPath, `${JSON.stringify(receipt)}\n`, {
    mode: 0o600,
  });

  await assert.rejects(
    () => store.consumeApproval(plan.plan_id, plan.plan_digest),
    /receipt.*unknown field/i,
  );
  await fs.access(receiptPath);
});

test("consumeApproval fails closed for missing, corrupted, or symlinked signing keys", async (t) => {
  const cases = [
    ["missing", async (keyPath) => {
      await fs.unlink(keyPath);
    }],
    ["corrupted", async (keyPath) => {
      await fs.writeFile(keyPath, "not-a-valid-signing-key\n", {
        mode: 0o600,
      });
    }],
    ["symlinked", async (keyPath, root) => {
      const outsideKey = path.join(root, "outside-signing.key");
      await fs.writeFile(outsideKey, `${"a".repeat(64)}\n`, {
        mode: 0o600,
      });
      await fs.unlink(keyPath);
      await fs.symlink(outsideKey, keyPath);
    }],
  ];

  for (const [label, mutateKey] of cases) {
    await t.test(label, async (subtest) => {
      const { root, stateDir, store } = await makeFixture(subtest);
      const plan = await store.createPlan(samplePlan());
      await store.approvePlan(plan.plan_id, "rocky@example.test");
      const keyPath = path.join(stateDir, "receipt-signing.key");
      const receiptPath = path.join(
        stateDir,
        "approvals",
        `${plan.plan_id}.json`,
      );
      await mutateKey(keyPath, root);

      await assert.rejects(
        () => store.consumeApproval(plan.plan_id, plan.plan_digest),
        /signing key|symlink/i,
      );
      await fs.access(receiptPath);
      await assert.rejects(
        () =>
          fs.access(
            path.join(
              stateDir,
              "approvals",
              `${plan.plan_id}.claimed.json`,
            ),
          ),
        /ENOENT/,
      );
    });
  }
});

test("consumeApproval rejects a plan whose immutable input was tampered", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");
  const planPath = path.join(stateDir, "plans", `${plan.plan_id}.json`);
  const persisted = JSON.parse(await fs.readFile(planPath, "utf8"));
  persisted.input.max_spend = 999999;
  await fs.writeFile(planPath, `${JSON.stringify(persisted)}\n`, {
    mode: 0o600,
  });

  await assert.rejects(
    () => store.consumeApproval(plan.plan_id, plan.plan_digest),
    /plan digest|integrity/i,
  );
});

test("consumeApproval enforces a plan before_state_digest without consuming on mismatch", async (t) => {
  const { store } = await makeFixture(t);
  const beforeState = {
    campaign: {
      id: "1201",
      status: "PAUSED",
      daily_budget: 2500,
    },
  };
  const plan = await store.createPlan(
    samplePlan({
      before_state_digest: sha256Digest(beforeState),
    }),
  );
  await store.approvePlan(plan.plan_id, "rocky@example.test");

  await assert.rejects(
    () =>
      store.consumeApproval(plan.plan_id, plan.plan_digest, {
        campaign: {
          id: "1201",
          status: "ACTIVE",
          daily_budget: 2500,
        },
      }),
    /stale|before.state/i,
  );

  const consumed = await store.consumeApproval(
    plan.plan_id,
    plan.plan_digest,
    beforeState,
  );
  assert.ok(consumed.consumed_at);
});

test("discardPlan only transitions a pending plan", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());

  const discarded = await store.discardPlan(plan.plan_id);

  assert.equal(discarded.status, "discarded");
  assert.equal(discarded.plan_digest, plan.plan_digest);
  await assert.rejects(
    () => store.approvePlan(plan.plan_id, "rocky@example.test"),
    /discarded/i,
  );
  await assert.rejects(
    () =>
      fs.access(
        path.join(
          stateDir,
          "approvals",
          `${plan.plan_id}.json`,
        ),
      ),
    /ENOENT/,
  );
});

test("discardPlan rejects an approved plan and preserves its receipt", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const plan = await store.createPlan(samplePlan());
  await store.approvePlan(plan.plan_id, "rocky@example.test");

  await assert.rejects(
    () => store.discardPlan(plan.plan_id),
    /approved/i,
  );
  assert.equal((await store.getPlan(plan.plan_id)).status, "approved");
  await fs.access(
    path.join(
      stateDir,
      "approvals",
      `${plan.plan_id}.json`,
    ),
  );
});

test("appendAudit writes canonical redacted JSONL and appends events", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const firstEvent = {
    z: "last",
    event: "meta_request_failed",
    access_token: "audit-token",
    details: {
      message: [
        "Request failed with Bearer bearer-token",
        "Cookie: cookie-secret",
        "Set-Cookie: set-cookie-secret",
        "databasePassword: password-secret",
        "signing_passphrase: passphrase-secret",
        "tls_private_key: private-key-secret",
        "aws-secret-key: secret-key-secret",
        "Proxy-Authorization: Basic authorization-secret",
      ].join("\n"),
      note:
        "Password policy: rotate quarterly; cookie count: 4; " +
        "private key rotation: 30 days",
      campaign_id: "1201",
    },
  };

  await store.appendAudit(firstEvent);
  await store.appendAudit({ event: "plan_consumed", plan_id: UUIDS[0] });

  const auditPath = path.join(stateDir, "audit", "events.jsonl");
  const raw = await fs.readFile(auditPath, "utf8");
  const lines = raw.trimEnd().split("\n");

  assert.equal(lines.length, 2);
  assert.equal(
    lines[0],
    canonicalJson({
      access_token: "[REDACTED]",
      details: {
        campaign_id: "1201",
        message: [
          "Request failed with Bearer [REDACTED]",
          "Cookie: [REDACTED]",
          "Set-Cookie: [REDACTED]",
          "databasePassword: [REDACTED]",
          "signing_passphrase: [REDACTED]",
          "tls_private_key: [REDACTED]",
          "aws-secret-key: [REDACTED]",
          "Proxy-Authorization: [REDACTED]",
        ].join("\n"),
        note:
          "Password policy: rotate quarterly; cookie count: 4; " +
          "private key rotation: 30 days",
      },
      event: "meta_request_failed",
      z: "last",
    }),
  );
  assert.doesNotMatch(
    raw,
    /audit-token|bearer-token|cookie-secret|password-secret|private-key-secret|secret-key-secret|authorization-secret/,
  );
  assert.deepEqual(JSON.parse(lines[1]), {
    event: "plan_consumed",
    plan_id: UUIDS[0],
  });
});

test("appendAudit serializes concurrent large records across stores", async (t) => {
  const { stateDir, clock } = await makeFixture(t);
  const auditPath = path.join(stateDir, "audit", "events.jsonl");
  const splitFs = createSplitAuditWriteFs(auditPath);
  const firstStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[0]]),
    fsImpl: splitFs,
  });
  const secondStore = createPlanStore({
    stateDir,
    clock,
    randomUUIDImpl: uuidSequence([UUIDS[1]]),
    fsImpl: splitFs,
  });
  const size = 128 * 1024;

  await Promise.all([
    firstStore.appendAudit({
      event: "large_audit",
      source: "first",
      payload: "A".repeat(size),
    }),
    secondStore.appendAudit({
      event: "large_audit",
      source: "second",
      payload: "B".repeat(size),
    }),
  ]);

  const lines = (await fs.readFile(auditPath, "utf8")).trimEnd().split("\n");
  assert.equal(lines.length, 2);
  const events = lines.map((line) => JSON.parse(line));
  events.sort((left, right) => left.source.localeCompare(right.source));
  assert.equal(events[0].source, "first");
  assert.equal(events[0].payload.length, size);
  assert.equal(
    createHash("sha256").update(events[0].payload).digest("hex"),
    createHash("sha256").update("A".repeat(size)).digest("hex"),
  );
  assert.equal(events[1].source, "second");
  assert.equal(events[1].payload.length, size);
  assert.equal(
    createHash("sha256").update(events[1].payload).digest("hex"),
    createHash("sha256").update("B".repeat(size)).digest("hex"),
  );
});

test("appendAudit recovers a lock owned by a dead process", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const lockPath = path.join(stateDir, "audit", "events.lock");
  await writeLock(lockPath, {
    pid: 999999999,
    created_at: new Date().toISOString(),
    token: UUIDS[0],
  });

  await store.appendAudit({ event: "orphan_recovered" });

  await assert.rejects(() => fs.access(lockPath), /ENOENT/);
  assert.match(
    await fs.readFile(
      path.join(stateDir, "audit", "events.jsonl"),
      "utf8",
    ),
    /orphan_recovered/,
  );
});

test("appendAudit recovers a conservatively stale live-owner lock", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const lockPath = path.join(stateDir, "audit", "events.lock");
  await writeLock(lockPath, {
    pid: process.pid,
    created_at: new Date(
      Date.now() - 5 * 60 * 1000 - 1,
    ).toISOString(),
    token: UUIDS[0],
  });

  await store.appendAudit({ event: "stale_lock_recovered" });

  await assert.rejects(() => fs.access(lockPath), /ENOENT/);
});

test("appendAudit times out without deleting a live owner lock", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const lockPath = path.join(stateDir, "audit", "events.lock");
  const owner = {
    pid: process.pid,
    created_at: new Date().toISOString(),
    token: UUIDS[0],
  };
  await writeLock(lockPath, owner);

  await assert.rejects(
    () => store.appendAudit({ event: "must_wait" }),
    /timed out.*audit|audit.*timed out/i,
  );
  assert.deepEqual(
    JSON.parse(await fs.readFile(lockPath, "utf8")),
    owner,
  );
  await assert.rejects(
    () =>
      fs.access(
        path.join(stateDir, "audit", "events.jsonl"),
      ),
    /ENOENT/,
  );
});

test("appendAudit does not delete another owner's replacement lock", async (t) => {
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const root = await fs.mkdtemp(
    path.join(temporaryRoot, "meta-ads-lock-replacement-"),
  );
  t.after(async () => {
    await fs.rm(root, { force: true, recursive: true });
  });
  const stateDir = path.join(root, "state");
  const auditPath = path.join(stateDir, "audit", "events.jsonl");
  const lockPath = path.join(stateDir, "audit", "events.lock");
  const replacement = {
    pid: process.pid,
    created_at: new Date().toISOString(),
    token: UUIDS[3],
  };
  const store = createPlanStore({
    stateDir,
    clock: new FakeClock(),
    randomUUIDImpl: uuidSequence(),
    fsImpl: createLockReplacementFs(
      auditPath,
      lockPath,
      replacement,
    ),
  });

  await store.appendAudit({ event: "replacement_race" });

  assert.deepEqual(
    JSON.parse(await fs.readFile(lockPath, "utf8")),
    replacement,
  );
});

test("appendAudit fsyncs the audit directory when creating the log", async (t) => {
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const root = await fs.mkdtemp(
    path.join(temporaryRoot, "meta-ads-audit-sync-"),
  );
  t.after(async () => {
    await fs.rm(root, { force: true, recursive: true });
  });
  const stateDir = path.join(root, "state");
  const auditDir = path.join(stateDir, "audit");
  const tracking = createDirectorySyncTrackingFs(auditDir);
  const store = createPlanStore({
    stateDir,
    clock: new FakeClock(),
    randomUUIDImpl: uuidSequence(),
    fsImpl: tracking.fsImpl,
  });

  await store.appendAudit({ event: "first_event" });

  assert.ok(tracking.getSyncCount() >= 1);
});

test("appendAudit rejects events that are not JSON-safe", async (t) => {
  const { stateDir, store } = await makeFixture(t);
  const circular = { event: "bad" };
  circular.self = circular;

  await assert.rejects(() => store.appendAudit(circular), /cycle/i);
  await assert.rejects(
    () => store.appendAudit({ event: "bad", value: 1n }),
    /unsupported|BigInt/i,
  );

  await assert.rejects(
    () => fs.access(path.join(stateDir, "audit", "events.jsonl")),
    /ENOENT/,
  );
});

test("state and persisted paths fail closed when they are symlinks", async (t) => {
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const root = await fs.mkdtemp(
    path.join(temporaryRoot, "meta-ads-symlink-"),
  );
  t.after(async () => {
    await fs.rm(root, { force: true, recursive: true });
  });
  const realState = path.join(root, "real-state");
  const linkedState = path.join(root, "linked-state");
  await fs.mkdir(realState);
  await fs.symlink(realState, linkedState);
  const linkedStore = createPlanStore({
    stateDir: linkedState,
    clock: new FakeClock(),
    randomUUIDImpl: uuidSequence(),
  });

  await assert.rejects(
    () => linkedStore.createPlan(samplePlan()),
    /symlink/i,
  );

  const stateDir = path.join(root, "state");
  const store = createPlanStore({
    stateDir,
    clock: new FakeClock(),
    randomUUIDImpl: uuidSequence(),
  });
  await store.createPlan(samplePlan());

  const target = path.join(root, "outside.json");
  await fs.writeFile(target, "{}\n");
  const nextPlanPath = path.join(stateDir, "plans", `${UUIDS[1]}.json`);
  await fs.symlink(target, nextPlanPath);
  await assert.rejects(() => store.createPlan(samplePlan()), /symlink/i);

  const auditPath = path.join(stateDir, "audit", "events.jsonl");
  await fs.symlink(target, auditPath);
  await assert.rejects(
    () => store.appendAudit({ event: "must_not_write" }),
    /symlink/i,
  );
  assert.equal(await fs.readFile(target, "utf8"), "{}\n");
});

test("state paths fail closed when an existing parent component is a symlink", async (t) => {
  const temporaryRoot = await fs.realpath(os.tmpdir());
  const root = await fs.mkdtemp(
    path.join(temporaryRoot, "meta-ads-parent-symlink-"),
  );
  t.after(async () => {
    await fs.rm(root, { force: true, recursive: true });
  });
  const realParent = path.join(root, "real-parent");
  const linkedParent = path.join(root, "linked-parent");
  await fs.mkdir(realParent);
  await fs.symlink(realParent, linkedParent);
  const store = createPlanStore({
    stateDir: path.join(linkedParent, "state"),
    clock: new FakeClock(),
    randomUUIDImpl: uuidSequence(),
  });

  await assert.rejects(() => store.createPlan(samplePlan()), /symlink/i);
  await assert.rejects(
    () => fs.access(path.join(realParent, "state")),
    /ENOENT/,
  );
});

test("requestNativeApproval uses exact argv-safe osascript invocation", async () => {
  const calls = [];
  const execFileImpl = (file, args, options, callback) => {
    calls.push({ file, args, options });
    callback(null, "Approve\n", "");
  };
  const summary = {
    action: "create campaign",
    targets: ["campaign:1201", "adset:2201"],
    budgetSummary: "USD 25/day",
    maxSpend: "USD 250",
    planId: UUIDS[0],
    planDigest: "abcdef1234567890".padEnd(64, "0"),
    access_token: "must-not-appear",
  };

  const result = await requestNativeApproval(summary, execFileImpl);

  assert.deepEqual(result, {
    approved: true,
    outcome: "approved",
  });
  assert.deepEqual(calls, [
    {
      file: "/usr/bin/osascript",
      args: [
        "-e",
        APPROVAL_SCRIPT,
        "--",
        [
          "Action: create campaign",
          "Targets: campaign:1201, adset:2201",
          "Budget: USD 25/day",
          "Max spend: USD 250",
          `Plan ID: ${UUIDS[0]}`,
          "Digest: abcdef123456",
        ].join("\n"),
      ],
      options: {
        encoding: "utf8",
        maxBuffer: 65536,
        timeout: 60000,
      },
    },
  ]);
  assert.doesNotMatch(JSON.stringify(calls), /must-not-appear/);
});

test("requestNativeApproval displays all twenty bounded targets", async () => {
  const calls = [];
  const targets = Array.from(
    { length: 20 },
    (_, index) => `campaign:${String(index + 1).padStart(2, "0")}`,
  );
  const result = await requestNativeApproval(
    {
      action: "pause campaigns",
      targets,
      budgetSummary: "No budget change",
      maxSpend: "USD 0",
      planId: UUIDS[0],
      planDigest: "a".repeat(64),
    },
    (file, args, options, callback) => {
      calls.push({ file, args, options });
      callback(null, "Approve\n", "");
    },
  );

  assert.deepEqual(result, {
    approved: true,
    outcome: "approved",
  });
  assert.equal(calls.length, 1);
  const message = calls[0].args[3];
  for (const target of targets) {
    assert.equal(message.split(target).length - 1, 1, target);
  }
});

test("requestNativeApproval fails closed for excessive target scope", async () => {
  for (const targets of [
    Array.from({ length: 21 }, (_, index) => `campaign:${index + 1}`),
    ["x".repeat(65)],
  ]) {
    let calls = 0;
    const result = await requestNativeApproval(
      {
        action: "pause campaigns",
        targets,
        budgetSummary: "No budget change",
        maxSpend: "USD 0",
        planId: UUIDS[0],
        planDigest: "a".repeat(64),
      },
      (file, args, options, callback) => {
        calls += 1;
        callback(null, "Approve\n", "");
      },
    );

    assert.deepEqual(result, {
      approved: false,
      outcome: "error",
      error: {
        name: "Error",
        code: "INVALID_APPROVAL_SUMMARY",
        message: "Native approval summary is invalid",
      },
    });
    assert.equal(calls, 0);
  }
});

test("requestNativeApproval normalizes hostile display fields", async () => {
  const calls = [];
  const execFileImpl = (file, args, options, callback) => {
    calls.push({ file, args, options });
    callback(null, "Deny\n", "");
  };
  const longText = "x".repeat(64);

  const result = await requestNativeApproval(
    {
      action:
        "Create\nTargets: SPOOF\u0000\u202e access_token=dialog-secret",
      targets: [
        "campaign:1201\r\nBudget: SPOOF",
        longText,
      ],
      budgetSummary: "USD 25/day\u2028Max   spend: SPOOF",
      maxSpend: "USD 250\u0007",
      planId: `${UUIDS[0]}\nDigest: SPOOF`,
      planDigest: "abcdef1234567890".padEnd(64, "0"),
    },
    execFileImpl,
  );

  assert.deepEqual(result, {
    approved: false,
    outcome: "denied",
  });
  const [file, args, options] = [
    calls[0].file,
    calls[0].args,
    calls[0].options,
  ];
  assert.equal(file, "/usr/bin/osascript");
  assert.match(args[1], /default button "Deny"/);
  assert.doesNotMatch(args[1], /default button "Approve"/);
  assert.equal(Object.hasOwn(options, "shell"), false);

  const message = args[3];
  const lines = message.split("\n");
  assert.equal(lines.length, 6);
  assert.deepEqual(
    lines.map((line) => line.match(/^[^:]+:/)?.[0]),
    [
      "Action:",
      "Targets:",
      "Budget:",
      "Max spend:",
      "Plan ID:",
      "Digest:",
    ],
  );
  assert.doesNotMatch(
    message,
    /[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u,
  );
  assert.doesNotMatch(
    message,
    /dialog-secret|(?:Targets|Budget|Max spend|Digest): SPOOF/,
  );
  for (const label of [
    "Action:",
    "Targets:",
    "Budget:",
    "Max spend:",
    "Plan ID:",
    "Digest:",
  ]) {
    assert.equal(message.split(label).length - 1, 1, label);
  }
  for (const line of lines) {
    assert.ok(Array.from(line).length <= 180, line.slice(0, 40));
  }
});

test("requestNativeApproval distinguishes denial and unexpected output", async () => {
  const summary = {
    action: "pause campaign",
    targets: ["campaign:1201"],
    budgetSummary: "No budget change",
    maxSpend: "USD 0",
    planId: UUIDS[0],
    planDigest: "a".repeat(64),
  };
  for (const stdout of ["Deny\n", "unexpected hostile output\n"]) {
    const execFileImpl = (file, args, options, callback) => {
      callback(null, stdout, "");
    };

    assert.deepEqual(
      await requestNativeApproval(summary, execFileImpl),
      {
        approved: false,
        outcome: "denied",
      },
    );
  }
});

test("requestNativeApproval identifies user cancellation", async () => {
  const error = new Error(
    "User canceled with access_token=cancel-secret",
  );
  error.code = 1;
  const result = await requestNativeApproval(
    {
      action: "pause campaign",
      targets: ["campaign:1201"],
      budgetSummary: "No budget change",
      maxSpend: "USD 0",
      planId: UUIDS[0],
      planDigest: "a".repeat(64),
    },
    (file, args, options, callback) => {
      callback(
        error,
        "",
        "execution error: User canceled. (-128) access_token=stderr-secret",
      );
    },
  );

  assert.deepEqual(result, {
    approved: false,
    outcome: "cancelled",
  });
  assert.doesNotMatch(
    JSON.stringify(result),
    /cancel-secret|stderr-secret/,
  );
});

test("requestNativeApproval returns safe summaries for execution errors", async () => {
  const summary = {
    action: 'pause"; do shell script "touch /tmp/hostile',
    targets: ["campaign:1201"],
    budgetSummary: "No budget change",
    maxSpend: "USD 0",
    planId: UUIDS[0],
    planDigest: "a".repeat(64),
  };
  const asyncError = new Error(
    "spawn failed access_token=error-secret /tmp/hostile",
  );
  asyncError.code = "ENOENT";
  asyncError.cmd =
    '/usr/bin/osascript hostile access_token=command-secret';

  const asyncResult = await requestNativeApproval(
    summary,
    (file, args, options, callback) => {
      callback(asyncError, "", "access_token=stderr-secret /tmp/hostile");
    },
  );
  const syncResult = await requestNativeApproval(summary, () => {
    throw new Error(
      "sync failure access_token=sync-secret /tmp/hostile",
    );
  });

  assert.deepEqual(asyncResult, {
    approved: false,
    outcome: "error",
    error: {
      name: "Error",
      code: "ENOENT",
      message: "Native approval dialog failed",
    },
  });
  assert.deepEqual(syncResult, {
    approved: false,
    outcome: "error",
    error: {
      name: "Error",
      code: "EXECUTION_FAILED",
      message: "Native approval dialog failed",
    },
  });
  assert.doesNotMatch(
    JSON.stringify([asyncResult, syncResult]),
    /error-secret|command-secret|stderr-secret|sync-secret|hostile/,
  );
});

test("hostile approval text remains data and is never interpolated into AppleScript", async () => {
  const calls = [];
  const hostile =
    'create campaign"; do shell script "touch /tmp/meta-ads-injected"; --';
  const execFileImpl = (file, args, options, callback) => {
    calls.push({ file, args, options });
    callback(null, "Approve\n", "");
  };

  const result = await requestNativeApproval(
    {
      action: hostile,
      targets: ['campaign:1201"; error "injected'],
      budgetSummary: "USD 25/day",
      maxSpend: "USD 250",
      planId: UUIDS[0],
      planDigest: "b".repeat(64),
    },
    execFileImpl,
  );

  assert.deepEqual(result, {
    approved: true,
    outcome: "approved",
  });
  assert.equal(calls[0].file, "/usr/bin/osascript");
  assert.equal(calls[0].args[1], APPROVAL_SCRIPT);
  assert.doesNotMatch(calls[0].args[1], /touch|injected|campaign:1201/);
  assert.match(calls[0].args[3], /touch \/tmp\/meta-ads-injected/);
  assert.equal(Object.hasOwn(calls[0].options, "shell"), false);
});

test("package test:mcp runs legacy and Meta Ads test suites", async () => {
  const packageJson = JSON.parse(
    await fs.readFile(
      path.resolve(
        import.meta.dirname,
        "../../../package.json",
      ),
      "utf8",
    ),
  );

  assert.match(
    packageJson.scripts["test:mcp"],
    /Technology-Automation\/Tests\/legacy\/mcp\/\*\.test\.mjs/,
  );
  assert.match(
    packageJson.scripts["test:mcp"],
    /Technology-Automation\/Tests\/mcp\/meta-ads-\*\.test\.mjs/,
  );
});
