# TravelFrame tháng 10/2026: đánh giá website và social

*Cập nhật số chốt sáng 01/11/2026.*
*Người nhận: Rocky (Tổng Giám đốc) · Bộ phận: Data-Analytics · Trạng thái: Bản nháp*
*Nguồn: GA4 (552867189), Instagram Insights và Facebook Page qua Graph API v26.0, lấy ngày 31/10/2026; Lead-Pipeline-Tracker.csv; báo cáo chiến dịch Meta 01–07/10. Dashboard đi kèm: "TravelFrame Tháng 10".*
*Cách trình bày theo lối McKinsey: kết luận trước, bối cảnh – vấn đề – câu hỏi – trả lời, cây vấn đề không trùng không sót, mỗi phát hiện kèm ý nghĩa, việc cần làm xếp theo tác động và công sức.*

---

## 1. Kết luận chính

**Tháng 10 TravelFrame đã có người biết đến (383.552 lượt xem Instagram, Facebook thêm khoảng 1.200 follower kể từ 07/10) và bắt đầu có lead (17 lead, 8 báo giá), nhưng chưa có đồng doanh thu nào. Nút thắt không còn nằm ở việc thiếu người xem. Nó nằm ở hai bước cuối: khách không có cách đặt cọc, và form booking trên website không hoạt động như một kênh chốt. Ưu tiên tháng 11 là mở đường nhận cọc và chốt 7 báo giá đang mở, sau đó mới tăng traffic hay chạy lại quảng cáo.**

Đính chính so với dashboard: con số 391 người dùng website (gấp 3,5 lần tháng 9) bị thổi phồng. Hai ngày 13–14/10 có 220 người dùng với bounce rate 88% và 55 giây mỗi phiên, gần như toàn bộ từ Direct, nhiều khả năng là máy quét. Bỏ hai ngày này và phiên kiểm thử nội bộ, website còn tối đa khoảng 200 người dùng và 440 phiên (số chốt sáng 01/11).

---

## 2. Bối cảnh, vấn đề, câu hỏi và trả lời

| | |
|---|---|
| **Bối cảnh** | Tháng 10 đăng khoảng 100 bài IG và 100 bài FB. Từ 21/10 chốt bảng giá theo giờ $30 / $60 / $99 và quyết định giảm số bài, chuyển sang nội dung tự quay có khách thật. Quảng cáo chỉ chạy 02–05/10. |
| **Vấn đề** | Lượt xem lớn nhưng chỉ khoảng 180 phiên từ social sang website. 46 người xem /booking, 9 người vào bước điền thông tin, 0 form gửi. 17 lead đều đang chờ khách trả lời ngày đi; chưa có cơ chế nhận cọc. |
| **Câu hỏi** | Làm sao biến lượng người quan tâm hiện có thành khoản cọc đầu tiên trong tháng 11? |
| **Trả lời** | (1) Có cách nhận cọc ngay trong tuần đầu tháng 11. (2) Bám 8 báo giá bằng một câu hỏi ngày đi kèm link cọc. (3) Biến quy trình comment từ khóa thành DM thành việc làm cố định cho mọi reel, vì đây là nguồn ra 100% lead tháng 10. (4) Thay form booking bằng nút nhắn tin có đo lượt bấm. (5) Lọc máy quét và traffic nội bộ khỏi GA4. |

---

## 3. Cây vấn đề

```
Vì sao tháng 10 chưa có doanh thu?
├── A. Số liệu có đáng tin không?            → MỘT PHẦN: máy quét 13–14/10 và traffic nội bộ làm phồng website
├── B. Có đủ người biết đến không?           → CÓ: 383.552 lượt xem IG; FB 1.612 → 2.820 follower kể từ 07/10
├── C. Người xem có chuyển sang quan tâm?    → YẾU: khoảng 180 phiên từ social sang web, khoảng 0,05% lượt xem IG
├── D. Người quan tâm có thành lead không?    → MỚI BẮT ĐẦU: 17 lead, tất cả từ 26/10 trở đi, qua comment và DM
└── E. Lead có thành cọc không?              → KHÔNG: 0 cọc, 0 form; chưa có cách nhận tiền   ← NÚT THẮT CHÍNH
```

---

## 4. Phát hiện và ý nghĩa

### A. Số liệu website cần đọc lại

| Giai đoạn | Người dùng | Phiên | Bounce rate | Ghi chú |
|---|---:|---:|---:|---|
| 01–12/10 | 117 | 251 | 37,8% | Khoảng 9,8 người/ngày |
| 13–14/10 | 220 | 245 | 87,8% | 55 giây/phiên, 209 người từ Direct: máy quét |
| 15–31/10 | 83 | 257 | 39,3% | Khoảng 4,9 người/ngày |
| Tháng 9 | 113 | 287 | 45,6% | Mốc so sánh |

Ngoài ra có khoảng 72 phiên từ Tag Assistant và localhost (đội kiểm thử) và 33 lượt xem trang quản trị hóa đơn.

**Ý nghĩa:** Website thật tăng vừa phải so với tháng 9 (khoảng +53% phiên nếu bỏ máy quét và nội bộ), không phải gấp 3,5 lần. Đáng lo hơn là nửa sau tháng 10, người dùng mỗi ngày giảm khoảng một nửa so với nửa đầu, đúng lúc Facebook tăng follower mạnh nhất. Social đang lớn lên mà không kéo thêm người sang website.

### B. Nhận biết thương hiệu: tốt, nhưng chất lượng tương tác giảm

| Chỉ số Instagram | Tháng 9 | Tháng 10 | Thay đổi |
|---|---:|---:|---:|
| Lượt xem | 409.845 | 383.552 | −6,4% |
| Tương tác | 19.572 | 16.446 | −16,0% |
| Lượt lưu | 5.921 | 2.946 | −50,2% |
| Lượt chia sẻ | 4.263 | 2.253 | −47,1% |

- Một reel (quán cà phê lúc 2 giờ chiều, 09/10) có 5.936 like, nhiều hơn tổng like của 99 bài còn lại cộng lại. Ngày hôm đó reach đạt 50.821 tài khoản.
- Like trung vị mỗi bài đứng yên ở 9–11 qua các tuần, kể cả tuần 15–21/10 đăng 30 bài.
- Facebook tăng từ 1.612 lên 2.820 follower kể từ 07/10 (+75%). Đây là tệp khán giả tăng nhanh nhất.

**Ý nghĩa:** Lượt xem giữ được, nhưng lượt lưu và chia sẻ (tín hiệu "nội dung này có ích cho chuyến đi của tôi") giảm một nửa. Đăng nhiều hơn không làm mỗi bài tốt hơn, nên quyết định giảm số bài ngày 21/10 là đúng hướng. Thành tích tháng 10 phụ thuộc vào một bài viral, chưa phải một công thức lặp lại được.

### C. Từ người xem sang người quan tâm: chỗ hở lớn nhất ở đầu phễu

- Khoảng 180 phiên website đến từ social (IG 91, FB 77, Threads 12) trên 383.552 lượt xem IG.
- 10 bài nhiều like nhất đều là nội dung ăn uống, quán đẹp hoặc tiếng Việt cho du khách. Không bài nào là bài bán dịch vụ chụp ảnh.

**Ý nghĩa:** Khán giả đến vì mẹo du lịch Hà Nội, không phải vì photo tour. Lời mời "Comment PHOTO" và "link in bio" chưa đủ để kéo họ ra khỏi nền tảng. Cầu nối phải nằm ngay trong DM, nơi khách đã ở sẵn.

### D. Lead: quy trình comment từ khóa → DM là thứ duy nhất đang hoạt động

| | Số lượng |
|---|---:|
| Lead tháng 10 | 17 |
| Từ Facebook (comment hoặc Messenger) | 16 |
| Từ Instagram | 1 |
| Đã gửi báo giá | 8 (47%) |
| Đã gửi guide, đang nuôi | 9 |
| Ngày xuất hiện lead đầu tiên | 26/10 |

14 hội thoại từ quảng cáo 02–05/10 không có trong tracker và chưa được đối soát.

**Ý nghĩa:** Toàn bộ lead đến trong 6 ngày cuối tháng, sau khi đội bắt đầu trả lời comment từ khóa ("FOOD", "PHOTO", "HANOI") bằng tin nhắn riêng. Tốc độ khoảng 2,8 lead mỗi ngày. Nếu giữ nhịp này cả tháng 11, sẽ có khoảng 85 lead. Facebook đang ra lead tốt hơn Instagram dù Instagram có nhiều lượt xem hơn. Nhu cầu nổi bật là ẩm thực (10/17 lead), không phải chụp ảnh thuần.

### E. Từ lead sang cọc: chưa có đường đi

- 0 form booking gửi đi, 0 cọc, 0 doanh thu.
- Chưa có cách nhận cọc (P0 pháp lý và thanh toán vẫn mở).
- Tất cả báo giá đang chờ khách trả lời ngày đi, không có hạn hay bước tiếp theo rõ ràng.
- Khách du lịch thường chốt dịch vụ trong thời gian ngắn trước hoặc trong chuyến đi. Một báo giá chưa có link thanh toán dễ bị bỏ quên.

**Ý nghĩa:** Đây là nút thắt quyết định doanh thu tháng 11. Tăng traffic hay chạy quảng cáo lúc này chỉ đổ thêm người vào một cái phễu không có đáy.

---

## 5. Quy tắc 80/20

Hai việc tạo ra phần lớn kết quả tháng 11:

1. **Nhận được tiền cọc.** Mọi bước phía trước đã có người; chỉ thiếu bước cuối.
2. **Biến comment từ khóa → DM thành quy trình hằng ngày.** Đây là nguồn ra 100% lead tháng 10 và chạy trên khán giả sẵn có, không tốn tiền quảng cáo.

---

## 6. Việc cần làm, xếp theo ưu tiên

| # | Việc | Tác động | Công sức | Người phụ trách | Hạn |
|---|---|---|---|---|---|
| 1 | Chốt một cách nhận cọc (ví dụ link thanh toán quốc tế hoặc PayPal), mức cọc và điều khoản hoàn | Rất cao | Trung bình | Rocky + Operations | 07/11 |
| 2 | Nhắn lại 8 khách đã nhận báo giá: một câu hỏi ngày đi cụ thể, kèm link cọc khi đã có | Cao | Thấp | Sales-CRM | Ngay khi có mục 1 |
| 3 | Mỗi reel có một từ khóa comment; trả lời bằng DM trong ngày; ghi vào tracker | Cao | Thấp | Marketing + Sales-CRM | Hằng ngày từ 01/11 |
| 4 | Thay form /booking bằng nút nhắn WhatsApp/Messenger có đo lượt bấm | Cao | Trung bình | Sơn (web) | 14/11 |
| 5 | Lọc máy quét, Tag Assistant, localhost và trang quản trị khỏi GA4 | Trung bình | Thấp | Technology-Automation | 07/11 |
| 6 | Giữ mix nội dung ăn uống, quán, tiếng Việt; gắn photo tour vào như phần "được chụp ảnh tại đây" thay vì bài bán riêng | Trung bình | Thấp | Marketing | Tháng 11 |
| 7 | Chưa chạy lại quảng cáo cho tới khi có cách nhận cọc; sau đó bật WARM-PHOTO-DM nhắm người đã tương tác Facebook | Trung bình | Thấp | Marketing | Sau mục 1 |

---

## 7. Mục tiêu tháng 11

| Chỉ số | Tháng 10 | Mục tiêu tháng 11 |
|---|---:|---:|
| Cọc đã nhận | 0 | ≥ 2 |
| Lead mới | 17 | ≥ 50 |
| Tỷ lệ lead nhận báo giá | 47% | ≥ 40% |
| Tỷ lệ báo giá thành cọc | 0% | ≥ 10% |
| Lead có ngày đi xác nhận | 0 | ≥ 10 |
| Lượt bấm nút nhắn tin trên website | Chưa đo | Có số đo từ 15/11 |
| Lượt lưu IG mỗi bài (trung bình) | khoảng 29 | ≥ 40 |

---

## 8. Rủi ro và giới hạn của số liệu

- Số người dùng GA4 không cộng được giữa các giai đoạn; con số "tối đa khoảng 195" là giới hạn trên.
- Lượt lưu IG mỗi bài là tổng lượt lưu cấp tài khoản chia cho số bài, không phải số từng bài.
- Facebook chưa có quyền đọc reaction và comment từng bài; đánh giá FB chỉ dựa vào follower, số bài, lượt chia sẻ và lead.
- Mẫu lead nhỏ (17) và mới có trong 6 ngày; tốc độ 2,8 lead mỗi ngày có thể không giữ được.
- Kết nối Meta Ads chưa khóa vào tài khoản quảng cáo; số quảng cáo lấy từ báo cáo ngày 07/10.
