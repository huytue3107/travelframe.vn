Mình sẽ đọc các file khởi động theo protocol và quét cấu trúc workspace để tóm tắt.

# Tóm tắt workspace travelframe.vn (tính đến 21/10/2026)

## 1. Bản chất và cấu trúc

TravelFrame là mảng bán trực tiếp cho khách du lịch của Hanoi Expert. Định vị: khám phá Hà Nội cùng một người địa phương, và chuyến đi thành một câu chuyện bằng ảnh của riêng khách. Kênh đang chạy là IG, FB, Threads @travelframe.vn và website travelframe.sidevn.com.

Workspace được tổ chức như một hệ điều hành công ty, gồm 9 phòng ban cộng Inbox và Archive. Repo GitHub `travelframe.vn` có 15 commit gần nhất, từ Threads sprint đến Meta Ads MCP.

| Phòng ban | Quy mô | Nội dung chính |
|---|---|---|
| Executive | 5 file | Current-State, 1 quyết định đã duyệt (DEC-20261009), Operating Review 27/09, Master Summary 15/09 |
| Brand-Strategy | 9 file | Source-of-truth map (bản gốc nằm ở Side Agency vault), 6 đề xuất giá/gói, đều **chưa duyệt** |
| Research-Insights | 2.589 file / 150 MB | Thư viện channel, video, transcript, phân tích; research đối thủ, nhóm FB người nước ngoài, đối tác lưu trú (14/10) |
| Marketing-Growth | 661 file / 1,1 GB | 2 campaign, Threads sprint, Stories, drafts, carousels, SEO (content audit, keyword system, sprint 30 ngày, fix log 20/10), Seed Comment Playbook |
| Creative-Production | 449 file / 1,1 GB | Raw/Stock/AI assets, các dự án (Đồng Xuân series, Photographer Tour Guide, Ebook sketchnote, Catalogue), deliverables (Guest Guide PDF EN/VN, BTS vs The Shot 14/10) |
| Sales-CRM | 9 file | Script DM/WhatsApp, playbook cho 6 nhóm khách, template B2B, 5 tài liệu flow ManyChat (draft) |
| Technology-Automation | 1.529 file | 4 MCP (GA4, Meta read-only, Meta Ads, Meta automation), 9 runbook, OpenSEO, lead triage TypeSafe; khoảng 60 skill và 4 agent trong `.claude/` |
| Data-Analytics | 99 file | Snapshot, báo cáo hằng ngày, bộ Performance Consulting Review 21/10 (PDF 10 trang), Seed-Comment-Tracker (74 dòng) |
| Operations | 53 file | 14 batch migration có manifest/checksum, tài liệu change-management |

## 2. Tình hình thương mại

Doanh thu và booking **đã xác minh: 0**. Đây là khoảng trống lớn nhất. Workspace vẫn chưa có CRM hay đối soát thanh toán, nên chưa tính được CAC hay ROAS.

Các vấn đề P0 chưa chốt:
- Kiến trúc thương hiệu.
- Danh mục sản phẩm (product ladder).
- **Giá**: đang có 4–5 hệ giá song song, chưa hệ nào được duyệt.
- SLA giao ảnh.
- Mô hình pháp lý và thanh toán.
- DNS cho travelframe.vn.

Ads: phương án photo walk 14 ngày (300.000 VND/ngày, trần 4,2 triệu VND) đã được duyệt ngày 09/10. Bản nháp và prelaunch audit làm xong ngày 13/10, nhưng **chiến dịch chưa chạy**.

Phễu inbound: log Messenger có 23 tương tác. Khoảng 15 người thuộc nhóm "Tier 2" (comment "Hanoi" để nhận guide PDF). Chỉ có 1 lead Tier 1 thật (Zion Sky, quá cảnh 5 tiếng ở Hà Nội vào tháng 11). Chưa có báo giá nào được ghi nhận.

## 3. Số liệu: hai báo cáo cùng ngày kể hai câu chuyện khác nhau

Báo cáo tối 21/10 viết theo hướng toàn tin tốt. Dữ liệu tính trong Consulting Review cùng ngày (so tuần 14–20/10 với tuần 07–13/10) cho thấy khác:

| Chỉ số | Tuần trước | Tuần này | Thay đổi |
|---|---|---|---|
| Lượt tiếp cận IG (reach) | 116.176 | 44.325 | **−62%** |
| Tổng tương tác IG | 8.483 | 2.601 | **−69%** |
| Lượt xem profile IG | 756 | 370 | −51% |
| Click website từ IG | 8 | 19 | +138% |
| Người dùng website | 137 | 166 | +21% |
| Pageviews | 676 | 650 | −4% |
| Bounce rate | 55,6% | 66,7% | xấu đi |

Một số điểm cần lưu ý:
- Lũy kế tháng 10 (MTD) của website: 360 người dùng, 608 phiên, 137 lượt xem `/booking` từ 40 người dùng, nhưng **không có form đặt nào được gửi**.
- Dữ liệu có ghi 160 pageview từ trang admin, nhiều khả năng là traffic nội bộ, nên số trang có thể đang bị thổi lên.
- Reach IG giảm mạnh khớp với quyết định ngày 21/10: chấp nhận reach thấp hơn để chuyển từ đăng lại nội dung sang nội dung tự sản xuất có khách thật. Nhưng hôm nay lại đăng 4 Reels, đi ngược với hướng giảm số lượng bài.

## 4. Rủi ro trong vận hành workspace

- `Executive/Current-State.md` vẫn ghi snapshot ngày **15/09**, nên không còn phản ánh đúng ưu tiên hiện tại.
- Git đang có **khoảng 12 báo cáo trong Data-Analytics bị xóa mà chưa commit** (các báo cáo Meta/GA từ 17/09 đến 06/10), cùng một số file mới chưa track. Cần xác nhận việc xóa này là cố ý.
- `npm run workspace:check` đang **không đạt** vì link markdown hỏng trong brief campaign và tham chiếu skill, cộng với đường dẫn tuyệt đối cũ trong `scratch/` và `.claude/settings.local.json`. `npm test` (158 test) và `test:skills` (15 test) vẫn pass.
- `scratch/` (140 file) và `tmp/` (15 MB) chứa script Orca và dump comment chưa có phòng ban nào sở hữu, trái với quy tắc về ownership.
