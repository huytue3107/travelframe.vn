---
title: /hanoi-photoshoot refresh — ảnh thật và giá đã duyệt (Published 13/11, xem Publication.md)
owner: Marketing-Growth
status: Published
created: 2026-11-13
updated: 2026-11-13
page: https://travelframe.sidevn.com/hanoi-photoshoot
node: 104
source_report: "OpenSEO SEO Audit — Nov 13, 2026 (report 6fcf6e45-6946-4e52-adef-7c7034977759)"
pricing_source: Executive/DEC-20261021-HOURLY-TIER-PRICING.md
---

# Mục tiêu

Sửa trang dịch vụ duy nhất đang sát trang 1 Google với khách ở Hà Nội ("hanoi photoshoot" VN/en #10 desktop, #11 mobile, 13/11/2026). Trang hiện có 0 ảnh buổi chụp và hiện giá cũ. Bản nháp này chỉ đổi nội dung trang. Chưa sửa gì trên website.

## File

| File | Nội dung |
|---|---|
| [Body.html](Body.html) | Body mới, dán vào field Body (Full HTML) của node 104 |
| [Preview.html](Preview.html) | Bản xem trước có ảnh thật (base href tới site). Header, H1 và lead là bản mô phỏng |
| [Current-Live-Body.html](Current-Live-Body.html) | Body đang chạy, đọc ngày 13/11/2026, để rollback. SHA-256 `e1c9c035e8708849e47ae96fdc0cdc2a4100fa5cac5599f458282b6e08a0f1bd` |

# Thay đổi

| Phần | Đang chạy | Bản nháp |
|---|---|---|
| Ảnh | 0 ảnh buổi chụp (2 ảnh trên trang là logo) | 9 ảnh của Harry, đã có sẵn trên site: 1 hero (Hanna) + mục mới "Recent sessions with Harry" (Hanna 2, Thin 3, Wuchr 3), alt giữ nguyên từ bài case |
| Link case | Không có | Link tới 3 bài Hanna, Thin, Wuchr |
| Bảng giá | Photo Phone 8 / Explorer 20 / Complete 50 / VIP 80 USD/giờ + gói tour Experience/Standard/Plus | Basic 30 (từ 1h) / Premium 60 (từ 2h) / VIP 99 USD/giờ (từ 2h), tối đa 2 khách, +15 USD/giờ từ khách thứ 3, taxi và vé ngoài gói |
| Giao ảnh | 1 giờ / 2 ngày / 3 ngày theo gói | Ảnh gốc 24h; ảnh chỉnh sửa và video 48h (theo DEC) |
| FAQ thời lượng | 2h một khu, 3–4h hai khu | Basic 1h một khu; Premium/VIP từ 2h, 2–3 khu |
| Đánh giá | Không có trên trang | 3 đánh giá (Paul, Lorena, Astrid) + link /reviews |
| Credit ảnh | Không có | "All photos on this page by Harry Pham / 102 Koncept." |
| "Build your estimate" | 3 link tới /booking | Bỏ, vì /booking còn tính giá cũ (xem D1) |
| Giữ nguyên | | Intro, "Why travelers book", "Where we shoot", ghi chú Train Street, "Who it's for", "What to wear", FAQ còn lại |

## Field CMS ngoài Body

| Field | Đang chạy | Đề xuất |
|---|---|---|
| Title / H1 | Private Photoshoot in Hanoi with a Local Photographer | Giữ nguyên |
| Kicker | Hanoi photoshoot | Giữ nguyên |
| Lead / summary | Private, candid photoshoots in Hanoi with a local photographer-guide. Phone or professional-camera packages, priced per hour, with routes planned around the light. | Private, candid photoshoots in Hanoi with a local photographer-guide. Three hourly tiers from 30 USD, with routes planned around the light. |
| Meta description (145 ký tự) | Hire a private photographer in Hanoi for candid vacation photos. Hourly packages from $8, routes planned around the light. No deposit — book on WhatsApp. | Private Hanoi photoshoot with a local photographer-guide. Candid photos on an Old Quarter walk, from 30 USD/hour. Originals in 24h, edits in 48h. |
| og:title | Photographer in Hanoi — Private Photoshoot | Private Photoshoot in Hanoi with a Local Photographer |
| Main image | Trống (trang không có og:image) | `/sites/default/files/2026-10/hanna-long-bien-street-style-02_0.webp` |

JSON-LD (structured data) đang lấy description từ meta description, nên sẽ hết "$8" và "No deposit" khi đổi field này. Cần kiểm tra lại sau khi lưu.

# Quyết định của Rocky (chat, 13/11/2026)

| # | Câu hỏi | Rocky trả lời | Áp dụng vào bản nháp |
|---|---|---|---|
| D1 | Đăng trang trước, hay chờ dev sửa /booking cùng lúc? | "Đăng trước" | Đăng trang trước, đã bỏ link estimate. /booking vẫn ở menu và vẫn hiện giá cũ cho tới khi dev sửa |
| D2 | Premium/VIP: trang điểm và trang phục cho 1 khách hay cả 2? | "gói premium"; khi được hỏi lại: "Giữ trung lập" | Copy giữ trung lập ("light makeup", "an outfit"), không nêu số khách; khớp DEC |
| D3 | Dùng ảnh Hanna, Thin, Wuchr trên trang bán dịch vụ? Credit thế nào? | "có, 102 là của travelframe" | Dùng 9 ảnh. Credit: "All photos on this page by Harry Pham / 102 Koncept." 102 Koncept là thương hiệu của TravelFrame |
| D4 | Có thêm đánh giá khách không? | "oke" | Đã thêm 3 đánh giá vào Body.html. Nguồn (nền tảng, ngày) vẫn chưa được ghi trong workspace |
| D5 | Trang không nói gì về đặt cọc, được không? | "oke" | Giữ nguyên: bỏ "No deposit", FAQ nói giá được xác nhận bằng văn bản |

## Đánh giá đã thêm

Chọn 3 đánh giá trên /reviews không nhắc Train Street (guardrail: không quảng bá chụp ở đường ray). Bỏ Sarah, Benjamin, Luna vì có nhắc Train Street. Trích nguyên văn, ghi tên và quốc gia như trên /reviews: Paul (USA), Lorena (Switzerland), Astrid (Hong Kong). Vị trí: ngay sau dòng credit ảnh, trước "Photoshoot packages".

# Ngoài phạm vi body (ticket dev)

Đã đưa vào [ticket dev](../../../SEO/2026-10-14-Developer-SEO-Ticket.md) ngày 13/11: D8 (khối food CTA trên node 104), D10 (form /booking và trang tour, ưu tiên cao), D18 (breadcrumb), D2 (JSON-LD `Service` phải dùng giá DEC, không dùng JSON giá cũ trong draft 13/10).

- Template News vẫn thêm khối "Want to taste it yourself? / See tours" vào trang dịch vụ. Cần ẩn trên node 104 (vấn đề template đã biết, ghi ở bài Wuchr).
- Breadcrumb "News /" trên trang dịch vụ.
- Structured data đang là `Article`; có thể đổi sang `Service` sau. Ưu tiên thấp.
- Form /booking: đổi sang tầng × số giờ theo DEC (Basic tối thiểu 1h, Premium và VIP tối thiểu 2h, +15 USD/giờ từ khách thứ 3).
- Trang tour "The Cinematic Hanoi" được link từ trang này. Mình chưa kiểm tra giá của trang tour đó.

# Các bước đăng (sau khi Rocky duyệt)

1. Rocky đã trả lời D1 đến D5 và chọn "Đăng ngay" (chat, 13/11/2026). Phạm vi duyệt: sửa node 104 theo Body.html và bảng field CMS ở trên, kiểm tra trang public, gửi Google và Bing index lại.
2. CMS node 104: dán Body.html vào Body (Full HTML); sửa lead, meta description, og:title; đặt Main image. Không đổi URL alias.
3. Lưu, xóa cache.
4. Kiểm tra public, không đăng nhập: HTTP 200; 9/9 ảnh trả 200 và có alt; không còn chuỗi "Photo Phone", "210,000 VND", "from $8", "No deposit" (đừng tìm "8 USD" vì "198 USD" cũng khớp); canonical đúng URL; không có noindex; JSON-LD hết "$8"; mobile 375px không tràn ngang.
5. Search Console: Request Indexing cho /hanoi-photoshoot (Google crawl lần cuối 20/10/2026). Bing: URL Submission.
6. Đo lại khoảng 11/12/2026: "hanoi photoshoot", "photographer in hanoi", "hanoi photographer", VN/en và US, desktop và mobile, độ sâu 20. So với mốc 13/11 trong báo cáo audit.

# Rollback

Dán lại [Current-Live-Body.html](Current-Live-Body.html) vào Body. Khôi phục lead, meta description và og:title theo cột "Đang chạy" ở bảng field CMS. Xóa Main image. Xóa cache.

# Kiểm tra bản nháp (13/11/2026)

- 9/9 đường dẫn ảnh trong Body.html trả HTTP 200 (image/webp hoặc image/jpeg), tổng khoảng 2,4 MB; 8 ảnh lazy-load, hero tải ngay.
- Alt của 9 ảnh khớp đúng alt đang chạy trên 3 bài case.
- 8 link nội bộ trong Body.html trả HTTP 200.
- Giá, số ảnh chỉnh sửa, thời gian giao, tối thiểu giờ và phụ thu khớp DEC-20261021-HOURLY-TIER-PRICING và file chi tiết trong `Brand-Strategy/Offers-Pricing/`. VND quy đổi theo 1 USD = 26.000đ như file chi tiết.
- 3 đánh giá trong Body.html khớp nguyên văn với /reviews (đọc ngày 13/11/2026).
- Chưa kiểm tra bản render trong theme thật của Drupal.
