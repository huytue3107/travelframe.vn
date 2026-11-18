# MIG-20261118-GIT-SYNC-TO-MAIN

- **Ngày:** 2026-11-18 · **Thực hiện:** Claude · **Phòng ban:** Operations / Technology-Automation
- **Phê duyệt:** Rocky, 2026-11-18 — Q1 "đồng ý" (phương án A), Q2 "Oke" (media ngoài git), Q3 repo private
- **Kế hoạch gốc:** [Handoff Git Sync Plan](../../../Technology-Automation/Handoffs/2026-11-18-Claude-Git-Sync-Plan.md)

## 1. Vấn đề

Nhánh local `codex/travelframe-local-snapshot` không push được: 33 commit chưa có trên GitHub
(~1,53 GB blob, 1 file 109 MB vượt giới hạn 100 MB của GitHub), và thư mục làm việc còn 985 mục
chưa commit.

## 2. Cách làm

`sync_to_main.py` (plumbing, index tạm, không sửa file trong thư mục làm việc trừ `.gitignore`):

1. Lấy `origin/main` (`3c301c5`) làm gốc.
2. Dựng lại từng commit trong 33 commit, giữ message và author gốc, thêm dòng `Migrated-From: <sha cũ>`,
   bỏ các file media theo quy tắc ở mục 3.
3. Commit thư mục làm việc theo 10 batch phòng ban (B0–B9) cộng batch hồ sơ migration (B10).
4. `Published-Ledger.md`: `origin/main` có 11 dòng (cụm bài Giáng sinh/năm mới ngày 12/11) mà bản local
   không có. Đã gộp nguyên văn 11 dòng đó vào bản local trước khi commit; không mất dòng nào ở cả hai phía.

## 3. Quy tắc loại khỏi git (đồng thời thêm vào `.gitignore`)

- Audio/video: `mp4, mov, webm, mp3, wav, m4a`
- Ảnh render trong `Creative-Production/Projects/**` (`png, jpg, jpeg, webp`)
- `**/.hyperframes/preview/`, `tmp/`, `node_modules/`
- Mọi file > 50 MB

Các file đã có trên `origin/main` từ trước vẫn được theo dõi như cũ (`.gitignore` không ảnh hưởng file đã track).

## 4. Hồ sơ

| File | Nội dung |
|---|---|
| `manifest.tsv` | 33 dòng `replay` (sha cũ → sha mới) và 10 dòng `batch` (B0–B9) |
| `excluded.tsv` | 924 file bị loại: nguồn, lý do, dung lượng, còn trên đĩa không, SHA-256 |
| `sync_to_main.py` | Script plan / build / validate |
| `write_manifest.py` | Script tạo hai file TSV |

## 5. Validation (trước khi push)

| Kiểm tra | Kết quả |
|---|---|
| Thư mục làm việc so với commit cuối (`diff-files`) | 0 file lệch |
| File chưa theo dõi mà không bị ignore | 0 |
| Blob > 50 MB trong phần push | 0 |
| Dung lượng blob cần push | 283,9 MB (1.866 blob) |
| File media bị loại còn trên đĩa | 923/924 (2,89 GB); 1 file không còn là `TF-Hanoi-4-Spots.mp4`, đã bị xóa trước phiên này |
| `npm run test:skills` | 15/15 |
| `npm run test:triage` · `test:classifier` · comment tier | 20/20 · 13/13 · 11/11 |
| `npm run workspace:check` | Đạt, trừ 1 link hỏng có từ trước: `Creative-Production/Review/Vietnam-Ebook-Sketchnote/qa-2026-10-11.md` trỏ tới PNG đã bị xóa |

## 6. Sau migration

- Nhánh mới: `claude/2026-11-18-sync-local-snapshot` (local + `origin`).
- Thư mục làm việc chuyển sang nhánh mới bằng `git symbolic-ref` + `git reset --mixed`
  (chỉ đổi index, không xóa hay sửa file nào).
- Giữ nguyên nhánh cũ `codex/travelframe-local-snapshot` và tag local
  `backup/codex-local-snapshot-20261118` trỏ vào HEAD cũ (`4401b0f`), có đủ toàn bộ media trong lịch sử.

## 7. Rollback

```bash
cd "~/Codex GPT/travelframe.vn"
git symbolic-ref HEAD refs/heads/codex/travelframe-local-snapshot
git reset --mixed backup/codex-local-snapshot-20261118   # index về trạng thái cũ, file không đổi
git checkout -- .gitignore                                # bỏ khối ignore của migration (nếu muốn)
```

Không có file nào trong thư mục làm việc bị xóa nên rollback không cần khôi phục file.
Nhánh `origin/claude/2026-11-18-sync-local-snapshot` có thể xóa trên GitHub nếu không dùng.

## 8. Việc còn lại

- Tạo PR `claude/2026-11-18-sync-local-snapshot` → `main` và merge (Rocky).
- Nội dung nhánh `origin/claude/2026-11-18-typesafe-jev-pilot` (đẩy trước đó) đã có trong nhánh mới; có thể đóng/xóa nhánh đó.
- Media nặng: cần chỗ lưu ngoài git (Drive/NAS) nếu muốn đồng bộ giữa máy.
