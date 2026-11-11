# Heritage Display — Regular

> **Có bản v1.1 trong `v1.1/`** (2026-11-11). Bản đó sửa lỗi đặt dấu tiếng Việt, khoảng
> cách chữ (LSB) và các vệt thừa của v1.0. File v1.0 ở thư mục này giữ nguyên vì các
> dự án cũ đang trỏ tới. Với nội dung mới có chữ tiếng Việt, dùng bản v1.1.

Font display dựng lại từ bảng mẫu chữ trong hai ảnh tham chiếu (bài editorial về
các designer Việt). Đây là **file font mới dựng bằng vector**, không phải file font
gốc của tác giả thiết kế.

## File trong thư mục này

| File | Dùng cho |
|---|---|
| `HeritageDisplay-Regular.ttf` | Cài vào hệ điều hành, dùng trong Figma / Photoshop / Illustrator / Office |
| `HeritageDisplay-Regular.otf` | Bản CFF, dùng khi cần in ấn hoặc phần mềm ưu tiên OTF |
| `HeritageDisplay-Regular.woff2` | Nhúng web (đã nén, 24 KB) |
| `specimen.png` | Bảng mẫu chữ để xem nhanh toàn bộ bộ ký tự |
| `source/` | Pipeline Python dựng font + ảnh tham chiếu gốc, để build lại khi cần chỉnh |

## Những gì bám 1:1 theo bản gốc

Toàn bộ chữ in hoa và số có trong bảng mẫu được **dò lại (trace) trực tiếp từ ảnh**,
giữ nguyên hình dáng, độ tương phản nét, các chi tiết gãy và đuôi nét đặc trưng:

`A Ă Â B C D Đ E Ê F G H I J L M N O Ô Ơ P Q R S U Ư V W X Y Z`
`0 1 2 3 4 5 &`

Các dấu thanh cũng lấy từ bảng gốc: mũ (roof lượn), trăng (breve), móc (hook),
ngã (wave), sắc (nét xiên dài). Dấu huyền được lấy đối xứng từ dấu sắc.

## Những gì phải dựng thêm

Bảng mẫu gốc **không có** những phần sau, buộc phải vẽ mới theo cùng hệ nét:

- **Toàn bộ chữ thường a–z** — bản gốc chỉ có chữ in hoa.
- `K`, `T`, `J` — bị cắt mất ở mép ảnh hoặc nằm ngoài khung.
- Số `6 7 8 9` — phần cuối dãy số bị cắt khỏi ảnh.
- Dấu chấm, phẩy, hai chấm, chấm phẩy, gạch nối, gạch ngang, ngoặc, nháy, `? ! * •`.
- Sừng của `ơ` / `ư` ở chữ thường và dấu nặng (dot below).

## Độ phủ

- **219 codepoint**, gồm **đủ 134 ký tự tiếng Việt** (dựng sẵn, không cần tổ hợp).
- Latin cơ bản A–Z, a–z, 0–9, dấu câu thông dụng.

## Thông số

- UPM 1000 · cap height 700 · x-height 500 · ascender 980 · descender −300
- Chữ hoa: nét đứng ≈ 147 · nét ngang ≈ 106 — đo trực tiếp từ bảng gốc
- Chữ thường: nét đứng ≈ 116 · nét ngang ≈ 84 — cân theo tỉ lệ x-height để không
  bị nặng hơn chữ hoa
- **Kerning: 1.941 cặp**, dựng tự động bằng cách đo khoảng cách outline thật giữa
  từng cặp ký tự, xuất ra GPOS dạng class nên phủ luôn mọi biến thể dấu tiếng Việt
  (`Ă` `Ấ` `Ộ`… kern y như `A` `O`)
- Một weight duy nhất: Regular

## Giới hạn cần biết

1. **Không thể "giống 100%"** so với bản gốc. Mọi đường cong đều qua bước xấp xỉ
   vector từ ảnh raster 2048px, nên ở cỡ rất lớn sẽ thấy khác biệt nhỏ so với bản in.
   Muốn đúng tuyệt đối thì chỉ có cách xin file font gốc từ tác giả.
2. **Chữ thường là phần sáng tác mới** — không có mẫu gốc để đối chiếu, nên đây là
   diễn giải theo tinh thần condensed / tương phản cao của bộ in hoa. Chữ `a` dạng
   một tầng (single-storey) cho khớp độ đậm của bộ nét.
3. Kerning phủ chữ cái; cặp với dấu câu và chữ số chưa kern riêng.

## Về bản quyền

Dáng chữ (letterform) nói chung không được bảo hộ bản quyền, nhưng **file font**
(phần mềm) thì có. File trong thư mục này là file mới do mình dựng, không chứa
outline gốc. Nếu định phân phối font này ra ngoài hoặc dùng cho thương hiệu lớn,
nên xác nhận lại với tác giả thiết kế gốc.

## Đổi tên font

Tên "Heritage Display" chỉ là tên tạm. Muốn đổi, sửa tham số `family=` trong
`compile_font.compile_ttf()/compile_otf()` rồi build lại, hoặc dùng FontForge để
đổi trực tiếp trong file.
