# Executive Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành riêng cho bộ phận Lãnh đạo điều hành (Executive).

## 1. Trách Nhiệm Phòng Ban
Executive chịu trách nhiệm về định hướng chiến lược tổng thể, ban hành quyết định cấp cao (Decision Records), phê duyệt ngân sách, rà soát tiến độ định kỳ (Operating Reviews) và duy trì sự toàn vẹn của Company OS theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `executive-decision-record` | Soạn thảo quyết định chiến lược có cấu trúc | Khi có đề xuất lớn | Rocky duyệt chuyển `Approved` |
| `executive-operating-review` | Tổng hợp báo cáo vận hành PPP định kỳ | Hàng tuần / Hàng tháng | Báo cáo nội bộ, không coi reach là booking |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Tạo decision record cho phương án điều chỉnh product ladder vừa thảo luận"* -> Kích hoạt `executive-decision-record`
- *"Tổng hợp báo cáo vận hành PPP cho tuần 2 tháng 9"* -> Kích hoạt `executive-operating-review`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Executive/README.md](../../../../Executive/README.md)
- [Executive/Current-State.md](../../../../Executive/Current-State.md)
- [Brand-Strategy/Source-Of-Truth-Map.md](../../../../Brand-Strategy/Source-Of-Truth-Map.md)

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Decision Records: `Executive/DEC-YYYYMMDD-SHORT-SLUG.md`
- Báo cáo vận hành: `Executive/Snapshots/YYYY-MM-DD-Operating-Review.md`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Chuyển trạng thái bất kỳ đề xuất nào thành `Approved`.
- [ ] Thay đổi mục tiêu P0/P1 trong `Current-State.md`.
- [ ] Điều chỉnh quy tắc cốt lõi của Company OS hoặc cơ cấu tổ chức.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
campaign-performance-report (Data)
  -> executive-operating-review (Executive)
  -> Thảo luận chiến lược
  -> executive-decision-record (Executive)
  -> Rocky Phê Duyệt
  -> sop-change-control (Operations)
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Nhận báo cáo kết quả đợt chạy thử nghiệm quảng cáo từ Data Analytics.
2. Chạy `executive-operating-review` để tổng hợp tiến độ, phân loại rủi ro và nhận diện nhu cầu điều chỉnh gói dịch vụ.
3. Soạn thảo dự thảo `DEC-20260915-PACKAGES-PRICING.md` bằng `executive-decision-record`.
4. Trình Rocky xem xét và ký duyệt.
5. Sau khi Rocky phê duyệt, chuyển trạng thái file thành `Approved` và cập nhật vào `Current-State.md`.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Tự động gắn mác Approved:** Agent tự ý đổi status thành Approved khi Rocky chưa phê duyệt bằng văn bản.
- **Nhầm lẫn giữa Reach và Booking:** Báo cáo tăng trưởng ấn tượng về lượt xem nhưng thực tế không phát sinh cọc tour.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] File lưu đúng thư mục `Executive/`.
- [ ] Đầy đủ bối cảnh, phương án thay thế, lý do và ngày đánh giá lại.
- [ ] Trạng thái phản ánh trung thực mức độ phê duyệt (Draft/Review).
