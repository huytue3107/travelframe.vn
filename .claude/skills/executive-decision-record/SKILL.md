---
name: executive-decision-record
description: Use when converting an approved proposal or sufficiently discussed initiative into a formal TravelFrame Decision Record (DEC-YYYYMMDD-SHORT-SLUG).
---

# Executive Decision Record

## Purpose
Biến một đề xuất đã đủ context và thảo luận thành một bản ghi quyết định chính thức (Decision Record) có cấu trúc, xác định rõ chủ sở hữu, bối cảnh, các phương án thay thế, lý do lựa chọn, tác động và ngày đánh giá lại.

## Read First
- `Executive/Current-State.md`
- `Brand-Strategy/Source-Of-Truth-Map.md`
- Các Decision Records liên quan trong `Executive/`

## Inputs
- Tiêu đề đề xuất hoặc quyết định cần ban hành
- Chủ sở hữu chịu trách nhiệm (Owner)
- Bối cảnh và vấn đề cần giải quyết
- Các phương án thay thế đã xem xét (Alternatives considered)
- Lý do lựa chọn giải pháp hiện tại (Rationale)
- Tác động tới các phòng ban (Impact) và ngày review

## Workflow
1. Đọc `Executive/Current-State.md` để nắm các mục P0/P1 và tình trạng hiện tại.
2. Kiểm tra xem quyết định có mâu thuẫn với Company OS hoặc canonical source trong Side Agency vault hay không.
3. Thu thập các dữ kiện đầu vào, so sánh ít nhất 2 phương án thay thế.
4. Lập tài liệu dự thảo theo mẫu `templates/decision-record.md`.
5. Đặt trạng thái ban đầu là `Draft` hoặc `Review`.
6. Dừng lại tại Approval Gate để Rocky phê duyệt trước khi chuyển trạng thái thành `Approved`.

## Output
- Đường dẫn: `Executive/DEC-YYYYMMDD-SHORT-SLUG.md`
- Trạng thái mặc định: `Draft` hoặc `Review`

## Approval Gates
- **BẮT BUỘC có sự phê duyệt trực tiếp của Rocky** trước khi chuyển trạng thái của Decision Record thành `Approved`.
- Cấm tự ý thay đổi trạng thái P0/P1 trong `Executive/Current-State.md` khi chưa có approval.

## Guardrails
- Không tự ý gắn trạng thái `Approved` khi chưa có bằng chứng xác nhận từ Rocky.
- Không tự ý sửa đổi quy tắc cốt lõi của Company OS.
- Không suy đoán quyết định khi thiếu bối cảnh hoặc thiếu người chịu trách nhiệm rõ ràng.

## Completion Criteria
- File quyết định được tạo đúng định dạng tại `Executive/DEC-YYYYMMDD-SHORT-SLUG.md`.
- Có đầy đủ các mục: Context, Alternatives, Rationale, Impact, Review Date.
- Trạng thái phản ánh đúng thực tế phê duyệt (Draft/Review).
