---
title: "The Hanoi Handbook (ebook EN, A4, 25 trang)"
owner: Creative-Production
requested_by: Rocky (chat 10/11/2026: làm content cẩm nang Hà Nội dạng ebook, có đủ hình minh hoạ, dùng Kie API; sau đó yêu cầu làm đẹp hơn)
status: "Draft v02 — chưa duyệt, chưa đăng"
created: 2026-11-10
copy_and_claims: ../../../Marketing-Growth/Content/Drafts/2026-11-10-Hanoi-Handbook-Ebook/Sources-And-Claims.md
---

# The Hanoi Handbook v02

Cẩm nang Hà Nội tiếng Anh cho khách lần đầu đến, dài 25 trang A4, dùng làm lead magnet.
Giọng văn "local friend". Mọi số liệu có thời hạn đều kèm nhãn `checked`.

Ebook lấy cảm hứng cấu trúc từ `vietnam-ebook-en.pdf` (Local Vietnam, 2022), nhưng chỉ mượn
danh sách chủ đề. Câu chữ, số liệu và hình đều làm mới. Chi tiết xem
[Sources & claims](../../../Marketing-Growth/Content/Drafts/2026-11-10-Hanoi-Handbook-Ebook/Sources-And-Claims.md).

## v02: thiết kế lại (Rocky chê v01 "xấu xí")

Bản v01 trông giống tài liệu web vì 4 lý do: trang nào cũng một khuôn, quá nhiều khung và hộp màu,
tranh bị cắt vuông vào khung lệch màu giấy, chữ dày và phân cấp yếu. Bản v02 sửa như sau.

- **Phong cách:** sổ tay du lịch kết hợp tạp chí. Nền giấy ngà `#FAF5EA`; mực `#1F2629`; teal `#008AA3` dùng để nhấn; vàng đất `#B07D2A` cho số chương và ghi chú.
- **Tranh không còn khung:**
  - `prep_illustrations.py` đưa màu giấy của từng tranh về trắng, rồi làm mờ dần 5% mép ngoài.
  - Trên trang, tranh được vẽ bằng `mix-blend-mode: multiply`, nên trông như màu nước vẽ thẳng lên giấy.
  - Đã kiểm tra hiệu ứng này trên chính file PDF, render bằng PDFKit, không chỉ trên trình duyệt.
- **Chữ:**
  - Newsreader cho tiêu đề và chữ nghiêng.
  - Be Vietnam Pro Light cho chữ thân, cỡ 10,1pt.
  - Caveat cho ghi chú viết tay, chỉ dùng chữ tiếng Anh.
  - Heritage Display chỉ dùng cho chữ "HANOI" trên bìa và wordmark.
- **Bố cục:**
  - Mỗi chương bắt đầu bằng số chương, tiêu đề hai giọng (đứng và nghiêng) và một đoạn dẫn.
  - Ghi chú nằm ở cột lề, phân tách bằng đường kẻ mảnh thay cho hộp màu.
  - Bảng giá kẻ dòng chấm kiểu thực đơn; phần câu giao tiếp trình bày như sổ tay phrasebook; checklist dùng vòng tròn.
  - Khối cuối mỗi trang được neo xuống chân trang, nên không còn trang trống nửa dưới.
- **Trang mới:** tách "Xin chào" thành trang thư mở đầu và "Inside" thành trang mục lục riêng.

## File

| File | Vai trò |
|---|---|
| `hanoi-handbook.html` | **Nguồn duy nhất** của nội dung và layout. Sửa chữ ở đây rồi build lại |
| `TravelFrame-Hanoi-Handbook-2026-v02.pdf` | Bản v02 để review (25 trang, khoảng 5,8 MB) |
| `preview-cover-v02.png` | Ảnh bìa v02, 1588×2246 |
| `TravelFrame-Hanoi-Handbook-2026-v01.pdf`, `preview-cover-v01.png` | Bản v01, giữ làm lịch sử |
| `illustrations/*.jpg` | Tranh đã xử lý nền giấy, tối đa 1500 px. Sinh tự động, không sửa tay |
| `fonts/` | Newsreader, Be Vietnam Pro, Caveat, Heritage Display (đều OFL). Font nằm local nên build không cần mạng. `CormorantGaramond*` và `DMSans` không còn dùng (xem lưu ý font) |
| `source/build.sh` | Xử lý tranh, xuất PDF và ảnh bìa bằng Chrome headless. Đặt `VERSION=v03` để xuất bản mới |
| `source/prep_illustrations.py` | Đưa nền giấy về trắng và làm mờ mép tranh (cần Pillow) |
| `source/generate_illustrations.py` | Gọi Kie `nano-banana-2`, tải ảnh, ghi manifest |

Hình gốc (PNG), prompt và manifest có taskId cùng số credit nằm ở
[`Assets/AI-Generated/Hanoi-Handbook-2026/`](../../Assets/AI-Generated/Hanoi-Handbook-2026/).

## Hình minh hoạ (Kie API)

- **Model:** `nano-banana-2`. Bìa render 2K, các hình còn lại 1K.
- **Phong cách chung:** ký hoạ mực và màu nước trên giấy ngà; accent teal `#008AA3`, vàng đất, xanh rêu. Không có chữ trong hình.
- **Chi phí:** 22 hình, 180 credit (khoảng $0,90). Bản v02 không tạo thêm hình nào.
- Trang 25 của ebook ghi rõ hình do AI tạo, là hình minh hoạ chứ không phải ảnh chụp địa điểm thật.
- Rocky cho phép dùng Kie trong chat ngày 10/11/2026.

## Dựng lại

```bash
zsh "Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/source/build.sh"
```

Muốn tạo lại một hình: sửa prompt trong `prompts.json`, rồi chạy
`python3 -I source/generate_illustrations.py <prompts.json> <id>`. Cần biến môi trường
`KIE_API_KEY`. Lệnh này dùng API trả phí, nên cần Rocky duyệt.

## Lưu ý về font

- **Heritage Display:** chữ thường và một số chữ in hoa bị lệch hoặc thiếu dấu tiếng Việt ("Kiếm", "Thăng", "Bài"), chữ "w" có vết lạ. Chỉ dùng cho chữ không dấu.
- **DM Sans:** thiếu dấu chồng như "ế" và "ố".
- **Cormorant Garamond:** đặt dấu lệch trên "à", "â", "ê" ("Hoàn", "Xuân", "nhiêu").
- **Newsreader, Be Vietnam Pro:** đã kiểm tra hiển thị đúng. Lấy từ google/fonts ngày 10/11/2026.

## Guardrail đã áp dụng

- Không ghi giá tour TravelFrame và không hứa SLA giao ảnh. CTA chỉ có "Message PHOTO to @travelframe.vn" và link Messenger.
- Mục Train Street không gắn link bán tour.
- Visa chỉ dẫn về evisa.gov.vn. TravelFrame không đứng ra tư vấn visa.
- Link sang website gắn UTM `utm_source=hanoi_handbook&utm_medium=pdf&utm_campaign=hanoi_handbook&utm_content=<mục>`. File v02 có 20 link, đều đã kiểm tra.

## Còn mở

Xem mục 4 trong Sources & claims: Lăng Bác mở lại, re-check trước khi đăng, kênh phân phối và keyword, cập nhật UTM guide.
