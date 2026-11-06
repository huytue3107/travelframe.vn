---
title: TravelFrame SEO audit opportunity shortlist
owner: Research-Insights
status: Review
date: 2026-10-20
---

# Working shortlist

Scope: travelframe.sidevn.com. OpenSEO project b97024a3-b095-44e9-9489-d5fce1361263; audit 686f7bbd-feae-45fd-a577-42d23007dd5d. Recommendations only; no live changes.

US/en desktop SERPs retrieved 2026-10-20, depth 20 mixed result elements. No TravelFrame result in any of the eight samples. These contained 12–17 organic listings, not 20 organic positions. Search volumes reused from OpenSEO's 2026-10-13 research; close variants overlap. GSC window 2026-09-19–2026-10-17, Pacific Time, all countries/devices.

| Pages | Problem observed | Evidence | Proposed change | Who searches and business fit | Plausible benefit | Effort | Main uncertainty / disposition |
|---|---|---|---|---|---|---|---|
| /hanoi-photoshoot; /news/hanoi-old-quarter-guide | Google reports Discovered - currently not indexed | URL Inspection 2026-10-20; both 200, self-canonical, in sitemap; no anchor to either in homepage or /tours HTML. photoshoot 110, photographer 20, photographer in Hanoi 20; Old Quarter 8,100 and map 170 US searches/mo, overlapping | Add contextual HTML links from homepage and /tours; inspect live URL, then request indexing and follow up | Buyers seeking a photographer; travelers planning Hanoi | Become eligible for relevant search visibility; no guaranteed indexing/rank | Small implementation, external wait | Selected #1. Google gives no cause or last crawl for these two URLs; cannot blame links or content conclusively |
| Homepage; /faq; hiring-photographer guide; photo-spots guide; /hanoi-photoshoot | Conflicting deposit, delivery, photo counts and contact details | Homepage no deposit vs FAQ 50%; 24h guide vs 2–3-day packages; older WhatsApp in hiring guide; service page has no main-content image | Approve one offer source; synchronize pages and contact links; add consented sample gallery | High-intent prospects, photoshoot query cluster 110/20/20 | Fewer unanswered purchase questions and wrong contact handoffs | Medium, business decision needed | Selected #2. No conversion uplift quantified; book flow not submitted |
| Santorini article; Ta Hien article; related /news | FAQ and Day 1 passage copied from unrelated 48-hour itinerary | Two articles confirmed live; Santorini GSC page 1 click/22 impressions, average 4.4; query 0/7, 4.9 across all countries. US live sample no match among 16 organic listings; US volume unavailable | Replace only unrelated tail with verified topic-specific answers and relevant CTA; preserve useful body and URL | Readers planning a specific visit | Better topical answer; protect existing small visibility | Small batch | Selected #3. Do not rewrite entire near-ranking page; no demonstrated penalty |
| Old Quarter pillar: map section | Title promises map; main content has no image or map link | 170 map, 8,100 head US/mo; no match in 14/12 organic listings | Add original saveable map, route distances, access notes | Independent visitors; adjacent photo-walk audience | Serve map intent and route readers to service | Medium | Strongest runner-up. Greater raw volume but page not indexed; first make current page discoverable/indexed |
| Night market; airport guides | No standalone page in 54-URL sitemap; brief sections exist in Old Quarter | 210 / 140 US/mo; no match in 12 / 17 organic listings | Validate current facts, expand only after core pages fixed | Trip planners, weaker purchase proximity | Broader discovery, not proven bookings | Medium | Later: new research and original photos needed, no measured loss |
| Cinematic + Early Bird tours | Same generic H1; content appears through JavaScript | Browser shows different routes/details; Cinematic indexed. Early Bird title mentions Long Bien but displayed stop list does not include it | Use specific H1 and server-readable overview; reconcile title, overview and stops | Route-specific shoppers | Clearer expectations and robust reading | Medium | Later: indexed page already, no evidence JavaScript caused exclusion |
| /news and ?lang=vi; pagination | Duplicate title/description groups; Santorini VI retains English main body | Crawl: 32 duplicate-title and 32 duplicate-description URL instances, includes pagination and EN/VI pairs; VI self-canonical | Translate actual Vietnamese pages or review canonical/hreflang policy for untranslated variants | Vietnamese audience secondary to current international offer | Cleaner language targeting; scale unknown | Medium | Later: not proof of penalty; do not noindex translated pages indiscriminately |
| travelframe.vn migration | Planned destination hostname does not resolve in audit environment | HTTPS/HTTP bare and HTTPS www DNS failures; current sidevn host works | Prepare DNS/SSL and URL mapping; only switch after verification and approval | All visitors during future migration | Avoid creating migration loss; no current loss established | Medium, external dependency | Later: not an observed failure of the active domain; do not redirect to unresolved host |
| About/guides; titles; images; filter/noindex URLs | Maintenance warnings and intentional exclusions mixed | Crawl 100 URLs, all 200; 50 long titles, 43 heading skips, 3 thin pages, 8 slow responses, 3 canonicalized filters, noindex /ebooks/resend | Fix relevant headings/metadata, verify guide profiles; retain intentional exclusions; performance test only if needed | Current readers | Clarity and maintainability; ranking effect unproven | Small to medium | Maintenance. Character count and word count alone do not set priority; Lighthouse not run |

## Self-review

- Strongest rejected row is the Old Quarter map. It is retained explicitly in the report and loses priority to the verified indexing gap.
- All material page-family diagnoses map to a selected recommendation or checked-table row.
- GSC average positions are all-country historical data; live SERPs are US/en desktop mixed-element samples. Neither is substituted for the other.
- No claim that missing provider data equals zero traffic, no claim of a Google penalty, no promised bookings or top-one outcome.
- All commercial policies remain pending business confirmation; no website edit, form submission, index request, campaign, or migration performed.
