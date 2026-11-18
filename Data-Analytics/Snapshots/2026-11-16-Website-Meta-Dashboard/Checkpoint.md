# Checkpoint · Dashboard trực tiếp TravelFrame 16/11/2026

- Review. [Mở dashboard trực tiếp](http://127.0.0.1:4178/) · [Giao diện HTML](../../Dashboards/TravelFrame-Website-Meta-Live-Dashboard.html) · [Bản chụp nguồn](realtime.json).
- Đường dẫn local phục vụ riêng giao diện đọc API. Bản HTML có ngày 16/11 là bản chụp lúc 08:40 ICT. Phần đối chiếu tuần trong giao diện trực tiếp dùng [số liệu 08–14/11 so với 01–07/11](../2026-11-15-Website-Meta-Dashboard/metrics.json).
- GA4 Realtime theo luồng web. Khi tab Trực tiếp đang hiển thị, dashboard đọc lại GA4 Realtime mỗi phút, GA4 tổng hợp ngày và Meta Graph API mỗi 5 phút. Instagram Insights lấy kỳ Meta gần nhất có dữ liệu và ghi giờ bắt đầu, kết thúc theo ICT.
- GA4 ngày 16/11 chưa trả dòng dữ liệu ở cả truy vấn toàn property lẫn truy vấn theo tên miền lúc kiểm tra. Các sự kiện trong ngày hiển thị thiếu dữ liệu. Khi nguồn tạm lỗi, giao diện hiển thị bản đọc gần nhất kèm giờ đọc và trạng thái nguồn.
- Trình duyệt đã nhận số từ cả hai API và tự đọc lại GA4 từ 08:54:57 đến 08:55:57 ICT. Đã kiểm tra nút làm mới, bản chụp offline, trạng thái lỗi nguồn, desktop 1.440 px và mobile 390 px. 158 kiểm thử MCP và 15 kiểm thử skill đạt. Kiểm tra workspace còn báo một liên kết ảnh cũ trong QA Vietnam Ebook Sketchnote.
- Khi nối phiên, mở lại đường dẫn trực tiếp và kiểm tra thời điểm đọc trên từng thẻ. Nếu dịch vụ local đã dừng, chạy `npm run dashboard:live` trong workspace.
