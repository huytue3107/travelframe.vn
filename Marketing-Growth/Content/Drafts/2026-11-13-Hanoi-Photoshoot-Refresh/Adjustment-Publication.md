---
title: Đồng bộ giá DEC 21/10 trên site — publication record
owner: Marketing-Growth
status: Published
published_date: 2026-11-13
timezone: Asia/Ho_Chi_Minh
plan: Adjustment-Plan.md
rollback_snapshot: Catalog-Snapshot-Before.json
---

# Phê duyệt

Rocky trả lời "Theo đề xuất" cho Q1–Q3 trong [Adjustment-Plan.md](Adjustment-Plan.md) (chat, 13/11/2026):

- Q1: giữ 7 tour là sản phẩm riêng, giá theo người như cũ.
- Q2: dùng câu trung lập về thanh toán; bỏ cả "20% deposit" lẫn "no deposit".
- Q3: đưa giá DEC vào Custom Tour builder ngay bằng catalog (phương án A).

# Đã sửa (khoảng 12:35–13:05 ICT, phiên admin có sẵn trong built-in browser)

| Nơi | Trước | Sau |
|---|---|---|
| FAQ câu 3 (EN, VI) | "20% deposit is required. …" | "We confirm your package, the final price and how to pay in writing before your session. …" (bản VI tương ứng) |
| FAQ câu 9 (EN, VI) | Photo Phone 1 giờ / Explorer 2 ngày / Complete và VIP 3 ngày | Ảnh gốc trong 24 giờ; ảnh chỉnh sửa và video trong 48 giờ; giữ câu về link chia sẻ |
| Meta trang chủ (TravelFrame settings) | "…keepsake video, no deposit. From $50 — book on WhatsApp." | "…keepsake video from 30 USD/hour. Book on WhatsApp." (145 ký tự). Không gửi mail thử |
| Gói hình ảnh 1 | Explorer, 30 USD | Basic, 780.000 đ / 30 USD, tính năng theo DEC |
| Gói hình ảnh 4 | Plus, 50 USD | Premium, 1.560.000 đ / 60 USD, Most popular |
| Gói hình ảnh 2 | Complete, 75 USD, Most popular | VIP, 2.570.000 đ / 99 USD |
| Gói hình ảnh 3 | VIP cũ, 80 USD, tắt | Không đổi (vẫn tắt) |
| Gói tour 1 Experience | 1h, 1 khách, 30 USD, đang bán | Tắt |
| Gói tour 2 Standard | 2h, 1–2 khách, 50 USD; điểm thêm +10/+15 USD | 0 USD; điểm thêm 0 USD, vẫn cộng thời gian |
| Gói tour 3 Plus | 4h, 1–3 khách, 100 USD; điểm thêm +10/+15 USD | 0 USD; 1–2 khách; điểm thêm 0 USD, vẫn cộng thời gian |
| Gói tour 4 Family | 2h30, 3–5 khách, 60 USD, đang bán | Tắt |
| Node 104 /hanoi-photoshoot | Không có link estimate | Thêm 2 link "Build an estimate" tới `/tours#dtpc-card` (dưới bảng giá và trong FAQ "How do I book?"); [Body.html](Body.html) cập nhật theo |
| SEO description tour 53, 54, 57, 59 | "… From $150, no deposit." (và tương tự với $50, $160, $250) | Bỏ ", no deposit". Giá giữ nguyên |

Giá trị cũ của FAQ, meta trang chủ và hai catalog nằm trong [Catalog-Snapshot-Before.json](Catalog-Snapshot-Before.json). Đã đối chiếu SHA-256 với dữ liệu đọc trong trình duyệt: phần catalog và settings khớp từng byte, phần FAQ khớp sau khi sắp xếp key. SEO description cũ của 4 tour:

- 53: "A 3-hour cinematic photo walk through Hanoi: documentary street portraits and visual storytelling with a photographer-guide. From $150, no deposit."
- 54: "Eat your way through Hanoi's street-food legends after dark while your guide photographs it all. 3-hour food & night photo tour from $50, no deposit."
- 57: "5-hour sunrise photo tour: Long Bien Bridge at dawn, Dong Xuan Market and Hanoi waking up, shot by your guide-photographer. From $160, no deposit."
- 59: "6-hour calm photo tour: West Lake, Quan Thanh Temple and Ba Dinh's leafy boulevards with a local photographer-guide. From $250, no deposit."

# Kiểm tra trên site thật (không bấm Booking)

- Custom Tour builder (/tours): Standard 2h ra Basic 60 / Premium 120 / VIP 198 USD; Plus 4h ra 120 / 240 / 396 USD. Đúng 6/6 tổ hợp so với bảng kỳ vọng. Price details hiện "Tour package Standard: Free · Photo package Basic 30 $/h × 2 h = 60 $ · Total 60 $".
- Điểm thêm hiển thị "+Free/place · +20 min". Chưa thử tổ hợp vượt số điểm đã bao gồm, vì click tự động chỉ chọn được 2 điểm.
- Booking từ tour không đổi: tour 53 ra 150 USD, 57 ra 160 USD, 59 ra 250 USD.
- "Customize this tour" trên tour 53: Standard 2h + Premium = 120 USD.
- /faq (EN và `?lang=vi`): không còn "Photo Phone", "20% deposit", "cọc trước 20%"; có "within 24 hours" và "within 48 hours".
- Trang chủ: meta description và og:description đúng câu mới, `x-drupal-cache: MISS`.
- /hanoi-photoshoot: 2 link `/tours#dtpc-card`, 9 ảnh, giá 30/60/99.
- Quét lại 77 URL sitemap cùng 3 bản `?lang=vi` (/faq, /hanoi-photoshoot, trang chủ): không còn "Photo Phone", "Explorer", "210,000 VND", "20% deposit", "From $50", "within 2/3 days". Chuỗi "no deposit" chỉ còn 1 chỗ: dải cam kết trên trang chủ, nằm trong template.

# Còn lại

- **Dev (ticket):** dải "Pay once agreed / no deposit, no pressure" trên trang chủ (D19); tối thiểu giờ theo tầng, phụ thu khách thứ 3, nhãn "Free" của gói tour trong builder (D10); D8, D18, D2 như trước.
- **Lỗi dữ liệu có sẵn:** phụ phí xe gói Standard đã sửa lúc 14:45 (xem mục bên dưới). Gói Family (đang tắt) còn dòng ô tô 6 chỗ đảo cột: 60 đ / 1.560.000 USD. Sửa trước khi bật lại gói này.
- `/tours?lang=vi` không hiện bản đồ và builder ("Chưa có hành trình nào để hiển thị trên bản đồ", H1 "Digital Tour"). Lỗi này có từ trước, audit 27/10 đã ghi (126 từ). Không liên quan tới lần sửa catalog.
- Gói hình ảnh 3 (VIP cũ, tắt) trùng tên "VIP" với gói 2 trong danh sách admin. Không ảnh hưởng khách vì gói 3 đang tắt.
- Basic 1 giờ và nhóm từ 3 khách hiện không đặt được trong builder. Khách liên hệ qua IG/WhatsApp.

# Sửa thêm: phụ phí xe gói Standard (14:45 ICT)

Rocky trả lời "Sửa luôn" (chat, 13/11/2026). Chỉ sửa 3 ô trong form gói tour 2 Standard; giá trị cũ nằm trong Catalog-Snapshot-Before.json (`tour.2`).

| Dòng xe | Trước (VND / USD) | Sau (VND / USD) |
|---|---|---|
| Ô tô 4 chỗ (row 3) | 40 / 1.040.000 | 1.040.000 / 40 |
| Xe máy (row 2) | 390.001 / 15 | 390.000 / 15 |

Kiểm tra:

- Mở lại form sau khi lưu: đúng 3 ô trên; giá gói, luật điểm thêm, số khách và trạng thái giữ nguyên như sau đợt 13:05.
- Builder /tours (Standard 2h + Premium, 2 khách, không bấm Booking): đi bộ 120 USD; xe máy "+15 $", tổng 135 USD; ô tô 4 chỗ "+40 $", tổng 160 USD. Price details hiện "Transport: Motorbike … 15 $ · Total 135 $".
- Cột VND chỉ kiểm được trong form admin. Builder trên /tours chỉ hiện USD, còn bản tiếng Việt của trang không có builder.

# Rollback

Khôi phục từng giá trị trong Catalog-Snapshot-Before.json qua các form admin tương ứng. Với 4 tour, dán lại SEO description cũ ở trên. Với node 104, revert revision "add Custom Tour estimate links" trong tab Revisions.
