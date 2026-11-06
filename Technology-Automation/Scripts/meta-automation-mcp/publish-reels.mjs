#!/usr/bin/env node
// TravelFrame Reels publisher (Facebook + Instagram). Defaults to a local-only dry-run.
// Live mode requires BOTH --live and the line `approval: APPROVED` in the schedule file.
//   Facebook: uploads each reel now and lets Meta publish it at its time (native schedule).
//   Instagram: the API has no native schedule, so `--platform instagram --due` publishes the
//   reel whose time has come; run it from launchd at the scheduled time.
// State is kept next to the schedule (reels-state.json) so nothing is posted twice.
// This script never logs tokens or Meta response bodies.
import { execFileSync } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const VERSION = process.env.META_GRAPH_VERSION || "v25.0";
const G = `https://graph.facebook.com/${VERSION}`;
const RUPLOAD = "https://rupload.facebook.com";
const PAGE_ID = "1409099405611405";
const IG_ID = "17841438272497512";
const MAX_LATE_MS = 3 * 60 * 60 * 1000;

function parseArgs(argv) {
  const opts = { live: false, schedule: "", platform: "", post: 0, due: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.live = false;
    else if (arg === "--live") opts.live = true;
    else if (arg === "--due") opts.due = true;
    else if (arg === "--schedule") opts.schedule = argv[++i];
    else if (arg === "--platform") opts.platform = argv[++i];
    else if (arg === "--post") opts.post = Number(argv[++i]);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!opts.schedule) throw new Error("Pass --schedule <path-to-schedule.md>.");
  if (opts.platform && !["facebook", "instagram"].includes(opts.platform)) throw new Error("--platform must be facebook or instagram.");
  return opts;
}

// Sections look like: "## Bài 1 — 15/10 11:00" followed by a ``` caption block.
// Year comes from the line "year: 2026"; file is post-<n>.mp4 next to the schedule.
function parseSchedule(markdown, dir) {
  const approval = markdown.match(/^approval:\s*([A-Z_]+)\s*$/m)?.[1] ?? "MISSING";
  const year = Number(markdown.match(/^year:\s*(\d{4})\s*$/m)?.[1]);
  if (!year) throw new Error("Schedule needs a line `year: YYYY`.");
  const posts = [...markdown.matchAll(/^## Bài (\d+) — (\d{2})\/(\d{2}) (\d{2}):(\d{2})\s*\n```\n([\s\S]*?)\n```/gm)].map((m) => {
    const [, n, dd, mm, hh, mi, caption] = m;
    return {
      n: Number(n),
      at: new Date(`${year}-${mm}-${dd}T${hh}:${mi}:00+07:00`),
      caption: caption.trim(),
      file: path.join(dir, `post-${n}.mp4`),
    };
  });
  if (!posts.length) throw new Error("No posts found in schedule.");
  return { approval, posts };
}

function getSystemToken() {
  try {
    return execFileSync("/usr/bin/security", ["find-generic-password", "-a", "travelframe-page-access", "-s", "travelframe-meta-automation-token", "-w"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

async function check(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    const code = payload.error?.code ? `, Meta code ${payload.error.code}` : "";
    const msg = payload.error?.error_user_msg || payload.error?.message || "";
    throw new Error(`Meta request failed (HTTP ${response.status}${code}) ${msg.slice(0, 160)}`.trim());
  }
  return payload;
}

async function graph(method, objectPath, token, params = {}) {
  const url = new URL(`${G}/${objectPath}`);
  const init = { method, headers: { Authorization: `Bearer ${token}` } };
  if (method === "GET") for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  else {
    init.headers["Content-Type"] = "application/x-www-form-urlencoded";
    init.body = new URLSearchParams(params).toString();
  }
  return check(await fetch(url, init));
}

async function rupload(url, token, file) {
  const data = await readFile(file);
  return check(await fetch(url, {
    method: "POST",
    headers: { Authorization: `OAuth ${token}`, offset: "0", file_size: String(data.length), "Content-Type": "application/octet-stream" },
    body: data,
  }));
}

async function scheduleFacebook(post, pageToken) {
  const start = await graph("POST", `${PAGE_ID}/video_reels`, pageToken, { upload_phase: "start" });
  if (!start.video_id) throw new Error("Facebook start response omitted video_id.");
  await rupload(`${RUPLOAD}/video-upload/${VERSION}/${start.video_id}`, pageToken, post.file);
  await graph("POST", `${PAGE_ID}/video_reels`, pageToken, {
    upload_phase: "finish",
    video_id: start.video_id,
    video_state: "SCHEDULED",
    scheduled_publish_time: String(Math.floor(post.at.getTime() / 1000)),
    description: post.caption,
  });
  return start.video_id;
}

async function publishInstagram(post, token) {
  const container = await graph("POST", `${IG_ID}/media`, token, {
    media_type: "REELS", upload_type: "resumable", caption: post.caption, share_to_feed: "true",
  });
  if (!container.id) throw new Error("Instagram container response omitted its id.");
  await rupload(`${RUPLOAD}/ig-api-upload/${VERSION}/${container.id}`, token, post.file);
  const started = Date.now();
  for (;;) {
    const state = await graph("GET", container.id, token, { fields: "status_code" });
    if (state.status_code === "FINISHED") break;
    if (["ERROR", "EXPIRED"].includes(state.status_code)) throw new Error(`Instagram container ${state.status_code}.`);
    if (Date.now() - started > 10 * 60_000) throw new Error("Instagram container not FINISHED after 10 minutes.");
    await new Promise((r) => setTimeout(r, 10_000));
  }
  const published = await graph("POST", `${IG_ID}/media_publish`, token, { creation_id: container.id });
  if (!published.id) throw new Error("Instagram publish response omitted its id.");
  return published.id;
}

async function loadState(file) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch { return { facebook: {}, instagram: {} }; }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const schedulePath = path.resolve(ROOT, opts.schedule);
  if (!schedulePath.startsWith(`${ROOT}${path.sep}`)) throw new Error("Schedule must be inside the workspace.");
  const dir = path.dirname(schedulePath);
  const statePath = path.join(dir, "reels-state.json");
  const { approval, posts } = parseSchedule(await readFile(schedulePath, "utf8"), dir);
  for (const p of posts) {
    const info = await stat(p.file);
    if (info.size > 1024 ** 3) throw new Error(`post-${p.n}.mp4 is over 1 GB.`);
    if (p.caption.length > 2200) throw new Error(`Bài ${p.n} caption is over 2200 characters.`);
  }
  const state = await loadState(statePath);
  let selected = opts.post ? posts.filter((p) => p.n === opts.post) : posts;

  if (!opts.live) {
    console.log(`DRY RUN — local validation only; approval=${approval}; posts=${posts.length}. No token or network used.`);
    for (const p of selected) {
      console.log(`Bài ${p.n} | ${p.at.toISOString()} | ${path.basename(p.file)} | ${p.caption.length} chars | FB:${state.facebook[p.n] ? "scheduled" : "-"} IG:${state.instagram[p.n] ? "published" : "-"}`);
    }
    return;
  }

  if (approval !== "APPROVED") throw new Error("Live publishing blocked: schedule must contain the exact line approval: APPROVED.");
  if (!opts.platform) throw new Error("Live mode needs --platform facebook|instagram.");
  const token = getSystemToken();
  if (!token) throw new Error("Live publishing blocked: the configured Keychain item was not found.");

  if (opts.platform === "facebook") {
    const pageToken = (await graph("GET", PAGE_ID, token, { fields: "access_token" })).access_token;
    if (!pageToken) throw new Error("Meta did not return a Page token.");
    for (const p of selected) {
      if (state.facebook[p.n]) { console.log(`Bài ${p.n}: Facebook already scheduled — skip.`); continue; }
      if (p.at.getTime() - Date.now() < 15 * 60_000) { console.log(`Bài ${p.n}: under 15 minutes away — skip.`); continue; }
      const id = await scheduleFacebook(p, pageToken);
      state.facebook[p.n] = { video_id: id, at: p.at.toISOString() };
      await writeFile(statePath, JSON.stringify(state, null, 2));
      console.log(`Bài ${p.n}: Facebook reel scheduled for ${p.at.toISOString()} (video …${id.slice(-6)}).`);
    }
    return;
  }

  if (opts.due) {
    const now = Date.now();
    selected = posts.filter((p) => p.at.getTime() <= now && now - p.at.getTime() <= MAX_LATE_MS);
    if (!selected.length) { console.log(`${new Date().toISOString()} no Instagram reel due.`); return; }
  }
  for (const p of selected) {
    if (state.instagram[p.n]) { console.log(`Bài ${p.n}: Instagram already published — skip.`); continue; }
    const id = await publishInstagram(p, token);
    state.instagram[p.n] = { media_id: id, published_at: new Date().toISOString() };
    await writeFile(statePath, JSON.stringify(state, null, 2));
    console.log(`Bài ${p.n}: Instagram reel published (media …${id.slice(-6)}).`);
  }
}

main().catch((error) => {
  console.error(`publish-reels: ${error.message}`);
  process.exitCode = 1;
});
