---
title: Sources & claims — Vietnam Photoshoot Ideas (bài tổng hợp)
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Brief: Rocky chọn viết cả 4 bài web (chat 14/11/2026). Bài này nhắm từ khoá `vietnam photoshoot` (2.400/tháng ở Mỹ, KD 0). SERP ngày 13/11 gồm Pinterest, Reddit, Instagram và vài thợ ảnh lẻ, nên bài viết theo hướng ý tưởng và cách chọn, rồi dẫn về `/hanoi-photoshoot` và các bài theo tuyến.

## Files

| File | Nội dung |
|---|---|
| [Page-Copy.md](Page-Copy.md) | Bài và các trường SEO |
| [Photo-Plan.md](Photo-Plan.md) | Ảnh đề xuất cho từng phần |

## Patterns used

- P-033 (bài hub, cầu nối sang dịch vụ)
- P-005 (dòng Pro move)
- P-008 (Train Street: không hứa access, tôn trọng dân cư)
- V-01, V-02, V-06, V-07, V-09
- I-010 (8 góc nội dung, dùng 6 góc theo tuyến)

## Inspiration

- [Keyword research 13/11](../../../SEO/2026-11-13-Keyword-Research-Awareness-Holidays/README.md): volume, KD, mô tả SERP.
- [Tóm tắt 6 tuyến Viktor](../2026-11-14-Viktor-Product-Lines-Summary.md) và 6 thư mục `2026-11-14-viktor-*`: nội dung từng tuyến.
- [/hanoi-photoshoot Body.html](../2026-11-13-Hanoi-Photoshoot-Refresh/Body.html) (Published 13/11): câu chữ phần gói giá giữ đồng nhất.

## Internal links

| Link | Tình trạng (14/11/2026) |
|---|---|
| `/hanoi-photoshoot` | 200 |
| `/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026` | 200; phần giá đã sửa theo DEC ngày 14/11 ([hồ sơ đăng](../2026-11-14-couple-page-price-refresh/Publication.md)) |
| `/news/solo-female-travel-hanoi-how-get-natural-photos-without-awkward-posing` | 200 |
| `/news/hanoi-street-style-photoshoot-harry-hanna` | 200 |
| `/news/ao-dai-photoshoot-hanoi` | Chưa có; là bài mới [2026-11-14-ao-dai-photoshoot-hanoi](../2026-11-14-ao-dai-photoshoot-hanoi/Page-Copy.md). [VERIFY] sau khi đăng |
| `/news/family-photoshoot-hanoi` | Chưa có; là bài mới [2026-11-14-family-photoshoot-hanoi](../2026-11-14-family-photoshoot-hanoi/Page-Copy.md). [VERIFY] sau khi đăng |
| `/news/cam-phu-cau-incense-village-photography-guide` | 200; tiêu đề đã là Quang Phu Cau |
| `/news/hanoi-old-quarter-photoshoot-harry-thin` | 200 |
| `/news/hanoi-night-photoshoot-harry-wuchr` | 200 |
| `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` | 200 |

Thứ tự đăng đề xuất: bài áo dài và bài gia đình trước, sau đó bài tổng hợp này. Nếu đăng bài tổng hợp trước, tạm bỏ 2 link chưa có.

## Claims

| Claim | Trạng thái |
|---|---|
| Giá Basic 30, Premium 60, VIP 99 USD/giờ; tối thiểu 1h, 2h, 2h; tối đa 2 khách; +15 USD/giờ từ khách thứ 3; quyền lợi từng tầng | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md), [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h; taxi và vé ngoài gói | Verified: DEC |
| VIP gồm outfit; outfit có thể là áo dài | DEC ghi trang phục (áo dài/outfit); size và màu có sẵn [VERIFY] |
| Quảng Phú Cầu ở Ứng Hòa, khoảng 35 km phía nam; ngày khô phơi hương ngoài sân | Nguồn: [day trips draft](../2026-11-09-day-trips-from-hanoi.md) (SERP 09/11) |
| Xe đi làng hương báo giá riêng | [VERIFY] chưa chốt |
| Train Street: khu dân cư, quy định thay đổi; không đưa vào tuyến | Nguồn: [Longtail clusters L2](../../../SEO/2026-11-09-Hanoi-Longtail-Keyword-Clusters.md) (giảm tàu từ 2026), quy định nội bộ |
| Mưa: chuyển sang phố có mái che và quán, hoặc đổi giờ | [VERIFY] chưa có chính sách thời tiết |
| Áo dài là áo thân dài, ôm người, mặc với quần rộng | Kiến thức phổ thông |
| Ánh sáng dịu buổi sáng sớm và chiều muộn | Nguyên tắc nhiếp ảnh phổ thông, viết dạng gợi ý |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 ở chế độ gần nhất cho bài web (checker không có loại article):

```bash
python3 .claude/skills/content-writing/scripts/check_draft.py \
  --draft Marketing-Growth/Content/Drafts/2026-11-14-vietnam-photoshoot-hub/Page-Copy.md \
  --type reel --no-expect-hashtag \
  --sources-md Marketing-Growth/Content/Drafts/2026-11-14-vietnam-photoshoot-hub/sources.md \
  --knowledge Research-Insights/Library/knowledge
```

- `Page-Copy.md`: **flagged** · VERIFY=5 · quoted span=0 · overlap=0 · không lỗi cứng.
- Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, draft couple và solo, nội dung bài Couple đang chạy), đã bỏ frontmatter: Trùng duy nhất là đường dẫn `/news/cam-phu-cau-incense-village-photography-guide`, vì draft day trips cũng link tới cùng bài. Không trùng câu. Phần mô tả gói giá dùng cùng câu chữ với /hanoi-photoshoot (Published 13/11), có chủ đích.
- Trạng thái bàn giao: **drafted_flagged**. Chưa đăng, chưa tải ảnh, chưa sửa site.
