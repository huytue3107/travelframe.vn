---
title: "Thiệp xác nhận booking (mẫu dùng lại)"
owner: Creative-Production
requested_by: Rocky (chat 15/11/2026: thiệp xác nhận đi kèm email booking sinh nhật, tạo hình bằng Kie API)
status: "Draft — bản đương đại hoàn thiện 15/11/2026 (khách Elena Allday), chờ Rocky duyệt, chưa gửi khách"
created: 2026-11-15
---

# Thiệp xác nhận booking

Thiệp 4:5 (PNG 2160×2700 và PDF) gửi kèm email xác nhận đặt cọc. Đây là mẫu dùng lại:
mỗi booking có một file trong `data/`.

## Cách làm

- **Hình:** do AI tạo trên Kie (`nano-banana-2`), không có chữ trong hình.
- **Chữ và số:** tên khách, giá, ngày, mã booking đều được đặt bằng code (`source/card.html`),
  nên không bao giờ bị AI viết sai số tiền hay ngày tháng.
- **Font:** Be Vietnam Pro, Newsreader, Caveat (giấy phép OFL), chép từ dự án Hanoi Handbook.
- **Màu:** teal `#008AA3`, đỏ gạch `#A2452E`, nền giấy ngà `#FAF5EA`, cùng bảng màu với Handbook.

## Hình minh hoạ

Prompt nằm ở `Creative-Production/Assets/AI-Generated/Booking-Confirmation-Card-2026/`:

| Hướng | File prompt | Ghi chú |
|---|---|---|
| A. Màu nước | `watercolor/prompts.json` | Hai cô gái dạo đại lộ khu phố Pháp, nhiếp ảnh gia đi cùng. Cùng phong cách Handbook |
| B. Flat lay ảnh thật | `flatlay/prompts.json` | Máy film, ảnh instant, xấp ảnh in buộc ruy băng, cành đào |

Mỗi hình 3:2, 2K, khoảng 12 credit. Tạo bằng script có sẵn của Handbook (API trả phí, cần Rocky duyệt):

```bash
python3 -I Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/source/generate_illustrations.py \
  Creative-Production/Assets/AI-Generated/Booking-Confirmation-Card-2026/watercolor/prompts.json
```

Cần biến môi trường `KIE_API_KEY`. Script ghi `manifest.json` (taskId, credit) cạnh file prompt.

## Dựng thiệp

```bash
cd Creative-Production/Projects/Booking-Confirmation-Card-2026
python3 -I source/build.py data/TF-20261115-BDAY.json \
  --art ../../Assets/AI-Generated/Booking-Confirmation-Card-2026/watercolor/card-hero-watercolor.png
```

Cần `playwright` và Chromium hoặc Google Chrome. Script báo khoảng trống giữa phần chữ và chân
thiệp; nếu dưới 16px thì phải rút gọn chữ.

Booking mới: chép file trong `data/`, sửa mã, tên khách, ngày, tiền. Trước khi gửi, thay
`[Guest Name]` bằng tên thật.

## Trạng thái

- `renders/TF-20261115-BDAY-card.png` là bản dựng tạm, hình lấy từ `Hanoi-Handbook-2026/16-photo-walk.png`
  (không phải khu phố Pháp, không có chi tiết sinh nhật).
- Chưa gửi khách.

## Bản 2: đương đại tối giản (15/11/2026)

Rocky yêu cầu thiết kế tối giản, hiện đại, phá cách theo nghệ thuật đương đại.

- Template: `source/card-contemporary.html`, dữ liệu `data/TF-20261115-BDAY-contemporary.json`.
- Ý tưởng: thiệp như nhãn tác phẩm trong phòng tranh. Một tác phẩm cắt dán (vòm cửa vàng đất,
  mặt trời đỏ thương hiệu, cửa chớp teal, ảnh instant, cành đào), chữ "CONFIRMED." chạy dọc mép phải.
- Hình hiện tại `art/collage-draft.svg` do Claude vẽ bằng vector để chốt bố cục.
- Hình thật: tạo bằng ChatGPT theo prompt
  `Assets/AI-Generated/Booking-Confirmation-Card-2026/chatgpt/chatgpt-contemporary-collage.md`.

```bash
python3 -I source/build.py data/TF-20261115-BDAY-contemporary.json --suffix=-contemporary --art art/<file>.png
```

### Bản hoàn thiện cho Elena Allday (15/11/2026)

- Hình: `art/tf-collage-A.png`, biến thể A do ChatGPT tạo, Rocky chọn.
- Màu nền thiệp `#EFE4D9` lấy mẫu từ nền hình để không lộ viền ô vuông (trường `WALL` trong data).
- Xuất: `renders/TF-20261115-BDAY-card-contemporary.png` (2160×2700), `.pdf`, và
  `-email.jpg` (1440×1800, nhẹ, để đính kèm email hoặc WhatsApp).
- Booking mới dùng mẫu này: chép file data, sửa tên, tiền, ngày; giữ `WALL` = `#EFE4D9` nếu dùng lại hình A.
