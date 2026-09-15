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
