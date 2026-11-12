#!/bin/zsh
# Build The Hanoi Handbook PDF + cover preview.
# Run from anywhere:  zsh Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/source/build.sh
set -euo pipefail
P="${0:A:h:h}"
A="${P:h:h}/Assets/AI-Generated/Hanoi-Handbook-2026"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
V="${VERSION:-v02}"

# 1. Illustrations: paper normalised to white, max 1500 px (needs Pillow)
python3 -I "$P/source/prep_illustrations.py" "$A" "$P/illustrations" >/dev/null

# 2. PDF (A4, fonts are local files, no network needed)
"$CH" --headless=new --no-pdf-header-footer --allow-file-access-from-files --virtual-time-budget=10000 \
  --print-to-pdf="$P/TravelFrame-Hanoi-Handbook-2026-$V.pdf" "file://$P/hanoi-handbook.html"

# 3. Cover preview (first page only, 2x)
"$CH" --headless=new --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=8000 \
  --window-size=794,1123 --force-device-scale-factor=2 --screenshot="$P/preview-cover-$V.png" "file://$P/hanoi-handbook.html"

ls -la "$P/TravelFrame-Hanoi-Handbook-2026-$V.pdf" "$P/preview-cover-$V.png"
