# Workspace Map

## Startup files

| File | Vai trò |
|---|---|
| `README.md` | Entry point cho người và agent |
| `AGENTS.md` | Protocol chung và Codex |
| `CLAUDE.md` | Protocol Claude |
| `Executive/Current-State.md` | Trạng thái và ưu tiên hiện tại |
| `Brand-Strategy/Source-Of-Truth-Map.md` | Canonical source pointers |

## Ownership map

| Artifact | Owner |
|---|---|
| Brand, audience, package, pricing | `Brand-Strategy/` |
| Channel/video research và knowledge | `Research-Insights/` |
| Campaign, calendar, draft và publish ledger | `Marketing-Growth/` |
| Raw media, edit, render và deliverable | `Creative-Production/` |
| ManyChat, lead, booking, customer flow | `Sales-CRM/` |
| MCP, script, test, agent và skill | `Technology-Automation/` |
| Metrics, snapshots, attribution, results | `Data-Analytics/` |
| SOP, migration, inventory, maintenance | `Operations/` |

## Migration status

Workspace đang được chuyển từ cấu trúc legacy sang Company OS. Tra cứu
`Operations/Migrations/` trước khi dùng đường dẫn cũ. Không tự xóa compatibility
path hoặc legacy folder khi batch chưa có validation record.

## Legacy mapping

| Legacy | Company OS owner |
|---|---|
| `Source video/` | `Creative-Production/Assets/Raw/` |
| `reference-library/` | `Research-Insights/Library/` |
| `carousels/` | `Marketing-Growth/Content/Carousels/` |
| `travelframe-guest-guide/` | `Creative-Production/Deliverables/Guest-Guide/` |
| `output/drafts/` | `Marketing-Growth/Content/Drafts/` |
| `output/posts/` | `Marketing-Growth/Content/Review/Legacy-Posts/` |
| `output/hanoi-dong-xuan-series/` | `Creative-Production/Projects/Hanoi-Dong-Xuan-Series/` |
| `mcp/`, `scripts/`, `tests/` | `Technology-Automation/` |
