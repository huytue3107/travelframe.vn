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

## Current-state map (cấu trúc hiện hành)

| Khu vực | Nội dung |
|---|---|
| `Executive/` | Current state, snapshots, quyết định |
| `Brand-Strategy/` | Source-of-truth map, offers & pricing |
| `Research-Insights/Library/` | Research library: channels, videos, transcripts, analysis, evaluation, knowledge |
| `Marketing-Growth/Content/` | Carousels, drafts, legacy posts (Review), plans |
| `Creative-Production/` | Assets (Raw, Stock Pexels, AI-Generated), Projects (Hanoi-Dong-Xuan-Series), Review, Deliverables, Runbooks (Visual Asset Pipeline) |
| `Sales-CRM/Automation/ManyChat/` | ManyChat docs |
| `Technology-Automation/` | MCP, Scripts, Tests, Runbooks, Skills (Catalog, Governance, Manifest, Department Guides), Tools (`open-seo`), agents & skills trong `.claude/` và `.agents/` |
| `Data-Analytics/` | Metric definitions, snapshot index |
| `Operations/` | Migrations (manifest + validation per batch), Change-Management (design/plan/status docs) |

## Legacy mapping (tham chiếu lịch sử — đã di chuyển xong 2026-09-15)

Các legacy root cũ đã hết. Nếu tooling cũ còn ghi đường dẫn legacy, tra
`Operations/Migrations/` để map về vị trí mới. Không tái tạo cây legacy.
