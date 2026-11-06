---
title: Hanoi Old Quarter Guide upgrade — publication
owner: Marketing-Growth
status: Published
published_date: 2026-10-27
timezone: Asia/Ho_Chi_Minh
node: 105 (cập nhật, revision mới)
url: https://travelframe.sidevn.com/news/hanoi-old-quarter-guide
---

# Đã cập nhật live

Ngày 27/10 Rocky duyệt nội dung và đồng ý dùng ảnh Thin (Harry) cho bài này. Claude điền form node 105, Rocky tự bấm Save. Thay đổi:
- Title, SEO title (54 ký tự), meta description (138), summary.
- Body chuyển Basic HTML → Full HTML.
- Main image mới `2026-10/hanoi-old-quarter-guide-hero` (bản sao của image_20, fid 867; CMS chuyển sang WebP).
- Revision log có ghi chú. Bản trước nằm trong revision history của node 105 (rollback: Revisions → Revert).

## Bằng chứng (fetch không cookie, 27/10)

- HTTP 200, không có markup admin. Title `Hanoi Old Quarter Guide 2026: Map, Things to Do & Stay | TravelFrame Vietnam`. Description khớp, canonical là URL bài, không có meta robots noindex. og:image là hero WebP mới.
- Một H1 mới. 13 H2 (12 của bài cộng 1 của khối template), 2 bảng, khoảng 1.850 từ trong article.
- 3/3 ảnh trả 200 và có alt: image_20.jpeg, Cổng chính.jpg, Dda473Fj_2F-08.webp (Thin). Sau khi cuộn trang, cả 3 đều `complete` với naturalWidth 1264/1200/1200.
- Mọi link nội bộ trong bài trả 200. Giờ chợ đêm mới ("7 pm until about midnight") đã lên trang.
- Viewport 590px không tràn ngang. Chưa kiểm tra desktop rộng hoặc thiết bị thật.

## Giới hạn

- Khối "Book a food tour" của template vẫn còn (vấn đề đã biết).
- Bản `?lang=vi` của bài này vẫn trùng nội dung cho tới khi developer sửa theo brief.
- Published không có nghĩa là Google đã index lại hay lên hạng. Theo dõi qua Rank Tracking US (15 từ khóa, cấu hình Manual).
