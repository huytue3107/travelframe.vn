import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Meta Automation MCP source exposes two-way messaging and triage tools", async () => {
  const source = await readFile(
    new URL("../../../MCP/travelframe-meta-automation.mjs", import.meta.url),
    "utf8"
  );
  assert.match(source, /get_automation_status/);
  assert.match(source, /list_post_comments/);
  assert.match(source, /reply_facebook_comment/);
  assert.match(source, /send_facebook_private_reply/);
  assert.match(source, /send_facebook_message/);
  assert.match(source, /reply_instagram_comment/);
  assert.match(source, /triage_and_suggest_response/);
  assert.match(source, /TRAVELFRAME_META_PAGE_ACCESS_TOKEN/);
  assert.match(source, /redactSecrets/);
  assert.match(source, /Solo Explorer/);
  assert.match(source, /Couple \/ Honeymoon/);
  assert.match(source, /Family/);
  assert.match(source, /dry_run/);
});
