#!/bin/zsh
set -euo pipefail

# Claude Desktop starts MCP servers with a minimal PATH; make sure node is found
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.volta/bin:$PATH"
if ! command -v node >/dev/null 2>&1 && [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  source "$HOME/.nvm/nvm.sh" >/dev/null
fi

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
token_service="travelframe-meta-ads"
token_account="meta-ads-access-token"
ad_account_service="travelframe-meta-ads-account"
ad_account_key="ad-account-id"

if ! token=$(/usr/bin/security find-generic-password \
  -s "$token_service" \
  -a "$token_account" \
  -w 2>/dev/null); then
  printf "Meta Ads token is missing from macOS Keychain.\n" >&2
  exit 1
fi

ad_account_id=""
if ! ad_account_id=$(/usr/bin/security find-generic-password \
  -s "$ad_account_service" \
  -a "$ad_account_key" \
  -w 2>/dev/null); then
  ad_account_id=""
fi

export META_ADS_ACCESS_TOKEN="$token"
export META_AD_ACCOUNT_ID="$ad_account_id"
export TRAVELFRAME_PAGE_ID="1409099405611405"
export TRAVELFRAME_INSTAGRAM_ACCOUNT_ID="17841438272497512"
export META_GRAPH_VERSION="${META_GRAPH_VERSION:-v26.0}"
export META_ADS_MODE="${META_ADS_MODE:-read}"

unset token ad_account_id
cd "$ROOT"
exec node "$ROOT/Technology-Automation/MCP/travelframe-meta-ads.mjs"
