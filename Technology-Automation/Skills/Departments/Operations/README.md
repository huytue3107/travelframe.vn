# Operations Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Vận hành (Operations).

## 1. Trách Nhiệm Phòng Ban
Operations chịu trách nhiệm điều phối lịch trình tour, quản lý thợ chụp ảnh, giám sát quy trình thực thi (SOPs, Runbooks, Checklists), quản trị thay đổi (Change Management) và lưu trữ hồ sơ migration theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `sop-change-control` | Quản trị quy trình sửa đổi SOP có phương án hoàn tác | Khi đổi quy trình | Rocky duyệt thay đổi lớn |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Đề xuất cập nhật quy trình bàn giao ảnh gốc cho khách du lịch trong vòng 6 giờ"* -> Kích hoạt `sop-change-control`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Operations/README.md](../../../../Operations/README.md)
- Các SOP hiện hành trong `Operations/Runbooks/` và `Operations/Checklists/`
- Lịch sử quản trị thay đổi trong `Operations/Change-Management/`

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Hồ sơ quản trị thay đổi: `Operations/Change-Management/`
- SOP / Checklist ban hành: `Operations/Runbooks/` hoặc `Operations/Checklists/`
- Hồ sơ migration: `Operations/Migrations/`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Thay đổi các quy trình ảnh hưởng trực tiếp đến nhiều phòng ban.
- [ ] Thay đổi quyền hạn, phân quyền truy cập hoặc chính sách an toàn.
- [ ] Thực hiện các dọn dẹp có tính chất phá hủy (destructive cleanup) hoặc xóa dữ liệu lịch sử.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
Phát hiện điểm nghẽn vận hành
  -> sop-change-control (Lập bản đồ tác động & đề xuất)
  -> Thử nghiệm pilot
  -> Rocky Phê Duyệt
  -> Ban hành SOP mới & đào tạo nhân sự
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Nhận phản hồi về việc thợ chụp ảnh trả file chậm trong mùa cao điểm.
2. Dùng `sop-change-control` phân tích nguyên nhân, đề xuất quy trình upload ảnh trực tiếp qua thẻ nhớ tại văn phòng.
3. Thử nghiệm trên 5 tour chụp trong tuần.
4. Hoàn tất kế hoạch rollback và trình Rocky phê duyệt.
5. Ban hành SOP chính thức và lưu hồ sơ thay đổi vào `Operations/Change-Management/`.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Xóa bỏ lịch sử cũ:** Xóa hoàn toàn bản SOP cũ thay vì lưu trữ phiên bản lịch sử.
- **Thiếu phương án hoàn tác:** Ban hành quy trình mới nhưng khi xảy ra sự cố không có cách quay lại quy trình cũ.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Hồ sơ thay đổi có đầy đủ bản đồ tác động và kế hoạch rollback.
- [ ] Đã có sự xác nhận của các phòng ban liên quan.
- [ ] Cập nhật danh mục SOP hiện hành.
