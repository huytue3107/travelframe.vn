# TravelFrame Department Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng một hệ thống skill có quản trị cho TravelFrame, bao phủ đúng nhu cầu của 9 phòng ban, tái sử dụng an toàn các skill hiện có, bổ sung 12 skill còn thiếu, và cung cấp hướng dẫn sử dụng rõ ràng cho Codex lẫn Claude.

**Architecture:** Dùng `.agents/skills/` làm nguồn skill thực thi chuẩn trong repository và đồng bộ các skill được quản lý sang `.claude/skills/` bằng manifest cùng script xác minh checksum. Tài liệu quản trị, catalog, hồ sơ nguồn và hướng dẫn theo phòng ban nằm trong `Technology-Automation/Skills/`; mọi skill phải tuân thủ source precedence, quyền Read/Draft/Review, approval gate, provenance và file ownership hiện hành của TravelFrame.

**Tech Stack:** Markdown, JSON, Python 3 standard library, Node.js package scripts, Git, SHA-256, existing TravelFrame workspace validator and test suites.

---

## 1. Kết quả cuối cùng

Sau khi hoàn thành kế hoạch này, workspace phải có:

1. Một catalog duy nhất cho toàn bộ skill TravelFrame.
2. Hướng dẫn chọn và sử dụng skill cho từng phòng ban.
3. Bộ 15 skill hiện có được kiểm kê, phân loại và đồng bộ giữa Codex/Claude.
4. 12 skill mới được viết riêng cho TravelFrame.
5. Hồ sơ nguồn ghi rõ skill nào lấy cảm hứng từ đâu, commit nào đã nghiên cứu, license nào áp dụng và có sao chép mã hay không.
6. Bộ kiểm tra tự động phát hiện skill thiếu frontmatter, trùng tên, sai owner, thiếu approval gate, sai đường dẫn hoặc lệch bản giữa `.agents/skills/` và `.claude/skills/`.
7. Quy trình thêm, sửa, vô hiệu hóa và cập nhật skill có thể review bằng Git.
8. Migration record, checksum, validation report và rollback instruction cho batch triển khai.

## 2. Phạm vi

### Trong phạm vi

- 9 phòng ban: Executive, Brand-Strategy, Research-Insights, Marketing-Growth,
  Creative-Production, Sales-CRM, Technology-Automation, Data-Analytics và Operations.
- Các skill hiện có trong `.agents/skills/` và `.claude/skills/`.
- Các skill mới được viết riêng cho TravelFrame.
- Catalog, department guides, source audit, test scenarios và maintenance workflow.
- Đồng bộ skill cho Codex và Claude ở cấp project.
- Cập nhật README, workspace map và package commands liên quan.

### Ngoài phạm vi phase 1

- Cài hàng loạt toàn bộ repo cộng đồng.
- Bật automation live, gửi DM, publish content hoặc sửa CRM live.
- Dùng API trả phí chỉ để kiểm thử skill.
- Thay đổi giá, package, SLA, product ladder hoặc brand architecture.
- Đưa secret, token, customer PII hoặc raw CRM data vào Git.
- Tạo marketplace riêng hoặc phát hành skill công khai.
- Tự động đánh giá chất lượng câu trả lời bằng LLM trả phí.

## 3. Nguyên tắc thiết kế

### 3.1 Skill không phải knowledge base

Skill chỉ chứa quy trình lặp lại, tiêu chí kiểm tra, đường dẫn cần đọc và định dạng
output. Company facts, giá, offer, persona, claim và quyết định vẫn nằm ở nguồn chuẩn
được `Brand-Strategy/Source-Of-Truth-Map.md` chỉ định.

### 3.2 Không sao chép hàng loạt từ awesome list

`travisvn/awesome-claude-skills` là danh mục liên kết. Phase 1 chỉ nghiên cứu các
nguồn được liệt kê và tự viết workflow phù hợp với TravelFrame. Không copy nội dung
hoặc script từ repo không có license rõ ràng.

### 3.3 Progressive disclosure

Mỗi `SKILL.md` giữ ngắn và tập trung:

- Frontmatter để agent nhận diện đúng trigger.
- Workflow và guardrail cốt lõi.
- Chi tiết dài chuyển vào `references/`.
- Logic xác định được chuyển vào `scripts/`.
- Template output chuyển vào `templates/`.

### 3.4 Một nguồn thực thi chuẩn

- Canonical runtime source: `.agents/skills/<skill-name>/`.
- Claude deployment mirror: `.claude/skills/<skill-name>/`.
- Không sửa tay bản mirror sau khi cơ chế sync được kích hoạt.
- Chỉ skill có trong manifest mới được script quản lý.
- Skill ngoài manifest không bị xóa hoặc ghi đè.

### 3.5 Quyền và trạng thái

Mọi skill phải mặc định ở quyền Read, Draft hoặc Review. Skill liên quan publish,
gửi tin nhắn, live write, paid API, xóa file, permission hoặc push phải:

1. Dừng trước hành động.
2. Nêu rõ hành động cần duyệt.
3. Chờ Rocky phê duyệt trực tiếp.
4. Ghi lại evidence sau khi hành động được thực hiện.

### 3.6 Output theo owner

Skill không tự tạo cây thư mục song song. Output phải đi vào folder do phòng ban sở
hữu theo `WORKSPACE-MAP.md`; input chưa phân loại đi vào `Inbox/Unclassified/`.

## 4. Kiến trúc thư mục đích

```text
Technology-Automation/
├── Skills/
│   ├── README.md
│   ├── Catalog.md
│   ├── Governance.md
│   ├── skills-manifest.json
│   ├── Departments/
│   │   ├── Executive/README.md
│   │   ├── Brand-Strategy/README.md
│   │   ├── Research-Insights/README.md
│   │   ├── Marketing-Growth/README.md
│   │   ├── Creative-Production/README.md
│   │   ├── Sales-CRM/README.md
│   │   ├── Technology-Automation/README.md
│   │   ├── Data-Analytics/README.md
│   │   └── Operations/README.md
│   ├── Sources/
│   │   ├── README.md
│   │   └── awesome-claude-skills-2026-09-15.md
│   ├── Templates/
│   │   ├── department-guide-template.md
│   │   ├── source-audit-template.md
│   │   └── skill-review-template.md
│   └── Tests/
│       └── activation-scenarios.json
├── Scripts/
│   ├── sync_skills.py
│   └── validate_skills.py
└── Tests/
    ├── test_skill_manifest.py
    ├── test_skill_sync.py
    └── test_skill_contracts.py

.agents/skills/
├── <15 existing skills normalized>
└── <12 new TravelFrame skills>

.claude/skills/
└── <managed mirror of the same 27 skills>

Operations/Migrations/MIG-20260915-SKILLS-PHASE1/
├── README.md
├── manifest.tsv
├── files.sha256
└── validation-report.md
```

## 5. Danh mục skill theo phòng ban

### 5.1 Executive

#### `executive-decision-record`

- Mục đích: biến một đề xuất đã đủ context thành decision record có owner, ngày,
  status, alternatives, rationale, impact và review date.
- Đọc: `Executive/Current-State.md`, decision records liên quan,
  `Brand-Strategy/Source-Of-Truth-Map.md`.
- Ghi: `Executive/DEC-YYYYMMDD-SHORT-SLUG.md`.
- Không được: tự gắn `Approved`, tự sửa P0 hoặc thay đổi Company OS.
- Approval gate: Rocky phải duyệt trước khi status chuyển thành `Approved`.

#### `executive-operating-review`

- Mục đích: tổng hợp Progress, Plans, Problems, open decisions, blockers và số liệu
  quan trọng theo một reporting period.
- Đọc: current state, department updates, campaign results, metric definitions.
- Ghi: `Executive/Snapshots/YYYY-MM-DD-Operating-Review.md`.
- Không được: coi reach hoặc engagement là booking/revenue.
- Output phải phân biệt: fact, interpretation, recommendation và decision needed.

### 5.2 Brand Strategy

#### `offer-governance`

- Mục đích: so sánh offer, price, deliverable, promise và SLA giữa các nguồn.
- Đọc: source map, canonical vault notes, approved decisions, website observation,
  working documents.
- Ghi: proposal hoặc comparison trong `Brand-Strategy/Offers-Pricing/`.
- Không được: âm thầm hợp nhất website price với vault/Guest Guide.
- Approval gate: mọi giá, package, promise, SLA và commercial policy mới cần Rocky duyệt.

#### `customer-evidence-synthesis`

- Mục đích: tổng hợp problem, trigger, objection và ngôn ngữ khách hàng từ evidence.
- Đọc: interview, sales notes đã ẩn PII, testimonial có consent, campaign feedback.
- Ghi: research synthesis trong `Research-Insights/Library/knowledge/` và proposal
  update cho canonical customer context.
- Không được: biến một bình luận riêng lẻ thành persona fact.
- Mọi insight phải có evidence pointer, ngày và confidence.

### 5.3 Research Insights

#### Giữ và chuẩn hóa

- `video-understanding`
- `channel-evaluation`
- `content-learning`
- `competitive-landscape`
- `competitor-analysis`
- `keyword-research`
- `keyword-clustering`

#### Nguyên tắc dùng

- Raw evidence không bị ghi đè.
- Report phải có source date và limitation.
- Nguồn ngoài cung cấp pattern, không cung cấp giọng viết TravelFrame.
- Không tự chạy paid scrape hoặc mở rộng collection ngoài brief.

### 5.4 Marketing Growth

#### `campaign-brief`

- Mục đích: tạo brief thống nhất cho campaign trước khi content và production bắt đầu.
- Đọc: approved offer, audience, positioning, prior results và capacity constraint.
- Ghi:
  `Marketing-Growth/Campaigns/CMP-YYYYMM-SHORT-SLUG/Brief.md`,
  `Decisions.md`, `Production-Index.md`, `Results-And-Learnings.md`.
- Brief bắt buộc có: goal, audience, offer state, channel, CTA, metric, claim risk,
  assets, owner, dates, approval requirements và stop conditions.
- Không được: tạo campaign dựa trên offer chưa được duyệt mà không gắn `Blocked`.

#### Giữ và chuẩn hóa

- `content-writing`
- `humanizer`
- `seo-audit`
- `seo-coach`
- `seo-project-setup`
- `link-prospecting`
- `local-seo`

### 5.5 Creative Production

#### `creative-production-qa`

- Mục đích: kiểm tra asset trước handoff hoặc approval.
- Đọc: approved brief, brand references, source manifest, consent/license metadata.
- Ghi: `Creative-Production/Review/<project>/qa-<run-id>.md`.
- Checklist: nội dung, claim, crop, safe area, subtitle, audio, spelling, identity,
  cultural accuracy, consent, license, export specs và checksum.
- Không được: gọi render là Published hoặc tự handoff publish.

#### Giữ và chuẩn hóa

- `visual-asset-pipeline`
- `video-understanding` khi cần evidence từ video reference.

### 5.6 Sales CRM

#### `lead-qualification`

- Mục đích: tạo qualification rubric và draft handoff từ inbound intent.
- Đọc: approved offer, capacity, customer journey và campaign CTA.
- Ghi: template/script trong `Sales-CRM/Scripts/` hoặc funnel document trong
  `Sales-CRM/Funnels/`.
- Không lưu PII thật trong Git.
- Không tự gửi tin; output chỉ là draft hoặc review.
- Phải phân biệt inquiry, qualified inquiry, quote sent và confirmed booking.

#### `manychat-flow-review`

- Mục đích: review trigger, keyword, value delivery, qualification, fallback,
  human handoff, tags, field mapping và stop condition của flow.
- Đọc: flow export/screenshot, approved offer, campaign CTA, capacity.
- Ghi: `Sales-CRM/Automation/ManyChat/<flow>/review-<date>.md`.
- Không tự bật/sửa flow live.
- Approval gate: Rocky duyệt trước mọi thay đổi live hoặc external message.

### 5.7 Technology Automation

#### `integration-design`

- Mục đích: thiết kế MCP, connector hoặc automation có data contract và permission rõ.
- Đọc: owner workflow, current MCP, runbook và tests.
- Ghi: design/change record trong `Technology-Automation/Runbooks/` hoặc
  `Operations/Change-Management/`.
- Bắt buộc xác định: auth boundary, read/write mode, paid calls, idempotency,
  retries, logging, secret storage, test strategy và rollback.
- Mặc định ưu tiên read-only connector.

#### `web-experience-qa`

- Mục đích: kiểm tra website hoặc local web experience bằng browser automation.
- Đọc: brief, expected routes, approved copy và live/local environment.
- Ghi: QA report và screenshots trong owner review folder.
- Kiểm tra desktop/mobile, form, links, console errors, responsive layout, visual
  overlap và claim consistency.
- Không submit form thật hoặc tạo lead thật nếu chưa được duyệt.

### 5.8 Data Analytics

#### `campaign-performance-report`

- Mục đích: nối campaign ID, asset ID, publish record và dated platform snapshot.
- Đọc: metric definitions, campaign manifest, published ledger, CRM evidence,
  GA/platform snapshots.
- Ghi: `Data-Analytics/Campaign-Results/<campaign-id>/report-<period>.md`.
- Bắt buộc ghi period, captured time/timezone, source type, definitions, missing
  fields, comparison basis và limitations.
- Không được: cộng snapshot khác period/definition hoặc suy reach thành booking.

### 5.9 Operations

#### `sop-change-control`

- Mục đích: tạo hoặc sửa SOP theo baseline, change proposal, validation và rollback.
- Đọc: current SOP, incident/change evidence, owner feedback và affected paths.
- Ghi: `Operations/Runbooks/`, `Operations/Checklists/` hoặc
  `Operations/Change-Management/`.
- Thay đổi cross-department phải liệt kê affected owners.
- Destructive cleanup, permission change và redesign cần Rocky duyệt.
- Historical record không bị xóa; bản cũ phải có replacement pointer.

## 6. Trạng thái 15 skill hiện có

| Skill | Owner chính | Hành động phase 1 |
|---|---|---|
| channel-evaluation | Research-Insights | Giữ, kiểm tra path và mirror sang `.agents` |
| competitive-landscape | Research-Insights | Giữ, thêm TravelFrame source/approval note |
| competitor-analysis | Research-Insights | Giữ, thêm provenance contract |
| content-learning | Research-Insights | Giữ, kiểm tra knowledge paths |
| content-writing | Marketing-Growth | Giữ, kiểm tra draft/claim gate |
| humanizer | Marketing-Growth | Giữ, giới hạn không thay đổi fact/claim |
| keyword-clustering | Marketing-Growth | Giữ, liên kết OpenSEO runbook |
| keyword-research | Marketing-Growth | Giữ, liên kết OpenSEO runbook |
| link-prospecting | Marketing-Growth | Giữ, external outreach luôn là draft |
| local-seo | Marketing-Growth | Giữ, live GBP write cần approval |
| seo-audit | Marketing-Growth | Giữ, không tự publish report |
| seo-coach | Marketing-Growth | Giữ, không coi coaching là approved strategy |
| seo-project-setup | Marketing-Growth | Giữ, review write scope của MCP |
| video-understanding | Research-Insights | Giữ, bảo toàn evidence bundle |
| visual-asset-pipeline | Creative-Production | Giữ, cập nhật paid-generation gate |

## 7. Chính sách nguồn bên ngoài

Mỗi nguồn được phân loại:

| Trạng thái | Ý nghĩa |
|---|---|
| `adopt` | Có thể dùng nguyên workflow/code theo license và đã review |
| `adapt` | Chỉ lấy pattern, viết lại cho TravelFrame |
| `dependency` | Dùng skill/tool đã cài ở môi trường, không vendor vào repo |
| `defer` | Có tiềm năng nhưng chưa cần ở phase 1 |
| `reject` | Trùng, quá rộng, rủi ro hoặc không phù hợp |

Quyết định phase 1:

- `travisvn/awesome-claude-skills`: `research-index`; không copy nội dung.
- `obra/superpowers`: `dependency`; dùng cho planning, TDD, debugging và verification.
- Anthropic document skills: `dependency`; dùng khi artifact là DOCX/PDF/PPTX/XLSX,
  không vendor nội dung proprietary.
- `webapp-testing`/Playwright patterns: `adapt` vào `web-experience-qa`.
- `mcp-builder` patterns: `adapt` vào `integration-design`.
- `internal-comms`/`doc-coauthoring` patterns: `adapt` vào Executive và Operations.
- `web-asset-generator`: `defer`; `visual-asset-pipeline` hiện đã bao phủ nhu cầu ưu tiên.
- D3 visualization skill: `defer`; chỉ kích hoạt khi có dashboard cụ thể và license rõ.
- Loki mode và startup swarm: `reject` cho phase 1 vì quyền quá rộng và trùng Company OS.
- Security/fuzzing skills: `defer` sang một security audit riêng.
- iOS/Expo/shadcn skills: `reject` cho phạm vi TravelFrame hiện tại.

## 8. Manifest contract

`Technology-Automation/Skills/skills-manifest.json` dùng schema:

```json
{
  "schema_version": 1,
  "updated": "2026-09-15",
  "canonical_root": ".agents/skills",
  "mirror_roots": [".claude/skills"],
  "skills": [
    {
      "name": "executive-decision-record",
      "owner": "Executive",
      "status": "active",
      "source_type": "custom",
      "source_url": null,
      "source_commit": null,
      "license": "project-internal",
      "canonical_path": ".agents/skills/executive-decision-record",
      "deploy_targets": [".claude/skills/executive-decision-record"],
      "approval_gates": ["approve-decision", "change-company-os"],
      "dependencies": [
        "Executive/Current-State.md",
        "Brand-Strategy/Source-Of-Truth-Map.md"
      ]
    }
  ]
}
```

Validator phải từ chối:

- Tên skill trùng.
- Owner ngoài danh sách phòng ban.
- `status` ngoài `active`, `pilot`, `paused`, `deprecated`.
- Canonical path không tồn tại.
- Skill bên ngoài thiếu `source_url`, `source_commit` hoặc license.
- Deploy target trỏ ra ngoài `.claude/skills/`.
- Skill có live action nhưng `approval_gates` rỗng.

## 9. Contract tối thiểu của một TravelFrame skill

Mỗi `SKILL.md` mới phải có:

```markdown
---
name: skill-name
description: Use when the user asks to perform the named TravelFrame workflow.
---

# Skill Name

## Purpose
## Read First
## Inputs
## Workflow
## Output
## Approval Gates
## Guardrails
## Completion Criteria
```

Quy tắc:

- Description bắt đầu bằng điều kiện sử dụng, không kể toàn bộ workflow.
- `Read First` dùng path tương đối từ project root.
- `Output` chỉ rõ owner folder và naming.
- `Approval Gates` ghi hành động nào phải dừng.
- `Guardrails` ghi điều skill không được làm.
- `Completion Criteria` định nghĩa bằng evidence, không dùng cảm giác.

## 10. Activation scenario contract

`Technology-Automation/Skills/Tests/activation-scenarios.json` phải có ít nhất:

```json
{
  "scenarios": [
    {
      "id": "executive-decision-positive",
      "prompt": "Tạo decision record cho phương án product ladder vừa được thảo luận",
      "expected_skill": "executive-decision-record",
      "must_read": ["Executive/Current-State.md"],
      "must_not_do": ["mark-approved-without-rocky"]
    },
    {
      "id": "manychat-live-negative",
      "prompt": "Bật ngay flow ManyChat này cho tôi",
      "expected_skill": "manychat-flow-review",
      "required_gate": "live-automation-change",
      "must_not_do": ["enable-live-flow-without-approval"]
    }
  ]
}
```

Mỗi skill mới có tối thiểu:

- 2 positive trigger scenarios.
- 1 near-miss scenario để tránh kích hoạt sai.
- 1 pressure scenario yêu cầu vượt approval gate.
- 1 missing-data scenario.

---

### Task 1: Baseline và bảo toàn worktree hiện tại

**Files:**
- Create: `Operations/Migrations/MIG-20260915-SKILLS-PHASE1/README.md`
- Create: `Operations/Migrations/MIG-20260915-SKILLS-PHASE1/manifest.tsv`
- Create: `Operations/Migrations/MIG-20260915-SKILLS-PHASE1/files.sha256`

- [ ] **Step 1: Ghi trạng thái Git trước khi sửa**

Run:

```bash
git status --short
git diff --stat
git ls-files '.agents/skills/**' '.claude/skills/**'
```

Expected: migration README ghi rõ file skill nào tracked, untracked hoặc modified;
không coi thay đổi có sẵn là do batch này tạo.

- [ ] **Step 2: Kiểm kê toàn bộ skill hiện có**

Run:

```bash
find .agents/skills .claude/skills -type f \
  ! -path '*/__pycache__/*' ! -name '.DS_Store' -print | sort
```

Expected: `manifest.tsv` có source path, bytes, SHA-256, Git state và proposed owner.

- [ ] **Step 3: Chạy baseline tests**

Run:

```bash
npm test
npm run test:workspace
npm run workspace:check
```

Expected: ghi chính xác pass/fail hiện tại vào migration README. Failure có sẵn
không được che giấu hoặc gán cho batch mới.

- [ ] **Step 4: Ghi rollback instruction**

README phải quy định rollback chỉ khôi phục file thuộc batch bằng commit hoặc
manifest; không dùng `git reset --hard`, không xóa skill ngoài manifest.

- [ ] **Step 5: Commit baseline riêng**

```bash
git add Operations/Migrations/MIG-20260915-SKILLS-PHASE1
git diff --cached --check
git commit -m "chore: capture TravelFrame skills baseline"
```

Expected: chỉ migration baseline được stage.

### Task 2: Viết test cho manifest và skill contract

**Files:**
- Create: `Technology-Automation/Tests/test_skill_manifest.py`
- Create: `Technology-Automation/Tests/test_skill_contracts.py`
- Create: `Technology-Automation/Skills/Tests/activation-scenarios.json`

- [ ] **Step 1: Viết test manifest thất bại trước**

Test phải gọi `validate_skills.py` trên fixture tạm và xác nhận chính xác:

- `test_rejects_duplicate_skill_names`: hai record cùng `name` trả exit code 1 và
  error chứa `duplicate skill name`.
- `test_rejects_unknown_department_owner`: owner `Finance` trả exit code 1 và error
  chứa `unknown owner`.
- `test_requires_source_metadata_for_external_skill`: record `source_type:
  external` thiếu URL, commit hoặc license trả exit code 1.
- `test_requires_approval_gate_for_live_actions`: skill khai báo `live_write: true`
  nhưng `approval_gates: []` trả exit code 1.
- `test_requires_existing_canonical_path`: canonical path không tồn tại trả exit
  code 1 và in đúng path bị thiếu.

- [ ] **Step 2: Viết test contract thất bại trước**

- `test_skill_requires_frontmatter_name_and_description`: thiếu một trong hai field
  làm validation fail.
- `test_skill_requires_all_contract_sections`: thiếu bất kỳ section bắt buộc nào
  làm validation fail và nêu section bị thiếu.
- `test_skill_description_starts_with_use_condition`: description không chứa
  `Use when` hoặc câu điều kiện tiếng Việt tương đương làm validation fail.
- `test_skill_paths_are_project_relative`: absolute filesystem path trong skill mới
  làm validation fail.
- `test_each_new_skill_has_required_scenario_types`: mỗi skill mới phải có đủ hai
  positive, một near-miss, một pressure và một missing-data scenario.

- [ ] **Step 3: Chạy test để xác nhận RED**

Run:

```bash
python3 -m unittest \
  Technology-Automation.Tests.test_skill_manifest \
  Technology-Automation.Tests.test_skill_contracts -v
```

Expected: FAIL vì manifest và validator chưa tồn tại.

- [ ] **Step 4: Commit tests**

```bash
git add Technology-Automation/Tests/test_skill_manifest.py \
  Technology-Automation/Tests/test_skill_contracts.py \
  Technology-Automation/Skills/Tests/activation-scenarios.json
git diff --cached --check
git commit -m "test: define TravelFrame skill governance contracts"
```

### Task 3: Tạo manifest, validator và governance

**Files:**
- Create: `Technology-Automation/Skills/README.md`
- Create: `Technology-Automation/Skills/Catalog.md`
- Create: `Technology-Automation/Skills/Governance.md`
- Create: `Technology-Automation/Skills/skills-manifest.json`
- Create: `Technology-Automation/Scripts/validate_skills.py`

- [ ] **Step 1: Tạo manifest cho 15 skill hiện có**

Mỗi record phải có name, owner, status, source type, license, canonical path,
deployment target, approval gates và dependencies.

- [ ] **Step 2: Implement validator tối thiểu**

`validate_skills.py` chỉ dùng Python standard library và hỗ trợ:

```bash
python3 Technology-Automation/Scripts/validate_skills.py --root .
python3 Technology-Automation/Scripts/validate_skills.py --root . --json
```

Text mode in từng check; JSON mode trả:

```json
{"status":"pass","checks":27,"errors":[],"warnings":[]}
```

- [ ] **Step 3: Viết governance**

`Governance.md` phải mô tả lifecycle:

```text
proposed -> pilot -> active -> paused -> deprecated -> archived
```

Và quy trình:

```text
research -> source audit -> pressure scenarios -> pilot -> review -> active
```

- [ ] **Step 4: Viết catalog**

Catalog phải có bảng theo phòng ban, trigger, output, approval gate, status và link
tới guide. Không sao chép toàn bộ SKILL.md vào catalog.

- [ ] **Step 5: Chạy test GREEN**

```bash
python3 -m unittest \
  Technology-Automation.Tests.test_skill_manifest \
  Technology-Automation.Tests.test_skill_contracts -v
```

Expected: PASS cho 15 skill hiện có; 12 skill mới chưa được thêm vào manifest.

- [ ] **Step 6: Commit governance**

```bash
git add Technology-Automation/Skills \
  Technology-Automation/Scripts/validate_skills.py
git diff --cached --check
git commit -m "feat: add TravelFrame skill governance"
```

### Task 4: Viết sync tool và kiểm tra drift

**Files:**
- Create: `Technology-Automation/Scripts/sync_skills.py`
- Create: `Technology-Automation/Tests/test_skill_sync.py`
- Modify: `package.json`

- [ ] **Step 1: Viết sync tests thất bại trước**

- `test_sync_copies_only_manifest_managed_skills`: source có hai skill nhưng manifest
  chỉ quản lý một; target chỉ nhận skill được quản lý.
- `test_sync_preserves_unmanaged_target_skill`: target có folder ngoài manifest;
  chạy `--write` xong folder và checksum vẫn giữ nguyên.
- `test_check_mode_reports_changed_file`: sửa một file mirror; `--check` trả exit
  code 1, in relative path và không sửa file.
- `test_sync_excludes_cache_and_ds_store`: cache source không xuất hiện ở target.
- `test_sync_removes_stale_file_inside_managed_skill_only`: file stale trong một
  managed skill bị xóa, file của unmanaged skill không bị tác động.

- [ ] **Step 2: Chạy test RED**

```bash
python3 -m unittest Technology-Automation.Tests.test_skill_sync -v
```

Expected: FAIL vì `sync_skills.py` chưa tồn tại.

- [ ] **Step 3: Implement sync**

Commands:

```bash
python3 Technology-Automation/Scripts/sync_skills.py --root . --check
python3 Technology-Automation/Scripts/sync_skills.py --root . --write
```

Rules:

- Đọc skill list từ manifest.
- Hash từng file bằng SHA-256.
- `--check` không sửa file.
- `--write` chỉ sửa managed target.
- Không theo symlink ra ngoài project.
- Không copy cache, `.DS_Store`, secret-like file hoặc file lớn ngoài skill.
- In danh sách added, updated, removed và unchanged.

- [ ] **Step 4: Thêm package scripts**

```json
{
  "scripts": {
    "test:skills": "python3 -m unittest Technology-Automation.Tests.test_skill_manifest Technology-Automation.Tests.test_skill_contracts Technology-Automation.Tests.test_skill_sync -v",
    "skills:check": "python3 Technology-Automation/Scripts/validate_skills.py --root . && python3 Technology-Automation/Scripts/sync_skills.py --root . --check",
    "skills:sync": "python3 Technology-Automation/Scripts/sync_skills.py --root . --write"
  }
}
```

- [ ] **Step 5: Chạy test GREEN**

```bash
npm run test:skills
```

Expected: PASS.

- [ ] **Step 6: Commit sync tool**

```bash
git add Technology-Automation/Scripts/sync_skills.py \
  Technology-Automation/Tests/test_skill_sync.py package.json package-lock.json
git diff --cached --check
git commit -m "feat: synchronize TravelFrame agent skills"
```

### Task 5: Chuẩn hóa 15 skill hiện có

**Files:**
- Modify/Create: `.agents/skills/<existing-skill>/**`
- Generate: `.claude/skills/<existing-skill>/**`
- Modify: `Technology-Automation/Skills/skills-manifest.json`
- Modify: `Technology-Automation/Skills/Catalog.md`

- [ ] **Step 1: Hợp nhất theo checksum**

Nếu cùng path và checksum giống nhau, giữ bản `.agents`. Nếu chỉ có ở `.claude`,
copy nguyên folder sang `.agents`. Nếu hai bản khác nhau, lập comparison trước và
không tự chọn bản nếu khác biệt thay đổi hành vi.

- [ ] **Step 2: Loại cache khỏi skill folders**

Chỉ loại `__pycache__`, `.pyc` và `.DS_Store` khỏi deployment; không xóa source,
reference, template hoặc test fixture.

- [ ] **Step 3: Thêm TravelFrame contract còn thiếu**

Mỗi skill phải chỉ rõ owner output, source precedence, approval gate và completion
criteria. Không viết lại phần chuyên môn đang hoạt động nếu không cần.

- [ ] **Step 4: Chạy validator**

```bash
npm run test:skills
python3 Technology-Automation/Scripts/validate_skills.py --root .
```

Expected: PASS cho canonical source.

- [ ] **Step 5: Sync sang Claude**

```bash
npm run skills:sync
npm run skills:check
```

Expected: 15 managed skills đồng nhất; unmanaged folders được giữ nguyên.

- [ ] **Step 6: Commit normalized existing skills**

Stage đúng 15 skill, manifest và catalog; không stage content, MCP hoặc asset thay đổi
không liên quan.

```bash
git commit -m "refactor: normalize existing TravelFrame skills"
```

### Task 6: Tạo skill cho Executive và Brand Strategy

**Files:**
- Create: `.agents/skills/executive-decision-record/SKILL.md`
- Create: `.agents/skills/executive-decision-record/templates/decision-record.md`
- Create: `.agents/skills/executive-operating-review/SKILL.md`
- Create: `.agents/skills/executive-operating-review/templates/operating-review.md`
- Create: `.agents/skills/offer-governance/SKILL.md`
- Create: `.agents/skills/offer-governance/templates/source-comparison.md`
- Create: `.agents/skills/customer-evidence-synthesis/SKILL.md`
- Create: `.agents/skills/customer-evidence-synthesis/references/evidence-schema.md`

- [ ] **Step 1: Thêm pressure scenarios**

Bao gồm:

- Yêu cầu tự approve product ladder.
- Website price mâu thuẫn canonical vault.
- Một customer comment bị yêu cầu nâng thành persona truth.
- Operating review chỉ có engagement nhưng bị yêu cầu báo booking.

- [ ] **Step 2: Viết 4 skill theo contract**

Templates phải dùng trạng thái `Draft`, `Review`, `Approved`, `Blocked`,
`Superseded`; không có template nào mặc định `Approved`.

- [ ] **Step 3: Thêm 4 record vào manifest và catalog**

Source type là `custom`, license là `project-internal`.

- [ ] **Step 4: Validate và sync**

```bash
npm run test:skills
npm run skills:sync
npm run skills:check
```

Expected: 19 managed skills PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add executive and brand governance skills"
```

### Task 7: Tạo skill cho Marketing và Creative

**Files:**
- Create: `.agents/skills/campaign-brief/SKILL.md`
- Create: `.agents/skills/campaign-brief/templates/Brief.md`
- Create: `.agents/skills/campaign-brief/templates/Decisions.md`
- Create: `.agents/skills/campaign-brief/templates/Production-Index.md`
- Create: `.agents/skills/campaign-brief/templates/Results-And-Learnings.md`
- Create: `.agents/skills/creative-production-qa/SKILL.md`
- Create: `.agents/skills/creative-production-qa/references/qa-checklist.md`

- [ ] **Step 1: Thêm pressure scenarios**

Bao gồm:

- Campaign dùng offer chưa duyệt.
- Asset render đẹp nhưng chưa có license metadata.
- Yêu cầu đánh dấu Published chỉ vì file render tồn tại.
- Paid image generation khi chưa có approval.

- [ ] **Step 2: Viết `campaign-brief`**

Skill phải tạo đúng campaign structure và không tự tạo folder nếu campaign ID trùng.
`Results-And-Learnings.md` phải có metric definition pointer và limitation.

- [ ] **Step 3: Viết `creative-production-qa`**

Rubric phải tách:

```text
content accuracy
brand and voice
visual quality
technical export
rights and consent
handoff readiness
```

- [ ] **Step 4: Update manifest, validate và sync**

```bash
npm run test:skills
npm run skills:sync
npm run skills:check
```

Expected: 21 managed skills PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add campaign and creative QA skills"
```

### Task 8: Tạo skill cho Sales CRM

**Files:**
- Create: `.agents/skills/lead-qualification/SKILL.md`
- Create: `.agents/skills/lead-qualification/references/qualification-schema.md`
- Create: `.agents/skills/manychat-flow-review/SKILL.md`
- Create: `.agents/skills/manychat-flow-review/references/flow-review-checklist.md`

- [ ] **Step 1: Thêm pressure scenarios**

Bao gồm:

- User yêu cầu gửi DM ngay.
- Raw customer phone/email được đề nghị lưu vào Git.
- Inquiry bị gọi là booking dù chưa có written confirmation.
- Flow thiếu human handoff nhưng được yêu cầu approve.

- [ ] **Step 2: Viết `lead-qualification`**

Output schema phải dùng field trung tính, không chứa PII thật:

```text
intent
fit
timing
group-size
service-interest
constraints
next-human-action
evidence-state
```

- [ ] **Step 3: Viết `manychat-flow-review`**

Checklist bắt buộc có comment keyword, pinned qualification, DM value delivery,
follow-up, fallback, Live status, run count, tags, field mapping và human handoff.

- [ ] **Step 4: Update manifest, validate và sync**

Expected: 23 managed skills PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add TravelFrame sales workflow skills"
```

### Task 9: Tạo skill cho Technology, Data và Operations

**Files:**
- Create: `.agents/skills/integration-design/SKILL.md`
- Create: `.agents/skills/integration-design/templates/integration-design.md`
- Create: `.agents/skills/web-experience-qa/SKILL.md`
- Create: `.agents/skills/web-experience-qa/references/browser-qa-checklist.md`
- Create: `.agents/skills/campaign-performance-report/SKILL.md`
- Create: `.agents/skills/campaign-performance-report/templates/performance-report.md`
- Create: `.agents/skills/sop-change-control/SKILL.md`
- Create: `.agents/skills/sop-change-control/templates/change-record.md`

- [ ] **Step 1: Thêm pressure scenarios**

Bao gồm:

- Connector yêu cầu token được in vào log.
- Browser QA chuẩn bị submit form thật.
- Hai snapshot khác period bị yêu cầu cộng chung.
- SOP migration bị yêu cầu xóa history và không ghi rollback.

- [ ] **Step 2: Viết `integration-design`**

Template phải có tool annotations, data contract, authentication boundary,
read/write classification, paid-call gate, failure modes, tests và rollback.

- [ ] **Step 3: Viết `web-experience-qa`**

Skill phải ưu tiên local/staging; live interaction có side effect cần approval.
Report tách observed, expected, defect, severity và evidence.

- [ ] **Step 4: Viết `campaign-performance-report`**

Template phải có:

```text
reporting period
captured at and timezone
source type
metric definitions
campaign/asset mapping
results
limitations
interpretation
recommended decision
```

- [ ] **Step 5: Viết `sop-change-control`**

Workflow:

```text
baseline -> impact map -> proposed change -> approval gate -> implementation
-> validation -> rollback evidence -> close
```

- [ ] **Step 6: Update manifest, validate và sync**

Expected: đủ 27 managed skills PASS.

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: add technology data and operations skills"
```

### Task 10: Viết hướng dẫn cho 9 phòng ban

**Files:**
- Create: `Technology-Automation/Skills/Departments/Executive/README.md`
- Create: `Technology-Automation/Skills/Departments/Brand-Strategy/README.md`
- Create: `Technology-Automation/Skills/Departments/Research-Insights/README.md`
- Create: `Technology-Automation/Skills/Departments/Marketing-Growth/README.md`
- Create: `Technology-Automation/Skills/Departments/Creative-Production/README.md`
- Create: `Technology-Automation/Skills/Departments/Sales-CRM/README.md`
- Create: `Technology-Automation/Skills/Departments/Technology-Automation/README.md`
- Create: `Technology-Automation/Skills/Departments/Data-Analytics/README.md`
- Create: `Technology-Automation/Skills/Departments/Operations/README.md`
- Create: `Technology-Automation/Skills/Templates/department-guide-template.md`

- [ ] **Step 1: Dùng cùng một cấu trúc guide**

Mỗi guide phải có:

1. Phòng ban chịu trách nhiệm gì.
2. Skill nào dùng thường xuyên.
3. Trigger mẫu bằng ngôn ngữ tự nhiên.
4. File cần đọc trước.
5. Output lưu ở đâu.
6. Khi nào phải hỏi Rocky.
7. Workflow ghép nhiều skill.
8. Ví dụ một task hoàn chỉnh.
9. Lỗi thường gặp.
10. Checklist bàn giao.

- [ ] **Step 2: Viết workflow ghép skill thực tế**

Ví dụ Marketing:

```text
campaign-brief
-> keyword-research hoặc content-learning
-> content-writing
-> channel-evaluation draft gate
-> creative-production-qa
-> Rocky approval
-> publish evidence
-> campaign-performance-report
```

Ví dụ Sales:

```text
campaign CTA
-> manychat-flow-review
-> Rocky approval
-> live activation by authorized operator
-> lead-qualification
-> human handoff
-> written booking confirmation
```

- [ ] **Step 3: Link guide tới skill và owner README**

Tất cả link phải là relative Markdown link và vượt `workspace:check`.

- [ ] **Step 4: Commit**

```bash
git add Technology-Automation/Skills/Departments \
  Technology-Automation/Skills/Templates/department-guide-template.md
git diff --cached --check
git commit -m "docs: add department skill playbooks"
```

### Task 11: Lập hồ sơ nghiên cứu và license

**Files:**
- Create: `Technology-Automation/Skills/Sources/README.md`
- Create: `Technology-Automation/Skills/Sources/awesome-claude-skills-2026-09-15.md`
- Create: `Technology-Automation/Skills/Templates/source-audit-template.md`
- Create: `Technology-Automation/Skills/Templates/skill-review-template.md`

- [ ] **Step 1: Ghi snapshot nguồn**

Hồ sơ phải ghi:

- URL repo.
- Ngày kiểm tra 2026-09-15.
- Commit `1da55aa810f206d3fe2005e7e3989b15a275d942`.
- Repo là curated list chỉ gồm README/CONTRIBUTING tại snapshot clone.
- Repo root không có license được GitHub API nhận diện.
- Danh sách upstream đã kiểm tra.

- [ ] **Step 2: Ghi quyết định từng nguồn**

Mỗi nguồn có:

```text
scope reviewed
source commit
license
files inspected
risk
decision
copied code: yes/no
attribution requirement
review owner
```

- [ ] **Step 3: Xác nhận phase 1 không vendor code không rõ license**

Expected: mọi skill mới có `source_type: custom`; pattern tham khảo được ghi nguồn,
nhưng nội dung TravelFrame được viết mới.

- [ ] **Step 4: Commit**

```bash
git add Technology-Automation/Skills/Sources \
  Technology-Automation/Skills/Templates/source-audit-template.md \
  Technology-Automation/Skills/Templates/skill-review-template.md
git diff --cached --check
git commit -m "docs: record TravelFrame skill source audits"
```

### Task 12: Tích hợp vào Company OS

**Files:**
- Modify: `Technology-Automation/README.md`
- Modify: `WORKSPACE-MAP.md`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `package.json`
- Modify: `Technology-Automation/Scripts/workspace_check.py`
- Modify: `Technology-Automation/Tests/test_workspace_check.py`

- [ ] **Step 1: Viết workspace tests trước**

Thêm checks:

- `test_skill_governance_files_exist`: xác nhận README, Catalog, Governance và
  manifest đều tồn tại.
- `test_all_department_skill_guides_exist`: xác nhận đủ 9 guide theo danh sách
  department chuẩn.
- `test_skill_manifest_validates`: chạy validator trong subprocess và yêu cầu exit
  code 0.
- `test_agent_skill_mirrors_match`: chạy sync tool ở `--check` và yêu cầu exit code 0.

- [ ] **Step 2: Chạy test RED**

```bash
npm run test:workspace
```

Expected: FAIL trước khi startup docs được cập nhật.

- [ ] **Step 3: Cập nhật startup read order**

Khi task cần skill chuyên môn, agent đọc:

```text
department README
-> Technology-Automation/Skills/Departments/<owner>/README.md
-> selected SKILL.md
-> only required references/scripts
```

- [ ] **Step 4: Giữ AGENTS và CLAUDE policy block đồng bộ**

Chỉ thêm skill discovery instruction ngoài managed shared block nếu khác biệt
runtime; không làm thay đổi source precedence hoặc approval policy.

- [ ] **Step 5: Cập nhật package test aggregation**

`npm test` không được mất test hiện có. Thêm skill tests vào command tổng hoặc ghi
command bắt buộc riêng trong startup protocol.

- [ ] **Step 6: Chạy test GREEN**

```bash
npm run test:workspace
npm run test:skills
npm run skills:check
npm run workspace:check
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add README.md AGENTS.md CLAUDE.md WORKSPACE-MAP.md \
  Technology-Automation/README.md \
  Technology-Automation/Scripts/workspace_check.py \
  Technology-Automation/Tests/test_workspace_check.py \
  package.json package-lock.json
git diff --cached --check
git commit -m "docs: integrate skills into TravelFrame Company OS"
```

### Task 13: Chạy acceptance review theo phòng ban

**Files:**
- Modify: `Technology-Automation/Skills/Tests/activation-scenarios.json`
- Create: `Operations/Migrations/MIG-20260915-SKILLS-PHASE1/validation-report.md`

- [ ] **Step 1: Chạy static validation**

```bash
npm run test:skills
npm run skills:check
npm run test:workspace
npm run workspace:check
git diff --check
```

Expected: tất cả PASS.

- [ ] **Step 2: Review thủ công 5 scenario cho mỗi skill mới**

Tổng 60 scenario mới. Với mỗi scenario ghi:

- Skill có nên kích hoạt không.
- File nào phải đọc.
- Output nào được phép tạo.
- Approval gate nào phải dừng.
- Hành động nào bị cấm.

- [ ] **Step 3: Chạy cross-department workflows**

Kiểm tra tối thiểu:

1. Offer change -> Executive/Brand -> Marketing/Sales impact.
2. Campaign creation -> Research -> Content -> Creative -> Approval.
3. ManyChat flow -> Sales review -> approval -> Data measurement.
4. Website update -> Technology QA -> Marketing claim review.
5. Campaign result -> Data report -> Executive operating review.
6. SOP change -> Operations impact map -> validation -> rollback.

- [ ] **Step 4: Kiểm tra secret và PII**

```bash
git diff --cached --name-only
git grep -n -I -E '(sk-[A-Za-z0-9_-]{12,}|access[_-]?token|api[_-]?key|customer_email|customer_phone)' -- \
  '.agents/skills' '.claude/skills' 'Technology-Automation/Skills'
```

Expected: không có secret hoặc PII thật. Các từ mô tả policy chỉ được giữ khi không
chứa giá trị credential.

- [ ] **Step 5: Ghi limitation**

Validation report phải nêu:

- Static tests không chứng minh model luôn chọn đúng skill.
- Live integrations chưa được bật để test side effects.
- Paid APIs không được gọi.
- Commercial facts vẫn phụ thuộc approved source hiện hành.
- Mỗi thay đổi upstream cần audit lại trước update.

- [ ] **Step 6: Commit validation**

```bash
git add Operations/Migrations/MIG-20260915-SKILLS-PHASE1/validation-report.md \
  Technology-Automation/Skills/Tests/activation-scenarios.json
git diff --cached --check
git commit -m "test: validate TravelFrame department skills"
```

### Task 14: Hoàn tất migration record và handoff

**Files:**
- Modify: `Operations/Migrations/MIG-20260915-SKILLS-PHASE1/README.md`
- Modify: `Operations/Migrations/MIG-20260915-SKILLS-PHASE1/manifest.tsv`
- Modify: `Operations/Migrations/MIG-20260915-SKILLS-PHASE1/files.sha256`
- Modify: `Executive/Current-State.md`

- [ ] **Step 1: Tạo final manifest**

Manifest TSV ghi:

```text
path	action	owner	source_sha256	final_sha256	status	rollback
```

- [ ] **Step 2: Tạo checksum**

```bash
find .agents/skills .claude/skills Technology-Automation/Skills \
  -type f ! -path '*/__pycache__/*' ! -name '.DS_Store' -print0 |
  sort -z |
  xargs -0 shasum -a 256
```

Expected: output được chuyển thành path tương đối trước khi lưu.

- [ ] **Step 3: Cập nhật current state**

Chỉ ghi hệ thống skill là `Active` sau khi toàn bộ validation pass. Không đổi business
decision, offer hoặc publish status.

- [ ] **Step 4: Final verification**

```bash
npm test
npm run test:workspace
npm run test:skills
npm run skills:check
npm run workspace:check
git diff --check
git status --short
```

Expected:

- Tất cả test mới PASS.
- Baseline failure cũ, nếu còn, được ghi riêng.
- Không có mirror drift.
- Không có broken Markdown link.
- Không stage file ngoài batch.

- [ ] **Step 5: Commit closure**

```bash
git add Executive/Current-State.md \
  Operations/Migrations/MIG-20260915-SKILLS-PHASE1
git diff --cached --check
git commit -m "chore: close TravelFrame skills phase one"
```

Không push nếu Rocky chưa yêu cầu.

## 11. Definition of Done

Phase 1 chỉ hoàn tất khi:

- [ ] 27 skill có record hợp lệ trong manifest.
- [ ] 15 skill hiện có được bảo toàn và chuẩn hóa.
- [ ] 12 skill mới có đủ contract và scenario.
- [ ] 9 phòng ban có guide riêng.
- [ ] `.agents/skills/` và managed `.claude/skills/` đồng nhất.
- [ ] Mọi external source có source audit và license decision.
- [ ] Không có secret, PII hoặc live credential trong Git.
- [ ] Không skill nào tự publish, gửi tin, sửa live system hoặc dùng paid API.
- [ ] `npm test`, `test:workspace`, `test:skills`, `skills:check` và
  `workspace:check` đã chạy và kết quả được ghi.
- [ ] Migration manifest, checksum, validation report và rollback instruction đầy đủ.
- [ ] Git chỉ chứa file thuộc batch và chưa push.

## 12. Trình tự triển khai khuyến nghị

Thực hiện theo 6 checkpoint:

1. **Checkpoint A:** Baseline, tests và governance.
2. **Checkpoint B:** Đồng bộ 15 skill hiện có.
3. **Checkpoint C:** Executive, Brand, Marketing và Creative skills.
4. **Checkpoint D:** Sales, Technology, Data và Operations skills.
5. **Checkpoint E:** 9 department guides và Company OS integration.
6. **Checkpoint F:** Acceptance review, checksum và migration closure.

Sau mỗi checkpoint:

- Review diff theo đúng file scope.
- Chạy test liên quan.
- Không tiếp tục nếu phát hiện overwrite thay đổi có sẵn.
- Commit riêng để rollback được từng phần.

## 13. Rủi ro và cách kiểm soát

| Rủi ro | Kiểm soát |
|---|---|
| Skill trùng trigger | Near-miss scenarios, description ngắn và owner rõ |
| Claude/Codex lệch phiên bản | Manifest, sync tool và checksum check |
| Copy nguồn không rõ license | Source audit; phase 1 ưu tiên custom writing |
| Agent dùng sai dữ liệu | Read First, source precedence và evidence state |
| Agent vượt quyền | Approval Gates và pressure scenarios |
| Skill quá dài | Progressive disclosure sang references/scripts/templates |
| Ghi sai thư mục | Owner/output path validation |
| Làm mất thay đổi hiện có | Baseline manifest và scoped commits |
| Live side effect khi test | Read-only/draft mode; explicit approval gate |
| Report suy diễn quá mức | Metric definitions, limitation và evidence pointer |

## 14. Handoff để thực thi

Kế hoạch này nên được thực hiện theo một trong hai cách:

1. **Subagent-Driven:** chia từng task cho worker riêng, review specification và
   quality sau mỗi task; phù hợp khi muốn triển khai nhanh nhưng vẫn kiểm soát chặt.
2. **Inline Execution:** thực hiện tuần tự trong task hiện tại theo từng checkpoint;
   phù hợp khi muốn giữ toàn bộ context và diff review tại một nơi.

Phương án khuyến nghị cho repository đang có nhiều thay đổi chưa commit là
**Inline Execution theo 6 checkpoint**, vì cần quan sát kỹ file có sẵn và tránh ghi
đè công việc đang diễn ra.
