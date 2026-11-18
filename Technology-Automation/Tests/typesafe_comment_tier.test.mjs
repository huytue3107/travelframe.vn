/**
 * Offline tests for TypeSafe Comment Tiering truth table.
 * Run: node --test Technology-Automation/Tests/typesafe_comment_tier.test.mjs
 * No network, no key. Answers are hand-built Noul values.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTier, isCtaKeyword, buildQuestions } from '../Scripts/typesafe_comment_tier.mjs';

const KEYS = ['trip_plan', 'visit_question', 'price_or_booking', 'invites_companion', 'requests_guide', 'hostile', 'spam'];
const ans = (over = {}) =>
  Object.fromEntries(KEYS.map((k) => [k, { type: 'noul', noul: over[k] ?? 0.02 }]));

test('every question is an atomic noul with true/false criteria', () => {
  const q = buildQuestions();
  assert.deepEqual(Object.keys(q).sort(), [...KEYS].sort());
  for (const v of Object.values(q)) {
    assert.equal(v.type, 'noul');
    assert.ok(v.criteria.true && v.criteria.false);
  }
});

test('empty comment (sticker) is Tier 3 without answers', () => {
  assert.equal(classifyTier('', null).tier, 'T3');
});

test('CTA keyword detection is code, case and emoji insensitive', () => {
  assert.ok(isCtaKeyword('Food'));
  assert.ok(isCtaKeyword(' MAP 🙏'));
  assert.ok(!isCtaKeyword('food guide pls'));
});

test('Tier 4 wins over every other signal and always needs review', () => {
  const d = classifyTier('x', ans({ hostile: 0.95, trip_plan: 0.9 }));
  assert.equal(d.tier, 'T4');
  assert.equal(d.review, true);
  assert.equal(classifyTier('x', ans({ spam: 0.97 })).tier, 'T4');
});

test('Tier 1 when any intent judgment is yes', () => {
  for (const k of ['trip_plan', 'visit_question', 'price_or_booking', 'invites_companion'])
    assert.equal(classifyTier('x', ans({ [k]: 0.8 })).tier, 'T1', k);
});

test('Tier 1 beats CTA keyword', () => {
  assert.equal(classifyTier('Food', ans({ visit_question: 0.9 })).tier, 'T1');
});

test('Tier 2 from exact keyword even if Jev disagrees', () => {
  const d = classifyTier('Hanoi', ans({ requests_guide: 0.1 }));
  assert.equal(d.tier, 'T2');
  assert.equal(d.reason, 'cta_keyword (code)');
});

test('Tier 2 from requests_guide; unsettled Tier 1 signal flags review', () => {
  const d = classifyTier('send me the map pls', ans({ requests_guide: 0.95, visit_question: 0.53 }));
  assert.equal(d.tier, 'T2');
  assert.equal(d.review, true);
  assert.deepEqual(d.unsettled, ['visit_question']);
});

test('Tier 3 default; unsettled intent flags review', () => {
  assert.equal(classifyTier('Love Hanoi', ans()).review, false);
  const d = classifyTier('I will return', ans({ trip_plan: 0.58 }));
  assert.equal(d.tier, 'T3');
  assert.equal(d.review, true);
});

test('unsettled lower-priority judgment does not flag review on Tier 1', () => {
  const d = classifyTier('x', ans({ visit_question: 0.98, trip_plan: 0.57 }));
  assert.equal(d.tier, 'T1');
  assert.equal(d.review, false);
});

test('unsettled Tier 4 judgment flags review on Tier 1', () => {
  const d = classifyTier('x', ans({ visit_question: 0.98, hostile: 0.5 }));
  assert.equal(d.review, true);
});
