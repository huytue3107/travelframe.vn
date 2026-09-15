# Technology Migration Validation

**Date:** 2026-09-15

## Result

- Destination existence: PASS for all 21 manifest files.
- Node MCP tests: PASS, 1 test.
- Workspace validator tests: PASS, 6 tests.
- Content writer tests: PASS, 24 tests.
- Video understanding tests: PASS, 22 tests.
- Channel evaluator tests: PASS, 22 tests and 1 skipped.

## Expected modifications after move

The following files intentionally no longer match their pre-move checksum because
their executable paths or project-root calculation changed:

- Channel-agent README and scripts.
- TravelFrame MCP runner.
- MCP source-path test.
- Test helper files for channel evaluator, content writer and video understanding.
- Channel evaluator static integration test.

Git preserves the post-migration versions. `manifest.tsv` preserves the original
path, byte count and checksum for audit.

## Known limitation

`test_real_nasa_metrics_sane` is skipped because
`reference-library/channels/test-nasa/instagram-posts.json` was not present in the
baseline inventory. Existing NASA evaluation outputs remain available, but they are
not a replacement for the missing source fixture.
