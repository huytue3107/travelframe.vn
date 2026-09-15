# Sales CRM Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Bán hàng & Quản trị Quan hệ Khách hàng (Sales CRM).

## 1. Trách Nhiệm Phòng Ban
Sales CRM chịu trách nhiệm chuyển đổi khách hàng tiềm năng, tiếp nhận và sàng lọc yêu cầu từ Instagram DM/Web, vận hành kịch bản tư vấn, quản lý lịch đặt tour và phối hợp với đội ngũ nhiếp ảnh gia theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `lead-qualification` | Phân loại độ tiềm năng của khách và tạo bản nháp tư vấn | Hàng ngày | Không tự động gửi tin nhắn |
| `manychat-flow-review` | Rà soát luồng tự động hóa tin nhắn trước khi bật live | Khi tạo/sửa flow | Rocky duyệt trước bật live |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Phân loại yêu cầu từ du khách này và soạn bản tóm tắt bàn giao cho tư vấn viên"* -> Kích hoạt `lead-qualification`
- *"Kiểm tra kịch bản flow ManyChat gửi cẩm nang du lịch này trước khi kích hoạt"* -> Kích hoạt `manychat-flow-review`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Sales-CRM/README.md](../../../../Sales-CRM/README.md)
- Bảng giá và gói dịch vụ đã duyệt trong [Brand-Strategy/Offers-Pricing/](../../../../Brand-Strategy/Offers-Pricing/)
- Năng lực lịch chụp hiện có của đội ngũ photographer

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Báo cáo phân loại lead: `Sales-CRM/Funnels/`
- Kịch bản tư vấn mẫu: `Sales-CRM/Scripts/`
- Báo cáo review flow: `Sales-CRM/Automation/ManyChat/<flow>/`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Kích hoạt hoặc sửa đổi bất kỳ kịch bản ManyChat nào đang chạy Live.
- [ ] Áp dụng chính sách giảm giá hoặc ưu đãi đặc biệt ngoài khung biểu giá.
- [ ] Xử lý các khiếu nại nghiêm trọng hoặc yêu cầu hoàn tiền của du khách.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
Campaign Ads / Content CTA
  -> manychat-flow-review (Kiểm duyệt trước)
  -> Live Interaction
  -> lead-qualification (Sàng lọc & chấm điểm)
  -> Tư vấn viên con người chốt cọc
  -> Bàn giao Operations điều phối thợ
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Tiếp nhận yêu cầu từ du khách qua Instagram Direct.
2. Áp dụng `lead-qualification` trích xuất thông tin: Đi 2 người, đến Hà Nội ngày 20/10, thích gói Signature.
3. Chấm điểm Tier 1 (High Fit), soạn handoff draft tóm tắt lịch trình gợi ý.
4. Nhân viên tư vấn phản hồi khách trong vòng 5 phút và hướng dẫn cọc.
5. Sau khi nhận cọc, cập nhật trạng thái `Confirmed Booking` và chuyển lịch cho thợ chụp.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Lưu trữ PII vào Git:** Đưa số điện thoại, email thật của khách hàng vào tài liệu phiên bản Git.
- **Tự động gửi tin nhắn:** Để AI tự động chat với khách mà không có sự kiểm soát của con người.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Báo cáo phân loại lead hoàn toàn ẩn danh.
- [ ] Xác định rõ bước hành động tiếp theo của con người.
- [ ] Tuân thủ chính sách bảo mật thông tin khách hàng.
