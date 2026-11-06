---
title: DM price reply script (bảng giá theo giờ 21/10)
owner: Sales-CRM
status: Draft
created: 2026-10-21
source: ../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md
supersedes: 2026-09-17-Inbound-DM-WhatsApp-Pitching-Script.md (phần giá)
---

# DM Price Reply Script

Chỉ dùng giá trong DEC-20261021-HOURLY-TIER-PRICING. Không hứa Train Street access, xe đưa đón
hoặc vé tham quan. Mọi báo giá ghi vào `Data-Analytics/Lead-Pipeline-Tracker.csv` (stage `Quoted`).

## 1. Khách hỏi giá

> Hi {first_name}! 😊 We keep it simple, with 3 plans priced by the hour (up to 2 people):
>
> 📷 **Basic, $30/hour**: 1 area, all original photos + 10–15 edited photos per hour
> ✨ **Premium, $60/hour** (min. 2h): 2–3 areas, light makeup, a short recap video, 1 printed polaroid, 20 edited photos per hour
> 👑 **VIP, $99/hour** (min. 2h): everything in Premium + outfit (áo dài or styled look), a longer 2–3 min video, 5 polaroids, 30 edited photos per hour
>
> Original photos arrive within 24h, edited photos and video within 48h.
> When will you be in Hanoi, and how many of you?

## 2. Đề xuất khi đã biết ngày + số khách

> For {group_size} on {date}, most guests pick **{plan} for {hours} hours = ${total}**.
> We'd cover {areas}. Shall I check a photographer for {time}?

Cách tính: giá/giờ × số giờ; từ khách thứ 3 cộng $15/giờ/người.
Ví dụ: Premium 2h = $120 · VIP 3h cho 3 khách = $297 + $45 = $342.

## 3. Gợi ý nâng gói (một lần, không ép)

> If you'd like help with posing and a recap video for Instagram, Premium adds makeup, more spots
> and a polaroid for $60/hour. Happy to keep it Basic too!

## 4. Khách thấy đắt

> No problem! Basic starts at just $30 for one hour, and you still get all the original photos.

Không giảm giá ngoài bảng. Nếu khách bỏ đi, ghi `Lost` với lý do "price".

## Chưa có (chờ Rocky)

- Trang điểm/trang phục cho 1 hay cả 2 khách. Tạm thời trả lời "for the main guest" và
  hỏi lại Sales-CRM nếu khách đi cặp.
- Đặt cọc và thanh toán: xác nhận lịch qua DM, **chưa thu tiền**.
