---
title: Đăng bài Áo Dài Photoshoot in Hanoi (4 bộ của Harry), node 136
owner: Marketing-Growth
status: Published
date: 2026-11-15
approval: 'Rocky, chat 15/11/2026: "Lên bài SEO về Harry chụp các bộ ảnh áo dài"'
url: https://travelframe.sidevn.com/news/ao-dai-photoshoot-hanoi
node: 136
---

# Kết quả

Tạo node 136 trong built-in browser (phiên admin có sẵn), bấm Save lúc 11:12 ICT ngày 15/11/2026 (admin/content hiện 04:12, giờ UTC).

## Cấu hình node

| Trường | Giá trị |
|---|---|
| Title (H1) | Áo Dài Photoshoot in Hanoi: Four Looks by Harry and How to Plan Yours |
| SEO title | Áo Dài Photoshoot in Hanoi: 4 Looks and Planning Tips (+ " \| TravelFrame Vietnam") |
| SEO description (138 ký tự) | Four áo dài photoshoots Harry shot in Hanoi, by Hoàn Kiếm Lake, West Lake and the Old Quarter, plus colors, how to move in it, and prices. |
| Summary | Four áo dài sets Harry shot around Hanoi, from Hoàn Kiếm Lake to Old Quarter lantern streets, with colors, places, posing tips and prices. |
| Kicker, Category | Photography Stories; Stories (giống bài Thin node 110 và Hanna node 109) |
| Ngôn ngữ | en, tắt tự dịch VI, không gắn menu |
| Alias | `/news/ao-dai-photoshoot-hanoi` (tắt pathauto) |
| Body | Full HTML. [Publish-Body-Final.html](Publish-Body-Final.html), 9.749 ký tự, SHA-256 `cdda623f…b15c`, so khớp trước khi Save. Sau `setData`: chữ, link, ảnh khớp; 9 H2, 9 H3, 1 bảng bọc `overflow-x:auto`. Source lưu trong form sau khi Save: 10.579 ký tự, SHA-256 `89013ad9…acd2` (CKEditor thêm thuộc tính) |
| Main image | fid 1040, `2026-11/ao-dai-hanoi-harry-cover.webp`, 1200×630, 62.830 byte, SHA-256 `40043318f64ce7d8…`. Cắt từ ảnh 20 (vùng 0, 268, 3780×1985). Alt: Woman in a deep blue áo dài reaching toward flowers at Hoàn Kiếm Lake, with the Turtle Tower in the distance |
| Revision log | New: áo dài photoshoot page with four Harry sets (Rocky asked to publish, 15/11/2026) |

## Ảnh

Ảnh lấy từ CDN của Instagram (bài của @harry_pham.sidevn). Trước khi dùng đã tải bằng curl và so SHA-256: cả 7 file trên CDN trùng từng byte với file gốc trong `viktor-travelframe/03-Ao-Dai-Heritage/`. Trang site tự tải ảnh gốc, thu nhỏ bằng canvas, rồi upload qua cổng ảnh của CKEditor (HTTP 201). Vì vậy file trên site không trùng từng byte với file gốc.

| Ảnh | File trên site | Kích thước | Byte | SHA-256 (16 ký tự đầu) | uuid |
|---|---|---|---|---|---|
| 15 | `inline-images/ao-dai-hanoi-harry-blue-hoan-kiem-lake.jpg` | 1440×1920 | 261.133 | `6058ab09610d77f0` | 514ae703-… |
| 18 | `inline-images/ao-dai-hanoi-harry-blue-french-building.jpg` | 1440×1920 | 362.595 | `8accc631f03c2f26` | 0966fae6-… |
| 06 | `inline-images/ao-dai-hanoi-harry-red-lantern-shop.jpg` | 1440×1911 | 360.391 | `7763b05dc1fbf103` | 7c660e43-… |
| 10 | `inline-images/ao-dai-hanoi-harry-red-walking.jpg` | 1440×1920 | 450.699 | `b2e52774ab3c339d` | f80864e8-… |
| 02 | `inline-images/ao-dai-hanoi-harry-navy-tran-quoc-pagoda.jpg` | 1440×1911 | 429.485 | `bc1d0a835db6ce41` | 6f1b9613-… |
| 13 | `inline-images/ao-dai-hanoi-harry-green-hoan-kiem-night.jpg` | 1440×1440 | 250.398 | `73164bef68a748e6` | b1f0cf26-… |

Không dùng 5 ảnh chụp trên đường ray (01, 11, 12, 14, 19). Không cắt (trừ ảnh bìa), không chỉnh màu, không sửa mặt.

# Kiểm tra trang live

curl không đăng nhập: HTTP 200, x-drupal-cache MISS.

- `<title>`: "Áo Dài Photoshoot in Hanoi: 4 Looks and Planning Tips | TravelFrame Vietnam". Meta description đúng. Canonical là URL bài. Không có noindex. og:image là ảnh bìa (HTTP 200).
- H1 đúng. 10 H2 (9 trong bài và 1 khối template "Want to taste it yourself?"), 9 H3, 1 bảng. Khoảng 1.215 từ.
- 6 ảnh inline và ảnh bìa: HTTP 200, dung lượng khớp bảng trên.
- Link trong bài: `/hanoi-photoshoot`, `/news/cam-phu-cau-incense-village-photography-guide`, `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots` (đều 200).
- 0 thẻ `[VERIFY]`. Có câu "We don't shoot on the Train Street rails."
- Có trong `/sitemap.xml`.
- Viewport 375 px: không tràn ngang; bảng rộng 335 px vừa khung 335 px; 6 ảnh hiển thị rộng 335 px.

# Rollback

Bỏ chọn Published ở `node/136/edit`, hoặc xoá node (cần Rocky duyệt).

# Việc tiếp theo

- Gửi index Google và Bing: cần Rocky duyệt riêng.
- Thêm link từ bài làng hương (node 68, mục "Portraits among the bundles") sang bài này: sửa site live, cần Rocky duyệt.
- Listing `/news` có thể chưa hiện bài do cache (D13).
- Bài tổng hợp vietnam photoshoot (Draft) đã link sẵn tới URL này.
