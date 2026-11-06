---
title: Ticket sửa /booking — giá theo giờ và form liên hệ
owner: Sales-CRM
status: Review
created: 2026-10-24
approver: Rocky
---

# Ticket sửa /booking (2026-10-24)

**Nguồn:** [Chẩn đoán phễu /booking (21/10)](2026-10-21-Booking-Funnel-Diagnosis.md) ·
[DEC-20261021-HOURLY-TIER-PRICING](../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md) ·
[Báo cáo hằng ngày 24/10](../../Data-Analytics/Reports/2026-10-24-TravelFrame-Daily-Performance-Report.md)

**Trạng thái:** Review. Chưa sửa gì trên site live. Cần Rocky duyệt từng hạng mục.

## Vấn đề

Tuần 14–20/10: `add_to_cart` 24 → `begin_checkout` 7 → `purchase` 0. Ngày 24/10: `/tours`
4 views → `/booking` 0 views, 0 lead, $0. Khách rơi ở bước 2 (thấy tổng giá theo bảng cũ, ví dụ
$300/3h) và bước 3–4 (form bắt buộc WhatsApp, popup, ô điều khoản).

## Hạng mục

| # | Việc | Ưu tiên | Tác động | Công | Rocky duyệt |
|---|---|---|---|---|---|
| 1 | Thay bước 1 configurator bằng bảng giá theo giờ Basic/Premium/VIP | P0 | Cao | Trung bình | ☐ |
| 2 | Form liên hệ: chọn kênh chính Email / WhatsApp / Instagram | P0 | Cao | Thấp | ☐ |
| 3 | Nút "Not sure yet? Ask on Instagram DM" cạnh tổng giá ở bước 2 | P1 | Trung bình | Thấp | ☐ |
| 4 | Đặt `purchase` và `contact_click` làm key event trong GA4 | P1 | Đo lường | Thấp | ☐ |
| 5 | Lọc traffic nội bộ (IP nhà/văn phòng, loại `/admin`) | P1 | Đo lường | Thấp | ☐ |
| 6 | Redirect `/en/booking` → `/booking`; sửa chính tả; bỏ gói Customize $0 | P2 | Thấp | Thấp | ☐ |
| 7 | Tạm tắt popup "Spin for a gift" ở bước liên hệ | P2 | Thấp–TB | Thấp | ☐ |

### 1. Bảng giá theo giờ ở bước 1 (P0)

Bỏ cách tính "giá tour + giá ảnh theo giờ" (Photo Phone $8, Explorer $20, Complete $50, VIP $80;
tour Experience $40 … Premium $420). Khách chỉ chọn **tầng × số giờ × số khách**.

| Tầng | Giá | Tối thiểu | Khu | Ảnh chỉnh sửa | Thêm |
|---|---|---|---|---|---|
| Basic | $30/giờ | 1h | 1 | 10–15/giờ | — |
| Premium | $60/giờ | 2h | 2–3 | 20/giờ | Trang điểm nhẹ, recap ≤60s, 1 polaroid |
| VIP | $99/giờ | 2h | 2–3 | 30/giờ | Premium + trang phục, video 2–3 phút, 5 polaroid |

- Công thức: `giá tầng × số giờ + $15 × số giờ × (số khách − 2)` nếu số khách > 2.
- Bộ chọn giờ không cho chọn dưới mức tối thiểu của tầng.
- Hiển thị dưới tổng giá: "All original photos in 24h · edited photos & video in 48h ·
  taxi between areas and entrance tickets not included".
- Bước 2 (chọn điểm) không cộng thêm $10–30 mỗi điểm nữa; chỉ giới hạn số khu theo tầng.
- Cập nhật cùng bảng giá trên `/tours` để hai trang khớp nhau.

**Nghiệm thu:** Basic 2h = $60 · Premium 2h = $120 · Premium 3h = $180 · VIP 2h = $198 ·
VIP 3h, 3 khách = $342. Không còn giá $8/h hay $300/3h ở bất kỳ bước nào.

### 2. Form liên hệ (P0)

- Bắt buộc: tên, **một** kênh liên hệ chính (Email / WhatsApp / Instagram handle), ngày đi,
  số khách.
- Không bắt buộc: country, ghi chú, kênh phụ.
- Ô điều khoản: thay bằng dòng "By sending, you agree to our [terms]" cạnh nút gửi, không bắt tick.
- Đổi nút "BOOK" thành "Send booking request" và thêm dòng "No payment now — we reply within
  24h to confirm". Chưa thu cọc vì mức cọc và cách thanh toán chưa chốt.

**Nghiệm thu:** gửi được form chỉ với tên + email + ngày + số khách; event `purchase` (hoặc
`booking_request_submit`) bắn đúng một lần; request về đúng nơi team đang nhận.

### 3. Nút DM ở bước 2 (P1)

Nút phụ cạnh tổng giá, mở `https://ig.me/m/travelframe.vn`, bắn event `contact_click` với
`method=instagram`. Không thay nút chính.

### 4. Key event GA4 (P1)

Đánh dấu `purchase` và `contact_click` là key event. Hiện `keyEvents = 0` nên mọi báo cáo
conversion luôn bằng 0.

### 5. Lọc traffic nội bộ (P1)

Định nghĩa internal traffic theo IP nhà/văn phòng, bật filter (Testing → Active sau 3 ngày
đối chiếu); loại `/admin` khỏi báo cáo. Theo
[GA4 & Drupal Traffic Hygiene Runbook](../../Technology-Automation/Runbooks/2026-10-13-GA4-Drupal-Traffic-Hygiene-Runbook.md).

### 6. Dọn lỗi nhỏ (P2)

- Redirect 301 `/en/booking` → `/booking` (đang 404).
- Sửa "Capturing every moments thoughout" → "Capturing every moment throughout"; "Iphone" → "iPhone".
- Bỏ gói Customize $0, hoặc đổi thành nút "Request a custom quote".

### 7. Popup "Spin for a gift" (P2)

Tắt ở bước 3–4. Nếu muốn giữ, A/B test sau khi có ≥30 phiên vào bước liên hệ.

## Đo lường sau khi sửa

So 7 ngày trước và 7 ngày sau ngày deploy (đủ ≥30 phiên mới kết luận):
`/tours` → `/booking`, `add_to_cart` → `begin_checkout`, `begin_checkout` → `purchase`,
số `contact_click`, số request thật về inbox. Ghi vào báo cáo hằng ngày theo
`Data-Analytics/Daily-Reporting-Standard.md`.

## Rollback

Trước khi sửa: export cấu hình TravelFrame settings và theme hiện tại trong Drupal. Nếu lỗi gửi
form hoặc giá tính sai: khôi phục bản export, giữ nút WhatsApp/IG DM nổi để không mất lead.

## Cần Rocky trả lời trước khi làm

1. Duyệt hạng mục nào (tick cột "Rocky duyệt").
2. Mã nguồn theme/module booking Drupal nằm ở repo/máy nào, và ai deploy.
3. Booking request gửi về đâu (email nào / Drupal backend) để kiểm tra nghiệm thu.
4. Trang điểm và trang phục trong Premium/VIP tính cho 1 hay cả 2 khách (ảnh hưởng mô tả gói).
5. Có thu cọc online ngay không, hay giữ "request trước, xác nhận sau" như mục 2.
