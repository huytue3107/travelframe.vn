---
title: Phương án điều chỉnh — đồng bộ giá DEC 21/10 trên toàn site
owner: Marketing-Growth
status: Published (13/11, xem Adjustment-Publication.md)
created: 2026-11-13
pricing_source: Executive/DEC-20261021-HOURLY-TIER-PRICING.md
related: Brief.md, Publication.md, Marketing-Growth/SEO/2026-10-14-Developer-SEO-Ticket.md
---

# Vấn đề

Từ 13/11, /hanoi-photoshoot hiện giá đã duyệt: Basic 30, Premium 60, VIP 99 USD/giờ. Nhiều chỗ khác trên site vẫn hiện giá hoặc điều khoản cũ, nên khách thấy hai mức giá khác nhau. Mọi số liệu dưới đây đọc trực tiếp ngày 13/11/2026 (quét 77 URL sitemap, đọc admin ở chế độ chỉ xem). Chưa sửa gì ngoài node 104.

# Hiện trạng

| Nơi | Đang hiện | Sửa ở đâu | Cần dev? |
|---|---|---|---|
| /hanoi-photoshoot | Giá DEC, giao 24h/48h | Đã xong 13/11 | Không |
| Custom Tour builder (/tours → Booking) | Giá = gói tour + gói ảnh × số giờ + điểm thêm + xe. Gói ảnh: Explorer 30, Plus 50, Complete 75 USD/giờ (VIP 80 đang tắt). Gói tour: Experience 30 (1h, 1 khách), Standard 50 (2h, 1–2), Plus 100 (4h, 1–3), Family 60 (2h30, 3–5). Điểm thêm +10 đến +20 USD mỗi điểm | Travelframe admin → Catalog → Gói hình ảnh / Gói tour & luật ("Sửa ở đây cập nhật ngay trang booking — không cần đụng code") | Giá: không. Tối thiểu giờ theo tầng và phụ thu khách thứ 3: có |
| 7 trang tour | Giá cố định theo người, "From 50–250 $ / person". Booking từ tour lấy giá tour (đã kiểm: tour 53 ra 150 $, tour 58 ra 250 $) | Field "Giá (USD)" trên từng node tour | Không |
| /faq | Câu 9: "Photo Phone: Within 1 hour. Explorer: Within 2 days. Complete and VIP: Within 3 days." Câu 3: "20% deposit is required" | Travelframe admin → Câu hỏi thường gặp (FAQ), câu 3 và câu 9 | Không |
| Trang chủ, meta | "…no deposit. From $50 — book on WhatsApp." | TravelFrame settings → Default SEO description | Không |
| Trang chủ, dải cam kết | "Pay once agreed / no deposit, no pressure" | Viết cứng trong template (`trust-item`), không có trong admin | Có |
| Template | Khối "Want to taste it yourself?" và breadcrumb "News" trên node 104; JSON-LD dạng Article | Theme | Có (ticket D8, D18, D2) |

Ví dụ lệch giá trong builder: 2 giờ, Standard + Explorer = 50 + 30×2 = **110 USD**, trong khi Basic 2h theo DEC là **60 USD**. Standard + Complete = 50 + 75×2 = **200 USD**, trong khi Premium 2h là **120 USD**.

Phạm vi ảnh hưởng: không tour nào gắn gói ảnh (cả 7 tour: gói ảnh = none). Tour 53, 59 gắn gói tour Standard, tour 57 gắn Plus, nhưng giá booking của tour vẫn lấy từ giá tour. Vì vậy sửa catalog chủ yếu đổi giá của Custom Tour và nút "Customize this tour".

# Rocky cần quyết

| # | Câu hỏi | Đề xuất |
|---|---|---|
| Q1 | 7 tour (ẩm thực, tâm linh, làng nghề, Cinematic, Early Bird, Unfiltered, French Colonial) giữ là sản phẩm riêng với giá theo người, hay chuyển các photo walk sang tầng × giờ? | Giữ là sản phẩm riêng. DEC 21/10 chỉ định giá cho photoshoot theo giờ và bỏ cách tính "giá tour + giá ảnh" trong builder, không nói về tour cố định |
| Q2 | Đặt cọc: FAQ ghi "20% deposit", trang chủ ghi "no deposit", DEC ghi chưa chốt | Tới khi chốt, dùng một câu trung lập ở mọi nơi: "We confirm the price and how to pay in writing before your session." Bỏ cả "20%" lẫn "no deposit" |
| Q3 | Đưa giá DEC vào Custom Tour builder ngay bằng catalog (gần đúng), hay chờ dev làm đúng D10? | Làm ngay bằng catalog (phương án A dưới đây). Hai luật còn thiếu xử lý tạm bằng giới hạn cấu hình và báo giá qua WhatsApp |

# Phương án A cho Custom Tour builder (chỉ sửa catalog, không code)

Builder đang tính tiền theo công thức "giá gói ảnh × số giờ". Đặt giá gói ảnh bằng giá tầng và đưa các khoản cộng thêm về 0, thì tổng tiền thành tầng × giờ, đúng như DEC.

**Gói hình ảnh** (giữ ID để không mất liên kết):

| ID | Hiện tại | Đổi thành |
|---|---|---|
| 1 | Explorer, 780.000 đ / 30 USD | Basic, 780.000 đ / 30 USD. Tính năng: 1 khu; toàn bộ ảnh gốc trong 24h; 10–15 ảnh chỉnh sửa mỗi giờ trong 48h |
| 4 | Plus, 1.300.000 đ / 50 USD | Premium, 1.560.000 đ / 60 USD, đánh dấu Most popular. Tính năng: như Basic; 2–3 khu; trang điểm nhẹ; video recap ≤60s; 1 polaroid; 20 ảnh chỉnh sửa mỗi giờ |
| 2 | Complete, 1.950.000 đ / 75 USD (Most popular) | VIP, 2.570.000 đ / 99 USD. Tính năng: như Premium; trang phục; video 2–3 phút; 5 polaroid; 30 ảnh chỉnh sửa mỗi giờ |
| 3 | VIP, 2.080.000 đ / 80 USD, tắt | Giữ tắt |

**Gói tour & luật:**

| ID | Hiện tại | Đổi thành | Lý do |
|---|---|---|---|
| 1 | Experience 1h, 1 khách, 30 USD | Tắt | Premium và VIP tối thiểu 2h. Builder không chặn được theo tầng, nên bỏ lựa chọn 1h. Basic 1h vẫn bán qua IG/WhatsApp và đã ghi trên /hanoi-photoshoot |
| 2 | Standard 2h, 1–2 khách, 50 USD | Standard 2h, 1–2 khách, **0 USD** | Giá đã nằm trong giá giờ của tầng |
| 3 | Plus 4h, 1–3 khách, 100 USD | Plus 4h, **1–2** khách, **0 USD** | DEC bao gồm tối đa 2 khách. Phụ thu khách thứ 3 chưa làm được trong builder |
| 4 | Family 2h30, 3–5 khách, 60 USD | Tắt | Nhóm từ 3 khách cần phụ thu +15 USD/giờ/khách; báo giá qua WhatsApp |

Luật điểm thêm (Standard, Plus): giữ phần cộng thêm thời gian, đưa giá cộng thêm về 0. Thêm điểm sẽ thêm giờ, và tiền tăng theo giá giờ của tầng. Phụ phí xe giữ nguyên (DEC: taxi giữa các khu do khách trả).

**Giá kỳ vọng sau khi sửa** (0 điểm thêm): Standard 2h ra Basic 60, Premium 120, VIP 198 USD. Plus 4h ra Basic 120, Premium 240, VIP 396 USD.

**Còn thiếu, cần dev (D10):** chặn tối thiểu giờ theo tầng ngay trong builder; phụ thu +15 USD/giờ từ khách thứ 3; đổi nhãn "Tour package / Photo package" sang "Hours / Tier". Khi D10 xong, bật lại lựa chọn 1h cho Basic và nhóm 3–5 khách.

**Rủi ro:** tour 53, 57, 59 gắn gói Standard hoặc Plus. Giá booking của các tour này lấy từ giá tour, nhưng nút "Customize this tour" có thể tính theo gói. Kiểm tra ngay sau khi sửa (bước 4 bên dưới).

# Các bước (sau khi Rocky trả lời Q1–Q3)

1. **Lưu bản trước khi sửa:** chụp toàn bộ giá trị form của 4 gói ảnh, 4 gói tour, mục FAQ liên quan và Default SEO description vào `Catalog-Snapshot-Before.json` trong thư mục này.
2. **Nội dung, rủi ro thấp:** sửa FAQ (giao ảnh: "All original photos within 24 hours. Edited photos and video within 48 hours."; đặt cọc theo Q2). Sửa meta trang chủ, ví dụ "Private photo walks in Hanoi with a local guide who is also your photographer. Candid photos and keepsake video from 30 USD/hour. Book on WhatsApp." (≤160 ký tự). Dải "Pay once agreed / no deposit" trên trang chủ nằm trong template, nên chuyển cho dev theo Q2.
3. **Catalog:** sửa theo phương án A.
4. **Kiểm tra trên site thật, không bấm Booking:** Custom Tour × 3 tầng × Standard và Plus phải ra đúng bảng "Giá kỳ vọng". Booking tour 53, 57, 59 vẫn ra 150, 160, 250 USD. "Customize this tour" trên tour 53 không ra số vô lý. Lệch chỗ nào thì khôi phục từ snapshot ngay.
5. **Gắn lại link "Build your estimate"** trên /hanoi-photoshoot, trỏ tới Custom Tour.
6. **Quét lại 77 URL:** không còn "Photo Phone", "Explorer:", "210,000 VND", "20% deposit", "no deposit". Ghi `Publication.md` và thêm dòng vào Published-Ledger.

Ước lượng: bước 1–6 mất 1–2 giờ, làm trong CMS bằng phiên admin có sẵn.

# Việc của dev (ticket hiện có)

- **D10 phần còn lại:** tối thiểu giờ theo tầng, phụ thu khách thứ 3, nhãn builder.
- **D8:** khối food CTA trên node 104.
- **D18:** breadcrumb "News" trên node 104.
- **D2:** JSON-LD `Service` dùng giá DEC.
- **Mới, theo Q2:** sửa dải cam kết "Pay once agreed / no deposit, no pressure" trên trang chủ.
- **Thêm mới, cần Rocky xác nhận trước:**
  - Mẫu xác nhận booking ghi địa chỉ "12 Hang Buom, Hoan Kiem", còn trang Contact ghi văn phòng Hoàng Cầu. Cần chốt một địa chỉ chính thức trước khi tạo Google Business Profile, vì tên, địa chỉ và số điện thoại phải giống nhau ở mọi nơi.
  - Admin Drupal đang báo có bản cập nhật bảo mật ("There is a security update available"). Việc này của dev/hosting, độ ưu tiên cao, không phụ thuộc SEO.

# Đo kết quả

- Khoảng 20/11: URL Inspection cho /hanoi-photoshoot phải có ngày crawl sau 13/11.
- Khoảng 11/12: chạy lại SERP "hanoi photoshoot", "photographer in hanoi", "hanoi photographer" (VN/en và US, desktop và mobile, độ sâu 20), so với mốc 13/11.
- GA4: số `contact_click` và `generate_lead` từ google / organic trên /hanoi-photoshoot và /tours, so 4 tuần trước và sau.

# Rollback

- Nội dung và catalog: khôi phục từng giá trị từ `Catalog-Snapshot-Before.json`.
- Node 104: theo `Publication.md`.
