---
title: Developer brief — sửa canonical/hreflang cho biến thể ?lang=vi
owner: Marketing-Growth (yêu cầu) · Dev (thực hiện)
status: Review
created: 2026-10-27
priority: P0
site: https://travelframe.sidevn.com (Drupal, source ở máy khác)
evidence: crawl HTML không cookie ngày 27/10/2026 (61 URL sitemap, mỗi URL so với bản ?lang=vi); OpenSEO site audit 27/10
---

# Vấn đề

Mọi trang đều có thêm một bản `?lang=vi`, mở được từ nút **VI** trên header (`<a href="...?lang=vi" hreflang="vi">`). Với **42 trang nội dung chưa có bản dịch tiếng Việt**, bản `?lang=vi` có:

- `<html lang="vi">`, nhưng H1, title, meta description và body là **tiếng Anh y hệt** bản gốc (độ trùng body > 80%).
- `<link rel="canonical">` **trỏ về chính nó** (`...?lang=vi`).
- Bản tiếng Anh khai báo `hreflang="vi"` trỏ tới bản `?lang=vi` này.

Hệ quả:
- Google thấy hai URL cùng nội dung, mỗi URL tự nhận mình là bản chính và gắn sai ngôn ngữ.
- OpenSEO báo 38 trang trùng title và 42 trang trùng meta description.
- GSC đã ghi nhận impression cho các URL `?lang=vi`, ví dụ Quan Thanh ?lang=vi 9 impression ở vị trí 75, Santorini ?lang=vi 8 impression ở vị trí 27,5. Tín hiệu xếp hạng đang bị chia đôi.

# Phân loại trang (27/10/2026)

## A. Có bản dịch VI thật (12 trang): giữ nguyên cặp hreflang

`/`, `/tours`, `/gallery`, `/about`, `/guides`, `/faq`, `/how-it-works`, `/reviews`, `/contact`, `/booking`, `/news`, `/ebooks`

Bản `?lang=vi` có H1 và body tiếng Việt khác bản tiếng Anh. Cách làm hiện tại (canonical tự trỏ, hreflang en/vi/x-default qua lại) là đúng. **Không đổi.**

## B. Không có bản dịch (42 trang): cần sửa

| # | URL (bản EN) |
|---|---|
| 1 | `/news/5-old-quarter-alleys-slow-down` |
| 2 | `/news/hanoi-egg-coffee-cafe-giang-photography-guide` |
| 3 | `/news/complete-hanoi-travel-guide-2026-what-do-eat-and-know-you-arrive` |
| 4 | `/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local` |
| 5 | `/news/imperial-citadel-thang-long-photography-guide` |
| 6 | `/news/cam-phu-cau-incense-village-photography-guide` |
| 7 | `/news/bun-cha-chan-local-culinary-guide` |
| 8 | `/news/bat-trang-pottery-museum-photography-guide` |
| 9 | `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` |
| 10 | `/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing` |
| 11 | `/news/slow-hanoi-48-hour-itinerary-calm-two-day-walking-guide` |
| 12 | `/news/trang-tien-street-hanoi-opera-house-locals-guide` |
| 13 | `/news/pho-thin-lo-duc-hanois-famous-stir-fried-beef-pho` |
| 14 | `/news/temple-literature-what-does-vietnams-first-university-have-offer` |
| 15 | `/news/ta-hien-street-where-hanoi-nights-come-alive` |
| 16 | `/news/st-josephs-cathedral` |
| 17 | `/news/santorini-park-lovely-photo-spot-right-outside-hanoi` |
| 18 | `/news/red-river-dyke-flower-park-hot-spots-photography-camping-and-picnics-hanoi` |
| 19 | `/news/quan-thanh-temple-renowned-historical-and-cultural-relic-hanoi` |
| 20 | `/news/one-pillar-pagoda-one-kind-architectural-work-hanoi` |
| 21 | `/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` |
| 22 | `/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` |
| 23 | `/news/how-cross-street-hanoi-practical-survival-guide-traffic-scooters-and-staying-calm-2026` |
| 24 | `/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026` |
| 25 | `/news/hanoi-sunrise-photography-walk-long-bien-bridge-flower-markets-and-morning-light-2026` |
| 26 | `/news/ngoc-son-temple-renowned-spiritual-and-cultural-symbol-hanoi` |
| 27 | `/news/la-vong-grilled-fish-origins-and-authentic-ways-eat-it` |
| 28 | `/news/huyen-huong-chicken-noodles-soup-one-priciest-chicken-pho-spots-hanoi` |
| 29 | `/news/huong-mai-pho-cuon-preserving-vietnamese-flavors-future` |
| 30 | `/news/hoi-bread-best-banh-mi-world` |
| 31 | `/news/hoa-lo-prison-witness-history-heart-capital` |
| 32 | `/news/ho-chi-minh-mausoleum-heart-vietnamese-nation` |
| 33 | `/news/hanoi-post-office-three-centuries-flowing-through-name` |
| 34 | `/hanoi-photoshoot` |
| 35 | `/news/hanoi-old-quarter-guide` |
| 36 | `/news/hanoi-moi-newspaper-hidden-hanoi-photo-spot` |
| 37 | `/news/hanoi-flag-tower-historic-symbol-capital-city` |
| 38 | `/news/hang-ma-street-cultural-breath-heart-capital` |
| 39 | `/news/hanoi-street-style-photoshoot-harry-hanna` |
| 40 | `/news/hanoi-old-quarter-photoshoot-harry-thin` |
| 41 | `/news/hanoi-night-photoshoot-harry-wuchr` |
| 42 | `/news/hanoi-photography-tips-etiquette` |

## C. Trang tour (7 trang): dịch dở và sai H1

| # | URL |
|---|---|
| 1 | `/tour/cinematic-hanoi-visual-storytelling-walk` |
| 2 | `/tour/taste-hanoi-culinary-delights-street-vibes` |
| 3 | `/tour/hanoi-unfiltered-local-life-documentary` |
| 4 | `/tour/colors-delta-craft-villages-expedition` |
| 5 | `/tour/hanoi-early-bird-sunrise-local-markets` |
| 6 | `/tour/french-colonial-historical-footsteps` |
| 7 | `/tour/spiritual-west-lake-breeze` |

- Bản EN **không** khai báo hreflang vi; điều này hợp lý.
- Bản `?lang=vi` vẫn trả 200, tự canonical, H1 đầu tiên là **"Chọn hành trình Hà Nội"** (H1 của trang danh sách tour), tên tour vẫn tiếng Anh nằm ở heading sau. Ví dụ `/tour/spiritual-west-lake-breeze?lang=vi`.
- Riêng `/tours?lang=vi` có H1 là **"Digital Tour"**, không khớp nội dung trang.

# Yêu cầu sửa

**R1 — Trang nhóm B và C (không có bản dịch hoàn chỉnh):**
1. Bản `?lang=vi` xuất `<link rel="canonical" href="[URL tiếng Anh, không có query]">`.
2. Bỏ `<link rel="alternate" hreflang="vi">` trên cả bản EN lẫn bản `?lang=vi`. Giữ `hreflang="en"` và `x-default` trỏ URL tiếng Anh, hoặc bỏ hẳn hreflang cho các node chỉ có một ngôn ngữ.
3. Nút **VI** trên các trang này: hoặc ẩn, hoặc giữ cho người dùng nhưng thêm `rel="nofollow"` và bỏ thuộc tính `hreflang` trên thẻ `<a>`.
4. Không trả `<html lang="vi">` khi nội dung chính là tiếng Anh. Nếu vẫn dịch khung giao diện thì đặt `lang="vi"` trên phần khung, còn `<article>` mang `lang="en"`.

Cách thay thế cho mục 1 nếu khó làm theo từng node: thêm `<meta name="robots" content="noindex, follow">` cho mọi URL `?lang=vi` của node chưa có bản dịch. Vẫn nên ưu tiên canonical về bản EN vì cách đó dồn tín hiệu.

**R2 — Logic chung:** quyết định "có bản dịch hay không" theo node, ví dụ field `field_tacos_lang`/`field_tacos_source_nid` hoặc tồn tại node VI liên kết. Không quyết định theo route. Bài mới mặc định thuộc nhóm B cho tới khi có node VI.

**R3 — Sửa H1 trang tour và trang /tours bản VI:** H1 phải là tên tour, hoặc "Chọn hành trình Hà Nội" cho trang /tours. Không giữ "Digital Tour".

**R4 (khuyến nghị, cùng đợt):**
- Title trang phân trang `/news?page=N` thêm " – Page N" để hết trùng.
- Thêm `alt` cho ảnh hero ở `/tours` và 7 trang `/tour/*`.

# Không thuộc phạm vi

Không đổi URL alias, sitemap (hiện chỉ chứa URL EN; giữ nguyên), nội dung bài, giá, nhóm A, hay cấu hình tracking.

# Kiểm tra nghiệm thu

Chạy không đăng nhập, trên ít nhất các URL mẫu: `/news/bun-cha-chan-local-culinary-guide`, `/hanoi-photoshoot`, `/news/hanoi-old-quarter-guide`, `/tour/spiritual-west-lake-breeze`, `/` và `/faq`.

| # | Kiểm tra | Kỳ vọng |
|---|---|---|
| 1 | `curl -s URL?lang=vi \| grep canonical` (nhóm B/C) | canonical = URL EN, không có `?lang=vi` |
| 2 | HTML bản EN nhóm B/C | Không có `hreflang="vi"` |
| 3 | `/` và `/faq` (nhóm A) | Không đổi: canonical tự trỏ, có cặp hreflang en/vi/x-default |
| 4 | Nút VI trên bài nhóm B | Ẩn, hoặc có `rel="nofollow"` và không có thuộc tính hreflang |
| 5 | `/tour/spiritual-west-lake-breeze?lang=vi` | Nhóm C theo R1; H1 đúng theo R3 |
| 6 | Bài mới tạo sau khi sửa | Tự động theo nhóm B |
| 7 | OpenSEO Site Audit 100 trang (cấu hình như 27/10) | Duplicate title/meta giảm từ 38/42 xuống ≤ 4 (chỉ còn phân trang nếu chưa làm R4) |
| 8 | Sau 2–4 tuần, GSC Pages | URL `?lang=vi` của nhóm B biến mất dần khỏi danh sách có impression |

# Rollback

Thay đổi chỉ ở tầng template/preprocess (canonical, hreflang, thuộc tính `<a>`, `lang`). Revert commit hoặc tắt patch là đưa site về trạng thái hiện tại. Không có thay đổi dữ liệu node.
