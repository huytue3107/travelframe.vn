---
name: manychat-flow-review
description: Use when auditing or reviewing ManyChat automation flows, triggers, keyword monitors, message trees, fallbacks, tags, and human handoff routing before live deployment.
---

# ManyChat Flow Review

## Purpose
Rà soát và kiểm định toàn diện các luồng tự động hóa tin nhắn ManyChat (Instagram Direct / Facebook Messenger), kiểm tra từ khóa kích hoạt, cây thông điệp, logic phân loại lead, điểm bàn giao cho con người (human handoff) và điều kiện dừng, ngăn ngừa lỗi spam hoặc phản hồi sai lệch với khách du lịch.

## Read First
- `Sales-CRM/README.md`
- Kịch bản chiến dịch tiếp thị tương ứng trong `Marketing-Growth/Campaigns/`
- Bảng giá và gói dịch vụ đã duyệt trong `Brand-Strategy/Offers-Pricing/`

## Inputs
- Sơ đồ luồng ManyChat (Export JSON hoặc ảnh chụp màn hình flow builder)
- Danh sách từ khóa kích hoạt (Keywords trigger)
- Quy tắc gắn thẻ (Tagging rules) và lưu Custom Fields

## Workflow
1. Đối chiếu kịch bản tin nhắn với các gói dịch vụ và bảng giá chính thức.
2. Kiểm tra các thành phần cốt lõi theo `references/flow-review-checklist.md`:
   - Trigger keyword: Từ khóa có bị quá rộng (gây kích hoạt nhầm) không?
   - Value delivery: Khách có nhận được thông tin hữu ích ngay tin nhắn đầu không?
   - Qualification: Luồng có hỏi các câu hỏi ngắn gọn (ngày đến Hà Nội, số người)?
   - Fallback & Human Handoff: Khi khách hỏi ngoài kịch bản hoặc muốn gặp người thật, bot có dừng lại và thông báo cho tư vấn viên không?
   - Tagging: Khách có được gắn đúng tag chiến dịch không?
3. Lập báo cáo kiểm định tại `Sales-CRM/Automation/ManyChat/<flow-name>/review-<date>.md`.
4. Đưa ra kết luận: `APPROVED_FOR_LIVE` (Đạt chuẩn) hoặc `CHANGES_REQUIRED` (Cần chỉnh sửa).

## Output
- Báo cáo review: `Sales-CRM/Automation/ManyChat/<flow-name>/review-<date>.md`

## Approval Gates
- **BẮT BUỘC có sự phê duyệt của Rocky** trước khi kích hoạt (Turn ON) hoặc sửa đổi bất kỳ flow tự động hóa nào đang hoạt động trực tiếp (Live).

## Guardrails
- Tuyệt đối KHÔNG tự động can thiệp vào tài khoản ManyChat live qua API hay giao diện khi chưa có lệnh.
- Không thiết kế luồng gài bẫy người dùng hoặc spam tin nhắn lặp lại.
- Luôn đảm bảo có cơ chế Human Handoff rõ ràng trong vòng tối đa 2 bước tương tác.

## Completion Criteria
- Báo cáo review chi tiết từng bước trong flow builder.
- Đầy đủ 8 tiêu chí kiểm tra trong checklist.
- Đánh giá rõ rủi ro trải nghiệm và điều kiện dừng khẩn cấp.
