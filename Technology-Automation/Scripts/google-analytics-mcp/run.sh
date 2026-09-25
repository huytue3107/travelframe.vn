#!/bin/zsh
set -euo pipefail

# Default config directory for TravelFrame keys
DEFAULT_KEY_PATH="$HOME/.config/travelframe/ga4-service-account.json"

if [[ -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" && -f "$DEFAULT_KEY_PATH" ]]; then
  export GOOGLE_APPLICATION_CREDENTIALS="$DEFAULT_KEY_PATH"
fi

export GA4_PROPERTY_ID="${GA4_PROPERTY_ID:-552867189}"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
exec node "$ROOT/Technology-Automation/MCP/google-analytics-readonly.mjs"
