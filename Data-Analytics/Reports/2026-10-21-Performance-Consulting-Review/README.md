# TravelFrame — Website & Social Performance Review

- Owner: Data-Analytics
- Status: Review
- Created: 2026-10-21
- Scope: báo cáo nội bộ theo cấu trúc tư vấn; kết luận trước, bằng chứng, phân rã và hành động.
- Deliverables: `TravelFrame-Website-Social-Review-2026-10-21.pdf` (10 trang), bản HTML cùng tên để xem trên trình duyệt.
- Evidence: `../../Snapshots/2026-10-21-Performance-Review/` — `ga4.json`, `ga4-detail.json`, `meta.json`, `calculations.json`.
- Website: 07–13/10/2026 so với 14–20/10/2026, Asia/Saigon.
- Instagram: 2026-10-06T07:00:00Z đến 2026-10-13T07:00:00Z so với 2026-10-13T07:00:00Z đến 2026-10-20T07:00:00Z. Giữ biên ngày Meta, không giả định trùng ngày lịch website.
- Captured: GA4 09:49 ICT; detail 09:50 ICT; Meta 09:49 ICT ngày 2026-10-21. Timestamp từng bộ trong JSON.

## Giới hạn quan trọng

- Không có chi phí ads được xác minh: connector báo chưa cấu hình khóa tài khoản. Không thay đổi cấu hình.
- Chưa có CRM/payment reconciliation cho inquiry, booking hoặc revenue. Không tính CAC, MER hoặc ROAS.
- Pageviews, custom event count, saves, link taps không được diễn giải thành khách mua hay doanh thu.
- Số website theo source có sai khác 2 sessions với overview; tổng ngày sai khác 1 session ở mỗi tuần. Báo cáo giữ nguyên số nguồn và nêu khoản đối soát.
- Source/medium users không cộng thành unique users; pagePath users được truy vấn trực tiếp để tránh cộng trùng theo title.
- Raw GA4 top-pages qua MCP giới hạn 100 dòng; mọi phân rã pageviews trong bản cuối dùng truy vấn pagePath đầy đủ trong `ga4-detail.json`.
- Reach Instagram có thể bao gồm ads; chưa tách organic/paid. Không có Facebook account reach/views trong connector đọc hiện tại.

## Kiểm tra workspace

- `npm test`: 158 tests passed.
- `npm run test:skills`: 15 tests passed.
- `npm run workspace:check`: chưa đạt do lỗi đã có ngoài phạm vi báo cáo: broken markdown links trong brief chiến dịch và skill references; legacy absolute paths trong `.claude/settings.local.json` và `scratch/`.
- Không sửa hoặc khôi phục những thay đổi sẵn có của người khác.
- Kiểm tra bố cục: kiểm tra tràn nội dung từng trang, xuất PDF, kiểm tra 10 trang A4 ngang và render PDF để rà thị giác.

Không publish, gửi tin, đổi ngân sách, đổi tracking hoặc automation live trong nhiệm vụ này.
