# ManyChat + TypeSafe Lead Triage — Hướng dẫn nghiệp vụ

- **Ma doc:** `SAL-20260923-TYPESAFE-TRIAGE`
- **Owner:** Sales-CRM
- **Kỹ thuật:** Technology-Automation (`Technology-Automation/Scripts/typesafe_lead_triage.mjs`, runbook `DES-20260923-TYPESAFE-LEAD-TRIAGE`)
- **Status:** Draft — chờ Rocky review
- **Ngày:** 2026-09-23

## 1. Công cụ này làm gì

Nhận 1 conversation DM (đã qualify thủ công theo flow hiện hành) → gọi TypeSafe
System One (model `jev-latest`) 1 request với 6 câu hỏi typed → trả về:

- **route:** `escalate_human` / `review` / `nurture` + priority `P1|P2|P3`
- **actions:** các `set_field` / `add_tag` áp vào ManyChat theo mapping dưới

Nó giúp xếp hàng đợi handoff theo độ nóng thay vì FIFO. Nó **không** thay
thế qualify 2 câu ("When are you planning to visit Hanoi?" / "Who are you
traveling with?") và **không** auto-apply gì cả — người vận hành chép actions
vào ManyChat, hoặc (tương lai, cần approval riêng) webhook External Request.

## 2. Cách chạy

```bash
npm run triage -- --input state.json --live   # state thật, cần TYPESAFE_LIVE_APPROVED=1
npm run triage -- --mock photo_tour_ready     # tập offline, không tốn phí
```

File state mẫu (synthetic, không PII):

```json
{
  "source": "manychat",
  "subscriber": { "id": "ig-12345", "language": "en" },
  "conversation": [
    { "role": "user", "text": "..." },
    { "role": "bot", "text": "..." }
  ],
  "fields": { "TF_Source_Post": "IG Reel photo CTA" },
  "tags": ["TF_Source_Photo"]
}
```

Luật bắt buộc khi dựng state: chép transcript nguyên văn, không biên tập,
không đưa PII (tên, SĐT, địa chỉ) vào file state; file dùng một lần rồi xóa.

## 3. Mapping output → ManyChat

Chỉ áp action khi confidence ≥ 0.6 (noul dùng chính giá trị):

| Answer | Set field | Add tag |
|---|---|---|
| intent = photo_tour_inquiry | — | `TF_Intent_PhotoTour` |
| intent = local_tour_inquiry | — | `TF_Intent_LocalTour` |
| intent = general_travel_tips | — | `TF_Intent_TravelTips` |
| intent = b2b_partnership | — | `TF_Intent_B2B` ⚠ cần Rocky tạo trước |
| intent = price_question | — | *(không tag — người báo giá)* |
| trip_horizon = within_this_month | `TF_Trip_Horizon` = "This month" | `TF_Trip_ThisMonth` |
| trip_horizon = one_to_three_months | `TF_Trip_Horizon` = "In 1-3 months" | `TF_Trip_1to3Months` |
| trip_horizon = later_this_year | `TF_Trip_Horizon` = "Later this year" | `TF_Trip_Later` |
| trip_horizon = researching_or_unknown | `TF_Trip_Horizon` = "Just researching" | `TF_Researching` |
| party_type = solo / couple / friends / family | `TF_Party_Type` = "Just me" / "My partner" / "Friends" / "Family" | `TF_Party_Solo` / `TF_Party_Couple` / `TF_Party_Friends` / `TF_Party_Family` |
| purchase_intent.score ≥ 2.5 | — | `TF_Status_Qualified` |
| route = escalate_human hoặc review | — | `TF_Status_HumanHandoff` |

## 4. Vận hành hàng đợi

1. **P1 (escalate_human):** trả lời trong giờ làm việc (≤ 4h). Lý do hợp lệ:
   cần người (safety/complaint), B2B, lead có ngày + chi tiết (score ≥ 2.5).
2. **P2 (review + price):** model không chắc intent, hoặc hỏi giá → **người
   chốt giá theo bảng giá được Rocky phê duyệt**. Tool không bao giờ trả giá
   (giá đang xung đột giữa tài liệu: $75/$130/$180 vs $75/$160/$290).
3. **P3 (nurture):** trả lời theo ManyChat flow hiện hành, không handoff.

## 5. Prerequisites & giới hạn

- ⚠ Rocky cần tạo tag `TF_Intent_B2B` trong ManyChat trước khi dùng output B2B.
- Mọi booking vẫn chỉ được xác nhận sau khi date, plan, inclusions thỏa thuận
  bằng văn bản — không thay đổi quy tắc ManyChat hiện hành.
- Tool không gửi tin nhắn, không sửa flow, không chạm website booking.
- Tiếng Việt: model thiên tiếng Anh — conversation tiếng Việt có thể rơi `review`;
  đó là hành vi an toàn (dẫn về người), không phải lỗi.

## 6. Kịch bản an toàn

- Bật automation live (webhook External Request tự áp tags): **cần approval
  riêng của Rocky + runbook riêng.**
- Live API tốn phí: đã được Rocky cấp key 2026-09-23; mỗi request dùng ~300
  input tokens, ghi usage vào `Data-Analytics/` khi có nhip report.
- Không lưu PII vào Git; file state nằm ngoài Git hoặc xóa sau khi chạy.
