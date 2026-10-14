# TravelFrame: Báo cáo điều hành website và mạng xã hội

- Owner: Data-Analytics
- Trạng thái: Review
- Cập nhật: 2026-10-09, khoảng 12:05–12:10, GMT+7
- Kỳ chính: 2026-10-02 đến 2026-10-08; kỳ đối chiếu: 2026-09-25 đến 2026-10-01.
- Nguồn: truy vấn mới GA4 Data API, MCP Meta chỉ đọc và Facebook Business Suite; kiểm tra trực tiếp website.
- Phạm vi: báo cáo và khuyến nghị, chưa thực hiện sửa website hoặc xuất bản nội dung.

## 1. Kết luận điều hành

**TravelFrame đang giảm phân phối và tương tác trên cả Facebook lẫn Instagram. Website tăng người dùng và lượt vào trang đặt lịch, nhưng chất lượng tương tác giảm và chưa có bằng chứng đối soát chuyển đổi thành booking.**

Ưu tiên quản trị: sửa điểm đứt trong phễu, đo được yêu cầu tư vấn/đặt lịch và nối nội dung hữu ích với dịch vụ dành cho nữ du lịch một mình. Chưa đủ cơ sở tăng ngân sách dựa trên tăng follower hoặc lượt xem trang booking.

Instagram giảm reach 20,1%, views 27,5% và interactions 37,0%, nhưng profile visits tăng 44,9%. Facebook giảm views 50,6% và interactions 62,7%, trong khi link clicks tăng từ 4 lên 268. Website tăng người dùng 61,7% nhưng engagement rate giảm 13,3 điểm phần trăm. Đây là tín hiệu tăng trưởng không đồng đều giữa các tầng phễu.

## 2. Scorecard theo kênh

### Instagram — cửa sổ yêu cầu GMT+7

| Chỉ số | 02–08/10 | 25/09–01/10 | Thay đổi |
|---|---:|---:|---:|
| Reach | 37.025 | 46.346 | -20,1% |
| Views | 63.852 | 88.126 | -27,5% |
| Accounts engaged | 1.539 | 1.988 | -22,6% |
| Content interactions | 2.224 | 3.528 | -37,0% |
| Saves | 633 | 1.012 | -37,5% |
| Shares | 334 | 572 | -41,6% |
| Profile visits | 400 | 276 | +44,9% |

Follower tại thời điểm kiểm tra: **425**; media count: **139**. Ngày 08/10 theo cửa sổ API yêu cầu: reach 3.221, views 4.930, interactions 118, profile visits 45. Có phân phối đang diễn ra; không đủ chứng minh tình trạng recommendation eligibility hoặc nguyên nhân thay đổi thuật toán.

Tỷ lệ số lượt profile visits/reach tăng từ 0,60% lên 1,08%; đây là tỷ số giữa các chỉ số, không phải tỷ lệ chuyển đổi người dùng đã theo dõi xuyên phễu. Interactions/reach giảm từ 7,61% xuống 6,01%, cho thấy tương tác giảm nhanh hơn quy mô tiếp cận.

### Facebook — ngày trên dashboard theo Pacific time

**Kỳ Facebook là tạm tính:** lúc kiểm tra khoảng 12:05 GMT+7 ngày 09/10, Pacific còn khoảng 22:05 ngày 08/10. Vì vậy ngày cuối 08/10 trên Facebook chưa khép lại, còn khoảng hai giờ và độ trễ xử lý. Mức giảm dưới đây chưa phải chốt bảy ngày trọn vẹn theo Pacific; không dùng làm so sánh chính xác từng giờ với GA4/Instagram.

| Chỉ số | 02–08/10 | 25/09–01/10 | Thay đổi |
|---|---:|---:|---:|
| Views | 174.272 | 352.430 | -50,6% |
| Content interactions | 1.021 | 2.734 | -62,7% |
| Visits | 1.261 | 1.596 | -21,0% |
| Link clicks | 268 | 4 | +6.600% |

Views, interactions, visits và clicks được cộng từ các hàng ngày trong bảng biểu đồ Business Suite; đều là chỉ số có thể cộng, không cộng daily viewers để suy ra người xem duy nhất cả kỳ. Headline viewers kỳ hiện tại hiển thị khoảng **90,1 nghìn**, giảm **39,9%**. Follower hiện tại qua API: **1.734**.

Dashboard headline Follows hiển thị 309, nhưng cộng hàng daily Primary ra 315. Không dùng chỉ số follows này để tính tăng trưởng net hoặc suy ra organic growth; cần đối soát thêm trước khi sử dụng.

268 link clicks không đồng nghĩa 268 phiên website: có thể khác đích đến, nhấp lặp, nguồn attribution hoặc múi giờ. Chưa có phân tách organic/paid của social insights trong báo cáo này.

### Website — GA4 Asia/Saigon, sau lọc

| Chỉ số | 02–08/10 | 25/09–01/10 | Thay đổi |
|---|---:|---:|---:|
| Active users | 76 | 47 | +61,7% |
| Sessions | 106 | 89 | +19,1% |
| Pageviews | 251 | 236 | +6,4% |
| Engagement rate | 51,9% | 65,2% | -13,3 điểm % |
| Active users tại /booking | 19 | 8 | +137,5% |
| Pageviews tại /booking | 41 | 11 | +272,7% |
| GA4 key events | 0 | 0 | Chưa có chuyển đổi được ghi nhận |

Pageviews/session giảm từ 2,65 xuống 2,37, khoảng 10,7%. Trang /tours có 28 active users và 56 views; bài /news/hanoi-photographer-tour-guide có 11 active users và 14 views. Lượt vào /booking thể hiện xem xét dịch vụ, chưa chứng minh khách đủ điều kiện hoặc booking.

GA4 lọc hostname travelframe.sidevn.com, loại pagePath dưới /travelframe-admin, /admin, /login, /user, /node và sessionSource chứa tagassistant. Trước khi loại Tag Assistant, kỳ hiện tại có 128 sessions; sau lọc còn 106. Đây là lọc truy vấn, không khẳng định đã loại hết admin/test traffic đi qua trang công khai.

## 3. Chất lượng lưu lượng và diễn biến gần nhất

Các nhóm nguồn website, sau lọc, kỳ 02–08/10:

| Nhóm nguồn | Sessions | Tỷ trọng trên 106 sessions |
|---|---:|---:|
| Facebook referral/page_button và fb / paid | 31 | 29,2% |
| Instagram social/bio/referral | 29 | 27,4% |
| Direct | 27 | 25,5% |
| Google organic | 10 | 9,4% |
| Threads | 5 | 4,7% |

Các nhóm là tổng dòng sessionSourceMedium; phân loại nguồn không hoàn chỉnh, không đại diện người dùng duy nhất xuyên kênh. Số liệu có thể có sai khác nhỏ khi GA4 tổng hợp theo dimension. Facebook và Instagram đóng góp khoảng 56,6% số phiên đo được; chưa thể quy kết booking cho chúng.

Sessions theo ngày sau lọc: 02/10: 20; 03/10: 34; 04/10: 21; 05/10: 10; 06/10: 6; 07/10: 8; 08/10: 7. Website tăng theo tổng tuần nhưng hạ nhiệt sau đỉnh đầu kỳ. Mẫu nhỏ, chưa đủ kết luận xu hướng dài hạn. Ngày 08/10 engagement rate hiện trả về 0%; cần kiểm tra lại sau xử lý dữ liệu và kiểm tra tracking trước khi quy cho nội dung.

Ngày 09/10 đến thời điểm truy vấn: 5 active users, 5 sessions, 8 pageviews sau lọc. Đây là dữ liệu trong ngày chưa hoàn tất, không dùng so với ngày trọn vẹn.

## 4. Nội dung đang tạo tín hiệu tốt

Trong media trả về, các bài xuất bản 02–08/10 có likes/comments lũy kế đến thời điểm kiểm tra:

| Nội dung | Likes | Comments | Hướng ứng dụng |
|---|---:|---:|---|
| [Hanoi gắn với chuyến đi BIGBANG](https://www.instagram.com/reel/Dd_kM_OpQ5l/) | 240 | 4 | Hook gắn lý do đến Hà Nội với lịch trình; kiểm chứng sự kiện trước khi tái sử dụng |
| [Bánh mì tại Hà Nội](https://www.instagram.com/reel/DeJOZXZNPBJ/) | 122 | 1 | Một nhu cầu cụ thể, dễ hình dung, CTA nhận gợi ý địa phương |
| [Tiếng Việt để gọi món](https://www.instagram.com/reel/DeHIWwDJygU/) | 111 | 3 | Tình huống thực tế và câu có thể dùng ngay |
| [Cảm ơn bằng tiếng Việt](https://www.instagram.com/reel/DeBWVxntSKE/) | 28 | 3 | Utility ngắn, dễ lưu và thực hành |
| [Không biết tạo dáng](https://www.instagram.com/reel/DeBlrEkNV_n/) | 22 | 2 | Giải quyết nỗi ngại của khách trước trải nghiệm chụp ảnh |

Đây là ví dụ dẫn đầu theo tín hiệu likes/comments trong mẫu đọc được, không phải ranking reach, saves hoặc doanh thu từng bài. Likes/comments lũy kế không cùng định nghĩa với account interactions trong tuần. Bài gọi món 07/10 chỉ có 2 likes tại thời điểm kiểm tra, cho thấy cùng chủ đề vẫn có hiệu quả khác nhau; cần thêm media insights và kiểm tra hook/cover/retention trước khi gọi một format là winner ổn định.

## 5. Phễu chuyển đổi và tình trạng website

- /booking tải được, có bốn bước: Packages → Experience → Your details → Review & book. Hiện có nút WhatsApp, Instagram DM và hotline. Khuyến nghị cũ “thiếu nút liên hệ nhanh” đã không còn đúng tại thời điểm kiểm tra.
- Đường dẫn /guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf vẫn hiển thị Page not found và dấu exception_statuscode=404. Đây là điểm đứt cần xử lý; chưa lượng hóa được số lead thất thoát.
- Website đang trình bày visual package theo giờ và tour package riêng, nhiều lựa chọn ngay bước đầu. Nên kiểm thử sự rõ ràng của tổng giá và các khoản bao gồm; báo cáo này không xác nhận tính chính thức của giá/offer.
- GA4 chỉ ghi nhận các event công khai gồm page_view, user_engagement, session_start, scroll, first_visit và click trong truy vấn ban đầu; chưa có bằng chứng event booking thành công. Không có đối soát CRM/payment trong lượt cập nhật này.
- Vì thiếu chi phí ads và doanh thu đã đối soát cùng kỳ, chưa tính được CAC, MER, ROAS hoặc tỷ lệ lead → paid booking. Zero key events không có nghĩa zero booking ngoài đời.

## 6. Giới hạn và đính chính báo cáo trước

Nguồn báo cáo sáng 09/10 có các suy luận chưa được chứng minh: an toàn tuyệt đối/không shadowban; tăng trưởng 100% organic; archive/cool-down khiến Meta phục hồi; khách Mumbai hai ngày là cùng một người; saves là ý định mua tour cao nhất. Báo cáo này không dùng các nhận định đó làm căn cứ.

Muốn xác định restriction cần Account Status/recommendation eligibility; muốn xác định nguyên nhân sụt giảm cần phân rã organic/paid, bài đăng, cadence, retention và lịch thay đổi. Tăng follower đồng thời giảm reach có thể xảy ra; follower tăng không phủ định giảm phân phối.

Facebook dùng Pacific time, GA4 dùng Asia/Saigon, Instagram dùng since/until theo GMT+7 đã gửi tới API; backend Meta có thể có quy tắc bucket riêng. So sánh nội bộ từng nguồn là cơ sở chính, không ghép chúng thành một phễu người dùng chính xác. Ngày 08/10 đã hết theo GMT+7 nhưng chưa hết theo Pacific khi kiểm tra; cả hai còn có thể thay đổi vì độ trễ xử lý.

Kết nối mới đã đọc thành công đúng Page và IG. Bài kiểm tra theo runbook xác nhận SYSTEM_USER, app TravelFrame Automation, hạn Never; FB thử bài ẩn rồi xóa, IG thử container FINISHED và không publish. Không ghi credential trong báo cáo.

## 7. Quyết định ưu tiên trong 72 giờ

| Ưu tiên | Hành động đề xuất | Owner | Tiêu chí xác nhận |
|---|---|---|---|
| P0 | Sửa hoặc thay đường dẫn PDF ở mọi CTA đang sử dụng | Technology-Automation + Marketing-Growth | Link tải hợp lệ, kiểm thử mobile; thử từ link thật trên social |
| P0 | Audit tracking yêu cầu đặt lịch, nhấp WhatsApp/IG và event gửi thành công | Data-Analytics + Technology-Automation | Loại traffic nội bộ; sự kiện chỉ firing đúng kết quả, đối soát một lead thật |
| P1 | Nối nội dung utility với photo walk cho nữ solo traveler | Marketing-Growth | CTA nhất quán PHOTO + ngày ở Hà Nội; ghi số qualified inquiries theo bài |
| P1 | Kiểm tra từng điểm bỏ dở của booking và tổng giá | Sales-CRM + Technology-Automation | Khách hiểu phần nào được bao gồm; có phương án hỏi tư vấn ngay |
| P1 | Kiểm tra Account Status và phân rã organic/paid, retention từng Reel | Marketing-Growth + Data-Analytics | Có bằng chứng nền tảng; không chẩn đoán từ follower đơn lẻ |

Đề xuất thử cơ cấu nội dung trong bảy ngày: 50% utility đúng nữ solo traveler, 30% trải nghiệm chụp ảnh/BTS, 20% offer và giải đáp băn khoăn. Đây là giả thuyết thử nghiệm, không phải tỷ lệ đã được dữ liệu chứng minh tối ưu. Ưu tiên tình huống gọi món khi đi một mình, tuyến đi bộ dễ theo, cách có ảnh tự nhiên và trải nghiệm thực tế với local photographer; các claim an toàn phải có nguồn kiểm chứng.

## 8. Tiêu chí review tuần tới

Theo dõi reach, views, saves, shares, profile visits riêng theo kênh; website sessions đã lọc, booking views, số nhấp liên hệ và gửi yêu cầu thành công; Sales-CRM ghi qualified inquiries, báo giá, cọc, booking và doanh thu theo source/content ID.

Quyết định mở rộng chỉ sau khi có tín hiệu lead chất lượng và booking đối soát. Nếu reach tiếp tục giảm nhưng qualified inquiries tăng, ưu tiên cải thiện chất lượng chuyển đổi thay vì chỉ phục hồi views. Nếu cả reach và inquiries cùng giảm, kiểm tra hook/retention, cadence, phân phối paid/organic và restriction trước khi đổi chiến lược lớn.

Tham chiếu vận hành: Data-Analytics/Measurement-Framework.md; Technology-Automation/Runbooks/Meta-Connection-And-Publishing-Runbook.md; Brand-Strategy/Source-Of-Truth-Map.md. Báo cáo là Review và chưa phê duyệt thay đổi nội dung live, giá, quyền hay ngân sách.
