---
title: Xoá ghi chú nội bộ trên bài Solo (node 72)
owner: Marketing-Growth
status: Published
date: 2026-11-15
approval: 'Rocky, chat 15/11/2026: "Xoá ngay"'
url: https://travelframe.sidevn.com/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing
---

# Kết quả

Lưu lúc 10:46 ICT ngày 15/11/2026 (trang revisions hiện 03:46, giờ UTC), trong built-in browser, phiên admin có sẵn. Chỉ sửa Body. Tiêu đề, SEO title, meta description, URL và ảnh giữ nguyên.

Đã xoá 3 đoạn, tổng 1.207 ký tự:

1. Câu "TravelFrame's working concept combines:" và danh sách 4 ý đi kèm.
2. Câu "We do not publish a promise that has not been operationally approved." Câu đứng trước ("Package names, duration, price, image count and delivery time are confirmed in writing before booking.") vẫn giữ, vì đúng với quy trình xác nhận bằng văn bản.
3. Mục "Editorial Notes" (H4 và 3 ý: ICP, "No price... approved commercial truth", ghi chú ảnh Pexels và ảnh AI). Chú thích ảnh AI ở đầu bài và credit Pexels dưới từng ảnh vẫn còn.

Câu "Avoid absolute safety claims." chưa xoá, vì không nằm trong phạm vi đã duyệt. Bản làm mới đầy đủ ([Page-Copy.md](Page-Copy.md)) đã viết lại câu này.

| | Source lưu trong textarea | Ghi chú |
|---|---|---|
| Trước | 10.251 ký tự, SHA-256 `76faabd5fcc4eb797c16159b58ef1dea874c2415956cc1bd8c6f9ba4b1b32fe1` | Format basic_html |
| Sau | 9.043 ký tự, SHA-256 `55c074def0cf1db6f61d11f056b625ee4cbc38e67e6ad4a1387c7e981cbab178` | Đọc lại từ form sửa sau khi lưu |

Mỗi đoạn được kiểm tra xuất hiện đúng 1 lần trước khi xoá. Sau `setData`, phần khác giữa dữ liệu editor trước và sau đúng bằng 1.207 ký tự đã xoá.

Revision log: "Remove internal editorial notes from public page (Rocky approved 15/11/2026)".

# Kiểm tra trang live

curl không đăng nhập, cả URL thường và URL có tham số chống cache: HTTP 200, x-drupal-cache MISS.

| Chuỗi | Số lần |
|---|---|
| Editorial Notes, working concept, operationally approved, commercial truth, operating ICP | 0 |
| Package names, duration, price; To discuss a solo Hanoi walk; The Quiet Portrait; Frequently Asked Questions | 1 |

# Rollback

Revert về revision 184 tại `/node/72/revisions/184/revert`.

# Chưa làm

- Không gửi index: thay đổi nhỏ, không đổi tiêu đề hay meta. Gửi index khi đăng bản làm mới đầy đủ.
- Bản làm mới đầy đủ vẫn là Draft, chờ Rocky duyệt.
