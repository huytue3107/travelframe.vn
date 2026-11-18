---
title: Quà tặng photo walk — đổi ngày và hoàn tiền theo mốc hủy
owner: Brand-Strategy
status: Approved
created: 2026-11-12
updated: 2026-11-12
approver: Rocky
---

# DEC-20261112-GIFT-DATE-CHANGE-REFUND

## Context

Bài `/news/christmas-photoshoot-hanoi` (node 128) có mục "Give a Hanoi photo walk as a Christmas gift" (Rocky chốt 12/11). Cần điều khoản đổi ngày và hoàn tiền trước khi bán quà tặng.

## Decision

- Người nhận quà được đổi ngày.
- Hoàn tiền khi hủy, tính theo thời gian trước giờ chụp:

| Hủy trước | Hoàn |
|---|---|
| ≥ 72 giờ | 90% |
| ≥ 48 giờ | 50% |
| ≥ 24 giờ | 30% |
| ≥ 12 giờ | 10% |

## Not decided

- Hủy dưới 12 giờ (suy ra 0%, chưa được nói rõ).
- Thời hạn hiệu lực của phiếu quà tặng; số lần được đổi ngày; hạn báo đổi ngày.
- Chính sách này áp dụng cho mọi booking hay chỉ quà tặng.
- Cách thanh toán và đặt cọc (đã treo từ DEC-20261021-HOURLY-TIER-PRICING).

## Approval Evidence

Rocky, chat 12/11/2026: "có đổi ngày hoàn tiền theo chu kỳ nếu huỷ trước 72h hoàn 90%, 48h hoàn 50%, 24h hoàn 30%; 12h hoàn 10%".

## Applied

- Node 128 (live 12/11/2026): mục "Date changes and cancellations" + FAQ quà tặng. Revision log có ghi.
