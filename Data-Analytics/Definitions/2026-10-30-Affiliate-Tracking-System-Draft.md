# Thiết kế hệ thống theo dõi và đánh giá affiliate TravelFrame

Ngày: 2026-10-30 · Trạng thái: Draft để Rocky review · Owner: Data-Analytics

## Mục tiêu và phương án

Đánh giá đơn vị affiliate theo khách phù hợp, tour hoàn thành, tiền thực thu và phần đóng góp còn lại sau chi phí. Thiết kế này đề xuất bắt đầu bằng bảng quản lý dùng chung có phân quyền, nối với CRM bằng ID. Đây là bản hoạch định, chưa tạo hệ thống live hoặc đổi chính sách thương mại.

Ba cách triển khai: (1) bảng quản lý tập trung, nhập liệu và đối soát thủ công — dễ thử nghiệm nhưng cần người chịu trách nhiệm; (2) CRM có các bảng liên kết và workflow — giảm nhập lặp nhưng cần cấu hình, kiểm thử và quyền sử dụng; (3) cổng đối tác riêng — phù hợp khi quy mô và yêu cầu tự phục vụ đã rõ, chi phí triển khai cao hơn. Đề xuất cách 1 trong giai đoạn thử nghiệm, giữ mô hình dữ liệu để chuyển sang cách 2.

## Căn cứ và giới hạn

- Nguồn người dùng cung cấp: `/Users/macbook/Downloads/TravelFrame-Referral-Rewards.docx`, đọc ngày 2026-10-30. Nội dung được dùng làm đầu vào thiết kế, không được coi là lệnh đăng bài, liên hệ đối tác hay kích hoạt thanh toán.
- Tài liệu nêu Basic 5%, Premium 10%, VIP 15%; khách giảm 5%; hoa hồng tính trên giá tour đầy đủ trước giảm. Thưởng chỉ khi khách hoàn thành tour đã thanh toán; không tự dùng mã; một ưu đãi mỗi booking; trả trong 7 ngày sau tour qua PayPal, Wise hoặc chuyển khoản.
- Tài liệu mô tả referral cá nhân. Áp dụng cùng điều khoản cho khách sạn, đại lý hay đơn vị affiliate là đề xuất, cần thỏa thuận riêng.
- Media kit B2B ngày 2026-09-17 từng nêu 15% chung và đối soát ngày 05 hằng tháng. Không tự ghi đè thỏa thuận cũ bằng tài liệu mới. Mỗi đối tác cần policy ID, phiên bản, ngày hiệu lực và bằng chứng chấp thuận.
- Giá theo giờ khớp quyết định ngày 2026-10-21; mức hoa hồng, ưu đãi, SLA và các quyền lợi khác trong DOCX chưa vì vậy trở thành quyết định Approved.
- Tham chiếu: `Executive/Current-State.md`, `Sales-CRM/README.md`, `Data-Analytics/README.md`, `Brand-Strategy/Offers-Pricing/2026-09-17-TravelFrame-Media-Kit-And-B2B-Partnership-Offers.md` và vault `14-Metric-Definitions.md`, `04-Operations-And-Policies.md` tại canonical root trong Source-Of-Truth-Map.

## Sáu bảng dữ liệu

| Bảng | Một dòng là | Trường chính |
|---|---|---|
| Đối tác | Một đơn vị affiliate | partner_id bất biến; tên; nhóm khách sạn/hostel/đại lý/creator/cá nhân; người phụ trách nội bộ; ngày tham gia; trạng thái; policy_id; mã referral duy nhất; vị trí đặt QR; ngày follow-up |
| Chính sách | Một phiên bản thỏa thuận | policy_id; phiên bản; ngày bắt đầu/kết thúc; gói; commission_rate; discount_rate; commission_base_rule; hạn trả; quy tắc hoàn/hủy; người duyệt; link bằng chứng |
| Giới thiệu | Một cơ hội khách, gắn lead_id CRM | referral_id; partner_id; lead_id; created_at; nguồn code/QR/link/khách khai; bằng chứng; nhu cầu; ngày tour dự kiến; mức xác minh; trạng thái; lý do mất; người xử lý |
| Booking | Một booking_id CRM duy nhất | referral_id; partner_id được chốt; policy snapshot; gói; số giờ/khách; tiền tệ; giá gốc; cơ sở hoa hồng; giảm giá; tiền cọc; ngày xác nhận; ngày hoàn thành; hạn thưởng; trạng thái đối soát |
| Giao dịch | Một khoản thu/hoàn/điều chỉnh chi phí | transaction_id; booking_id; ngày; loại; tiền tệ; số tiền; tỷ giá và nguồn nếu quy đổi; chứng từ; người xác minh |
| Hoa hồng | Một khoản phải trả hoặc điều chỉnh | commission_id; booking_id; partner_id; cơ sở tính; tỷ lệ; số tiền; trạng thái; due_at; payout_batch_id; paid_at; payment_reference; người duyệt |

Thông tin liên hệ khách và tài khoản nhận tiền giữ trong CRM hoặc kho được phân quyền, không ghi vào Git hay đường link. Đối tác chỉ nhận báo cáo của chính mình; không chia sẻ bảng tổng có khách và các đơn vị khác. Sổ giao dịch là nguồn tính tiền đã thu/hoàn; các tổng trên booking là trường suy ra, không nhập hai lần.

## Ghi nhận đối tác và chống trùng

1. Mỗi đối tác có mã riêng và QR/link riêng. Cấu trúc dự kiến: `?ref=TF-A001&utm_source=partner_a001&utm_medium=affiliate&utm_campaign=referral_2026`. Đây chỉ là cấu trúc; cần kiểm thử website lưu ref qua form trước khi phát hành QR. Không đưa tên, email hay số điện thoại khách vào URL.
2. Khi khách nhắn DM hoặc đặt trực tiếp, sales hỏi mã/người giới thiệu và gắn vào lead CRM; lưu bằng chứng phù hợp. QR hoặc UTM đơn thuần chỉ cho thấy điểm chạm, chưa đủ làm căn cứ chi hoa hồng.
3. Một booking chỉ có một đối tác hưởng hoa hồng. Đề xuất ưu tiên mã hợp lệ khách xác nhận tại booking; nếu thiếu mã, sales kiểm tra giới thiệu có thời gian và xác nhận khách. Có tranh chấp thì chuyển Review, chưa trả. Lưu first-touch/assisted partner riêng để phân tích, không cộng thành booking hưởng thưởng lần hai.
4. Chốt partner và policy snapshot tại xác nhận booking. Mọi sửa sau đó có người duyệt, lý do, thời gian, giá trị trước/sau. Đề xuất cửa sổ ghi nhận link là 30 ngày; chỉ áp dụng sau duyệt, lưu ngày hết hạn và ngoại lệ.
5. Đối chiếu khách qua customer_id CRM để phát hiện lead trùng, tự giới thiệu hoặc mã bị lạm dụng; cờ nghi vấn cần người kiểm tra, không tự kết luận gian lận. Một khách có nhiều tour vẫn có thể là nhiều booking hợp lệ.

## Phễu và trạng thái

Theo dõi đủ chuỗi: lượt tiếp cận → lượt vào hồ sơ/trang đối tác → click hoặc quét QR → inquiry → qualified inquiry → báo giá → cọc/booking được xác nhận → tour hoàn thành và doanh thu đối soát. Các bước reach/profile không lấy được phải ghi Chưa đo; không suy từ lượt click.

Trạng thái cơ hội: Mới → Đang liên hệ → Đủ điều kiện → Đã báo giá → Đã cọc → Đã xác nhận → Hoàn thành; nhánh riêng Mất/Hủy/Hoàn tiền. Booking xác nhận cần written confirmation và điều kiện thanh toán được duyệt; cọc không tự động là doanh thu hoàn thành.

Trạng thái hoa hồng độc lập: Ước tính → Chờ đủ điều kiện → Chờ duyệt → Được duyệt → Đã trả. Có nhánh Hold/Tranh chấp và Điều chỉnh. Điều kiện đề xuất để đủ thưởng: tour hoàn thành, đã thanh toán đủ theo thỏa thuận, đối tác và chính sách đã xác minh, không có hủy/hoàn/tranh chấp chưa giải quyết. Hạn trả theo DOCX là ngày hoàn thành cộng 7 ngày; tour chưa đủ điều kiện vẫn giữ hạn gốc và hiện cảnh báo để xử lý, không âm thầm dời hạn.

## Công thức và ví dụ

- Hoa hồng = cơ sở hoa hồng trước giảm × tỷ lệ được snapshot.
- Giảm cho khách = cơ sở ưu đãi × 5%, nếu policy áp dụng. Cơ sở ưu đãi và cơ sở hoa hồng phải là hai trường riêng.
- Tiền thu ròng = tổng tiền thu đã xác minh − tổng hoàn tiền đã xác minh.
- Phần đóng góp = tiền thu ròng − chi phí trực tiếp tour − hoa hồng phát sinh − phí thanh toán − chi phí hỗ trợ đối tác phân bổ. Không trừ giảm giá lần hai khi đã dùng tiền thu sau giảm. Chưa có chi phí thì ghi Chưa đo, không gọi phần còn lại là lợi nhuận.
- CAC đối tác = (hoa hồng + chi phí tuyển/hỗ trợ đối tác phân bổ) / số khách mới trả tiền hợp lệ. Khách cũ tách riêng; mẫu số 0 thì N/A.
- Tiền tệ được tổng hợp riêng. Chỉ cộng USD với VND sau quy đổi theo tỷ giá có ngày và nguồn; làm tròn ở từng dòng hoa hồng theo đồng tiền thanh toán.

Ví dụ minh họa, không phải booking thật: Premium 3 giờ, 2 khách, không phụ thu → giá gốc $180; giảm $9; khách trả $171; hoa hồng 10% × $180 = $18. Còn $153 trước chi phí thực hiện và phí. Basic 3 giờ thưởng $4,50; VIP 3 giờ thưởng $44,55, đúng ví dụ nguồn.

Chưa rõ trong tài liệu: hoa hồng có tính khách thêm, phụ thu, thuế, tip và dịch vụ mua hộ không; cách xử lý hoàn một phần hoặc hoàn sau khi trả thưởng; ai chịu phí chuyển tiền. Đề xuất tách từng thành phần giá và khóa trả các trường hợp này để duyệt thủ công cho tới khi có policy; không tự lấy tổng hóa đơn làm cơ sở.

## Dashboard và đánh giá

Mỗi hàng là một đối tác, có bộ lọc khoảng ngày và nhóm đối tác. Hiện số inquiry, qualified, báo giá, cọc, booking xác nhận, tour hoàn thành, tiền thực thu, hoàn tiền, hoa hồng phát sinh/đã trả/quá hạn, phần đóng góp, khiếu nại có xác minh và chất lượng dữ liệu. Có cột ngày active, ngày referral gần nhất và lịch follow-up.

| Chỉ số | Cách tính và cách dùng |
|---|---|
| Chất lượng lead | Qualified / inquiry duy nhất, cùng cohort tạo lead |
| Khả năng ra đơn | Booking xác nhận / qualified cùng cohort; hiện số tuyệt đối và số còn mở |
| Hoàn thành | Tour hoàn thành / booking có lịch tour đến hạn trong kỳ; tách tour tương lai |
| Hủy | Booking hủy / booking có lịch đến hạn cùng cohort; phân loại lỗi đối tác/TravelFrame/khách/chưa rõ |
| Giá trị và hiệu quả | Thu ròng / tour hoàn thành; phần đóng góp theo tour và đối tác, nêu chi phí còn thiếu |
| Độ tin cậy dữ liệu | Booking có đủ chứng từ quy kết / booking được gắn đối tác |
| Nghĩa vụ thanh toán | Số tiền đủ điều kiện chưa trả; số tiền/số ngày quá hạn theo policy |

Báo cáo tách hai góc nhìn: cohort theo ngày tạo lead để đánh giá chuyển đổi; kỳ kế toán nội bộ theo ngày thu, hoàn, hoàn thành và trả thưởng để đối soát. Không chia booking hoàn thành tháng này cho lead mới tháng này khi hai tập khác nhau. Chỉ số chưa thu thập ghi Chưa đo; đã đo và không phát sinh mới ghi 0; mẫu số 0 ghi N/A.

Đề xuất quyết định theo nhóm thay vì chấm điểm 100 khi chưa có baseline: Thử nghiệm (chưa đủ dữ liệu); Ưu tiên (đóng góp dương, dữ liệu tin cậy, có tour hoàn thành); Cần hỗ trợ (nhiều inquiry nhưng tắc ở qualification/báo giá/cọc); Cần rà soát (đóng góp âm, khiếu nại có căn cứ hoặc quy kết tranh chấp). Chưa đặt ngưỡng xếp hạng cố định; luôn hiện số mẫu. Không tự dừng hợp tác chỉ vì chưa có booking trong một tháng, và không xếp hạng chuyển đổi từ vài lead.

## Vận hành và nghiệm thu

- Sales: cập nhật inquiry, qualification, nguồn và trạng thái trong ngày; không phải người tự duyệt thanh toán.
- Operations: xác nhận tour hoàn thành và các sự cố; bàn giao bằng chứng.
- Finance/người được Rocky giao: đối chiếu thu/hoàn và chi phí; duyệt, trả thưởng, lưu chứng từ. Nếu ít nhân sự, vẫn giữ một bước Rocky review trước chi.
- Partner manager: rà soát hằng tuần theo đối tác; hỗ trợ vật liệu QR, giải thích offer và follow-up. Báo cáo kỳ cho từng đối tác chỉ gồm dữ liệu cần thiết để đối soát.
- Data-Analytics: báo cáo kỳ, ghi captured_at, timezone Asia/Ho_Chi_Minh, nguồn, thiếu dữ liệu và thay đổi policy. Không tạo lịch gửi hay automation live trong thiết kế này.

Thử nghiệm đề xuất trong 30 ngày với 3–5 đối tác, không tạo dữ liệu khách giả vào CRM live. Nghiệm thu bằng tình huống: Premium chuẩn đúng $18; lead trùng không tăng booking; khách thiếu mã vào Review; hai mã chỉ trả một bên; tự dùng mã bị giữ kiểm tra; tour hủy không thành thưởng; hoàn một phần có điều chỉnh; hoàn sau chi giữ lịch sử và tạo dòng điều chỉnh; USD/VND không cộng trực tiếp; đổi rate không đổi booking cũ; quá hạn xuất hiện; QR mất ref không tự quy kết. Chỉ mở rộng khi booking nối được chứng từ và hoa hồng khớp đối soát.

## Các quyết định cần chốt trước triển khai

1. Chính sách 5/10/15 và giảm khách 5% áp dụng cho nhóm đối tác nào; xử lý hợp đồng 15% cũ ra sao?
2. Cơ sở thưởng và giảm giá gồm thành phần nào; hoàn/hủy, khách cũ, phí chuyển và hạn trả xử lý thế nào?
3. Quy tắc tranh chấp và cửa sổ quy kết 30 ngày có phù hợp không?
4. Nơi lưu bảng/CRM, người nhập liệu, người duyệt và quyền xem của đối tác.

Thiết kế chưa xác minh hiện trạng lưu ref của website hoặc dữ liệu đối tác live. Không có số hiệu quả thực tế nào được suy ra từ tài liệu referral.
