#!/bin/zsh
set -euo pipefail

service="travelframe-meta-automation-token"
account="travelframe-page-access"

printf "=========================================================\n"
printf "  TravelFrame Meta Automation MCP - Store Page Token\n"
printf "=========================================================\n"
printf "Token này cần các quyền: pages_messaging, pages_manage_posts,\n"
printf "pages_read_engagement, instagram_manage_messages, instagram_manage_comments.\n\n"

read -r -s "token?Nhập hoặc dán Meta Page Access Token (ẩn ký tự): "
printf "\n"

if [[ -z "$token" ]]; then
  printf "❌ Không có token nào được nhập.\n" >&2
  exit 1
fi

/usr/bin/security add-generic-password \
  -U \
  -s "$service" \
  -a "$account" \
  -w "$token" \
  >/dev/null

unset token
printf "✅ Token đã được lưu an toàn vào macOS Keychain (service: %s, account: %s).\n" "$service" "$account"
