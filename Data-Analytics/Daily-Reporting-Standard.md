# Quy Chuẩn Báo Cáo Hằng Ngày TravelFrame (Daily Reporting Standard)

- **Trạng thái:** Approved theo chỉ đạo trực tiếp của Rocky
- **Ngày ban hành:** 2026-10-22 · **Áp dụng chính thức từ:** 2026-10-23
- **Chủ quản:** Data-Analytics
- **Thời điểm chốt số liệu hằng ngày:** **08:30 ICT**
- **Đường dẫn lưu trữ báo cáo:** `Data-Analytics/Reports/YYYY-MM-DD-TravelFrame-Daily-Performance-Report.md`

---

## 1. Cấu Trúc Báo Cáo Cố Định (Bắt buộc theo đúng thứ tự)

Mọi báo cáo hằng ngày phải tuân thủ nghiêm ngặt 6 phần sau, không tự ý đổi thứ tự hoặc lược bỏ:

```text
1. Tóm tắt (Executive Summary)
2. Phễu doanh số (Revenue & Conversion Funnel)
3. Chỉ số kênh (Channel Performance)
4. Nội dung đã đăng và seed comment (Content & Engagement Ledger)
5. Cảnh báo dữ liệu (Data Limitations & Hygiene)
6. Việc cần làm (Action Items)
```

---

## 2. Tám Quy Tắc Bắt Buộc (The 8 Rules)

### Quy tắc 1: Phễu đứng trước follower & đủ 8 bước bắt buộc
Phần phễu doanh số phải đặt ở vị trí số 2 (trước các chỉ số follower/kênh) và bắt buộc điền đầy đủ 8 tầng chuyển đổi:
1. **Reach Instagram** (số tài khoản tiếp cận trong 24h)
2. **Lượt xem trang cá nhân Instagram** (Profile visits trong 24h)
3. **Lượt bấm link bio Instagram** (Website link taps trong 24h)
4. **Số DM và tin nhắn Messenger hỏi tour** (Inbound qualified/unqualified DMs)
5. **Phiên website** (Sessions trong 24h từ GA4)
6. **Lượt xem `/booking`** (Pageviews trang đặt tour trong 24h)
7. **Số Lead** (Khách để lại thông tin liên hệ / ngày đi / số khách)
8. **Doanh số chuyển đổi** (Báo giá đã gửi, cọc đã nhận, booking xác nhận, doanh thu USD đối soát)

> **Yêu cầu:** Bước nào hệ thống hoặc API chưa đo được tự động thì bắt buộc ghi rõ **"Chưa đo"**, tuyệt đối không được bỏ dòng.

### Quy tắc 2: So sánh cùng khung thời gian & cùng mốc giờ
- Số liệu lấy tại mốc **08:30 ICT**.
- **Chỉ so sánh với:**
  1. Hôm qua cùng giờ (mốc 08:30 ICT ngày liền trước).
  2. Bảy ngày trước cùng giờ (mốc 08:30 ICT của 7 ngày trước đó).
- **Cấm:** Không đưa số liệu chụp buổi tối (ví dụ 19:48 ICT) vào cùng một bảng với số liệu chụp buổi sáng.
- Mỗi bảng và mỗi chỉ số phải ghi rõ khung thời gian: `24 giờ qua`, `theo ngày (hôm qua)`, hoặc `từ đầu tháng (MTD)`.

### Quy tắc 3: Đánh giá trạng thái bằng chữ theo ngưỡng (Xanh / Vàng / Đỏ)
So sánh biến động với mốc 7 ngày trước (hoặc trung bình 7 ngày gần nhất):
- **Xanh:** Khi chỉ số tăng từ **+10% trở lên**.
- **Vàng:** Khi chỉ số dao động trong khoảng **±10%**.
- **Đỏ:** Khi chỉ số giảm từ **-10% trở lên**.
- **Quy tắc cứng:**
  - Bất kỳ chỉ số doanh số/booking nào bằng **0** thì luôn là **Đỏ**.
  - Bất kỳ chỉ số website nào chưa được lọc traffic nội bộ (admin/dev) thì tối đa chỉ được xếp là **Vàng**, không được xếp Xanh.

### Quy tắc 4: Tuyệt đối không dùng từ cảm tính & không dùng emoji để chấm trạng thái
- **Cấm hoàn toàn:** Không dùng các tính từ cảm tính như *"kỷ lục"*, *"bùng nổ"*, *"bứt phá"*, *"vượt trội"*, *"ấn tượng"*, *"rực rỡ"*.
- **Chuẩn mực:** Thay thế bằng con số định lượng kèm mốc so sánh cụ thể. Ví dụ: *"+53% so với 21/10, −39% so với 17/10"*.
- **Quy ước trạng thái:** Dùng văn bản rõ ràng: `[Xanh]`, `[Vàng]`, `[Đỏ]`. Tuyệt đối không dùng emoji (như 🟢, 🟡, 🔴) để phân loại trạng thái.

### Quy tắc 5: Đủ mẫu mới kết luận
- Ngày có **dưới 30 phiên website** thì **không đưa ra kết luận** về thời lượng phiên (average session duration), tỷ lệ thoát (bounce rate) hay hành vi đặt tour sâu.
- Trước khi gọi ai đó là "khách" hoặc "khách hàng", phải lọc và loại trừ traffic nội bộ.
- Người truy cập vào trang `/booking` chỉ được gọi là **"người xem"** (page viewers), tuyệt đối không gọi là "khách mua" hay "prospective buyers".

### Quy tắc 6: Đo từng bài đăng ở mốc 24h và 72h
- Mỗi video Reel xuất bản phải được theo dõi và báo cáo theo các mốc chuẩn:
  - Mốc **24 giờ sau đăng**.
  - Mốc **72 giờ sau đăng**.
- Các chỉ số cần đo cho từng bài: **Reach**, **Views**, **Lượt lưu (Saves)**, **Lượt chia sẻ (Shares)**, và **Lượt bấm link**.
- Không đánh giá chất lượng hay hiệu quả của bài đăng bằng số lượt thích (likes) sau vài giờ đầu.
- Ghi rõ tình trạng seed comment (C1 câu hỏi mồi, C2 giá trị/CTA) của từng bài kèm mã bài viết trong `Data-Analytics/Seed-Comment-Tracker.csv`.

### Quy tắc 7: Trạng thái bài đăng phải có bằng chứng nền tảng
- Phân biệt rõ ràng giữa **Scheduled** (đã lên lịch) và **Published** (đã xuất bản thực tế).
- Chỉ được ghi nhận trạng thái **Published** khi đã có ID bài đăng chính thức từ Meta API hoặc đường link xem trực tiếp trên Facebook/Instagram sau giờ đăng.

### Quy tắc 8: Đề xuất hành động phải làm được ngay & xếp theo mức độ gần doanh thu
- Tối đa **5 việc cần làm**.
- Thứ tự ưu tiên bắt buộc: Xếp từ việc gần doanh thu nhất (chốt cọc, trả lời lead, sửa form booking) đến các việc xa doanh thu hơn (seed comment, nội dung).
- Mỗi việc phải ghi đầy đủ 3 trường:
  1. **Vị trí trong phễu** (ví dụ: Tầng 7 - Lead sang Cọc, hay Tầng 3 - Link Bio sang Website).
  2. **Chỉ số đo lường hiệu quả** (Metric đo sự thành công).
  3. **Yêu cầu phê duyệt** (Ghi rõ: `Cần Rocky duyệt` hoặc `Tự vận hành`).
- **Liên kết tài liệu:** Sử dụng đường dẫn tương đối trong workspace (ví dụ: `Marketing-Growth/Guidelines/...` hoặc `Executive/...`). **Tuyệt đối không dùng link file:// của máy cá nhân.**

---

## 3. Danh Mục Chỉ Số Cần Bổ Sung (Áp dụng từ 23/10)

1. **Lượt xem trang cá nhân (Profile visits) & Lượt bấm link bio (Website clicks) trên Instagram:**
   * Nguồn: Meta Graph API qua MCP `travelframe-meta` -> tool `get_instagram_insights` với `metrics: "profile_views,website_clicks"`.
2. **Số tin nhắn DM và tin nhắn Messenger hỏi tour:**
   * Nguồn: Hộp thư Instagram DM & Facebook Messenger. Khi API chưa cấp quyền `pages_messaging`, kiểm tra thủ công hoặc qua `Data-Analytics/Lead-Pipeline-Tracker.csv`.
3. **Nguồn lưu lượng Website GA4 tách riêng Facebook và Instagram:**
   * Nguồn: GA4 `sessionSourceMedium` tách biệt:
     * Instagram: `ig / social`, `instagram / bio`, `l.instagram.com / referral`.
     * Facebook: `facebook / page_button`, `facebook.com / referral`, `l.facebook.com`, `m.facebook.com`.
4. **Chi phí Meta Ads & Chi phí cho mỗi Lead (CPL):**
   * Nguồn: Báo cáo Ads Manager khi chiến dịch được kích hoạt live (hiện tại: 0 VND do chưa kích hoạt).

---

## 4. Mẫu Báo Cáo Chuẩn (Standard Daily Template)

```markdown
# Báo Cáo Hiệu Quả Hằng Ngày — [YYYY-MM-DD]
*Chụp số liệu lúc: 08:30 ICT*

### 1. Tóm Tắt
1. [Trạng thái: Đỏ/Vàng/Xanh] Kết luận 1 kèm 1 con số cụ thể.
2. [Trạng thái: Đỏ/Vàng/Xanh] Kết luận 2 kèm 1 con số cụ thể.
3. [Trạng thái: Đỏ/Vàng/Xanh] Kết luận 3 kèm 1 con số cụ thể.
4. [Trạng thái: Đỏ/Vàng/Xanh] Kết luận 4 kèm 1 con số cụ thể.

### 2. Phễu Doanh Số (24 giờ qua: 08:30 hôm qua – 08:30 hôm nay)
| Bước chuyển đổi | Hôm nay ([DD/MM]) | Hôm qua ([DD/MM]) | 7 ngày trước ([DD/MM]) | So với hôm qua | So với 7 ngày trước | Trạng thái |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1. Reach Instagram (accounts) | | | | | | [Trạng thái] |
| 2. Lượt xem trang cá nhân IG | | | | | | [Trạng thái] |
| 3. Lượt bấm link bio IG | | | | | | [Trạng thái] |
| 4. DM / Messenger hỏi tour | | | | | | [Trạng thái] |
| 5. Phiên website (Sessions) | | | | | | [Trạng thái] |
| 6. Lượt xem /booking (views) | | | | | | [Trạng thái] |
| 7. Lead thu thập được | | | | | | [Trạng thái] |
| 8. Doanh thu (USD) / Đơn chốt | $0 / 0 đơn | $0 / 0 đơn | $0 / 0 đơn | 0% | 0% | [Đỏ] |

### 3. Chỉ Số Kênh
#### A. Mạng xã hội (Meta) — Khung 24 giờ & Lũy kế
- Instagram Followers: [Số] (vs hôm qua: [+/-], vs 7 ngày: [+/-])
- Instagram Views: [Số]
- Instagram Saves: [Số]
- Instagram Shares: [Số]
- Facebook Fanpage Followers: [Số]
- Facebook Fanpage Likes: [Số]

#### B. Website (Google Analytics 4) — Khung 24 giờ & MTD
- Phiên 24 giờ qua: [Số] phiên (Lưu ý: chưa lọc traffic nội bộ)
- Nguồn lưu lượng 24 giờ qua:
  - Instagram: [Số] phiên
  - Facebook: [Số] phiên
  - Direct / Organic Search / Khác: [Số] phiên
- Lũy kế MTD Tháng [MM]: [Số] users · [Số] sessions · [Số] pageviews

### 4. Nội Dung Đã Đăng & Seed Comment
| Thời gian đăng | Kênh | Định dạng | Mã bài / URL | Reach (24h/72h) | Views (24h/72h) | Saves | Shares | Tình trạng Seed Comment | Trạng thái |
|:---|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---|:---:|
| [Giờ DD/MM] | IG | Reel | [Link/ID] | [Số] | [Số] | [Số] | [Số] | C1: Đã cấy / C2: Chưa | Published |

### 5. Cảnh Báo Dữ Liệu
- Mẫu dữ liệu: [Ghi rõ nếu ngày có <30 phiên website]
- Phân loại đối tượng: [Xác nhận người xem /booking là người xem, chưa phải khách mua]
- Bộ lọc traffic nội bộ: [Trạng thái lọc IP/admin của GA4]
- Giới hạn API: [Quyền tin nhắn hoặc dữ liệu đang phải đo thủ công]

### 6. Việc Cần Làm (Tối đa 5 việc, xếp theo mức độ gần doanh thu)
1. **[Tên việc 1]:**
   - Vị trí trong phễu: [Tầng phễu]
   - Chỉ số đo: [Chỉ số]
   - Phê duyệt: [Cần Rocky duyệt / Tự vận hành]
   - Tài liệu tham chiếu: [Đường dẫn tương đối trong workspace]
2. **[Tên việc 2]:**
   ...
```
