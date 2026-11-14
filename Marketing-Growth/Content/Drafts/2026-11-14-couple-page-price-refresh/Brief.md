---
title: Sửa phần giá bài Couple photoshoot (bản nháp, chưa sửa site)
owner: Marketing-Growth
status: Draft
created: 2026-11-14
page: https://travelframe.sidevn.com/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026
node: chưa xác định (tìm trong CMS theo URL)
pricing_source: Executive/DEC-20261021-HOURLY-TIER-PRICING.md
---

# Mục tiêu

Rocky duyệt phạm vi trong chat 14/11/2026: thay phần giá cũ trong bài Couple bằng bảng giá theo giờ của DEC, bỏ link sang `/booking`, và sửa thêm 4 câu chưa có nguồn (D1–D4, Rocky: Sửa cả D1–D4). Bản nháp này chỉ đổi Body. Chưa sửa gì trên website.

## File

| File | Nội dung |
|---|---|
| [Body.html](Body.html) | Body mới, dán vào field Body (Full HTML) |
| [Current-Live-Body.html](Current-Live-Body.html) | Body đang chạy, đọc ngày 14/11/2026, để rollback. SHA-256 `10f817c70cacd7eeddffe5f9a973838203c8efa8778869fdc628b7c0077cd656` |

SHA-256 của Body.html: `170e1a47df631c2d12accb40b7ce5b178ce4bb223c8530228033369fdf64c125`.

# Thay đổi

| Phần | Đang chạy | Bản nháp |
|---|---|---|
| Tiêu đề mục 5 | 5. Typical Rates & Package Details (2026 Overview) | 5. Rates and What's Included (2026) |
| Giá | Giá thị trường 125–160 USD, không có nguồn | Basic 30, Premium 60, VIP 99 USD/giờ, kèm ví dụ cho cặp đôi: Premium 2h = 120, VIP 2h = 198 USD |
| Bảng gói | Ảnh chụp màn hình Table 1.1 ngày 02/10: 120 phút, 3–4 khu, 50+ ảnh trong 24 giờ, clip 4K | Danh sách HTML theo DEC, cùng câu chữ với /hanoi-photoshoot: 2–3 khu, 20 hoặc 30 ảnh chỉnh sửa/giờ, ảnh gốc 24h, ảnh chỉnh sửa và video 48h |
| Không gồm | Không có | Taxi giữa các khu và vé |
| Link | Câu Booking Configurator trong mục 5 và dòng 👉 Check Live Date Availability trỏ `/booking` | Bỏ cả hai; thêm link `/hanoi-photoshoot` trong mục 5 |
| D1–D4 | Xem bảng dưới | Đã sửa, xem cột Đã sửa thành |
| Giữ nguyên | | Toàn bộ phần còn lại, gồm ảnh, mục 2–4, phần kết, link /tours, link Cinematic Hanoi |

Ảnh `Screenshot 2026-10-02 at 15.54.34.png` không còn được dùng trong bài. Không xoá file trên server.

# Sửa thêm D1–D4 (Rocky duyệt, chat 14/11/2026)

Đã áp dụng vào Body.html.

| # | Câu đang chạy | Vấn đề | Đã sửa thành |
|---|---|---|---|
| D1 | Mục 1: which is true in roughly 80% of the couples we host | Chưa có số liệu; tracker ghi 0 booking | Bỏ mệnh đề: If one of you is naturally camera-shy, a traditional photoshoot feels like a chore. |
| D2 | Mục 6: Most camera-shy partners tell us afterward, That was actually really fun. | Giống lời khách nhưng không có nguồn | Bỏ câu này |
| D3 | Mục 6: we provide clear umbrellas… we offer free rescheduling | Chưa có chính sách thời tiết và huỷ (Open P0) | If it drizzles, we move to covered colonnades and cafés. If it pours, we look at another time during your stay with you. |
| D4 | Mục 6: Changing clothes… wastes 20 to 30 minutes | Mâu thuẫn với VIP có outfit; số phút không có nguồn | For a 2-hour walk, one comfortable outfit is easiest. On VIP an outfit is included, and we plan a café stop to change. |

# Các bước đăng (sau khi Rocky duyệt)

1. CMS: mở node của bài theo URL, dán Body.html vào Body (Full HTML). Không đổi URL alias, title, meta description.
2. Lưu, xoá cache.
3. Kiểm tra public, không đăng nhập: HTTP 200; không còn chuỗi 125, 160, Booking Configurator, `/booking`, Table 1.1, 80%, free rescheduling, 20 to 30 minutes; có đủ 3 dòng Basic, Premium, VIP; link `/hanoi-photoshoot` trả 200; 2 ảnh còn lại trả 200.
4. Search Console: Request Indexing cho URL bài.

# Rollback

Dán lại [Current-Live-Body.html](Current-Live-Body.html) vào Body, lưu, xoá cache.

# Kiểm tra bản nháp (14/11/2026)

- Chỉ mục 5, dòng link `/booking` cuối bài và 4 câu D1–D4 thay đổi. Đối chiếu số lần xuất hiện trước và sau: 125 USD 1→0, 160 USD 1→0, Booking Configurator 2→0, `/booking` 1→0, ảnh Table 1.1 1→0, 80% 1→0, That was actually really fun 1→0, free rescheduling 1→0, 20 to 30 minutes 1→0. Chữ umbrellas còn 1 lần ở mục 1 (no light umbrellas, nói về đồ nghề), giữ nguyên.
- Giá, quyền lợi, thời gian giao và phần không gồm khớp DEC và câu chữ trên /hanoi-photoshoot (Published 13/11). VND quy đổi theo 1 USD = 26.000đ như file chi tiết.
- `check_draft.py` không áp dụng: đây là bản vá HTML cho bài đang chạy, chỉ thay phần giá và 4 câu D1–D4.
- Chưa kiểm tra bản render trong theme thật của Drupal.
