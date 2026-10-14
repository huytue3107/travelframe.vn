# Hà Nội — cơ sở lưu trú và đối tác TravelFrame

- Owner: Research-Insights
- Ngày bắt đầu: 2026-10-14
- Trạng thái: Working / chưa gửi liên hệ
- Phê duyệt trực tiếp: tối đa 5 USD Apify + 0,12 USD Jev.
- Ngày 2026-10-14: Rocky nâng trần Jev từ 0,10 lên 0,12 USD để chấm hết
  278 ứng viên còn chờ; giữ nguyên trần Apify và dùng dữ liệu đã lưu.

## Phạm vi và cách làm

Tìm khách sạn và homestay trên toàn địa bàn Hà Nội. Hostel, boutique hotel,
serviced apartment và resort được giữ khi có khả năng tiếp cận khách du lịch;
nhà nghỉ khác được giữ trong nguồn nhưng không tự coi là đối tác phù hợp.

1. Thu thập danh bạ công khai của cơ quan du lịch và hiệp hội; dùng Apify
   Google Search Results Scraper cho truy vấn tiếng Việt/Anh theo khu vực.
   Không bulk-extract Google Maps hoặc LinkedIn.
2. Hợp nhất theo tên, địa chỉ và website; không gộp chi nhánh chỉ vì chung
   domain. Giữ nguồn, thời điểm kiểm tra, loại cơ sở và nhãn bất định.
3. Truy cập website công khai của cơ sở, ưu tiên trang Contact/About/Tours.
   Thu thập địa chỉ email được xuất bản; không đoán email và không vượt login,
   CAPTCHA hay trang chặn truy cập. Email trong footer của hiệp hội hoặc OTA
   không được gán cho khách sạn.
4. Jev đánh giá từng cơ sở từ evidence; dữ liệu thiếu là Unknown, không là
   bằng chứng cơ sở không phù hợp. Jev không tạo email, địa chỉ hoặc nguồn.
5. Xuất bảng cơ sở, nhóm ưu tiên, bảng email và coverage/cost audit.

## Tiêu chí đối tác

Căn cứ canonical TravelFrame trong Side Agency vault: offer local host/guide +
ảnh/video tại Hà Nội; solo traveler, couple, nhóm nhỏ và khách quốc tế. Các
tiêu chí dưới đây là rubric nghiên cứu đề xuất, không là quyết định thương mại.

| Tiêu chí | Trọng số | Bằng chứng cần tìm |
|---|---:|---|
| Audience fit | 30 | Khách du lịch quốc tế, couple/solo, nội dung tiếng Anh |
| Vị trí và route fit | 20 | Địa chỉ thực tế tại Hà Nội, khả năng tiếp cận tuyến trải nghiệm |
| Referral fit | 20 | Concierge, tour desk, trải nghiệm địa phương, guest support |
| Brand/experience fit | 20 | Boutique/local storytelling, photography, trải nghiệm cá nhân |
| Khả năng liên hệ | 10 | Website hoặc liên hệ doanh nghiệp công khai |

Jev trả mức phù hợp tổng hợp, phân loại địa bàn/loại cơ sở, lý do chính và
confidence. Mọi lý do phải trỏ tới
evidence có sẵn. Điểm chỉ để ưu tiên nghiên cứu/tiếp cận; không chứng minh tỷ lệ
khách quốc tế, doanh thu, số phòng, quyền ký hợp tác hoặc willingness to partner.

## Kiểm soát chi phí và tính đầy đủ

- Giới hạn mỗi Apify run bằng `maxTotalChargeUsd`, ghi run ID trước khi poll.
- Timeout POST không được tự gửi lại; phải kiểm tra trạng thái để tránh chạy trùng.
- Chỉ dùng SERP cơ bản; tắt AI search, lead enrichment cá nhân và paid add-ons.
- Tổng Apify không vượt 5 USD. Tổng Jev không vượt 0,12 USD theo rate/usage
  được xác minh trước khi chạy. Không nạp tiền hoặc đổi plan.
- Email được công khai không đồng nghĩa verified deliverability. Kiểm tra
  syntax/domain MX; không gửi email kiểm chứng hoặc outreach.
- Độ phủ là số khu vực/truy vấn/nguồn hoàn tất. Không tuyên bố danh sách bao gồm
  100% mọi cơ sở đang hoạt động nếu chưa đối soát được registry đầy đủ hiện tại.

## Nguồn nội bộ

- `/Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame/01-Brand-Source-Of-Truth.md`
- `/Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame/02-Audience-And-Funnel.md`
- `/Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame/03-Product-And-Guest-Experience.md`
- `/Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame/04-Operations-And-Policies.md`

## Kiểm tra và tiếp tục

Đối soát số bản ghi, nguồn của email, trùng lặp, đơn vị ngoài Hà Nội, chi phí và
Jev response coverage trước khi xuất. Giữ raw evidence; khi hết budget lưu
checkpoint và liệt kê phần chưa làm. Chạy kiểm tra workspace theo AGENTS.md;
không sửa các baseline defects ngoài phạm vi nghiên cứu.

## Đối soát cuối ngày 2026-10-14

Đã chấm đủ 2.055/2.055 ứng viên; không chạy thêm Apify sau khi nâng trần Jev.
Một nhóm bị Jev trả HTTP 400 do cắt văn bản tại cặp ký tự Unicode. Đã xác nhận
nguyên nhân, sửa đoạn trích và kiểm tra Unicode của toàn bộ bản ghi trước khi
chấm tiếp. Các lần gửi thiếu usage, gồm timeout và HTTP 400, vẫn giữ dự phòng
chi phí; không tự coi là miễn phí. Một cache thành công chỉ đối soát một lần gửi.

Apify dùng 4,2302 USD. Jev có usage xác nhận 0,110175198 USD; mức trên thận trọng
gồm dự phòng là 0,115938774 USD, dưới trần 0,12 USD. Kết quả là 133 cơ sở P1/P2
và 573 email công khai gắn với 514 bản ghi cơ sở lưu trú Hà Nội đã phân loại.
