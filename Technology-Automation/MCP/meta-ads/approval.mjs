import { execFile as defaultExecFile } from "node:child_process";

import { redactSecrets, safeError } from "./redact.mjs";

const APPROVAL_SCRIPT = [
  "on run argv",
  "  set dialogText to item 1 of argv",
  '  set dialogResult to display dialog dialogText with title "TravelFrame Meta Ads Approval" buttons {"Deny", "Approve"} default button "Deny" with icon caution',
  "  return button returned of dialogResult",
  "end run",
].join("\n");

const DISPLAY_VALUE_LIMIT = 160;
const TARGET_LIMIT = 20;
const TARGET_VALUE_LIMIT = 64;
const UNSAFE_DISPLAY_CHARACTERS =
  /[\u0000-\u001f\u007f-\u009f\u061c\u200e\u200f\u2028-\u202e\u2066-\u2069]/gu;
const RESERVED_LABEL =
  /\b(action|targets|budget|max spend|plan id|digest)\s*:/giu;

function rawDisplayValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => rawDisplayValue(item)).join(", ");
  }
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "Not specified";
    }
  }
  return String(value);
}

function normalizeDisplayValue(value) {
  return rawDisplayValue(value)
    .replace(UNSAFE_DISPLAY_CHARACTERS, " ")
    .replace(/\s+/gu, " ")
    .replace(RESERVED_LABEL, (match, label) => `${label} -`)
    .trim();
}

function displayValue(value, limit = DISPLAY_VALUE_LIMIT) {
  const normalized = normalizeDisplayValue(value);
  const bounded = Array.from(normalized).slice(0, limit).join("");
  return bounded || "Not specified";
}

function approvalTargets(value) {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.length > TARGET_LIMIT
  ) {
    throw new TypeError("Invalid approval target count");
  }

  return value.map((target) => {
    if (typeof target !== "string") {
      throw new TypeError("Approval targets must be strings");
    }
    const normalized = normalizeDisplayValue(target);
    if (
      normalized === "" ||
      Array.from(normalized).length > TARGET_VALUE_LIMIT
    ) {
      throw new TypeError("Invalid approval target length");
    }
    return normalized;
  });
}

function approvalMessage(planSummary) {
  const summary = redactSecrets(planSummary ?? {});
  const targets = approvalTargets(summary.targets);
  const digest = displayValue(
    summary.planDigest ?? summary.plan_digest,
    12,
  );

  return [
    `Action: ${displayValue(summary.action)}`,
    `Targets: ${targets.join(", ")}`,
    `Budget: ${displayValue(
      summary.budgetSummary ?? summary.budget_summary,
    )}`,
    `Max spend: ${displayValue(summary.maxSpend ?? summary.max_spend)}`,
    `Plan ID: ${displayValue(summary.planId ?? summary.plan_id)}`,
    `Digest: ${digest}`,
  ].join("\n");
}

function isUserCancellation(error, stderr) {
  return (
    error?.code === 1 &&
    /\(-128\)/.test(String(stderr ?? error?.message ?? ""))
  );
}

function safeExecutionError(error) {
  const safe = safeError(error);
  const name =
    typeof safe?.name === "string" &&
    /^[A-Za-z][A-Za-z0-9]*Error$/.test(safe.name)
      ? safe.name
      : "Error";
  const code =
    (typeof safe?.code === "string" &&
      /^[A-Z0-9_]{1,40}$/.test(safe.code) &&
      safe.code) ||
    (typeof safe?.code === "number" &&
      Number.isSafeInteger(safe.code) &&
      String(safe.code)) ||
    "EXECUTION_FAILED";

  return {
    name,
    code,
    message: "Native approval dialog failed",
  };
}

export async function requestNativeApproval(
  planSummary,
  execFileImpl = defaultExecFile,
) {
  let message;
  try {
    message = approvalMessage(planSummary);
  } catch {
    return {
      approved: false,
      outcome: "error",
      error: {
        name: "Error",
        code: "INVALID_APPROVAL_SUMMARY",
        message: "Native approval summary is invalid",
      },
    };
  }

  return new Promise((resolve) => {
    try {
      execFileImpl(
        "/usr/bin/osascript",
        ["-e", APPROVAL_SCRIPT, "--", message],
        {
          encoding: "utf8",
          maxBuffer: 65536,
          timeout: 60000,
        },
        (error, stdout, stderr) => {
          if (error) {
            if (isUserCancellation(error, stderr)) {
              resolve({
                approved: false,
                outcome: "cancelled",
              });
              return;
            }
            resolve({
              approved: false,
              outcome: "error",
              error: safeExecutionError(error),
            });
            return;
          }

          if (String(stdout).trim() === "Approve") {
            resolve({
              approved: true,
              outcome: "approved",
            });
            return;
          }
          resolve({
            approved: false,
            outcome: "denied",
          });
        },
      );
    } catch (error) {
      resolve({
        approved: false,
        outcome: "error",
        error: safeExecutionError(error),
      });
    }
  });
}
