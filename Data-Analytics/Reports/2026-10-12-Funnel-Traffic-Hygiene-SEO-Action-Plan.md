# Phương án xử lý: đứt phễu social → website, traffic nội bộ, title trang chủ

*Lập 12/10/2026 09:45 · **Draft chờ Rocky duyệt** · Owner: Data-Analytics (phối hợp Marketing-Growth, Technology-Automation, Sales-CRM)*
*Nguồn: GA4 property 552867189 (MCP chỉ-đọc), Meta Graph API (MCP chỉ-đọc), curl kiểm tra live `travelframe.sidevn.com` lúc 09:37–09:41. Tuần này = 05–11/10, tuần trước = 28/09–04/10.*

> Mọi thay đổi live (GA4 admin, GTM, Drupal, ManyChat, bio, quảng cáo) cần Rocky phê duyệt rõ trước khi làm.

---

## 0. Ba điểm cần đính chính so với báo cáo ngày 12/10

| Nhận định cũ | Kiểm tra lại | Kết luận |
|---|---|---|
| "Trang chủ có 2 thẻ title, hại SEO" | Live `/`, `/home`, `/index.php`, `/?utm_source=x` đều chỉ trả **1** `<title>`: *Private Hanoi Photo Tours & Vacation Photography*. Không có JS đổi title. | Không phải lỗi trùng title. Title đã được **đổi** trong kỳ 30 ngày; GA4 tách 1 URL thành 2 dòng theo `pageTitle`. Tác động SEO thấp. |
| "/travelframe-admin chiếm 299 lượt xem (≈15%)" | 299 chỉ cộng 6 dòng admin đầu. Cộng đủ admin + `/login` trong top 40: **427 lượt (≈21%)**. Thêm các trang 1 người dùng nhưng nhiều lượt (nghi test nội bộ): `/digital-tour` 29, `/tour/hanoi-pho-tour` 33, `/tour/food-tour` 11, `/checkout` 8, `/ebooks` 8, `/ebooks/vietnam-with-a-local-sense` 8 = 97. | Traffic nội bộ khoảng **21–26%** lượt xem 30 ngày, nhiều hơn mức đã báo. |
| "IG báo bấm link profile = 0 → số Meta không đáng tin" | Định nghĩa API: `profile_links_taps` = tap vào **địa chỉ, nút gọi, email, nút nhắn tin**. Không đo link website trong bio. | Số 0 đúng định nghĩa. Click bio phải đo bằng GA4 (`instagram / bio`). |

---

## 1. Social tăng, website giảm: chẩn đoán

### 1.1 Số liệu phễu

| Bước | Tuần trước | Tuần này | Thay đổi |
|---|---|---|---|
| IG reach | 47.483 | 104.775 | +121% |
| IG profile visits | 362 | 677 | +87% |
| Tỷ lệ reach → profile | 0,76% | 0,65% | giảm nhẹ |
| Phiên web từ Instagram (ig/social + instagram/bio + instagram.com + l.instagram.com) | 30 | 9 | **−70%** |
| **Tỷ lệ profile → website** | **8,3%** | **1,3%** | **giảm 6 lần** |
| Bài đăng Facebook (API, tuần trước tính từ 30/09) | ≥34 | 16 | −53% |
| Phiên web từ Facebook (mọi nguồn) | 44 | 25 | −43% |
| Trong đó nút CTA Page (`facebook / page_button`) | 6 | 14 | **+133%** |
| Direct (người dùng) | 43 | 18 | −58% |
| Tổng phiên social → web | ~80 | ~36 | −55% |

### 1.2 Nguyên nhân (xếp theo mức tác động)

1. **Rò rỉ lớn nhất nằm ở bước profile → website (8,3% → 1,3%).** Profile vẫn được ghé nhiều hơn gấp đôi. Bio hiện ghi `➡️ DM "PHOTO" to plan your session`; link bio (`tinyurl.com/travelframe-tours` → `/tours?utm_source=instagram&utm_medium=bio…`) vẫn đúng nhưng không được kêu gọi bấm. Người đến từ reel viral đọc bio, không có lý do để mở web.
2. **Khán giả của reel viral không phải người đang lên kế hoạch đi Hà Nội.** Reel quán cà phê là nội dung giải trí, reach toàn cầu. Reach → profile không tăng theo reach (0,76% → 0,65%). Thêm reach giải trí sẽ không tự ra phiên web.
3. **Facebook đăng ít đi một nửa** (≥34 → 16 bài) và không bài nào có link trong caption ở cả hai tuần. Nguồn Facebook duy nhất tăng là nút CTA trên Page, nghĩa là người có ý định thật vẫn tìm đường sang web khi có nút rõ.
4. **Link trong comment Instagram không bấm được** (IG không tạo hyperlink trong comment). Các link `utm_medium=comment_reply` cho Instagram trong `Marketing-Growth/Guidelines/2026-10-03-TravelFrame-UTM-Tagging-Guide.md` vì vậy không tạo phiên. GA4 tuần này không có phiên nào mang `comment_reply`.
5. **Direct giảm 58%:** gồm traffic nội bộ giảm và link gửi qua DM/Messenger không gắn UTM (dark social).

> [!NOTE]
> Theo `Executive/Current-State.md`, Instagram DM là kênh chuyển đổi chính. Website giảm chưa đủ để kết luận phễu hỏng. Cần đếm số DM "PHOTO" và lead từ reel viral; MCP hiện chưa đọc được inbox Instagram.

### 1.3 Phương án

**A. Nối lại cầu trong 48 giờ (ưu tiên P0)**

| # | Việc | Owner | Trạng thái (13/10) |
|---|---|---|---|
| A1 | Sửa bio IG thành 2 CTA: `DM "PHOTO"` **và** `📅 Tours & prices ↓ link`. | Marketing-Growth | **Đã hoàn thành Live** (13/10 lúc 10:24) |
| A2 | Story ngay hôm nay: chia sẻ lại reel quán cà phê + **link sticker** tới `/tours?utm_source=instagram&utm_medium=story&utm_campaign=20261012-cafe-viral&utm_content=link_sticker`. | Marketing-Growth | Đã sẵn sàng asset tại `Drafts/2026-10-13-Social-Bridge-And-Funnel-Remediation-Assets.md` |
| A3 | Reel nối tiếp "Where is this café? / Dance with us on a Hanoi photo walk": nối khoảnh khắc viral với sản phẩm photo walk; CTA comment `PHOTO`. | Creative-Production | Đã sẵn sàng kịch bản chi tiết tại `Drafts/` |
| A4 | Kiểm tra flow ManyChat cho keyword `PHOTO`: tin trả lời phải chứa link UTM `utm_medium=dm` tới `/tours` hoặc `/booking`. | Sales-CRM | **Đã hoàn thành** (Cập nhật Playbook & Ready Scripts ngày 13/10) |
| A5 | Bản Facebook của reel viral: comment ghim có link UTM (FB cho bấm link trong comment), `utm_medium=comment_pin`. | Marketing-Growth | **Đã hoàn thành Live** (Comment ID `122117244915479755_1415967734046303`) |
| A6 | Cập nhật UTM guide: bỏ link `comment_reply` cho Instagram, thay bằng "mời DM", vì link trong comment IG không bấm được. | Marketing-Growth | **Đã hoàn thành** (Cập nhật `LIB-20261003-UTM-LINKS` ngày 13/10) |

**B. Phục hồi volume và chất lượng (ngày 3–14)**

- Đưa lịch Facebook về ≥4 bài/ngày như tuần trước, trong đó ít nhất 1 bài/ngày có đích web (link comment ghim hoặc nút CTA).
- Mỗi reel giải trí đi kèm 1 nội dung tiện ích có đích web (cẩm nang quán cà phê Hà Nội, 15 photo spots) để giữ người có ý định đi.
- Retarget người đã xem reel viral: `DEC-20261009-WARM-PHOTO-DM` đã duyệt ngân sách warm 90.000 VND/ngày nhưng **chưa kích hoạt live**. Tệp đề xuất: IG/FB video viewers 50% của reel quán cà phê + người tương tác 30 ngày. Kích hoạt cần Rocky xác nhận các điều kiện trước chạy trong DEC.

**C. Đo lường (Technology-Automation + Data-Analytics)**

- Bật key event GA4: `generate_lead` (submit form `/booking`), `begin_checkout` (`/checkout`), `click_dm` (nút Messenger/WhatsApp/IG), `file_download` (PDF).
- Báo cáo phễu tuần cố định: reach → profile visits → phiên web theo `utm_medium` → `generate_lead` → booking xác nhận. Bổ sung số DM "PHOTO" do Sales-CRM đếm tay cho đến khi có API.

**KPI 14 ngày (đề xuất)**

| Chỉ số | Hiện tại | Mục tiêu |
|---|---|---|
| Phiên social → web / tuần | ~36 | ≥80 (tuần 1), ≥120 (tuần 2) |
| IG profile → website | 1,3% | ≥5% |
| Phiên `utm_medium=story` / tuần | 0 | ≥20 |
| Key event `generate_lead` | chưa đo | có số đo từ ngày 15/10 |

---

## 2. Làm sạch traffic: nội bộ và Tag Assistant

### 2.1 Quy mô

| Nguồn nhiễu | 30 ngày | Tuần này | Tuần trước |
|---|---|---|---|
| Lượt xem `/travelframe-admin*` + `/login` | ≥427 (≈21%) | 142 (≈28%) | 162 (≈25%) |
| Trang nghi test nội bộ (1 user, nhiều lượt) | ~97 | — | — |
| Phiên `tagassistant.google.com / referral` | 93 (1 user, ≈18% phiên) | 20 | 29 |

Bỏ admin + `/login`, lượt xem công khai ước tính: tuần trước ~483, tuần này ~365 (−24%). Mức giảm thật của lượt xem công khai nhỏ hơn con số −21%/−55% thô, nhưng vẫn là giảm.

### 2.2 Phương án (xử lý tại nguồn trước, lọc GA4 sau)

| # | Việc | Nơi làm | Lý do |
|---|---|---|---|
| T1 | **Không tải GTM trên trang quản trị và với user đăng nhập.** Site chạy Drupal (`x-drupal-cache`), GTM `GTM-MKLJQNBG`. Trong module Google Tag: thêm điều kiện Request path loại `/travelframe-admin*`, `/login`, `/user*`; điều kiện Role loại administrator/editor. | Drupal admin | Chặn tại nguồn, không phụ thuộc IP. Rocky và team thường dùng IP động/4G nên lọc IP sẽ sót |
| T2 | Trong GTM, thêm trigger exception cho tag GA4: `Page Path matches RegEx ^/(travelframe-admin\|login\|user)`. | GTM | Lớp dự phòng nếu T1 chưa làm được |
| T3 | GA4 Admin → Data streams → Configure tag settings → **Define internal traffic**: thêm IP văn phòng/nhà cố định (nếu có) → `traffic_type=internal`. | GA4 | Lọc test trên trang công khai (booking, checkout) |
| T4 | GA4 Admin → **Data filters**: bật `Internal traffic` và `Developer traffic` ở chế độ **Testing** 48 giờ, kiểm tra bằng dimension "Test data filter name", sau đó chuyển **Active**. | GA4 | Developer filter loại phiên debug mode của Tag Assistant |
| T5 | GA4 → Configure tag settings → **List unwanted referrals**: thêm `tagassistant.google.com`. | GA4 | Ngăn Tag Assistant đè nguồn của phiên thật |
| T6 | Thêm `Disallow: /travelframe-admin` và `Disallow: /login` vào `robots.txt` (hiện chỉ có `Allow: /`). | Drupal | Giảm khả năng bot crawl khu quản trị |
| T7 | Báo cáo lịch sử: Data filter GA4 **không áp dụng ngược**. Đến khi có dữ liệu sạch, mọi báo cáo dùng segment loại `pagePath` bắt đầu bằng `/travelframe-admin` hoặc `/login` và loại source `tagassistant.google.com`. Đề xuất thêm tham số lọc chỉ-đọc vào MCP GA4. | Data-Analytics / Technology-Automation | Không thêm chức năng ghi vào MCP |

**Kiểm tra sau khi làm:** mở trang admin trong khi xem GA4 Realtime. Nếu không có pageview admin nào và tỷ lệ admin trong lượt xem về <3% sau 7 ngày thì đạt.

---

## 3. Title trang chủ và các rủi ro SEO thật

### 3.1 Title trang chủ (rủi ro thấp)

- GA4 30 ngày: title cũ *Private Hanoi Tours with Photo & Video Keepsakes* 205 lượt, title mới *Private Hanoi Photo Tours & Vacation Photography* 164 lượt. Tuần trước title cũ còn 18 lượt, tuần này 10 lượt (2 user), cho thấy đã chuyển gần hết.
- 10 lượt còn lại nhiều khả năng do tab mở lâu hoặc cache LiteSpeed/Drupal cũ.

**Việc cần làm:**
1. Purge cache LiteSpeed + Drupal một lần.
2. Google Search Console: URL Inspection `/` → Request indexing; kiểm tra SERP hiển thị title mới sau 3–7 ngày.
3. Báo cáo GA4 nhóm theo `pagePath`, không theo `pageTitle`, để tránh tách đôi trang khi đổi title (cũng xảy ra với `/news/hanoi-photographer-tour-guide` và `/tour/spiritual-west-lake-breeze`).

### 3.2 Rủi ro SEO lớn hơn phát hiện khi kiểm tra

| Mức | Vấn đề | Bằng chứng | Đề xuất |
|---|---|---|---|
| P1 | **Ăn thịt từ khóa (cannibalization) – cặp 1** | `/news/hiring-private-photographer-hanoi-what-expect-costs-and-locations-2026-guide` ("Hiring a Photographer in Hanoi: 2026 Rates…") và `/news/hiring-private-photographer-hanoi-rates-routes-and-what-expect-2026-guide` ("Private Photographer in Hanoi: Rates, Routes…"), cả hai tự canonical, cùng trong sitemap | Gộp nội dung vào 1 bài, 301 bài còn lại, bỏ khỏi sitemap |
| P1 | **Cannibalization – cặp 2** | `/news/15-best-photo-spots-hanoi-local-photographers-field-guide-2026` và `/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` | Như trên; cập nhật link UTM trong UTM guide theo URL giữ lại |
| P3 | `/home`, `/index.php` trả 200 trùng trang chủ | Canonical đã trỏ `/` (đúng), `/home` đã 301 | Giữ nguyên |
| P0 | PDF `/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf` (25 lượt/20 người) | Link gửi qua inbox responder | **Đã kích hoạt 301 Live** sang `/news/hanoi-photographer-tour-guide` (Redirect ID: 11, ngày 13/10) |
| P1 | URL gõ thiếu chữ 's' `/ebook` | Khách truy cập ngày 12/10 gặp 404 | **Đã kích hoạt 301 Live** sang `/ebooks` (Redirect ID: 12, ngày 13/10) |

Phần ngôn ngữ (`?lang=vi`) đã có hreflang en/vi/x-default và canonical tự tham chiếu, không cần sửa.

---

## 4. Lịch thực hiện

| Thời điểm | Việc | Cần Rocky duyệt |
|---|---|---|
| Hôm nay 12/10 | T1/T2, T5, T4 (Testing), PDF redirect, A2 story link sticker, A5 comment ghim FB | Có |
| 13–14/10 | A1 bio, A4 ManyChat, A6 sửa UTM guide, purge cache + GSC request indexing, T6 robots | A1, A4, T6: có |
| 15–18/10 | Key events GA4, T4 chuyển Active, gộp 2 cặp bài cannibal + 301, xử lý `/node` | Có |
| 19–26/10 | Lịch FB ≥4 bài/ngày, reel nối tiếp A3, retarget theo DEC-20261009 nếu đủ điều kiện | Kích hoạt ads: có |
| 19/10 và 26/10 | Báo cáo phễu tuần trên dữ liệu đã lọc, so với KPI mục 1.3 | Không |

## 5. Giới hạn

- Chưa đọc được inbox Instagram và số DM "PHOTO" qua MCP, nên chưa đo được nhánh chuyển đổi chính.
- Số bài Facebook tuần trước lấy từ 50 bài gần nhất (từ 30/09), tức là ước tính thấp.
- `ig / social` tuần trước (20 phiên) chưa xác định chắc vị trí link (story sticker hay link IG tự gắn tag); cần đối chiếu lịch story tuần 28/09–04/10.
- Số lượt xem nội bộ chỉ tính trong top 40 trang; con số thật có thể cao hơn.
