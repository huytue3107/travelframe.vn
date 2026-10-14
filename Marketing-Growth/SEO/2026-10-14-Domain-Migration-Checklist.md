---
title: "Checklist chuyển domain travelframe.sidevn.com → travelframe.vn"
owner: Marketing-Growth (checklist) · Developer + Rocky (DNS, server)
status: "Draft — Rocky đã chốt làm trước tuần 3 (2026-10-14); cần Rocky duyệt thời điểm cắt"
date: "2026-10-14"
---

# Checklist chuyển domain

**Hiện trạng 14/10:** `travelframe.vn` có nameserver `.vn` nhưng **chưa có bản ghi A/AAAA** (`dig +short travelframe.vn` rỗng), và site chưa phản hồi. Sitemap hiện có 54 URL.

## Manifest

- **Nguồn:** `https://travelframe.sidevn.com/*`
- **Đích:** `https://travelframe.vn/*`, giữ nguyên path và query (`?lang=vi`).
- **Kiểu redirect:** 301 ở mức server (nginx/Apache), từng URL tới đúng URL đó, **không** dồn tất cả về homepage.
- **Bản www:** `www.travelframe.vn` 301 về `travelframe.vn`. Chọn một bản canonical duy nhất.

## Trước khi cắt (T-3 ngày)

1. Trỏ A/AAAA của `travelframe.vn` (và `www`) về server Drupal. Cài SSL (Let's Encrypt).
2. Drupal `settings.php`: thêm `travelframe.vn` vào `trusted_host_patterns`.
3. Tìm link tuyệt đối tới `sidevn.com` trong body. Nhiều bài có link `https://travelframe.sidevn.com/...`, đã thêm ngày 13/10. Chuyển về link tương đối `/...` để không phải phụ thuộc vào redirect.
4. Search Console: thêm property Domain `travelframe.vn` và xác minh bằng TXT DNS.
5. Ghi baseline: số URL đã index của sidevn.com, cùng clicks và impressions 28 ngày (OpenSEO `get_search_console_performance`).

## Ngày cắt (T)

1. Bật 301 server-level từ sidevn.com sang travelframe.vn.
2. Đặt `$base_url` hoặc cấu hình domain chuẩn, để canonical, hreflang và sitemap in ra `travelframe.vn`.
3. Clear all caches.
4. Search Console (property cũ) → Settings → **Change of Address** → `travelframe.vn`.
5. Gửi `https://travelframe.vn/sitemap.xml` trong property mới.
6. Cập nhật:
   - `url` trong JSON-LD;
   - website trên Instagram bio, Facebook Page, GBP và OTA;
   - UTM trong [listing kit](../Content/Drafts/2026-10-13-ota-gbp-listing-kit.md);
   - key pages, competitors và `business_overview` trong OpenSEO project.

## Kiểm tra (T và T+1)

```bash
while read u; do n="${u/travelframe.sidevn.com/travelframe.vn}"; c=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$u"); echo "$c | expect 301 $n"; done < urls.txt
```

Điều kiện pass:
- Mọi dòng là `301` và `redirect_url` bằng đúng URL đích.
- `curl -sI https://travelframe.vn/<path>` trả `200`.
- Canonical trên `travelframe.vn` trỏ chính nó.
- Không có redirect chain: URL cũ đi thẳng 1 bước tới URL mới, kể cả `/news/hanois-train-street-rhythm-time` (redirect cũ trỏ tới node 71).
- Chạy lại OpenSEO `run_site_audit` trên `https://travelframe.vn/`: 0 broken link, 0 redirect chain.

## Theo dõi (T+7, T+28)

- Search Console property mới: số trang đã index tăng dần, không có lỗi "Page with redirect" trên URL mới.
- Clicks và impressions phục hồi về baseline trong 2–6 tuần.

## Rollback

Tắt rule 301 trên server, sau đó bỏ `travelframe.vn` khỏi cấu hình domain chuẩn. Site quay về phục vụ ở sidevn.com như cũ. **Không** huỷ Change of Address trong vòng 180 ngày, trừ khi rollback hẳn.

## Bảng 301 (54 URL trong sitemap 14/10)

| URL cũ | URL mới |
|---|---|
| `/` (sidevn.com) | `https://travelframe.vn/` |
| `/tours` (sidevn.com) | `https://travelframe.vn/tours` |
| `/gallery` (sidevn.com) | `https://travelframe.vn/gallery` |
| `/about` (sidevn.com) | `https://travelframe.vn/about` |
| `/guides` (sidevn.com) | `https://travelframe.vn/guides` |
| `/faq` (sidevn.com) | `https://travelframe.vn/faq` |
| `/how-it-works` (sidevn.com) | `https://travelframe.vn/how-it-works` |
| `/reviews` (sidevn.com) | `https://travelframe.vn/reviews` |
| `/contact` (sidevn.com) | `https://travelframe.vn/contact` |
| `/booking` (sidevn.com) | `https://travelframe.vn/booking` |
| `/news` (sidevn.com) | `https://travelframe.vn/news` |
| `/ebooks` (sidevn.com) | `https://travelframe.vn/ebooks` |
| `/news/5-old-quarter-alleys-slow-down` (sidevn.com) | `https://travelframe.vn/news/5-old-quarter-alleys-slow-down` |
| `/news/hanoi-egg-coffee-cafe-giang-photography-guide` (sidevn.com) | `https://travelframe.vn/news/hanoi-egg-coffee-cafe-giang-photography-guide` |
| `/news/complete-hanoi-travel-guide-2026-what-do-eat-and-know-you-arrive` (sidevn.com) | `https://travelframe.vn/news/complete-hanoi-travel-guide-2026-what-do-eat-and-know-you-arrive` |
| `/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local` (sidevn.com) | `https://travelframe.vn/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local` |
| `/news/imperial-citadel-thang-long-photography-guide` (sidevn.com) | `https://travelframe.vn/news/imperial-citadel-thang-long-photography-guide` |
| `/news/cam-phu-cau-incense-village-photography-guide` (sidevn.com) | `https://travelframe.vn/news/cam-phu-cau-incense-village-photography-guide` |
| `/news/bun-cha-chan-local-culinary-guide` (sidevn.com) | `https://travelframe.vn/news/bun-cha-chan-local-culinary-guide` |
| `/news/bat-trang-pottery-museum-photography-guide` (sidevn.com) | `https://travelframe.vn/news/bat-trang-pottery-museum-photography-guide` |
| `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` (sidevn.com) | `https://travelframe.vn/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` |
| `/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing` (sidevn.com) | `https://travelframe.vn/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing` |
| `/news/slow-hanoi-48-hour-itinerary-calm-two-day-walking-guide` (sidevn.com) | `https://travelframe.vn/news/slow-hanoi-48-hour-itinerary-calm-two-day-walking-guide` |
| `/news/trang-tien-street-hanoi-opera-house-locals-guide` (sidevn.com) | `https://travelframe.vn/news/trang-tien-street-hanoi-opera-house-locals-guide` |
| `/news/pho-thin-lo-duc-hanois-famous-stir-fried-beef-pho` (sidevn.com) | `https://travelframe.vn/news/pho-thin-lo-duc-hanois-famous-stir-fried-beef-pho` |
| `/news/temple-literature-what-does-vietnams-first-university-have-offer` (sidevn.com) | `https://travelframe.vn/news/temple-literature-what-does-vietnams-first-university-have-offer` |
| `/news/ta-hien-street-where-hanoi-nights-come-alive` (sidevn.com) | `https://travelframe.vn/news/ta-hien-street-where-hanoi-nights-come-alive` |
| `/news/st-josephs-cathedral` (sidevn.com) | `https://travelframe.vn/news/st-josephs-cathedral` |
| `/news/santorini-park-lovely-photo-spot-right-outside-hanoi` (sidevn.com) | `https://travelframe.vn/news/santorini-park-lovely-photo-spot-right-outside-hanoi` |
| `/news/red-river-dyke-flower-park-hot-spots-photography-camping-and-picnics-hanoi` (sidevn.com) | `https://travelframe.vn/news/red-river-dyke-flower-park-hot-spots-photography-camping-and-picnics-hanoi` |
| `/news/quan-thanh-temple-renowned-historical-and-cultural-relic-hanoi` (sidevn.com) | `https://travelframe.vn/news/quan-thanh-temple-renowned-historical-and-cultural-relic-hanoi` |
| `/news/one-pillar-pagoda-one-kind-architectural-work-hanoi` (sidevn.com) | `https://travelframe.vn/news/one-pillar-pagoda-one-kind-architectural-work-hanoi` |
| `/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` (sidevn.com) | `https://travelframe.vn/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` |
| `/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` (sidevn.com) | `https://travelframe.vn/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` |
| `/news/how-cross-street-hanoi-practical-survival-guide-traffic-scooters-and-staying-calm-2026` (sidevn.com) | `https://travelframe.vn/news/how-cross-street-hanoi-practical-survival-guide-traffic-scooters-and-staying-calm-2026` |
| `/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026` (sidevn.com) | `https://travelframe.vn/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026` |
| `/news/hanoi-sunrise-photography-walk-long-bien-bridge-flower-markets-and-morning-light-2026` (sidevn.com) | `https://travelframe.vn/news/hanoi-sunrise-photography-walk-long-bien-bridge-flower-markets-and-morning-light-2026` |
| `/news/ngoc-son-temple-renowned-spiritual-and-cultural-symbol-hanoi` (sidevn.com) | `https://travelframe.vn/news/ngoc-son-temple-renowned-spiritual-and-cultural-symbol-hanoi` |
| `/news/la-vong-grilled-fish-origins-and-authentic-ways-eat-it` (sidevn.com) | `https://travelframe.vn/news/la-vong-grilled-fish-origins-and-authentic-ways-eat-it` |
| `/news/huyen-huong-chicken-noodles-soup-one-priciest-chicken-pho-spots-hanoi` (sidevn.com) | `https://travelframe.vn/news/huyen-huong-chicken-noodles-soup-one-priciest-chicken-pho-spots-hanoi` |
| `/news/huong-mai-pho-cuon-preserving-vietnamese-flavors-future` (sidevn.com) | `https://travelframe.vn/news/huong-mai-pho-cuon-preserving-vietnamese-flavors-future` |
| `/news/hoi-bread-best-banh-mi-world` (sidevn.com) | `https://travelframe.vn/news/hoi-bread-best-banh-mi-world` |
| `/news/hoa-lo-prison-witness-history-heart-capital` (sidevn.com) | `https://travelframe.vn/news/hoa-lo-prison-witness-history-heart-capital` |
| `/news/ho-chi-minh-mausoleum-heart-vietnamese-nation` (sidevn.com) | `https://travelframe.vn/news/ho-chi-minh-mausoleum-heart-vietnamese-nation` |
| `/news/hanoi-post-office-three-centuries-flowing-through-name` (sidevn.com) | `https://travelframe.vn/news/hanoi-post-office-three-centuries-flowing-through-name` |
| `/hanoi-photoshoot` (sidevn.com) | `https://travelframe.vn/hanoi-photoshoot` |
| `/news/hanoi-old-quarter-guide` (sidevn.com) | `https://travelframe.vn/news/hanoi-old-quarter-guide` |
| `/tour/cinematic-hanoi-visual-storytelling-walk` (sidevn.com) | `https://travelframe.vn/tour/cinematic-hanoi-visual-storytelling-walk` |
| `/tour/taste-hanoi-culinary-delights-street-vibes` (sidevn.com) | `https://travelframe.vn/tour/taste-hanoi-culinary-delights-street-vibes` |
| `/tour/hanoi-unfiltered-local-life-documentary` (sidevn.com) | `https://travelframe.vn/tour/hanoi-unfiltered-local-life-documentary` |
| `/tour/colors-delta-craft-villages-expedition` (sidevn.com) | `https://travelframe.vn/tour/colors-delta-craft-villages-expedition` |
| `/tour/hanoi-early-bird-sunrise-local-markets` (sidevn.com) | `https://travelframe.vn/tour/hanoi-early-bird-sunrise-local-markets` |
| `/tour/french-colonial-historical-footsteps` (sidevn.com) | `https://travelframe.vn/tour/french-colonial-historical-footsteps` |
| `/tour/spiritual-west-lake-breeze` (sidevn.com) | `https://travelframe.vn/tour/spiritual-west-lake-breeze` |
