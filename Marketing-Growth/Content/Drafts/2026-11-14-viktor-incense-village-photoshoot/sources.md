---
title: Sources & claims — Incense Village Photoshoot (Viktor product line 05)
status: Draft
owner: Marketing-Growth
created: 2026-11-14
---

# Sources & claims

Tuyến sản phẩm: `05-Incense-Village-Photoshoot` trong [Viktor Image Library](../../viktor-travelframe/README.md). Phạm vi do Rocky chọn (chat 14/11/2026, phương án mặc định).

Lưu ý vận hành: chưa có gói hoặc giá được duyệt cho chuyến làng hương. Bảng giá theo giờ trong DEC chỉ áp dụng cho phần chụp; xe đưa đón, thời lượng tối thiểu, có tính giờ di chuyển hay không đều chưa chốt. [Inbox Guide 14/11](../../../../Sales-CRM/Scripts/2026-11-14-TravelFrame-Photoshoot-Inbox-Guide.md) ghi yêu cầu làng hương phải được team xác nhận. Listing để các điểm này ở dạng [VERIFY]; không đăng trước khi Rocky chốt.

## Files

| File | Loại | Kênh |
|---|---|---|
| [listing.md](listing.md) | Listing copy | Viator (Rocky xác nhận 14/11/2026); dùng lại cho GBP, trang dịch vụ |
| [reel-script.md](reel-script.md) | Reel dựng từ ảnh tĩnh | Instagram, Facebook Page |
| [caption.md](caption.md) | Caption reel | Instagram, Facebook Page |
| [seed-comments.md](seed-comments.md) | Seed comment C1, C2 | Instagram, Facebook Page |

## Patterns used

- P-001 (hook: hình ảnh lạ + promise khoảng cách cụ thể)
- P-005 (dòng Pro move: nói cảm ơn)
- P-006 (save cho danh sách day trip)
- P-007 (comment keyword PHOTO)
- P-008 (nơi làm việc của dân: hỏi trước, tôn trọng, giữ ngày dự phòng)
- V-01, V-02, V-03, V-06, V-07, V-09

## Inspiration

- [Day trips from Hanoi](../2026-11-09-day-trips-from-hanoi.md) (draft 09/11/2026): khoảng cách, thời gian đi, mô tả phơi hương ngày khô, link tour làng nghề.
- [Long-tail keyword clusters 09/11](../../../SEO/2026-11-09-Hanoi-Longtail-Keyword-Clusters.md): incense village hanoi 390, quang phu cau incense village 320 (KD 0); trang đích hiện có là bài node 68.
- [Viktor Static Ads Master Library](../../../Plans/2026-10-02-Viktor-Static-Ads-Master-Library-26-Concepts.md), nhóm Incense Village (đọc 14/11/2026). Không dùng lại câu chữ.

## Claims

| Claim | Trạng thái |
|---|---|
| Quảng Phú Cầu ở huyện Ứng Hòa, khoảng 35 km phía nam trung tâm Hà Nội | Verified: day trips draft (SERP 09/11: vietnamairlines.com, chasinggambozinos.com, sgotours.com); longtail cluster L3 |
| Khoảng 1 giờ lái xe mỗi chiều | Nguồn: day trips draft; trong listing vẫn để [VERIFY] vì phụ thuộc giờ đi và giao thông |
| Ngày khô, hương được xòe bó ra phơi ngoài sân và ngõ | Verified: day trips draft (SERP 09/11) |
| Mưa thì hương để trong nhà | Suy ra từ claim trên; nhờ người đi làng xác nhận trước khi đăng |
| Hương làm thủ công | Day trips draft (villages make incense by hand) |
| Giá chụp theo tầng giờ, tối đa 2 khách | Verified: [DEC-20261021-HOURLY-TIER-PRICING](../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md) |
| Ảnh gốc 24h, ảnh chỉnh sửa và video 48h | Verified: DEC |
| Giá xe, thời lượng tối thiểu, có tính giờ di chuyển | [VERIFY] chưa chốt |
| Phí chụp trong sân nếu gia đình yêu cầu | [VERIFY] |
| Tour làng nghề trọn ngày (Quảng Phú Cầu và Bát Tràng), giá và tình trạng | [VERIFY] trang `/tour/colors-delta-craft-villages-expedition` còn giá cũ |
| Đón khách ngoài trung tâm | [VERIFY] |
| Chính sách thời tiết và huỷ | [VERIFY] |
| Người mẫu là khách hay mẫu; tác giả bộ ảnh; consent | [VERIFY] |

## Checklist

Chạy `check_draft.py` ngày 14/11/2026 (chạy lại sau khi thêm ghi chú nhập Viator) với knowledge base workspace, không có nguồn ngoài:

- `listing.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=14 · quoted span=0 · overlap=0 · không lỗi cứng
- `reel-script.md` (--type reel --no-expect-hashtag): **flagged** · VERIFY=1 · quoted span=0 · overlap=0 · không lỗi cứng
- `caption.md` (--type reel): **pass** · VERIFY=0 · quoted span=0 · overlap=0 · không lỗi cứng

Quét thêm trùng câu với nguồn nội bộ (Viktor static ads library, listing kit 13/10, day trips 09/11, các draft couple và solo đã có), đã bỏ frontmatter và dòng đường dẫn ảnh: caption, script, slides không trùng. Listing chỉ trùng phần mô tả gói và thời gian giao ảnh với Body.html của /hanoi-photoshoot (copy đã duyệt và đã đăng), giữ nguyên có chủ đích để giá và quyền lợi khớp trang live.

Trạng thái bàn giao: **drafted_flagged** (còn [VERIFY], xem bảng Claims). Chưa đăng, chưa render, chưa sửa site.
