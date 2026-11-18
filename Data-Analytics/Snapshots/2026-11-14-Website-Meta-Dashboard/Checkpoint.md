# Checkpoint: Website & Meta Dashboard

- Ngày: 2026-11-14, ICT. Trạng thái dữ liệu: Review.
- Đã thu thập qua API chỉ đọc: GA4 Data API, Instagram Insights, Page/profile và danh sách nội dung Meta; tổng hợp CRM/seed ở cấp số đếm, không lưu PII.
- Kỳ: 2026-11-07 đến 2026-11-13; đối chiếu 2026-10-31 đến 2026-11-06. [Dữ liệu tổng hợp](metrics.json).
- [Báo cáo](../../Reports/2026-11-14-TravelFrame-Website-Meta-Weekly-Review.md) và [dashboard](../../Dashboards/2026-11-14-TravelFrame-Website-Meta-Dashboard.html) là bản theo ngày, không ghi đè dashboard vận hành hiện có.
- Giới hạn: GA4 133 dòng phiên gộp theo nguồn so với 127 phiên tổng quan; 08/11 không có dòng; Meta Ads không có tài khoản khóa; chưa đối soát doanh thu.
- Kiểm chứng: dữ liệu nhúng khớp metrics.json; 4 tab, đổi kỳ, biểu đồ và bàn phím hoạt động ở 320/390/768/1440 px. Test MCP 158/158 và skill 15/15 đạt. Workspace check còn một link ảnh ebook cũ bị thiếu, ngoài phạm vi dashboard.
- Bước tiếp theo: đối soát 10 báo giá theo ngày trong tracker với bằng chứng nhận cọc/booking trước khi quy kết doanh thu cho kênh. Không thay đổi hệ thống live trong đợt này.

## Cập nhật trực tiếp · 14/11/2026

- Mở [dashboard trực tiếp](http://127.0.0.1:4178/) trên máy này. Khi dịch vụ dừng, chạy `npm run dashboard:live` từ workspace. Tab Trực tiếp đọc GA4 Realtime mỗi phút và GA4 theo ngày cùng Meta khoảng 5 phút khi tab đang hiển thị.
- GA4 Realtime dùng stream `15726825662`. GA4 theo ngày áp dụng bộ lọc tên miền và traffic kỹ thuật đã biết. Instagram Insights hiển thị mốc bắt đầu/kết thúc do API trả về. Facebook có follower và thông tin bài mới.
- Mốc kiểm chứng 14:26–14:29 ICT: GA4 0 người dùng trong 30 phút, 8 phiên và 28 lượt xem theo ngày. IG 749 follower, FB 3.445 follower. IG bucket gần nhất có 11.423 reach, 14.698 views, kết thúc 15:00 ICT 13/11.
- Kiểm chứng trình duyệt Chrome 320/390/768/1440 px, cập nhật tự động GA4, nút kiểm tra, nhãn dữ liệu cũ khi gián đoạn, phục hồi, và điều hướng các tab báo cáo tuần. Đọc API chỉ cho phép localhost và các đường dẫn cố định.
- Bước tiếp theo khi nối phiên: mở link, kiểm tra thời điểm cập nhật từng nguồn và chạy lại dịch vụ local nếu đã dừng.
