---
name: web-experience-qa
description: Use when conducting automated and manual quality audits on the TravelFrame website, testing responsive layouts, booking configurator flows, links, visual assets, and cross-device performance.
---

# Web Experience QA

## Purpose
Kiểm toán và đánh giá toàn diện trải nghiệm người dùng trên website `travelframe.sidevn.com` và các môi trường web local, kiểm tra độ tương thích thiết bị (Desktop/Mobile), tính năng cấu hình tour (Booking Configurator), tốc độ tải trang, lỗi liên kết và tính nhất quán với cẩm nang thương hiệu.

## Read First
- `Brand-Strategy/Offers-Pricing/TravelFrame-Website-Packages-Pricing-2026-09-15.md`
- `Executive/Current-State.md`
- `Technology-Automation/README.md`

## Inputs
- URL trang web cần kiểm tra (môi trường Live hoặc Local preview)
- Kịch bản người dùng cần test (User journey: Xem tour -> Chọn gói -> Tính giá -> Điền form)
- Danh sách thiết bị kiểm thử (iPhone Safari, Android Chrome, Mac Desktop)

## Workflow
1. Khởi động môi trường kiểm thử hoặc mở trang web mục tiêu.
2. Rà soát tuần tự theo `references/browser-qa-checklist.md`:
   - Giao diện đáp ứng (Responsive Layout): Không bị vỡ khung, không chồng chéo chữ (visual overlap) trên màn hình dọc điện thoại.
   - Trình cấu hình đặt tour (Booking Configurator): Giá tạm tính có khớp đúng công thức và bảng giá niêm yết không?
   - Form tương tác: Kiểm tra trường nhập liệu, định dạng ngày tháng, thông báo lỗi khi thiếu thông tin.
   - Console errors: Kiểm tra xem có lỗi JavaScript runtime hoặc tài nguyên 404 không.
   - Tính nhất quán thông tin: Giá, thời lượng, số lượng ảnh có khớp với tài liệu Brand Strategy không?
3. Chụp ảnh màn hình bằng chứng (Screenshots) cho các lỗi phát hiện.
4. Lập báo cáo kiểm định QA tổng hợp tại thư mục review.

## Output
- Báo cáo kiểm định: `Technology-Automation/Runbooks/QA-YYYYMMDD-web-experience.md` hoặc thư mục review của chủ sở hữu
- Thư mục ảnh chụp lỗi đính kèm

## Approval Gates
- **TUYỆT ĐỐI KHÔNG submit form thật** tạo booking ảo trên môi trường sản xuất (Live) nếu chưa có sự cho phép rõ ràng từ Rocky.

## Guardrails
- Ưu tiên kiểm thử trên môi trường local hoặc staging trước khi test trên live.
- Không sửa trực tiếp mã nguồn website mà chỉ ghi nhận lỗi và đề xuất giải pháp kỹ thuật.
- Báo cáo trung thực mọi điểm nghẽn trải nghiệm người dùng.

## Completion Criteria
- Biên bản QA phân loại lỗi theo mức độ: `Critical` (chặn người dùng), `Major` (lỗi hiển thị lớn), `Minor` (lỗi thẩm mỹ nhỏ).
- Đầy đủ ảnh chụp màn hình chứng minh cho từng lỗi ghi nhận.
- Kết luận rõ ràng về độ sẵn sàng phục vụ du khách của website.
