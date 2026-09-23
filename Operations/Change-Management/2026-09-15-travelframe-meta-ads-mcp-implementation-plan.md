# TravelFrame Meta Ads MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally connect a review-first MCP that can read, create, edit, activate, pause, and report on TravelFrame Meta Ads without exposing credentials or permitting unreviewed writes.

**Architecture:** Keep the existing organic read-only MCP unchanged and add a separate `travelframe_meta_ads` server. The Ads server uses a locked account configuration, a Meta client, canonical local plans, one-time native macOS approval receipts, read-after-write reconciliation, and redacted JSONL audit records. New campaign objects are always created `PAUSED`; activation is a separate approved operation.

**Tech Stack:** Node.js ESM, `@modelcontextprotocol/sdk`, Zod, native `fetch`, Node test runner, macOS Keychain `security`, macOS `osascript`, JSON/JSONL local state.

---

## File Map

- Create `Technology-Automation/MCP/meta-ads/config.mjs`: validate locked account configuration and state paths.
- Create `Technology-Automation/MCP/meta-ads/redact.mjs`: recursively remove tokens and sensitive query parameters.
- Create `Technology-Automation/MCP/meta-ads/meta-client.mjs`: typed GET/POST transport, Meta errors, retries for reads, and reconciliation helpers.
- Create `Technology-Automation/MCP/meta-ads/plan-store.mjs`: canonical plans, SHA-256 digest, expiry, approval receipts, audit JSONL, and stale-state checks.
- Create `Technology-Automation/MCP/meta-ads/approval.mjs`: native macOS approval dialog with dependency injection for tests.
- Create `Technology-Automation/MCP/meta-ads/schemas.mjs`: Zod schemas and Meta field allowlists for read, create, edit, status, and reporting operations.
- Create `Technology-Automation/MCP/meta-ads/service.mjs`: account reads, Insights, draft/apply/activate/update/rollback orchestration.
- Create `Technology-Automation/MCP/travelframe-meta-ads.mjs`: MCP server and tool registration.
- Create `Technology-Automation/Scripts/meta-ads-mcp/run.sh`: retrieve the Ads token from Keychain and launch the server.
- Create `Technology-Automation/Scripts/meta-ads-mcp/store-token.sh`: user-operated Keychain input without printing the token.
- Create `Technology-Automation/Tests/mcp/meta-ads-config.test.mjs`: config and allowlist tests.
- Create `Technology-Automation/Tests/mcp/meta-ads-redact.test.mjs`: secret-redaction tests.
- Create `Technology-Automation/Tests/mcp/meta-ads-client.test.mjs`: transport, error, retry, and reconciliation tests.
- Create `Technology-Automation/Tests/mcp/meta-ads-plan-store.test.mjs`: digest, expiry, replay, stale state, and audit tests.
- Create `Technology-Automation/Tests/mcp/meta-ads-service.test.mjs`: read tools and all gated write workflows.
- Create `Technology-Automation/Tests/mcp/meta-ads-source-safety.test.mjs`: assert absence of billing, permission-admin, delete, and token argument surfaces.
- Modify `package.json`: add Meta Ads MCP and focused test scripts.
- Modify `/Users/macbook/.codex/config.toml`: register `travelframe_meta_ads` after local verification.
- Create `Technology-Automation/Runbooks/TravelFrame-Meta-Ads-MCP-Runbook.md`: setup, reconnect, approval, smoke test, rollback, and revocation.

### Task 1: Configuration And Redaction Core

**Files:**
- Create: `Technology-Automation/Tests/mcp/meta-ads-config.test.mjs`
- Create: `Technology-Automation/Tests/mcp/meta-ads-redact.test.mjs`
- Create: `Technology-Automation/MCP/meta-ads/config.mjs`
- Create: `Technology-Automation/MCP/meta-ads/redact.mjs`

- [ ] **Step 1: Write failing configuration tests**

Test that configuration rejects missing Ads token, unprefixed ad account IDs, missing Page/Instagram IDs, and unknown Graph versions. Test that it returns immutable locked IDs and defaults local state beneath `~/.codex/travelframe-meta-ads`.

- [ ] **Step 2: Run configuration tests and verify RED**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-config.test.mjs
```

Expected: FAIL because `config.mjs` does not exist.

- [ ] **Step 3: Implement minimal configuration**

Export `loadMetaAdsConfig(env, homeDir)` with required keys:

```javascript
META_ADS_ACCESS_TOKEN
META_AD_ACCOUNT_ID
TRAVELFRAME_PAGE_ID
TRAVELFRAME_INSTAGRAM_ACCOUNT_ID
META_GRAPH_VERSION
```

Normalize the ad account to `act_<digits>`, allow Graph versions matching
`v<major>.<minor>`, freeze the returned object, and never include the token in
serializable public config.

- [ ] **Step 4: Run configuration tests and verify GREEN**

Run the Task 1 configuration command. Expected: PASS.

- [ ] **Step 5: Write failing redaction tests**

Cover nested `access_token`, `client_secret`, `appsecret_proof`, bearer strings,
and paging URLs with sensitive query parameters.

- [ ] **Step 6: Run redaction tests and verify RED**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-redact.test.mjs
```

Expected: FAIL because `redact.mjs` does not exist.

- [ ] **Step 7: Implement recursive redaction**

Export `redactSecrets(value)` and `safeError(error)`; preserve ordinary IDs and
metric values while replacing secrets with `[REDACTED]`.

- [ ] **Step 8: Run Task 1 tests and commit**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-config.test.mjs Technology-Automation/Tests/mcp/meta-ads-redact.test.mjs
```

Expected: PASS. Commit only the four Task 1 files.

### Task 2: Meta API Client

**Files:**
- Create: `Technology-Automation/Tests/mcp/meta-ads-client.test.mjs`
- Create: `Technology-Automation/MCP/meta-ads/meta-client.mjs`

- [ ] **Step 1: Write failing client tests**

Use an injected `fetchImpl` to verify:

- GET query serialization and token injection.
- POST form serialization and token injection.
- No token appears in thrown errors.
- GET retries on `429` and transient `5xx`.
- POST never retries automatically.
- `readAfterWrite` detects matching, missing, and conflicting fields.

- [ ] **Step 2: Run client tests and verify RED**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-client.test.mjs
```

Expected: FAIL because `meta-client.mjs` does not exist.

- [ ] **Step 3: Implement minimal Meta client**

Export `createMetaClient({ graphBase, token, fetchImpl, sleepImpl })` with:

```javascript
get(path, params)
post(path, params)
readAfterWrite(path, fields, expected)
```

Use URL-encoded bodies for POST, bounded exponential backoff with jitter for
read calls only, and sanitized `MetaApiError` objects.

- [ ] **Step 4: Run client tests and commit**

Run the Task 2 test command. Expected: PASS. Commit the Task 2 files.

### Task 3: Plan Store, Approval Receipts, And Audit

**Files:**
- Create: `Technology-Automation/Tests/mcp/meta-ads-plan-store.test.mjs`
- Create: `Technology-Automation/MCP/meta-ads/plan-store.mjs`
- Create: `Technology-Automation/MCP/meta-ads/approval.mjs`

- [ ] **Step 1: Write failing plan-store tests**

Verify canonical key ordering, SHA-256 digests, ten-minute expiry, single-use
approval, replay rejection, digest mismatch rejection, stale before-state
rejection, atomic JSON writes, and redacted append-only audit events.

- [ ] **Step 2: Run plan-store tests and verify RED**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-plan-store.test.mjs
```

Expected: FAIL because plan modules do not exist.

- [ ] **Step 3: Implement local plan store**

Export:

```javascript
createPlanStore({ stateDir, clock })
createPlan(planInput)
getPlan(planId)
approvePlan(planId, approver)
consumeApproval(planId, digest)
discardPlan(planId)
appendAudit(event)
```

Write plans beneath `plans/`, receipts beneath `approvals/`, and events to
`audit/events.jsonl`. Use mode `0600` for files and `0700` for directories.

- [ ] **Step 4: Implement native approval adapter**

Export `requestNativeApproval(planSummary, execFileImpl)` using `osascript`.
Require the user to confirm a dialog containing the action, target IDs, budget
summary, maximum planned spend, plan ID, and short digest. Cancellation returns
a structured denial and never creates a receipt.

- [ ] **Step 5: Run plan-store tests and commit**

Run the Task 3 test command. Expected: PASS. Commit the Task 3 files.

### Task 4: Schemas And Read Service

**Files:**
- Create: `Technology-Automation/MCP/meta-ads/schemas.mjs`
- Create: `Technology-Automation/MCP/meta-ads/service.mjs`
- Create: `Technology-Automation/Tests/mcp/meta-ads-service.test.mjs`

- [ ] **Step 1: Write failing read-service tests**

Test `getAdAccount`, `listCampaigns`, `getCampaignStructure`,
`getAdsInsights`, and `getDeliveryState` with injected Meta responses. Verify
locked account IDs, reporting metadata, account timezone, redacted paging, and
rejection of unsupported Insight fields or breakdowns.

- [ ] **Step 2: Run service tests and verify RED**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-service.test.mjs
```

Expected: FAIL because schema/service modules do not exist.

- [ ] **Step 3: Implement strict Zod schemas**

Define allowlists for account, campaign, ad set, ad, creative, status, date
range, Insights fields, breakdowns, and mutation fields. All object schemas use
`.strict()` and reject account/Page/Instagram overrides.

- [ ] **Step 4: Implement read service**

Build the five read methods using Meta client GET calls. Attach
`captured_at`, reporting period, account timezone, currency, requested fields,
breakdowns, and limitations to Insight responses.

- [ ] **Step 5: Run service tests and commit**

Run the Task 4 test command. Expected: PASS. Commit the Task 4 files.

### Task 5: Draft Plans And Gated Writes

**Files:**
- Modify: `Technology-Automation/MCP/meta-ads/service.mjs`
- Modify: `Technology-Automation/MCP/meta-ads/schemas.mjs`
- Modify: `Technology-Automation/Tests/mcp/meta-ads-service.test.mjs`

- [ ] **Step 1: Write failing campaign-plan tests**

Verify that `draftCampaignPlan` requires explicit budget strategy, currency,
schedule, Page/Instagram actor, campaign objective, audience, placements, and
creative inputs. Verify it forces every new campaign, ad set, and ad to
`PAUSED`, rejects billing/admin/delete fields, and emits dependency-ordered
operations.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern="draft campaign" Technology-Automation/Tests/mcp/meta-ads-service.test.mjs
```

Expected: FAIL because draft methods are absent.

- [ ] **Step 3: Implement campaign and change planning**

Add:

```javascript
draftCampaignPlan(input)
draftChangePlan(input)
reviewPlan(planId)
discardPlan(planId)
```

Campaign plans create dependencies in order: campaign, creatives, ad sets,
then ads. Change plans include a current before snapshot, requested after state,
human-readable diff, warnings, and a reverse plan.

- [ ] **Step 4: Write failing apply tests**

Cover approval denial, expired/replayed approval, stale before-state, ordered
creation, placeholder ID resolution, forced `PAUSED`, partial failure, audit
precondition, read-after-write mismatch, and successful reconciliation.

- [ ] **Step 5: Run focused apply tests and verify RED**

Expected: FAIL because apply methods are absent.

- [ ] **Step 6: Implement `applyPlanPaused`**

Request native approval, write a pre-operation audit event, consume a matching
receipt, apply only plan operations, resolve created IDs between dependent
operations, read back each object, and append a final success or partial-failure
event. Never activate an object in this method.

- [ ] **Step 7: Write failing live-control tests**

Cover `activatePlan`, `pauseEntities`, `resumeEntities`, `changeBudget`,
`changeSchedule`, `changeTargeting`, `changePlacements`, `replaceCreative`, and
`rollbackPlan`. Require a new plan and approval for each operation.

- [ ] **Step 8: Implement live controls**

Use Meta POST updates for supported mutable fields. Implement creative changes
as clone-and-replace. Reject delete, billing, account settings, permissions,
currency, timezone, and account spending limit.

- [ ] **Step 9: Run complete service tests and commit**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-service.test.mjs
```

Expected: PASS. Commit only Task 5 files.

### Task 6: MCP Server, Launcher, And Safety Contract

**Files:**
- Create: `Technology-Automation/MCP/travelframe-meta-ads.mjs`
- Create: `Technology-Automation/Scripts/meta-ads-mcp/run.sh`
- Create: `Technology-Automation/Scripts/meta-ads-mcp/store-token.sh`
- Create: `Technology-Automation/Tests/mcp/meta-ads-source-safety.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing source-safety test**

Assert the server registers every approved tool, accepts no token/account
override argument, contains no delete/billing/admin tool, and routes every write
through plan and approval methods.

- [ ] **Step 2: Run source-safety test and verify RED**

Run:

```bash
node --test Technology-Automation/Tests/mcp/meta-ads-source-safety.test.mjs
```

Expected: FAIL because the server file does not exist.

- [ ] **Step 3: Implement MCP registration**

Instantiate `McpServer`, register schemas from `schemas.mjs`, convert service
results to redacted JSON text content, and connect through
`StdioServerTransport`.

- [ ] **Step 4: Implement Keychain scripts**

`store-token.sh` reads the token silently with `read -s`, stores it under service
`travelframe-meta-ads`, and never prints it. `run.sh` reads that service, exports
locked IDs and starts the MCP.

- [ ] **Step 5: Add package scripts**

Add:

```json
"mcp:meta-ads": "node Technology-Automation/MCP/travelframe-meta-ads.mjs",
"test:meta-ads": "node --test Technology-Automation/Tests/mcp/meta-ads-*.test.mjs"
```

Make `npm test` run both legacy MCP tests and Meta Ads tests.

- [ ] **Step 6: Run MCP tests and commit**

Run:

```bash
npm run test:meta-ads
npm test
```

Expected: PASS. Commit only Task 6 files and the scoped `package.json` change.

### Task 7: Runbook And Local Registration

**Files:**
- Create: `Technology-Automation/Runbooks/TravelFrame-Meta-Ads-MCP-Runbook.md`
- Modify: `/Users/macbook/.codex/config.toml`

- [ ] **Step 1: Write the operational runbook**

Document Meta app selection, required scopes, Business/ad account/Page/Instagram
verification, Keychain storage, MCP restart, read smoke test, write test in
`PAUSED`, reconnect, token revocation, local state backup, audit inspection, and
emergency disable.

- [ ] **Step 2: Validate launcher without exposing a token**

Run shell syntax checks and start the MCP with a test token against mocked
transport where possible. Expected: launcher fails clearly when Keychain item is
missing and never echoes token content.

- [ ] **Step 3: Register the MCP locally**

Add:

```toml
[mcp_servers.travelframe_meta_ads]
command = "<workspace-root>/Technology-Automation/Scripts/meta-ads-mcp/run.sh"
args = []
cwd = "<workspace-root>"
startup_timeout_sec = 30
```

- [ ] **Step 4: Validate MCP handshake**

Start the launcher and verify MCP `initialize` and `tools/list`. Confirm both
read and gated write tools are present and organic MCP registration is intact.

- [ ] **Step 5: Commit repository runbook**

Commit only the runbook. The user-local Codex config is not committed.

### Task 8: User-Operated Meta Connection And Live Read Smoke Test

**Files:**
- No repository source edits expected.
- Local Keychain and Meta authorization state change.

- [ ] **Step 1: Open the Meta authorization flow**

Use the existing `side-agency` Meta app and request only the permissions needed
for the verified TravelFrame assets. Rocky performs login, consent, and any
security challenge directly.

- [ ] **Step 2: Store the token through the silent Keychain helper**

Run:

```bash
Technology-Automation/Scripts/meta-ads-mcp/store-token.sh
```

Expected: success message containing no token.

- [ ] **Step 3: Discover and lock the ad account**

Use read-only API calls to identify the TravelFrame Business/ad account and
verify its Page and Instagram actor. Update only local launcher/config values;
do not guess or select another client account.

- [ ] **Step 4: Run live read smoke tests**

Call `get_ad_account`, `list_campaigns`, `get_ads_insights`, and
`get_delivery_state`. Expected: successful responses with correct identity,
timezone/currency metadata, and no exposed token.

- [ ] **Step 5: Stop before a live write unless separately approved**

Report the exact account and permission evidence. Creating a real test campaign
requires a new explicit approval and must remain `PAUSED`.

### Task 9: Full Verification And Completion Audit

**Files:**
- Modify only files required to fix verified defects.

- [ ] **Step 1: Run focused and full tests**

```bash
npm run test:meta-ads
npm test
npm run test:skills
npm run workspace:check
```

Expected: all PASS.

- [ ] **Step 2: Run secret and forbidden-surface scans**

Search the changed files for token-like values, delete methods, billing/admin
fields, account overrides, and unredacted URL logging. Expected: no findings
outside explicit rejection tests and documentation.

- [ ] **Step 3: Inspect the exact diff**

Verify only the planned repository files are included and preserve all
pre-existing user changes.

- [ ] **Step 4: Verify each design completion criterion**

Map every criterion in
`Technology-Automation/Runbooks/DES-20260915-TRAVELFRAME-META-ADS-MCP.md`
to a test result, live response, file, local registration, or explicit pending
approval.

- [ ] **Step 5: Commit final fixes**

Stage exact files only and commit. Do not push.
