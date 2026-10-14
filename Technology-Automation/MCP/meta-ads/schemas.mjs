import { z } from "zod";

const metaId = z.string().regex(/^\d+$/);
const cursor = z.string().min(1).max(500);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const boundedText = (minimum, maximum) =>
  z.string().trim().min(minimum).max(maximum);
const positiveMinorUnits = z.number().int().positive().max(1_000_000_000_000);
const keySchema = z.string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/);
const zonedDateTime = z
  .string()
  .max(40)
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(
        value,
      ) && Number.isFinite(Date.parse(value)),
    "Invalid ISO date-time with timezone offset",
  );

export const statusSchema = z.enum([
  "ACTIVE",
  "PAUSED",
  "DELETED",
  "ARCHIVED",
]);

export const effectiveStatusSchema = z.enum([
  "ACTIVE",
  "PAUSED",
  "DELETED",
  "ARCHIVED",
  "IN_PROCESS",
  "WITH_ISSUES",
  "CAMPAIGN_PAUSED",
  "ADSET_PAUSED",
  "PENDING_REVIEW",
  "PREAPPROVED",
  "PENDING_BILLING_INFO",
  "DISAPPROVED",
]);

export const insightLevelSchema = z.enum([
  "account",
  "campaign",
  "adset",
  "ad",
]);

export const insightFields = Object.freeze([
  "account_id",
  "account_name",
  "campaign_id",
  "campaign_name",
  "adset_id",
  "adset_name",
  "ad_id",
  "ad_name",
  "date_start",
  "date_stop",
  "spend",
  "impressions",
  "reach",
  "frequency",
  "cpm",
  "clicks",
  "inline_link_clicks",
  "ctr",
  "inline_link_click_ctr",
  "cpc",
  "actions",
  "cost_per_action_type",
  "action_values",
  "cost_per_conversion",
  "conversions",
  "conversion_values",
  "objective",
  "buying_type",
]);

export const insightBreakdowns = Object.freeze([
  "publisher_platform",
  "platform_position",
  "impression_device",
  "device_platform",
  "age",
  "gender",
  "country",
  "region",
]);

const uniqueArray = (schema, message) =>
  schema.superRefine((values, context) => {
    if (new Set(values).size !== values.length) {
      context.addIssue({
        code: "custom",
        message,
      });
    }
  });

export const getAdAccountInputSchema = z.object({}).strict();

export const listAdAccountsInputSchema = z
  .object({
    limit: z.number().int().min(1).max(100).default(100),
    after: cursor.optional(),
  })
  .strict();

export const listCampaignsInputSchema = z
  .object({
    effective_status: uniqueArray(
      z.array(effectiveStatusSchema).min(1).max(12),
      "Duplicate effective statuses are not allowed",
    ).optional(),
    limit: z.number().int().min(1).max(100).default(25),
    after: cursor.optional(),
  })
  .strict();

export const campaignStructureInputSchema = z
  .object({
    campaign_id: metaId,
  })
  .strict();

export const dateRangeSchema = z
  .object({
    since: isoDate,
    until: isoDate,
  })
  .strict()
  .refine((value) => value.since <= value.until, {
    message: "Invalid date range: since must not be after until",
  });

export const adsInsightsInputSchema = z
  .object({
    object_id: metaId.optional(),
    level: insightLevelSchema,
    date_range: dateRangeSchema,
    fields: uniqueArray(
      z.array(z.enum(insightFields)).min(1).max(insightFields.length),
      "Duplicate insight fields are not allowed",
    ),
    breakdowns: uniqueArray(
      z.array(z.enum(insightBreakdowns)).min(1).max(4),
      "Duplicate insight breakdowns are not allowed",
    ).optional(),
    time_increment: z.union([z.literal(1), z.literal(7), z.literal(28)]).optional(),
    limit: z.number().int().min(1).max(500).default(100),
    after: cursor.optional(),
  })
  .strict();

export const deliveryStateInputSchema = z
  .object({
    object_ids: uniqueArray(
      z.array(metaId).min(1).max(20),
      "Duplicate object IDs are not allowed",
    ),
  })
  .strict();

const campaignBudgetSchema = z
  .object({
    strategy: z.enum([
      "CAMPAIGN_DAILY",
      "CAMPAIGN_LIFETIME",
      "ADSET_DAILY",
      "ADSET_LIFETIME",
    ]),
    currency: z.string().regex(/^[A-Z]{3}$/),
    campaign_spend_limit: positiveMinorUnits,
    daily_budget: positiveMinorUnits.optional(),
    lifetime_budget: positiveMinorUnits.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.strategy === "CAMPAIGN_DAILY" &&
      value.daily_budget === undefined
    ) {
      context.addIssue({
        code: "custom",
        path: ["daily_budget"],
        message: "CAMPAIGN_DAILY requires daily_budget",
      });
    }
    if (
      value.strategy === "CAMPAIGN_LIFETIME" &&
      value.lifetime_budget === undefined
    ) {
      context.addIssue({
        code: "custom",
        path: ["lifetime_budget"],
        message: "CAMPAIGN_LIFETIME requires lifetime_budget",
      });
    }
  });

const campaignScheduleSchema = z
  .object({
    start_time: zonedDateTime,
    end_time: zonedDateTime,
    timezone: boundedText(1, 100),
  })
  .strict()
  .refine(
    (value) => Date.parse(value.start_time) < Date.parse(value.end_time),
    {
      path: ["end_time"],
      message: "Schedule end_time must be after start_time",
    },
  );

const actorSchema = z
  .object({
    page_id: metaId,
    instagram_account_id: metaId,
  })
  .strict();

const audienceSchema = z
  .object({
    locations: z
      .object({
        countries: uniqueArray(
          z.array(z.string().regex(/^[A-Z]{2}$/)).min(1).max(25),
          "Duplicate audience countries are not allowed",
        ),
      })
      .strict(),
    age_min: z.number().int().min(18).max(65),
    age_max: z.number().int().min(18).max(65),
    genders: uniqueArray(
      z.array(z.union([z.literal(1), z.literal(2)])).min(1).max(2),
      "Duplicate audience genders are not allowed",
    ),
    languages: uniqueArray(
      z.array(boundedText(1, 20)).min(1).max(20),
      "Duplicate audience languages are not allowed",
    ),
    targeting: z.record(z.string(), z.unknown()),
  })
  .strict()
  .refine((value) => value.age_min <= value.age_max, {
    path: ["age_max"],
    message: "Audience age_max must not be below age_min",
  });

const placementsSchema = z
  .object({
    publisher_platforms: uniqueArray(
      z
        .array(z.enum(["facebook", "instagram", "messenger", "audience_network"]))
        .min(1)
        .max(4),
      "Duplicate publisher platforms are not allowed",
    ),
    facebook_positions: uniqueArray(
      z.array(boundedText(1, 40)).min(1).max(20),
      "Duplicate Facebook positions are not allowed",
    ).optional(),
    instagram_positions: uniqueArray(
      z.array(boundedText(1, 40)).min(1).max(20),
      "Duplicate Instagram positions are not allowed",
    ).optional(),
    messenger_positions: uniqueArray(
      z.array(boundedText(1, 40)).min(1).max(20),
      "Duplicate Messenger positions are not allowed",
    ).optional(),
    audience_network_positions: uniqueArray(
      z.array(boundedText(1, 40)).min(1).max(20),
      "Duplicate Audience Network positions are not allowed",
    ).optional(),
  })
  .strict();

const adSetPlanSchema = z
  .object({
    key: keySchema,
    name: boundedText(1, 255),
    daily_budget: positiveMinorUnits.optional(),
    lifetime_budget: positiveMinorUnits.optional(),
    optimization_goal: boundedText(1, 80),
    billing_event: boundedText(1, 80),
    bid_strategy: boundedText(1, 80),
    bid_amount: positiveMinorUnits.optional(),
  })
  .strict();

const creativePlanSchema = z
  .object({
    key: keySchema,
    name: boundedText(1, 255),
    primary_text: boundedText(1, 5000),
    headline: boundedText(1, 255),
    description: boundedText(1, 1000).optional(),
    image_hash: boundedText(1, 255).optional(),
    video_id: metaId.optional(),
    call_to_action: z
      .object({
        type: boundedText(1, 80),
        value: z
          .object({
            link: z.string().url().max(2048),
          })
          .strict(),
      })
      .strict(),
  })
  .strict()
  .refine(
    (value) =>
      (value.image_hash === undefined) !== (value.video_id === undefined),
    {
      message: "Creative requires exactly one image_hash or video_id",
    },
  );

const adPlanSchema = z
  .object({
    key: keySchema,
    name: boundedText(1, 255),
    ad_set_key: keySchema,
    creative_key: keySchema,
    tracking_specs: z.array(z.record(z.string(), z.unknown())).max(20).optional(),
  })
  .strict();

export const draftCampaignPlanInputSchema = z
  .object({
    internal_campaign_id: keySchema,
    name: boundedText(1, 255),
    objective: boundedText(1, 80),
    buying_type: z.enum(["AUCTION", "RESERVED"]),
    special_ad_categories: uniqueArray(
      z.array(boundedText(1, 80)).max(20),
      "Duplicate special ad categories are not allowed",
    ),
    conversion_destination: boundedText(1, 80),
    budget: campaignBudgetSchema,
    schedule: campaignScheduleSchema,
    actor: actorSchema,
    audience: audienceSchema,
    placements: placementsSchema,
    ad_sets: uniqueArray(
      z.array(adSetPlanSchema).min(1).max(20),
      "Duplicate ad set definitions are not allowed",
    ),
    creatives: uniqueArray(
      z.array(creativePlanSchema).min(1).max(20),
      "Duplicate creative definitions are not allowed",
    ),
    ads: uniqueArray(
      z.array(adPlanSchema).min(1).max(50),
      "Duplicate ad definitions are not allowed",
    ),
    business_owner: boundedText(1, 255),
    approval_reason: boundedText(1, 1000),
    source_document: boundedText(1, 500),
  })
  .strict()
  .superRefine((value, context) => {
    const adSetKeys = new Set(value.ad_sets.map((item) => item.key));
    const creativeKeys = new Set(value.creatives.map((item) => item.key));
    if (adSetKeys.size !== value.ad_sets.length) {
      context.addIssue({
        code: "custom",
        path: ["ad_sets"],
        message: "Duplicate ad set keys are not allowed",
      });
    }
    if (creativeKeys.size !== value.creatives.length) {
      context.addIssue({
        code: "custom",
        path: ["creatives"],
        message: "Duplicate creative keys are not allowed",
      });
    }
    const adKeys = new Set(value.ads.map((item) => item.key));
    if (adKeys.size !== value.ads.length) {
      context.addIssue({
        code: "custom",
        path: ["ads"],
        message: "Duplicate ad keys are not allowed",
      });
    }
    for (const [index, ad] of value.ads.entries()) {
      if (!adSetKeys.has(ad.ad_set_key)) {
        context.addIssue({
          code: "custom",
          path: ["ads", index, "ad_set_key"],
          message: "Ad references an unknown ad set key",
        });
      }
      if (!creativeKeys.has(ad.creative_key)) {
        context.addIssue({
          code: "custom",
          path: ["ads", index, "creative_key"],
          message: "Ad references an unknown creative key",
        });
      }
    }
    for (const [index, adSet] of value.ad_sets.entries()) {
      if (
        value.budget.strategy === "ADSET_DAILY" &&
        adSet.daily_budget === undefined
      ) {
        context.addIssue({
          code: "custom",
          path: ["ad_sets", index, "daily_budget"],
          message: "ADSET_DAILY requires daily_budget on every ad set",
        });
      }
      if (
        value.budget.strategy === "ADSET_LIFETIME" &&
        adSet.lifetime_budget === undefined
      ) {
        context.addIssue({
          code: "custom",
          path: ["ad_sets", index, "lifetime_budget"],
          message: "ADSET_LIFETIME requires lifetime_budget on every ad set",
        });
      }
    }
  });

const nonEmptyStrictObject = (shape) =>
  z
    .object(shape)
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one change is required",
    });

const campaignChangesSchema = nonEmptyStrictObject({
  name: boundedText(1, 255).optional(),
  daily_budget: positiveMinorUnits.optional(),
  lifetime_budget: positiveMinorUnits.optional(),
  bid_strategy: boundedText(1, 80).optional(),
  spend_cap: positiveMinorUnits.optional(),
  start_time: zonedDateTime.optional(),
  stop_time: zonedDateTime.optional(),
});

const adSetChangesSchema = nonEmptyStrictObject({
  name: boundedText(1, 255).optional(),
  daily_budget: positiveMinorUnits.optional(),
  lifetime_budget: positiveMinorUnits.optional(),
  bid_strategy: boundedText(1, 80).optional(),
  bid_amount: positiveMinorUnits.optional(),
  start_time: zonedDateTime.optional(),
  end_time: zonedDateTime.optional(),
  targeting: z.record(z.string(), z.unknown()).optional(),
});

const adChangesSchema = nonEmptyStrictObject({
  name: boundedText(1, 255).optional(),
});

const changeMetadata = {
  object_id: metaId,
  reason: boundedText(1, 1000),
  source_document: boundedText(1, 500),
};

export const draftChangePlanInputSchema = z.discriminatedUnion(
  "object_type",
  [
    z
      .object({
        ...changeMetadata,
        object_type: z.literal("campaign"),
        changes: campaignChangesSchema,
      })
      .strict(),
    z
      .object({
        ...changeMetadata,
        object_type: z.literal("ad_set"),
        changes: adSetChangesSchema,
      })
      .strict(),
    z
      .object({
        ...changeMetadata,
        object_type: z.literal("ad"),
        changes: adChangesSchema,
      })
      .strict(),
  ],
);

export const planReferenceInputSchema = z
  .object({
    plan_id: z.string().uuid(),
  })
  .strict();

export const applyPlanInputSchema = z
  .object({
    plan_id: z.string().uuid(),
    plan_digest: z.string().regex(/^[a-f0-9]{64}$/),
    approver: boundedText(1, 255),
  })
  .strict();

const approvalMetadata = {
  reason: boundedText(1, 1000),
  source_document: boundedText(1, 500),
  approver: boundedText(1, 255),
};

const objectIds = uniqueArray(
  z.array(metaId).min(1).max(20),
  "Duplicate object IDs are not allowed",
);

export const statusControlInputSchema = z
  .object({
    object_ids: objectIds,
    ...approvalMetadata,
  })
  .strict();

export const activatePlanInputSchema = z
  .object({
    source_plan_id: z.string().uuid(),
    source_plan_digest: z.string().regex(/^[a-f0-9]{64}$/),
    object_ids: objectIds,
    ...approvalMetadata,
  })
  .strict();

export const changeBudgetInputSchema = z
  .object({
    object_id: metaId,
    object_type: z.enum(["campaign", "ad_set"]),
    budget: z
      .object({
        field: z.enum(["daily_budget", "lifetime_budget", "spend_cap"]),
        amount: positiveMinorUnits,
        currency: z.string().regex(/^[A-Z]{3}$/),
      })
      .strict(),
    ...approvalMetadata,
  })
  .strict()
  .refine(
    (value) =>
      value.object_type === "campaign" || value.budget.field !== "spend_cap",
    {
      path: ["budget", "field"],
      message: "spend_cap is supported only for campaigns",
    },
  );

const liveScheduleSchema = z
  .object({
    start_time: zonedDateTime.optional(),
    end_time: zonedDateTime.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one schedule field is required",
  })
  .refine(
    (value) =>
      !value.start_time ||
      !value.end_time ||
      Date.parse(value.start_time) < Date.parse(value.end_time),
    {
      path: ["end_time"],
      message: "Schedule end_time must be after start_time",
    },
  );

export const changeScheduleInputSchema = z
  .object({
    object_id: metaId,
    object_type: z.enum(["campaign", "ad_set"]),
    schedule: liveScheduleSchema,
    ...approvalMetadata,
  })
  .strict();

export const changeTargetingInputSchema = z
  .object({
    object_id: metaId,
    targeting: z
      .record(z.string(), z.unknown())
      .refine((value) => Object.keys(value).length > 0, {
        message: "Targeting must not be empty",
      }),
    ...approvalMetadata,
  })
  .strict();

export const changePlacementsInputSchema = z
  .object({
    object_id: metaId,
    placements: placementsSchema,
    ...approvalMetadata,
  })
  .strict();

const replacementCreativeSchema = z
  .object({
    name: boundedText(1, 255),
    primary_text: boundedText(1, 5000),
    headline: boundedText(1, 255),
    description: boundedText(1, 1000).optional(),
    image_hash: boundedText(1, 255).optional(),
    video_id: metaId.optional(),
    call_to_action: z
      .object({
        type: boundedText(1, 80),
        value: z
          .object({
            link: z.string().url().max(2048),
          })
          .strict(),
      })
      .strict(),
  })
  .strict()
  .refine(
    (value) =>
      (value.image_hash === undefined) !== (value.video_id === undefined),
    {
      message: "Creative requires exactly one image_hash or video_id",
    },
  );

export const replaceCreativeInputSchema = z
  .object({
    ad_id: metaId,
    name: boundedText(1, 255),
    creative: replacementCreativeSchema,
    ...approvalMetadata,
  })
  .strict();

export const rollbackPlanInputSchema = z
  .object({
    source_plan_id: z.string().uuid(),
    source_plan_digest: z.string().regex(/^[a-f0-9]{64}$/),
    ...approvalMetadata,
  })
  .strict();

export const campaignCreateFields = Object.freeze([
  "name",
  "objective",
  "buying_type",
  "special_ad_categories",
  "daily_budget",
  "lifetime_budget",
  "bid_strategy",
  "spend_cap",
  "start_time",
  "stop_time",
  "status",
]);

export const campaignUpdateFields = Object.freeze([
  "name",
  "daily_budget",
  "lifetime_budget",
  "bid_strategy",
  "spend_cap",
  "start_time",
  "stop_time",
  "status",
]);

export const adSetUpdateFields = Object.freeze([
  "name",
  "daily_budget",
  "lifetime_budget",
  "bid_strategy",
  "bid_amount",
  "start_time",
  "end_time",
  "targeting",
  "status",
]);

export const adUpdateFields = Object.freeze([
  "name",
  "creative",
  "status",
]);
