# TravelFrame — Báo cáo hiệu quả website và Meta ngày 08/11/2026

**Chủ quản: Data-Analytics · Trạng thái: Review · Múi giờ: ICT (UTC+7).** Đây là bản đối chiếu trực tiếp bằng API; [báo cáo sáng](2026-11-08-TravelFrame-Daily-Performance-Report.md) được giữ nguyên.

**Mốc báo cáo: 08:30 ICT ngày 08/11.** Lấy số trực tiếp khoảng 10:45–10:52 ICT. GA4 truy hồi theo phút cho các cửa sổ chốt 08:30. Instagram dùng ngày đo do Meta trả về, có giờ kết thúc riêng. Số follower và số từng bài là giá trị tại lúc đọc API. Không lấy số giữa các mốc để tính tỷ lệ chuyển đổi.

## 1. Tóm tắt

- **[Đỏ] Instagram giảm phân phối theo tuần.** Reach **24.857 → 19.196** (−22,8%), views **48.141 → 32.561** (−32,4%) và lượt bấm website **9 → 2**. Ngày Meta gần nhất có **4.469 reach**: thấp hơn ngày ngay trước 29,2%, nhưng cao hơn mốc 7 ngày trước 84,1%. Hai nhận định dùng hai mốc so sánh khác nhau.
- **[Vàng] Website có thêm phiên sau khi loại lưu lượng kiểm thử nhận diện được.** Tổng GA4 giảm **110 → 93 phiên**. Phần còn lại sau khi giới hạn hostname website và loại nguồn kiểm thử tăng **60 → 67 phiên** (+11,7%), trong khi active users giảm **33 → 27**. Phần tăng chủ yếu nằm ở nguồn Direct; chưa thể kết luận có thêm khách.
- **[Đỏ] Chưa có booking hoặc cọc được xác minh.** Sự kiện `form_submit` duy nhất trong tuần nằm ở trang chỉnh sửa `/node/57/edit`. CRM có **6 liên hệ chụp kỷ yếu từ Threads** ngày 07/11, đã ghi báo giá; chưa có chứng từ cọc hoặc mã booking xác minh cho nhóm này. Ưu tiên rà các lịch gần và kiểm tra luồng đặt tour.

## 2. Phễu doanh số

Mốc đối chiếu **08/11 · 07/11 · 01/11**. Hàng GA4 dùng 24 giờ chốt 08:30; ba hàng Instagram dùng các ngày đo đã kết thúc của Meta (chi tiết bên dưới); hàng CRM dùng ngày ghi trong tracker. Đây là các điểm đo riêng, chưa nối được hành trình của cùng người dùng.

| Tầng | Mốc 08/11 | Mốc 07/11 | Mốc 01/11 | So hôm qua | So 7 ngày trước | Trạng thái |
|---|---:|---:|---:|---:|---:|---|
| 1. Reach Instagram | 4.469 | 6.314 | 2.427 | −29,2% | +84,1% | [Xanh] so 7 ngày |
| 2. Lượt xem trang cá nhân IG | 26 | 13 | 15 | +100,0% | +73,3% | [Xanh] |
| 3. Lượt bấm liên kết website trên IG | 2 | 0 | 3 | +2 lượt | −1 lượt | [Đỏ]; mẫu nhỏ |
| 4. DM Instagram / Messenger hỏi tour | Chưa đo | Chưa đo | Chưa đo | — | — | Messenger thiếu quyền; chưa có thống kê IG DM |
| 5. Phiên website GA4 (toàn property) | 6 | 4 | 29 | +2 phiên | −23 phiên | [Đỏ] theo số thô; mẫu nhỏ, lẫn nội bộ |
| 6. Lượt xem đúng đường dẫn `/booking` | 0 | 0 | 0 | 0 | 0 | [Vàng]; không có mẫu để tính % |
| 7. Lead có ngày dự kiến và khoảng số người, theo CRM | 6 Threads | 0 dòng đủ trường | 0 dòng đủ trường | +6 dòng | +6 dòng | Chưa đo tổng lead theo cửa sổ 08:30 |
| 8. Báo giá / cọc / booking / doanh thu | 6 dòng báo giá; 0 cọc, 0 booking có chứng từ | 0 dòng báo giá | 4 dòng báo giá; 0 cọc, 0 booking có chứng từ | +6 báo giá ghi sổ | +2 báo giá ghi sổ | [Đỏ]; thực thu chưa đối soát |

- **IG:** ngày đo mới kết thúc **07/11 15:00**, ngày trước **06/11 15:00**, mốc 7 ngày trước **31/10 14:00** ICT. Reach tổng ngày khớp chuỗi API có `end_time`; các chỉ số khác cùng tham số truy vấn. Không gọi đây là 24 giờ lăn chốt lúc 08:30.
- **GA4:** truy vấn theo phút, từ 08:30 ngày trước đến ngay trước 08:30 ngày ghi trong cột. Mốc mới có **2 views `/booking/details` từ 1 active user**, tách riêng khỏi `/booking`. GA4 có thể cập nhật dữ liệu đến trễ. Không dùng số phiên để suy ra số người xem đã đặt tour.
- **CRM:** các cột 08/11, 07/11, 01/11 lần lượt dùng ngày ghi 07/11, 06/11, 31/10. Nhóm 6 liên hệ mới có ngày và **khoảng** số người trong tracker, chưa chốt số người, lịch phục vụ hay cọc. Tổng file có **24 dòng**: 23 dòng từ 01/10, cộng 1 dòng tháng 9; **14 Quoted, 9 Guide-Sent, 1 Qualified-unconfirmed**. Không cộng người nhận guide thành lead đủ điều kiện và không tính báo giá là doanh thu.

## 3. Chỉ số kênh

<!-- performance-charts -->

### A. Instagram — tổng lượt xem và lượt lưu giảm nhiều hơn reach

**Cặp truy vấn 7 ngày, cùng tham số:** 25/10 08:30 → 01/11 08:30 và 01/11 08:30 → 08/11 08:30 ICT, `period=day`, `metric_type=total_value`. Đây là **biên gửi yêu cầu**; API tổng không trả biên giờ thực tế. Chuỗi reach ngày chốt 14:00 ICT đến 01/11 và 15:00 ICT từ 02/11. Không đồng nhất với ngày lịch GA4; không cộng các reach ngày để suy ra reach tuần.

| Chỉ số Meta API | Kỳ trước | Kỳ mới | Thay đổi |
|---|---:|---:|---:|
| Accounts reached | 24.857 | 19.196 | −5.661 (−22,8%) |
| Views | 48.141 | 32.561 | −15.580 (−32,4%) |
| Profile visits | 143 | 102 | −41 (−28,7%) |
| Website link taps | 9 | 2 | −7 (−77,8%) |
| Accounts engaged | 1.448 | 1.028 | −420 (−29,0%) |
| Content interactions | 2.259 | 1.703 | −556 (−24,6%) |
| Saves | 623 | 380 | −243 (−39,0%) |
| Shares | 379 | 340 | −39 (−10,3%) |

**Giải thích biến động.** Reach giảm và tỷ số views/reach cũng giảm từ **1,94 xuống 1,70**. Lượt lưu trên 1.000 reach giảm **25,1 → 19,8**; lượt chia sẻ trên 1.000 reach tăng **15,2 → 17,7** do shares giảm chậm hơn reach. Tuần mới có **2 link taps trên 102 profile visits**, so với **9 trên 143**; chênh lệch tuyệt đối là 7 lượt, chưa đủ kết luận CTA có vấn đề. Các tỷ số trên là tỷ số tổng hợp cấp tài khoản.

| Ngày đo Meta (kết thúc) | Views | Accounts engaged | Saves | Shares |
|---|---:|---:|---:|---:|
| 31/10 14:00 ICT | 3.863 | 120 | 39 | 24 |
| 06/11 15:00 ICT | 8.970 | 192 | 55 | 58 |
| 07/11 15:00 ICT | 7.816 | 317 | 89 | 114 |

Ở ngày đo gần nhất, views giảm **12,9%** so ngày ngay trước, còn engaged tăng **65,1%** và shares tăng **96,6%**. Đây là biến động một ngày cấp tài khoản, không quy được cho Reel cụ thể hoặc cho quảng cáo.

### B. Facebook — 13 bài xuất bản trong tuần, 3.107 follower lúc đọc API

- Facebook Page API trả **3.107 followers** và **3.107 fan count** lúc **10:45:37 ICT 08/11**. Instagram API trả **608 followers**, **218 media** lúc **10:45:40 ICT**. Không tính mức tăng follower theo ngày từ các lần đọc không cùng giờ.
- Đếm theo timestamp bài công khai trong tuần lịch **01–07/11 vs 25–31/10 ICT**: **13 vs 20 bài Facebook**; **14 vs 19 media Instagram**. Mỗi danh sách API lấy 60 mục và có bài trước cả hai kỳ. Số bài ít hơn đi cùng reach Instagram thấp hơn, nhưng số liệu cấp tài khoản còn gồm bài cũ và không xác định được quan hệ nhân quả.
- Facebook connector hiện trả Page, danh sách bài và `shares.count` khi có trường. **Chưa đo Facebook Page reach/views**, hoặc hiệu quả từng bài đúng mốc 24h/72h. Không dùng Instagram reach để thay thế cho Facebook.

### C. Website — phần tăng phiên sau lọc tập trung ở Direct

**GA4 property 552867189.** Hai tuần lịch đã kết thúc **25–31/10 → 01–07/11**, ICT. Kỳ mới cũng là MTD tháng 11 qua hết 07/11.

| Chỉ số | Tuần trước | Tuần mới | Chênh lệch |
|---|---:|---:|---:|
| Active users toàn property | 38 | 33 | −5 (−13,2%) |
| Sessions toàn property | 110 | 93 | −17 (−15,5%) |
| Pageviews toàn property | 668 | 472 | −196 (−29,3%) |
| Sessions hostname `travelframe.sidevn.com` | 78 | 68 | −10 |
| Sessions sau bỏ hostname/nguồn kiểm thử nhận diện được | 60 | 67 | +7 (+11,7%) |
| Active users sau bộ lọc trên | 33 | 27 | −6 (−18,2%) |
| Pageviews sau bộ lọc trên | 236 | 226 | −10 (−4,2%) |
| Sessions kỹ thuật đã tách | 50 | 26 | −24 |
| Pageviews kỹ thuật đã tách | 432 | 246 | −186 |

**Vì sao tổng phiên giảm dù phần còn lại tăng?** Nhóm kỹ thuật giảm **24 phiên**, còn phần sau lọc tăng **7 phiên**, cộng lại thành **−17 phiên toàn property**. Nhóm kỹ thuật gồm hostname `127.0.0.1` và nguồn localhost trên hostname website; không tính trùng. Phần đã lọc vẫn có hoạt động quản trị và có thể lẫn nội bộ đi qua Direct.

| Nguồn phiên trên hostname website | 25–31/10 | 01–07/11 | Thay đổi |
|---|---:|---:|---:|
| Direct | 17 | 40 | +23 |
| Google organic | 25 | 11 | −14 |
| Instagram (social/bio/referral) | 10 | 7 | −3 |
| Facebook (page button/referral) | 7 | 6 | −1 |
| Zalo | 0 | 3 | +3 |
| Threads + Cốc Cốc | 2 | 0 | −2 |
| Tổng nhóm trên | 61 | 67 | +6 |
| Tổng truy vấn lọc nguồn, không chia nhóm | 60 | 67 | +7 |

Giữ chênh **1 phiên** ở kỳ trước giữa báo cáo phân nguồn và báo cáo tổng. Tăng Direct **+23** bù giảm tìm kiếm và social; chưa biết bao nhiêu Direct là người dùng bên ngoài. MTD có **27 active users, 67 phiên, 226 views** theo bộ lọc nhận diện đã mô tả. Riêng ngày lịch **07/11**: **6 phiên, 5 active users, 17 views**; nguồn gồm Zalo 3, Instagram 1, Facebook 1, Direct 1. Ngày dưới 30 phiên: không diễn giải bounce rate, thời lượng hoặc ý định mua.

| Điểm đo trên hostname website | Tuần trước | Tuần mới |
|---|---:|---:|
| `/booking` views | 5 | 1 |
| `/booking/details` views | 6 | 23 |
| `/booking/payment` views | 2 | 4 |
| `begin_booking` events | 11 | 15 |
| `begin_checkout` events | 2 | 4 |
| `form_submit` tại đường dẫn booking | 0 ghi nhận | 0 ghi nhận |
| `purchase` events | 0 ghi nhận | 0 ghi nhận |

**Điểm cần kiểm chứng:** 16/23 views `/booking/details` kỳ mới mang nguồn Direct. Các trang có thể được truy cập trực tiếp hoặc từ lộ trình khác, nên bảng này không phải phễu rơi rụng. `form_submit` duy nhất phát sinh giờ **21h ngày 02/11**, Direct, tại **`/node/57/edit`**, không có event gửi form ở đường dẫn booking trong truy vấn. Không kết luận form hỏng nếu chưa thử và đối chiếu backend.

## 4. Nội dung đã đăng và seed comment

Trong cửa sổ **07/11 08:30 → 08/11 08:30 ICT**, Meta API xác nhận **1 Reel trên Instagram và 1 bài Reel trên Facebook**. Đây là hai bản đăng của cùng nội dung Bít tết, không phải hai nội dung gốc.

| Đăng ICT | Kênh | Bài / ID nền tảng | Quan sát tại 10:45 ICT | Reach, views, saves, shares, link clicks 24h / 72h | C1 / C2 | Trạng thái |
|---|---|---|---|---|---|---|
| 07/11 13:40 | IG | [Bít tết · 18117105824325548](https://www.instagram.com/reel/DfbjmGMtQgH/) | 68 likes, 4 comments | Chưa tới 24h; chưa có số đúng mốc | Có biến thể trong tracker, chưa xác minh đăng | Published |
| 07/11 13:40 | FB | [Bít tết · 1409099405611405_122126420409479755](https://www.facebook.com/reel/1509818901002655/) | 5 shares | Chưa tới 24h; chưa có số đúng mốc | Có biến thể trong tracker, chưa xác minh đăng | Published |

Likes/comments/shares là số tích lũy tại lúc lấy, khoảng **21 giờ sau đăng**. Không dùng để xếp hạng hiệu quả 24h/72h hoặc suy ra nguồn organic. Tracker có biến thể C1/C2 nhưng các ô thời gian trống; không coi kế hoạch là đã đăng comment. Đối với các bài khác trong tuần, bằng chứng ID và permalink nằm trong [snapshot Meta](../Snapshots/2026-11-08-API-Performance-Review/meta-initial.json).

## 5. Cảnh báo dữ liệu

- **Khung đo:** báo cáo sáng có con số reach 10.465 nhưng chưa có bộ tham số và biên ngày trùng với lần truy vấn này. Không tính chênh lệch 10.465 → 4.469 như biến động hiệu quả. Chỉ so sánh các kỳ truy vấn trực tiếp ghi ở trên.
- **Website:** bộ lọc tạm loại hostname khác và nguồn chứa localhost, 127.0.0.1 hoặc Tag Assistant; không sửa cấu hình GA4. Hostname website vẫn có lượt xem trang quản trị. GA4 đếm `sessions` và `session_start` khác nhau; bảng dùng `sessions`. Kết quả lọc đúng phút có thể thay đổi do dữ liệu đến trễ.
- **CRM:** 23/24 dòng dữ liệu có 17 cột, trong khi header có 18. Dùng các trường đầu ổn định để đếm ngày, kênh, lịch dự kiến và báo giá; không cộng cột cọc, không chuyển thành doanh thu. Không có trạng thái Deposited/Booked/Delivered hoặc bằng chứng booking xác minh trong tracker kiểm tra. Tổng thực thu ngoài tracker **Chưa đo**.
- **Quyền Meta:** truy vấn Messenger trả lỗi `pages_messaging`; tài khoản quảng cáo chưa được khóa trong connector TravelFrame. **Chi tiêu, kết quả ads, CPL, CAC, ROAS: Chưa đo.** Không mặc định bằng 0. Kiểm tra kết nối theo runbook đã đạt; không đăng công khai hoặc gửi tin.
- **Bằng chứng:** [Meta API theo ngày, bài và profile](../Snapshots/2026-11-08-API-Performance-Review/meta-initial.json), [Meta API 7 ngày](../Snapshots/2026-11-08-API-Performance-Review/meta-weekly.json), [GA4](../Snapshots/2026-11-08-API-Performance-Review/ga4.json), [truy vấn nguồn form và đường dẫn booking](../Snapshots/2026-11-08-API-Performance-Review/ga4-detail.json), [tổng hợp CRM](../Snapshots/2026-11-08-API-Performance-Review/crm-summary.json). Các tệp ghi tham số và thời điểm lấy; không lưu token.

## 6. Việc cần làm

| # | Việc cụ thể | Vị trí phễu | Chỉ số thành công | Phê duyệt |
|---|---|---|---|---|
| 1 | Rà liên hệ kỷ yếu có ngày dự kiến 08/11 trước, sau đó 5 dòng còn lại. Ghi giờ, số người, năng lực phục vụ, bước xác nhận lịch và chứng từ cọc nếu có. [Lead tracker](../Lead-Pipeline-Tracker.csv) | Tầng 7–8 | 6/6 có bước tiếp theo rõ; số lịch có bằng chứng xác nhận/cọc | Rà và soạn: **Tự vận hành**; gửi hoặc nhận cọc: **Cần Rocky duyệt** |
| 2 | Kiểm tra lại luồng gửi yêu cầu booking và đối chiếu backend. Tách event gửi yêu cầu thành công khỏi form chỉnh sửa nội dung. [Booking fix ticket](../../Sales-CRM/Funnel/2026-10-24-Booking-Fix-Ticket.md) | Tầng 6–8 | Một luồng thử có mã yêu cầu test, event đúng đường dẫn và kết quả backend khớp | Đọc và soạn test: **Tự vận hành**; thay đổi live: **Cần Rocky duyệt** |
| 3 | Soát link bio/UTM và chuẩn bị bộ lọc traffic nội bộ. Giữ hai cột tổng/đã loại test cho đến khi có bộ lọc xác nhận. [Quy chuẩn báo cáo](../Daily-Reporting-Standard.md) | Tầng 3–6 | Taps và sessions theo nguồn được ghi riêng; số phiên test nhìn thấy được | Soát: **Tự vận hành**; sửa link, GA4 hoặc automation: **Cần Rocky duyệt** |
| 4 | Ghi Reach, Views, Saves, Shares, Link clicks ở đúng tuổi bài của Reel Bít tết nếu nguồn có số. Kiểm tra C1/C2 bằng bằng chứng comment trước khi cập nhật. [Seed Comment Playbook](../../Marketing-Growth/Guidelines/2026-10-07-Seed-Comment-Playbook.md) | Tầng 1–4 | Hai bài có số 24h/72h hoặc ghi rõ chỉ số API không trả; C1/C2 có bằng chứng | Đọc và ghi nhận: **Tự vận hành**; đăng seed: **Cần Rocky duyệt** |
