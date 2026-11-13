---
title: /hanoi-photoshoot refresh — publication record
owner: Marketing-Growth
status: Published
published_date: 2026-11-13
timezone: Asia/Ho_Chi_Minh
node: 104
url: https://travelframe.sidevn.com/hanoi-photoshoot
---

# Đã xuất bản

[Private Photoshoot in Hanoi with a Local Photographer](https://travelframe.sidevn.com/hanoi-photoshoot), cập nhật khoảng 10:55 ICT ngày 13/11/2026.

Phê duyệt: Rocky trả lời D1 đến D5 và chọn "Đăng ngay" trong chat ngày 13/11/2026 (chi tiết ở [Brief.md](Brief.md)). Phạm vi: chỉ node 104. Không sửa template, form /booking, tour, DNS hay tracking.

## Thao tác trong CMS (node/104/edit, built-in browser, phiên đăng nhập có sẵn)

- Body (Full HTML): thay bằng [Body.html](Body.html). Chuỗi đưa vào editor có SHA-256 `1cebeffceab370ff643e46da44cd01d7d6d4f0e69f331aff9edc55660f5903cf`, khớp file local. CKEditor lưu 9 `figure`, 9 `img`, 9 alt.
- Summary (lead): "Private, candid photoshoots in Hanoi with a local photographer-guide. Three hourly tiers from 30 USD, with routes planned around the light."
- SEO description: "Private Hanoi photoshoot with a local photographer-guide. Candid photos on an Old Quarter walk, from 30 USD/hour. Originals in 24h, edits in 48h."
- SEO title (field này là nguồn của og:title): "Private Photoshoot in Hanoi with a Local Photographer" (trước đó: "Photographer in Hanoi — Private Photoshoot").
- Main image: upload bản sao của `hanna-long-bien-street-style-02_0.webp` (305.940 byte) thành file 1010 `/sites/default/files/2026-11/hanoi-photoshoot-hanna-long-bien.webp`, alt giống ảnh hero.
- Giữ nguyên: Title, kicker, alias `/hanoi-photoshoot`, Published, auto-translate tắt. Có tạo revision, kèm log trỏ về file rollback.

## Bằng chứng public (curl không cookie, 13/11/2026)

- HTTP 200, `x-drupal-cache: MISS` (bản mới, không phải cache cũ).
- `<title>`: Private Photoshoot in Hanoi with a Local Photographer | TravelFrame Vietnam. Meta description và og:title đúng giá trị mới. og:image trả 200 image/webp.
- Canonical `https://travelframe.sidevn.com/hanoi-photoshoot`, không có meta robots noindex, 1 H1.
- JSON-LD description đã đổi theo meta description mới, không còn "$8" hay "No deposit".
- Thân bài: 9/9 ảnh có alt, cả 9 đều trả 200. Toàn trang có 11 ảnh (9 ảnh bài + 2 logo), nên Main image không hiện trùng trong bài.
- Có các chuỗi mới: "30 USD per hour", "60 USD per hour", "99 USD per hour", "within 24 hours", "Recent sessions with Harry", "Lorena, Switzerland", "102 Koncept".
- Không còn chuỗi cũ: "Photo Phone", "210,000 VND", "from $8", "No deposit", "Explorer:", "Complete (most popular)", "Build your estimate".
- Bản `?lang=vi` cũng hiện giá mới (cùng node).
- Mobile 375px (built-in browser, không đăng nhập): không tràn ngang (scrollWidth 375), 9/9 ảnh tải xong và không rộng quá màn hình.

## Index

- Google Search Console, URL Inspection cho `/hanoi-photoshoot`: bấm Request Indexing. Live test chạy xong, Google báo "Đã yêu cầu lập chỉ mục", URL được thêm vào hàng đợi ưu tiên. Lần crawl trước là 20/10/2026.
- Bing Webmaster Tools, URL Submission: danh sách hiện `https://travelframe.sidevn.com/hanoi-photoshoot` "Today at 11:00".

## Giới hạn đã biết

- Template News vẫn thêm khối "Want to taste it yourself? / See tours" và breadcrumb "News". Cần dev (xem Brief).
- Form /booking vẫn tính giá cũ 8/20/50/80 USD và vẫn có trên menu. Rocky chọn đăng trang trước (D1).
- Nguồn (nền tảng, ngày) của 3 đánh giá chưa được ghi trong workspace. Rocky duyệt dùng (D4).
- Đăng xong không có nghĩa là thứ hạng sẽ tăng. Mốc so sánh là vị trí ngày 13/11 trong báo cáo SEO Audit (OpenSEO report 6fcf6e45). Đo lại khoảng 11/12/2026.

## Rollback

Theo mục Rollback trong [Brief.md](Brief.md): dán lại [Current-Live-Body.html](Current-Live-Body.html), khôi phục summary, SEO description, SEO title "Photographer in Hanoi — Private Photoshoot", xóa Main image (file 1010). Hoặc revert về revision trước trong tab Revisions của node 104.
