#!/usr/bin/env node
// TravelFrame — Facebook Page Post Publisher (Single/Multi-Photo & Text)
// Defaults to DRY-RUN mode. Live publishing requires --live flag.
// Token is read safely from macOS Keychain or environment variable.
// Never prints access tokens.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const V = process.env.META_GRAPH_VERSION || "v25.0";
const G = `https://graph.facebook.com/${V}`;
const PAGE_ID = process.env.TRAVELFRAME_PAGE_ID || "1409099405611405";

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
    images: [],
    message: "",
    captionFile: ""
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--live") {
      opts.live = true;
      opts.dryRun = false;
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
      opts.live = false;
    } else if (arg === "--caption-file") {
      opts.captionFile = argv[++i];
    } else if (arg === "--message" || arg === "-m") {
      opts.message = argv[++i];
    } else if (arg === "--images") {
      i++;
      while (i < argv.length && !argv[i].startsWith("--")) {
        opts.images.push(argv[i]);
        i++;
      }
      i--; // adjust loop counter
    }
  }

  if (opts.captionFile && !opts.message) {
    if (fs.existsSync(opts.captionFile)) {
      opts.message = fs.readFileSync(opts.captionFile, "utf8").trim();
    } else {
      console.error(`❌ File caption không tồn tại: ${opts.captionFile}`);
      process.exit(1);
    }
  }

  return opts;
}

const scrub = (s) => String(s).replace(/EAA[A-Za-z0-9]+/g, "[REDACTED]");

async function getPageAccessToken() {
  const url = `${G}/${PAGE_ID}?fields=name,access_token`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(scrub(data?.error?.message || `HTTP ${res.status}`));
  }
  return data.access_token || token;
}

async function uploadUnpublishedPhoto(pageTok, imagePath) {
  const url = `${G}/${PAGE_ID}/photos`;
  const formData = new FormData();
  formData.append("published", "false");

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    formData.append("url", imagePath);
  } else {
    const absPath = path.resolve(imagePath);
    if (!fs.existsSync(absPath)) {
      throw new Error(`File ảnh không tồn tại: ${absPath}`);
    }
    const fileBytes = fs.readFileSync(absPath);
    const mime = absPath.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("source", new Blob([fileBytes], { type: mime }), path.basename(absPath));
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${pageTok}` },
    body: formData
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(scrub(data?.error?.message || `HTTP ${res.status}`));
  }
  return data.id;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log("==================================================");
  console.log(`🚀 TravelFrame Facebook Publisher — ${args.live ? "LIVE MODE" : "DRY RUN MODE"}`);
  console.log("==================================================");

  if (!args.message) {
    console.error("❌ Thiếu nội dung bài đăng (--message hoặc --caption-file).");
    process.exit(1);
  }

  console.log(`📝 Số ảnh: ${args.images.length}`);
  args.images.forEach((img, idx) => console.log(`   [${idx + 1}] ${img}`));
  console.log("\n📄 Caption Preview:");
  console.log("--------------------------------------------------");
  console.log(args.message);
  console.log("--------------------------------------------------\n");

  if (args.dryRun) {
    console.log("🔎 [DRY-RUN] Kiểm tra tính hợp lệ của ảnh...");
    for (const img of args.images) {
      if (!img.startsWith("http://") && !img.startsWith("https://")) {
        const abs = path.resolve(img);
        if (!fs.existsSync(abs)) throw new Error(`Không tìm thấy file: ${abs}`);
        const stat = fs.statSync(abs);
        console.log(`   ✅ File tồn tại: ${path.basename(abs)} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        console.log(`   ✅ URL ảnh: ${img.slice(0, 50)}...`);
      }
    }
    console.log("\n🔒 [DRY-RUN] Không gửi request đăng bài lên Meta.");
    console.log("👉 Để đăng thật, hãy xin phê duyệt của Rocky và chạy lại với cờ --live.");
    return;
  }

  // LIVE MODE
  console.log("⚡ [LIVE] Bắt đầu quá trình đăng bài...");
  const pageTok = await getPageAccessToken();
  console.log("✅ Lấy Page access token thành công.");

  let postPayload = {
    message: args.message
  };

  if (args.images.length === 1) {
    // Single photo post
    console.log("📤 Đang tải 1 ảnh lên...");
    const photoId = await uploadUnpublishedPhoto(pageTok, args.images[0]);
    console.log(`✅ Ảnh đã tải lên tạm thời: ID ${photoId}`);
    postPayload.attached_media = [{ media_fbid: photoId }];
  } else if (args.images.length > 1) {
    // Multi photo post
    console.log(`📤 Đang tải ${args.images.length} ảnh lên...`);
    const photoIds = [];
    for (let i = 0; i < args.images.length; i++) {
      const pId = await uploadUnpublishedPhoto(pageTok, args.images[i]);
      console.log(`   ✅ [${i + 1}/${args.images.length}] Ảnh ID ${pId}`);
      photoIds.push(pId);
    }
    postPayload.attached_media = photoIds.map((id) => ({ media_fbid: id }));
  }

  console.log("📢 Đang xuất bản bài đăng lên Feed Facebook Page...");
  const feedUrl = `${G}/${PAGE_ID}/feed`;
  const res = await fetch(feedUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pageTok}`
    },
    body: JSON.stringify(postPayload)
  });

  const postData = await res.json().catch(() => ({}));
  if (!res.ok || postData.error) {
    throw new Error(scrub(postData?.error?.message || `HTTP ${res.status}`));
  }

  const postId = postData.id;
  console.log("\n🎉 ĐĂNG BÀI THÀNH CÔNG!");
  console.log(`🆔 Post ID: ${postId}`);
  console.log(`🔗 Link bài đăng: https://www.facebook.com/${postId}`);
}

main().catch((err) => {
  console.error("❌ LỖI:", err.message);
  process.exit(1);
});
