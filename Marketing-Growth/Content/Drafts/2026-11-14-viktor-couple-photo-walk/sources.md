---
title: Sources & claims — Couple Photo Walk (Viktor product line 01)
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Tuyến sản phẩm: `01-Couple-Photo-Walk` trong [Viktor Image Library](../../viktor-travelframe/README.md). Phạm vi do Rocky chọn (chat 14/11/2026, phương án mặc định): mỗi tuyến 1 bộ listing copy và 1 bài social.

## Files

| File | Loại | Kênh |
|---|---|---|
| [listing.md](listing.md) | Listing copy | Viktor (nền tảng chưa xác nhận), OTA, GBP, trang dịch vụ |
| [slides-text.md](slides-text.md) | Carousel 6 slide | Instagram, Facebook Page |
| [caption.md](caption.md) | Caption carousel | Instagram, Facebook Page |
| [seed-comments.md](seed-comments.md) | Seed comment C1, C2 | Instagram, Facebook Page |

## Patterns used

- P-005 (dòng Pro move)
- P-007 (comment keyword, DM gửi route và giá)
- P-008 (không hứa Train Street trong listing)
- V-01, V-02, V-03, V-06, V-07
- I-010 (góc Cinematic Couple trong 8 core angles)

## Inspiration

- [Viktor Static Ads Master Library](../../../Plans/2026-10-02-Viktor-Static-Ads-Master-Library-26-Concepts.md), nhóm Couple (đọc 14/11/2026): insight cặp đôi thiếu ảnh chung. Không dùng lại câu chữ.
- [Listing kit OTA/GBP](../2026-10-13-ota-gbp-listing-kit.md) (13/10/2026): cấu trúc title, highlights, not included. Giá trong kit đã cũ, không dùng.
- [/hanoi-photoshoot refresh](../2026-11-13-Hanoi-Photoshoot-Refresh/Brief.md) (Published 13/11/2026): cách viết bảng giá và quyết định D2 giữ trung lập về trang điểm, trang phục.
- Từ khoá: honeymoon photoshoot 210, anniversary photoshoot 260, honeymoon in vietnam 480 (US/tháng, [keywords.csv](../../../SEO/2026-11-13-Keyword-Research-Awareness-Holidays/keywords.csv), 13/11/2026).

## Claims

| Claim | Trạng thái |
|---|---|
| Giá Basic 30, Premium 60, VIP 99 USD/giờ; tối thiểu 1h, 2h, 2h; tối đa 2 khách | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md) |
| Quyền lợi từng tầng (khu, số ảnh chỉnh sửa, makeup, video, polaroid, outfit) | Verified: DEC và [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| Premium 2h = 120 USD, VIP 2h = 198 USD | Verified: ví dụ báo giá trong bảng chi tiết |
| Ảnh gốc trong 24h, ảnh chỉnh sửa và video trong 48h | Verified: DEC; đang hiện trên /hanoi-photoshoot từ 13/11 |
| Taxi giữa các khu và vé ngoài gói | Verified: DEC |
| Không gồm Train Street | Quy định nội bộ (CLAUDE background, Meta Ads strategy v2) |
| Makeup, outfit cho 1 hay 2 khách | Không nêu số khách, theo quyết định D2 của Rocky (13/11) |
| Điểm hẹn gần Hồ Gươm | [VERIFY] |
| Giá trên nền tảng sau hoa hồng | [VERIFY] Rocky quyết |
| Chính sách mưa, đổi lịch | [VERIFY] |
| Chính sách huỷ | [VERIFY] (Open P0 legal/payment) |
| Địa điểm trong ảnh: Hồ Gươm, Tháp Rùa, Nhà thờ Lớn, phố Tạ Hiện | Nhận diện từ ảnh (biển phố Tạ Hiện thấy rõ). Mặt tiền vàng có bậc thang không gọi tên |
| Consent của các cặp đôi trong ảnh | [VERIFY] README thư viện: phân loại không phải consent |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 với knowledge base workspace, không có nguồn ngoài:

- `listing.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=5 · quoted span=0 · overlap=0 · không lỗi cứng
- `slides-text.md` (--type carousel): **flagged** · VERIFY=1 · quoted span=0 · overlap=0 · không lỗi cứng
- `caption.md` (--type reel): **pass** · VERIFY=0 · quoted span=0 · overlap=0 · không lỗi cứng

Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, các draft couple và solo đã có), đã bỏ frontmatter và dòng đường dẫn ảnh: caption, script, slides không trùng. Listing chỉ trùng phần mô tả gói và thời gian giao ảnh với Body.html của /hanoi-photoshoot (copy đã duyệt và đã đăng), giữ nguyên có chủ đích để giá và quyền lợi khớp trang live.

Trạng thái bàn giao: **drafted_flagged** (còn [VERIFY], xem bảng Claims). Chưa đăng, chưa render, chưa sửa site.
