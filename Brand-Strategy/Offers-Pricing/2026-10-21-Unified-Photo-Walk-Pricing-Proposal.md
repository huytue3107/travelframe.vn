# Offer & Pricing Comparison Proposal: Một bảng giá Photo Walk duy nhất

- **Ngày lập:** 2026-10-21
- **Phòng ban chủ trì:** Brand-Strategy
- **Trạng thái:** Superseded — thay bằng [bảng giá theo giờ](2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md)
- **Người phê duyệt:** Rocky
- **Giới hạn:** chưa đối chiếu được canonical vault (`/Users/macbook/SideAgency/SA/01-Projects/TravelFrame/Knowledge`) vì folder này chưa kết nối với phiên làm việc. Cần đối chiếu `03-Product-And-Guest-Experience.md` và `08-Decision-Log.md` trước khi duyệt.

---

## 1. Mục đích

Hiện có 5 hệ giá chạy song song và chưa hệ nào Approved. Website vẫn hiển thị hệ giá
15/09: khách solo chọn gói phổ biến nhất thấy **$300 cho 3 giờ**, trong khi phễu GA4 tuần
14–20/10 có 24 người qua bước 1 và 0 người bấm BOOK
(`Sales-CRM/Funnel/2026-10-21-Booking-Funnel-Diagnosis.md`). Đề xuất này chốt **một bảng
giá** dùng chung cho website, DM, ManyChat và quảng cáo.

## 2. Bảng đối chiếu đa nguồn

| Nguồn | Cấu trúc | Ví dụ giá | Vấn đề |
|---|---|---|---|
| Website (15/09, đang live) | Giá tour + giá ảnh/giờ + điểm thêm | Standard 3h + Complete = $300 | Trả hai lần, khó hiểu; card ghi "per person" nhưng estimator không nhân số khách |
| Website-Pricing-Fix-Recommendations | Giá theo phiên, theo số khách | Solo $75 / Couple $130 / Group $180 | Thấp hơn mặt bằng tầm trung; hứa giao trong 24h khi chưa kiểm soát được năng lực |
| Draft Survival Companion | Gói mồi 1h | $25–35 → upsell $75 / $160 | Gói mồi tốt nhưng chưa có người dẫn và quy trình |
| Media Kit B2B (17/09) | Tour theo chủ đề | $75–290; hoa hồng 15% | Dùng cho B2B, không dùng làm bảng giá lẻ |
| Honeymoon Đường Lâm (05/10) | Trọn gói cặp đôi | $180 / $350 / $650 | Ngách riêng, cần xe và MUA; giữ làm gói đặc biệt |
| Thị trường (research 30/09) | — | Gạo Nâu $99/60' · $139/90'; Cáo $120+; Airbnb $53/người | Mặt bằng tầm trung $99–229 |

## 3. Đề xuất chuẩn hóa: 4 gói + add-on

| Gói | Thời lượng | Khách | Bàn giao | **Phương án B (khuyến nghị)** | Phương án A (giá thấp) |
|---|---|---|---|---|---|
| Solo Photo Walk | 90 phút | 1 | 35 ảnh chỉnh màu | **$99** (~2.570.000đ) | $75 |
| Couple Story Walk | 2 giờ | 2 | 50 ảnh | **$149** (~3.870.000đ) | $130 |
| Friends & Family | 2,5 giờ | 3–5 | 70 ảnh | **$199** (~5.170.000đ) | $180 |
| Signature Visual Story | 3 giờ | 1–4 | 60 ảnh + 1 reel dọc ≤60s | **$229** (~5.950.000đ) | $199 |

Áp dụng cho mọi gói:
- **SLA:** 10 ảnh preview trong 24h, giao đủ trong 48h. Gói Express giao đủ trong 24h là add-on
  **+$30**, chỉ nhận khi lịch thợ còn trống. Như vậy chưa hứa 24h đại trà khi chưa có quy trình
  kiểm soát năng lực (theo guardrail của offer-governance).
- **Route:** khách chọn 1 trong 7 route chủ đề đang có trên website (Old Quarter, French
  Quarter, West Lake, Train Street…) ngay trong gói. Không tính thêm tiền theo từng điểm.
- **Add-on:** thêm 30 phút +$35 · thêm 1 người +$30 · Express 24h +$30 · áo dài theo giá đối tác.
- **Gói đặc biệt (báo giá riêng):** Honeymoon Đường Lâm, Full-day, nhóm 6–30 khách.
- **Giá tham chiếu VND:** 1 USD = 26.000đ; làm tròn đến hàng chục nghìn.

Lý do chọn phương án B: giá nằm ở đầu dưới của mặt bằng tầm trung ($99–229), thấp hơn Gạo Nâu
cho cùng thời lượng và cao hơn freelancer. Phù hợp định vị "local expert + visual story" và để
dư biên cho ads và hoa hồng 15% của đối tác lưu trú. Phương án A dễ bán hơn nhưng khi trừ hoa
hồng 15% và phí thanh toán thì biên mỏng.

## 4. Biên lợi nhuận và năng lực (giả định, cần Rocky xác nhận chi phí thật)

| Khoản (Solo $99 ≈ 2.570.000đ) | Giả định |
|---|---|
| Thù lao thợ chụp/host 90' + hậu kỳ | 600.000–900.000đ |
| Đồ uống / vé | 50.000–100.000đ |
| Phí thanh toán quốc tế ~4% | ~100.000đ |
| **Biên gộp trước ads** | **~58–70%** |
| Nếu qua đối tác (hoa hồng 15%) | ~43–55% |

Năng lực: mỗi thợ làm tối đa 2 phiên/ngày nếu cam kết giao đủ trong 48h. Gói Express 24h chỉ mở
khi thợ đó không có phiên thứ hai trong ngày.

## 5. Kiến nghị phê duyệt

1. Rocky chọn **Phương án B** (hoặc A) và xác nhận chi phí thợ thực tế.
2. Sau khi duyệt: lập DEC record, cập nhật site (Sales-CRM / Technology-Automation), script DM,
   ManyChat và brief chiến dịch WARM-PHOTO-DM theo cùng một bảng giá.
3. Lưu các hệ giá cũ làm lịch sử; không xóa.
