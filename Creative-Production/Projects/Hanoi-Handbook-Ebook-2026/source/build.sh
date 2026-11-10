#!/bin/zsh
# Build The Hanoi Handbook PDF + cover preview.
# Run from anywhere:  zsh Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/source/build.sh
set -euo pipefail
P="${0:A:h:h}"
A="${P:h:h}/Assets/AI-Generated/Hanoi-Handbook-2026"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 1. Web-size JPEG copies of the AI illustrations (max 1400 px, quality 76)
mkdir -p "$P/illustrations"
for f in "$A"/*.png; do
  b="${f:t:r}"
  [ "$P/illustrations/$b.jpg" -nt "$f" ] || sips -s format jpeg -s formatOptions 76 -Z 1400 "$f" --out "$P/illustrations/$b.jpg" >/dev/null
done

# 2. PDF (A4, fonts are local files, no network needed)
"$CH" --headless=new --no-pdf-header-footer --allow-file-access-from-files --virtual-time-budget=10000 \
  --print-to-pdf="$P/TravelFrame-Hanoi-Handbook-2026-v01.pdf" "file://$P/hanoi-handbook.html"

# 3. Cover preview (first page only, 2x)
"$CH" --headless=new --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=8000 \
  --window-size=794,1123 --force-device-scale-factor=2 --screenshot="$P/preview-cover-v01.png" "file://$P/hanoi-handbook.html"

ls -la "$P"/TravelFrame-Hanoi-Handbook-2026-v01.pdf "$P"/preview-cover-v01.png
