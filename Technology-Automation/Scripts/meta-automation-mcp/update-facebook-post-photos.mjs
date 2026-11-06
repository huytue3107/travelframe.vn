#!/usr/bin/env node
// TravelFrame — Upload and append remaining Instagram photos to the live Facebook post
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const V = process.env.META_GRAPH_VERSION || "v25.0";
const G = `https://graph.facebook.com/${V}`;
const PAGE_ID = "1409099405611405";
const POST_ID = "1409099405611405_122123563659479755";

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
  console.error("❌ Không tìm thấy token trong Keychain.");
  process.exit(1);
}

const scrub = (s) => String(s).replace(/EAA[A-Za-z0-9]+/g, "[REDACTED]");

async function getPageAccessToken() {
  const url = `${G}/${PAGE_ID}?fields=name,access_token`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(scrub(data?.error?.message || `HTTP ${res.status}`));
  return data.access_token || token;
}

async function uploadUnpublishedPhoto(pageTok, filePath) {
  const url = `${G}/${PAGE_ID}/photos`;
  const formData = new FormData();
  formData.append("published", "false");
  const fileBytes = fs.readFileSync(filePath);
  const mime = filePath.endsWith(".png") ? "image/png" : "image/jpeg";
  formData.append("source", new Blob([fileBytes], { type: mime }), path.basename(filePath));

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${pageTok}` },
    body: formData
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(scrub(data?.error?.message || `HTTP ${res.status}`));
  return data.id;
}

async function main() {
  console.log("==================================================");
  console.log("🚀 Bổ sung toàn bộ ảnh Instagram vào bài Facebook");
  console.log(`📌 Post ID: ${POST_ID}`);
  console.log("==================================================");

  const pageTok = await getPageAccessToken();
  console.log("✅ Lấy Page access token thành công.");

  // Already uploaded:
  // Photo 1 (P1-Index6): 122123563545479755
  // Photo 2 (P2-Index1): 122123563623479755
  const existingIds = ["122123563545479755", "122123563623479755"];

  const rawDir = "Creative-Production/Assets/Raw/Sunset-Couple-Shoot";
  const newPhotosToUpload = [
    // Post 1 remaining photos
    path.join(rawDir, "p1-idx1-De1W2T1Rbu0.jpg"),
    path.join(rawDir, "p1-idx2-De1W2WPR86m.jpg"),
    path.join(rawDir, "p1-idx3-De1W2ZbRCxD.jpg"),
    path.join(rawDir, "p1-idx4-De1W2byRlMI.jpg"),
    path.join(rawDir, "p1-idx5-De1W2eaRjB2.jpg"),
    // Post 2 remaining photos
    path.join(rawDir, "p2-idx2-De-_MCuR-oB.jpg"),
    path.join(rawDir, "p2-idx3-De-_MFkx7_1.jpg"),
    path.join(rawDir, "p2-idx4-De-_M2qxmss.jpg"),
    path.join(rawDir, "p2-idx5-De-_M5tRvzf.jpg")
  ];

  console.log(`📤 Đang tải lên ${newPhotosToUpload.length} ảnh bổ sung...`);
  const newPhotoIds = [];
  for (let i = 0; i < newPhotosToUpload.length; i++) {
    const pPath = newPhotosToUpload[i];
    const pid = await uploadUnpublishedPhoto(pageTok, pPath);
    console.log(`   ✅ [${i + 1}/${newPhotosToUpload.length}] ${path.basename(pPath)} -> Photo ID ${pid}`);
    newPhotoIds.push(pid);
  }

  const allPhotoIds = [...existingIds, ...newPhotoIds];
  console.log(`\n🔄 Đang cập nhật bài viết với toàn bộ ${allPhotoIds.length} ảnh...`);

  const updateUrl = `${G}/${POST_ID}`;
  const res = await fetch(updateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pageTok}`
    },
    body: JSON.stringify({
      attached_media: allPhotoIds.map((id) => ({ media_fbid: id }))
    })
  });

  const updateData = await res.json().catch(() => ({}));
  if (!res.ok || updateData.error) {
    throw new Error(scrub(updateData?.error?.message || `HTTP ${res.status}`));
  }

  console.log("✅ Cập nhật bài viết thành công:", updateData);

  // Verify attachments count
  const verifyRes = await fetch(`${G}/${POST_ID}?fields=attachments{subattachments}`, {
    headers: { Authorization: `Bearer ${pageTok}` }
  });
  const verifyData = await verifyRes.json();
  const subs = verifyData.attachments?.data?.[0]?.subattachments?.data || [];
  console.log(`\n🎉 HOÀN TẤT! Tổng số ảnh trên bài đăng hiện tại: ${subs.length} ảnh.`);
  console.log(`🔗 Link xem bài đăng: https://www.facebook.com/${POST_ID}`);
}

main().catch((err) => {
  console.error("❌ LỖI:", err.message);
  process.exit(1);
});
