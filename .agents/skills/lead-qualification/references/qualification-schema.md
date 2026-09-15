# Lead Qualification Schema

Lược đồ đánh giá chất lượng yêu cầu inbound không lưu trữ PII.

## Các Trường Dữ Liệu
- `lead_id`: Mã ẩn danh (ví dụ: `LEAD-202609-012`)
- `capture_channel`: `Instagram DM` | `WhatsApp` | `Website Form`
- `intent_summary`: Tóm tắt mục đích du lịch và kỳ vọng bộ ảnh
- `fit_tier`:
  - `Tier 1 (High Fit)`: Khách quốc tế, kế hoạch rõ ràng, ngân sách phù hợp gói Signature/VIP ($200+)
  - `Tier 2 (Medium Fit)`: Khách cần tư vấn thêm về lịch trình, phù hợp gói Essential ($120)
  - `Tier 3 (Low Fit)`: Khách tìm dịch vụ giá rẻ dưới sàn, thời gian không khả thi
- `target_date`: Ngày dự kiến chụp ảnh
- `group_size`: Số khách (1, 2, 3-5, >5)
- `service_interest`: Tên gói quan tâm
- `special_constraints`: Rào cản ngôn ngữ, địa điểm đặc thù, yêu cầu thời tiết
- `funnel_stage`: `Inquiry` | `Qualified Inquiry` | `Quote Sent` | `Confirmed Booking`
- `next_human_action`: Đề xuất câu trả lời tiếp theo cho tư vấn viên
