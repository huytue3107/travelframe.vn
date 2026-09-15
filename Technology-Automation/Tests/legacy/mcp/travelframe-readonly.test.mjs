import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("MCP source exposes read-only tools without write endpoints", async () => {
  const source = await readFile(
    new URL("../../../MCP/travelframe-readonly.mjs", import.meta.url),
    "utf8"
  );
  assert.match(source, /get_travelframe_connection/);
  assert.match(source, /get_instagram_profile/);
  assert.match(source, /list_instagram_media/);
  assert.match(source, /get_instagram_insights/);
  assert.doesNotMatch(source, /instagram_content_publish/);
  assert.doesNotMatch(source, /instagram_manage_messages/);
  assert.doesNotMatch(source, /POST|PUT|DELETE/);
  assert.match(source, /redactSecrets/);
  assert.match(source, /metric_type/);
});
