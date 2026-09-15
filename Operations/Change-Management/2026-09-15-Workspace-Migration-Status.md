# TravelFrame Workspace Migration Status

**Ngày chốt:** 2026-09-15
**Trạng thái:** Completed 2026-09-15 (tiếp tục và hoàn tất theo yêu cầu của Rocky; bản gốc ghi Paused — lịch sử giữ nguyên bên dưới)
**Bằng chứng hoàn tất:** `Operations/Migrations/2026-09-15-final-audit/README.md` (baseline 485 files: 0 unexplained missing) + các batch commits sau `5b6fb97`.
**Workspace:** `/Users/macbook/Codex GPT/travelframe.vn`

## 1. Tóm tắt

Workspace TravelFrame đang được chuyển từ cấu trúc theo loại file rời rạc sang
Company OS theo phòng ban. Migration đã hoàn thành phần nền tảng, Technology,
Research, Marketing và phân loại các business documents.

Migration được dừng trước khi di chuyển creative media lớn. Không có file nguồn,
Guest Guide, Hanoi video series hoặc QA render nào bị di chuyển trong giai đoạn đang
dở. Không có remote Git và không có push.

## 2. Kiến trúc đã thống nhất

```text
travelframe.vn/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── WORKSPACE-MAP.md
├── Inbox/
├── Executive/
├── Brand-Strategy/
├── Research-Insights/
├── Marketing-Growth/
├── Creative-Production/
├── Sales-CRM/
├── Technology-Automation/
├── Data-Analytics/
├── Operations/
├── Archive/
└── .claude/
```

Tên thư mục hệ thống dùng English, không đánh số. Tài liệu vận hành dùng tiếng Việt.
Side Agency vault tiếp tục là source of truth cho chiến lược TravelFrame.

## 3. Những gì đã hoàn thành

### Design và implementation plan

- Design đã được duyệt và lưu tại
  `docs/superpowers/specs/2026-09-15-travelframe-company-workspace-design.md`.
- Implementation plan đã được lưu tại
  `docs/superpowers/plans/2026-09-15-travelframe-company-workspace-implementation.md`.
- Git local đã được khởi tạo trên nhánh `main`.

### Baseline và an toàn

- Tạo `.gitignore` cho `.env`, dependency, cache và media/generated assets lớn.
- Tạo baseline inventory cho 485 file.
- Tạo 485 SHA-256 checksum.
- Ghi 241 dependency/path references ban đầu.
- Baseline nằm trong `Operations/Migrations/2026-09-15-baseline/`.

### Company OS control plane

- Tạo `README.md` làm startup entry point.
- Tạo và đồng bộ policy giữa `AGENTS.md` và `CLAUDE.md`.
- Tạo `WORKSPACE-MAP.md`.
- Tạo README cho toàn bộ phòng ban.
- Tạo `Executive/Current-State.md`.
- Tạo `Brand-Strategy/Source-Of-Truth-Map.md`.
- Quy định source precedence, ownership, lifecycle và approval gates.

### Workspace validator

- Tạo `Technology-Automation/Scripts/workspace_check.py`.
- Tạo 6 test cho startup files, department README, policy sync, secret paths,
  legacy absolute paths và local Markdown links.
- Thêm lệnh:

```bash
npm run test:workspace
npm run workspace:check
```

### Technology migration

Đã chuyển:

```text
mcp/     -> Technology-Automation/MCP/
scripts/ -> Technology-Automation/Scripts/legacy/
tests/   -> Technology-Automation/Tests/legacy/
```

Đã cập nhật `package.json`, MCP runner, channel-agent scripts, test helpers và các
agent/skill references. Migration record:
`Operations/Migrations/MIG-20260915-TECH/`.

### Research migration

Đã chuyển:

```text
reference-library/ -> Research-Insights/Library/
```

Đã giữ nguyên run ID, filenames, evidence bundle và provenance sidecar. Đã cập nhật
active path pointers trong agents, skills, scripts, tests và knowledge files.
Migration record: `Operations/Migrations/MIG-20260915-RESEARCH/`.

### Marketing migration

Đã chuyển:

```text
carousels/     -> Marketing-Growth/Content/Carousels/
output/drafts/ -> Marketing-Growth/Content/Drafts/
output/posts/  -> Marketing-Growth/Content/Review/Legacy-Posts/
```

Legacy posts không được tự nâng thành Approved hoặc Published. Đã tạo
`Marketing-Growth/Published-Ledger.md`. Migration record:
`Operations/Migrations/MIG-20260915-MARKETING/`.

### Business documents

Đã phân loại:

```text
Pricing documents -> Brand-Strategy/Offers-Pricing/
ManyChat documents -> Sales-CRM/Automation/ManyChat/
Master summary     -> Executive/Snapshots/
Content plan DOCX  -> Marketing-Growth/Plans/
```

Đã cập nhật output path trong hai document builder scripts. Migration record:
`Operations/Migrations/MIG-20260915-BUSINESS-DOCS/`.

## 4. Git checkpoints đã tạo

| Commit | Nội dung |
|---|---|
| `677afbe` | Company workspace design |
| `9254668` | Implementation plan |
| `7472579` | Baseline inventory và checksum |
| `995609c` | Company OS control plane |
| `f77642c` | Workspace validator |
| `e1bfaf2` | Technology migration |
| `e632730` | Research migration |
| `19eb6ec` | Marketing migration |
| `d4b2de4` | Business document ownership |

Không có commit nào được push.

## 5. Verification đã chạy

### Hiện tại

- Node MCP: PASS, 1 test.
- Workspace validator: PASS, 6 tests.
- Required startup files: PASS.
- Department README: PASS.
- `AGENTS.md` và `CLAUDE.md` policy sync: PASS.
- Tracked secret paths: PASS.
- Local Markdown links: PASS.

### Sau Technology và Research migration

- Content writer: PASS, 24 tests.
- Video understanding: PASS, 22 tests.
- Channel evaluator: PASS, 22 tests; 1 test skipped.

Test bị skip là `test_real_nasa_metrics_sane` vì source fixture
`channels/test-nasa/instagram-posts.json` không tồn tại trong baseline. Các NASA
evaluation outputs vẫn còn, nhưng không được dùng để giả lập source fixture.

### Cảnh báo còn lại

`npm run workspace:check` đang chạy với `--allow-legacy-paths` và báo 3 absolute-path
references:

1. Constant dùng để phát hiện legacy path trong chính validator.
2. Test fixture của validator.
3. Một historical run pointer trong draft evaluation JSON.

Hai mục đầu là false positive có chủ đích. Mục thứ ba cần được chuyển sang relative
path hoặc đánh dấu historical exception trước khi tắt migration mode.

## 6. Những gì đang dở và đã dừng

Không có command migration nào còn chạy. Các hạng mục sau chưa thực hiện:

- Creative Production migration.
- Di chuyển `Source video/`.
- Di chuyển Hanoi/Dong Xuan production series.
- Di chuyển Guest Guide.
- Di chuyển hai bộ QA pricing preview.
- Phân loại các creative render còn lại theo project/status.
- Di chuyển active design/plan docs từ `docs/superpowers/` vào
  `Operations/Change-Management/`.
- Tạo Data Analytics definitions, snapshots và reports từ dữ liệu hiện có.
- Tạo final inventory/checksum và đối chiếu với baseline.
- Tắt `--allow-legacy-paths`.
- Dọn các legacy root directory sau validation.

## 7. Dữ liệu legacy còn nguyên tại chỗ

| Khu vực | Kích thước gần đúng | Trạng thái |
|---|---:|---|
| `Source video/` | 1,5 GB | Chưa di chuyển |
| `output/` | 1,1 GB | Còn Hanoi series và QA previews |
| `travelframe-guest-guide/` | 31 MB | Chưa di chuyển |
| `docs/` | 48 KB | Chưa chuyển active change docs |

Ba khu vực creative lớn có tổng cộng khoảng 357 file, không tính `.DS_Store`.

## 8. Trạng thái worktree khi dừng

Hai file dưới đây đã tồn tại trước migration và vẫn chưa được Git theo dõi:

- `docs/superpowers/plans/2026-09-10-hanoi-dong-xuan-video-plan.md`
- `docs/superpowers/specs/2026-09-14-travelframe-30-day-content-design.md`

Chúng không bị sửa hoặc xóa. Khi tiếp tục, cần đưa chúng vào đúng batch
`Operations/Change-Management/` thay vì stage chung.

## 9. Phương án thực hiện phần còn lại

### Batch A: Guest Guide và QA previews

1. Tạo manifest/checksum riêng.
2. Chuyển Guest Guide tới
   `Creative-Production/Deliverables/Guest-Guide/`.
3. Chuyển QA pricing previews tới
   `Creative-Production/Review/Web-Pricing/`.
4. Kiểm tra PDF/PPTX, image count, checksum và local references.
5. Commit riêng batch.

Đây là batch creative ít rủi ro nhất và nên làm trước.

### Batch B: Hanoi/Dong Xuan production project

1. Hash toàn bộ `output/hanoi-dong-xuan-series/`.
2. Chuyển nguyên bundle tới
   `Creative-Production/Projects/Hanoi-Dong-Xuan-Series/`.
3. Cập nhật evidence pointers trong Research knowledge, agents và skills.
4. Kiểm tra HTML source, audio, SRT, image assets và mọi render bằng `ffprobe`.
5. So sánh count, bytes và checksum rồi commit manifest/source files.

Không tách rời audio, subtitles, scripts và render khỏi project bundle.

### Batch C: Raw source media

1. Kiểm tra dung lượng trống trước khi thao tác.
2. Hash toàn bộ `Source video/`.
3. Chuyển nguyên trạng tới `Creative-Production/Assets/Raw/`.
4. Không đổi tên 84 video hoặc ảnh source trong cùng batch.
5. Kiểm tra file count, total bytes, SHA-256 và media metadata.
6. Chỉ xóa compatibility path khi không còn external dependency.

Raw media không đưa vào Git; Git chỉ theo dõi manifest và validation report.

### Batch D: Operations và Data closure

1. Chuyển active spec/plan vào `Operations/Change-Management/`.
2. Tạo metric definitions và dated snapshot index trong `Data-Analytics/`.
3. Cập nhật `WORKSPACE-MAP.md` từ migration map sang current-state map.
4. Sửa historical absolute-path exception.
5. Bỏ `--allow-legacy-paths` khỏi `package.json`.
6. Chạy toàn bộ test suite.

### Batch E: Final audit

1. Tạo final inventory/checksum bằng cùng rule với baseline.
2. Map mỗi baseline file tới current path hoặc explicit ignored/cache record.
3. Không chấp nhận unexplained missing file.
4. Kiểm tra secret, Markdown links, asset references và media metadata.
5. Ghi final validation report và rollback instructions.
6. Chỉ dọn legacy folder rỗng sau khi audit pass.

## 10. Cách rollback nếu cần

- Mỗi batch có `manifest.tsv`, README và validation report trong
  `Operations/Migrations/`.
- Với text/code: revert đúng commit của batch.
- Với media/untracked binary: so checksum ở destination với manifest, sau đó move về
  old path khi old path chưa tồn tại.
- Không dùng `git reset --hard`.
- Không ghi đè file tại rollback destination.
- Nếu chỉ muốn quay lại một phòng ban, rollback đúng batch thay vì đảo toàn bộ repo.

## 11. Khuyến nghị khi tiếp tục

Tiếp tục theo thứ tự Batch A -> B -> C -> D -> E. Không gộp Guest Guide, Hanoi series
và Raw source media vào một lần. Sau mỗi batch phải có checksum, test, validation
report và commit riêng.
