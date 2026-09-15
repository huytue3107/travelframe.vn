# Migration Batch: MIG-20260915-SKILLS-PHASE1
## TravelFrame Department Skills Implementation Baseline

- **Batch ID:** `MIG-20260915-SKILLS-PHASE1`
- **Date:** 2026-09-15
- **Owner:** Technology-Automation / Operations
- **Status:** Baseline Captured

---

## 1. Mục Tiêu Batch

Thiết lập hệ thống kỹ năng chuẩn hóa (Agent Skills) cho 9 phòng ban của TravelFrame theo kế hoạch tại `Operations/Change-Management/2026-09-15-travelframe-department-skills-implementation-plan.md`:
- Dùng `.agents/skills/` làm canonical source.
- Đồng bộ an toàn sang `.claude/skills/` thông qua manifest và validator.
- Bảo tồn và chuẩn hóa 15 skills hiện có.
- Xây dựng 12 skills mới cho các phòng ban thiếu hụt.
- Cung cấp tài liệu quản trị, 9 department guides và bộ kiểm thử tự động.

---

## 2. Trạng Thái Git Trước Khi Sửa (Worktree Baseline)

### Modified Files (Không thuộc batch này - không đụng tới):
- `Creative-Production/README.md`
- `Research-Insights/Library/knowledge/ideas-backlog.md`
- `Research-Insights/Library/knowledge/patterns.md`
- `Technology-Automation/MCP/travelframe-readonly.mjs`
- `Technology-Automation/README.md`
- `Technology-Automation/Scripts/workspace_check.py`
- `Technology-Automation/Tests/legacy/mcp/travelframe-readonly.test.mjs`
- `WORKSPACE-MAP.md`
- `package.json`
- `package-lock.json`

### Tracked Skills (4 skills trong `.claude/skills/`):
- `.claude/skills/channel-evaluation/`
- `.claude/skills/content-learning/`
- `.claude/skills/content-writing/`
- `.claude/skills/video-understanding/`

### Untracked Skills (11 skills trong `.agents/skills/` và `.claude/skills/`):
- `competitive-landscape`
- `competitor-analysis`
- `humanizer`
- `keyword-clustering`
- `keyword-research`
- `link-prospecting`
- `local-seo`
- `seo-audit`
- `seo-coach`
- `seo-project-setup`
- `visual-asset-pipeline`

Tổng cộng: 46 files skill hiện có được kiểm kê và băm SHA-256 chi tiết trong `manifest.tsv` và `files.sha256`.

---

## 3. Kết Quả Kiểm Thử Nền Tảng (Baseline Tests)

- **`npm test` (MCP test suite):** PASS (2 tests pass in 75ms).
- **`npm run test:workspace` (Workspace unit tests):** PASS (6 tests pass in 23ms).
- **`npm run workspace:check` (Company OS integrity):** PASS (6 checks pass).

---

## 4. Hướng Dẫn Rollback (Rollback Instructions)

1. **Nguyên tắc an toàn:**
   - Tuyệt đối KHÔNG sử dụng `git reset --hard` hay `git clean -fd` vì sẽ làm mất các thay đổi và file untracked chưa commit của user trong worktree.
   - Không xóa hay ghi đè bất kỳ skill nào không nằm trong `Technology-Automation/Skills/skills-manifest.json`.

2. **Khôi phục theo commit:**
   - Mỗi task/checkpoint trong batch migration này được commit riêng biệt. Để rollback một task, dùng `git revert <commit-hash>` hoặc checkout lại file cụ thể từ baseline commit.

3. **Khôi phục theo manifest:**
   - Sử dụng bảng đối chiếu SHA-256 trong `manifest.tsv` và `files.sha256` để kiểm tra tính toàn vẹn của 15 skills gốc nếu nghi ngờ có sự thay đổi ngoài ý muốn.
