# Checkpoint · Dashboard TravelFrame 15/11/2026

- Trạng thái dữ liệu: Review. [Bản HTML](../../Dashboards/2026-11-15-TravelFrame-Website-Meta-Dashboard.html) · [Số liệu tuần](metrics.json) · [Mở trực tiếp](http://127.0.0.1:4178/).
- GA4 Data API lúc 10:14 ICT. Website, bài đăng và CRM so sánh 08–14/11 với 01–07/11 theo ngày ICT. GA4 trả 95 và 64 phiên. Ngày 08/11, 12/11 không có dòng kể cả khi kiểm tra chưa lọc. [Bản 14/11](../2026-11-14-Website-Meta-Dashboard/metrics.json) có 52 phiên ngày 12/11. Bảng nguồn trả 99 phiên trong kỳ mới.
- Meta Graph API chỉ đọc lúc 10:14 ICT. So sánh hai kỳ 7 ngày kết thúc lúc 15:00 ICT ngày 14/11 và 07/11. Instagram đạt 126.290 reach và 188.246 views trong kỳ mới. Tổng views từng ngày khớp số kỳ. Meta Ads chưa có tài khoản truy cập được qua MCP.
- CRM đếm 59 hồ sơ mới, trong đó 27 hồ sơ ở trạng thái gửi guide. Có 5 báo giá có ngày và 0 hồ sơ có bằng chứng cọc trong kỳ. Booking và doanh thu chờ đối soát. Snapshot chỉ lưu số đếm CRM.
- Đã mở lại dashboard local. Lúc 10:21 ICT cả GA4 và Meta trả dữ liệu. Chrome kiểm chứng 5 tab trên 320/390/768/1440 px, đổi kỳ, hai khoảng trống GA4, dữ liệu offline và số nhúng khớp snapshot.
- Khi nối phiên, mở link local và xem giờ cập nhật từng nguồn. Nếu dịch vụ dừng, chạy `npm run dashboard:live`. Bước kiểm tra tiếp theo là đối chiếu dữ liệu GA4 ngày 12/11 trước khi dùng chênh lệch tuần để ra quyết định.
