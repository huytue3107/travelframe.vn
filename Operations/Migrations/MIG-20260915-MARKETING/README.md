# MIG-20260915-MARKETING

## Mapping

- `carousels/` -> `Marketing-Growth/Content/Carousels/`
- `output/drafts/` -> `Marketing-Growth/Content/Drafts/`
- `output/posts/` -> `Marketing-Growth/Content/Review/Legacy-Posts/`

## Rules

Preserve each carousel as an HTML, CSS and asset bundle. Do not infer Approved or
Published status from a legacy folder name.

## Rollback

Verify destination files against `manifest.tsv`, move each bundle back only when its
legacy destination is absent, then revert the migration commit.
