---
name: content-writing
description: >
  Viết nội dung TravelFrame dựa trên knowledge base (voice-playbook, patterns,
  ideas-backlog): reel script + caption, carousel slides text, hoặc video script package
  đầy đủ để render. Dùng khi: "viết reel về X", "viết caption về Y", "draft carousel
  về Z", "viết video script package cho chủ đề W". KHÔNG đăng bài, KHÔNG render,
  KHÔNG sửa slides.html, KHÔNG thu thập dữ liệu. Phải có knowledge base trước
  (chạy content-learning nếu chưa có).
---

# content-writing

Viết draft nội dung TravelFrame vào `Marketing-Growth/Content/Drafts/<slug>/` kèm traceability và
claim-check máy đọc được. Tiếng Anh cho nội dung; tiếng Việt cho báo cáo nội bộ.

## 6 bước (làm đủ điều kiện mới qua bước sau)

### 1. Chốt brief
Chủ đề, loại nội dung (reel | carousel | video-package), goal (Save/Share/Comment),
hạn đăng, ràng buộc đặc biệt. Brief mơ hồ → hỏi lại qua phiên chính, không tự đoán lớn.
Slug: `YYYY-MM-DD-<topic-kebab>` hoặc theo lịch carousels nếu người dùng chỉ định ngày đăng.

### 2. Nạp tri thức
Đọc `Research-Insights/Library/knowledge/voice-playbook.md`, `patterns.md`, `ideas-backlog.md`.
Chọn pattern áp dụng + ghi lại ID (P-###/V-##) — sẽ liệt kê trong sources.md.
Knowledge base chưa tồn tại → dừng, yêu cầu chạy `content-learning` trước (seed mất vài phút).
Ý tưởng nên lấy từ ideas-backlog khi có I-### khớp chủ đề; nếu brief ngoài backlog →
đề nghị thêm entry I-### mới (báo cho lượt học sau ghi nhận).

### 3. Viết theo rubric
Đúng format trong `references/content-rubrics.md` cho loại đã chọn:
- **reel**: `reel-script.md` (hook 0-3s → beats → CTA) + `caption.md`
- **carousel**: `slides-text.md` (5-7 slide, chỉ TEXT — slides.html là downstream)
- **video-package**: `scripts/<slug>.txt` (narration thuần, beat cách dòng trống)
  + `asset-plan.md` — khớp format series Hanoi để pipeline hyperframes dùng được
Giọng: theo voice-playbook (warm local friend, câu ngắn, practical, lightly playful).

### 4. Claim check
Mọi claim về giá/lịch/địa điểm/ưu đãi:
- Có nguồn đáng tin trong knowledge base hoặc người dùng cung cấp → ghi nguồn trong sources.md
- Chưa chắc → đánh dấu `[VERIFY]` ngay tại vị trí claim + liệt kê vào bảng claim trong sources.md
- Quy tắc giá carousel: tối thiểu 2 nguồn gần ngày đăng; không đủ → range rộng + nhãn
  `Indicative` hoặc bỏ số (theo Marketing-Growth/Content/Carousels/README.md)
- CẤM: hứa Train Street access/giờ tàu cố định; gọi tên Điểm A chỉ vì caption nguồn
  nói vậy; thêm giá không nguồn. Không tự web-search verify trong v1.

### 5. Traceability
Viết `sources.md`:
- `## Patterns used` — ID entry đã áp dụng (P-###/V-##/I-###)
- `## Inspiration` — đường dẫn nguồn cảm hứng (analysis/digest/exemplar) + ngày
- `## Claims` — bảng claim | trạng thái (verified + nguồn | [VERIFY])
- `## Checklist` — kết quả bước 6

### 6. Tự kiểm bằng checker
```bash
# reel: caption.md kiểm cả hashtag; reel-script.md là narration → --no-expect-hashtag
python3 .claude/skills/content-writing/scripts/check_draft.py \
  --draft Marketing-Growth/Content/Drafts/<slug>/caption.md --type reel \
  --sources-md Marketing-Growth/Content/Drafts/<slug>/sources.md \
  --knowledge Research-Insights/Library/knowledge \
  --sources <file nguồn ngoài nếu draft học theo nguồn cụ thể>
python3 .claude/skills/content-writing/scripts/check_draft.py \
  --draft Marketing-Growth/Content/Drafts/<slug>/reel-script.md --type reel --no-expect-hashtag \
  --sources-md Marketing-Growth/Content/Drafts/<slug>/sources.md \
  --knowledge Research-Insights/Library/knowledge
# (khi có nguồn ngoài: thêm --sources <file nguồn> cho mọi lệnh để overlap check chạy)
# carousel: --draft slides-text.md --type carousel
# video: --draft asset-plan.md --type video --script scripts/<slug>.txt
```
Sửa đến verdict `pass` hoặc `flagged` (chỉ còn `[VERIFY]` hợp lệ). Báo kết quả +
trạng thái cuối: `drafted` | `drafted_flagged` | `blocked`.

## Giới hạn

- KHÔNG đăng, KHÔNG render, KHÔNG sửa `Marketing-Growth/Content/Carousels/*/slides.html` (chỉ đưa text).
- KHÔNG chạy channel-scout/video-analyst thay; chỉ ĐỌC output của họ.
- KHÔNG chép nguyên văn nguồn ngoài (checker bắt ≥8 từ); trích dẫn cho phép tối đa 1
  câu ngắn trong ngoặc.
- Draft KHÔNG bake caption vào video — text là input cho pipeline render riêng.

## TravelFrame Governance Contract
- **Owner:** Marketing-Growth (`Marketing-Growth/Content/Drafts/`)
- **Read First:** `Brand-Strategy/Source-Of-Truth-Map.md`, `Executive/Current-State.md`, `Marketing-Growth/README.md`
- **Output:** `Marketing-Growth/Content/Drafts/`
- **Source Precedence:** Rocky direct instruction > Executive approved decisions > canonical vault source > draft.
- **Approval Gates:** BẮT BUỘC Rocky duyệt trước khi chuyển Draft thành Published hoặc đưa lên web/mạng xã hội.
- **Guardrails:** Không tự ý tạo claim về giá, visa, thời tiết hoặc dịch vụ mà chưa đối chiếu Source-Of-Truth.
- **Completion Criteria:** Bài viết draft hoàn chỉnh, đạt chuẩn SEO, kiểm tra check_draft.py pass và sẵn sàng cho review.
