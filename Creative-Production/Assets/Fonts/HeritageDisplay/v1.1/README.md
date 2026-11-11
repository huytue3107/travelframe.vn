# Heritage Display — Regular v1.1

Bản tinh chỉnh của v1.0 (thư mục cha). File v1.0 giữ nguyên, không bị ghi đè.
Tên font vẫn là "Heritage Display", version `1.100`. Nếu đã cài v1.0, gỡ bản cũ
trước khi cài bản này để ứng dụng không dùng nhầm cache.

| File | Dùng cho |
|---|---|
| `HeritageDisplay-Regular.ttf` / `.otf` | Cài vào máy, Figma, Adobe, Office |
| `HeritageDisplay-Regular.woff2` | Nhúng web |
| `specimen.png` | Bảng mẫu chữ v1.1 |
| `before-after.png` | So sánh trực tiếp v1.0 và v1.1 trên cùng câu chữ |
| `browser-test.html` | Mở bằng Chrome/Safari để thử render thật (font nhúng sẵn) |
| `source/` | Pipeline build v1.1 |
| `SHA256SUMS.txt` | Checksum 3 file font (kiểm tra bằng `shasum -a 256 -c SHA256SUMS.txt`) |

## Đã sửa so với v1.0

**Dấu tiếng Việt**

1. Ô cắt chữ `Ă` thực ra đang trace chữ `Â`, ô cắt `Â` lại trace chữ `Ã`. Vì vậy
   "THĂNG" hiện thành "THÂNG", và dấu trăng với dấu mũ là cùng một hình. Giờ `Ă`
   lấy từ hàng 4 của bảng gốc, nơi có chữ `Ă` thật.
2. Dấu huyền trước đây là dấu sắc lật ngang. Dấu sắc đó lại dính thêm mảnh của chữ
   bên cạnh, nên "BÀI" trông như "BĂI". Giờ dấu huyền được trace từ chữ `È` thật của
   bảng gốc, dấu sắc từ `Ó`.
3. Dấu huyền và dấu sắc của bản gốc gần như nằm ngang. Bản này nghiêng chúng 0,16
   (huyền đi xuống, sắc đi lên) để "à / á / ă" không lẫn nhau ở cỡ chữ nhỏ. Muốn
   giữ đúng độ phẳng của bản gốc thì đặt `TONE_TILT = 0` trong `source/compose.py`.
4. Xếp dấu chồng theo đúng mẫu `Ồ`, `Ầ`, `Ễ` trong ảnh tham chiếu: sắc, huyền, hỏi
   nằm lệch phải phía trên dấu mũ; ngã nằm thẳng trên mũ; dấu thanh trên dấu trăng
   xếp chồng ở giữa. Mỗi dấu được nâng dần cho tới khi cách nét chữ một khoảng tối
   thiểu, nên không còn dấu đè lên nhau.
5. `ì í ỉ ĩ` dùng chữ i không chấm (thêm glyph `ı`). Dấu nặng của `ỵ` tránh sang phải
   phần đuôi chữ.
6. Móc của `ơ` vẽ lại theo dáng chữ `Ơ` in hoa: nét trên của thân chữ kéo dài sang
   phải. `ơ` và `ư` được nới advance để móc không chạm chữ kế tiếp.

**Nét chữ**

7. Bỏ các vệt mảnh của chữ bên cạnh bị cắt lẫn vào nét chữ (ví dụ `Y`, `Z`, `Ư`, `Ơ`).
   Lý do: trên bảng gốc các chữ dính sát nhau. Mép nét được trace từ độ phủ khử răng
   cưa của ảnh, nên mượt hơn và không còn bậc thang.
8. Chữ `w` hết bị thủng lỗ: một nét chéo khai báo điểm sai thứ tự, tạo hình tự cắt.
9. Đuôi `g` và `j` vẽ lại thành nét cong tròn, thay cho móc vuông.
10. Số `6` trace từ bảng gốc (v1.0 tưởng bị cắt nên tự vẽ). Số `9` là số 6 xoay 180°.
11. Toàn bộ glyph được khử chồng nét (remove overlaps) và thống nhất chiều contour.

**Thông số và spacing**

12. Bảng `hmtx` của v1.0 ghi lề trái (LSB) = 0 cho 198 glyph, trong khi nét chữ thật
    bắt đầu ở 30–56 đơn vị. TrueType dời nét chữ theo giá trị này, nên mọi chữ bị
    lệch trái và khoảng cách không đều. Giờ LSB đúng bằng xMin. Các glyph tự dựng
    thêm (K, T, J, 7, 8, dấu câu) cũng được chia lề đều hai bên.
13. Kerning: ngoài 1.895 cặp theo class, thêm 1.868 cặp ngoại lệ đo trên outline thật
    của chữ có dấu, để dấu không va gạch ngang của T/V/W/Y ("Tấn", "Tới", "Yên"). Móc
    của ơ/ư cũng không bị kern sát vào chữ sau.
14. `sxHeight` sửa thành 500 (v1.0 ghi 480). `usWinAscent` = 1015 để chữ hoa có dấu
    chồng (cao nhất là `Ế`, 1005) không bị Windows cắt. Bật cờ `USE_TYPO_METRICS`.

## Kiểm tra đã chạy

- OTS sanitizer (bộ kiểm tra font của Chrome/Firefox): TTF, OTF, WOFF2 đều PASS.
- Đủ 146/146 chữ cái tiếng Việt (hoa và thường, kể cả `đ Đ`), 220 glyph.
- Chiều contour đúng chuẩn ở mọi glyph (TTF thuận chiều kim đồng hồ, CFF ngược
  chiều); LSB khớp xMin ở mọi glyph.
- Render bằng HarfBuzz/FreeType và bằng Chrome: chữ thường và hoa có dấu, chuỗi
  tổ hợp NFD, cỡ 22–150 px.

## Vẫn còn giới hạn

- Chữ thường, `K T J 7 8` và dấu câu vẫn là phần dựng thêm, không có mẫu gốc.
- Chưa có `$ € £ © ® @ %`, ngoặc nhọn và ký tự toán học.
- Một weight duy nhất (Regular).

## Build lại

```bash
python3 -m venv venv && ./venv/bin/pip install fonttools brotli potracer uharfbuzz skia-pathops numpy pillow
cd source
../venv/bin/python build.py ../../source/ref/a.png ..
../venv/bin/python specimen.py ../HeritageDisplay-Regular.ttf ../../HeritageDisplay-Regular.ttf ..
```
