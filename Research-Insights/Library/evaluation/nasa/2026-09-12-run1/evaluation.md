# Đánh giá kênh @nasa — run 2026-09-12-run1

**Trạng thái: evaluated** (chấm kép 100% resolved · spot-check partial 1/3 · không có analysis run video)

## Scorecard

| Chỉ số | Giá trị (từ metrics.json) |
|---|---|
| Posts | 12 (4 Image · 4 Video · 4 Sidecar) · 1 pinned |
| Followers (snapshot) | 104,376,870 |
| Median ER | 0.1785% (loại pinned: 0.1501%) |
| Cadence | 2.9 posts/tuần · gap trung vị 1 ngày |
| Điểm kép (0-10) | median 7 · range 4-9 · 60/60 criteria resolved, 0 unresolved |

## Diễn giải (số từ metrics.json — không tự tính)

**Định lượng.** Top rel_er: Db9IVmrDvQ4 (15.6× — eclipse), DcOX3hWFiey (3.6×), DczLHKOGpqh (3.6×).
Bottom: Dc4u1yKPj_s (0.27×), DdHyaYAifb6 (0.35×), DcMXl1IPNtB (0.58×). Pinned post
(DcOX3hWFiey) làm median tăng từ 0.150% → 0.179% khi tính vào.

**Định tính (dual-rater, evidence trong scores.json).**
- Điểm cao nhất: Dc3zNGWlIpy 9/10 — CTA cụ thể duy nhất ("adopt a pixel" + link bio) +
  wow-stat (4K TV 45 city blocks) + timeline rõ.
- Điểm thấp nhất: 4/10 cho 2 Video — hook phẳng ("Chez ISS", pun cũ), không CTA,
  caption thiếu craft. **Video là format yếu nhất của kênh** (median likes của Video
  thấp hơn Image — xem formats trong metrics.json).
- Điểm cao ≠ tương quan cao: post 15.6× median chỉ 7/10 (craft mỏng — evidence cả 2
  rater: CTA=0, hook=2). Ngược lại điểm 9 chỉ 1.25×. Nói khác: chất lượng craft và
  reach đi theo hướng khác nhau ở kênh này — reach do chủ đề/điều kiện (eclipse),
  không phải do caption.
- Điểm chấm kép thống nhất tuyệt đối (max Δ=1, không có điểm nào lệch 2) → rubric
  hoạt động ổn, không cần rater thứ ba.

**Với TravelFrame** (trỏ knowledge):
- CTA là điểm yếu hệ thống của NASA (8/12 post CTA=0) → P-006/P-007 của mình là lợi
  thế cạnh tranh cần giữ.
- CTA cụ thể + hashtag 3 cái/caption đúng — khớp V-06 (≥4 hashtag có thể thừa cho
  brand lớn; giữ 4-5 của mình).
- Wow-stat cụ thể (45 city blocks) = P-005, P-014-style hook: dùng số cụ thể không
  trừu tượng.
- Video yếu nhưng đó là kênh khổng lồ với khán giả sẵn — KHÔNG suy ra video không
  hiệu quả cho kênh nhỏ.

## Spot-check
1/3 post fetch được (2/3 login wall IG): caption khớp nguyên nội dung, likes JSON
564,892 ≈ hiển thị "565.7K" (0.1%) → dữ liệu đáng tin tại snapshot. Chi tiết: spot-check.md.

## Caveats (bắt buộc)
- ER là xấp xỉ — followers là snapshot hiện tại, không phải tại thời điểm post.
- Median nêu cả 2 cách (with/without pinned) vì pinned kéo median lên.
- Sample 12 < ngưỡng 30 — xu hướng là chỉ dẫn, không phải kết luận thống kê.
- Image/Sidecar không views — so sánh format theo ER, không theo views.
- Chưa có analysis run video-analyst cho post nào → production chỉ chấm max 1
  ("chưa xem hình") — tổng điểm là cận dưới.
- Tương quan craft↔reach là quan sát, không phải nhân quả.

## Run artifacts
metrics.json · scores-rater-a.json · scores-rater-b.json · scores.json (100% resolved)
spot-check.md (partial 1/3) · draft gate: output/drafts/2026-09-12-esim-setup-reel/evaluation-*.md
