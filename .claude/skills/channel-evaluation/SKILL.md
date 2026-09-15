---
name: channel-evaluation
description: >
  Đánh giá và phân tích content của từng kênh với độ chính xác cao: số liệu engagement
  tính bằng script deterministic (channel_metrics.py), chấm điểm kép adversarial
  (rubric 10 điểm × 2 lượt độc lập), spot-check URL thật bằng WebFetch. 2 mode:
  đánh giá kênh đối thủ (từ posts JSON + video analysis) và cổng chất lượng draft
  TravelFrame trước đăng. Dùng khi: "đánh giá kênh X", "phân tích content kênh Y",
  "so sánh các kênh", "chấm điểm draft Z". KHÔNG tự scrape Apify, KHÔNG đăng bài,
  KHÔNG tự sửa draft của content-writer.
---

# channel-evaluation

Đánh giá chính xác = **số từ script, điểm từ chấm kép, bằng chứng từ URL thật**.
Mọi output vào `Research-Insights/Library/evaluation/<handle>/<run-id>/` (channel) hoặc
`Marketing-Growth/Content/Drafts/<slug>/evaluation-<run-id>.{md,json}` (draft gate).

## Nguyên tắc bất di bất dịch

1. **Số = code.** Mọi chỉ số đến từ `channel_metrics.py` (metrics.json). Report chỉ
   diễn giải số có sẵn — TUYỆT ĐỐI không tự tính số trong văn bản.
2. **Thiếu dữ liệu = ghi missing.** Field lạ → probe runtime; không đoán tên field,
   không suy luận giá trị. Số liệu null → không nhắc trong kết luận.
3. **Mỗi điểm rubric phải có evidence** (post id + quan sát cụ thể). Không evidence →
   điểm không hợp lệ.
4. **Tương quan ≠ nhân quả.** Cấm kết luận "hook này gây viral"; chỉ nói "post top có
   X, các post khác không có".
5. **Caveats bắt buộc** trong mọi report: followers snapshot (ER xấp xỉ), pinned méo
   average, sample nhỏ, Image/Sidecar không views.
6. KHÔNG tự scrape: dữ liệu do `channel-scout` thu; chưa có → yêu cầu chạy channel-scout
   trước qua phiên chính. KHÔNG đọc `.env`, KHÔNG sửa draft (chỉ verdict).

## MODE 1 — Đánh giá kênh (7 bước)

### 1. Kiểm kê dữ liệu
`Research-Insights/Library/channels/<handle>/*.json` — probe shape (flat/latestPosts) + field
theo bảng `references/data-contract.md`; analysis runs liên quan trong
`Research-Insights/Library/analysis/`. Ghi ngày snapshot (mtime file) — KHÔNG tự bịa ngày scrape.
Thiếu posts JSON → dừng, yêu cầu channel-scout.

### 2. Chạy metrics
```bash
python3 .claude/skills/channel-evaluation/scripts/channel_metrics.py \
  --posts Research-Insights/Library/channels/<handle>/<file>.json \
  --out Research-Insights/Library/evaluation/<handle>/<run-id>/
```
Đọc kỹ stats.flags + missing_fields trước khi diễn giải.

### 3. Spot-check URL thật
WebFetch 3-5 post (ưu tiên top/bottom rel_er): so khớp bậc độ lớn số hiển thị với JSON
và caption. IG ẩn số chính xác (hiển thị "1.2M") → so bậc độ lớn. Không fetch được →
ghi `spot_check: unavailable` + lý do — không tuyên bố đã verify. Kết quả → `spot-check.md`.

### 4. Chấm điểm kép
Rubric 10 điểm (`references/scoring-rubric.md`). PASS 1: theo thứ tự thời gian cũ→mới.
PASS 2: đảo ngược (mới→cũ), ĐỌC LẠI rubric trước khi chấm, chấm mà KHÔNG nhìn pass 1.
Ghi 2 file `scores-rater-a.json` / `scores-rater-b.json` (schema trong rubric), rồi:
```bash
python3 .claude/skills/channel-evaluation/scripts/merge_scores.py \
  --a <scores-rater-a.json> --b <scores-rater-b.json> --out <run-dir>/scores.json
```
Lệch >1 điểm/criteria → unresolved: giữ cả hai rating, KHÔNG lấy trung bình; nêu trong report.

### 5. Diễn giải
Nối định lượng (rel_er top/bottom) với định tính (rubric): pattern nào xuất hiện ở top
posts; thiếu views/likes ở đâu. So analysis run (nếu có) cho hook video.

### 6. Viết evaluation.md
Scorecard kênh (median ER, cadence, formats, top/bottom + rubric), cross-channel
comparison nếu đánh giá nhiều kênh (bảng số liệu từ metrics.json của từng kênh —
không merge số tay), bài học cho TravelFrame (trỏ entry P-##/V-##), caveats.

### 7. Run record + trạng thái
`evaluated | partial | blocked` + ghi run record (`spot-check.md` có ngày + kết quả).
Báo cáo tiếng Việt.

## MODE 2 — Draft gate (TravelFrame)

Input `Marketing-Growth/Content/Drafts/<slug>/`:
1. Chạy lại `check_draft.py` cho từng file draft (xem content-writing SKILL bước 6) —
   verdict THẬT, dán vào report.
2. Chấm theo cùng rubric; đối chiếu voice-playbook (V-##) + knowledge patterns.
3. Claims còn `[VERIFY]` → verdict tối đa `needs_verification`, KHÔNG approve.
4. Verdict: `approve` | `revise` (+danh sách sửa cụ thể) | `block`.
5. Output `evaluation-<run-id>.md` + `scores.json` ngay trong thư mục draft.
   KHÔNG tự sửa draft — content-writer sửa rồi chạy gate lại.

## TravelFrame Governance Contract
- **Owner:** Research-Insights (`Research-Insights/Library/`)
- **Read First:** `Research-Insights/README.md`, `Brand-Strategy/Source-Of-Truth-Map.md`
- **Output:** `Research-Insights/Library/`
- **Source Precedence:** Rocky direct instruction > Executive approved decisions > canonical vault source > local approved artifact > working document > research snapshot.
- **Approval Gates:** Không tự động chạy paid scrape hoặc mở rộng collection ngoài brief mà chưa có Rocky phê duyệt.
- **Guardrails:** Raw evidence không bị ghi đè. Report phải có source date và limitations.
- **Completion Criteria:** Báo cáo đánh giá kênh hoàn chỉnh, có số liệu đối chiếu và evidence bundle.
