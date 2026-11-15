---
title: Viết lại bài làng hương Quảng Phú Cầu (node 68)
owner: Marketing-Growth
status: Draft, chờ Rocky duyệt
date: 2026-11-15
requested_by: Rocky, chat 15/11/2026 ("viết các bài chuẩn seo cho từng tuyến sản phẩm")
product_line: 05-Incense-Village-Photoshoot
url: https://travelframe.sidevn.com/news/cam-phu-cau-incense-village-photography-guide
---

# Vì sao viết lại

Bài đang chạy là bài dựng từ khung chung cho Hà Nội, không viết riêng cho làng hương. Đọc bằng curl ngày 15/11/2026 ([snapshot](Current-Live-Body.html)):

- Phần lớn nội dung không nói về làng: phở, bún chả, cà phê trứng, mẹo tránh lừa đảo ở Hà Nội, FAQ "Is Hanoi safe for solo female travelers", eSIM, nên ở Hà Nội mấy ngày.
- Có câu sai với một làng nghề, ví dụ ban công sắt kiểu Pháp và kiến trúc Xô Viết.
- Dùng từ Voice & Style Guide cấm: must-visit, photographer's dream, hidden courtyards.
- Khuyên mang drone.
- Không có giá, không link tới /hanoi-photoshoot.
- Chỉ 2 thẻ H2, nên Google khó hiểu cấu trúc bài.
- Search Console 3 tháng (12/8 đến 12/11/2026): 0 lượt hiển thị.

Nhu cầu tìm kiếm có thật. Theo Long-tail clusters 09/11, "incense village hanoi" có 390 lượt/tháng ở Mỹ, KD 0, và "quang phu cau incense village" có 320. Đây là tuyến có nhu cầu lớn nhất trong 3 tuyến chưa có bài chuẩn. Số trên là số Google Ads, chưa đo clickstream, nên lượt tìm thật có thể thấp hơn.

# Thay đổi

- Thay toàn bộ Body bằng [Page-Copy.md](Page-Copy.md), khoảng 1.100 từ, 8 H2 và FAQ.
- Sửa tiêu đề bài, SEO title và meta description theo frontmatter của Page-Copy.
- Ảnh: theo [Photo-Plan.md](Photo-Plan.md).
- Giữ URL. Slug còn chữ "cam-phu-cau" (sai tên làng). Vì trang chưa có lượt hiển thị nào, đổi sang `/news/quang-phu-cau-incense-village` kèm redirect 301 từ URL cũ gần như không mất gì. Việc này cần Rocky duyệt riêng; mặc định giữ URL.

# Cách đăng (khi Rocky duyệt)

1. Mở `node/68/edit`. Ghi SHA của source đang lưu trong textarea trước khi sửa.
2. Chuyển Page-Copy sang HTML, dùng format của node (kiểm tra basic_html hay full_html). Dán bằng CKEditor5 `setData`.
3. Tải ảnh JPEG theo Photo-Plan (WebP bị lỗi 422).
4. Ghi revision log: "Rewrite: incense village guide (2026-11-15 draft)". Bấm Save, chờ redirect xong mới rời trang.
5. Kiểm tra trang live bằng curl: tiêu đề mới, không còn "Cam Phu", "must-visit", "Hanoi Hilton", "eSIM".
6. Ghi Publication.md, Published-Ledger, rồi xin duyệt gửi index Google và Bing.

Rollback: revert về revision trước khi lưu, tại `/node/68/revisions`.
