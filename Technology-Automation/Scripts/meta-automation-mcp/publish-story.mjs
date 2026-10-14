#!/usr/bin/env node
// TravelFrame Stories publisher. Defaults to a local-only dry-run.
// Live mode requires BOTH --live and approval: APPROVED in the batch file.
// A public HTTPS asset URL is required because Meta cannot fetch workspace paths.
// This script never logs tokens or Meta response bodies.
import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const G = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v25.0"}`;
const DEFAULT_PAGE_ID = "1409099405611405";
const DEFAULT_IG_ID = "17841438272497512";

function parseArgs(argv) {
  const opts = { dryRun: true, live: false, batch: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") { opts.dryRun = true; opts.live = false; }
    else if (arg === "--live") { opts.live = true; opts.dryRun = false; }
    else if (["--batch", "--asset-base-url", "--page-id", "--ig-user-id"].includes(arg)) {
      if (!argv[i + 1]) throw new Error(`Missing value for ${arg}`);
      const key = { "--batch": "batch", "--asset-base-url": "assetBaseUrl", "--page-id": "pageId", "--ig-user-id": "igUserId" }[arg];
      opts[key] = argv[++i];
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (opts.live) opts.dryRun = false;
  return opts;
}

function parseBatch(markdown) {
  const match = markdown.match(/^approval:\s*([A-Z_]+)\s*$/m);
  const approval = match?.[1] ?? "MISSING";
  const headers = [...markdown.matchAll(/^### Frame\s+(\d+)\s*[—-].*$/gm)];
  if (headers.length < 1 || headers.length > 10) throw new Error("Batch must contain 1–10 numbered frames.");
  const frames = headers.map((header, index) => {
    const start = header.index + header[0].length;
    const end = headers[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(start, end);
    const mode = block.match(/\*\*Publishing mode:\*\*\s*\*\*(API|MANUAL)\*\*/i)?.[1]?.toUpperCase();
    const asset = block.match(/\*\*Source asset:\*\*\s*`([^`]+)`/)?.[1];
    const sticker = block.match(/\*\*Sticker:\*\*\s*(.+)/)?.[1]?.trim() ?? "Unspecified";
    if (!mode || !asset) throw new Error(`Frame ${header[1]} needs a Publishing mode and Source asset.`);
    if (mode === "API" && !/^None\.?$/i.test(sticker)) throw new Error(`Frame ${header[1]} is API mode but specifies a sticker.`);
    return { number: Number(header[1]), mode, asset, sticker };
  });
  return { approval, frames };
}

function safeWorkspacePath(relative) {
  const resolved = path.resolve(ROOT, relative);
  if (!resolved.startsWith(`${ROOT}${path.sep}`)) throw new Error(`Asset path escapes workspace: ${relative}`);
  return resolved;
}

function mediaUrl(base, relative) {
  const encoded = relative.split(path.sep).map(encodeURIComponent).join("/");
  return new URL(encoded, base.endsWith("/") ? base : `${base}/`).toString();
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

async function graph(method, objectPath, { token, params = {} }) {
  const headers = { Authorization: `Bearer ${token}` };
  const init = { method, headers };
  if (method !== "GET") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    init.body = new URLSearchParams(params).toString();
  }
  const url = new URL(`${G}/${objectPath}`);
  if (method === "GET") for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    const code = payload.error?.code ? `, Meta code ${payload.error.code}` : "";
    throw new Error(`Meta request failed (HTTP ${response.status}${code}). Response body withheld.`);
  }
  return payload;
}

async function waitForInstagramContainer(id, token) {
  const started = Date.now();
  while (Date.now() - started < 60_000) {
    const state = await graph("GET", id, { token, params: { fields: "status_code" } });
    if (state.status_code === "FINISHED") return;
    if (["ERROR", "EXPIRED"].includes(state.status_code)) throw new Error(`Instagram container ${state.status_code}.`);
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error("Instagram container did not finish within 60 seconds.");
}

async function publishInstagram(imageUrl, token, igUserId) {
  const container = await graph("POST", `${igUserId}/media`, { token, params: { media_type: "STORIES", image_url: imageUrl } });
  if (!container.id) throw new Error("Instagram container response omitted its id.");
  await waitForInstagramContainer(container.id, token);
  const published = await graph("POST", `${igUserId}/media_publish`, { token, params: { creation_id: container.id } });
  return Boolean(published.id);
}

async function publishFacebook(imageUrl, pageToken, pageId) {
  const photo = await graph("POST", `${pageId}/photos`, { token: pageToken, params: { url: imageUrl, published: "false" } });
  if (!photo.id) throw new Error("Facebook photo upload response omitted its id.");
  const story = await graph("POST", `${pageId}/photo_stories`, { token: pageToken, params: { photo_id: photo.id } });
  if (!story.post_id && story.success !== true) throw new Error("Facebook story response did not confirm publication.");
  return true;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.batch) throw new Error("Pass --batch <path-to-approved-story-batch.md>.");
  const batchPath = path.resolve(ROOT, opts.batch);
  const allowedBatchRoot = path.join(ROOT, "Marketing-Growth", "Content", "Stories-Threads-Sprint", "agent2-stories", "batches") + path.sep;
  if (!batchPath.startsWith(allowedBatchRoot)) throw new Error("Batch must be inside agent2-stories/batches/.");
  const markdown = await readFile(batchPath, "utf8");
  const { approval, frames } = parseBatch(markdown);
  for (const frame of frames) await access(safeWorkspacePath(frame.asset));

  if (opts.dryRun) {
    console.log(`DRY RUN — local validation only; approval=${approval}; frames=${frames.length}.`);
    console.log("No Keychain read, token access, network request, or Meta API call was made.");
    for (const frame of frames) console.log(`Frame ${frame.number}: ${frame.mode} | ${frame.asset}${frame.mode === "MANUAL" ? " | native sticker step" : " | IG + FB Story"}`);
    return;
  }

  if (approval !== "APPROVED") throw new Error("Live publishing blocked: batch must contain the exact line approval: APPROVED.");
  if (!opts.assetBaseUrl) throw new Error("Live publishing blocked: provide --asset-base-url for Meta-fetchable image files.");
  const base = new URL(opts.assetBaseUrl);
  if (base.protocol !== "https:") throw new Error("Live asset base URL must use HTTPS.");
  for (const frame of frames.filter((item) => item.mode === "API")) {
    if (!/\.jpe?g$/i.test(frame.asset)) throw new Error(`Frame ${frame.number} must use a JPEG for API publishing.`);
  }
  const token = getSystemToken();
  if (!token) throw new Error("Live publishing blocked: the configured Keychain item was not found.");
  const pageId = opts.pageId ?? DEFAULT_PAGE_ID;
  const igUserId = opts.igUserId ?? DEFAULT_IG_ID;
  const pageResponse = await graph("GET", pageId, { token, params: { fields: "access_token" } });
  const pageToken = pageResponse.access_token;
  if (!pageToken) throw new Error("Live publishing blocked: Meta did not return a Page token.");
  const prompt = createInterface({ input, output });
  try {
    for (const frame of frames) {
      if (frame.mode === "MANUAL") {
        console.log(`MANUAL FRAME ${frame.number}: publish this frame with its native sticker on the intended Story channels.`);
        await prompt.question("After visually verifying the manual Story is live and correctly ordered, press Enter to continue; Ctrl-C stops: ");
        continue;
      }
      const url = mediaUrl(base.toString(), path.relative(ROOT, safeWorkspacePath(frame.asset)));
      console.log(`Publishing API frame ${frame.number} to Instagram Stories…`);
      await publishInstagram(url, token, igUserId);
      console.log(`Publishing API frame ${frame.number} to Facebook Page Stories…`);
      await publishFacebook(url, pageToken, pageId);
    }
  } finally {
    prompt.close();
  }
  console.log("Story sequence submitted. Verify the live sequence and log platform evidence separately.");
}

main().catch((error) => {
  console.error(`publish-story: ${error.message}`);
  process.exitCode = 1;
});
