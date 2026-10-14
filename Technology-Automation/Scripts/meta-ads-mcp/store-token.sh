#!/bin/zsh
set -euo pipefail

service="travelframe-meta-ads"
account="meta-ads-access-token"

read -r -s "token?Paste the Meta Ads access token: "
printf "\n"

if [[ -z "$token" ]]; then
  printf "No token was entered.\n" >&2
  exit 1
fi

/usr/bin/security add-generic-password \
  -U \
  -s "$service" \
  -a "$account" \
  -w "$token" \
  >/dev/null

unset token
printf "Meta Ads token stored in macOS Keychain.\n"
