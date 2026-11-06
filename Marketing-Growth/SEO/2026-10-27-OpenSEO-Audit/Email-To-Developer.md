---
title: Email gửi developer — brief sửa ?lang=vi
owner: Marketing-Growth
status: Sent
created: 2026-10-27
to: sonbui20020112@gmail.com
sent: 2026-10-27 (Gmail web, gửi từ chính tài khoản sonbui20020112@gmail.com theo chỉ đạo của Rocky; thư đã về Hộp thư đến)
resent: 2026-10-29 (Rocky yêu cầu gửi lại; cùng tiêu đề và brief, thêm câu "Anh gửi lại brief…"; thư đã về Hộp thư đến)
---

**Subject:** [TravelFrame] P0 SEO fix: canonical/hreflang cho các trang ?lang=vi

Chào Sơn,

Audit OpenSEO ngày 27/10 phát hiện site travelframe.sidevn.com đang tự nhân đôi nội dung qua biến thể `?lang=vi`. Lỗi này chiếm phần lớn trong 38 cảnh báo trùng title và 42 cảnh báo trùng meta description. Google cũng đã bắt đầu index các URL này.

Tóm tắt:
- 42 bài/trang chưa có bản dịch, nhưng bản `?lang=vi` vẫn trả nội dung tiếng Anh y hệt, gắn `lang="vi"` và canonical trỏ về chính nó, còn bản tiếng Anh thì khai báo hreflang vi tới bản này.
- Cần làm: bản `?lang=vi` canonical về URL tiếng Anh; bỏ hreflang vi ở các trang này; nút VI thêm `rel="nofollow"` và bỏ thuộc tính hreflang.
- 12 trang có bản dịch thật (/, /tours, /faq, /about…) giữ nguyên.
- 7 trang tour: bản VI dịch dở và H1 sai ("Chọn hành trình Hà Nội"). `/tours?lang=vi` có H1 là "Digital Tour".

Brief đầy đủ, gồm danh sách URL, yêu cầu R1–R4, bảng nghiệm thu và rollback, nằm ngay bên dưới.

Sau khi xong, em báo anh. Anh sẽ chạy lại audit để nghiệm thu.

Cảm ơn em,
Rocky — TravelFrame

---
(brief đầy đủ: nội dung file Developer-Brief-Lang-VI.md)
