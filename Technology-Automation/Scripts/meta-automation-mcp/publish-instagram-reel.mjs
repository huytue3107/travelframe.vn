#!/usr/bin/env node
// TravelFrame — Instagram Reel Publisher
// Defaults to DRY-RUN mode. Live publishing requires --live flag.
// Token is read safely from macOS Keychain or environment variable.
// Uses resumable upload to rupload.facebook.com/ig-api-upload as per Meta Graph API standard.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const VERSION = process.env.META_GRAPH_VERSION || "v25.0";
const G = `https://graph.facebook.com/${VERSION}`;
const RUPLOAD = "https://rupload.facebook.com";
const IG_ID = process.env.TRAVELFRAME_IG_ID || "17841438272497512";

function keychain(account, service) {
  try {
    return execSync(`/usr/bin/security find-generic-password -a "${account}" -s "${service}" -w`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
}

const token =
  process.env.TRAVELFRAME_META_ACCESS_TOKEN ||
  keychain("travelframe-page-access", "travelframe-meta-automation-token") ||
  keychain("macbook", "travelframe-meta-readonly");

if (!token) {
  console.error("❌ Không tìm thấy token trong Keychain hoặc biến môi trường.");
  process.exit(1);
}

function parseArgs(argv) {
  const opts = {
    dryRun: true,
    live: false,
    video: "",
    caption: "",
    captionFile: "",
    shareToFeed: true
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--live") {
      opts.live = true;
      opts.dryRun = false;
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
      opts.live = false;
    } else if (arg === "--video" || arg === "-v") {
      opts.video = argv[++i];
    } else if (arg === "--caption" || arg === "-c") {
      opts.caption = argv[++i];
    } else if (arg === "--caption-file") {
      opts.captionFile = argv[++i];
    } else if (arg === "--no-feed") {
      opts.shareToFeed = false;
    }
  }

  if (opts.captionFile && !opts.caption) {
    if (fs.existsSync(opts.captionFile)) {
      opts.caption = fs.readFileSync(opts.captionFile, "utf8").trim();
    } else {
      console.error(`❌ File caption không tồn tại: ${opts.captionFile}`);
      process.exit(1);
    }
  }

  return opts;
}

const scrub = (s) => String(s).replace(/EAA[A-Za-z0-9]+/g, "[REDACTED]");

async function check(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    const code = payload.error?.code ? `, Meta code ${payload.error.code}` : "";
    const msg = payload.error?.error_user_msg || payload.error?.message || "";
    throw new Error(scrub(`Meta request failed (HTTP ${response.status}${code}) ${msg}`));
  }
  return payload;
}

async function graph(method, objectPath, tok, params = {}) {
  const url = new URL(`${G}/${objectPath}`);
  const init = { method, headers: { Authorization: `Bearer ${tok}` } };
  if (method === "GET") for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  else {
    init.headers["Content-Type"] = "application/x-www-form-urlencoded";
    init.body = new URLSearchParams(params).toString();
  }
  return check(await fetch(url, init));
}

async function rupload(url, tok, filePath) {
  const data = fs.readFileSync(filePath);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${tok}`,
      offset: "0",
      file_size: String(data.length),
      "Content-Type": "application/octet-stream"
    },
    body: data
  });
  return check(response);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log("==================================================");
  console.log(`🚀 TravelFrame Instagram Reel Publisher — ${args.live ? "LIVE MODE" : "DRY RUN MODE"}`);
  console.log(`📌 Account ID: ${IG_ID} (@travelframe.vn)`);
  console.log("==================================================");

  if (!args.video) {
    console.error("❌ Thiếu đường dẫn file video (--video).");
    process.exit(1);
  }

  const absVideo = path.resolve(args.video);
  if (!fs.existsSync(absVideo)) {
    console.error(`❌ Không tìm thấy file video: ${absVideo}`);
    process.exit(1);
  }

  const fileStat = fs.statSync(absVideo);
  console.log(`🎬 Video file: ${path.basename(absVideo)} (${(fileStat.size / 1024 / 1024).toFixed(2)} MB)`);

  if (!args.caption) {
    console.error("❌ Thiếu caption (--caption hoặc --caption-file).");
    process.exit(1);
  }

  if (args.caption.length > 2200) {
    console.error(`❌ Caption quá dài (${args.caption.length} ký tự, giới hạn Instagram là 2200).`);
    process.exit(1);
  }

  console.log("\n📄 Caption Preview:");
  console.log("--------------------------------------------------");
  console.log(args.caption);
  console.log("--------------------------------------------------\n");

  if (args.dryRun) {
    console.log("🔎 [DRY-RUN] Kiểm tra tính hợp lệ hoàn tất.");
    console.log("🔒 [DRY-RUN] Không gửi request đăng bài lên Meta.");
    console.log("👉 Để đăng thật, hãy xin phê duyệt của Rocky và chạy lại với cờ --live.");
    return;
  }

  // LIVE PUBLISHING
  console.log("⚡ [LIVE] 1. Khởi tạo Reel container trên Instagram...");
  const container = await graph("POST", `${IG_ID}/media`, token, {
    media_type: "REELS",
    upload_type: "resumable",
    caption: args.caption,
    share_to_feed: args.shareToFeed ? "true" : "false"
  });

  const containerId = container.id;
  if (!containerId) throw new Error("Meta không trả về container ID.");
  console.log(`✅ Đã tạo container: ID ${containerId}`);

  console.log("📤 [LIVE] 2. Tải dữ liệu video lên rupload.facebook.com...");
  await rupload(`${RUPLOAD}/ig-api-upload/${VERSION}/${containerId}`, token, absVideo);
  console.log("✅ Tải video lên hoàn tất.");

  console.log("⏳ [LIVE] 3. Chờ Meta xử lý video container...");
  const started = Date.now();
  let finished = false;
  while (!finished) {
    await new Promise((r) => setTimeout(r, 5000));
    const state = await graph("GET", containerId, token, { fields: "status_code" });
    console.log(`   Trạng thái hiện tại: ${state.status_code}`);
    if (state.status_code === "FINISHED") {
      finished = true;
      break;
    }
    if (["ERROR", "EXPIRED"].includes(state.status_code)) {
      throw new Error(`Instagram container xử lý thất bại: ${state.status_code}`);
    }
    if (Date.now() - started > 10 * 60 * 1000) {
      throw new Error("Quá thời gian chờ (10 phút) mà container chưa FINISHED.");
    }
  }

  console.log("📢 [LIVE] 4. Xuất bản Reel lên Instagram...");
  const published = await graph("POST", `${IG_ID}/media_publish`, token, {
    creation_id: containerId
  });

  const mediaId = published.id;
  console.log("\n🎉 ĐĂNG REEL THÀNH CÔNG!");
  console.log(`🆔 Media ID: ${mediaId}`);

  // Fetch permalink
  try {
    const mediaInfo = await graph("GET", mediaId, token, { fields: "permalink,shortcode" });
    if (mediaInfo.permalink) {
      console.log(`🔗 Link bài đăng: ${mediaInfo.permalink}`);
    }
  } catch {
    console.log(`🔗 Link bài đăng: https://www.instagram.com/travelframe.vn/`);
  }
}

main().catch((err) => {
  console.error("❌ LỖI:", err.message);
  process.exit(1);
});
