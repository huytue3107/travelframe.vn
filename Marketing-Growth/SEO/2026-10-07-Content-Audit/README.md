# TravelFrame Content SEO Audit & Remediation Plan

- **Site:** `travelframe.sidevn.com` (Drupal) · **Ngày quét:** 2026-10-07
- **Owner:** Marketing-Growth (phối hợp Technology-Automation, Data-Analytics, Brand-Strategy)
- **Trạng thái:** Draft. **Chưa sửa gì trên site.** Mọi thay đổi live cần Rocky duyệt.
- **File đi kèm:** `content-inventory.csv` (69 URL: số liệu on-page + cụm + ưu tiên + hành động), `raw-crawl-2026-10-07.psv` (dữ liệu quét gốc).
- **Phương pháp:** kiểm kê node qua admin Drupal (`/admin/content`, 55 node); quét từng URL công khai ở chế độ khách ẩn danh
  (title, meta, H1/H2, số chữ, alt ảnh, canonical, robots, schema, link nội bộ); `robots.txt`, `sitemap.xml`, hreflang;
  GA4 property `552867189` top pages 30 ngày; đối chiếu `30-Day-SEO-Execution-Sprint/` và bộ 1.307 từ khóa ngày 30/09.

---

## 1. Tóm tắt điều hành

**Nền kỹ thuật tốt, nhưng nội dung chưa phục vụ bán hàng.** Toàn bộ 53 URL trong sitemap đều index được (200, canonical đúng,
1 H1, có `Article`/`Service` schema, ảnh lazy-load, hầu hết có alt). Site có **35 bài viết dài 735–1.990 chữ**, đủ cho
top-of-funnel. Vấn đề nằm ở 4 chỗ:

1. **Thiếu trang thương mại:** không có trang nào nhắm `private photographer hanoi`, `hanoi photo tour`, `couple photoshoot hanoi`.
   Spec đã có trong sprint tuần 1 nhưng chưa dựng; `/private-photographer-hanoi` hiện là 404.
2. **Tự cạnh tranh (cannibalization):** 3 cặp bài cùng chủ đề (thuê photographer, 15 photo spots, Train Street).
3. **Rủi ro tin cậy:** `/reviews` và trang chủ hiển thị **4.9★** cùng review có tên khách, trong khi workspace ghi **chưa có booking
   hay testimonial được xác minh**. Trang `/about` chỉ có 45 chữ.
4. **Kết nối nội dung yếu:** mỗi bài chỉ có khoảng 2 link nội bộ trong thân bài. **Cả 35/35 bài** dùng chung CTA "Want to taste it yourself? Book a food tour",
   kể cả bài về nhiếp ảnh và di tích.

**Đánh giá chung:** cần sửa (needs work), không có lỗi chặn index. Hiện chưa có dữ liệu thứ hạng (Search Console chưa nối);
organic Google tháng 10 chỉ 11 session / 2 user.

## 2. Kiểm kê nội dung

| Loại | Số lượng | Tình trạng |
|---|---:|---|
| Bài viết (News) | 35 | 33 bài ≥ 735 chữ; 2 bài mỏng (24 và 78 chữ) |
| Tour | 8 | 7 published (~530–580 chữ), 1 unpublished (`grand-hanoi-ceramic-heritage`) |
| Album | 12 | **Cả 12 URL chuyển hướng về `/gallery`**, không có trang riêng |
| Trang tĩnh | 11 | `/about` 45 chữ, `/guides` 62, `/gallery` 79, `/contact` 106 |
| URL cũ 404 còn traffic | 3 | `/tour/hanoi-pho-tour` (26 views), PDF lead magnet (21 views/16 user), `/news/hoan-kiem-lake-route` |

Cụm chủ đề hiện có (chi tiết trong CSV):

- **C1 Photographer services** (BOFU): 5 bài, chưa có trang dịch vụ đích.
- **C2 Photo spots** (MOFU): 9 bài, gồm 2 cặp trùng.
- **C3 Hanoi travel guide** (TOFU): 12 bài, hub = Complete Hanoi Travel Guide.
- **C4 Food** (TOFU): 8 bài, hub = Honest Street Food Guide.

## 3. Lỗi on-page

| Trang / nhóm | Lỗi | Mức | Cách sửa |
|---|---|---|---|
| `/reviews`, `/` | Hiển thị 4.9★ và review có tên khách, chưa có bằng chứng booking/consent | **Critical** | Xác minh từng review (nguồn, ngày, consent). Không xác minh được thì gỡ và thay bằng "First guests, coming soon" hoặc review nền tảng thật |
| `/news/hanoi-photographer-tour-guide` | 24 chữ; link tới PDF 404 | **Critical** | Upload PDF hoặc dựng thành trang lead magnet đầy đủ; tạm thời noindex |
| `/private-photographer-hanoi` và 2 trang dịch vụ khác | Không tồn tại | **Critical** | Dựng theo spec `Week-1-BOFU-Core-Services/02–04` |
| 3 cặp bài trùng chủ đề | Cannibalization | **High** | Gộp nội dung + 301 (mục 5) |
| 35/35 bài | CTA "Book a food tour" sai ngữ cảnh | **High** | CTA theo cụm: C1/C2 → trang dịch vụ + nhắn tin; C3 → tour liên quan; C4 → food tour |
| Toàn bộ bài | ~2 link nội bộ trong thân bài | **High** | Áp dụng `Tracking-And-Distribution/Internal-Link-Matrix.md`: 3–5 link/bài, link lên hub và trang dịch vụ |
| `/about` | 45 chữ, meta 243 ký tự | **High** | Viết lại: người thật, kinh nghiệm, ảnh guide, cách hoạt động, liên hệ |
| 12 album | Redirect về `/gallery`, không index được | **High** | Mở trang album riêng cho 3–4 album mạnh nhất (couple, pre-wedding, Long Bien, Old Quarter) có mô tả, alt, link tour; album còn lại giữ redirect |
| Bài 21/09 về photographer | Hiển thị giá $75/$130 chưa duyệt | **High** | Gỡ giá hoặc ghi "Indicative" theo rule V-08 sau khi pricing P0 được chốt |
| ~60 trang | Title 64–85 ký tự do hậu tố ` / TravelFrame Vietnam` (22 ký tự) | **Medium** | Đổi hậu tố thành ` / TravelFrame` hoặc bỏ ở bài viết |
| 5 bài | Hậu tố lặp ` / TravelFrame / TravelFrame Vietnam` | **Medium** | Sửa trường SEO title |
| `slow-hanoi-48-hour…` | Title là câu mô tả bị cắt, meta 50 ký tự | **Medium** | Viết title/meta mới |
| 6 bài | Meta quá ngắn (36–56) hoặc quá dài (272–384) | **Medium** | Viết lại 140–160 ký tự |
| 2 bài | Tác giả "Anonymous" | **Medium** | Gán tác giả thật (E-E-A-T) |
| 5 bài | 1–2 ảnh thiếu alt | **Low** | Thêm alt mô tả |
| `quan-thanh-temple…` | "Visiting Tip" | **Low** | "Visiting Tips" |

## 4. Kỹ thuật

| Hạng mục | Trạng thái | Chi tiết |
|---|---|---|
| HTTP / index | Pass | 53/53 URL sitemap trả 200; không có noindex nhầm |
| robots.txt | Pass | `Allow: /` + khai báo sitemap |
| sitemap.xml | Pass | 53 URL, không lọt bản unpublished |
| Canonical | Pass | Tự trỏ đúng |
| H1 | Pass | 1 H1 mỗi trang |
| Schema | Warning | Có `Article`, `Service`, `Organization`; thiếu `BreadcrumbList`, `FAQPage` (/faq), `Person` (guide/tác giả); `Service` chưa có `offers` (chờ giá) |
| Ảnh | Pass/Warning | 31/32 ảnh lazy-load ở trang chủ; 6 ảnh thiếu alt toàn site |
| hreflang | Warning | `vi=/?lang=vi` dùng query param; cần kiểm tra bản tiếng Việt có đủ nội dung cho từng trang không |
| 404 còn traffic | **Fail** | 3 URL cũ cần 301 |
| Domain | **Fail (P0 có sẵn)** | `travelframe.vn` vẫn lỗi DNS; mọi tín hiệu SEO đang dồn vào `sidevn.com`. Chốt domain trước khi đẩy backlink |
| Đo lường | **Fail** | GA4 đang tính cả trang admin (`/travelframe-admin`, `/login`); Search Console chưa nối |
| Core Web Vitals | Chưa đo | Cần PageSpeed/CrUX sau khi nối Search Console |

## 5. Hợp nhất nội dung trùng

| Giữ (đích) | Gộp vào rồi 301 | Lý do chọn đích |
|---|---|---|
| `/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` (02/10, 1.686 chữ) | `…-what-expect-costs-and-locations-2026-guide` (21/09, 822 chữ) | Bài mới dài hơn, không có giá chưa duyệt |
| `/news/15-best-photo-spots-hanoi-local-photographers-field-guide-2026` (21/09) | `…-local-guide-light-timing-and-uncrowded-angles-2026` (02/10) | URL cũ có lượt xem cao hơn; nhận phần ánh sáng/thời điểm từ bài mới |
| `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` | `/news/hanois-train-street-rhythm-time` | Pillar an toàn đúng guardrail V-07/V-09; bài trải nghiệm thành 1 section (**cần Rocky chốt**) |

Độ trùng câu chữ của các cặp chỉ 2–4%, tức là không phải copy. Vấn đề là chúng cùng nhắm một ý định tìm kiếm.
Sau khi gộp: cập nhật mọi link nội bộ trỏ thẳng về URL đích và kiểm tra sitemap.

## 6. Từ khóa mục tiêu → trang

Bộ 1.307 từ khóa (30/09) chỉ có **17 giá trị volume khác nhau**, và độ khó (KD) được gán **cố định theo nhóm**
(cả 295 từ Tier 1 đều KD 18). Đây là số ước lượng theo khuôn, **không dùng để xếp hạng ưu tiên**. Volume và KD dưới đây
chỉ để tham khảo, cần xác nhận lại bằng Search Console và Google Keyword Planner.

| Từ khóa | Intent | Trang đích | Hiện trạng | Ưu tiên |
|---|---|---|---|---|
| private photographer hanoi / in hanoi | Transactional | `/private-photographer-hanoi` (mới) | Trang chưa có | **Cao** |
| hanoi photographer, candid photographer hanoi | Commercial | `/private-photographer-hanoi` | Trang chưa có | **Cao** |
| hanoi photo tour, hanoi photoshoot | Commercial | `/tour/cinematic-hanoi-visual-storytelling-walk` (nâng cấp) | Tour 564 chữ | **Cao** |
| couple photoshoot hanoi, honeymoon photo tour hanoi, pre wedding photoshoot hanoi | Transactional | Trang dịch vụ couple (mới) | Chỉ có bài blog | **Cao** |
| solo traveler photo tour hanoi | Transactional | Trang dịch vụ solo (mới) | Chỉ có bài blog | **Cao** |
| hanoi old quarter photoshoot | Commercial | Album Old Quarter + trang dịch vụ | Album redirect | Trung bình |
| flytographer alternative | Commercial | `/compare/…` (spec 05) | Chưa có | Trung bình |
| best photo spots hanoi | Informational | Pillar 15 photo spots (sau gộp) | 2 bài trùng | Trung bình |
| hanoi train street | Informational | Pillar an toàn (sau gộp) | 2 bài trùng | Trung bình |
| how to cross the street in hanoi | Informational | Bài hiện có | Tốt, sửa meta | Thấp |
| hanoi street food guide | Informational | Hub C4 | Tốt, thêm link | Thấp |

Lưu ý: nhóm "train street photo tour" được gán volume lớn nhất (12.500), nhưng guardrail không cho hứa vào được phố đường tàu.
Chỉ nhắm nhóm này bằng nội dung an toàn, không làm trang bán tour Train Street.

## 7. Đối thủ

**Chưa benchmark trong đợt này.** Không có dữ liệu thứ hạng của TravelFrame lẫn đối thủ (Search Console chưa nối, không có
Ahrefs/Semrush live). Danh sách đối thủ đã có trong sprint: Flytographer, Withlocals, Airbnb Experiences, Viator, Klook, Tubudd,
SweetEscape. Benchmark được đưa vào giai đoạn 5, sau khi có dữ liệu thật.

## 8. Kế hoạch thực hiện

### Giai đoạn 0 — Nền đo lường (ngày 1)
1. Nối Google Search Console cho `travelframe.sidevn.com`, submit sitemap, xuất baseline query/page 28 ngày.
2. Loại trang admin khỏi GA4: không tải gtag cho user đăng nhập hoặc route `/travelframe-admin*`, `/login`, `/admin*`.
3. Chốt domain cuối cùng (`travelframe.vn` vs `sidevn.com`) và ghi kế hoạch 301 toàn site nếu sẽ chuyển.

### Giai đoạn 1 — Quick wins (tuần 1, mỗi việc < 2 giờ)
| # | Việc | Tác động | Phụ thuộc |
|---|---|---|---|
| 1 | Xác minh hoặc gỡ review và 4.9★ | Cao (tin cậy, pháp lý với khách Mỹ) | Rocky cung cấp bằng chứng |
| 2 | 301 ba URL cũ; upload PDF hoặc 301 PDF | Cao | Tech |
| 3 | Noindex tạm 2 bài mỏng cho tới khi mở rộng | Trung bình | — |
| 4 | Đổi CTA theo cụm cho 35 bài (sửa template, không sửa từng bài) | Cao | Tech |
| 5 | Sửa hậu tố title toàn site + 5 title lặp + 6 meta | Trung bình | — |
| 6 | Gán tác giả thật, thêm 6 alt ảnh, sửa typo | Thấp | — |

### Giai đoạn 2 — Hợp nhất (tuần 1–2)
7. Gộp 3 cặp bài theo mục 5, 301, cập nhật link nội bộ.
8. Quyết định album: mở 3–4 trang album portfolio (cần consent người trong ảnh), còn lại giữ redirect.
9. Quyết định tour `grand-hanoi-ceramic-heritage` (publish, gộp vào craft villages, hoặc bỏ).

### Giai đoạn 3 — Trang thương mại (tuần 2–3)
10. Dựng `/private-photographer-hanoi`, trang solo photo walk, trang couple/honeymoon theo spec 02–04.
11. Nâng 7 tour lên ≥ 900 chữ: lịch trình theo giờ, gồm/không gồm, meeting point, ai phù hợp, FAQ, ảnh thật; thêm `offers` khi giá được duyệt.
12. Viết lại `/about`, mở rộng `/guides` (hồ sơ từng guide, `Person` schema), thêm `FAQPage` cho `/faq`.

### Giai đoạn 4 — Liên kết cụm (tuần 3–4)
13. Hub & spoke: trang dịch vụ ← C1/C2; hub C3, hub C4 ← bài địa điểm/quán; mỗi bài 3–5 link nội bộ có anchor mô tả.
14. Thêm `BreadcrumbList` toàn site.

### Giai đoạn 5 — Theo dõi & mở rộng (từ tuần 5)
15. Benchmark đối thủ bằng dữ liệu Search Console + công cụ SEO; dựng trang so sánh (spec 05–06).
16. Lịch refresh: bài có giá, giờ mở cửa, quy định Train Street rà lại mỗi quý.

## 9. KPI theo dõi

| KPI | Baseline (07/10) | Mục tiêu 30 ngày | Mục tiêu 90 ngày |
|---|---:|---:|---:|
| Trang dịch vụ BOFU live | 0 | 3 | 3 + 2 trang so sánh |
| Bài trùng intent | 3 cặp | 0 | 0 |
| Link nội bộ TB/bài (thân bài) | ~2 | ≥ 4 | ≥ 5 |
| URL 404 có traffic | 3 | 0 | 0 |
| Organic sessions/tháng (GA4, đã lọc admin) | 11 (01–07/10) | Đo baseline GSC | ×3 baseline |
| Truy vấn có impression (GSC) | Chưa đo | Có baseline | +50% |
| Từ khóa BOFU vào top 20 | Chưa đo | — | ≥ 3 |

## 10. Quyết định cần Rocky

| # | Quyết định |
|---|---|
| 1 | Review trên `/reviews` và 4.9★ có bằng chứng và consent không? |
| 2 | Duyệt gộp cặp Train Street (mục 5) |
| 3 | Domain cuối cùng và thời điểm chuyển |
| 4 | Cho phép sửa live trên admin theo giai đoạn 1 (ai làm: agent qua trình duyệt hay team tech) |
| 5 | Album nào được mở thành trang portfolio (consent người trong ảnh) |
| 6 | Số phận tour `grand-hanoi-ceramic-heritage` |
