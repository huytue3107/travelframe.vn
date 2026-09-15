#!/bin/zsh
set -euo pipefail

TOKEN="$(security find-generic-password -a "$USER" -s "travelframe-meta-readonly" -w)"
export TRAVELFRAME_META_ACCESS_TOKEN="$TOKEN"
export TRAVELFRAME_PAGE_ID="${TRAVELFRAME_PAGE_ID:-1409099405611405}"
export META_GRAPH_VERSION="${META_GRAPH_VERSION:-v25.0}"

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
exec node "$ROOT/Technology-Automation/MCP/travelframe-readonly.mjs"
