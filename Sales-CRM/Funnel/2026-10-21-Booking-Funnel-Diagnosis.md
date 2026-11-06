---
title: Chẩn đoán phễu /booking — vì sao chưa có booking
owner: Sales-CRM
status: Review
created: 2026-10-21
---

# Chẩn đoán phễu /booking (2026-10-21)

## Kết luận

Khách có bắt đầu đặt, nhưng không ai bấm BOOK. Có ba nguyên nhân, xếp theo mức tác động:

1. **Giá hiển thị quá cao so với thị trường.** Ví dụ chọn Standard + Complete thì thấy ngay
   **$300 cho 3 giờ**. Các đối thủ tầm trung bán $99–229 (xem
   `Research-Insights/Competitive/2026-09-30-Hanoi-Local-Photographer-Market-Research.md`).
   Công thức "giá tour + giá ảnh theo giờ" khiến khách thấy mình trả hai lần.
2. **Form bắt buộc WhatsApp ID + WhatsApp phone.** Khách Mỹ ít dùng WhatsApp. Form
   không cho chọn email hoặc Instagram làm kênh liên hệ chính, và còn bắt tick ô điều khoản.
3. **Traffic phần lớn không phải khách mục tiêu.** Tuần 14–20/10 có 231/246 sessions (94%)
   từ Việt Nam và chỉ 5 sessions từ Mỹ (tuần trước là 43). Nhiều lượt đi trong phễu có thể là
   người trong nhóm tự kiểm tra.

## Số liệu phễu (GA4, nguồn `Data-Analytics/Snapshots/2026-10-21-Performance-Review/ga4-detail.json`)

| Event | 07–13/10 | 14–20/10 |
|---|---|---|
| view_tour | 31 | 323 |
| begin_booking | 6 | 28 |
| add_to_cart (xong bước 1) | 3 | 24 |
| booking_step_view | 3 | 60 |
| begin_checkout | — | 7 |
| contact_click | — | 6 |
| purchase (bấm BOOK thành công) | 0 | 0 |

Rơi lớn nhất xảy ra ở đoạn **add_to_cart 24 → begin_checkout 7 → purchase 0**, tức lúc khách
thấy tổng giá ở bước 2 và lúc điền form liên hệ ở bước 3–4.

GA4 chưa đặt event nào làm **key event** (keyEvents = 0 cho mọi event), nên báo cáo
"conversion" hiện luôn bằng 0 dù có event.

## Quan sát trên site (21/10, chỉ đọc, không gửi form)

- `/booking` là configurator JS 4 bước, không dùng `<form>`. Tracking dataLayer đã có:
  `booking_step_view`, `add_to_cart`, `begin_checkout`, `purchase`.
- Bước 1 vẫn dùng bảng giá cũ 15/09: Photo Phone $8/giờ, Explorer $20, Complete $50, VIP $80;
  tour Experience $40, Standard $150, Plus $270, Premium $420, Customize **$0**.
- Bước 2: mỗi điểm thêm +$10–30; cập nhật tổng ước tính trực tiếp.
- Bước 3: bắt buộc WhatsApp ID và WhatsApp phone; Email và Country không bắt buộc; có popup
  "Spin for a gift".
- Bước 4: bắt buộc tick ô điều khoản trước khi bấm BOOK.
- `/en/booking` trả về **404**, trong khi link ngôn ngữ dùng `/booking` và `/booking?lang=vi`.
- Lỗi chính tả ở gói Photo Phone: "Capturing every moments thoughout", "Iphone".

## Đề xuất sửa (cần Rocky duyệt trước khi sửa site live)

| # | Việc | Tác động | Công |
|---|---|---|---|
| 1 | Thay configurator bước 1 bằng bảng giá theo phiên đã duyệt (xem đề xuất giá cùng ngày) | Cao | Trung bình |
| 2 | Cho chọn kênh liên hệ chính: Email / WhatsApp / Instagram; chỉ bắt buộc tên + 1 kênh + ngày đi + số khách | Cao | Thấp |
| 3 | Thêm nút "Not sure yet? Ask on Instagram DM" ngay cạnh tổng giá ở bước 2 | Trung bình | Thấp |
| 4 | Đặt `purchase` và `contact_click` làm key event trong GA4 | Đo lường | Thấp |
| 5 | Lọc traffic nội bộ (IP văn phòng/nhà + loại `/admin`) | Đo lường | Thấp |
| 6 | Redirect `/en/booking` → `/booking`; sửa chính tả; ẩn gói Customize $0 hoặc đổi thành "Request a quote" | Thấp | Thấp |
| 7 | Tạm tắt popup "Spin for a gift" ở bước liên hệ (A/B test sau) | Thấp–TB | Thấp |

## Cần kiểm tra thêm

- Trong backend Drupal có booking nào đã gửi thành công không (để chắc `purchase` = 0 là đúng).
- Mã nguồn theme/module booking không nằm trong workspace này. Cần biết repo nào để sửa.
