# TravelFrame Company Workspace Design

**Ngày:** 2026-09-15
**Trạng thái:** Approved design
**Phạm vi:** `/Users/macbook/Codex GPT/travelframe.vn`

## 1. Mục tiêu

Tái cấu trúc workspace TravelFrame thành một Company OS có ranh giới trách nhiệm rõ
ràng, giữ được provenance, hỗ trợ vận hành theo phòng ban, và cho phép Claude/Codex
hiểu đúng hệ thống ngay khi mở workspace.

Thiết kế áp dụng migration theo batch, có kiểm kê, checksum, kiểm tra đường dẫn và
khả năng quay lại. Không tổ chức lại toàn bộ trong một lần và không xóa nguồn gốc chỉ
vì đã có bản sao hoặc render.

## 2. Nguyên tắc

- Tên thư mục hệ thống dùng English ngắn gọn, không đánh số.
- Tài liệu vận hành và giải thích nội bộ viết bằng tiếng Việt.
- Side Agency vault tiếp tục là source of truth cho chiến lược TravelFrame.
- Workspace lưu source map và snapshot có ngày, không tạo bản canonical song song.
- Mỗi artifact có đúng một phòng ban sở hữu chính.
- Render không đồng nghĩa Approved hoặc Published.
- Claude/Codex mặc định có quyền Read, Draft và Review.
- Publish, gửi tin nhắn, sửa dữ liệu live, dùng API trả phí, xóa file hoặc đổi quyền
  truy cập cần Rocky phê duyệt rõ ràng.
- Không đọc, in hoặc commit credential trong `.env` hay Keychain.

## 3. Kiến trúc thư mục

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

### Inbox

Điểm nhận file chưa phân loại. Chỉ chứa nội dung tạm thời, duplicate cần review hoặc
artifact chưa xác định owner. Inbox phải có lịch dọn định kỳ.

### Executive

Quản lý mục tiêu, cơ cấu, quyền phê duyệt, current state, open decisions và decision
log. Đây là nơi agent đọc để biết ưu tiên hiện tại trước khi hành động.

### Brand-Strategy

Quản lý brand architecture, audience, product ladder, offer, pricing, policy thương
mại và `Source-Of-Truth-Map.md` trỏ tới canonical notes trong Side Agency vault.

### Research-Insights

Quản lý dữ liệu nghiên cứu kênh, video nguồn tham khảo, transcript, analysis,
evaluation, knowledge base và evidence. Khu vực này không sở hữu nội dung xuất bản.

### Marketing-Growth

Quản lý campaign, content calendar, brief, draft, review, approved content,
distribution plan và published ledger.

### Creative-Production

Quản lý source media, production project, edit, render, QA, guest guide và final
deliverable. Final render vẫn cần publishing evidence trước khi mang trạng thái
Published.

### Sales-CRM

Quản lý funnel, ManyChat, lead qualification, booking handoff, customer journey và
sales scripts. Không tự gửi DM hoặc thay đổi automation live khi chưa được duyệt.

### Technology-Automation

Quản lý MCP, scripts, tests, agent tools, technical documentation và runbook. Phòng
ban này cung cấp công cụ nhưng không sở hữu quyết định nội dung hoặc thương mại.

### Data-Analytics

Quản lý metric definitions, dated snapshots, campaign results, attribution,
reporting và business performance. Không trộn snapshot khác period hoặc definition.

### Operations

Quản lý SOP, workflow, capacity, checklist, inventory, migration records, workspace
maintenance và change management.

### Archive

Lưu artifact ngừng hoạt động nhưng vẫn cần provenance. Archive không phải thùng rác
và không làm mất source pointer.

### .claude

Giữ tại root để Claude tự phát hiện agents và skills. Mọi absolute path trong
configuration phải được cập nhật sau migration. Nội dung không được mâu thuẫn với
root `AGENTS.md` và `CLAUDE.md`.

## 4. Ownership và data flow

```text
Research-Insights
    -> evidence + insights
Brand-Strategy
    -> approved direction
Marketing-Growth
    -> campaign brief + content draft
Creative-Production
    -> rendered deliverables
Marketing-Growth
    -> review + publishing record
Sales-CRM
    -> inquiry + booking handoff
Data-Analytics
    -> results + attribution
Executive
    -> decisions + priorities
```

`Operations` quản lý quy trình xuyên phòng ban. `Technology-Automation` cung cấp
công cụ cho toàn bộ flow.

Không ép mọi phòng ban có cùng một cây trạng thái. Chỉ khu vực có workflow thực tế
mới tạo các thư mục `Active`, `Review`, `Approved` hoặc `Published`.

## 5. Trạng thái chuẩn

| Trạng thái | Định nghĩa |
|---|---|
| Draft | Đang soạn, chưa dùng như thông tin chính thức |
| Review | Chờ kiểm tra claim, hình ảnh, chất lượng hoặc quyền sử dụng |
| Approved | Đã được người có quyền duyệt |
| Published | Có bằng chứng nền tảng, URL hoặc platform record |
| Blocked | Thiếu quyết định, quyền truy cập hoặc bằng chứng |
| Archived | Ngừng dùng nhưng vẫn giữ provenance |

## 6. Startup protocol

Claude và Codex đọc theo thứ tự:

1. `README.md`
2. `AGENTS.md` hoặc `CLAUDE.md`
3. `Executive/Current-State.md`
4. `Brand-Strategy/Source-Of-Truth-Map.md`
5. `WORKSPACE-MAP.md`
6. README của phòng ban liên quan
7. Manifest của campaign hoặc production project liên quan

### Source precedence

```text
Yêu cầu trực tiếp mới nhất của Rocky
-> quyết định Approved trong Executive
-> canonical source trong Side Agency vault
-> local approved artifact
-> working document
-> research snapshot
-> draft hoặc render chưa publish
```

### Department README schema

Mỗi README phòng ban phải có:

- Purpose
- Responsibilities
- Inputs
- Outputs
- Source of truth
- Folder structure
- Workflow
- Approval requirements
- Naming conventions
- Archive policy
- Related departments

## 7. Bản đồ migration

| Hiện tại | Đích đề xuất |
|---|---|
| `Source video/` | `Creative-Production/Assets/Raw/` |
| `reference-library/` | `Research-Insights/Library/` |
| `carousels/` | `Marketing-Growth/Content/Carousels/` |
| `travelframe-guest-guide/` | `Creative-Production/Deliverables/Guest-Guide/` |
| `output/drafts/` | `Marketing-Growth/Content/Drafts/` |
| `output/posts/` | `Marketing-Growth/Content/Approved/` pending status review |
| `output/hanoi-dong-xuan-series/` | `Creative-Production/Projects/Hanoi-Dong-Xuan-Series/` |
| `output/manychat-*` | `Sales-CRM/Automation/ManyChat/` |
| `output/*pricing*` | `Brand-Strategy/Offers-Pricing/` |
| `output/qa-*` | `Creative-Production/Review/` |
| `mcp/` | `Technology-Automation/MCP/` |
| `scripts/` | `Technology-Automation/Scripts/` |
| `tests/` | `Technology-Automation/Tests/` |
| `docs/superpowers/` | `Operations/Change-Management/` after active migration work |

`output/posts/` không được tự coi là Published. Migration phải kiểm tra từng artifact
và chỉ dùng `Approved` nếu có evidence phù hợp; nếu chưa đủ evidence, chuyển vào
`Review`.

## 8. Migration phases

### Phase 1: Baseline

- Kiểm kê toàn bộ text, code và metadata.
- Tạo file count, size report, SHA-256 inventory và dependency map.
- Đánh dấu secret, cache, generated preview và large media.
- Khởi tạo Git local; không tạo remote và không push.

### Phase 2: Control plane

- Tạo root `README.md`, `AGENTS.md`, `CLAUDE.md` và `WORKSPACE-MAP.md`.
- Tạo các department folder và README.
- Tạo `Executive/Current-State.md`.
- Tạo `Brand-Strategy/Source-Of-Truth-Map.md`.

### Phase 3: Lightweight migration

- Di chuyển Markdown, JSON, scripts và cấu hình theo batch nhỏ.
- Cập nhật mọi đường dẫn tương đối và absolute path.
- Chạy test sau từng batch.

### Phase 4: Media migration

- Di chuyển source media và render lớn sau khi dependency map ổn định.
- Không đổi tên media nếu chưa có lý do vận hành rõ ràng.
- Dùng compatibility link tạm thời khi external workflow còn phụ thuộc đường dẫn cũ.

### Phase 5: Validation

- Chạy workspace validation.
- Kiểm tra carousel assets, document sources, MCP, scripts và tests.
- Xác nhận file count, checksum và dependency resolution.

### Phase 6: Closure

- Xóa compatibility link chỉ khi không còn dependency.
- Chuyển migration records đã hoàn tất vào Operations.
- Ghi current state, known limitations và maintenance cadence.

## 9. Migration record

Mỗi batch phải ghi:

- Batch ID.
- Đường dẫn cũ.
- Đường dẫn mới.
- Kích thước.
- SHA-256 checksum.
- Thời điểm.
- Lý do phân loại.
- Trạng thái validation.
- Compatibility link nếu có.
- Rollback instruction.

Không ghi đè file trùng tên. Duplicate vào `Inbox/Duplicates-Review`; file chưa xác
định owner vào `Inbox/Unclassified`.

## 10. Git và large files

- Git theo dõi control documents, code, test, manifests và migration records.
- Không theo dõi `.env`, credential, cache, dependency directories, render tạm hoặc
  large source media.
- Media rollback dựa trên migration manifest và checksum.
- Mỗi migration batch là một commit riêng khi có thể.
- Không dùng `git add .`; stage đúng file thuộc batch.
- Không push nếu chưa có yêu cầu trực tiếp.

## 11. Validation

Workspace cung cấp một lệnh tổng hợp:

```bash
npm run workspace:check
```

Lệnh phải kiểm tra:

- File count trước và sau.
- Checksum nguồn và đích.
- Missing files và accidental overwrite.
- Absolute path cũ ngoài migration history.
- Root startup files và department README.
- Đồng bộ quy tắc giữa `AGENTS.md` và `CLAUDE.md`.
- Secret patterns trong tracked files.
- Node MCP tests.
- Python tests liên quan.
- Media metadata cho các file chính.
- Asset references của carousel và deliverables.

## 12. Tiêu chí hoàn tất

Migration chỉ hoàn tất khi:

1. Không thất lạc hoặc ghi đè file.
2. Mọi artifact có owner rõ ràng hoặc nằm trong Inbox có lý do.
3. Mọi path được agent sử dụng đã cập nhật.
4. Startup protocol có thể lần tới đúng source of truth.
5. Tests và workspace validation pass hoặc limitation được ghi rõ.
6. Không có secret được đưa vào Git.
7. Approved và Published không bị suy luận từ tên file hoặc render.
8. Migration records đủ để quay lại từng batch.

## 13. Ngoài phạm vi

- Không thay đổi canonical TravelFrame notes trong Side Agency vault.
- Không publish content hoặc bật ManyChat automation.
- Không refresh live social metrics.
- Không xem thủ công toàn bộ 84 video chỉ để phân loại.
- Không xóa duplicate hoặc archive source mà chưa review.
- Không tạo remote Git hoặc push.
