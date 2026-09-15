# MIG-20260915-TECH

## Scope

Move legacy MCP, scripts and tests into `Technology-Automation/`.

## Mapping

- `mcp/` -> `Technology-Automation/MCP/`
- `scripts/` -> `Technology-Automation/Scripts/legacy/`
- `tests/` -> `Technology-Automation/Tests/legacy/`

## Validation

- Node MCP test.
- Explicit Python suites under `Technology-Automation/Tests/legacy/`.
- Root workspace structure check.
- Search for active references to old executable paths.

## Rollback

Confirm destination checksums against `manifest.tsv`, then move each top-level
directory back only when the original path does not exist. Revert the matching Git
commit after the filesystem rollback.
