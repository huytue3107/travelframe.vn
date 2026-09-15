# Spot-check — kênh @themikeytravels (run 2026-09-13-run1)

- Trạng thái: **checked** (2/2 post fetch được — profile + post pages công khai, không login wall)
- Ngày chạy: 2026-09-13. Số liệu đối chiếu từ metrics.json (snapshot: instagram-posts.json mtime 2026-09-13).

## Kết quả

| shortCode | rel_er | Fetched | Caption | Likes | Comments | Ghi chú |
|---|---|---|---|---|---|---|
| Dcm6tQTsApl | 218.86 | ✓ | **match** — "These simple mistakes can ruin your trip 🇻🇳" | **match** — "1.5K" hiển thị vs 1,513 JSON | **match** — 19 vs 19 (chính xác) | còn thấy comments thật (danie_p3, rosie846754) |
| DdKsxU3pAmr | 0.31 | ✓ | **match** — "These apps saved me in Asai" (giữ nguyên typo "Asai") | **match** — 1 vs 1 | **match** — 0 vs 0 | trang có sign-up prompt nhưng post vẫn đọc được |

## Kết luận

- **2/2 post xác minh được**: caption khớp nguyên văn (kể cả lỗi chính tả), likes +
  comments khớp chính xác hoặc cùng bậc → dữ liệu JSON ĐÁNG TIN cho kênh này tại snapshot.
- Không có mismatch nào. Không tự bịa số nào.
- Ghi chú: typo "Asai" trong caption gốc — digest.md đã trích đúng nguyên trạng.
