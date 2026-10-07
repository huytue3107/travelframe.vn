import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("MCP source exposes read-only tools without write endpoints", async () => {
  const source = await readFile(
    new URL("../../../MCP/travelframe-readonly.mjs", import.meta.url),
    "utf8"
  );
  assert.match(source, /get_travelframe_connection/);
  assert.match(source, /get_facebook_page_info/);
  assert.match(source, /list_facebook_page_posts/);
  assert.match(source, /get_instagram_profile/);
  assert.match(source, /list_instagram_media/);
  assert.match(source, /get_instagram_insights/);
  assert.match(source, /list_facebook_post_comments/);
  assert.match(source, /list_facebook_conversations/);
  assert.match(source, /get_facebook_conversation_messages/);
  assert.match(source, /TRAVELFRAME_META_PAGE_ACCESS_TOKEN/);
  assert.match(source, /pageAccessToken/);
  assert.match(source, /fields: "id,message,created_time,permalink_url,shares"/);
  assert.match(source, /Comments and reactions are unavailable/);
  assert.doesNotMatch(source, /reactions\.summary\(true\)|comments\.summary\(true\)/);
  assert.doesNotMatch(source, /instagram_content_publish/);
  assert.doesNotMatch(source, /instagram_manage_messages/);
  assert.doesNotMatch(source, /POST|PUT|DELETE/);
  assert.match(source, /redactSecrets/);
  assert.match(source, /metric_type/);
});
