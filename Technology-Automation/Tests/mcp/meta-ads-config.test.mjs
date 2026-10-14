import test from "node:test";
import assert from "node:assert/strict";

import { loadMetaAdsConfig } from "../../MCP/meta-ads/config.mjs";

const HOME_DIR = "/Users/tester";

function validEnv(overrides = {}) {
  return {
    META_ADS_ACCESS_TOKEN: "test-access-token",
    META_AD_ACCOUNT_ID: "act_123456789",
    TRAVELFRAME_PAGE_ID: "1409099405611405",
    TRAVELFRAME_INSTAGRAM_ACCOUNT_ID: "17841438272497512",
    META_GRAPH_VERSION: "v23.0",
    ...overrides,
  };
}

test("requires every Meta Ads environment variable", () => {
  const requiredNames = [
    "META_ADS_ACCESS_TOKEN",
    "TRAVELFRAME_PAGE_ID",
    "TRAVELFRAME_INSTAGRAM_ACCOUNT_ID",
    "META_GRAPH_VERSION",
  ];

  for (const name of requiredNames) {
    const env = validEnv();
    delete env[name];

    assert.throws(
      () => loadMetaAdsConfig(env, HOME_DIR),
      new RegExp(`Missing required environment variable: ${name}`),
    );
  }
});

test("allows the ad account to remain unselected during initial connection", () => {
  const env = validEnv();
  delete env.META_AD_ACCOUNT_ID;

  const config = loadMetaAdsConfig(env, HOME_DIR);

  assert.equal(config.adAccountId, null);
  assert.equal(config.pageId, "1409099405611405");
  assert.equal(config.instagramAccountId, "17841438272497512");
});

test("rejects blank required values", () => {
  assert.throws(
    () =>
      loadMetaAdsConfig(
        validEnv({ META_ADS_ACCESS_TOKEN: "   " }),
        HOME_DIR,
      ),
    /Missing required environment variable: META_ADS_ACCESS_TOKEN/,
  );
});

test("rejects invalid locked asset IDs", () => {
  const invalidValues = [
    ["META_AD_ACCOUNT_ID", "123456789"],
    ["META_AD_ACCOUNT_ID", "act_123x"],
    ["TRAVELFRAME_PAGE_ID", "page_1409099405611405"],
    ["TRAVELFRAME_INSTAGRAM_ACCOUNT_ID", "17841438272497512x"],
  ];

  for (const [name, value] of invalidValues) {
    assert.throws(
      () => loadMetaAdsConfig(validEnv({ [name]: value }), HOME_DIR),
      new RegExp(`Invalid ${name}`),
    );
  }
});

test("rejects invalid Graph API versions", () => {
  for (const version of ["23.0", "v23", "v23.0-beta", "latest"]) {
    assert.throws(
      () =>
        loadMetaAdsConfig(
          validEnv({ META_GRAPH_VERSION: version }),
          HOME_DIR,
        ),
      /Invalid META_GRAPH_VERSION/,
    );
  }
});

test("returns normalized immutable config with a hidden usable token", () => {
  const config = loadMetaAdsConfig(
    validEnv({
      META_ADS_ACCESS_TOKEN: "  test-access-token  ",
      META_AD_ACCOUNT_ID: "  act_123456789  ",
      TRAVELFRAME_PAGE_ID: "  1409099405611405  ",
      TRAVELFRAME_INSTAGRAM_ACCOUNT_ID: "  17841438272497512  ",
      META_GRAPH_VERSION: "  v23.0  ",
    }),
    HOME_DIR,
  );

  assert.deepEqual(
    {
      adAccountId: config.adAccountId,
      pageId: config.pageId,
      instagramAccountId: config.instagramAccountId,
      graphVersion: config.graphVersion,
      stateDir: config.stateDir,
    },
    {
      adAccountId: "act_123456789",
      pageId: "1409099405611405",
      instagramAccountId: "17841438272497512",
      graphVersion: "v23.0",
      stateDir: "/Users/tester/.codex/travelframe-meta-ads",
    },
  );
  assert.equal(config.accessToken, "test-access-token");
  assert.equal(
    Object.getOwnPropertyDescriptor(config, "accessToken").enumerable,
    false,
  );
  assert.equal(Object.isFrozen(config), true);

  assert.throws(() => {
    config.adAccountId = "act_999";
  }, TypeError);
  assert.throws(() => {
    config.pageId = "999";
  }, TypeError);
  assert.throws(() => {
    config.instagramAccountId = "999";
  }, TypeError);

  const serialized = JSON.stringify(config);
  assert.doesNotMatch(serialized, /test-access-token/);
  assert.doesNotMatch(serialized, /accessToken/);
});
