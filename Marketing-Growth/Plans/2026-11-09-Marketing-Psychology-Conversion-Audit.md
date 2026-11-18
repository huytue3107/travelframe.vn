---
title: Tâm lý mua hàng áp vào phễu TravelFrame
owner: Marketing-Growth
co-owner: Sales-CRM
status: Draft
created: 2026-11-09
skill: marketing-psychology
---

# Tâm lý mua hàng áp vào phễu TravelFrame (09/11/2026)

## Kết luận

Nút thắt hiện nay **không nằm ở reach**. IG reach 24h đạt 7.806 accounts và tracker có 45 lead.
Nút thắt nằm ở bước **lead → cọc**: chưa lead nào đặt cọc, và `/booking` vẫn chưa có `purchase` nào.
Vì vậy, làm thêm reel hay tăng traffic lúc này chưa giải quyết được vấn đề (Theory of Constraints).
Hai việc cần làm trước:

1. **Đếm lại lead theo việc khách thật sự cần (Jobs to Be Done).** Trong 45 lead, 23 lead là
   Street-Food. Phần lớn là người bình luận "Location pls" dưới reel ẩm thực. Họ cần địa chỉ quán,
   chưa cần thợ ảnh. Chỉ có 13 lead có nhu cầu chụp ảnh và đã được báo giá, và trong đó 6 lead là
   ảnh tốt nghiệp của sinh viên Việt Nam (Graduation-*).
2. **Gỡ các tín hiệu niềm tin chưa có bằng chứng, rồi thay bằng bằng chứng thật.** Khách Mỹ cần
   tin trước khi chuyển tiền cho một dịch vụ mới.

Nguồn số liệu: [Current-State](../../Executive/Current-State.md) và
[Lead-Pipeline-Tracker](../../Data-Analytics/Lead-Pipeline-Tracker.csv) (đọc ngày 09/11),
[chẩn đoán /booking](../../Sales-CRM/Funnel/2026-10-21-Booking-Funnel-Diagnosis.md), và nội dung
live của `/`, `/hanoi-photoshoot`, `/booking` (curl ẩn danh ngày 09/11).

## Phát hiện theo từng bước phễu

### 1. Tin tưởng: social proof chưa có nguồn (rủi ro cao nhất)

- **Thấy gì:** hero homepage ghi "4.9★ reviews · 18+ tours · 50+ photos & videos". Workspace không
  có nguồn nào cho con số 4.9★ hay 18+ tours. Current-State ghi 0 booking đã đối soát và chưa có
  sổ đăng ký testimonial/consent.
- **Vì sao quan trọng:** social proof chỉ có tác dụng khi khách kiểm chứng được. Khách Mỹ sẽ tìm
  review trên Google hoặc Tripadvisor, và TravelFrame chưa có GBP. Nếu không tìm thấy, chỉ số này
  trở thành điểm làm khách nghi ngờ. Nó cũng trái quy tắc trong `writing_preferences` (không dùng
  claim chưa xác minh).
- **Đổi gì:** Rocky xác nhận nguồn (ví dụ review của Hanoi Expert). Nếu có nguồn thì ghi rõ nguồn
  và link. Nếu không có thì gỡ, và tạm thay bằng bằng chứng kiểm chứng được: ảnh khách thật có
  consent, đội thợ có tên.
- **Pratfall effect:** một câu thật thà như "We're new on Google, so here's our work instead of
  stars" thường được tin hơn một con số không ai kiểm chứng.

### 2. Rủi ro và hối tiếc (Regret Aversion, Loss Aversion)

- **Đã tốt:** homepage có dòng "Pay once agreed — no deposit, no pressure". Dòng này giảm đúng nỗi
  sợ trả tiền trước cho dịch vụ mình chưa biết.
- **Thiếu:** cả 3 trang không nhắc đến mưa, đổi lịch hay hoàn tiền (0 kết quả). Hà Nội mưa nhiều,
  nên khách đặt sớm sẽ lo mất tiền nếu trời mưa. Ngoài ra `/booking` ghi "pay securely with
  PayPal", trong khi DEC 21/10 chưa chốt mức cọc. Khách gặp hai thông điệp thanh toán khác nhau.
- **Đổi gì:** Rocky chốt một chính sách duy nhất, gồm thanh toán và xử lý khi mưa (ví dụ "Rain?
  We move your shoot for free, once"). Sau đó dùng đúng một câu đó trên cả 3 trang và trong DM.
  Không đăng chính sách khi chưa được duyệt.

### 3. Giá: neo giá và cách khách tự tính tiền (Anchoring, Mental Accounting, Paradox of Choice)

- **Thấy gì:** homepage cho khách thấy trước các tour "From 250 $ / person" kéo dài 6 giờ. Gói chụp
  ảnh theo giờ ($30/$60/$99, tối đa 2 khách) không xuất hiện ở đâu với con số cụ thể. Như vậy khách
  gặp hai cách tính giá cùng lúc: tour tính theo người, chụp ảnh tính theo giờ. Một cặp đôi nhìn
  tour sẽ hình dung khoảng $500, trong khi Premium 2 giờ cho 2 người chỉ $120.
- **Tác dụng ngược:** mức neo $250/người khiến khách muốn chụp ảnh tưởng TravelFrame đắt và rời
  trang trước khi thấy gói $30. Bảy tour cộng ba gói chụp là quá nhiều lựa chọn (Hick's Law).
- **Đổi gì:**
  - Khi D10 lên web, trang dành cho khách muốn chụp ảnh chỉ đưa ra 3 gói và đánh dấu Premium là
    gói gợi ý. Ba tầng giá tốt–tốt hơn–tốt nhất trong DEC đã đúng mẫu này, với VIP làm mốc neo.
  - Báo giá bằng **tổng tiền cụ thể**, không bắt khách tự nhân: "2 hours for 2 people, Premium =
    $120 total". Với cặp đôi có thể thêm "$30 per person per hour".
  - Không đổi giá. Giá đã được Rocky duyệt trong DEC; phần này chỉ đổi cách trình bày.

### 4. Ma sát khi hành động (BJ Fogg, Activation Energy, Default Effect)

- **Thấy gì:**
  - Nút chính của homepage là "Chat on WhatsApp", trong khi kênh chuyển đổi chính là IG DM và khách
    Mỹ ít dùng WhatsApp.
  - `/booking` bắt nhập WhatsApp phone, có popup "Spin for a gift" ngay ở bước điền liên hệ, và bắt
    tick ô điều khoản.
  - Form `/contact` gửi xong không hiện thông báo gì (D11).
- **Vì sao quan trọng:** khách có động lực nhưng không có cách liên hệ quen thuộc thì vẫn không hành
  động. Trò quay quà xuất hiện đúng lúc khách sắp cam kết làm họ phân tâm và làm dịch vụ trông kém
  cao cấp. Cuối hành trình mà trống trơn (peak-end) khiến khách không chắc yêu cầu đã được gửi.
- **Đổi gì:**
  - Đặt kênh mặc định theo persona (IG DM hoặc email) và để WhatsApp không bắt buộc.
  - Tắt "Spin for a gift" ở bước liên hệ.
  - Làm D11.
  - Bước đầu tiên nên thật nhẹ, khớp với từ khoá ManyChat đã có: "Send PHOTO + your Hanoi dates".

### 5. Lead và follow-up (JTBD, Foot-in-the-Door, Commitment, Scarcity thật)

- **Thấy gì:** 27 lead đang ở `Guide-Sent`, 17 lead ở `Quoted` (4 trong số đó là Street-Food), 0 cọc đã đối soát. Mọi lead đều nhận PDF kèm lời
  chào photo walk, bất kể họ cần gì.
- **Đổi gì:**
  - **Tách 3 nhóm việc.** Nhóm "tìm quán": chỉ trả lời giá trị (reciprocity) và chưa báo giá. Nhóm
    "sống sót ở Hà Nội": gửi PDF, rồi hỏi ngày đi. Nhóm "muốn có ảnh của mình": báo giá ngay.
  - **Ảnh tốt nghiệp là một việc khác.** Khách là sinh viên Việt Nam, chụp tại trường, đi cùng gia
    đình, tính tiền bằng VND. Gói Old Quarter tính bằng USD có polaroid không khớp với nhu cầu này.
    Cần Rocky quyết định có phục vụ nhóm này không. Nếu có, cần một bảng giá VND riêng, có duyệt.
  - **Follow-up một lần cho 13 lead đã báo giá có nhu cầu chụp ảnh.** Đưa ra một đề xuất cụ thể có
    sẵn mặc định: "I can hold Harry for Thursday 7am, Premium 2h = $120 for two. Shall I confirm?".
    Một khung giờ cụ thể đóng vòng lặp (Zeigarnik) và để khách chỉ cần trả lời "yes"
    (Commitment & Consistency).
  - **Chỉ dùng khan hiếm có thật.** Đội có 3 thợ, nên câu "Thursday morning is open" là thật. Không
    dùng đếm ngược hay "only 2 slots left" khi không đúng; điều này bị cấm trong `writing_preferences`.

### 6. Nội dung tạo nhu cầu (Availability Heuristic, Mere Exposure, Rule of 7)

- Reel ẩm thực và giao thông kéo reach rất tốt, nhưng thu hút sai nhóm việc. Khách chỉ đặt chụp khi
  họ hình dung được ảnh của chính mình (availability heuristic).
- Đổi tỉ lệ dần sang nội dung có **khách thật**: hậu trường so với ảnh thành phẩm (series
  BTS-vs-The-Shot đã lên kế hoạch), phản ứng lúc khách nhận ảnh sau 24h. Đây cũng là chỉ đạo của
  Rocky ngày 21/10.
- Retarget tệp warm cần chiến dịch WARM-PHOTO-DM, hiện đã duyệt nhưng chưa chạy live.

## Lỗi trong tài liệu hiện có

| Vị trí | Vấn đề | Sửa |
|---|---|---|
| [DM Price Reply Script §2](../../Sales-CRM/Scripts/2026-10-21-DM-Price-Reply-Script.md) | Câu "most guests pick {plan}" là social proof không có thật, vì chưa có booking nào | Đổi thành "For two people, I'd suggest {plan} for {hours} hours = ${total}" |
| Homepage hero | "4.9★ reviews · 18+ tours" chưa có nguồn | Xác minh nguồn hoặc gỡ (mục 1) |
| [Lead-Pipeline-Tracker](../../Data-Analytics/Lead-Pipeline-Tracker.csv) | 44/45 dòng bị lệch cột: `deposit_usd` chứa ngày, `next_action_date` chứa ghi chú | Data-Analytics chuẩn hoá cột. Trước khi sửa, không dùng file để đo tỉ lệ cọc |

## Ưu tiên (chờ Rocky duyệt từng mục)

| # | Việc | Mô hình | Người làm | Công |
|---|---|---|---|---|
| 1 | Xác minh hoặc gỡ "4.9★ reviews / 18+ tours" | Social proof, Pratfall | Rocky, rồi Marketing | Thấp |
| 2 | Sửa câu "most guests pick" trong script DM | Đạo đức thuyết phục | Sales-CRM | Thấp |
| 3 | Gửi 1 follow-up có khung giờ cụ thể cho 13 lead đã báo giá có nhu cầu chụp | Commitment, Default, Zeigarnik | Sales-CRM | Thấp |
| 4 | Chốt chính sách thanh toán và mưa/đổi lịch, dùng một câu duy nhất ở mọi nơi | Regret Aversion | Rocky | Thấp |
| 5 | Quyết định có phục vụ nhóm ảnh tốt nghiệp không, và giá VND nếu có | JTBD, Mental Accounting | Rocky | Trung bình |
| 6 | `/booking`: kênh liên hệ mặc định IG/email, tắt Spin for a gift; `/contact`: làm D11 | Hick's Law, Activation Energy | Developer | Thấp |
| 7 | Hiện giá gói chụp ảnh khi làm D10, Premium là gói gợi ý | Anchoring, Good-Better-Best | Developer, rồi Marketing | Trung bình |

## Đo lường

- GA4 từ 09/11 đã có key event `contact_click` và `generate_lead`. Theo dõi theo tuần: lead có nhu
  cầu chụp ảnh, số báo giá, số cọc, tách theo nhóm việc.
- Mẫu hiện còn rất nhỏ (0 booking). Theo quy chuẩn báo cáo, chưa kết luận khi chưa đủ 30 phiên hoặc
  sự kiện. Mục 1–4 đánh giá bằng phản hồi định tính trong DM trước.

## Không làm

- Không tạo khan hiếm hay đếm ngược giả, không dùng hook gây sợ, không dùng review chưa có consent.
- Không giảm giá ngoài bảng giá trong DEC.
- Không quảng bá chụp ảnh trên đường ray Train Street.
