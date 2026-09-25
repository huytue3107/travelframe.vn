import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Google Analytics MCP source exposes read-only tools without write endpoints", async () => {
  const source = await readFile(
    new URL("../../../MCP/google-analytics-readonly.mjs", import.meta.url),
    "utf8"
  );
  assert.match(source, /get_ga4_realtime/);
  assert.match(source, /get_ga4_traffic_overview/);
  assert.match(source, /get_ga4_top_pages/);
  assert.match(source, /get_ga4_traffic_sources/);
  assert.doesNotMatch(source, /POST|PUT|DELETE/);
});
