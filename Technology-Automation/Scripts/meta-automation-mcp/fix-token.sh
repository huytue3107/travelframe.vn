#!/bin/bash
# TravelFrame - lưu token Meta vào Keychain + kiểm tra sức khỏe token.
# Token không bao giờ được in ra, không đưa vào URL, không ghi ra file.
# Cách chạy:  ./Technology-Automation/Scripts/meta-automation-mcp/fix-token.sh          (dán token mới)
#             ./Technology-Automation/Scripts/meta-automation-mcp/fix-token.sh --check  (kiểm tra token đang lưu)
set -euo pipefail

GRAPH="https://graph.facebook.com/v25.0"
PAGE_ID="${TRAVELFRAME_PAGE_ID:-1409099405611405}"

echo "========================================================="
echo "  TravelFrame Meta - Lưu & kiểm tra token"
echo "========================================================="
CHECK_ONLY=0
if [[ "${1:-}" == "--check" ]]; then
  CHECK_ONLY=1
  token="$(/usr/bin/security find-generic-password -a "macbook" -s "travelframe-meta-readonly" -w 2>/dev/null || true)"
  [[ -z "$token" ]] && { echo "❌ Chưa có token trong Keychain." >&2; exit 1; }
  echo "(Chế độ --check: đọc token đang lưu trong Keychain, không ghi gì.)"
else
  read -r -s -p "Dán token Meta (ẩn ký tự), rồi Enter: " token
  echo
fi

# Làm sạch: bỏ ngoặc kép/đơn, khoảng trắng, xuống dòng.
token="${token//\"/}"
token="${token//\'/}"
token="$(printf '%s' "$token" | tr -d '[:space:]')"

if [[ -z "$token" ]]; then echo "❌ Không có token." >&2; exit 1; fi
if [[ "$token" != EAA* ]]; then
  echo "❌ Token phải bắt đầu bằng 'EAA'. Đang bắt đầu bằng '${token:0:3}'." >&2; exit 1
fi
if (( ${#token} < 100 )); then
  echo "❌ Token quá ngắn (${#token} ký tự) - có thể bị dán thiếu." >&2; exit 1
fi
echo "✓ Định dạng hợp lệ (độ dài ${#token} ký tự)."

# Gọi Graph API: token đi qua header/body, không nằm trong URL.
graph_get() {  # $1 = path?query (không chứa token)
  curl -sS --max-time 20 -H @<(printf 'Authorization: Bearer %s' "$token") "$GRAPH/$1"
}
json_get() {   # $1 = biểu thức JS trên biến d
  node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{let d;try{d=JSON.parse(s)}catch(e){console.log("PARSE_ERROR");return}try{console.log(eval(process.argv[1]))}catch(e){console.log("")}})' "$1"
}

echo
echo "--- Kiểm tra với Meta ---"
dbg="$(printf 'input_token=%s&method=GET' "$token" | curl -sS --max-time 20 \
  -H @<(printf 'Authorization: Bearer %s' "$token") --data-binary @- "$GRAPH/debug_token")"

err="$(printf '%s' "$dbg" | json_get 'd.error ? d.error.message : ""')"
if [[ -n "$err" ]]; then echo "❌ Meta từ chối token: $err" >&2; unset token; exit 1; fi

valid="$(printf '%s' "$dbg" | json_get 'd.data.is_valid')"
ttype="$(printf '%s' "$dbg" | json_get 'd.data.type')"
app="$(printf '%s' "$dbg" | json_get 'd.data.application + " (" + d.data.app_id + ")"')"
exp="$(printf '%s' "$dbg" | json_get 'd.data.expires_at===0 ? "KHÔNG BAO GIỜ HẾT HẠN" : new Date(d.data.expires_at*1000).toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"})')"
scopes="$(printf '%s' "$dbg" | json_get '(d.data.scopes||[]).join(", ")')"

echo "Hợp lệ:     $valid"
echo "Loại token: $ttype"
echo "App:        $app"
echo "Hết hạn:    $exp"
echo "Quyền:      $scopes"

if [[ "$valid" != "true" ]]; then echo "❌ Token không hợp lệ - KHÔNG lưu." >&2; unset token; exit 1; fi

pg="$(graph_get "$PAGE_ID?fields=name,instagram_business_account{username}")"
pname="$(printf '%s' "$pg" | json_get 'd.error ? "LỖI: "+d.error.message : d.name + " / IG: " + (d.instagram_business_account ? "@"+d.instagram_business_account.username : "chưa thấy")')"
echo "Page:       $pname"

echo
echo "--- Kiểm tra từng quyền cần cho TravelFrame ---"
need="pages_show_list pages_read_engagement pages_read_user_content pages_manage_engagement pages_manage_posts pages_messaging instagram_basic instagram_manage_insights instagram_manage_comments instagram_manage_messages instagram_content_publish business_management"
for p in $need; do
  if [[ ",$(printf '%s' "$scopes" | tr -d ' ')," == *",$p,"* ]]; then echo "  ✅ $p"; else echo "  ❌ $p (thiếu)"; fi
done
cm="$(graph_get "$PAGE_ID/posts?limit=15&fields=comments.summary(true).limit(0)")"
ctotal="$(printf '%s' "$cm" | json_get 'd.error ? "LỖI: "+d.error.message : (d.data||[]).reduce((a,p)=>a+((p.comments&&p.comments.summary&&p.comments.summary.total_count)||0),0) + " comment trên 15 bài gần nhất"')"
echo "Đọc comment Page: $ctotal"
if (( CHECK_ONLY )); then unset token dbg; echo "Xong (không thay đổi Keychain)."; exit 0; fi

echo
echo "--- Lưu vào Keychain (2 chỗ MCP đang đọc) ---"
/usr/bin/security add-generic-password -U -a "macbook" -s "travelframe-meta-readonly" -w "$token" >/dev/null
/usr/bin/security add-generic-password -U -a "travelframe-page-access" -s "travelframe-meta-automation-token" -w "$token" >/dev/null
unset token dbg
echo "✅ Đã lưu: travelframe-meta-readonly + travelframe-meta-automation-token"
if [[ "$exp" != "KHÔNG BAO GIỜ HẾT HẠN" ]]; then
  echo "⚠️  Token này CÓ hạn ($exp). Nên dùng System User token (Never) để không phải làm lại."
fi
echo "👉 Khởi động lại connector Meta trong app Claude, rồi báo Claude kiểm tra."
