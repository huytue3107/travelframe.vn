---
title: Hanoi Secret Food Map — website publication
owner: Marketing-Growth
status: Published
published_date: 2026-11-10
timezone: Asia/Ho_Chi_Minh
node: 117
url: https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map
pdf_url: https://travelframe.sidevn.com/sites/default/files/guides/TravelFrame-Hanoi-Secret-Food-And-Photo-Guide-v2.pdf
---

# Đã xuất bản

[Hanoi Secret Food Map: 6 Local Street Food Spots (Free PDF)](https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map)

Ngày 10/11/2026 Rocky yêu cầu "đăng cái này lên website". Rocky chọn: bài News kèm nút tải PDF, bỏ giá tour trên web, CTA "Send PHOTO". Rocky cũng chọn thêm trường File vào loại News để host PDF. Rocky chọn 2 file trong form (trình duyệt không cho agent chọn file), sau đó Claude bấm Save.

## Thay đổi cấu trúc site (cần báo Sơn)

- Thêm field `field_downloadable_pdf` (File, 1 file, chỉ `.pdf`, tối đa 20 MB, thư mục `public://guides`) cho content type News.
- Manage display (Default): field này để **Hidden**. Link tải PDF nằm trong body.
- Revision log node 117: 3 revision (tạo bài; thêm nút tải + ảnh preview; đổi chữ nút sang trắng).

## Bằng chứng (kiểm 10/11, fetch không cookie trong built-in browser)

- Trang bài trả HTTP 200, không có markup admin. Title: `Hanoi Food Map: 6 Local Spots + Free PDF | TravelFrame Vietnam`. Canonical đúng URL bài, không noindex. Meta description đúng bản trong Page-Copy.
- og:image: `2026-11/hanoi-secret-food-map-cover.webp` (200, image/webp). Ảnh inline cùng file, `complete`, 1200×630.
- PDF: 200, `application/pdf`, 3.457.365 bytes, khớp file gốc (md5 `e2838b3e0bf0ed54097d90a663f3e141`). Trang có 3 link tải.
- 4/4 link nội bộ trả 200 (bún chả guide, honest street food guide, Old Quarter guide, /hanoi-photoshoot).
- Một H1. Field file không hiển thị trên trang công khai.
- Có trong `/sitemap.xml`.
- Viewport 375px: không tràn ngang; nút tải chữ trắng trên nền #8b1d1d.

## Giới hạn

- Hero bài dùng ảnh mặc định của theme (nhà thờ), giống các bài News khác. Main image chỉ dùng cho og:image.
- Bài chưa xuất hiện trên `/news`, `/news?category=6` và trang chủ, cùng tình trạng với node 116 (vấn đề listing đã biết).
- Giờ mở cửa và giá món ăn lấy từ PDF, chưa kiểm lại thực địa ngày 10/11.
- Published không có nghĩa là Google đã index.

## Cập nhật v2, phần chữ (10/11/2026)

Rocky duyệt trong chat: "Duyệt, cập nhật live". Claude dán body v2 và lead mới vào node 117 rồi bấm Save (revision mới, có revision log). Rollback: Revisions của node 117, revert về revision trước.

Đã lên live:

- Body theo `Publish-Body-v2.html`: giao ảnh gốc 24h / ảnh chỉnh sửa 48h, USD theo 26.000đ, 6 link Google Maps, link nội bộ tương đối, nút `.btn.btn--primary`, `<figcaption>`, CTA Messenger + Instagram mở tab mới.
- Lead (`field_tacos_summary`): "Six Hanoi street food spots locals actually eat at…" (bỏ "Old Quarter").

Chưa lên live (trình duyệt không cho agent chọn file):

- Cover v2: ảnh trong bài và og:image vẫn là `hanoi-secret-food-map-cover.webp` (v1, còn ảnh AI có người).
- PDF v2: 3 link tải vẫn trỏ về PDF v1 (ghi giao ảnh 24h, giá $30/$60, `travelframe.vn`, trang 2 bị cắt đáy).
- Link tới bài này từ Old Quarter guide và honest street food guide.

Bằng chứng (curl không cookie, sau khi lưu):

- HTTP 200, một H1, canonical đúng URL bài, không có markup admin.
- Có "within 48 hours", lead mới, 6 link `google.com/maps`, `m.me/travelframe.vn`, `<figcaption>`; không còn "Six Old Quarter" và inline style `#8b1d1d`.
- 4/4 link nội bộ, PDF v1 và cover v1 trả 200.
- Nút tải trong bài hiển thị dạng viền (nền trắng, chữ đỏ đậm), không phải nền đỏ như v1.

## Cập nhật v2, cover và PDF (10/11/2026)

Rocky chọn 2 file trong form (cover v2, PDF v2) và yêu cầu bổ sung Alternative text. Claude điền alt, đổi `src` ảnh và 3 link PDF trong body sang file v2, rồi bấm Save (revision mới). Mục "Chưa lên live" ở trên chỉ còn link từ 2 bài liên quan.

Bằng chứng (curl không cookie, sau khi lưu):

- Trang bài HTTP 200, một H1, không markup admin. Body không còn link PDF v1 hay cover v1.
- og:image: `2026-11/hanoi-secret-food-map-cover-v2.webp` (200, image/webp, 39.192 bytes).
- PDF v2: 200, `application/pdf`, 3.547.503 bytes, md5 `ac31346f2e4d53061f3185fadeeb621b`, khớp file trong `Creative-Production/Deliverables/`.
- PDF v1 vẫn trả 200 ở URL cũ (không xóa), nên link đã lưu từ trước không vỡ.

## Link nội bộ từ 2 bài liên quan (10/11/2026)

Rocky duyệt trong chat: "Thêm 2 link". Mỗi bài thêm một đoạn `<p>`, lưu thành revision mới có revision log; phần còn lại của body giữ nguyên từng ký tự. Rollback: revert revision của từng node.

- Node 105 `/news/hanoi-old-quarter-guide`, cuối mục "Where to eat in the Old Quarter": "Hungry after the walk? Our free Hanoi Secret Food Map lists six local street food spots with addresses, hours and prices."
- Node 65 `/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local`, cuối Part 4: "Want the short list? Download the free Hanoi Secret Food Map: six local spots with addresses, hours and prices on two printable pages."

Bằng chứng (curl không cookie): cả hai trang HTTP 200, một H1, có đúng 1 link `href="/news/hanoi-secret-food-photo-map"`, không markup admin. Bài vẫn chưa hiện trên `/news` và trang chủ (ticket D13).
