# Nguồn upstream đã vendor — bradautomates/claude-video

## Những gì được vendor

| File | Nguồn | SHA-256 |
|---|---|---|
| `scripts/vendor/claude_video/frames.py` | `skills/watch/scripts/frames.py` @ commit `83da59fa78c3eee9e20f515fe75c438bb5166efd` | `ad317574facd619ff0c5ccbbb86a08b76abc8419c81107d179dbe2a3ba526ae6` |
| `scripts/vendor/claude_video/LICENSE` | `LICENSE` @ cùng commit | `add78957ea8124a8ae6eccd7a55c948543a9f32ea26917bf562b8cafacb01d3e` |

- Giấy phép MIT (Copyright (c) 2026 Bradley Bonanno) — file LICENSE được giữ nguyên.
- Code vendor KHÔNG được sửa. Mọi tùy biến nằm ở adapter (`extract_frames.py`,
  `prepare_video.py`) — import module, không patch.

## Cách hoạt động của frames.py (đã đọc đủ 756 dòng)

- `get_metadata` — ffprobe qua subprocess argv; trả duration/width/height/codec/has_audio.
- `extract` — uniform sampling `fps=N` + scale, trả `{index, timestamp_seconds, path, reason}`.
  Timestamp uniform = offset + i/fps → ƯỚC LƯỢNG.
- `extract_scene_candidates` / `extract_keyframes` / `extract_scene_or_uniform` /
  `extract_at_timestamps` / `dedupe_perceptual` — các engine khác, nằm ở tầng
  orchestration upstream, KHÔNG dùng trong CLI. Adapter chỉ dùng `extract` + `dedupe_perceptual`
  + `auto_fps`/`auto_fps_focus` + `parse_time`.
- CLI (`__main__`) của upstream: uniform + dedup, khớp với cách adapter gọi.

## Điều chỉnh adapter (so với mặc định upstream)

- `resolution` mặc định 768 (upstream 512) — chữ trên màn hình dễ đọc hơn.
- Bật `--no-dedup` cho pass đọc chữ (dedup có thể bỏ chữ thay đổi nhỏ).
- Mỗi pass ghi `frames.json` riêng, từ chối ghi đè (upstream CLI không có lớp này).

## KHÔNG đưa vào workspace (cố ý)

- Plugin manifests, hooks, auto-install, cấu hình `.env` toàn máy của upstream.
- Nhánh Whisper Groq/OpenAI API — giữ whisper local.
- Scene-based orchestration layer — CLI đủ dùng cho lấy mẫu đều + focused pass.
- Không tải code mới trong mỗi lần chạy; không auto-update.

## Khi nâng cấp upstream

Cập nhật commit + SHA-256 ở bảng trên, chạy lại tests/video-understanding/.
