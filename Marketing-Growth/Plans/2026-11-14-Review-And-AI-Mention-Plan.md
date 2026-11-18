# Kế hoạch review thật và được AI nhắc tên — 14/11/2026

Status: Draft (Rocky đồng ý hướng ưu tiên ngày 14/11; chưa duyệt từng bước gửi/đăng)
Owner: Marketing-Growth · Phối hợp: Sales-CRM (danh sách khách), Technology-Automation (GBP/TripAdvisor setup)

## Vì sao làm việc này

- AI Visibility 11/11: TravelFrame được nhắc tên 0/19 prompt dịch vụ chụp ảnh; I.am.Long được nhắc 8/19.
- Run 14/11 (b345a7cd): ChatGPT trích link travelframe.sidevn.com 4 lần (christmas-in-hanoi ×3, hanoi-old-quarter-guide ×1) nhưng không nêu tên thương hiệu trong câu trả lời.
- Nghĩa là nội dung blog đã đủ để AI dùng làm nguồn. Thứ còn thiếu là bằng chứng bên thứ ba rằng TravelFrame là một dịch vụ có thật và được khách khen: review, listing, thảo luận cộng đồng.

## Nguyên tắc bắt buộc

1. Chỉ xin review từ khách đã thực sự chụp với TravelFrame. Không review do nhân viên, người quen hay tài khoản phụ viết.
2. Không tặng quà, giảm giá hay ưu đãi để đổi lấy review, và không chỉ xin review 5 sao (Google và TripAdvisor đều cấm; vi phạm có thể bị gỡ listing).
3. Không viết sẵn nội dung review cho khách. Chỉ gửi link và gợi ý chung ("kể về buổi chụp").
4. Reddit: tài khoản cá nhân của người trong team, ghi rõ "I work with TravelFrame" khi nhắc tới công ty. Không seed comment giả làm khách, không mua upvote.
5. Mọi tin nhắn gửi khách cần Rocky duyệt trước khi gửi (CLAUDE.md).

## Bước 1 — Google Business Profile (đang bị chặn)

- Chặn bởi: chưa chốt địa chỉ chính thức (văn phòng Hoàng Cầu hay 12 Hàng Buồm). GBP cần địa chỉ xác minh được, hoặc khai báo dạng service-area business (ẩn địa chỉ, phục vụ khu vực Hà Nội).
- Cần Rocky quyết: (a) địa chỉ nào, hoặc (b) chạy dạng service-area.
- Sau khi có: tạo profile, danh mục "Photographer" + "Tour operator", giờ làm việc, link website/WhatsApp, 10+ ảnh thật của team; lấy link review ngắn (g.page/r/...).
- Việc này dùng tài khoản Google của công ty: Rocky hoặc người được Rocky chỉ định làm, không phải agent.

## Bước 2 — TripAdvisor

- Tạo listing "Tours & Activities" (hoặc nhận listing nếu đã tồn tại): tên TravelFrame, mô tả đúng DEC-20261021 (Basic $30/h, Premium $60/h, VIP $99/h).
- Ảnh thật, không dùng ảnh AI hay stock.
- Lưu ý: TripAdvisor có thể yêu cầu xác minh doanh nghiệp, cần giấy phép/điện thoại công ty.

## Bước 3 — Xin review từ khách thật

Danh sách đề xuất (Rocky xác nhận trước khi gửi):

| Khách | Kênh liên hệ | Ghi chú |
|---|---|---|
| Hanna | IG/WhatsApp | đã có nội dung đăng, hỏi luôn quyền dùng ảnh nếu chưa có |
| Thin | IG/WhatsApp | xác nhận đã giao ảnh |
| Wuchr | IG/WhatsApp | xác nhận đã giao ảnh |
| Các booking khác trong Lead-Pipeline-Tracker stage Booked/Deposit đã hoàn thành | theo kênh gốc | Sales-CRM lọc |

Thời điểm gửi: 1–3 ngày sau khi khách nhận ảnh chỉnh sửa (lúc khách còn hào hứng). Nhắc tối đa 1 lần sau 5 ngày, sau đó dừng.

### Mẫu tin (EN) — sau khi giao ảnh

> Hi {name}! Hope you're enjoying the photos from {place}. If you have a minute, a short review would really help other travellers find us — just say how the walk went, good or bad.
> Google: {gbp_link}
> TripAdvisor: {ta_link}
> Thanks so much, and safe travels!

### Mẫu nhắc (EN) — 5 ngày sau, chỉ 1 lần

> Hi {name}, just a gentle nudge in case the review link got buried: {gbp_link}. No worries at all if you're busy. Thanks again for walking Hanoi with us!

## Bước 4 — Reddit

- Subreddit: r/VietNam, r/travel, r/solotravel, r/VietnamTravel (đọc rule từng sub trước; nhiều sub cấm tự quảng bá).
- Cách làm: trả lời câu hỏi thật về Hà Nội (thời tiết tháng 12, Hàng Mã, Giáng sinh ở Nhà thờ Lớn, qua đường...) bằng thông tin hữu ích; chỉ nhắc TravelFrame khi người hỏi tìm photographer, kèm dòng tiết lộ.
- Nhịp: 2–3 câu trả lời/tuần/người, tối thiểu 9 câu hữu ích trên 1 câu có nhắc thương hiệu.
- Ghi log vào Marketing-Growth/Reports (link thread, ngày, có nhắc thương hiệu hay không).

## Bước 5 — Xuất hiện trên các site ChatGPT đang trích

- Từ AI Visibility: hanoiauthority, vietnambyregion, blog airasia (MOVE) xuất hiện nhiều trong nguồn của ChatGPT.
- Việc: tìm bài "photographer/photo tour Hanoi" trên các site này, gửi đề nghị bổ sung thông tin (giá thật, ảnh thật, trích dẫn). Dùng skill link-prospecting để lấy contact và soạn email nháp. Không trả tiền đặt link nếu chưa có Rocky duyệt (API trả phí/chi tiêu).

## Đo lường

| Chỉ số | Nguồn | Mốc hiện tại | Mục tiêu 30 ngày |
|---|---|---|---|
| Review Google | GBP | 0 (chưa có profile) | ≥5 review thật |
| Review TripAdvisor | TripAdvisor | 0 | ≥3 |
| Prompt dịch vụ có nhắc tên TravelFrame | AI Visibility (thứ Tư hằng tuần) | 0/19 | ≥2/19 |
| Phiên từ trợ lý AI | GA4 / dashboard "Phiên từ trợ lý AI" | 2 (01–14/11) | theo dõi xu hướng |

Mục tiêu là ước lượng; review phụ thuộc vào số buổi chụp thật hoàn thành trong 30 ngày.

## Cần Rocky quyết

1. Địa chỉ GBP: Hoàng Cầu, 12 Hàng Buồm, hay service-area.
2. Danh sách khách được phép xin review (Hanna, Thin, Wuchr + ai khác).
3. Ai trong team làm Reddit, bằng tài khoản nào.
4. Duyệt 2 mẫu tin ở Bước 3.
