# Final Migration Audit — Inventory Reconciliation

**Date:** 2026-09-15
- Baseline files: 485
- Final files: 532
- Baseline files unchanged in place: 14
- Baseline files moved via manifest and verified at destination: 425
- Baseline files at destination with changed content: 46
- Unexplained missing: 0  (target: 0)
- Files created after baseline (not in baseline, not move destinations): 47

## Changed content (informational)
- .claude/agents/channel-evaluator.md -> .claude/agents/channel-evaluator.md (content changed since baseline)
- .claude/agents/channel-scout.md -> .claude/agents/channel-scout.md (content changed since baseline)
- .claude/agents/content-writer.md -> .claude/agents/content-writer.md (content changed since baseline)
- .claude/agents/video-analyst.md -> .claude/agents/video-analyst.md (content changed since baseline)
- .claude/skills/channel-evaluation/SKILL.md -> .claude/skills/channel-evaluation/SKILL.md (content changed since baseline)
- .claude/skills/content-learning/SKILL.md -> .claude/skills/content-learning/SKILL.md (content changed since baseline)
- .claude/skills/content-learning/references/knowledge-schema.md -> .claude/skills/content-learning/references/knowledge-schema.md (content changed since baseline)
- .claude/skills/content-writing/SKILL.md -> .claude/skills/content-writing/SKILL.md (content changed since baseline)
- .claude/skills/content-writing/references/content-rubrics.md -> .claude/skills/content-writing/references/content-rubrics.md (content changed since baseline)
- .claude/skills/video-understanding/README.md -> .claude/skills/video-understanding/README.md (content changed since baseline)
- .claude/skills/video-understanding/SKILL.md -> .claude/skills/video-understanding/SKILL.md (content changed since baseline)
- .gitignore -> .gitignore (content changed since baseline)
- Operations/Migrations/2026-09-15-baseline/README.md -> Operations/Migrations/2026-09-15-baseline/README.md (content changed since baseline)
- carousels/README.md -> Marketing-Growth/Content/Carousels/README.md (content changed since baseline)
- output/TravelFrame-Master-Summary-2026-09-15.md -> Executive/Snapshots/TravelFrame-Master-Summary-2026-09-15.md (content changed since baseline)
- output/TravelFrame-Website-Packages-Pricing-2026-09-15.md -> Brand-Strategy/Offers-Pricing/TravelFrame-Website-Packages-Pricing-2026-09-15.md (content changed since baseline)
- output/drafts/2026-09-12-esim-setup-reel/evaluation-2026-09-12-run1.json -> Marketing-Growth/Content/Drafts/2026-09-12-esim-setup-reel/evaluation-2026-09-12-run1.json (content changed since baseline)
- output/drafts/2026-09-12-esim-setup-reel/sources.md -> Marketing-Growth/Content/Drafts/2026-09-12-esim-setup-reel/sources.md (content changed since baseline)
- output/manychat-travelframe-playbook-2026-09-14.md -> Sales-CRM/Automation/ManyChat/manychat-travelframe-playbook-2026-09-14.md (content changed since baseline)
- output/manychat-travelframe-ready-scripts-2026-09-14.md -> Sales-CRM/Automation/ManyChat/manychat-travelframe-ready-scripts-2026-09-14.md (content changed since baseline)
- package.json -> package.json (content changed since baseline)
- reference-library/channels/host-themikeytravel/digest.md -> Research-Insights/Library/channels/host-themikeytravel/digest.md (content changed since baseline)
- reference-library/channels/host-themikeytravel/evaluation-2026-09-13-run1/metrics.json -> Research-Insights/Library/channels/host-themikeytravel/evaluation-2026-09-13-run1/metrics.json (content changed since baseline)
- reference-library/evaluation/nasa/2026-09-12-run1/draft-gate-raw.json -> Research-Insights/Library/evaluation/nasa/2026-09-12-run1/draft-gate-raw.json (content changed since baseline)
- reference-library/evaluation/nasa/2026-09-12-run1/evaluation.md -> Research-Insights/Library/evaluation/nasa/2026-09-12-run1/evaluation.md (content changed since baseline)
- reference-library/evaluation/nasa/2026-09-12-run1/metrics.json -> Research-Insights/Library/evaluation/nasa/2026-09-12-run1/metrics.json (content changed since baseline)
- reference-library/knowledge/ideas-backlog.md -> Research-Insights/Library/knowledge/ideas-backlog.md (content changed since baseline)
- reference-library/knowledge/patterns.md -> Research-Insights/Library/knowledge/patterns.md (content changed since baseline)
- reference-library/knowledge/runs/2026-09-12-review-fixes/learning.md -> Research-Insights/Library/knowledge/runs/2026-09-12-review-fixes/learning.md (content changed since baseline)
- reference-library/knowledge/runs/2026-09-12-seed-exemplars/learning.md -> Research-Insights/Library/knowledge/runs/2026-09-12-seed-exemplars/learning.md (content changed since baseline)
- reference-library/knowledge/runs/2026-09-13-host-themikeytravel/learning.md -> Research-Insights/Library/knowledge/runs/2026-09-13-host-themikeytravel/learning.md (content changed since baseline)
- reference-library/knowledge/voice-playbook.md -> Research-Insights/Library/knowledge/voice-playbook.md (content changed since baseline)
- scripts/build_travelframe_content_docx.py -> Technology-Automation/Scripts/legacy/build_travelframe_content_docx.py (content changed since baseline)
- scripts/build_website_pricing_option1_docx.py -> Technology-Automation/Scripts/legacy/build_website_pricing_option1_docx.py (content changed since baseline)
- scripts/channel-agent/README.md -> Technology-Automation/Scripts/legacy/channel-agent/README.md (content changed since baseline)
- scripts/channel-agent/apify_scrape.py -> Technology-Automation/Scripts/legacy/channel-agent/apify_scrape.py (content changed since baseline)
- scripts/channel-agent/download.sh -> Technology-Automation/Scripts/legacy/channel-agent/download.sh (content changed since baseline)
- scripts/channel-agent/transcribe.sh -> Technology-Automation/Scripts/legacy/channel-agent/transcribe.sh (content changed since baseline)
- scripts/travelframe-mcp/run.sh -> Technology-Automation/Scripts/legacy/travelframe-mcp/run.sh (content changed since baseline)
- tests/channel-evaluator/helpers.py -> Technology-Automation/Tests/legacy/channel-evaluator/helpers.py (content changed since baseline)
- tests/channel-evaluator/test_static_safety.py -> Technology-Automation/Tests/legacy/channel-evaluator/test_static_safety.py (content changed since baseline)
- tests/content-writer/helpers.py -> Technology-Automation/Tests/legacy/content-writer/helpers.py (content changed since baseline)
- tests/content-writer/test_check_draft.py -> Technology-Automation/Tests/legacy/content-writer/test_check_draft.py (content changed since baseline)
- tests/content-writer/test_knowledge_schema.py -> Technology-Automation/Tests/legacy/content-writer/test_knowledge_schema.py (content changed since baseline)
- tests/mcp/travelframe-readonly.test.mjs -> Technology-Automation/Tests/legacy/mcp/travelframe-readonly.test.mjs (content changed since baseline)
- tests/video-understanding/helpers.py -> Technology-Automation/Tests/legacy/video-understanding/helpers.py (content changed since baseline)

## Rollback instructions

- Per-batch rollback: follow the README in each `Operations/Migrations/MIG-*/`;
  verify destination checksum against that batch manifest before moving back.
- Text/code: revert the specific batch commit. Raw media: move back only when
  the legacy destination is absent. Never overwrite an existing destination.
- Do not use `git reset --hard`; do not delete historical snapshots.