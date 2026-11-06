---
title: OpenSEO audit — travelframe.sidevn.com (keywords, backlinks, site health)
owner: Marketing-Growth
status: Review
created: 2026-10-27
timezone: Asia/Ho_Chi_Minh
source: OpenSEO project b97024a3 (Rocky đăng nhập 27/10), cộng crawl HTML không cookie bằng built-in browser
---

# Kết luận nhanh

1. **Site sạch về kỹ thuật cơ bản, nhưng đang tự nhân đôi nội dung.** 61/61 URL trong sitemap trả 200, không có link nội bộ hỏng, mỗi trang có một H1. Lỗi lớn nhất: mỗi bài có thêm bản `?lang=vi`. Bản này có body tiếng Anh y hệt, nhưng khai báo `lang="vi"`, canonical trỏ về chính nó và hreflang `vi`. Đây là nguồn chính của 38 lỗi trùng title và 42 lỗi trùng meta description. GSC cũng đang ghi nhận impression cho các URL `?lang=vi`.
2. **Gần như chưa có traffic organic không mang thương hiệu.** GSC 28 ngày: 12 click, 176 impression, vị trí trung bình 25. Click nhìn thấy được chỉ đến từ truy vấn thương hiệu "travelframe". Trang dịch vụ `/hanoi-photoshoot` có 18 impression ở vị trí trung bình 25,4 và 0 click.
3. **Không có backlink nào trỏ về `travelframe.sidevn.com`.** Domain gốc `sidevn.com` có 2.837 backlink từ 2.671 domain, gần như toàn bộ là domain spam kiểu "SEO checker", trỏ về trang chủ sidevn.com.
4. **Nhu cầu tìm kiếm ở Mỹ cho ngách "photoshoot" rất nhỏ.** `hanoi photoshoot` 110/tháng, `photographer in hanoi` 20, `hanoi photographer` 20. Lượng tìm kiếm lớn nằm ở cụm thông tin du lịch: `hanoi old quarter` 8.100, `train street hanoi` 4.400, `things to do in hanoi` 4.400, `what to do in hanoi` 1.600.

# 1. Site audit (OpenSEO, 27/10 16:50, 100 trang, không render JS, không Lighthouse; cùng cấu hình với audit 22/10)

| Mức | Vấn đề | Số trang | Ghi chú |
|---|---|---:|---|
| Warning | Duplicate meta description | 42 | Chủ yếu cặp URL / URL?lang=vi; ngày 22/10 là 28 |
| Warning | Duplicate title | 38 | Cặp ?lang=vi, kèm /news, ?page=1/2/3 dùng chung title; ngày 22/10 là 28 |
| Warning | Thin content | 3 | /about (123 từ), /guides (140), /tours?lang=vi (126) |
| Info | Title too long | 65 | Suffix " \| TravelFrame Vietnam" (21 ký tự) đẩy phần lớn title quá 60 ký tự |
| Info | Heading levels skip | 45 | Template/CKEditor nhảy cấp heading |
| Info | Canonicalized | 3 | /news?category=4/5/6 → /news; chủ ý, nhưng các trang lọc Travel Tips/Stories không có URL riêng để rank |
| Info | Meta description too long | 3 | /about (243), /about?lang=vi (246), /ebooks (178) |
| Info | Meta too short / noindex | 1 | /ebooks/resend; noindex là chủ ý |

Không có lỗi mức Error. Thời gian phản hồi trung bình 316 ms.

## Lỗi `?lang=vi` (ưu tiên P0)

Kiểm tra trực tiếp ngày 27/10:

| URL | html lang | H1 / body | canonical | hreflang |
|---|---|---|---|---|
| /news/bun-cha-chan-local-culinary-guide | en | tiếng Anh | chính nó | en / vi=?lang=vi / x-default |
| /news/bun-cha-chan-local-culinary-guide?lang=vi | **vi** | **tiếng Anh y hệt** | **chính nó (?lang=vi)** | như trên |
| /?lang=vi | vi | tiếng Việt thật | chính nó | hợp lệ |

Trang chủ và các trang UI có bản dịch thật. Bài News thì không: bản `?lang=vi` chỉ dịch phần khung giao diện. Google nhận được hai URL cùng nội dung, mỗi URL tự canonical và gắn sai ngôn ngữ.

**Đề xuất cho developer** (cần source Drupal). Brief đầy đủ: [Developer-Brief-Lang-VI.md](Developer-Brief-Lang-VI.md).
- Node nào không có bản dịch VI thật: bỏ hreflang `vi`, và cho `?lang=vi` canonical về URL tiếng Anh (hoặc noindex).
- Chỉ giữ cặp hreflang cho những trang có bản dịch thật.
- Bỏ `?lang=vi` khỏi link nội bộ và sitemap nếu có.

## Crawl bổ sung (HTML không cookie, 61 URL trong sitemap)

- 61/61 URL trả 200, không có redirect. 75 link nội bộ khác đều hoạt động.
- Một H1 trên mỗi trang. Không có noindex ngoài /ebooks/resend.
- **Thiếu alt ảnh:** ảnh hero ở /tours và 7 trang /tour/*; một ảnh ở bài Bat Trang.
- Khối "Book a food tour" của template xuất hiện trên 42 trang, kể cả các bài về photoshoot.
- 3 bài mới (node 110–112) đã có trong sitemap.

# 2. Từ khóa

## GSC (OpenSEO GSC Insights, 28 ngày tới 27/10, mọi quốc gia/thiết bị)

| Chỉ số | Giá trị |
|---|---|
| Clicks | 12 (+200%) |
| Impressions | 176 (+267%) |
| CTR | 6,8% |
| Avg position | 25,0 |
| GA4 sessions / active users / key events | 63 / 15 / 0 |

Truy vấn đáng chú ý (34 truy vấn có dữ liệu):

| Query | Impr | Vị trí | Trang |
|---|---:|---:|---|
| travelframe | 4 (4 click) | 2,0 | / |
| santorini park hanoi | 10 | 4,2 | bài Santorini |
| photographer in hanoi | 9 | 20,7 | /hanoi-photoshoot |
| vside travel | 6 | 10,0 | /tours |
| quan thanh temple | 6 | 74,7 | bài Quan Thanh (?lang=vi) |
| santorini park | 6 | 35,2 | bài Santorini |
| hanoi photoshoot | 3 | 20,7 | /hanoi-photoshoot |
| hanoi photographer | 3 | 28,3 | /hanoi-photoshoot |
| hanoi old quarter what to do / things to do… | 1–3 mỗi biến thể | 74–98 | Old Quarter guide |
| bami bread / bun cha chan | 2 mỗi query | 8,5 / 12,5 | bài ẩm thực |

Trang có impression: trang chủ 24, bài Santorini 34 (cộng 8 cho bản ?lang=vi), /hanoi-photoshoot 18, /about 17, /tours 16, Old Quarter guide 11, bài Bami bread 10. Các URL `?lang=vi` có impression gồm Quan Thanh (9), Santorini (8), Huong Mai (4), cùng nhiều URL khác.

## Volume Mỹ (DataForSEO qua OpenSEO; danh sách Saved Keywords cập nhật 14/10, Keyword Research chạy 27/10)

| Keyword | Volume/tháng (US) | KD | Trang đích hiện tại |
|---|---:|---:|---|
| hanoi old quarter | 8.100 | 13 | Old Quarter guide (vị trí ~36 theo GSC) |
| train street hanoi | 4.400 | 2 | Train Street guide |
| things to do in hanoi | 4.400 | 0 | Chưa có trang riêng (đang map vào complete guide) |
| what to do in hanoi | 1.600 | 0 | Chưa có |
| hanoi or ho chi minh | 590 | 0 | Chưa có |
| hanoi old quarter night market | 210 | 0 | Old Quarter guide |
| vietnam photographer | 170 | 0 | Trang chủ |
| hanoi old quarter map | 170 | 0 | Old Quarter guide |
| hanoi airport to old quarter | 140 | 0 | Chưa có |
| hanoi photoshoot | 110 | 0 | /hanoi-photoshoot |
| things to do in hanoi old quarter / attractions | 110 / 110 | 0 | Old Quarter guide (vị trí 75–98) |
| hanoi walking tour | 90 | 7 | Chưa map rõ |
| photographer in hanoi / hanoi photographer | 20 / 20 | 0 | /hanoi-photoshoot |
| hanoi couple photoshoot, hanoi photography tours, hanoi street photography, hanoi photography spots | 10 mỗi từ | – | Các bài liên quan |

**Từ khóa của các bài mới:** `hanoi night photoshoot`, `hanoi photography tips` và `photography etiquette vietnam` không có trong danh sách gợi ý cho các seed "hanoi photography" và "hanoi photoshoot". Gần như chắc chắn volume dưới 10/tháng ở Mỹ; chưa tra riêng từng từ.

- **Domain Overview (Mỹ):** "Not enough data". DataForSEO chưa ghi nhận từ khóa organic nào cho domain này.
- **Rank Tracking:** project đang có cấu hình "US · Mobile" nhưng chưa có từ khóa nào; còn một cấu hình VN.

# 3. Backlinks (OpenSEO Backlinks, 27/10 16:48)

- `travelframe.sidevn.com` không tra được (lỗi "Enter a valid domain"). Tra `sidevn.com` kèm subdomain:

| Chỉ số | Giá trị |
|---|---|
| Backlinks | 2.837 |
| Referring domains | 2.671 |
| Domain rank | 0 |
| Backlink spam score | 54 |
| Trang được trỏ tới | sidevn.com/ (2.836); "sidevn.com/," (1, link hỏng) |
| Link "best" | acquire.co.in (nofollow); photography1000.com/VN/Hanoi/.../Side-Studio (link hỏng do dư dấu phẩy) |

- 50 referring domain mới nhất (12–21/10/2026) đều là domain spam kiểu SEO checker: marketsseo.com, webseochecker.shop, seopbn.online, buypbn.online…, spam score 60. Đây là spam tự động, không phải link do TravelFrame xây.
- **Không có backlink nào tới subdomain travelframe.**

**Đánh giá:** Google thường tự bỏ qua kiểu spam này, nên chưa cần disavow trừ khi Search Console báo manual action. Vấn đề thực sự là TravelFrame chưa có link thật nào. Gợi ý để Rocky duyệt:
1. Sửa listing photography1000 (đúng URL, hoặc thêm link TravelFrame).
2. Google Business Profile.
3. Hồ sơ trên nền tảng tour hoặc nhiếp ảnh.
4. Hợp tác với homestay/khách sạn khu phố cổ.
5. Guest post trên blog du lịch.

Mọi outreach cần quyền gửi tin. Không mua link.

# 4. Ưu tiên đề xuất

| # | Việc | Owner | Ghi chú |
|---|---|---|---|
| P0 | Sửa canonical/hreflang cho `?lang=vi` của bài không có bản dịch | Dev (source Drupal) | Giảm khoảng 80 cảnh báo trùng lặp, dồn tín hiệu về URL tiếng Anh |
| P1 | Thêm alt cho ảnh hero của tour; rút meta /about, /ebooks; mở rộng /about | Marketing-Growth | Sửa được trong CMS |
| P1 | Rút SEO title về ≤60 ký tự tính cả suffix (65 trang) | Marketing-Growth | Bắt đầu từ /hanoi-photoshoot, Old Quarter guide và 3 bài mới |
| P1 | Đổi khối "Book a food tour" theo loại bài (template) | Dev | Vấn đề đã biết |
| P1 | Xây backlink thật đầu tiên (5–10 link liên quan) | Marketing-Growth | Cần Rocky duyệt outreach |
| P2 | Hướng nội dung có volume: nâng Old Quarter guide (8.100), trang "things to do in Hanoi" (4.400), "hanoi airport to old quarter" (140), "hanoi or ho chi minh" (590), có góc chụp ảnh và CTA về /hanoi-photoshoot | Marketing-Growth | Thay cho các ngách volume ≈0 |
| P2 | Thêm ~15 từ khóa vào Rank Tracking cấu hình US | Marketing-Growth | API trả phí, cần Rocky duyệt |

# Chi phí và phạm vi

Rocky yêu cầu trực tiếp. Đã chạy:
- 1 Site Audit, 100 trang
- 1 tra Backlinks (sidevn.com), 1 tra cho travelframe.sidevn.com bị lỗi
- 3 Keyword Research (US): hanoi photography, hanoi photoshoot, things to do in hanoi
- 1 Domain Overview (US)

Giao diện không hiển thị chi phí cụ thể. Không bật tracking, không lưu keyword mới, không sửa website.

# 5. Cập nhật 27/10 sau khi Rocky duyệt

- **Q1:** Developer brief đã viết: [Developer-Brief-Lang-VI.md](Developer-Brief-Lang-VI.md). Phân loại 12 trang có bản dịch thật, 42 trang không có, 7 trang tour dịch dở.
- **Q2:** Đã thêm 15 từ khóa vào OpenSEO Rank Tracking, cấu hình `travelframe.sidevn.com · US · Mobile · Manual` (tối đa $0,20 mỗi lần check):
  - hanoi photoshoot, photographer in hanoi, hanoi photographer, vietnam photographer, private hanoi photo tour, hanoi couple photoshoot
  - hanoi old quarter, things to do in hanoi old quarter, hanoi old quarter attractions, hanoi old quarter map, hanoi old quarter night market
  - things to do in hanoi, what to do in hanoi, train street hanoi, hanoi airport to old quarter
  
  Lần check đầu chạy 27/10 khoảng 17:00. UI hiện "15/15" nhưng chưa trả vị trí ở lần đọc cuối. Chế độ Manual: không tự chạy định kỳ.
- **Q3:** Bản nâng cấp Old Quarter guide để review: [Drafts/2026-10-27-Old-Quarter-Guide-Upgrade](../../Content/Drafts/2026-10-27-Old-Quarter-Guide-Upgrade/Brief.md). Đã chạy thêm 1 Keyword Research và 1 SERP Analysis cho "hanoi old quarter" (US).
