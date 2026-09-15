# TravelFrame Company Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the TravelFrame local workspace into the approved department-based Company OS without losing files, provenance, tests, or agent startup context.

**Architecture:** Keep root startup files and `.claude/` discoverable, move business artifacts into department-owned folders, and update every internal path reference in the same batch as its move. Protect text and code with local Git; protect large media with SHA-256 migration manifests and batch-specific rollback records.

**Tech Stack:** Markdown, Git, Node.js 22+, Python 3 standard library, existing MCP SDK, shell scripts, existing unittest and Node test suites.

---

### Task 1: Capture Baseline and Add Repository Safety

**Files:**
- Create: `.gitignore`
- Create: `Operations/Migrations/2026-09-15-baseline/files.sha256`
- Create: `Operations/Migrations/2026-09-15-baseline/inventory.tsv`
- Create: `Operations/Migrations/2026-09-15-baseline/dependencies.txt`
- Create: `Operations/Migrations/2026-09-15-baseline/README.md`

- [ ] **Step 1: Record the pre-migration test baseline**

Run:

```bash
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
```

Expected: record the exact pass/fail counts in the baseline README. Pre-existing
failures are allowed only when documented before migration.

- [ ] **Step 2: Create a strict root `.gitignore`**

Include:

```gitignore
.DS_Store
.env
.env.*
!.env.example
node_modules/
__pycache__/
*.pyc
.pytest_cache/
.nuxt/
.output/
dist/
build/

# Large and generated business assets are protected by migration manifests.
Creative-Production/Assets/Raw/
Creative-Production/Projects/*/Renders/
Creative-Production/Review/
Research-Insights/Library/Videos/
Research-Insights/Library/Transcripts/
```

- [ ] **Step 3: Generate baseline inventory and checksums**

Use null-safe file traversal and exclude `.git`, `node_modules`, `.env`, caches and
`.DS_Store`. `inventory.tsv` contains relative path, bytes and file type.
`files.sha256` contains SHA-256 plus relative path for every included file.

- [ ] **Step 4: Capture dependency references**

Run a workspace search for:

```text
/Users/macbook/Codex GPT/travelframe.vn
Source video
reference-library
carousels
travelframe-guest-guide
output/
mcp/
scripts/
tests/
```

Write results to `dependencies.txt`, excluding binary files and migration history.

- [ ] **Step 5: Verify no secret is staged**

Run:

```bash
git status --short
git diff --cached --name-only
git check-ignore -v .env node_modules
```

Expected: `.env` and `node_modules` are ignored; no credential file is staged.

- [ ] **Step 6: Commit baseline**

```bash
git add .gitignore Operations/Migrations/2026-09-15-baseline
git diff --cached --check
git commit -m "chore: capture TravelFrame workspace baseline"
```

### Task 2: Build the Company OS Control Plane

**Files:**
- Create: `README.md`
- Create: `AGENTS.md`
- Create: `CLAUDE.md`
- Create: `WORKSPACE-MAP.md`
- Create: `Inbox/README.md`
- Create: `Executive/README.md`
- Create: `Executive/Current-State.md`
- Create: `Brand-Strategy/README.md`
- Create: `Brand-Strategy/Source-Of-Truth-Map.md`
- Create: `Research-Insights/README.md`
- Create: `Marketing-Growth/README.md`
- Create: `Creative-Production/README.md`
- Create: `Sales-CRM/README.md`
- Create: `Technology-Automation/README.md`
- Create: `Data-Analytics/README.md`
- Create: `Operations/README.md`
- Create: `Archive/README.md`

- [ ] **Step 1: Write a startup-contract test**

Create a temporary validation command that fails unless every root startup file,
department README, current-state file and source map exists.

- [ ] **Step 2: Create root startup documents**

`README.md` must define company identity, architecture, read order, source precedence,
department ownership, lifecycle states, common workflows and first commands.

`AGENTS.md` and `CLAUDE.md` must contain synchronized operational rules while allowing
tool-specific headings. Both must define Read/Draft/Review defaults and approval gates.

- [ ] **Step 3: Create department READMEs**

Each file must contain Purpose, Responsibilities, Inputs, Outputs, Source of truth,
Folder structure, Workflow, Approval requirements, Naming conventions, Archive policy
and Related departments.

- [ ] **Step 4: Create current state and source map**

`Executive/Current-State.md` records dated P0/P1/P2 decisions and clearly distinguishes
approved, working, snapshot, unverified and open decision.

`Brand-Strategy/Source-Of-Truth-Map.md` maps the canonical Side Agency TravelFrame notes
without copying their contents.

- [ ] **Step 5: Run startup validation**

Expected: all required startup paths exist and `AGENTS.md`/`CLAUDE.md` policy blocks
match.

- [ ] **Step 6: Commit control plane**

```bash
git add README.md AGENTS.md CLAUDE.md WORKSPACE-MAP.md Inbox Executive Brand-Strategy Research-Insights Marketing-Growth Creative-Production Sales-CRM Technology-Automation Data-Analytics Operations/README.md Archive
git diff --cached --check
git commit -m "docs: add TravelFrame Company OS control plane"
```

### Task 3: Add Deterministic Workspace Validation

**Files:**
- Create: `Technology-Automation/Scripts/workspace_check.py`
- Create: `Technology-Automation/Tests/test_workspace_check.py`
- Modify: `package.json`

- [ ] **Step 1: Write failing tests**

Tests must cover:

```python
def test_required_startup_files_exist(): ...
def test_department_readmes_exist(): ...
def test_agent_policy_blocks_match(): ...
def test_no_tracked_secret_paths(): ...
def test_no_legacy_absolute_paths_outside_migrations(): ...
def test_markdown_links_to_local_files_resolve(): ...
```

- [ ] **Step 2: Verify the tests fail before implementation**

Run:

```bash
python3 -m unittest Technology-Automation.Tests.test_workspace_check -v
```

Expected: FAIL because `workspace_check.py` does not exist.

- [ ] **Step 3: Implement the validator**

Use Python standard library only. The script accepts `--root`, prints one line per
check, and exits nonzero when any required check fails.

- [ ] **Step 4: Add package commands**

Add:

```json
"test:workspace": "python3 -m unittest discover -s Technology-Automation/Tests -p 'test_*.py'",
"workspace:check": "python3 Technology-Automation/Scripts/workspace_check.py --root ."
```

- [ ] **Step 5: Run tests**

```bash
npm run test:workspace
npm run workspace:check
```

Expected: PASS before migration-specific legacy-path checks are enabled.

- [ ] **Step 6: Commit validator**

```bash
git add package.json Technology-Automation/Scripts Technology-Automation/Tests
git diff --cached --check
git commit -m "test: add workspace structure validation"
```

### Task 4: Migrate Technology and Preserve Executable Paths

**Files:**
- Move: `mcp/` to `Technology-Automation/MCP/`
- Move: `scripts/` to `Technology-Automation/Scripts/legacy/`
- Move: `tests/` to `Technology-Automation/Tests/legacy/`
- Modify: `package.json`
- Modify: `.claude/agents/*.md`
- Modify: `.claude/skills/**/*.md`
- Modify: scripts and tests containing moved paths
- Create: `Operations/Migrations/MIG-20260915-TECH/manifest.tsv`
- Create: `Operations/Migrations/MIG-20260915-TECH/README.md`

- [ ] **Step 1: Write the migration manifest before moving**

Record old path, new path, bytes and SHA-256 for every file in the batch.

- [ ] **Step 2: Move the three technology directories**

Use filesystem moves; do not copy-and-delete.

- [ ] **Step 3: Update package commands**

Point MCP and tests to:

```text
Technology-Automation/MCP/travelframe-readonly.mjs
Technology-Automation/Tests/legacy/mcp/travelframe-readonly.test.mjs
```

- [ ] **Step 4: Update internal documentation and scripts**

Replace path references only when they identify the moved executable location.
Do not modify historical migration records.

- [ ] **Step 5: Verify**

```bash
npm test
python3 -m unittest discover -s Technology-Automation/Tests/legacy -p 'test_*.py'
npm run workspace:check
```

- [ ] **Step 6: Commit technology migration**

Stage only technology paths, updated references and the batch record.

### Task 5: Migrate Research and Knowledge Assets

**Files:**
- Move: `reference-library/` to `Research-Insights/Library/`
- Modify: `.claude/agents/*.md`
- Modify: `.claude/skills/**/*.md`
- Modify: `Technology-Automation/Scripts/legacy/channel-agent/*`
- Modify: `Technology-Automation/Tests/legacy/**/*`
- Create: `Operations/Migrations/MIG-20260915-RESEARCH/manifest.tsv`
- Create: `Operations/Migrations/MIG-20260915-RESEARCH/README.md`

- [ ] **Step 1: Create pre-move manifest**

Include all research files except caches. Preserve existing run directories and
provenance sidecars as atomic bundles.

- [ ] **Step 2: Move the library**

Move the directory without changing filenames or internal run IDs.

- [ ] **Step 3: Update path contracts**

Replace `reference-library/` with `Research-Insights/Library/` in active agents,
skills, scripts and tests. Historical reports retain their original evidence text
unless a live checker requires a resolvable pointer; document any retained legacy
pointer.

- [ ] **Step 4: Verify research workflows**

Run channel evaluator, content writer and video-understanding test suites.

- [ ] **Step 5: Commit research migration**

Stage moved tracked text/data, updated path contracts and migration records only.

### Task 6: Migrate Marketing Content

**Files:**
- Move: `carousels/` to `Marketing-Growth/Content/Carousels/`
- Move: `output/drafts/` to `Marketing-Growth/Content/Drafts/`
- Move: `output/posts/` to `Marketing-Growth/Content/Review/Legacy-Posts/`
- Modify: `.claude/agents/*.md`
- Modify: `.claude/skills/**/*.md`
- Modify: related tests and knowledge pointers
- Create: `Marketing-Growth/Content/README.md`
- Create: `Marketing-Growth/Published-Ledger.md`
- Create: `Operations/Migrations/MIG-20260915-MARKETING/manifest.tsv`
- Create: `Operations/Migrations/MIG-20260915-MARKETING/README.md`

- [ ] **Step 1: Create pre-move manifest**

Treat HTML, CSS, image assets and draft source files as complete bundles.

- [ ] **Step 2: Move content**

Do not classify legacy posts as Approved or Published without explicit evidence.

- [ ] **Step 3: Update all active path references**

Update carousel rendering, content-learning exemplars, content-writing outputs and
draft-gate tests.

- [ ] **Step 4: Validate assets and draft checks**

Confirm every local carousel asset resolves and run content writer/evaluator tests.

- [ ] **Step 5: Commit marketing migration**

Stage the moved content, path updates and migration record.

### Task 7: Migrate Brand, Sales and Executive Documents

**Files:**
- Move: `output/*pricing*` and pricing QA source documents to `Brand-Strategy/Offers-Pricing/`
- Move: `output/manychat-*` to `Sales-CRM/Automation/ManyChat/`
- Move: `output/TravelFrame-Master-Summary-2026-09-15.md` to `Executive/Snapshots/`
- Move: `output/TravelFrame-30-Day-Content-Plan-2026-09-14.docx` to `Marketing-Growth/Plans/`
- Move remaining standalone business documents according to owner
- Create: `Operations/Migrations/MIG-20260915-BUSINESS-DOCS/manifest.tsv`
- Create: `Operations/Migrations/MIG-20260915-BUSINESS-DOCS/README.md`

- [ ] **Step 1: Classify every standalone output document**

Record owner, status and rationale. Unclear artifacts go to `Inbox/Unclassified`.

- [ ] **Step 2: Create manifest and move documents**

Preserve filenames to retain dated provenance.

- [ ] **Step 3: Update workspace map and local references**

Do not rewrite canonical vault content.

- [ ] **Step 4: Verify and commit**

Run link checks and stage only this batch.

### Task 8: Migrate Creative Production and Large Media

**Files:**
- Move: `Source video/` to `Creative-Production/Assets/Raw/`
- Move: `travelframe-guest-guide/` to `Creative-Production/Deliverables/Guest-Guide/`
- Move: `output/hanoi-dong-xuan-series/` to `Creative-Production/Projects/Hanoi-Dong-Xuan-Series/`
- Move: `output/qa-*` to `Creative-Production/Review/`
- Move remaining render/media outputs by project
- Create: `Operations/Migrations/MIG-20260915-CREATIVE/manifest.tsv`
- Create: `Operations/Migrations/MIG-20260915-CREATIVE/README.md`

- [ ] **Step 1: Generate full pre-move checksums**

Hash every file in the batch before moving. This is the rollback contract for ignored
large assets.

- [ ] **Step 2: Move one bundle at a time**

Order: Guest Guide, QA previews, Hanoi series, then raw source media.

- [ ] **Step 3: Verify each bundle immediately**

Compare file count, bytes and SHA-256. Use `ffprobe` for video/audio metadata and
confirm representative document/image files remain readable.

- [ ] **Step 4: Update live path references**

Update only active scripts, docs and agent contracts. Historical migration records
retain old paths.

- [ ] **Step 5: Commit manifests and tracked project sources**

Large ignored media are not staged. Commit their manifest, documentation and any
tracked text source moved with the bundle.

### Task 9: Close Root Output and Finalize Operations

**Files:**
- Remove empty legacy directories after verification
- Move: active design and plan docs to `Operations/Change-Management/`
- Update: `README.md`
- Update: `WORKSPACE-MAP.md`
- Update: `Executive/Current-State.md`
- Create: `Operations/Migrations/2026-09-15-final/inventory.tsv`
- Create: `Operations/Migrations/2026-09-15-final/files.sha256`
- Create: `Operations/Migrations/2026-09-15-final/validation-report.md`

- [ ] **Step 1: Classify remaining root entries**

Expected business folders at root are only the approved departments, startup files,
`.claude`, Git/config files and package metadata.

- [ ] **Step 2: Generate final inventory**

Use the same exclusions and format as baseline.

- [ ] **Step 3: Compare baseline and final inventories**

Every baseline file must map to one final path or an explicit ignored/cache record.
No unexplained missing file is allowed.

- [ ] **Step 4: Run full validation**

```bash
npm test
npm run test:workspace
python3 -m unittest discover -s Technology-Automation/Tests/legacy -p 'test_*.py'
npm run workspace:check
git diff --check
```

- [ ] **Step 5: Write final report**

Include migration batches, test evidence, unresolved items, compatibility links,
ignored large assets and rollback instructions.

- [ ] **Step 6: Commit closure**

```bash
git add README.md WORKSPACE-MAP.md Executive Operations Technology-Automation package.json package-lock.json
git diff --cached --check
git commit -m "chore: complete TravelFrame Company OS migration"
```
