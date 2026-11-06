# TravelFrame social: content nào đang win và nên nhân rộng?

- Owner: Research-Insights
- Ngày nghiên cứu: 2026-11-02, Asia/Ho_Chi_Minh
- Trạng thái: Review · Phạm vi đánh giá: partial (Instagram/Facebook, thiếu insights từng Reel)
- Nguồn chính: Meta read-only connector, dữ liệu bài đăng và bình luận lấy trực tiếp trong phiên nghiên cứu ngày 2026-11-02.
- Cửa sổ chính: bài đăng 2026-10-01–2026-10-31 theo ICT; số tương tác là lifetime tại lúc lấy, không phải tương tác chỉ phát sinh trong tháng.

**Ba hướng có bằng chứng đáng tiếp tục: món ăn/quán cụ thể; tiếng Việt dùng ngay khi đi du lịch; trải nghiệm đời thường ở phố cổ. Facebook có thêm một tín hiệu rõ: bài ẩm thực mời comment FOOD tạo phản hồi nhận gợi ý, trong khi bài nổi tiếng nhất về café nhảy chủ yếu thắng về tương tác. Chưa có bằng chứng bài nào thắng về booking/doanh thu.**

## 1. Mẫu và cách xác định “win”

Đã lấy 201 media Instagram: 96 bài tháng 9 và 105 bài tháng 10. Profile hiện hiển thị 203 media, nên không tuyên bố đã bao phủ toàn bộ tài khoản. Tháng 10 có 97 video, 6 ảnh đơn, 2 carousel. Facebook lấy 100 bài gần đây, từ 2026-10-04 đến 2026-10-31; chỉ 26 bài có trường shares trong phản hồi API.

Xếp hạng chính dùng **93 Reel tháng 10 đã đủ 72 giờ**, tính tuổi bài tới 2026-11-02 11:01:49 ICT. Trung vị likes + comments là **12 tương tác/Reel**. Bốn video còn mới được giữ trong nguồn nhưng không dùng xếp hạng chính. Kiểm tra độ nhạy với 83 Reel đã đủ 7 ngày: trung vị là 13; thứ tự những bài dẫn đầu không thay đổi.

`engagement_lift = (likes + comments của bài) / 12`. Đây là độ vượt mức tương tác thông thường của Reel trong mẫu, **không phải view lift, save rate hay conversion rate**. Comments ở bước xếp hạng có thể gồm seed comments; phần kiểm tra keyword Facebook bên dưới đã loại comment của Page.

Các phép tính dùng `analyze.py`, gọi lại bộ tính deterministic `channel_metrics.py`. Kết quả đầy đủ trong [metrics.json](metrics.json) và [bảng Reel CSV](ranked-instagram-reels.csv). Hai bộ `october/metrics.json` và `september/metrics.json` là kiểm kê ban đầu theo ngày UTC/toàn bộ format; dùng **metrics.json tại thư mục gốc run này** cho kết luận chính theo ICT và cohort đủ tuổi.

## 2. Những bài nổi bật trên Instagram

Ngày dưới đây đã chuyển sang ICT. Số trong bảng là snapshot API ngày 2026-11-02.

| Bài | Ngày đăng | Likes | Comments | Vượt trung vị Reel | Nhận định sử dụng |
|---|---|---:|---:|---:|---|
| [Café lúc 2 PM, mọi người bắt đầu nhảy](https://www.instagram.com/reel/DeRw7HjNeRB/) | 2026-10-09 | 5.995 | 98 | 507,75× | Outlier lớn; không chọn làm mẫu tăng trưởng chất lượng |
| [Đến Hà Nội vì BIGBANG, ở lại khám phá Hà Nội](https://www.instagram.com/reel/Dd_kM_OpQ5l/) | 2026-10-02 | 296 | 5 | 25,08× | Event hook có tín hiệu; nội dung mang tính thời điểm |
| [Tiếng Việt để gọi bánh mì](https://www.instagram.com/reel/DeHIWwDJygU/) | 2026-10-05 | 141 | 5 | 12,17× | Tình huống rõ, câu dùng ngay, nên thử tiếp |
| [Bánh mì Hà Nội](https://www.instagram.com/reel/DeJOZXZNPBJ/) | 2026-10-06 | 140 | 1 | 11,75× | Một món cụ thể, nhu cầu ăn uống rõ |
| [Flambé gần Hồ Hoàn Kiếm](https://www.instagram.com/reel/Dew7ECmSuNq/) | 2026-10-22 | 120 | 1 | 10,08× | Địa điểm + lý do đi + góc chụp là cầu nối phù hợp |
| [Buổi sáng phố cổ, hàng bánh bao](https://www.instagram.com/reel/Deqp6I-tMWb/) | 2026-10-19 | 74 | 3 | 6,42× | Đời sống địa phương cụ thể, khác mood du lịch chung |
| [Nói “không, cảm ơn” bằng tiếng Việt](https://www.instagram.com/reel/DeY-Pi2NYVz/) | 2026-10-12 | 66 | 5 | 5,92× | Giải quyết một tình huống khách dễ gặp |
| [Khám phá Hà Nội bằng cách đi bộ](https://www.instagram.com/reel/DfFECG5yYXY/) | 2026-10-29 | 64 | 3 | 5,58× | Trải nghiệm đi bộ gần với sản phẩm TravelFrame |
| [Người địa phương không chỉ nói “Xin chào”](https://www.instagram.com/reel/Dd82h9CJIth/) | 2026-10-01 | 57 | 1 | 4,83× | Sửa một hiểu lầm, đưa tình huống sử dụng |
| [Rẽ vào ngõ phố cổ](https://www.instagram.com/reel/DeyeKo2tOKs/) | 2026-10-22 | 47 | 6 | 4,42× | Discovery có bối cảnh địa phương rõ |
| [The Note Coffee](https://www.instagram.com/reel/DelponOtq4w/) | 2026-10-17 | 50 | 1 | 4,25× | Quán có trải nghiệm riêng, dễ hình dung chuyến đi |

Bài café nhảy chiếm **73,84% likes của 97 video tháng 10**. Tổng tháng vì thế dễ khiến ta tưởng cả hệ thống đang mạnh hơn hiệu suất bài điển hình.

Không dùng mức giảm giữa tháng 9 và tháng 10 như bằng chứng nội dung mới kém hơn: các bài tháng 9 có nhiều thời gian tích lũy tương tác hơn, chưa có dữ liệu đồng tuổi 24h/72h để so công bằng.

## 3. Facebook bổ sung bằng chứng gì?

| Bài Facebook | Shares API | Phản hồi khán giả kiểm tra trực tiếp ngày 2026-11-02 | Ý nghĩa |
|---|---:|---|---|
| [Flambé](https://www.facebook.com/reel/1124162584009599/) | 41 | 7 comment khán giả và 1 comment Page trong mẫu trả về; có hỏi món bán chạy và nói muốn ghé lần tới | Có hành vi chia sẻ và quan tâm địa điểm |
| [Hanoi Survival Guide](https://www.facebook.com/reel/2536749556792980/) | 21 | 2 comment khán giả đều là HANOI; loại 2 comment Page | CTA nhận guide có phản hồi |
| [Tiếng Việt để gọi món](https://www.facebook.com/reel/2972885159718412/) | 15 | Chưa lấy mẫu bình luận bài này | Cùng chủ đề nổi bật ở IG và FB |
| [Bánh mì](https://www.facebook.com/reel/2120541435211035/) | 14 | Chưa lấy mẫu bình luận bài này | Tín hiệu chia sẻ hỗ trợ hướng ẩm thực |
| [Street food had other plans](https://www.facebook.com/reel/1712979013491826/) | 13 | 13 comment FOOD trong 14 comment khán giả; loại 1 comment Page | Bằng chứng trực tiếp mạnh nhất trong mẫu về phản hồi nhận gợi ý |

13 comment FOOD **không tự động bằng 13 người duy nhất, 13 lead đủ điều kiện hoặc 13 khách muốn mua photo tour**. Đây là nhu cầu nhận thông tin ẩm thực. Cần đối chiếu tiếp DM, ngày đi và nhu cầu dịch vụ để biết chất lượng khách.

Một khác biệt đáng chú ý: bài street food này trên IG chỉ có 6 likes và 2 comments, trong khi trên Facebook tạo 13 comment keyword. Survival Guide trên IG có 16 likes và 2 comments. Không nên dùng bảng xếp hạng IG để quyết định toàn bộ lịch Facebook.

Không tính share lift cho Facebook: 74 bài thiếu trường shares, không thể coi phần thiếu là 0. Bảng Business Suite còn gộp một số hàng crossposted FB/IG, nên các views/reach tổng hợp đã nhìn thấy không được đưa vào bảng so sánh từng nền tảng.

## 4. Pattern đáng lặp lại và phản chứng

### A. Món ăn hoặc quán cụ thể, có lý do để đi

Flambé, bánh mì, The Note Coffee và bún riêu đều vượt baseline Instagram, trong đó Flambé, bánh mì có thêm tín hiệu chia sẻ Facebook. Caption Flambé nêu quán nào, gần đâu, không gian gì, món gì và thời điểm chụp. Đó là nội dung giúp khách hình dung một việc có thể làm trong chuyến đi.

**Giả thuyết cần thử:** nơi cụ thể + trải nghiệm cụ thể + một thông tin giúp quyết định + ảnh khách có thể có tại đây. Chưa đủ bằng chứng để quy kết độ dài caption hay kiểu dựng là nguyên nhân hiệu quả.

### B. Tiếng Việt gắn với một nhu cầu ngay lúc đó

Gọi món, từ chối lịch sự, chào đúng cách có nhiều bài vượt baseline. Tuy nhiên [bài gọi món ngày 07/10](https://www.instagram.com/reel/DeLyXEuN6UA/) chỉ có 3 likes và 0 comments, dù chủ đề tương tự bài ngày 05/10.

**Kết luận:** chủ đề này đáng tiếp tục nhưng không phải cứ lặp là thắng. Cần xem và so riêng hình mở đầu, lời thoại, âm thanh và phần minh họa của hai bài trước khi chọn công thức dựng. Chưa có video/transcript nên nghiên cứu này không gán nguyên nhân cho hook 3 giây đầu.

Nhóm 12 Reel tiếng Việt được gắn nhãn thủ công có trung vị 18 tương tác, chỉ 5/12 bài đạt ít nhất 2× baseline. Đây là pattern có một số bài thắng, chưa phải cả series đều thắng.

### C. Hà Nội đời thường, người xem hình dung mình đang ở đó

Hàng bánh bao buổi sáng, đi bộ phố cổ và rẽ vào ngõ là ba ví dụ tốt. Một địa điểm/cảnh sinh hoạt cụ thể giúp nội dung gần trải nghiệm thật hơn câu truyền cảm hứng chung.

Phản chứng: [I owe myself a life full of beautiful places](https://www.instagram.com/reel/DfE3NhcyqNE/) có 4 likes, 3 comments; [sunset Âu Cơ](https://www.instagram.com/reel/DfFIa_Qy59O/) có 4 likes, 2 comments. Chưa có cơ sở để coi mọi video cảnh đẹp hoặc mọi caption POV là công thức thắng.

### D. Content nhận guide cần đúng nền tảng và đúng nhu cầu

FOOD trên Facebook có bằng chứng phản hồi tốt hơn trong ba bài được đọc comment. Caption có lời hứa cụ thể về gợi ý ăn uống; người xem phản hồi đúng keyword. Handoff sang dịch vụ nên hỏi lịch đi/nhu cầu sau khi đã đáp ứng lời mời nhận thông tin, không suy diễn rằng họ đang tìm photographer.

Không thay đổi automation hoặc nhắn cho ai trong nghiên cứu này.

### E. Viral và event hook: dùng có chọn lọc

Café nhảy có quy mô tương tác áp đảo nhưng [audit bình luận ngày 2026-10-10](../../../../../Data-Analytics/Reports/2026-10-10-Cafe-Dancing-Reel-Comment-Mining.md) ghi nhận trong mẫu lúc đó 79 comment khán giả, 31 tiêu cực, 14 tích cực, và không có comment HANOI/câu hỏi tour. Đây là snapshot lịch sử, **không phải phép đo lại toàn bộ sentiment hôm nay**. Nên học yếu tố bất ngờ có bối cảnh, không mặc định nhân rộng cảnh gây tranh cãi hoặc dùng lại footage.

Bài BIGBANG có tương tác tốt, nhưng là ví dụ event hook đã qua; thông tin sự kiện trong caption chưa được nghiên cứu này xác minh. Không dùng lại ngày, tên sự kiện hoặc claim đó cho lịch mới.

## 5. Năm việc đề xuất cho vòng nội dung tiếp theo

Đây là đề xuất thử nghiệm để Rocky review, chưa phải lịch đăng hay quyết định sản xuất đã duyệt.

1. **Ưu tiên series food/café cụ thể:** chọn một nơi mỗi bài, một lý do ghé, một thông tin giúp khách quyết định. Dùng cảnh tự quay theo định hướng đã ghi ở Current State. Đo chia sẻ, lưu và comment nhận gợi ý.
2. **Tiếp tục tiếng Việt theo tình huống:** so bài gọi món 05/10 với 07/10 trước; sau đó chỉ thay một yếu tố trình bày mỗi lượt. Mục tiêu là tìm phần có thể lặp lại của bài thắng.
3. **Dùng đi bộ phố cổ làm cầu nối photography:** đưa trải nghiệm/địa điểm trước, cho thấy ảnh thật hoặc cách photographer hỗ trợ ở phần sau. Không kết luận content chụp ảnh không bán được chỉ vì ít likes.
4. **Tách cách chấm Facebook và Instagram:** Facebook theo dõi thêm comment FOOD/HANOI và cuộc hội thoại có ngày đi; IG cần bổ sung saves/shares/reach/profile actions từng bài. Đo cùng tuổi 24h/72h, không so lifetime bài cũ với bài mới.
5. **Rà CTA/giá cũ trước khi tái sử dụng:** bài [photo walk ngày 22/10](https://www.instagram.com/reel/Deyy868Np94/) còn ghi từ $8/h; một bài ảnh khác ghi $20/h, khác quyết định giá được duyệt $30/$60/$99. Chỉ học cấu trúc nếu phù hợp; không sao chép mức giá cũ. Đối chiếu [quyết định 21/10](../../../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md).

Vòng thử cần có lặp lại ở nhiều bài và số đo đồng tuổi trước khi tăng khối lượng. Mục tiêu đo theo ba mức: **content được chia sẻ/lưu → người xem cung cấp ngày đi hoặc nhu cầu → booking/cọc được đối soát**. Mức sau hiện chưa được nghiên cứu này gán cho từng bài.

## 6. Nguồn, giới hạn và cách đọc lại

- [source-posts.json](source-posts.json): ID, URL, caption, timestamp, likes/comments IG và shares FB khi có. Đã bỏ URL media CDN và đường dẫn phân trang.
- [comment-evidence.json](comment-evidence.json): mẫu comment đã loại tên người dùng; Page comments được đánh dấu để loại khỏi keyword count.
- [metrics.json](metrics.json), [ranked-instagram-reels.csv](ranked-instagram-reels.csv), [analyze.py](analyze.py): số liệu và cách tính lại offline.
- [spot-check.md](spot-check.md): những nguồn đã xác minh và những gì chưa xác minh được.
- Context: canonical vault `05-Content-System.md`, `02-Audience-And-Funnel.md`, `09-Instagram-Insights-Snapshot-2026-09-07-2147.md`; `Executive/Current-State.md` về ưu tiên khách quốc tế, DM và nội dung tự sản xuất. Snapshot tháng 9 trong vault chỉ dùng làm context lịch sử, không thay số hiện tại.
- **Chưa đo:** view lift, retention, completion, save/share rate từng Reel IG, phân tách paid/organic, attribution tới inquiry đủ điều kiện, booking và doanh thu từng bài. Không dùng tổng saves tài khoản chia số bài để suy ra saves của bài thắng.
- isPinned không có trong API; helper mặc định false nhưng không được hiểu là không có bài ghim. Follower 595 là snapshot hiện tại, không phải follower khi đăng; ER theo follower không dùng để quyết định.
- Ảnh/carousel được tách khỏi baseline Reel. Mẫu ảnh nhỏ; không kết luận carousel kém hiệu quả từ 2 bài tháng 10.
- Các nhóm series gắn nhãn thủ công mang tính thăm dò, có thiên lệch chọn mẫu; không dùng median nhóm tuyển chọn như ước lượng toàn bộ pillar.
- Caption credit không chứng minh quyền dùng footage. Chưa đánh giá cảnh quay, nhạc, dựng, opening frame hay retention; không chấm điểm production hoặc coi đây là audit video hoàn chỉnh.
- Threads, TikTok, YouTube và Stories chưa có bộ dữ liệu đủ để xếp hạng trong run này. Kết luận chỉ áp dụng cho FB/IG trong phạm vi đã nêu.
