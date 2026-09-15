# Snapshot index — Channel Evaluations 2026-09-13

Bản ghi chốt số liệu ngày 2026-09-13. Số liệu gốc (immutability) nằm trong
metrics.json của từng run — file này là INDEX trỏ tới, không phải nguồn số mới.

## Kênh @nasa (run 2026-09-12-run1)

- Source of truth: `Research-Insights/Library/evaluation/nasa/2026-09-12-run1/metrics.json`
- Scrape snapshot: instagram-posts.json trước 2026-09-12 (mtime)
- Chốt: 12 posts (4 Image/4 Video/4 Sidecar, 1 pinned) · followers 104,376,870 ·
  median ER 0.1785% (loại pinned 0.1501%) · cadence 2.9 posts/tuần · dual-rater
  60/60 resolved · spot-check partial 1/3 (likes 564,892 ≈ "565.7K" hiển thị)
- Report: cùng run dir, `evaluation.md`

## Kênh @themikeytravels (run 2026-09-13-run1)

- Source of truth: `Research-Insights/Library/channels/host-themikeytravel/evaluation-2026-09-13-run1/metrics.json`
- Scrape snapshot: 2026-09-13 (Apify)
- Chốt: 12 reels (100% Video) · followers 1,216 · median ER 0.5757% · median views
  404.5 · cadence 6.3 reels/tuần · top rel_er 218.86× (mistake-hook) · dual-rater
  60/60 resolved · spot-check checked 2/2 (caption + số khớp chính xác)
- Report: cùng run dir, `evaluation.md`; digest cấp kênh: `digest.md` cạnh đó

## Caveats chung

ER là xấp xỉ (followers snapshot); sample <30; so kênh bằng absolute engagement +
cấu trúc nội dung, không so ER giữa kênh lớn và kênh nhỏ. Định nghĩa đầy đủ:
`Data-Analytics/Metric-Definitions.md`.
