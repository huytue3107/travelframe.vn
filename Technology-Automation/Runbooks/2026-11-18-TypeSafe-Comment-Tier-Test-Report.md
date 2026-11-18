# Báo cáo test: TypeSafe Comment Tiering (Tier 1–4)

- **Chủ trì:** Technology-Automation · **Business owner:** Marketing-Growth / Sales-CRM
- **Trạng thái:** Draft (chưa wire vào automation live)
- **Ngày:** 2026-11-18
- **Phê duyệt:** Rocky "duyệt" 2026-11-18 cho vòng test live TypeSafe (chỉ đọc + phân loại, không đăng/ẩn/trả lời).
- **Model:** `jev-latest` (TypeSafe System One)

## 1. Mục tiêu

Phân tầng bình luận FB/IG theo quy tắc "Phân tầng bình luận" trong `CLAUDE.md`
bằng TypeSafe, theo nguyên tắc của skill `typesafe-ai`: **Jev trả lời các phán đoán
nguyên tử, code quyết định tier**.

## 2. Thiết kế

Mỗi bình luận = 1 request, 7 câu hỏi Noul (xác suất "có"):

| Câu hỏi | Dùng cho |
|---|---|
| `trip_plan` — nói về chuyến đi Việt Nam sắp tới | Tier 1 |
| `visit_question` — hỏi thực tế khi đi (giờ, địa điểm, đông, thời tiết, an toàn) | Tier 1 |
| `price_or_booking` — hỏi giá / cách đặt tour, thợ ảnh | Tier 1 |
| `invites_companion` — rủ người được tag đi Việt Nam cùng | Tier 1 |
| `requests_guide` — xin cẩm nang/bản đồ theo từ khóa | Tier 2 |
| `hostile` — xúc phạm, đe dọa, miệt thị | Tier 4 |
| `spam` — quảng cáo sản phẩm/dịch vụ/link không liên quan | Tier 4 |

Truth table (code, `classifyTier`), ngưỡng 0.7 / 0.3:

1. `hostile` hoặc `spam` ≥ 0.7 → **Tier 4** (đề xuất ẩn, luôn chờ Rocky duyệt).
2. Bất kỳ tín hiệu Tier 1 ≥ 0.7 → **Tier 1**.
3. Từ khóa CTA khớp chính xác (FOOD, HANOI, PHOTO, MAP, SAFE — so khớp bằng code) hoặc `requests_guide` ≥ 0.7 → **Tier 2**.
4. Còn lại → **Tier 3**. Bình luận rỗng (sticker/ảnh) → Tier 3 bằng code, không gọi API.
5. Cờ `review` khi một câu trả lời nằm giữa 0.3–0.7 **và** có thể đổi tier (thuộc tier ưu tiên cao hơn tier đã chọn).

Không dùng `confidence` làm cổng quyết định.

## 3. Dữ liệu

- **Thật:** `Data-Analytics/facebook-comments-14days.json` (68 bình luận, 16 bài). Author đã là placeholder; tên bạn bè được tag trong nội dung đã thay bằng `[Tagged friend]`. Bỏ trùng → 45 case (3 sticker rỗng).
- **Tổng hợp (hard cases):** 10 case — hỏi giá, rủ bạn, an toàn đi đêm, MAP, spam kiếm tiền, khiêu khích, thời tiết, "food guide pls", tiếng Việt, kỷ niệm cũ.
- **Holdout:** 10 case mới viết sau khi chốt câu hỏi, không dùng để chỉnh (nặng tiếng Việt: hỏi lạnh tháng 12, rủ đi Tết, spam bán SIM, đùa với bạn).

Kết quả từng case (xác suất từng câu hỏi, tier, lý do): `Technology-Automation/Tests/fixtures/typesafe-comment-tier/`.

## 4. Kết quả

| Bộ | Đúng tier | Cờ review |
|---|---|---|
| Vòng 1 (thật + tổng hợp) | **54/55** | 5 (3 là Tier 4 bắt buộc duyệt) |
| Holdout | **10/10** | 2 (1 là Tier 4) |

Ma trận vòng 1: T1 9/9 · T2 10/10 · T4 3/3 · T3 32/33.

Ca sai duy nhất: `R47` "[Tagged friend] bánh mì nhà ai đây :))" (đùa với bạn) →
Jev đọc là hỏi địa điểm (`visit_question` 0.75) → Tier 1 thay vì Tier 3. Câu này
đúng là mơ hồ (cũng có thể hiểu là "quán nào vậy"). Rủi ro thấp: Tier 1 chỉ dẫn tới
một câu trả lời sâu hơn, vẫn qua bước duyệt. Holdout `H10` (đùa tương tự) được xếp đúng Tier 3.

Ca biên đáng chú ý (hệ thống báo đúng là chưa chắc):

- "I will return ❤️" → `trip_plan` 0.58 → Tier 3 + review (ý định mơ hồ, không cụ thể).
- "send me the map pls" → Tier 2, `visit_question` 0.53 → review.

Chi phí: 64 request, ~58.300 input tokens (output tokens miễn phí; API không trả số tiền).

## 5. Nhận xét về `typesafe_lead_triage.mjs` (DM triage hiện có)

Đối chiếu với skill `typesafe-ai`, chưa sửa gì:

1. **Gate bằng `confidence` ≥ 0.6** (`CONF_TAG_GATE`, `CONF_REVIEW_GATE`). Skill khuyến nghị không dùng confidence làm cổng; nên đọc xác suất của chính phương án/Noul.
2. **`needs_human` là câu hỏi ở tầng quyết định.** Nên tách thành các phán đoán quan sát được (vấn đề an toàn, khiếu nại, yêu cầu ngoài phạm vi…) và để code quyết định chuyển người.
3. **`intent` là Choice đơn**: tin nhắn vừa hỏi giá vừa hỏi photo tour sẽ bị chia xác suất. Nên dùng Noul riêng cho từng ý định có thể cùng đúng.
4. Choice nên đi kèm một Noul "có thông tin này không" thay vì phương án `unknown`.

## 6. Bước tiếp theo (cần Rocky duyệt riêng)

1. Chạy tier trên bình luận IG + FB mới mỗi phiên (đọc qua MCP `travelframe-meta`, read-only) và xuất bản tin trình duyệt 4 phần theo `CLAUDE.md`.
2. Áp mục 5 vào DM triage (đổi code + test, chạy lại live).
3. Thêm script `--live` vào repo theo pattern `loadEnv()` / `.env` như DM triage (hiện runner chỉ chạy trong phiên test).

## 7. Rollback

Xóa `Technology-Automation/Scripts/typesafe_comment_tier.mjs`,
`Technology-Automation/Tests/typesafe_comment_tier.test.mjs`, thư mục
`Technology-Automation/Tests/fixtures/typesafe-comment-tier/` và báo cáo này.
Không có thay đổi live nào.
