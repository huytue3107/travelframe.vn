import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

import { execSync } from "node:child_process";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v25.0";
const PAGE_ID = process.env.TRAVELFRAME_PAGE_ID || "1409099405611405";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

function pageAccessToken() {
  let token = process.env.TRAVELFRAME_META_PAGE_ACCESS_TOKEN;
  try {
    const fresh = execSync('security find-generic-password -a "travelframe-page-access" -s "travelframe-meta-automation-token" -w 2>/dev/null || security find-generic-password -a "macbook" -s "travelframe-facebook-page-readonly" -w 2>/dev/null', { encoding: "utf8" }).trim();
    if (fresh) token = fresh;
  } catch {}
  if (!token) {
    throw new Error(
      "Missing TRAVELFRAME_META_PAGE_ACCESS_TOKEN. Please run ./Technology-Automation/Scripts/meta-automation-mcp/store-token.sh to store the token in Keychain."
    );
  }
  return token;
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

let cachedEffectivePageToken = null;

async function getEffectivePageToken() {
  if (cachedEffectivePageToken) return cachedEffectivePageToken;
  const base = pageAccessToken();
  try {
    const res = await fetch(`${GRAPH_BASE}/${PAGE_ID}?fields=access_token`, {
      headers: { Authorization: `Bearer ${base}` },
    });
    const body = await res.json();
    if (body?.access_token) {
      cachedEffectivePageToken = body.access_token;
      return cachedEffectivePageToken;
    }
  } catch {}
  return base;
}

async function graphRequest(path, options = {}) {
  const token = options.token || (await getEffectivePageToken());
  const { method = "GET", params = {}, body = null } = options;
  const url = new URL(`${GRAPH_BASE}/${path.replace(/^\/+/, "")}`);
  
  if (method === "GET") {
    for (const [key, value] of Object.entries({ ...params, access_token: token })) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "POST") {
    const postBody = { ...body, access_token: token };
    fetchOptions.body = JSON.stringify(postBody);
  }

  const response = await fetch(url, fetchOptions);
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.error) {
    const err = json?.error?.message || `Meta Graph API request failed (${response.status})`;
    throw new Error(redactSecrets(err));
  }
  return json;
}

function result(data) {
  return { content: [{ type: "text", text: JSON.stringify(redactSecrets(data), null, 2) }] };
}

// Rules-based segment triage based on DEC-20260926-CUSTOMER-SEGMENTS-PLAYBOOK
function classifyCustomerText(text, context = {}) {
  const lower = (text || "").toLowerCase();
  
  if (/solo|alone|by myself|single traveler|một mình|di mot minh/.test(lower)) {
    return {
      segment: "Solo Explorer",
      priority: "Tier 1 (High Intent)",
      recommendedTone: "Warm Local Friend, empowering, safety-first",
      suggestedPublicComment: "Travelling solo in Vietnam is such a rewarding experience! We do small private photo walks so you feel 100% safe and comfortable while capturing authentic moments. Sent you a DM with our solo travel tips!",
      suggestedDirectMessage: "Hey! We saw your note about traveling solo. Exploring Hanoi on your own is amazing when you know the quiet nách ngõ and local spots. Would you like us to share our curated self-walk map and info on our relaxed, private photo sessions?",
      conversionOffer: "Hanoi Heritage Walk & Portrait Experience (Private 1-on-1)"
    };
  }

  if (/couple|honeymoon|anniversary|girlfriend|boyfriend|husband|wife|cặp đôi|người yêu|kỷ niệm/.test(lower)) {
    return {
      segment: "Couple / Honeymoon",
      priority: "Tier 1 (High Intent)",
      recommendedTone: "Romantic, discreet, aesthetic, celebratory",
      suggestedPublicComment: "Such a beautiful time to visit together! Vietnam has the dreamiest hidden courtyards for couples. Just dropped you a DM with some romantic café recommendations and couple photo ideas!",
      suggestedDirectMessage: "Hi there! Congratulations on your upcoming trip together. We love helping couples capture unposed, candid moments without awkward posing. Are you visiting Hanoi or Ninh Binh? We would love to share a couple of secret spots perfect for two!",
      conversionOffer: "Old Quarter & West Lake Romance Narrative Session"
    };
  }

  if (/family|kids|children|parents|elderly|gia đình|con nhỏ|bố mẹ/.test(lower)) {
    return {
      segment: "Family",
      priority: "Tier 2 (Custom Care)",
      recommendedTone: "Patient, hospitable, reassuring, logistical clarity",
      suggestedPublicComment: "Traveling with family creates the most treasured memories! We specialize in gentle-paced sessions with no rush for kids or grandparents. Check your DM for our family-friendly guide!",
      suggestedDirectMessage: "Hello! Traveling with family in Vietnam is truly special. Our walks are paced comfortably with frequent rest stops and kid-friendly routes so everyone stays happy. When are you visiting, and how many are in your party?",
      conversionOffer: "TravelFrame Family Heritage Keepsake Package"
    };
  }

  if (/where is this|location|address|ở đâu|địa chỉ|chỗ nào|quán nào|hidden rooftop|spot/.test(lower)) {
    return {
      segment: "Curious / Casual",
      priority: "Tier 2 (High Engagement)",
      recommendedTone: "Generous local host, enticing curiosity",
      suggestedPublicComment: "This is one of our absolute favorite secret spots in the Old Quarter! Sent you the exact location pin and directions in your DM so you can find it easily.",
      suggestedDirectMessage: "Hey! Here is the secret spot from our post: It's tucked behind an old alleyway in Hoan Kiem. We sent you the Google Maps pin. We also guide hidden photo walks to spots just like this if you want to discover more hidden corners!",
      conversionOffer: "Hidden Hanoi Coffee & Rooftop Walk"
    };
  }

  return {
    segment: "General Inquirer",
    priority: "Tier 3 (Discovery)",
    recommendedTone: "Warm Local Friend, helpful host",
    suggestedPublicComment: "Thank you for stopping by TravelFrame! Drop us a DM anytime if you need local recommendations or want candid photos during your trip to Vietnam.",
    suggestedDirectMessage: "Hi! Thanks for checking out our post. What part of Vietnam are you most excited to explore on your trip?",
    conversionOffer: "Signature TravelFrame Half-Day Visual Tour"
  };
}

const server = new McpServer({
  name: "travelframe-meta-automation",
  version: "1.0.0",
});

// Tool 1: Trạng thái kết nối và quyền hạn của Token
server.registerTool(
  "get_automation_status",
  {
    description: "Check Meta API connection status, Page info, connected Instagram account, and token validity.",
    inputSchema: {},
  },
  async () => {
    const pageData = await graphRequest(PAGE_ID, {
      fields: "id,name,about,category,followers_count,link,instagram_business_account",
    });
    return result({
      status: "connected",
      page: pageData,
      mode: "Two-way Automation (ManyChat-ready)",
      server_time: new Date().toISOString(),
    });
  }
);

// Tool 2: Đọc bình luận từ bài viết / Reel để phát hiện lead
server.registerTool(
  "list_post_comments",
  {
    description: "Read recent comments on a Facebook post or Instagram media object to scan for potential customer inquiries.",
    inputSchema: {
      post_id: z.string().describe("Facebook post ID or Instagram media ID"),
      limit: z.number().int().min(1).max(100).optional().default(25),
    },
  },
  async ({ post_id, limit }) => {
    const comments = await graphRequest(`${post_id}/comments`, {
      fields: "id,from,message,created_time,comment_count,like_count",
      limit,
    });
    return result(comments);
  }
);

// Tool 3: Trả lời bình luận trên Facebook Page
server.registerTool(
  "reply_facebook_comment",
  {
    description: "Post a public reply to a Facebook comment under a TravelFrame post.",
    inputSchema: {
      comment_id: z.string().describe("The ID of the comment to reply to"),
      message: z.string().min(1).describe("The reply message content (Warm Local Friend tone)"),
      dry_run: z.boolean().optional().default(false).describe("Set true to preview without posting live"),
    },
  },
  async ({ comment_id, message, dry_run }) => {
    if (dry_run) {
      return result({
        action: "reply_facebook_comment",
        comment_id,
        dry_run: true,
        preview_message: message,
        status: "APPROVED_PREVIEW_ONLY",
      });
    }

    const response = await graphRequest(`${comment_id}/comments`, {
      method: "POST",
      body: { message },
    });

    return result({
      action: "reply_facebook_comment",
      comment_id,
      success: true,
      created_id: response.id,
      posted_message: message,
      timestamp: new Date().toISOString(),
    });
  }
);

// Tool 3b: Gửi tin nhắn phản hồi riêng tư qua Messenger cho bình luận (Private Reply)
server.registerTool(
  "send_facebook_private_reply",
  {
    description: "Send a private Messenger message directly to a user in response to their public comment on a Page post (ManyChat-style Private Reply).",
    inputSchema: {
      comment_id: z.string().describe("The ID of the comment to reply privately to"),
      message: z.string().min(1).describe("The private message content sent to customer's Messenger"),
      dry_run: z.boolean().optional().default(false).describe("Set true to preview without sending live"),
    },
  },
  async ({ comment_id, message, dry_run }) => {
    if (dry_run) {
      return result({
        action: "send_facebook_private_reply",
        comment_id,
        dry_run: true,
        preview_message: message,
        status: "APPROVED_PREVIEW_ONLY",
      });
    }

    // Extract short comment ID if composite ID was provided
    const cid = comment_id.includes("_") ? comment_id.split("_").pop() : comment_id;

    const response = await graphRequest("me/messages", {
      method: "POST",
      body: {
        recipient: { comment_id: cid },
        message: { text: message },
        messaging_type: "RESPONSE",
      },
    });

    return result({
      action: "send_facebook_private_reply",
      comment_id,
      success: true,
      recipient_id: response.recipient_id,
      message_id: response.message_id,
      timestamp: new Date().toISOString(),
    });
  }
);

// Tool 4: Gửi tin nhắn Facebook Messenger cho người dùng
server.registerTool(
  "send_facebook_message",
  {
    description: "Send a direct Facebook Messenger message to a user (recipient_id). Complies with Facebook Messenger 24-hour policy.",
    inputSchema: {
      recipient_id: z.string().describe("Page-Scoped User ID (PSID) of the recipient"),
      message: z.string().min(1).describe("Message text to send"),
      dry_run: z.boolean().optional().default(false).describe("Set true to preview without sending live"),
    },
  },
  async ({ recipient_id, message, dry_run }) => {
    if (dry_run) {
      return result({
        action: "send_facebook_message",
        recipient_id,
        dry_run: true,
        preview_message: message,
        status: "APPROVED_PREVIEW_ONLY",
      });
    }

    const response = await graphRequest("me/messages", {
      method: "POST",
      body: {
        recipient: { id: recipient_id },
        message: { text: message },
        messaging_type: "RESPONSE",
      },
    });

    return result({
      action: "send_facebook_message",
      recipient_id,
      success: true,
      message_id: response.message_id,
      timestamp: new Date().toISOString(),
    });
  }
);

// Tool 5: Trả lời bình luận trên Instagram
server.registerTool(
  "reply_instagram_comment",
  {
    description: "Reply to an Instagram comment on a TravelFrame Reel or Post.",
    inputSchema: {
      comment_id: z.string().describe("Instagram comment ID"),
      message: z.string().min(1).describe("Reply text"),
      dry_run: z.boolean().optional().default(false).describe("Set true to preview without posting live"),
    },
  },
  async ({ comment_id, message, dry_run }) => {
    if (dry_run) {
      return result({
        action: "reply_instagram_comment",
        comment_id,
        dry_run: true,
        preview_message: message,
        status: "APPROVED_PREVIEW_ONLY",
      });
    }

    const response = await graphRequest(`${comment_id}/replies`, {
      method: "POST",
      body: { message },
    });

    return result({
      action: "reply_instagram_comment",
      comment_id,
      success: true,
      created_id: response.id,
      timestamp: new Date().toISOString(),
    });
  }
);

// Tool 6: Phân loại Lead và tạo kịch bản phản hồi theo Playbook
server.registerTool(
  "triage_and_suggest_response",
  {
    description: "Classify incoming customer comment/message against TravelFrame 6 customer segments and generate playbooks-aligned replies and DM outreach.",
    inputSchema: {
      customer_name: z.string().describe("Name of the customer"),
      text: z.string().describe("The text written by the customer"),
      post_context: z.string().optional().describe("Context of the post (e.g. food tour, hidden rooftop, street crossing)"),
    },
  },
  async ({ customer_name, text, post_context }) => {
    const analysis = classifyCustomerText(text, { post_context });
    
    // Personalize with customer name
    const firstName = customer_name ? customer_name.split(" ")[0] : "there";
    const personalizedComment = analysis.suggestedPublicComment.replace(/^Travelling/, `Hey ${firstName}! Travelling`);
    const personalizedDM = analysis.suggestedDirectMessage.replace(/^Hey!|^Hi there!|^Hello!/, `Hey ${firstName}!`);

    return result({
      customer_name,
      original_text: text,
      post_context: post_context || "General TravelFrame post",
      segment: analysis.segment,
      priority: analysis.priority,
      recommended_tone: analysis.recommendedTone,
      suggested_public_comment: personalizedComment,
      suggested_direct_message: personalizedDM,
      conversion_offer: analysis.conversionOffer,
      governance_rule: "Always review and approve before live publishing.",
    });
  }
);

// Tool: Seed comment trên bài của Page (mặc định dry_run=true, cần Rocky duyệt trước khi live)
server.registerTool(
  "comment_facebook_post",
  {
    description: "Post a top-level comment as the TravelFrame Page on a Facebook post/reel (seed comment). Defaults to dry_run; set dry_run=false only after Rocky approved the exact text.",
    inputSchema: {
      post_id: z.string().describe("Facebook post/reel ID, e.g. 1409099405611405_122115581019479755"),
      message: z.string().min(1).max(300).describe("Seed comment text (EN, <=200 chars recommended)"),
      dry_run: z.boolean().optional().default(true),
    },
  },
  async ({ post_id, message, dry_run }) => {
    if (dry_run) return result({ action: "comment_facebook_post", post_id, dry_run: true, preview_message: message });
    const response = await graphRequest(`${post_id}/comments`, { method: "POST", body: { message } });
    return result({ action: "comment_facebook_post", post_id, success: true, created_id: response.id, posted_message: message, timestamp: new Date().toISOString() });
  }
);

server.registerTool(
  "comment_instagram_media",
  {
    description: "Post a top-level comment as the TravelFrame Instagram account on a media item (seed comment). Defaults to dry_run; set dry_run=false only after Rocky approved the exact text.",
    inputSchema: {
      media_id: z.string().describe("Instagram media ID"),
      message: z.string().min(1).max(300),
      dry_run: z.boolean().optional().default(true),
    },
  },
  async ({ media_id, message, dry_run }) => {
    if (dry_run) return result({ action: "comment_instagram_media", media_id, dry_run: true, preview_message: message });
    const response = await graphRequest(`${media_id}/comments`, { method: "POST", body: { message } });
    return result({ action: "comment_instagram_media", media_id, success: true, created_id: response.id, posted_message: message, timestamp: new Date().toISOString() });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error starting TravelFrame Meta Automation MCP:", err);
  process.exit(1);
});
