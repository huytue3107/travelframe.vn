# TravelFrame — Website và social: phân phối giảm, chuyển đổi chưa được xác minh

**Ngày báo cáo: 02/11/2026 · Trạng thái: Review · Chủ quản: Data-Analytics**

Nguồn mới lấy từ GA4 Data API, Meta read-only MCP và hai tracker local. Metadata lần lấy Meta: 17:14:31 ICT; lần lấy GA4: 17:16:03 ICT ngày 02/11; không phải snapshot 08:30. Mốc chuẩn 08:30 không có đủ dữ liệu để tái tạo. Báo cáo giữ đủ 8 tầng, công khai các khung thay thế và không ghép thành tỷ lệ chuyển đổi xuyên kênh.

## 1. Tóm tắt

1. **[Đỏ] Phân phối Instagram giảm:** hai kỳ truy vấn 7 ngày tương ứng có reach 38.411 → 26.234 (−31,7%), views 73.103 → 51.022 (−30,2%), profile visits 247 → 154 (−37,7%), website taps 12 → 9 (−25,0%). Đây là kết quả API theo hai khoảng truy vấn cùng độ dài; Meta chuẩn hóa dữ liệu theo ngày, không coi là hai tuần lịch GA4.
2. **[Vàng] Website tăng về tổng lượng đo được, nhưng lẫn kiểm thử:** 19–25/10 so với 26/10–01/11 có sessions 82 → 119 (+45,1%), pageviews 315 → 708 (+124,8%). Riêng `127.0.0.1` chiếm 33 sessions và 371 pageviews tuần mới, tương ứng 27,7% và 52,4% tổng số. Không gọi đây là tăng khách hàng.
3. **[Vàng] Đường dẫn đặt tour chưa cho thấy tăng ý định mua:** `/booking` tổng tăng 14 → 20 views, nhưng trên hostname `travelframe.sidevn.com` giảm 10 → 5; số active users xem trang này trên hostname đó giữ nguyên 5 → 5. Không thể diễn giải tăng tổng views là tăng người muốn đặt tour.
4. **[Đỏ] Chưa có booking/cọc có bằng chứng trong tracker:** 17 liên hệ tháng 10, 8 dòng `Quoted`, 9 dòng `Guide-Sent`; cả 17 chưa có ngày đi và số khách trong trường riêng. Đây là danh sách liên hệ, chưa phải 17 qualified leads. Chưa có bằng chứng thanh toán; doanh thu thực tế ngoài tracker **chưa đối soát**.

## 2. Phễu doanh số

**Mốc chuẩn cần có:** 08:30 ngày 01/11–08:30 ngày 02/11, đối chiếu 08:30 ngày 31/10–01/11 và 08:30 ngày 25–26/10. **Tất cả số đúng khung này hiện Chưa đo/không tái tạo được từ nguồn đã lấy.** Bảng dưới là các điểm đo thay thế, mỗi dòng ghi đúng khung riêng; không phải phễu cohort liên thông.

| Tầng bắt buộc | Số gần nhất có thể xác minh | Đối chiếu và trạng thái | Khung đo thực tế |
|---|---|---|---|
| 1. Reach Instagram | 1.637 accounts | 2.427 kỳ trước; 9.085 cùng kỳ 7 ngày trước; −32,6% / −82,0% [Đỏ] | Bucket ngày kết thúc 14:00 ICT 01/11; đối chiếu kết thúc 31/10 và 25/10 |
| 2. Profile visits Instagram | 11 | 15 → 11; 31 → 11; −26,7% / −64,5% [Đỏ] | Kỳ ngày API tương ứng với các yêu cầu như reach; không phải rolling 08:30 |
| 3. Website link taps Instagram | 0 | 3 → 0; 2 → 0 [Đỏ] | Kỳ ngày API; số thấp, không suy ra xu hướng dài hạn từ một ngày |
| 4. DM / Messenger hỏi tour | **Chưa đo** | API Messenger thiếu quyền; không quy đổi comment/guide thành DM hỏi tour | Không có số đầy đủ theo ngày |
| 5. Website sessions | 17 | 28 ngày 31/10; 8 ngày 25/10; −39,3% / +112,5% [Vàng] | Ngày lịch 01/11, 00:00–24:00 ICT; chưa lọc hết nội bộ |
| 6. `/booking` pageviews | 1 | Người xem, chưa phải người mua [Vàng] | Ngày lịch 01/11; không cùng khung với IG |
| 7. Lead đủ thông tin liên hệ / ngày đi / số khách | **Chưa đo đầy đủ** | 17 liên hệ tháng 10; 0/17 đủ cả ngày đi và số khách trong tracker | Lũy kế CRM; không phải lead mới trong 24h |
| 8. Báo giá / cọc / booking / doanh thu | 8 dòng Quoted tháng 10; 0 cọc và 0 booking có chứng từ trong tracker [Đỏ] | Số tiền đã đối soát từ tracker: $0; tổng thực thu ngoài tracker: Chưa đo | Lũy kế tại lần đọc file; không suy ra doanh thu 24h bằng 0 |

**Không tính reach → sessions, pageviews → lead hay báo giá → booking như tỷ lệ chuyển đổi thực tế:** khác khung giờ, khác đơn vị, chưa có nối danh tính. Việc xem trang `/booking/details` nhiều hơn `/booking` có thể do truy cập trực tiếp, kiểm thử hoặc luồng khác; cần event path để xác định.

## 3. Chỉ số kênh

### A. Instagram: giảm tổng phân phối, lượt lưu trên mỗi nghìn reach vẫn giữ được

**Hai kỳ truy vấn API:** trước `18/10 14:00 → 25/10 14:00 ICT`; mới `25/10 14:00 → 01/11 14:00 ICT`. Meta trả `period=day, metric_type=total_value`, không trả biên thực tế trong kết quả tổng. Series reach xác nhận bucket ngày kết thúc 14:00 ICT. Vì thế so sánh dưới đây là **cùng cách truy vấn**, chưa chứng minh là rolling 168 giờ chính xác. Không gộp với tuần lịch GA4.

| Chỉ số | Kỳ trước | Kỳ mới | Thay đổi | Trạng thái |
|---|---:|---:|---:|---|
| Reach | 38.411 | 26.234 | −31,7% | [Đỏ] |
| Views | 73.103 | 51.022 | −30,2% | [Đỏ] |
| Profile visits | 247 | 154 | −37,7% | [Đỏ] |
| Website taps | 12 | 9 | −25,0%, chỉ giảm 3 taps | [Đỏ] |
| Total interactions | 3.478 | 2.432 | −30,1% | [Đỏ] |
| Accounts engaged | 2.187 | 1.535 | −29,8% | [Đỏ] |
| Saves | 880 | 671 | −23,8% | [Đỏ] |
| Shares | 562 | 420 | −25,3% | [Đỏ] |
| Saves / 1.000 reach | 22,9 | 25,6 | +11,6% | [Xanh] |
| Profile visits / reach | 0,643% | 0,587% | −0,056 điểm % | [Vàng] |
| Link taps / profile visits | 4,86% | 5,84% | +0,99 điểm % | [Xanh]* |

*Trạng thái áp dụng ngưỡng thay đổi tương đối; tỷ lệ link chỉ dựa trên 12 và 9 taps, chưa đủ để kết luận cải thiện ổn định.*

**Giải thích số:** views giảm 22.081 trong khi reach giảm 12.177; views/reach xê dịch 1,90 → 1,94. Do đó giảm tổng lượng xem đi cùng giảm độ phủ, chưa có dấu hiệu từ tỷ lệ này rằng mỗi account xem ít hơn. Lượt lưu giảm chậm hơn reach, nên saves/1.000 reach tăng; điều này không xác định được bài hoặc chủ đề nào tạo ra lượt lưu vì chưa có insight từng bài.

Website taps giảm có thể phân rã số học thành `0,683 × 0,913 × 1,203 = 0,750`: hệ số reach × hệ số profile/reach × hệ số link/profile. Nghĩa là tỷ lệ bấm sau khi vào profile tốt hơn trong mẫu nhỏ nhưng không bù được giảm reach và lượt vào profile. Đây là phân rã số học, không phải bằng chứng nhân quả.

**Follower tại lần lấy số chiều 02/11:** Facebook **2.912 followers / 2.912 likes**; Instagram **596 followers / 203 media**. Không tính tăng trưởng cùng giờ vì thiếu snapshot 17h tương ứng ngày trước và 7 ngày trước. Không trộn với số 10:06 trong Current-State.

### B. Website: tăng traffic đo được, nhưng tăng pageview phần lớn cần đọc cùng dữ liệu kiểm thử

**Tuần lịch ICT:** trước 19–25/10; mới 26/10–01/11, trọn ngày. GA4 property `552867189`, timezone API `Asia/Saigon`.

| Chỉ số | Tuần trước | Tuần mới | Thay đổi | Trạng thái |
|---|---:|---:|---:|---|
| Active users toàn property | 27 | 39 | +44,4% | [Vàng] |
| Sessions toàn property | 82 | 119 | +45,1% | [Vàng] |
| Pageviews toàn property | 315 | 708 | +124,8% | [Vàng] |
| Sessions hostname website | 64 | 86 | +34,4% | [Vàng] |
| Pageviews hostname website | 146 | 337 | +130,8% | [Vàng] |
| Sessions hostname nội bộ `127.0.0.1` | 18 | 33 | +15 phiên | Kiểm thử |
| Pageviews hostname nội bộ `127.0.0.1` | 169 | 371 | +202 views | Kiểm thử |
| Sessions hostname website, bỏ referral localhost | 49 | 70 | +42,9% | [Vàng], chưa sạch hết |
| Pageviews hostname website, bỏ referral localhost | 130 | 264 | +103,1% | [Vàng], chưa sạch hết |

**Giải thích số:** tổng pageviews tăng 393; trong đó hostname nội bộ tăng 202, tương đương **51,4% phần tăng**. Phần còn lại trên hostname website tăng 191, nhưng vẫn có traffic từ referral localhost tăng 16 → 73 pageviews. Hostname website không đồng nghĩa với người dùng bên ngoài; chưa loại được toàn bộ QA, admin hoặc test dùng Direct/Google.

**Nguồn phiên toàn property:**

| Nguồn | Trước | Mới | Chênh lệch |
|---|---:|---:|---:|
| Direct | 33 | 54 | +21 |
| Google organic | 9 | 30 | +21 |
| Instagram, gộp bio/social/referral | 11 | 11 | 0 |
| Facebook, gộp các referral/page button | 13 | 7 | −6 |
| Localhost referral | 15 | 16 | +1 |
| Threads | 1 | 1 | 0 |
| Cốc Cốc | 0 | 1 | +1 |
| Tổng các dòng nguồn | 82 | 120 | +38 |

Tổng nguồn mới là 120 nhưng overview là 119; tổng sessions theo ngày của tuần mới cũng là 120. Giữ chênh lệch đối soát **1 phiên**, không ép tổng. Trong Direct mới có 33 phiên trên `127.0.0.1`, nên phần tăng Direct không phải bằng chứng thương hiệu tăng. Google tăng từ 3 lên 10 active users trong bảng nguồn, nhưng chưa xác nhận đều là người ngoài và không thể quy cho một bài SEO cụ thể. Social website giảm 25 → 19 phiên nếu gộp IG + FB + Threads; mức tăng website tổng không được dẫn dắt bởi social.

**Các điểm đo booking trên hostname website:**

| Điểm đo | Trước | Mới | Ý nghĩa có thể xác minh |
|---|---:|---:|---|
| `/booking` pageviews / active users | 10 / 5 | 5 / 5 | Views giảm 50%; người xem không tăng |
| `/booking/details` pageviews | 0 | 10 | Có đo ở hostname website, chưa xác nhận khách thật |
| `/booking/payment` pageviews | 0 | 3 | Xem trang thanh toán không phải trả tiền |
| `begin_booking` events | 5 | 14 | Event, có thể lặp; không phải 14 khách |
| `begin_checkout` events | 1 | 3 | 2 total users trong kỳ mới, chưa lọc nội bộ hoàn toàn |
| `form_submit` / `purchase` events | 0 / 0 | 0 / 0 | Không có row tương ứng trong truy vấn hostname website |

Toàn property có **2 purchase / 1 total user tuần trước**, nhưng cả hai nằm trên `127.0.0.1`, revenue $0. Không tính thành đơn hàng. Tuần mới toàn property không có row purchase. Không kết luận form hỏng chỉ từ việc thiếu event: cần kiểm thử thao tác và đối chiếu backend.

**Ngày lịch 01/11 và MTD tháng 11 qua ngày hoàn tất 01/11:** 9 active users, 17 sessions, 54 pageviews. Trong đó hostname website có 16 sessions / 42 pageviews; nội bộ 1 session / 12 pageviews. Dưới 30 sessions, không kết luận về bounce, thời lượng hay hành vi sâu. Không gọi khoảng 01/10–02/11 là MTD tháng 11.

## 4. Nội dung đã đăng và seed comment

API xác nhận **15 media IG và 16 bài FB** trong tuần lịch 26/10–01/11. Danh sách IG 50 bài bao phủ tuần trước, ghi nhận 22 media trong 19–25/10: giảm 7 bài (−31,8%). Không so số bài FB tuần trước vì mẫu 30 bài chưa bao phủ đủ. Giảm số bài diễn ra cùng giảm phân phối nhưng chưa chứng minh nguyên nhân: nội dung cũ vẫn đóng góp reach, chưa có phân rã theo bài.

Các bài mới nhất được API trả về đều ngày 31/10; trong danh sách mới nhất không thấy bài 01/11–02/11. Không suy ra Planner không có lịch chờ.

| Đăng (ICT) | Kênh / nội dung | Bằng chứng nền tảng | Reach / Views 24h–72h | Saves / Shares / Link taps 24h–72h | C1 / C2 | Trạng thái |
|---|---|---|---|---|---|---|
| 31/10 17:57 | IG Bamboo weaving | [18118718420054416](https://www.instagram.com/reel/DfJ_qqGN0vC/) | Chưa đo đúng mốc | Chưa đo đúng mốc | Chưa xác minh | Published |
| 31/10 15:45 | IG Thang Long Bridge | [17918854341462042](https://www.instagram.com/reel/DfJwedGtssH/) | Chưa đo đúng mốc | Chưa đo đúng mốc | Chưa xác minh | Published |
| 31/10 10:59 | IG Red Incense Village | [17942921634382196](https://www.instagram.com/reel/DfJPsG9N7Ii/) | Chưa đo đúng mốc | Chưa đo đúng mốc | Chưa xác minh | Published |
| 31/10 17:58 | FB Bamboo weaving | [122124619917479755](https://www.facebook.com/reel/1468060201874873/) | Chưa đo | Chưa đo đúng mốc | Chưa xác minh | Published |
| 31/10 15:45 | FB Thang Long Bridge | [122124596613479755](https://www.facebook.com/reel/1600760064546921/) | Chưa đo | Chưa đo đúng mốc | Chưa xác minh | Published |
| 31/10 14:53 | FB Red Incense Village | [122124587733479755](https://www.facebook.com/reel/990617897424456/) | Chưa đo | Chưa đo đúng mốc | Chưa xác minh | Published |

Seed tracker có cấu trúc không đồng nhất: 89 dòng 19 cột, 32 dòng 17 cột, 11 dòng 18 cột khi tính cả header. Vì vậy chưa dùng trường rỗng để kết luận chưa seed. Không xếp hạng hiệu quả bài bằng lifetime likes, không gán saves cấp tài khoản cho một Reel cụ thể. Danh sách đầy đủ ở snapshot Meta kèm thời gian và ID.

## 5. Cảnh báo dữ liệu

- **Cutoff:** không có snapshot thực 08:30 ngày 02/11. Truy vấn day Instagram trả reach ngày cuối có `end_time=01/11 14:00 ICT`; không ghi là reach 24h đến 08:30 ngày 02/11. Series daily và total_value có thể khác quy tắc biên; không cộng reach ngày để thay unique reach tuần.
- **Website:** mọi ngày trong 19/10–01/11 đều dưới 30 sessions. Không kết luận bounce hoặc thời lượng ở cấp ngày. Bộ lọc hostname/referral trong báo cáo là phân tích tạm, chưa thay cấu hình GA4 và chưa tạo bộ dữ liệu khách bên ngoài sạch hoàn toàn.
- **Lead:** tracker có header 18 cột nhưng 17 dòng tháng 10 chỉ có 17 cột. Một số ngày xuất hiện nhầm trong `deposit_usd`, còn `Sales-CRM` nằm trong `booking_ref`. Không cộng các giá trị này thành tiền cọc; chưa sửa file nguồn. 18 dòng gồm 1 liên hệ tháng 9 và 17 tháng 10; không có dòng mới 01–02/11 không đồng nghĩa không phát sinh liên hệ ngoài tracker.
- **Messenger:** API trả lỗi thiếu `pages_messaging`; chưa có số DM đầy đủ. Không dùng hint token expired để kết luận token hết hạn: bài kiểm tra kết nối xác nhận System User hợp lệ và không hết hạn.
- **Facebook:** chỉ xác minh profile, bài đăng và một số shares; chưa có reach/views cấp Page tương ứng, nên không cộng reach FB + IG hoặc tuyên bố Facebook hiệu quả hơn theo reach.
- **Ads:** connector báo chưa cấu hình ad account bị khóa. Chi tiêu hiện tại **Chưa đo**, không mặc định 0 và không tính CPL/CAC/ROAS/MER. Không đổi cấu hình hay kích hoạt chiến dịch.
- **Nguồn cũ:** Current-State có số khác khung và label MTD kéo qua hai tháng; báo cáo này dùng API mới, giữ nguyên tài liệu cũ. Hai purchase nội bộ là bằng chứng kiểm thử, không xác định các nguồn Direct khác là bot khi chưa có bằng chứng.
- **Nguồn và thời điểm:** metadata và request windows trong [meta.json](../Snapshots/2026-11-02-Performance-Review/meta.json), timezone/57 truy vấn trong [ga4.json](../Snapshots/2026-11-02-Performance-Review/ga4.json), biên bucket trong [ig-reach-daily.json](../Snapshots/2026-11-02-Performance-Review/ig-reach-daily.json). Snapshot không chứa token hoặc ảnh/video CDN.

## 6. Việc cần làm

| Ưu tiên | Việc cụ thể | Vị trí phễu | Chỉ số thành công | Phê duyệt / tham chiếu |
|---|---|---|---|---|
| 1 | Chốt điều kiện nhận cọc, phương thức thanh toán và đối chiếu chứng từ trước khi nhận tiền | Tầng 8 — báo giá → cọc | Có booking ID, số tiền, ngày nhận và chứng từ khớp nhau | **Cần Rocky duyệt**; [Current-State](../../Executive/Current-State.md) |
| 2 | Rà 8 dòng Quoted; chuẩn bị câu hỏi ngày đi, số khách và bước xác nhận lịch. Sửa bản sao tracker trước khi ghi tiền | Tầng 7–8 — liên hệ → đủ điều kiện → chốt | 8/8 dòng có owner/bước tiếp theo; số liên hệ có ngày đi và số khách | Soạn/rà soát: **Tự vận hành**; gửi tin/sửa nguồn: **Cần Rocky duyệt**; [Lead tracker](../Lead-Pipeline-Tracker.csv) |
| 3 | Kiểm thử luồng booking đến backend bằng dữ liệu test có nhãn và kiểm tra mapping event; không tạo thanh toán thật | Tầng 6–8 — booking → yêu cầu → thanh toán | Một test trace nối được giao diện, backend và event; tách purchase test | Rà read-only/draft: **Tự vận hành**; thay đổi live: **Cần Rocky duyệt**; [Measurement Framework](../Measurement-Framework.md) |
| 4 | Chuẩn bị cấu hình loại dev/test và chuẩn hóa schema hai tracker; thiết kế lịch chụp 08:30 cùng 24h/72h | Xuyên phễu — độ tin cậy | Báo cáo tách hostname/referral; CSV đúng cột; snapshot đúng giờ | Đề xuất: **Tự vận hành**; bật automation/sửa cấu hình: **Cần Rocky duyệt**; [Reporting Standard](../Daily-Reporting-Standard.md) |
| 5 | Thử một lô nội dung tự quay nhỏ: trải nghiệm Photo Walk, hướng dẫn tạo dáng, một mẹo Hà Nội gắn trải nghiệm; mỗi bài một CTA và có người đáp ứng | Tầng 1–4 — phân phối → hỏi dịch vụ | Reach/saves/shares cùng tuổi 24h/72h, số cuộc hỏi có ngày đi/số khách | Lên brief: **Tự vận hành**; quay với khách cần quyền sử dụng, đăng/seed **Cần Rocky duyệt**; [Content Direction](../../Marketing-Growth/Plans/2026-09-26-TravelFrame-Content-Direction-Plan.md) |

**Quyết định đề xuất:** ưu tiên đo và xử lý các liên hệ đang có, kiểm tra đường nhận cọc và booking; chưa dùng tăng pageview hoặc follower để biện minh tăng chi tiêu. Việc giảm số bài cần đánh giá bằng số cuộc hỏi đủ thông tin và dữ liệu từng bài cùng tuổi, thay vì chỉ nhìn reach tổng.
