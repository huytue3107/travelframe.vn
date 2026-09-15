# Integration Design: [Tên Hệ Thống / MCP Connector]

- **Mã thiết kế:** `DES-YYYYMMDD-SHORT-SLUG`
- **Chủ trì:** Technology-Automation
- **Trạng thái:** Draft | Review | Approved
- **Ngày lập:** YYYY-MM-DD
- **Phê duyệt:** Rocky

---

## 1. Tổng Quan & Mục Tiêu Kinh Doanh
[Mô tả nhu cầu tích hợp giữa TravelFrame và hệ thống đối tác.]

## 2. Ranh Giới Bảo Mật & Xác Thực (Security & Auth Boundary)
- **Cơ chế xác thực:** [OAuth 2.0 / API Token / Service Account]
- **Nơi lưu trữ secret:** Biến môi trường hệ thống (`.env` không commit vào Git)
- **Quyền hạn kết nối:** Mặc định `READ-ONLY`

## 3. Danh Sách Công Cụ Cung Cấp (Tool Schemas)
| Tool Name | Mô tả | Chế độ | API Gọi | Chi Phí |
|---|---|---|---|---|
| `get_data_summary` | Đọc số liệu tổng hợp | Read-only | REST GET | Miễn phí |
| `update_record` | Cập nhật bản ghi | Write (Gated) | REST POST | Miễn phí |

## 4. Xử Lý Lỗi & Khả Năng Chịu Lỗi (Failure Modes)
- **Timeout:** 10 giây cho mỗi request.
- **Rate Limit:** Tối đa 60 calls/phút; áp dụng Exponential Backoff khi gặp mã lỗi 429.
- **Idempotency:** Dùng UUID request để tránh ghi trùng lặp dữ liệu.

## 5. Kế Hoạch Kiểm Thử & Rollback
- **Kiểm thử:** Sử dụng Mock server trong `Technology-Automation/Tests/`.
- **Rollback:** Quy trình ngắt kết nối an toàn trong 2 phút khi xảy ra sự cố.
