# Integration Design: JEV Content Classifier (Threads Scan Pipeline)

- **Ma thiet ke:** `DES-20260925-JEV-CONTENT-CLASSIFIER`
- **Chu tri:** Technology-Automation
- **Business owner:** Marketing-Growth (skill `threads-engagement`)
- **Trang thai:** Da duyet (Rocky phe duyet live mac dinh 2026-09-25)
- **Ngay lap:** 2026-09-25
- **Lien quan:** `DES-20260923-TYPESAFE-LEAD-TRIAGE` (cung model `jev-latest`, cung approval gate)

---

## 1. Tong Quan Va Muc Tieu

Xay lai kien truc quet noi dung cua `threads_interact.mjs` thanh pipeline hybrid:
deterministic truoc, model sau, policy trong code. JEV (`jev-latest`) duoc dua vao
khau **phan loai noi dung** (truoc khi quyet dinh tuong tac), khong chi chay o buoc
lead triage nhu hien tai.

Muc tieu: tim noi dung chinh xac hon — tang recall bai dung chu de (ke ca bai
khong chua tu khoa whitelist), giam comment lech ngu canh, bat lead an.

### Success criteria

1. 1 request JEV / bai ung vien, tra ve 4 typed answers (choice/noul).
2. Tier 1 blacklist luon chay deterministic TRUOC va khong bao gio de model override.
3. Policy deterministic trong code: confidence >= 0.6 moi tin JEV; duoi do fallback
   keyword heuristic (hoac skip theo mode).
4. `--mode feed` khong bi chan boi `contextTopic === 'general'` (Newsfeed Interaction
   Rule); `--mode search`/`international` van giu Zero-Generic Skip.
5. Mock mode deterministic, offline, khong key, khong ra internet. Live goi can
   `TYPESAFE_LIVE_APPROVED=1` (gate cua Rocky).
6. Unit test cho policy + mock; `npm run test:skills` va `npm run workspace:check` pass.

### Non-goals

- Khong sinh noi dung binh luan bang JEV (comment pool van la template co san;
  ca nhan hoa comment la phase sau).
- Khong thay doi pacing, no-reload rule, author cooldown, hoac luong lead triage.
- Khong chay live JEV khi chua co Rocky approval; khong luu PII vao Git.

## 2. Kien Truc

```text
Bai tren feed / search
  -> Tier 1 blacklist (deterministic, hard stop — JEV khong duoc override)
  -> Prefilter keyword (Tier 2 whitelist: mo recall ung vien, khong phai quyet dinh cuoi)
  -> classifyContentWithJev()
       +-- neu TYPESAFE_LIVE_APPROVED=1 + TYPESAFE_API_KEY:
       |     goi typesafe_content_classifier.mjs --live (1 request, 4 typed questions)
       +-- nguoc lai: keyword heuristic, log ro "offline"
  -> Policy code (deterministic):
       +-- conf >= 0.6  -> dung ket qua JEV (relevant, topic, is_lead, season_claim)
       +-- conf <  0.6  -> fallback keyword; search mode co the skip
       +-- mode feed    -> khong skip vi 'general'; Like-only khi khong co reply dung ngu canh
       +-- mode search  -> skip khi khong relevant (Zero-Generic Skip Rule)
  -> is_lead (regex hoac JEV confident) -> triageLeadWithJev (DES-20260923, nguyen van)
```

2 file ESM don file theo quy uoc workspace:

- `Technology-Automation/Scripts/typesafe_content_classifier.mjs` — classifier service.
- `.agents/skills/threads-engagement/scripts/threads_interact.mjs` — pipeline runner
  (goi classifier qua `execFileSync` giong cach goi `typesafe_lead_triage.mjs`).

## 3. Luong Du Lieu Va Approval

- Input classifier: JSON `{ source_post_url, root_text, comments: [{author, text, like_count}] }`
  (text da cat ngan, khong chua token/cookie).
- Live la mac dinh (Rocky phe duyet 2026-09-25). Can `TYPESAFE_API_KEY` trong `.env`
  (gitignored). API tra phi — moi ung vien 1 request. Dat `TYPESAFE_LIVE_APPROVED=0`
  de chay offline/mock.
- Moi lan goi live = 1 request/ bai ung vien. Latency 1-3s nam trong pacing 45-75s.

## 4. Ranh Gioi Bao Mat

- Khong doc, in hay commit `.env`, token, cookie trinh duyet.
- Khong dua secret vao URL, log hay output JSON.
- Model khong duoc phep quyet dinh hanh dong doc hai: skip/like/comment luon do
  code policy quyet dinh sau khi nhan classification.

## 5. Approval Contract

| Hanh dong | Gate |
|---|---|
| Chay mock offline, unit test | Khong can |
| Goi live JEV (classifier hoac triage) | Mac dinh bat — Rocky phe duyet 2026-09-25; can `TYPESAFE_API_KEY`. `TYPESAFE_LIVE_APPROVED=0` de tat |
| Bat nhieu hon 1 request / bai | Can review lai chi phi truoc |
| Thay doi policy nguong confidence | Can ghi vao runbook nay truoc khi deploy |

## 6. Tool Schemas

Typed questions (1 request, independent questions over same state):

| Question | Type | Y nghia |
|---|---|---|
| `content_relevance` | choice: `relevant` / `borderline` / `not_relevant` | Bai co thuoc pham vi du lich Ha Noi / mien Bac / photo experience / solo travel / len ke hoach chuyen di khong |
| `topic` | choice: `hanoi_autumn`, `street_food`, `photo_tour`, `mountain_views`, `solo_travel`, `pricing_budget`, `en_solo`, `en_photo`, `en_itinerary`, `en_food`, `international_vietnam`, `general` | Chu de de chon comment pool dung ngu canh |
| `lead_signal` | choice: `none` / `price_question` / `photo_tour_request` / `itinerary_request` / `guide_request` | Bat lead an ma regex bo sot |
| `season_claim` | noul 0-1 | Bai/co comment de cap mua vu (lua chin, hoa, thoi tiet) de reply phai khop |

Moi answer kem `confidence` (0-1). Nguong: `CONF_GATE = 0.6` (tin JEV),
`CONF_FALLBACK = 0.5` (duoi nay khong tin ca keyword lẫn model, skip/like-only).

## 7. Data Contract

Output JSON:

```json
{
  "meta": { "mode": "mock|live", "model": "jev-latest", "ts": "...", "usage": null },
  "answers": {
    "content_relevance": { "choice": "relevant", "confidence": 0.9 },
    "topic": { "choice": "photo_tour", "confidence": 0.85 },
    "lead_signal": { "choice": "none", "confidence": 0.8 },
    "season_claim": { "noul": 0.1 }
  },
  "classification": {
    "relevant": true,
    "topic": "photo_tour",
    "is_lead": false,
    "lead_kind": "none",
    "season_claim": 0.1,
    "confidence": 0.85,
    "trusted": true,
    "source": "jev|mock"
  }
}
```

`trusted = confidence >= 0.6`. `threads_interact.mjs` chi dung `classification`
khi `trusted === true`, nguoc lai fallback keyword.

## 8. Reporting

- Log stdout cua runner ghi ro nguon phan loai: `[JEV Classifier] ... (jev|keyword)`.
- Nhat ky tuong tac (`Threads-All-Interactions-Log.md`) giu nguyen dinh dang;
  Like-only (newsfeed) duoc ghi voi topic `Newsfeed: like-only`.
- Khong dua classification vao khoa ngoai he thong.

## 9. Failure Modes

| Failure | Xu ly |
|---|---|
| API loi / timeout | Fallback keyword heuristic, log ngan, khong crash session |
| Confidence thap (< 0.6) | Fallback keyword; search mode skip; feed mode Like-only |
| JEV tra topic ngoai choice list | `normalizeAnswers` ve `general`, khong tin (trusted=false) |
| JEV noi "relevant" nhung Tier 1 blacklist trung | Tier 1 thang, van skip |
| Input khong hop le | validateState loi ro, khong goi API |

## 10. Rollback

Chi sua 2 file script + docs. Rollback = revert commit; khong co du lieu live, khong
co automation dang chay. Neu live da bat: dat `TYPESAFE_LIVE_APPROVED=0` de quay
ve offline ngay lap tuc.

## 11. Test Plan

1. Unit test `typesafe_content_classifier.test.mjs`: validate input, mock scenario
   tra dung classification, policy trusted/low-conf, topic khong hop le ve `general`,
   CLI live gate tra exit code 2 khi thieu approval.
2. `node --check threads_interact.mjs` + chay `--mode single` dry-run tren URL mau.
3. `npm run test:triage` (khong pha luong triage cu), `npm run test:skills`,
   `npm run workspace:check`.

## 12. Trinh Tu Trien Khai

1. `typesafe_content_classifier.mjs` + unit test (hoan tat khi test pass).
2. Nang cap pipeline `threads_interact.mjs` (Tier 1 hard stop, JEV classify,
   policy mode-aware, Newsfeed Interaction Rule).
3. Cap nhat SKILL.md / playbook / agent doc + sync mirror `.claude`.
4. Chay gates (test:classifier, test:triage, test:skills, workspace:check).
5. **Da nhan phe duyet Rocky 2026-09-25:** live la mac dinh; `TYPESAFE_LIVE_APPROVED=0`
   la cong tat offline khi can.

## 13. Operational Ownership

- Script: Technology-Automation. Chay va log: Marketing-Growth (AGT-MKT-THREADS-01).
- API key: Rocky. Nguong policy: Technology-Automation ghi vao runbook nay.

## 14. Completion Criteria

- [x] Classifier service + tests offline pass.
- [x] Pipeline hybrid trong `threads_interact.mjs` (feed/search phan nhanh dung rule).
- [x] Docs + mirror sync, gates pass.
- [x] Rocky phe duyet live mac dinh (2026-09-25).
