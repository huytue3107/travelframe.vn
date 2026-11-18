/**
 * TypeSafe Comment Tiering (Technology-Automation) — DRAFT, 2026-11-18.
 * Tier 1–4 for FB/IG comments per CLAUDE.md "Phân tầng bình luận".
 * Jev answers 7 atomic Noul judgments; classifyTier() (code) decides the tier.
 * Pure module: no network, no key. Live runner and results: see
 * Technology-Automation/Runbooks/2026-11-18-TypeSafe-Comment-Tier-Test-Report.md
 */

// TravelFrame comment tiering — all TypeSafe wording, thresholds and tier logic live here.
// Jev makes atomic judgments; code (classifyTier) decides the tier.

export const MODEL = 'jev-latest';
export const YES = 0.7;
export const NO = 0.3;

// Keywords the page asks followers to comment to receive a guide by DM.
export const CTA_KEYWORDS = ['FOOD', 'HANOI', 'PHOTO', 'MAP', 'SAFE'];

export const PAGE_CONTEXT =
  'TravelFrame is a Hanoi travel and photo-tour page. Its posts invite followers to comment a keyword ' +
  '(FOOD, HANOI, PHOTO, MAP or SAFE) to receive a free guide by direct message.';

export function buildState(c) {
  return {
    page: PAGE_CONTEXT,
    post: { caption_first_line: c.post },
    comment: { text: c.text },
  };
}

export function buildQuestions() {
  return {
    trip_plan: {
      type: 'noul',
      instructions: 'Does `comment.text` say the commenter plans or expects a future trip to Vietnam?',
      criteria: {
        true: 'The commenter names an upcoming visit, for example a month they will arrive or "see you next year".',
        false: 'The commenter describes a past visit, gives a compliment, or does not mention travelling.',
      },
    },
    visit_question: {
      type: 'noul',
      instructions: 'Does `comment.text` ask a practical question about visiting the place or activity in the post?',
      criteria: {
        true: 'The commenter asks about timing, location, crowds, weather, safety, or where to go.',
        false: 'The commenter makes a statement, shares their own tip, or asks something unrelated to visiting.',
      },
    },
    price_or_booking: {
      type: 'noul',
      instructions: 'Does `comment.text` ask about the price of, or how to book, a tour or photographer?',
      criteria: {
        true: 'The commenter asks how much something costs or how to book it.',
        false: 'The commenter does not ask about cost or booking.',
      },
    },
    invites_companion: {
      type: 'noul',
      instructions: 'Does `comment.text` invite a tagged person to travel to Vietnam with the commenter?',
      criteria: {
        true: 'The commenter proposes going together, for example "we have to do this when we go".',
        false: 'The commenter only tags someone to show them the post, jokes with them, or shares a memory.',
      },
    },
    requests_guide: {
      type: 'noul',
      instructions: 'Is the commenter asking TravelFrame to send them the free guide offered for commenting a keyword?',
      criteria: {
        true: 'The comment is one of the keywords, or asks for the guide or map.',
        false: 'The commenter writes about the post without asking to receive anything.',
      },
    },
    hostile: {
      type: 'noul',
      instructions: 'Does `comment.text` insult, threaten, or demean a person or group?',
      criteria: {
        true: 'The comment attacks people, a place\'s people, or uses threats or slurs.',
        false: 'The comment is friendly, neutral, or a mild opinion that attacks no one.',
      },
    },
    spam: {
      type: 'noul',
      instructions: 'Does `comment.text` promote an unrelated product, service, money-making scheme, or link?',
      criteria: {
        true: 'The comment advertises something or asks people to contact the commenter for an offer.',
        false: 'The comment talks about the post, Hanoi, Vietnam, or the commenter\'s own travel, even at length.',
      },
    },
  };
}

const band = (p) => (p >= YES ? 'yes' : p <= NO ? 'no' : 'unsettled');

export function isCtaKeyword(text) {
  const norm = text.toUpperCase().replace(/[^A-Z]/g, '');
  return CTA_KEYWORDS.includes(norm);
}

// Truth table. Order: Tier 4 > Tier 1 > Tier 2 > Tier 3.
export function classifyTier(text, answers) {
  if (!text.trim()) return { tier: 'T3', reason: 'sticker/empty (code)', review: false };
  const p = Object.fromEntries(Object.entries(answers ?? {}).map(([k, v]) => [k, v.noul]));
  const b = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, band(v)]));
  const t4 = ['hostile', 'spam'];
  const t1 = ['trip_plan', 'visit_question', 'price_or_booking', 'invites_companion'];
  const cta = isCtaKeyword(text);
  const unsure = (keys) => keys.filter((k) => b[k] === 'unsettled');
  // Review only when an unsettled judgment could change the chosen tier
  // (i.e. it belongs to a tier with higher priority than the one picked).

  if (t4.some((k) => b[k] === 'yes'))
    return { tier: 'T4', reason: t4.filter((k) => b[k] === 'yes').join('+'), review: true, unsettled: [] };
  if (t1.some((k) => b[k] === 'yes')) {
    const u = unsure(t4);
    return { tier: 'T1', reason: t1.filter((k) => b[k] === 'yes').join('+'), review: u.length > 0, unsettled: u };
  }
  if (cta || b.requests_guide === 'yes') {
    const u = unsure([...t4, ...t1]);
    return { tier: 'T2', reason: cta ? 'cta_keyword (code)' : 'requests_guide', review: u.length > 0, unsettled: u };
  }
  const u = unsure([...t4, ...t1, 'requests_guide']);
  return { tier: 'T3', reason: 'default', review: u.length > 0, unsettled: u };
}
