---
title: Đăng bài Incense Village Photoshoot: Harry's Film Portraits at Quảng Phú Cầu, node 139
owner: Marketing-Growth
status: Published
date: 2026-11-18
approval: 'Rocky, yêu cầu trực tiếp: "Bảo agent1 viết bài nội dung chuẩn seo đi rồi đăng lên travelframe.sidevn.com", chuyển qua phiên Codex 18/11/2026; phiên Codex xác nhận yêu cầu đó đã phê duyệt việc đăng bài này'
url: https://travelframe.sidevn.com/news/incense-village-photoshoot-hanoi
node: 139
---

# Kết quả

Tạo node 139 bằng form `/node/add/news` trong trình duyệt nhúng Orca, tab `95995ab5-6c66-45d6-8f4c-d457d4583ce8` (phiên biên tập `admin` do phiên Codex mở; không nhập hay đọc credential). Bấm Save lúc **14:29:59 ICT ngày 18/11/2026**; `admin/content` hiện "18 Nov 2026 - 07:29" (giờ UTC).

Trước đó, Chrome local của máy (browser-harness) chỉ là phiên ẩn danh (`/user` chuyển về trang đăng nhập), nên không dùng được để đăng. Chrome này chỉ được dùng để kiểm tra trang public khi không đăng nhập (xem dưới).

## Cấu hình node

| Trường | Giá trị |
|---|---|
| Title (H1) | Incense Village Photoshoot: Harry's Film Portraits at Quảng Phú Cầu |
| SEO title | Incense Village Photoshoot: Harry on Film (41 ký tự; CMS thêm " \| TravelFrame Vietnam", tổng 63) |
| SEO description (145 ký tự) | Harry takes his film camera to Quảng Phú Cầu, the red incense village near Hanoi. Three frames, what to wear and how to plan your own photoshoot. |
| Short summary (144 ký tự) | Harry's film portraits at Quảng Phú Cầu, the red incense village 35 km south of Hanoi: three frames, what to wear and how to plan a shoot there. |
| Kicker, Category | Photography Stories; Stories (giống bài Thin node 110 và áo dài node 136) |
| Ngôn ngữ | en, tắt tự dịch VI, không gắn menu |
| Alias | `/news/incense-village-photoshoot-hanoi` (tắt pathauto) |
| Format, trạng thái | Full HTML; Published |
| Body | [Publish-Body-Final.html](Publish-Body-Final.html), 8.561 ký tự, SHA-256 `6da749b9…9402`. Đã so khớp trong trang trước khi dán: SHA-256 của chuỗi đưa vào editor trùng file. Sau `setData`: 9 H2, 8 H3, 2 ảnh, 17 link, 1 bảng. Source lưu trong form sau khi Save: 8.990 ký tự, SHA-256 `d311a9d6…1b46` (CKEditor thêm thuộc tính; trùng `getData()` trước khi Save) |
| Main image | Tải lên fid 1081 (`incense-village-photoshoot-cover.jpg`, 1200×630, 157.620 byte, SHA-256 `9afd009a…8ab4`), lưu thành fid 1082: `/sites/default/files/2026-11/incense-village-photoshoot-cover.webp`, 107.914 byte (site tự chuyển WebP). Cắt giữa từ ảnh gốc Pexels 6712917 (Quang Nguyen Vinh). Alt: Rows of bright pink-red incense bundles drying in the sun on a village street in Vietnam |
| Revision log | New: incense village photoshoot story with Harry (Rocky asked to publish, relayed by Codex session, 18/11/2026) |

## Ảnh

Chi tiết trong [Photo-Plan.md](Photo-Plan.md). Bài dùng 2 ảnh Pexels đã có trên site (cùng file và `data-entity-uuid` với node 68) và 1 ảnh bìa Pexels. Không đăng ảnh Harry, ảnh Viktor hay ảnh trong thư mục `Fin FIlm` (quyền và nguồn chưa rõ; 6 PNG mang nhãn "Made with Google AI"). Bài nói rõ đó là ảnh stock và dẫn người đọc sang 3 bài Instagram của Harry để xem ảnh của anh.

# Kiểm tra trang live

Chạy trong Chrome ẩn danh (không đăng nhập: `/node/139/edit` trả HTTP 403, không có thanh quản trị), 18/11/2026 khoảng 14:32 ICT. curl và WebFetch chỉ nhận màn "One moment, please..." của lớp chống bot nên không dùng được.

- HTTP 200. `<title>`: "Incense Village Photoshoot: Harry on Film | TravelFrame Vietnam". Meta description đúng 145 ký tự. Canonical là URL bài. Không có thẻ robots (không noindex). Có JSON-LD `Article`.
- og:title, og:type `article`; og:image là ảnh bìa, HTTP 200 (image/webp, 107.914 byte).
- 1 H1 đúng. 10 H2 (9 trong bài và 1 khối template "Want to taste it yourself?"), 8 H3. Khoảng 1.100 từ. 2 dòng "Pro move:", có câu ký tên. 0 thẻ `[VERIFY]`; không có USD hay giá.
- Link nội bộ (7, đều HTTP 200): node 68 `/news/cam-phu-cau-incense-village-photography-guide`, `/hanoi-photoshoot`, `/news/ao-dai-photoshoot-hanoi`, `/news/vietnam-photoshoot`, `/news/day-trips-from-hanoi`, `/news/hanoi-old-quarter-photoshoot-harry-thin`, `/tours` (khối CTA của template). Link tới node 68 xuất hiện 3 lần trong bài.
- 2 ảnh inline HTTP 200 (329.571 và 399.363 byte). Ảnh dùng `loading="lazy"` nên chưa tải khi tab chạy nền; đã kiểm bằng tải trực tiếp từng file.
- Header: `cache-control: max-age=3600, public`; lần tải kiểm tra thứ hai `x-drupal-cache: HIT` (lần đầu sau Save chưa ghi header).
- Có trong `/sitemap.xml`.
- Viewport 375 px: không tràn ngang (scrollWidth 375); ảnh và bảng rộng 335 px vừa khung.
- Checklist: xem [sources.md](sources.md), mục Checklist, và bảng dưới.

| Mục checklist (Publishing-And-QA) | Kết quả |
|---|---|
| Giá (V-08) | Pass: bài không có giá |
| Train Street | Không áp dụng: bài không nhắc |
| Giọng và chữ ký (V-01, V-02, V-06) | Pass |
| Title tag dưới 65 ký tự | Pass: 63 |
| Meta description 140 đến 155 | Pass: 145 |
| Phân cấp heading | Pass |
| Slug | Pass |
| Canonical | Pass |
| Schema (Rich Results Test) | Chưa chạy; trang có JSON-LD `Article` do CMS thêm |
| Ảnh WebP hoặc AVIF dưới 200 KB, có width và height | Lệch: 2 ảnh inline là JPEG 330 và 399 KB (dùng lại file của node 68; WebP bị lỗi 422 ở cổng upload inline), có `width` nhưng chưa có `height`. Ảnh bìa đạt (WebP 108 KB). Alt có đủ |
| Link WhatsApp và Instagram DM | Pass: link `wa.me/84925148581` giống bài áo dài, trỏ `@travelframe.vn` |
| 3 đến 5 link nội bộ, không 404 | Pass: 6 link khác nhau trong bài, đều 200 |
| Cổng duyệt Rocky | Pass: yêu cầu trực tiếp của Rocky (qua phiên Codex) |

# Giới hạn và điểm cần Harry hoặc Rocky xác nhận

- **Phần film chưa kiểm độc lập.** Bài nói Harry chụp chân dung ở làng, "some of them on film", theo yêu cầu của chủ dự án. Caption Instagram của Harry chỉ có hashtag #Filmlook; chỉ `Fin 05.jpg` có metadata máy quét film. Bài không nêu máy, loại film, lab, giá, hạn giao hay gói film. Harry cần xác nhận trước khi thêm chi tiết.
- Bài không đăng ảnh film nào. Khi Harry và người trong ảnh đồng ý, thêm ảnh theo [Photo-Plan.md](Photo-Plan.md).
- Listing `/news` và trang chủ có thể chưa hiện bài do cache của khách (ticket D13). Xoá cache toàn site cần Rocky duyệt.
- Theme tự thêm khối CTA cuối bài "Want to taste it yourself?" và hreflang `?lang=vi` trả nội dung tiếng Anh. Không phải lỗi của bài.
- Chưa gửi index Google và Bing (cần Rocky duyệt riêng). Chưa thêm link từ node 68 sang bài này (không sửa bài đang chạy khi chưa được yêu cầu).

# Rollback

Bỏ chọn Published tại `/node/139/edit`, hoặc xoá node (cần Rocky duyệt). Node chỉ có 1 revision, nên không có revision cũ để revert.

# Việc tiếp theo

- Harry xác nhận phần film và cung cấp ảnh gốc có consent (tuỳ chọn thêm ảnh vào bài).
- Rocky duyệt gửi index: Google Request Indexing và Bing URL Submission cho `/news/incense-village-photoshoot-hanoi`.
- Cân nhắc một câu link từ node 68 sang bài này (anchor: incense village photoshoot) để tránh hai trang tranh cùng truy vấn; cần Rocky duyệt.
- Kiểm tra lại sau 4 tuần (khoảng 16/12/2026): Search Console truy vấn chứa "incense", và SERP Mỹ "incense village photoshoot".

## Cập nhật gallery 7 ảnh · 18/11/2026, 14:50 ICT

Rocky gửi 7 ảnh `Fin 01–07` và xác nhận người trong ảnh đồng ý cho TravelFrame đăng công khai cả bộ. Gallery nằm trước mục “Why film suits this village”. Ảnh 05 đặt đầu với ghi chú metadata máy quét film; 6 ảnh có dấu hiệu Google AI trong file nguồn hiển thị dưới mục “AI-assisted illustrations”. Sửa câu dẫn về ảnh Pexels để phản ánh gallery đã thêm.

- [Gallery HTML](Gallery-Revision-2026-11-18.html) · [QA và SHA-256 ảnh](../../../../Creative-Production/Review/Incense-Village-Film-Story/qa-2026-11-18.md).
- Trang công khai trả gallery và đủ 7 ảnh qua Jina Reader. Các URL ảnh trả HTTP 200, có alt riêng và chiều rộng/cao, dung lượng dưới 190.000 byte/ảnh. Trình duyệt giải mã đủ 7 ảnh. Viewport 375 px không tràn ngang.
- URL và canonical tiếp tục là `/news/incense-village-photoshoot-hanoi`. Revision trước gallery để rollback: `/node/139/revisions/370/revert`.
