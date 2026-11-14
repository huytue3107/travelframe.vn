---
title: Sources & claims — Friends & Family Photo Walk (Viktor product line 04)
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Tuyến sản phẩm: `04-Friends-Family-Photo-Walk` trong [Viktor Image Library](../../viktor-travelframe/README.md). Phạm vi do Rocky chọn (chat 14/11/2026, phương án mặc định).

Khoảng trống ảnh: thư viện chỉ có 15 ảnh, không có ảnh nhóm từ 3 người, không có ảnh gia đình có trẻ em (trừ 1 ảnh trên đường ray, không dùng). Cần 1 buổi chụp nhóm hoặc gia đình có consent trước khi đăng listing hoặc carousel.

## Files

| File | Loại | Kênh |
|---|---|---|
| [listing.md](listing.md) | Listing copy | Viator (Rocky xác nhận 14/11/2026); dùng lại cho GBP, trang dịch vụ |
| [slides-text.md](slides-text.md) | Carousel 7 slide | Instagram, Facebook Page |
| [caption.md](caption.md) | Caption carousel | Instagram, Facebook Page |
| [seed-comments.md](seed-comments.md) | Seed comment C1, C2 | Instagram, Facebook Page |

## Patterns used

- P-004 (trap → move)
- P-005 (dòng Pro move)
- P-007 (DM keyword PHOTO)
- V-01, V-02, V-03, V-06, V-07
- I-010 (góc Family Vacation Story trong 8 core angles)

## Inspiration

- [Viktor Static Ads Master Library](../../../Plans/2026-10-02-Viktor-Static-Ads-Master-Library-26-Concepts.md), nhóm Friends & Family (đọc 14/11/2026). Không dùng lại câu chữ.
- [Inbox Guide 14/11](../../../../Sales-CRM/Scripts/2026-11-14-TravelFrame-Photoshoot-Inbox-Guide.md): khi khách nói family hoặc group, hỏi số người trong ảnh. Listing và CTA xin group size, ages để khớp quy trình này.
- Từ khoá: family photoshoot hanoi không có dữ liệu trong [keywords.csv](../../../SEO/2026-11-13-Keyword-Research-Awareness-Holidays/keywords.csv) (13/11/2026).

## Claims

| Claim | Trạng thái |
|---|---|
| Giá tầng tính cho 2 khách; từ khách thứ 3 +15 USD/người/giờ | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md) |
| Ví dụ: 3 khách Basic 1h = 45 USD; 4 khách Premium 2h = 180 USD | Tính từ DEC (30 + 15; 120 + 2 × 15 × 2) |
| Quyền lợi từng tầng | Verified: [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h | Verified: DEC |
| Số khách tối đa một nhóm | [VERIFY] |
| Trẻ em tính là khách hay miễn phí | [VERIFY] |
| Makeup, outfit trên Premium, VIP áp dụng cho ai trong nhóm | [VERIFY] DEC chưa quyết; Inbox Guide: trang điểm nhiều người phải hỏi team |
| Điểm hẹn gần Hồ Gươm | [VERIFY] |
| Giá trên nền tảng sau hoa hồng, chính sách mưa và huỷ | [VERIFY] |
| Consent và quan hệ của người trong ảnh | [VERIFY] không gọi là gia đình khi chưa xác nhận |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 (chạy lại sau khi thêm ghi chú nhập Viator) với knowledge base workspace, không có nguồn ngoài:

- `listing.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=9 · quoted span=0 · overlap=0 · không lỗi cứng
- `slides-text.md` (--type carousel): **flagged** · VERIFY=2 · quoted span=0 · overlap=0 · không lỗi cứng
- `caption.md` (--type reel): **pass** · VERIFY=0 · quoted span=0 · overlap=0 · không lỗi cứng

Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, các draft couple và solo đã có), đã bỏ frontmatter và dòng đường dẫn ảnh: caption, script, slides không trùng. Listing chỉ trùng phần mô tả gói và thời gian giao ảnh với Body.html của /hanoi-photoshoot (copy đã duyệt và đã đăng), giữ nguyên có chủ đích để giá và quyền lợi khớp trang live.

Trạng thái bàn giao: **drafted_flagged** (còn [VERIFY], xem bảng Claims). Chưa đăng, chưa render, chưa sửa site.
