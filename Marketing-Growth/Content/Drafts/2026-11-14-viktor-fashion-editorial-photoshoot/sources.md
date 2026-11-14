---
title: Sources & claims — Fashion Editorial Photoshoot (Viktor product line 06)
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Tuyến sản phẩm: `06-Fashion-Editorial-Photoshoot` trong [Viktor Image Library](../../viktor-travelframe/README.md). Phạm vi do Rocky chọn (chat 14/11/2026, phương án mặc định).

Lưu ý vận hành: chưa có gói fashion editorial riêng. Listing dùng bảng giá theo giờ trong DEC và gợi ý Premium hoặc VIP cho 2 look. [Inbox Guide 14/11](../../../../Sales-CRM/Scripts/2026-11-14-TravelFrame-Photoshoot-Inbox-Guide.md) ghi yêu cầu fashion editorial cần team kiểm tra. Các điểm vận hành (stylist, makeup đậm, chỗ thay đồ, thời gian mỗi look, dùng thương mại) đánh dấu [VERIFY].

## Files

| File | Loại | Kênh |
|---|---|---|
| [listing.md](listing.md) | Listing copy | Viator (Rocky xác nhận 14/11/2026); dùng lại cho GBP, trang dịch vụ |
| [reel-script.md](reel-script.md) | Reel dựng từ ảnh tĩnh | Instagram, Facebook Page |
| [caption.md](caption.md) | Caption reel | Instagram, Facebook Page |
| [seed-comments.md](seed-comments.md) | Seed comment C1, C2 | Instagram, Facebook Page |

## Patterns used

- P-001 (hook: một váy, ba phông nền, promise cụ thể)
- P-005 (dòng Pro move: hỏi chủ xe trước)
- P-006 (save + send cho người bạn mang ba bộ đồ cho một cuối tuần)
- P-007 (comment keyword PHOTO)
- V-01, V-02, V-03, V-06, V-07, V-09 (hỏi trước khi dùng xe, quầy hàng, xích lô)

## Inspiration

- [/hanoi-photoshoot refresh](../2026-11-13-Hanoi-Photoshoot-Refresh/Brief.md) (Published 13/11/2026): bộ Thin ở chợ Đồng Xuân, alt ảnh và quyết định D3 về credit.
- [Viktor Static Ads Master Library](../../../Plans/2026-10-02-Viktor-Static-Ads-Master-Library-26-Concepts.md), nhóm Fashion (đọc 14/11/2026). Không dùng lại câu chữ.

## Claims

| Claim | Trạng thái |
|---|---|
| Bộ váy đỏ là bộ Thin của Harry Pham / 102 Koncept | Khớp alt 3 ảnh Thin trên Body.html node 104 (biển chợ Đồng Xuân, cửa cuốn bạc, bao tải); 102 Koncept là thương hiệu của TravelFrame (Rocky, 13/11) |
| Bộ streetwear cùng tác giả | [VERIFY] có watermark 102 nhưng chưa xác định người trong ảnh và consent |
| Thin là khách trả tiền | Không nêu; chưa xác nhận |
| Chợ Đồng Xuân nằm trong phố cổ | Kiến thức địa lý phổ thông; biển chợ thấy rõ trong ảnh |
| Giá, tối thiểu giờ, tối đa 2 khách, quyền lợi từng tầng; Premium 2h = 120, VIP 2h = 198 USD | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md), [bảng chi tiết](../../../../Brand-Strategy/Offers-Pricing/2026-10-21-Hourly-Tier-Pricing-Basic-Premium-VIP.md) |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h | Verified: DEC |
| Premium và VIP chỉ gồm trang điểm nhẹ | Verified: DEC (trang điểm nhẹ) |
| Không gồm stylist, làm tóc, makeup đậm | [VERIFY] |
| Chỉ dùng cá nhân; chụp cho brand báo giá riêng | [VERIFY] |
| Chỗ thay đồ giữa các look; số look trong 2 giờ | [VERIFY] |
| Điểm hẹn trong phố cổ | [VERIFY] |
| Giá trên nền tảng sau hoa hồng, chính sách mưa và huỷ | [VERIFY] |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 (chạy lại sau khi thêm ghi chú nhập Viator) với knowledge base workspace, không có nguồn ngoài:

- `listing.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=10 · quoted span=0 · overlap=0 · không lỗi cứng
- `reel-script.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=1 · quoted span=0 · overlap=0 · không lỗi cứng
- `caption.md` (--type reel): **flagged** · VERIFY=1 · quoted span=0 · overlap=0 · không lỗi cứng

Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, các draft couple và solo đã có), đã bỏ frontmatter và dòng đường dẫn ảnh: caption, script, slides không trùng. Listing chỉ trùng phần mô tả gói và thời gian giao ảnh với Body.html của /hanoi-photoshoot (copy đã duyệt và đã đăng), giữ nguyên có chủ đích để giá và quyền lợi khớp trang live.

Trạng thái bàn giao: **drafted_flagged** (còn [VERIFY], xem bảng Claims). Chưa đăng, chưa render, chưa sửa site.
