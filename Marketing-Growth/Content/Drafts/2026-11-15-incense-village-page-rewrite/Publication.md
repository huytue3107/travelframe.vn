---
title: Đăng bản viết lại bài làng hương Quảng Phú Cầu (node 68)
owner: Marketing-Growth
status: Published
date: 2026-11-15
approval: 'Rocky, chat 15/11/2026: "Đăng làng hương"'
url: https://travelframe.sidevn.com/news/cam-phu-cau-incense-village-photography-guide
---

# Kết quả

Lưu lúc 10:52 ICT ngày 15/11/2026 (trang revisions hiện 03:52, giờ UTC), trong built-in browser, phiên admin có sẵn. URL giữ nguyên.

| Trường | Trước | Sau |
|---|---|---|
| Tiêu đề (H1) | Quang Phu Cau Incense Village: A Photography Guide | Quảng Phú Cầu Incense Village: How to Visit and Photograph It |
| SEO title | Quang Phu Cau Incense Village Photo Guide | Quang Phu Cau Incense Village, Hanoi: Visit & Photo Guide |
| SEO description | Quang Phu Cau, the incense village about 35 km south of Hanoi: what to photograph, the best light, and practical tips for your visit. | How to visit Quang Phu Cau, the incense village 35 km south of Hanoi: when the red sticks are out, getting there, fees, etiquette and photo tips. |
| Summary (teaser) | Discover Quang Phu Cau Incense Village. Located just outside Hanoi, this village is a photographer's dream… | How to visit Quảng Phú Cầu, the incense village about 35 km south of Hanoi: when the red sticks are out, getting there, fees, etiquette and photo tips. |
| Body | 12.886 ký tự, SHA-256 `bbe947991ba9b23adcdd629bedc92ffdd2ff31eac2f82ea0feaf063ce96c3bb0` | 8.735 ký tự, SHA-256 `88aae5d6ce0d1b5c359e07cc190fca974a1336b9229772d71aebca8acaef8921` (đọc lại từ form sau khi lưu) |

Body lấy từ [Body.html](Body.html) (7.802 ký tự, SHA-256 `ffbb165d…27bc`). SHA được so khớp trong trình duyệt trước khi dán. Sau `setData`, chữ, link và ảnh trong editor khớp Body.html. CKEditor thêm `data-list-item-id` cho từng dòng danh sách, đổi thứ tự thuộc tính ảnh, và tách thẻ `<em>` trong 3 chú thích ảnh. Các thay đổi này không làm khác nội dung hiển thị.

Format basic_html. Revision log: "Rewrite: incense village guide (2026-11-15 draft, Rocky approved)".

Không đổi: URL alias, ảnh chính (field image, alt "Nguyen Minh Tuan - Quang Phu Cau Incense Village"), trạng thái Published.

## Khác với Page-Copy ngày 15/11 trước khi đăng

- Bỏ link sang `/news/ao-dai-photoshoot-hanoi`, vì bài áo dài chưa đăng. Thêm lại khi bài đó lên.
- Câu về xe đổi thành "Transport to the village depends on your plan. We confirm the car, the hours and the total in writing before you book." Lý do: giá xe và việc xe có tính trong gói hay không chưa chốt.
- Page-Copy.md đã cập nhật theo đúng bản đăng.

## Ảnh

- Giữ 3 ảnh Pexels có credit, đặt lại theo [Photo-Plan.md](Photo-Plan.md). Cả 3 trả HTTP 200.
- Bỏ 2 ảnh chưa rõ nguồn (`edcbc5ae….jpg` alt "Quang Phu Cau", `d4c4a6a6….jpg` chú thích "Vietnamese women in tradition Ao Dai"). File vẫn còn trên server, không xoá.

# Kiểm tra trang live

curl không đăng nhập, cả URL thường và URL có tham số chống cache: HTTP 200, x-drupal-cache MISS.

- `<title>`: "Quang Phu Cau Incense Village, Hanoi: Visit & Photo Guide | TravelFrame Vietnam". Meta description 145 ký tự. Canonical giữ nguyên URL cũ.
- H1 mới. 9 H2 (thêm H2 "Want to taste it yourself?" của template), 13 H3. Khoảng 1.075 từ.
- Link trong bài: `/hanoi-photoshoot`, `/news/day-trips-from-hanoi`.
- Có "30 USD per hour", "Ứng Thiên".
- 0 lần: "Cam Phu", "must-visit", "photographer's dream", "eSIM", "Hanoi Hilton", "Is Hanoi safe", "VERIFY", "drone if you have one".

# Rollback

Revert về revision 243 tại `/node/68/revisions/243/revert`. Revision đó gồm cả tiêu đề, SEO title, meta và summary cũ.

# Việc tiếp theo

- Gửi index Google (Request Indexing) và Bing (URL Submission): chờ Rocky duyệt.
- Listing `/news` có thể còn teaser cũ do cache (D13).
- Khi bài áo dài lên: thêm lại link ở mục "Portraits among the bundles".
