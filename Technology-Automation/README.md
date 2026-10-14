# Technology Automation

## Purpose

Cung cấp công cụ, connector, tests và automation an toàn cho Company OS.

## Responsibilities

MCP, scripts, test suites, local agents, skills, package commands, runbooks và in-house tools (OpenSEO).

## Inputs

Workflow contract và data path từ phòng ban sở hữu.

## Outputs

Deterministic tools, validation và technical evidence.

## Source of truth

Code, tests và runbook cùng version trong Git.

## Folder structure

`MCP/`, `Scripts/`, `Tests/`, `Runbooks/`, `Skills/`, `Tools/`.
- `Skills/`: Quản trị Agent Skills, Catalog, Manifest và 9 Department Guides (xem `Skills/README.md`).
- `Tools/open-seo`: Nền tảng SEO Intelligence & MCP (xem `Runbooks/OpenSEO-Runbook.md`).
- `Scripts/typesafe_lead_triage.mjs`: TypeSafe lead triage cho booking workflow — `npm run triage -- --mock <scenario>` (offline) hoặc `--input <state.json> --live` (cần `TYPESAFE_LIVE_APPROVED=1`). Runbook: `Runbooks/DES-20260923-TYPESAFE-LEAD-TRIAGE.md`. Test: `npm run test:triage`.
- `Scripts/hanoi_lodging_*`: research cơ sở lưu trú Hà Nội, hợp nhất nguồn công khai, Jev có spend guard, QA email và xuất workbook. Phạm vi, approval chi phí và checkpoint: [Hanoi lodging research method](../Research-Insights/Competitive/2026-10-14-hanoi-lodging-partners/METHOD.md). Không chạy lại paid stage khi chưa duyệt ngân sách cho batch mới.

## Workflow

Specify -> test -> implement -> validate -> document -> release locally.

## Approval requirements

Cần approval trước paid API, live write connector, install lớn hoặc permission change.

## Naming conventions

Code dùng convention của ngôn ngữ; command và path phải được README ghi rõ.

## Archive policy

Deprecated tool phải có replacement pointer trước khi archive.

## Related departments

Tất cả phòng ban; không sở hữu business decision.
