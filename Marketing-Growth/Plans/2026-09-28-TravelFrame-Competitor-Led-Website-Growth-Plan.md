---
title: "Kế hoạch phát triển website và chuyển đổi TravelFrame từ nghiên cứu đối thủ"
owner: Marketing-Growth
status: Review
created: 2026-09-28
updated: 2026-09-28
primary_audience: Solo female traveler
planning_mode: "Theo đợt triển khai và điều kiện nghiệm thu"
source_snapshot: 2026-09-27
---

# Kế hoạch phát triển website và chuyển đổi TravelFrame

> Khi được duyệt thực thi: dùng quy trình executing-plans hoặc subagent-driven-development, xử lý từng hạng mục và lưu bằng chứng nghiệm thu. Checkbox trong tài liệu là việc chưa thực hiện, không phải xác nhận đã triển khai.

**Mục tiêu:** biến website thành nơi khách nữ đi Hà Nội một mình hiểu đúng trải nghiệm Photo Walk, gửi yêu cầu phù hợp và được chuyển sang tư vấn, báo giá, đặt chỗ có đối soát.

**Cách triển khai:** một trang dịch vụ trọng tâm, một đường chuyển đổi chính, một hệ thống đo xuyên website và tư vấn; sau đó mới mở rộng nội dung SEO và kênh phân phối.

**Nền tảng:** kế thừa Drupal/booking hiện có theo kế hoạch kỹ thuật ngày 2026-09-19, nhưng phải xác minh source, domain và staging thực tế trước khi sửa. Không đề xuất thay CMS hoặc dựng website song song.

**Trạng thái:** Review để Rocky duyệt. Hoàn thành tài liệu không đồng nghĩa được duyệt giá, publish, chạy quảng cáo, gửi tin nhắn hoặc gọi thêm API trả phí.

## 1. Quyết định chiến lược

### 1.1 Chọn phạm vi nhỏ, đủ để kiểm nghiệm

Ưu tiên một trải nghiệm có thể cung ứng và giải thích rõ: **Solo Female Photo Walk in Hanoi**. Đây là tên làm việc cho landing page, không tự tạo một package thương mại mới.

Định vị đề xuất: trải nghiệm đi bộ có người địa phương đồng hành, kể chuyện và hỗ trợ tạo ảnh tự nhiên. Không cạnh tranh bằng “tour miễn phí”, giá thấp nhất, số lượng điểm tham quan hay cam kết an toàn tuyệt đối.

Tệp nội dung đầu phễu vẫn rộng hơn: khách quốc tế tìm hiểu Hà Nội. Trang dịch vụ, portfolio và ví dụ tư vấn tập trung vào khách nữ solo; không giả định giới tính từ tên, ảnh hoặc profile của người hỏi. Tệp này phù hợp nguồn audience hiện có, nhưng chưa có bằng chứng trong tài liệu đã đọc để kết luận đã tạo booking trả phí. [R3][R4]

### 1.2 Thứ tự ưu tiên

1. Xác nhận offer, kênh nhận khách và nguồn website.
2. Hoàn thiện trang dịch vụ cùng luồng inquiry/booking.
3. Có portfolio thật, thông tin host và chính sách đã duyệt.
4. Đo được inquiry đủ điều kiện, báo giá và thanh toán.
5. Kéo traffic liên quan từ tài sản nội dung hiện có.
6. Mở rộng SEO hoặc marketplace sau khi biết điểm nghẽn thực tế.

**Chưa làm trong vòng đầu:** marketplace riêng, hệ thống chọn photographer, catalog nhiều thành phố, ứng dụng, rebuild frontend, chiến dịch backlink hàng loạt, mở rộng đồng thời sang couple/family và mua traffic khi luồng nhận khách chưa hoạt động.

## 2. Căn cứ và mức độ tin cậy

Kế hoạch tái sử dụng snapshot nghiên cứu ngày **2026-09-27**; không thực hiện thêm nghiên cứu web hay truy vấn trả phí ngày 2026-09-28. Những nhận xét về đối thủ dưới đây là kết quả trong tài liệu nguồn, không phải kiểm tra lại hoạt động hiện tại. [R1]

| Căn cứ | Có thể dùng để quyết định | Không được suy ra |
|---|---|---|
| Ahrefs qua Monid có dữ liệu 12 domain | Chọn đối thủ cần nghiên cứu sâu, tham khảo độ lớn backlink/authority | Traffic Hà Nội, thị phần, doanh thu hoặc tỷ lệ chuyển đổi |
| Withlocals/Vespa có cách trình bày loại trải nghiệm, thời lượng và CTA dễ đọc trong snapshot | Đề xuất khối thông tin dịch vụ dễ so sánh | Cấu trúc này chắc chắn làm tăng booking |
| Tubudd có profile buddy và category dịch vụ | Thử phần giới thiệu người đồng hành | TravelFrame phải xây marketplace hoặc thuê nữ guide khi chưa có nguồn lực |
| Photography marketplaces có discovery theo destination/use case | Xây nhóm nội dung quanh nhu cầu ảnh khi đi du lịch | Tạo nhiều trang gần như giống nhau để phủ keyword |
| Hanoikids/Hanoi Free Walking Tours có thông tin tour và bước đặt rõ | Làm rõ hành trình inquiry và điều kiện đi | Cạnh tranh bằng “free” hoặc đồng nhất sản phẩm |
| Studio local có nhiều trang theo nhu cầu/mùa | Thử bài chuẩn bị trang phục, ảnh cá nhân, bối cảnh địa phương | Nhu cầu studio nội địa giống khách nữ quốc tế solo |

### 2.1 Những điểm cần sửa cách diễn giải trước khi đầu tư

- Các số organic bằng 0 trong bảng Ahrefs không chứng minh domain không có traffic. Với những domain lớn, cần kiểm tra target mode, country, coverage và thời điểm dữ liệu trước khi dùng để xếp hạng.
- Từ “đang thắng” trong báo cáo nguồn chỉ nên hiểu là pattern đáng tham khảo. Chưa có dữ liệu để công nhận website nào chuyển đổi tốt nhất.
- Lỗi 404 của lượt đọc qua Monid là kết quả của đường truy cập đó; chưa đủ để kết luận website đối thủ đã bỏ trang. Viator/Klook chưa có nội dung đủ để đánh giá.
- Trạng thái Hanoi của Flytographer là snapshot, không phải bằng chứng thị trường đang bỏ trống.
- Các tệp dữ liệu thô được sidecar trỏ tới nằm ở `/tmp`; cần bảo toàn bằng chứng đã lọc thông tin nhạy cảm trong thư mục research trước khi mua thêm dữ liệu. Không sao chép nguyên metadata có token/cookie.
- Semrush chưa được dùng trong báo cáo gốc. Không ghi “đã đối chiếu Ahrefs và Semrush”.

### 2.2 Đối soát tài liệu TravelFrame

| Mâu thuẫn hoặc khoảng trống | Xử lý trong kế hoạch này |
|---|---|
| Current-State ngày 2026-09-15 còn ghi persona mở; audience và kế hoạch nội dung ưu tiên nữ solo | Dùng nữ solo cho thử nghiệm; yêu cầu cập nhật decision record khi Rocky duyệt kế hoạch |
| Kế hoạch SEO ngày 2026-09-22 có 35–50 ảnh/24 giờ, mục tiêu top 1–3 và 1.000 sessions | Không kế thừa thành cam kết; package/SLA phải duyệt, traffic/ranking chỉ đặt sau baseline và keyword research |
| Tài liệu dùng cả `travelframe.vn` và `travelframe.sidevn.com` | Xác nhận domain production, canonical, redirect, GSC và GA4 trước khi chốt URL |
| Measurement Framework còn dùng `/book-tour`; kế hoạch kỹ thuật dùng `/booking` | Ghi nhận route thực tế trong source map rồi cập nhật một bộ định nghĩa chung |
| Kế hoạch kỹ thuật ưu tiên WhatsApp, trong khi Guest Guide/Current-State ưu tiên Instagram DM | Đề xuất Instagram DM cho inquiry ban đầu; Rocky duyệt kênh chính và kênh dự phòng trước khi phát hành |
| Operating Review ngày 2026-09-27 ghi 62 trang indexed, 7 tour chưa indexed, 0 booking/revenue | Đây là báo cáo Review; phải lấy bằng chứng URL Inspection và CRM/thanh toán trước khi dùng làm baseline. Thiếu bằng chứng không đồng nghĩa bằng 0 |

Không sửa các tài liệu nguồn trong lần lập kế hoạch này. Kế hoạch SEO và booking cũ vẫn là tài liệu tham khảo; các claim chưa duyệt phải được đối soát trước khi thực thi. [R2][R5][R6][R7][R8]

## 3. Bản đồ triển khai

Owner dưới đây là **vai trò đề xuất**, chưa phải giao việc cho một người cụ thể. Rocky xác nhận người phụ trách khi duyệt. Thời lượng là ước lượng công sức, không phải hạn hoàn thành hay SLA.

| Đợt | Trọng tâm | Đầu ra chính | Điều kiện bắt đầu | Công sức tham khảo |
|---|---|---|---|---|
| A | Khóa offer, domain, contact và nguồn dữ liệu | Hồ sơ quyết định, baseline, source/staging map | Duyệt phạm vi nội bộ | 2–3 ngày công liên phòng ban |
| B | Trang dịch vụ và bằng chứng | 1 landing brief, portfolio, FAQ, bản staging | Offer được duyệt; source rõ | 3–5 ngày công content/design/creative |
| C | Inquiry, CRM và tracking | Luồng nhận khách, event contract, QA | Kênh chính được duyệt; staging dùng được | Kỹ thuật 7–11 ngày công theo kế hoạch cũ, cần ước lượng lại sau source map |
| D | SEO theo intent | Keyword map, bài đã chỉnh, internal links | URL canonical và offer ổn định | 3–5 ngày công cho lô đầu |
| E | Pilot traffic và tối ưu | 1 lô nội dung dẫn về offer, báo cáo funnel | B/C đạt QA và được duyệt release | 1–2 ngày công setup; theo dõi theo lượng dữ liệu |
| F | Quyết định mở rộng | Scale/iterate/hold có lý do | Có dữ liệu CRM và chi phí đáng tin cậy | 0,5–1 ngày công review |

Không cộng máy móc các ước lượng này: B/C có thể song song và có phần trùng scope kế hoạch ngày 2026-09-19. Thời gian chờ approval, quyền truy cập, asset/consent và lịch chụp không nằm trong số ngày công.

## 4. Đợt A: Hoàn thiện đầu vào

**Owner đề xuất:** Brand-Strategy + Operations; Technology-Automation phụ trách source; Rocky duyệt.

### A1. Một bảng offer có thể vận hành

- [ ] Chọn một package đã có để phục vụ Photo Walk; xác định landing page là cách giới thiệu package hay sản phẩm mới.
- [ ] Ghi người vận hành, host/photographer, ngôn ngữ phục vụ, người dự phòng, thời lượng, capacity và lịch có thể nhận.
- [ ] Chốt giá theo người/nhóm, loại tiền, inclusion/exclusion và cách tính add-on; không lấy giá đối thủ làm giá TravelFrame.
- [ ] Chốt số lượng ảnh/video, mức chỉnh sửa, cách giao, SLA, phạm vi sửa lại và quyền sử dụng.
- [ ] Chốt điều kiện mưa, dời lịch, hủy, thanh toán, xác nhận đặt chỗ; các nội dung cần chuyên môn pháp lý chuyển đúng người kiểm tra.
- [ ] Lập cột `source`, `approver`, `approved_at`, `review_at` cho từng claim công khai.

**Nghiệm thu:** cùng một khách, package và ngày đi phải nhận cùng phạm vi dịch vụ ở website, DM và written confirmation. Không còn mâu thuẫn “visual included” nhưng booking cộng lại cùng hạng mục.

**Nếu chưa duyệt giá:** chỉ làm prototype nội bộ. Sau approval riêng cho inquiry-only, có thể dùng “Ask about your Hanoi photo walk”; không hiển thị giá giả, slot giả, “Book now” hay nhận tiền trước khi điều kiện thương mại sẵn sàng.

### A2. Xác minh website và kênh nhận khách

- [ ] Website owner xác nhận production domain, source/release hiện hành, staging, deploy owner và rollback.
- [ ] Map URL tour/booking hiện có trước khi tạo slug mới; ưu tiên nâng cấp một trang phù hợp.
- [ ] Rocky duyệt Instagram handle chính, email/số liên hệ dự phòng và người trực.
- [ ] Kiểm tra staging không gửi DM, email, webhook hay CRM lead thật.
- [ ] Ghi trạng thái riêng cho từng gate; không coi tài liệu nói “đã làm” là đã có bằng chứng release.

### A3. Baseline và bằng chứng

- [ ] Xuất cửa sổ 28 ngày đầy đủ gần nhất có dữ liệu GA4/GSC; ghi ngày bắt đầu/kết thúc, timezone, property và bộ lọc.
- [ ] Tách external traffic khỏi internal/debug; nếu không tách được thì đánh dấu baseline chưa đủ tin cậy.
- [ ] Lấy danh sách URL trong báo cáo indexing, kiểm tra từng URL thay vì chỉ đọc tổng 62/7.
- [ ] Đối soát inquiry, quote, deposit, booking trong CRM; chưa đọc được nguồn thì ghi “chưa xác minh”.
- [ ] Lưu bản research đã làm sạch và bảng coverage để không trả phí lại cùng dữ liệu.

## 5. Đợt B: Trang dịch vụ và thư viện bằng chứng

**Owner đề xuất:** Marketing-Growth; Creative-Production cung cấp hình; Brand-Strategy kiểm tra claim.

### B1. Kiến trúc trang

Slug làm việc: `/solo-female-photo-walk-hanoi`. Đây chỉ là phương án để review; A2 quyết định dùng URL hiện có hay tạo mới. Không mở đồng thời nhiều trang “private photographer”, “solo photo walk”, “Hanoi photoshoot” nếu cùng intent và cùng offer.

| Thứ tự | Nội dung | Yêu cầu đầu vào | Tiêu chí nghiệm thu |
|---|---|---|---|
| 1 | H1 là tên trải nghiệm; mô tả ngắn ai phù hợp, trải nghiệm gì | Offer approved | Sau lần đọc đầu, hiểu đây là trải nghiệm kết hợp đi bộ và ảnh |
| 2 | Ảnh thật cho thấy người, phố và phong cách chụp | Asset có quyền sử dụng | Không dùng ảnh AI/stock làm bằng chứng khách thật |
| 3 | Tóm tắt format, thời lượng, ngôn ngữ, inclusion, giá nếu được duyệt | A1 | Không mâu thuẫn trang booking |
| 4 | Portfolio 6–9 ảnh chọn lọc, đa dạng cỡ cảnh | Creative tuyển chọn | Chú thích đúng người chụp/bối cảnh; pilot ghi rõ pilot |
| 5 | Người đồng hành và cách hỗ trợ tạo dáng | Host đồng ý thông tin công khai | Không cam kết guide nữ hoặc ngôn ngữ chưa sẵn sàng |
| 6 | Diễn biến buổi đi: gặp, trao đổi, đi/chụp, nghỉ, bàn giao | Operations duyệt | Route linh hoạt nhưng phạm vi và giới hạn rõ |
| 7 | Bao gồm/không bao gồm, chính sách | A1 | Không giấu phí ở cuối form |
| 8 | FAQ và CTA cuối | Sales tổng hợp, Operations duyệt | Mỗi câu trả lời có nguồn; một next step chính |

CTA đề xuất cho inquiry-only: **“Ask about your Hanoi photo walk”** dẫn tới kênh chính được duyệt. Khi khả năng đặt chỗ đã vận hành thật, mới thử **“Check your date”** với trạng thái rõ “request, not confirmed booking”.

Không bắt khách điền điện thoại trước khi xem thông tin offer. Nếu dùng form, chỉ yêu cầu tên gọi, khoảng ngày dự kiến, số khách, nhu cầu và một cách liên hệ; không yêu cầu địa chỉ khách sạn cụ thể ở bước đầu. Nếu khách chưa có ngày, cho phép chọn “chưa chốt”.

### B2. Sản xuất proof tối thiểu

- [ ] Kiểm kê ảnh thật, host portrait, clip hậu trường và consent hiện có trước khi lên lịch chụp mới.
- [ ] Nếu thiếu, đề xuất một buổi pilot có ngân sách riêng: ảnh toàn cảnh trải nghiệm, host tương tác, hỗ trợ posing và kết quả ảnh.
- [ ] Ghi rõ pilot/model; không biến người mẫu thành khách hàng hoặc dựng review.
- [ ] Với testimonial thật, lưu nguồn, nội dung được phép trích và phạm vi consent. Nếu chưa có, dùng quy trình/portfolio thay khối review.
- [ ] Tách ảnh minh họa SEO khỏi ảnh chứng minh chất lượng dịch vụ.

### B3. FAQ cần hoàn thiện

Tám câu hỏi ưu tiên: đi một mình có phù hợp không; chưa quen tạo dáng có được hỗ trợ không; buổi đi diễn ra thế nào; ai đồng hành; nhận những file gì; giao khi nào; nếu mưa/đổi lịch thì sao; yêu cầu của tôi đã là booking chưa.

Không viết “100% safe”, đảm bảo ánh sáng, quyền vào Train Street hoặc cam kết giao 24 giờ khi chưa có phê duyệt. Chỉ đưa thông tin vận hành và lời khuyên thực tế đã kiểm tra.

## 6. Đợt C: Tư vấn, booking và đo lường

**Owner đề xuất:** Sales-CRM + Data-Analytics + Technology-Automation.

### C1. Luồng chuyển đổi

`Nội dung/search → trang dịch vụ → inquiry → qualification → quote → payment verified → booking confirmed → completed → delivery → feedback`

Không bắt buộc mọi khách đi qua website: khách từ DM đi vào cùng CRM nhưng giữ nguồn ban đầu.

| Trạng thái | Điều kiện vào | Hành động tiếp theo |
|---|---|---|
| Signal | Bài công khai thể hiện nhu cầu | Research note; chưa tạo khách hàng tiềm năng có contact |
| Inquiry | Khách tự hỏi dịch vụ hoặc cho phép tư vấn | Ghi nguồn, nhu cầu; hỏi ít thông tin cần thiết |
| Qualified | Có nhu cầu phù hợp, khoảng ngày và khả năng phục vụ; còn liên hệ được | Kiểm tra capacity, route và báo giá |
| Quote sent | Báo giá được gửi qua luồng đã duyệt | Ghi version offer, thời điểm và next step |
| Payment verified | Người phụ trách đối soát thanh toán theo policy | Liên kết booking; không chỉ dựa vào ảnh chụp màn hình |
| Booking confirmed | Slot được giữ và written confirmation được gửi theo policy | Bàn giao Operations |
| Completed / delivered | Tour hoàn thành / file được giao theo SLA | Thu feedback tự nguyện; không điều kiện hóa review tích cực |
| Lost / withdrawn | Khách từ chối hoặc yêu cầu dừng | Ghi lý do có bằng chứng; không tiếp tục nhắn khi opt-out |

**CRM tối thiểu:** lead ID nội bộ, source/medium/campaign/content, first contact, trip date/range, nhu cầu, guest count, owner, status, next action, offer version, quote value/currency, payment reference trong vùng hạn chế, lost reason. Không đưa dữ liệu cá nhân hoặc chi tiết thanh toán vào kho research công khai/Git.

### C2. Event contract

Đây là đề xuất đối soát với tracking hiện có, không tạo ngay một bộ event trùng lặp. Kế thừa tên đã được dùng ổn định trong kế hoạch conversion recovery. [R2][R7]

| Event / record | Khi ghi | Không được hiểu thành |
|---|---|---|
| `view_tour` | Trang dịch vụ hiển thị; có `offer_id`, `flow_version` | Người có ý định mua |
| `contact_click` | Click CTA; ghi channel và placement | DM đã gửi hoặc inquiry thật |
| `begin_booking` / `booking_step_view` | Vào flow và từng bước | Booking |
| `view_price_estimate` | Estimate hợp lệ được render, nếu đã có pricing flow | Giá final đã chốt |
| `generate_lead` | Backend xác nhận lưu inquiry; chỉ một lần cho cùng thao tác | Qualified lead hoặc paid booking |
| `booking_request_submit` | Backend nhận yêu cầu đặt chỗ | Slot được xác nhận |
| `qualified`, `quote_sent`, `payment_verified`, `booking_confirmed` | CRM/Operations xác nhận trạng thái | Event browser tự chứng minh doanh thu |

Tham số analytics chỉ dùng giá trị được cho phép như `offer_id`, `channel`, `placement`, `flow_version`; không gửi tên, email, số điện thoại, nội dung chat hay ngày đi cá nhân. Rà soát query string/UTM để tránh người dùng vô tình đưa PII vào analytics.

Với DM, click chỉ là hành động trên website. Tư vấn viên ghi campaign code không chứa PII hoặc nguồn do khách tự cho biết; nguồn không biết ghi `unknown`, không ép gán last-click.

### C3. Bộ ca kiểm thử bắt buộc

- [ ] CTA từ trang dịch vụ giữ offer context tới booking hoặc handoff.
- [ ] Người chỉ xem thông tin không bị tạo lead trước khi có hành động chủ động.
- [ ] Form hợp lệ nhận xác nhận; lỗi mạng hiện hướng xử lý và không báo thành công giả.
- [ ] Double-click, refresh, back/forward không nhân đôi lead/event thanh toán.
- [ ] Thay số khách/add-on tính đúng commercial model; server không tin tổng tiền client gửi.
- [ ] Slot chưa xác nhận không hiện “booking confirmed”; inquiry-only không hiện checkout giả.
- [ ] Form/CTA hoạt động bằng bàn phím và không bị thanh cố định che ở mobile.
- [ ] Analytics không có PII; test traffic tách khỏi báo cáo external.
- [ ] Outbound staging dùng mock/sink; không gửi thử tới khách hoặc production CRM.

Viewport kiểm tra: 375×812, 390×844, 768×1024 và 1440×900. Lưu screenshot, browser, release ID, test result; đây là kế hoạch QA, chưa phải kết quả kiểm thử website.

## 7. Đợt D: SEO theo ý định và tài sản hiện có

**Owner đề xuất:** Research-Insights + Marketing-Growth; Tech xử lý indexability sau A2.

### D1. Lô nghiên cứu nhỏ qua Monid/Ahrefs; Semrush chỉ khi có quyền dùng

- [ ] Chọn bộ 10 seed queries: `hanoi photo walk`, `hanoi photo tour`, `solo female photo walk hanoi`, `private photographer hanoi`, `hanoi vacation photographer`, `solo travel photos hanoi`, `hanoi photoshoot price`, `best photo spots hanoi`, `what to wear photoshoot hanoi`, `hanoi itinerary 2 days`.
- [ ] Xác định country/language trước khi đo; nếu chưa có nguồn khách đủ tin cậy, chỉ dùng một database tiếng Anh làm mẫu nghiên cứu và ghi rõ giới hạn.
- [ ] So intent/SERP trên bộ query, ghi URL thật xuất hiện; không mặc định 12 đối thủ thương mại đều là đối thủ SEO.
- [ ] Ưu tiên kiểm tra sâu Vespa, Withlocals, Tubudd và một photography marketplace có trang Hanoi còn truy cập được; thêm Forever Vacation để kiểm tra footprint tour rộng.
- [ ] Đọc top pages, ranked keywords và backlink liên quan tới Hanoi, không chỉ tổng domain.
- [ ] Nếu Semrush đã kết nối và được duyệt chi phí, đối chiếu cùng target/date/country. Không lấy trung bình traffic của hai hệ thống.
- [ ] Lưu keyword, intent, country, volume/KD nếu có, URL ranking, position/date/provider; dữ liệu thiếu để null, không điền 0.

**Hạn mức đề xuất để Rocky duyệt:** tối đa USD 5 cho một lô nghiên cứu bổ sung, không tự nạp ví. Trước mỗi lần gọi phải biết giá, số result tối đa và tổng dự kiến. Endpoint không kiểm soát được số dòng tính phí thì không chạy. Đợt lập kế hoạch này chi phí API mới bằng 0.

### D2. Bản đồ nội dung lô đầu

| Asset | Ý định chính | Việc làm | CTA | Tiêu chí |
|---|---|---|---|---|
| Trang Photo Walk | Tìm dịch vụ/phương án hỗ trợ ảnh | Tạo hoặc nâng cấp theo A2/B1 | Hỏi dịch vụ hoặc ngày đi | Một URL chịu trách nhiệm intent thương mại |
| Blog Solo Female Traveler Hanoi Photoshoot | Tìm hiểu ảnh khi đi solo | Chỉnh bản nháp hiện có, liên kết về offer | Xem trải nghiệm | Phân biệt tư vấn với bán dịch vụ |
| Blog Slow Hanoi 48-Hour Itinerary | Lên lịch đi Hà Nội | Tái sử dụng bản nháp, xác minh route/access | Xem phần Photo Walk phù hợp | Không ép toàn bộ itinerary vào sản phẩm |
| Blog Train Street Safety Guide | Câu hỏi về access/lịch trình | Chỉ xuất bản sau kiểm chứng gần ngày publish | Route thay thế/guide liên quan | Không hứa tiếp cận hoặc giờ tàu |
| Bài chuẩn bị buổi Photo Walk | Trang phục/posing/weather plan | Một brief mới sau keyword và câu hỏi thật | Xem FAQ/dịch vụ | Không tạo bài chỉ để đạt quota |

Lô đầu chỉ mở rộng tối đa một bài mới; ba bản nháp SEO đã có phải được duyệt, sửa claim và kiểm tra intent trước. Nội dung social lấy từ kế hoạch ngày 2026-09-26, không lập thêm lịch đăng trùng lặp. [R4][R9]

### D3. Checklist kỹ thuật

- [ ] Inventory URL có `purpose`, `canonical`, `indexability`, `internal_links`, `owner`, `evidence_date`.
- [ ] Kiểm tra HTTP, robots/noindex, canonical, sitemap, render nội dung và internal links cho các trang ưu tiên.
- [ ] Nếu xác nhận nhóm 7 tour chưa indexed, xử lý nguyên nhân theo từng URL; không chỉ gửi request hàng loạt.
- [ ] Sau khi được duyệt, gửi yêu cầu indexing cho URL đủ điều kiện và ghi ngày. Không hứa indexed trong 48 giờ hoặc cam kết Google sẽ nhận.
- [ ] Structured data chỉ mô tả nội dung thực tế; schema hợp lệ không phải cam kết có rich result. Kiểm tra tài liệu hiện hành trước khi chọn loại schema.
- [ ] Đảm bảo ảnh có quyền, caption/alt đúng nội dung; ảnh minh họa phải tách khỏi proof dịch vụ.
- [ ] Nếu đổi URL, có redirect map được review; không chuyển tất cả trang cũ về homepage.

## 8. Đợt E: Pilot chuyển đổi và vòng học

**Owner đề xuất:** Marketing-Growth + Sales-CRM + Data-Analytics.

### E1. Lô phân phối đầu tiên

Sau release được duyệt, tái sử dụng ba concept đã phù hợp kế hoạch nội dung:

1. Có ảnh tự nhiên khi đi một mình: Reel/portfolio dẫn vào dịch vụ.
2. Một buổi đi cùng người địa phương: hậu trường thật, cho thấy cách đồng hành.
3. Những câu hỏi trước khi đặt: carousel/Story trả lời bằng chính sách approved.

Mỗi concept có một CTA, một campaign/content code và một trang đích. Link bio dùng URL canonical. Chưa tăng ngân sách quảng cáo, tự động DM hoặc gửi outreach trong phạm vi kế hoạch này.

### E2. Thử nghiệm tuần tự

| Giả thuyết | Thay đổi riêng lẻ | Đo chính | Điều kiện dừng |
|---|---|---|---|
| Người xem chưa hiểu sản phẩm | Thêm khối format/inclusion gần đầu trang | Inquiry phù hợp / inquiry thực tế | Câu hỏi hiểu nhầm tăng, claim chưa đủ nguồn |
| Thiếu bằng chứng làm khách ngần ngại | Thêm portfolio và host đã duyệt | Inquiry / phiên offer đủ điều kiện | Consent/asset sai, ảnh không đại diện dịch vụ |
| CTA/form gây ma sát | Rút ngắn trường bắt buộc, giữ đủ dữ liệu tư vấn | Inquiry lưu thành công / phiên offer | Spam tăng, mất context, lead trùng |
| Khách hỏi nhưng không nhận được next step rõ | Chuẩn hóa qualification và quote version | Quote / qualified inquiry; paid booking / cohort quote | Quá capacity hoặc người trực không xử lý kịp |

Chỉ chạy một thay đổi chính mỗi vòng. Traffic thấp thì dùng phân tích hội thoại và kiểm thử usability trước; không dựng A/B test rồi tuyên bố thắng khi mẫu nhỏ.

**Mốc review đề xuất:** 14 ngày sau release và 28 ngày sau release. Đây là thời điểm đọc dữ liệu, không là hạn phải đạt booking. Nếu có dưới 100 phiên offer hợp lệ hoặc dưới 10 inquiry thật, coi so sánh tỷ lệ là tín hiệu sơ bộ; các mốc này chỉ phục vụ vận hành, không đảm bảo ý nghĩa thống kê khi vượt qua.

Nếu đủ traffic nhưng ít inquiry: kiểm tra source, thông điệp và UX. Nếu nhiều inquiry nhưng ít qualified: kiểm tra intent/offer. Nếu qualified nhiều mà ít quote: kiểm tra capacity và tư vấn. Nếu quote không ra booking: kiểm tra giá, lịch, điều kiện và lý do khách nêu, không mặc định giảm giá.

## 9. KPI, mục tiêu và ngân sách

### 9.1 KPI có mẫu số và bằng chứng

| KPI | Định nghĩa | Nguồn | Cách sử dụng |
|---|---|---|---|
| Offer CTA rate | Phiên external có CTA click / phiên external xem offer | GA4 cùng cửa sổ, theo consent | Chẩn đoán hành vi, không phải booking rate |
| Website inquiry rate | Phiên đủ điều kiện có inquiry lưu thành công / phiên external xem offer | GA4 + backend, trong phần có thể nối được | Báo coverage; không gộp DM không attribution vào tử số |
| Qualification rate | Inquiry được đánh giá phù hợp / inquiry đã được đánh giá | CRM cohort | Tách pending khỏi unqualified |
| Quote-to-paid-booking | Booking có payment verified và confirmation / quote trong cùng cohort | CRM + đối soát thanh toán | Ghi thời gian theo dõi, pending/refund |
| Delivery on time | Booking đã giao đúng SLA / booking đến hạn giao | Operations | Chỉ đo khi SLA được duyệt |
| Contribution after acquisition | Doanh thu được ghi nhận − hoàn tiền − chi phí cung ứng − phí thanh toán − chi phí acquisition phân bổ | CRM/finance | Đánh giá khả năng mở rộng, không nhầm deposit với doanh thu ghi nhận |

Báo cáo phải có tử số, mẫu số, khoảng ngày, channel/device khi mẫu cho phép, tỷ lệ `unknown` và caveat. Không lấy 4 tín hiệu Threads làm 4 inbound leads. Không xem thiếu chứng từ là doanh thu bằng 0.

### 9.2 Mục tiêu vòng đầu

Mục tiêu kiểm soát được: một offer có approval; một trang có QA evidence; một luồng nhận khách có người trực; một event contract không PII; ba bài cũ được đánh giá publish readiness; một báo cáo pilot có đối soát.

Không kế thừa mục tiêu top 1–3, 1.000 sessions hoặc 5 booking như cam kết. Sau baseline, Rocky đặt mục tiêu kinh doanh dựa trên capacity và margin.

Khung tính để lập ngân sách sau đó:

`Booking mục tiêu = qualified inquiries dự kiến × tỷ lệ quote × tỷ lệ quote thành booking đã trả phí`

`CAC trần nội bộ = contribution trước acquisition mỗi booking − mức contribution muốn giữ lại`

Đây là công thức lập kế hoạch, không phải số liệu hiện tại. Nếu chưa có tỷ lệ thực tế, dùng kịch bản thấp/cơ sở/cao được ghi rõ là giả định; không chi ads dựa trên một con số tưởng tượng.

### 9.3 Ngân sách và quyền sử dụng

| Khoản | Đề xuất | Gate |
|---|---|---|
| API cho lập kế hoạch hiện tại | Không gọi thêm | Đã giữ phạm vi tài liệu |
| Research bổ sung | Trần USD 5/lô, chỉ chi khi duyệt | Rocky duyệt endpoint/cap; kiểm tra giá lúc chạy |
| Content/design/tech | Dùng ngày công ở mục 3 để nhận báo giá | Owner ước lượng theo source/assets thật |
| Buổi pilot/portfolio | Lập shotlist và dự toán sau inventory | Duyệt ngân sách, lịch, consent |
| Quảng cáo trả phí | Chưa phân bổ | Tracking, capacity và CAC được duyệt |
| Marketplace/đối tác | Chỉ feasibility review | Xác minh phí/điều kiện hiện hành trước quyết định |

## 10. Đợt F: Mở rộng có điều kiện

**Scale:** chỉ khi inquiry được xử lý, booking được đối soát, cung ứng/bàn giao đáp ứng SLA và contribution không âm theo mô hình đã duyệt. Tăng từng nguồn traffic, không mở tất cả kênh cùng lúc.

**Iterate:** khi khách hiểu sản phẩm nhưng một bước cụ thể chưa hoạt động. Ghi một giả thuyết, một thay đổi, một owner và mốc review; không rebrand toàn bộ để sửa một vấn đề nhỏ.

**Hold:** nếu pricing/contact chưa thống nhất, thiếu consent, tracking hỏng, không đủ người trực hoặc không có khả năng cung ứng. Tiếp tục review nội bộ, không bù bằng nhiều nội dung bán hàng hơn.

Sau pilot mới chọn tối đa một nhánh:

- SEO: bổ sung trang/bài theo query thật trong GSC và nhu cầu được xác nhận.
- Referral: đánh giá một nhóm đối tác phù hợp, chỉ soạn outreach trước khi có approval gửi.
- Marketplace: nghiên cứu phí, payment, cancellation, capacity sync và margin của một nền tảng. Direct booking vẫn ưu tiên theo canonical context; không dùng độ lớn traffic toàn sàn để biện minh tự mở listing.

## 11. Hồ sơ triển khai và quyền sở hữu

Các đường dẫn “tạo” dưới đây là **đầu ra dự kiến**, chưa tồn tại chỉ vì đã có trong bảng. Tất cả tính từ root Company OS; source code website chỉ định sau A2.

| Hạng mục | File hiện có hoặc đầu ra dự kiến | Owner |
|---|---|---|
| Kế hoạch này | `Marketing-Growth/Plans/2026-09-28-TravelFrame-Competitor-Led-Website-Growth-Plan.md` | Marketing-Growth |
| Commercial approval | Tạo `Brand-Strategy/Offers-Pricing/Website-Commercial-Model-Approval.md` nếu chưa có; không tạo duplicate | Brand-Strategy |
| Contact approval | Tạo `Brand-Strategy/Contact/Website-Public-Contact-Approval.md` nếu chưa có | Brand-Strategy |
| Source/release/rollback | Tạo hoặc hoàn thiện `Operations/Change-Management/Website-Release-Runbook.md` | Operations |
| Landing brief | Tạo `Marketing-Growth/Content/Drafts/Solo-Female-Photo-Walk-Landing-Brief.md` | Marketing-Growth |
| Proof register | Tạo `Creative-Production/Review/Photo-Walk-Proof-And-Consent-Register.md`, chỉ lưu metadata/link được phép, không bản consent nhạy cảm | Creative-Production |
| Keyword map | Tạo `Research-Insights/Competitive/Hanoi-Photo-Walk-Keyword-Map.md` | Research-Insights |
| Claim kiểm soát SEO | Cập nhật `Marketing-Growth/Content/Drafts/SEO-Content-Trio-Sources-And-Claims.md` | Marketing-Growth |
| Định nghĩa funnel | Cập nhật `Data-Analytics/Measurement-Framework.md` và `Data-Analytics/Metric-Definitions.md` | Data-Analytics |
| Luồng tư vấn | Cập nhật `Sales-CRM/Scripts/2026-09-26-Customer-Segment-Interaction-Playbooks.md` sau approval | Sales-CRM |
| Kết quả pilot | Tạo `Data-Analytics/Reports/Photo-Walk-Website-Pilot-Review.md` | Data-Analytics |

Không dùng lại đường dẫn legacy `Content-Creative/` xuất hiện trong kế hoạch kỹ thuật cũ. Không giả định tên module/theme file trong source Drupal trước khi map.

## 12. Approval, release và rollback

| Gate | Người/vai trò duyệt đề xuất | Điều kiện qua |
|---|---|---|
| G0 | Website owner + Operations | Source, domain, staging, release ID và rollback được xác minh |
| G1 | Rocky + Brand-Strategy | Package, giá, SLA, capacity, chính sách và contact có văn bản |
| G2 | Content/Creative + Rocky | Copy/asset/claim có nguồn và quyền dùng phù hợp |
| G3 | Technology + Data-Analytics + Sales | Test flow, sink staging, event, privacy và handoff đạt |
| G4 | Rocky | Duyệt đúng phiên bản staging, cửa sổ release và người rollback |
| G5 | Rocky sau pilot | Duyệt ngân sách hoặc kênh mở rộng dựa trên evidence |

**Rollback ngay khi:** giá sai, contact dẫn sai tài khoản, lead không được lưu/chuyển, xác nhận booking sai, PII xuất hiện trong analytics hoặc mobile che nút chính.

**Cách làm dự kiến:** dừng nguồn traffic mới; khôi phục release/config đã kiểm thử theo runbook; nếu contact/quote cũ cũng sai thì không khôi phục claim sai, chuyển sang phương án inquiry đã được duyệt hoặc tạm ngừng nhận yêu cầu; giữ log để đối soát khách bị ảnh hưởng. Không xóa lead, payment hoặc lịch sử consent. Operations xử lý thông báo khách qua người có quyền, không để agent tự gửi.

Các kiểm tra Company OS khi cập nhật tài liệu: `npm test`, `npm run test:skills`, `npm run workspace:check` và kiểm tra diff đúng scope. Chúng không thay thế kiểm thử functional, analytics, mobile hay staging website.

## 13. Năm việc bắt đầu ngay sau khi duyệt

1. Rocky và Brand-Strategy hoàn thiện A1 cho một offer, không chờ hoàn chỉnh toàn bộ catalog.
2. Website owner xác minh domain/source/staging và đối chiếu các thay đổi được báo cáo ngày 2026-09-27.
3. Creative kiểm kê portfolio/consent; Marketing soạn landing brief bằng thông tin approved.
4. Sales chốt người trực và primary path; Data-Analytics chốt event contract cùng baseline thực tế.
5. Sau các gate đầu vào, dựng B/C trên staging; chỉ chuyển sang pilot khi QA và release approval hoàn tất.

Đây là thứ tự triển khai đề xuất. Lần lập kế hoạch này không thay đổi website, CRM, automation, ngân sách hoặc trạng thái phê duyệt của tài liệu khác.

## 14. Nguồn nội bộ

- **[R1]** [Nghiên cứu đối thủ 2026-09-27](../../Research-Insights/Competitive/2026-09-27-TravelFrame-Competitor-Website-Research.md) và [sidecar nguồn](../../Research-Insights/Competitive/2026-09-27-TravelFrame-Competitor-Website-Research.sources.json). Snapshot qua Monid/Ahrefs; không phải dữ liệu kiểm tra lại ngày lập kế hoạch.
- **[R2]** [Kế hoạch conversion recovery 2026-09-19](../../Operations/Change-Management/2026-09-19-travelframe-website-conversion-recovery-implementation-plan.md). Dùng gates, server pricing, staging và rollback; không xem đường dẫn source dự kiến là đã xác minh.
- **[R3]** [Source-of-truth map](../../Brand-Strategy/Source-Of-Truth-Map.md). Đã đọc canonical notes `02-Audience-And-Funnel.md`, `03-Product-And-Guest-Experience.md`, `11-Proof-And-Approved-Claims.md` tại root vault được map; đây là context nội bộ, chưa phải kiểm tra vận hành live.
- **[R4]** [Kế hoạch nội dung 2026-09-26](2026-09-26-TravelFrame-Content-Direction-Plan.md). Kế thừa audience, content batches, CTA và phân biệt engagement với booking.
- **[R5]** [Kế hoạch SEO 2026-09-22](2026-09-22-Comprehensive-Website-SEO-Content-Plan.md). Tài liệu Review; các claim package/SLA, forecast và domain cần đối soát trước dùng.
- **[R6]** [Current-State](../../Executive/Current-State.md) và [Operating Review 2026-09-27](../../Executive/Snapshots/2026-09-27-Operating-Review.md). Dùng phát hiện mâu thuẫn, không nâng báo cáo Review thành commercial approval.
- **[R7]** [Measurement Framework](../../Data-Analytics/Measurement-Framework.md) và [Metric Definitions](../../Data-Analytics/Metric-Definitions.md). Cần cập nhật route/event thực tế.
- **[R8]** [SEO audit 2026-09-27](../Reports/20260927-travelframe-sidevn-com-seo-audit.html). Dùng như lead để xác minh indexing, không lấy cam kết index trong 48 giờ làm kết quả đảm bảo.
- **[R9]** [SEO Content Trio claims](../Content/Drafts/SEO-Content-Trio-Sources-And-Claims.md), [Solo Female Photoshoot draft](../Content/Drafts/Blog-Solo-Female-Traveler-Hanoi-Photoshoot.md), [Slow Hanoi draft](../Content/Drafts/Blog-Slow-Hanoi-48-Hour-Itinerary.md), [Train Street draft](../Content/Drafts/Blog-Train-Street-Hanoi-Safety-Guide-2026.md). Tái sử dụng bản nháp, không coi package/render là published.
