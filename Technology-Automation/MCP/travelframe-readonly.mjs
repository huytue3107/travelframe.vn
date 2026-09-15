import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v25.0";
const PAGE_ID = process.env.TRAVELFRAME_PAGE_ID || "1409099405611405";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

function accessToken() {
  const token = process.env.TRAVELFRAME_META_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Missing TRAVELFRAME_META_ACCESS_TOKEN.");
  }
  return token;
}

async function graphGet(path, params = {}) {
  const url = new URL(`${GRAPH_BASE}/${path.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries({ ...params, access_token: accessToken() })) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url);
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.error) {
    throw new Error(body?.error?.message || `Meta Graph API request failed (${response.status})`);
  }
  return body;
}

function redactSecrets(value) {
  if (typeof value === "string") {
    return value.replace(/([?&]access_token=)[^&\s"]+/gi, "$1[REDACTED]");
  }
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        key.toLowerCase() === "access_token" ? "[REDACTED]" : redactSecrets(entry),
      ])
    );
  }
  return value;
}

function result(data) {
  return { content: [{ type: "text", text: JSON.stringify(redactSecrets(data), null, 2) }] };
}

const server = new McpServer({
  name: "travelframe-meta-readonly",
  version: "0.1.0",
});

server.registerTool(
  "get_travelframe_connection",
  {
    description: "Read the TravelFrame Facebook Page and connected Instagram Business Account.",
    inputSchema: {},
  },
  async () => result(await graphGet(PAGE_ID, { fields: "id,name,instagram_business_account" }))
);

server.registerTool(
  "get_instagram_profile",
  {
    description: "Read the connected TravelFrame Instagram profile.",
    inputSchema: {
      instagram_account_id: z.string().optional(),
    },
  },
  async ({ instagram_account_id }) => {
    const connection = await graphGet(PAGE_ID, { fields: "instagram_business_account" });
    const id = instagram_account_id || connection?.instagram_business_account?.id;
    if (!id) throw new Error("No Instagram Business Account is connected.");
    return result(
      await graphGet(id, {
        fields: "id,username,name,biography,website,followers_count,follows_count,media_count",
      })
    );
  }
);

server.registerTool(
  "list_instagram_media",
  {
    description: "Read recent media published by the connected TravelFrame Instagram account.",
    inputSchema: {
      limit: z.number().int().min(1).max(100).optional(),
      after: z.string().optional(),
    },
  },
  async ({ limit = 25, after }) => {
    const connection = await graphGet(PAGE_ID, { fields: "instagram_business_account" });
    const id = connection?.instagram_business_account?.id;
    if (!id) throw new Error("No Instagram Business Account is connected.");
    return result(
      await graphGet(`${id}/media`, {
        fields: "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count",
        limit,
        after,
      })
    );
  }
);

server.registerTool(
  "get_instagram_insights",
  {
    description: "Read account-level Instagram Insights for the connected TravelFrame account.",
    inputSchema: {
      metrics: z.string().optional(),
      period: z.string().optional(),
      metric_type: z.string().optional(),
      since: z.string().optional(),
      until: z.string().optional(),
    },
  },
  async ({
    metrics = "reach,views,accounts_engaged",
    period = "day",
    metric_type,
    since,
    until,
  }) => {
    const connection = await graphGet(PAGE_ID, { fields: "instagram_business_account" });
    const id = connection?.instagram_business_account?.id;
    if (!id) throw new Error("No Instagram Business Account is connected.");
    const requestedMetrics = metrics.split(",").map((metric) => metric.trim()).filter(Boolean);
    const needsTotalValue = requestedMetrics.some((metric) =>
      ["views", "accounts_engaged"].includes(metric)
    );
    return result(
      await graphGet(`${id}/insights`, {
        metric: metrics,
        period,
        metric_type: metric_type || (needsTotalValue ? "total_value" : undefined),
        since,
        until,
      })
    );
  }
);

await server.connect(new StdioServerTransport());
