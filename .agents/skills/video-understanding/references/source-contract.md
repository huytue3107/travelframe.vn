# Hồ sơ nguồn (source.json) — hợp đồng bàn giao

## Luồng dữ liệu

```
channel-scout                         video-analyst (skill video-understanding)
  download.sh  → videos/<platform>/<run>/video.mp4 + info.json
  transcribe.sh→ transcripts/<name>-<run-stamp>/ srt/txt/json + provenance.json
  apify_scrape.py → channels/<handle>/posts.json (flat hoặc profile latestPosts)
                          │
                          ▼
              prepare_video.py  →  source.json   →  7 bước phân tích
```

- `channel-scout` chỉ bàn giao ĐƯỜNG DẪN. Không tải lại, không di chuyển thư viện cũ.
- `video-analyst` không quét kênh, không dùng token Apify.

## Cấu trúc source.json

| Trường | Ý nghĩa |
|---|---|
| `schema_version` | 1 |
| `video_key` | `<platform>/<native-id>` đã sanitize — đường dẫn phân tích |
| `platform`, `native_id` | Nguồn gốc; file local không ID → native_id = sha256[:16] |
| `source_url`, `author`, `source_upload_time` | Như metadata khai báo; không bịa ngày cho dữ liệu cũ |
| `media.fingerprint_sha256` | SHA-256 toàn file — cache/frame không hợp lệ khi đổi |
| `texts.post_caption` | Caption bài đăng, ghép theo **post ID hoặc canonical URL** |
| `texts.platform_subtitles` | Subtitle nền tảng (file local cạnh video) |
| `texts.asr_transcript` | Transcript whisper; `verified=true` khi có provenance.json |
| `texts.on_screen_text` | Bắt đầu `pending_frames`, điền sau bước 4-5 |
| `missing[]`, `unverified[]` | Phạm vi kết luận phụ thuộc vào đây |

## Quy tắc ghép caption (bắt buộc)

1. Chỉ khớp **native ID** (các key `id`, `code`, `videoId`...) hoặc **canonical URL**
   (host lowercase, bỏ `www.`, giữ query — YouTube ID nằm ở `?v=`).
2. Hỗ trợ cả dataset phẳng (`[{post}, ...]`) lẫn profile (`[{profile, latestPosts:[...]}]`).
3. NHIỀU record khớp caption khác nhau → `unverified`, không đoán.
4. Cấm: khớp theo tiêu đề gần giống, vị trí mảng, thời gian file.
5. Caption bài đăng / subtitle nền tảng / ASR / chữ màn hình là 4 loại riêng.

## Provenance transcript (transcribe.sh)

Mỗi lần transcribe tạo 1 thư mục `transcripts/<name>-<runstamp>/` với
`provenance.json`: `{video.path, video.fingerprint_sha256, transcript.source,
engine, model, language}`. SRT cũ trong `transcripts/video/` KHÔNG có provenance →
prepare_video đánh dấu `unverified`; skill phải hỏi user hoặc transcribe lại,
không tự gán cho video nào.

## An toàn script

- Subprocess chỉ chạy qua argv list, không `shell=True`.
- Không nhận URL/protocol từ metadata để thực thi; không đọc `.env`; không cài package.
