---
title: "/hanoi-photoshoot: thay 2 link 'Build an estimate' bằng lời mời hỏi giá qua WhatsApp (node 104)"
type: page-edit
status: Published (2026-11-24 15:34 ICT)
owner: Marketing-Growth
created: 2026-11-24
source: Developer SEO Ticket D23 (b); kiểm tra site ẩn danh 24/11/2026
nodes: [104]
approval: Rocky "Duyệt, triển khai" trong chat 24/11/2026 (sau khi xem đúng từng chữ của Sửa 1 và Sửa 2; không chọn 2b)
---

# /hanoi-photoshoot: thay 2 link "Build an estimate" bằng lời mời hỏi giá qua WhatsApp

## Vì sao

- Trang ghi ba ví dụ giá: Basic 2 giờ 60 USD, Premium 2 giờ 120 USD, VIP 2 giờ 198 USD. Ngay dưới đó, trang mời khách "Build an estimate" trên Custom Tour builder (2 link tới `/tours#dtpc-card`).
- Builder tính tổng = gói tour (một giá cho cả nhóm) + gói ảnh × số giờ + điểm thêm + xe. Công thức đọc từ hàm `compute()` trong JS của site ngày 24/11, không bấm trên giao diện.
- Với giá gói tour hiện tại (Standard 2 giờ, 55 USD), builder ra Basic 115 USD, Premium 175 USD, VIP 253 USD. Khách đi theo link sẽ thấy tổng cao hơn ví dụ trên trang 55 USD.
- Rocky xác nhận 24/11 giá gói tour là có chủ đích, nên chỗ cần sửa là trang này: không gửi khách chỉ muốn chụp ảnh sang builder nữa.
- WhatsApp là kênh chốt đơn chính (Rocky chốt 18/11, theo [danh mục việc 21/11](../../../../Executive/2026-11-21-Master-Work-Breakdown.md) nhóm A và C13).

## Phạm vi

- Chỉ sửa thân bài (Body) của node 104, đúng 2 đoạn. Không đổi title, meta, alias, ảnh, canonical, bảng giá hay ba ví dụ giá.
- Sau khi sửa, Body không còn link tới `/tours#dtpc-card`. Link `/tours` ở nút "See tours" cuối trang thuộc template (ticket D8), không nằm trong Body.
- Lời mời Instagram `PHOTO` ở đầu trang và trong FAQ giữ nguyên.
- Không hứa thời gian phản hồi, vì chưa có cam kết được duyệt.

## Câu WhatsApp điền sẵn

Dùng lại câu của [spec thanh sticky D20](../2026-11-16-hanoi-photoshoot-mobile-cta/Spec.md), thêm một chỗ trống cho tier và số giờ để team báo được tổng ngay:

```text
Hi TravelFrame! I'd like a private photoshoot in Hanoi. My date: ___ · Number of people: ___ · Tier and hours: ___
```

Link đã mã hoá:

```text
https://wa.me/84925148581?text=Hi%20TravelFrame%21%20I%27d%20like%20a%20private%20photoshoot%20in%20Hanoi.%20My%20date%3A%20___%20%C2%B7%20Number%20of%20people%3A%20___%20%C2%B7%20Tier%20and%20hours%3A%20___
```

## Sửa 1. Dưới ba ví dụ giá

Trước (nguyên văn trên trang công khai 24/11):

```html
<p>Want to see your own total? <a href="/tours#dtpc-card">Build an estimate</a> on our Tours page: pick Custom Tour, then your tier and hours.</p>
```

Sau:

```html
<p>Want your exact total? <a href="https://wa.me/84925148581?text=Hi%20TravelFrame%21%20I%27d%20like%20a%20private%20photoshoot%20in%20Hanoi.%20My%20date%3A%20___%20%C2%B7%20Number%20of%20people%3A%20___%20%C2%B7%20Tier%20and%20hours%3A%20___">Send us your date, group size and tier on WhatsApp</a>. We reply with the price in writing.</p>
```

## Sửa 2. FAQ "How do I book?"

Trước (nguyên văn trên trang công khai 24/11):

```html
<p>Message "PHOTO" to <a href="https://www.instagram.com/travelframe.vn/">@travelframe.vn</a> on Instagram, use <a href="https://wa.me/84925148581">WhatsApp</a>, or <a href="/tours#dtpc-card">build an estimate</a> on our Tours page. We reply with available times and confirm the price in writing.</p>
```

Sau:

```html
<p>Message "PHOTO" to <a href="https://www.instagram.com/travelframe.vn/">@travelframe.vn</a> on Instagram or use <a href="https://wa.me/84925148581">WhatsApp</a>. We reply with available times and confirm the price in writing.</p>
```

### Sửa 2b (tuỳ chọn, cần Rocky chọn)

Link WhatsApp trong đoạn FAQ hiện mở khung chat trống. Có thể đổi `href` của nó sang link đã mã hoá ở trên để khách gửi luôn ngày và số người. Không đổi chữ hiển thị. Mặc định của bản nháp này là không làm 2b.

## Không làm trong đợt này

- **Khối cuối trang "Want to taste it yourself? … See tours":** thuộc template, cần developer (ticket D8).
- **Giá gói tour và công thức của builder:** chưa có DEC (ticket D23 a). Bản sửa này không đụng tới builder.
- **Thanh WhatsApp cố định trên mobile:** ticket D20, cần developer.
- **Request Indexing:** chưa gửi; cần Rocky duyệt riêng.

## Bước triển khai (sau khi Rocky duyệt)

1. Mở node 104 trong Drupal admin, ghi số revision hiện tại vào mục Rollback.
2. Kiểm tra mỗi chuỗi "Trước" khớp đúng 1 lần trong Body. Chuỗi ở trên lấy từ trang công khai, nên dấu ngoặc kép quanh PHOTO có thể khác trong trình soạn thảo. Nếu không khớp thì dừng và báo lại, không sửa tay.
3. Thay 2 đoạn. Revision log: "2026-11-24 Replace builder estimate links with WhatsApp CTA (ticket D23)".
4. Kiểm tra trang công khai bằng `curl` ẩn danh: HTTP 200, 1 H1, title/meta/canonical không đổi, `grep -c 'dtpc-card'` = 0, link WhatsApp mới mở đúng câu điền sẵn.
5. Ghi `Marketing-Growth/Published-Ledger.md` và `Marketing-Growth/SEO/2026-10-13-SEO-Fix-Log.md`; cập nhật dòng D23 (b) trong ticket developer.

## Rollback

- Node 104: revision trước khi sửa = 388 (`/node/104/revisions/388/revert`).

## Đo kết quả

- GA4: `contact_click` trên `/hanoi-photoshoot`, channel `whatsapp`, placement `body`. Site JS tự ghi sự kiện này cho mọi link `wa.me` trong thân bài.
- Site JS gửi `link_url` đã bỏ phần `?text=`, nên không tách được link mới với hai link WhatsApp khác trong Body. Đọc tổng `contact_click` của cả trang.
- Mốc trước: 01–15/11 trang có 7 người dùng và 1 `contact_click` (theo spec D20).
- Chưa có số liệu bao nhiêu khách từng bấm "Build an estimate", vì site không ghi sự kiện cho link nội bộ. Mẫu nhỏ, kết quả chỉ mang tính định hướng.

## Kết quả triển khai (24/11/2026)

- Node 104 lưu lúc 15:34 ICT qua built-in browser (phiên admin có sẵn), format `full_html`. Mỗi chuỗi "Trước" khớp đúng 1 lần trong mã nguồn Body; dữ liệu trình soạn thảo trùng mã nguồn trước khi sửa (14.232 ký tự) và đúng bằng bản đã thay sau `setData` (14.356 ký tự). Sửa 2b không làm.
- Revision log: "2026-11-24 Replace builder estimate links with WhatsApp CTA (ticket D23, Rocky approved in chat)."
- Kiểm tra ẩn danh lúc 15:35 ICT: HTTP 200, `x-drupal-cache: MISS`, 1 H1, 12 H2, 11 ảnh, title/canonical/meta không đổi, không có noindex, `dtpc-card` 0 lần (trước là 2), ba ví dụ giá giữ nguyên.
- Link WhatsApp mới trả HTTP 302 tới `api.whatsapp.com/send` với đúng câu điền sẵn. Chưa bấm thử trên điện thoại.
- Chưa gửi Request Indexing.
