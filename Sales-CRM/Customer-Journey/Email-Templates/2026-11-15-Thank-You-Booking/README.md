---
title: "Email cảm ơn khách đã đặt TravelFrame (mẫu dùng lại)"
owner: Sales-CRM
requested_by: Rocky (chat 15/11/2026: mẫu email marketing, trước tiên là mail cảm ơn khách đã tin tưởng chọn TravelFrame)
status: "Draft — chờ Rocky duyệt, chưa gửi khách nào"
created: 2026-11-15
voice: ../../../../Brand-Strategy/2026-10-22-TravelFrame-Voice-And-Style-Guide.md
---

# Email cảm ơn sau khi khách đặt cọc

Gửi ngay sau khi nhận cọc, kèm hoặc sau email xác nhận booking. Phong cách đồng bộ với thiệp xác nhận
đương đại (`Creative-Production/Projects/Booking-Confirmation-Card-2026/`).

## File

| File | Dùng để |
|---|---|
| `thank-you-booking.html` | Mẫu HTML chuẩn email: bảng, CSS inline, rộng 600px, tự xếp dọc trên điện thoại |
| `hero-collage-A.jpg` | Ảnh đầu email (1200×1033, 199 KB), cắt từ hình A do ChatGPT tạo ngày 15/11/2026 |
| `sample-elena.json` | Dữ liệu mẫu để xem trước |
| `preview.py` | Điền dữ liệu mẫu và chụp bản xem trước; báo lỗi nếu còn thẻ chưa điền |
| `preview-desktop.png`, `preview-mobile.png` | Bản xem trước 640px và 375px |

## Tiêu đề và preheader

- **Tiêu đề (chọn một):**
  1. `Thank you for choosing TravelFrame, {{first_name}}`
  2. `Your Hanoi photo walk is booked. Here's what's next`
  3. `Your spot in Hanoi is held`
- **Preheader** (đã có trong HTML): `Your spot is held. Here's what happens before we meet in Hanoi.`

## Thẻ cần điền

| Thẻ trong mẫu | Ví dụ | Mailchimp | Brevo |
|---|---|---|---|
| `{{first_name}}` | Elena | `*\|FNAME\|*` | `{{ contact.FIRSTNAME }}` |
| `{{booking_ref}}` | TF-20261115-BDAY | merge field tự tạo | thuộc tính contact tự tạo |
| `{{experience_name}}` | Birthday photo walk, French Quarter (2 hours, private) | như trên | như trên |
| `{{session_date}}` | To be confirmed (valid until 15.05.2027) | như trên | như trên |
| `{{deposit_paid}}` | 500,000 VND | như trên | như trên |
| `{{balance_due}}` | ~1,450,000 VND | như trên | như trên |
| `{{gallery_delivery}}` | within 24 hours | như trên | như trên |
| `{{host_name}}` | Rocky | như trên | như trên |
| `{{whatsapp_link}}` | https://wa.me/84XXXXXXXXX | như trên | như trên |
| `{{website_url}}` | https://travelframe.sidevn.com | như trên | như trên |
| `{{hero_image_url}}` | link ảnh đã tải lên | tải ảnh vào Content Studio rồi dán link | tải ảnh vào Image gallery |
| `{{unsubscribe_url}}` | link huỷ đăng ký | `*\|UNSUB\|*` | `{{ unsubscribe }}` |

Ảnh trong email phải là link công khai (https). Đường dẫn file trên máy sẽ không hiện ở hộp thư khách.

## Cần Rocky xác nhận trước khi gửi

- [VERIFY] Số WhatsApp chính thức để làm `{{whatsapp_link}}`.
- [VERIFY] Tên miền: workspace đang dùng `travelframe.sidevn.com`; chân email ghi chữ `TRAVELFRAME.VN`.
- [VERIFY] Bước 02 là một cam kết dịch vụ: "vài ngày trước buổi chụp, gửi điểm hẹn, gợi ý trang phục, kiểm tra thời tiết".
- [VERIFY] Thời gian giao ảnh theo từng gói (`{{gallery_delivery}}`): gói của Elena là 24 giờ.
- Người ký (`{{host_name}}`): Rocky hay host phụ trách buổi chụp.

## Font

Newsreader và Be Vietnam Pro tải từ Google Fonts, hiện được trên Apple Mail và iOS. Gmail và Outlook
dùng Georgia và Arial thay thế. Bố cục đã kiểm tra với cả hai trường hợp.

## Xem lại bản xem trước

```bash
python3 -I preview.py thank-you-booking.html sample-elena.json preview
```

Cần `playwright` và Chromium hoặc Google Chrome.
