# Validation — 2026-10-14 BTS vs The Shot

- Owner: Marketing-Growth
- Caption: 5/5 PASS, có CTA, ký tên và dòng 5 hashtag; không còn VERIFY.
- Reel mapping: 5/5 PASS.
- Seed comment: 20 bản chính/dự phòng đều dưới 200 ký tự, không hashtag, C2 dùng PHOTO trùng caption.
- Media: 5/5 H.264/AAC 1080×1920, 30fps; chênh thời lượng nguồn dưới 0,1 giây; có SHA256 nguồn/output.
- Evidence: 126 frame đã đọc, toàn thời lượng gần 1fps + hook/kết 2fps; tất cả đường dẫn tồn tại.
- npm test: 158 pass, 0 fail.
- npm run test:skills: 15 pass, 0 fail.
- npm run workspace:check: chưa PASS do 13 lỗi có sẵn ngoài batch (7 link + 6 absolute paths). Sau sửa link của batch, output không còn lỗi thuộc các folder mới của batch.

## Workspace baseline chưa sửa

- Marketing-Growth/Campaigns/CMP-202610-WARM-PHOTO-DM/Brief.md: link tới report đã bị xóa trong working tree trước task.
- .agents/skills/site-architecture/SKILL.md: /features/analytics.
- .agents/skills/competitors/references/content-architecture.md: /alternatives/notion, /alternatives/airtable, /alternatives/monday.
- .agents/skills/sms/references/compliance.md: hai placeholder link.
- Legacy absolute paths: .claude/settings.local.json:11; scratch/serp_rank_check.mjs:3,45; scratch/generate_utm_doc.py:275; scratch/monitor_orca_and_sleep.py:8,9.

Không sửa hoặc khôi phục file ngoài scope. Mọi Scheduled status phải có xác nhận UI Meta và đối chiếu queue; không gọi Scheduled là Published.
