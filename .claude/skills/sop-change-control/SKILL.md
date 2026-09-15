---
name: sop-change-control
description: Use when proposing, reviewing, testing, or deploying changes to Standard Operating Procedures (SOPs), cross-department workflows, and runbooks with rollback plans.
---

# SOP Change Control

## Purpose
Quản trị quy trình đề xuất, đánh giá tác động, thử nghiệm và ban hành các thay đổi đối với Quy trình vận hành chuẩn (SOPs), cẩm nang nghiệp vụ (Runbooks) và danh mục kiểm tra (Checklists) của TravelFrame, đảm bảo tính liên tục trong vận hành và có phương án hoàn tác (Rollback) sẵn sàng.

## Read First
- `Operations/README.md`
- SOP hiện hành cần chỉnh sửa trong `Operations/Runbooks/` hoặc `Operations/Checklists/`
- Lịch sử thay đổi trong `Operations/Change-Management/`
- Danh sách các phòng ban bị ảnh hưởng theo `WORKSPACE-MAP.md`

## Inputs
- Mã định danh SOP cần sửa đổi
- Lý do thay đổi (sự cố phát sinh, cập nhật công cụ mới, phản hồi khách hàng, tối ưu chi phí)
- Nội dung thay đổi chi tiết (Bản hiện hành vs Bản đề xuất)
- Danh sách các phòng ban chịu tác động trực tiếp

## Workflow
1. Xác định hiện trạng (Baseline) của SOP hiện có, chụp lại mã băm hoặc snapshot nội dung cũ.
2. Lập bản đồ tác động (Impact Map): Liệt kê tất cả các role, phòng ban và tài liệu liên quan chịu ảnh hưởng.
3. Soạn thảo đề xuất thay đổi theo mẫu `templates/change-record.md`.
4. Tiến hành thử nghiệm (Validation): Chạy thử quy trình mới trên một nhóm nhỏ hoặc dự án pilot.
5. Soạn thảo phương án hoàn tác (Rollback Plan): Hướng dẫn từng bước khôi phục trạng thái cũ nếu quy trình mới thất bại.
6. Trình Rocky phê duyệt trước khi ban hành chính thức.

## Output
- Hồ sơ quản trị thay đổi: `Operations/Change-Management/YYYY-MM-DD-sop-change-SHORT-SLUG.md`
- SOP cập nhật tại thư mục chủ sở hữu

## Approval Gates
- **BẮT BUỘC có sự phê duyệt của Rocky** đối với các thay đổi quy trình ảnh hưởng liên phòng ban, thay đổi quyền hạn nhân sự, hoặc chỉnh sửa chính sách an toàn.

## Guardrails
- Tuyệt đối KHÔNG xóa bỏ lịch sử các bản SOP cũ; bản cũ phải được lưu trữ hoặc có con trỏ dẫn chiếu tới bản mới.
- Mọi thay đổi SOP đều phải có kịch bản hoàn tác (Rollback instruction) chi tiết.
- Không áp dụng quy trình mới khi chưa thông báo cho các bên liên quan.

## Completion Criteria
- Hồ sơ quản trị thay đổi hoàn tất đầy đủ 6 bước theo quy chuẩn.
- Có sự đồng thuận và xác nhận tiếp nhận của các phòng ban bị ảnh hưởng.
- Kế hoạch rollback được kiểm chứng khả thi.
