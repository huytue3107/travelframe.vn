import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const serverUrl = new URL(
  "../../MCP/travelframe-meta-ads.mjs",
  import.meta.url,
);

const approvedTools = [
  "get_ad_account",
  "list_ad_accounts",
  "list_campaigns",
  "get_campaign_structure",
  "get_ads_insights",
  "get_delivery_state",
  "validate_campaign_plan",
  "draft_campaign_plan",
  "draft_change_plan",
  "review_plan",
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
];

const writeRoutes = {
  apply_plan_paused: "applyPlanPaused",
  activate_plan: "activatePlan",
  pause_entities: "pauseEntities",
  resume_entities: "resumeEntities",
  change_budget: "changeBudget",
  change_schedule: "changeSchedule",
  change_targeting: "changeTargeting",
  change_placements: "changePlacements",
  replace_creative: "replaceCreative",
  rollback_plan: "rollbackPlan",
};

test("Meta Ads MCP registers only the approved tool surface", async () => {
  const source = await readFile(serverUrl, "utf8");

  for (const tool of approvedTools) {
    assert.match(source, new RegExp(`["']${tool}["']`), tool);
  }
  for (const forbidden of [
    "delete_campaign",
    "delete_ad_set",
    "delete_ad",
    "change_billing",
    "change_permissions",
    "change_account_settings",
    "change_currency",
    "change_timezone",
    "change_account_spend_limit",
  ]) {
    assert.doesNotMatch(
      source,
      new RegExp(`registerTool\\(\\s*["']${forbidden}["']`),
    );
  }
});

test("Meta Ads MCP exposes no token or account selector arguments", async () => {
  const source = await readFile(serverUrl, "utf8");

  assert.doesNotMatch(source, /\baccess_token\s*:/i);
  assert.doesNotMatch(source, /\bad_account_id\s*:/i);
  assert.doesNotMatch(source, /\baccount_id\s*:/i);
  assert.doesNotMatch(source, /\bpage_id\s*:/i);
  assert.doesNotMatch(source, /\binstagram_account_id\s*:/i);
});

test("every approved write routes through a gated service method", async () => {
  const source = await readFile(serverUrl, "utf8");

  for (const [tool, method] of Object.entries(writeRoutes)) {
    const routePattern = new RegExp(
      `toolName:\\s*["']${tool}["'][\\s\\S]{0,300}methodName:\\s*["']${method}["']`,
    );
    assert.match(source, routePattern, `${tool} must route to ${method}`);
  }
  assert.match(source, /createPlanStore/);
  assert.match(source, /requestNativeApproval/);
  assert.doesNotMatch(source, /\.post\s*\(/);
});

test("Keychain scripts never echo or accept the Ads token as an argument", async () => {
  const storeToken = await readFile(
    new URL("../../Scripts/meta-ads-mcp/store-token.sh", import.meta.url),
    "utf8",
  );
  const launcher = await readFile(
    new URL("../../Scripts/meta-ads-mcp/run.sh", import.meta.url),
    "utf8",
  );

  assert.match(storeToken, /read\s+-r\s+-s/);
  assert.match(storeToken, /security\s+add-generic-password/);
  assert.doesNotMatch(storeToken, /echo\s+["']?\$token/i);
  assert.match(launcher, /security\s+find-generic-password/);
  assert.doesNotMatch(launcher, /set\s+-x/);
  assert.doesNotMatch(launcher, /\$1/);
});
