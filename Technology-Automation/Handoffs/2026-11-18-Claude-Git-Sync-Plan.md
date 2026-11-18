# Handoff: Push phiên 2026-11-18 và kế hoạch dọn thay đổi chưa commit

- **Ngày:** 2026-11-18 · **Người làm:** Claude · **Trạng thái:** Đã thực hiện. Rocky duyệt Q1 phương án A,
  Q2 media ngoài git, Q3 repo private. Kết quả, validation và rollback:
  [MIG-20261118-GIT-SYNC-TO-MAIN](../../Operations/Migrations/MIG-20261118-GIT-SYNC-TO-MAIN/README.md).
  Nhánh làm việc hiện tại: `claude/2026-11-18-sync-local-snapshot`.

## 1. Đã làm (có bằng chứng)

- Commit local `4401b0f` trên `codex/travelframe-local-snapshot` (16 file: TypeSafe comment tier,
  Jev Ultrafast runbook/pilot, snapshot giá Klook/Viator, `.claude/settings.json`).
- **Không push được nhánh `codex/travelframe-local-snapshot`:** nhánh đi trước `origin/main` 33 commit
  (1.605 file, 783 file media, ~1,53 GB blob) và chứa `Creative-Production/Projects/Hanoi-4-Spots-2026-11-04/TF-Hanoi-4-Spots.mp4`
  (109 MB, vượt giới hạn 100 MB/file của GitHub). Đã dừng các tiến trình push; nhánh này chưa có trên remote.
- **Đã push** bản sao commit đặt trên `origin/main` (`3c301c5`):
  `ff07232` → `origin/claude/2026-11-18-typesafe-jev-pilot` (16 file, 771 dòng).
  Tạo PR: https://github.com/huytue3107/travelframe.vn/pull/new/claude/2026-11-18-typesafe-jev-pilot

## 2. Hiện trạng thay đổi chưa commit (985 mục với `-uall`)

| Nhóm | Số file | Dung lượng | Ghi chú |
|---|---|---|---|
| Creative-Production (chưa theo dõi) | 720 | ~560 MB | Chủ yếu PNG/JPG render của Hanoi-Three-Things, Vietnam-Weather, Things-Not-To-Do, Handbook; font `.ttf`; `.hyperframes/preview` |
| Marketing-Growth | 35 sửa + 116 mới | ~12 MB | Drafts, SEO audit 15–18/11, plans, log Threads/Messenger, Published-Ledger |
| Data-Analytics | 2 sửa + 36 mới | ~1 MB | Lead/Seed trackers, dashboards, reports, `facebook-comments-14days.json` |
| Sales-CRM | 21 mới | ~11 MB | Funnel, scripts, outreach, email template cảm ơn (có `sample-elena.json`, báo giá PDF) |
| Technology-Automation | 2 sửa + 10 mới | nhỏ | 7 script `.mjs`, Operating Manual, handoffs |
| Executive / Brand / root | 9 | nhỏ | Current-State, Operating Review, 2 DEC, AGENTS.md, README, package.json (`dashboard:live`) |
| Research-Insights | 2 sửa + 5 mới | nhỏ | |
| Operations | 2 mới | nhỏ | MIG-20261118-TRAVELFRAME-VAULT-RENAME |
| tmp/ | 20 (có `node_modules`) | ~15 MB | Không nên commit |
| Đã xóa | 2 | — | `TF-Hanoi-4-Spots.mp4`, `TF-Vietnam-Ebook-Sketchnote-EN-v1.png` |

Kiểm tra bảo mật: quét 384 file văn bản, không có token/key thật. 6 kết quả khớp mẫu đều là dữ liệu base64
của font/ảnh nhúng trong file preview HTML.

`origin/main` chỉ đổi 6 file kể từ điểm tách (5 bài publish + `Published-Ledger.md`), trùng với nội dung
của 33 commit local. Thay đổi chưa commit chỉ trùng 1 file: `Marketing-Growth/Published-Ledger.md`.

## 3. Quyết định cần Rocky

1. **33 commit local chưa lên GitHub.** Đề xuất A (khuyến nghị): không push nhánh cũ; chuyển phần
   văn bản (~820 file) sang nhánh mới đặt trên `origin/main`, để media ngoài git. Phương án B: dùng
   Git LFS cho media và viết lại lịch sử 33 commit (thay đổi lịch sử, tốn hạn mức LFS).
2. **Media render (~560 MB) và 2 file đã xóa:** giữ ngoài git (thêm `.gitignore`) hay dùng LFS.
3. **Dữ liệu cá nhân:** `facebook-comments-14days.json` (tên người được tag), `sample-elena.json`,
   báo giá PDF. Commit hay giữ local tùy repo private hay public.

## 4. Kế hoạch commit theo phòng ban (sau khi Rocky duyệt mục 3)

| Batch | Phạm vi | Kiểm tra trước commit |
|---|---|---|
| 0 | `.gitignore`: `tmp/`, `**/.hyperframes/preview/`, thư mục render | `git status` giảm đúng |
| 1 | Executive + Brand + AGENTS/README | Sửa 3 link hỏng trong Operating Review |
| 2 | Technology-Automation + `package.json` | `test:skills`, `test:triage`, `workspace:check` |
| 3 | Operations MIG-20261118 | Có manifest, checksum, rollback theo quy định |
| 4 | Marketing-Growth SEO | — |
| 5 | Marketing-Growth Content/Plans/Logs | Đối chiếu `Published-Ledger.md` với main |
| 6 | Sales-CRM | Rà PII |
| 7 | Data-Analytics | Rà PII, header CSV (18/19 cột) |
| 8 | Research-Insights | — |
| 9 | Creative-Production (chỉ md/json/html) | — |

Mỗi batch: stage từng file, commit, push bản đặt trên `origin/main` lên nhánh `claude/…`.
