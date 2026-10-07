# MIG-20260930-VIKTOR-ASSET-SORT

## Scope

Phân loại 216 ảnh trong
`Marketing-Growth/Content/viktor-travelframe/` thành các nhóm dịch vụ phù hợp để
chuẩn bị listing trên Viktor.

## Rules

- Không đổi filename.
- Không xóa hoặc chỉnh sửa nội dung ảnh.
- Giữ các bộ ảnh có cùng mã bài đăng trong cùng nhóm, ngoại trừ hai ảnh lẻ có cùng
  prefix `784428397` nhưng thuộc hai đối tượng khác nhau.
- Phân loại dựa trên đối tượng khách, thời điểm chụp và concept nhìn thấy trong ảnh.

## Files

- `manifest.tsv`: đường dẫn cũ, đường dẫn mới, SHA-256 và category.
- `files.sha256`: checksum tại vị trí mới.
- `validation-report.md`: kết quả kiểm tra sau di chuyển.

## Rollback

1. Đọc từng dòng trong `manifest.tsv`, bỏ dòng header.
2. Tạo lại thư mục cha của cột `source`.
3. Di chuyển file từ cột `destination` về cột `source`.
4. Xóa các thư mục phân loại rỗng sau khi xác nhận đủ 216 file.
5. Chạy lại SHA-256 và so sánh với cột `sha256` trong manifest.

Không rollback bằng cách xóa hoặc ghi đè ảnh.

