# MIG-20260915-BUSINESS-DOCS

## Mapping

- Pricing documents -> `Brand-Strategy/Offers-Pricing/`
- ManyChat documents -> `Sales-CRM/Automation/ManyChat/`
- Master summary -> `Executive/Snapshots/`
- Content plan document -> `Marketing-Growth/Plans/`

## Status rule

These are dated artifacts. Their destination identifies owner, not automatic approval
or currentness.

## Rollback

Verify checksums in `manifest.tsv`, move each file back only when the original path
is absent, then revert the migration commit.
