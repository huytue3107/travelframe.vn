---
title: "Email cảm ơn — bản ảnh do ChatGPT render"
owner: Sales-CRM
status: "Draft — v3 (THANK YOU mảnh) + bản ghép code, chờ Rocky chọn, chưa gửi"
created: 2026-11-15
---

# Bản ảnh

- Tạo trong ChatGPT (tài khoản Rocky), cùng chat với hình cắt dán A:
  https://chatgpt.com/c/6af956b6-26b8-83ec-8e41-206a79a2b974
- Kết quả: PNG 1024×1536, 2,3 MB. Đã tải về `~/Downloads/tf-email-thank-you-834aeaa2.png`.
- Soát chữ 15/11/2026: tất cả dòng đúng chính tả. Khác prompt một chỗ: chỉ "Hanoi story" in nghiêng đỏ
  (prompt yêu cầu "your Hanoi story").

## Nguyên tắc thiết kế đã dùng

- Ảnh chỉ chứa chữ cố định, không có tên khách, giá, ngày hay số điện thoại, nên dùng lại cho mọi khách.
- Thông tin riêng của từng booking (tên, tiền cọc, mã booking) vẫn đặt bằng chữ HTML trong
  `thank-you-booking.html`, vì model tạo ảnh dễ viết sai số.
- Email chỉ có một ảnh dễ vào mục Quảng cáo/Spam và không đọc được khi hộp thư chặn ảnh. Khi gửi,
  nên đặt ảnh trong khung HTML có alt text, link ảnh tới WhatsApp, và thêm ít nhất một dòng chữ thật.

## Prompt

```text
New task. Design a finished, vertical marketing email graphic for TravelFrame, a small local photo-walk team in Hanoi: a "thank you for booking" email rendered as ONE image. Portrait 2:3 (1024x1536). Think like an editorial art director: minimal, contemporary, lots of negative space, strict grid.

[CANVAS AND PALETTE] Warm off-white paper background #EFE4D9 with very subtle paper grain, edge to edge. Ink black #1A1F21 for type, brand red #BD100A as the only accent, muted grey-brown #5B6266 for small text. No gradients, no borders around the canvas.

[ARTWORK] Reuse the exact paper-cut collage from the first image in this chat (variant A ...). Place it in the upper-middle area, about 60% of the canvas width, slightly right of centre, with its ground line extending as a thin black rule.

[LAYOUT] 1. "TRAVELFRAME — HANOI" / "THANK YOU NOTE". 2. Huge serif "Thank you" + red full stop. 3. "for trusting us with your Hanoi story". 4. Rule + three columns: 01 PICK YOUR DATE / Send us a rough date. 02 BEFORE YOUR WALK / Meeting point and outfit ideas. 03 ON THE DAY / We walk at your pace. 5. Black button "TELL US YOUR DATE" + red arrow. 6. "See you in Hanoi" / "@travelframe.vn".

[TYPOGRAPHY] Modern editorial serif + clean geometric grotesk. Every word spelled exactly as written.

[AVOID] No other text, no prices, no dates, no phone numbers, no QR codes, no logos, no people, no emoji, no device mockup, no extra objects.
```

Bản đầy đủ của prompt nằm trong chat ChatGPT ở trên.

## v2 — chữ THANK YOU dọc (15/11/2026)

Rocky yêu cầu chữ "Thank you" giống chữ "CONFIRMED." trên thiệp xác nhận.

- Kết quả: PNG 1024×1536. Đã tải về `~/Downloads/tf-email-thank-you-v2-9c73c133.png`.
- Thay đổi so với v1: "THANK YOU." in hoa, sans-serif đậm, chạy dọc mép phải từ trên xuống, dấu chấm đỏ;
  dòng chính đổi thành "For trusting us with / your Hanoi story" (cụm sau in nghiêng đỏ); bỏ chữ "THANK YOU NOTE".
- Soát chữ: tất cả dòng đúng chính tả.
- Prompt sửa (tóm tắt): giữ nguyên nền, bảng màu, hình cắt dán và các dòng chữ khác; đặt "THANK YOU." dọc
  mép phải, xoay 90° theo chiều kim đồng hồ, grotesk đậm in hoa màu `#1A1F21`, cao gần hết khung, cách mép
  phải 48px, dấu chấm là chấm tròn `#BD100A`; nội dung còn lại dồn vào cột trái khoảng 75% chiều rộng.

## v3 — chữ THANK YOU mảnh hơn (15/11/2026)

Rocky yêu cầu chữ "THANK YOU" nhạt hơn, giống độ đậm chữ "CONFIRMED." trên thiệp.

- Lượt 1 (`09cfa9cb`): đúng độ mảnh nhưng ChatGPT vẽ lại hình cắt dán khác hình A. Bỏ.
- Lượt 2 (`fcd2d632`): độ mảnh giữ đúng, hình cắt dán gần hình A (có đá đỉnh vòm, ô cửa nan quạt), nhưng
  cửa chớp nằm đè trước khung cửa và tiêu đề serif đậm hơn v2. Đã tải về
  `~/Downloads/tf-email-thank-you-v3-fcd2d632.png`.

## Bản ghép bằng code (đối chiếu)

Vì ChatGPT vẽ lại hình mỗi lần sửa, Claude ghép thêm một bản dùng đúng file hình A gốc và đúng font
của chữ "CONFIRMED." (Be Vietnam Pro SemiBold), bố cục theo bản ChatGPT.

- Nguồn: `image/thank-you-image.html` (font lấy từ `Creative-Production/Projects/Booking-Confirmation-Card-2026/fonts/`).
- Xuất: `image/tf-email-thank-you-composite.png` (2048×3072) và `image/tf-email-thank-you-composite-email.jpg`
  (1024×1536, 146 KB).

## Đổi cặp font theo ảnh mẫu Rocky gửi (15/11/2026)

Ảnh mẫu dùng **Instrument Serif** (tiêu đề) + **Lavonia** (chữ phụ, viết tay).

- Instrument Serif: Google Fonts, giấy phép OFL. Dùng cho "For trusting us with" và số 01–03.
- Lavonia: tên đầy đủ "ED Lavonia", font thương mại (YouWorkForThem, khoảng 15 USD, kiểm tra 15/11/2026).
  Workspace chưa có giấy phép nên đang dùng **Great Vibes** (OFL) thay tạm cho "your Hanoi story" và
  "See you in Hanoi".
- Nếu mua Lavonia: đặt file vào `Creative-Production/Projects/Booking-Confirmation-Card-2026/fonts/Lavonia.otf`
  rồi render lại `image/thank-you-image.html`; template tự ưu tiên Lavonia, không cần sửa code.
- Chữ dọc "THANK YOU." giữ Be Vietnam Pro SemiBold để khớp chữ "CONFIRMED." trên thiệp.
