# Checkpoint — Báo cáo website và Meta API, 2026-11-08

**Owner: Data-Analytics · Review · ICT.**

- Báo cáo riêng: [Markdown](../../Reports/2026-11-08-TravelFrame-Website-Meta-API-Review.md), [HTML](../../Reports/2026-11-08-TravelFrame-Website-Meta-API-Review.html), [biểu đồ](../../Reports/2026-11-08-TravelFrame-Website-Meta-API-Review-Charts.png). Không ghi đè báo cáo sáng.
- Bằng chứng đã kiểm tra: `meta-initial.json` và `meta-weekly.json` ghi lần đọc trực tiếp Meta Graph API qua MCP, tham số và thời gian, bỏ paging/CDN URL/token; `ga4.json` và `ga4-detail.json` có 41 báo cáo GA4, khung tuần, ngày và truy hồi mốc 08:30; `crm-summary.json` chỉ có tổng hợp và hash hai tracker, không chép nội dung khách.
- IG reach tuần 24.857 → 19.196. Reach ngày 4.469 khớp chuỗi kết thúc 07/11 15:00 ICT; không coi là 08:30 rolling. GA4 tuần tổng phiên 110 → 93; tách nhóm kỹ thuật 50 → 26, phần còn lại 60 → 67. Form submit duy nhất ở `/node/57/edit`. Sáu dòng Threads có ngày và khoảng số người; không có cọc/booking xác minh trong tracker.
- Khoảng trống: Facebook Page reach/views và số đúng tuổi bài chưa đo được từ connector; Messenger báo thiếu quyền, ad account chưa khóa. Không suy ra 0 cho dữ liệu thiếu.
- Runbook Meta: System User Never hợp lệ; kiểm tra tạo/xóa bài test Facebook ẩn, Instagram container không publish. Không đăng công khai, gửi tin, thay đổi cấu hình hoặc dùng API trả phí.
- Kiểm chứng: đối chiếu các số chính với phản hồi API, 6 phần và 8 tầng. `layout-check.json` ghi kiểm tra desktop/mobile và 4 đồ thị. `npm test`: 158 đạt; `npm run test:skills`: 15 đạt; `npm run workspace:check`: đạt. Giữ nguyên dữ liệu nguồn.
- Bước kế tiếp chỉ đọc khi cần: kiểm tra số liệu đúng tuổi bài, bằng chứng C1/C2 của Reel ngày 07/11, rồi cập nhật bản đối chiếu nếu nguồn cung cấp; không suy diễn từ số tích lũy ở tuổi khác.

`capture-ga4.cjs` và chế độ `--detail` dùng kết nối GA4 SDK có sẵn. Khi truy vấn mới, dùng thư mục theo ngày mới để bảo toàn snapshot. `build-report.cjs` dựng HTML và ảnh biểu đồ từ dữ liệu đã lưu, không gọi dịch vụ bên ngoài.
