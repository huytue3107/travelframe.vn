---
title: Khối đặt lịch "Christmas photo walk on Hàng Mã" cho node 125 và 127
owner: Marketing-Growth
status: Draft — chờ Rocky duyệt nội dung trước khi đăng
created: 2026-11-14
source: AI Visibility run b345a7cd (14/11): ChatGPT trích /news/christmas-in-hanoi ở 3/17 câu (2 câu về Hàng Mã/đồ trang trí Noel); GA4 có 2 phiên chatgpt.com / ai-assistant (13–14/11)
pricing_source: Executive/DEC-20261021-HOURLY-TIER-PRICING.md (Approved)
---

# Mục tiêu

Người đọc đến từ ChatGPT đang hỏi về Hàng Mã và đồ trang trí Noel. Bài hiện chỉ có CTA chung ở cuối
trang. Thêm một khối ngắn ngay trong mục Hàng Mã để dẫn sang /hanoi-photoshoot và IG DM.

# Thay đổi đề xuất

## A. Node 125 `/news/christmas-in-hanoi`

Vị trí: ngay sau đoạn "...Our <a href="/news/hang-ma-street-christmas-photo-spots">Hàng Mã Christmas photo guide</a> has the details.</p>"
và trước `<h3>3. Hoàn Kiếm Lake and the walking zone</h3>`. Không đổi chữ nào khác trong bài.

File chèn: `snippet-node-125.html`

## B. Node 127 `/news/hang-ma-street-christmas-photo-spots`

Cùng khối, đặt cuối phần mẹo chụp (trước FAQ nếu có). File chèn: `snippet-node-127.html`

# Cam kết trong khối (đối chiếu DEC)

| Câu trong khối | Nguồn |
|---|---|
| from 30 USD per hour, 1-hour minimum, up to 2 guests | DEC Basic $30/h, tối thiểu 1h, tối đa 2 khách |
| all original photos within 24 hours | DEC: ảnh gốc 24h |
| 10–15 edited photos per hour within 48 hours | DEC Basic: 10–15 ảnh chỉnh sửa/giờ; giao 48h |
| One area (Hàng Mã and nearby Old Quarter streets) | DEC Basic: 1 khu |

Không nêu cọc/thanh toán (chưa quyết định). Không có fake urgency, không Train Street.

# Việc phát hiện thêm (cần Sơn)

Khối CTA cuối mọi bài News trong theme ghi "Want to taste it yourself?" (template ẩm thực) kèm WhatsApp
"book a private tour". Đề xuất đổi thành chữ trung tính, ví dụ "Planning your Hanoi days?", hoặc cho phép
mỗi bài đặt tiêu đề CTA riêng. Đây là sửa template, không sửa được trong thân bài.

# Khi đăng (sau khi Rocky duyệt)

1. Sửa body node 125 và 127 (Full HTML), revision log: "Christmas photo walk CTA in Hàng Mã section, 14 Nov 2026".
2. Kiểm tra ẩn danh: HTTP 200, link /hanoi-photoshoot, IG và WhatsApp mở đúng, mobile 375px.
3. Request Indexing GSC + Bing URL Submission cho 2 URL.
4. Ghi Publication.md của cluster Christmas (mục "Cập nhật").
5. Theo dõi: phiên chatgpt.com trên dashboard, AI Visibility tuần 18/11.

# Rollback

Revisions của node 125 và 127 (bản trước 14/11).
