---
title: Sources & claims — Áo Dài Photoshoot in Hanoi
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Brief: Rocky chọn viết cả 4 bài web (chat 14/11/2026). Website chưa có trang áo dài. Bài này là trang theo tuyến `03-Ao-Dai-Heritage`, liên kết với bài tổng hợp [vietnam photoshoot](../2026-11-14-vietnam-photoshoot-hub/Page-Copy.md) và với listing, reel tại [2026-11-14-viktor-ao-dai-heritage](../2026-11-14-viktor-ao-dai-heritage/sources.md).

Từ khoá: OpenSEO ngày 13/11 không trả dữ liệu cho ao dai, ao dai photoshoot, ao dai photoshoot hanoi, ao dai rental hanoi. Nên đo lại volume trước khi đăng; việc này tốn credit OpenSEO nên chờ Rocky đồng ý. [VERIFY]

## Files

| File | Nội dung |
|---|---|
| [Page-Copy.md](Page-Copy.md) | Bài và các trường SEO |
| [Photo-Plan.md](Photo-Plan.md) | Ảnh đề xuất |

## Patterns used

- P-033 (bài SEO có cầu nối sang dịch vụ)
- P-005 (dòng Pro move)
- P-008 (Train Street: không hứa access, tôn trọng dân cư)
- V-01, V-02, V-06, V-07, V-09 (hỏi trước khi chụp ở đền, chùa)
- I-010 (góc Cổ phục / Áo dài)

## Inspiration

- [Draft tuyến áo dài](../2026-11-14-viktor-ao-dai-heritage/reel-script.md) (14/11): 4 mẹo mặc và chụp.
- [Inbox Guide 14/11](../../../../Sales-CRM/Scripts/2026-11-14-TravelFrame-Photoshoot-Inbox-Guide.md): yêu cầu áo dài phải được team xác nhận.

## Internal links

| Link | Tình trạng (14/11/2026) |
|---|---|
| `/hanoi-photoshoot` | 200 |
| `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` | 200 |
| `/news/vietnam-photoshoot` | Chưa có; là bài tổng hợp mới. [VERIFY] sau khi đăng |

## Claims

| Claim | Trạng thái |
|---|---|
| Áo dài là áo thân dài, ôm người, có vạt trước và vạt sau, mặc với quần rộng | Kiến thức phổ thông |
| Giá, tối thiểu giờ, tối đa 2 khách, quyền lợi từng tầng; VIP 2h = 198 USD | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md), [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| VIP gồm outfit, có thể là áo dài | DEC ghi trang phục (áo dài/outfit) |
| Size, màu có sẵn; áo dài cho khách thứ 2; áo dài nam | [VERIFY] |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h | Verified: DEC |
| Mẹo ngồi: kéo vạt sau sang bên | [VERIFY] nhờ người trong team xác nhận |
| Khách nước ngoài mặc áo dài thường được đón nhận | [VERIFY] nhờ Rocky hoặc team xác nhận cách nói |
| Hỏi người trông coi trước khi chụp ở đền, chùa | Quy tắc V-09 |
| Ảnh áo dài trên đường ray phổ biến trên mạng; TravelFrame không chụp ở đó | Quan sát; quy định nội bộ |
| Bảng màu theo phông nền | Ý kiến nhiếp ảnh, dựa trên ảnh trong thư viện (đỏ ở phố đèn lồng, xanh đậm bên hồ) |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 ở chế độ gần nhất cho bài web (checker không có loại article):

```bash
python3 .claude/skills/content-writing/scripts/check_draft.py \
  --draft Marketing-Growth/Content/Drafts/2026-11-14-ao-dai-photoshoot-hanoi/Page-Copy.md \
  --type reel --no-expect-hashtag \
  --sources-md Marketing-Growth/Content/Drafts/2026-11-14-ao-dai-photoshoot-hanoi/sources.md \
  --knowledge Research-Insights/Library/knowledge
```

- `Page-Copy.md`: **flagged** · VERIFY=7 · quoted span=0 · overlap=0 · không lỗi cứng.
- Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, draft couple và solo, nội dung bài Couple đang chạy), đã bỏ frontmatter: Không trùng. Phần mô tả gói giá dùng cùng câu chữ với /hanoi-photoshoot (Published 13/11), có chủ đích.
- Trạng thái bàn giao: **drafted_flagged**. Chưa đăng, chưa tải ảnh, chưa sửa site.
