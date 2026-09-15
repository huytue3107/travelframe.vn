# Đánh giá kênh @themikeytravels — run 2026-09-13-run1

**Trạng thái: evaluated** (chấm kép 100% resolved · spot-check checked 2/2 · không có analysis run video — user chọn không tải video)

## Scorecard

| Chỉ số | Giá trị (metrics.json) |
|---|---|
| Posts | 12 (12/12 Video-reels, 0 pinned) |
| Followers (snapshot) | 1,216 |
| Median ER | 0.5757% |
| Median views | 404.5 |
| Cadence | 6.3 reels/tuần, 17 ngày |
| Điểm kép (0-10) | range 3-8 · 60/60 criteria resolved, 0 unresolved, 0 thiếu evidence |

## Diễn giải (số từ metrics.json — không tự tính)

**Định lượng.** Top rel_er: Dcm6tQTsApl (218.86× — "mistakes" Vietnam, 466,989 views),
DchspPUM9SR (126.43× — save-first Thailand, 380,646 views), Dc2Le9vswFV (8.0×).
Bốn bài nền rel_er < 0.6. Phân phối cực lệch: 2 bài viral gánh toàn bộ reach của kênh.

**Định tính (dual-rater blind, evidence trong scores.json).**
- Craft cao nhất: DcmFcsHpIlR 8/10 (hook cụ thể + CTA save + caption có craft).
- Craft thấp nhất: DdFu0gDsh8Z 3/10 ("This travel hack is well worth it" — hook mơ hồ,
  không CTA, không mạch).
- **Craft ≠ reach**: 2 bài viral nhất (218×, 126×) chỉ được 5/10 và 6/10 — hook
  loss-aversion ngắn, caption 1 dòng không craft. Rater chấm thấp vì caption mỏng;
  thuật toán thưởng vì hook dừng scroll. Ngược lại bài 8/10 chỉ 5.6×.
- Production: 12/12 post = 1 điểm ("chưa xem hình" — không có analysis run) → tổng
  điểm là cận dưới; cần tải video + video-analyst để chấm thật (tốn ~10-20 phút/video).
- CTA: chỉ 2/12 post có CTA (save) — và cả 2 đều nằm trong top điểm.

**Với TravelFrame** (trỏ knowledge):
- P-009 (loss-aversion hook) đã được thêm vào KB từ kênh này — bằng chứng số: hook
  dạng này gắn với 2/2 bài viral; nhưng cẩn thận: hook chỉ là 1 trong N yếu tố thuật toán.
- P-010 (save-first): bài save-first đạt 126× — đáng thử nghiệm đặt save-prompt đầu caption.
- CTA thiếu là điểm yếu hệ thống của kênh này (10/12 = 0 điểm CTA) — ngược lại là
  lợi thế sẵn có của TravelFrame (V-04/P-006/P-007).
- Caption craft kém + typo ("Asai", "k ow") vẫn viral → reach không đòi hỏi craft cao,
  NHƯNG brand dài hạn của TravelFrame cần craft (giọng V-01/V-02 là tài sản).

## Spot-check
2/2 post fetch được, caption + likes + comments khớp (kể cả typo nguyên trạng) →
dữ liệu JSON đáng tin. Chi tiết: spot-check.md.

## Caveats (bắt buộc)
- Kênh 1,216 followers — ER 0.58% chỉ là hướng; so kênh bằng engagement tuyệt đối
  và cấu trúc nội dung, KHÔNG so ER với kênh lớn.
- Sample 12 (<30) — xu hướng chỉ dẫn, không phải kết luận thống kê.
- Followers snapshot tại scrape (2026-09-13), không phải tại từng thời điểm post.
- Chưa có phân tích hình → production cận dưới; hook chỉ chấm được phần caption,
  chưa chấm 3 giây đầu video thật.
- Viral 219×/126× là tương quan với hook, KHÔNG chứng minh nhân quả (thuật toán,
  thời điểm, chủ đề đều đóng góp).

## Run artifacts
metrics.json · scores-rater-a.json · scores-rater-b.json · scores.json (100% resolved)
spot-check.md (checked 2/2) · digest.md (cấp kênh) · learning run: knowledge/runs/2026-09-13-host-themikeytravel/
