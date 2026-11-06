#!/usr/bin/env node
// Publish a single Reel to Facebook Page
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const PAGE_ID = "1409099405611405";
const VERSION = "v25.0";
const G = `https://graph.facebook.com/${VERSION}`;
const RUPLOAD = "https://rupload.facebook.com";

function getSystemToken() {
  try {
    return execFileSync(
      "/usr/bin/security",
      ["find-generic-password", "-a", "travelframe-page-access", "-s", "travelframe-meta-automation-token", "-w"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
  } catch (e) {
    console.error("Keychain error:", e.message);
    return "";
  }
}

async function graph(method, objectPath, token, params = {}) {
  const url = new URL(`${G}/${objectPath}`);
  const init = { method, headers: { Authorization: `Bearer ${token}` } };
  if (method === "GET") for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  else {
    init.headers["Content-Type"] = "application/x-www-form-urlencoded";
    init.body = new URLSearchParams(params).toString();
  }
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(`Graph error (${res.status}): ${JSON.stringify(data.error || data)}`);
  }
  return data;
}

async function rupload(url, token, filePath) {
  const data = await readFile(filePath);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${token}`,
      offset: "0",
      file_size: String(data.length),
      "Content-Type": "application/octet-stream",
    },
    body: data,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(`Upload error (${res.status}): ${JSON.stringify(json.error || json)}`);
  }
  return json;
}

async function main() {
  const token = getSystemToken();
  if (!token) throw new Error("No token found in keychain");

  console.log("0. Fetching Page access token...");
  const pageTokenData = await graph("GET", PAGE_ID, token, { fields: "access_token" });
  const pageToken = pageTokenData.access_token;
  if (!pageToken) throw new Error("No Page access token returned");

  const filePath = process.argv[2] || "Creative-Production/Projects/Hanoi-Phomen-Tay-Ho-2026-11-05/TF-Hanoi-Phomen-Tay-Ho-Clean-H264.mp4";
  const captionPath = process.argv[3] || "Creative-Production/Projects/Hanoi-Phomen-Tay-Ho-2026-11-05/caption.md";
  const caption = (await readFile(captionPath, "utf8")).trim();

  console.log("1. Initializing Facebook Reel upload...");
  const start = await graph("POST", `${PAGE_ID}/video_reels`, pageToken, { upload_phase: "start" });
  console.log("   Video ID:", start.video_id);

  console.log("2. Uploading video binary...");
  const uploadUrl = `${RUPLOAD}/video-upload/${VERSION}/${start.video_id}`;
  await rupload(uploadUrl, pageToken, filePath);
  console.log("   Binary uploaded successfully.");

  console.log("3. Finalizing and publishing reel...");
  const finish = await graph("POST", `${PAGE_ID}/video_reels`, pageToken, {
    upload_phase: "finish",
    video_id: start.video_id,
    video_state: "PUBLISHED",
    description: caption,
  });
  console.log("   Result:", JSON.stringify(finish));
}

main().catch((err) => {
  console.error("Publish failed:", err.message);
  process.exit(1);
});
