#!/usr/bin/env node
/**
 * TypeSafe Content Classifier — TravelFrame Threads scan pipeline
 * Part of TravelFrame Company OS (Technology-Automation)
 * Design: Technology-Automation/Runbooks/DES-20260925-JEV-CONTENT-CLASSIFIER.md
 *
 * Calls the TypeSafe System One API (model jev-latest) once per candidate post
 * with 4 typed questions, then exposes a classification object for the caller's
 * deterministic policy. The model classifies; code decides.
 *
 * Usage:
 *   node Technology-Automation/Scripts/typesafe_content_classifier.mjs --mock hanoi_photo_relevant
 *   node Technology-Automation/Scripts/typesafe_content_classifier.mjs --input post.json --mock auto
 *   node Technology-Automation/Scripts/typesafe_content_classifier.mjs --input post.json
 *   Live is the default when --input is given (Rocky approved 2026-09-25; paid API).
 *   Set TYPESAFE_LIVE_APPROVED=0 to force offline mock runs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_URL = 'https://api.typesafe.ai/v1/systemone';
const MODEL = 'jev-latest';
const CONF_GATE = 0.6;      // >= : trust the JEV classification
const CONF_FALLBACK = 0.5;  // <  : trust neither model nor keyword, caller falls back

const TOPIC_CHOICES = [
  'hanoi_autumn', 'street_food', 'photo_tour', 'mountain_views', 'solo_travel',
  'pricing_budget', 'en_solo', 'en_photo', 'en_itinerary', 'en_food',
  'international_vietnam', 'general',
];

// ---------------------------------------------------------------------------
// Env (same pattern as typesafe_lead_triage.mjs — never print values)
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

function validateInput(input) {
  const errors = [];
  if (!input || typeof input !== 'object') errors.push('input must be a JSON object');
  if (typeof input?.root_text !== 'string') errors.push('root_text is required (string)');
  if (!Array.isArray(input?.comments)) errors.push('comments must be an array');
  else {
    input.comments.forEach((c, i) => {
      if (!c || typeof c.text !== 'string') errors.push(`comments[${i}].text is required (string)`);
    });
  }
  if (input?.source_post_url && typeof input.source_post_url !== 'string') {
    errors.push('source_post_url must be a string when present');
  }
  if (errors.length) {
    const err = new Error(`Invalid classifier input: ${errors.join('; ')}`);
    err.exitCode = 2;
    throw err;
  }
  return input;
}

function buildState(input) {
  const root = String(input.root_text).slice(0, 600);
  const topComments = input.comments
    .slice(0, 10)
    .map((c) => `- ${String(c.text).slice(0, 300)}`)
    .join('\n');
  return {
    post_text: root,
    top_comments: topComments,
    language: detectLanguage(input.root_text),
    note: 'Text may be Vietnamese; evaluate meaning, not language. Classify the post plus its comment context.',
  };
}

function detectLanguage(text) {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(String(text || ''))
    ? 'vi'
    : 'en';
}

function buildQuestions() {
  return {
    content_relevance: {
      type: 'choice',
      instructions:
        'Classify whether this social post falls within TravelFrame content scope: ' +
        'Hanoi travel (autumn, Old Quarter, street food, cafes), Northern Vietnam mountains, ' +
        'travel photography experiences, solo travel, or trip planning. ' +
        'Out of scope: drama/relationships, finance/affiliate/earning, showbiz/concerts, ' +
        'and destinations outside Vietnam (or outside Hanoi/Northern Vietnam).',
      criteria: {
        relevant: 'Clearly within scope, even if no place name is spelled out but context implies it',
        borderline: 'Travel-flavored but too vague to place, or mixed with out-of-scope topics',
        not_relevant: 'Drama, finance, showbiz, out-of-scope destinations, or unrelated to travel',
      },
    },
    topic: {
      type: 'choice',
      instructions:
        'Pick the single best topic label for choosing a contextual reply pool. ' +
        'Use "general" only when nothing more specific fits.',
      criteria: Object.fromEntries(TOPIC_CHOICES.map((t) => [t, t])),
    },
    lead_signal: {
      type: 'choice',
      instructions:
        'Does any comment (or the post itself) show purchase or inquiry intent toward ' +
        'a photography tour, local guide, itinerary help, or pricing?',
      criteria: {
        price_question: 'Explicitly asks pricing, cost, or how much a tour/photo session is',
        photo_tour_request: 'Wants a photographer, photo tour, or photoshoot, or asks availability',
        itinerary_request: 'Asks for route/itinerary/plan help implying paid guidance',
        guide_request: 'Asks for a local guide, driver, or booking help',
        none: 'No inquiry or purchase signal',
      },
    },
    season_claim: {
      type: 'noul',
      instructions:
        'True if the post or comments assert a seasonal fact (rice harvest, buckwheat flowers, ' +
        'autumn leaves, weather) that a reply must match to stay accurate. False otherwise.',
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
  hanoi_photo_relevant: {
    answers: {
      content_relevance: { type: 'choice', choice: 'relevant', confidence: 0.9 },
      topic: { type: 'choice', choice: 'photo_tour', confidence: 0.85 },
      lead_signal: { type: 'choice', choice: 'none', confidence: 0.8 },
      season_claim: { type: 'noul', noul: 0.1 },
    },
  },
  general_unverified: {
    answers: {
      content_relevance: { type: 'choice', choice: 'borderline', confidence: 0.55 },
      topic: { type: 'choice', choice: 'general', confidence: 0.6 },
      lead_signal: { type: 'choice', choice: 'none', confidence: 0.7 },
      season_claim: { type: 'noul', noul: 0.1 },
    },
  },
  lead_price_question: {
    answers: {
      content_relevance: { type: 'choice', choice: 'relevant', confidence: 0.88 },
      topic: { type: 'choice', choice: 'photo_tour', confidence: 0.8 },
      lead_signal: { type: 'choice', choice: 'price_question', confidence: 0.9 },
      season_claim: { type: 'noul', noul: 0.05 },
    },
  },
  lead_itinerary_request: {
    answers: {
      content_relevance: { type: 'choice', choice: 'relevant', confidence: 0.82 },
      topic: { type: 'choice', choice: 'en_itinerary', confidence: 0.78 },
      lead_signal: { type: 'choice', choice: 'itinerary_request', confidence: 0.85 },
      season_claim: { type: 'noul', noul: 0.1 },
    },
  },
  blacklist_drama: {
    answers: {
      content_relevance: { type: 'choice', choice: 'not_relevant', confidence: 0.95 },
      topic: { type: 'choice', choice: 'general', confidence: 0.7 },
      lead_signal: { type: 'choice', choice: 'none', confidence: 0.9 },
      season_claim: { type: 'noul', noul: 0.02 },
    },
  },
  low_confidence_vi: {
    answers: {
      content_relevance: { type: 'choice', choice: 'borderline', confidence: 0.35 },
      topic: { type: 'choice', choice: 'general', confidence: 0.4 },
      lead_signal: { type: 'choice', choice: 'none', confidence: 0.45 },
      season_claim: { type: 'noul', noul: 0.3 },
    },
  },
};

// Offline heuristic used by --mock auto: keyword-level answers only, always
// marked source "mock" so callers never mistake it for a model verdict.
function heuristicAnswers(state) {
  const lower = `${state.post_text}\n${state.top_comments}`.toLowerCase();
  const blocked = ['người yêu', 'chia tay', 'crypto', 'kiếm tiền', 'affiliate', 'concert', 'idol', 'kpop', 'đà lạt', 'phú quốc', 'hải phòng', 'thái lan', 'nhật bản', 'hàn quốc'];
  const hit = blocked.find((w) => lower.includes(w));
  if (hit) {
    return {
      content_relevance: { type: 'choice', choice: 'not_relevant', confidence: 0.9 },
      topic: { type: 'choice', choice: 'general', confidence: 0.6 },
      lead_signal: { type: 'choice', choice: 'none', confidence: 0.8 },
      season_claim: { type: 'noul', noul: 0.05 },
    };
  }
  let topic = 'general';
  let relevant = false;
  if (/photo tour|thuê thợ|thợ chụp|chụp ảnh|photoshoot|photographer/.test(lower)) { topic = 'photo_tour'; relevant = true; }
  else if (/ăn |cà phê|phở|bún chả|quán|food|coffee|cafe/.test(lower) && /hà nội|hanoi|phố cổ|hoàn kiếm/.test(lower)) { topic = 'street_food'; relevant = true; }
  else if (/hà nội|hanoi|phố cổ|hồ gươm|hoàn kiếm|hoa sữa/.test(lower)) { topic = 'hanoi_autumn'; relevant = true; }
  else if (/hà giang|sapa|tà xùa|mù cang chải|cao bằng|ninh bình|ha giang/.test(lower)) { topic = 'mountain_views'; relevant = true; }
  else if (/solo|một mình|alone/.test(lower)) { topic = 'solo_travel'; relevant = true; }

  let lead = 'none';
  if (/giá|bao nhiêu|how much|price|cost/.test(lower)) lead = 'price_question';
  else if (/book|đặt tour|thuê thợ|photographer|photo tour/.test(lower)) lead = 'photo_tour_request';
  else if (/lịch trình|itinerary/.test(lower)) lead = 'itinerary_request';

  return {
    content_relevance: {
      type: 'choice',
      choice: relevant ? 'relevant' : 'borderline',
      confidence: relevant ? 0.65 : 0.45,
    },
    topic: { type: 'choice', choice: topic, confidence: relevant ? 0.65 : 0.4 },
    lead_signal: { type: 'choice', choice: lead, confidence: lead === 'none' ? 0.6 : 0.55 },
    season_claim: { type: 'noul', noul: /mùa|lúa|hoa|thời tiết|weather|harvest/.test(lower) ? 0.7 : 0.1 },
  };
}

function mockTransport(scenario) {
  return async (payload) => {
    if (scenario === 'auto') {
      return { answers: heuristicAnswers(payload.state) };
    }
    const mock = MOCK_SCENARIOS[scenario];
    if (!mock) {
      throw new Error(`Unknown mock scenario "${scenario}". Available: auto, ${Object.keys(MOCK_SCENARIOS).join(', ')}`);
    }
    return mock;
  };
}

// One request: independent questions over the same state (compose pattern).
// transport is injectable so tests can swap it.
async function callTypeSafe(state, opts = {}) {
  const transport = opts.transport ?? httpTransport;
  return transport({ model: MODEL, state, questions: buildQuestions() });
}

// ---------------------------------------------------------------------------
// Answer normalization + classification policy (deterministic, code-owned)
// ---------------------------------------------------------------------------

function normalizeAnswers(raw = {}) {
  const conf = (v) => (typeof v === 'number' && v >= 0 ? v : 0);
  const rel = raw.content_relevance;
  const topic = raw.topic;
  const lead = raw.lead_signal;
  const topicChoice = TOPIC_CHOICES.includes(topic?.choice) ? topic.choice : 'general';
  return {
    content_relevance: {
      choice: rel?.choice ?? 'borderline',
      confidence: rel ? conf(rel.confidence) : 0,
    },
    topic: {
      choice: topicChoice,
      confidence: topic ? conf(topic.confidence) : 0,
    },
    lead_signal: {
      choice: lead?.choice ?? 'none',
      confidence: lead ? conf(lead.confidence) : 0,
    },
    season_claim: { noul: conf(raw.season_claim?.noul) },
  };
}

function applyClassificationPolicy(a = {}) {
  // Relevance confidence drives the trust decision; the other answers are
  // acted on only when their own confidence clears the gate.
  const confidence = a.content_relevance?.confidence ?? 0;
  const leadConf = a.lead_signal?.confidence ?? 0;
  const trusted = confidence >= CONF_GATE;
  const relevantChoice = a.content_relevance?.choice ?? 'borderline';
  return {
    relevant: relevantChoice === 'relevant',
    borderline: relevantChoice === 'borderline',
    topic: trusted ? (a.topic?.choice ?? 'general') : 'general',
    is_lead: trusted && leadConf >= CONF_GATE && (a.lead_signal?.choice ?? 'none') !== 'none',
    lead_kind: trusted && leadConf >= CONF_GATE ? (a.lead_signal?.choice ?? 'none') : 'none',
    season_claim: a.season_claim?.noul ?? 0,
    confidence,
    trusted,
    below_fallback: confidence < CONF_FALLBACK,
  };
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

async function classify(input, opts = {}) {
  const state = validateInput(input);
  const apiState = buildState(state);
  const mode = opts.mode ?? 'mock';
  const transport = opts.transport
    ?? (mode === 'mock' ? mockTransport(opts.scenario ?? 'auto') : undefined);
  const response = await callTypeSafe(apiState, { transport });
  const answers = normalizeAnswers(response.answers);
  const classification = applyClassificationPolicy(answers);
  classification.source = mode === 'live' ? 'jev' : 'mock';
  return {
    meta: {
      mode,
      model: MODEL,
      ts: new Date().toISOString(),
      usage: response.usage ?? null,
    },
    answers,
    classification,
  };
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
  if (flags.help || (!flags.mock && !flags.input)) {
    console.log(
      'TypeSafe Content Classifier\n' +
      '  --mock <scenario> [--input <file>]   run offline (auto, or: ' + Object.keys(MOCK_SCENARIOS).join(', ') + ')\n' +
      '  --input <file>                       live API by default (needs TYPESAFE_API_KEY; TYPESAFE_LIVE_APPROVED=0 disables live)'
    );
    return 0;
  }

  if (!flags.mock) {
    if (process.env.TYPESAFE_LIVE_APPROVED === '0') {
      console.error('Live calls are disabled (TYPESAFE_LIVE_APPROVED=0). Use --mock for offline runs.');
      return 2;
    }
    const input = JSON.parse(fs.readFileSync(path.resolve(flags.input), 'utf8'));
    loadEnv();
    if (!process.env.TYPESAFE_API_KEY) {
      console.error('TYPESAFE_API_KEY not found in environment or .env.');
      return 2;
    }
    const output = await classify(input, { mode: 'live' });
    console.log(JSON.stringify(output, null, 2));
    return 0;
  }

  const input = flags.input
    ? JSON.parse(fs.readFileSync(path.resolve(flags.input), 'utf8'))
    : { root_text: 'mock', comments: [] };
  const output = await classify(input, { mode: 'mock', scenario: flags.mock });
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
  validateInput, buildState, buildQuestions, callTypeSafe,
  applyClassificationPolicy, classify, heuristicAnswers,
  MOCK_SCENARIOS, TOPIC_CHOICES, CONF_GATE, CONF_FALLBACK,
};
