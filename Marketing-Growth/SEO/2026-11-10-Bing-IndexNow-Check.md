---
title: "Bing + IndexNow check (10/11/2026)"
owner: Marketing-Growth
status: "Đã nộp sitemap và 49 URL qua Bing Webmaster Tools (10/11). IndexNow vẫn chờ file khóa (ticket D12)."
date: 2026-11-10
---

# Bing + IndexNow check

ChatGPT tìm web chủ yếu qua chỉ mục Bing. Trang nào không có trên Bing thì khó được ChatGPT trích dẫn.

## Kết quả

| Kiểm tra | Kết quả |
|---|---|
| `robots.txt` | `User-agent: *` / `Allow: /`, có khai báo `Sitemap:`. Không chặn Bingbot |
| Bingbot truy cập `/hanoi-photoshoot` | 200, không có thẻ noindex (curl với user-agent bingbot) |
| Sitemap | 66 URL |
| URL trong sitemap đang có trên Bing | **21/66**. Còn 45 URL chưa thấy, gồm `/hanoi-photoshoot`, bài Pillar Phố Cổ, 15 photo spots, Train Street, couple, hiring guide và mọi bài đăng 09–10/11 |
| URL cũ Bing vẫn giữ | `/tour/tour-den-ngoc-son-ho-guom` (404), `/tour/tour-tam-linh` (404), `/news/journey-through-hanois-food` (404), `/tour/bun-cha-grill-tour` (301 sang tour ẩm thực) |
| IndexNow (OpenSEO `submit_indexnow_urls`, 49 URL) | **Thất bại.** Lỗi "No key file at the root". Khóa: `df54ec0e2916426d9d891ebc93ebf940` |

**Cách kiểm tra:**
- bing.com hiện bước xác minh chống bot; không vượt qua bước này.
- Dùng Yahoo Search ("Powered by Bing") với `site:travelframe.sidevn.com`, đọc hết 4 trang kết quả.
- Đối chiếu bằng các lượt tìm `site:` kèm từ khóa: photoshoot, "old quarter", "train street".
- Lệnh `site:` không đếm đủ mọi trang, nhưng các trang chính đã được xác nhận vắng mặt bằng các lượt tìm có từ khóa.

## Đã làm trong Bing Webmaster Tools (10/11/2026)

Rocky tự đăng nhập Bing Webmaster Tools trên trình duyệt tích hợp. Site `https://travelframe.sidevn.com/` đã có trong tài khoản; Bing báo dữ liệu báo cáo cần tới 48 giờ để hiện. Claude thao tác phần còn lại:

| Việc | Kết quả |
|---|---|
| Cookie banner | Chọn "Reject", chỉ giữ cookie cần thiết |
| Sitemaps → Submit sitemap | `https://travelframe.sidevn.com/sitemap.xml`: "successfully submitted for processing", trạng thái Processing (trước đó Bing chưa biết sitemap nào) |
| URL Submission | **49 URL** (danh sách dưới): "49 URLs submitted Succesfully". Hạn mức ngày 100, còn 51 |

## Việc tiếp theo

1. **Sau 48 giờ (khoảng 12/11):** vào Bing Webmaster Tools xem:
   - Sitemaps: số URL Bing đã phát hiện;
   - URL Inspection cho `/hanoi-photoshoot` và bài Pillar.
2. **File khóa IndexNow (developer, [ticket D12](2026-10-14-Developer-SEO-Ticket.md)).** Không còn gấp, vì đã nộp bằng URL Submission. Khi có file, mỗi lần sửa hoặc đăng bài thì gửi URL qua OpenSEO `submit_indexnow_urls`. Trước khi có file, dán URL vào Bing URL Submission (100 URL mỗi ngày).
3. **Kiểm tra lại sau 7–14 ngày:** dùng `site:travelframe.sidevn.com` trên Yahoo/Bing, so với mốc 21/66 hôm nay.
4. **Báo cáo AI Performance** trong Bing Webmaster Tools (citation share trong câu trả lời AI của Bing/Copilot) dùng được để đối chiếu với tracker OpenSEO khi đã có dữ liệu.

## 49 URL đã gửi (Bing URL Submission 10/11; dùng lại cho IndexNow khi có file khóa)

**Ưu tiên (trang dịch vụ, Pillar, bài mới):**

```
https://travelframe.sidevn.com/hanoi-photoshoot
https://travelframe.sidevn.com/news/hanoi-old-quarter-guide
https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026
https://travelframe.sidevn.com/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots
https://travelframe.sidevn.com/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026
https://travelframe.sidevn.com/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide
https://travelframe.sidevn.com/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing
https://travelframe.sidevn.com/news/santorini-park-lovely-photo-spot-right-outside-hanoi
https://travelframe.sidevn.com/news/hanoi-old-quarter-night-market
https://travelframe.sidevn.com/news/hanoi-airport-to-old-quarter
https://travelframe.sidevn.com/news/hanoi-french-quarter-guide
https://travelframe.sidevn.com/news/day-trips-from-hanoi
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map
https://travelframe.sidevn.com/news/hanoi-street-style-photoshoot-harry-hanna
https://travelframe.sidevn.com/news/hanoi-old-quarter-photoshoot-harry-thin
https://travelframe.sidevn.com/news/hanoi-night-photoshoot-harry-wuchr
https://travelframe.sidevn.com/news/hanoi-photography-tips-etiquette
https://travelframe.sidevn.com/news/hanoi-sunrise-photography-walk-long-bien-bridge-flower-markets-and-morning-light-2026
https://travelframe.sidevn.com/contact
```

**Các bài News còn lại chưa có trên Bing:**

```
https://travelframe.sidevn.com/news/cam-phu-cau-incense-village-photography-guide
https://travelframe.sidevn.com/news/bat-trang-pottery-museum-photography-guide
https://travelframe.sidevn.com/news/imperial-citadel-thang-long-photography-guide
https://travelframe.sidevn.com/news/hanoi-moi-newspaper-hidden-hanoi-photo-spot
https://travelframe.sidevn.com/news/slow-hanoi-48-hour-itinerary-calm-two-day-walking-guide
https://travelframe.sidevn.com/news/complete-hanoi-travel-guide-2026-what-do-eat-and-know-you-arrive
https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local
https://travelframe.sidevn.com/news/how-cross-street-hanoi-practical-survival-guide-traffic-scooters-and-staying-calm-2026
https://travelframe.sidevn.com/news/trang-tien-street-hanoi-opera-house-locals-guide
https://travelframe.sidevn.com/news/ta-hien-street-where-hanoi-nights-come-alive
https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital
https://travelframe.sidevn.com/news/st-josephs-cathedral
https://travelframe.sidevn.com/news/red-river-dyke-flower-park-hot-spots-photography-camping-and-picnics-hanoi
https://travelframe.sidevn.com/news/temple-literature-what-does-vietnams-first-university-have-offer
https://travelframe.sidevn.com/news/quan-thanh-temple-renowned-historical-and-cultural-relic-hanoi
https://travelframe.sidevn.com/news/one-pillar-pagoda-one-kind-architectural-work-hanoi
https://travelframe.sidevn.com/news/hoa-lo-prison-witness-history-heart-capital
https://travelframe.sidevn.com/news/ho-chi-minh-mausoleum-heart-vietnamese-nation
https://travelframe.sidevn.com/news/hanoi-post-office-three-centuries-flowing-through-name
https://travelframe.sidevn.com/news/hanoi-flag-tower-historic-symbol-capital-city
https://travelframe.sidevn.com/news/bun-cha-chan-local-culinary-guide
https://travelframe.sidevn.com/news/pho-thin-lo-duc-hanois-famous-stir-fried-beef-pho
https://travelframe.sidevn.com/news/la-vong-grilled-fish-origins-and-authentic-ways-eat-it
https://travelframe.sidevn.com/news/huyen-huong-chicken-noodles-soup-one-priciest-chicken-pho-spots-hanoi
https://travelframe.sidevn.com/news/huong-mai-pho-cuon-preserving-vietnamese-flavors-future
https://travelframe.sidevn.com/news/hoi-bread-best-banh-mi-world
```

**URL cũ cần Bing cập nhật (404 hoặc 301):**

```
https://travelframe.sidevn.com/tour/bun-cha-grill-tour
https://travelframe.sidevn.com/tour/tour-den-ngoc-son-ho-guom
https://travelframe.sidevn.com/tour/tour-tam-linh
https://travelframe.sidevn.com/news/journey-through-hanois-food
```
