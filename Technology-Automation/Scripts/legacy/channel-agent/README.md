# channel-agent scripts

Công cụ cho agent `channel-scout` (`.claude/agents/channel-scout.md`). Chạy độc lập được:

```bash
# 1. Download video (yt-dlp) → Research-Insights/Library/videos/<platform>/<run>/
Technology-Automation/Scripts/legacy/channel-agent/download.sh "https://www.tiktok.com/@user/video/123"

# 2. Lấy subtitle/transcript bằng whisper chạy cục bộ → Research-Insights/Library/transcripts/<name>-<run-stamp>/
Technology-Automation/Scripts/legacy/channel-agent/transcribe.sh Research-Insights/Library/videos/tiktok/.../video.mp4 medium   # hoặc small (nhanh hơn)

# Hoặc chỉ đích đến cụ thể (từ chối ghi đè nếu đã có transcript):
Technology-Automation/Scripts/legacy/channel-agent/transcribe.sh video.mp4 medium --output-dir Research-Insights/Library/transcripts/video-medium

# 3. Quét bài viết của một kênh qua Apify
Technology-Automation/Scripts/legacy/channel-agent/apify_scrape.py \
  --actor apify/instagram-profile-scraper \
  --input '{"usernames":["handle"],"resultsType":"posts","resultsLimit":30}' \
  --out Research-Insights/Library/channels/handle/instagram-posts.json
```

- Token Apify nằm trong `.env` ở gốc workspace (`APIFY_TOKEN=...`). Không đưa token vào ảnh chụp màn hình, log hay commit.
- Thư mục `Research-Insights/Library/` do script tự tạo. Kết quả phân tích lưu cạnh dữ liệu thô.
- Chỉ scrape nội dung công khai, dùng cho nghiên cứu tham khảo.