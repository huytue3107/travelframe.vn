# Runbook: OpenReply Platform & Instagram Comment-to-DM Engine

## 1. Tổng Quan

OpenReply là nền tảng tự lưu trữ (self-hosted), mã nguồn mở thay thế trực tiếp tính năng Comment-to-DM và Story Reply của ManyChat ($15+/tháng) cho TravelFrame (`@travelframe.vn`). 

- **Vị trí mã nguồn:** `Technology-Automation/Tools/openreply`
- **Bộ phận kỹ thuật quản lý:** `Technology-Automation/` (hạ tầng Docker, PostgreSQL, Redis, Worker, Webhook)
- **Bộ phận khai thác kinh doanh:**
  - `Marketing-Growth/`: Phát hành lead magnet (Lookbook, bản đồ photo walk, lịch trình Hà Nội/Tây Bắc) qua bình luận trên Instagram Reels/Posts/Stories.
  - `Sales-CRM/`: Thu thập lead tự động, nuôi dưỡng quan tâm, điều hướng sang kênh tư vấn 1-1.
- **Tuân thủ chính sách Meta:** Hoạt động 100% qua Instagram Graph API chính thức (Private Replies & Direct Messages), không dùng browser scraping trái phép, tôn trọng khung 24h và giới hạn tốc độ 750 private replies/giờ của Meta.

---

## 2. Kiến Trúc & Luồng Dữ Liệu (Architecture)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TravelFrame Company OS                          │
│                                                                        │
│   Khách hàng tương tác trên Instagram (@travelframe.vn)                │
│   (Bình luận Reel/Post, Reply Story, hoặc gửi Direct Message)           │
│                                   │                                    │
│                                   ▼                                    │
│   Meta Webhook Event (POST https://your-domain/api/webhooks/instagram) │
│                                   │                                    │
│   ┌───────────────────────────────┴────────────────────────────────┐   │
│   │               OpenReply Web App (Next.js 16)                   │   │
│   │  • Xác thực webhook signature & verify token                   │   │
│   │  • Đối soát từ khóa kích hoạt (Keyword Engine)                 │   │
│   │  • Đưa tác vụ gửi tin vào hàng đợi BullMQ                      │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│                 ┌─────────────────┴─────────────────┐                  │
│                 ▼                                   ▼                  │
│         [PostgreSQL Database]               [Redis + BullMQ]           │
│        (Lưu tài khoản, chiến dịch,          (Hàng đợi gửi tin,         │
│         nhật ký DM, click CTR)               rate limiting 750/h)      │
│                                                     │                  │
│                                                     ▼                  │
│                                   ┌────────────────────────────────┐   │
│                                   │  Background Worker (Node.js)   │   │
│                                   │  • Đọc hàng đợi gửi tin        │   │
│                                   │  • Gửi Public Comment Reply    │   │
│                                   │  • Gửi Private Message (DM)    │   │
│                                   │  • Kiểm tra Follow Gate        │   │
│                                   └────────────────────────────────┘   │
│                                                     │                  │
│                                                     ▼                  │
│                                      Khách nhận DM tài liệu & link     │
│                                      tự động sau 1-3 giây!             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Các Tính Năng Cốt Lõi Cho TravelFrame

1. **Keyword-to-DM (Khớp từ khóa thông minh):**
   - Hỗ trợ so khớp chính xác từng từ hoặc một phần (partial / exact match).
   - Cho phép nhiều từ khóa cho cùng 1 chiến dịch (ví dụ: `hanoi`, `lịch trình`, `báo giá`, `photo tour`).
2. **Follow Gate (Khóa theo dõi tăng trưởng kênh):**
   - Tự động kiểm tra khách đã follow `@travelframe.vn` chưa qua cờ `is_user_follow_business`.
   - Nếu chưa follow: DM lịch sự mời follow rồi bấm nút nhận tài liệu.
   - Cơ chế Fail-open: Nếu Meta API không trả về trạng thái follow, hệ thống tự động gửi link để khách không bị kẹt.
3. **Public Reply + Private DM:**
   - Trả lời công khai trên comment của khách (tăng tương tác và đẩy thuật toán Reel).
   - Đồng thời gửi riêng qua hộp thư Direct Message.
4. **Tracked Links & 2 Nút Bấm:**
   - Gắn tối đa 2 nút bấm chuyển hướng có đo lường lượt click (CTR) trong 1 tin nhắn.
   - Tích hợp trực tiếp với landing page booking hoặc trang tư vấn gói tour của TravelFrame.
5. **Hộp Thư Đăng Nhập (Inbox Dashboard):**
   - Đọc và trả lời tin nhắn trực tiếp từ dashboard trong khung thời gian 24h của Meta.

---

## 4. Hướng Dẫn Vận Hành Môi Trường Local

Mã nguồn OpenReply đã được cài đặt đầy đủ tại thư mục:
`Technology-Automation/Tools/openreply/`

### Bước 1: Khởi động cơ sở dữ liệu PostgreSQL & Redis

Sử dụng Docker Compose có sẵn trong thư mục công cụ:
```bash
docker compose -f Technology-Automation/Tools/openreply/docker-compose.yml up -d
```
Kiểm tra trạng thái container:
```bash
docker compose -f Technology-Automation/Tools/openreply/docker-compose.yml ps
```

### Bước 2: Thiết lập file môi trường `.env`

Tạo file `.env` từ `.env.example`:
```bash
cd Technology-Automation/Tools/openreply
cp .env.example .env
```

Điền các giá trị bảo mật:
- `NEXTAUTH_SECRET`: Tạo bằng lệnh `openssl rand -base64 32`
- `CRON_SECRET`: Tạo bằng lệnh `openssl rand -base64 32`
- `ENCRYPTION_KEY`: Tạo bằng lệnh `openssl rand -hex 32` (chuỗi 64 ký tự hex)
- `DATABASE_URL`: `postgresql://postgres:postgres@localhost:5432/openreply`
- `REDIS_URL`: `redis://localhost:6379`
- `RESEND_API_KEY`: Khóa API từ [Resend.com](https://resend.com) (dùng để đăng nhập qua email magic-link). Nếu dùng mail server riêng, cấu hình biến `EMAIL_SERVER`.

### Bước 3: Chạy Database Migration

Áp dụng cấu trúc bảng dữ liệu vào PostgreSQL:
```bash
cd Technology-Automation/Tools/openreply
npm run db:migrate
```

### Bước 4: Khởi động Web App và Background Worker

OpenReply yêu cầu **2 tiến trình** chạy song song:

* **Tiến trình 1: Web App & Webhook Receiver**
  ```bash
  cd Technology-Automation/Tools/openreply
  npm run dev
  ```
  Truy cập giao diện quản trị tại: `http://localhost:3000`

* **Tiến trình 2: Background Worker (Gửi tin nhắn)**
  ```bash
  cd Technology-Automation/Tools/openreply
  npm run worker
  ```
  *(Lưu ý: Nếu không bật worker, các sự kiện webhook vẫn nhận nhưng tin nhắn DM sẽ không được gửi đi).*

---

## 5. Kết Nối Instagram `@travelframe.vn` & Đưa Vào Hoạt Động

### Bước 1: Chuẩn bị tài khoản Instagram
1. Đảm bảo tài khoản `@travelframe.vn` là tài khoản **Instagram Business** hoặc **Creator**.
2. Liên kết tài khoản Instagram với Trang Facebook (Facebook Page) của TravelFrame.

### Bước 2: Tạo Meta Developer App
1. Truy cập [developers.facebook.com](https://developers.facebook.com/) $\rightarrow$ Create App $\rightarrow$ chọn loại **Business**.
2. Thêm sản phẩm **Instagram Graph API** và **Webhooks**.
3. Cấp các quyền (Permissions):
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_messages`
   - `pages_manage_metadata`
   - `pages_read_engagement`
4. Lấy `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`, `FACEBOOK_APP_SECRET` và điền vào `.env`.

### Bước 3: Cấu hình Webhook URL
Vì Meta yêu cầu endpoint công khai có HTTPS, khi chạy local có thể dùng Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:3000
```
Sau đó vào Meta Developer App:
- **Callback URL:** `https://<tunnel-domain>/api/webhooks/instagram`
- **Verify Token:** Trùng khớp với giá trị `WEBHOOK_VERIFY_TOKEN` trong `.env`.
- **Subscribe Fields:** `comments`, `messages`.

---

## 6. Kịch Bản Mẫu Triển Khai Cho TravelFrame

| Mã chiến dịch | Kênh / Nội dung bài | Từ khóa kích hoạt | Phản hồi công khai (Public Comment) | Tin nhắn riêng (Private DM) | Nút hành động (Link Button) |
|---|---|---|---|---|---|
| **CAMP-HN-AUTUMN** | Reel mùa thu Hà Nội / Phan Đình Phùng | `LICH TRINH`, `HANOI`, `THU` | "Check tin nhắn nhé bồ ơi, TravelFrame vừa gửi trọn bộ bí kíp rồi nè ✨!" | "Chào {username}! Cảm ơn bạn đã quan tâm. Mình gửi bạn bản đồ 48H Photo Walk ngắm bình minh và check-in các góc phố cổ không dính người nhé 🍂." | **[Mở Bản Đồ & Lịch Trình]** $\rightarrow$ Link bài viết blog / PDF |
| **CAMP-PHOTO-TOUR** | Post / Reel bộ ảnh khách chụp tại phố cổ & ga tàu | `BAO GIA`, `TOUR`, `CHUP ANH` | "TravelFrame vừa nhắn bạn chi tiết các gói chụp kèm lookbook rồi nha 📸" | "Chào {username}! Đây là Lookbook tổng hợp các concept chụp ảnh ngoại cảnh độc quyền cùng bảng giá chi tiết của TravelFrame nè." | 1. **[Xem Lookbook 2026]**<br>2. **[Nhắn tư vấn viên 1-1]** |
| **CAMP-STORY-VOUCHER** | Story thông báo ưu đãi đặt tour sớm | `UU DAI`, `VOUCHER`, `PROMO` | *(Không có do Story)* | "Ưu đãi đặc biệt giảm 15% cho khách hàng đặt lịch photo tour trong tuần này đã sẵn sàng cho bạn!" | **[Nhận Mã Ưu Đãi]** $\rightarrow$ Trang booking |

---

## 7. Giám Sát & Khắc Phục Sự Cố (Troubleshooting)

1. **Bình luận nhận nhưng không có DM gửi đi:**
   - Kiểm tra xem tiến trình `npm run worker` có đang chạy hay không.
   - Kiểm tra kết nối Redis (`REDIS_URL`) trong cả web app và worker.
   - Kiểm tra `ENCRYPTION_KEY`: Web app và Worker phải sử dụng chung 1 khóa mã hóa.
2. **Khách phản hồi sau 24h:**
   - Meta giới hạn cửa sổ nhắn tin trong 24h kể từ khi khách tương tác lần cuối. OpenReply sẽ ghi nhận vào DM Log với trạng thái `outside_window`.
3. **Chạm giới hạn tốc độ (Rate Limit):**
   - BullMQ tự động điều tiết để không vượt quá trần 750 private replies/giờ của Meta. Các yêu cầu vượt quá sẽ nằm trong hàng đợi chờ lượt gửi tiếp theo.
