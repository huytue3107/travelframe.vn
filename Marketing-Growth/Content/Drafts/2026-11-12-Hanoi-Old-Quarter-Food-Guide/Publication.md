---
title: Where to Eat in Hanoi Old Quarter — website publication
owner: Marketing-Growth
status: Published
published_date: 2026-11-12
timezone: Asia/Ho_Chi_Minh
node: 124
url: https://travelframe.sidevn.com/news/where-to-eat-hanoi-old-quarter
---

# Đã xuất bản

[Where to Eat in Hanoi Old Quarter: 12 Local Spots with Addresses (2026)](https://travelframe.sidevn.com/news/where-to-eat-hanoi-old-quarter)

Rocky duyệt trong chat 12/11/2026: chạy OpenSEO ("Q1: có") và "cứ đăng trước rồi thay sau" (ảnh Commons, thay bằng ảnh tự chụp sau). Claude tạo node trong built-in browser (phiên đăng nhập admin sẵn có) và bấm Save.

## Cấu hình node 124

- Title/H1: Where to Eat in Hanoi Old Quarter: 12 Local Spots with Addresses (2026)
- SEO title: Where to Eat in Hanoi Old Quarter: 12 Best Food Spots (+ " | TravelFrame Vietnam")
- SEO description: bản trong `Page-Copy.md` (159 ký tự)
- Kicker: Food · Category: Food (6) · Ngôn ngữ en · **Tắt** tự dịch VI (giống node 116/117)
- Body: Full HTML. Alias `/news/where-to-eat-hanoi-old-quarter` (tắt pathauto)
- Main image: fid 968 `2026-11/where-to-eat-hanoi-old-quarter-bun-cha` (ảnh bún chả Hàng Mành, CC BY-SA 4.0), có alt
- 9 ảnh inline tải qua endpoint CKEditor5 vào `inline-images/travelframe-oq-food-*.jpg` (nguồn Wikimedia Commons, credit trong figcaption; xem `Photo-Plan.md`)
- Revisions: (1) 02:59 tạo bài; (2) 03:00 lần sửa bảng đầu không ăn (editor ghi đè textarea, nội dung không đổi); (3) sửa bảng mobile: 4 cột + bọc `overflow-x:auto`. Rollback: Revisions của node 124.

## Bằng chứng (curl không cookie, 12/11/2026)

- HTTP 200. Title `Where to Eat in Hanoi Old Quarter: 12 Best Food Spots | TravelFrame Vietnam`. Meta description đúng. Canonical = URL bài. Không có meta robots noindex. Không markup admin.
- og:image `2026-11/where-to-eat-hanoi-old-quarter-bun-cha.webp`.
- 1 H1, 10 H2, 18 H3, 1 bảng (4 cột), 9 figcaption, 11 link Google Maps.
- 9/9 ảnh inline trả 200. 10/10 link nội bộ trả 200.
- Có trong `/sitemap.xml`.
- Viewport 375px: trang không tràn ngang; bảng rộng 355px trong khung 335px, cuộn ngang được.

## Giới hạn

- Ảnh là Wikimedia Commons, phần lớn cũ (2007–2017); chỉ Đắc Kim, Café Giảng, Miến lươn là ảnh tại quán. Thay theo shot list `Photo-Plan.md`.
- Giá/giờ là desk research 12/11, chưa kiểm thực địa (xem `Sources-And-Claims.md`).
- Không thêm link vào từ node 105, 65 và 6 bài C4 lẻ: Rocky trả lời "không cần" (chat 12/11).
- Published không có nghĩa là đã index.
- Có thể vẫn hiện khối template "Book a food tour" và vấn đề listing `/news` (ticket D13), giống các bài News khác.
- Body live là nguồn chuẩn: bảng tóm tắt trên site đã rút còn 4 cột (Spot, Dish, Address, Price) so với 6 cột trong Page-Copy.md và Publish-Body-Final.html.

## Gửi index (12/11/2026, Rocky duyệt "Q2: ok")

- **Google Search Console** (property `https://travelframe.sidevn.com/`): URL Inspection trước khi gửi: "URL không nằm trên Google", "Google không xác định được URL" (chưa phát hiện qua sitemap). Bấm Yêu cầu lập chỉ mục → hộp thoại "Đã yêu cầu lập chỉ mục" (URL đã vào hàng đợi ưu tiên thu thập).
- **Bing Webmaster Tools** → URL Submission: gửi 1 URL, thông báo "Success: URL submitted Succesfully"; danh sách hiện "Today at 10:12". Quota trước khi gửi: 100/ngày.
- Kiểm lại sau 3–7 ngày: URL Inspection GSC và `site:` trên Bing/Yahoo.

## Việc tiếp theo

- Ảnh tự chụp: Rocky nói "thời gian tới" (chưa có lịch). Shot list ở `Photo-Plan.md`.
