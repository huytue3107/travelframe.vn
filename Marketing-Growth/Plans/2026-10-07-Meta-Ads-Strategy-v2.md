# TravelFrame Meta Ads Strategy v2

- **Ngày lập:** 2026-10-07 · **Owner:** Marketing-Growth (phối hợp Sales-CRM, Data-Analytics)
- **Trạng thái:** Draft, chờ Rocky duyệt. Chưa có thay đổi live nào trên tài khoản quảng cáo.
- **Ngân sách:** nằm trong trần **300 USD** của pilot đã duyệt; đã chi khoảng 35 USD (02–05/10), còn khoảng **265 USD**.
- **Thay thế khi được duyệt:** mục 3 (cấu trúc 3 campaign), mục 7 (quy tắc tăng ngân sách) và mục 8 (lộ trình 60 ngày) của
  `Master-Meta-Ads-Strategy-TravelFrame-2026.md`; mục 3–4 (cấu trúc ad set theo offer) của
  `TravelFrame-Meta-Ads-300USD-Pilot-2026-09-15.md`. Hai bản cũ giữ nguyên làm tham chiếu, không xóa.
- **Dựa trên:** báo cáo `Data-Analytics/Campaign-Results/02.10_Travelframe_Prospecting/report-2026-10-01_2026-10-07.md`
  và pattern P-011 → P-031 trong `Research-Insights/Library/knowledge/patterns.md`.

---

## 1. Tóm tắt

Giai đoạn tới không đi tìm thêm hội thoại rẻ (đã có: ~2,5 USD/hội thoại) mà tìm **lead đạt chuẩn rẻ** và **booking
đầu tiên**. Chiến lược v2 gom tín hiệu vào ít đơn vị quảng cáo (phù hợp ngân sách ~10 USD/ngày), bổ sung hai quảng cáo
"chốt" còn thiếu, tách khách Mỹ thành campaign riêng mở theo cổng điều kiện, và sửa ba lỗ hổng vận hành: spending limit,
UTM, phản hồi tin nhắn ngoài giờ.

## 2. Bài học từ dữ liệu 02–05/10

| Quan sát | Hệ quả cho v2 |
|---|---|
| 1 ad set CBO, 4 ad: ra 14 hội thoại, ~2,5 USD/hội thoại | Gom tín hiệu chạy được ở ngân sách nhỏ → dùng kiến trúc gọn (P-029) |
| `Video 2 tourists` tạo hội thoại / 1.000 impressions gấp 2 lần ảnh | Video người thật trải nghiệm làm "control" |
| Bài ảnh *Pack one outfit* có 144 link click | Mẹo thực dụng là hello mạnh thứ hai; đưa vào quảng cáo bằng Post ID |
| Cả 4 ad đều là "mở lời", không ad nào xử lý phản đối | Thêm 2 ad chốt (Olympic Rings, P-027) |
| Campaign tắt vì account spending limit | Đặt limit trước khi chạy (P-016) |
| 152 click → ~1 session `fb / paid` | UTM bắt buộc |
| Website: 17 lượt `/booking`, 0 form | Đích quảng cáo là tin nhắn, chưa dẫn về form |

Mẫu còn rất nhỏ; các kết luận trên là giả thuyết làm việc, không phải chân lý.

## 3. Năm nguyên tắc

1. **Tối ưu theo lead đạt chuẩn, không theo hội thoại.** Hội thoại chỉ là chỉ báo sớm.
2. **Cấu trúc theo năng lực vận hành** (P-015): ít campaign, ít ad set, mỗi đơn vị đủ tiền để học.
3. **Creative là targeting** (P-021–P-023): targeting rộng, để nội dung tự lọc khách.
4. **Mỗi quảng cáo có một nhiệm vụ** trong chuỗi 3 hello + 2 close (P-027).
5. **Không trộn hai tệp địa lý:** khách đang ở Hà Nội và khách Mỹ chuẩn bị đi là hai campaign riêng.

## 4. Kiến trúc

```text
TKQC SIDE112 2 (act_1423800382160162)
│
├── Campaign 1: TF-HAN-INDEST-202610        (CBO, Engagement/Leads → Messaging, ~10 USD/ngày)
│   ├── Ad set CONTROL   – broad, Hà Nội
│   │   ├── H1  Video 2 tourists            (Post ID gốc)
│   │   ├── H2  Pack one outfit             (Post ID gốc)
│   │   ├── C1  FAQ: worried about posing?  (mới)
│   │   └── C2  How it works in 3 steps     (mới)
│   └── Ad set TEST-01   – broad, Hà Nội
│       └── H3  Flexible ad 3:2:2 "Anti-awkward / solo" (mới, 3 video cùng tỷ lệ)
│
└── Campaign 2: TF-US-PRETRIP-202610        (CBO, Messaging, ~10 USD/ngày) — CHỈ MỞ KHI QUA CỔNG §7
    └── Ad set US-BROAD – Mỹ, English
        ├── H1-US  Video 2 tourists, copy pre-trip
        ├── H4     Planning-a-Hanoi-morning (ANG-07)
        └── C1-US  FAQ pre-trip: dates, weather, how to book
```

- **Không có campaign retarget riêng** cho tới khi tệp ấm đủ lớn (≥ 1.000 người tương tác/nhắn tin/xem video ≥ 50% trong 60 ngày).
  Trước mốc đó, hai ad C1/C2 trong CONTROL làm nhiệm vụ chốt.
- **Không dùng ASC/Advantage+ Shopping** (P-011: chưa đủ 50 conversion/tuần).
- **Đích chuyển đổi:** Messaging (Instagram Direct + Messenger), kèm câu hỏi sàng lọc tự động (§6).
- **Targeting Campaign 1:** sống tại hoặc mới ở Hà Nội, 22–55, mọi giới tính, ngôn ngữ English, Advantage+ placements.
- **Targeting Campaign 2:** United States, 25–55, English, broad. Không thêm interest ở vòng đầu.

## 5. Ma trận creative và copy

Quy tắc chung: không giá, không cam kết thời gian giao ảnh, không hứa Train Street, không fake urgency, không testimonial
chưa có consent, chỉ dùng footage TravelFrame sở hữu hoặc có release. Ảnh AI (thư viện Viktor) **không** được dùng như ảnh khách thật.

| Mã | Vai trò | Nhiệm vụ | Creative | Trạng thái |
|---|---|---|---|---|
| H1 | Hello | Cho thấy người giống mình đang vui | `Video 2 tourists` | Có, giữ Post ID |
| H2 | Hello | Mẹo hữu ích, tạo tin cậy | *Pack one outfit* | Có, giữ Post ID |
| H3 | Hello | Giải nỗi sợ tạo dáng / đi một mình | 3 video dọc 9:16, 12–20 giây (ANG-01, ANG-03) | Cần sản xuất |
| C1 | Close | Xử lý phản đối | Static hoặc carousel FAQ | Cần sản xuất |
| C2 | Close | Làm rõ cách hoạt động | Carousel 3 bước | Cần sản xuất; thêm gói/giá khi P0 pricing được duyệt |

### H3 – Flexible ad 3:2:2 (ad set TEST-01)

- **3 video:** (a) host hướng dẫn khách đi bộ tự nhiên trong ngõ; (b) so sánh ảnh nhờ người lạ chụp vs ảnh TravelFrame;
  (c) khách đi một mình, host vừa dẫn đường vừa chụp.
- **Primary text A:**
  ```text
  Hate posing? You don't have to.
  We walk Hanoi's old streets together, chat, and photograph you while you're just being you.
  Message us to see how a walk works.
  ```
- **Primary text B:**
  ```text
  Travelling Hanoi solo? Skip the selfie stick.
  A local guide shows you the city's quieter corners and takes the photos you can't take yourself.
  Send us a message with your dates.
  ```
- **Headline 1:** `Look natural in your Hanoi photos`
- **Headline 2:** `A local friend with a camera`

### C1 – FAQ (CONTROL)

```text
Worried you'll feel awkward on camera?
Most of our guests say the same thing before we start.
We walk, talk, and guide you through simple moves, no modelling needed.
Questions about weather, outfits or timing? Message us and we'll answer.
```
Headline: `Never posed before? Perfect.`

### C2 – How it works (CONTROL)

Carousel 3 thẻ: `1. Message us your dates` → `2. We plan a route around what you like` → `3. Walk Hanoi and get your photos`.
Text: `Here's exactly how a TravelFrame walk works. Message us to check availability for your dates.`
Khi pricing được duyệt: thêm thẻ 4 hiển thị gói chính thức từ `Brand-Strategy/` (không tự đặt giá trong ad).

### Copy cho Campaign 2 (khách Mỹ)

- **H1-US:** `Planning Vietnam this year? Here's what a slow morning in Hanoi with a local looks like. Message us your travel dates.`
- **H4 (ANG-07):** `Hanoi, one morning, planned for you: old-quarter streets, coffee where locals go, and photos to take home. Send us your dates and we'll suggest a route.`
- **C1-US:** `Not sure when to visit or what to wear? Ask us. We're Hanoi locals and happy to help you plan.`
- Không nhắc "mùa cao điểm sắp hết chỗ" trừ khi có lịch thật chứng minh.

## 6. Tin nhắn sàng lọc tự động

Áp dụng cho mọi tin nhắn từ quảng cáo, chạy 24/7, đặc biệt khung 21:00–07:00 giờ Hà Nội (giờ hành chính Mỹ).
Dựng bằng ManyChat theo chuẩn `Sales-CRM/Automation/ManyChat/2026-09-26-manychat-segment-triage-flows.md`.

```text
Hi! Thanks for reaching out to TravelFrame. A quick few questions so we can help you properly:
1. When are you in Hanoi? (dates)
2. Who's coming? (just you / couple / friends / family)
3. What would you love most: photos of you, exploring with a local, or both?
A real person from our team will reply with options shortly.
```

- **Qualified** = có ngày cụ thể + số khách (giữ đúng định nghĩa pilot). Thêm trường `country` và `source_ad`.
- **Nhãn hộp thư:** `new`, `qualified`, `quoted`, `deposit`, `lost` (theo pilot §313).
- **Cam kết vận hành nội bộ:** người thật trả lời lead qualified trong giờ làm việc kế tiếp; không hứa thời gian phản hồi với khách.

## 7. Ngân sách, lịch và cổng điều kiện

| Giai đoạn | Thời gian | Việc | Ngân sách |
|---|---|---|---:|
| 0. Chuẩn bị | 08–10/10 | Đối soát 14 hội thoại; nâng spending limit; cấp quyền ad account cho MCP; UTM; ManyChat; sản xuất H3, C1, C2 | 0 |
| 1. Hà Nội | 11–17/10 (7 ngày) | Chạy Campaign 1 | ~70 USD |
| Cổng A | 18/10 | Xem mục bên dưới | — |
| 2. Hà Nội + Mỹ | 18–31/10 | Campaign 1 tiếp tục; mở Campaign 2 nếu qua cổng | ~10–20 USD/ngày, tối đa ~195 USD |

**Cổng A (mở khách Mỹ):** Campaign 1 có ≥ 4 lead qualified và cost per qualified DM ≤ 10 USD trong 7 ngày,
**và** ManyChat ngoài giờ đã chạy. Không qua cổng → giữ Campaign 1, sửa ring yếu nhất (P-031), chưa chi cho Mỹ.

**Dừng pilot:** chi hết 265 USD hoặc 31/10, tùy mốc nào đến trước. Mọi khoản vượt trần 300 USD cần Rocky duyệt riêng.

**Spending limit:** đặt bằng ~3 lần ngân sách dự kiến của giai đoạn đang chạy (≈ 210 USD cho giai đoạn 1), để account không tự dừng.

## 8. Quy tắc vận hành hợp nhất

| Tình huống | Hành động | Nguồn |
|---|---|---|
| 72 giờ đầu sau khi bật ad/ad set mới | Không sửa, không tắt, không đổi ngân sách | P-024, Master §7 |
| Đánh giá | Cửa sổ 7 ngày, không theo từng ngày | P-024 |
| Ad chi > 20 USD, 0 hội thoại sau 5 ngày | Tắt ad đó | Master §7 (2× CPA 10 USD) |
| Ad set chi > 30 USD, 0 lead qualified | Xác định ring yếu nhất, thay **một** giả thuyết | P-031 |
| Cost per qualified DM 7 ngày tốt hơn target ≥ 10% | Tăng ngân sách 15–20%, tối đa 1 lần/72 giờ | Kết hợp P-030 (điều kiện) + P-016 (mức tăng) |
| Ad thắng trong TEST-01 | Đưa Post ID sang CONTROL, không tắt ad gốc | P-014 |
| Hiệu suất giảm vài ngày | Kiểm tra spend, frequency, vai trò ad trước khi tắt | P-026 |

Lý do kết hợp P-030 + P-016: điều kiện tăng phải dựa trên biên an toàn so với target, nhưng mức tăng 5% của P-030 vô nghĩa
khi ngân sách chỉ ~10 USD/ngày.

## 9. Đo lường

- **UTM chuẩn** cho mọi link:
  `utm_source=facebook&utm_medium=paid&utm_campaign=<tên campaign>&utm_content=<mã ad: H1, H2, C1…>`.
- **Bảng log hằng ngày** theo pilot §371: Date, Ad, Spend, Impressions, DM starts, Qualified DMs, Quotes, Deposits,
  Deposit revenue, Country, Notes. Lưu tại `Data-Analytics/Campaign-Results/<campaign>/`.
- **Nguồn số liệu Ads:** MCP `travelframe-meta-ads` (read-only) sau khi cấp quyền ad account; CSV export chỉ là dự phòng.
- **Giai đoạn sau (cần Rocky duyệt, việc của Technology-Automation):** gửi sự kiện lead qualified về Meta qua
  Conversions API for Business Messaging để thuật toán tối ưu theo chất lượng lead.

| KPI | Mục tiêu giai đoạn 1 | Mục tiêu giai đoạn 2 |
|---|---:|---:|
| Cost / hội thoại | ≤ 4 USD | ≤ 4 USD (Hà Nội), theo dõi riêng Mỹ |
| Tỷ lệ qualified | ≥ 30% | ≥ 30% |
| Cost / qualified DM | ≤ 10 USD | ≤ 10 USD |
| Quote gửi | ≥ 3 | ≥ 6 |
| Paid deposit | ≥ 1 | ≥ 2 |
| Session GA4 `utm_medium=paid` / link click | ≥ 60% | ≥ 60% |

Không báo cáo CAC, MER khi mẫu số bằng 0.

## 10. Thay đổi so với bản cũ

| Hạng mục | Bản cũ | v2 |
|---|---|---|
| Cấu trúc | 3 campaign Test/Scale/Retarget (~45–60 USD/ngày) hoặc 3 ad set ABO theo offer | 1 campaign CBO gọn (CONTROL + TEST-01), thêm campaign Mỹ theo cổng |
| Retarget | Campaign ABO riêng | Hai ad chốt nằm trong CONTROL tới khi tệp ấm ≥ 1.000 |
| Câu hỏi test | Offer nào thắng | Ad nào ra lead qualified rẻ nhất; offer test qua copy và câu hỏi sàng lọc |
| Địa lý | Úc, Singapore trước | Hà Nội trước, Mỹ sau cổng A (theo mục tiêu khách Mỹ) |
| Quy tắc tăng | 15–20% hoặc 5% (mâu thuẫn) | Điều kiện P-030 + mức tăng P-016 |
| Phản hồi tin nhắn | Hứa 5 phút | Tự động sàng lọc 24/7 + người thật trả lời lead qualified |

## 11. Quyết định cần Rocky

| # | Quyết định | Mặc định nếu chưa có ý kiến |
|---|---|---|
| 1 | Duyệt v2 thay cấu trúc pilot cũ | Chưa áp dụng |
| 2 | Ngân sách ~10 USD/ngày, trong trần 300 USD | Giữ trần 300 USD |
| 3 | Nâng spending limit ≈ 210 USD | Không tự nâng |
| 4 | Cấp quyền ad account cho System User của token Ads | — |
| 5 | Ai trả lời lead qualified ngoài giờ | ManyChat sàng lọc, người thật trả lời sáng hôm sau |
| 6 | Pricing P0 (để mở thẻ gói trong C2) | C2 chạy bản không giá |

## 12. Rủi ro

- **Mẫu nhỏ:** 7 ngày ~70 USD có thể chỉ ra 15–30 hội thoại; kết luận vẫn mang tính định hướng.
- **Khách Mỹ có thể ít:** chi phí hiển thị ở Mỹ cao hơn nhiều so với tệp Hà Nội; cổng A tránh chi sớm.
- **Lead đến nhưng không chốt được** vì chưa có giá/gói chính thức: rủi ro lớn nhất, nằm ngoài quảng cáo (P0 pricing).
- **Pattern nguồn yếu:** phần lớn P-0xx dựa trên 1 nguồn practitioner; v2 cần dữ liệu TravelFrame để xác nhận hoặc bác bỏ.
