import { homedir } from "node:os";
import { join } from "node:path";

const REQUIRED_ENV_NAMES = [
  "META_ADS_ACCESS_TOKEN",
  "TRAVELFRAME_PAGE_ID",
  "TRAVELFRAME_INSTAGRAM_ACCOUNT_ID",
  "META_GRAPH_VERSION",
];

function requiredValue(env, name) {
  const value = env[name];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function requirePattern(name, value, pattern) {
  if (!pattern.test(value)) {
    throw new Error(`Invalid ${name}`);
  }
  return value;
}

export function loadMetaAdsConfig(env = process.env, homeDir = homedir()) {
  const values = Object.fromEntries(
    REQUIRED_ENV_NAMES.map((name) => [name, requiredValue(env, name)]),
  );
  const rawAdAccountId =
    typeof env.META_AD_ACCOUNT_ID === "string"
      ? env.META_AD_ACCOUNT_ID.trim()
      : "";

  const config = {
    adAccountId: rawAdAccountId
      ? requirePattern("META_AD_ACCOUNT_ID", rawAdAccountId, /^act_\d+$/)
      : null,
    pageId: requirePattern(
      "TRAVELFRAME_PAGE_ID",
      values.TRAVELFRAME_PAGE_ID,
      /^\d+$/,
    ),
    instagramAccountId: requirePattern(
      "TRAVELFRAME_INSTAGRAM_ACCOUNT_ID",
      values.TRAVELFRAME_INSTAGRAM_ACCOUNT_ID,
      /^\d+$/,
    ),
    graphVersion: requirePattern(
      "META_GRAPH_VERSION",
      values.META_GRAPH_VERSION,
      /^v\d+\.\d+$/,
    ),
    stateDir: join(homeDir, ".codex", "travelframe-meta-ads"),
  };

  Object.defineProperty(config, "accessToken", {
    value: values.META_ADS_ACCESS_TOKEN,
    enumerable: false,
    writable: false,
    configurable: false,
  });

  return Object.freeze(config);
}
