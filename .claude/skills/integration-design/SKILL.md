---
name: integration-design
description: Use when designing Model Context Protocol (MCP) servers, API connectors, webhooks, or automation integrations with explicit data contracts and security boundaries.
---

# Integration Design

## Purpose
Thiết kế kiến trúc tích hợp kỹ thuật (MCP servers, API connectors, webhooks, dịch vụ tự động hóa nội bộ) với hợp đồng dữ liệu (Data Contract), ranh giới bảo mật (Auth Boundary), cơ chế phòng vệ (Failure Modes) và kế hoạch hoàn tác (Rollback Plan) chặt chẽ.

## Read First
- `Technology-Automation/README.md`
- Các MCP connectors hiện có trong `Technology-Automation/MCP/`
- Runbooks liên quan trong `Technology-Automation/Runbooks/`

## Inputs
- Tên tích hợp / Connector và hệ thống đối tác (Google Analytics, Meta Graph API, ManyChat, OpenSEO)
- Mục đích tích hợp và danh sách công cụ (tools/resources) cung cấp
- Cơ chế xác thực (API Key, OAuth2, Service Account)
- Phân loại quyền: Read-only hay Read-write

## Workflow
1. Xác định phạm vi tích hợp, ưu tiên tuyệt đối chế độ **Read-only** cho giai đoạn đầu.
2. Thiết kế lược đồ Schema chi tiết cho từng Tool/Endpoint theo chuẩn Model Context Protocol.
3. Phân định ranh giới bảo mật: Cách thức lưu trữ token qua biến môi trường hoặc Keychain; tuyệt đối không hardcode secret.
4. Xây dựng tài liệu thiết kế tích hợp theo mẫu `templates/integration-design.md`.
5. Thiết lập kịch bản kiểm thử (unit tests với mock, không gọi API live khi test).
6. Định nghĩa quy trình xử lý lỗi: Timeout, Rate limit, Exponential backoff, Idempotency.

## Output
- Tài liệu thiết kế: `Technology-Automation/Runbooks/DES-YYYYMMDD-SHORT-SLUG.md` hoặc `Operations/Change-Management/`

## Approval Gates
- **BẮT BUỘC Rocky duyệt** trước khi cấp quyền ghi (Write permission), bật automation kết nối hệ thống trực tiếp hoặc tích hợp API có tính phí.

## Guardrails
- Tuyệt đối KHÔNG in (log) token, access key, secret hoặc mật khẩu vào terminal, log file hoặc Git.
- Mọi connector mới mặc định chỉ có quyền đọc (read-only) trừ khi có văn bản phê duyệt ngoại lệ.
- Phải có cơ chế graceful fallback khi API bên thứ ba gặp sự cố.

## Completion Criteria
- Tài liệu thiết kế tích hợp hoàn chỉnh theo template chuẩn.
- Bảng phân loại công cụ ghi rõ quyền (Read/Write) và chi phí (Free/Paid).
- Kế hoạch rollback và bộ kiểm thử giả lập (mock tests) sẵn sàng.
