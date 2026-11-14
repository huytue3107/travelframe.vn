---
title: Sources & claims — Áo Dài Heritage (Viktor product line 03)
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Tuyến sản phẩm: `03-Ao-Dai-Heritage` trong [Viktor Image Library](../../viktor-travelframe/README.md). Phạm vi do Rocky chọn (chat 14/11/2026, phương án mặc định).

Lưu ý vận hành: [Inbox Guide 14/11](../../../../Sales-CRM/Scripts/2026-11-14-TravelFrame-Photoshoot-Inbox-Guide.md) ghi yêu cầu áo dài phải được team xác nhận trước khi coi là một phần của gói. Listing này dựa trên DEC: VIP gồm trang phục (áo dài/outfit). Các chi tiết vận hành (size, màu, chỗ thuê cho Basic và Premium, áo dài cho khách thứ 2) đánh dấu [VERIFY].

## Files

| File | Loại | Kênh |
|---|---|---|
| [listing.md](listing.md) | Listing copy | Viktor (nền tảng chưa xác nhận), OTA, GBP, trang dịch vụ |
| [reel-script.md](reel-script.md) | Reel dựng từ ảnh tĩnh | Instagram, Facebook Page |
| [caption.md](caption.md) | Caption reel | Instagram, Facebook Page |
| [seed-comments.md](seed-comments.md) | Seed comment C1, C2 | Instagram, Facebook Page |

## Patterns used

- P-001 (hook: lần đầu mặc áo dài + promise 4 điều)
- P-005 (dòng Pro move)
- P-006 (save + send cho người bạn hay nói sẽ thử)
- P-007 (comment keyword PHOTO)
- V-01, V-02, V-03, V-06, V-07, V-09 (hỏi trước khi chụp ở đền, chùa)
- I-010 (góc Cổ phục / Áo dài trong 8 core angles)

## Inspiration

- [Viktor Static Ads Master Library](../../../Plans/2026-10-02-Viktor-Static-Ads-Master-Library-26-Concepts.md), nhóm Áo dài (đọc 14/11/2026). Không dùng lại câu chữ. Bỏ ad trackside vì là ảnh trên đường ray.
- Từ khoá: what to wear in vietnam 320 (KD 0). Áo dài photoshoot hanoi, ao dai rental hanoi: OpenSEO không trả dữ liệu ([keywords.csv](../../../SEO/2026-11-13-Keyword-Research-Awareness-Holidays/keywords.csv), 13/11/2026).

## Claims

| Claim | Trạng thái |
|---|---|
| Giá, tối thiểu giờ, tối đa 2 khách, quyền lợi từng tầng | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md), [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| VIP gồm trang phục (áo dài) | Verified: bảng chi tiết, dòng Trang phục (áo dài/outfit) |
| VIP 2h = 198 USD | Verified: bảng chi tiết |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h | Verified: DEC |
| Áo dài cho khách thứ 2 trên VIP | [VERIFY] DEC ghi chưa quyết; copy giữ trung lập theo D2 |
| Size và màu áo dài có sẵn | [VERIFY] |
| Gợi ý chỗ thuê áo dài cho Basic, Premium | [VERIFY] |
| Áo dài là áo thân dài, ôm người, mặc với quần rộng | Kiến thức phổ thông, rủi ro thấp |
| Người nước ngoài mặc áo dài được đón nhận | [VERIFY] nhờ Rocky hoặc team xác nhận cách nói |
| Mẹo ngồi: kéo vạt sau sang bên để khỏi nhăn | Mẹo phổ thông; nhờ người mặc áo dài trong team xác nhận trước khi đăng |
| Hỏi người trông coi trước khi chụp ở đền, chùa | Quy tắc V-09 |
| Điểm hẹn gần Hồ Gươm | [VERIFY] |
| Giá trên nền tảng sau hoa hồng, chính sách mưa và huỷ | [VERIFY] |
| Consent của người trong ảnh | [VERIFY] |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 với knowledge base workspace, không có nguồn ngoài:

- `listing.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=9 · quoted span=0 · overlap=0 · không lỗi cứng
- `reel-script.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=1 · quoted span=0 · overlap=0 · không lỗi cứng
- `caption.md` (--type reel): **pass** · VERIFY=0 · quoted span=0 · overlap=0 · không lỗi cứng

Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, các draft couple và solo đã có), đã bỏ frontmatter và dòng đường dẫn ảnh: caption, script, slides không trùng. Listing chỉ trùng phần mô tả gói và thời gian giao ảnh với Body.html của /hanoi-photoshoot (copy đã duyệt và đã đăng), giữ nguyên có chủ đích để giá và quyền lợi khớp trang live.

Trạng thái bàn giao: **drafted_flagged** (còn [VERIFY], xem bảng Claims). Chưa đăng, chưa render, chưa sửa site.
