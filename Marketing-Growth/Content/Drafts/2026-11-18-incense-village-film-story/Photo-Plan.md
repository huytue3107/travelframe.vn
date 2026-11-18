---
title: Ảnh — Incense Village Photoshoot: Harry's Film Portraits at Quảng Phú Cầu
owner: Creative-Production (thực hiện) / Marketing-Growth (dùng)
status: Draft
created: 2026-11-18
---

# Ảnh cho bài làng hương (story Harry)

Bài: [Page-Copy.md](Page-Copy.md). Quyết định: bài đăng với 2 ảnh stock Pexels đã có trên site, có credit. Không đưa ảnh của Harry, ảnh Viktor hay ảnh trong thư mục `Fin FIlm`.

Yêu cầu từ phiên Codex 18/11/2026: chỉ đưa ảnh có quyền sử dụng và nguồn gốc phù hợp; dùng ảnh TravelFrame đã được phép, hoặc đăng bài chữ nếu quyền ảnh Fin chưa rõ.

## Ảnh trên trang

| Vị trí | File trên site | Nguồn | Alt | Dung lượng |
|---|---|---|---|---|
| Sau mục "A working village, painted red" | `/sites/default/files/inline-images/travelframe-pexels-6712917.jpg` (uuid `56b33868-4d96-4455-9409-b80bb3cc4c13`) | [Pexels 6712917](https://www.pexels.com/photo/rows-of-bright-incense-sticks-in-daytime-6712917/), Quang Nguyen Vinh | Rows of bright red incense sticks drying in the sun on a village street in Vietnam | 329.571 byte (HTTP 200, 18/11) |
| Mục "Be a good guest" | `/sites/default/files/inline-images/travelframe-pexels-28305453.jpg` (uuid `5cc8ea3e-a6cf-48e0-a15d-f006f4e0ee7c`) | [Pexels 28305453](https://www.pexels.com/photo/joss-stick-workers-drying-sticks-28305453/), Vietnam Hidden Light | Artisans arranging bundles of red incense sticks to dry in a craft village near Hanoi | 399.363 byte (HTTP 200, 18/11) |

- Hai file đã được tải lên và đang dùng ở node 68 (đăng 15/11, [Photo-Plan](../2026-11-15-incense-village-page-rewrite/Photo-Plan.md)). Bài mới dùng lại cùng file và cùng `data-entity-uuid`, không tải lại.
- Giấy phép Pexels cho phép dùng cho mục đích thương mại, không bắt buộc ghi nguồn; bài vẫn ghi credit dưới mỗi ảnh theo thông lệ của site.
- Bài nói rõ trong nội dung: "The photos on this page are stock photos from Pexels, credited under each one. Harry's own frames stay on his Instagram", để người đọc không nhầm đó là ảnh của Harry.
- Alt của ảnh 6712917 không nêu Quảng Phú Cầu vì nguồn Pexels chỉ ghi "village in Vietnam" (khác với alt cũ ở node 68).
- Lệch so với checklist: checklist yêu cầu WebP hoặc AVIF dưới 200 KB; hai file là JPEG lớn hơn 200 KB (JPEG vì cổng upload ảnh inline của CKEditor trả 422 với WebP). Không nén lại ở bài này để không đổi file đang dùng ở node 68. Ghi nhận để tối ưu ảnh toàn site sau.

## Ảnh không dùng và vì sao

| Ảnh | Lý do | Cần gì để dùng |
|---|---|---|
| `Fin FIlm/Fin 01–04, 06, 07` (PNG) | Metadata C2PA của Google: "Made with Google AI", `trainedAlgorithmicMedia`. Không phải ảnh film; trình bày như ảnh Harry chụp là sai sự thật. Voice & Style Guide 7.1: ảnh AI chỉ dùng cho concept | Harry cung cấp file gốc; nếu dùng ảnh AI thì ghi rõ và không gọi là film |
| `Fin FIlm/Fin 05.jpg` | Có metadata máy quét film (Fujifilm Frontier SP-3000), xuất từ Lightroom Classic 15.4.1. Chưa rõ quyền: người trong ảnh có đồng ý chưa, khách hay mẫu, ai chụp, khi nào, ở đâu | Harry xác nhận nguồn; người trong ảnh đồng ý; Rocky duyệt dùng |
| Ảnh trong 3 bài Instagram của Harry (4/9 và 7/9/2026), thư viện `viktor-travelframe/05-Incense-Village-Photoshoot/` | Chưa ghi nhận consent, chưa rõ người trong ảnh là khách hay mẫu (xem [Photo-Plan node 68](../2026-11-15-incense-village-page-rewrite/Photo-Plan.md)). Bài mô tả bằng chữ và link ra bài Instagram thay vì đăng lại ảnh | Rocky xác nhận consent và cho phép dùng |
| Pexels 27951070 (HONG SON) | Không cần cho bài này | — |

## Ảnh bìa (Main image)

- Nguồn: Pexels 6712917 (Quang Nguyen Vinh), file gốc `Creative-Production/Assets/Stock/pexels-6712917-quang-nguyen-vinh.jpg`. Cắt giữa 1200×630, JPEG 157.620 byte.
- Trên site: fid 1082, `/sites/default/files/2026-11/incense-village-photoshoot-cover.webp` (107.914 byte, WebP do site chuyển). Dùng cho og:image và thẻ listing.
- Alt: Rows of bright pink-red incense bundles drying in the sun on a village street in Vietnam. Credit ở dưới ảnh inline cùng nguồn và ở dòng cuối bài ("Stock photos: Pexels, credited under each image").
- Chi tiết tải lên và checksum: [Publication.md](Publication.md).

## Khi có ảnh film được phép

Thêm vào các mục "Three frames" và "Why film suits this village": JPEG cạnh dài 1920 px, alt mô tả cảnh (không nêu tên người), credit "Harry Pham / 102 Koncept", cập nhật dòng "stock photos" trong bài, rồi cập nhật Publication.md.
