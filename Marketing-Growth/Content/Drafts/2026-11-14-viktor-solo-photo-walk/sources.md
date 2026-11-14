---
title: Sources & claims — Solo Photo Walk (Viktor product line 02)
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Tuyến sản phẩm: `02-Solo-Photo-Walk` trong [Viktor Image Library](../../viktor-travelframe/README.md). Phạm vi do Rocky chọn (chat 14/11/2026, phương án mặc định).

Đã có reel solo riêng: [2026-11-17-solo-trip-still-got-photos](../2026-11-17-solo-trip-still-got-photos/sources.md). Bài này là carousel dạng shot list (giáo dục, để lưu), không lặp góc của reel.

## Files

| File | Loại | Kênh |
|---|---|---|
| [listing.md](listing.md) | Listing copy | Viktor (nền tảng chưa xác nhận), OTA, GBP, trang dịch vụ |
| [slides-text.md](slides-text.md) | Carousel 7 slide | Instagram, Facebook Page |
| [caption.md](caption.md) | Caption carousel | Instagram, Facebook Page |
| [seed-comments.md](seed-comments.md) | Seed comment C1, C2 | Instagram, Facebook Page |

## Patterns used

- P-005 (dòng Pro move)
- P-006 (save + send cho bạn đi solo)
- P-007 (DM keyword PHOTO)
- P-010 (mời lưu ngay ở slide 1)
- V-01, V-02, V-03, V-04, V-06, V-07
- I-008 (góc solo traveler)

## Inspiration

- [Viktor Static Ads Master Library](../../../Plans/2026-10-02-Viktor-Static-Ads-Master-Library-26-Concepts.md), nhóm Solo (đọc 14/11/2026): insight selfie vụng. Không dùng lại câu chữ.
- [Listing kit OTA/GBP](../2026-10-13-ota-gbp-listing-kit.md) (13/10/2026): cấu trúc listing. Giá trong kit đã cũ, không dùng.
- Từ khoá: solo travel vietnam 320, solo photoshoot 260 (US/tháng, [keywords.csv](../../../SEO/2026-11-13-Keyword-Research-Awareness-Holidays/keywords.csv), 13/11/2026).

## Claims

| Claim | Trạng thái |
|---|---|
| Giá, tối thiểu giờ, tối đa 2 khách, quyền lợi từng tầng | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md), [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| Basic 1h = 30 USD, Premium 2h = 120 USD | Verified: bảng chi tiết |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h | Verified: DEC |
| Không gồm Train Street | Quy định nội bộ |
| Cầu Long Biên: chỉ lối đi bộ | Ghi chú an toàn; không dùng ảnh đứng trên ray |
| Điểm hẹn gần Hồ Gươm | [VERIFY] |
| Giá trên nền tảng sau hoa hồng | [VERIFY] Rocky quyết |
| Chính sách mưa, đổi lịch, huỷ | [VERIFY] |
| Consent của người trong ảnh | [VERIFY] |
| Các cảnh trong carousel (trang phục, Nhà thờ Lớn, đèn lồng, quán cà phê) | Khớp với ảnh trong thư viện, xem bảng ảnh trong slides-text.md |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 với knowledge base workspace, không có nguồn ngoài:

- `listing.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=5 · quoted span=0 · overlap=0 · không lỗi cứng
- `slides-text.md` (--type carousel): **flagged** · VERIFY=1 · quoted span=0 · overlap=0 · không lỗi cứng
- `caption.md` (--type reel): **pass** · VERIFY=0 · quoted span=0 · overlap=0 · không lỗi cứng

Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, các draft couple và solo đã có), đã bỏ frontmatter và dòng đường dẫn ảnh: caption, script, slides không trùng. Listing chỉ trùng phần mô tả gói và thời gian giao ảnh với Body.html của /hanoi-photoshoot (copy đã duyệt và đã đăng), giữ nguyên có chủ đích để giá và quyền lợi khớp trang live.

Trạng thái bàn giao: **drafted_flagged** (còn [VERIFY], xem bảng Claims). Chưa đăng, chưa render, chưa sửa site.
