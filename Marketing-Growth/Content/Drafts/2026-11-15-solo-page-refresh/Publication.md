---
title: Đăng bản làm mới bài Solo (node 72)
owner: Marketing-Growth
status: Published
date: 2026-11-15
approval: 'Rocky, chat 15/11/2026: "Triển khai đăng đi xong đưa link tôi gửi khách nào"'
url: https://travelframe.sidevn.com/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing
node: 72
---

# Kết quả

Cùng URL. Có hai bước trong ngày 15/11:

- 10:46 ICT: xoá ghi chú nội bộ (xem [Publication-Quick-Fix.md](Publication-Quick-Fix.md)).
- 11:28 ICT: lưu bản làm mới đầu tiên (revision 354). Lỗi chuyển đổi làm mất 3 tiêu đề H2 và bảng màu bị bỏ (định dạng Basic HTML không giữ bảng). Bản này được thay ngay sau đó.
- 11:31 ICT: lưu bản đang chạy (revision hiện tại). Có đủ tiêu đề, bảng đổi thành danh sách, không còn ghi chú nội bộ hay ảnh minh hoạ AI.

## Thay đổi

- **Title (H1):** Solo Photoshoot in Hanoi: Natural Photos When You Travel Alone.
- **SEO title:** Solo Photoshoot in Hanoi: Natural Photos, No Awkward Poses. **Meta:** 155 ký tự. **Summary:** cập nhật.
- **Ảnh bìa (main image):** thay ảnh "Tip for Women" (fid 373; hồ sơ của mình không ghi nguồn) bằng ảnh Hanna đã cắt 1200×630 (fid 1041, `solo-hanoi-hanna-cover.webp`, 134.126 byte). Alt mới.
- **Nội dung:** bỏ ảnh minh hoạ AI có chú thích "AI-generated" trong thân bài. Ảnh inline giữ nguyên: `image_9.jpeg` (Tuan Vy / Pexels), `image_11.jpeg` (quang vinh / Pexels), `hanna-long-bien-street-style-03.jpg` (Harry Pham / 102 Koncept).
- **Giữ:** các mục tư vấn chụp, giá (Basic 30, Premium 60, VIP 99 USD/giờ), FAQ và cách đặt lịch (Instagram @travelframe.vn, WhatsApp).

## Kiểm tra trang live

curl không đăng nhập: HTTP 200. Title và meta đúng; 0 chuỗi "Editorial Notes", "working concept", "AI-generated"; 10 H2; 3 ảnh inline và og:image HTTP 200; 3 link nội bộ HTTP 200. Có trong sitemap.

# Rollback

Revision 350 (trạng thái sau bản sửa nhanh 10:46). Lệnh: `/node/72/revisions/350/revert`.

# Gửi index (Rocky duyệt "Gửi index", chat 15/11/2026)

- **Google (Search Console, Kiểm tra URL):** trang đã có trên Google với bản cũ ("Trang đã lập chỉ mục"); vì đã làm mới nên yêu cầu lập chỉ mục lại. Bấm Yêu cầu lập chỉ mục; Google kiểm tra trang live 1–2 phút rồi báo "Đã yêu cầu lập chỉ mục: URL đã được thêm vào hàng đợi ưu tiên thu thập dữ liệu". Gửi trong khoảng 11:38–11:41 ICT.
- **Bing (URL Submission):** gửi cùng lúc 3 URL của ba trang lúc 11:41 ICT. Hạn mức trong ngày trước khi gửi còn 98. Bing báo "Success: 3 URLs submitted Succesfully"; danh sách hiện 3 URL với mốc "Today at 11:41".
- **Kiểm tra lại:** 21/11/2026, cùng đợt với các trang đã gửi trước đó.

# Việc tiếp theo

- Đã gửi index 15/11 (xem mục Gửi index ở trên).
