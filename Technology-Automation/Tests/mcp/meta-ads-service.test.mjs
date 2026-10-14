import test from "node:test";
import assert from "node:assert/strict";

import { createMetaAdsService } from "../../MCP/meta-ads/service.mjs";

const CONFIG = Object.freeze({
  adAccountId: "act_123456789",
  pageId: "1409099405611405",
  instagramAccountId: "17841438272497512",
  graphVersion: "v26.0",
  stateDir: "/tmp/travelframe-meta-ads-test",
});

const ACCOUNT = {
  id: "act_123456789",
  account_id: "123456789",
  name: "TravelFrame",
  account_status: 1,
  currency: "USD",
  timezone_name: "Asia/Ho_Chi_Minh",
  timezone_offset_hours_utc: 7,
};

class FakeClock {
  now() {
    return new Date("2026-09-17T05:30:00.000Z");
  }
}

function makeClient(handler) {
  const calls = [];
  return {
    calls,
    async get(path, params = {}) {
      calls.push({ method: "GET", path, params });
      return handler(path, params, calls.length - 1, "GET");
    },
    async post(path, params = {}) {
      calls.push({ method: "POST", path, params });
      return handler(path, params, calls.length - 1, "POST");
    },
    async readAfterWrite(path, fields, expected) {
      calls.push({
        method: "READ_AFTER_WRITE",
        path,
        params: { fields, expected },
      });
      return handler(
        path,
        { fields, expected },
        calls.length - 1,
        "READ_AFTER_WRITE",
      );
    },
  };
}

function makeService(handler, overrides = {}) {
  return makeServiceForConfig(handler, CONFIG, overrides);
}

function makeServiceForConfig(handler, config, overrides = {}) {
  const client = makeClient(handler);
  return {
    client,
    service: createMetaAdsService({
      client,
      config,
      clock: new FakeClock(),
      ...overrides,
    }),
  };
}

function campaignPlanInput(overrides = {}) {
  return {
    internal_campaign_id: "tf-offer-pilot-2026-09",
    name: "TravelFrame Offer Pilot",
    objective: "OUTCOME_TRAFFIC",
    buying_type: "AUCTION",
    special_ad_categories: [],
    conversion_destination: "WEBSITE",
    budget: {
      strategy: "ADSET_DAILY",
      currency: "USD",
      campaign_spend_limit: 30000,
    },
    schedule: {
      start_time: "2026-09-18T09:00:00+07:00",
      end_time: "2026-09-25T21:00:00+07:00",
      timezone: "Asia/Ho_Chi_Minh",
    },
    actor: {
      page_id: CONFIG.pageId,
      instagram_account_id: CONFIG.instagramAccountId,
    },
    audience: {
      locations: { countries: ["VN"] },
      age_min: 23,
      age_max: 45,
      genders: [1, 2],
      languages: ["vi"],
      targeting: {
        interests: [{ id: "6003139266461", name: "Travel" }],
      },
    },
    placements: {
      publisher_platforms: ["facebook", "instagram"],
      facebook_positions: ["feed", "story"],
      instagram_positions: ["stream", "story", "reels"],
    },
    ad_sets: [
      {
        key: "photo-travelers",
        name: "Photo travelers",
        daily_budget: 5000,
        optimization_goal: "LINK_CLICKS",
        billing_event: "IMPRESSIONS",
        bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      },
    ],
    creatives: [
      {
        key: "offer-photo-v1",
        name: "Offer photo v1",
        primary_text: "Keep the memories, not just the itinerary.",
        headline: "Your Hanoi story, photographed",
        image_hash: "image-hash-offer-photo-v1",
        call_to_action: {
          type: "LEARN_MORE",
          value: { link: "https://travelframe.vn/" },
        },
      },
    ],
    ads: [
      {
        key: "offer-photo-ad-v1",
        name: "Offer photo ad v1",
        ad_set_key: "photo-travelers",
        creative_key: "offer-photo-v1",
      },
    ],
    business_owner: "TravelFrame",
    approval_reason: "Approved pilot brief",
    source_document: "Meta-Ads-Offer-Pilot-2026-09",
    ...overrides,
  };
}

function assertNoUndefined(value, path = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoUndefined(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    assert.notEqual(value, undefined, `${path} must be JSON-safe`);
    return;
  }
  for (const [key, item] of Object.entries(value)) {
    assert.notEqual(item, undefined, `${path}.${key} must be JSON-safe`);
    assertNoUndefined(item, `${path}.${key}`);
  }
}

test("getAdAccount reads only the locked account and returns locked assets", async () => {
  const { client, service } = makeService(async (path) => {
    if (path === CONFIG.adAccountId) return ACCOUNT;
    if (path === CONFIG.pageId) {
      return {
        id: CONFIG.pageId,
        name: "travelframe.vn",
        instagram_business_account: {
          id: CONFIG.instagramAccountId,
        },
      };
    }
    throw new Error(`Unexpected path: ${path}`);
  });

  const result = await service.getAdAccount({});

  assert.equal(client.calls.length, 2);
  assert.equal(client.calls[0].path, CONFIG.adAccountId);
  assert.match(client.calls[0].params.fields, /\bid\b/);
  assert.match(client.calls[0].params.fields, /\bcurrency\b/);
  assert.equal(client.calls[1].path, CONFIG.pageId);
  assert.match(client.calls[1].params.fields, /instagram_business_account/);
  assert.deepEqual(result.locked_assets, {
    ad_account_id: CONFIG.adAccountId,
    page_id: CONFIG.pageId,
    instagram_account_id: CONFIG.instagramAccountId,
  });
  assert.deepEqual(result.asset_verification, {
    page_id: CONFIG.pageId,
    page_name: "travelframe.vn",
    instagram_account_id: CONFIG.instagramAccountId,
  });
  assert.equal(result.account.id, CONFIG.adAccountId);
  assert.equal(result.captured_at, "2026-09-17T05:30:00.000Z");
});

test("listAdAccounts discovers accessible accounts before one is locked", async () => {
  const config = Object.freeze({
    ...CONFIG,
    adAccountId: null,
  });
  const { client, service } = makeServiceForConfig(
    async (path, params) => {
      assert.equal(path, "me/adaccounts");
      assert.match(params.fields, /\baccount_id\b/);
      assert.match(params.fields, /\bbusiness\b/);
      return {
        data: [
          {
            id: "act_123456789",
            account_id: "123456789",
            name: "TravelFrame candidate",
            account_status: 1,
            currency: "VND",
            timezone_name: "Asia/Ho_Chi_Minh",
            business: {
              id: "1616308550118477",
              name: "Vietnam in Frames Hanoi Local & Playgrounds",
            },
          },
        ],
        paging: {
          cursors: { after: "next" },
          next:
            "https://graph.facebook.com/v26.0/me/adaccounts" +
            "?after=next&access_token=secret",
        },
      };
    },
    config,
  );

  const result = await service.listAdAccounts({ limit: 10 });

  assert.equal(client.calls[0].path, "me/adaccounts");
  assert.equal(client.calls[0].params.limit, 10);
  assert.equal(client.calls[0].params.after, undefined);
  assert.equal(result.configured_account_id, null);
  assert.equal(result.selection_required, true);
  assert.deepEqual(result.locked_assets, {
    ad_account_id: null,
    page_id: CONFIG.pageId,
    instagram_account_id: CONFIG.instagramAccountId,
  });
  assert.equal(result.data[0].business.id, "1616308550118477");
  assert.doesNotMatch(result.paging.next, /access_token=secret/);
});

test("account-bound reads fail closed until an ad account is selected", async () => {
  const config = Object.freeze({
    ...CONFIG,
    adAccountId: null,
  });
  const { service } = makeServiceForConfig(async () => {
    throw new Error("No Meta call should happen");
  }, config);

  await assert.rejects(
    () => service.listCampaigns({}),
    /ad account ID is not configured.*list_ad_accounts/i,
  );
});

test("read schemas reject account, Page, Instagram, and unknown overrides", async () => {
  const { service } = makeService(async () => ACCOUNT);

  for (const input of [
    { account_id: "act_999" },
    { ad_account_id: "act_999" },
    { page_id: "999" },
    { instagram_account_id: "999" },
    { access_token: "must-not-be-accepted" },
    { unknown: true },
  ]) {
    await assert.rejects(() => service.getAdAccount(input), /unrecognized|invalid/i);
  }
});

test("getAdAccount fails closed when Page or Instagram linkage does not match", async () => {
  for (const page of [
    {
      id: "999",
      instagram_business_account: { id: CONFIG.instagramAccountId },
    },
    {
      id: CONFIG.pageId,
      instagram_business_account: { id: "999" },
    },
    {
      id: CONFIG.pageId,
    },
  ]) {
    const { service } = makeService(async (path) =>
      path === CONFIG.adAccountId ? ACCOUNT : page,
    );
    await assert.rejects(() => service.getAdAccount({}), /unexpected.*asset|linkage/i);
  }
});

test("listCampaigns applies bounded filters and redacts paging credentials", async () => {
  const { client, service } = makeService(async () => ({
    data: [
      {
        id: "1201",
        account_id: "123456789",
        name: "Offer test",
        status: "PAUSED",
        effective_status: "PAUSED",
      },
    ],
    paging: {
      next:
        "https://graph.facebook.com/v26.0/act_123/campaigns" +
        "?after=cursor&access_token=page-secret",
      cursors: { after: "cursor" },
    },
  }));

  const result = await service.listCampaigns({
    effective_status: ["PAUSED", "ACTIVE"],
    limit: 20,
    after: "cursor-before",
  });

  assert.equal(client.calls[0].path, `${CONFIG.adAccountId}/campaigns`);
  assert.equal(client.calls[0].params.limit, 20);
  assert.equal(client.calls[0].params.after, "cursor-before");
  assert.deepEqual(
    JSON.parse(client.calls[0].params.filtering),
    [
      {
        field: "effective_status",
        operator: "IN",
        value: ["PAUSED", "ACTIVE"],
      },
    ],
  );
  assert.doesNotMatch(JSON.stringify(result), /page-secret/);
  assert.match(result.paging.next, /%5BREDACTED%5D/);
});

test("getCampaignStructure reads campaign, ad sets, and ads without writes", async () => {
  const responses = new Map([
    [
      "1201",
      {
        id: "1201",
        account_id: "123456789",
        name: "Offer test",
        status: "PAUSED",
        effective_status: "PAUSED",
      },
    ],
    [
      "1201/adsets",
      {
        data: [
          {
            id: "2201",
            campaign_id: "1201",
            name: "Photo",
            status: "PAUSED",
          },
        ],
      },
    ],
    [
      "1201/ads",
      {
        data: [
          {
            id: "3201",
            adset_id: "2201",
            name: "Photo v1",
            status: "PAUSED",
            creative: { id: "4201", name: "Photo creative" },
          },
        ],
      },
    ],
  ]);
  const { client, service } = makeService(async (path) => responses.get(path));

  const result = await service.getCampaignStructure({
    campaign_id: "1201",
  });

  assert.deepEqual(
    client.calls.map((call) => call.path),
    ["1201", "1201/adsets", "1201/ads"],
  );
  assert.equal(result.campaign.id, "1201");
  assert.equal(result.ad_sets.data[0].id, "2201");
  assert.equal(result.ads.data[0].creative.id, "4201");
});

test("getCampaignStructure rejects malformed campaign IDs", async () => {
  const { service } = makeService(async () => {
    throw new Error("should not call client");
  });

  for (const campaignId of ["act_123", "../oauth", "1201?x=1", "abc"]) {
    await assert.rejects(
      () => service.getCampaignStructure({ campaign_id: campaignId }),
      /invalid/i,
    );
  }
});

test("getCampaignStructure rejects a campaign from another ad account", async () => {
  const { service } = makeService(async (path) => {
    if (path === "1201") {
      return {
        id: "1201",
        account_id: "999",
        name: "Other client",
      };
    }
    return { data: [] };
  });

  await assert.rejects(
    () => service.getCampaignStructure({ campaign_id: "1201" }),
    /unexpected ad account|outside.*account/i,
  );
});

test("getAdsInsights returns reporting metadata, timezone, and currency", async () => {
  const { client, service } = makeService(async (path) => {
    if (path === CONFIG.adAccountId) return ACCOUNT;
    if (path === `${CONFIG.adAccountId}/insights`) {
      return {
        data: [
          {
            campaign_id: "1201",
            campaign_name: "Offer test",
            spend: "12.34",
            impressions: "1000",
          },
        ],
        paging: {
          next:
            "https://graph.facebook.com/v26.0/insights" +
            "?after=cursor&access_token=insights-secret",
        },
      };
    }
    throw new Error(`Unexpected path: ${path}`);
  });

  const result = await service.getAdsInsights({
    level: "campaign",
    date_range: {
      since: "2026-09-01",
      until: "2026-09-16",
    },
    fields: [
      "campaign_id",
      "campaign_name",
      "spend",
      "impressions",
    ],
    breakdowns: ["publisher_platform"],
    limit: 50,
  });

  const insightsCall = client.calls.find((call) =>
    call.path.endsWith("/insights"),
  );
  assert.equal(insightsCall.path, `${CONFIG.adAccountId}/insights`);
  assert.equal(insightsCall.params.level, "campaign");
  assert.equal(
    insightsCall.params.fields,
    "campaign_id,campaign_name,spend,impressions",
  );
  assert.equal(insightsCall.params.breakdowns, "publisher_platform");
  assert.equal(
    insightsCall.params.time_range,
    JSON.stringify({ since: "2026-09-01", until: "2026-09-16" }),
  );
  assert.deepEqual(result.reporting, {
    account_id: CONFIG.adAccountId,
    level: "campaign",
    reporting_start: "2026-09-01",
    reporting_end: "2026-09-16",
    captured_at: "2026-09-17T05:30:00.000Z",
    account_timezone: "Asia/Ho_Chi_Minh",
    currency: "USD",
    requested_fields: [
      "campaign_id",
      "campaign_name",
      "spend",
      "impressions",
    ],
    breakdowns: ["publisher_platform"],
    limitations: [
      "Meta attribution and action definitions depend on the ad account configuration.",
      "Platform actions are not verified bookings or recognized revenue.",
    ],
  });
  assert.doesNotMatch(JSON.stringify(result), /insights-secret/);
});

test("getAdsInsights supports a locked object path without account override", async () => {
  const { client, service } = makeService(async (path) => {
    if (path === CONFIG.adAccountId) return ACCOUNT;
    if (path === "1201") {
      return { id: "1201", account_id: "123456789" };
    }
    if (path === "1201/insights") return { data: [] };
    throw new Error(`Unexpected path: ${path}`);
  });

  await service.getAdsInsights({
    object_id: "1201",
    level: "campaign",
    date_range: { since: "2026-09-01", until: "2026-09-16" },
    fields: ["spend"],
  });

  assert.ok(client.calls.some((call) => call.path === "1201/insights"));
});

test("getAdsInsights rejects an object from another ad account before insights", async () => {
  const { client, service } = makeService(async (path) => {
    if (path === CONFIG.adAccountId) return ACCOUNT;
    if (path === "1201") return { id: "1201", account_id: "999" };
    throw new Error(`Unexpected path: ${path}`);
  });

  await assert.rejects(
    () =>
      service.getAdsInsights({
        object_id: "1201",
        level: "campaign",
        date_range: { since: "2026-09-01", until: "2026-09-16" },
        fields: ["spend"],
      }),
    /unexpected ad account|outside.*account/i,
  );
  assert.equal(
    client.calls.some((call) => call.path === "1201/insights"),
    false,
  );
});

test("getAdsInsights rejects unsupported fields, breakdowns, and date ranges", async () => {
  const { service } = makeService(async () => ACCOUNT);
  const base = {
    level: "campaign",
    date_range: { since: "2026-09-01", until: "2026-09-16" },
    fields: ["spend"],
  };

  for (const input of [
    { ...base, fields: ["password"] },
    { ...base, breakdowns: ["unknown_breakdown"] },
    {
      ...base,
      date_range: { since: "2026-09-18", until: "2026-09-16" },
    },
    { ...base, object_id: "../oauth" },
    { ...base, account_id: "act_999" },
  ]) {
    await assert.rejects(() => service.getAdsInsights(input), /invalid|unrecognized/i);
  }
});

test("getDeliveryState reads each bounded object ID and preserves order", async () => {
  const { client, service } = makeService(async (path) => ({
    id: path,
    account_id: "123456789",
    name: `Object ${path}`,
    status: "PAUSED",
    effective_status: "CAMPAIGN_PAUSED",
    configured_status: "PAUSED",
  }));

  const result = await service.getDeliveryState({
    object_ids: ["1201", "2201", "3201"],
  });

  assert.deepEqual(
    client.calls.map((call) => call.path),
    ["1201", "2201", "3201"],
  );
  assert.deepEqual(
    result.objects.map((entry) => entry.id),
    ["1201", "2201", "3201"],
  );
});

test("getDeliveryState rejects objects outside the locked ad account", async () => {
  const { service } = makeService(async (path) => ({
    id: path,
    account_id: path === "2201" ? "999" : "123456789",
    status: "PAUSED",
  }));

  await assert.rejects(
    () => service.getDeliveryState({ object_ids: ["1201", "2201"] }),
    /unexpected ad account|outside.*account/i,
  );
});

test("getDeliveryState rejects empty, duplicate, excessive, or malformed IDs", async () => {
  const { service } = makeService(async () => ({}));

  for (const objectIds of [
    [],
    ["1201", "1201"],
    ["../oauth"],
    Array.from({ length: 21 }, (_, index) => String(index + 1)),
  ]) {
    await assert.rejects(
      () => service.getDeliveryState({ object_ids: objectIds }),
      /invalid|duplicate|too big|too small|at least/i,
    );
  }
});

test("draft campaign creates a dependency-ordered PAUSED plan", async () => {
  const created = [];
  const planStore = {
    async createPlan(input) {
      created.push(input);
      return {
        plan_id: "11111111-1111-4111-8111-111111111111",
        plan_version: 1,
        plan_digest: "a".repeat(64),
        status: "pending",
        input,
      };
    },
  };
  const { service } = makeService(async (path) => {
    if (path === CONFIG.adAccountId) return ACCOUNT;
    throw new Error(`Unexpected path: ${path}`);
  }, { planStore });

  const result = await service.draftCampaignPlan(campaignPlanInput());

  assert.equal(created.length, 1);
  assert.equal(created[0].requested_action, "create_campaign_paused");
  assert.deepEqual(
    created[0].operations.map((operation) => operation.entity),
    ["campaign", "creative", "ad_set", "ad"],
  );
  assert.ok(
    created[0].operations
      .filter((operation) => operation.entity !== "creative")
      .every(
        (operation) => operation.payload.status === "PAUSED",
      ),
  );
  assert.equal(
    created[0].operations[2].payload.campaign_id,
    "$campaign.id",
  );
  assert.equal(
    created[0].operations[3].payload.adset_id,
    "$ad_set:photo-travelers.id",
  );
  assert.deepEqual(created[0].operations[3].payload.creative, {
    creative_id: "$creative:offer-photo-v1.id",
  });
  assert.equal(created[0].budget.currency, "USD");
  assert.equal(created[0].maximum_planned_spend, 30000);
  assertNoUndefined(created[0]);
  assert.equal(result.preview.activation_required, true);
  assert.equal(result.preview.initial_status, "PAUSED");
});

test("draft campaign requires explicit safe campaign inputs", async () => {
  const planStore = {
    async createPlan() {
      throw new Error("invalid input must not create a plan");
    },
  };
  const { service } = makeService(async () => ACCOUNT, { planStore });
  const requiredKeys = [
    "internal_campaign_id",
    "name",
    "objective",
    "conversion_destination",
    "budget",
    "schedule",
    "actor",
    "audience",
    "placements",
    "ad_sets",
    "creatives",
    "ads",
    "business_owner",
    "approval_reason",
    "source_document",
  ];

  for (const key of requiredKeys) {
    const input = campaignPlanInput();
    delete input[key];
    await assert.rejects(
      () => service.draftCampaignPlan(input),
      /invalid|required|expected/i,
      key,
    );
  }

  for (const input of [
    campaignPlanInput({
      budget: {
        strategy: "ADSET_DAILY",
        currency: "VND",
        campaign_spend_limit: 30000,
      },
    }),
    campaignPlanInput({
      actor: {
        page_id: "999",
        instagram_account_id: CONFIG.instagramAccountId,
      },
    }),
    campaignPlanInput({ status: "ACTIVE" }),
    campaignPlanInput({ billing_account_id: "forbidden" }),
    campaignPlanInput({ delete: true }),
  ]) {
    await assert.rejects(
      () => service.draftCampaignPlan(input),
      /currency|actor|unrecognized|invalid/i,
    );
  }
});

test("draft change records before state, diff, and a reverse plan", async () => {
  const created = [];
  const planStore = {
    async createPlan(input) {
      created.push(input);
      return {
        plan_id: "22222222-2222-4222-8222-222222222222",
        plan_version: 1,
        plan_digest: "b".repeat(64),
        status: "pending",
        input,
      };
    },
  };
  const { client, service } = makeService(async (path) => {
    assert.equal(path, "1201");
    return {
      id: "1201",
      account_id: "123456789",
      name: "Offer pilot",
      daily_budget: "5000",
      stop_time: "2026-09-25T14:00:00+0000",
      status: "PAUSED",
    };
  }, { planStore });

  const result = await service.draftChangePlan({
    object_id: "1201",
    object_type: "campaign",
    changes: {
      daily_budget: 7500,
      stop_time: "2026-09-27T21:00:00+07:00",
    },
    reason: "Extend the approved pilot",
    source_document: "Meta-Ads-Offer-Pilot-2026-09",
  });

  assert.equal(client.calls.length, 1);
  assert.match(client.calls[0].params.fields, /account_id/);
  assert.match(created[0].before_state_digest, /^[a-f0-9]{64}$/);
  assert.deepEqual(created[0].operations, [
    {
      operation_id: "update:campaign:1201",
      action: "update",
      entity: "campaign",
      endpoint: "1201",
      payload: {
        daily_budget: 7500,
        stop_time: "2026-09-27T21:00:00+07:00",
      },
      expected: {
        daily_budget: 7500,
        stop_time: "2026-09-27T21:00:00+07:00",
      },
    },
  ]);
  assert.deepEqual(created[0].reverse_plan.operations[0].payload, {
    daily_budget: "5000",
    stop_time: "2026-09-25T14:00:00+0000",
  });
  assert.deepEqual(
    created[0].diff.map((entry) => entry.field),
    ["daily_budget", "stop_time"],
  );
  assert.equal(result.preview.warning, "Changes are not applied until approved");
});

test("draft change rejects unsafe fields and objects outside TravelFrame", async () => {
  const planStore = {
    async createPlan() {
      throw new Error("unsafe change must not create a plan");
    },
  };
  const { service } = makeService(async () => ({
    id: "1201",
    account_id: "999",
    status: "PAUSED",
  }), { planStore });

  await assert.rejects(
    () =>
      service.draftChangePlan({
        object_id: "1201",
        object_type: "campaign",
        changes: { daily_budget: 7500 },
        reason: "test",
        source_document: "brief",
      }),
    /unexpected ad account|outside.*account/i,
  );

  for (const changes of [
    { status: "ACTIVE" },
    { account_id: "act_999" },
    { currency: "VND" },
    { billing_account_id: "forbidden" },
    { delete: true },
  ]) {
    const { service: lockedService } = makeService(async () => ({
      id: "1201",
      account_id: "123456789",
      status: "PAUSED",
    }), { planStore });
    await assert.rejects(
      () =>
        lockedService.draftChangePlan({
          object_id: "1201",
          object_type: "campaign",
          changes,
          reason: "test",
          source_document: "brief",
        }),
      /unrecognized|invalid/i,
    );
  }
});

test("review and discard plan remain local plan-store operations", async () => {
  const calls = [];
  const storedPlan = {
    plan_id: "33333333-3333-4333-8333-333333333333",
    plan_version: 1,
    plan_digest: "c".repeat(64),
    status: "pending",
    input: {
      requested_action: "change_budget",
      target_object_ids: ["1201"],
      diff: [{ field: "daily_budget", before: "5000", after: 7500 }],
    },
  };
  const planStore = {
    async getPlan(planId) {
      calls.push(["get", planId]);
      return planId === storedPlan.plan_id ? storedPlan : null;
    },
    async discardPlan(planId) {
      calls.push(["discard", planId]);
      return { ...storedPlan, status: "discarded" };
    },
  };
  const { client, service } = makeService(async () => {
    throw new Error("local plan operations must not call Meta");
  }, { planStore });

  const reviewed = await service.reviewPlan({
    plan_id: storedPlan.plan_id,
  });
  const discarded = await service.discardPlan({
    plan_id: storedPlan.plan_id,
  });

  assert.equal(client.calls.length, 0);
  assert.equal(reviewed.plan.plan_digest, storedPlan.plan_digest);
  assert.equal(discarded.status, "discarded");
  assert.deepEqual(calls, [
    ["get", storedPlan.plan_id],
    ["discard", storedPlan.plan_id],
  ]);
});

function pausedCreationPlan() {
  return {
    plan_id: "44444444-4444-4444-8444-444444444444",
    plan_version: 1,
    plan_digest: "d".repeat(64),
    status: "pending",
    created_at: "2026-09-17T05:30:00.000Z",
    expires_at: "2026-09-17T05:40:00.000Z",
    input: {
      requested_action: "create_campaign_paused",
      target_object_ids: ["tf-offer-pilot-2026-09"],
      budget: {
        strategy: "ADSET_DAILY",
        currency: "USD",
        campaign_spend_limit: 30000,
      },
      maximum_planned_spend: 30000,
      operations: [
        {
          operation_id: "campaign",
          action: "create",
          entity: "campaign",
          endpoint: `${CONFIG.adAccountId}/campaigns`,
          payload: { name: "Offer pilot", status: "PAUSED" },
          expected: { name: "Offer pilot", status: "PAUSED" },
        },
        {
          operation_id: "creative:photo",
          action: "create",
          entity: "creative",
          endpoint: `${CONFIG.adAccountId}/adcreatives`,
          payload: { name: "Photo creative" },
          expected: { name: "Photo creative" },
        },
        {
          operation_id: "ad_set:photo",
          action: "create",
          entity: "ad_set",
          endpoint: `${CONFIG.adAccountId}/adsets`,
          payload: {
            name: "Photo travelers",
            campaign_id: "$campaign.id",
            status: "PAUSED",
          },
          expected: { name: "Photo travelers", status: "PAUSED" },
        },
        {
          operation_id: "ad:photo",
          action: "create",
          entity: "ad",
          endpoint: `${CONFIG.adAccountId}/ads`,
          payload: {
            name: "Photo ad",
            adset_id: "$ad_set:photo.id",
            creative: { creative_id: "$creative:photo.id" },
            status: "PAUSED",
          },
          expected: { name: "Photo ad", status: "PAUSED" },
        },
      ],
    },
  };
}

test("apply plan paused requires approval, resolves dependencies, and reconciles", async () => {
  const plan = pausedCreationPlan();
  const events = [];
  const storeCalls = [];
  const planStore = {
    async getPlan() {
      return plan;
    },
    async approvePlan(planId, approver) {
      storeCalls.push(["approve", planId, approver]);
      return { plan_id: planId, plan_digest: plan.plan_digest };
    },
    async appendAudit(event) {
      events.push(event);
    },
    async consumeApproval(planId, digest, currentBeforeState) {
      storeCalls.push(["consume", planId, digest, currentBeforeState]);
      return { plan_id: planId, consumed_at: "2026-09-17T05:31:00.000Z" };
    },
  };
  const ids = ["1201", "4201", "2201", "3201"];
  let postIndex = 0;
  const { client, service } = makeService(
    async (path, params, _index, method) => {
      if (method === "POST") {
        const id = ids[postIndex];
        postIndex += 1;
        return { id };
      }
      if (method === "READ_AFTER_WRITE") {
        return {
          matches: true,
          actual: { id: path, ...params.expected },
          mismatches: [],
        };
      }
      throw new Error(`Unexpected ${method} ${path}`);
    },
    {
      planStore,
      approvalRequester: async (summary) => {
        assert.equal(summary.plan_id, plan.plan_id);
        assert.equal(summary.max_spend, 30000);
        return { approved: true, outcome: "approved" };
      },
    },
  );

  const result = await service.applyPlanPaused({
    plan_id: plan.plan_id,
    plan_digest: plan.plan_digest,
    approver: "Rocky",
  });

  const posts = client.calls.filter((call) => call.method === "POST");
  assert.equal(posts.length, 4);
  assert.equal(posts[2].params.campaign_id, "1201");
  assert.equal(posts[3].params.adset_id, "2201");
  assert.deepEqual(posts[3].params.creative, { creative_id: "4201" });
  assert.ok(
    posts
      .filter((call) => !call.path.endsWith("/adcreatives"))
      .every((call) => call.params.status === "PAUSED"),
  );
  assert.deepEqual(storeCalls, [
    ["approve", plan.plan_id, "Rocky"],
    ["consume", plan.plan_id, plan.plan_digest, undefined],
  ]);
  assert.equal(events[0].event, "plan_apply_started");
  assert.equal(events.at(-1).event, "plan_apply_succeeded");
  assert.deepEqual(result.created_ids, {
    campaign: "1201",
    "creative:photo": "4201",
    "ad_set:photo": "2201",
    "ad:photo": "3201",
  });
  assert.equal(result.activation_required, true);
});

test("apply plan paused stops before writes on denial or audit failure", async () => {
  for (const mode of ["denied", "audit-failed"]) {
    const plan = pausedCreationPlan();
    let consumed = false;
    const planStore = {
      async getPlan() {
        return plan;
      },
      async approvePlan() {
        if (mode === "denied") {
          throw new Error("approval must not be recorded");
        }
        return {};
      },
      async appendAudit() {
        if (mode === "audit-failed") {
          throw new Error("audit unavailable");
        }
      },
      async consumeApproval() {
        consumed = true;
        return {};
      },
    };
    const { client, service } = makeService(async () => {
      throw new Error("Meta write must not run");
    }, {
      planStore,
      approvalRequester: async () =>
        mode === "denied"
          ? { approved: false, outcome: "denied" }
          : { approved: true, outcome: "approved" },
    });

    await assert.rejects(
      () =>
        service.applyPlanPaused({
          plan_id: plan.plan_id,
          plan_digest: plan.plan_digest,
          approver: "Rocky",
        }),
      mode === "denied" ? /denied|not approved/i : /audit unavailable/i,
    );
    assert.equal(client.calls.length, 0);
    assert.equal(consumed, false);
  }
});

test("apply plan paused fails closed on stale or replayed approval", async () => {
  for (const message of [
    "Stale before-state digest",
    "Approval receipt was already consumed; replay rejected",
    "Approval receipt has expired",
  ]) {
    const plan = pausedCreationPlan();
    plan.input.before_snapshot = {
      id: "1201",
      account_id: "123456789",
      daily_budget: "5000",
    };
    plan.input.before_state_digest = "e".repeat(64);
    plan.input.operations = [
      {
        operation_id: "update:campaign:1201",
        action: "update",
        entity: "campaign",
        endpoint: "1201",
        payload: { daily_budget: 7500 },
        expected: { daily_budget: 7500 },
      },
    ];
    const planStore = {
      async getPlan() {
        return plan;
      },
      async approvePlan() {
        return {};
      },
      async appendAudit() {},
      async consumeApproval(_planId, _digest, currentBeforeState) {
        assert.equal(currentBeforeState.id, "1201");
        throw new Error(message);
      },
    };
    const { client, service } = makeService(
      async (path, _params, _index, method) => {
        if (method === "GET" && path === "1201") {
          return {
            id: "1201",
            account_id: "123456789",
            daily_budget: "6000",
          };
        }
        throw new Error("Meta write must not run");
      },
      {
        planStore,
        approvalRequester: async () => ({
          approved: true,
          outcome: "approved",
        }),
      },
    );

    await assert.rejects(
      () =>
        service.applyPlanPaused({
          plan_id: plan.plan_id,
          plan_digest: plan.plan_digest,
          approver: "Rocky",
        }),
      new RegExp(message.split(";")[0], "i"),
    );
    assert.equal(
      client.calls.some((call) => call.method === "POST"),
      false,
    );
  }
});

test("apply plan paused audits partial failure and stops remaining operations", async () => {
  const plan = pausedCreationPlan();
  const events = [];
  const planStore = {
    async getPlan() {
      return plan;
    },
    async approvePlan() {
      return {};
    },
    async appendAudit(event) {
      events.push(event);
    },
    async consumeApproval() {
      return {};
    },
  };
  let posts = 0;
  const { service } = makeService(
    async (path, params, _index, method) => {
      if (method === "POST") {
        posts += 1;
        if (posts === 2) {
          throw new Error("Meta creative creation failed");
        }
        return { id: "1201" };
      }
      if (method === "READ_AFTER_WRITE") {
        return {
          matches: true,
          actual: { id: path, ...params.expected },
          mismatches: [],
        };
      }
      throw new Error(`Unexpected ${method} ${path}`);
    },
    {
      planStore,
      approvalRequester: async () => ({
        approved: true,
        outcome: "approved",
      }),
    },
  );

  await assert.rejects(
    () =>
      service.applyPlanPaused({
        plan_id: plan.plan_id,
        plan_digest: plan.plan_digest,
        approver: "Rocky",
      }),
    /creative creation failed/i,
  );
  assert.equal(posts, 2);
  assert.equal(events.at(-1).event, "plan_apply_partial_failure");
  assert.deepEqual(events.at(-1).completed_operation_ids, ["campaign"]);
});

function liveControlStore(sourcePlan = null) {
  const calls = [];
  let counter = 0;
  return {
    calls,
    async getPlan(planId) {
      calls.push(["get", planId]);
      if (sourcePlan?.plan_id === planId) return sourcePlan;
      return null;
    },
    async createPlan(input) {
      counter += 1;
      calls.push(["create", input]);
      return {
        plan_id: `55555555-5555-4555-8555-${String(counter).padStart(12, "0")}`,
        plan_version: 1,
        plan_digest: String(counter).repeat(64).slice(0, 64),
        status: "pending",
        input,
      };
    },
    async appendAudit(event) {
      calls.push(["audit", event.event]);
    },
    async approvePlan(planId, approver) {
      calls.push(["approve", planId, approver]);
      return {};
    },
    async consumeApproval(planId, digest, beforeState) {
      calls.push(["consume", planId, digest, beforeState]);
      return {};
    },
  };
}

function liveControlClientResponse(path, params, _index, method) {
  if (method === "GET") {
    if (path === CONFIG.adAccountId) {
      return ACCOUNT;
    }
    return {
      id: path,
      account_id: "123456789",
      name: `Object ${path}`,
      status: "PAUSED",
      effective_status: "PAUSED",
      daily_budget: "5000",
      start_time: "2026-09-18T02:00:00+0000",
      end_time: "2026-09-25T14:00:00+0000",
      targeting: { geo_locations: { countries: ["VN"] } },
    };
  }
  if (method === "POST") {
    return { success: true };
  }
  if (method === "READ_AFTER_WRITE") {
    return {
      matches: true,
      actual: { id: path, ...params.expected },
      mismatches: [],
    };
  }
  throw new Error(`Unexpected ${method} ${path}`);
}

test("activate, pause, and resume each require a fresh approved plan", async () => {
  const sourcePlan = pausedCreationPlan();
  sourcePlan.status = "consumed";
  const planStore = liveControlStore(sourcePlan);
  const { client, service } = makeService(liveControlClientResponse, {
    planStore,
    approvalRequester: async () => ({
      approved: true,
      outcome: "approved",
    }),
  });
  const common = {
    object_ids: ["1201", "2201", "3201"],
    reason: "Approved delivery control",
    source_document: "Meta-Ads-Offer-Pilot-2026-09",
    approver: "Rocky",
  };

  await service.activatePlan({
    source_plan_id: sourcePlan.plan_id,
    source_plan_digest: sourcePlan.plan_digest,
    ...common,
  });
  await service.pauseEntities(common);
  await service.resumeEntities(common);

  const posts = client.calls.filter((call) => call.method === "POST");
  assert.deepEqual(
    posts.map((call) => call.params.status),
    [
      "ACTIVE",
      "ACTIVE",
      "ACTIVE",
      "PAUSED",
      "PAUSED",
      "PAUSED",
      "ACTIVE",
      "ACTIVE",
      "ACTIVE",
    ],
  );
  assert.equal(
    planStore.calls.filter((call) => call[0] === "create").length,
    3,
  );
  assert.equal(
    planStore.calls.filter((call) => call[0] === "consume").length,
    3,
  );
});

test("budget, schedule, targeting, and placements use allowlisted writes", async () => {
  const planStore = liveControlStore();
  const { client, service } = makeService(liveControlClientResponse, {
    planStore,
    approvalRequester: async () => ({
      approved: true,
      outcome: "approved",
    }),
  });
  const approval = {
    reason: "Approved optimization",
    source_document: "Meta-Ads-Offer-Pilot-2026-09",
    approver: "Rocky",
  };

  await service.changeBudget({
    object_id: "2201",
    object_type: "ad_set",
    budget: {
      field: "daily_budget",
      amount: 7500,
      currency: "USD",
    },
    ...approval,
  });
  await service.changeSchedule({
    object_id: "2201",
    object_type: "ad_set",
    schedule: {
      start_time: "2026-09-19T09:00:00+07:00",
      end_time: "2026-09-27T21:00:00+07:00",
    },
    ...approval,
  });
  await service.changeTargeting({
    object_id: "2201",
    targeting: {
      geo_locations: { countries: ["VN"] },
      age_min: 25,
      age_max: 44,
    },
    ...approval,
  });
  await service.changePlacements({
    object_id: "2201",
    placements: {
      publisher_platforms: ["facebook", "instagram"],
      facebook_positions: ["feed"],
      instagram_positions: ["stream", "reels"],
    },
    ...approval,
  });

  const posts = client.calls.filter((call) => call.method === "POST");
  assert.deepEqual(posts.map((call) => call.params), [
    { daily_budget: 7500 },
    {
      start_time: "2026-09-19T09:00:00+07:00",
      end_time: "2026-09-27T21:00:00+07:00",
    },
    {
      targeting: {
        geo_locations: { countries: ["VN"] },
        age_min: 25,
        age_max: 44,
      },
    },
    {
      targeting: {
        geo_locations: { countries: ["VN"] },
        publisher_platforms: ["facebook", "instagram"],
        facebook_positions: ["feed"],
        instagram_positions: ["stream", "reels"],
      },
    },
  ]);

  for (const unsafeInput of [
    {
      object_id: "2201",
      object_type: "ad_set",
      budget: { field: "account_spend_cap", amount: 1, currency: "USD" },
      ...approval,
    },
    {
      object_id: "2201",
      object_type: "ad_set",
      budget: { field: "daily_budget", amount: 1, currency: "VND" },
      billing_account_id: "forbidden",
      ...approval,
    },
  ]) {
    await assert.rejects(
      () => service.changeBudget(unsafeInput),
      /invalid|unrecognized/i,
    );
  }
});

test("replace creative uses clone-and-replace and leaves the new ad PAUSED", async () => {
  const planStore = liveControlStore();
  const createdIds = ["4202", "3202"];
  let createIndex = 0;
  const { client, service } = makeService(
    async (path, params, index, method) => {
      if (method === "GET") {
        return {
          id: path,
          account_id: "123456789",
          name: "Old ad",
          adset_id: "2201",
          status: "ACTIVE",
        };
      }
      if (method === "POST" && path.endsWith("/adcreatives")) {
        return { id: createdIds[createIndex++] };
      }
      if (method === "POST" && path.endsWith("/ads")) {
        return { id: createdIds[createIndex++] };
      }
      if (method === "READ_AFTER_WRITE") {
        return {
          matches: true,
          actual: { id: path, ...params.expected },
          mismatches: [],
        };
      }
      return liveControlClientResponse(path, params, index, method);
    },
    {
      planStore,
      approvalRequester: async () => ({
        approved: true,
        outcome: "approved",
      }),
    },
  );

  const result = await service.replaceCreative({
    ad_id: "3201",
    name: "Offer photo ad v2",
    creative: {
      name: "Offer photo creative v2",
      primary_text: "A better approved message.",
      headline: "Photograph your Hanoi story",
      image_hash: "new-image-hash",
      call_to_action: {
        type: "LEARN_MORE",
        value: { link: "https://travelframe.vn/" },
      },
    },
    reason: "Approved creative refresh",
    source_document: "Meta-Ads-Offer-Pilot-2026-09",
    approver: "Rocky",
  });

  const posts = client.calls.filter((call) => call.method === "POST");
  assert.equal(posts.length, 2);
  assert.equal(posts[1].params.adset_id, "2201");
  assert.deepEqual(posts[1].params.creative, { creative_id: "4202" });
  assert.equal(posts[1].params.status, "PAUSED");
  assert.equal(result.activation_required, true);
  assert.equal(result.old_ad_id, "3201");
  assert.equal(result.new_ad_id, "3202");
});

test("rollback uses only an approved reverse plan with concrete targets", async () => {
  const sourcePlan = {
    ...pausedCreationPlan(),
    status: "consumed",
    input: {
      requested_action: "change_campaign",
      target_object_ids: ["1201"],
      reverse_plan: {
        requested_action: "rollback_campaign",
        target_object_ids: ["1201"],
        operations: [
          {
            operation_id: "rollback:campaign:1201",
            action: "update",
            entity: "campaign",
            endpoint: "1201",
            payload: { daily_budget: "5000" },
            expected: { daily_budget: "5000" },
          },
        ],
      },
    },
  };
  const planStore = liveControlStore(sourcePlan);
  const { client, service } = makeService(liveControlClientResponse, {
    planStore,
    approvalRequester: async () => ({
      approved: true,
      outcome: "approved",
    }),
  });

  await service.rollbackPlan({
    source_plan_id: sourcePlan.plan_id,
    source_plan_digest: sourcePlan.plan_digest,
    reason: "Restore the approved previous budget",
    source_document: "Meta-Ads-Offer-Pilot-2026-09",
    approver: "Rocky",
  });

  const post = client.calls.find((call) => call.method === "POST");
  assert.deepEqual(post.params, { daily_budget: "5000" });
});
