---
name: lead-qualification
description: Use when qualifying inbound customer inquiries from Instagram DM, WhatsApp, or website forms into structured lead tiers, scoring fit and drafting human consultant handoffs.
---

# Lead Qualification

## Purpose
Thiết lập bộ tiêu chí đánh giá (qualification rubric) và quy trình sàng lọc yêu cầu của du khách từ các kênh inbound (Instagram Direct, WhatsApp, Web configurator), phân loại mức độ tiềm năng (Fit & Intent) và soạn thảo nội dung bàn giao (handoff draft) cho tư vấn viên con người chốt tour.

## Read First
- Các gói dịch vụ và giá được duyệt trong `Brand-Strategy/Offers-Pricing/`
- Năng lực phục vụ (capacity constraint) của đội ngũ thợ chụp
- `Sales-CRM/README.md`
- Kịch bản CTA của chiến dịch đang chạy

## Inputs
- Nội dung câu hỏi / tin nhắn của du khách (đã ẩn danh tính)
- Ngày dự kiến du lịch Hà Nội, thời lượng lưu trú
- Loại hình trải nghiệm mong muốn (chụp ảnh solo, cặp đôi, gia đình, tour ẩm thực)
- Ngân sách hoặc quy mô nhóm khách

## Workflow
1. Đọc nội dung yêu cầu, trích xuất 6 trường dữ liệu cốt lõi theo `references/qualification-schema.md`:
   - `intent`: Mục đích chuyến đi (du lịch, kỷ niệm, sống ảo, công tác kết hợp).
   - `fit`: Mức độ phù hợp với phân khúc TravelFrame (High / Medium / Low).
   - `timing`: Ngày chụp cụ thể (In-destination hôm nay/ngày mai hay Pre-trip tháng tới).
   - `group_size`: Số lượng người tham gia tour.
   - `service_interest`: Gói dịch vụ quan tâm (The Essential, Signature, VIP).
   - `constraints`: Yêu cầu đặc biệt (thời tiết, trang phục áo dài, xe đón).
2. Phân định chính xác trạng thái trong phễu:
   - `Inquiry`: Khách mới hỏi thông tin chung.
   - `Qualified Inquiry`: Đã xác định ngày, số lượng người và gói phù hợp.
   - `Quote Sent`: Đã gửi báo giá chính thức kèm link lịch trình.
   - `Confirmed Booking`: Đã có chứng từ đặt cọc hoặc xác nhận thanh toán.
3. Soạn bản tóm tắt bàn giao (Handoff summary draft) để tư vấn viên phản hồi trong vòng 5 phút.

## Output
- Bản ghi phễu hoặc kịch bản tư vấn: `Sales-CRM/Funnels/` hoặc `Sales-CRM/Scripts/`
- Tuyệt đối không chứa PII thật (dùng mã ẩn danh `LEAD-YYYYMM-XXXX`)

## Approval Gates
- Kỹ năng chỉ tạo bản nháp (Draft) hoặc đánh giá (Review).
- TUYỆT ĐỐI KHÔNG tự động gửi tin nhắn hay báo giá ra bên ngoài mà không có con người xác nhận.

## Guardrails
- Không lưu số điện thoại, email thật hoặc thông tin nhạy cảm của khách vào Git.
- Không tự ý gọi một Inquiry là Confirmed Booking khi chưa có văn bản xác nhận cọc.
- Không tự ý giảm giá hay cam kết khuyến mãi vượt quá chính sách thương mại.

## Completion Criteria
- Báo cáo phân loại lead tuân thủ 100% schema trung tính.
- Xác định rõ hành động tiếp theo của tư vấn viên (`next_human_action`).
- Không có bất kỳ dữ liệu định danh cá nhân (PII) nào lọt vào repo.
