# Data contract — field mapping + caveats

## Instagram (Apify instagram-profile-scraper) — đã xác minh với data thật

**Profile level** (trong wrapper dict có `latestPosts`):
`username`, `followersCount` (snapshot tại lúc scrape), `postsCount`, `biography`

**Post:**
| Field (JSON) | metrics.py | Ghi chú |
|---|---|---|
| `likesCount` | likes | |
| `commentsCount` | comments | |
| `videoViewCount` | views | CHỈ type=Video |
| `type` | type | Image \| Video \| Sidecar |
| `timestamp` | timestamp | ISO 8601 UTC |
| `isPinned` | is_pinned | méo average → tính cả without-pinned |
| `isCommentsDisabled` | comments_disabled | CTA comment vô hiệu |
| `shortCode`, `url` | id nhận diện | |
| `caption`, `hashtags`, `mentions` | craft analysis | |
| `childPosts` | child_posts (đếm) | KHÔNG cộng likes con vào cha (trùng lặp không xác định) |

## TikTok (clockworks/tiktok-scraper) — CHƯA có dữ liệu mẫu

Kỳ vọng: `playCount`, `diggCount`, `commentCount`, `shareCount`, `collectCount`,
`createTime`. **Phải probe runtime**: chạy metrics 1 lần, field nào không có →
missing; không đoán tên field thay thế. Xác nhận schema bằng 1 lần scrape mẫu trước
khi tin output.

## YouTube — chưa có dữ liệu mẫu

yt-dlp flat: `view_count`, `like_count` (không có comment); Apify youtube-scraper:
`viewCount`, `likeCount`, `commentsCount` kỳ vọng. Cùng quy tắc probe runtime.

## Metric definitions (định nghĩa duy nhất — script là nguồn sự thật)

- `engagement = likes + comments`
- `er = engagement / followersCount` — **xấp xỉ**: followers là snapshot hiện tại,
  không phải tại thời điểm post
- `rel_er = er / median_er (loại pinned)` — so post với median kênh; loại pinned để
  tránh post ghim kéo median
- `views`: chỉ Video; ER theo views chỉ áp dụng khi views có
- Cadence: từ timestamps (posts/week = n/span_days×7; gap trung vị)

## Caveats bắt buộc trong mọi report

1. followers snapshot → ER là xấp xỉ hướng, không phải giá trị chính xác tại post
2. isPinned làm méo median/mean → luôn nêu cả with/without pinned
3. Sample <10 → flag `small sample` (script tự thêm)
4. Image/Sidecar không views → so sánh format theo likes/ER, không theo views
5. Mtime file = mốc "dữ liệu cũ tới", không phải ngày scrape thật
6. Spot-check IG chỉ so được bậc độ lớn (IG hiển thị "1.2M")

## Missing policy

Field không có trong record → `null` + `missing_fields[]` (script tự ghi). Report
KHÔNG được nhắc giá trị null trong kết luận; nếu missing ảnh hưởng kết luận → ghi vào
`partial`/`blocked`.
