# Customer Evidence Schema

Cấu trúc chuẩn hóa để ghi nhận bằng chứng định tính từ khách hàng TravelFrame.

## 1. Các Trường Thuộc Tính Bắt Buộc

- `evidence_id`: Mã định danh bằng chứng (ví dụ: `EVD-202609-001`)
- `date_captured`: Ngày ghi nhận (YYYY-MM-DD)
- `source_channel`: Kênh thu thập (`Instagram DM`, `WhatsApp`, `Tripadvisor`, `Post-Tour Survey`)
- `customer_segment`: Phân khúc du khách (`Solo Inbound`, `Couple Romance`, `Family Vacation`, `Content Creator`)
- `theme`: Chủ đề chính (`Posing Anxiety`, `Local Hidden Gems`, `Delivery Speed`, `Pricing Transparency`, `Weather Concern`)
- `verbatim_quote`: Trích dẫn nguyên văn bằng tiếng Anh/tiếng Việt (đã loại bỏ PII)
- `interpreted_need`: Nhu cầu hoặc nỗi sợ ẩn sau trích dẫn
- `actionable_recommendation`: Đề xuất hành động cho Marketing/Creative/Sales
- `confidence`: `High` (xuất hiện >= 5 lần độc lập) | `Medium` (2-4 lần) | `Low` (quan sát đơn lẻ)
