# Đổi tên dự án Obsidian thành TravelFrame

- Ngày thực hiện: 2026-11-18 theo yêu cầu của Rocky.
- Vault: `/Users/macbook/SideAgency/SA`.
- Đổi thư mục `01-Projects/Hanoi-Expert` thành `01-Projects/TravelFrame`. Đổi thư mục tài liệu chuẩn bên trong từ `TravelFrame` thành `Knowledge`.
- Cập nhật trang chủ vault, Project Hub, MOC, tag `project/travelframe`, tham chiếu trong workspace và đường dẫn tab Obsidian. Tên Hanoi Expert vẫn xuất hiện trong nguồn lịch sử.

## Kiểm chứng

Đối chiếu 97 mục di chuyển, SHA-256 trước và sau của 51 file chỉnh sửa, 15 đường dẫn trong thứ tự đọc canonical và các wiki-link có đích hiện hữu. Ba wiki-link đầy đủ tới các note kế hoạch cũ đã thiếu file trước khi đổi tên. `npm run workspace:check` ghi nhận liên kết ảnh Sketchnote bị hỏng từ trước.

`manifest.tsv` ghi đường dẫn trước và sau, checksum cho các tài liệu Markdown đã di chuyển và các file đã chỉnh sửa. Các mục khác được đối chiếu theo đường dẫn.

## Rollback

Đối chiếu checksum `sha256_after` trước khi hoàn tác để tránh ghi đè chỉnh sửa mới. Đổi `01-Projects/TravelFrame/Knowledge` về `TravelFrame`, rồi đổi thư mục dự án về `01-Projects/Hanoi-Expert`. Khôi phục từng file đã chỉnh sửa từ bản sao ở `/var/folders/dg/srxfbpzx08jbp3br0hp92wth0000gn/T/travelframe-vault-rename.X0W7eeCV4v` theo đường dẫn `old_path` trong manifest. Nếu Obsidian đã thay đổi tab sau lần đổi tên, chỉ sửa lại các đường dẫn tương ứng trong `.obsidian/workspace.json`.
