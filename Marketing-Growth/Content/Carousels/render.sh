#!/bin/bash
# Render carousel slides -> PNG (2160x2700, Instagram 4:5)
# Usage: ./render.sh <carousel-dir> [num-slides]
# Example: ./render.sh day-03-24h-hanoi 7
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DIR="${1:?usage: render.sh <carousel-dir> [num-slides]}"
N="${2:-7}"
SLIDES="$DIR/slides.html"
OUT="$DIR/png"

mkdir -p "$OUT"
ABS="$(cd "$DIR/.." && pwd)/$DIR"

for i in $(seq 1 "$N"); do
  printf '%02d' "$i" | xargs -I{} "$CHROME" \
    --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=2 --window-size=1080,1350 \
    --screenshot="$OUT/slide-{}.png" \
    "file://$ABS/slides.html#$i" 2>/dev/null
done

echo "Rendered $N slides -> $OUT"
ls -la "$OUT"
