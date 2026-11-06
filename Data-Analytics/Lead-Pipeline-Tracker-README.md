# Lead Pipeline Tracker

- Owner: Data-Analytics (nhập liệu: Sales-CRM)
- Status: Draft
- Created: 2026-10-21
- File: [Lead-Pipeline-Tracker.csv](Lead-Pipeline-Tracker.csv)

Dùng để chứng minh doanh thu: mỗi khách đi từ inquiry → qualified → quote → deposit → booked. Không
có dòng ở đây thì không tính là booking.

## Stage

| Stage | Điều kiện vào |
|---|---|
| Inquiry | Khách nhắn hoặc gửi form, chưa có ngày đi |
| Qualified | Có ngày đi + số khách + đang/ sắp ở Hà Nội |
| Qualified-unconfirmed | Có tín hiệu ngày đi nhưng chưa xác nhận lại |
| Quoted | Đã gửi giá theo bảng giá Approved (ghi `quote_usd`, `quote_date`) |
| Deposited | Có bằng chứng thanh toán (`payment_evidence`: mã giao dịch/ảnh, không ghi số thẻ) |
| Booked | Có ngày giờ, thợ chụp được phân công |
| Delivered | Đã giao ảnh |
| Lost | Ghi lý do trong `notes` (giá, lịch, không trả lời…) |

## Quy tắc

- Tier 2 nhận guide PDF **không** phải lead. Chỉ thêm vào khi khách hỏi giá hoặc ngày đi.
- `source_ref` trỏ về dòng log hoặc campaign (vd. `CMP-202610-WARM-PHOTO-DM`) để đối soát ads.
- Không ghi số điện thoại, email, số thẻ vào file này; dùng tên hiển thị và ref.
- Cập nhật mỗi ngày làm việc; Data-Analytics tổng hợp vào báo cáo tuần.
- Không lead nào trong log hiện có bằng chứng quote hoặc deposit; dòng đầu là lead Tier 1 duy nhất.
