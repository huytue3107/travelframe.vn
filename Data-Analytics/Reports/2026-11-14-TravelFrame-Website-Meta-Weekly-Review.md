# TravelFrame: Hiệu Suất Website & Meta

**Trạng thái:** Review nội bộ. **Chụp:** 14/11/2026, 10:03–10:08 ICT.  
**Kỳ:** 07–13/11/2026 so với 31/10–06/11/2026, trọn ngày ICT; không tính ngày 14/11. Đây là bản tuần, không phải snapshot 08:30.

[Dashboard tương tác](../Dashboards/2026-11-14-TravelFrame-Website-Meta-Dashboard.html) · [Dữ liệu đã chuẩn hóa](../Snapshots/2026-11-14-Website-Meta-Dashboard/metrics.json)

## 1. Tóm Tắt

- Instagram reach **17.048 → 124.380 (+629,6%)**; 10–11/11 chiếm **68,1%** lượt xem kỳ này. Chưa tách organic/paid.
- Website **77 → 127 phiên (+64,9%)**, nhưng Google tự nhiên **21 → 5** theo báo cáo nguồn. Direct **40 → 66**, Facebook **8 → 30**, Instagram **7 → 19**. Bảng nguồn kỳ này tổng **133**, khác 127 của tổng quan; không dùng làm phép phân rã tuyệt đối.
- Lượt xem **/booking/details 24 → 11 (−54,2%)**; sự kiện bắt đầu đặt tour **18 → 4**. Đây là tín hiệu cần kiểm tra, không chứng minh tỷ lệ bỏ bước hoặc nguyên nhân kỹ thuật.
- CRM có **10 báo giá có ngày**, so với 4 kỳ trước; **0 dòng có bằng chứng cọc** trong tracker. Booking và doanh thu chưa đối soát.

## 2. Tám Tầng Theo Dõi

| Điểm đo | 31/10–06/11 | 07–13/11 | Định nghĩa |
|---|---:|---:|---|
| 1. Reach Instagram | 17.048 | 124.380 | Tổng kỳ tài khoản duy nhất, không cộng reach ngày |
| 2. Xem hồ sơ Instagram | 91 | 557 | Lượt xem |
| 3. Bấm liên kết website Instagram | 3 | 12 | Lượt bấm, không phải phiên GA4 |
| 4. DM / Messenger hỏi tour | Chưa đo | Chưa đo | Không có tổng inbox theo kỳ |
| 5. Phiên website | 77 | 127 | GA4 tổng quan, lọc một phần nội bộ/test |
| 6. Xem trang đặt tour | 1 / 24 | 0 / 11 | /booking và /en/booking gộp / /booking/details riêng |
| 7. Hồ sơ mới có ngày đi và số khách | 0 | 6 | Tracker, loại nhóm chỉ gửi guide; chưa xác nhận đủ điều kiện |
| 8. Báo giá / cọc / booking / doanh thu | 4 / 0 / Chưa đo / Chưa đo | 10 / 0 / Chưa đo / Chưa đo | Báo giá có ngày, cọc có bằng chứng trong tracker |

Đây là các điểm đo độc lập, không nối thành cohort chuyển đổi. Kỳ này có 46 dòng mới trong tracker, gồm 23 dòng chỉ gửi guide; không gọi 46 dòng là 46 khách hỏi tour.

## 3. Hiệu Suất Kênh

| Chỉ số | 31/10–06/11 | 07–13/11 |
|---|---:|---:|
| Instagram views | 28.577 | 184.432 |
| Instagram tương tác | 1.349 | 10.925 |
| Instagram lưu / chia sẻ | 330 / 250 | 1.373 / 2.756 |
| GA4 người dùng hoạt động | 26 | 68 |
| GA4 lượt xem trang | 303 | 386 |
| GA4 phiên có tương tác | 48 | 74 |
| GA4 bắt đầu thanh toán, số lần / người dùng | 6 / 5 | 5 / 3 |

Snapshot follower tại lúc trích: Instagram **747**, Facebook **3.436**. Facebook không có reach/views toàn Page trong connector; Meta Ads chưa khóa được tài khoản. Không suy ra chi tiêu bằng 0 hoặc quy kết tăng trưởng do quảng cáo.

## 4. Nội Dung Và Seed Comment

- Bằng chứng bài đăng trong 100 mục gần nhất mỗi kênh: **12 Instagram, 13 Facebook** kỳ này; **13 Instagram, 15 Facebook** kỳ trước.
- Reel [Hàng Mã trên Instagram](https://www.instagram.com/reel/Dfjq4KWtyAH/) có **2.462 lượt thích / 79 bình luận** tích lũy tại lúc chụp; [bản Facebook](https://www.facebook.com/reel/991036764063782/) có **29 lượt chia sẻ**. Không quy toàn bộ đỉnh phân phối cấp kênh cho một bài.
- Có 22/25 URL khớp sổ seed; 7 URL ghi mốc C1, 6 URL ghi mốc C2. Đây là dữ liệu sổ, không xác nhận trạng thái comment live. Không đủ bộ đo bài ở đúng 24h/72h; bảng dashboard chỉ dùng số tích lũy của bài đã qua 48h và không xếp chéo kênh.

## 5. Cảnh Báo Dữ Liệu

- Cùng phạm vi ngày yêu cầu ICT cho GA4 và Instagram; hai nền tảng có phương pháp đo khác nhau. Reach/tương tác Instagram có thể gồm phân phối trả phí. Dữ liệu có thể thay đổi do xử lý muộn.
- GA4 property 552867189, host travelframe.sidevn.com; loại các đường dẫn admin/login/user/node và nguồn test/localhost nhận diện được. Chưa lọc hết nội bộ. Ngày 08/11 không có dòng cả khi truy vấn theo host; giữ khoảng trống, không kết luận website lỗi.
- Kỳ này GA4 ghi 1 form_submit và 1 generate_lead, đều ở /contact; chưa xác minh đây là hai người khác nhau hoặc lead tour. Không thấy dòng purchase trong tập đã lọc; GA4 revenue bằng 0 không phải doanh thu kinh doanh bằng 0.
- Đường dẫn /checkout và /booking/payment được tách riêng. Không dùng số lượt xem URL để tính tỷ lệ rớt khỏi luồng đặt.

## 6. Việc Cần Làm

1. **Tầng 7–8: Đối soát 10 báo giá.** Đo phản hồi, cọc và booking có bằng chứng. Đối soát nội bộ: tự vận hành; liên hệ khách: cần Rocky duyệt. [Sổ lead](../Lead-Pipeline-Tracker.csv).
2. **Tầng 6–8: Kiểm tra luồng đặt tour trên điện thoại.** Đo yêu cầu nhận thành công, phân biệt /checkout với /booking/payment và khớp sự kiện với đơn. Thử gửi dữ liệu live hoặc sửa website: cần Rocky duyệt. [Chẩn đoán booking](../../Sales-CRM/Funnel/2026-10-21-Booking-Funnel-Diagnosis.md).
3. **Tầng 3–5: Kiểm tra nguồn Google và link dẫn từ nội dung.** Đo phiên theo nguồn/UTM và trang đích. Đọc và đối soát: tự vận hành; sửa cấu hình live: cần Rocky duyệt. [Khung đo](../Measurement-Framework.md).
