# Metric Definitions — Data Analytics

Nguồn sự thật của mọi con số: `Technology-Automation/` không tính metrics; metrics
được tính bởi script deterministic
`.claude/skills/channel-evaluation/scripts/channel_metrics.py` (output `metrics.json`).
Báo cáo CHỈ diễn giải số có trong metrics.json — không tự tính số trong văn bản.

## Definitions

| Metric | Công thức | Ghi chú |
|---|---|---|
| `engagement` | likes + comments | từ posts JSON platform |
| `er` | engagement / followersCount | **xấp xỉ** — followers là snapshot tại lúc scrape |
| `rel_er` | er / median_er kênh (loại pinned) | so post với median; loại pinned chống méo |
| `views` | videoViewCount / playCount / viewCount | chỉ áp dụng cho video content |
| `cadence` | posts/week = n / span_days × 7; gap trung vị | từ timestamps |

## Caveats bắt buộc (mọi report)

1. followers snapshot → ER là xấp xỉ hướng, không phải giá trị tại thời điểm post.
2. `isPinned` làm méo median/mean → luôn nêu both with/without pinned.
3. Sample <30 → chỉ dẫn, không phải kết luận thống kê; script flag khi <10.
4. Image/Sidecar không views → so format theo ER, không theo views.
5. Tương quan ≠ nhân quả — cấm "hook này gây viral".
6. Điểm rubric (10 điểm) đến từ chấm kép blind; lệch >1 điểm/criteria → unresolved,
   không lấy trung bình.

## Data sources

- Posts JSON: `Research-Insights/Library/channels/<handle>/*.json` (Apify, có ngày snapshot qua file mtime)
- Evaluation runs: `Research-Insights/Library/evaluation/<handle>/<run-id>/` và
  `Research-Insights/Library/channels/<handle>/evaluation-<run-id>/`
- Video analyses: `Research-Insights/Library/analysis/<video-key>/<run-id>/`
- Publishing evidence: `Marketing-Growth/Published-Ledger.md`
