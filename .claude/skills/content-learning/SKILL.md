---
name: content-learning
description: >
  Học từ phân tích video (video-analyst), digest/posts kênh (channel-scout), transcript và
  nội dung mẫu của chính TravelFrame, chưng cất thành knowledge base tích lũy
  (voice-playbook, patterns, ideas-backlog). Dùng khi: "học từ các phân tích mới",
  "cập nhật knowledge base", "chưng cất pattern từ kênh X", "seed knowledge base".
  KHÔNG dùng để viết nội dung (việc của skill content-writing) hay thu thập dữ liệu
  (việc của channel-scout).
---

# content-learning

Chưng cất dữ liệu nghiên cứu thành tri thức viết nội dung. Knowledge base nằm ở
`reference-library/knowledge/` (markdown thuần, tích lũy, schema trong
`references/knowledge-schema.md`).

## Nguyên tắc bất di bất dịch

- **Không bao giờ xóa im lặng.** Entry cũ chỉ chuyển `archived`/`superseded` kèm ngày.
- **Mọi entry phải có evidence pointer** (đường dẫn file + mục/dòng). Không pointer → không entry.
- **Nguồn ngoài chỉ góp CẤU TRÚC** (công thức hook, nhịp beat, loại CTA) — văn phong
  LUÔN lấy từ exemplar của chính TravelFrame. Trích nguyên văn nguồn ngoài tối đa 1 câu
  ngắn, đặt trong ngoặc kèm nguồn; khi dùng trong draft, quote đó là quote DUY NHẤT của draft (checker cho phép tối đa 1).
- Nguồn yếu (SRT không provenance, dữ liệu không ngày) → confidence thấp + ghi chú.

## 6 bước (làm đủ điều kiện mới qua bước sau)

### 1. Kiểm kê input
Quét `reference-library/`:
- `analysis/<video-key>/<run>/analysis.md` + `analysis.json` (video-analyst)
- `channels/<handle>/digest.md` và `channels/<handle>/*.json` (channel-scout)
- `transcripts/<name>-<runstamp>/` — chỉ dùng khi có `provenance.json`
- Exemplar của TravelFrame: `output/posts/*.md`, `output/hanoi-dong-xuan-series/`
  (scripts + asset-plan + DESIGN.md), `carousels/*/slides.html` (chỉ ĐỌC text)
Đọc `knowledge/runs/*/learning.md` để biết cái gì đã học rồi. Báo: nguồn mới / nguồn đã học / nguồn yếu.

### 2. Seed nếu trống
`reference-library/knowledge/` chưa tồn tại → tạo trước bằng nguồn `self_exemplar`
(voice-playbook từ DESIGN.md + esim caption + scripts Hanoi; patterns từ chính 3
narration script đó). Seed xong mới học thêm từ nguồn ngoài.

### 3. Chưng cất pattern
Từ từng nguồn, rút ra (dạng công thức, KHÔNG copy câu chữ):
- Hook: cấu trúc câu mở, promise gì, 0-3s làm gì
- Beat: mạch nội dung (vấn đề → triển khai → kết luận/CTA), nhịp cảnh
- CTA: save/share/comment/DM — khi nào dùng loại nào
- Caption: độ dài, emoji, hashtag, ký tên
- Format thắng: chỉ số engagement (nếu có) KÈM nguồn + ngày lấy; không coi engagement là bằng chứng "hook gây viral"
- Content pillar: chủ đề lặp lại của kênh

### 4. Merge vào knowledge base
Theo đúng schema + merge rules (`references/knowledge-schema.md`):
- Mới → thêm entry với ID tiếp theo (P-### pattern / V-## voice)
- Lặp lại → tăng confidence + thêm evidence pointer, giữ ngày học đầu
- Mâu thuẫn → giữ cả hai + ghi chú conflict có ngày; không tự chọn phía
- Đổi ý có căn cứ → `superseded` có ngày + trỏ entry mới

### 5. Cập nhật ideas-backlog
Ý tưởng nội dung mới: tiêu đề + nguồn cảm hứng (path + mục) + góc TravelFrame
(cấu trúc học được, KHÔNG câu chữ nguồn). Dedup theo chủ đề với backlog hiện có
(đọc kỹ trước khi thêm; trùng góc → bỏ hoặc đánh dấu variant).

### 6. Ghi run record + báo cáo
`knowledge/runs/<YYYY-MM-DD-scope>/learning.md`: nguồn đã tiêu thụ, entry
thêm/cập nhật/conflict, cái gì chưa chắc. Trạng thái lượt học: `learned` |
`learned_partial` (nguồn thiếu/yếu) | `no_new_inputs`. Báo cuối: entry mới/cập nhật,
điểm chưa chắc, gợi ý lượt học sau.
