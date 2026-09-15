# Workspace Baseline

**Captured:** 2026-09-15
**Workspace:** `/Users/macbook/Codex GPT/travelframe.vn`

## Test baseline

- `npm test`: PASS, 1 Node MCP test.
- `python3 -m unittest discover -s tests -p 'test_*.py' -v`: no tests
  discovered, exit code 5.
- Python suites are stored in nested directories without package discovery support.
  Migration validation must run those suites by explicit file or directory.

## Inventory rules

The baseline excludes:

- `.git/`
- `node_modules/`
- `.env`
- `.DS_Store`
- Python caches

Large media is included in `inventory.tsv` and `files.sha256` because these records
are the rollback contract for filesystem moves. Credentials are never included.

## Files

- `inventory.tsv`: relative path, byte size and detected file type.
- `files.sha256`: SHA-256 and relative path.
- `dependencies.txt`: active text references to legacy workspace paths.

## Rollback

Before reverting a migration batch, compare its destination checksum with this
baseline. Move only matching files back to their recorded original paths. Never
overwrite an existing rollback destination.
