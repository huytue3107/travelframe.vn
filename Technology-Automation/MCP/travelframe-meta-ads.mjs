import { homedir } from "node:os";
import { pathToFileURL } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { requestNativeApproval } from "./meta-ads/approval.mjs";
import { loadMetaAdsConfig } from "./meta-ads/config.mjs";
import { createMetaClient } from "./meta-ads/meta-client.mjs";
import { createPlanStore } from "./meta-ads/plan-store.mjs";
import { redactSecrets, safeError } from "./meta-ads/redact.mjs";
import {
  activatePlanInputSchema,
  adsInsightsInputSchema,
  applyPlanInputSchema,
  campaignStructureInputSchema,
  changeBudgetInputSchema,
  changePlacementsInputSchema,
  changeScheduleInputSchema,
  changeTargetingInputSchema,
  deliveryStateInputSchema,
  draftCampaignPlanInputSchema,
  draftChangePlanInputSchema,
  getAdAccountInputSchema,
  listAdAccountsInputSchema,
  listCampaignsInputSchema,
  planReferenceInputSchema,
  replaceCreativeInputSchema,
  rollbackPlanInputSchema,
  statusControlInputSchema,
} from "./meta-ads/schemas.mjs";
import { createMetaAdsService } from "./meta-ads/service.mjs";

const TOOL_DEFINITIONS = Object.freeze([
  {
    toolName: "get_ad_account",
    methodName: "getAdAccount",
    schema: getAdAccountInputSchema,
    description:
      "Read the locked TravelFrame ad account and verify its Page and Instagram assets.",
    readOnly: true,
  },
  {
    toolName: "list_ad_accounts",
    methodName: "listAdAccounts",
    schema: listAdAccountsInputSchema,
    description:
      "List Meta ad accounts accessible to the connected user before TravelFrame locks one.",
    readOnly: true,
  },
  {
    toolName: "list_campaigns",
    methodName: "listCampaigns",
    schema: listCampaignsInputSchema,
    description: "List campaigns from the locked TravelFrame ad account.",
    readOnly: true,
  },
  {
    toolName: "get_campaign_structure",
    methodName: "getCampaignStructure",
    schema: campaignStructureInputSchema,
    description: "Read one TravelFrame campaign with its ad sets and ads.",
    readOnly: true,
  },
  {
    toolName: "get_ads_insights",
    methodName: "getAdsInsights",
    schema: adsInsightsInputSchema,
    description:
      "Read allowlisted Meta Ads Insights with reporting metadata and limitations.",
    readOnly: true,
  },
  {
    toolName: "get_delivery_state",
    methodName: "getDeliveryState",
    schema: deliveryStateInputSchema,
    description: "Read configured and effective delivery state for locked objects.",
    readOnly: true,
  },
  {
    toolName: "validate_campaign_plan",
    methodName: "reviewPlan",
    schema: planReferenceInputSchema,
    description: "Validate and preview an immutable local campaign plan.",
    readOnly: true,
  },
  {
    toolName: "draft_campaign_plan",
    methodName: "draftCampaignPlan",
    schema: draftCampaignPlanInputSchema,
    description:
      "Create an immutable local campaign plan. New delivery objects remain PAUSED.",
    readOnly: true,
  },
  {
    toolName: "draft_change_plan",
    methodName: "draftChangePlan",
    schema: draftChangePlanInputSchema,
    description:
      "Create a before-and-after plan for an allowlisted campaign, ad set, or ad change.",
    readOnly: true,
  },
  {
    toolName: "review_plan",
    methodName: "reviewPlan",
    schema: planReferenceInputSchema,
    description: "Review a local plan, digest, targets, warnings, and diff.",
    readOnly: true,
  },
  {
    toolName: "discard_plan",
    methodName: "discardPlan",
    schema: planReferenceInputSchema,
    description: "Discard a pending local plan without calling Meta.",
    readOnly: false,
  },
  {
    toolName: "apply_plan_paused",
    methodName: "applyPlanPaused",
    schema: applyPlanInputSchema,
    description:
      "Apply an approved plan while keeping all newly created delivery objects PAUSED.",
    readOnly: false,
  },
  {
    toolName: "activate_plan",
    methodName: "activatePlan",
    schema: activatePlanInputSchema,
    description:
      "Activate selected objects from a separately approved consumed PAUSED creation plan.",
    readOnly: false,
  },
  {
    toolName: "pause_entities",
    methodName: "pauseEntities",
    schema: statusControlInputSchema,
    description: "Pause selected TravelFrame delivery objects after native approval.",
    readOnly: false,
  },
  {
    toolName: "resume_entities",
    methodName: "resumeEntities",
    schema: statusControlInputSchema,
    description: "Resume selected TravelFrame delivery objects after native approval.",
    readOnly: false,
  },
  {
    toolName: "change_budget",
    methodName: "changeBudget",
    schema: changeBudgetInputSchema,
    description: "Change an allowlisted campaign or ad set budget after native approval.",
    readOnly: false,
  },
  {
    toolName: "change_schedule",
    methodName: "changeSchedule",
    schema: changeScheduleInputSchema,
    description: "Change an allowlisted campaign or ad set schedule after native approval.",
    readOnly: false,
  },
  {
    toolName: "change_targeting",
    methodName: "changeTargeting",
    schema: changeTargetingInputSchema,
    description: "Change ad set targeting after native approval.",
    readOnly: false,
  },
  {
    toolName: "change_placements",
    methodName: "changePlacements",
    schema: changePlacementsInputSchema,
    description: "Change ad set placements after native approval.",
    readOnly: false,
  },
  {
    toolName: "replace_creative",
    methodName: "replaceCreative",
    schema: replaceCreativeInputSchema,
    description:
      "Clone and replace an ad creative, leaving the replacement ad PAUSED.",
    readOnly: false,
  },
  {
    toolName: "rollback_plan",
    methodName: "rollbackPlan",
    schema: rollbackPlanInputSchema,
    description: "Apply a concrete reverse plan after a new native approval.",
    readOnly: false,
  },
]);

// Read-only by default. Write, plan and approval tools are registered only when
// META_ADS_MODE is explicitly "full" (requires Rocky's approval, see runbook).
export const READ_ONLY_TOOL_NAMES = Object.freeze([
  "get_ad_account",
  "list_ad_accounts",
  "list_campaigns",
  "get_campaign_structure",
  "get_ads_insights",
  "get_delivery_state",
]);

export function resolveMetaAdsMode(env = process.env) {
  const raw = typeof env.META_ADS_MODE === "string" ? env.META_ADS_MODE.trim() : "";
  if (raw === "" || raw === "read") return "read";
  if (raw === "full") return "full";
  throw new Error("Invalid META_ADS_MODE");
}

export function selectToolDefinitions(mode) {
  if (mode === "full") return TOOL_DEFINITIONS;
  return TOOL_DEFINITIONS.filter((definition) =>
    READ_ONLY_TOOL_NAMES.includes(definition.toolName),
  );
}

function toolResult(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(redactSecrets(value), null, 2),
      },
    ],
  };
}

function toolError(error) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify(safeError(error), null, 2),
      },
    ],
  };
}

export function createMetaAdsMcpServer({
  env = process.env,
  homeDir = homedir(),
  fetchImpl = fetch,
  approvalRequester = requestNativeApproval,
} = {}) {
  const mode = resolveMetaAdsMode(env);
  const config = loadMetaAdsConfig(env, homeDir);
  const client = createMetaClient({
    graphBase: `https://graph.facebook.com/${config.graphVersion}`,
    token: config.accessToken,
    fetchImpl,
  });
  const planStore = createPlanStore({
    stateDir: config.stateDir,
  });
  const service = createMetaAdsService({
    client,
    config,
    planStore,
    approvalRequester,
  });
  const server = new McpServer({
    name: "travelframe-meta-ads",
    version: "1.0.0",
  });

  for (const definition of selectToolDefinitions(mode)) {
    server.registerTool(
      definition.toolName,
      {
        description: definition.description,
        inputSchema: definition.schema,
        annotations: {
          readOnlyHint: definition.readOnly,
          destructiveHint: false,
          idempotentHint: definition.readOnly,
          openWorldHint: false,
        },
      },
      async (input) => {
        try {
          return toolResult(
            await service[definition.methodName](input ?? {}),
          );
        } catch (error) {
          return toolError(error);
        }
      },
    );
  }

  return server;
}

async function main() {
  const server = createMetaAdsMcpServer();
  await server.connect(new StdioServerTransport());
}

const invokedPath = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : null;
if (invokedPath === import.meta.url) {
  await main();
}
