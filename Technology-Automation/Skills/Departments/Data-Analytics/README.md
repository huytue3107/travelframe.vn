# Data Analytics Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Dữ liệu & Phân tích (Data Analytics).

## 1. Trách Nhiệm Phòng Ban
Data Analytics chịu trách nhiệm đo lường hiệu quả kinh doanh, kết nối dữ liệu chi phí và doanh thu, phân tích phễu chuyển đổi, tính toán chỉ số MER/CAC và cung cấp các báo cáo dữ liệu định kỳ theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `campaign-performance-report` | Tổng hợp báo cáo hiệu quả chiến dịch tiếp thị | Hàng tuần / Kết thúc chiến dịch | Ghi rõ limitations |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Tổng hợp báo cáo hiệu quả chiến dịch Meta Ads tháng 9 đối chiếu với doanh thu cọc CRM"* -> Kích hoạt `campaign-performance-report`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Data-Analytics/Measurement-Framework.md](../../../../Data-Analytics/Measurement-Framework.md)
- Các snapshot gần nhất trong [Data-Analytics/Snapshots/](../../../../Data-Analytics/Snapshots/)
- Báo cáo chiến dịch từ Marketing-Growth

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Báo cáo chiến dịch: `Data-Analytics/Campaign-Results/<campaign-id>/`
- Snapshots dữ liệu: `Data-Analytics/Snapshots/`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Thay đổi công thức tính toán các chỉ số kinh doanh cốt lõi (MER, LTV, CAC).
- [ ] Đề xuất điều chỉnh phân bổ ngân sách lớn giữa các kênh tiếp thị.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
Snapshots từ Ads & GA4 & CRM
  -> campaign-performance-report (Tổng hợp & đối soát)
  -> Bàn giao Executive (Operating Review)
  -> Khuyến nghị Marketing (Scale / Kill Ads)
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Thu thập snapshot chi tiêu Meta Ads và báo cáo tiền cọc từ Sales CRM.
2. Dùng `campaign-performance-report` đối soát doanh thu thực tế và tính toán Blended MER.
3. Phân tích hiệu quả từng creative để tìm ra mẫu quảng cáo thắng cuộc (Winner).
4. Lập báo cáo có phân định rõ ràng thời điểm lấy số liệu và độ trễ quy kết.
5. Gửi báo cáo cho Executive và Marketing để ra quyết định điều chỉnh ngân sách.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Gộp snapshot cọc cạch:** Cộng dồn các số liệu lấy ở các khoảng thời gian hoặc múi giờ khác nhau.
- **Bỏ qua độ trễ quy kết:** Vội vàng kết luận chiến dịch lỗ vốn khi du khách quốc tế thường cọc trước 2-4 tuần.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Báo cáo ghi rõ nguồn dữ liệu, thời điểm chụp snapshot và múi giờ.
- [ ] Chỉ số MER được tính trên doanh thu thực tế có đối soát.
- [ ] Đính kèm khuyến nghị hành động cụ thể.
