import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

function getAnalyticsClient() {
  try {
    return new BetaAnalyticsDataClient();
  } catch (err) {
    throw new Error(
      `Failed to initialize Google Analytics client: ${err.message}. ` +
      `Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable points to a valid service account JSON key.`
    );
  }
}

function resolvePropertyId(explicitId) {
  const rawId = explicitId || process.env.GA4_PROPERTY_ID;
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
  version: "0.1.0",
});

server.registerTool(
  "get_ga4_realtime",
  {
    description: "Get real-time active users, top active pages, and countries on TravelFrame website.",
    inputSchema: {
      property_id: z.string().optional().describe("GA4 Property ID (e.g., 123456789 or properties/123456789)"),
    },
  },
  async ({ property_id }) => {
    const client = getAnalyticsClient();
    const property = resolvePropertyId(property_id);
    const [response] = await client.runRealtimeReport({
      property,
      dimensions: [{ name: "unifiedScreenName" }, { name: "country" }],
      metrics: [{ name: "activeUsers" }],
    });
    return result(response);
  }
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
  async ({ property_id, start_date = "30daysAgo", end_date = "today" }) => {
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
  }
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
  async ({ property_id, start_date = "30daysAgo", end_date = "today", limit = 20 }) => {
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
  }
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
  async ({ property_id, start_date = "30daysAgo", end_date = "today", limit = 15 }) => {
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
  }
);

await server.connect(new StdioServerTransport());
