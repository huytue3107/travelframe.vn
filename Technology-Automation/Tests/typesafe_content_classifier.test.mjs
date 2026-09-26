/**
 * Tests for TypeSafe Content Classifier (Technology-Automation).
 * Run: npm run test:classifier
 *
 * All fixtures are synthetic — no PII, no real Threads data.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateInput, buildState, applyClassificationPolicy, classify,
  heuristicAnswers, MOCK_SCENARIOS, TOPIC_CHOICES, CONF_GATE, CONF_FALLBACK,
} from '../Scripts/typesafe_content_classifier.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = path.join(ROOT, 'Technology-Automation/Scripts/typesafe_content_classifier.mjs');

// ---------------------------------------------------------------------------
// Synthetic post fixtures (fictional)
// ---------------------------------------------------------------------------

function makePost(rootText, comments = []) {
  return { source_post_url: 'https://www.threads.com/@user/post/test', root_text: rootText, comments };
}

const FIXTURES = {
  hanoi_photo: makePost('Sáng sớm đi bộ Phan Đình Phùng chụp vài tấm, nhẹ nhàng mà ưng quá.', [
    { author: 'a', text: 'Đẹp quá bạn ơi, mình muốn book photographer đi cùng được không?', like_count: 3 },
  ]),
  general: makePost('Cuối tuần đi chơi đâu ta, có ai gợi ý không?', [
    { author: 'b', text: 'Đi đâu cũng được bạn ơi =)))', like_count: 1 },
  ]),
  drama: makePost('Người yêu cũ nhắn tin lúc nửa đêm, mọi người cho mình xin lời khuyên', []),
  price: makePost('Team mình đi 2 người tháng 11, giá tour chụp ảnh Hà Nội là bao nhiêu vậy?', []),
};

// ---------------------------------------------------------------------------
// Input contract
// ---------------------------------------------------------------------------

test('validateInput rejects missing root_text and bad comments', () => {
  assert.throws(() => validateInput({}), /root_text/);
  assert.throws(() => validateInput({ root_text: 'x', comments: 'nope' }), /comments/);
  assert.throws(() => validateInput({ root_text: 'x', comments: [{}] }), /comments\[0\]\.text/);
});

test('validateInput accepts a minimal valid post and buildState trims text', () => {
  const input = validateInput(makePost('đẹp', [{ author: 'a', text: 'ok', like_count: 0 }]));
  const state = buildState(input);
  assert.equal(typeof state.post_text, 'string');
  assert.equal(state.language, 'vi');
  assert.match(state.top_comments, /^- ok/);
});

// ---------------------------------------------------------------------------
// Classification policy (deterministic, code-owned)
// ---------------------------------------------------------------------------

test('policy trusts JEV only at or above the confidence gate', () => {
  const trusted = applyClassificationPolicy({
    content_relevance: { choice: 'relevant', confidence: CONF_GATE },
    topic: { choice: 'photo_tour', confidence: 0.9 },
    lead_signal: { choice: 'none', confidence: 0.9 },
    season_claim: { noul: 0.1 },
  });
  assert.equal(trusted.trusted, true);
  assert.equal(trusted.topic, 'photo_tour');

  const untrusted = applyClassificationPolicy({
    content_relevance: { choice: 'relevant', confidence: CONF_FALLBACK - 0.1 },
    topic: { choice: 'photo_tour', confidence: 0.9 },
    lead_signal: { choice: 'none', confidence: 0.9 },
    season_claim: { noul: 0.1 },
  });
  assert.equal(untrusted.trusted, false);
  assert.equal(untrusted.topic, 'general');
  assert.equal(untrusted.below_fallback, true);
});

test('policy gates the topic label on its own confidence', () => {
  const weakTopic = applyClassificationPolicy({
    content_relevance: { choice: 'relevant', confidence: 0.9 },
    topic: { choice: 'en_itinerary', confidence: CONF_GATE - 0.1 },
    lead_signal: { choice: 'none', confidence: 0.9 },
    season_claim: { noul: 0.1 },
  });
  assert.equal(weakTopic.trusted, true);
  assert.equal(weakTopic.topic_trusted, false);
  assert.equal(weakTopic.topic, 'general');

  const strongTopic = applyClassificationPolicy({
    content_relevance: { choice: 'relevant', confidence: 0.9 },
    topic: { choice: 'mountain_views', confidence: CONF_GATE },
    lead_signal: { choice: 'none', confidence: 0.9 },
    season_claim: { noul: 0.1 },
  });
  assert.equal(strongTopic.topic_trusted, true);
  assert.equal(strongTopic.topic, 'mountain_views');
});

test('policy flags leads only when the lead answer is confident', () => {
  const lead = applyClassificationPolicy({
    content_relevance: { choice: 'relevant', confidence: 0.9 },
    topic: { choice: 'photo_tour', confidence: 0.9 },
    lead_signal: { choice: 'price_question', confidence: CONF_GATE },
    season_claim: { noul: 0.1 },
  });
  assert.equal(lead.is_lead, true);
  assert.equal(lead.lead_kind, 'price_question');

  const noLead = applyClassificationPolicy({
    content_relevance: { choice: 'relevant', confidence: 0.9 },
    topic: { choice: 'photo_tour', confidence: 0.9 },
    lead_signal: { choice: 'price_question', confidence: 0.4 },
    season_claim: { noul: 0.1 },
  });
  assert.equal(noLead.is_lead, false);
});

// ---------------------------------------------------------------------------
// Mock scenarios through the orchestrator
// ---------------------------------------------------------------------------

test('mock scenario hanoi_photo_relevant classifies as trusted photo_tour', async () => {
  const out = await classify(FIXTURES.hanoi_photo, { mode: 'mock', scenario: 'hanoi_photo_relevant' });
  assert.equal(out.classification.trusted, true);
  assert.equal(out.classification.topic, 'photo_tour');
  assert.equal(out.classification.source, 'mock');
  assert.equal(out.meta.model, 'jev-latest');
});

test('mock scenario lead_price_question surfaces the lead for triage', async () => {
  const out = await classify(FIXTURES.price, { mode: 'mock', scenario: 'lead_price_question' });
  assert.equal(out.classification.is_lead, true);
  assert.equal(out.classification.lead_kind, 'price_question');
});

test('mock scenario low_confidence_vi is not trusted', async () => {
  const out = await classify(FIXTURES.general, { mode: 'mock', scenario: 'low_confidence_vi' });
  assert.equal(out.classification.trusted, false);
  assert.equal(out.classification.topic, 'general');
});

test('unknown topic choice normalizes to general', async () => {
  const transport = async () => ({
    answers: {
      content_relevance: { type: 'choice', choice: 'relevant', confidence: 0.9 },
      topic: { type: 'choice', choice: 'made_up_topic', confidence: 0.9 },
      lead_signal: { type: 'choice', choice: 'none', confidence: 0.9 },
      season_claim: { type: 'noul', noul: 0 },
    },
  });
  const out = await classify(FIXTURES.hanoi_photo, { mode: 'mock', transport });
  assert.equal(out.answers.topic.choice, 'general');
});

// ---------------------------------------------------------------------------
// Offline heuristic (--mock auto)
// ---------------------------------------------------------------------------

test('heuristicAnswers blocks drama and flags photo/price signals', () => {
  const drama = heuristicAnswers(buildState(FIXTURES.drama));
  assert.equal(drama.content_relevance.choice, 'not_relevant');

  const photo = heuristicAnswers(buildState(FIXTURES.hanoi_photo));
  assert.equal(photo.topic.choice, 'photo_tour');
  assert.equal(photo.content_relevance.choice, 'relevant');

  const price = heuristicAnswers(buildState(FIXTURES.price));
  assert.equal(price.lead_signal.choice, 'price_question');
});

// ---------------------------------------------------------------------------
// CLI + live approval gate
// ---------------------------------------------------------------------------

test('CLI mock run prints classification JSON', () => {
  const out = execFileSync('node', [SCRIPT, '--mock', 'blacklist_drama'], { encoding: 'utf8' });
  const parsed = JSON.parse(out);
  assert.equal(parsed.classification.relevant, false);
  assert.equal(parsed.classification.trusted, true);
});

test('CLI refuses live when explicitly disabled (TYPESAFE_LIVE_APPROVED=0)', () => {
  const tmp = path.join(os.tmpdir(), `classifier_input_${Date.now()}.json`);
  fs.writeFileSync(tmp, JSON.stringify(FIXTURES.hanoi_photo), 'utf8');
  try {
    let stderr = '';
    try {
      execFileSync('node', [SCRIPT, '--input', tmp], {
        encoding: 'utf8',
        env: { ...process.env, TYPESAFE_LIVE_APPROVED: '0' },
      });
      assert.fail('should have exited');
    } catch (err) {
      stderr = err.stderr || '';
    }
    assert.ok(stderr.includes('TYPESAFE_LIVE_APPROVED'), 'guard must explain the offline switch');
  } finally {
    fs.existsSync(tmp) && fs.unlinkSync(tmp);
  }
});

test('every mock scenario produces a normalizable classification', async () => {
  for (const scenario of Object.keys(MOCK_SCENARIOS)) {
    const out = await classify(FIXTURES.general, { mode: 'mock', scenario });
    assert.ok(TOPIC_CHOICES.includes(out.classification.topic));
    assert.equal(typeof out.classification.trusted, 'boolean');
    assert.equal(typeof out.classification.is_lead, 'boolean');
  }
});
