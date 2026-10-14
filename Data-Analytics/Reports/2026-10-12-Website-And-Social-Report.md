# Website và social TravelFrame, tuần 05–11/10/2026

*Lập 12/10/2026 09:30 · Draft cho Rocky · Nguồn: GA4 property 552867189 và Meta Graph API qua hai MCP chỉ-đọc trong `Technology-Automation/MCP/`. Tuần này = 7 ngày đến hết 11/10, so với 7 ngày trước đó.*

## Kết luận

**Social tăng gấp đôi nhưng website giảm một nửa.** Reach Instagram tăng 120%, Facebook vượt 2.000 follower, trong khi người dùng website giảm 55%. Social gần như không dẫn người sang website (khoảng 36 phiên/tuần). Số liệu website còn bị nhiễu bởi traffic nội bộ, và file PDF hướng dẫn đang báo "Page not found" với 20 người đã vào.

## 1. Website (GA4)

| Chỉ số | Tuần này | Tuần trước | Thay đổi |
|---|---|---|---|
| Người dùng | 48 | 107 | −55% |
| Phiên | 121 | 210 | −42% |
| Lượt xem trang | 507 | 645 | −21% |
| Thời lượng phiên TB | 7 phút 2 giây | 5 phút 26 giây | +29% |
| Bounce rate | 43% | 42% | gần như không đổi |

30 ngày qua: 208 người dùng, 514 phiên, 2.045 lượt xem.

**Trang được xem nhiều (30 ngày):** `/tours` 206 lượt (54 người), trang chủ 369 lượt qua hai tiêu đề khác nhau, `/news` 159, `/booking` 157 (41 người), `/gallery` 76.

**Nguồn traffic (30 ngày, theo phiên):**

| Nguồn | Phiên | Ghi chú |
|---|---|---|
| Direct | 249 | Lẫn traffic nội bộ |
| tagassistant.google.com | 93 | 1 người dùng, là công cụ kiểm tra tag, không phải khách |
| Google organic | 38 | 8 người |
| Facebook (tất cả nguồn) | 75 | Nút trên Page 20, link trong bài 55 |
| Instagram (tất cả nguồn) | 45 | Link bio chỉ 9 phiên |
| Threads | 6 | |
| Zalo | 3 | |
| Paid social | 1 | |

## 2. Vấn đề website cần sửa

1. **File PDF hướng dẫn hỏng:** `/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf` trả "Page not found", 25 lượt xem từ 20 người. Đây có thể là lead magnet đang được link từ social hoặc DM.
2. **Traffic nội bộ làm sai số:** trang quản trị `/travelframe-admin/...` chiếm khoảng 299 lượt xem (≈15% tổng lượt xem 30 ngày), Tag Assistant chiếm 93 phiên (≈18% số phiên). Cần lọc IP nội bộ và loại trừ referral tagassistant trong GA4.
3. **Trang chủ đang có hai tiêu đề** ("Private Hanoi Tours with Photo & Video Keepsakes" và "Private Hanoi Photo Tours & Vacation Photography"). Nên thống nhất một tiêu đề cho SEO.
4. GA4 MCP chưa trả sự kiện chuyển đổi (gửi form booking), nên chưa đo được booking từ website.

## 3. Instagram

| Chỉ số | Tuần này | Tuần trước | Thay đổi |
|---|---|---|---|
| Reach | 104.549 | 47.483 | +120% |
| Views | 167.730 | 89.614 | +87% |
| Tài khoản tương tác | 5.865 | 1.943 | +202% |
| Tổng tương tác | 7.531 | 3.294 | +129% |
| Bấm link profile | 0 | 0 | — |

- Follower: **489**. Follow mới theo ngày tuần này 128 (ngày 11/10 còn trễ số liệu), tuần trước 54.
- Reel quán cà phê (09/10): **4.069 like, 82 comment** qua API; hai ngày quanh lúc đăng chiếm khoảng 70% reach theo ngày của tuần. Bỏ hai ngày đó ra, reach nền khoảng 6.000–10.000/ngày.
- Bài mới: "How to cross the road" (lịch Hanna bài 1) 15 like sau 12 giờ; taxi POV 17 like; "Survival Vietnamese" 30 like.
- "Bấm link profile" = 0 nhưng GA4 vẫn ghi 9 phiên từ `instagram / bio`, nên chỉ số này của Meta không đáng tin.

## 4. Facebook Page

- Follower **2.016** (1.995 tối 11/10, khoảng 1.751 tối 09/10 theo báo cáo nội bộ).
- Page vẫn đăng dày (60 bài trong 16 ngày). API chưa trả reach từng bài Facebook.

## 5. Việc đã làm trong sprint

| Hạng mục | Trạng thái |
|---|---|
| Lịch 7 reel Hanna | Bài 1 đã đăng 11/10. Agent 3 báo đã sửa caption bài 2–7 trên cả FB và IG ("HANNA CAPTIONS FIXED"); trưởng nhóm chưa kiểm tra độc lập, sẽ đối chiếu bài 2 sau 19:00 ngày 12/10. |
| Comment ghim reel quán cà phê | Agent 3 báo đã đăng và ghim lúc 22:54 ngày 11/10. |
| Lô 5 reel theo công thức viral | Agent 2 đang viết lại (lần đầu 6/10). |
| Story 09/10, Threads 09/10 | Đã đăng. Chưa có số liệu story từng khung qua API. |

## 6. Đề xuất (theo thứ tự)

1. **Sửa hoặc gỡ link PDF hướng dẫn** ngay.
2. **Lọc traffic nội bộ trong GA4** (IP văn phòng/nhà, loại trừ tagassistant, loại trang `/travelframe-admin`). Không có bước này thì mọi số website đều cao hơn thực tế.
3. **Kéo người từ social sang website:** reel đang viral không có đường dẫn. Thêm CTA rõ trong caption hoặc comment ghim trỏ tới `/tours`, dùng link UTM riêng cho từng chiến dịch.
4. **Thống nhất tiêu đề trang chủ.**
5. **Bật đo sự kiện booking** trong GA4 (form submit trên `/booking`) để biết social có tạo đơn không.

## Ghi chú về báo cáo khác cùng ngày
`2026-10-12-TravelFrame-Morning-Performance-Update.md` (không do trưởng nhóm lập) ghi Instagram "duy trì đều đặn trên 60.000 lượt tiếp cận mỗi ngày". Số liệu API không ủng hộ: reach theo ngày từ 28/09 đến 11/10 dao động 3.418–50.821, chỉ 1 ngày vượt 50.000.

## Cập nhật 13/10: đã sửa trên site live (Rocky duyệt)
- **PDF 404:** thêm redirect 301 trong Drupal (`/admin/config/search/redirect`): `/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf` → `/news/hanoi-photographer-tour-guide`. Kiểm tra curl: HTTP 301, location đúng. *Sửa lại cùng ngày:* bài đích gần như trống, nên đổi đích sang `/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026` (đã kiểm tra 301).
- **Cache:** đã chạy Clear all caches (Drupal). Live `/` trả 1 title: "Private Hanoi Photo Tours & Vacation Photography | TravelFrame Vietnam".
- **Đính chính:** trang chủ không có 2 title; GA4 tách dòng vì title được đổi trong kỳ.
- **GTM (Version 5, publish 13/10 10:51, rollback = Version 4 "v2 - TravelFrame Tracking"):**
  - Thêm trigger `EX - Admin, Login, User pages` (Custom Event `.*` regex, Page Path khớp `^/(travelframe-admin|login|user)`), gắn làm ngoại lệ cho cả 5 tag.
  - **Lỗi gốc của việc không đo được booking:** 4 tag sự kiện (`GA4 - begin_checkout`, `GA4 - view_tour`, `GA4 Event - Booking Funnel`, `GA4 Event - Contact Click`) gửi tới Measurement ID gõ sai `G-0GJLGH771Q` / `G-OGJLGH771Q`; ID đúng của stream là `G-0GJGLH771Q`. Đã sửa cả 4. Key event `purchase` (đẩy khi gửi booking thành công, có `transaction_id`) trước đây "không phát hiện dữ liệu" vì lỗi này.
  - Kiểm tra live: `/travelframe-admin` không còn request GA; `/tours` gửi `g/collect` tới `G-0GJGLH771Q`.
- **GA4:** thêm unwanted referral `tagassistant.google.com` (Google tag settings); tạo data filter `Developer Traffic` trạng thái Testing. Filter `Internal Traffic` đã ở Testing từ trước (chưa khai IP nội bộ). Chuyển Active sau 48 giờ nếu số liệu ổn.
- **Redirect (Rocky duyệt 13/10):** `/ebook` → `/ebooks` (301). `/node`: tắt display Page của view core `Frontpage` (giữ feed `/rss.xml`; trang chủ dùng `/home` nên không ảnh hưởng), rồi redirect 301 `/node` → `/`. Kiểm tra curl: `/ebook` 301, `/node` 301 về `/`, `/rss.xml` 200, `/` 200.
- **Gộp sự kiện đếm đôi (GTM Version 6, rollback = Version 5):** tạm dừng `GA4 - view_tour` (trùng `view_tour` site đẩy lên dataLayer, đi qua `GA4 Event - Booking Funnel`) và `GA4 - begin_checkout` (bắn khi click link `/booking`, trùng `begin_booking`; `begin_checkout` thật do site đẩy sau khi khách nhập thông tin). Kiểm tra live trang tour: chỉ còn 1 hit `view_tour`. Tag tạm dừng không xoá, bật lại được. **GTM Version 7 (rollback = Version 6):** thêm biến `dlv - tour_name` và tham số `tour_name` vào `GA4 Event - Booking Funnel`. Kiểm tra live: hit `view_tour` gửi `tour_name=The Spiritual & West Lake Breeze`, `tour_slug=spiritual-west-lake-breeze`.
- **Chưa làm:** `robots.txt` là file tĩnh trên hosting, cần quyền file manager/FTP.
- **Phát hiện thêm:** Drupal báo có bản cập nhật bảo mật (security update) chưa cài.
