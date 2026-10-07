# Seed Comment Tracker — hướng dẫn

- File dữ liệu: `Seed-Comment-Tracker.csv` (mở bằng Excel/Numbers/Google Sheets, mỗi bài 1 dòng / mỗi nền tảng)
- Áp dụng: Facebook + Instagram (không áp dụng Threads)
- Quy trình gốc: [Seed Comment Playbook](../Marketing-Growth/Guidelines/2026-10-07-Seed-Comment-Playbook.md)
- Thử nghiệm: 2026-10-08 → 2026-10-21 · Đánh giá: 2026-10-22

## Cách ghi

| Cột | Ghi gì | Khi nào |
|---|---|---|
| post_date | YYYY-MM-DD | Lúc đăng |
| platform | `FB` hoặc `IG` | Lúc đăng |
| post_url | Link bài | Lúc đăng |
| content_group | `A-tips` · `B-train` · `C-food` · `D-places` · `E-words` · `F-photo` | Lúc đăng |
| keyword | SAFE / TRAIN / FOOD / MAP / WORDS / PHOTO | Lúc đăng |
| c1_variant / c2_variant | Mã template, ví dụ `A-C1-3`, `A-C2-1` (xem playbook) | Lúc đăng |
| c1_text | Câu C1 đã đăng (sau khi điền biến) | Lúc đăng |
| c1_minutes_after_publish / c2_minutes_after_publish | Số phút sau khi đăng bài | Lúc đăng |
| c1_pinned | Y / N | Lúc đăng |
| reach_48h, comments_48h | Từ Business Suite / IG Insights | Sau 48 giờ |
| replies_to_c1 | Số trả lời trực tiếp dưới C1 | Sau 48 giờ |
| keyword_comments | Số comment chứa keyword | Sau 48 giờ |
| dm_with_travel_date | Số DM từ keyword có nói ngày/tháng đi | Sau 48 giờ |
| dm_with_price_question | Số DM hỏi giá/đặt lịch | Sau 48 giờ |
| booking_ref | Mã booking nếu có (từ Sales-CRM) | Khi phát sinh |

Không ghi tên hay thông tin cá nhân của người comment vào file này.

## Chỉ số đánh giá

| Chỉ số | Công thức | Baseline (08/09–06/10, FB) | Mục tiêu |
|---|---|---|---|
| Comment / 1.000 reach | comments_48h ÷ reach_48h × 1.000 | ~1,0 | ≥ 2,0 |
| Tỷ lệ C1 có reply | số bài có replies_to_c1 ≥ 1 ÷ tổng bài | chưa đo | ≥ 50% |
| Keyword / 1.000 reach | keyword_comments ÷ reach_48h × 1.000 | chưa đo | ghi nhận |
| DM chất lượng | dm_with_travel_date + dm_with_price_question | chưa đo | ghi nhận |

## Quy tắc ra quyết định ngày 22/10

1. Biến thể C1 có ≥3 lần dùng: giữ biến thể có replies_to_c1 trung bình cao nhất trong mỗi nhóm; bỏ biến thể thấp nhất.
2. So sánh FB và IG riêng — không cộng gộp.
3. Ít hơn 3 lần dùng: chưa kết luận, chạy tiếp.
4. Báo cáo lưu tại `Data-Analytics/Reports/2026-10-22-Seed-Comment-Test-Results.md`.
