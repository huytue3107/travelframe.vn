---
title: "Top-1 Keyword Roadmap (OpenSEO)"
owner: Marketing-Growth
status: "Approved plan 2026-10-14 (Rocky duyệt qua chat). Nội dung live vẫn cần duyệt từng bài."
source: "OpenSEO Keyword Research — Oct 13, 2026; GSC 2026-07-11→2026-10-11; audit 63068ce5"
---

# Lộ trình đưa TravelFrame lên top 1 cho các từ khoá OpenSEO đã nghiên cứu

## Bối cảnh

Rocky muốn một kế hoạch đưa travelframe.sidevn.com lên **top 1 Google** cho các từ khoá tốt nhất trong báo cáo OpenSEO "Keyword Research — Oct 13, 2026" (US/en). Ngày 13 và 14/10 đã làm xong các việc on-page: trang tiền `/hanoi-photoshoot`, pillar Old Quarter, gộp bài Train Street, 13 link nội bộ, sửa alt và meta theo audit.

**Hiện trạng (Search Console 3 tháng):** 24 truy vấn, 1 click. Chưa có từ khoá mục tiêu nào vào top 10, trừ "santorini park hanoi" (vị trí 4,7). Website vẫn ở subdomain tạm `sidevn.com`.

**Kết luận thẳng:** top 1 làm được với nhóm từ khoá dịch vụ ít cạnh tranh và nhóm long-tail. Với "train street hanoi" (Wikipedia, BBC, Tripadvisor đang chiếm) và "hanoi old quarter" (8.100 lượt/tháng), top 1 trong 6 tháng là không thực tế. Mục tiêu đúng cho hai từ khoá này là **top 3–5 và được Google AI Overview trích nguồn**. Kế hoạch chia từ khoá thành 3 hạng, mỗi hạng một mục tiêu riêng.

Kế hoạch này **thay thế** phần cấu trúc trang của [30-Day-SEO-Execution-Sprint](30-Day-SEO-Execution-Sprint/README.md) (ngày 30/9, trạng thái Review). Bản sprint đó định làm landing riêng cho solo và couple. OpenSEO cho thấy mỗi từ khoá này chỉ khoảng 10 lượt/tháng, nên làm trang riêng sẽ khiến các trang tự tranh nhau. Giữ chúng làm section trong `/hanoi-photoshoot`.

## Bản đồ từ khoá → trang → mục tiêu

| Hạng | Từ khoá (US/tháng, KD) | Trang đích | Mục tiêu 6 tháng |
|---|---|---|---|
| **A: top 1** | hanoi photoshoot (110, 0) · hanoi photographer (20) · photographer in hanoi (20) · hanoi couple photoshoot (10) · private hanoi photo tour | `/hanoi-photoshoot` (node 104) | **#1** organic và vào map pack |
| A | vietnam photographer (170, 0) | Homepage (title/H1) | top 3 → #1 |
| A | santorini park hanoi (đang 4,7) | node 86 | **#1 trong 4–6 tuần** (quick win) |
| **B: top 1 long-tail** | hanoi old quarter night market (210) · hanoi airport to old quarter (140) | 2 bài vệ tinh mới | #1 |
| B | hanoi old quarter map (170) · things to do in hanoi old quarter (110) · attractions (110) | Pillar node 105 (section) | top 3 → #1 |
| B | is hanoi train street open (câu hỏi) | node 71, khối Quick answer | **Featured snippet** |
| **C: top 3–5** | train street hanoi (4.400, 2) | node 71 | top 5 + AI Overview trích nguồn |
| C | hanoi old quarter (8.100, 13) | node 105 | top 10 → top 5 |
| C | hanoi walking tour (90, 7) · hanoi old quarter walking tour (30, CPC $4,40) | 1 tour page hiện có, đổi hướng "Old Quarter photo walk" | top 5 |

Không theo đuổi: "hanoi photo tour" và "hanoi photography tour" (mỗi từ 10 lượt, SERP là tour nhiếp ảnh nhiều ngày, sai intent). "things to do in hanoi" (big publisher chiếm) để sau.

## Các mũi việc (0–5)

### 0. Sửa lỗi nội dung hàng loạt (P0, tuần 1, sửa qua Drupal admin)

Quét ẩn danh 14/10 cho thấy **17 bài `/news`** có cùng một khối cuối bài bị chép nhầm từ bài 48-hour itinerary. Khối này gồm H2 "Turning the Trip Into a Shoot" ("Day 1 morning…") và FAQ H4 "Is 48 hours enough for Hanoi?", "Is this itinerary suitable for solo female travelers?"… Các bài bị ảnh hưởng: St. Joseph's, Tạ Hiện, Ngọc Sơn, Santorini Park, Văn Miếu, Quán Thánh, Chùa Một Cột, Hỏa Lò, Lăng Bác, Bưu điện, Tràng Tiền, Phở Thìn, chả cá Lã Vọng, Huyền Hương, Hương Mai, bánh mì Hội An, Red River Dyke.

Tác hại:
- 17 trang trùng nội dung với nhau;
- FAQ không khớp chủ đề;
- H2→H4 gây ra cảnh báo "heading skip" (đây là lỗi trong body, không phải template);
- Google dễ đánh giá các bài này là nội dung chất lượng thấp, kéo cả site xuống.

**Cách sửa:** xoá khối FAQ sai. Đổi đoạn "Turning the Trip Into a Shoot" thành 1 câu đúng chủ đề, link về `/hanoi-photoshoot`. Sau đó thêm 2–3 FAQ (H3) riêng cho từng địa điểm, với câu trả lời đã xác minh. Làm theo đợt, mỗi đợt có revision log "SEO 14/10 FAQ fix".

### 1. Nền kỹ thuật (developer). Chặn mọi thứ khác nên làm trước, tuần 1–2

1. ~~`<title>` lấy SEO title~~: đã có sẵn (kiểm tra ẩn danh 14/10). Các title còn dài sửa trong field SEO title, không cần developer.
2. JSON-LD: `Service` + `FAQPage` cho node 104 (đã soạn sẵn trong draft money page). `Article` + `FAQPage` + `BreadcrumbList` cho node 71 và 105. `LocalBusiness` sitewide.
3. H1 trang tour bằng tên tour. Heading nhảy cấp ở các bài còn lại (ngoài 17 bài ở mục 0) phần lớn là H4 trong body, sửa qua admin.
4. `?lang=vi`: canonical + hreflang đã có. Chỉ cần theo dõi trong Search Console xem bản vi có bị báo "Duplicate" không.
5. Homepage và `/tours` link sang `/hanoi-photoshoot`. Footer đổi chữ hiển thị số WhatsApp thành 0925148581.
6. **Chuyển domain sang travelframe.vn trước tuần 3 (Rocky đã chốt):**
   - trỏ DNS và cài SSL;
   - 301 từng URL từ sidevn.com, giữ nguyên path;
   - thêm property `travelframe.vn` vào Search Console và dùng Change of Address;
   - cập nhật sitemap, canonical, `url` trong JSON-LD, UTM trong listing kit và key pages trong OpenSEO.

   Chỉ tạo GBP, OTA và backlink **sau khi** domain mới đã chạy. Mình soạn checklist migration (manifest, kiểm tra, rollback theo CLAUDE.md). Developer và Rocky thực hiện DNS.

### 2. Cụm money page (Hạng A), tuần 2–6

- **`/hanoi-photoshoot`:**
  - thay ảnh minh hoạ bằng 9–12 ảnh candid thật đã có consent (theo shot list đã lập);
  - thêm 3–5 review thật, có tên và quốc gia, được khách cho phép;
  - thêm H2 "Photographer in Hanoi" và section couple có anchor `#couples`;
  - thêm meeting point có bản đồ và 1 video ngắn;
  - mục tiêu ≥1.200 từ hữu ích, và không sao chép giá sai lệch với configurator.
- **Homepage:** title và H1 có "Vietnam photographer", và sửa "24–48h" cho khớp configurator (2–3 ngày).
- **Santorini Park (quick win):** cập nhật giá vé, giờ mở, cách đi năm 2026, thêm 3 FAQ, và ghi "Updated October 2026". Phải xác minh thực tế trước khi viết.
- **Tour "Old Quarter photo walk":** chọn 1 tour hiện có gần nhất, Rocky chọn trong 57/58/59. Đổi title thành "Hanoi Old Quarter Walking Tour with Photos" và link chéo với money page.

### 3. Cụm nội dung (Hạng B và C), tuần 2–10, 2–3 bài/tuần (Rocky đã chốt)

**Điều kiện cho mỗi bài:**
- fact-check xong mọi giá, giờ và tuyến;
- có ít nhất 3 ảnh gốc;
- có link về pillar hoặc money page.

Bài nào thiếu ảnh gốc thì lùi lịch, không đăng bằng ảnh stock hay ảnh tải từ mạng xã hội. Thứ tự: 5 bài đầu theo bảng dưới, sau đó khoảng 15–20 bài vệ tinh trong lịch biên tập, mỗi tuần 1 cụm chủ đề (ăn uống, đền chùa, phố, ảnh).

| # | Bài | Từ khoá |
|---|---|---|
| 1 | Hanoi Old Quarter Night Market (giờ, tuyến, ăn gì, mẹo) | night market 210 |
| 2 | Hanoi Airport to Old Quarter (Grab, bus 86, giá 2026) | 140 |
| 3 | Mở rộng pillar 105: Google My Maps tự làm, mỗi điểm 1 ảnh gốc | map 170, things to do, attractions |
| 4 | Train Street (node 71): ảnh gốc, cập nhật trạng thái mỗi tháng kèm ngày, bản đồ | 4.400 + snippet |
| 5 | Hanoi or Ho Chi Minh City? | 590 |
| 6+ | Bài vệ tinh theo [lịch biên tập 8 tuần](../Content/Drafts/2026-10-14-SEO-Editorial-Calendar-8-Weeks.md), mỗi bài link về pillar và money page | long-tail (đo volume trước khi viết) |

Mỗi bài tuân thủ `writing_preferences` (claim phải xác minh, không clickbait) và giữ guardrail Train Street: không bán tour hay chụp ảnh gắn với đường ray.

### 4. Authority off-page. Đòn bẩy chính để lên #1, tuần 3–24

1. **Google Business Profile:** dùng listing kit đã soạn, giúp vào map pack "hanoi photoshoot" (đang có 3 studio áo dài chiếm). Việc của Rocky.
2. **OTA:** Airbnb, GetYourGuide, Tripadvisor, mỗi listing link về website (kit đã có). Việc của Rocky.
3. **Review:** xin review GBP và Tripadvisor từ mọi khách, không gating. Mục tiêu 10 review trong 3 tháng.
4. **Backlink:** chạy skill `openseo:link-prospecting` trên SERP của Hạng A và C để tìm blog du lịch đã link LocalLens, iamlongphoto, jordangassner. Mục tiêu 10–15 link chất lượng trong 6 tháng, qua guest post, đề xuất ảnh có ghi credit, và hợp tác với hostel/khách sạn phố cổ. Không mua link.
5. **Directory:** dùng skill `directory-submissions` cho các danh bạ du lịch và nhiếp ảnh phù hợp.
6. **Cộng đồng:** trả lời thật (không spam link) trên Reddit r/VietNam và r/travel, và forum Tripadvisor Hanoi, ở các thread hỏi về photographer và Train Street.

### 5. Đo lường

- **OpenSEO (đã làm 14/10):**
  - Đã lưu 18 từ khoá US/en, tag `tier:A|B|C` + `page:<slug>`.
  - Đã tạo rank tracker US/en mobile `3e6bc6b8` (manual, chưa thêm từ khoá).
  - **Chi phí:** 1 lần check 18 từ khoá ≈ **162 credit**, mà số dư chỉ còn khoảng 280. Vì vậy không chạy weekly. Đề xuất chỉ check ở tuần 4, 12, 24 (≈ 490 credit, cần nạp thêm). Giữa các mốc dùng Search Console, vì miễn phí.
  - Tracker cũ VN/vi `4b6e421b` trống, giữ nguyên.
- **Mốc đánh giá:** tuần 4, 8, 12, 24, mỗi lần chạy:
  - `get_search_console_performance` (query × page);
  - `get_search_opportunities` (vị trí 4–20);
  - rank tracker.
  Ghi kết quả vào research log của OpenSEO.
- **KPI tuần 12:** Hạng A vào top 3, Santorini Park #1, ≥1 featured snippet, organic ≥150 phiên/tháng.
- **KPI tuần 24:** Hạng A #1, Hạng B ≥3 từ khoá #1, Train Street top 5, organic ≥500 phiên/tháng (khớp `current_goal`).
- **Luật điều chỉnh:** từ khoá nào ở vị trí 4–10 quá 4 tuần thì làm 3 việc: tăng link nội bộ, viết lại title/meta để tăng CTR, và tìm thêm 1 backlink trỏ thẳng trang đó.

## Tài liệu đi kèm

- [Ticket developer](2026-10-14-Developer-SEO-Ticket.md)
- [Checklist chuyển domain](2026-10-14-Domain-Migration-Checklist.md)
- [Lịch biên tập 8 tuần](../Content/Drafts/2026-10-14-SEO-Editorial-Calendar-8-Weeks.md)
- [SEO Fix Log](2026-10-13-SEO-Fix-Log.md) · [Implementation Plan 13/10](2026-10-13-SEO-Implementation-Plan.md)
