# Integration Design: TravelFrame Meta Ads MCP

- **Ma thiet ke:** `DES-20260915-TRAVELFRAME-META-ADS-MCP`
- **Chu tri:** Technology-Automation
- **Business owner:** Marketing-Growth / Sales-CRM
- **Trang thai:** Review
- **Ngay lap:** 2026-09-15
- **Phe duyet thiet ke hoi thoai:** Rocky, 2026-09-15
- **Phe duyet ban spec:** Cho Rocky review

---

## 1. Tong Quan Va Muc Tieu

Tao mot MCP local de ket noi Meta Marketing API cho rieng TravelFrame. Connector
cho phep:

- Doc cau truc tai khoan quang cao va cac chi so phan phoi.
- Tao campaign, ad set, ad va creative.
- Sua targeting, placements, bidding, lich chay, ngan sach, creative va ad copy.
- Bat, tat va khoi phuc trang thai quang cao.
- Tao preview, diff, approval record, audit log va rollback plan cho moi thay doi.

Connector van hanh theo mo hinh `Review-first`. Agent khong duoc tu dong ghi len
Meta, bat quang cao hoac sua mot object live neu chua co approval cu the cua Rocky.

### Success criteria

1. MCP ket noi dung Meta Business, ad account, Facebook Page va Instagram account
   cua TravelFrame.
2. Token duoc nap tu macOS Keychain va khong xuat hien trong source, log, error,
   URL tra ve hoac Git.
3. Cac tool read tra ve du lieu tai khoan, campaign tree va Ads Insights.
4. Moi write action co immutable plan, diff, approval va audit record.
5. Object moi luon duoc tao o trang thai `PAUSED`.
6. Activation hoac thay doi object dang live can approval rieng.
7. Mock tests, MCP contract tests va workspace validation dat yeu cau.

### Non-goals

- Khong quan ly nhieu client hoac nhieu ad account trong phien ban dau.
- Khong doi billing, payment method, currency, timezone, account spending limit,
  user role hoac Business permissions.
- Khong chay background automation tu toi uu, tang ngan sach hoac bat/tat ads.
- Khong xoa campaign, ad set, ad hoac creative.
- Khong hardcode tran `300 USD` vao connector. Ngan sach va spend limit thuoc
  tung campaign plan; pilot 300 USD la mot business plan rieng.

## 2. Kien Truc

Giu `travelframe_meta_readonly` hien tai cho Instagram/Facebook organic insights.
Tao MCP rieng ten `travelframe_meta_ads` cho Meta Ads.

```text
Codex
  |
  +-- travelframe_meta_readonly
  |     +-- Organic Page/Instagram data
  |
  +-- travelframe_meta_ads
        +-- Read services
        +-- Local plan store
        +-- Plan validator and diff
        +-- Native macOS approval gate
        +-- Meta Marketing API client
        +-- Redacted audit log
        +-- Reconciliation and rollback planner
```

Read va write tach thanh hai MCP de co the disable hoac revoke Ads write access
ma khong lam mat organic reporting. Write connector chi cho phep mot ad account,
mot Page va mot Instagram actor nam trong local allowlist.

## 3. Luong Du Lieu Va Approval

### Tao campaign moi

```text
Inspect account and assets
-> Draft local plan
-> Validate schema, account allowlist and budget fields
-> Render full preview
-> Rocky approves apply
-> Create campaign tree as PAUSED
-> Read back and compare with plan
-> Rocky approves activation
-> Activate selected objects
-> Read back delivery status
-> Append redacted audit event
```

### Sua campaign dang co

```text
Read current Meta state
-> Create before snapshot
-> Draft change plan and reverse plan
-> Render before/after diff and delivery warnings
-> Rocky approves apply
-> Apply approved fields only
-> Read back and reconcile
-> Append audit event and rollback reference
```

Creative cua ad dang chay duoc thay bang `clone-and-replace`: tao creative/ad moi
o trang thai `PAUSED`, verify, sau do moi xin approval de chuyen trang thai. Cach
nay giu ad cu lam rollback target va khong gia dinh creative object co the sua
truc tiep.

## 4. Ranh Gioi Bao Mat Va Xac Thuc

### Authentication

- Su dung Meta app `side-agency`.
- Token Ads write duoc luu trong macOS Keychain, tach khoi token organic read-only.
- Launcher doc token tu Keychain khi khoi dong MCP.
- Khong nhan access token qua MCP tool arguments.
- Khong ghi credential vao `.env`, plan file, audit file, test fixture hoac docs.

### Permission scope

- `ads_read`: doc ad account, object tree va Ads Insights.
- `ads_management`: tao va quan ly campaign, ad set, ad va creative.
- Chi bo sung Business/Page asset assignment hoac permission khac neu live
  connection check chung minh no bat buoc.
- Neu Meta app, Business, ad account, Page hoac Instagram actor khong khop
  allowlist, connector fail closed.

### Account allowlist

Config local phai co:

- `META_AD_ACCOUNT_ID`
- `TRAVELFRAME_PAGE_ID`
- `TRAVELFRAME_INSTAGRAM_ACCOUNT_ID`
- Meta Business ID duoc verify khi setup

MCP khong cung cap account selector va khong cho tool argument ghi de len cac ID
da khoa.

### Secret redaction

Redactor de quy xu ly:

- Fields nhu `access_token`, `client_secret`, `appsecret_proof`.
- Query parameters chua token.
- Nested error payload, paging URL va debug metadata.

Bat ky chuoi nao khop mau credential deu duoc thay bang `[REDACTED]` truoc khi
tra ve MCP response hoac ghi log.

## 5. Approval Contract

Moi write plan co:

- `plan_id`: UUID.
- `plan_version`: so nguyen tang dan.
- `plan_digest`: SHA-256 cua canonical JSON.
- `created_at`, `expires_at`.
- `requested_action`.
- `target_object_ids`.
- Before snapshot va after proposal.
- Budget, schedule va delivery-impact summary.
- Reverse plan neu action co the rollback.

MCP mo native macOS confirmation dialog truoc khi apply. Dialog hien action,
objects bi anh huong, diff, budget, maximum planned spend, `plan_id` va digest
rut gon.

Approval:

- Het han sau 10 phut.
- Chi dung mot lan.
- Chi hop le voi dung `plan_id`, `plan_version` va `plan_digest`.
- Mat hieu luc neu plan hoac Meta before-state thay doi.
- Apply `PAUSED` va activation la hai approval doc lap.
- Pause khan cap van can approval, tru khi Rocky yeu cau bo sung emergency policy
  trong mot design change rieng.

## 6. Tool Schemas

### Read tools

| Tool | Input chinh | Output chinh | Che do |
|---|---|---|---|
| `get_ad_account` | Khong co account override | Account identity, currency, timezone, status, verified asset links | Read |
| `list_campaigns` | Status, date window, paging | Campaign summary va paging cursor da redacted | Read |
| `get_campaign_structure` | Campaign ID | Campaign, ad sets, ads, creatives va effective status | Read |
| `get_ads_insights` | Object ID, level, date range, fields, breakdowns | Metrics, reporting metadata, paging va limitations | Read |
| `get_delivery_state` | Object IDs | Configured status, effective status, review/delivery state | Read |
| `validate_campaign_plan` | `plan_id` | Errors, warnings, budget summary va permission checks | Read/local |

### Local planning tools

| Tool | Input chinh | Output chinh | Che do |
|---|---|---|---|
| `draft_campaign_plan` | Objective, destination, budget, schedule, audience, placements, creatives | Immutable local plan and preview | Draft |
| `draft_change_plan` | Target IDs and requested field changes | Before/after diff and reverse plan | Draft |
| `review_plan` | `plan_id` | Full human-readable preview and digest | Review |
| `discard_plan` | `plan_id` | Local plan marked discarded | Local |

### Gated write tools

| Tool | Input chinh | Output chinh | Che do |
|---|---|---|---|
| `apply_plan_paused` | Approved `plan_id` and digest | Created/updated IDs, verification diff, audit ID | Write gated |
| `activate_plan` | Approved activation plan | Requested and effective statuses | Publish gated |
| `pause_entities` | Approved object IDs and reason | Before/after statuses and audit ID | Write gated |
| `resume_entities` | Approved object IDs | Before/after statuses and audit ID | Publish gated |
| `change_budget` | Approved budget plan | Previous/new budget and spend summary | Write gated |
| `change_schedule` | Approved schedule plan | Previous/new schedule | Write gated |
| `change_targeting` | Approved targeting plan | Previous/new targeting spec | Write gated |
| `change_placements` | Approved placement plan | Previous/new placements | Write gated |
| `replace_creative` | Approved clone-and-replace plan | Old/new ad and creative IDs | Write gated |
| `rollback_plan` | Approved reverse plan | Reconciled rollback result | Write gated |

Tool schemas dung Zod, reject unknown fields va dat gioi han kich thuoc cho list,
text, date range va breakdown combinations.

## 7. Campaign Data Contract

Campaign plan bat buoc co:

- Stable internal `campaign_id`.
- Meta campaign name va objective.
- Buying type va Special Ad Category declaration.
- Conversion destination.
- Campaign, ad set hoac lifetime budget theo cau truc duoc chon.
- `campaign_spend_limit` neu business owner muon gioi han tong campaign.
- Start/end time co timezone ro rang.
- Audience location, age, gender, language va targeting spec.
- Placements.
- Optimization goal, billing event va bid strategy neu ap dung.
- Page/Instagram actor.
- Creative asset references, copy, headline, CTA va destination.
- Tracking parameters va attribution settings neu duoc cau hinh.
- Business owner, approval reason va source document.

Budget khong co default ngam. Plan thieu budget strategy hoac co currency khong
khop ad account se bi reject.

## 8. Reporting Contract

Moi Ads Insights response phai kem:

- Ad account va object level.
- Reporting start/end.
- `captured_at` va account timezone.
- Requested fields va breakdowns.
- Attribution setting neu API tra ve.
- Currency.
- Paging state.
- Missing fields, partial data va API limitations.

Core fields ban dau:

- Spend, impressions, reach, frequency.
- CPM, clicks, link clicks, CTR va CPC.
- Actions va cost per action.
- Messaging conversation/result fields ma account/API cung cap.
- Campaign, ad set, ad IDs va names.

MCP khong tu dong coi message, click, reaction hoac platform action la qualified
lead, booking hay revenue. Cac metric business nay can duoc noi voi Sales-CRM va
bang chung thanh toan rieng.

## 9. Failure Modes

| Failure | Xu ly |
|---|---|
| Token het han hoac invalid | Dung write, bao reconnect; khong tu xin token moi |
| Thieu permission/asset task | Fail closed va tra exact permission/asset gap |
| Rate limit | Backoff co jitter cho read; write khong retry mu |
| Write timeout | Reconcile current Meta state truoc khi retry |
| Duplicate request | Dung local operation ID, plan digest va object reconciliation |
| Meta reject creative/targeting | Giu object cu; object moi van PAUSED; tra review reason |
| Partial create | Giu tat ca object moi PAUSED va tao cleanup/rollback plan |
| Before-state changed | Invalidate approval va yeu cau tao diff moi |
| Audit write failure | Khong thuc hien write neu chua ghi duoc pre-operation audit |
| Meta unavailable | Graceful error; khong chuyen sang browser automation de ghi thay |

Khong gia dinh Meta Marketing API ho tro mot idempotency key chung cho moi write
endpoint. Idempotency duoc thuc hien bang local operation record, deterministic
naming khi phu hop va read-after-write reconciliation.

## 10. Rollback

- Create: pause cac object vua tao; khong delete.
- Status change: khoi phuc status truoc neu object chua bi thay doi boi nguoi khac.
- Budget/schedule/targeting/placements: apply reverse plan tu before snapshot.
- Creative replacement: pause ad moi va resume ad cu neu ad cu van hop le.
- Permission/token incident: disable Ads MCP registration va xoa token Ads write
  khoi Keychain; organic read-only MCP van hoat dong.

Neu Meta state khong con khop voi after-state cua operation, rollback dung lai va
tao review plan moi thay vi overwrite thay doi ben ngoai.

## 11. Test Plan

### Automated tests

- Unit tests cho Meta client, canonical JSON, digest, redaction va reconciliation.
- Contract tests cho input/output schema cua tat ca tools.
- Mock tests cho create, update, activate, pause, partial failure va timeout.
- Safety tests dam bao token khong xuat hien trong output/log.
- Approval tests cho expiry, replay, digest mismatch va stale before-state.
- Budget tests cho daily/lifetime budget, currency mismatch va campaign spend limit.
- Source tests khong co billing, permission-admin hoac delete tools.

Tests khong goi live write API va khong tieu tien.

### Live verification

1. Read smoke test: account identity, asset linkage, campaign listing va Insights.
2. Write permission probe khong tao object neu Meta co endpoint/flow phu hop.
3. Write smoke test chi chay sau approval rieng: tao campaign test that o trang
   thai `PAUSED`, read back, sau do pause/giu `PAUSED`.
4. Activation test chi thuc hien tren campaign that khi Rocky phe duyet mot
   activation plan co budget va schedule ro rang.

### Validation commands

```bash
npm test
npm run test:skills
npm run workspace:check
```

## 12. Trinh Tu Trien Khai

### Phase 1: Connection foundation

- Tao Ads MCP skeleton va Meta client.
- Tao Keychain launcher va account allowlist.
- Ket noi app `side-agency`.
- Verify Business, ad account, Page, Instagram actor va permissions.
- Chay read-only smoke test.

### Phase 2: Read and planning

- Implement read tools, Insights va reporting metadata.
- Implement local plan store, canonical digest, preview va diff.
- Implement audit log va secret redaction.

### Phase 3: Gated writes

- Implement native approval gate.
- Implement create-as-PAUSED va read-after-write reconciliation.
- Implement update, status controls va clone-and-replace.
- Implement reverse plans va rollback.

### Phase 4: Controlled live validation

- Rocky review mot campaign plan that.
- Tao campaign o `PAUSED`.
- Verify tren Meta Ads Manager.
- Chi activate khi co approval rieng.

## 13. Operational Ownership

- Technology-Automation so huu connector, tests va runbook.
- Marketing-Growth so huu campaign brief, media plan va optimization decision.
- Creative-Production so huu approved media assets va usage rights.
- Sales-CRM so huu qualified lead, quote va booking definitions.
- Data-Analytics so huu metric definitions, snapshots va attribution limitations.
- Rocky giu quyen phe duyet write, activation va permission changes.

## 14. Completion Criteria

- `travelframe_meta_ads` duoc dang ky local va chi truy cap account allowlist.
- Keychain credential flow hoat dong ma khong lo secret.
- Read tools va Ads Insights duoc live verify.
- Planning, approval, audit, write va rollback tools co mock/contract tests.
- Campaign test dau tien duoc tao `PAUSED` va read-back match plan sau approval.
- Khong co billing/admin/delete capability.
- Tat ca validation commands dat PASS, hoac baseline failure duoc ghi ro va
  chung minh khong do connector moi gay ra.
