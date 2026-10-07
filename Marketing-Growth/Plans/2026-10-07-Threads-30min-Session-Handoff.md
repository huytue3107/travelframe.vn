# Handoff: Phiên tương tác Threads 30 phút (@travelframe.vn)

- **Ngày:** 2026-10-07
- **Owner:** Marketing-Growth
- **Trạng thái:** Draft, chờ Rocky duyệt trước khi chạy live
- **Từ:** Claude Code (phiên lập kế hoạch) → **Đến:** terminal "Thread Active"

## Việc cần làm
Chạy 1 phiên tương tác Threads 30 phút bằng skill `threads-engagement`. Chưa chạy gì trước khi bàn giao.

## Điều kiện bắt buộc trước khi chạy live
Comment công khai dưới tên thương hiệu cần Rocky phê duyệt rõ ràng cho phiên này. Hỏi Rocky 3 điều:
1. Sửa runner trước, hay chạy like-only cho newsfeed? (2 lỗi chưa sửa: nhãn chủ đề lệch nội dung, comment lặp khuôn. Xem `Data-Analytics/Threads-Session-Evaluations.md`, chu kỳ 19.)
2. Có duyệt đăng comment thật cho phiên này không?
3. Ưu tiên bài tiếng Anh (khách quốc tế, khớp sprint 14 ngày) hay tiếng Việt?

## Chuẩn bị (T−10 phút)
1. Chạy từ thư mục gốc project (`/Users/macbook/Codex GPT/travelframe.vn`), vì runner ghi log theo `process.cwd()`.
2. Orca chạy, tab Threads đã đăng nhập. Đối chiếu `PAGE_ID` gán cứng trong `threads_interact.mjs` (`4c9a2fab-…`) với `orca tab list --json`.
3. Có `TYPESAFE_API_KEY` (JEV live đã được duyệt 2026-09-25). Không đọc hay in key.
4. Thử mock: `node Technology-Automation/Scripts/typesafe_content_classifier.mjs --mock hanoi_photo_relevant`.
5. Ghi nhận mốc: dòng cuối log hiện là #521.

## Lịch 30 phút
| Phút | Việc |
|---|---|
| 0–5 | Mở feed, cuộn 2–3 lần, chưa tương tác |
| 5–20 | `--mode feed --duration 20` |
| 20–27 | `--mode search` với `hanoi photo`, `solo trip vietnam`, `hanoi autumn` (`--duration 7`) |
| 27–30 | Dừng, ghi log, ghi lead |

```bash
cd "/Users/macbook/Codex GPT/travelframe.vn"
node .claude/skills/threads-engagement/scripts/threads_interact.mjs --mode feed --duration 20
node .claude/skills/threads-engagement/scripts/threads_interact.mjs --mode search --query "hanoi photo" --duration 7
```

## Quy tắc trong phiên
- Lọc 4 tầng (blacklist, whitelist, bỏ bài chung chung ở search, cooldown tác giả 30 bài).
- Newsfeed: luôn like bài qua Tầng 1; chỉ reply khi chủ đề được JEV xác minh (confidence ≥ 0.6).
- Giọng: không gạch ngang, slang trong ngoặc kép, không emoji cuối câu, không CTA bán hàng.
- Mùa vụ tháng 10: lúa chín Hà Giang, thu heo may Hà Nội; tam giác mạch chỉ từ tháng 11.
- Pacing 45–75s, dùng Back, không reload feed.
- Có cảnh báo, giới hạn hoặc checkpoint của Threads: dừng ngay, báo Rocky, không thử lại.
- Bài hỏi giá tour hoặc thợ ảnh: chuyển `typesafe_lead_triage.mjs` (purchase_intent ≥ 2.5). Chỉ gắn tag và báo Rocky, không tự nhắn chốt.

## Sau phiên
1. Đối chiếu từng dòng log mới từ #522: nhãn chủ đề khớp nội dung, không trùng tác giả, đúng quy tắc viết. Ghi vào `Data-Analytics/Threads-Session-Evaluations.md`.
2. Điền `Marketing-Growth/Content/Threads-Outcome-Tracking.md` (chỉ dữ liệu quan sát được), kiểm tra lại sau 24 giờ.
3. Cập nhật header lỗi thời của `Threads-All-Interactions-Log.md` (ghi 227 lượt, thực tế đã #521+).
4. Commit đúng file thuộc batch, không `git add .`, không push khi Rocky chưa yêu cầu.

## Bối cảnh
- Sprint 14 ngày (28/09–11/10) đang chậm: chỉ có 6/28 bài draft (D01–D03), chưa thấy bằng chứng đăng live. Không thuộc phạm vi phiên này, chỉ để biết.
- Git: working tree còn nhiều file chưa commit của các batch khác. Không đụng vào.
