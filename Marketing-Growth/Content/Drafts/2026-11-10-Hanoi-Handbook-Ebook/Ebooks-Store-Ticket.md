---
title: "Ticket developer: mở bán The Hanoi Handbook trên /ebooks ($12)"
owner: Marketing-Growth → Technology-Automation (developer / hosting)
status: "Open — phần nội dung đã lên live 12/11 (Coming soon); chờ 2 cấu hình server để bán"
created: 2026-11-12
decision: "Rocky trong chat 12/11/2026 chọn 'Bán $12, thay ô 02', rồi yêu cầu đăng tại /travelframe-admin/ebooks"
---

# Ticket: mở bán The Hanoi Handbook

## Đã làm (Claude, 12/11/2026)

Claude sửa sản phẩm số 2 tại `/travelframe-admin/ebooks/2/edit` và bấm Lưu. Hệ thống báo "Đã lưu cẩm nang". Chi tiết xem [Publication](Publication.md).

- Tên: The Hanoi Handbook. Slug: `hanoi-handbook`. Giá: 12.00 USD. Ấn bản: 2026–27. 25 trang.
- Đã điền đủ eyebrow, tagline, lede (dùng làm mô tả SEO), nội dung giới thiệu (3 đoạn), mục lục (22 dòng) và câu nhấn. Bản VI có tên, eyebrow, tagline, lede và câu nhấn.
- Bìa vẽ bằng chữ: "The / *Hanoi* / Handbook.", màu Đỏ rượu.
- Trạng thái vẫn là **Sắp ra mắt**, vì chưa lưu được PDF.

## Còn chặn: 2 cấu hình server

Cả hai việc đều phải sửa file trên server, không làm được trong trang quản trị. Claude không đụng vào thông tin bí mật.

| # | Việc | Nguồn hướng dẫn | Kiểm tra |
|---|---|---|---|
| S1 | Thêm `$settings['file_private_path'] = '../private';` vào settings. Thư mục `../private` phải ghi được và nằm ngoài web root | Thông báo trong form sửa ebook | Form sửa ebook hiện ô tải "File PDF khách sẽ tải" |
| S2 | Cấu hình PayPal: thêm `$settings['travelframe_paypal'] = [...]` vào `sites/default/settings.hosting.php`; tạo webhook `https://travelframe.sidevn.com/ebooks/paypal/webhook`, đăng ký các sự kiện `PAYMENT.CAPTURE.COMPLETED/PENDING/DENIED/REFUNDED/REVERSED`; chép Webhook ID vào settings. Nên bật **Sandbox** trước | `/travelframe-admin/ebooks/settings` | Trang settings không còn báo "Chưa cấu hình"; trang checkout không còn "Checkout is not open yet" |

Lưu ý thêm: Drupal đang báo có bản cập nhật bảo mật. Nên cập nhật cùng đợt này.

## Sau khi S1 và S2 xong

1. Rocky chọn file PDF trong form. Trình duyệt không cho agent tự chọn file.
   - File: `Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/TravelFrame-Hanoi-Handbook-2026-v04.pdf`
   - 5.723.069 byte, md5 `fe7ef24e1b2353a957454733e55fb0f6`.
2. Đổi trạng thái sang **Đang bán (published)** rồi Lưu.
3. Mua thử bằng PayPal **sandbox**: email tới, link tải về đúng md5, `/ebooks/resend` gửi lại được, đường dẫn file không tải được nếu không có token.
4. Chuyển PayPal sang Live. Ghi `Published-Ledger.md` kèm bằng chứng.

## Ảnh bìa trên thẻ: xong (12/11/2026)

Rocky đã tải ảnh 2:3 lên (fid 1000) và Claude đã Lưu. Thẻ trên `/ebooks` giờ hiện ảnh bìa thật. Xem [Publication](Publication.md).

## File bàn giao

- PDF bán: v04 như trên. sha256 `f4f3fe93174e282e4654174fa58bc8798b509ecbd1daada3651a94cd7fa221f6`.
- `store-assets/` gồm:
  - bìa 2:3 (1200×1800);
  - bìa 800 và 1600 px (webp);
  - og:image 1200×630;
  - 4 trang xem trước (p04, p09, p15, p20).

Form hiện không có ô cho og:image và ảnh xem trước. Nếu developer muốn thêm, file đã sẵn.

## Rollback phần nội dung

Sửa sản phẩm số 2 về giá trị cũ:

- Tên: "Hanoi, between the lines."
- Slug: `hanoi-between-the-lines`
- Tagline: "Food streets, rituals and the human rhythm behind the city's noise."
- Tagline VI: "Phố ăn, nghi thức và nhịp sống con người phía sau tiếng ồn của thành phố."
- Chữ bìa: "Hanoi, / \*between\* / the lines."
- Màu bìa: Xanh lá. Ấn bản 2026. Số trang để trống.
- Các ô eyebrow, lede, nội dung, mục lục, câu nhấn và bản VI khác để trống.
