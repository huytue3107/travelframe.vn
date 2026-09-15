# TravelFrame Carousels

Carousel cho lịch content 30 ngày — xem vault: `SA/01-Projects/Hanoi-Expert/TravelFrame/10-Content-Calendar-30-Ngay-2026-09.md`.

## Cấu trúc

```
Marketing-Growth/Content/Carousels/
  shared/carousel.css      # design system chung (tokens theo Brand Source of Truth)
  assets/*.jpg             # 6 ảnh Pexels từ Guest Guide (kèm credit trong slide cuối)
  day-03-24h-hanoi/        # đăng 2026-09-14 · goal: Save · CTA comment H24
  day-11-prices/           # đăng 2026-09-22 · goal: Save · DRAFT — cần verify giá
  day-15-old-quarter/      # đăng 2026-09-26 · goal: Save
  render.sh                # render slides.html -> png/
```

## Sửa nội dung

Mở `<carousel>/slides.html` — mỗi slide là một `<div class="slide">`. Sửa text, chạy lại render. Xem trước nhanh trong browser: mở `slides.html` (không hash = thấy cả 7 slide xếp dọc).

## Render lại

```bash
./render.sh day-03-24h-hanoi 7
```

Output: `png/slide-01.png … slide-07.png` ở 2160×2700 (2× của 1080×1350, đúng tỉ lệ IG 4:5). Upload theo thứ tự số.

## Design tokens

| Token | Giá trị |
|---|---|
| Teal accent | `#008AA3` |
| Charcoal | `#18211D` |
| Off-white bg | `#EDF1EF` |
| Sage (CTA bg) | `#DCE9E4` |
| Radius | tối đa 8px |
| Cấm | gradient trang trí, orb, bo góc lớn |

Font: system stack (Helvetica Neue / SF). Không dùng web font.

## Day 11 — cần VERIFY trước khi đăng 2026-09-22

Các dòng đang có chip `VERIFY` (giá trị `—`):

1. Bánh mì
2. Egg coffee
3. Bia hơi (glass)
4. Bottled water
5. Museum entry
6. Airport → Old Quarter

Quy tắc (theo `06-Safety-And-Verified-Travel-Facts`): tối thiểu 2 nguồn gần thời điểm đăng cho mỗi nhóm giá; nếu không đủ → dùng range rộng + nhãn Indicative, hoặc bỏ số. Fresh coconut giữ nguyên "ask first" — không ghi số.

Sau khi verify: thay `—` bằng giá, đổi chip `VERIFY` thành `tag ok` + `VERIFIED`, cập nhật caption check-date, re-render.
