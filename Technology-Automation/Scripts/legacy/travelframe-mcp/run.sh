#!/bin/zsh
set -euo pipefail

USER_TOKEN="$(security find-generic-password -a "$USER" -s "travelframe-meta-readonly" -w)"
PAGE_TOKEN="$(security find-generic-password -a "$USER" -s "travelframe-facebook-page-readonly" -w 2>/dev/null || true)"
export TRAVELFRAME_META_ACCESS_TOKEN="$USER_TOKEN"
export TRAVELFRAME_META_PAGE_ACCESS_TOKEN="$PAGE_TOKEN"
export TRAVELFRAME_PAGE_ID="${TRAVELFRAME_PAGE_ID:-1409099405611405}"
export META_GRAPH_VERSION="${META_GRAPH_VERSION:-v25.0}"

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
exec node "$ROOT/Technology-Automation/MCP/travelframe-readonly.mjs"
