#!/usr/bin/env bash
# download.sh <url> — download a video into Research-Insights/Library/videos/<platform>/<id>/
# Writes: video.mp4, info.json, thumbnail. Prints final paths.
set -euo pipefail

URL="${1:?usage: download.sh <url>}"
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
DEST="$ROOT/Research-Insights/Library/videos"

# platform slug from hostname
case "$(printf '%s' "$URL" | sed -E 's#https?://(www\.)?##' | cut -d/ -f1)" in
  *instagram*) PLATFORM=instagram ;;
  *tiktok*)    PLATFORM=tiktok ;;
  *youtube*|*youtu.be*) PLATFORM=youtube ;;
  *facebook*|*fb.watch*) PLATFORM=facebook ;;
  *x.com*|*twitter.com*) PLATFORM=x ;;
  *) PLATFORM=other ;;
esac

OUTDIR="$DEST/$PLATFORM/$(date +%Y-%m-%d)-$$"
mkdir -p "$OUTDIR"

yt-dlp \
  -f "bv*[height<=1080]+ba/b[height<=1080]" \
  --merge-output-format mp4 \
  --write-info-json --write-thumbnail --no-playlist \
  --no-progress --restrict-filenames \
  -o "$OUTDIR/video.%(ext)s" \
  "$URL"

# flatten: keep it predictable for the calling agent
for f in "$OUTDIR"/video.* "$OUTDIR"/*.json "$OUTDIR"/*.jpg "$OUTDIR"/*.webp; do
  [ -e "$f" ] && echo "$f"
done
