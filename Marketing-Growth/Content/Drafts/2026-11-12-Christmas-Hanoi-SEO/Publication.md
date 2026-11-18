---
title: Christmas Hanoi SEO cluster — website publication
owner: Marketing-Growth
status: Published
published_date: 2026-11-12
timezone: Asia/Ho_Chi_Minh
nodes: [125, 126, 127, 85, 128, 129, 130, 131, 132, 133]
---

# Đã xuất bản (12/11/2026)

Rocky duyệt trong chat 12/11: "Q1: triển khai toàn bộ và đăng lên website tất cả", "Q3: Chốt thêm vào bài số 5" (góc quà tặng). Claude tạo node trong built-in browser (phiên admin sẵn có).

| # | Node | URL | SEO title (title tag ẩn danh) | Category |
|---|---|---|---|---|
| 1 | 125 | /news/christmas-in-hanoi | Christmas in Hanoi 2026: Where to Go, Mass & What's Open | Travel Tips |
| 2 | 126 | /news/hanoi-weather-december | Hanoi Weather in December 2026: Temps, Rain & What to Wear | Travel Tips |
| 3 | 127 | /news/hang-ma-street-christmas-photo-spots | Hang Ma Street Christmas: Hanoi Photo Spots & Best Times | Travel Tips |
| 4 | 85 (sửa) | /news/st-josephs-cathedral | St. Joseph's Cathedral Hanoi: Guide & Christmas Eve Tips | Stories (giữ) |
| 5 | 128 | /news/christmas-photoshoot-hanoi | Christmas Photoshoot in Hanoi: Outfits, Timing & Routes | Travel Tips |
| 6 | 129 | /news/christmas-in-vietnam-traditions | Christmas in Vietnam: Traditions, Food & How to Say It | Stories |
| 7 | 130 | /news/new-years-eve-hanoi | New Year's Eve in Hanoi 2027: Fireworks & Countdown Guide | Travel Tips |
| 8 | 131 | /news/vietnam-in-december | Vietnam in December: Weather by Region & Where to Go | Travel Tips |
| 9 | 132 | /news/hanoi-christmas-new-year-itinerary | Hanoi Christmas Itinerary: 5 Slow Days + Phat Diem Trip | Travel Tips |
| 10 | 133 | /news/christmas-dinner-hanoi | Christmas Dinner in Hanoi 2026: Hotel Menus & Local Eats | Food |

Cấu hình chung: Full HTML, alias thủ công (tắt pathauto), lang en, tắt tự dịch VI, Published. Ảnh bìa + ảnh inline có credit (figcaption + dòng "Cover photo"). Bản HTML live lưu ở `live-bodies/`. Rollback: Revisions của từng node (node 85 có revision log 12/11).

Node 85: giữ nguyên thân bài cũ; thêm H2 "St. Joseph's Cathedral at Christmas" + FAQ, sửa alt 3 ảnh, đổi H1/SEO title/meta/summary.

Bài 5: không ghi giá cụ thể (trang /hanoi-photoshoot đang hiện giá cũ, chờ Rocky xử lý). Có mục "Give a Hanoi photo walk as a Christmas gift": khách chọn gói và số giờ, nhận gift note, người nhận tự chọn ngày; hiệu lực/đổi ngày/thanh toán "xác nhận bằng văn bản trước khi trả tiền". CTA: DM PHOTO + ghi "gift".

## Bằng chứng (curl ẩn danh, 12/11/2026)

- 10/10 URL HTTP 200, 1 H1, canonical đúng, không noindex, có og:image, có trong /sitemap.xml.
- 0 ảnh lỗi, 0 link nội bộ lỗi (tổng 83 link).
- Title tag ẩn danh = SEO title (URL sạch). Lưu ý: khi URL có query string (?x=…) theme trả node title — ghi chú cho Sơn, không ảnh hưởng canonical.
- Bing Webmaster Tools: 10 URL submitted, "Success: 10 URLs submitted Succesfully" (10:52).
- GSC: gửi lại sitemap.xml thành công. Request Indexing cho /news/christmas-in-hanoi: hộp thoại kiểm tra chạy rồi đóng, không thấy xác nhận → coi như chưa chắc, kiểm lại sau 3–7 ngày.

## Cần xác minh / cập nhật trong tháng 12

- Giờ lễ đêm 24/12/2026 tại Nhà thờ Lớn (bài 1, 4): giáo xứ thường công bố đầu–giữa tháng 12.
- Kế hoạch countdown + pháo hoa Tết Dương lịch 2027 (bài 7): thường công bố giữa–cuối tháng 12.
- Thực đơn Giáng sinh 2026 của khách sạn (bài 10 đang dùng ví dụ 2025).
- Ảnh: toàn bộ là Wikimedia Commons trừ ảnh Thin (Harry). Nên thay bằng ảnh tự chụp mùa Noel (Hàng Mã, Nhà thờ Lớn, khách thật).
- Phụ thuộc: bài 5 dẫn về /hanoi-photoshoot (giá cũ 8/20/50/80 USD).

## Cập nhật 12/11 (chiều)

- Node 128: thêm "Date changes and cancellations" (đổi ngày được; hoàn 90% ≥72h, 50% ≥48h, 30% ≥24h, 10% ≥12h) theo `Executive/DEC-20261112-GIFT-DATE-CHANGE-REFUND.md`.
- Brief chụp thay ảnh: `Creative-Production/Projects/Christmas-Hanoi-2026-Shoot/Brief.md`.
- Lịch kiểm tra tự động: 15/12 và 26/12/2026, 10:00 giờ Hà Nội.

## Cập nhật 14/11

- Node 130 và 131: mỗi bài thêm 1 câu link tới `/news/tet-in-hanoi` (Rocky duyệt "Thêm link"). Revision log
  "Internal link to /news/tet-in-hanoi (Tet 2027 guide), 14 Nov 2026". Chi tiết và bằng chứng ở
  [Publication.md của bài Tết](../2026-11-14-tet-2027-hanoi/Publication.md). Các file trong `live-bodies/` là bản 12/11,
  chưa có câu này.
