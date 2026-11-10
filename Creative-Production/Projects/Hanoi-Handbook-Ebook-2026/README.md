---
title: "The Hanoi Handbook (ebook EN, A4, 24 trang)"
owner: Creative-Production
requested_by: Rocky (chat 10/11/2026: làm content cẩm nang Hà Nội dạng ebook, có đủ hình minh hoạ, dùng Kie API)
status: "Draft v01 — chưa duyệt, chưa đăng"
created: 2026-11-10
copy_and_claims: ../../../Marketing-Growth/Content/Drafts/2026-11-10-Hanoi-Handbook-Ebook/Sources-And-Claims.md
---

# The Hanoi Handbook v01

Cẩm nang Hà Nội tiếng Anh cho khách lần đầu đến, dài 24 trang A4, dùng làm lead magnet.
Giọng văn "local friend". Mọi số liệu có thời hạn đều kèm nhãn `checked`.

Ebook lấy cảm hứng cấu trúc từ `vietnam-ebook-en.pdf` (Local Vietnam, 2022), nhưng chỉ mượn
danh sách chủ đề. Câu chữ, số liệu và hình đều làm mới. Chi tiết xem
[Sources & claims](../../../Marketing-Growth/Content/Drafts/2026-11-10-Hanoi-Handbook-Ebook/Sources-And-Claims.md).

## File

| File | Vai trò |
|---|---|
| `hanoi-handbook.html` | **Nguồn duy nhất** của nội dung và layout. Sửa chữ ở đây rồi build lại |
| `TravelFrame-Hanoi-Handbook-2026-v01.pdf` | Bản render để review |
| `preview-cover-v01.png` | Ảnh bìa xem nhanh, 1588×2246 |
| `illustrations/*.jpg` | Bản nén của hình AI (tối đa 1400 px, chất lượng 76), sinh tự động |
| `fonts/` | Heritage Display (font brand, chỉ dùng cho tên sách trên bìa và wordmark), Cormorant Garamond (tiêu đề) và Be Vietnam Pro (chữ thân), đều là OFL. Font nằm local nên build không cần mạng |
| `source/build.sh` | Nén ảnh, xuất PDF và preview bằng Chrome headless |
| `source/generate_illustrations.py` | Gọi Kie `nano-banana-2`, tải ảnh, ghi manifest |

Hình gốc (PNG), prompt và manifest có taskId cùng số credit nằm ở
[`Assets/AI-Generated/Hanoi-Handbook-2026/`](../../Assets/AI-Generated/Hanoi-Handbook-2026/).

## Hình minh hoạ (Kie API)

- **Model:** `nano-banana-2`. Bìa render 2K, các hình còn lại 1K.
- **Phong cách chung:** ký hoạ mực và màu nước trên giấy ngà; accent teal `#008AA3`, vàng đất, xanh rêu. Không có chữ trong hình.
- **Chi phí:** 22 hình, 180 credit (khoảng $0,90). Số credit của từng hình ghi trong `manifest.json`.
- Trang 24 của ebook ghi rõ hình do AI tạo, là hình minh hoạ chứ không phải ảnh chụp địa điểm thật.
- Rocky cho phép dùng Kie trong chat ngày 10/11/2026.

## Dựng lại

```bash
zsh "Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/source/build.sh"
```

Muốn tạo lại một hình: sửa prompt trong `prompts.json`, rồi chạy
`python3 -I source/generate_illustrations.py <prompts.json> <id>`. Cần biến môi trường
`KIE_API_KEY`. Lệnh này dùng API trả phí, nên cần Rocky duyệt.

## Lưu ý về font

- **Heritage Display:** chữ thường và một số chữ in hoa bị lệch hoặc thiếu dấu tiếng Việt ("Kiếm", "Thăng", "Bài"), chữ "w" có vết lạ. Vì vậy chỉ dùng font này cho chữ không dấu.
- **DM Sans:** thiếu dấu chồng như "ế" và "ố". Đã thay bằng Be Vietnam Pro, tải từ google/fonts ngày 10/11/2026.

## Guardrail đã áp dụng

- Không ghi giá tour TravelFrame và không hứa SLA giao ảnh. CTA chỉ có "Message PHOTO to @travelframe.vn" và link Messenger.
- Mục Train Street không gắn link bán tour.
- Visa chỉ dẫn về evisa.gov.vn. TravelFrame không đứng ra tư vấn visa.
- Link sang website gắn UTM `utm_source=hanoi_handbook&utm_medium=pdf&utm_campaign=hanoi_handbook&utm_content=<mục>`.

## Còn mở

Xem mục 4 trong Sources & claims: Lăng Bác mở lại, re-check trước khi đăng, kênh phân phối và keyword, cập nhật UTM guide.
