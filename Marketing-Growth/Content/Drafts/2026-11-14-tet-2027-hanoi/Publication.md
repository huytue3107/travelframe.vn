---
title: Tet 2027 in Hanoi — website publication
owner: Marketing-Growth
status: Published
published_date: 2026-11-14
timezone: Asia/Ho_Chi_Minh
node: 135
url: https://travelframe.sidevn.com/news/tet-in-hanoi
---

# Đã xuất bản

[Tet 2027 in Hanoi: Dates, What's Open and What to Do](https://travelframe.sidevn.com/news/tet-in-hanoi)

Rocky duyệt trong chat 14/11/2026 ("Đăng bài") cho câu hỏi "Đăng bài Tết (bản đăng sớm, kèm 4 ảnh) lên
website?". Claude tạo node trong built-in browser (phiên admin sẵn có) và bấm Save khoảng 10:54 (giờ Việt Nam).

Bản đã đăng là **bản đăng sớm**: các kế hoạch Tết 2027 của Hà Nội chưa công bố, bài ghi rõ điều đó và dẫn
số liệu 2026. Ảnh là **ảnh tạm** từ Pexels và Wikimedia Commons, chờ ảnh tự chụp dịp Tết 2027.

## Cấu hình node 135

- Title/H1: Tet 2027 in Hanoi: Dates, What's Open and What to Do
- SEO title: Tet 2027 in Hanoi: Dates, What's Open & What to Do (+ " | TravelFrame Vietnam")
- SEO description (150 ký tự): Tet 2027 falls on Saturday, February 6. See the holiday dates, what stays open
  in Hanoi, flower markets, fireworks, etiquette and a simple 4-day plan.
- Kicker: Tet guide · Category: Travel Tips (5) · Ngôn ngữ en · **Tắt** tự dịch VI · không gắn menu
- Summary: "Tet 2027 falls on Saturday, February 6. What stays open in Hanoi, where to find the flower
  markets, and how to plan the week around the holiday."
- Body: Full HTML, alias thủ công `/news/tet-in-hanoi` (tắt pathauto). Bản body đã đăng:
  [Publish-Body-Final.html](Publish-Body-Final.html), sha256 `a28a81e205456c1b…`, 15.010 ký tự. Trước khi bấm
  Save đã đọc lại từ trình soạn thảo: phần chữ trùng khớp file (bỏ qua khoảng trắng), đủ 3 figure, 1 bảng, 5 link.
- Revision log: "Desk-checked 14 Nov 2026; 2027 event plans not yet announced; temporary Pexels/Commons
  photos pending own shoot."
- Rollback: tab Revisions của node 135, hoặc bỏ chọn Published.

## Ảnh trên site

| Vị trí | File trên site | Kích thước | Dung lượng | sha256 (16 ký tự đầu) | Nguồn và giấy phép |
|---|---|---|---|---|---|
| Main image (fid 1033), dùng cho og:image và thẻ listing | `2026-11/tet-in-hanoi-cover.webp` | 1200×630 | 186.736 byte | `d04ba21e4bbbcf92` | Pexels 36399884, Ama Journey, Pexels License |
| Mục Flower markets | `inline-images/tet-in-hanoi-peach-trees-motorbikes.jpg` (uuid 288de8de-…) | 1440×973 | 575.926 byte | `f695509227e88e8f` | Pexels 36399889, Ama Journey, Pexels License |
| Sau danh sách chợ hoa (Nhat Tan) | `inline-images/tet-in-hanoi-nhat-tan-peach-blossom.jpg` (uuid db10c7cf-…) | 1280×960 | 608.638 byte | `997b89e654d0cf48` | Commons, Viethavvh, public domain |
| Mục Calligraphy | `inline-images/tet-in-hanoi-calligrapher-temple-of-literature.jpg` (uuid 8a01c211-…) | 1280×965 | 261.268 byte | `7d6856648a6edd79` | Commons, Hoangvantoanajc, CC0 |

Khác với file trong `assets/web/`:

- **Ba ảnh inline lên site ở định dạng JPEG, không phải WebP.** Cổng upload ảnh của CKEditor trên site chỉ nhận
  jpeg/png/gif (WebP bị trả HTTP 422).
- Ảnh Nhật Tân và ảnh ông đồ trên site là đúng file gốc trong `assets/commons/` (trùng checksum).
- Ảnh bìa và ảnh xe máy chở đào được xử lý lại ngay trong trình duyệt từ ảnh gốc Pexels, cùng thông số cắt và
  cùng 3 vùng làm mờ biển số như bản trong `assets/web/`, nên **không trùng từng byte** với file cục bộ. Đã mở
  lại hai file trên site: băng rôn nằm trọn khung bìa và không còn hai người ở mép phải; 3 biển số không đọc được.
- Alt ảnh bìa đã nhập ở trường Main image; ba ảnh inline có alt và chú thích kèm credit; credit ảnh bìa nằm ở
  dòng "Cover photo" cuối bài.

## Bằng chứng (14/11/2026)

- curl ẩn danh: HTTP 200. Title `Tet 2027 in Hanoi: Dates, What's Open & What to Do | TravelFrame Vietnam`.
  Meta description đúng. Canonical = URL bài. Không có meta robots noindex. og:type article, og:image = ảnh bìa (200).
- 1 H1, 14 H2 (13 trong body + 1 khối template), 10 H3, 1 bảng bọc `overflow-x:auto`, 3 figure và 3 figcaption.
- 3 ảnh inline và ảnh bìa: HTTP 200. 5 link nội bộ trong bài: HTTP 200.
- Có dòng Last checked, dòng ký tên, kicker; 0 thẻ `[VERIFY]`; không nhắc Train Street.
- `/node/135` chuyển 301 về alias. Có trong `/sitemap.xml`.
- Viewport 375px: trang không tràn ngang; bảng 335px vừa khung 335px; 3 ảnh tải đủ, hiển thị rộng 335px.
- Trang `/news` khi gọi không qua cache: bài đứng đầu danh sách, thẻ bài có ảnh bìa.

## Giới hạn đã thấy

- **Listing `/news` (ticket D13):** bản cache của `/news` cho khách (x-drupal-cache HIT, tạo 13/11) chưa có bài
  mới; trang chủ cũng chưa có. Chưa xoá cache site vì đó là thao tác trên hệ thống live, cần Rocky duyệt.
- **Khối CTA của theme cuối bài:** tiêu đề "Want to taste it yourself?", nút WhatsApp với câu đặt private tour
  và nút See tours. Khối này cũng có ở bài News khác đã kiểm (bài Hang Ma Christmas); nó không khớp chủ đề Tết.
- Hero của trang bài dùng ảnh nền template (nhà thờ), không dùng ảnh bìa, giống các bài News khác.
- Thẻ hreflang `vi` trỏ tới `/news/tet-in-hanoi?lang=vi`. URL đó trả HTTP 200, `lang="vi"`, canonical tự trỏ,
  nhưng nội dung vẫn là tiếng Anh vì đã tắt tự dịch. Bài `international-food-hanoi` cũng có thẻ và URL kiểu này.
- JSON-LD Article của theme chỉ có name, description, url, provider; thiếu headline, datePublished, image.
- Lúc đăng chưa có trang nào khác trên site link tới bài này (đã kiểm 4 trang liên quan: 0 link). Đã thêm link từ
  3 trang lúc khoảng 13:00 cùng ngày, xem mục Link nội bộ.

## Gửi index

Rocky duyệt trong chat 14/11/2026 ("Gửi URL bài Tết lên Google Search Console và Bing để lập chỉ mục đi").
Claude gửi khoảng 11:05 (giờ Việt Nam) trong built-in browser, bằng phiên đăng nhập sẵn có của hai công cụ.

| Nơi gửi | Trước khi gửi | Kết quả |
|---|---|---|
| Google Search Console, property `https://travelframe.sidevn.com/`: Kiểm tra URL → Yêu cầu lập chỉ mục | "URL không nằm trên Google", "Google không xác định được URL" (OpenSEO `inspect_urls` cũng trả "URL is unknown to Google") | Sau bước kiểm tra trang đang hoạt động, hộp thoại "Đã yêu cầu lập chỉ mục": "URL đã được thêm vào hàng đợi ưu tiên thu thập dữ liệu" |
| Bing Webmaster Tools → URL Submission | URL chưa có trong danh sách đã gửi (60 dòng) | "Success: URL submitted Succesfully"; URL đứng đầu danh sách, ghi "Today at 11:05"; hạn mức ngày còn 99/100 |
| IndexNow (OpenSEO `submit_indexnow_urls`) | File khoá `df54ec0e2916426d9d891ebc93ebf940.txt` ở gốc site trả 404 | Không gửi, vì thiếu file khoá (ticket D12) |

Hai xác nhận trên chỉ cho biết URL đã vào hàng đợi; chưa có bằng chứng Google hay Bing đã lập chỉ mục bài.
Search Console ghi rõ gửi nhiều lần không đổi thứ tự trong hàng đợi, nên không gửi lặp lại.

## Link nội bộ tới bài (14/11/2026)

Rocky duyệt trong chat 14/11/2026 ("Thêm link") cho câu hỏi "Thêm link nội bộ tới bài Tết từ 3 trang liên quan trên
site?"; ba trang đã nêu tên trong tin nhắn trước đó. Claude sửa trong built-in browser (phiên admin sẵn có), bấm
Save khoảng 12:58 đến 13:01 (giờ Việt Nam). Mỗi trang chỉ thêm 1 câu có link `/news/tet-in-hanoi`, không đổi chữ khác.
Revision log của cả ba: "Internal link to /news/tet-in-hanoi (Tet 2027 guide), 14 Nov 2026".

| Node | Trang | Vị trí | Câu thêm (anchor in đậm) |
|---|---|---|---|
| 130 | `/news/new-years-eve-hanoi` | Cuối đoạn trong mục "Don't confuse it with Tết" | For the dates, what stays open and how to plan the week, see our **Tet 2027 in Hanoi** guide. |
| 131 | `/news/vietnam-in-december` | Cuối đoạn "Spending Christmas in Hanoi?" sau danh sách 3 lộ trình | Traveling in February instead? Tết, the Lunar New Year, falls on February 6, 2027. Read **Tet 2027 in Hanoi** for what stays open that week. |
| 104 | `/hanoi-photoshoot` | Cuối đoạn "More ideas in our 15 best photo spots in Hanoi", mục Where we shoot | Visiting over Tết, the Lunar New Year? **Tet 2027 in Hanoi** covers the flower markets and what stays open that week. |

Câu trên trang dịch vụ (node 104) cố ý không ghi TravelFrame nhận chụp dịp Tết, vì phụ thu và giới hạn giờ chụp dịp
Tết chưa chốt mà trang này đang niêm yết giá theo giờ. Câu nhận chụp nằm ở cuối bài Tết.

Body trong trình soạn thảo trước và sau khi sửa (SHA-256 của dữ liệu CKEditor):

| Node | Trước | Sau | Ký tự thêm |
|---|---|---|---|
| 130 | 7.266 ký tự, `de0e59c877435906…` | 7.389 ký tự, `ba4ed5e6f833b402…` | 123 |
| 131 | 7.349 ký tự, `fd13e4fbb7a68fec…` | 7.519 ký tự, `4bce95a83ffc9f7c…` | 170 |
| 104 | 11.280 ký tự, `3d2f518d50c6ac84…` | 11.427 ký tự, `01766c0cb033bb96…` | 147 |

Trước khi Save: dữ liệu editor trùng textarea gốc, chuỗi cần sửa xuất hiện đúng 1 lần, dữ liệu sau `setData` trùng
bản dự kiến, số ký tự thêm khớp. Format Full HTML, Published và Create new revision giữ nguyên.

Kiểm tra ẩn danh sau khi Save (curl, `x-drupal-cache` MISS nên là bản mới): cả ba trang HTTP 200; title, canonical,
meta description, meta robots và số H1 giữ nguyên; mỗi trang có đúng 1 link tới bài Tết; so phần chữ trong `<main>`
với bản trước chỉ khác đúng câu đã thêm. Bản HTML trước/sau lưu ở [internal-links/](internal-links/).

Rollback: tab Revisions của từng node, khôi phục revision ngay trước revision có log trên.

## Việc tiếp theo

- Từ 21/11/2026: kiểm tra trạng thái index của bài (OpenSEO `inspect_urls` cho Google, không tốn credit;
  URL Inspection trong Bing Webmaster Tools cho Bing).
- Gắn tag `page:tet-in-hanoi` cho 3 từ khoá `topic:tet-2027` đã lưu trên OpenSEO (chờ duyệt).
- Khi Hà Nội công bố kế hoạch Tết 2027 (pháo hoa, chợ hoa Hàng Lược, Hội chữ Xuân, phụ thu Grab): cập nhật
  bài và dòng Last checked. Nguồn đối chiếu từng mục ở [sources.md](sources.md).
- Chốt phụ thu hoặc giới hạn giờ chụp dịp Tết (bài hiện không nhắc).
- Thay 4 ảnh tạm bằng ảnh tự chụp theo shot list trong [Photo-Plan.md](Photo-Plan.md).
