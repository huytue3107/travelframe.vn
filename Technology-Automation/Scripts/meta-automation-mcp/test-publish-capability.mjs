#!/usr/bin/env node
// TravelFrame — kiểm tra khả năng đăng bài FB/IG KHÔNG CÔNG KHAI.
// - Facebook: tạo 1 bài published=false (không ai thấy) rồi xoá ngay.
// - Instagram: tạo 1 media container, KHÔNG gọi media_publish (container tự hết hạn sau 24h).
// Token đọc từ Keychain, chỉ gửi qua header/body, không bao giờ in ra.
import { execSync } from "node:child_process";

const V = process.env.META_GRAPH_VERSION || "v25.0";
const G = `https://graph.facebook.com/${V}`;
const PAGE_ID = process.env.TRAVELFRAME_PAGE_ID || "1409099405611405";
const NEED = ["pages_manage_posts", "pages_read_engagement", "pages_show_list", "instagram_basic", "instagram_content_publish"];

function keychain(account, service) {
  try { return execSync(`/usr/bin/security find-generic-password -a "${account}" -s "${service}" -w`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return ""; }
}
const token = process.env.TRAVELFRAME_META_ACCESS_TOKEN || keychain("macbook", "travelframe-meta-readonly") || keychain("travelframe-page-access", "travelframe-meta-automation-token");
if (!token) { console.log("❌ Không tìm thấy token trong Keychain."); process.exit(1); }

const scrub = (s) => String(s).replace(/EAA[A-Za-z0-9]+/g, "[REDACTED]");
async function call(method, path, { tok = token, params = {} } = {}) {
  const url = new URL(`${G}/${path}`);
  const opts = { method, headers: { Authorization: `Bearer ${tok}` } };
  if (method === "GET" || method === "DELETE") for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  else { opts.headers["Content-Type"] = "application/x-www-form-urlencoded"; opts.body = new URLSearchParams(params).toString(); }
  const res = await fetch(url, opts);
  const j = await res.json().catch(() => ({}));
  if (!res.ok || j.error) throw new Error(scrub(j?.error?.message || `HTTP ${res.status}`));
  return j;
}
const out = [];
const log = (ok, label, detail = "") => { out.push(`${ok === true ? "✅" : ok === false ? "❌" : "⚠️"} ${label}${detail ? " — " + detail : ""}`); };

// 1. Token
try {
  const d = (await call("GET", "debug_token", { params: { input_token: token } })).data;
  const scopes = d.scopes || [];
  log(d.is_valid, "Token hợp lệ", `${d.type || "?"} · app ${d.application || "?"} · hết hạn: ${d.expires_at === 0 ? "không bao giờ" : new Date(d.expires_at * 1000).toISOString()}`);
  for (const p of NEED) log(scopes.includes(p), `Quyền ${p}`);
} catch (e) { log(false, "debug_token", e.message); }

// 2. Page token
let pageTok = token;
try {
  const p = await call("GET", PAGE_ID, { params: { fields: "name,access_token,instagram_business_account" } });
  if (p.access_token) pageTok = p.access_token;
  log(true, "Lấy Page token", `${p.name}${p.access_token ? "" : " (dùng token gốc)"}`);
  var IG_ID = p.instagram_business_account?.id;
} catch (e) { log(false, "Lấy Page token", e.message); }

// 3. Facebook: unpublished post -> delete
try {
  const post = await call("POST", `${PAGE_ID}/feed`, { tok: pageTok, params: { message: "[TravelFrame API test — unpublished, auto-deleted]", published: "false" } });
  log(true, "Facebook: tạo bài KHÔNG công khai", `id …${String(post.id).slice(-6)}`);
  try { await call("DELETE", post.id, { tok: pageTok }); log(true, "Facebook: xoá bài test"); }
  catch (e) { log("warn", "Facebook: chưa xoá được bài test (bài vẫn ở trạng thái unpublished, không ai thấy)", e.message); }
} catch (e) { log(false, "Facebook: tạo bài (pages_manage_posts)", e.message); }

// 4. Instagram: create container only (no publish)
if (!IG_ID) log(false, "Instagram: không tìm thấy tài khoản IG liên kết");
else {
  try {
    const m = await call("GET", `${IG_ID}/media`, { tok: pageTok, params: { fields: "media_type,media_url,thumbnail_url", limit: "10" } });
    const img = (m.data || []).map((x) => (x.media_type === "IMAGE" ? x.media_url : x.thumbnail_url)).find(Boolean);
    if (!img) throw new Error("không tìm thấy ảnh mẫu công khai để thử");
    const c = await call("POST", `${IG_ID}/media`, { tok: pageTok, params: { image_url: img, caption: "TravelFrame API test — not published" } });
    log(true, "Instagram: tạo container (instagram_content_publish)", `id …${String(c.id).slice(-6)} · KHÔNG publish`);
    try {
      await new Promise((r) => setTimeout(r, 3000));
      const s = await call("GET", c.id, { tok: pageTok, params: { fields: "status_code" } });
      log(s.status_code !== "ERROR", "Instagram: trạng thái container", s.status_code);
    } catch (e) { log("warn", "Instagram: đọc trạng thái container", e.message); }
  } catch (e) { log(false, "Instagram: tạo container (instagram_content_publish)", e.message); }
}

console.log("=== TravelFrame — kiểm tra khả năng đăng bài (không công khai) ===");
console.log(out.join("\n"));
