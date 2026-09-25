# Master Meta Ads Strategy & Growth Blueprint (2026)
## TravelFrame (`travelframe.vn`) — Inbound Visual Experience Tours

**Tác giả:** Antigravity / Growth & Paid Acquisition Strategy  
**Ngày phê duyệt:** 2026-09-15  
**Trạng thái:** `Working Strategy Draft` (Chờ phê duyệt từ Rocky / Executive)  
**Phạm vi:** Chiến lược quảng cáo Meta Ads toàn diện (Facebook & Instagram), cấu trúc tài khoản, ma trận creative chống thuật toán Andromeda, chiến lược scaling ngân sách, tối ưu Offer và hệ thống đo lường MER.

---

## 1. Executive Summary & Triết Lý Tăng Trưởng Mới

Hầu hết các dịch vụ chụp ảnh và du lịch trải nghiệm tại Việt Nam thất bại khi chạy Meta Ads vì 4 sai lầm chí mạng:
1. **Lạm dụng Micro-Targeting:** Ép thuật toán vào tệp sở thích chật hẹp (như "Photography", "Travel", "Hanoi"), khiến giá thầu CPM tăng vọt và làm tê liệt trí tuệ nhân tạo của Meta.
2. **Creative Monoculture (Trùng lặp góc nhìn):** Đổi màu chữ, đổi ảnh mẫu nhưng giữ nguyên cùng một concept chụp ảnh phố cổ $\rightarrow$ bị hệ thống AI Andromeda gom vào một **Creative Similarity Cluster** duy nhất, tự triệt tiêu giá thầu của chính mình.
3. **Bật sai cấu trúc chiến dịch:** Vội vã kích hoạt Advantage+ Shopping (ASC) hoặc Omni-campaign khi tài khoản chưa đủ 50 chuyển đổi/tuần, khiến ngân sách bị đốt sạch mà không có dữ liệu học máy.
4. **Tối ưu theo ngày và theo ROAS in-platform:** Hoảng loạn tắt bật quảng cáo trong 24–48h do biến động hình sin tự nhiên của thuật toán đấu giá, bỏ qua độ trễ quy kết (Attribution Lag) và giá trị giỏ hàng thực tế.

### Triết lý "The Unified Engine" cho TravelFrame:
- **Thuật toán Andromeda làm việc cho ta, không phải chống lại ta:** Creative chính là Targeting (*"Creative is your targeting"*). Nội dung của hình ảnh, hook 3 giây đầu, text overlay và nội dung trang đích là tín hiệu để AI tự quét và tìm kiếm du khách có xác suất booking cao nhất.
- **Cấu trúc 3 tầng tách biệt (Two-Campaign Split + Dedicated Retargeting):** Bảo vệ ngân sách thử nghiệm riêng biệt với ngân sách mở rộng quy mô.
- **Tập trung vào Static Dominance & Realism:** Ảnh chụp tĩnh chân thực mang lại 60–70% chuyển đổi thực tế vì du khách muốn thấy ngay chất lượng ảnh thật của họ khi đứng tại Hà Nội.
- **Đo lường bằng MER (Marketing Efficiency Ratio):** Đánh giá toàn diện trên doanh thu thực tế và tổng tiền quảng cáo trong chu kỳ 7–14 ngày.

---

## 2. Giải Mã Thuật Toán Andromeda Của Meta (Cơ Chế Phân Phối)

Để chạy quảng cáo hiệu quả, TravelFrame phải vận hành đúng nguyên lý 4 tầng của **Andromeda Engine** (vừa được Meta triển khai toàn cầu):

```
+-----------------------------------------------------------------------+
|  ANDROMEDA 4-STAGE RETRIEVAL & AUCTION FUNNEL (Xử lý trong 200ms)     |
+-----------------------------------------------------------------------+
|                                                                       |
|  1. CANDIDATE RETRIEVAL (Hàng triệu ads -> 1,000 ads)                 |
|     - AI Computer Vision quét: Khuôn mặt, nụ cười, trang phục du lịch |
|     - NLP & Audio quét: Voiceover, Text overlay, Subtitles, Caption   |
|     - Web Crawler quét: Tiêu đề & nội dung Landing Page TravelFrame   |
|                                                                       |
|  2. LIGHT RANKING (1,000 ads -> 100 ads)                              |
|     - Lọc thô dựa trên tương tác lịch sử & độ phù hợp phân khúc       |
|                                                                       |
|  3. HEAVY RANKING (100 ads -> 10 ads)                                 |
|     - Mô hình AI sâu tính toán xác suất:                              |
|       * p(Click) - Xác suất nhấp vào ad                               |
|       * p(Message/Book) - Xác suất gửi tin nhắn hoặc đặt tour        |
|       * p(Negative Feedback) - Tỷ lệ lướt qua hoặc report ad          |
|                                                                       |
|  4. THE AD AUCTION (Đấu giá cuối cùng)                                |
|     Total Value = Bid x (Estimated CTR x Estimated CVR) + User Value  |
|                                                                       |
+-----------------------------------------------------------------------+
```

### 3 Điểm Cốt Tử Cần Khắc Cốt Ghi Tâm:
1. **Total Value Equation:** Không phải bên nào nhiều tiền hơn sẽ thắng. Nếu TravelFrame tạo ra quảng cáo có **Estimated CTR cao** (nhờ hình ảnh bắt mắt, hook cuốn hút) và **Estimated CVR cao** (nhờ quy trình chat DM/website tiện lợi), cộng với **User Value cao** (khách dừng lại xem lâu, lưu bài, chia sẻ) $\rightarrow$ Meta sẽ tự động giảm giá thầu CPM cho TravelFrame và phân phối ưu tiên hơn đối thủ trả giá thầu cao!
2. **Creative Similarity Clustering (Bẫy tương đồng):** Nếu TravelFrame đưa ra 10 ảnh khác nhau nhưng cùng một bối cảnh (mẫu mặc áo dài đứng bên bờ hồ Hoàn Kiếm), Andromeda sẽ gom 10 quảng cáo này thành **1 nhóm duy nhất** và chỉ cho 1 quảng cáo được tham gia đấu giá. Muốn tiếp cận nhiều tệp khách khác nhau, TravelFrame phải tạo các **Core Angles độc lập** (Lo lắng tạo dáng, Góc khuất bí mật, An toàn cho nữ đi một mình, Gia đình có trẻ nhỏ, Khách sành điệu thích ảnh film).
3. **Broad Targeting Is King:** Với tài khoản mới hoặc ngân sách dưới $1,000/tháng, để tệp Target mở rộng (Broad - chỉ chọn Giới tính, Độ tuổi 22–55, Ngôn ngữ English/Target Language và Vị trí địa lý). Để chính nội dung quảng cáo làm bộ lọc tự nhiên lọc ra khách du lịch.

---

## 3. Cấu Trúc Chiến Dịch Meta Ads Tối Ưu Cho TravelFrame

Để tránh các sai lầm đã phân tích ở Video 1, TravelFrame sẽ triển khai mô hình **Two-Campaign Split + 1 Dedicated Retargeting ABO**.

```
                           +-------------------------------+
                           |     TRAVELFRAME META ADS      |
                           +---------------+---------------+
                                           |
       +-----------------------------------+-----------------------------------+
       |                                   |                                   |
+------v----------------------+  +---------v-------------------+  +------------v------------------+
| CAMPAIGN 1: [TF-TEST]       |  | CAMPAIGN 2: [TF-SCALE]      |  | CAMPAIGN 3: [TF-RETARGET]     |
| Creative Testing Factory    |  | Evergreen Scaling Engine    |  | Warm Audience Closer          |
| Structure: ABO (Ad Set Budg)|  | Structure: CBO (Adv. Budget)|  | Structure: ABO (Dedicated)    |
| Budget: $15 - $25/day       |  | Budget: $50 - $150+/day     |  | Budget: $10 - $15/day         |
| Goal: Tìm Winning Ads       |  | Goal: Tối đa hóa Doanh Thu  |  | Goal: Chốt Sale Khách Đang Lưỡng Lự
+--------------+--------------+  +-------------+---------------+  +------------+------------------+
               |                               |                               |
     +---------+---------+            +--------+--------+             +--------+--------+
     |                   |            |                 |             |                 |
+----v-----+        +----v-----+  +---v------+     +----v-----+   +---v------+     +----v-----+
| Ad Set 1 |        | Ad Set 2 |  | Ad Set A |     | Ad Set B |   | Ad Set R1|     | Ad Set R2|
| Angle A  |        | Angle B  |  | Proven   |     | Proven   |   | IG/FB Eng|     | Website  |
| 3 Ads    |        | 3 Ads    |  | Winner 1 |     | Winner 2 |   | 90 Days  |     | Visitors |
| (Broad)  |        | (Broad)  |  | (Post ID)|     | (Post ID)|   | 3 Ads    |     | 30 Days  |
+----------+        +----------+  +----------+     +----------+   +----------+     +----------+
```

### Chi Tiết Từng Campaign:

#### Campaign 1: `[TF-TEST] Creative Testing Factory (ABO)`
- **Mục tiêu chiến dịch:** Sales (Conversions) hoặc Leads (Instagram Direct Message).
- **Cấu trúc ngân sách:** ABO ($5 – $8 / ngày cho mỗi Ad Set).
- **Cấu trúc Ad Set:** Theo quy tắc **1-3-3** (1 Campaign, 2-3 Ad Sets đại diện cho 2-3 Core Angles khác biệt, mỗi Ad Set chứa 3 Creative Variations).
- **Targeting:** Broad hoàn toàn (Độ tuổi 22–55, All Genders, Ngôn ngữ: English, Vị trí: Pre-trip Inbound hoặc In-destination Hanoi).
- **Nguyên tắc quản trị:** 
  - Chạy liên tục từ 4 đến 7 ngày (tối thiểu 3x CPA mong đợi) mà không chạm vào quảng cáo.
  - Ad nào có **CTR Link > 1.8%**, **Cost per Messaging/Lead < $10**, và phát sinh chuyển đổi thực tế sẽ được coi là **Winner**.
  - Không tắt Ad Set gốc, chỉ lấy **Post ID** (Mã định danh bài viết) của Creative thắng cuộc chuyển sang Campaign 2.

#### Campaign 2: `[TF-SCALE] Evergreen Scaling Engine (CBO)`
- **Mục tiêu chiến dịch:** Doanh thu & Lịch đặt tour (Purchases / High-intent Leads).
- **Cấu trúc ngân sách:** CBO (Advantage Campaign Budget) bắt đầu từ $50/ngày.
- **Cấu trúc Ad Set:** Chứa từ 3 đến 5 Ad Sets chứa các Winning Creatives đã được kiểm chứng.
- **Kỹ thuật Post ID:** Bắt buộc nhập nguyên Post ID để giữ lại toàn bộ lượt Likes, Comments, Shares từ vòng test. Điều này tăng cường Social Proof cực mạnh đối với du khách quốc tế.
- **Phân bổ ngân sách 70/30:** 70% chi tiêu sẽ tự nhiên dồn vào "Anchor Winner" (quảng cáo sinh lời ổn định nhất), 30% dồn vào các "New Winners" vừa bổ sung để duy trì tính tươi mới.
- **Chiến lược Scale:** 
  - **Vertical Scaling:** Tăng ngân sách 15% – 20% sau mỗi 48 – 72 giờ nếu MER duy trì trên 3.5x.
  - Yêu cầu Rocky nâng `Account Spending Limit` lên 3x ngân sách dự kiến để Meta không siết van phân phối.

#### Campaign 3: `[TF-RETARGET] Warm Audience Closer (ABO)`
- **Mục tiêu chiến dịch:** Chốt đơn khách hàng đang đắn đo (Direct Message / Booking Link).
- **Tại sao phải là Dedicated ABO?** Nếu đưa Retargeting vào CBO chung với Cold Traffic, thuật toán CBO sẽ ưu tiên nuốt tiền vào tệp lớn hoặc bỏ đói tệp ấm. Tách riêng ABO $10–$15/ngày đảm bảo 100% người đã quan tâm đều thấy thông điệp chốt hạ.
- **Tệp Retargeting (Custom Audiences):**
  - Khách đã nhắn tin qua IG/FB Page trong 90 ngày qua.
  - Khách đã truy cập Website `travelframe.sidevn.com` trong 30–60 ngày qua.
  - Khách đã xem video > 50% hoặc tương tác với tài khoản Instagram trong 60 ngày qua.
- **Nội dung Creative Retargeting:**
  - FAQ giải tỏa nỗi sợ: "Chuyện gì xảy ra nếu hôm đó trời mưa?", "Tôi không biết tạo dáng có chụp được không?", "Bao lâu nhận được ảnh?".
  - Social Proof / Review dạng ảnh chụp màn hình tin nhắn cảm ơn của khách Mỹ/Úc.
  - Tính cấp bách chân thực (Scarcity): "Hanoi autumn season slots are filling up. Only 4 weekend spots left this month."

---

## 4. Ma Trận Creative & 8 Core Angles Chống Andromeda Clustering

Để tránh việc Meta gom cụm quảng cáo và tự bóp giá thầu, TravelFrame cần sản xuất nội dung theo **8 Core Angles hoàn toàn tách biệt** về mặt tâm lý và hình ảnh:

| Angle ID | Tên Core Angle | Insight & Nỗi Sợ Của Khách Hàng | Visual Hook (3s đầu / Static Image) | Format Ưu Tiên | Call to Action (CTA) |
|---|---|---|---|---|---|
| **ANG-01** | *The Anti-Awkward Experience* | Du khách sợ bị đơ, sợ photographer khó tính, sợ tạo dáng gượng gạo. | Video/GIF: Photographer cười đùa, hướng dẫn khách đi bộ tự nhiên qua ngõ nhỏ Hà Nội. Text: *"Hate posing? Here's how to look effortless."* | 15s Reel / TikTok style | Nhắn tin nhận mẹo tạo dáng & xem lịch trống |
| **ANG-02** | *The Local Insider Secret* | Sợ bị lừa vào bẫy du lịch (tourist traps), đông đúc, xếp hàng chụp ảnh selfie mờ nhạt. | Static Carousel: 5 góc chụp bí mật tại Phố Cổ chỉ dân bản địa biết (quán cà phê trên gác mái cổ, ngõ tranh bích họa không bóng người). | Static Multi-image Carousel | Xem bản đồ tour bí mật & đặt lịch |
| **ANG-03** | *Solo Traveler Freedom* | Đi du lịch một mình, nhờ người lạ chụp thì mờ, chụp gậy selfie thì quê mùa và dễ mất an toàn. | Split Screen: (Trái) Ảnh nhờ người lạ chụp cắt mất đầu $\leftrightarrow$ (Phải) Ảnh TravelFrame chụp nghệ thuật góc rộng Hồ Tây. | Static Side-by-side / Reel | Book your private photographer guide |
| **ANG-04** | *Static Realism (Raw vs Cinematic)* | Khách muốn biết chính xác chất lượng màu ảnh nhận được có ảo như filter mạng không. | Static Collage: Ảnh gốc chụp bằng máy chuyên nghiệp vs Ảnh sau khi chỉnh màu tone Hà Nội cổ kính, ấm áp. | Single High-Res Static Image | Xem trọn bộ Album khách đã chụp |
| **ANG-05** | *Couple / Honeymoon Romance* | Các cặp đôi muốn lưu giữ kỷ niệm tình yêu lãng mạn tại một thành phố Đông Dương hoài cổ. | Video Cinematic: Cặp đôi nắm tay đi dạo phố Tràng Tiền lúc hoàng hôn, ánh đèn vàng ấm áp lướt qua ống kính. | Cinematic Reel 4K (Nhạc lo-fi dịu dàng) | Check our Couples Package |
| **ANG-06** | *The 48h Content Nomad Package* | Content creator / Influencer cần hình ảnh và video Reels chất lượng cao gấp để đăng mạng xã hội. | Text Hook: *"Get 25 edited high-res photos + 1 ready-to-post 4K Reel delivered within 48 hours."* | Short Video + Fast Cuts | Claim 48-Hour Delivery Slot |
| **ANG-07** | *Pre-Trip Inbound Planner* | Khách đang lên kế hoạch du lịch Việt Nam trước 1-2 tháng, đang tìm hoạt động độc đáo tại Hà Nội. | Graphic Map: Lịch trình 1 buổi sáng trọn gói: Chụp ảnh Đường Tàu $\rightarrow$ Cà phê Trứng $\rightarrow$ Cầu Long Biên $\rightarrow$ Nhận ảnh đẹp mang về. | Infographic / Carousel Card | Lên lịch trước chuyến đi (Reserve your date) |
| **ANG-08** | *Value Comparison (Smart Investment)* | So sánh chi phí: Tự thuê đồ + taxi đi lạc + ảnh mờ VS Gói All-in-One $140 chỉ bằng một bữa tối tại Sydney/New York. | Comparison Table: *"Expensive dinner you'll forget vs Lifetime memories in Hanoi for the same price."* | Static Minimalist Graphic | Đặt chỗ ngay hôm nay |

---

## 5. Chiến Lược Offer Scaling & Tăng AOV (Average Order Value)

Một nguyên lý sống còn từ Video 2: **"Bạn không thể scale quảng cáo thành công nếu biên lợi nhuận quá mỏng hoặc giá trị đơn hàng (AOV) quá thấp."**

### Vấn Đề Hiện Tại Của Bảng Giá Website TravelFrame:
Hiện nay website cấu trúc theo kiểu: Khách phải tự tính `Tour Package` ($40 – $270) + `Visual Package` ($8/h – $80/h). Cách này gây **ma sát nhận thức (cognitive friction)** rất lớn: khách du lịch phương Tây không muốn làm toán cộng trừ khi đang lên kế hoạch du lịch.

### Giải Pháp Tái Cấu Trúc Thành "3 Signature All-In-One Bundles":

```
+---------------------------------------------------------------------------------------+
|                       TRAVELFRAME SIGNATURE ALL-IN-ONE OFFERS                         |
+---------------------------+-------------------------------+---------------------------+
| 1. THE ESSENTIAL TOUR     | 2. THE SIGNATURE EXPERIENCE   | 3. THE VIP FULL-DAY EXP.  |
| "Old Quarter Walk"        | "Hanoi Iconic & Hidden Gems"  | "Hanoi + Ninh Binh/Halong"|
+---------------------------+-------------------------------+---------------------------+
| - Thời lượng: 2 Giờ       | - Thời lượng: 3.5 Giờ         | - Thời lượng: 8-10 Giờ    |
| - 1-2 Khách               | - 1-3 Khách (Cặp đôi/Gia đình)| - Nhóm nhỏ hoặc VIP       |
| - 15 Ảnh Retouch Pro      | - 30 Ảnh Retouch Pro          | - 60+ Ảnh Retouch Master  |
| - Toàn bộ file gốc        | - 1 Cinematic Reel 4K (60s)   | - 2 Cinematic Reels 4K    |
| - 1 Đồ uống đặc sản       | - Toàn bộ file gốc qua Drive  | - Xe riêng đưa đón        |
|                           | - Hướng dẫn viên địa phương   | - Trọn gói ăn uống & vé   |
+---------------------------+-------------------------------+---------------------------+
| GIÁ CHUẨN: $120           | GIÁ HERO (MOST POPULAR): $220 | GIÁ CAO CẤP: $550 - $750  |
+---------------------------+-------------------------------+---------------------------+
```

### Hệ Thống Upsell Sau Chốt (Post-Booking Order Bumps):
Khi khách đã xác nhận đặt tour qua Instagram DM hoặc Website, nhân viên tư vấn/automation sẽ đưa ra 3 gói Upsell tự nhiên:
1. **Express 6-Hour RAW Delivery (+ $25):** Gửi toàn bộ ảnh gốc chất lượng cao qua Google Drive ngay trong ngày để khách đăng Story ngay.
2. **Additional Trending Reel Edit (+ $35):** Dựng thêm 1 video ngắn bắt trend âm nhạc mới nhất trên TikTok/Instagram.
3. **Traditional Costume / Prop Rental (+ $20):** Chuẩn bị sẵn Áo Dài truyền thống hoặc nón lá phong cách hoài cổ theo đúng kích cỡ của khách.
$\rightarrow$ **Kết quả:** Kéo giá trị đơn hàng trung bình (AOV) từ $120 lên **$180 – $250**, cho phép TravelFrame chi trả tới $40 – $50 cho mỗi khách hàng mới mà vẫn thu về lợi nhuận ròng vượt trội!

---

## 6. Chiến Lược Phân Vùng Địa Lý (Geographic Expansion Vector)

Du lịch là ngành có hành vi mua hàng phụ thuộc rất lớn vào **thời gian và vị trí địa lý**. TravelFrame sẽ chia làm 2 chiến lược địa lý độc lập:

### Phân Khúc A: In-Destination Traffic (Khách Đang Có Mặt Tại Hà Nội)
- **Vị trí địa lý:** Target "People living in or recently in this location" trong bán kính **15 km xung quanh Hồ Hoàn Kiếm, Hà Nội**.
- **Ngôn ngữ:** English, Korean, French, German, Spanish.
- **Tâm lý khách hàng:** Đang ở khách sạn, đang tìm chỗ đi chơi hôm nay hoặc ngày mai, muốn có ảnh đẹp ngay lập tức.
- **Thông điệp quảng cáo:** *"In Hanoi right now? Last-minute slots open for today and tomorrow. Walk with a local, get stunning photos in 2 hours."*
- **Kênh chốt:** Trỏ thẳng vào **Instagram Direct Message** với Quick Reply: *"Check today/tomorrow availability"*.

### Phân Khúc B: Pre-Trip Inbound Traffic (Khách Lên Kế Hoạch Trước)
- **Vị trí địa lý:** 5 Thị trường nguồn trọng điểm có mức chi trả cao và lượng du khách đến Hà Nội lớn nhất:
  1. **Australia:** Sydney, Melbourne, Brisbane (Tệp khách cực kỳ yêu thích ẩm thực và cà phê Hà Nội).
  2. **Singapore:** Tệp khách cuối tuần, du lịch ngắn ngày, chi trả cao.
  3. **United States:** California, New York, Washington (Khách đi tour dài ngày, sẵn sàng book gói VIP).
  4. **United Kingdom & EU:** London, Paris, Berlin (Du khách yêu văn hóa, lịch sử và kiến trúc Indochine).
  5. **South Korea & Japan:** Seoul, Tokyo (Rất chuộng concept ảnh nhẹ nhàng, thời trang).
- **Targeting:** Kết hợp Broad hoặc Target sở thích: *Vietnam travel*, *Hanoi*, *Southeast Asia backpacking*.
- **Thời gian trước chuyến đi:** 15 – 45 ngày trước khi khởi hành.
- **Thông điệp quảng cáo:** *"Traveling to Vietnam this autumn? Don't leave your memories to shaky smartphone selfies. Secure your personal photographer before high season sells out."*
- **Kênh chốt:** Trỏ về **Website Booking Configurator** hoặc Instagram DM để nhận lịch trình gợi ý.

---

## 7. Khung Đo Lường MER & Quy Tắc Quản Trị Ngân Sách (SOP)

### 1. Chỉ Số Đo Lường Hiệu Quả Marketing (MER):
Không đo lường bằng In-Platform ROAS do sự gián đoạn của iOS 14.5+ và thời gian đặt tour có độ trễ. Ta sử dụng chỉ số **Blended MER**:

$$\text{MER} = \frac{\text{Tổng Doanh Thu Booking Thực Tế (Tiền Cọc + Thanh Toán)}}{\text{Tổng Chi Phí Quảng Cáo Meta}} \ge 3.5x$$

- **Target Cost Per Qualified Inbound Lead (DM):** $\le \$6.00 – \$10.00$.
- **Tỷ lệ chốt đơn từ DM Lead thành Booking:** $\ge 20\% – 25\%$.
- **Target CAC (Chi phí sở hữu một khách đặt tour):** $\le \$35.00 – \$45.00$.
- Với AOV trung bình **$180 – $220**, biên lợi nhuận ròng sau chi phí photographer và quảng cáo đạt **50% – 60%**.

### 2. Quy Tắc Vận Hành & Ra Quyết Định (SOP 7–14 Ngày):
Tuân thủ nguyên tắc vàng từ Video 3: *"When in doubt, zoom out!"*

| Tình Huống | Hành Động Chuẩn Xác | Lý Do Kỹ Thuật |
|---|---|---|
| **Trong 72 giờ đầu sau khi launch Ad mới** | **TUYỆT ĐỐI KHÔNG CHẠM VÀO.** Không tắt, không tăng tiền, không sửa text. | Andromeda đang ở pha Machine Learning / Exploration Phase để tìm tệp khán giả phù hợp. Can thiệp sẽ reset máy học. |
| **Sau 5 ngày: Ad chi tiêu > 2x Target CPA mà không ra Lead/DM nào** | **TẮT NGAY LẬP TỨC (Kill).** | Creative không vượt qua được ngưỡng Heavy Ranking và bị người dùng lướt qua (p(Click) quá thấp). |
| **Ad Set trong Testing có CPA rẻ, Lead chất lượng** | **GIỮ NGUYÊN Ad Set test**, sao chép **Post ID** sang Campaign Scaling CBO. | Không tăng ngân sách đột ngột trong Ad Set test làm vỡ tệp. Dùng Post ID để thừa hưởng Social Proof. |
| **Scaling CBO có MER tuần $\ge 3.5x$** | **TĂNG NGÂN SÁCH 15% – 20% mỗi 48 – 72 giờ.** | Tăng vừa phải giúp thuật toán đấu giá không bị đẩy sang nhóm người dùng kém chất lượng (Auction dilution). |
| **Một ngày doanh số bỗng tụt dốc bất thường** | **KHÔNG LÀM GÌ CẢ.** Kiểm tra cửa sổ 7 ngày và 14 ngày. | Hiệu ứng biến động hình sin tự nhiên. Đánh giá xu hướng tuần thay vì giật mình theo từng ngày. |

---

## 8. Lộ Trình Triển Khai Thực Chiến 60 Ngày (3 Giai Đoạn)

### Giai Đoạn 1: Chuẩn Bị & Thiết Lập Nền Móng (Ngày 1 – 14)
- [ ] **Hoàn thiện 3 Signature Bundles** trên Website và mẫu chào giá Instagram DM ($120, $220, $550).
- [ ] **Sản xuất kho tài nguyên Creative đầu tiên (24 assets):**
  - 4 Bộ ảnh Static Realism chất lượng đỉnh cao (Trước/sau, Góc phố cổ không người, Cặp đôi Tràng Tiền, Chân dung tự nhiên).
  - 4 Video ngắn 15s (Anti-awkward posing, 3 bí mật phố cổ, Du lịch một mình, Khách Tây review).
  - Viết 3 bộ Hooks x 3 bộ CTA tương ứng.
- [ ] **Cài đặt kỹ thuật:** Kiểm tra Meta Pixel trên website `travelframe.sidevn.com`, kết nối Conversions API và cấu hình tin nhắn chào tự động trên Instagram Direct.

### Giai Đoạn 2: Thử Nghiệm & Tối Ưu Phễu (Ngày 15 – 30)
- [ ] **Khởi chạy `[TF-TEST]` (Testing Factory ABO):** Ngân sách $20/ngày (3 Ad Sets x $6–$7/ngày, đại diện cho 3 Core Angles: *Anti-Awkward*, *Local Secrets*, *Solo Traveler*).
- [ ] **Kích hoạt `[TF-RETARGET]` (Dedicated ABO):** Ngân sách $10/ngày nhắm vào toàn bộ khách đã tương tác fanpage và website.
- [ ] **Tối ưu hóa tốc độ phản hồi tin nhắn:** Đảm bảo 100% khách gửi tin nhắn được phản hồi trong vòng 5 phút (yếu tố then chốt tăng tỷ lệ chốt du khách quốc tế lên gấp 3 lần).
- [ ] Sau 14 ngày: Xác định 2–3 Winning Creatives có chi phí Lead thấp nhất và tỷ lệ chuyển đổi cao nhất.

### Giai Đoạn 3: Kích Hoạt Động Cơ Tăng Trưởng (Scaling Phase) (Ngày 31 – 60)
- [ ] **Kích hoạt `[TF-SCALE]` (Scaling Engine CBO):** Đặt ngân sách khởi điểm $50/ngày, đưa các Winning Creatives sang bằng Post ID.
- [ ] **Triển khai mở rộng địa lý (Geographic Expansion):** Tách 2 nhóm chiến dịch In-Destination (tại Hà Nội) và Pre-Trip Inbound (Úc & Singapore).
- [ ] **Thực hiện Vertical Scaling:** Tăng ngân sách 15% sau mỗi 3 ngày nếu MER $\ge 3.5x$.
- [ ] Đẩy mạnh các gói **Post-Booking Upsell** để duy trì AOV ở mức tối thiểu $200.

---

## 9. Kết Luận & Hành Động Tiếp Theo Dành Cho Rocky

Bản chiến lược này kết nối hoàn hảo giữa **Công nghệ AI phân phối của Meta (Andromeda)**, **Kỷ luật cấu trúc chiến dịch (Campaign Architecture)** và **Thực tế kinh doanh du lịch trải nghiệm của TravelFrame tại Hà Nội**. 

Bằng cách chuyển trọng tâm từ việc *"cố gắng hack thuật toán bằng kỹ thuật target"* sang việc *"cung cấp cho thuật toán những Creative xuất sắc và một Offer không thể chối từ"*, TravelFrame sẽ thiết lập được một cỗ máy thu hút khách du lịch quốc tế tự động, bền vững và có khả năng nhân rộng quy mô vượt bậc trong năm 2026.

**Hành động đề xuất tiếp theo:**
1. Rocky phê duyệt cấu trúc 3 Signature Bundles ($120 - $220 - $550) và lộ trình ngân sách thử nghiệm ($30/ngày cho giai đoạn 1).
2. Đội ngũ Media tiến hành xuất xưởng 24 creative assets đầu tiên theo đúng ma trận 8 Core Angles đã lập.

---

## 10. Research update 2026-09-15: Olympic Rings và Andromeda One

Nguồn mới `Professor Charley T — Copy This Simple Meta Ads Strategy` đề xuất một
kiến trúc thay thế:

```text
One CBO campaign
├── Control: 4-6 proven Post IDs
├── Test 1: one flexible ad 3:2:2
└── Test 2: one flexible ad 3:2:2
```

Creative được tổ chức thành năm message jobs:

- Ba `hello`: ba concept prospecting khác biệt.
- Hai `close`: objection, offer, proof hoặc urgency.

Một flexible ad `3:2:2` gồm ba creative cùng format, hai primary text và hai headline,
tạo 12 permutation trong một learning pool.

### Tác động tới chiến lược hiện tại

Nguồn mới conflict với cấu trúc ba campaign tại mục 3:

- Bản hiện tại ưu tiên cô lập Testing, Scaling và Retargeting.
- Andromeda One ưu tiên hợp nhất tín hiệu và giảm số data bucket.

Hai mô hình hiện là hai giả thuyết, không phải quyết định đã Approved. Không thay đổi
kiến trúc launch cho tới khi Rocky phê duyệt conversion event, target CPA, ngân sách
và thiết kế pilot.

Nguồn mới cũng đề xuất scale theo biên an toàn: nếu CPA bảy ngày tốt hơn target 10%,
chỉ tăng campaign budget khoảng 5%. Điểm này conflict với quy tắc tăng 15-20% tại mục
7. Mức tăng cuối cùng phải được xác định bằng dữ liệu qualified DM, paid booking, MER
và capacity thực tế của TravelFrame.

Phân tích và giới hạn bằng chứng:
`Research-Insights/Library/analysis/simple-meta-ads-strategy/README.md`.
