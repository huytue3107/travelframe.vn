#!/usr/bin/env node
/**
 * Produce a provisional group shortlist for TravelFrame community research.
 *
 * This stage intentionally does not claim post-level validation when Apify has
 * returned only diagnostics. JEV ranks candidates from public metadata, while
 * deterministic scoring keeps the assumptions auditable.
 */

import fs from 'node:fs';
import path from 'node:path';

const API_URL = 'https://api.typesafe.ai/v1/systemone';
const MODEL = 'jev-latest';

function loadEnv() {
  if (process.env.TYPESAFE_API_KEY) return;
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*TYPESAFE_API_KEY\s*=\s*(.*)\s*$/);
    if (match?.[1]) process.env.TYPESAFE_API_KEY = match[1].trim();
  }
}

function parseCompactNumber(value = '') {
  const match = String(value).match(/([\d.]+)\s*([KMB])?/i);
  if (!match) return null;
  const multiplier = { K: 1_000, M: 1_000_000, B: 1_000_000_000 }[match[2]?.toUpperCase()] ?? 1;
  return Math.round(Number(match[1]) * multiplier);
}

function parseDailyActivity(value = '') {
  const match = String(value).match(/([\d.]+)\+?\s*posts?\/day/i);
  return match ? Number(match[1]) : null;
}

function classifyCategory(name) {
  const lower = name.toLowerCase();
  if (/housing|apartment|rooms? for rent|flatshare|rental/.test(lower)) return 'housing';
  if (/jobs?|teacher|teaching|hiring/.test(lower)) return 'jobs';
  if (/buy|sell|swap|market/.test(lower)) return 'marketplace';
  if (/digital nomad|language exchange|friends|beautiful|handsome|parent|hiking|nature|filipino|pinoys/.test(lower)) return 'interest_social';
  return 'general_expat';
}

function baseScore(group) {
  const categoryScore = {
    general_expat: 42,
    interest_social: 37,
    marketplace: 19,
    housing: 10,
    jobs: 8,
  }[group.category];
  const size = group.members ?? 0;
  const sizeScore = size >= 100_000 ? 20 : size >= 50_000 ? 17 : size >= 20_000 ? 14 : size >= 5_000 ? 10 : 6;
  const activity = group.posts_per_day;
  const activityScore = activity == null ? 6 : activity >= 60 ? 18 : activity >= 20 ? 15 : activity >= 7 ? 11 : 7;
  const publicScore = group.privacy === 'Public' ? 10 : 0;
  const spamPenalty = ['housing', 'jobs', 'marketplace'].includes(group.category) ? 8 : 0;
  return Math.max(0, Math.min(100, categoryScore + sizeScore + activityScore + publicScore - spamPenalty));
}

function buildRows(seed) {
  return seed.groups.map((group, index) => {
    const row = {
      group_id: `GRP${String(index + 1).padStart(3, '0')}`,
      ...group,
      members: parseCompactNumber(group.members_text),
      posts_per_day: parseDailyActivity(group.activity_text),
      category: classifyCategory(group.name),
      apify_status: group.privacy === 'Public' ? 'RATE_LIMITED' : 'PRIVATE_NOT_SCRAPABLE',
      posts_collected: 0,
      post_evidence_available: false,
      jev_selected: false,
      jev_confidence: null,
      jev_batch: null,
      jev_rank_in_batch: null,
      assessment_status: 'Provisional - metadata only',
    };
    row.metadata_score = baseScore(row);
    return row;
  });
}

function balancedBatches(rows, batchSize = 9) {
  const sorted = [...rows].sort((a, b) => b.metadata_score - a.metadata_score);
  const batchCount = Math.ceil(sorted.length / batchSize);
  const batches = Array.from({ length: batchCount }, () => []);
  sorted.forEach((row, index) => batches[index % batchCount].push(row));
  return batches;
}

function buildPayload(batch, batchIndex) {
  const criteria = {};
  const state = {};
  for (const row of batch) {
    const description =
      `${row.name} | ${row.privacy}; members=${row.members_text}; activity=${row.activity_text || 'unknown'}; ` +
      `category=${row.category}; metadata_score=${row.metadata_score}; posts_collected=0`;
    criteria[row.group_id] = description;
    state[row.group_id] = description;
  }
  const questions = {};
  for (let rank = 1; rank <= 3; rank++) {
    questions[`candidate_${rank}`] = {
      type: 'choice',
      instructions:
        `Choose the #${rank} strongest distinct candidate for future TravelFrame seeding research in this batch. ` +
        'TravelFrame is a private, personalized Hanoi photo experience. Prefer broad active expat, foreigner, ' +
        'local-expat, social, travel, language exchange, digital nomad, outdoor, and newcomer communities. ' +
        'Penalize job boards, housing feeds, marketplaces, very small communities, and private groups. ' +
        'This is metadata-only triage: do not claim promotion is allowed or recommend posting before group rules ' +
        `and recent posts are reviewed. Batch ${batchIndex + 1}.`,
      criteria,
    };
  }
  return { model: MODEL, state, questions };
}

async function callJev(payload) {
  const key = process.env.TYPESAFE_API_KEY;
  if (!key) throw new Error('TYPESAFE_API_KEY not found in environment or .env');
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`TypeSafe API error ${response.status}: ${detail}`);
  }
  return response.json();
}

async function rank(rows) {
  const batches = balancedBatches(rows);
  const usage = [];
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const response = await callJev(buildPayload(batches[batchIndex], batchIndex));
    usage.push(response.usage ?? null);
    const selected = new Set();
    for (let position = 1; position <= 3; position++) {
      const answer = response.answers?.[`candidate_${position}`];
      const id = answer?.choice;
      if (!id || selected.has(id)) continue;
      const row = rows.find((candidate) => candidate.group_id === id);
      if (!row) continue;
      selected.add(id);
      row.jev_selected = true;
      row.jev_confidence = typeof answer.confidence === 'number' ? answer.confidence : null;
      row.jev_batch = batchIndex + 1;
      row.jev_rank_in_batch = position;
    }
    process.stderr.write(`JEV group batch ${batchIndex + 1}/${batches.length}: ${selected.size} distinct picks\n`);
  }
  return usage;
}

function finalize(rows) {
  for (const row of rows) {
    const bonus = row.jev_selected
      ? 12 + Math.round((row.jev_confidence ?? 0.5) * 8) - ((row.jev_rank_in_batch ?? 3) - 1) * 2
      : 0;
    row.provisional_score = Math.min(100, row.metadata_score + bonus);
    row.provisional_tier =
      row.privacy !== 'Public' ? 'Blocked: private' :
      row.provisional_score >= 85 ? 'P1: review first' :
      row.provisional_score >= 70 ? 'P2: review if capacity' :
      'P3: low priority';
    row.recommended_action =
      row.privacy !== 'Public'
        ? 'Keep in directory; manual access only with explicit group membership.'
        : row.provisional_score >= 85
          ? 'Review rules and 15 recent posts before drafting any value-first contribution.'
          : row.provisional_score >= 70
            ? 'Sample recent posts after P1 groups; do not seed yet.'
            : 'Do not prioritize for TravelFrame seeding.';
  }
  rows.sort((a, b) =>
    b.provisional_score - a.provisional_score ||
    Number(b.jev_selected) - Number(a.jev_selected) ||
    b.metadata_score - a.metadata_score ||
    a.name.localeCompare(b.name));
  rows.forEach((row, index) => { row.provisional_rank = index + 1; });
}

async function main() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const outputIndex = args.indexOf('--output');
  if (inputIndex < 0 || outputIndex < 0) {
    throw new Error('Usage: --input <group-seeds.json> --output <group-ranking.json>');
  }
  loadEnv();
  const seed = JSON.parse(fs.readFileSync(path.resolve(args[inputIndex + 1]), 'utf8'));
  const rows = buildRows(seed);
  const usage = await rank(rows);
  finalize(rows);
  const output = {
    meta: {
      generated_at: new Date().toISOString(),
      model: MODEL,
      requests: usage.length,
      usage,
      status: 'Provisional - no post-level evidence because Apify returned RATE_LIMITED diagnostics.',
      action_boundary: 'Research shortlist only. No posting, joining, commenting, or outreach is authorized.',
    },
    rows,
  };
  const outputPath = path.resolve(args[outputIndex + 1]);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify({
    output: outputPath,
    groups: rows.length,
    jev_selected: rows.filter((row) => row.jev_selected).length,
    p1: rows.filter((row) => row.provisional_tier === 'P1: review first').length,
  }));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
