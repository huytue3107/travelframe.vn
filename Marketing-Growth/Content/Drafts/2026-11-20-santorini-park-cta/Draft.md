---
title: "Node 86 Santorini Park: thêm CTA đặt buổi chụp ở cuối bài"
url: "/news/santorini-park-lovely-photo-spot-right-outside-hanoi"
node: 86
status: "Published 2026-11-20 — xem Publication.md"
date: "2026-11-20"
reason: "Bài đứng #2 cho 'santorini park hanoi' khi tìm từ Mỹ (SERP check 20/11, Marketing-Growth/SEO/2026-11-20-SERP-Check/US-San-Francisco). Rocky đồng ý thêm CTA vào cuối bài (chat 20/11)."
pricing_source: "Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md (Approved, DEC-20261021-HOURLY-TIER-PRICING)"
---

# CTA cuối bài Santorini Park

## Vị trí

Chèn một mục H2 mới **sau đoạn nhận xét cuối** ("It's not a place we'd usually build a whole session around…")
và **trước** hai link đọc thêm (Old Quarter guide, day trips). Khối nút chung của site
(Chat on WhatsApp / See tours) giữ nguyên. Không đổi title, meta, URL, phần giá vé/giờ mở cửa.

## Nội dung sẽ chèn (đúng từng chữ)

```html
<h2>Book a photoshoot at Santorini Park</h2>
<p>Santorini Park works best as one stop in a longer session rather than a whole shoot. Our photographer can meet you at the park and pair it with the Old Quarter or another spot on the same day.</p>
<ul>
  <li><strong>Basic, $30 per hour:</strong> one area, 10–15 edited photos per hour, and all original files within 24 hours.</li>
  <li><strong>Premium, $60 per hour (2-hour minimum):</strong> Santorini Park plus one or two more areas, 20 edited photos per hour, light makeup, a short recap video under 60 seconds and one printed Polaroid.</li>
  <li><strong>VIP, $99 per hour (2-hour minimum):</strong> everything in Premium, plus an outfit or áo dài, 30 edited photos per hour and a 2–3 minute video.</li>
</ul>
<p>Prices cover up to two guests. The park ticket and Grab rides between areas are not included.</p>
<p><a href="/hanoi-photoshoot">See photoshoot packages</a> · <a href="https://wa.me/84925148581?text=Hi%20TravelFrame!%20I%20would%20like%20a%20photoshoot%20at%20Santorini%20Park%20in%20Hanoi.">Ask about a date on WhatsApp</a></p>
```

## Đối chiếu với bảng giá Approved

| Ý trong CTA | Nguồn |
|---|---|
| Basic $30/giờ, 1 khu, 10–15 ảnh chỉnh/giờ, ảnh gốc 24h | Bảng gói, cột Basic |
| Premium $60/giờ, tối thiểu 2h, 2–3 khu, 20 ảnh/giờ, trang điểm nhẹ, recap ≤60s, 1 Polaroid | Bảng gói, cột Premium |
| VIP $99/giờ, tối thiểu 2h, 30 ảnh/giờ, video 2–3 phút, trang phục | Bảng gói, cột VIP |
| Tối đa 2 khách; vé tham quan và Grab giữa các khu do khách trả | Mục "Phụ thu" và "Chi phí ngoài gói" |

Không hứa thời hạn giao ảnh chỉnh (48h) để giữ CTA ngắn; không nêu phụ thu khách thứ 3.

## Cách đăng (sau khi Rocky duyệt)

Drupal admin `/node/86/edit` trong built-in browser (phiên admin sẵn có), chèn qua CKEditor sau khi kiểm tra
anchor đoạn nhận xét cuối khớp đúng 1 lần. Ghi revision trước để rollback
(`/node/86/revisions/<rev>/revert`). Kiểm tra sau đăng: HTTP 200 ẩn danh, H2 mới có trên trang,
2 link trả 200, title/meta/canonical không đổi. Ghi vào `Published-Ledger.md` và `Publication.md` trong thư mục này.
