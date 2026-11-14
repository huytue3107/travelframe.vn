---
title: Ảnh — Tet 2027 in Hanoi
owner: Creative-Production (thực hiện) / Marketing-Growth (dùng)
status: Draft
created: 2026-11-14
---

# Ảnh cho bài Tet 2027 in Hanoi

Bài: [Page-Copy.md](Page-Copy.md). Hạn đăng đề xuất là trước 05/12/2026, trong khi cảnh Tết 2027 chỉ
chụp được từ cuối tháng 1/2027. Vì vậy ảnh chia hai đợt.

## 1. Ảnh đã có

Chưa có ảnh Tết nào được xác nhận trong workspace.

- Cần Rocky hoặc Harry trả lời: team có ảnh Tết 2026 tự chụp không (chợ hoa, phố cổ sáng mùng 1,
  Văn Miếu, khách mặc áo dài). Nếu có, dùng ngay cho đợt đăng đầu, ghi credit Harry Pham / 102 Koncept.
- Ảnh Hàng Mã mùa Giáng sinh trong bài `/news/hang-ma-street-christmas-photo-spots` không dùng lại
  được, vì màu trang trí khác mùa Tết.

## 2. Đợt đăng đầu (trước 05/12/2026): ảnh tạm có giấy phép

Đã tìm ngày 14/11/2026 trên Wikimedia Commons và Pexels (qua `npm run media:search`). Tôi đã mở và xem
từng ảnh dưới đây. **Đã tải 4 ảnh đề xuất ngày 14/11/2026** (Rocky duyệt trong chat: Tải 4 ảnh) và xem lại
ở cỡ lớn; siêu dữ liệu nằm ở `assets/image-candidates.json`. Ảnh dự phòng chưa tải.

### Ảnh đề xuất dùng

| Vị trí | Ảnh | Nguồn và giấy phép | Kích thước gốc | Thấy gì trong ảnh |
|---|---|---|---|---|
| Ảnh bìa, og:image | [Pexels 36399884](https://www.pexels.com/photo/lunar-new-year-celebration-street-scene-in-vietnam-36399884/) | Ama Journey / Pexels, giấy phép Pexels | 3637×2456 | Băng rôn đỏ ghi Chúc Mừng Năm Mới, Happy New Year; đèn lồng đỏ; chậu đào; khu nhà cũ tường vàng. Biển tên phố trong ảnh ghi ngõ 437 đường Ngọc Lâm (Long Biên), tức không phải phố cổ. Dây cờ nhỏ gồm cờ Tổ quốc và cờ Đảng. Hai người đứng ở mép phải |
| The week before Tet, đoạn Flower markets | [Pexels 36399889](https://www.pexels.com/photo/street-vendors-transporting-cherry-blossoms-via-motorbikes-36399889/) | Ama Journey / Pexels, giấy phép Pexels | 3637×2456 | Cây đào buộc trên xe máy dọc một con phố có hàng cây; một người quay lưng. Ba biển số xe đọc rõ, đầu số 29 (Hà Nội) |
| The week before Tet, dòng Nhat Tan | [Prunus persica (Nhat Tan) 3.jpg](https://commons.wikimedia.org/wiki/File:Prunus_persica_(Nhat_Tan)_3.jpg) | Viethavvh, phạm vi công cộng, Wikimedia Commons | 2848×2136, 1,68 MB | Cây đào nở hồng, không có người. Mô tả gốc ghi chụp ở Nhật Tân, Hà Nội |
| The week before Tet, đoạn Calligraphy | [Ongdochochu.jpg](https://commons.wikimedia.org/wiki/File:Ongdochochu.jpg) | Hoangvantoanajc, CC0, Wikimedia Commons | 2369×1786, 0,69 MB | Ông đồ đội khăn xếp viết chữ trên giấy đỏ. Mô tả gốc ghi Hội chữ Xuân Văn Miếu |

### File đã tải (14/11/2026)

| File | Kích thước | Dung lượng | Nguồn tải |
|---|---|---|---|
| `Creative-Production/Assets/Stock/pexels-36399884-ama-journey.jpg` (kèm `pexels-36399884.json`) | 1880×1270 | 601.718 byte | Pexels, bản large2x, qua `fetch_media_asset.mjs download` |
| `Creative-Production/Assets/Stock/pexels-36399889-ama-journey.jpg` (kèm `pexels-36399889.json`) | 1880×1270 | 747.302 byte | Pexels, bản large2x, qua `fetch_media_asset.mjs download` |
| `assets/commons/nhat-tan-peach-blossom.jpg` | 1280×960 | 608.638 byte | Wikimedia Commons, bản 1280px |
| `assets/commons/temple-of-literature-calligrapher.jpg` | 1280×965 | 261.268 byte | Wikimedia Commons, bản 1280px |

Cả 4 file là JPEG hợp lệ và đã được mở xem. File gốc giữ nguyên, không sửa.

### File đã xử lý để đăng (14/11/2026)

Rocky duyệt trong chat: Xử lý ảnh. File nằm trong `assets/web/`, định dạng WebP chất lượng 82, đã bỏ EXIF.

| File | Từ ảnh gốc | Kích thước | Dung lượng | Đã làm gì |
|---|---|---|---|---|
| `tet-in-hanoi-cover.webp` | pexels-36399884 | 1200×630 | 193.074 byte | Cắt vùng x 0–1500, y 330–1118 của ảnh 1880×1270 rồi thu về 1200×630. Hai người ở mép phải và biển tên ngõ nằm ngoài khung. Biển số xe trong khung quá nhỏ, không đọc được, nên không làm mờ |
| `tet-in-hanoi-peach-trees-motorbikes.webp` | pexels-36399889 | 1440×973 | 449.594 byte | Làm mờ 3 biển số (vùng 252–374×1094–1189, 1163–1236×954–1010, 1406–1462×923–971 trên ảnh gốc), rồi thu về rộng 1440 |
| `tet-in-hanoi-nhat-tan-peach-blossom.webp` | nhat-tan-peach-blossom.jpg | 1280×960 | 483.996 byte | Chỉ đổi định dạng |
| `tet-in-hanoi-calligrapher-temple-of-literature.webp` | temple-of-literature-calligrapher.jpg | 1280×965 | 155.016 byte | Chỉ đổi định dạng |

Đã mở lại ảnh bìa và ảnh xe máy chở đào sau khi xử lý: băng rôn nằm trọn trong khung bìa, cả 3 biển số không
còn đọc được. Không làm mờ khuôn mặt nào.

### Đã đưa lên site (14/11/2026)

Rocky duyệt trong chat: Đăng bài. Bốn ảnh đã lên node 135; chi tiết file, checksum và credit ở
[Publication.md](Publication.md).

- Ảnh bìa lên ở dạng WebP 1200×630 (fid 1033).
- Ba ảnh inline lên ở dạng **JPEG**, vì cổng upload ảnh của CKEditor không nhận WebP (HTTP 422). Ảnh Nhật Tân
  và ảnh ông đồ là đúng file gốc trong `assets/commons/`.
- Ảnh bìa và ảnh xe máy chở đào được xử lý lại trong trình duyệt từ ảnh gốc Pexels với cùng thông số, nên không
  trùng từng byte với file trong `assets/web/`. Đã mở lại file trên site: khung bìa đúng, 3 biển số không đọc được.
- Alt và chú thích dùng đúng bảng bên dưới.

### Chú thích và alt text đề xuất (tiếng Anh)

| Ảnh | Alt text | Chú thích kèm credit |
|---|---|---|
| Ảnh bìa | A red banner reading Chúc Mừng Năm Mới, Happy New Year, hangs with red lanterns over a lane off Ngoc Lam Street in Hanoi before Tet | Tet decorations over a lane off Ngoc Lam Street, Hanoi. Photo: Ama Journey / Pexels. |
| Flower markets | Peach blossom trees tied to motorbikes, for sale along a street in Hanoi before Tet | Peach blossom trees for sale by the roadside in Hanoi before Tet. Photo: Ama Journey / Pexels. |
| Nhat Tan | A peach tree in full pink bloom in Nhat Tan, Hanoi | Peach blossom in Nhat Tan, Hanoi. Photo: Viethavvh, public domain, via Wikimedia Commons. |
| Calligraphy | A calligrapher in a traditional hat writes on red paper at the Temple of Literature in Hanoi | A calligrapher at the Spring Calligraphy Festival, Temple of Literature. Photo: Hoangvantoanajc, CC0, via Wikimedia Commons. |

### Điều Rocky cần xác nhận trước khi dùng

- **Ảnh bìa:** biển tên phố trong ảnh ghi ngõ 437 đường Ngọc Lâm, nên đây là Long Biên chứ không phải phố
  cổ; chú thích đã ghi theo biển này, không ghi năm chụp. Ảnh có dây cờ Đảng và cờ Tổ quốc, Rocky quyết định
  có dùng làm ảnh bìa cho khách quốc tế không. Bản bìa 1200×630 trong `assets/web/` đã cắt bỏ hai người ở mép phải.
- **Ảnh xe máy chở đào:** mô tả gốc của Pexels gọi nhầm là hoa anh đào và không ghi thành phố. Biển số xe
  trong ảnh mang đầu số 29 (Hà Nội) và các ảnh cùng bộ ghi Hà Nội, nên chú thích ghi Hanoi. Ba biển số đọc
  rõ ở ảnh gốc đã được làm mờ trong bản `assets/web/`.
- **Ảnh ông đồ:** nhận rõ mặt người trong ảnh. Giấy phép CC0 cho phép dùng, nhưng nếu muốn tránh ảnh rõ
  mặt thì dùng ảnh dự phòng năm 2011 (mặt bị nón che).
- Năm chụp của ảnh Nhật Tân và ảnh ông đồ không được ghi rõ, nên chú thích không ghi năm.

### Ảnh dự phòng

| Ảnh | Nguồn và giấy phép | Ghi chú |
|---|---|---|
| [Pexels 36399867](https://www.pexels.com/photo/busy-hanoi-street-with-people-and-peach-blossoms-36399867/) | Ama Journey / Pexels | Người bán đào đội nón lá, quay lưng; mô tả gốc ghi Hà Nội |
| [Pexels 36399901](https://www.pexels.com/photo/vibrant-spring-blossom-market-scene-36399901/) | Ama Journey / Pexels | Lối đi giữa các hàng cành đào; có vài người thấy mặt ở xa |
| [Trung Hòa market, 10/02/2026](https://commons.wikimedia.org/wiki/File:Preparing_for_T%E1%BA%BFt_Nguy%C3%AAn_%C4%90%C3%A1n_at_Trung_H%C3%B2a_Makeshift_Market_10-02-2026_E1.jpg) | Hoàng Đức Xuyên T59, CC BY-SA 4.0 | Chợ cóc bán đào ở Trung Hòa, có ngày chụp rõ; chất lượng ảnh điện thoại |
| [Van Mieu han tu, 2011](https://commons.wikimedia.org/wiki/File:Van_Mieu_han_tu_5412909963_6abd84dcd2_t.jpg) | Tom Photographer, CC BY 2.0 | Ông đồ viết chữ ở Văn Miếu, mặt bị nón che; bắt buộc ghi credit |

### Không tìm được ảnh phù hợp

- Chợ hoa Hàng Lược và chợ hoa Quảng Bá: không có ảnh giấy phép mở.
- Phố cổ vắng sáng mùng 1: không có.
- Pháo hoa giao thừa ở Hà Nội: có một ảnh pháo hoa trên Pexels ghi Hà Nội nhưng không xác minh được địa
  điểm, nên không dùng.
- Loạt ảnh trang trí Tết 2018 ở quận Hoàn Kiếm trên Commons: chủ yếu là băng rôn, ảnh mờ, không dùng.

Các mục này chờ đợt chụp ở mục 3. Không lấy ảnh từ Google Maps, Tripadvisor, báo chí hoặc mạng xã hội.

## 3. Shot list chụp mới (Tết 2027)

Mục tiêu: ảnh gốc của team, có người thật. Xin phép trước khi chụp cận mặt, bàn thờ và người đang
khấn; ở chợ thì giữ gọn thiết bị và không chắn lối người đang làm việc. Ngày chợ hoa Hàng Lược và
Hội chữ Xuân 2027 chưa công bố, nên các dòng đó ghi khoảng thời gian dự kiến.

| Ưu tiên | Cảnh | Thời điểm | Dùng ở mục |
|---|---|---|---|
| P0 | Phố Hàng Mã bán đồ trang trí Tết: đèn lồng, bao lì xì, câu đối | Từ giữa tháng 1, chiều muộn | The week before Tet; có thể làm ảnh bìa |
| P0 | Chợ hoa Hàng Lược: đào, quất, người mua | Dự kiến từ khoảng 30/01 đến 05/02, buổi sáng | The week before Tet |
| P0 | Chợ hoa Quảng Bá (236 Âu Cơ) lúc đông nhất | Khoảng 1:00–3:00, tuần trước Tết | The week before Tet |
| P0 | Ông đồ viết chữ bên Hồ Văn, Văn Miếu | Trong thời gian Hội chữ Xuân 2027 | The week before Tet |
| P0 | Phố cổ sáng mùng 1: cửa đóng, phố vắng | Thứ Bảy 06/02/2027, sáng sớm | Days 1 to 3; khối Quick answer |
| P1 | Vườn đào Nhật Tân | Cuối tháng 1 | The week before Tet |
| P1 | Xe máy chở cây đào, cây quất trên phố | Tuần trước Tết | The week before Tet |
| P1 | Đêm giao thừa quanh hồ Hoàn Kiếm, pháo hoa | Đêm thứ Sáu 05/02/2027 | New Year's Eve in Hanoi |
| P1 | Gia đình đi lễ đầu năm ở đền Ngọc Sơn, chùa Trấn Quốc | 06–08/02/2027 | Days 1 to 3 |
| P2 | Biển báo giờ mở cửa dịp Tết của quán và điểm tham quan | 03–05/02/2027 | Is Hanoi closed during Tet? |
| P2 | Khách thật trong buổi chụp dịp Tết (có đồng ý bằng văn bản) | 04–10/02/2027 | Want photos of your Tet in Hanoi? |

Ảnh bìa: khung ngang 1200×630, một trong hai cảnh P0 là Hàng Mã hoặc phố cổ sáng mùng 1.

## 4. Trước khi đưa ảnh lên bài

- Convert sang WebP, đặt tên file theo slug `tet-in-hanoi-...`.
- Alt text tả đúng cảnh và địa điểm, viết bằng tiếng Anh.
- Mỗi ảnh có chú thích kèm credit; ảnh khách thật cần ghi nhận đồng ý trong sổ consent.
- Không dùng cảnh đường tàu.
