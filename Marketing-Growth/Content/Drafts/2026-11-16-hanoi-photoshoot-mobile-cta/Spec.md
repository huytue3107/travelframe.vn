---
title: "Thanh WhatsApp cố định trên mobile cho /hanoi-photoshoot"
owner: Marketing-Growth → Technology-Automation (Sơn)
status: Draft — Rocky duyệt soạn 16/11; chờ Rocky duyệt nội dung trước khi giao Sơn
date: 2026-11-16
ticket: Marketing-Growth/SEO/2026-10-14-Developer-SEO-Ticket.md (D20)
---

# Thanh WhatsApp cố định trên mobile cho /hanoi-photoshoot (node 104)

## Vì sao làm

- ChatGPT đang dẫn khách vào trang này: AI Visibility 16/11 trích /hanoi-photoshoot trong 11/46 câu trả lời, có câu xếp TravelFrame số 1. GA4 13–15/11: 3 phiên từ chatgpt.com đều vào trang này.
- Khách có đọc nhưng không liên hệ: phiên ChatGPT ngày 15/11 (Hà Nội, điện thoại) ở 2 phút 14 giây, cuộn gần hết trang, 0 lượt bấm liên hệ.
- Cả site 01–15/11 chỉ có 2 sự kiện `contact_click` (1 ở trang chủ, 1 ở /hanoi-photoshoot).
- Site đã có cụm nút nổi `.floating-contact` (3 nút tròn WhatsApp / Instagram / điện thoại, chỉ có icon). Nút WhatsApp đang điền sẵn câu chung "interested in a private photo tour", không nói giá, không gợi khách gửi ngày.

## Đề xuất

### 1. Thanh cố định dưới đáy màn hình (chỉ mobile, chiều rộng < 768px)

Áp dụng: node 104 (/hanoi-photoshoot). Giai đoạn 2 nếu số tốt: các bài cùng cụm (/news/vietnam-photoshoot, /news/ao-dai-photoshoot-hanoi, /news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026, /news/christmas-photoshoot-hanoi).

```
┌──────────────────────────────────────────────┐
│ Private photoshoot · from $30/h  [Check my date] │
│ Originals in 24h                                 │
└──────────────────────────────────────────────┘
```

| Thành phần | Nội dung |
|---|---|
| Dòng 1 | `Private photoshoot · from $30/h` |
| Dòng 2 (chữ nhỏ) | `All originals within 24h` |
| Nút | `Check my date` → WhatsApp |
| Link | `https://wa.me/84925148581?text=` + câu điền sẵn bên dưới (URL-encode) |
| Câu điền sẵn | `Hi TravelFrame! I'd like a private photoshoot in Hanoi. My date: ___ · Number of people: ___` |

Giá và cam kết lấy đúng `Executive/DEC-20261021-HOURLY-TIER-PRICING.md` (Basic $30/giờ, ảnh gốc trong 24 giờ). Không thêm câu khuyến mãi hay "chỉ còn X slot".

Hành vi:
- Hiện sau khi khách cuộn qua phần hero (khoảng 25% trang) hoặc sau 8 giây; không hiện ngay khi vừa tải trang.
- Trên trang có thanh này thì ẩn cụm `.floating-contact` để không có hai nút WhatsApp chồng nhau.
- Cao tối đa 64px, chừa `env(safe-area-inset-bottom)` cho iPhone; không che nút cookie/consent nếu có.
- Nút tối thiểu 44×44px, tương phản chữ/nền đạt WCAG AA, `aria-label="Check your date with TravelFrame on WhatsApp"`.
- Không dùng nút đóng có cookie; giữ đơn giản.

### 2. Đo lường

- Gắn `data-channel="whatsapp"` và `data-placement="sticky_mobile_photoshoot"` lên link để GTM bắn `contact_click` với 2 custom dimension đã có (Contact channel, Contact placement).
- Kiểm tra: mở trang trên điện thoại, bấm nút, thấy `contact_click` với placement `sticky_mobile_photoshoot` trong GA4 Realtime.

### 3. Mục tiêu và cách đọc

- Mốc: 01–15/11 trang có 7 người dùng và 1 `contact_click`.
- Đọc sau 14 ngày từ ngày lên: số `contact_click` placement `sticky_mobile_photoshoot` và số lead trong Lead-Pipeline-Tracker ghi "WhatsApp – từ website".
- Số mẫu còn nhỏ, nên đọc như tín hiệu hướng, không kết luận phần trăm.

## Rollback

Thanh nằm trong commit theme riêng; revert commit để quay lại cụm nút nổi cũ.
