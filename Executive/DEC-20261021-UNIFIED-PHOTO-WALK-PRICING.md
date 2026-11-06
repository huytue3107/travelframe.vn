---
title: Chốt một bảng giá Photo Walk theo phiên (Phương án B)
owner: Brand-Strategy
status: Superseded
created: 2026-10-21
updated: 2026-10-21
approver: Rocky
---

# DEC-20261021-UNIFIED-PHOTO-WALK-PRICING

> **Superseded 2026-10-21** bởi [DEC-20261021-HOURLY-TIER-PRICING](DEC-20261021-HOURLY-TIER-PRICING.md).

## Context

Có 5 hệ giá song song. Website hiển thị công thức "giá tour + giá ảnh theo giờ" (ví dụ $300 cho
3 giờ). GA4 tuần 14–20/10: 24 add_to_cart, 7 begin_checkout, 0 purchase. Đề xuất:
[2026-10-21-Unified-Photo-Walk-Pricing-Proposal](../Brand-Strategy/Offers-Pricing/2026-10-21-Unified-Photo-Walk-Pricing-Proposal.md).

## Decision

Áp dụng Phương án B cho website, DM, ManyChat và quảng cáo:

| Gói | Thời lượng | Khách | Bàn giao | Giá |
|---|---|---|---|---|
| Solo Photo Walk | 90 phút | 1 | 35 ảnh chỉnh màu | $99 (~2.570.000đ) |
| Couple Story Walk | 2 giờ | 2 | 50 ảnh | $149 (~3.870.000đ) |
| Friends & Family | 2,5 giờ | 3–5 | 70 ảnh | $199 (~5.170.000đ) |
| Signature Visual Story | 3 giờ | 1–4 | 60 ảnh + 1 reel dọc ≤60s | $229 (~5.950.000đ) |

- SLA: 10 ảnh preview trong 24h, giao đủ trong 48h. Express 24h +$30 khi lịch thợ cho phép.
- Add-on: thêm 30 phút +$35; thêm 1 người +$30.
- Honeymoon, full-day, nhóm 6–30 khách: báo giá riêng.
- Hủy miễn phí đến 48 giờ trước giờ tour đã xác nhận (giữ điều khoản hiện có).

## Not decided

- Chi phí thợ thực tế (biên lợi nhuận trong đề xuất là giả định).
- Mức đặt cọc và phương thức thanh toán (P0 legal/payment model).
- Đối chiếu canonical vault chưa làm; nếu vault mâu thuẫn, ghi vào decision log, không tự chọn.

## Impact

- Sales-CRM / Technology-Automation: sửa `/booking` theo bảng giá này (thay đổi live cần Rocky duyệt từng lần lưu).
- Marketing-Growth: cập nhật script DM, ManyChat, brief CMP-202610-WARM-PHOTO-DM.
- Hệ giá cũ giữ lại làm lịch sử.

## Approval Evidence

Rocky, chat hiện tại, 2026-10-21: chọn "B: $99/149/199/229 (Recommended)".
