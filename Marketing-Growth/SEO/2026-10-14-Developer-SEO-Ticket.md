---
title: "Ticket developer: SEO theme/template (TravelFrame Drupal)"
owner: Marketing-Growth → Technology-Automation (developer)
status: "Open — chờ developer nhận"
date: "2026-10-14"
source: "Top-1 Keyword Roadmap mục 1; OpenSEO audit 63068ce5"
---

# Ticket developer: SEO theme/template

Kiểm tra bằng `curl` **ẩn danh** (không đăng nhập): bản render khi đăng nhập admin khác bản Google thấy.

## Đã đúng, không cần làm

- `<title>` lấy `field_tacos_seo_title` + " | TravelFrame Vietnam".
- Canonical tự trỏ và hreflang en / vi (`?lang=vi`) / x-default.

## Việc cần làm (theo thứ tự ưu tiên)

| # | Việc | Trang | Kiểm tra pass khi |
|---|---|---|---|
| D1 | **Chuyển domain sang travelframe.vn** theo [checklist](2026-10-14-Domain-Migration-Checklist.md) | toàn site | mục "Kiểm tra" trong checklist pass |
| D2 | JSON-LD `Service` + `FAQPage` cho `/hanoi-photoshoot` (JSON có sẵn trong [draft money page](../Content/Drafts/2026-10-13-hanoi-photoshoot-money-page.md)). Gợi ý: thêm field `field_tacos_jsonld` (plain text) và in ra `<script type="application/ld+json">`, vì CKEditor xoá `<script>` | node 104 | Rich Results Test nhận `Service` và `FAQPage` |
| D3 | `FAQPage` tự sinh từ khối FAQ trong body (H3 câu hỏi + đoạn trả lời) cho News; thêm `BreadcrumbList` sitewide; `LocalBusiness` (name, url, telephone `+84925148581`, areaServed Hanoi) trên homepage | News, toàn site | Rich Results Test nhận đủ loại |
| D4 | Trang tour detail: H1 = tên tour; "Choose a Hanoi journey" chỉ là H1 ở `/tours` | `/tour/*` | `curl -s <url> \| grep -c '<h1'` = 1 và nội dung là tên tour |
| D5 | Homepage: thêm section/nút "Hanoi photoshoot packages →" `/hanoi-photoshoot`; `/tours`: dòng đầu "Just want photos? See photoshoot packages." | `/`, `/tours` | `curl -s / \| grep -c 'href="/hanoi-photoshoot"'` ≥ 1 |
| D6 | Homepage title/H1/meta có "Vietnam photographer"; meta hiện ghi "delivered in 24 hours", sửa theo configurator ("2–3 days" cho gói máy ảnh). Meta mặc định của `/about` (243 ký tự) và `/ebooks` (178) rút về ≤160 | `/`, `/about`, `/ebooks` | `curl` meta description ≤160 ký tự, không còn "24 hours" |
| D7 | Footer + tooltip nút nổi + `/booking` + `/contact`: chữ hiển thị số WhatsApp đổi thành `0925148581`; **giữ** link `wa.me/84925148581` và `tel:+84925148581` | toàn site | `curl -s / \| grep -c '925 148 581'` = 0 |
| D8 | Block cuối bài News "Want to taste it yourself? Book a food tour": đổi theo category hoặc tắt theo node; tắt cho bài Train Street (node 71) | News | node 71 không còn block food tour |
| D9 | Lightbox `#dtp-photo-img` có `alt=""` rỗng mặc định: set alt theo ảnh đang mở (JS) | tour pages | không ảnh hưởng SEO lớn, làm cuối |

## Rollback

Mỗi thay đổi template commit riêng trong repo theme; revert commit tương ứng. Field mới (D2) để trống thì không in gì.
