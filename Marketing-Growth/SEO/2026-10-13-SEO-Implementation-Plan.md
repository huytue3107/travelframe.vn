# SEO Implementation Plan, 13/10/2026 (bước 2–6)

*Link trong các draft viết dạng tuyệt đối `https://travelframe.sidevn.com/...` để qua workspace check; khi dán vào Drupal, đổi về đường dẫn tương đối `/...`.*

*Owner: Marketing-Growth · Nguồn: OpenSEO "Keyword Research — Oct 13, 2026" (app.openseo.so, project travelframe.sidevn.com) · Bước 1 (chuyển domain travelframe.vn) nằm ngoài phạm vi theo yêu cầu.*

**Trạng thái (cập nhật 13/10 chiều):** Bước 2, 2b, 3, 4, 5 đã **live**. Chi tiết và phần còn lại ở [SEO Fix Log mục 7](2026-10-13-SEO-Fix-Log.md). Bước 2c (H1 template), JSON-LD, link từ homepage/`/tours` cần developer; bước 6 cần Rocky.

~~Mọi nội dung đang là **Draft**.~~ Cần Rocky duyệt trước khi đưa lên Drupal live (CLAUDE.md: Publish / sửa dữ liệu live cần phê duyệt rõ ràng). Cách thực hiện giống SEO Fix Log 13/10: mỗi lần sửa là một revision mới, revision log bắt đầu bằng "SEO 13/10 OpenSEO".

## Tổng quan

| # | Việc | File | Ai làm | Trạng thái |
|---|---|---|---|---|
| 2 | Tạo trang tiền `/hanoi-photoshoot` | [Draft](../Content/Drafts/2026-10-13-hanoi-photoshoot-money-page.md) | Drupal editor | Draft, chờ duyệt claim giá |
| 2b | Sửa title + mô tả mâu thuẫn trang Cinematic tour | mục A bên dưới | Drupal editor | Chờ duyệt |
| 2c | H1 template tour ("Choose a Hanoi journey") | mục B | Developer theme | Ticket |
| 3 | Gộp Train Street: giữ node 71, retire node 80 + 301 | [Draft](../Content/Drafts/2026-10-13-hanoi-train-street-merge.md) | Drupal editor | Draft |
| 4 | Pillar mới `/news/hanoi-old-quarter-guide` | [Draft](../Content/Drafts/2026-10-13-hanoi-old-quarter-guide.md) | Drupal editor + Creative (map, ảnh) | Draft, cần fact-check |
| 5 | Link nội bộ về `/hanoi-photoshoot` và pillar | mục C | Drupal editor | Chờ bước 2 và 4 publish |
| 6 | GBP + GetYourGuide + Airbnb + Tripadvisor | [Listing kit](../Content/Drafts/2026-10-13-ota-gbp-listing-kit.md) | Rocky (tạo tài khoản) | Draft |

**Thứ tự publish:** 2 → 2b → 3 → 4 → 5 → 6. Link nội bộ chỉ thêm khi trang đích đã live, để tránh link 404.

## A. Trang Cinematic tour: tránh tranh từ khóa với trang tiền

URL: `/tour/cinematic-hanoi-visual-storytelling-walk`

- **SEO title hiện tại:** "Hanoi Photography Tour | Cinematic Street & Portrait Photoshoot | TravelFrame Vietnam". Chứa "Photoshoot" nên sẽ tranh từ khóa với `/hanoi-photoshoot`.
- **Đổi thành:** `The Cinematic Hanoi Photography Tour (3 Hours) | TravelFrame Vietnam`
- **Lỗi nội dung:** mô tả viết "A dedicated **6-hour** photography expedition", nhưng thông tin tour ghi "Duration: **3 hrs**". Sửa mô tả thành "A dedicated 3-hour photography walk…" (hoặc Rocky xác nhận thời lượng đúng).
- Thêm 1 dòng cuối mô tả: "Prefer a shorter or phone-based shoot? See all [Hanoi photoshoot packages](https://travelframe.sidevn.com/hanoi-photoshoot)."

## B. Ticket developer: H1 trang tour

- **Hiện trạng:** cả 7 trang `/tour/*` và `/tours` đều có H1 "Choose a Hanoi journey". Tên tour nằm ở H2 (đã ghi trong SEO Fix Log mục 5).
- **Yêu cầu:** trên trang tour detail, H1 = tên tour (field title). "Choose a Hanoi journey" hạ xuống `<p>` hoặc H2, chỉ giữ H1 cho trang `/tours`.
- **Kiểm tra:** `curl -s <url> | grep -o '<h1[^>]*>.*</h1>'` mỗi trang chỉ ra đúng 1 H1 là tên tour.
- Đồng thời: block "Want to taste it yourself? Book a food tour" đang hiện ở cuối mọi bài `/news/`, kể cả bài Train Street. Nên cho block này đổi theo chủ đề, hoặc tắt được theo từng node.

## C. Link nội bộ

### C1. Về `/hanoi-photoshoot` (sau khi trang tiền live)

Mỗi bài thêm **1 câu, 1 link** với anchor text tự nhiên. Đặt ở đoạn mà người đọc đang nghĩ đến chuyện chụp ảnh; không dồn ở footer.

| Bài | Câu chèn (anchor in đậm) |
|---|---|
| `/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` | "If you'd like us to plan it for you, see our **Hanoi photoshoot packages** with transparent hourly rates." |
| `/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026` | "Ready to plan yours? Here's how a **Hanoi couple photoshoot** with TravelFrame works." |
| `/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing` | "Traveling solo? A relaxed **photoshoot in Hanoi with a local photographer** means real photos of you, not just the streets." |
| `/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` | "Want to be in the photos yourself? Book a **private Hanoi photoshoot** around these spots." |
| `/news/hanoi-sunrise-photography-walk-long-bien-bridge-flower-markets-and-morning-light-2026` | "We can plan a **sunrise photoshoot in Hanoi** around this route." |
| `/news/hanoi-egg-coffee-cafe-giang-photography-guide` | "Make it part of a **Hanoi photo walk**." |
| Homepage | Thêm nút/section "Hanoi photoshoot packages →" `/hanoi-photoshoot` |
| Trang `/tours` | Dòng đầu: "Just want photos? See **photoshoot packages**." |

**Không** thêm vào 2 bài Train Street (guardrail).

### C2. Về pillar `/news/hanoi-old-quarter-guide` (sau khi pillar live)

Danh sách bài vệ tinh ở cuối file draft pillar (10 bài). Câu chuẩn: "See our full **Hanoi Old Quarter guide**."

## D. Kiểm tra sau triển khai

1. `curl -sI` cho các URL mới phải trả `200`, URL node 80 phải trả `301`.
2. Search Console → URL Inspection → Request Indexing cho: `/hanoi-photoshoot`, `/news/hanoi-old-quarter-guide`, node 71, cinematic tour.
3. Sitemap phải có 2 URL mới và không còn URL node 80. Gửi lại sitemap.
4. Schema: dán URL vào Rich Results Test (search.google.com/test/rich-results), phải nhận được `FAQPage` và `Service`.
5. Sau 4 và 8 tuần, chạy lại OpenSEO `get_search_console_performance` để xem impressions của "hanoi photoshoot", "train street hanoi" và "hanoi old quarter".

## E. Rollback

- **Trang mới:** unpublish.
- **Node sửa:** Revisions → Revert về revision trước "SEO 13/10 OpenSEO".
- **Redirect:** xoá trong `/admin/config/search/redirect`.
- **Node 80:** publish lại và đặt lại alias cũ (chi tiết trong file merge).

## F. Việc cần Rocky quyết

1. Duyệt giá và thời gian giao ảnh hiển thị trên trang tiền (lấy theo configurator, vì Pricing đang là Open P0).
2. Thời lượng thật của Cinematic tour: 3 giờ hay 6 giờ.
3. Bỏ hay giữ đoạn café/balcony khi gộp Train Street (đã viết theo hướng "chỉ khi được phép trong ngày").
4. Giá bán trên OTA (cộng hoa hồng) và việc tạo các tài khoản listing.
