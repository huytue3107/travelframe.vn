# GA4 + GSC Website Analytics Snapshot — 2026-11-28

- **Captured:** 2026-11-28 ~12:50 (Asia/Saigon) | GA4 Data API property `552867189` qua MCP `travelframe-google-analytics` (chỉ-đọc); Google Search Console qua OpenSEO (chỉ-đọc, không tốn credit)
- **Status:** Research snapshot. Số GA4 là **số thô**, chưa lọc admin/nội bộ (bộ lọc `exclude_internal` của MCP v0.3.0 chưa chạy trên máy Rocky).
- **Kỳ:** tuần thứ Hai–Chủ nhật. Tuần 23–29/11 mới có 5 ngày (23–27/11).
- **Báo cáo trước:** `Data-Analytics/Snapshots/2026-10-14-GA4-Website-Analytics.md` (6 tuần trống ở giữa).

## 1. Tổng quan GA4 (thô)

| Tuần | Users | Sessions | Pageviews | Bounce | Avg session | Direct sessions/users | Sessions không phải direct |
|---|---:|---:|---:|---:|---:|---:|---:|
| 02–08/11 | 27 | 76 | 418 | 40,8% | 663s | 59/16 | 17 |
| 09–15/11 | 98 | 192 | 787 | 41,7% | 467s | 101/23 | 91 |
| 16–22/11 | 95 | 148 | 417 | 35,1% | 245s | 65/24 | 83 |
| 23–27/11 (5 ngày) | 64 | 80 | 119 | 47,5% | 76s | 24/17 | 56 |

**Đọc số:** "Sessions không phải direct" là chỉ số sạch tạm thời tốt nhất hiện có, vì traffic admin gần như toàn bộ vào qua direct.
Tuần 02–08 và 09–15/11 có phiên trung bình 467–663s và 3–6 phiên/người direct, khớp với lịch soạn và đăng 26 bài trên Drupal (**đoán**, chưa tách được bằng bộ lọc).

## 2. Nguồn traffic theo tuần (sessions, top 10 mỗi tuần)

| Nguồn | 02–08/11 | 09–15/11 | 16–22/11 | 23–27/11 |
|---|---:|---:|---:|---:|
| google / organic | 4 | 16 | 40 | 25 |
| chatgpt.com / ai-assistant | — | 4 | 19 | 14 |
| gemini.google.com / ai-assistant | — | — | — | 2 |
| Facebook (mọi nguồn trong top 10) | 6 | 38 | 15 | 6 |
| — trong đó facebook / dm | — | 11 | — | — |
| — trong đó facebook / comment_pin | — | — | 4 | 1 |
| Instagram (mọi nguồn trong top 10) | 4 | 23 | 5 | 7 |
| — trong đó instagram / bio | 2 | 8 | 2 | — |
| zalo / zalo | 3 | — | — | — |
| Pinterest / organic | — | — | — | 1 |

"—" = không có trong top 10 của tuần đó (có thể có nhưng nhỏ). Tuần 09–15/11 có 15 dòng nguồn, 5 dòng cuối chưa lấy.

## 3. Google Search Console (toàn site)

| Tuần | Clicks | Impressions | CTR |
|---|---:|---:|---:|
| 02–08/11 | 1 | 113 | 0,9% |
| 09–15/11 | 15 | 647 | 2,3% |
| 16–22/11 | 35 | 1.665 | 2,1% |
| 23–27/11 (5 ngày, dữ liệu 3 ngày cuối có thể chưa đủ) | 14 | 1.247 | 1,1% |

Ngày GSC theo giờ Pacific.

## 4. 26 URL đăng 9–15/11: index và hiệu quả (GSC 09–27/11)

Index: 26/26 "Submitted and indexed" (URL Inspection 28/11), canonical Google chọn trùng canonical khai báo.

| URL | Clicks | Impressions | Vị trí TB | Ghi chú |
|---|---:|---:|---:|---|
| /news/christmas-dinner-hanoi | 17 | 184 | 7,0 | Tốt nhất |
| /news/christmas-in-hanoi | 15 | 203 | 7,1 | |
| /hanoi-photoshoot | 5 | 125 | 13,3 | Trang bán hàng |
| /news/hang-ma-street-christmas-photo-spots | 4 | 158 | 11,3 | Không thấy sitemap trong inspection |
| /news/new-years-eve-hanoi | 3 | 64 | 11,2 | |
| /news/christmas-photoshoot-hanoi | 2 | 11 | 4,0 | Không thấy sitemap trong inspection |
| /news/christmas-in-vietnam-traditions | 1 | 245 | 16,1 | CTR thấp |
| /news/hanoi-weather-december | 1 | 532 | 25,5 | Nhiều impression nhất, vị trí thấp |
| /news/st-josephs-cathedral | 1 | 27 | 6,8 | |
| /news/vietnam-photoshoot | 1 | 40 | 8,1 | |
| /news/where-to-eat-hanoi-old-quarter | 1 | 321 | 41,8 | Vị trí rất thấp |
| /news/hanoi-airport-to-old-quarter | 0 | 43 | 15,4 | |
| /news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026 | 0 | 21 | 9,0 | |
| /news/hanoi-christmas-new-year-itinerary | 0 | 21 | 8,4 | |
| /news/hanoi-secret-food-photo-map | 0 | 21 | 12,4 | |
| /news/cam-phu-cau-incense-village-photography-guide | 0 | 10 | 10,5 | Nghi trùng chủ đề với /news/incense-village-photoshoot-hanoi |
| /news/hanoi-old-quarter-night-market | 0 | 7 | 30,7 | |
| /news/ao-dai-photoshoot-hanoi | 0 | 6 | 11,3 | |
| /news/hanoi-french-quarter-guide | 0 | 6 | 36,0 | |
| /news/fashion-photoshoot-hanoi | 0 | 4 | 4,3 | Không thấy sitemap trong inspection |
| /ebooks/hanoi-handbook | 0 | 3 | 20,3 | |
| /news/day-trips-from-hanoi | 0 | 2 | 37,0 | Không thấy sitemap trong inspection |
| /news/tet-in-hanoi | — | — | — | Chưa có trong top 60 trang |
| /news/international-food-hanoi | — | — | — | Chưa có trong top 60 trang |
| /news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing | — | — | — | Chưa có trong top 60 trang |

Các biến thể `?lang=vi` không cộng vào bảng (ví dụ `/news/hanoi-weather-december?lang=vi` 69 impressions).

## 5. Traffic admin còn ghi nhận (16–27/11, top 40/133 dòng)

`/node/add/news` 15 · `/side-user` 7 · `/node/104/edit` 5 · `/admin/config/development/performance` 4 · `/node/68/edit` 4 · `/node/94/edit` 4 = ≥39 lượt xem (≥7% của 536).
Kết luận: chặn GTM trên trang admin (runbook `RBK-20261013-TRAFFIC-HYGIENE`, mục 2) chưa có hiệu lực, hoặc chưa phủ các đường dẫn `/node/*`, `/side-user`, `/admin/*`.

## 6. Giới hạn

- Chưa tách được pageview admin theo tuần; cần MCP v0.3.0 (`exclude_internal: true`) chạy trên máy Rocky rồi chụp lại.
- Nguồn traffic chỉ lấy top 10 mỗi tuần.
- Không đọc được site live và `sitemap.xml` từ môi trường này (mạng bị chặn); trạng thái sitemap lấy từ kết quả URL Inspection.
- Chưa có số DM, booking, doanh thu và key event `generate_lead`.
