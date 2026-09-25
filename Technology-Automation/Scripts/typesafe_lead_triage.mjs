#!/usr/bin/env node
/**
 * TypeSafe Lead Triage — TravelFrame booking workflow
 * Part of TravelFrame Company OS (Technology-Automation)
 * Design: Technology-Automation/Runbooks/DES-20260923-TYPESAFE-LEAD-TRIAGE.md
 *
 * Calls the TypeSafe System One API (model jev-latest) once per lead with 6
 * typed questions, then applies a deterministic routing policy in code.
 * AI never quotes prices and never commits to dates.
 *
 * Usage:
 *   node Technology-Automation/Scripts/typesafe_lead_triage.mjs --mock photo_tour_ready
 *   node Technology-Automation/Scripts/typesafe_lead_triage.mjs --input state.json --live
 *   Live is the default (Rocky approved 2026-09-25). Set TYPESAFE_LIVE_APPROVED=0
 *   to force offline mock runs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_URL = 'https://api.typesafe.ai/v1/systemone';
const MODEL = 'jev-latest';
const TF_FIELDS = [
  'TF_Travel_Date', 'TF_Trip_Horizon', 'TF_Party_Type', 'TF_Party_Size',
  'TF_Travel_Style', 'TF_Hanoi_Mood', 'TF_Content_Interest', 'TF_Source_Post',
];
const CONF_TAG_GATE = 0.6;   // tag/field actions are cheap and reversible
const CONF_REVIEW_GATE = 0.5; // below: do not trust the classification

// ---------------------------------------------------------------------------
// Env (same pattern as fetch_media_asset.mjs — never print values)
// ---------------------------------------------------------------------------

function loadEnv() {
  if (process.env.TYPESAFE_API_KEY) return;
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && match[1] === 'TYPESAFE_API_KEY') {
        process.env.TYPESAFE_API_KEY = (match[2] || '').trim();
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Input contract
// ---------------------------------------------------------------------------

function validateState(input) {
  const errors = [];
  if (!input || typeof input !== 'object') errors.push('input must be a JSON object');
  if (!['manychat', 'whatsapp', 'manual'].includes(input?.source)) {
    errors.push('source must be one of: manychat, whatsapp, manual');
  }
  if (!input?.subscriber || typeof input.subscriber.id !== 'string' || !input.subscriber.id) {
    errors.push('subscriber.id is required');
  }
  if (!Array.isArray(input?.conversation) || input.conversation.length < 1) {
    errors.push('conversation must be an array with at least 1 message');
  } else {
    input.conversation.forEach((m, i) => {
      if (!['user', 'bot', 'agent'].includes(m.role)) errors.push(`conversation[${i}].role must be user, bot or agent`);
      if (typeof m.text !== 'string' || !m.text.trim()) errors.push(`conversation[${i}].text must be a non-empty string`);
    });
  }
  if (input?.fields !== undefined && (typeof input.fields !== 'object' || Array.isArray(input.fields))) {
    errors.push('fields must be an object of TF_* string values');
  }
  if (input?.tags !== undefined && !Array.isArray(input.tags)) {
    errors.push('tags must be an array of strings');
  }
  if (errors.length) {
    throw new Error(`Invalid input state:\n  - ${errors.join('\n  - ')}`);
  }
  return input;
}

// ---------------------------------------------------------------------------
// State + questions (one request, independent questions over the same state)
// ---------------------------------------------------------------------------

function buildState(input) {
  const recent = input.conversation.slice(-20); // cap transcript before sending
  const conversationText = recent
    .map((m) => `${m.role}: ${m.text}`)
    .join('\n');
  const fields = {};
  for (const [k, v] of Object.entries(input.fields || {})) {
    if (TF_FIELDS.includes(k) && v) fields[k] = String(v);
  }
  return {
    conversation_text: conversationText,
    collected_fields: JSON.stringify(fields),
    language: input.subscriber.language || 'unknown',
    note: 'Some messages may be in Vietnamese; evaluate meaning, not language.',
  };
}

function buildQuestions() {
  return {
    intent: {
      type: 'choice',
      instructions:
        'Classify the primary intent of this inbound conversation with TravelFrame, ' +
        'a brand running photography tours and local story tours in Hanoi, Vietnam. ' +
        'Base the classification on the full conversation, not one message.',
      criteria: {
        photo_tour_inquiry:
          'Wants a photography or Instagram-focused tour, or mentions photo spots, a photographer, or the photo walk',
        local_tour_inquiry:
          'Asks about local food, culture or story tours, or about tour availability',
        general_travel_tips:
          'Seeks general Hanoi travel advice, itineraries or tips with no tour-purchase signal',
        price_question: 'Explicitly asks pricing, cost, or how much a tour is',
        b2b_partnership:
          'Business inquiry: agency, hotel, partnership, collaboration, press or creator collab',
        other: 'Anything that fits none of the above',
      },
    },
    trip_horizon: {
      type: 'choice',
      instructions:
        'How soon does this person plan to be in Hanoi, based on everything stated in the conversation?',
      criteria: {
        within_this_month: 'Starting within the next 30 days or naming a specific near date',
        one_to_three_months: 'Planned 1 to 3 months out',
        later_this_year:
          'More than 3 months out, a named month or season beyond 3 months, or "later this year"',
        researching_or_unknown: 'No timeline given, or just browsing',
      },
    },
    party_type: {
      type: 'choice',
      instructions: 'Who is traveling, based on the conversation?',
      criteria: {
        solo: 'Traveling alone',
        couple: 'Two people, partner or spouse',
        friends: 'Group of friends (3 or more people)',
        family: 'With children, parents or family members',
        unknown: 'Party composition not stated',
      },
    },
    purchase_intent: {
      type: 'score',
      instructions:
        'Score how close this lead is to booking a paid tour with TravelFrame, ' +
        'using the highest stage the conversation evidences.',
      criteria: [
        '0 researching: gathering general info, no dates or specifics',
        '1 comparing_options: comparing tours or asking details, soft timeframe',
        '2 has_dates_and_details: has dates and party composition, asking availability or fit',
        '3 ready_to_book: explicitly wants to book, reserve or pay now',
      ],
    },
    has_travel_date: {
      type: 'noul',
      instructions:
        'True if the conversation states or strongly implies a concrete travel date or narrow ' +
        'timeframe (e.g. "March 12", "next weekend", "in two weeks"). ' +
        'False if the date is unknown, vague, or hypothetical.',
    },
    needs_human: {
      type: 'noul',
      instructions:
        'True if the subscriber shows frustration or a complaint about a past experience, a safety ' +
        'concern (e.g. solo-female safety, harassment), accessibility or mobility needs, medical or ' +
        'dietary constraints, visa or logistics confusion the assistant cannot resolve, or explicitly ' +
        'asks for a human agent. False for normal tour interest.',
    },
  };
}

// ---------------------------------------------------------------------------
// Transports
// ---------------------------------------------------------------------------

async function httpTransport(payload) {
  const key = process.env.TYPESAFE_API_KEY;
  if (!key) {
    const err = new Error('TYPESAFE_API_KEY not set. Add it to .env (gitignored).');
    err.exitCode = 2;
    throw err;
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 300); } catch { /* ignore */ }
    const err = new Error(`TypeSafe API error ${res.status}: ${detail}`);
    err.exitCode = 1;
    throw err;
  }
  return res.json();
}

// Deterministic canned answers, shaped exactly like API responses.
const MOCK_SCENARIOS = {
  photo_tour_ready: {
    answers: {
      intent: { type: 'choice', choice: 'photo_tour_inquiry', confidence: 0.9 },
      trip_horizon: { type: 'choice', choice: 'within_this_month', confidence: 0.85 },
      party_type: { type: 'choice', choice: 'solo', confidence: 0.9 },
      purchase_intent: { type: 'score', score: 3, confidence: 0.85 },
      has_travel_date: { type: 'noul', noul: 0.9 },
      needs_human: { type: 'noul', noul: 0.05 },
    },
  },
  general_tips_researching: {
    answers: {
      intent: { type: 'choice', choice: 'general_travel_tips', confidence: 0.8 },
      trip_horizon: { type: 'choice', choice: 'researching_or_unknown', confidence: 0.75 },
      party_type: { type: 'choice', choice: 'unknown', confidence: 0.7 },
      purchase_intent: { type: 'score', score: 0.4, confidence: 0.8 },
      has_travel_date: { type: 'noul', noul: 0.15 },
      needs_human: { type: 'noul', noul: 0.05 },
    },
  },
  vi_ambiguous: {
    answers: {
      intent: { type: 'choice', choice: 'other', confidence: 0.4 },
      trip_horizon: { type: 'choice', choice: 'researching_or_unknown', confidence: 0.45 },
      party_type: { type: 'choice', choice: 'unknown', confidence: 0.55 },
      purchase_intent: { type: 'score', score: 0.8, confidence: 0.4 },
      has_travel_date: { type: 'noul', noul: 0.2 },
      needs_human: { type: 'noul', noul: 0.1 },
    },
  },
  b2b_inquiry: {
    answers: {
      intent: { type: 'choice', choice: 'b2b_partnership', confidence: 0.85 },
      trip_horizon: { type: 'choice', choice: 'researching_or_unknown', confidence: 0.65 },
      party_type: { type: 'choice', choice: 'unknown', confidence: 0.6 },
      purchase_intent: { type: 'score', score: 0.3, confidence: 0.7 },
      has_travel_date: { type: 'noul', noul: 0.05 },
      needs_human: { type: 'noul', noul: 0.1 },
    },
  },
  safety_needs_human: {
    answers: {
      intent: { type: 'choice', choice: 'general_travel_tips', confidence: 0.7 },
      trip_horizon: { type: 'choice', choice: 'one_to_three_months', confidence: 0.7 },
      party_type: { type: 'choice', choice: 'solo', confidence: 0.8 },
      purchase_intent: { type: 'score', score: 1.2, confidence: 0.7 },
      has_travel_date: { type: 'noul', noul: 0.3 },
      needs_human: { type: 'noul', noul: 0.85 },
    },
  },
  price_question: {
    answers: {
      intent: { type: 'choice', choice: 'price_question', confidence: 0.88 },
      trip_horizon: { type: 'choice', choice: 'one_to_three_months', confidence: 0.6 },
      party_type: { type: 'choice', choice: 'couple', confidence: 0.7 },
      purchase_intent: { type: 'score', score: 1.5, confidence: 0.75 },
      has_travel_date: { type: 'noul', noul: 0.3 },
      needs_human: { type: 'noul', noul: 0.1 },
    },
  },
};

function mockTransport(scenario) {
  return async () => {
    const mock = MOCK_SCENARIOS[scenario];
    if (!mock) {
      throw new Error(`Unknown mock scenario "${scenario}". Available: ${Object.keys(MOCK_SCENARIOS).join(', ')}`);
    }
    return mock;
  };
}

// One request: independent questions over the same state (compose pattern).
// transport is injectable so tests and the future webhook can swap it.
async function callTypeSafe(state, opts = {}) {
  const transport = opts.transport ?? httpTransport;
  return transport({ model: MODEL, state, questions: buildQuestions() });
}

// ---------------------------------------------------------------------------
// Answer normalization + routing policy (deterministic, code-owned)
// ---------------------------------------------------------------------------

function normalizeAnswers(raw = {}) {
  const conf = (v) => (typeof v === 'number' && v >= 0 ? v : 0);
  const intent = raw.intent;
  const trip = raw.trip_horizon;
  const party = raw.party_type;
  const purchase = raw.purchase_intent;
  return {
    intent: {
      choice: intent?.choice ?? 'other',
      confidence: intent ? conf(intent.confidence) : 0,
    },
    trip_horizon: {
      choice: trip?.choice ?? 'researching_or_unknown',
      confidence: trip ? conf(trip.confidence) : 0,
    },
    party_type: {
      choice: party?.choice ?? 'unknown',
      confidence: party ? conf(party.confidence) : 0,
    },
    purchase_intent: {
      score: typeof purchase?.score === 'number' ? purchase.score : 0,
      confidence: purchase ? conf(purchase.confidence) : 0,
    },
    has_travel_date: { noul: conf(raw.has_travel_date?.noul) },
    needs_human: { noul: conf(raw.needs_human?.noul) },
  };
}

function applyRoutingPolicy(a = {}) {
  const reasons = [];
  const needsHuman = a.needs_human?.noul ?? 0;
  const intentChoice = a.intent?.choice ?? 'other';
  const intentConfidence = a.intent?.confidence ?? 0;
  const purchaseScore = a.purchase_intent?.score ?? 0;
  if (needsHuman >= CONF_TAG_GATE) {
    reasons.push('needs_human.noul>=0.6');
    return { route: 'escalate_human', priority: 'P1', reasons };
  }
  if (intentChoice === 'b2b_partnership' && intentConfidence >= CONF_TAG_GATE) {
    reasons.push('intent=b2b_partnership');
    return { route: 'escalate_human', priority: 'P1', reasons };
  }
  const tourIntent = ['photo_tour_inquiry', 'local_tour_inquiry'].includes(intentChoice);
  if (purchaseScore >= 2.5 && tourIntent) {
    reasons.push('purchase_intent.score>=2.5+tour_intent');
    return { route: 'escalate_human', priority: 'P1', reasons };
  }
  if (intentChoice === 'price_question' && intentConfidence >= CONF_TAG_GATE) {
    reasons.push('price_question->human_never_quotes');
    return { route: 'escalate_human', priority: 'P2', reasons };
  }
  if (intentConfidence < CONF_REVIEW_GATE) {
    reasons.push('intent.confidence<0.5');
    return { route: 'review', priority: 'P2', reasons };
  }
  return { route: 'nurture', priority: 'P3', reasons };
}

// ---------------------------------------------------------------------------
// Actions (ManyChat mapping, confidence-gated)
// ---------------------------------------------------------------------------

const INTENT_TAG = {
  photo_tour_inquiry: 'TF_Intent_PhotoTour',
  local_tour_inquiry: 'TF_Intent_LocalTour',
  general_travel_tips: 'TF_Intent_TravelTips',
  b2b_partnership: 'TF_Intent_B2B', // no intent tag for price_question / other
};

const TRIP_HORIZON_MAP = {
  within_this_month: { field: 'This month', tag: 'TF_Trip_ThisMonth' },
  one_to_three_months: { field: 'In 1-3 months', tag: 'TF_Trip_1to3Months' },
  later_this_year: { field: 'Later this year', tag: 'TF_Trip_Later' },
  researching_or_unknown: { field: 'Just researching', tag: 'TF_Researching' },
};

const PARTY_TYPE_MAP = {
  solo: { field: 'Just me', tag: 'TF_Party_Solo' },
  couple: { field: 'My partner', tag: 'TF_Party_Couple' },
  friends: { field: 'Friends', tag: 'TF_Party_Friends' },
  family: { field: 'Family', tag: 'TF_Party_Family' },
};

function buildActions(a = {}, decision = { route: 'nurture' }) {
  const actions = [];
  const tag = (name, extra) => actions.push({ type: 'add_tag', tag: name, ...extra });
  const field = (name, value) => actions.push({ type: 'set_field', field: name, value });

  if ((a.intent?.confidence ?? 0) >= CONF_TAG_GATE && INTENT_TAG[a.intent?.choice]) {
    if (a.intent.choice === 'b2b_partnership') {
      tag(INTENT_TAG[a.intent.choice], { requires_manychat_setup: true });
    } else {
      tag(INTENT_TAG[a.intent.choice]);
    }
  }
  const horizon = TRIP_HORIZON_MAP[a.trip_horizon?.choice];
  if (horizon && a.trip_horizon.confidence >= CONF_TAG_GATE) {
    field('TF_Trip_Horizon', horizon.field);
    tag(horizon.tag);
  }
  const party = PARTY_TYPE_MAP[a.party_type?.choice];
  if (party && a.party_type.confidence >= CONF_TAG_GATE) {
    field('TF_Party_Type', party.field);
    tag(party.tag);
  }
  if ((a.purchase_intent?.score ?? 0) >= 2.5) tag('TF_Status_Qualified');
  if (decision.route === 'escalate_human' || decision.route === 'review') {
    tag('TF_Status_HumanHandoff');
  }
  return actions;
}

// Guardrail: no tour prices may ever appear in the output.
const PRICE_RE = /\$\s?\d{2,4}/;
function assertPriceGuardrail(output) {
  if (PRICE_RE.test(JSON.stringify(output))) {
    throw new Error('Price guardrail violated: output contains a tour price. This is a bug.');
  }
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

async function triage(input, opts = {}) {
  const state = validateState(input);
  const apiState = buildState(state);
  const mode = opts.mode ?? 'mock';
  const transport = opts.transport
    ?? (mode === 'mock' ? mockTransport(opts.scenario ?? 'general_tips_researching') : undefined);
  const response = await callTypeSafe(apiState, { transport });
  const answers = normalizeAnswers(response.answers);
  const decision = applyRoutingPolicy(answers);
  const actions = buildActions(answers, decision);
  const output = {
    meta: {
      mode,
      model: MODEL,
      ts: new Date().toISOString(),
      usage: response.usage ?? null,
    },
    answers,
    decision,
    actions,
    guardrails: { price_quoted: false, date_committed: false },
  };
  assertPriceGuardrail(output);
  return output;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseFlags(rawArgs) {
  const flags = {};
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] === '--input' || rawArgs[i] === '--mock') flags[rawArgs[i].slice(2)] = rawArgs[i + 1];
    else if (rawArgs[i] === '--live') flags.live = true;
  }
  return flags;
}

async function cli(argv) {
  const flags = parseFlags(argv);
  if (flags.help || (!flags.input && !flags.mock)) {
    console.log(
      'TypeSafe Lead Triage\n' +
      '  --mock <scenario>          run offline (scenarios: ' + Object.keys(MOCK_SCENARIOS).join(', ') + ')\n' +
      '  --input <file> --live      call the live API (needs TYPESAFE_API_KEY; set TYPESAFE_LIVE_APPROVED=0 to disable live)'
    );
    return 0;
  }
  if (flags.mock) {
    // Mock-only run: minimal synthetic state so mock transport still gets a payload.
    const input = flags.input
      ? JSON.parse(fs.readFileSync(path.resolve(flags.input), 'utf8'))
      : { source: 'manual', subscriber: { id: 'mock', language: 'unknown' }, conversation: [{ role: 'user', text: 'mock' }] };
    const output = await triage(input, { mode: 'mock', scenario: flags.mock });
    console.log(JSON.stringify(output, null, 2));
    return 0;
  }

  if (process.env.TYPESAFE_LIVE_APPROVED === '0') {
    console.error('Live calls are disabled (TYPESAFE_LIVE_APPROVED=0). Use --mock for offline runs.');
    return 2;
  }
  if (!flags.input) {
    console.error('Live mode requires --input <state.json>.');
    return 2;
  }
  const input = JSON.parse(fs.readFileSync(path.resolve(flags.input), 'utf8'));
  loadEnv();
  if (!process.env.TYPESAFE_API_KEY) {
    console.error('TYPESAFE_API_KEY not found in environment or .env.');
    return 2;
  }

  const output = await triage(input, { mode: 'live' });
  console.log(JSON.stringify(output, null, 2));
  return 0;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  loadEnv();
  cli(process.argv.slice(2))
    .then((code) => { process.exitCode = code; })
    .catch((err) => {
      console.error(err.message);
      process.exitCode = err.exitCode ?? 1;
    });
}

export {
  validateState, buildState, buildQuestions, callTypeSafe,
  applyRoutingPolicy, buildActions, triage, MOCK_SCENARIOS,
};