# Marketing Growth Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Tiếp thị & Tăng trưởng (Marketing Growth).

## 1. Trách Nhiệm Phòng Ban
Marketing Growth chịu trách nhiệm về thu hút du khách, triển khai chiến dịch quảng cáo đa kênh (Meta Ads, Google), tối ưu hóa công cụ tìm kiếm (SEO), sáng tạo nội dung truyền thông và quản trị chuyển đổi đầu phễu theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `campaign-brief` | Lập brief gói chiến dịch tiếp thị tích hợp | Mỗi chiến dịch mới | Rocky duyệt brief & budget |
| `content-writing` | Soạn thảo bài viết blog, hướng dẫn du lịch | Hàng tuần | Rocky duyệt trước Publish |
| `humanizer` | Biên tập loại bỏ AI-tone, tạo văn phong tự nhiên | Khi hoàn thành draft | Giữ nguyên 100% facts |
| `keyword-research` | Nghiên cứu và sàng lọc từ khóa tiềm năng | Định kỳ SEO | Tuân thủ OpenSEO quota |
| `keyword-clustering` | Phân cụm từ khóa theo search intent | Định kỳ SEO | Bàn giao content briefs |
| `seo-audit` | Kiểm toán SEO kỹ thuật và nội dung domain | Hàng tháng | Báo cáo review nội bộ |
| `seo-coach` | Tư vấn và định hướng giải pháp SEO | Tương tác hàng ngày | Không thay thế approved plan |
| `seo-project-setup` | Cấu hình ngữ cảnh dự án trên OpenSEO | Khi khởi tạo dự án | Review write scope |
| `link-prospecting` | Tìm kiếm cơ hội hợp tác và đặt backlink | Hàng quý | Rocky duyệt trước outreach |
| `local-seo` | Đánh giá hiện diện Google Maps và Local Search | Hàng tháng | Không tự sửa live GBP |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Tạo campaign brief hoàn chỉnh cho chiến dịch Meta Ads mùa thu Hà Nội"* -> Kích hoạt `campaign-brief`
- *"Viết bài blog hướng dẫn thuê thợ chụp ảnh tại Hà Nội chuẩn SEO"* -> Kích hoạt `content-writing`
- *"Biên tập lại bài viết này bằng humanizer để đọc tự nhiên hơn"* -> Kích hoạt `humanizer`
- *"Nghiên cứu từ khóa du lịch Hà Nội tự túc cho khách phương Tây"* -> Kích hoạt `keyword-research`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Marketing-Growth/README.md](../../../../Marketing-Growth/README.md)
- [Brand-Strategy/Source-Of-Truth-Map.md](../../../../Brand-Strategy/Source-Of-Truth-Map.md)
- [Technology-Automation/Runbooks/OpenSEO-Runbook.md](../../../../Technology-Automation/Runbooks/OpenSEO-Runbook.md)

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Chiến dịch: `Marketing-Growth/Campaigns/CMP-YYYYMM-SLUG/`
- Bài viết Draft: `Marketing-Growth/Content/Drafts/`
- Cụm từ khóa: `Marketing-Growth/Content/Clusters/`
- Kế hoạch: `Marketing-Growth/Plans/`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Phê duyệt ngân sách quảng cáo và kế hoạch chi tiêu hàng tháng.
- [ ] Xuất bản bài viết lên website chính thức hoặc các kênh social media.
- [ ] Gửi bất kỳ email hoặc tin nhắn đối ngoại nào tới đối tác/khách hàng.
- [ ] Cập nhật thông tin thực thể trên Google Business Profile.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
campaign-brief
  -> keyword-research hoặc content-learning
  -> content-writing
  -> humanizer
  -> creative-production-qa (Creative)
  -> Rocky Phê Duyệt
  -> Publish & Chạy Ads
  -> campaign-performance-report (Data)
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Dùng `campaign-brief` khởi tạo `CMP-202610-AUTUMN-HANOI` với mục tiêu 50 bookings.
2. Dùng `keyword-research` và `keyword-clustering` xác định cụm từ khóa "hanoi photographer".
3. Dùng `content-writing` soạn bài viết theo brief, chuyển qua `humanizer` gọt giũa văn phong.
4. Gửi sang Creative Production để kiểm định hình ảnh bằng `creative-production-qa`.
5. Trình Rocky phê duyệt trước khi lên lịch xuất bản.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Xuất bản không xin phép:** Đăng bài hoặc bật quảng cáo mà chưa có sự đồng ý của Rocky.
- **Thay đổi sự thật khi humanize:** Chỉnh sửa làm sai lệch thông tin gói dịch vụ, giá hoặc visa.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Bài viết đạt chuẩn SEO, không còn từ ngữ AI sáo rỗng.
- [ ] File brief có đủ 4 tài liệu thành phần.
- [ ] Không có liên kết hỏng (vượt qua `workspace:check`).
