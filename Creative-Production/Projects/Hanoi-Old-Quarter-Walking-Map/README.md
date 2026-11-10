---
title: "Hanoi Old Quarter Walking Map (bản đồ đi bộ Phố Cổ 2 giờ)"
owner: Creative-Production
requested_by: Marketing-Growth (campaign TF-SEO-20261106, P1 "Downloadable Map")
status: "Published 2026-11-10 (v01). Rocky duyệt trong chat 09/11: 'Duyệt, upload'"
created: 2026-11-09
published: 2026-11-10
pdf_url: https://travelframe.sidevn.com/sites/default/files/guides/TravelFrame-Hanoi-Old-Quarter-Walking-Map.pdf
page_url: https://travelframe.sidevn.com/news/hanoi-old-quarter-guide
---

# Hanoi Old Quarter Walking Map v01

Bản đồ A4 một trang, khách tải về từ bài Pillar
[`/news/hanoi-old-quarter-guide`](https://travelframe.sidevn.com/news/hanoi-old-quarter-guide) (node 105). Mục tiêu là từ khóa
`hanoi old quarter map` (170 lượt/tháng, KD 0). Brief: [Master Report, Cụm 2](../../../Marketing-Growth/SEO/2026-11-06-OpenSEO-Campaign-Execution-Master-Report.md).

## File

| File | Vai trò |
|---|---|
| `TravelFrame-Hanoi-Old-Quarter-Walking-Map.pdf` | Bản đã đăng, giống hệt v01, đặt tên theo quy ước file trong `/guides/` |
| `Hanoi-Old-Quarter-Walking-Map-v01.pdf` | v01 bản phát hành (A4, 1 trang, không có dấu DRAFT) |
| `preview-v01.png` | Ảnh xem nhanh của v01 (1588×2246) |
| `Hanoi-Old-Quarter-Walking-Map-v01-draft.pdf`, `preview-v01-draft.png` | Bản nháp 09/11 có dấu "DRAFT v01 · NOT FOR PUBLICATION", giữ làm lịch sử |
| `map-v01.html` | Bản render, sinh tự động; không sửa tay |
| `source/build_map.py` | Script dựng bản đồ: lộ trình, mốc giờ, nội dung chữ |
| `source/osm-old-quarter-2026-11-09.json` | Dữ liệu đường phố OpenStreetMap, lấy ngày 09/11/2026 |
| `source/overpass-query.txt` | Câu truy vấn Overpass đã dùng (bbox 21.0255–21.0405, 105.8435–105.8585) |

## Nội dung

- **4 khu:** (1) Hàng Chiếu & Đồng Xuân, (2) Mã Mây, (3) Hàng Bạc, (4) Tạ Hiện.
- **Lộ trình:** 1,9 km, khoảng 29 phút đi bộ, đi lúc 7:00 và xong khoảng 9:00.
  - Đi ngoài giờ cao điểm: ánh sáng dịu, phố còn vắng (giống khuyến nghị trong bài Pillar).
  - Thứ tự: hồ Hoàn Kiếm (góc Cầu Gỗ) → Hàng Đào, Hàng Ngang, Hàng Đường → chợ Đồng Xuân → Hàng Chiếu → Ô Quan Chưởng → Đào Duy Từ → nhà cổ 87 Mã Mây → Hàng Bạc (đình Kim Ngân) → Tạ Hiện → đền Bạch Mã.
- **Cách vẽ lộ trình:** không vẽ tay. Script tính đường ngắn nhất giữa các điểm dừng trên mạng phố OSM, nên đường đi bám đúng phố thật và quãng đường đo được.
  - Marker đặt tại tọa độ thật của từng địa điểm. 87 Mã Mây lấy theo Nominatim (OSM way 323366879).
  - Mốc giờ tính theo tốc độ 4 km/h, cộng thời gian dừng 10–15 phút mỗi điểm.
- **Nguồn nội dung chữ:** lấy từ bài Pillar node 105 (phí vào nhà 87 Mã Mây khoảng 20.000đ, Ô Quan Chưởng xây năm 1749, giờ chợ đêm, đền Bạch Mã nghỉ trưa) và bài 15 photo spots (mẹo dây điện, chào "Xin chào").
  - Chỉ thêm một ý ngoài hai bài: đình Kim Ngân (42 Hàng Bạc) thờ tổ nghề kim hoàn.
- **CTA:** chỉ dùng "Message PHOTO to @travelframe.vn". Không ghi giá, vì bảng giá $30/$60/$99 chưa lên site (chờ [ticket D10](../../../Marketing-Growth/SEO/2026-10-14-Developer-SEO-Ticket.md)).
- **Bản quyền:** dữ liệu bản đồ © OpenStreetMap contributors, giấy phép ODbL. Đã ghi nguồn ở chân trang PDF.

## Đăng lên website (10/11/2026)

- **Upload:** dùng trường `field_downloadable_pdf` của node 105. Trường này do một phiên khác thêm cho loại News sáng 10/11, cùng đợt với food map; xem [Publication](../../../Marketing-Growth/Content/Drafts/2026-11-10-Hanoi-Secret-Food-Map/Publication.md).
  - Trình duyệt không cho agent chọn file, nên Rocky chọn file trong form. Claude chèn nút tải và bấm Save.
  - File trên server: fid 898, trạng thái Permanent.
- **Nút tải:** đặt ở cuối mục "A simple mental map of the Old Quarter", ngay trước H2 "10 best things to do…". Gồm 1 câu giới thiệu và nút "Download the free Old Quarter walking map (PDF, 1 page, A4)", cùng kiểu nút với bài food map (nền `#8b1d1d`, chữ trắng).
  - Revision log: "SEO 10/11 campaign TF-SEO-20261106: PDF ban do di bo Pho Co…".
- **Bằng chứng (`curl` không đăng nhập, 10/11):**
  - trang 200, canonical đúng, không có markup admin, có trong sitemap;
  - PDF trả 200 `application/pdf`, 431.978 byte; SHA-256 trên server khớp file local.

**Rollback:** node 105 → Revisions → revert về revision trước "SEO 10/11 campaign". Sau đó xoá file fid 898 tại `/admin/content/files`, khi file không còn được dùng ở đâu.

## Dựng lại

```bash
cd "Creative-Production/Projects/Hanoi-Old-Quarter-Walking-Map"
python3 -I source/build_map.py
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$PWD/Hanoi-Old-Quarter-Walking-Map-v01.pdf" "file://$PWD/map-v01.html"
"$CH" --headless=new --hide-scrollbars --virtual-time-budget=8000 --window-size=794,1123 --force-device-scale-factor=2 --screenshot="$PWD/preview-v01.png" "file://$PWD/map-v01.html"
```

Font Anton, Space Mono, Plus Jakarta Sans tải từ Google Fonts lúc render, nên máy render cần có mạng.

## Còn mở

1. **Đi thực địa một lần** theo lộ trình, lúc 7:00, để kiểm tra 3 việc:
   - giờ mở cửa của nhà 87 Mã Mây và đền Bạch Mã (hiện chỉ ghi "check at the door");
   - phố có bị chặn hay đang thi công không;
   - tổng thời gian có đúng khoảng 2 giờ không.

   Nếu phải sửa thì làm v02 và upload thay file cũ.
2. **Domain:** chân trang PDF đang ghi `travelframe.sidevn.com`. Khi chuyển sang `travelframe.vn` (Q1/2027) cần render lại; link cũ vẫn chạy nhờ 301.
3. **Giá:** khi developer làm xong D10, cân nhắc thêm dòng giá vào CTA.
4. **Ảnh bản đồ trong bài:** hiện bài chỉ có nút tải PDF. Nếu nhúng thêm ảnh xem trước (`preview-v01.png`, có alt text) thì sẽ khớp hơn ý định tìm "hanoi old quarter map". Việc này chưa làm vì chưa được yêu cầu.

## Checksum (SHA-256)

```
a52f71bd368d4f02aaceb350d7139c214cf19d8677dc039cc4173b0cc3f00909  TravelFrame-Hanoi-Old-Quarter-Walking-Map.pdf
a52f71bd368d4f02aaceb350d7139c214cf19d8677dc039cc4173b0cc3f00909  Hanoi-Old-Quarter-Walking-Map-v01.pdf
152eb1bac1c0764e21b139b3acf6b9cccd94530fb79d891057f11dde5d18c0d0  Hanoi-Old-Quarter-Walking-Map-v01-draft.pdf
aac73f6f72db201014da01c33bf6377328841fced1c5916113c15fa74c9b664c  map-v01.html
9da887a7611909527a427284b1bd3e95a573ecbf1ebd73b53f168b97f921372c  preview-v01.png
6c7c26cc52c56303ff1d41402a62b7257beb21d6535bdc66f78edaf18a9b4ea6  preview-v01-draft.png
a28095d204e23899a03836a5a6a2016213ec8c4c04a4b9df7f02c7705e9158ca  source/build_map.py
eb0a2d802c9359bb84658ac570c4d2a662001cc9409d60cca90fd068afbff617  source/osm-old-quarter-2026-11-09.json
79fd44f0171d6dd4f591740f8a9aadd89ee5d8db59f4b2a0034d38295f583992  source/overpass-query.txt
```
