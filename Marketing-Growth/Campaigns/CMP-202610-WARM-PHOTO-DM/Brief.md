---
title: TravelFrame — thử nghiệm Meta Ads photo walk và retargeting
owner: Marketing-Growth
status: Approved
created: 2026-10-09
updated: 2026-10-09
---

# Campaign Brief: CMP-202610-WARM-PHOTO-DM

Phương án được Rocky phê duyệt ngày 2026-10-09: “oke chốt phương án này”. Xem [Decision Record](../../../Executive/DEC-20261009-WARM-PHOTO-DM.md) cho scope và điều chỉnh pilot cũ. Chưa tạo audience, sửa GTM/Pixel, sản xuất asset hay chạy quảng cáo. Triển khai live còn phụ thuộc chốt commercial offer, asset rights, inbox, audience/account và kiểm tra trước chạy; approval phương án không phải platform evidence hoặc yêu cầu bật quảng cáo trong lượt này.

## 1. Mục tiêu và giả định

- Tìm khách quốc tế có nhu cầu chụp ảnh tại Hà Nội, chuyển từ quảng cáo → tin nhắn → qualified inquiry → báo giá → đặt cọc đã đối soát.
- Offer dự kiến: Private Photographer Service theo pilot 2026-09-15, thể hiện bằng photo walk với hỗ trợ tạo dáng. Route, số ảnh, thời lượng, giá, lịch trống và delivery phải khóa trong báo giá được duyệt.
- Khách nữ đi một mình là giả thuyết creative ưu tiên; chưa khẳng định đây là nhóm hiệu quả nhất. Creative trải nghiệm hai người là control ứng viên.
- Chỉ số chính: cost per qualified inquiry (CPQI). Kết quả kinh doanh: paid deposits và CAC trên booking đối soát. Không tính ROAS khi chưa có doanh thu cùng kỳ/cửa sổ attribution.
- Qualified inquiry: có ngày hoặc khoảng ngày tới Hà Nội, số người, nhu cầu chụp ảnh rõ ràng, mong muốn nhận tư vấn/báo giá và ngày đi khả thi theo năng lực phục vụ. Hỏi địa điểm/nhận tips đơn thuần chưa tính qualified. Thêm trường budget-fit sau khi đã tư vấn giá.
- Cửa sổ thử đã duyệt: 14 ngày chạy kể từ khi cấu hình kiểm tra đạt và chiến dịch được kích hoạt; không tự đặt ngày bắt đầu.
- Ngân sách Rocky chọn: 300.000 VND/ngày; với thời gian đề xuất 14 ngày, tổng trần media là 4.200.000 VND. Thuế/phí thanh toán và production tách riêng. Đối soát chi tiêu pilot 300 USD trước khi quyết định đây là phần còn lại hay ngân sách mới; không coi số dư 265 USD trong draft 07/10 là số dư hiện tại.

## 2. Đính chính tài liệu đầu vào

| Nhận định trong tài liệu | Cách dùng trong kế hoạch |
|---|---|
| Warm có ROAS cao nhất, chi phí rẻ hơn 60–80% | Không có dữ liệu TravelFrame chứng minh; không dùng để dự báo |
| Save là khách sắp đi Hà Nội 1–3 tháng | Save thể hiện quan tâm nội dung, chưa xác nhận ngày đi hay ý định mua |
| 5.800+ người xem/tương tác = audience chạy được | Phải kiểm tra unique users, match và trạng thái khả dụng trong Ads Manager; không cộng views/interactions |
| Có GTM là sẵn website retargeting | GTM không chứng minh Pixel đang gửi event; cần kiểm tra runtime/Test Events. Tìm chuỗi trong HTML không đủ kết luận Pixel có hoặc không hoạt động |
| Có thể nhắm người dùng roaming/SIM du lịch | Không đưa vào cấu hình khi chưa thấy tùy chọn hợp lệ và được xác minh trong tài khoản |
| English + Hà Nội = du khách quốc tế | Chỉ là bộ lọc gần đúng; creative và câu hỏi ngày đi phải xác nhận |
| act_1423800382160162 đã sẵn sàng | Là ID được tài liệu và draft nội bộ nhắc đến; chưa xác minh live, không gọi API tài khoản dựa vào suy luận |

## 3. Bằng chứng hiện có

- CSV 2026-10-02–05: chi 927.022 VND, 14 messaging conversations reported, khoảng 66.216 VND/conversation. Video 2 tourists có 12 kết quả, khoảng 58.250 VND/result. Không có qualified DM, booking hoặc doanh thu đối soát.
- Báo cáo Review 2026-10-09, kỳ 02–08/10: Instagram accounts engaged 1.539; GA4 website 76 active users, /booking 19 active users. Các số này không phải quy mô matched Custom Audience. Zero GA4 key events không chứng minh zero booking ngoài đời.
- Pilot Approved 2026-09-15: trần 300 USD, Instagram DM, không tạo campaign retargeting riêng. Draft strategy v2 2026-10-07 chưa thay thế approval này.

## 4. Các phương án

| Phương án | Lợi ích | Hạn chế |
|---|---|---|
| A. Tìm khách mới + warm có điều kiện — đề xuất | Có nguồn khách mới, kiểm tra được giá trị warm | Cần xác minh audience và sửa giới hạn pilot trước khi tách warm |
| B. Chỉ warm social | Tập trung người đã biết TravelFrame | Có thể nhiều người chỉ thích tips; tệp dễ nhỏ hoặc mệt creative |
| C. Chỉ website retargeting | Gần hành vi xem dịch vụ hơn | Chưa xác minh Pixel, lượng truy cập thấp, không có audience lịch sử nếu chưa thu thập |

## 5. Cấu trúc và phân bổ ngân sách

Một campaign, tối đa hai ad set, dùng ad-set budget để kiểm soát khoản thử. Không mở thêm campaign pre-trip/lookalike ở vòng này. Dùng objective hỗ trợ messaging trong giao diện thực tế: ưu tiên Leads → Instagram Direct nếu khả dụng theo pilot; Engagement → messaging là phương án thay thế cần ghi nhận, chọn tối ưu hội thoại chứ không tối ưu likes.

| Ad set | Audience đề xuất | Ngân sách/ngày khi đủ điều kiện |
|---|---|---:|
| AS-HANOI-PROSPECT | Hà Nội, phạm vi phục vụ thực tế quanh Hoàn Kiếm; người trưởng thành, English, broad; nội dung nhắc rõ dịch vụ chụp ảnh và hỏi ngày đi | 210.000 VND |
| AS-HANOI-WARM | Hợp nhất IG/FB engagement 90 ngày và video viewers ≥50% 90 ngày ở khu vực phục vụ; saves/messages làm nguồn nếu UI hỗ trợ. Dùng 30 ngày khi đủ phân phối; mở tới 180 ngày chỉ khi cần và kiểm tra độ phù hợp | 90.000 VND |

- Điều chỉnh tách warm đã được Rocky duyệt trong Decision Record; chỉ tách khi Ads Manager báo audience khả dụng và kiểm tra phân phối thực tế phù hợp. Không xem 1.000 người là điều kiện platform bắt buộc hoặc ấn định dựa trên organic insights.
- Nếu chưa đủ điều kiện: chỉ một ad set prospect, tối đa 300.000 VND/ngày, có creative FAQ để xử lý phản đối. Phương án dự phòng này thuộc cấu trúc đã duyệt.
- Nếu ngân sách 100.000 VND/ngày: một ad set, hai creative; tổng media 1.400.000 VND/14 ngày. Không chia 4 tệp.
- Khi tách audience, kiểm tra custom audience là giới hạn thật hay chỉ suggestion. Nếu Meta mở rộng ngoài tệp, ghi tên là warm-seeded prospecting và không báo kết quả như strict retargeting.
- Exclude booking đã xác nhận; với warm loại inquiry đang được tư vấn để hạn chế gây phiền. Prospect loại tệp warm nếu cấu hình hỗ trợ và muốn so sánh riêng. Không upload danh sách khách chưa được phép dùng.
- Không target nhiều nước nguồn ở vòng đầu. Người sắp đến Hà Nội từ nước ngoài cần pilot pre-trip riêng với câu hỏi ngày đi, sau khi đợt này có chất lượng lead rõ.
- Lookalike chỉ cân nhắc sau khi có nguồn lead/booking chất lượng, đủ matched users và đủ ngân sách. Không lấy saves làm bằng chứng khách tốt.

## 6. Kênh, placements và DM

Instagram Direct là điểm nhận tin nhắn đề xuất vì bám funnel hiện có. Chỉ chọn placements được Ads Manager xác nhận tương thích với destination; không mặc định Instagram Direct phủ được mọi placement Facebook. Nếu Rocky muốn Facebook-only, đề xuất đổi sang Messenger sau khi thử nhận/trả lời tin nhắn qua Page; không chia thêm Messenger và WhatsApp trong pilot nhỏ.

CTA: Send Message. Câu mở đầu dự kiến: “Hi! What dates will you be in Hanoi, how many people are joining, and are you looking for photos, a local walk, or both?”

Người tư vấn xác nhận nhu cầu → sample có quyền sử dụng → báo giá và inclusions/exclusions → hỏi có muốn giữ lịch không → written confirmation → đối soát deposit. Phản hồi trong 30 phút trong ca trực là mục tiêu nội bộ đề xuất, chưa phải SLA thương mại. Ngoài giờ hiển thị thời gian quay lại; người phụ trách trực phải được chốt trước chạy. Chỉ follow-up khi phù hợp quyền và quy định của kênh, không tự gửi từ bản kế hoạch.

## 7. Creative đề xuất

Tối đa ba quảng cáo trong mỗi ad set, ưu tiên hai mẫu ban đầu. Danh mục và copy nằm ở Production-Index.md; chưa sản xuất. Chủ đề:

1. Trải nghiệm thật: host hỗ trợ và ảnh thành phẩm, dùng Video 2 tourists làm control ứng viên sau khi kiểm tra asset/release.
2. Không biết tạo dáng: minh họa động tác đơn giản, không dùng claim “đa số khách nói…” thiếu evidence.
3. Cách đặt lịch: gửi ngày đi → thống nhất nhu cầu → nhận route và báo giá.

Ưu tiên footage sở hữu và ảnh có consent; nhạc organic phải có quyền chạy paid ads. Không dùng ảnh AI như ảnh khách thật. Video 9:16, 15–25 giây, English subtitles, chữ trong safe zones; chuẩn bị crop phù hợp Feed. Không hứa giá, số ảnh, delivery hay access khi chưa duyệt.

## 8. Website measurement

Không cần đợi website audience để thử tin nhắn, nhưng website retargeting chỉ mở sau khi xác minh:

1. Dataset/Pixel thuộc đúng tài sản và quyền sử dụng; tag chỉ kích hoạt phù hợp consent hiện hành.
2. PageView thực sự nhận trong Test Events khi browser tải website; tránh duplicate tag.
3. ViewContent cho trang dịch vụ; Lead chỉ khi inquiry gửi thành công; InitiateCheckout chỉ khi khách thực sự bắt đầu checkout; Purchase chỉ khi payment đã xác nhận, có value/currency và dedup nếu dùng CAPI.
4. Tạo tệp /booking 7–30 ngày và /tours 30 ngày khi matched audience đủ dùng; bổ sung vào warm thay vì mở thêm ad set ngân sách nhỏ.
5. Không hồi tố website visits trước khi Pixel bắt đầu thu thập. Không gửi nội dung DM hoặc thông tin nhạy cảm trong URL/event.
6. Link website phụ có UTM theo campaign/ad. Hội thoại ghi nguồn ad/referral khi có; không xem UTM website là đủ attribution cho DM.

## 9. Lịch thực hiện và quy tắc quyết định

- Chuẩn bị: duyệt offer/budget/cấu trúc, xác nhận ad account trực tiếp, kiểm tra inbox/destination, audience, asset rights, spending limit và ghi baseline CRM. Không bật nếu offer chưa chốt.
- Ngày 1–3: tối đa hai creative; kiểm tra delivery, chi thực tế và câu hỏi đầu inbox mỗi ngày. Sửa ngay lỗi destination/tracking/asset, không đợi hết tuần.
- Ngày 4–7: đối soát từng inquiry theo ad; dùng ngày đi và nhu cầu để nhận diện lead lệch. Nếu warm phân phối thấp, kiểm tra quy mô/expansion/frequency; giảm phân bổ hoặc gộp lại sau duyệt, không ép chi.
- Ngày 8–14: ưu tiên mẫu có CPQI và budget-fit tốt hơn khi mẫu đủ đánh giá; thay một angle mỗi lần. Không gọi đây là A/B test ngẫu nhiên nếu Meta tự chia impressions.
- Ngày 14: chốt spend/qualified/quote/deposit; để trạng thái pending với khách chưa ra quyết định và báo cáo lại sau độ trễ phù hợp. Không gọi mẫu thắng từ một booking.
- Đặt CAC tối đa trước khi chạy: giá trị booking trừ chi phí trực tiếp thực hiện và phần lợi nhuận cần giữ. CPQI trần = CAC tối đa × tỷ lệ qualified → paid booking. Khi tỷ lệ chưa biết, dùng nhiều kịch bản; không áp benchmark B2B vào photo walk.
- Mốc chi một ad bằng 2 × CPQI trần mà chưa có qualified inquiry là tín hiệu review, không quy tắc tự tắt. Kiểm tra attribution, độ trễ, chất lượng chat, learning và phân phối trước quyết định.
- Frequency warm tăng đồng thời CPQI xấu đi/chất lượng lead giảm là lý do thay creative hoặc giảm chi; không có frequency tuyệt đối chứng minh fatigue.
- Scale chỉ khi qualified inquiries phù hợp lịch/capacity và có deposit đối soát trong CAC cho phép. Mọi tăng chi nằm trong tổng trần đã duyệt, không tự gia hạn.

## 10. Kịch bản ngân sách, không phải cam kết

Nếu giữ chi phí hội thoại của CSV cũ, 4.200.000 / 66.216 ≈ 63 hội thoại. Nếu 20%–40% qualified thì khoảng 13–25 qualified inquiries. Đây là giả định nhạy cảm, có thể lệch nhiều vì audience, offer, destination và thời điểm khác. Chưa dự báo booking/ROAS.

## 11. Nguồn

- Tài liệu người dùng: /Users/macbook/.codex/attachments/65eaecc8-7d95-4395-94ed-aee4755e323e/Pasted text.txt.
- [Pilot Approved](../../Plans/TravelFrame-Meta-Ads-300USD-Pilot-2026-09-15.md), [Strategy v2 Draft](../../Plans/2026-10-07-Meta-Ads-Strategy-v2.md).
- [CSV report](../../../Data-Analytics/Reports/2026-10-05-TKQC-SIDE112-2-Meta-Ads-CSV-Report.md), [Executive report Review 09/10](../../../Data-Analytics/Reports/2026-10-09-TravelFrame-Executive-Performance-Update.md).
- Canonical: /Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame/02-Audience-And-Funnel.md; 03-Product-And-Guest-Experience.md; 11-Proof-And-Approved-Claims.md.
- [Meta Blueprint: Instagram Direct](https://agencies.facebookblueprint.com/student/page/631771): hỗ trợ hướng click-to-DM, không xác nhận cấu hình của tài khoản này.
- [Meta: Reels ads](https://www.facebook.com/business/ads/facebook-instagram-reels-ads): video dọc, safe zones, existing post và placement customization; không suy ra mức cải thiện của TravelFrame.
- Một số Meta Help pages yêu cầu login; chưa xác minh tùy chọn saves, expansion, location hay placements live. Backend Exa của Agent Reach không được cấu hình; tra cứu công khai qua web thay thế. Không gọi API trả phí.
