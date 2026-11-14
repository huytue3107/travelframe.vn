---
title: Sources & claims — Family and Group Photoshoot in Hanoi
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Brief: Rocky chọn viết cả 4 bài web (chat 14/11/2026). Website chưa có trang cho nhóm bạn và gia đình. Bài này là trang theo tuyến `04-Friends-Family-Photo-Walk`, liên kết với bài tổng hợp [vietnam photoshoot](../2026-11-14-vietnam-photoshoot-hub/Page-Copy.md) và với listing, carousel tại [2026-11-14-viktor-friends-family-photo-walk](../2026-11-14-viktor-friends-family-photo-walk/sources.md).

Từ khoá: OpenSEO ngày 13/11 không trả dữ liệu cho family photoshoot hanoi. Nên đo lại volume trước khi đăng; việc này tốn credit OpenSEO nên chờ Rocky đồng ý. [VERIFY]

## Files

| File | Nội dung |
|---|---|
| [Page-Copy.md](Page-Copy.md) | Bài và các trường SEO |
| [Photo-Plan.md](Photo-Plan.md) | Ảnh đề xuất; thiếu ảnh nhóm |

## Patterns used

- P-033 (bài SEO có cầu nối sang dịch vụ)
- P-004 (trap → move: người cầm máy luôn vắng mặt)
- P-005 (dòng Pro move)
- P-008 (Train Street: không đưa vào tuyến)
- V-01, V-02, V-06, V-07
- I-010 (góc Family Vacation Story)

## Inspiration

- [Draft tuyến Friends & Family](../2026-11-14-viktor-friends-family-photo-walk/slides-text.md) (14/11).
- [Inbox Guide 14/11](../../../../Sales-CRM/Scripts/2026-11-14-TravelFrame-Photoshoot-Inbox-Guide.md): khi khách nói family hoặc group, hỏi số người trong ảnh.

## Internal links

| Link | Tình trạng (14/11/2026) |
|---|---|
| `/hanoi-photoshoot` | 200 |
| `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` | 200 |
| `/news/vietnam-photoshoot` | Chưa có; là bài tổng hợp mới. [VERIFY] sau khi đăng |

## Claims

| Claim | Trạng thái |
|---|---|
| Giá tầng cho 2 khách; +15 USD/người/giờ từ khách thứ 3 | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md) |
| Ví dụ: 3 khách Basic 1h = 45; 4 khách Premium 2h = 180; 5 khách VIP 2h = 288 USD | Tính từ DEC: 30 + 15; 120 + 2 × 15 × 2; 198 + 3 × 15 × 2 |
| Quyền lợi từng tầng | Verified: [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h; taxi và vé ngoài gói | Verified: DEC |
| Số khách tối đa cho 1 thợ; cách tính trẻ em | [VERIFY] |
| Makeup, outfit trên Premium, VIP áp dụng cho ai trong nhóm | [VERIFY] DEC chưa quyết; Inbox Guide: trang điểm nhiều người phải hỏi team |
| Vỉa hè phố cổ không bằng phẳng, nhiều xe máy đỗ | Quan sát phổ thông; bài Couple đang chạy cũng ghi vỉa hè gồ ghề |
| Nhà thờ Lớn lên đèn buổi tối | Ảnh trong thư viện (01b, 02b) |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 ở chế độ gần nhất cho bài web (checker không có loại article):

```bash
python3 .claude/skills/content-writing/scripts/check_draft.py \
  --draft Marketing-Growth/Content/Drafts/2026-11-14-family-photoshoot-hanoi/Page-Copy.md \
  --type reel --no-expect-hashtag \
  --sources-md Marketing-Growth/Content/Drafts/2026-11-14-family-photoshoot-hanoi/sources.md \
  --knowledge Research-Insights/Library/knowledge
```

- `Page-Copy.md`: **flagged** · VERIFY=4 · quoted span=0 · overlap=0 · không lỗi cứng.
- Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, draft couple và solo, nội dung bài Couple đang chạy), đã bỏ frontmatter: Không trùng. Phần mô tả gói giá dùng cùng câu chữ với /hanoi-photoshoot (Published 13/11), có chủ đích.
- Trạng thái bàn giao: **drafted_flagged**. Chưa đăng, chưa tải ảnh, chưa sửa site.
