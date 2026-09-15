# Spot-check — kênh @nasa (run 2026-09-12-run1)

- Trạng thái: **partial** (1/3 post fetch được — 2/3 bị login wall của Instagram)
- Phương pháp: WebFetch URL thật của 3 post (top 1-2 rel_er + bottom 1); so caption +
  bậc độ lớn số. NGÀY CHẠY: 2026-09-12. Metrics snapshot: mtime của instagram-posts.json.

## Kết quả

| shortCode | rel_er | Fetched | Caption | Likes (bậc độ lớn) | Ghi chú |
|---|---|---|---|---|---|
| DcOX3hWFiey | 3.633 | ✓ | **match** | **match** — "565.7K" trên trang vs 564,892 JSON (lệch ~0.1%) | comments "4.2K" vs 4,208 cũng khớp |
| Db9IVmrDvQ4 | 15.62 | ✗ | unknown | unknown | IG trả shell "Instagram" (login wall / JS-required), thử `?hl=en` vẫn vậy |
| Dc4u1yKPj_s | 0.275 | ✗ | unknown | unknown | cùng lý do login wall |

## Kết luận

- **1/3 post xác minh được SỐ THẬT**: caption khớp nguyên nội dung, likes JSON
  564,892 ≈ hiển thị 565.7K (sai lệch ~0.1% do IG cập nhật like sau snapshot) →
  dữ liệu JSON ĐÁNG TIN cho kênh này tại thời điểm snapshot.
- 2/3 không fetch được (login wall) — **không phải bằng chứng sai**, chỉ là không
  kiểm được. Ghi `spot_check: partial`.
- Không có mismatch nào bị phát hiện; không tự bịa số nào.
