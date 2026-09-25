# Báo Cáo Live Ba Kênh TravelFrame

- **Mã báo cáo:** `REP-20260919-THREE-CHANNEL-LIVE`
- **Ngày chụp dữ liệu:** 2026-09-19
- **Kỳ so sánh chính:** 2026-08-20 đến 2026-09-18
- **Trạng thái:** Draft / Review
- **Kênh:** Facebook Page, Instagram Business, website GA4
- **Nguồn:** Meta Graph API qua MCP read-only, GA4 Property `552867189`

## 1. Tóm tắt điều hành

TravelFrame đang có một đầu phễu mạnh trên social nhưng điểm nối sang website và
booking còn yếu. Instagram tạo độ phủ lớn so với quy mô 259 followers; Facebook
có các Reel được chia sẻ tốt nhờ giải quyết vấn đề thực tế của khách lần đầu đến
Hà Nội. Trong khi đó, dữ liệu website mới chỉ xuất hiện từ 2026-09-14 và bị nhiễu
bởi traffic kiểm thử, nên chưa đủ để quy kết doanh thu hoặc hiệu quả chuyển đổi.

Ưu tiên điều hành trong 7 ngày tới là biến nhóm nội dung thắng thành một flow có
đường đi đo được: **Reel hữu ích -> keyword/DM -> trang phù hợp -> form hoặc
đặt lịch -> lead được xác nhận**.

## 2. Bảng điều hành

| Kênh | Chỉ số hiện tại | Tín hiệu chính | Nhận định |
|---|---:|---|---|
| Facebook | 713 followers, 48 bài, 218 shares | Một Reel đạt 66 shares | Hợp với nội dung thực dụng, dễ gửi cho bạn đồng hành |
| Instagram | 259 followers, 296.503 views, 124.564 reach | 14.833 interactions | Discovery mạnh, nhưng chỉ có 11 website clicks |
| Website | 48 users, 96 sessions, 296 page views | 17 views trang `/booking` | Có ý định tìm hiểu, nhưng attribution và booking chưa sạch |

## 3. Facebook Page

### Hiện trạng

- Page: `travelframe.vn`
- Followers / fans: **713**
- Bài đọc được qua API: **48**
- Tổng shares trong tập bài đọc được: **218**
- Trung bình: **4,5 shares/bài**, nhưng phân phối lệch mạnh về vài bài thắng.

### Nội dung thắng theo shares

| Xếp hạng | Chủ đề | Shares | Vì sao hiệu quả |
|---:|---|---:|---|
| 1 | Crossing the road in Vietnam | 66 | Xử lý nỗi lo cụ thể, thực dụng, có thể gửi cho người đi cùng |
| 2 | Hidden Hanoi location, CTA DM | 28 | Curiosity kết hợp lời mời hành động rõ |
| 3 | Vietnam Cheat Sheet Part 2 | 28 | Checklist ngắn, có giá trị save/share |
| 4 | 10 Hanoi food spots | 24 | Danh sách dễ dùng khi lên lịch |
| 5 | Save-time travel tip | 19 | Lợi ích tức thì, phù hợp khách du lịch ngắn ngày |

### Kết luận

Facebook nên là kênh mở rộng reach cho nhóm **practical Hanoi utility**:
crossing roads, cash safety, weather/packing, cheat sheet, food lists và lỗi
khách du lịch thường mắc. Mỗi bài cần một CTA keyword hoặc DM nhất quán để
không dừng ở share.

### Giới hạn

App chưa có `pages_read_user_content`, nên báo cáo chưa đọc được comment/reaction
chi tiết hoặc Page Insights đầy đủ.

## 4. Instagram Business

### Kết quả 30 ngày

| Chỉ số | Giá trị |
|---|---:|
| Followers | 259 |
| Media count | 70 |
| Views | 296.503 |
| Reach | 124.564 |
| Accounts engaged | 6.904 |
| Total interactions | 14.833 |
| Profile views | 2.118 |
| Website clicks | 11 |

### Chỉ số phễu suy ra

| Bước | Tỷ lệ | Diễn giải |
|---|---:|---|
| Reach -> Profile view | 1,70% | Có lực kéo từ nội dung sang profile |
| Reach -> Interaction | 11,91% | Tương tác tốt so với quy mô follower |
| Profile view -> Website click | 0,52% | Nút thắt lớn nhất hiện tại |
| Reach -> Website click | 0,009% | Chưa có cầu nối đủ mạnh sang conversion |

### Nội dung thắng theo likes + comments

| Xếp hạng | Chủ đề | Engagement | Dạng |
|---:|---|---:|---|
| 1 | Crossing the road in Vietnam | 340 | Reel utility / safety |
| 2 | Hanoi flooding reaction | 291 | Reel topical / relatable |
| 3 | Short humorous Hanoi reaction | 290 | Reel entertainment |
| 4 | Hidden Hanoi location | 258 | Reel curiosity / discovery |
| 5 | Save-time Vietnam tip | 236 | Reel utility |
| 6 | Cash-payment scam warning | 179 | Reel safety |

### Kết luận

Nội dung làm tốt nhất chia thành ba nhóm:

1. **An toàn và tự tin khi tự đi:** crossing road, cash scam, tourist mistakes.
2. **Local discovery:** hidden spots, food, cheat sheets.
3. **Topical humour:** mưa ngập, tình huống bất ngờ khi ở Hà Nội.

Nhóm 1 và 2 phù hợp nhất để dẫn về TravelFrame vì có thể nối tự nhiên sang local
guide, Photo Walk hoặc tư vấn lịch trình. Nhóm 3 nên tiếp tục để giữ discovery,
nhưng cần caption/pinned comment dẫn sang một giá trị thực dụng.

## 5. Website GA4

### Phạm vi dữ liệu hợp lệ

GA4 chỉ ghi nhận hoạt động từ **2026-09-14 đến 2026-09-18** trong kỳ báo cáo; do
đó không có nền dữ liệu đủ dài để đánh giá tăng/giảm 30 ngày.

| Chỉ số | Giá trị |
|---|---:|
| Active users | 48 |
| Sessions | 96 |
| Page views | 296 |
| Bounce rate | 65,6% |
| Average session duration | 6 phút 02 giây |
| Form starts | 15 |
| Form submits | 14 |

### Trang được xem nhiều

| Trang | Views | Users | Ghi chú |
|---|---:|---:|---|
| `/` | 110 | 45 | Trang vào chính |
| `/tours` | 33 | 7 | Bước khám phá offer |
| `/gallery` | 19 | 8 | Proof visual |
| `/booking` | 17 | 7 | Trang có ý định chuyển đổi |
| `/travelframe-admin/customers` | 26 | 2 | Traffic nội bộ, không dùng đánh giá khách |

### Nguồn traffic

| Source / medium | Sessions | Nhận định |
|---|---:|---|
| Direct | 55 | Cần UTM để biết nguồn thật |
| tagassistant.google.com / referral | 22 | Traffic kiểm thử, cần loại khỏi đánh giá marketing |
| google / organic | 10 | Có tín hiệu SEO ban đầu |
| Social tổng cộng | 6 | Chưa phản ánh tương xứng với social reach |

### Kết luận

Website có tín hiệu xem tour và booking, nhưng chưa thể kết luận có 14 lead thật:
hai người dùng tạo 15 form starts và 14 form submits, đồng thời có traffic admin
và Tag Assistant. Cần phân tách internal traffic trước khi dùng GA4 để ra quyết
định ngân sách hoặc forecast booking.

## 6. Chẩn đoán phễu liên kênh

1. **Discovery:** tốt. Instagram reach 124.564 accounts và Facebook có nhiều
   bài được share.
2. **Consideration:** có. Instagram tạo 2.118 profile views; website có views
   cho `/tours`, `/gallery` và `/booking`.
3. **Intent và conversion:** chưa đo sạch. Website clicks từ Instagram chỉ 11;
   chưa có CRM evidence xác nhận nguồn lead, quote, deposit hoặc paid booking.
4. **Attribution:** yếu. Direct traffic chiếm phần lớn và social chưa có UTM
   thống nhất.

## 7. Việc cần làm trong 7 ngày

1. Đặt một CTA conversion duy nhất cho từng nhóm bài:
   - `HANOI` cho local guide / planning.
   - `PHOTO` cho solo traveler muốn Photo Walk.
2. Dùng link bio có UTM riêng cho Instagram và Facebook; không dùng cùng một link
   trần cho cả hai kênh.
3. Tạo một trang đích riêng cho **Solo Female Photo Walk in Hanoi** với proof,
   thời lượng, cách gặp guide và CTA DM/booking.
4. Mỗi tuần sản xuất tối thiểu 3 Reel utility: traffic safety, scam/cash safety,
   first-day cheat sheet; thêm 1 Reel topical để giữ reach.
5. Trong GA4, lọc traffic nội bộ và Tag Assistant; gắn event có ý nghĩa kinh
   doanh cho lead submit, quote request, deposit và booking confirmed.
6. Ghi lead vào CRM với ba trường bắt buộc: nguồn, keyword/campaign và trạng
   thái từ inquiry đến paid booking.

## 8. Giới hạn và quyết định

- Không có Meta Ads spend, click hoặc campaign ID trong báo cáo này.
- Không có CRM evidence về qualified lead, quote, deposit hoặc paid booking.
- Form submits GA4 không được coi là booking cho đến khi đối soát với CRM.
- Facebook comments/reactions chưa khả dụng do thiếu quyền đọc tương ứng.
- Đây là báo cáo hỗ trợ quyết định nội dung và đo lường, không phải kết luận ROI.
