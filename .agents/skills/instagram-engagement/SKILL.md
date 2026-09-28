---
name: instagram-engagement
description: Use when interacting with Instagram Reels and Explore posts for TravelFrame (@travelframe.vn) via Orca browser, executing natural likes and value-first comments, applying 4-tier safety filtering, 5-angle psychological rotation, anti-spam pacing, and updating interaction logs.
---

# instagram-engagement

Kỹ năng điều khiển và tự động hóa hoạt động tương tác cộng đồng trên Instagram Reels & Explore cho TravelFrame (`@travelframe.vn`), tích hợp mô hình phân loại nội dung **JEV** (`jev-latest`) và bộ lọc bài viết có lượt tương tác cao.

## Purpose

Kỹ năng này phục vụ việc xây dựng hiện diện thương hiệu tự nhiên và ấm áp của TravelFrame trên Instagram, tiếp cận cộng đồng travel creators và du khách tiềm năng, ưu tiên các video có lượng tương tác cao (High Engagement) và dùng mô hình JEV thẩm định độ phù hợp chủ đề du lịch visual trước khi tương tác.

## Read First

Trước khi thực thi kỹ năng, bắt buộc phải đọc và nắm vững các tài liệu sau:
- [Marketing-Growth/Agents/Instagram-Engagement-Agent.md](../../../Marketing-Growth/Agents/Instagram-Engagement-Agent.md)
- [Technology-Automation/Runbooks/DES-20260925-JEV-CONTENT-CLASSIFIER.md](../../../Technology-Automation/Runbooks/DES-20260925-JEV-CONTENT-CLASSIFIER.md)
- [Research-Insights/Library/knowledge/2026-09-genz-travel-slang-trends.md](../../../Research-Insights/Library/knowledge/2026-09-genz-travel-slang-trends.md)
- [Marketing-Growth/Content/Instagram-All-Interactions-Log.md](../../../Marketing-Growth/Content/Instagram-All-Interactions-Log.md)
- [references/playbook.md](references/playbook.md)

## Inputs

- **Phiên trình duyệt Orca:** Tab Instagram (`https://www.instagram.com/reels/`) đang đăng nhập tài khoản `@travelframe.vn`.
- **Chế độ chạy (`--mode`):**
  - `reels`: Lướt bảng tin Reels liên tục theo cơ chế cuộn `ArrowDown`.
  - `search`: Khám phá và tương tác theo hashtag hoặc từ khóa (ví dụ `#hanoitravel`, `#vietnamtravel`).
  - `single`: Tương tác đích danh vào một URL bài viết hoặc Reel cụ thể.
- **Thời lượng phiên (`--duration`):** Số phút chạy của phiên (mặc định 15 hoặc 30 phút).
- **Bộ lọc tương tác cao (High Engagement Filter):**
  - `--min-likes <n>`: Ngưỡng like tối thiểu của Reel (mặc định 50 likes).
  - `--min-comments <n>`: Ngưỡng comment tối thiểu của Reel (mặc định 2 comments).
- **Phân loại bằng JEV (`jev-latest`):** Chạy tự động qua `typesafe_content_classifier.mjs` để xác thực `content_relevance`, `topic` và `lead_signal`.

## Workflow

### Bước 1: Khởi động & Nhận diện Tab Trình duyệt
- Tra cứu ID tab Instagram đang hoạt động trong Orca qua `orca tab list --json`.
- Nạp danh sách các URL và tài khoản đã tương tác từ sổ nhật ký để chống trùng lặp.

### Bước 2: Quét DOM & Thẩm Định Lượt Tương Tác Cao (High Engagement Gate)
- Đọc thông số `likesCount`, `commentsCount`, `sharesCount` từ cột hành động bên cạnh Reel.
- Nếu Reel có lượt tương tác dưới ngưỡng tối thiểu (`likesCount < minLikes` và `commentsCount < minComments`), tự động bỏ qua (`skip`) và trượt sang Reel tiếp theo để tối ưu hóa hiệu quả hiển thị của thương hiệu.

### Bước 3: Sàng Lọc An Toàn & Quét Nội Dung Bằng Mô Hình JEV (`jev-latest`)
- **Tầng 1 (Blacklist loại trừ tuyệt đối):** Bỏ qua ngay các bài viết dính drama, tài chính làm giàu, crypto, affiliate, cờ bạc hoặc các bài viết chạy quảng cáo tài trợ (`Sponsored / Ad`).
- **Phân loại bằng JEV (Hybrid Scan Pipeline):**
  - Gửi payload thông tin Reel (caption, audio, context) qua kịch bản `typesafe_content_classifier.mjs` sử dụng model `jev-latest`.
  - Nhận diện 4 câu trả lời có cấu trúc:
    1. `content_relevance`: Phải là `relevant` (đúng chủ đề du lịch Việt Nam, Hà Nội, vùng cao, visual photo tour, solo trip). Nếu JEV xác định `not_relevant` với độ tin cậy cao, Agent tự động bỏ qua.
    2. `topic`: Gán nhãn chủ đề chính xác (`hanoi_autumn`, `street_food`, `photo_tour`, `mountain_views`, `solo_travel`, `en_photo`, `en_solo`, `en_itinerary`, `international_vietnam`).
    3. `lead_signal`: Phát hiện tín hiệu hỏi giá, tìm thợ chụp hoặc nhờ tư vấn tour để gắn cờ High-Intent Lead.
    4. `season_claim`: Đối chiếu đặc thù mùa vụ thực tế.

### Bước 4: Tạo Bình Luận Theo Topic Của JEV & Động Cơ Xoay Tua 5 Yếu Tố
- Dùng `topic` chuẩn xác từ JEV để chọn nhóm bình luận ngữ cảnh tương ứng.
- Luân phiên 5 góc tiếp cận tâm lý Gen Z:
  1. *Yêu thích (Adoration / Hype)*
  2. *Nghi ngờ (Skepticism / Reality Check)*
  3. *Tự hỏi (Wondering / Existential Thoughts)*
  4. *Tích cực (Pure Positivity / Healing)*
  5. *Clickbait / Plot Twist (Intrigue)*

### Bước 5: Thao Tác DOM & Điều Hướng No-Reload Trên Orca
1. Bấm nút **Like** (nếu video chưa like).
2. Bấm nút mở Drawer bình luận (**Comment**).
3. Focus vào ô nhập liệu (`input` / `div[role="textbox"]`).
4. Gửi nội dung bình luận bằng lệnh `orca type`.
5. Bấm nút **Post** để gửi bình luận.
6. Xác minh bình luận đã hiển thị và input đã được xóa sạch.
7. Đóng drawer bình luận bằng phím **Escape** (`orca keypress --key Escape`).
8. Chờ khoảng giãn cách an toàn **45s đến 75s** (Anti-Spam Pacing).
9. Chuyển sang Reel kế tiếp bằng phím **ArrowDown** (`orca keypress --key ArrowDown`).

### Bước 6: Ghi Nhật Ký Tự Động
- Ghi nhận chi tiết từng lượt tương tác thành công kèm nhãn topic và chỉ số tương tác vào [Marketing-Growth/Content/Instagram-All-Interactions-Log.md](../../../Marketing-Growth/Content/Instagram-All-Interactions-Log.md).

## Output

- Các lượt Like và Comment đàm thoại chất lượng cao, đúng ngữ cảnh trên Instagram.
- Sổ nhật ký tương tác [Instagram-All-Interactions-Log.md](../../../Marketing-Growth/Content/Instagram-All-Interactions-Log.md) được cập nhật liên tục với đầy đủ thông tin: STT, Giai đoạn, Tác giả, Link Reel, Loại tương tác, Nội dung bình luận.

## Approval Gates

- Các lượt tương tác thông thường trên Reels tuân thủ đúng Brand Voice và Pacing an toàn được tự động thực thi trong phiên.
- Khi gặp người dùng hỏi báo giá dịch vụ chụp ảnh cụ thể, đề xuất hợp tác tài trợ thương mại lớn hoặc có thắc mắc khiếu nại, Agent ghi nhận và escalate ngay cho nhân viên tư vấn/Rocky duyệt trước khi cam kết chính sách.

## Guardrails

- ⏱️ **Pacing an toàn bắt buộc:** Tuyệt đối giữ khoảng cách tối thiểu **45 giây đến 75 giây** giữa mỗi lần like hoặc bình luận để bảo vệ tài khoản khỏi hạn chế thuật toán của Meta.
- 🎯 **Ngưỡng tương tác cao:** Chỉ tương tác với các video có lượng tương tác từ cộng đồng (mặc định tối thiểu 50 likes hoặc 2 comments).
- 🧠 **Cổng chất lượng JEV:** Không tương tác khi mô hình JEV đánh giá video lệch chủ đề hoặc không phù hợp với định vị kênh.
- ❌ **CẤM tuyệt đối dùng dấu gạch ngang `-`** trong toàn bộ văn bản (thay bằng dấu phẩy, ba chấm `...`, ngoặc đơn hoặc tách câu tự nhiên).
- ❌ **CẤM đặt icon / emoji ở cuối câu một cách máy móc**: Phân bổ icon ngẫu nhiên ở giữa câu hoặc đặt cạnh từ khóa cảm xúc.
- ✅ **BẮT BUỘC đặt từ lóng (slang), từ nói lái, ẩn ý trong dấu ngoặc kép `""`**: `"chân ái"`, `"mê xỉu"`, `"đỉnh nóc kịch trần"`, `"10 điểm không có nhưng"`, `"chữa lành"`.
- ❌ **Không reload trang liên tục**: Bắt buộc dùng phím `ArrowDown` để trượt Reel kế tiếp, giữ nguyên trạng thái kết nối.

## Completion Criteria

- Hoàn thành phiên chạy theo thời lượng cấu hình hoặc số lượng tương tác mục tiêu.
- 100% video được tương tác phải thỏa mãn cả 2 điều kiện: đạt ngưỡng tương tác cao và được JEV thẩm định phù hợp kênh.
- Mọi tương tác phát sinh đều được đồng bộ đầy đủ vào file nhật ký `Instagram-All-Interactions-Log.md`.
