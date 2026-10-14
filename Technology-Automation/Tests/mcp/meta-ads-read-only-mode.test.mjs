import assert from "node:assert/strict";
import test from "node:test";

import {
  READ_ONLY_TOOL_NAMES,
  createMetaAdsMcpServer,
  resolveMetaAdsMode,
  selectToolDefinitions,
} from "../../MCP/travelframe-meta-ads.mjs";

const WRITE_TOOLS = [
  "discard_plan",
  "apply_plan_paused",
  "activate_plan",
  "pause_entities",
  "resume_entities",
  "change_budget",
  "change_schedule",
  "change_targeting",
  "change_placements",
  "replace_creative",
  "rollback_plan",
  "draft_campaign_plan",
  "draft_change_plan",
];

test("mode defaults to read when unset or empty", () => {
  assert.equal(resolveMetaAdsMode({}), "read");
  assert.equal(resolveMetaAdsMode({ META_ADS_MODE: "" }), "read");
  assert.equal(resolveMetaAdsMode({ META_ADS_MODE: "read" }), "read");
  assert.equal(resolveMetaAdsMode({ META_ADS_MODE: "full" }), "full");
});

test("unknown mode fails closed", () => {
  assert.throws(() => resolveMetaAdsMode({ META_ADS_MODE: "FULL" }), /Invalid META_ADS_MODE/);
  assert.throws(() => resolveMetaAdsMode({ META_ADS_MODE: "write" }), /Invalid META_ADS_MODE/);
});

test("read mode exposes only the six read tools", () => {
  const names = selectToolDefinitions("read").map((d) => d.toolName).sort();
  assert.deepEqual(names, [...READ_ONLY_TOOL_NAMES].sort());
  for (const name of WRITE_TOOLS) assert.equal(names.includes(name), false, name);
  for (const d of selectToolDefinitions("read")) assert.equal(d.readOnly, true);
});

test("full mode keeps every tool", () => {
  const names = selectToolDefinitions("full").map((d) => d.toolName);
  for (const name of WRITE_TOOLS) assert.ok(names.includes(name), name);
});

test("server registers only read tools by default", () => {
  const env = {
    META_ADS_ACCESS_TOKEN: "test-token-not-real",
    TRAVELFRAME_PAGE_ID: "1409099405611405",
    TRAVELFRAME_INSTAGRAM_ACCOUNT_ID: "17841438272497512",
    META_GRAPH_VERSION: "v26.0",
  };
  const server = createMetaAdsMcpServer({
    env,
    homeDir: "/tmp/meta-ads-read-only-test",
    fetchImpl: async () => { throw new Error("network disabled in test"); },
    approvalRequester: async () => { throw new Error("approval disabled in test"); },
  });
  const registered = Object.keys(server._registeredTools ?? {}).sort();
  assert.deepEqual(registered, [...READ_ONLY_TOOL_NAMES].sort());
});
