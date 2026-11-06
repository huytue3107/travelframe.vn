# TravelFrame — Checkpoint thử nghiệm Codex

- **Cập nhật:** 2026-11-06 (ICT)
- **Mục tiêu:** Kiểm tra phiên Codex mới có tìm được tiến độ và nối tiếp từ file trong dự án.
- **Phạm vi:** Kiểm thử chỉ đọc với tài liệu nội bộ.
- **Trạng thái:** Đã kiểm chứng trên một phiên Codex CLI mới.

## Đã làm và bằng chứng

- Đã thêm quy tắc thử nghiệm và đường dẫn tới checkpoint trong [AGENTS.md](../../AGENTS.md).
- Đã xác nhận [WORKSPACE-MAP.md](../../WORKSPACE-MAP.md) có bản đồ phòng ban và vị trí tra cứu hồ sơ migration.
- Codex CLI 0.166.0 chạy chỉ đọc, tắt Memories cho phiên thử. Với lời nhắn duy nhất “Tiếp tục thử nghiệm checkpoint”, phiên mới mở đúng checkpoint qua `AGENTS.md` và xác nhận **Operations** phụ trách, tra mapping tại [`Operations/Migrations/`](../../Operations/Migrations/). Phiên thử kết thúc thành công.

## Bước tiếp theo nếu chạy lại thử nghiệm

- Mở `WORKSPACE-MAP.md` và đối chiếu nơi tra cứu mapping cho tooling cũ còn dùng đường dẫn legacy. Trả lời trong chat bằng tên phòng ban phụ trách, đường dẫn thư mục chính xác và đường dẫn checkpoint đã đọc.
