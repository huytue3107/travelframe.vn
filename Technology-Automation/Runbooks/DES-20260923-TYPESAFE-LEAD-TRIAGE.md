# Integration Design: TypeSafe Lead Triage

- **Ma thiet ke:** `DES-20260923-TYPESAFE-LEAD-TRIAGE`
- **Chu tri:** Technology-Automation
- **Business owner:** Sales-CRM
- **Trang thai:** Review
- **Ngay lap:** 2026-09-23
- **Phe duyet thiet ke hoi thoai:** Rocky, 2026-09-23 (rocky cung cap API key va yeu cau trien khai)
- **Phe duyet ban spec:** Da duyet qua plan mode 2026-09-23

---

## 1. Tong Quan Va Muc Tieu

Tao mot service lead triage nho (1 file ESM) ket noi TypeSafe System One API
(model `jev-latest`) vao booking workflow cua TravelFrame. Service nhan
conversation DM + fields da thu, goi 1 request TypeSafe voi 6 typed questions,
roi CODE ap routing policy deterministic de:

- Chon route: `escalate_human` / `review` / `nurture` kem priority P1-P3.
- Sinh actions set ManyChat custom fields va add tags theo mapping co san.
- Giu hang doi human theo do nhong: lead nong hoac co signal an toan di truoc.

Service khong tu dong gui gi ca. Output la JSON cho nguoi chay lenh hoac
(tuong lai) webhook ManyChat External Request sau khi co approval rieng.

### Success criteria

1. 1 request TypeSafe / lead, tra ve dung 6 answers typed (choice/noul/score).
2. Routing policy deterministic, chay trong code, co unit test cho tung hang.
3. Mock mode deterministic, offline, khong can key, khong ra internet.
4. Output khong bao gio chua gia tour (guard xung dot gia trong tai lieu).
5. Mock + live smoke + toan bo workspace gates pass.

### Non-goals

- Khong auto-reply, khong wire ManyChat External Request trong phien ban dau.
- Khong bao gia, khong cam ket lich, Train Street access hay thoi tiet.
- Khong dong du lieu website booking (Drupal repo khac, ngoai workspace).
- Khong quan ly CRM, khong luu PII vao Git.

## 2. Kien Truc

```text
Inbound DM (IG / WhatsApp / website lead)
  -> Nguoi (hoac webhook tuong lai) goi triage voi state JSON
      -> typesafe_lead_triage.mjs
           +-- validateState()        (input contract)
           +-- buildState()           (conversation_text, collected_fields, language)
           +-- callTypeSafe()         (transport injectable: http | mock)
           +-- applyRoutingPolicy()   (deterministic, code-only)
           +-- buildActions()         (mapping confidence >= 0.6)
           +-- guardrails             (khong gia, khong cam ket lich)
      -> JSON output: answers + decision + actions
  -> Nguoi ap actions vao ManyChat (hoac webhook sau approval)
```

1 file duy nhất `Technology-Automation/Scripts/typesafe_lead_triage.mjs` theo quy
uoc script don file cua workspace (`fetch_media_asset.mjs`). Export ca cac ham de
test va webhook tuong lai import. Khong them dependency — dung `fetch` Node 20+
 thay vi `@typesafe-ai/sdk` de khong doi package-lock truoc khi duyet API.

## 3. Luong Du Lieu Va Approval

Hien tai (phase 1): nguoi xuly DM thu cong nhu hien nay. Khi muon triage, copy
state JSON (transcript + fields) goi CLI, doc output, tu ap fields/tags trong
ManyChat theo mapping. Khong co du lieu nao tu dong ghi len ManyChat.

Tuong lai (can runbook + approval rieng): ManyChat External Request POST state
den service, response actions bien thanh Set Custom Field / Add Tag trong flow.

Duyet API tra phi: Rocky da cung cap key 2026-09-23. Moi lan chay live can
`--live` + `TYPESAFE_LIVE_APPROVED=1` o thoi diem goi (khong de ambient trong .env).

## 4. Ranh Gioi Bao Mat

- `TYPESAFE_API_KEY` chi nam trong `.env` (da gitignore, verify bang
  `git check-ignore -v .env`). Script load qua `loadEnv()` pattern, khong in.
- Khong log conversation (PII) ra file. Stdout chi chua JSON output cua triage;
  transcript chi di ra API typesafe.ai qua HTTPS.
- Khong dua secret vao URL, doc, commit. Test fixture dung hoi thoao gia.
- Neu key ro ri ra chat/log: yeu cau Rocky rotate.

## 5. Approval Contract

Da duyet (2026-09-23):

1. Dung TypeSafe API tra phi (Rocky cung cap key).
2. Trien khai script + test + runbook + doc Sales-CRM (Draft/Review).

Chua duyet — can approval rieng cua Rocky:

1. Tao tag `TF_Intent_B2B` trong ManyChat UI (prerequisite cho action B2B).
2. Bat cu automation live: wire webhook External Request, auto-apply tags.
3. Chay live voi du lieu khach that dai loan (live smoke chi dung state synthetic).

## 6. Tool Schemas

CLI:

```text
npm run triage -- --mock <scenario>           # offline, deterministic
npm run triage -- --input state.json --live   # goi API that (3 lop chan)
```

Flags: `--input <file>` (state JSON), `--mock <scenario>`, `--live`, `--help`.

Exported API (cho test + webhook):

```text
validateState(input) -> state          // throw loi ro rang neu sai contract
buildState(input) -> apiState          // state cho API typesafe
buildQuestions() -> questions          // 6 questions map
callTypeSafe(state, {transport}) -> {answers, usage}
applyRoutingPolicy(answers) -> {route, priority, reasons}
buildActions(answers, decision) -> actions[]
triage(input, opts) -> full output JSON
```

## 7. Data Contract

Input state:

```json
{
  "source": "manychat | whatsapp | manual",
  "subscriber": { "id": "string", "language": "en | vi | unknown" },
  "conversation": [ { "role": "user | bot | agent", "text": "string", "ts": "ISO?" } ],
  "fields": { "TF_Travel_Date": "...", "...": "8 TF fields tuy chon" },
  "tags": [ "..." ]
}
```

Output: `meta` (mode, model, ts), `answers` (intent, trip_horizon, party_type,
purchase_intent, has_travel_date, needs_human), `decision` (route, priority,
reasons), `actions` (set_field/add_tag), `guardrails` (price_quoted: false,
date_committed: false).

Mapping (chi thuc thi khi confidence >= 0.6; noul dung chinh gia tri):

| Answer | Field/Tags |
|---|---|
| intent=photo_tour_inquiry | `TF_Intent_PhotoTour` |
| intent=local_tour_inquiry | `TF_Intent_LocalTour` |
| intent=general_travel_tips | `TF_Intent_TravelTips` |
| intent=b2b_partnership | `TF_Intent_B2B` (requires_manychat_setup) |
| intent=price_question | KHONG tag intent (AI khong bao gia) |
| trip_horizon | `TF_Trip_Horizon` = "This month"/"In 1-3 months"/"Later this year"/"Just researching" + `TF_Trip_ThisMonth|1to3Months|Later` + `TF_Researching` |
| party_type | `TF_Party_Type` = "Just me"/"My partner"/"Friends"/"Family" + `TF_Party_Solo|Couple|Friends|Family` |
| route escalate_human | `TF_Status_HumanHandoff` |
| purchase_intent.score >= 2.5 | `TF_Status_Qualified` |
| route review | `TF_Status_HumanHandoff`, khong tag intent |

## 8. Reporting

- stdout: JSON output duy nhat. stderr: loi.
- Moi lan chay live, nguoi chay ghi lai (mode, decision, usage tokens) vao
  snapshot `Data-Analytics/` khi co nhip report. Script khong tu ghi file.
- Cost/request doc tu `usage` trong response API neu co.

## 9. Failure Modes

| Loi | Xu ly |
|---|---|
| Thieu `TYPESAFE_API_KEY` khi --live | exit 2, huong dan .env |
| Thieu `TYPESAFE_LIVE_APPROVED=1` khi --live | exit 2, tu choi goi |
| Input sai contract | throw voi mo ta field sai |
| HTTP 401/422/429/529 | exit 1, hien status + message (khong in key) |
| Answers thieu question id | answer mac dinh conf 0 -> policy cho review |
| Tieng Viet conf thap | policy hang 5 tu chua: review, khong tag |

## 10. Rollback

Xoa: `typesafe_lead_triage.mjs`, test file, runbook, doc Sales-CRM, 2 npm
script, 2 dong README. Khong co gi live bi anh huong (khong webhook, khong
ManyChat change). `.env` giu nguyen.

## 11. Test Plan

- `npm run test:triage`: 6 fixtures (photo_tour_ready, general_tips_researching,
  vi_ambiguous, b2b_inquiry, safety_needs_human, price_question) qua mock
  transport injectable; 1 test inject fetch-throw de assert mock khong ra
  internet; unit table-driven cho 6 hang policy; schema validation; guard gia
  (output khong chua $75|$130|$180|$160|$290).
- Live smoke sau duyet: 1 state synthetic, `TYPESAFE_LIVE_APPROVED=1 npm run
  triage -- --input <synthetic>.json --live`, kiem tra answers hop le + usage.

## 12. Trinh Tu Trien Khai

1. Runbook DES (Draft) -> script (questions, policy, mock, CLI) -> test ->
   npm scripts + README + doc Sales-CRM.
2. Full gates: `npm run test:skills && npm run test:mcp && npm run test:triage
   && npm run workspace:check`.
3. Live smoke synthetic, ghi cost.
4. (Rieng) Rocky tao tag `TF_Intent_B2B`; (rieng, runbook khac) wire webhook.

## 13. Operational Ownership

- **Technology-Automation:** code, test, runbook, npm scripts.
- **Sales-CRM:** policy nghiep vu (thresholds, mapping, handoff queue), doc.
- **Rocky:** approval (pricing, tags moi, automation live), gia tour chot.

## 14. Completion Criteria

1. Toan bo gates xanh (test:skills, test:mcp, test:triage, workspace:check).
2. Mock suite pass offline, khong network.
3. Guard gia: khong output nao chua gia tour.
4. Live smoke synthetic thanh cong, usage duoc ghi.
5. Doc Sales-CRM o trang thai Draft cho Rocky review; chua dong tag moi.