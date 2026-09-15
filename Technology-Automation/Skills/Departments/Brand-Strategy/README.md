# Brand Strategy Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Chiến lược Thương hiệu (Brand Strategy).

## 1. Trách Nhiệm Phòng Ban
Brand Strategy chịu trách nhiệm định vị thương hiệu, quản trị chân dung khách hàng (Personas), cấu trúc gói dịch vụ và bảng giá (Offers & Pricing), và quản trị bản đồ nguồn chân lý (Source-Of-Truth-Map) theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `offer-governance` | So sánh và đối soát bảng giá, gói tour, SLA | Định kỳ / Khi đổi giá | Rocky duyệt mọi biểu giá mới |
| `customer-evidence-synthesis` | Tổng hợp insight từ phản hồi và tin nhắn khách | Hàng tháng | Brand Lead duyệt persona fact |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"So sánh bảng giá trên website hiện tại với tài liệu trong vault"* -> Kích hoạt `offer-governance`
- *"Tổng hợp các rào cản và nỗi sợ phổ biến nhất của du khách solo từ inbox"* -> Kích hoạt `customer-evidence-synthesis`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Brand-Strategy/README.md](../../../../Brand-Strategy/README.md)
- [Brand-Strategy/Source-Of-Truth-Map.md](../../../../Brand-Strategy/Source-Of-Truth-Map.md)
- [Executive/Current-State.md](../../../../Executive/Current-State.md)

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Báo cáo đối soát giá: `Brand-Strategy/Offers-Pricing/`
- Báo cáo tổng hợp insight: `Research-Insights/Library/knowledge/`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Ban hành bảng giá mới hoặc thay đổi cơ cấu gói tour.
- [ ] Cam kết mới về thời gian trả ảnh (SLA) có ảnh hưởng đến chi phí vận hành.
- [ ] Điều chỉnh định vị thương hiệu cốt lõi của TravelFrame.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
lead-qualification (Sales)
  -> customer-evidence-synthesis (Brand)
  -> offer-governance (Brand)
  -> Rocky Phê Duyệt
  -> campaign-brief (Marketing)
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Thu thập dữ liệu từ các cuộc trò chuyện tư vấn của Sales CRM.
2. Dùng `customer-evidence-synthesis` phát hiện du khách rất chuộng nhận ảnh trong ngày để up story.
3. Dùng `offer-governance` xây dựng đề xuất gói Add-on Express Delivery ($25).
4. Lập bảng đối chiếu chi phí và khả năng đáp ứng của thợ chụp.
5. Trình Rocky ký duyệt trước khi đưa lên website và kịch bản tư vấn.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Âm thầm sửa giá:** Sửa giá trên web hoặc tài liệu mà không lập bảng đối soát và xin phê duyệt.
- **Khái quát hóa thái quá:** Lấy 1 ý kiến phàn nàn cá biệt để kết luận toàn bộ thị trường.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Không có PII trong tài liệu tổng hợp insight.
- [ ] Bảng so sánh giá có đầy đủ nguồn đối chứng.
- [ ] Tài liệu lưu tại `Brand-Strategy/Offers-Pricing/`.
