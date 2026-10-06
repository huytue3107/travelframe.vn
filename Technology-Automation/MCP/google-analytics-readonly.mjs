import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Keep the stdio server alive: a rejected Google API promise must never kill the process
// (a crash shows up in Claude as "MCP server disconnected").
process.on("unhandledRejection", (reason) => {
  console.error("[ga4-mcp] unhandledRejection:", reason?.message || reason);
});
process.on("uncaughtException", (err) => {
  console.error("[ga4-mcp] uncaughtException:", err?.message || err);
});

const DEFAULT_KEY_PATH = join(homedir(), ".config", "travelframe", "ga4-service-account.json");

function resolveCredentialsPath() {
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (fromEnv) {
    if (!existsSync(fromEnv)) {
      throw new Error(`GOOGLE_APPLICATION_CREDENTIALS points to a missing file: ${fromEnv}`);
    }
    return fromEnv;
  }
  if (existsSync(DEFAULT_KEY_PATH)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = DEFAULT_KEY_PATH;
    return DEFAULT_KEY_PATH;
  }
  throw new Error(
    `No GA4 service account key found. Set GOOGLE_APPLICATION_CREDENTIALS or place the key at ${DEFAULT_KEY_PATH}.`
  );
}

let cachedClient = null;
function getAnalyticsClient() {
  if (cachedClient) return cachedClient;
  const keyFilename = resolveCredentialsPath();
  cachedClient = new BetaAnalyticsDataClient({ keyFilename, fallback: "rest" });
  return cachedClient;
}

function errorResult(err) {
  const msg = err?.details || err?.message || String(err);
  let hint = "";
  if (/PERMISSION_DENIED|403/i.test(msg)) {
    hint = " Hint: add the service account email as Viewer on the GA4 property and enable the Google Analytics Data API.";
  } else if (/invalid_grant|JWT|signature/i.test(msg)) {
    hint = " Hint: the service account key is revoked or expired; create a new JSON key.";
  } else if (/ENOTFOUND|ETIMEDOUT|ECONNRESET|network/i.test(msg)) {
    hint = " Hint: network problem reaching Google APIs.";
  }
  return { isError: true, content: [{ type: "text", text: `GA4 error: ${msg}${hint}` }] };
}

function safe(handler) {
  return async (args) => {
    try {
      return await handler(args);
    } catch (err) {
      console.error("[ga4-mcp]", err?.message || err);
      return errorResult(err);
    }
  };
}

function resolvePropertyId(explicitId) {
  const rawId = explicitId || process.env.GA4_PROPERTY_ID || "552867189";
  if (!rawId) {
    throw new Error(
      "Missing GA4 Property ID. Provide 'property_id' in tool parameters or set the GA4_PROPERTY_ID environment variable."
    );
  }
  return rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;
}

function result(data) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

const server = new McpServer({
  name: "travelframe-google-analytics-readonly",
  version: "0.2.0",
});

server.registerTool(
  "get_ga4_realtime",
  {
    description: "Get real-time active users, top active pages, and countries on TravelFrame website.",
    inputSchema: {
      property_id: z.string().optional().describe("GA4 Property ID (e.g., 123456789 or properties/123456789)"),
    },
  },
  safe(async ({ property_id }) => {
    const client = getAnalyticsClient();
    const property = resolvePropertyId(property_id);
    const [response] = await client.runRealtimeReport({
      property,
      dimensions: [{ name: "unifiedScreenName" }, { name: "country" }],
      metrics: [{ name: "activeUsers" }],
    });
    return result(response);
  })
);

server.registerTool(
  "get_ga4_traffic_overview",
  {
    description: "Get aggregate traffic overview (activeUsers, sessions, screenPageViews, bounceRate, avgSessionDuration).",
    inputSchema: {
      property_id: z.string().optional().describe("GA4 Property ID"),
      start_date: z.string().optional().describe("Start date (format YYYY-MM-DD or relative like '30daysAgo', '7daysAgo'). Default: '30daysAgo'"),
      end_date: z.string().optional().describe("End date (format YYYY-MM-DD or relative like 'today', 'yesterday'). Default: 'today'"),
    },
  },
  safe(async ({ property_id, start_date = "30daysAgo", end_date = "today" }) => {
    const client = getAnalyticsClient();
    const property = resolvePropertyId(property_id);
    const [response] = await client.runReport({
      property,
      dateRanges: [{ startDate: start_date, endDate: end_date }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    });
    return result(response);
  })
);

server.registerTool(
  "get_ga4_top_pages",
  {
    description: "Get top viewed pages/tours on the TravelFrame website.",
    inputSchema: {
      property_id: z.string().optional().describe("GA4 Property ID"),
      start_date: z.string().optional().describe("Start date. Default: '30daysAgo'"),
      end_date: z.string().optional().describe("End date. Default: 'today'"),
      limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (1-100). Default: 20"),
    },
  },
  safe(async ({ property_id, start_date = "30daysAgo", end_date = "today", limit = 20 }) => {
    const client = getAnalyticsClient();
    const property = resolvePropertyId(property_id);
    const [response] = await client.runReport({
      property,
      dateRanges: [{ startDate: start_date, endDate: end_date }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      limit,
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    });
    return result(response);
  })
);

server.registerTool(
  "get_ga4_traffic_sources",
  {
    description: "Get traffic breakdown by channel grouping and source/medium.",
    inputSchema: {
      property_id: z.string().optional().describe("GA4 Property ID"),
      start_date: z.string().optional().describe("Start date. Default: '30daysAgo'"),
      end_date: z.string().optional().describe("End date. Default: 'today'"),
      limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (1-50). Default: 15"),
    },
  },
  safe(async ({ property_id, start_date = "30daysAgo", end_date = "today", limit = 15 }) => {
    const client = getAnalyticsClient();
    const property = resolvePropertyId(property_id);
    const [response] = await client.runReport({
      property,
      dateRanges: [{ startDate: start_date, endDate: end_date }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }, { name: "sessionSourceMedium" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      limit,
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    });
    return result(response);
  })
);

async function doctor() {
  const lines = [];
  const ok = (m) => lines.push(`OK   ${m}`);
  const fail = (m) => lines.push(`FAIL ${m}`);
  ok(`node ${process.version} at ${process.execPath}`);
  let keyPath = null;
  try {
    keyPath = resolveCredentialsPath();
    ok(`service account key found: ${keyPath}`);
  } catch (e) {
    fail(e.message);
  }
  ok(`property: ${resolvePropertyId()}`);
  if (keyPath) {
    try {
      const [res] = await getAnalyticsClient().runReport({
        property: resolvePropertyId(),
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        metrics: [{ name: "activeUsers" }],
      });
      ok(`GA4 query works, activeUsers (7 days) = ${res.rows?.[0]?.metricValues?.[0]?.value ?? 0}`);
    } catch (e) {
      fail(errorResult(e).content[0].text);
    }
  }
  console.log(lines.join("\n"));
  process.exit(lines.some((l) => l.startsWith("FAIL")) ? 1 : 0);
}

if (process.argv.includes("--doctor")) {
  await doctor();
} else {
  await server.connect(new StdioServerTransport());
}
