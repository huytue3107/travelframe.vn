---
title: Pre-launch audit CMP-202610-WARM-PHOTO-DM
owner: Marketing-Growth
status: Draft
created: 2026-10-13
---

# Pre-launch Audit (2026-10-13, Claude)

Method: read-only review of the Ads Manager draft editor (account `1423800382160162`) against the [Decision Record](../../../Executive/DEC-20261009-WARM-PHOTO-DM.md), [Brief](Brief.md) and [Draft Handoff](2026-10-13-Meta-Draft-Handoff.md). Nothing was edited or published. The `travelframe-meta-ads` MCP returned "ad account ID is not configured", so old pilot spend and other live campaigns were not verified through the API.

**Verdict: NOT ready to roll out.** The ad set has drifted from the handoff and the approved scope.

## Blockers

| # | Area | Found in editor | Required | Fix |
|---|---|---|---|---|
| B1 | Location | Vietnam (whole country); audience estimate 59.7M–70.2M | Hanoi city only | Locations → remove Vietnam, add Hanoi +0 km |
| B2 | Budget | Daily 340,000 VND; Meta max 595,000/day, 2,380,000/week | 300,000/day, total ceiling 4,200,000 | Set 300,000. Campaign spending limit 4,200,000 still set (0 spent) and is the hard total cap |
| B3 | Schedule | Start 13 Oct 2026 19:17, **no end date** | 14 days from actual activation | Set start = activation time, end = +14 days |
| B4 | Age / audience | Min age 21; Advantage+ audience, suggestion age 21–55 | Handoff recorded 18+, no expansion claims | Rocky decides 18 or 21; Advantage+ audience may deliver beyond suggestion (location and min age stay hard limits) |
| B5 | AST-02 | No video; text generation + translation (Voice) + multi-advertiser on | Video, all AI off | Upload `how-we-got-the-shot/reel-1080x1920.mp4`, turn off 3 settings |
| B6 | AST-03 | 10 of 10 carousel cards, errors on all cards, placeholder "Chat with us" headlines, an untitled 896×896 image; 7 defaults on (format options Single/Collage/Collection/Video slideshow, visual touch-ups, dynamic description, relevant comments) | 3 cards: dates → needs → route/quote | Rebuild to 3 real cards or leave AST-03 off at launch; turn off defaults |
| B7 | Commercial | No record of approved offer/price/inclusions, inbox owner or quote/deposit flow | Decision: "không bật nếu offer chưa chốt" | Sales-CRM confirms offer, inbox owner and hours |
| B8 | Budget reconciliation | Old 300 USD pilot spend not reconciled | Required by Decision Record | Check Billing / old campaigns before launch |

## Should fix

- AST-01: Advantage+ creative text generation still on by default; translation 0/2 (off). Video ~38s vs brief 15–25s; rights for footage/music/talent unconfirmed. Primary text was changed after the handoff ("Bring home photos of your Hanoi trip with you in the frame…"); needs Rocky review.
- AST-03 primary text also changed ("Planning a photo walk in Hanoi?…"); needs review.
- Check multi-advertiser ads checkbox on AST-01 and AST-03.
- Conversation template has no automatic responses: fine only if a human covers the inbox.
- Value rule "Rule Age and Placement BĐS" is suggested by Meta; do not apply (unrelated property rule). Currently None.

## OK

- Campaign: Engagement, ad-set budget, campaign spending limit 4,200,000 VND, frequency control off, In draft, switches off.
- Ad set: Message destinations, manual, Instagram @travelframe.vn only (Messenger unchecked), Page travelframe.vn, Maximise conversations, Highest volume, value rules None, English (All), Advantage+ placements, no exclusions.
- AST-02 primary text approved by Rocky 2026-10-13 in chat. Hanna face consent for ads stated by Rocky in chat 2026-10-13.
- Conversation template `TF_Photo-walk_Qualification_DRAFT` attached.

## Minimum path to launch

1. Fix B1–B3 (and decide B4).
2. Launch with AST-01 + AST-02 only; keep AST-03 off until 3 real cards exist (brief allows max two creatives in days 1–3).
3. Close B7–B8, run Preview, then Rocky approves Publish explicitly.

## AST-03 card headlines (proposed 2026-10-13, pending Rocky)

Brief flow: dates → needs → route/quote. Keep 3 cards, remove the other 7.

| Card | Headline | Description (optional) |
|---|---|---|
| 1 | Plan your Hanoi photos | Step 1: send your Hanoi dates |
| 2 | Tell us your photo style | Step 2: group size and the look you want |
| 3 | Get a route and quote | Step 3: confirm only when it fits |

No price, photo count, delivery time or availability in headlines (not approved).

Note: while auditing, AST-02 in the editor showed 8 of 10 uploaded media and "All edits saved", meaning someone else was editing the draft at the same time. Confirm which media AST-02 should keep.

## Ads re-audit (2026-10-13 later, Claude, read-only)

Ad set (B1–B4) not re-checked in this pass.

**AST-01: near ready.** 1 video (~38s, rights pending), primary text "Bring home photos…", AI image gen 0, translation 0/2, CTA Send Instagram message. Still on: Advantage+ creative text generation (1 default). One preview tile still shows the old copy "In Hanoi and want photos…": check placement-level text before publish.

**AST-02: regressed, not ready.**
- 9 of 10 uploaded videos, mixed angles: road-crossing tips ("Tip 1 Just go slow"), "Think you need an expensive camera?", Long Bien Bridge, a chat-screenshot style video, etc. Most are not "gentle posing"; consent for every person shown is unconfirmed; chat screenshots risk exposing customer messages.
- Advantage+ creative image generation: 6 AI-generated images in use (e.g. "How to cross the road" style). Brief forbids AI images that look like real clients; must be removed.
- Advantage+ creative text generation: persona variations applied 4/4 (e.g. "Capture your best self in Hanoi 📸 … to book!"). Unapproved copy.
- Creative enhancements 4/4 and essential enhancements 3/3 all ON; translation Voice on.
- Multi-advertiser ads: now unchecked (OK). Primary text: approved version.

**AST-03: improved, not ready.** 3 of 10 cards. Headlines: card 1 "Plan your Hanoi photos", card 2 still "Chat with us", card 3 "Get a route and quote". Card 1 image 1350×1080, check crop. Text-generation persona panel open, 0 of 4 applied (OK). Still on (6 defaults): Single media format, visual touch-ups, dynamic description, relevant comments, enhance CTA, translation Voice. Was being edited live in another tab during audit.

## Full re-audit #3 (2026-10-13 evening, Claude, read-only, fresh page load = saved draft state)

Rocky reported "đã tắt hết". Saved draft shows:

| Level | Status | Open items |
|---|---|---|
| Campaign | OK | Engagement, ad-set budget, spending limit 4,200,000 (0 spent), A/B off, frequency control off |
| Ad set | Mostly fixed | B1 location now "Vietnam: Hanoi" ✓; B2 daily 300,000 ✓ (Meta max 525,000/day); destination manual Instagram only ✓. **B3 no end date, start still 13 Oct 19:17 (past)**. B4 min age 21, Advantage+ audience 21–55 (Rocky to confirm). Audience estimate 42.6M–50.1M looks inconsistent with Hanoi-only; verify in preview |
| AST-01 | Near ready | Enhancements 0/4, 0/3; translation 0/2; AI image 0; multi-advertiser off. Still on: Advantage+ creative text generation (Review defaults 1). One preview tile still shows old copy. Video ~38s |
| AST-02 | Not ready | AI images removed ✓, AI persona text removed ✓, multi-advertiser off ✓, media now 8 posing-related videos. **Still ON: creative enhancements 4/4, essential enhancements 3/3, translation Voice (1/2); Review defaults 2.** 8 videos vs 2–3 recommended; "how we got the shot" not identifiable; consent per person shown unconfirmed |
| AST-03 | Near ready | 3 cards, headlines Plan your Hanoi photos / Tell us your photo style / Get a route and quote ✓; translation off ✓; multi-advertiser off ✓. **Still ON (Review defaults 5): format option Single media; visual touch-ups, dynamic description, relevant comments, enhance CTA.** Card images are collages of many people's photos: confirm consent |

If the toggles were switched off in another tab, they did not persist to the saved draft (check "All edits saved").
