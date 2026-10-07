# Lịch Trình Hoạt Động Đăng Bài & Tương Tác Threads — TravelFrame
**Ngày phê duyệt / Khởi tạo:** 27/09/2026  
**Chủ quản:** Marketing-Growth & Technology-Automation  
**Tài khoản thực thi:** `@travelframe.vn` qua trình duyệt Orca  
**Căn cứ số liệu:** [Threads Insights Snapshot 27/09/2026](file:///home/side-studio/SIDEagency/travelframe.vn/Marketing-Growth/Content/Threads-All-Interactions-Log.md) (28.3K views, 22.3K viewers, đối tượng hoạt động cao điểm từ 13:00 - 16:00 các ngày Thứ Tư, Thứ Năm, Thứ Sáu và các buổi sáng 07:00 - 08:30).

---

## I. Lịch Trình Vận Hành Mẫu Trong Tuần (Weekly Master Schedule)

| Ngày | Khung giờ | Loại hoạt động | Chi tiết nội dung / Lệnh thực thi | Mục tiêu chiến lược |
|---|:---:|:---:|---|---|
| **Thứ Hai** | **07:30** | **Đăng bài Feed** | **Bài 1:** Mùa thu Hà Nội và cú "nghi ngờ nhân sinh" lúc 6:00 sáng | Khởi đầu tuần bằng năng lượng visual trong trẻo, chân thật |
| | 12:00 | Bot dạo | `node threads_interact.mjs --mode feed --duration 15` | Đẩy sóng tương tác, kéo profile visit về Bài 1 |
| **Thứ Ba** | **11:45** | **Đăng bài Feed** | **Bài 5:** Luật ngầm bàn ghế nhựa: Ăn gì ở phố cổ để không bị "dắt mũi"? | Bắt trúng tâm lý tìm kiếm quán ăn trưa ngõ nhỏ, kích thích lưu bài (Save) |
| | 13:30 | Bot dạo | `node threads_interact.mjs --mode search --query "hanoi food" --duration 15` | Nhắm tệp người dùng đang hỏi địa điểm ăn uống |
| **Thứ Tư** | 13:00 | Bot dạo cao điểm | `node threads_interact.mjs --mode feed --duration 20` | Khung giờ vàng 1.8K viewers lướt feed giữa tuần |
| | **20:30** | **Đăng bài Feed** | **Bài 4:** Đi du lịch một mình thì ai chụp ảnh cho? (Solo Struggle) | Khung giờ tâm sự buổi tối; kết nối tự nhiên sang dịch vụ Photo Tour |
| **Thứ Năm** | **07:30** | **Đăng bài Feed** | **Bài 2:** Triết lý qua đường Hà Nội cho team hướng nội & solo travel | Chữa lành, giải tỏa nỗi lo giao thông cho du khách |
| | 13:30 | Bot dạo cao điểm | `node threads_interact.mjs --mode feed --duration 30` | **Đỉnh lưu lượng trong tuần** (3.3K viewers); quét sâu multi-comments & leads |
| **Thứ Sáu** | **11:45** | **Đăng bài Feed** | **Bài 3:** "Plot twist" của những chiếc lịch trình 7 ngày 5 tỉnh | Đánh trúng thời điểm chuẩn bị cuối tuần; tư vấn nhịp sống chậm |
| | 14:00 | Bot dạo cao điểm | `node threads_interact.mjs --mode search --query "photo tour" --duration 15` | Săn tìm khách hàng tiềm năng lên kế hoạch đi chụp ảnh cuối tuần |
| **Thứ Bảy** | **07:30** | **Đăng bài Feed** | **Bài 6:** Đừng lên Tây Bắc chỉ vì mùa lúa chín (Khói lam chiều 5:30 AM) | Khơi dậy cảm hứng khám phá thiên nhiên, sương sớm bản làng |
| | 15:00 | Bot dạo | `node threads_interact.mjs --mode feed --duration 15` | Duy trì hiện diện ngày cuối tuần |
| **Chủ Nhật** | **08:00** | **Đăng bài Feed** | **Bài 7 (Song ngữ):** Why Hanoi hits completely different before 7:00 AM | Tiếp cận khách quốc tế, expat và creator du lịch |
| | 20:30 | Audit & Ledger | Đánh giá phản hồi, cập nhật `Threads-Outcome-Tracking.md` | Đo lường follower mới, lượt reach và tỷ lệ chuyển đổi |

---

## II. Bộ Công Cụ Tự Động Hóa Thực Thi Trên Trình Duyệt Orca

Hệ thống đã được tích hợp sẵn 2 công cụ cốt lõi trong `.agents/skills/threads-engagement/scripts/`:

### 1. Công cụ đăng bài tự động: `threads_post.mjs`
- **Chế độ kiểm tra an toàn (Dry Run — Khuyên dùng trước khi post thật):**
  ```bash
  # Mở composer, tự động trích xuất bài từ Calendar, điền nội dung kiểm tra và đóng lại an toàn
  node .agents/skills/threads-engagement/scripts/threads_post.mjs --post-id 1 --dry-run
  ```
- **Chế độ đăng bài trực tiếp (Live Confirm):**
  ```bash
  # Đăng trực tiếp Bài 1 lên Feed cá nhân và ghi sổ cái
  node .agents/skills/threads-engagement/scripts/threads_post.mjs --post-id 1 --confirm
  ```
- **Đăng nội dung tùy chỉnh:**
  ```bash
  node .agents/skills/threads-engagement/scripts/threads_post.mjs --text "Nội dung bài viết mới..." --confirm
  ```

### 2. Công cụ tương tác & quét cộng đồng: `threads_interact.mjs`
- **Chạy phiên lướt Feed tự nhiên (15 hoặc 30 phút):**
  ```bash
  node .agents/skills/threads-engagement/scripts/threads_interact.mjs --mode feed --duration 15
  ```
- **Chạy phiên tìm kiếm theo từ khóa mục tiêu:**
  ```bash
  node .agents/skills/threads-engagement/scripts/threads_interact.mjs --mode search --query "photo tour" --duration 15
  ```

---

## III. Hướng Dẫn Tự Động Hóa Lịch Hẹn Giờ

Để đặt lịch hẹn giờ tự động thực thi các tác vụ này trong tương lai, bạn có thể:
1. **Sử dụng Slash Command `/schedule`:**  
   Ví dụ: Nhập `/schedule` và yêu cầu: *"Chạy đăng Bài 1 vào lúc 07:30 sáng mai"* hoặc *"Chạy phiên tương tác lướt feed 15 phút vào 13:30 chiều nay"*.
2. **Kích hoạt thủ công theo nhu cầu:** Bất cứ khi nào sẵn sàng lên sóng, bạn chỉ cần báo: *"Đăng Bài X lên Threads qua Orca"*, agent sẽ kiểm tra snapshot và bấm đăng ngay lập tức.
