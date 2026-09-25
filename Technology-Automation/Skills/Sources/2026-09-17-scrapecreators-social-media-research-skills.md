# Source Audit Record: ScrapeCreators Social Media Research Skills

- **Mã hồ sơ:** `AUD-20260917-SCRAPECREATORS-SOCIAL-SKILLS`
- **URL nguồn:** `https://github.com/scrapecreators/social-media-research-skills`
- **Commit hash / Version:** `64ba7b4dea71e130d2712ffb6c1c1024b3b7c4b2`
- **Ngày kiểm tra:** 2026-09-17
- **Người đánh giá:** Technology-Automation Lead & Marketing-Growth Lead
- **Phân loại:** `adopt` (Bộ công cụ Agent Skills nghiên cứu mạng xã hội cho Marketing & Research)

---

## 1. Thông Tin Giấy Phép (License Information)
- **Loại giấy phép:** MIT License
- **Vị trí file LICENSE:** `https://github.com/scrapecreators/social-media-research-skills/blob/main/LICENSE`
- **Yêu cầu ghi nhận quyền tác giả (Attribution):** Có (ScrapeCreators - https://scrapecreators.com). Giữ nguyên metadata và thông tin bản quyền trong file SKILL.md.

---

## 2. Phạm Vi & Tập Tin Khảo Sát (Inspected Scope)
13 kỹ năng Agent Skills chuẩn spec:
1. `ad-library-teardown`: Bóc tách quảng cáo đang chạy trên Meta, Google, LinkedIn.
2. `audience-research`: Đánh giá tệp khán giả, nhân khẩu học, độ phù hợp tài khoản/nhãn hàng.
3. `comment-mining`: Khai thác bình luận tìm nỗi đau, phản đối, câu hỏi và ngôn ngữ khách hàng (VOC).
4. `competitor-social-research`: Nghiên cứu chiến lược đa kênh của đối thủ cạnh tranh.
5. `content-repurposing`: Tái cấu trúc video/transcript thành carousel, thread, kịch bản ngắn.
6. `creator-profile-teardown`: Phân tích định vị, trụ cột nội dung và công thức thành công của creator.
7. `influencer-prospecting`: Lọc danh sách influencer/creator tiềm năng theo ngách kèm điểm fit.
8. `outlier-post-finder`: Tìm bài viết đột biến (viral outlier) vượt baseline của kênh.
9. `product-demand-research`: Thẩm định nhu cầu sản phẩm, tìm kiếm tín hiệu thị trường từ mạng xã hội.
10. `scrapecreators-api`: Tầng kết nối REST API tra cứu 110+ endpoints trên 27+ nền tảng mạng xã hội.
11. `social-listening-brief`: Lập báo cáo lắng nghe xã hội đa kênh theo chủ đề/thương hiệu.
12. `transcript-intelligence`: Bóc tách transcript video, trích xuất hook, ý tưởng và trích dẫn.
13. `trend-discovery`: Khám phá xu hướng, hashtag, âm thanh và format mới nổi.

---

## 3. Đánh Giá Rủi Ro Kỹ Thuật & Pháp Lý (Risk Assessment)
- **Rủi ro bản quyền:** Thấp (MIT License cho phép sử dụng thương mại, sửa đổi, phân phối tự do).
- **Rủi ro bảo mật / Quyền hạn:**
  - Kỹ năng là dạng tài liệu hướng dẫn agent (Agent Skill Prompt) kèm các API call dạng HTTP GET qua ScrapeCreators.
  - Cần biến môi trường `SCRAPECREATORS_API_KEY` khi gọi live API. Tuân thủ tuyệt đối quy tắc bảo mật của TravelFrame: KHÔNG in, không log, không commit token/key vào code hay tài liệu.
  - Mọi thao tác tải dữ liệu công khai chỉ mang tính chất thu thập thông tin nghiên cứu (Read/Research).
- **Tính phù hợp với Company OS:**
  - Hoàn toàn tương thích với kiến trúc `.agents/skills/` và deployment mirror `.claude/skills/`.
  - Phục vụ trực tiếp cho phòng ban Marketing-Growth (chiến dịch, phân tích ad library, ý tưởng nội dung) và Research-Insights (phân tích kênh, bóc tách video).
  - Không phá vỡ approval gates: Kỹ năng chỉ xuất bản artifact phân tích nội bộ, không tự ý đăng bài hay gửi tin nhắn ra ngoài.

---

## 4. Quyết Định & Biện Pháp Xử Lý
- **Quyết định cuối cùng:** `adopt`
- **Phương thức cài đặt:** Sử dụng `npx skills add "https://github.com/scrapecreators/social-media-research-skills" -a claude-code codex antigravity --skill '*' -y` lưu vào `.agents/skills/` và symlink mirror sang `.claude/skills/`.
- **Cổng phê duyệt:** Giữ nguyên quy định Company OS: Rocky phê duyệt trước khi Publish bất kỳ nội dung nào được tạo từ các nghiên cứu này.
