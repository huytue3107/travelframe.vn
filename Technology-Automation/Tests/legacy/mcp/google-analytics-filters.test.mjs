import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { INTERNAL_PATH_REGEX, buildPathExclusionFilter } from "../../../MCP/google-analytics-filters.mjs";

const internal = new RegExp(INTERNAL_PATH_REGEX);

test("internal regex matches admin, editor and login paths seen in GA4", () => {
  for (const path of [
    "/travelframe-admin",
    "/travelframe-admin/content/tours",
    "/admin/config/development/performance",
    "/node/add/news",
    "/node/104/edit",
    "/node/68/delete",
    "/side-user",
    "/side-user/overview",
    "/user/login",
    "/login",
  ]) {
    assert.ok(internal.test(path), `${path} should be internal`);
  }
});

test("internal regex keeps public pages", () => {
  for (const path of [
    "/",
    "/tours",
    "/booking",
    "/booking/details",
    "/hanoi-photoshoot",
    "/news/christmas-dinner-hanoi",
    "/news/admin-free-guide",
    "/node",
    "/users-guide",
  ]) {
    assert.ok(!internal.test(path), `${path} should stay public`);
  }
});

test("no options returns no filter", () => {
  assert.equal(buildPathExclusionFilter(), undefined);
  assert.equal(buildPathExclusionFilter({ excludeInternal: false }), undefined);
});

test("exclude_internal builds a single notExpression on pagePath", () => {
  assert.deepEqual(buildPathExclusionFilter({ excludeInternal: true }), {
    notExpression: {
      filter: { fieldName: "pagePath", stringFilter: { matchType: "FULL_REGEXP", value: INTERNAL_PATH_REGEX } },
    },
  });
});

test("internal plus custom regex builds an andGroup on the requested field", () => {
  const f = buildPathExclusionFilter({ excludeInternal: true, excludePathRegex: "^/checkout.*", fieldName: "landingPage" });
  assert.equal(f.andGroup.expressions.length, 2);
  assert.equal(f.andGroup.expressions[1].notExpression.filter.fieldName, "landingPage");
  assert.equal(f.andGroup.expressions[1].notExpression.filter.stringFilter.value, "^/checkout.*");
});

test("invalid custom regex is rejected", () => {
  assert.throws(() => buildPathExclusionFilter({ excludePathRegex: "(" }), /not a valid regular expression/);
});

test("server wires the filter into every report tool and adds landing pages", async () => {
  const source = await readFile(new URL("../../../MCP/google-analytics-readonly.mjs", import.meta.url), "utf8");
  assert.match(source, /get_ga4_landing_pages/);
  assert.equal((source.match(/buildPathExclusionFilter\(/g) || []).length, 4);
  assert.doesNotMatch(source, /POST|PUT|DELETE/);
});
