# Technology Automation Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Công nghệ & Tự động hóa (Technology Automation).

## 1. Trách Nhiệm Phòng Ban
Technology Automation chịu trách nhiệm phát triển và vận hành hệ thống MCP servers, tích hợp API, công cụ tự động hóa nội bộ, kiểm thử website và duy trì hạ tầng kỹ thuật theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `integration-design` | Thiết kế kiến trúc tích hợp kỹ thuật và MCP | Khi tạo connector | Rocky duyệt quyền ghi / live |
| `web-experience-qa` | Kiểm thử giao diện và luồng đặt tour website | Hàng tuần / Sau deploy | Không submit form live |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Thiết kế MCP connector mới để đọc dữ liệu báo cáo Google Analytics"* -> Kích hoạt `integration-design`
- *"Kiểm thử trải nghiệm đặt tour trên phiên bản website mobile mới"* -> Kích hoạt `web-experience-qa`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Technology-Automation/README.md](../../../../Technology-Automation/README.md)
- [Technology-Automation/Runbooks/](../../../../Technology-Automation/Runbooks/)
- Các test suites trong `Technology-Automation/Tests/`

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Thiết kế tích hợp: `Technology-Automation/Runbooks/`
- Biên bản QA website: `Technology-Automation/Runbooks/` hoặc review folder của owner

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Cấp quyền ghi dữ liệu (Write scope) cho các tích hợp hệ thống sản xuất.
- [ ] Triển khai các automation chạy nền (daemon/background jobs) liên tục.
- [ ] Gọi các API bên ngoài có phát sinh chi phí thanh toán.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
Nhu cầu kết nối dữ liệu
  -> integration-design (Thiết kế data contract & security)
  -> Rocky Phê Duyệt
  -> Lập trình connector
  -> Unit tests giả lập (Mock)
  -> Triển khai có kiểm soát
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Nhận yêu cầu kết nối dữ liệu từ Meta Graph API.
2. Dùng `integration-design` thiết kế connector ở chế độ Read-only, xác thực bằng token môi trường.
3. Viết runbook và test suite kiểm tra hợp đồng dữ liệu.
4. Trình Rocky phê duyệt trước khi tích hợp vào hệ thống.
5. Chạy `npm test` và `npm run workspace:check` đạt PASS.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Lộ token trong log:** In secret, API key hoặc access token ra console hay commit vào Git.
- **Submit form trên môi trường Live:** Tạo dữ liệu rác hoặc booking ảo trên trang sản xuất.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Tài liệu thiết kế có đủ sơ đồ bảo mật và xử lý lỗi.
- [ ] Kế hoạch rollback sẵn sàng khôi phục trong 2 phút.
- [ ] Tất cả unit tests kiểm thử đều vượt qua.
