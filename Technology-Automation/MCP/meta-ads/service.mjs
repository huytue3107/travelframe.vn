import { requestNativeApproval } from "./approval.mjs";
import { redactSecrets, safeError } from "./redact.mjs";
import { sha256Digest } from "./plan-store.mjs";
import {
  activatePlanInputSchema,
  applyPlanInputSchema,
  adsInsightsInputSchema,
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
} from "./schemas.mjs";

const ACCOUNT_FIELDS = [
  "id",
  "account_id",
  "name",
  "account_status",
  "disable_reason",
  "currency",
  "timezone_name",
  "timezone_offset_hours_utc",
  "amount_spent",
  "balance",
  "spend_cap",
  "business",
  "owner",
].join(",");

const CAMPAIGN_FIELDS = [
  "id",
  "account_id",
  "name",
  "objective",
  "buying_type",
  "status",
  "effective_status",
  "daily_budget",
  "lifetime_budget",
  "bid_strategy",
  "budget_remaining",
  "start_time",
  "stop_time",
  "special_ad_categories",
  "created_time",
  "updated_time",
].join(",");

const AD_SET_FIELDS = [
  "id",
  "account_id",
  "campaign_id",
  "name",
  "status",
  "effective_status",
  "daily_budget",
  "lifetime_budget",
  "billing_event",
  "optimization_goal",
  "bid_strategy",
  "bid_amount",
  "start_time",
  "end_time",
  "targeting",
  "promoted_object",
  "created_time",
  "updated_time",
].join(",");

const AD_FIELDS = [
  "id",
  "account_id",
  "campaign_id",
  "adset_id",
  "name",
  "status",
  "effective_status",
  "creative{id,name,object_story_id,actor_id}",
  "tracking_specs",
  "issues_info",
  "created_time",
  "updated_time",
].join(",");

const DELIVERY_FIELDS = [
  "id",
  "account_id",
  "name",
  "status",
  "configured_status",
  "effective_status",
  "issues_info",
  "review_feedback",
].join(",");

const PAGE_FIELDS = [
  "id",
  "name",
  "instagram_business_account",
].join(",");

const REPORTING_LIMITATIONS = Object.freeze([
  "Meta attribution and action definitions depend on the ad account configuration.",
  "Platform actions are not verified bookings or recognized revenue.",
]);

function nowIso(clock) {
  const raw = typeof clock?.now === "function" ? clock.now() : new Date();
  const date = raw instanceof Date ? raw : new Date(raw);
  if (!Number.isFinite(date.getTime())) {
    throw new Error("Clock returned an invalid timestamp");
  }
  return date.toISOString();
}

function lockedAssets(config) {
  return {
    ad_account_id: config.adAccountId,
    page_id: config.pageId,
    instagram_account_id: config.instagramAccountId,
  };
}

function compactJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => compactJsonValue(item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, compactJsonValue(item)]),
    );
  }
  return value;
}

function assertAccountIdentity(account, config) {
  if (!account || account.id !== config.adAccountId) {
    throw new Error("Meta returned an unexpected ad account identity");
  }
  return account;
}

function numericAccountId(config) {
  return config.adAccountId.replace(/^act_/, "");
}

function assertObjectOwnership(object, config) {
  const expected = new Set([config.adAccountId, numericAccountId(config)]);
  if (!object || !expected.has(String(object.account_id ?? ""))) {
    throw new Error("Meta object belongs to an unexpected ad account");
  }
  return object;
}

function assertPageLinkage(page, config) {
  const instagramAccountId = page?.instagram_business_account?.id;
  if (
    page?.id !== config.pageId ||
    instagramAccountId !== config.instagramAccountId
  ) {
    throw new Error("Meta returned unexpected Page or Instagram asset linkage");
  }
  return {
    page_id: page.id,
    page_name: page.name ?? null,
    instagram_account_id: instagramAccountId,
  };
}

export function createMetaAdsService({
  client,
  config,
  clock = { now: () => new Date() },
  planStore,
  approvalRequester,
}) {
  if (!client || typeof client.get !== "function") {
    throw new TypeError("Meta Ads service requires a client");
  }
  if (!config?.pageId || !config?.instagramAccountId) {
    throw new TypeError("Meta Ads service requires locked TravelFrame assets");
  }

  function requireConfiguredAdAccount() {
    if (!config.adAccountId) {
      throw new Error(
        "TravelFrame Meta ad account ID is not configured; call list_ad_accounts, then lock the verified account locally",
      );
    }
    return config.adAccountId;
  }

  async function readAccount() {
    const adAccountId = requireConfiguredAdAccount();
    return assertAccountIdentity(
      await client.get(adAccountId, {
        fields: ACCOUNT_FIELDS,
      }),
      config,
    );
  }

  async function readPageLinkage() {
    return assertPageLinkage(
      await client.get(config.pageId, {
        fields: PAGE_FIELDS,
      }),
      config,
    );
  }

  async function getAdAccount(input = {}) {
    getAdAccountInputSchema.parse(input);
    const [account, assetVerification] = await Promise.all([
      readAccount(),
      readPageLinkage(),
    ]);
    return redactSecrets({
      account,
      locked_assets: lockedAssets(config),
      asset_verification: assetVerification,
      captured_at: nowIso(clock),
    });
  }

  async function listAdAccounts(input = {}) {
    const parsed = listAdAccountsInputSchema.parse(input);
    const response = await client.get("me/adaccounts", {
      fields: ACCOUNT_FIELDS,
      limit: parsed.limit,
      after: parsed.after,
    });
    return redactSecrets({
      ...response,
      configured_account_id: config.adAccountId,
      locked_assets: lockedAssets(config),
      selection_required: !config.adAccountId,
      captured_at: nowIso(clock),
    });
  }

  async function listCampaigns(input = {}) {
    const parsed = listCampaignsInputSchema.parse(input);
    const adAccountId = requireConfiguredAdAccount();
    const params = {
      fields: CAMPAIGN_FIELDS,
      limit: parsed.limit,
      after: parsed.after,
    };
    if (parsed.effective_status) {
      params.filtering = JSON.stringify([
        {
          field: "effective_status",
          operator: "IN",
          value: parsed.effective_status,
        },
      ]);
    }
    const response = await client.get(
      `${adAccountId}/campaigns`,
      params,
    );
    return redactSecrets({
      ...response,
      account_id: adAccountId,
      captured_at: nowIso(clock),
    });
  }

  async function getCampaignStructure(input) {
    const parsed = campaignStructureInputSchema.parse(input);
    const adAccountId = requireConfiguredAdAccount();
    const campaign = assertObjectOwnership(
      await client.get(parsed.campaign_id, {
        fields: CAMPAIGN_FIELDS,
      }),
      config,
    );
    const [adSets, ads] = await Promise.all([
      client.get(`${parsed.campaign_id}/adsets`, {
        fields: AD_SET_FIELDS,
        limit: 100,
      }),
      client.get(`${parsed.campaign_id}/ads`, {
        fields: AD_FIELDS,
        limit: 100,
      }),
    ]);
    return redactSecrets({
      campaign,
      ad_sets: adSets,
      ads,
      account_id: adAccountId,
      captured_at: nowIso(clock),
    });
  }

  async function getAdsInsights(input) {
    const parsed = adsInsightsInputSchema.parse(input);
    const adAccountId = requireConfiguredAdAccount();
    const objectPath = parsed.object_id ?? adAccountId;
    if (parsed.object_id) {
      assertObjectOwnership(
        await client.get(parsed.object_id, {
          fields: "id,account_id",
        }),
        config,
      );
    }
    const [account, insights] = await Promise.all([
      readAccount(),
      client.get(`${objectPath}/insights`, {
        fields: parsed.fields.join(","),
        level: parsed.level,
        time_range: JSON.stringify(parsed.date_range),
        breakdowns: parsed.breakdowns?.join(","),
        time_increment: parsed.time_increment,
        limit: parsed.limit,
        after: parsed.after,
      }),
    ]);

    return redactSecrets({
      ...insights,
      reporting: {
        account_id: adAccountId,
        level: parsed.level,
        reporting_start: parsed.date_range.since,
        reporting_end: parsed.date_range.until,
        captured_at: nowIso(clock),
        account_timezone: account.timezone_name ?? null,
        currency: account.currency ?? null,
        requested_fields: parsed.fields,
        breakdowns: parsed.breakdowns ?? [],
        limitations: [...REPORTING_LIMITATIONS],
      },
    });
  }

  async function getDeliveryState(input) {
    const parsed = deliveryStateInputSchema.parse(input);
    const adAccountId = requireConfiguredAdAccount();
    const objects = await Promise.all(
      parsed.object_ids.map((objectId) =>
        client.get(objectId, {
          fields: DELIVERY_FIELDS,
        }),
      ),
    );
    for (const object of objects) {
      assertObjectOwnership(object, config);
    }
    return redactSecrets({
      objects,
      account_id: adAccountId,
      captured_at: nowIso(clock),
    });
  }

  function requirePlanStoreMethod(method) {
    if (!planStore || typeof planStore[method] !== "function") {
      throw new Error("Meta Ads plan store is not configured");
    }
    return planStore;
  }

  function campaignBudgetPayload(budget) {
    if (budget.strategy === "CAMPAIGN_DAILY") {
      return { daily_budget: budget.daily_budget };
    }
    if (budget.strategy === "CAMPAIGN_LIFETIME") {
      return { lifetime_budget: budget.lifetime_budget };
    }
    return {};
  }

  function adSetBudgetPayload(adSet, strategy) {
    if (strategy === "ADSET_DAILY") {
      return { daily_budget: adSet.daily_budget };
    }
    if (strategy === "ADSET_LIFETIME") {
      return { lifetime_budget: adSet.lifetime_budget };
    }
    return {};
  }

  function creativeStorySpec(creative, actor) {
    const common = {
      message: creative.primary_text,
      name: creative.headline,
      description: creative.description,
      call_to_action: creative.call_to_action,
    };
    return {
      page_id: actor.page_id,
      instagram_actor_id: actor.instagram_account_id,
      ...(creative.image_hash
        ? {
            link_data: {
              ...common,
              link: creative.call_to_action.value.link,
              image_hash: creative.image_hash,
            },
          }
        : {
            video_data: {
              ...common,
              video_id: creative.video_id,
            },
          }),
    };
  }

  function campaignOperations(input) {
    const operations = [
      {
        operation_id: "campaign",
        action: "create",
        entity: "campaign",
        endpoint: `${config.adAccountId}/campaigns`,
        payload: {
          name: input.name,
          objective: input.objective,
          buying_type: input.buying_type,
          special_ad_categories: input.special_ad_categories,
          spend_cap: input.budget.campaign_spend_limit,
          ...campaignBudgetPayload(input.budget),
          status: "PAUSED",
        },
        expected: {
          name: input.name,
          status: "PAUSED",
        },
      },
    ];

    for (const creative of input.creatives) {
      operations.push({
        operation_id: `creative:${creative.key}`,
        action: "create",
        entity: "creative",
        endpoint: `${config.adAccountId}/adcreatives`,
        payload: {
          name: creative.name,
          object_story_spec: creativeStorySpec(creative, input.actor),
        },
        expected: {
          name: creative.name,
        },
      });
    }

    const placementTargeting = {
      publisher_platforms: input.placements.publisher_platforms,
      facebook_positions: input.placements.facebook_positions,
      instagram_positions: input.placements.instagram_positions,
      messenger_positions: input.placements.messenger_positions,
      audience_network_positions:
        input.placements.audience_network_positions,
    };
    for (const adSet of input.ad_sets) {
      operations.push({
        operation_id: `ad_set:${adSet.key}`,
        action: "create",
        entity: "ad_set",
        endpoint: `${config.adAccountId}/adsets`,
        payload: {
          name: adSet.name,
          campaign_id: "$campaign.id",
          ...adSetBudgetPayload(adSet, input.budget.strategy),
          billing_event: adSet.billing_event,
          optimization_goal: adSet.optimization_goal,
          bid_strategy: adSet.bid_strategy,
          bid_amount: adSet.bid_amount,
          start_time: input.schedule.start_time,
          end_time: input.schedule.end_time,
          targeting: {
            ...input.audience.targeting,
            geo_locations: input.audience.locations,
            age_min: input.audience.age_min,
            age_max: input.audience.age_max,
            genders: input.audience.genders,
            ...placementTargeting,
          },
          status: "PAUSED",
        },
        expected: {
          name: adSet.name,
          status: "PAUSED",
        },
      });
    }

    for (const ad of input.ads) {
      operations.push({
        operation_id: `ad:${ad.key}`,
        action: "create",
        entity: "ad",
        endpoint: `${config.adAccountId}/ads`,
        payload: {
          name: ad.name,
          adset_id: `$ad_set:${ad.ad_set_key}.id`,
          creative: {
            creative_id: `$creative:${ad.creative_key}.id`,
          },
          tracking_specs: ad.tracking_specs,
          status: "PAUSED",
        },
        expected: {
          name: ad.name,
          status: "PAUSED",
        },
      });
    }
    return compactJsonValue(operations);
  }

  async function draftCampaignPlan(input) {
    const parsed = draftCampaignPlanInputSchema.parse(input);
    if (
      parsed.actor.page_id !== config.pageId ||
      parsed.actor.instagram_account_id !== config.instagramAccountId
    ) {
      throw new Error("Campaign actor does not match locked TravelFrame assets");
    }
    const account = await readAccount();
    if (parsed.budget.currency !== account.currency) {
      throw new Error(
        `Campaign currency must match the locked ad account currency ${account.currency}`,
      );
    }
    if (parsed.schedule.timezone !== account.timezone_name) {
      throw new Error(
        `Campaign timezone must match the locked ad account timezone ${account.timezone_name}`,
      );
    }

    const operations = campaignOperations(parsed);
    const plan = await requirePlanStoreMethod("createPlan").createPlan({
      requested_action: "create_campaign_paused",
      target_object_ids: [parsed.internal_campaign_id],
      locked_assets: lockedAssets(config),
      business_owner: parsed.business_owner,
      approval_reason: parsed.approval_reason,
      source_document: parsed.source_document,
      conversion_destination: parsed.conversion_destination,
      budget: parsed.budget,
      schedule: parsed.schedule,
      audience: parsed.audience,
      placements: parsed.placements,
      maximum_planned_spend: parsed.budget.campaign_spend_limit,
      operations,
      reverse_plan: {
        requested_action: "pause_created_entities",
        targets: operations
          .filter((operation) =>
            ["campaign", "ad_set", "ad"].includes(operation.entity),
          )
          .map((operation) => `$${operation.operation_id}.id`),
      },
    });

    return redactSecrets({
      plan,
      preview: {
        action: "Create TravelFrame campaign as PAUSED",
        operation_count: operations.length,
        initial_status: "PAUSED",
        activation_required: true,
        currency: parsed.budget.currency,
        maximum_planned_spend: parsed.budget.campaign_spend_limit,
        schedule: parsed.schedule,
      },
    });
  }

  function changeReadFields(objectType) {
    if (objectType === "campaign") {
      return CAMPAIGN_FIELDS;
    }
    if (objectType === "ad_set") {
      return AD_SET_FIELDS;
    }
    return AD_FIELDS;
  }

  async function draftChangePlan(input) {
    const parsed = draftChangePlanInputSchema.parse(input);
    requireConfiguredAdAccount();
    const before = assertObjectOwnership(
      await client.get(parsed.object_id, {
        fields: changeReadFields(parsed.object_type),
      }),
      config,
    );
    const reversePayload = Object.fromEntries(
      Object.keys(parsed.changes).map((field) => [field, before[field] ?? null]),
    );
    const diff = Object.entries(parsed.changes).map(([field, after]) => ({
      field,
      before: before[field] ?? null,
      after,
    }));
    const operation = {
      operation_id: `update:${parsed.object_type}:${parsed.object_id}`,
      action: "update",
      entity: parsed.object_type,
      endpoint: parsed.object_id,
      payload: parsed.changes,
      expected: parsed.changes,
    };
    const plan = await requirePlanStoreMethod("createPlan").createPlan({
      requested_action: `change_${parsed.object_type}`,
      target_object_ids: [parsed.object_id],
      locked_assets: lockedAssets(config),
      reason: parsed.reason,
      source_document: parsed.source_document,
      before_snapshot: before,
      before_state_digest: sha256Digest(before),
      after_proposal: {
        ...before,
        ...parsed.changes,
      },
      diff,
      warnings: [
        "Meta delivery or review state can change independently of configured fields.",
      ],
      operations: [operation],
      reverse_plan: {
        requested_action: `rollback_${parsed.object_type}`,
        target_object_ids: [parsed.object_id],
        operations: [
          {
            ...operation,
            operation_id: `rollback:${parsed.object_type}:${parsed.object_id}`,
            payload: reversePayload,
            expected: reversePayload,
          },
        ],
      },
    });
    return redactSecrets({
      plan,
      preview: {
        action: `Change ${parsed.object_type} ${parsed.object_id}`,
        diff,
        warning: "Changes are not applied until approved",
      },
    });
  }

  async function reviewPlan(input) {
    const parsed = planReferenceInputSchema.parse(input);
    const plan = await requirePlanStoreMethod("getPlan").getPlan(parsed.plan_id);
    if (!plan) {
      throw new Error(`Plan not found: ${parsed.plan_id}`);
    }
    return redactSecrets({
      plan,
      preview: {
        action: plan.input?.requested_action ?? null,
        targets: plan.input?.target_object_ids ?? [],
        diff: plan.input?.diff ?? [],
        warnings: plan.input?.warnings ?? [],
      },
    });
  }

  async function discardPlan(input) {
    const parsed = planReferenceInputSchema.parse(input);
    return redactSecrets(
      await requirePlanStoreMethod("discardPlan").discardPlan(parsed.plan_id),
    );
  }

  function resolvePlanReferences(value, resolvedIds) {
    if (typeof value === "string") {
      const match = /^\$([a-z0-9:_-]+)\.id$/i.exec(value);
      if (!match) {
        return value;
      }
      const resolved = resolvedIds[match[1]];
      if (!resolved) {
        throw new Error(`Unresolved plan dependency: ${match[1]}`);
      }
      return resolved;
    }
    if (Array.isArray(value)) {
      return value.map((item) => resolvePlanReferences(item, resolvedIds));
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          resolvePlanReferences(item, resolvedIds),
        ]),
      );
    }
    return value;
  }

  function assertPlanOperation(operation) {
    if (
      !operation ||
      typeof operation !== "object" ||
      !["create", "update"].includes(operation.action) ||
      !["campaign", "creative", "ad_set", "ad"].includes(operation.entity) ||
      typeof operation.operation_id !== "string" ||
      typeof operation.endpoint !== "string" ||
      !operation.payload ||
      typeof operation.payload !== "object" ||
      Array.isArray(operation.payload) ||
      !operation.expected ||
      typeof operation.expected !== "object" ||
      Array.isArray(operation.expected)
    ) {
      throw new Error("Plan contains an invalid operation");
    }

    if (operation.action === "create") {
      const expectedEndpoint = {
        campaign: `${config.adAccountId}/campaigns`,
        creative: `${config.adAccountId}/adcreatives`,
        ad_set: `${config.adAccountId}/adsets`,
        ad: `${config.adAccountId}/ads`,
      }[operation.entity];
      if (operation.endpoint !== expectedEndpoint) {
        throw new Error("Plan create operation targets an unexpected endpoint");
      }
    } else if (!/^\d+$/.test(operation.endpoint)) {
      throw new Error("Plan update operation targets an invalid object ID");
    }
  }

  function pausedOperation(operation, resolvedIds) {
    assertPlanOperation(operation);
    const payload = resolvePlanReferences(operation.payload, resolvedIds);
    const expected = resolvePlanReferences(operation.expected, resolvedIds);
    const hasDeliveryStatus = ["campaign", "ad_set", "ad"].includes(
      operation.entity,
    );
    if (operation.action === "create" && hasDeliveryStatus) {
      if (
        (payload.status !== undefined && payload.status !== "PAUSED") ||
        (expected.status !== undefined && expected.status !== "PAUSED")
      ) {
        throw new Error("applyPlanPaused refuses to create an active object");
      }
      payload.status = "PAUSED";
      expected.status = "PAUSED";
    }
    if (operation.action === "update" && Object.hasOwn(payload, "status")) {
      throw new Error("applyPlanPaused refuses status changes");
    }
    return { payload, expected };
  }

  async function currentBeforeState(plan) {
    if (!Object.hasOwn(plan.input, "before_state_digest")) {
      return undefined;
    }
    const snapshot = plan.input.before_snapshot;
    const operation = plan.input.operations?.[0];
    if (
      !snapshot ||
      typeof snapshot !== "object" ||
      Array.isArray(snapshot) ||
      !operation ||
      operation.action !== "update"
    ) {
      throw new Error("Plan before-state binding is incomplete");
    }
    const current = assertObjectOwnership(
      await client.get(operation.endpoint, {
        fields: Object.keys(snapshot).join(","),
      }),
      config,
    );
    return current;
  }

  async function appendApplyAudit(event) {
    await requirePlanStoreMethod("appendAudit").appendAudit({
      captured_at: nowIso(clock),
      ...event,
    });
  }

  async function applyPlanPaused(input) {
    const parsed = applyPlanInputSchema.parse(input);
    requireConfiguredAdAccount();
    const store = requirePlanStoreMethod("getPlan");
    const plan = await store.getPlan(parsed.plan_id);
    if (!plan) {
      throw new Error(`Plan not found: ${parsed.plan_id}`);
    }
    if (plan.plan_digest !== parsed.plan_digest) {
      throw new Error("Plan digest mismatch");
    }
    if (!Array.isArray(plan.input?.operations) || plan.input.operations.length === 0) {
      throw new Error("Plan has no operations");
    }

    const requestApproval = approvalRequester ?? requestNativeApproval;
    const approval = await requestApproval({
      action: plan.input.requested_action,
      targets: plan.input.target_object_ids,
      budget_summary: plan.input.budget ?? "No budget change",
      max_spend: plan.input.maximum_planned_spend ?? "No new spend",
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
    });
    if (!approval?.approved) {
      throw new Error(
        `Plan was not approved: ${approval?.outcome ?? "denied"}`,
      );
    }

    await appendApplyAudit({
      event: "plan_apply_started",
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
      requested_action: plan.input.requested_action,
      target_object_ids: plan.input.target_object_ids,
    });
    await requirePlanStoreMethod("approvePlan").approvePlan(
      plan.plan_id,
      parsed.approver,
    );
    const beforeState = await currentBeforeState(plan);
    await requirePlanStoreMethod("consumeApproval").consumeApproval(
      plan.plan_id,
      plan.plan_digest,
      beforeState,
    );

    const resolvedIds = {};
    const reconciliations = [];
    const completedOperationIds = [];
    try {
      for (const operation of plan.input.operations) {
        const { payload, expected } = pausedOperation(
          operation,
          resolvedIds,
        );
        const response = await client.post(operation.endpoint, payload);
        const objectId =
          operation.action === "create" ? response?.id : operation.endpoint;
        if (typeof objectId !== "string" || !/^\d+$/.test(objectId)) {
          throw new Error(
            `Meta did not return a valid ID for ${operation.operation_id}`,
          );
        }
        if (operation.action === "create") {
          resolvedIds[operation.operation_id] = objectId;
        }
        const reconciliation = await client.readAfterWrite(
          objectId,
          Object.keys(expected),
          expected,
        );
        reconciliations.push({
          operation_id: operation.operation_id,
          object_id: objectId,
          ...reconciliation,
        });
        if (!reconciliation.matches) {
          throw new Error(
            `Read-after-write mismatch for ${operation.operation_id}`,
          );
        }
        completedOperationIds.push(operation.operation_id);
      }
    } catch (error) {
      await appendApplyAudit({
        event: "plan_apply_partial_failure",
        plan_id: plan.plan_id,
        plan_digest: plan.plan_digest,
        completed_operation_ids: completedOperationIds,
        created_ids: resolvedIds,
        error: safeError(error),
      });
      throw error;
    }

    await appendApplyAudit({
      event: "plan_apply_succeeded",
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
      completed_operation_ids: completedOperationIds,
      created_ids: resolvedIds,
    });
    return redactSecrets({
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
      status: "applied_paused",
      created_ids: resolvedIds,
      reconciliations,
      activation_required: true,
    });
  }

  async function executeLivePlan(plan, approver, readCurrentBefore) {
    const requestApproval = approvalRequester ?? requestNativeApproval;
    const approval = await requestApproval({
      action: plan.input.requested_action,
      targets: plan.input.target_object_ids,
      budget_summary: plan.input.budget_summary ?? "No budget change",
      max_spend: plan.input.maximum_planned_spend ?? "No new spend",
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
    });
    if (!approval?.approved) {
      throw new Error(
        `Plan was not approved: ${approval?.outcome ?? "denied"}`,
      );
    }

    await appendApplyAudit({
      event: "live_plan_started",
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
      requested_action: plan.input.requested_action,
      target_object_ids: plan.input.target_object_ids,
    });
    await requirePlanStoreMethod("approvePlan").approvePlan(
      plan.plan_id,
      approver,
    );
    const currentBefore = await readCurrentBefore();
    await requirePlanStoreMethod("consumeApproval").consumeApproval(
      plan.plan_id,
      plan.plan_digest,
      currentBefore,
    );

    const resolvedIds = {};
    const completedOperationIds = [];
    const reconciliations = [];
    try {
      for (const operation of plan.input.operations) {
        assertPlanOperation(operation);
        const payload = resolvePlanReferences(
          operation.payload,
          resolvedIds,
        );
        const expected = resolvePlanReferences(
          operation.expected,
          resolvedIds,
        );
        const response = await client.post(operation.endpoint, payload);
        const objectId =
          operation.action === "create" ? response?.id : operation.endpoint;
        if (typeof objectId !== "string" || !/^\d+$/.test(objectId)) {
          throw new Error(
            `Meta did not return a valid ID for ${operation.operation_id}`,
          );
        }
        if (operation.action === "create") {
          resolvedIds[operation.operation_id] = objectId;
        }
        const reconciliation = await client.readAfterWrite(
          objectId,
          Object.keys(expected),
          expected,
        );
        reconciliations.push({
          operation_id: operation.operation_id,
          object_id: objectId,
          ...reconciliation,
        });
        if (!reconciliation.matches) {
          throw new Error(
            `Read-after-write mismatch for ${operation.operation_id}`,
          );
        }
        completedOperationIds.push(operation.operation_id);
      }
    } catch (error) {
      await appendApplyAudit({
        event: "live_plan_partial_failure",
        plan_id: plan.plan_id,
        plan_digest: plan.plan_digest,
        completed_operation_ids: completedOperationIds,
        created_ids: resolvedIds,
        error: safeError(error),
      });
      throw error;
    }

    await appendApplyAudit({
      event: "live_plan_succeeded",
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
      completed_operation_ids: completedOperationIds,
      created_ids: resolvedIds,
    });
    return {
      plan_id: plan.plan_id,
      plan_digest: plan.plan_digest,
      created_ids: resolvedIds,
      reconciliations,
    };
  }

  async function createLivePlan({
    requestedAction,
    targetObjectIds,
    beforeSnapshot,
    operations,
    reason,
    sourceDocument,
    budgetSummary,
    maximumPlannedSpend,
    metadata = {},
  }) {
    return requirePlanStoreMethod("createPlan").createPlan({
      requested_action: requestedAction,
      target_object_ids: targetObjectIds,
      locked_assets: lockedAssets(config),
      reason,
      source_document: sourceDocument,
      before_snapshot: beforeSnapshot,
      before_state_digest: sha256Digest(beforeSnapshot),
      budget_summary: budgetSummary,
      maximum_planned_spend: maximumPlannedSpend,
      operations,
      ...metadata,
    });
  }

  async function readOwnedObjects(objectIds, fields) {
    requireConfiguredAdAccount();
    return Promise.all(
      objectIds.map(async (objectId) =>
        assertObjectOwnership(
          await client.get(objectId, { fields }),
          config,
        ),
      ),
    );
  }

  function statusOperations(objectIds, status) {
    return objectIds.map((objectId) => ({
      operation_id: `status:${objectId}:${status.toLowerCase()}`,
      action: "update",
      entity: "campaign",
      endpoint: objectId,
      payload: { status },
      expected: { status },
    }));
  }

  async function executeStatusControl(parsed, requestedAction, status) {
    const readCurrent = () =>
      readOwnedObjects(parsed.object_ids, DELIVERY_FIELDS);
    const before = await readCurrent();
    const plan = await createLivePlan({
      requestedAction,
      targetObjectIds: parsed.object_ids,
      beforeSnapshot: before,
      operations: statusOperations(parsed.object_ids, status),
      reason: parsed.reason,
      sourceDocument: parsed.source_document,
      metadata: {
        after_proposal: before.map((object) => ({
          ...object,
          status,
        })),
      },
    });
    const result = await executeLivePlan(plan, parsed.approver, readCurrent);
    return redactSecrets({
      ...result,
      requested_status: status,
      object_ids: parsed.object_ids,
    });
  }

  async function requireConsumedSourcePlan(planId, digest) {
    const source = await requirePlanStoreMethod("getPlan").getPlan(planId);
    if (!source) {
      throw new Error(`Plan not found: ${planId}`);
    }
    if (source.plan_digest !== digest) {
      throw new Error("Source plan digest mismatch");
    }
    if (source.status !== "consumed") {
      throw new Error("Source plan must be consumed before this operation");
    }
    return source;
  }

  async function activatePlan(input) {
    const parsed = activatePlanInputSchema.parse(input);
    const source = await requireConsumedSourcePlan(
      parsed.source_plan_id,
      parsed.source_plan_digest,
    );
    if (source.input?.requested_action !== "create_campaign_paused") {
      throw new Error("Activation requires a consumed PAUSED creation plan");
    }
    return executeStatusControl(
      parsed,
      "activate_created_entities",
      "ACTIVE",
    );
  }

  async function pauseEntities(input) {
    const parsed = statusControlInputSchema.parse(input);
    return executeStatusControl(parsed, "pause_entities", "PAUSED");
  }

  async function resumeEntities(input) {
    const parsed = statusControlInputSchema.parse(input);
    return executeStatusControl(parsed, "resume_entities", "ACTIVE");
  }

  async function executeSingleObjectChange({
    parsed,
    requestedAction,
    fields,
    payloadFor,
    budgetSummary,
    maximumPlannedSpend,
  }) {
    requireConfiguredAdAccount();
    const readCurrent = async () =>
      assertObjectOwnership(
        await client.get(parsed.object_id, { fields }),
        config,
      );
    const before = await readCurrent();
    const payload = payloadFor(before);
    const plan = await createLivePlan({
      requestedAction,
      targetObjectIds: [parsed.object_id],
      beforeSnapshot: before,
      operations: [
        {
          operation_id: `${requestedAction}:${parsed.object_id}`,
          action: "update",
          entity:
            parsed.object_type === "ad_set" ? "ad_set" : "campaign",
          endpoint: parsed.object_id,
          payload,
          expected: payload,
        },
      ],
      reason: parsed.reason,
      sourceDocument: parsed.source_document,
      budgetSummary,
      maximumPlannedSpend,
      metadata: {
        after_proposal: {
          ...before,
          ...payload,
        },
      },
    });
    const result = await executeLivePlan(plan, parsed.approver, readCurrent);
    return redactSecrets({
      ...result,
      object_id: parsed.object_id,
      before,
      after: {
        ...before,
        ...payload,
      },
    });
  }

  async function changeBudget(input) {
    const parsed = changeBudgetInputSchema.parse(input);
    const account = await readAccount();
    if (parsed.budget.currency !== account.currency) {
      throw new Error(
        `Budget currency must match the locked ad account currency ${account.currency}`,
      );
    }
    return executeSingleObjectChange({
      parsed,
      requestedAction: "change_budget",
      fields:
        parsed.object_type === "campaign"
          ? CAMPAIGN_FIELDS
          : AD_SET_FIELDS,
      payloadFor: () => ({
        [parsed.budget.field]: parsed.budget.amount,
      }),
      budgetSummary: parsed.budget,
      maximumPlannedSpend:
        "No total spend cap is implied by this budget change",
    });
  }

  async function changeSchedule(input) {
    const parsed = changeScheduleInputSchema.parse(input);
    return executeSingleObjectChange({
      parsed,
      requestedAction: "change_schedule",
      fields:
        parsed.object_type === "campaign"
          ? CAMPAIGN_FIELDS
          : AD_SET_FIELDS,
      payloadFor: () => {
        if (parsed.object_type === "campaign") {
          return {
            ...(parsed.schedule.start_time
              ? { start_time: parsed.schedule.start_time }
              : {}),
            ...(parsed.schedule.end_time
              ? { stop_time: parsed.schedule.end_time }
              : {}),
          };
        }
        return parsed.schedule;
      },
    });
  }

  async function changeTargeting(input) {
    const parsed = changeTargetingInputSchema.parse(input);
    return executeSingleObjectChange({
      parsed: { ...parsed, object_type: "ad_set" },
      requestedAction: "change_targeting",
      fields: AD_SET_FIELDS,
      payloadFor: (before) => ({
        targeting: {
          ...(before.targeting ?? {}),
          ...parsed.targeting,
        },
      }),
    });
  }

  async function changePlacements(input) {
    const parsed = changePlacementsInputSchema.parse(input);
    return executeSingleObjectChange({
      parsed: { ...parsed, object_type: "ad_set" },
      requestedAction: "change_placements",
      fields: AD_SET_FIELDS,
      payloadFor: (before) => ({
        targeting: {
          ...(before.targeting ?? {}),
          ...parsed.placements,
        },
      }),
    });
  }

  async function replaceCreative(input) {
    const parsed = replaceCreativeInputSchema.parse(input);
    const adAccountId = requireConfiguredAdAccount();
    const readCurrent = async () =>
      assertObjectOwnership(
        await client.get(parsed.ad_id, { fields: AD_FIELDS }),
        config,
      );
    const before = await readCurrent();
    if (typeof before.adset_id !== "string" || !/^\d+$/.test(before.adset_id)) {
      throw new Error("Existing ad does not expose a valid ad set ID");
    }
    const operations = [
      {
        operation_id: "replacement_creative",
        action: "create",
        entity: "creative",
        endpoint: `${adAccountId}/adcreatives`,
        payload: {
          name: parsed.creative.name,
          object_story_spec: creativeStorySpec(parsed.creative, {
            page_id: config.pageId,
            instagram_account_id: config.instagramAccountId,
          }),
        },
        expected: {
          name: parsed.creative.name,
        },
      },
      {
        operation_id: "replacement_ad",
        action: "create",
        entity: "ad",
        endpoint: `${adAccountId}/ads`,
        payload: {
          name: parsed.name,
          adset_id: before.adset_id,
          creative: {
            creative_id: "$replacement_creative.id",
          },
          status: "PAUSED",
        },
        expected: {
          name: parsed.name,
          status: "PAUSED",
        },
      },
    ];
    const plan = await createLivePlan({
      requestedAction: "replace_creative_paused",
      targetObjectIds: [parsed.ad_id],
      beforeSnapshot: before,
      operations,
      reason: parsed.reason,
      sourceDocument: parsed.source_document,
      metadata: {
        old_ad_id: parsed.ad_id,
        activation_required: true,
      },
    });
    const result = await executeLivePlan(plan, parsed.approver, readCurrent);
    return redactSecrets({
      ...result,
      old_ad_id: parsed.ad_id,
      new_creative_id: result.created_ids.replacement_creative,
      new_ad_id: result.created_ids.replacement_ad,
      activation_required: true,
    });
  }

  function assertConcreteReverseOperations(operations) {
    if (!Array.isArray(operations) || operations.length === 0) {
      throw new Error("Source plan has no reverse operations");
    }
    for (const operation of operations) {
      assertPlanOperation(operation);
      if (
        JSON.stringify(operation).match(
          /"\$[a-z0-9:_-]+\.id"/i,
        )
      ) {
        throw new Error(
          "Rollback requires concrete object IDs from a previous change plan",
        );
      }
    }
  }

  async function rollbackPlan(input) {
    const parsed = rollbackPlanInputSchema.parse(input);
    requireConfiguredAdAccount();
    const source = await requireConsumedSourcePlan(
      parsed.source_plan_id,
      parsed.source_plan_digest,
    );
    const reverse = source.input?.reverse_plan;
    assertConcreteReverseOperations(reverse?.operations);
    const targetIds = reverse.operations.map(
      (operation) => operation.endpoint,
    );
    const readCurrent = () =>
      readOwnedObjects(targetIds, "id,account_id,name,status,daily_budget,lifetime_budget,spend_cap,start_time,stop_time,end_time,targeting");
    const before = await readCurrent();
    const plan = await createLivePlan({
      requestedAction: reverse.requested_action ?? "rollback_plan",
      targetObjectIds:
        reverse.target_object_ids ?? source.input.target_object_ids,
      beforeSnapshot: before,
      operations: reverse.operations,
      reason: parsed.reason,
      sourceDocument: parsed.source_document,
      metadata: {
        source_plan_id: source.plan_id,
        source_plan_digest: source.plan_digest,
      },
    });
    return redactSecrets(
      await executeLivePlan(plan, parsed.approver, readCurrent),
    );
  }

  return Object.freeze({
    getAdAccount,
    listAdAccounts,
    listCampaigns,
    getCampaignStructure,
    getAdsInsights,
    getDeliveryState,
    draftCampaignPlan,
    draftChangePlan,
    reviewPlan,
    discardPlan,
    applyPlanPaused,
    activatePlan,
    pauseEntities,
    resumeEntities,
    changeBudget,
    changeSchedule,
    changeTargeting,
    changePlacements,
    replaceCreative,
    rollbackPlan,
  });
}
