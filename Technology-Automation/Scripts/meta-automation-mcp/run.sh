#!/bin/zsh
set -euo pipefail

PAGE_TOKEN="$(security find-generic-password -a "travelframe-page-access" -s "travelframe-meta-automation-token" -w 2>/dev/null || security find-generic-password -a "$USER" -s "travelframe-facebook-page-readonly" -w 2>/dev/null || true)"

if [[ -z "$PAGE_TOKEN" ]]; then
  printf "❌ Chưa tìm thấy token Meta Automation trong macOS Keychain.\n" >&2
  printf "Vui lòng chạy: ./Technology-Automation/Scripts/meta-automation-mcp/store-token.sh để lưu token.\n" >&2
  exit 1
fi

export TRAVELFRAME_META_PAGE_ACCESS_TOKEN="$PAGE_TOKEN"
export TRAVELFRAME_PAGE_ID="${TRAVELFRAME_PAGE_ID:-1409099405611405}"
export META_GRAPH_VERSION="${META_GRAPH_VERSION:-v25.0}"

unset PAGE_TOKEN

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
exec node "$ROOT/Technology-Automation/MCP/travelframe-meta-automation.mjs"
