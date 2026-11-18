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

## 9. Triển khai Competitive Landscape 09/11 (báo cáo OpenSEO bc82f002)

Rocky duyệt qua chat ("oke triển khai đi"). Mọi thay đổi trên Drupal có revision log "SEO 09/11 …" và đã kiểm tra bằng `curl` ẩn danh:

| # | Thay đổi | Kiểm tra |
|---|---|---|
| 1 | Redirect 301 `/news/santorinipark` → `/news/santorini-park-lovely-photo-spot-right-outside-hanoi` (trước đó trả 404 dù còn lượt hiển thị trong Search Console) | 301 + `location` đúng |
| 2 | Node 71 Train Street: thêm đoạn "2026 update (checked 9 November 2026)": Bộ Xây dựng và UBND Hà Nội thống nhất giảm tàu khách, dừng tàu hàng, mốc trước 01/07/2026; nguồn VOV và Vietcetera. Chưa xác nhận đã thực hiện → bài chỉ viết "expect fewer trains" | Đoạn hiển thị |
| 3 | Node 68: sửa tên làng sai "Cam Phu Cau" → **Quang Phu Cau** (title, SEO title/meta, summary, body); thêm dòng vị trí (Ứng Hòa, khoảng 35 km, khoảng 1 giờ đi xe); **giữ URL** cũ (tắt pathauto) | 23 lần "Quang Phu Cau", 0 lần "Cam Phu Cau" |
| 4 | Node 70 Bát Tràng: bỏ hậu tố "\| TravelFrame" bị lặp trong SEO title | `<title>` còn một hậu tố |
| 5 | Đăng node 113 Night Market và node 114 Airport to Old Quarter (định dạng full_html, category Travel Tips, ảnh Pexels có credit) | 200, có trong sitemap, ảnh 3/3, không có H4 |
| 6 | Node 105 pillar: thêm link "Full guide" ở mục night market và mục airport; node 113 thống nhất giờ thành "around 6–7pm until about midnight" cho khớp pillar | Link hiển thị |

Ảnh: 6 ảnh Pexels (tải về `Creative-Production/Assets/Stock/pexels-{30829087,1474233,39657011,20988488,36660890,18008781}.*`, kèm JSON credit), bản web 1.600px upload vào `inline-images/travelframe-pexels-*.jpg`. Thay bằng ảnh gốc khi Creative chụp xong.

**Rollback:** Revisions → revert về revision trước "SEO 09/11" (node 68, 70, 71, 105, 113); unpublish node 113/114; xoá redirect `/news/santorinipark` trong `/admin/config/search/redirect`.

**Còn mở:**
- Node 68 vẫn dùng 2 ảnh `rednotedownloader.com_photos*` (rủi ro bản quyền) và thân bài viết chung chung, cần ảnh gốc và viết lại.
- Drupal báo có bản vá bảo mật chưa cài.
- Chưa Request Indexing trong Search Console cho node 113/114.

## 10. Triển khai lộ trình + link building (09/11, Rocky duyệt qua chat)

| # | Thay đổi | Kiểm tra |
|---|---|---|
| 1 | Đăng node 115 [French Quarter guide](https://travelframe.sidevn.com/news/hanoi-french-quarter-guide) (cụm "french quarter hanoi", 590/tháng) | 200, title 59 ký tự, sitemap, 3 ảnh Pexels |
| 2 | Đăng node 116 [7 Best Day Trips from Hanoi](https://travelframe.sidevn.com/news/day-trips-from-hanoi) (cụm "day trips from hanoi", 720/tháng) | 200, title 56 ký tự, sitemap, 5 ảnh Pexels |
| 3 | Node 68 Quảng Phú Cầu: thay **3** ảnh `rednotedownloader` (trước ghi nhầm là 2) bằng ảnh Pexels có credit; thêm link sang day trips | 0 ảnh rednotedownloader |
| 4 | Tour node 56: sửa "Cam Phu Cau" → "Quang Phu Cau" trong SEO title và description; giữ URL | `<title>` đúng |
| 5 | Link nội bộ: node 81 và 105 → French Quarter; node 70, 86, 68 → day trips | Mỗi trang có 1 link mới |

Kiểm tra link nội bộ trên 2 bài mới: không có link hỏng.

**Link building:** chưa gửi thư nào. Toàn bộ thư, nội dung cho form liên hệ, tin nhắn, bài guest post và hồ sơ directory nằm trong [Backlink Outreach Kit](2026-11-09-Backlink-Outreach-Kit.md) và [tracker](2026-11-09-Backlink-Outreach-Tracker.csv). Gmail connector chưa xác thực nên không tạo được email nháp trong Gmail.

**Rollback:** revert revision "SEO 09/11" của node 56, 68, 70, 81, 86, 105; unpublish node 115/116.

**Còn mở:** node 68 vẫn còn 2 ảnh chưa rõ nguồn (`edcbc5….jpg` và `d4c4a6….jpg` có caption áo dài), và thân bài viết chung chung.

### 10b. Gỡ FAQ 48h chép nhầm (Roadmap mục 0)

Đã gỡ trên 18 node: 81, 82, 83, 85, 88, 89, 90, 96, 97, 98, 99, 100, 101, 102, 103, 106, 107, 108.
- **Phạm vi khối đã gỡ:** H2 "…Turning the Trip Into a Shoot" (câu "Day 1 morning…") cùng H2 "Frequently Asked Questions" và 4 câu hỏi H4 của bài 48h.
- **Nội dung thay thế:** 1 câu CTA về `/hanoi-photoshoot`.
- **Cách làm:** dry-run trước, chỉ áp dụng khi khối có đúng 2 H2 và dưới 3.000 ký tự. Giữ nguyên URL.
- **Kiểm tra:** quét toàn bộ `/news` trong sitemap, chỉ bài 48h gốc (node 73) còn FAQ này.

**Nguồn gây lỗi chưa xử lý:** node 106–108 (đăng 21/10) cũng bị chèn khối này, nên quy trình hoặc template soạn bài đang tự dán vào. Cần kiểm tra template trước khi đăng bài mới.
**Rollback:** revert revision "SEO 09/11 roadmap P0" của từng node.

### 10c. Gửi outreach và báo Google (09/11, yêu cầu trong chat: "bạn gửi đi", "triển khai đi")

- **Đã gửi 6 thư**, từ Gmail `sonbui20020112@gmail.com` (trình duyệt tích hợp), ký "Son / TravelFrame Vietnam":
  - email: Vietnam Coracle, Routinely Nomadic, Hanoi Food, VietAdvisor (guest post pitch), Truly Voyage;
  - form liên hệ: Helena Bradbury.
  - Đã xác nhận cả 6 trong Thư đã gửi hoặc thông báo "Thank you!" của form; chưa thấy thư bị trả lại (bounce).
- **Chỉnh nội dung trước khi gửi:**
  - bỏ câu chưa kiểm chứng ("we often hear from visitors");
  - đổi "first on Google" thành "near the top", vì vị trí #1 trong SERP 09/11 không ổn định.
- **Chưa gửi:**
  - Chris & Wren: form không tải được (lỗi 451);
  - Revitrip: cần nhắn từ tài khoản FB/IG của TravelFrame.
- **Search Console:**
  - Request Indexing cho night market lỗi 2 lần ("Đã xảy ra sự cố… thử lại sau").
  - Đã gửi lại `sitemap.xml` thành công: Google đọc lại ngày 09/11, số trang phát hiện tăng từ 61 lên 65.
- **Follow-up:** 16/11, một lần duy nhất, theo [tracker](2026-11-09-Backlink-Outreach-Tracker.csv).

### 10d. GA4 key events cho KPI inquiry (09/11, Rocky duyệt cả 4 thay đổi trong chat)

Làm trong GA4 Admin (property 552867189), đăng nhập `sonbui20020112@gmail.com` trên trình duyệt tích hợp.

| Thay đổi | Cài đặt | Trạng thái |
|---|---|---|
| `contact_click` → sự kiện chính | Đếm "Một lần mỗi phiên" | Xong |
| `begin_booking` → sự kiện chính | Đếm mặc định | Xong |
| `generate_lead` (sự kiện mới) | Từ `form_submit`, URL chứa `/contact`; sự kiện chính, một lần mỗi phiên, không đặt giá trị | **Đã test 09/11:** có trong GA4 Realtime |
| `purchase` | Giữ nguyên (thanh toán booking thật) | Không đổi |
| Phương diện tuỳ chỉnh (phạm vi sự kiện) | "Contact channel" ← `channel`; "Contact placement" ← `placement` | Xong |

- **Kiểm tra trùng:** GTM `GTM-MKLJQNBG` gửi `contact_click` (kèm channel, placement) và các sự kiện booking (view_tour, begin_booking, booking_step_view, add_to_cart, begin_checkout, purchase). GTM **không** chuyển `generate_lead` mà JS booking đẩy vào dataLayer (luồng bill-only), nên `generate_lead` chỉ đếm form /contact và không bị đếm đôi.
- **Test 09/11 (Rocky duyệt "ok"):** Claude gửi 1 form test (tên "TEST GA4 - Claude", email sonbui20020112@gmail.com, nội dung "please ignore").
  - Form chuyển sang `/contact?sent=1`.
  - GA4 Realtime ghi `form_start` 2, `form_submit` 2, `generate_lead` 2, và `generate_lead` có trong thẻ sự kiện quan trọng.
  - Số 2 chưa rõ lý do: có thể là bản test riêng của Rocky, cũng có thể sự kiện bị bắn đôi. GTM chỉ có 1 Google tag. Báo cáo chuẩn vẫn đếm sự kiện chính 1 lần mỗi phiên.
  - Hộp thư lead có 1 lead TEST, cần bỏ qua hoặc xoá.
- **Lỗi UX phát hiện khi test:** sau khi gửi, trang `/contact?sent=1` không hiện thông báo đã gửi thành công. Khách có thể tưởng form lỗi rồi gửi lại hoặc bỏ đi. Chuyển cho developer: hiện thông báo khi URL có `sent=1`.
- **Còn mở:** dimension chỉ có số liệu từ 09/11 trở đi, sau khoảng 24–48 giờ.
- **Cách đọc KPI:** sự kiện chính `contact_click` + `generate_lead`, lọc phiên `google / organic`. Baseline 4 tuần bắt đầu từ 09/11.
- **Rollback:** GA4 Admin → Sự kiện: bỏ sao `contact_click`/`begin_booking`/`generate_lead`, xoá rule tạo `generate_lead`. Định nghĩa tuỳ chỉnh: lưu trữ 2 dimension.

## 11. Triển khai campaign TF-SEO-20261106 (09/11)

Rocky yêu cầu trong chat: "triển khai campain này giúp tôi". Nguồn: [Master Report](2026-11-06-OpenSEO-Campaign-Execution-Master-Report.md), mục 5. Rocky đã trả lời 3 câu hỏi trong chat:
- bảng giá: "Chờ developer";
- title/H1: "Giữ title, đổi H1";
- bản đồ: "Làm bản nháp ngay".

Thao tác qua trình duyệt tích hợp (phiên admin Drupal), revision log bắt đầu bằng "SEO 09/11 campaign TF-SEO-20261106". Đã kiểm tra lại bằng `curl` ẩn danh.

| # | Thay đổi | Kiểm tra |
|---|---|---|
| 1 | Node 104 `/hanoi-photoshoot`: đổi H1 (tên node) thành "Hanoi Photographer & Walking Photoshoot: Local Guide & Candid Packages". **Giữ** SEO title "Hanoi Photoshoot & Local Photographer". Lý do: dùng công thức của báo cáo làm title sẽ dài 92 ký tự và mất cụm "hanoi photoshoot". Pathauto vẫn tắt, alias giữ nguyên | 200; H1 mới; `<title>` 59 ký tự không đổi; canonical không đổi |
| 2 | Node 92 (15 photo spots): thêm 1 đoạn trước H2 "Want to Explore These Spots Without Camera Stress?". Đoạn này có link spoke tới `/news/santorini-park-lovely-photo-spot-right-outside-hanoi`, anchor "Santorini Park Hanoi" (Cụm 3, mục 2). **Tắt pathauto** để khoá alias hiện tại | 200; có đúng 1 link Santorini; URL bài và URL đích đều 200 |

**Ngoài Drupal:**
- OpenSEO: lưu `ao dai photoshoot hanoi`, `vacation photographer hanoi`, `hanoi solo travel` (không tốn credit, chưa gắn tag, thị trường mặc định của project là VN/vi).
- Ticket developer: thêm [D10](2026-10-14-Developer-SEO-Ticket.md), đổi configurator giá sang $30/$60/$99.
- Bản nháp bản đồ đi bộ: [`Creative-Production/Projects/Hanoi-Old-Quarter-Walking-Map/`](../../Creative-Production/Projects/Hanoi-Old-Quarter-Walking-Map/README.md). Chưa upload.

**Không làm, có chủ đích:**
- Bảng giá $30/$60/$99 trên node 104: chờ developer làm D10, tránh hai mức giá khác nhau giữa các trang. Meta description node 104 vẫn ghi "from 8 USD/hour"; sẽ sửa cùng bảng giá.
- Redirect Santorini (đã làm ở mục 9).
- CTA Pillar/15 điểm → `/hanoi-photoshoot` (đã có từ mục 7).
- Chuyển domain: Rocky dời sang Q1/2027.

**Rollback:**
- Node 104 và 92: Revisions → revert về revision trước "SEO 09/11 campaign".
- Node 92: bật lại pathauto chỉ khi chắc chắn alias sinh ra trùng alias hiện tại.
- OpenSEO: `remove_saved_keywords` với 3 từ khoá trên.

### 11b. Đăng bản đồ đi bộ Phố Cổ (10/11, Rocky duyệt trong chat: "Duyệt, upload")

| # | Thay đổi | Kiểm tra |
|---|---|---|
| 1 | Node 105 (Pillar): upload `TravelFrame-Hanoi-Old-Quarter-Walking-Map.pdf` vào `field_downloadable_pdf` (fid 898, `public://guides`). Rocky chọn file trong form, vì trình duyệt không cho agent chọn file | PDF 200 `application/pdf`, 431.978 byte; SHA-256 khớp file local; trạng thái Permanent |
| 2 | Node 105: thêm 1 câu giới thiệu và nút "Download the free Old Quarter walking map (PDF, 1 page, A4)" ở cuối mục "A simple mental map of the Old Quarter". Nút cùng kiểu với node 117. Revision log "SEO 10/11 campaign TF-SEO-20261106…". Alias giữ nguyên (pathauto tắt) | Trang 200; canonical đúng; nút có đúng link PDF; không có markup admin |

- **Không đổi:** đoạn "Map tip" hiện có (khuyên dùng bản đồ offline trên điện thoại).
- **Chưa làm:** nhúng ảnh xem trước bản đồ vào bài. Nguồn file và việc còn mở: [README dự án](../../Creative-Production/Projects/Hanoi-Old-Quarter-Walking-Map/README.md).
- **Rollback:** revert node 105 về revision trước "SEO 10/11 campaign". Xoá fid 898 ở `/admin/content/files` khi file không còn được dùng.

## 12. SEO Audit 14/11 (OpenSEO 87eb8f5b), đề xuất 2: link từ Train Street sang trang dịch vụ (14/11, Rocky duyệt "Thêm link")

| # | Thay đổi | Kiểm tra |
|---|---|---|
| 1 | Node 71 (Train Street 2026), mục "A Better Hanoi Photo Plan": thêm 1 câu sau đoạn "TravelFrame's working approach…": "If you would like photos of yourself in Hanoi, our private photo walk through the Old Quarter follows the same approach, well away from the tracks." Link `/hanoi-photoshoot` đặt trên cụm "photo walk through the Old Quarter". Body Basic HTML, chỉ chèn 196 ký tự (SHA-256 mã nguồn trước `fd9a077e…31d9`, sau `c66b36df…1831`). Revision log "Audit 14/11 rec 2: …", lưu 17:43 ICT | Trang công khai 200, `x-drupal-cache: MISS`, last-modified 10:44:10 GMT; có câu mới và 1 link `/hanoi-photoshoot` (200); title, canonical, meta description không đổi; 1 H1 |

- Lần bấm Save đầu tiên bị hỏng vì chuyển trang ngay sau khi bấm. Lần đó không tạo revision và site không đổi. Lần lưu thứ hai thành công.
- **Rollback:** revert node 71 về revision 327 (12/11).
- **Chưa làm:**
  - Đợt nhắn nhắc outreach ngày 16/11, phần còn lại của đề xuất 2.
  - Google đọc trang lúc 17:36 ICT, trước khi thêm link. Chưa gửi yêu cầu đọc lại.
- **Ghi nhận, chưa xử lý:** site có 2 album mang tên Train Street, là node 119 "Hanoi Train Street – A Romantic Local Experience" và node 51 "Night in Hanoi Train Street". Cần Rocky xem 2 album này có trái quy định không quảng bá chụp ảnh trên đường ray không.

## 13. Redirect 4 URL /hanoi-photoshoot/* đang 404 (16/11, Rocky duyệt "check sửa")

- Phát hiện: GA4 ngày 15/11 ghi 4 lượt xem "Page not found" ở /hanoi-photoshoot/ao-dai, /couple-proposal, /family, /pre-wedding. Drupal dblog: cùng 4 URL bị gọi trong cùng 1 giây lúc 10:45 ICT 15/11 (không referrer) và 11:26 ICT 16/11 (referrer /news/vietnam-photoshoot). Không có link nội bộ nào tới 4 URL này (đã kiểm HTML trang chủ, /hanoi-photoshoot, /news/vietnam-photoshoot, các bài áo dài/couple/fashion, sitemap). Nhiều khả năng do một công cụ/trình duyệt tự đoán URL con, không phải khách bấm link hỏng.
- Đã thêm trong /admin/config/search/redirect (phiên admin, trình duyệt tích hợp):

| Từ | Đến | Mã |
|---|---|---|
| /hanoi-photoshoot/ao-dai | /news/ao-dai-photoshoot-hanoi | 301 |
| /hanoi-photoshoot/couple-proposal | /news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026 | 302 |
| /hanoi-photoshoot/family | /hanoi-photoshoot | 302 |
| /hanoi-photoshoot/pre-wedding | /hanoi-photoshoot | 302 |

- 302 cho 3 URL vì có thể làm trang riêng sau (bài family đang là Draft trong Content/Drafts/2026-11-14-family-photoshoot-hanoi). Khi đăng trang riêng thì đổi đích và chuyển sang 301.
- Kiểm tra ẩn danh bằng curl 16/11: ao-dai 301, ba URL còn lại 302, đều về đúng đích.
- Rollback: xoá 4 dòng trên trong /admin/config/search/redirect.

## 14. Kiểm tra GA4 ngày 08/11 = 0 phiên (16/11, chỉ đọc)

- GA4 Admin → Lịch sử thay đổi 17/10–16/11: chỉ có 7 thay đổi, tất cả lúc 22:04–22:10 ngày 09/11 (key event, generate_lead, 2 custom dimension). Không có data filter, xoá dữ liệu hay đổi stream quanh 08/11.
- GTM GTM-MKLJQNBG: phiên bản live là v8, xuất bản 14/10; không có phiên bản mới nào sau đó.
- Measurement health (OpenSEO): 1 web stream G-0GJGLH771Q, 0 lỗi chẩn đoán.
- Page performance theo ngày 06–10/11: ngày 08/11 không có dòng nào, kể cả hostname 127.0.0.1 và trang admin. 07/11 có 6 phiên, 09/11 có 15.
- Snippet GTM trên site chỉ tải gtm.js khi người xem tương tác (pointerdown/touchstart/keydown/scroll/wheel/mousemove) hoặc sau khi trang load xong một khoảng chờ; người mở trang rồi thoát ngay sẽ không được tính.
- Kết luận: không tìm thấy thay đổi cấu hình nào làm mất dữ liệu. Ngày 08/11 là Chủ nhật, team không vào admin, traffic thật đầu tháng 11 rất thấp (4–6 phiên/ngày), nên 0 phiên có thể là thật hoặc do vài lượt xem ngắn bị snippet trì hoãn bỏ sót. Drupal dblog chỉ còn log từ 09/11 nên không đối chiếu được lượt truy cập máy chủ ngày 08/11.

## 15. Thử chặn bản `?lang=vi` chưa dịch (16/11, Rocky duyệt "triển khai")

- Kiểm tra ẩn danh: 11 trang chính có bản `?lang=vi` giống hệt bản tiếng Anh nhưng khai `<html lang="vi">`, canonical tự trỏ về `?lang=vi` và có `hreflang="vi"`. Metatag (Content) đặt canonical = `[node:url]`, nên thẻ `?lang=vi` do code theme/module tuỳ biến in ra.
- Thử redirect 301 `/news/new-years-eve-hanoi?lang=vi` → `/news/new-years-eve-hanoi` bằng module Redirect, rồi Clear all caches. Không có tác dụng: trang vẫn trả 200, kể cả khi đăng nhập (không qua page cache). Đã xoá redirect này (id 44), 4 redirect `/hanoi-photoshoot/*` ở mục 13 vẫn chạy.
- Đã "Clear all caches" một lần lúc khoảng 13:55 ICT 16/11.
- Cách sửa đúng nằm trong code: ticket developer D14 (đã nâng ưu tiên, kèm bằng chứng ChatGPT).

## 16. SEO Audit 18/11: cụm làng hương (18/11, Rocky "Làm những việc này đi")

Nguồn: [báo cáo audit 18/11](2026-11-18-TravelFrame-SEO-Audit/SEO-Audit.html), sửa nhỏ số 1 và mục "Nên tập trung vào đâu trước". Sửa trong form `/node/X/edit` của trình duyệt tích hợp (phiên `admin` có sẵn). Mỗi node: thay chuỗi trên `getData()`, kiểm tra chuỗi gốc khớp đúng 1 lần và phần còn lại không đổi, rồi `setData` và Save. Lưu từ 20:51 đến 20:52 ICT.

| # | Node | Thay đổi | Kiểm tra trên trang live |
|---|---|---|---|
| 1 | 139 `/news/incense-village-photoshoot-hanoi` (Full HTML) | Đổi H2 "How an incense village photoshoot works" thành "How an incense village tour and photoshoot works". Thêm trước đoạn "Directions, fees and etiquette…": thời lượng (khoảng nửa ngày, xe khoảng 1 giờ mỗi chiều, chụp từ 1 giờ với Basic, từ 2 giờ với Premium/VIP); bảng 3 gói 30/60/99 USD/giờ, tối đa 2 khách, nội dung từng gói theo DEC-20261021, dùng đúng câu đã đăng ở node 68; giao ảnh gốc 24 giờ, ảnh sửa và video 48 giờ; "These rates are for digital photos."; câu về xe giống node 68 ("We confirm the car, the hours and the total in writing before you book") kèm mời hỏi qua Instagram @travelframe.vn | H2 mới hiện đúng; 3 dòng "USD per hour"; có câu Instagram. Ảnh 9→9, H3 9→9, link 17→18 |
| 2 | 68 `/news/cam-phu-cau-incense-village-photography-guide` (Basic HTML) | Sau đoạn đầu mục "A photoshoot at the incense village": `See it in practice: Harry's incense village photoshoot` → `/news/incense-village-photoshoot-hanoi` | Link hiện trong bài; ngoài câu mới, mã nguồn không đổi |
| 3 | 138 `/news/vietnam-photoshoot` (Full HTML) | Mục "4. Incense village day trip", sau dòng "Read more": cùng câu và link như trên, theo mẫu "See it in practice" của mục 5 | Link hiện trong bài; ngoài câu mới, mã nguồn không đổi |

- **Không làm:** thay 3 ảnh Pexels ở node 68. Ảnh gốc làng hương duy nhất đã có consent là Fin 05 (một chân dung, đã ở node 139). 16 ảnh Harry trong `viktor-travelframe/05-Incense-Village-Photoshoot/` chưa ghi nhận consent của người trong ảnh. 6 ảnh Fin còn lại mang nhãn Google AI nên không dùng. Chờ Rocky.
- **Giá xe đi làng:** chưa có giá được duyệt nên bài không ghi số tiền. DEC-20261021 ghi taxi do khách trả.
- **Rollback:** node 139 revert về revision 371 (gallery 18/11 14:50 ICT); node 68 revert về 353 (15/11); node 138 revert về 358 (15/11).
- **Kiểm tra khách (curl, không đăng nhập), khoảng 20:58 ICT:** cả 3 trang HTTP 200, canonical đúng, không gặp màn chặn bot. Node 139 có H2 mới, 3 dòng "USD per hour" và câu Instagram; node 68 và 138 có link tới node 139.
- **Search Console, 20:53–20:58 ICT:** URL Inspection báo node 139 "URL không nằm trên Google: Google không xác định được URL". Kiểm tra trực tiếp lúc 20:56: "Google có thể lập chỉ mục URL này". Bấm Yêu cầu lập chỉ mục 3 lần, cả 3 đều không thành công: lần 1 không có thông báo nào; lần 2 và 3 báo "Rất tiếc! Đã xảy ra sự cố… Chúng tôi gặp sự cố khi gửi yêu cầu lập chỉ mục của bạn. Vui lòng thử lại sau." **Chưa gửi được.** Thử lại vào ngày 19/11. Không gửi Bing (cần Rocky duyệt riêng).

### 16b. Node 68: thay 3 ảnh Pexels bằng ảnh Harry (18/11, 21:34 ICT)

Rocky xác nhận trong chat ngày 18/11/2026: "Đã có consent" (người trong ảnh làng hương của Harry đồng ý), sau đó yêu cầu thay ảnh. Ảnh lấy từ CDN Instagram của các bài Harry đăng (`@harry_pham.sidevn`). File tải về trùng từng byte (SHA-256) với file local trong `Marketing-Growth/Content/viktor-travelframe/05-Incense-Village-Photoshoot/`. Trang site tự resize bằng canvas về 1080×1440 JPEG rồi tải lên `/ckeditor5/upload-image/basic_html` (HTTP 201). Không tìm thấy dấu hiệu AI (C2PA, "Made with Google AI") trong 16 file. Ảnh tải từ Instagram đã bị xoá metadata, nên điều này chưa phải bằng chứng chắc chắn.

| Mục trong node 68 | Ảnh cũ (Pexels) | Ảnh mới | File local (SHA-256 đầu) → file trên site |
|---|---|---|---|
| What the village makes | 28305453, Vietnam Hidden Light | Bó hương dựng đứng phơi trên sân | `3980912395498550383_3980912157096460444.jpg` (`048fc3a7…`) → `quang-phu-cau-incense-bundles-harry-pham.jpg`, uuid `b4dd8e3c…`, 335.916 byte |
| Fees and etiquette | 27951070, HONG SON | Nón lá trên bó hương, cạnh ghế tre | `3980912395498550383_3980912193351983524.jpg` (`d3fbaa06…`) → `quang-phu-cau-conical-hat-stool-harry-pham.jpg`, uuid `fc48a2ad…`, 365.842 byte |
| The overhead pattern | 6712917, Quang Nguyen Vinh | Chụp từ trên cao, mẫu váy đen trên lối đi giữa các hàng hương | `3978671107305633311_3978670859156965949.jpg` (`f0e05781…`) → `quang-phu-cau-overhead-path-harry-pham.jpg`, uuid `d0ec76bd…`, 392.894 byte |

- Credit mỗi ảnh: "Photo: Harry Pham / 102 Koncept", link về bài Instagram gốc (`Dc_Crtfo_Rv`, `Dc3FErND_Yf`). Alt mô tả đúng nội dung từng ảnh.
- Kiểm tra: mã nguồn sau `setData` trùng bản dự kiến; trang live (curl, không đăng nhập) HTTP 200, canonical đúng, 3 ảnh mới HTTP 200 `image/jpeg`, 3 credit Harry, 0 chữ "pexels"; trình duyệt giải mã đủ 3 ảnh 1080×1440.
- Không đổi: ảnh bìa (Main image) của node 68 là file `2026-09/60a4b8ae….webp`, alt "Nguyen Minh Tuan - Quang Phu Cau Incense Village", không thuộc 3 ảnh Pexels.
- Các file Pexels cũ vẫn ở trên site vì node 139 và node 138 còn dùng.
- **Rollback:** revert node 68 về revision 373 (bản có link sang node 139, trước khi thay ảnh).
