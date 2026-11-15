---
title: Làm mới bài Solo (solo female travel Hanoi)
owner: Marketing-Growth
status: Draft, chờ Rocky duyệt
date: 2026-11-15
requested_by: Rocky, chat 15/11/2026 ("viết các bài chuẩn seo cho từng tuyến sản phẩm")
product_line: 02-Solo-Photo-Walk
url: https://travelframe.sidevn.com/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing
---

# Vì sao làm mới

Đọc bài đang chạy bằng curl ngày 15/11/2026 ([snapshot](Current-Live-Body.html)):

- **Ghi chú nội bộ đang hiện công khai.** Cuối bài có mục "Editorial Notes" nói về ICP và ghi "No price, duration, image count, testimonial or delivery SLA is presented as approved commercial truth". Trong bài còn câu "TravelFrame's working concept" và "We do not publish a promise that has not been operationally approved". Khách đọc thấy các câu này. Nên sửa sớm, kể cả khi chưa đăng cả bản mới.
- **Thông tin giá đã cũ.** Bài viết trước DEC giá theo giờ (21/10) nên không có giá. Giá đã có trên /hanoi-photoshoot từ 13/11.
- **Có câu viết như chỉ dẫn biên tập:** "Avoid absolute safety claims."
- **Cấu trúc heading hỏng.** Một H2 rỗng, các mục chính là H4, H5. Google khó hiểu cấu trúc bài.
- **Bảng màu là ảnh chụp màn hình** (`Screenshot 2026-09-26 at 17.26.37.png`), Google không đọc được chữ trong đó.
- **Ảnh hero là ảnh AI.** Voice & Style Guide chỉ cho dùng ảnh AI làm minh hoạ concept.
- **Tiêu đề nhắm "solo female travel hanoi"** (10 lượt/tháng ở Mỹ). "solo photoshoot" có 260 lượt và khớp với tuyến sản phẩm hơn.
- Search Console 12/8 đến 12/11/2026: 0 lượt hiển thị, nên đổi tiêu đề không làm mất thứ hạng nào.

# Thay đổi

- Thay Body bằng [Page-Copy.md](Page-Copy.md). Giữ các phần tốt của bài cũ: ánh sáng buổi sáng, 5 prompt tạo dáng, thói quen an toàn. Thêm Quick answer, bảng màu dạng chữ, lộ trình ngày và tối, giá, FAQ mới.
- Đổi tiêu đề bài, SEO title và meta description theo frontmatter.
- Bỏ mục Editorial Notes, các câu nội bộ, handle `@harry_pham.sidevn` ở phần đặt lịch (cho khớp /hanoi-photoshoot: Instagram @travelframe.vn và WhatsApp).
- Ảnh theo [Photo-Plan.md](Photo-Plan.md).
- Giữ URL. Slug dài nhưng trang chưa có lượt hiển thị; đổi URL là việc riêng, cần Rocky duyệt.

# Phương án nhanh nếu chưa duyệt cả bài

**Đã làm 15/11/2026 lúc 10:46 ICT** (Rocky duyệt "Xoá ngay"): xem [Publication-Quick-Fix.md](Publication-Quick-Fix.md). Bước 1 của phần "Cách đăng" dưới đây cần ghi SHA mới của source trước khi dán bản đầy đủ.

Phạm vi đã làm: xoá mục "Editorial Notes", câu "TravelFrame's working concept combines:" kèm danh sách, và câu "We do not publish a promise that has not been operationally approved." Giữ câu "Package names, duration, price, image count and delivery time are confirmed in writing before booking."

# Cách đăng (khi Rocky duyệt)

1. Mở `node/72/edit`, ghi SHA của source trong textarea (sau bản sửa nhanh: `55c074de…`).
2. Dán Body mới bằng CKEditor5 `setData`, đúng format của node. Ảnh inline phải là JPEG.
3. Revision log: "Refresh: solo photoshoot guide with pricing (2026-11-15 draft)". Save, chờ redirect xong.
4. Kiểm tra bằng curl: không còn "Editorial Notes", "working concept", "commercial truth"; có "30 USD per hour".
5. Ghi Publication.md, Published-Ledger; xin duyệt gửi index Google và Bing.

Node: 72. Rollback: revert về revision trước khi lưu, tại `/node/72/revisions`.
