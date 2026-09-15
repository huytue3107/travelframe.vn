# Content rubrics — 3 loại deliverable

## 1. Reel script + caption

`Marketing-Growth/Content/Drafts/<slug>/reel-script.md`:
- `## Hook (0-3s)` — 1-2 câu ngắn; phải promise/lợi ích cụ thể
- `## Beats` — 3-5 beat, mỗi beat 2-4 câu ngắn; nếu có "Pro move:" line thì đặt trong beat
- `## CTA` — save/share/comment; kết bằng `TravelFrame — your local friend in Hanoi`

`caption.md`:
- 1 dòng hook, thân caption khớp mạch reel (trap→move được phép), emoji vừa phải (≤5)
- Dòng CTA (comment keyword + DM flow nếu goal=Comment)
- Dòng ký tên: `TravelFrame — your local friend in Hanoi ✈️`
- Dòng hashtag cuối: ≥4 hashtag, có `#travelframe`

Checker yêu cầu: CTA word (save|share|comment|send|dm|bookmark), dòng ký tên, dòng hashtag.

## 2. Carousel slides text

`Marketing-Growth/Content/Drafts/<slug>/slides-text.md`:
- `## Slide 1 — <hook title>` … `## Slide N — <CTA>` ; N trong 5-7
- Slide hook: tiêu đề ≤ 8 từ + 1 câu phụ; value slides: ≤ 2 câu mỗi ý; slide cuối: CTA + tên brand
- Giá: theo quy tắc Marketing-Growth/Content/Carousels/README.md — thiếu nguồn → `[VERIFY]` hoặc bỏ số;
  range được phép với nhãn `Indicative`; "ask first" giữ nguyên (fresh coconut)
- KHÔNG đụng slides.html/render — chỉ text để chép vào

Checker yêu cầu: đúng 5-7 slide `## Slide N —`, mọi token giá phải cùng dòng có
`[VERIFY]` | `VERIFIED` | `Indicative` | `ask first`, hoặc bị flag.

## 3. Video script package (render-ready format)

`Marketing-Growth/Content/Drafts/<slug>/scripts/<slug>.txt`:
- Narration thuần, mỗi beat 1 khối cách dòng trống (đúng format
  `output/hanoi-dong-xuan-series/scripts/*.txt`)
- Câu ngắn đủ đọc là 1 câu overlay; kết beat cuối bằng save/share + mời gọi

`Marketing-Growth/Content/Drafts/<slug>/asset-plan.md`:
- `## Shared direction`: format 9:16/1080x1920/30fps, voice code VBee nếu người dùng
  chỉ định, tone, brand bridge, safety line
- `## Video: <tên>`: beat list đánh số (mỗi beat 1-2 dòng mô tả cảnh)
- `## Footage rules`: attribution, không mislabel địa điểm, crop-safe
- Safety bắt buộc nếu nhắc Train Street: barriers / không hứa access / không giờ tàu cố định

Checker yêu cầu (--draft asset-plan.md --script scripts/<slug>.txt): asset-plan có
brand bridge; nếu nhắc "Train Street" phải có barrier|safety|access|tracks trong cùng
phần; script narration không rỗng.

## Trạng thái kết thúc

| Trạng thái | Điều kiện |
|---|---|
| `drafted` | checker `pass`, không [VERIFY] còn lại |
| `drafted_flagged` | checker `flagged` — chỉ còn [VERIFY]. Verbatim ≥8 từ là `fail` (HARD) → phải sửa, không phải trạng thái bàn giao |
| `blocked` | thiếu knowledge base / brief không đủ viết |
