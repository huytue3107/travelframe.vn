# video-understanding skill

Phân tích một video tham khảo (reel/TikTok/YouTube) cho TravelFrame qua 4 nguồn:
hình ảnh, lời nói, subtitle nền tảng, caption bài đăng.

- Hướng dẫn chạy: xem `SKILL.md` (7 bước).
- Hợp đồng dữ liệu: `references/source-contract.md`.
- Format output: `references/analysis-rubric.md`.
- Nguồn upstream + checksum: `references/upstream.md`.

Scripts:
```bash
# Bước 2 — hồ sơ nguồn
python3 .claude/skills/video-understanding/scripts/prepare_video.py \
  --video <video.mp4> [--info info.json] [--posts posts.json] [--transcripts <dir>] \
  --out Research-Insights/Library/analysis/<video-key>/<run-id>/

# Bước 4-5 — khung hình (pass tổng quan / pass focused)
python3 .claude/skills/video-understanding/scripts/extract_frames.py \
  <video.mp4> --out <run-dir>/frames/ [--resolution 768] [--max-frames 100] \
  [--start T --end T] [--no-dedup]
```

Tests: `python3 -m unittest discover -s Technology-Automation/Tests/legacy/video-understanding -v` (từ gốc dự án).
