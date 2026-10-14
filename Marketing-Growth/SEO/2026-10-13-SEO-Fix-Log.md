# SEO fix log, 13/10/2026

*Owner: Marketing-Growth · Thực hiện trên site live theo yêu cầu của Rocky ("gắn link blog sang tour và sửa các lỗi nhỏ luôn") · Nguồn: `Marketing-Growth/Reports/20261013-travelframe-sidevn-com-seo-audit.html`*

Mọi sửa bài viết đều lưu thành revision mới trong Drupal (revision log bắt đầu bằng "SEO 13/10"). Rollback: Node → Revisions → Revert.

## 1. Link nội bộ blog → tour (28 bài)

Mỗi bài được thêm một đoạn cuối theo mẫu có sẵn của site: `👉 <strong>…</strong> Join our <a href="/tour/…"><strong>Tên tour</strong></a> private tour.`

| Tour | Node bài viết |
|---|---|
| `/tour/spiritual-west-lake-breeze` | 89, 90, 96, 83, 102 |
| `/tour/french-colonial-historical-footsteps` | 81, 85, 103, 101, 67 |
| `/tour/taste-hanoi-culinary-delights-street-vibes` | 65, 69, 82, 97, 100, 98, 99, 43 |
| `/tour/colors-delta-craft-villages-expedition` | 70, 68 |
| `/tour/hanoi-early-bird-sunrise-local-markets` | 88 (95 đã có sẵn) |
| `/tour/cinematic-hanoi-visual-storytelling-walk` | 92, 91, 94, 72 |
| `/tour/hanoi-unfiltered-local-life-documentary` | 42, 84, 93, 73 |

Kiểm tra live: 30/34 bài đang publish có link trong thân bài tới trang tour (trước: 1/37).

Không gắn link, có chủ đích:
- 63 (Complete Hanoi Travel Guide): bài bật "Tự động dịch sang VI". Lưu bài có thể kích hoạt dịch tự động, có thể là API trả phí, cần Rocky xác nhận.
- 71, 80 (Train Street): guardrail không gắn bán tour với phố đường tàu.
- 86 (Santorini Park): ngoài Hà Nội, không khớp tour.

## 2. Meta description và SEO title

| Node | Sửa |
|---|---|
| 93, 94, 95 | Xoá dòng ghi chú đối tượng đọc và từ khoá bị lọt vào meta description, giữ câu đầu |
| 71 | Mô tả mới: "A realistic, safety-focused guide to Hanoi Train Street in 2026: how access works, rules to respect, and alternative railway photo spots." |
| 72 | Mô tả mới (lấy từ summary): "Practical tips for solo female travelers in Hanoi to capture natural, unposed photos while staying safe and comfortable." |
| 73 | Mô tả mới: "A relaxed 48-hour walking itinerary for Hanoi, built around morning walks, historic architecture and the city's local rhythm."; SEO title "Slow Hanoi: A Calm 48-Hour Walking Itinerary" (trước bị cụt "A relaxed, 48-hour walking itinerary…") |

## 3. Bài trùng và bài trống: unpublish + 301

| Node | URL cũ | Redirect 301 tới |
|---|---|---|
| 87 | `/news/hanoi-photographer-tour-guide` (gần như trống) | `/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` |
| 64 | `/news/15-best-photo-spots-hanoi-local-photographers-field-guide-2026` (1.769 chữ) | bài 15 photo spots 2.250 chữ (node 92) |
| 66 | `/news/hiring-private-photographer-hanoi-what-expect-costs-and-locations-2026-guide` (979 chữ) | `/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` (node 91) |

- Bài được unpublish, alias chuyển sang `/archive/…` để giải phóng URL cũ cho redirect. Không xoá node.
- Redirect module tự tạo redirect cũ → `/archive/…` (trả 403); đã xoá 3 redirect tự sinh đó (id 19, 20, 21).
- **Chưa làm:** chép đoạn hay của bài bị gộp sang bài giữ lại. Nội dung cũ vẫn còn trong node 64, 66 (unpublished).
- Link PDF `/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf` trỏ thẳng tới bài 15 photo spots (không qua chuỗi redirect).

Rollback: publish lại node, đặt lại alias cũ, xoá redirect tương ứng trong `/admin/config/search/redirect`.

## 4. Redirect link cũ 404

`/tour/hanoi-pho-tour`, `/tour/food-tour`, `/tour/egg-coffee-tour` → `/tour/taste-hanoi-culinary-delights-street-vibes`; `/news/hoan-kiem-lake-route` → `/news`; `/tour` → `/tours`. Tất cả đã kiểm tra 301.

Đã chạy Clear all caches. Sitemap còn 53 URL.

## 5. Chưa làm được, cần người khác

| Việc | Cần |
|---|---|
| `robots.txt` thêm `Disallow: /travelframe-admin/` và `Disallow: /login` | Quyền hosting (file tĩnh) |
| `www.travelframe.sidevn.com` trả 400 → 301 về `https://travelframe.sidevn.com` | Hosting |
| `travelframe.vn` NXDOMAIN | Quyết định domain + nhà đăng ký tên miền |
| 7 trang tour dùng chung H1 "Choose a Hanoi journey", tên tour nằm ở H2 | Sửa template theme (developer) |
| Drupal security update chưa cài | Người quản lý server |

## 6. Search Console (kiểm tra 13/10, qua Chrome của Rocky)

**Tổng quan:** 75 trang được lập chỉ mục, 47 chưa. 8 lượt nhấp từ Google trong khoảng 3 tháng. Sitemap `/sitemap.xml` đọc thành công lần cuối 11/10 (56 URL); đã gửi lại sitemap 13/10.

**URL Inspection + Request Indexing (đã gửi cả 9 URL, "URL đã được thêm vào hàng đợi ưu tiên"):**

| URL | Trạng thái trước khi gửi |
|---|---|
| `/tour/spiritual-west-lake-breeze` | Đã phát hiện – hiện chưa được lập chỉ mục |
| `/tour/french-colonial-historical-footsteps` | Đã phát hiện – hiện chưa được lập chỉ mục |
| `/tour/taste-hanoi-culinary-delights-street-vibes` | Đã lập chỉ mục |
| `/tour/colors-delta-craft-villages-expedition` | Đã phát hiện – hiện chưa được lập chỉ mục |
| `/tour/hanoi-early-bird-sunrise-local-markets` | Đã lập chỉ mục |
| `/tour/cinematic-hanoi-visual-storytelling-walk` | Đã phát hiện – hiện chưa được lập chỉ mục |
| `/tour/hanoi-unfiltered-local-life-documentary` | Đã phát hiện – hiện chưa được lập chỉ mục |
| `/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` | Đã phát hiện – hiện chưa được lập chỉ mục |
| `/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` | Google không xác định được URL |

**Lý do chưa lập chỉ mục (báo cáo Pages):** Đã phát hiện – chưa lập chỉ mục 31; Lỗi chuyển hướng 5; Trang thay thế có canonical thích hợp 4; Trang có chuyển hướng 3; Đã thu thập – chưa lập chỉ mục 2; Trùng lặp, Google chọn canonical khác 2.

- "Lỗi chuyển hướng" (5 URL `/news/`, `/booking/`, `/about/`, `/gallery/`, `/tours/`): kiểm tra curl hiện chỉ 1 bước 301 về bản không có `/`, bình thường. Google đang xác thực lại ("Đã bắt đầu"). Không cần làm gì.
- **Phát hiện mới, cần quyết định:** bản `?lang=vi` của 36/37 bài blog hiển thị nguyên nội dung tiếng Anh nhưng khai báo `lang="vi"`, canonical tự trỏ về chính nó và có hreflang vi. Google coi các bản này là trùng lặp (ví dụ Hoa Lo, Ta Hien) và phải thu thập gấp đôi số URL. Cách xử lý: (a) dịch thật các bài sang tiếng Việt, hoặc (b) với bài chưa dịch, cho canonical của `?lang=vi` trỏ về bản tiếng Anh và bỏ hreflang vi. Cả hai cần Rocky quyết định; (b) là sửa code theme/module (developer); (a) có thể dùng tính năng "Tự động dịch sang VI" (chưa rõ có tốn phí API không).

Kiểm tra lại sau 7–14 ngày: báo cáo Pages, trạng thái 5 trang tour chưa index.

---

## 7. Đợt 2 (chiều 13/10): triển khai OpenSEO Keyword Research, bước 2–6

*Rocky duyệt trong chat: giá theo booking configurator, Cinematic tour = 3 giờ, cho đăng live. Plan: [2026-10-13-SEO-Implementation-Plan.md](2026-10-13-SEO-Implementation-Plan.md). Revision log bắt đầu bằng "SEO 13/10 OpenSEO".*

| Node | Thay đổi |
|---|---|
| 104 (mới) | Trang tiền `/hanoi-photoshoot` (News, full_html). 4 gói giá theo configurator, FAQ, CTA Instagram/WhatsApp/booking. SEO title "Hanoi Photoshoot & Private Local Photographer". Bảng giá đổi thành danh sách vì bị cắt cột trên mobile. |
| 105 (mới) | Pillar `/news/hanoi-old-quarter-guide` (Travel Tips). Giờ chợ đêm (T6–CN ~18h–23h) và bus 86 (45.000đ) đã kiểm tra 13/10 qua các travel guide; chưa có nguồn chính thức. |
| 53 | Cinematic tour: SEO title "The Cinematic Hanoi Photography Tour (3 Hours)"; summary "6-hour" → "3-hour"; thêm link tới `/hanoi-photoshoot`. |
| 71 | Gộp node 80 vào: title/H1 mới, SEO title "Hanoi Train Street 2026: Is It Open? Safety & Photo Guide", thêm Quick answer, section "What the Street Is Actually Like", 3 FAQ, link tới pillar và 15 photo spots. **Không** có link bán tour/photoshoot (guardrail). Alias giữ nguyên. |
| 80 | Unpublish, alias `/archive/hanois-train-street-rhythm-time`. Redirect id 25 (tự sinh) sửa đích `/node/80` → `/node/71`, 301. |
| 91, 94, 72, 95 | Thêm 1 câu link tới `/hanoi-photoshoot` |
| 92, 43 | Thêm link tới `/hanoi-photoshoot` và tới pillar |
| 42, 84, 85, 96, 69, 97, 65 | Thêm "See our full Hanoi Old Quarter guide." |

Chèn link trước đoạn "👉" cuối bài nếu có, không thì thêm vào cuối bài. Đã Clear all caches.

**Kiểm tra live (curl):** 3 URL mới/sửa trả 200 với title mới và canonical đúng. URL node 80 trả `301` → node 71. Sitemap có 54 URL, gồm 2 URL mới, không còn node 80. Đếm link trên 13 bài: đúng như bảng.

**Chưa làm:**
- JSON-LD `Service` + `FAQPage` cho node 104: CKEditor xoá `<script>`, cần developer thêm qua module/theme. Nội dung JSON trong draft trang tiền.
- Link từ homepage và `/tours` tới `/hanoi-photoshoot`: hai trang này là template theme, cần developer.
- Node 104 chưa có ảnh cover (chưa có ảnh khách đã có consent).
- Request Indexing trong Search Console cho `/hanoi-photoshoot`, `/news/hanoi-old-quarter-guide`, node 71, node 53: cần tài khoản Google của Rocky.
- ~~Alt text ảnh trang Cinematic tour~~ → đã sửa, xem bên dưới.

**Rollback:** node 104/105 unpublish. Các node còn lại: Revisions → Revert revision trước "SEO 13/10 OpenSEO". Node 80: publish lại, alias cũ, sửa redirect 25 về `/node/80` hoặc xoá.

### 7b. Alt text trang Cinematic tour (node 53)

Rocky yêu cầu sửa. Alt mô tả đúng nội dung ảnh (mình đã xem từng ảnh): hero `hero.webp` (nhà thờ Lớn), gallery `guide-1` (chân dung đường phố đen trắng), `news-3` (tranh gốm mosaic), `news-5` (góc phố đêm), `news-4` (đĩa cơm gà rán), `news-6` (lối đi giữa ruộng lúa). Kiểm tra live: alt mới có trong dữ liệu JSON mà theme dùng để render ảnh.

**Cần Rocky xem:** 5/6 ảnh có watermark giấy phép Creative Commons của tác giả khác (`cc-nc`, `cc-nc-sa`, `cc-nc-nd`: không dùng cho mục đích thương mại). Dùng trên trang bán tour có rủi ro bản quyền, và các ảnh này không phải ảnh TravelFrame tự chụp (ảnh cơm gà và ruộng lúa không khớp với tour chụp ảnh phố). Nên thay bằng ảnh tự chụp.

### 7c. Số WhatsApp hiển thị → 0925148581

Rocky yêu cầu. Đây là cùng một số với +84 925 148 581, chỉ đổi cách viết.

- Node 104: chữ hiển thị "WhatsApp +84 925 148 581" → "WhatsApp 0925148581" (có revision). Link `wa.me/84925148581` **giữ nguyên**, vì WhatsApp bắt buộc mã quốc gia và không có số 0 đầu; `wa.me/0925148581` sẽ không mở được chat.
- Draft trang tiền + listing kit: đổi chữ hiển thị. JSON-LD `telephone` giữ `+84925148581` (schema yêu cầu định dạng quốc tế).
- Quét 54 URL sitemap: không node nào khác chứa số này.
- **Cần developer (template theme, không có ô cấu hình trong admin):** footer mọi trang (`+84 925 148 581`), tooltip nút gọi nổi (`+84 925 148 581`), `/booking` (`+84 925 148 581`), `/contact` (`0925 148 581`, có dấu cách). Giữ `href="tel:+84925148581"` và `wa.me/84925148581`, chỉ đổi chữ hiển thị.
- Phát hiện thêm: homepage (TravelFrame settings → process_3_body) ghi "delivered in 24–48h", không khớp configurator (gói máy ảnh giao sau 2–3 ngày). Chưa sửa, chờ Rocky quyết.

## 8. OpenSEO audit 13/10 (63068ce5) → sửa 14/10

Audit: 0 critical. Đã sửa trên Drupal (revision log "SEO 14/10 OpenSEO audit"):

- **Alt text** (4 bài, 5 ảnh): node 67, 68, 69, 86. Alt viết trung tính vì chưa xem từng ảnh; Creative nên rà lại. Node 68 vẫn dùng ảnh `rednotedownloader.com_photos*.jpg` (tải từ mạng xã hội, rủi ro bản quyền, chưa xử lý).
- **Meta description quá dài**: node 91 (166→134), 105 (168→128). Home (162), About (243), Ebooks (178) do theme/Metatag mặc định, chưa sửa được từ form node.
- **SEO title field** rút gọn cho node 53, 67, 68, 69, 71, 86, 104, 105.
- ~~Phát hiện: `<title>` không lấy từ `field_tacos_seo_title`.~~ **Đính chính 14/10:** kết luận này sai, do kiểm tra bằng phiên admin (bản render khi đăng nhập dùng tên node). Khi `curl` ẩn danh, `<title>` = SEO title + " | TravelFrame Vietnam" (vd. node 104 → "Hanoi Photoshoot & Local Photographer | TravelFrame Vietnam", 59 ký tự). Vậy các cảnh báo "title too long" sửa được bằng field SEO title, không cần developer. Canonical + hreflang en/vi/x-default đã có sẵn.
- JSON-LD hiện chỉ có `Article`; `Service`/`FAQPage` vẫn cần developer.
- Chưa làm: heading skip (31 bài, nghi do template), thin content `/about` và `/guides` (cần Rocky quyết định viết thêm hay noindex).
