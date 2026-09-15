# MIG-20260915-RESEARCH

## Scope

Move `reference-library/` to `Research-Insights/Library/` as one provenance-preserving
bundle.

## Validation

- Preserve every filename, run ID and sidecar.
- Update active agent, skill, script, test and knowledge pointers.
- Run channel evaluator, content writer and video understanding suites.

## Rollback

Verify destination files against `manifest.tsv`, move the library back only when the
legacy path is absent, then revert the matching Git commit.
