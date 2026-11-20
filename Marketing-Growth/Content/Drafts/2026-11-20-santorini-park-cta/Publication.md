---
node: 86
url: "https://travelframe.sidevn.com/news/santorini-park-lovely-photo-spot-right-outside-hanoi"
published: "2026-11-20 20:07 ICT (13:07 UTC)"
approval: 'Rocky trong chat 20/11: "Q3 có vào cuối", sau khi xem bản nháp: "duyệt"'
method: "Drupal admin /node/86/edit trong built-in browser (phiên admin sẵn có); chèn qua CKEditor setData sau khi kiểm tra anchor khớp đúng 1 lần"
rollback: "/node/86/revisions/318/revert (revision 12/11/2026 14:35)"
---

# Publication: CTA cuối bài Santorini Park

## Thay đổi

Thêm mục H2 "Book a photoshoot at Santorini Park" (nội dung đúng từng chữ như `Draft.md`) **sau phần FAQ, trước
2 link đọc thêm** (Old Quarter guide, day trips). Lệch so với Draft: Draft ghi "sau đoạn nhận xét cuối"; khi mở
form thấy giữa đoạn đó và link đọc thêm còn mục "Planning a visit" và FAQ, nên đặt sau FAQ để đúng ý "vào cuối".

Không đổi: title, SEO title, meta description, URL, ảnh, giá vé/giờ mở cửa, khối nút chung của site.

## Bằng chứng (kiểm tra ẩn danh bằng curl, 20/11 sau khi lưu)

| Kiểm tra | Kết quả |
|---|---|
| Trang | HTTP 200 |
| H2 "Book a photoshoot at Santorini Park" | 1/1 |
| "$30 / $60 / $99 per hour" | 3/3 |
| "Prices cover up to two guests" | 1/1 |
| Link WhatsApp riêng (text "...Santorini Park in Hanoi.") | có, HTTP 200 |
| /hanoi-photoshoot | HTTP 200 |
| Title | "Santorini Park Hanoi: Worth the Ticket? \| TravelFrame Vietnam" (không đổi) |
| Canonical | /news/santorini-park-lovely-photo-spot-right-outside-hanoi (không đổi) |
| Meta description | không đổi |
| Revision mới | 20/11/2026 13:07 UTC, log "CTA 20/11: add ..." |

## Theo dõi

Đo lại thứ hạng "santorini park hanoi" (US và VN) bằng `Technology-Automation/Scripts/jev_serp_rank.py`;
theo dõi tin nhắn WhatsApp có câu "photoshoot at Santorini Park".
