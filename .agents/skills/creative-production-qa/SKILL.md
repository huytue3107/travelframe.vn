---
name: creative-production-qa
description: Use when performing quality assurance, brand compliance, technical validation, and licensing audits on creative assets (images, videos, graphics) before stakeholder review or handoff.
---

# Creative Production QA

## Purpose
Kiểm định toàn diện chất lượng tài sản sáng tạo (hình ảnh, video, banner, brochure, carousel) trước khi bàn giao cho Marketing hoặc đưa vào chiến dịch, đảm bảo đáp ứng tuyệt đối về tính chính xác thương hiệu, thông số kỹ thuật, bản quyền và an toàn pháp lý.

## Read First
- `Creative-Production/README.md`
- Brief chiến dịch liên quan trong `Marketing-Growth/Campaigns/`
- Cẩm nang nhận diện thương hiệu TravelFrame
- Bảng kiểm kê tài nguyên và bản quyền trong `Creative-Production/Assets/`

## Inputs
- File tài sản sáng tạo cần kiểm định (Hình ảnh PNG/JPG, Video MP4, Tài liệu PDF)
- Brief gốc tương ứng (Campaign Brief / Content Brief)
- Giấy phép sử dụng hình ảnh (Pexels license, Model release form, Creator consent)

## Workflow
1. Đọc brief để xác định yêu cầu cụ thể về nội dung, tỷ lệ khung hình và thông điệp.
2. Tiến hành rà soát từng tiêu chí theo checklist chuẩn hóa trong `references/qa-checklist.md`:
   - **Tính chính xác nội dung:** Không sai chính tả, đúng địa danh Hà Nội, đúng trang phục truyền thống.
   - **Tiêu chuẩn thương hiệu:** Logo chuẩn, màu sắc nhận diện Indochine đúng tone, không dùng font chữ biến dạng.
   - **Chất lượng kỹ thuật:** Độ phân giải chuẩn (1080x1920 cho Reel, 1080x1350 cho Portrait, 1080x1080 cho Square), bitrate video, âm thanh không bị rè.
   - **Vùng an toàn (Safe Area):** Text và nút không bị thanh điều hướng Instagram/TikTok che khuất.
   - **Bản quyền & Consent:** Có nguồn gốc hợp pháp, không dùng nhạc dính bản quyền thương mại nếu chạy ads.
3. Lập biên bản kiểm định QA tại `Creative-Production/Review/<project>/qa-<run-id>.md`.
4. Phân loại kết luận: `PASS` (Đạt chuẩn) | `PASS_WITH_NOTES` (Đạt kèm lưu ý nhỏ) | `FAIL` (Cần làm lại).

## Output
- Biên bản kiểm định: `Creative-Production/Review/<project>/qa-<run-id>.md`

## Approval Gates
- File sau khi PASS QA chỉ đạt trạng thái `Ready for Review`, TUYỆT ĐỐI KHÔNG tự động chuyển thành `Published`.
- Việc phê duyệt tài sản cho chiến dịch công khai cần Rocky hoặc Creative Lead ký duyệt.

## Guardrails
- Không được coi một bản render hoàn thành là tài sản đã được xuất bản (Published).
- Không bỏ qua bước kiểm tra bản quyền thương mại của nhạc nền video.
- Không tự ý sửa đổi file nguồn của designer/editor mà lập báo cáo lỗi để họ chỉnh sửa.

## Completion Criteria
- Báo cáo QA ghi rõ điểm số cho 6 hạng mục kiểm tra.
- Xác định rõ lỗi (defect), mức độ nghiêm trọng (Severity: High/Medium/Low) và hướng khắc phục.
- Checksum SHA-256 của file tài sản được ghi nhận vào báo cáo để chống nhầm lẫn phiên bản.
