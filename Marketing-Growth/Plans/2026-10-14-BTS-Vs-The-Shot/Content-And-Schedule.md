# TravelFrame — BTS vs The Shot: Content & lịch đăng

- Owner: Marketing-Growth
- Ngày chuẩn bị: 2026-10-14
- Kênh: Facebook Page travelframe.vn (1409099405611405), Instagram @travelframe.vn (17841438272497512)
- Múi giờ mục tiêu: Asia/Ho_Chi_Minh, UTC+7. Meta hiển thị Asia/Jakarta, cũng UTC+7.
- Scope được Rocky yêu cầu trong chat: xem 5 video, viết content đúng format, setup mỗi ngày 20:00 từ ngày mai; Rocky xác nhận Facebook và Instagram.
- Source: /Users/macbook/Downloads/1006(3), 5 MP4.
- Khung 19:00 ngày 15–17/10 có bài cũ. Batch này dùng 20:00, không thay đổi các bài cũ.

## Lịch

Mỗi hàng là một video, đăng đồng thời trên hai kênh.

| Video | Ngày | Giờ Việt Nam | Góc nội dung | Content | Platform status |
|---|---|---|---|---|---|
| 1 | 2026-10-15 | 20:00 | Góc phố, ánh đèn và chân dung ban đêm | [Caption](../../Content/Drafts/2026-10-15-bts-night-street-portrait/caption.md) | Scheduled — Facebook + Instagram |
| 2 | 2026-10-16 | 20:00 | Chuyển góc máy, hậu cảnh thành phố chuyển động | [Caption](../../Content/Drafts/2026-10-16-bts-city-in-motion/caption.md) | Scheduled — Facebook + Instagram |
| 3 | 2026-10-17 | 20:00 | Tản bộ, trò chuyện và tạo dáng thoải mái | [Caption](../../Content/Drafts/2026-10-17-bts-wander-and-create/caption.md) | Scheduled — Facebook + Instagram |
| 4 | 2026-10-18 | 20:00 | Flare và thử góc chụp ban đêm | [Caption](../../Content/Drafts/2026-10-18-bts-flare-and-night-lights/caption.md) | Scheduled — Facebook + Instagram |
| 5 | 2026-10-19 | 20:00 | Hồ Hoàn Kiếm, bóng người và ánh đèn phản chiếu | [Caption](../../Content/Drafts/2026-10-19-bts-hoan-kiem-silhouettes/caption.md) | Scheduled — Facebook + Instagram |

## Format content

[Đọc toàn bộ 5 caption](Full-Captions.md).

Caption tiếng Anh: hook → chi tiết khớp video → tip ngắn khi phù hợp → save/send + keyword PHOTO/tháng đi → dòng ký tên TravelFrame → 5 hashtag.

PHOTO trong batch chỉ mời người xem chia sẻ kế hoạch. Không hứa guide, báo giá hoặc DM tự động chưa được thiết lập.

Video giữ chữ BTS vs The Shot và subtitle gốc. Bản tải lên dọc 1080×1920 H.264/AAC, 30fps; giữ thời lượng, hình và âm thanh. Source gốc 8K HEVC không bị chỉnh sửa. [Manifest media](../../../Creative-Production/Deliverables/2026-10-14-BTS-Vs-The-Shot/manifest.json).

## Kiểm tra và giới hạn

- 5 caption + 5 mapping Reel: checker PASS; [kết quả](content-checks.json).
- Đã đọc tổng 126 khung hình qua main/focused contact sheets, gồm mở đầu và kết thúc. Transcript local Whisper có provenance nhưng sai/thiếu lời ở vài clip; content dựa vào hình và chữ màn hình, không trích ASR sai.
- npm test: 158/158 PASS.
- npm run test:skills: 15/15 PASS.
- workspace:check còn lỗi có sẵn ngoài batch: link report đã bị xóa, link ví dụ trong skills và legacy absolute paths trong settings/scratch. Link/file của batch đã sửa và kiểm tra.
- Seed comments đã soạn cho cả 5 bài, lưu cạnh caption; chưa gửi và chưa tạo automation. Đây là bước sau khi bài thực sự publish.

## Bằng chứng

Ảnh xác nhận Meta trong [evidence](evidence/). Status Scheduled chỉ xác nhận lịch, không coi là Published trước ngày giờ đăng.

