---
nodes: [151, 152, 153]
urls:
  - "https://travelframe.sidevn.com/news/tran-quoc-pagoda"
  - "https://travelframe.sidevn.com/news/hoan-kiem-lake"
  - "https://travelframe.sidevn.com/news/west-lake-hanoi"
published: "2026-11-20 (tối, ICT)"
approval: 'Rocky trong chat 20/11: "triển khai các bài viết về Hồ Gươm, Chùa Trấn Quốc, Hồ Tây nhé"'
method: "Drupal admin /node/add/news trong built-in browser (phiên admin sẵn có). Body Full HTML qua CKEditor setData; ảnh inline tải qua upload adapter của CKEditor; ảnh cover qua field_tacos_image."
rollback: "Bài mới: unpublish node 151/152/153 tại /node/<id>/edit (bỏ chọn Published). Không xóa."
---

# Publication: 3 bài landmark (Trấn Quốc, Hoàn Kiếm, Hồ Tây)

Nội dung đúng từng chữ như `publish.json` / `bodies/`. Nguồn và giấy phép ảnh: `sources.md`.
Ảnh lấy từ Wikimedia Commons, crop giữa 1440×960 JPEG (inline) và 1200×630 WebP (cover).

| Node | URL | SEO title (+ " \| TravelFrame Vietnam") | Ảnh inline | Cover / og:image |
|---|---|---|---|---|
| 151 | /news/tran-quoc-pagoda | Tran Quoc Pagoda: Hours, Dress Code & Tips | causeway, courtyard, rock-garden | tran-quoc-pagoda-causeway-cover.webp |
| 152 | /news/hoan-kiem-lake | Hoan Kiem Lake Hanoi: Guide & Best Times | turtle-tower, the-huc-bridge, morning-tai-chi | hoan-kiem-lake-turtle-tower-cover.webp |
| 153 | /news/west-lake-hanoi | West Lake Hanoi: Sunset, Cycling & Temples | west-lake-sunset, sunset-trees, truc-bach-lake | west-lake-hanoi-sunset-cover.webp |

Cài đặt chung: ngôn ngữ en, tắt tự dịch sang VI, chuyên mục Travel Tips (5), pathauto tắt với alias thủ công,
trạng thái Published.

## Bằng chứng (curl ẩn danh, 20/11 sau khi lưu)

| Kiểm tra | 151 | 152 | 153 |
|---|---|---|---|
| HTTP | 200 | 200 | 200 |
| Title, canonical, meta description | đúng | đúng | đúng |
| Có trong /sitemap.xml | có | có | có |
| 3 ảnh inline | 3/3 HTTP 200 | 3/3 HTTP 200 | 3/3 HTTP 200 |
| Link nội bộ | tất cả 200 (10) | tất cả 200 (12) | tất cả 200 (9) |
| Tràn ngang ở 375 px | không (375/375) | không | không |
| Admin /admin/content | Published | Published | Published |

## Ghi chú

- Hero của trang tin dùng ảnh nền chung của theme (`hero-desktop.webp`), giống các bài tin khác. Ảnh cover hiện
  ở og:image và thẻ danh sách tin.
- Ba bài liên kết chéo với nhau và với node 92 (15 Hanoi Photo Spots).
