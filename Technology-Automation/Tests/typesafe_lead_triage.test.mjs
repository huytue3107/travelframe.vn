/**
 * Tests for TypeSafe Lead Triage (Technology-Automation).
 * Run: npm run test:triage
 *
 * All fixtures are synthetic — no PII, no real subscriber data.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateState, buildState, applyRoutingPolicy, buildActions, triage, MOCK_SCENARIOS,
} from '../Scripts/typesafe_lead_triage.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = path.join(ROOT, 'Technology-Automation/Scripts/typesafe_lead_triage.mjs');

// ---------------------------------------------------------------------------
// Synthetic state fixtures (shaped like real ManyChat exports, fictional)
// ---------------------------------------------------------------------------

function makeState(conversation, extra = {}) {
  return {
    source: 'manychat',
    subscriber: { id: 'test-subscriber', language: 'en' },
    conversation,
    fields: {},
    ...extra,
  };
}

const FIXTURES = {
  photo_tour_ready: makeState([
    { role: 'user', text: 'Hi! I saw your reel about the Hanoi photo walk 😍' },
    { role: 'bot', text: 'Love that! When will you be in Hanoi?' },
    { role: 'user', text: "I'm traveling alone and will be in Hanoi March 12. I want natural photos for my Instagram, no stiff posing." },
    { role: 'bot', text: 'Great! Who are you traveling with?' },
    { role: 'user', text: 'Just me. Is the photo walk available that morning?' },
  ], { fields: { TF_Source_Post: 'IG Reel photo CTA' } }),
  general_tips_researching: makeState([
    { role: 'user', text: 'Hi, I found your page while planning a Vietnam trip sometime next year.' },
    { role: 'bot', text: 'What would help you next?' },
    { role: 'user', text: 'Just some Hanoi street food tips for now, thanks!' },
  ]),
  vi_ambiguous: {
    source: 'manychat',
    subscriber: { id: 'test-subscriber-vi', language: 'vi' },
    conversation: [
      { role: 'user', text: 'mình đang tìm hiểu về hà nội, chưa biết lịch trình sao cho hợp lý' },
      { role: 'bot', text: 'Bạn đi vào thời gian nào vậy?' },
      { role: 'user', text: 'chưa rõ, chắc tối nay nhắn lại' },
    ],
    fields: {},
  },
  b2b_inquiry: makeState([
    { role: 'user', text: 'Hello, I manage a boutique hotel in the Old Quarter. We would like to partner with you as a concierge referral for our guests.' },
    { role: 'bot', text: 'Thanks! Can you share more about your property?' },
    { role: 'user', text: 'Sure, it is a 12-room boutique hotel, we can promote your tours at the front desk for a commission.' },
  ]),
  safety_needs_human: makeState([
    { role: 'user', text: 'Hi, I will be in Hanoi in a couple of months. Honestly I am a bit worried about harassment — I will be traveling alone and I have read mixed things about solo female safety there.' },
    { role: 'bot', text: 'Thanks for sharing! What would help you next?' },
    { role: 'user', text: 'I just want to talk to someone real about it before deciding anything.' },
  ]),
  price_question: makeState([
    { role: 'user', text: 'How much is the signature story tour for two people?' },
    { role: 'bot', text: 'Which dates work for you?' },
    { role: 'user', text: 'Roughly late October, partner and me. Just want the price first.' },
  ]),
};

// ---------------------------------------------------------------------------
// Scenario fixtures through the triage orchestrator (mock transport)
// ---------------------------------------------------------------------------

test('photo_tour_ready escalates P1 with full tag mapping', async () => {
  const out = await triage(FIXTURES.photo_tour_ready, { mode: 'mock', scenario: 'photo_tour_ready' });
  assert.equal(out.decision.route, 'escalate_human');
  assert.equal(out.decision.priority, 'P1');
  const tags = out.actions.filter((a) => a.type === 'add_tag').map((a) => a.tag);
  for (const expected of ['TF_Intent_PhotoTour', 'TF_Party_Solo', 'TF_Status_Qualified', 'TF_Status_HumanHandoff']) {
    assert.ok(tags.includes(expected), `missing tag ${expected}`);
  }
  const fields = out.actions.filter((a) => a.type === 'set_field');
  assert.ok(fields.some((f) => f.field === 'TF_Trip_Horizon' && f.value === 'This month'));
  assert.ok(fields.some((f) => f.field === 'TF_Party_Type' && f.value === 'Just me'));
  assert.equal(out.guardrails.price_quoted, false);
});

test('general_tips_researching nurtures P3 without handoff', async () => {
  const out = await triage(FIXTURES.general_tips_researching, { mode: 'mock', scenario: 'general_tips_researching' });
  assert.equal(out.decision.route, 'nurture');
  assert.equal(out.decision.priority, 'P3');
  const tags = out.actions.filter((a) => a.type === 'add_tag').map((a) => a.tag);
  assert.ok(tags.includes('TF_Intent_TravelTips'));
  assert.ok(tags.includes('TF_Researching'));
  assert.ok(!tags.includes('TF_Status_HumanHandoff'));
});

test('vi_ambiguous goes to review without any intent tag', async () => {
  const out = await triage(FIXTURES.vi_ambiguous, { mode: 'mock', scenario: 'vi_ambiguous' });
  assert.equal(out.decision.route, 'review');
  assert.equal(out.decision.priority, 'P2');
  const intentTags = out.actions.filter((a) => a.type === 'add_tag' && a.tag.startsWith('TF_Intent_'));
  assert.equal(intentTags.length, 0, 'review route must not auto-tag intent');
  const tags = out.actions.filter((a) => a.type === 'add_tag').map((a) => a.tag);
  assert.ok(tags.includes('TF_Status_HumanHandoff'));
});

test('b2b_inquiry escalates P1 and flags B2B tag as requiring ManyChat setup', async () => {
  const out = await triage(FIXTURES.b2b_inquiry, { mode: 'mock', scenario: 'b2b_inquiry' });
  assert.equal(out.decision.route, 'escalate_human');
  assert.equal(out.decision.priority, 'P1');
  const b2b = out.actions.find((a) => a.type === 'add_tag' && a.tag === 'TF_Intent_B2B');
  assert.ok(b2b, 'missing TF_Intent_B2B action');
  assert.equal(b2b.requires_manychat_setup, true);
});

test('safety_needs_human escalates P1 even with low purchase intent', async () => {
  const out = await triage(FIXTURES.safety_needs_human, { mode: 'mock', scenario: 'safety_needs_human' });
  assert.equal(out.decision.route, 'escalate_human');
  assert.equal(out.decision.priority, 'P1');
  assert.ok(out.decision.reasons.includes('needs_human.noul>=0.6'));
  const tags = out.actions.filter((a) => a.type === 'add_tag').map((a) => a.tag);
  assert.ok(tags.includes('TF_Status_HumanHandoff'));
  assert.ok(!tags.includes('TF_Status_Qualified'));
});

test('price_question escalates P2, never tags intent, never quotes a price', async () => {
  const out = await triage(FIXTURES.price_question, { mode: 'mock', scenario: 'price_question' });
  assert.equal(out.decision.route, 'escalate_human');
  assert.equal(out.decision.priority, 'P2');
  const tags = out.actions.filter((a) => a.type === 'add_tag').map((a) => a.tag);
  assert.ok(!tags.some((t) => t.startsWith('TF_Intent_')), 'price_question must not get an intent tag');
  const serialized = JSON.stringify(out);
  assert.ok(!/\$\s?75|\$\s?130|\$\s?180|\$\s?160|\$\s?290/.test(serialized), 'output must not contain a tour price');
});

test('mock mode never touches the network (fetch stubbed to throw)', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('NETWORK CALL MADE'); };
  try {
    const out = await triage(FIXTURES.photo_tour_ready, { mode: 'mock', scenario: 'photo_tour_ready' });
    assert.equal(out.meta.mode, 'mock');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// ---------------------------------------------------------------------------
// Routing policy unit tests (table-driven, all six rows)
// ---------------------------------------------------------------------------

const POLICY_TABLE = [
  {
    name: 'row1: needs_human >= 0.6 -> escalate P1',
    answers: { needs_human: { noul: 0.7 }, intent: { choice: 'general_travel_tips', confidence: 0.9 } },
    expect: { route: 'escalate_human', priority: 'P1' },
  },
  {
    name: 'row2: b2b_partnership conf >= 0.6 -> escalate P1',
    answers: { needs_human: { noul: 0.1 }, intent: { choice: 'b2b_partnership', confidence: 0.8 } },
    expect: { route: 'escalate_human', priority: 'P1' },
  },
  {
    name: 'row3: purchase score >= 2.5 + tour intent -> escalate P1',
    answers: { needs_human: { noul: 0.1 }, intent: { choice: 'local_tour_inquiry', confidence: 0.7 }, purchase_intent: { score: 2.8, confidence: 0.8 } },
    expect: { route: 'escalate_human', priority: 'P1' },
  },
  {
    name: 'row4: price_question conf >= 0.6 -> escalate P2',
    answers: { needs_human: { noul: 0.1 }, intent: { choice: 'price_question', confidence: 0.7 } },
    expect: { route: 'escalate_human', priority: 'P2' },
  },
  {
    name: 'row5: intent confidence < 0.5 -> review P2',
    answers: { needs_human: { noul: 0.1 }, intent: { choice: 'other', confidence: 0.3 } },
    expect: { route: 'review', priority: 'P2' },
  },
  {
    name: 'row6: otherwise nurture P3',
    answers: { needs_human: { noul: 0.1 }, intent: { choice: 'general_travel_tips', confidence: 0.7 }, purchase_intent: { score: 1, confidence: 0.7 } },
    expect: { route: 'nurture', priority: 'P3' },
  },
];

for (const row of POLICY_TABLE) {
  test(row.name, () => {
    const decision = applyRoutingPolicy(row.answers);
    assert.equal(decision.route, row.expect.route);
    assert.equal(decision.priority, row.expect.priority);
  });
}

// ---------------------------------------------------------------------------
// Confidence gates, normalization and validation
// ---------------------------------------------------------------------------

test('confidence gate: intent at 0.55 tags nothing, stays nurture', () => {
  const answers = {
    needs_human: { noul: 0.05 },
    intent: { choice: 'photo_tour_inquiry', confidence: 0.55 },
    trip_horizon: { choice: 'one_to_three_months', confidence: 0.55 },
    party_type: { choice: 'couple', confidence: 0.55 },
    purchase_intent: { score: 1, confidence: 0.55 },
    has_travel_date: { noul: 0.5 },
  };
  const decision = applyRoutingPolicy(answers);
  const actions = buildActions(answers, decision);
  assert.equal(decision.route, 'nurture');
  assert.equal(actions.filter((a) => a.type === 'add_tag' && a.tag.startsWith('TF_Intent_')).length, 0);
  assert.equal(actions.filter((a) => a.type === 'set_field').length, 0);
});

test('normalizeAnswers fills missing ids with neutral values so policy routes to review', async () => {
  const out = await triage(FIXTURES.vi_ambiguous, {
    mode: 'mock',
    transport: async () => ({ answers: {} }), // API returned nothing usable
  });
  assert.equal(out.answers.intent.confidence, 0);
  assert.equal(out.decision.route, 'review');
});

test('validateState rejects invalid input with clear errors', () => {
  assert.throws(() => validateState({ source: 'email', subscriber: { id: 'x' }, conversation: [{ role: 'user', text: 'hi' }] }), /source/);
  assert.throws(() => validateState({ source: 'manual', subscriber: {}, conversation: [{ role: 'user', text: 'hi' }] }), /subscriber\.id/);
  assert.throws(() => validateState({ source: 'manual', subscriber: { id: 'x' }, conversation: [] }), /conversation/);
  assert.throws(() => validateState({ source: 'manual', subscriber: { id: 'x' }, conversation: [{ role: 'admin', text: 'hi' }] }), /role/);
  assert.throws(() => validateState({ source: 'manual', subscriber: { id: 'x' }, conversation: [{ role: 'user', text: '   ' }] }), /text/);
});

test('buildState caps conversation at the 20 most recent messages', () => {
  const many = Array.from({ length: 30 }, (_, i) => ({ role: 'user', text: `msg-${i}` }));
  const state = buildState(validateState(makeState(many)));
  const lines = state.conversation_text.split('\n');
  assert.equal(lines.length, 20);
  assert.ok(lines[0].includes('msg-10'), 'must keep the most recent window');
});

test('mock scenarios all produce the full answer set', () => {
  for (const [name, scenario] of Object.entries(MOCK_SCENARIOS)) {
    for (const key of ['intent', 'trip_horizon', 'party_type', 'purchase_intent', 'has_travel_date', 'needs_human']) {
      assert.ok(scenario.answers[key], `scenario ${name} missing ${key}`);
    }
  }
});

// ---------------------------------------------------------------------------
// CLI (mock path, no network)
// ---------------------------------------------------------------------------

test('CLI --mock prints valid triage JSON', () => {
  const stdout = execFileSync('node', [SCRIPT, '--mock', 'photo_tour_ready'], { cwd: ROOT, encoding: 'utf8' });
  const parsed = JSON.parse(stdout);
  assert.equal(parsed.meta.mode, 'mock');
  assert.equal(parsed.decision.route, 'escalate_human');
  assert.equal(parsed.guardrails.price_quoted, false);
});

test('CLI refuses live call when explicitly disabled (TYPESAFE_LIVE_APPROVED=0)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-test-'));
  const statePath = path.join(tmp, 'state.json');
  fs.writeFileSync(statePath, JSON.stringify(FIXTURES.price_question));
  try {
    let stderr = '';
    try {
      execFileSync('node', [SCRIPT, '--input', statePath, '--live'], {
        cwd: ROOT, encoding: 'utf8',
        env: { ...process.env, TYPESAFE_LIVE_APPROVED: '0' },
      });
      assert.fail('should have exited');
    } catch (err) {
      stderr = err.stderr || '';
    }
    assert.ok(stderr.includes('TYPESAFE_LIVE_APPROVED'), 'guard must explain the offline switch');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});