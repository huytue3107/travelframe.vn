#!/usr/bin/env node
/**
 * Build and rank discovery queries for foreigner communities in Vietnam.
 *
 * The deterministic layer creates a broad, reproducible candidate set. In live
 * mode, JEV selects the strongest queries from balanced batches. The final
 * ranking keeps both signals visible so the workbook can distinguish measured
 * model output from rule-based coverage.
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

const locations = [
  ['Vietnam', 10], ['Hanoi', 10], ['Ho Chi Minh City', 9], ['Saigon', 9],
  ['Da Nang', 8], ['Hoi An', 8], ['Nha Trang', 6], ['Phu Quoc', 6],
  ['Da Lat', 6], ['Hai Phong', 5], ['Hue', 5], ['Vung Tau', 5],
  ['Can Tho', 4], ['Ha Long', 5], ['Ninh Binh', 6], ['Sapa', 6],
  ['Ha Giang', 5], ['Northern Vietnam', 7], ['Central Vietnam', 6],
  ['Southern Vietnam', 6],
];

const audiences = [
  ['expats', 10], ['foreigners', 10], ['international community', 9],
  ['digital nomads', 8], ['English teachers', 8], ['international students', 6],
  ['expat women', 7], ['expat families', 7], ['foreign entrepreneurs', 6],
  ['remote workers', 7], ['foreign photographers', 7], ['solo travelers', 7],
  ['backpackers', 5], ['retirees', 5], ['newcomers', 8], ['local and expat', 8],
];

const intents = [
  ['community', 10], ['group', 10], ['social group', 9], ['meetup', 8],
  ['events', 8], ['housing', 7], ['apartments', 6], ['jobs', 6],
  ['English teaching jobs', 6], ['buy sell swap', 5], ['marketplace', 5],
  ['language exchange', 7], ['friends', 8], ['travel advice', 8],
  ['local tips', 8], ['food and restaurants', 6], ['photography', 8],
  ['photo walks', 9], ['hiking', 6], ['sports', 5], ['nightlife', 5],
  ['parents', 6], ['women', 6], ['business networking', 5], ['coworking', 5],
  ['visa advice', 4], ['healthcare', 4], ['schools', 4], ['pets', 4],
  ['motorbike', 4], ['weekend trips', 7], ['things to do', 8],
];

const patterns = [
  ({ location, audience, intent }) => `${audience} in ${location} ${intent}`,
  ({ location, audience, intent }) => `${location} ${audience} ${intent}`,
  ({ location, audience, intent }) => `${intent} for ${audience} in ${location}`,
  ({ location, audience }) => `${location} ${audience} Facebook group`,
  ({ location, intent }) => `${location} expat ${intent} Facebook group`,
];

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function deterministicScore({ locationWeight, audienceWeight, intentWeight, keyword }) {
  let score = locationWeight * 3.2 + audienceWeight * 3.4 + intentWeight * 2.6;
  if (/hanoi|vietnam/.test(keyword.toLowerCase())) score += 5;
  if (/expats|foreigners|international community/.test(keyword.toLowerCase())) score += 5;
  if (/community|group|friends|travel advice|local tips|photography|photo walks|things to do/.test(keyword.toLowerCase())) score += 4;
  if (/visa advice|healthcare|schools|pets|motorbike/.test(keyword.toLowerCase())) score -= 4;
  return Math.round(Math.min(100, score));
}

function generateKeywords() {
  const seen = new Set();
  const rows = [];
  outer:
  for (let p = 0; p < patterns.length; p++) {
    for (const [location, locationWeight] of locations) {
      for (const [audience, audienceWeight] of audiences) {
        for (const [intent, intentWeight] of intents) {
          const keyword = patterns[p]({ location, audience, intent });
          const key = normalize(keyword);
          if (seen.has(key)) continue;
          seen.add(key);
          rows.push({
            keyword_id: `KW${String(rows.length + 1).padStart(4, '0')}`,
            keyword,
            location,
            audience,
            intent,
            pattern_id: p + 1,
            deterministic_score: deterministicScore({
              locationWeight, audienceWeight, intentWeight, keyword,
            }),
            jev_selected: false,
            jev_confidence: null,
            jev_batch: null,
          });
          if (rows.length === 1000) break outer;
        }
      }
    }
  }
  return rows;
}

function balancedBatches(rows, batchCount = 10) {
  const sorted = [...rows].sort((a, b) =>
    b.deterministic_score - a.deterministic_score || a.keyword.localeCompare(b.keyword));
  const batches = Array.from({ length: batchCount }, () => []);
  sorted.forEach((row, index) => batches[index % batchCount].push(row));
  return batches;
}

function buildJevPayload(batch, batchIndex) {
  const criteria = {};
  const state = {};
  batch.forEach((row) => {
    criteria[row.keyword_id] =
      `${row.keyword} | location=${row.location}; audience=${row.audience}; intent=${row.intent}; rule_score=${row.deterministic_score}`;
    state[row.keyword_id] = row.keyword;
  });
  const questions = {};
  for (let rank = 1; rank <= 10; rank++) {
    questions[`best_${rank}`] = {
      type: 'choice',
      instructions:
        `Choose the #${rank} strongest distinct Facebook group discovery query in this batch. ` +
        'Prioritize likelihood of finding active communities of foreigners living in Vietnam, ' +
        'especially Hanoi, where helpful non-promotional TravelFrame participation could fit. ' +
        'Penalize narrow service-only, job-spam, housing-spam, and low-community-intent queries. ' +
        `Do not repeat choices selected for earlier ranks. Batch ${batchIndex + 1}.`,
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

async function rankWithJev(rows) {
  const batches = balancedBatches(rows);
  const usage = [];
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const response = await callJev(buildJevPayload(batch, batchIndex));
    usage.push(response.usage ?? null);
    const chosen = new Set();
    for (let rank = 1; rank <= 10; rank++) {
      const answer = response.answers?.[`best_${rank}`];
      const id = answer?.choice;
      if (!id || chosen.has(id)) continue;
      const row = rows.find((candidate) => candidate.keyword_id === id);
      if (!row) continue;
      chosen.add(id);
      row.jev_selected = true;
      row.jev_confidence = typeof answer.confidence === 'number' ? answer.confidence : null;
      row.jev_batch = batchIndex + 1;
      row.jev_rank_in_batch = rank;
    }
    process.stderr.write(`JEV keyword batch ${batchIndex + 1}/${batches.length}: ${chosen.size} distinct picks\n`);
  }
  return usage;
}

function finalize(rows) {
  rows.forEach((row) => {
    const jevBonus = row.jev_selected
      ? 15 + Math.round((row.jev_confidence ?? 0.5) * 10) - ((row.jev_rank_in_batch ?? 10) - 1)
      : 0;
    row.final_score = Math.min(100, row.deterministic_score + jevBonus);
  });
  rows.sort((a, b) =>
    b.final_score - a.final_score ||
    Number(b.jev_selected) - Number(a.jev_selected) ||
    b.deterministic_score - a.deterministic_score ||
    a.keyword.localeCompare(b.keyword));
  rows.forEach((row, index) => {
    row.final_rank = index + 1;
    row.recommended_for_search = index < 100;
  });
}

function writeOutputs(outDir, rows, meta) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'keywords.json'), JSON.stringify({ meta, rows }, null, 2));
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => {
      const value = row[header] ?? '';
      const text = String(value);
      return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
    }).join(',')),
  ].join('\n');
  fs.writeFileSync(path.join(outDir, 'keywords.csv'), csv);
}

async function main() {
  const args = process.argv.slice(2);
  const outFlag = args.indexOf('--out-dir');
  const outDir = path.resolve(outFlag >= 0 ? args[outFlag + 1] : 'tmp/foreigner-group-research');
  const live = args.includes('--live');
  const rows = generateKeywords();
  let usage = [];
  if (live) {
    loadEnv();
    usage = await rankWithJev(rows);
  }
  finalize(rows);
  writeOutputs(outDir, rows, {
    generated_at: new Date().toISOString(),
    candidate_count: rows.length,
    jev_mode: live ? 'live' : 'not_run',
    jev_model: live ? MODEL : null,
    jev_requests: live ? usage.length : 0,
    jev_usage: usage,
    method:
      'Deterministic coverage scoring for all 1,000 queries; live JEV selects up to 10 distinct winners from each of 10 balanced batches; final top 100 retained.',
  });
  console.log(JSON.stringify({
    out_dir: outDir,
    candidates: rows.length,
    jev_selected: rows.filter((row) => row.jev_selected).length,
    recommended: rows.filter((row) => row.recommended_for_search).length,
  }));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
