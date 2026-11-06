# Kế hoạch triển khai bản thử affiliate

Ngày 2026-10-30. Rocky đồng ý thử triển khai từ bản thiết kế Data-Analytics/Definitions/2026-10-30-Affiliate-Tracking-System-Draft.md.

Phạm vi: ứng dụng local HTML/CSS/JS tại Technology-Automation/Tools/affiliate-tracker; dữ liệu minh họa, localStorage, sao lưu JSON, không có API, thanh toán hoặc publish. Không thay đổi CRM live. Phiên bản đầu dùng USD, giá tour cơ bản không phụ thu và chính sách thử REF-DEMO-v1; chưa hỗ trợ chính sách B2B cũ hoặc hoàn một phần. Các booking hủy, hoàn, tranh chấp bị giữ thưởng. Lịch sử thao tác được lưu cùng dữ liệu trình duyệt. Không coi thao tác duyệt/trả trong bản thử là thanh toán thật.

- [ ] Tạo test nghiệp vụ: tiền Premium 3 giờ, cọc, hoàn/hủy, tranh chấp, chống trả hai lần, snapshot rate, dữ liệu không hợp lệ và tổng hợp theo đối tác.
- [ ] Chạy test thất bại rồi triển khai core.mjs, dùng đơn vị cent để tính tiền.
- [ ] Tạo giao diện responsive với thêm đối tác, thêm lead/booking, cập nhật tiến độ, ghi nhận tiền/chi phí, đối soát mô phỏng và backup/restore JSON.
- [ ] Kiểm thử trình duyệt luồng tạo đối tác → tạo lead → thu đủ → hoàn thành → duyệt → ghi đã trả; refresh giữ dữ liệu; không trả thưởng booking chưa đủ tiền.
- [ ] Chạy bộ test nghiệp vụ, npm test, npm run test:skills, npm run workspace:check; mở preview và bàn giao giới hạn.

Thiết kế file: core.mjs chứa validation/tính toán và transition; app.mjs chứa state, render, form và localStorage; index.html là khung giao diện; style.css là giao diện; core.test.mjs là test độc lập; README.md là hướng dẫn chạy và giới hạn. Không thêm dependency.
