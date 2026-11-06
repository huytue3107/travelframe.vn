# Performance review — 2026-11-02

Owner: Data-Analytics. Status: Review. Timezone: Asia/Saigon.

## Evidence

- `meta.json`: Meta read-only MCP, request windows preserved, captured metadata 17:14:31 ICT. Contains profile, media, posts and account insights. Paging and CDN media URLs removed. No token retained.
- `ig-reach-daily.json`: read-only Meta daily reach with explicit end_time. Confirms 14:00 ICT day boundaries, not a reconstructed 08:30 rolling window.
- `ga4.json`: 57 GA4 Data API reports; property 552867189, timezone Asia/Saigon; capture metadata 17:16:03 ICT. Week 26 October–1 November versus 19–25 October; day 1 November versus 31 October and 25 October. Host/source/page/event breakdowns include local test traffic. No credentials copied or printed.
- CRM read: Lead-Pipeline-Tracker.csv (18 data rows including 17 October contacts) and Seed-Comment-Tracker.csv. Source files unchanged. CRM and seed CSV row widths inconsistent; payment cells cannot be summed safely. No new PII copy in report.
- Messenger read failed with missing pages_messaging. Ads read failed because locked ad account is unconfigured. Both are unknown rather than zero.
- Per runbook, capability check passed System User Never; hidden Facebook test created/deleted; Instagram container created but not published. No public post, outreach, campaign or website write.

## Outputs and validation

- Report Markdown and self-contained HTML in ../../Reports/2026-11-02-TravelFrame-Daily-Performance-Report.*
- Charts PNG and preview generated from local HTML; inspected visually. HTML: 6 required sections, 7 tables, 4 charts, no horizontal viewport overflow at desktop size.
- npm test: 158 passed, 0 failed.
- npm run test:skills: 15 passed.
- npm run workspace:check: passed all checks on this run.
- Existing unrelated workspace modifications preserved. No commit or push.

## Reproduction

`capture-ga4.cjs` uses the existing Google SDK credential configuration internally; it never reads or prints credential content. Needs network access. Re-running replaces this snapshot, so use a new dated folder for a future capture.

`build-report.cjs` produces the report HTML and chart image from the Markdown and daily reach evidence, using bundled marked/Playwright and installed Chrome. It reads no browser account profile. No paid API was used for this report.
