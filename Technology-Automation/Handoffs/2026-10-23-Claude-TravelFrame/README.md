---
title: Bàn giao kiến thức và cách làm việc TravelFrame cho Claude
owner: Technology-Automation
status: Review
created: 2026-10-23
updated: 2026-10-23
scope: Tổng hợp workspace và kinh nghiệm SEO, nội dung, Drupal trong chuỗi công việc đến 2026-10-23
---

# Bắt đầu tại đây

Gói này giúp Claude tiếp nối công việc TravelFrame: hiểu thương hiệu, đọc đúng nguồn, nghiên cứu SEO, viết từ ảnh thật, chuẩn bị bản duyệt, đăng Drupal và kiểm tra kết quả. Đây là bản bàn giao có ngày, không thay thế nguồn chính thức hoặc tự mở rộng quyền hành động.

## Dùng trong Claude Code

Mở project `travelframe.vn`, đọc `CLAUDE.md` hiện có ở project root, rồi đưa [Prompt-For-Claude.md](Prompt-For-Claude.md) cho Claude. Các tài liệu bên dưới là phần bổ sung; không ghi đè toàn bộ `CLAUDE.md` bằng gói này.

## Dùng trong Claude chat hoặc Project

Nếu muốn dùng một file duy nhất, tải lên `TravelFrame-Claude-Complete.md`: bản ghép đầy đủ cẩm nang, snapshot/nguồn và prompt. Các file riêng bên dưới tiện đọc hoặc cập nhật từng phần.

1. Tải lên [Knowledge-And-Methods.md](Knowledge-And-Methods.md) và [Snapshot-And-Sources.md](Snapshot-And-Sources.md).
2. Dán nội dung [Prompt-For-Claude.md](Prompt-For-Claude.md) vào chat hoặc phần hướng dẫn của Project.
3. Khi cần viết bài, đưa thêm ảnh, link nguồn hoặc tài liệu được chỉ định. Khi cần thao tác website, kết nối công cụ và đăng nhập ở môi trường Claude đó.

Đường dẫn local chỉ mở được nếu Claude có quyền truy cập cùng workspace; tải tài liệu lên chat không cấp quyền đọc ổ đĩa. Phiên đăng nhập, MCP, plugin và quyền publish cũng không tự chuyển sang Claude. Gói này cung cấp context để làm việc, không huấn luyện lại mô hình nền.

## Nội dung

| File | Dùng để làm gì |
|---|---|
| [Knowledge-And-Methods.md](Knowledge-And-Methods.md) | Kiến thức cốt lõi, cách ra quyết định, quy trình nghiên cứu → viết → duyệt → publish → QA |
| [Snapshot-And-Sources.md](Snapshot-And-Sources.md) | Trạng thái có ngày, từ khóa, case Thin–Harry, vấn đề còn mở và bản đồ nguồn |
| [Prompt-For-Claude.md](Prompt-For-Claude.md) | Lời giao việc có thể dùng ngay, có hướng dẫn khi thiếu quyền truy cập |
| `Validation.md` | Kết quả kiểm tra gói bàn giao trong lượt tạo này |

## Phạm vi và giới hạn

- Tổng hợp kiến thức có thể kiểm chứng và phương thức vận hành từ tài liệu dự án cùng công việc đã thực hiện; không chứa credential hoặc dữ liệu phiên đăng nhập.
- Không phải bản sao toàn bộ vault, toàn bộ lịch sử chat hay thư viện media. Nguồn gốc được trỏ tới để tránh tạo một bộ canonical song song.
- Số liệu cũ được giữ đúng ngày và thị trường. Lượt tổng hợp này không chạy audit mới, không đo lại ranking, không kiểm tra lại tài khoản OpenSEO và không sửa website.
- Trạng thái Review của gói bàn giao không thay đổi trạng thái Approved/Published của các tài sản được dẫn làm ví dụ.

Owner của gói: Technology-Automation. Nội dung website tiếp tục thuộc Marketing-Growth; ảnh thuộc Creative-Production; quyết định thương mại thuộc Executive/Brand-Strategy.
