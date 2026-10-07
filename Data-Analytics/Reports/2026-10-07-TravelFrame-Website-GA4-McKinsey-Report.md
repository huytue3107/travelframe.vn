# TravelFrame Website Performance — GA4 Review (McKinsey method)

- **Ngày:** 2026-10-07 | **Người nhận:** Rocky (Tổng Giám đốc)
- **Status:** Draft — Data-Analytics
- **Nguồn:** GA4 property `552867189`, captured 2026-10-07 01:05 → `Data-Analytics/Snapshots/2026-10-07-GA4-Website-Analytics.md`
- **Kỳ:** MTD 01–06/10 (≈6 ngày) so với tháng 9 (30 ngày)
- **Phương pháp:** Pyramid Principle (kết luận trước), SCQA, issue tree MECE, so-what cho từng phát hiện, ma trận impact × effort

---

## 1. Kết luận chính (Governing thought)

**Website đã có lực kéo thật từ mạng xã hội (lưu lượng social/ngày tăng ~7 lần so với tháng 9), nhưng chưa tạo ra một khách hàng nào có thể đo được. Nút thắt không nằm ở traffic mà ở hai chỗ: (1) dữ liệu đang lẫn ~20% hoạt động nội bộ nên các chỉ số "chất lượng" bị thổi phồng, và (2) trang `/booking` thu hút 1/4 người dùng nhưng không có hành động chuyển đổi nào được đo. Ưu tiên 7 ngày tới: làm sạch đo lường và gắn một CTA chat có tracking trên `/booking`, trước khi chi thêm cho traffic.**

---

## 2. SCQA

| | |
|---|---|
| **Situation** | MTD 6 ngày: 73 users, 126 sessions, 352 pageviews. Tháng 9: 113 users, 287 sessions. Nhịp users/ngày ≈ 12,2 so với 3,8 (≈3,2×, chỉ là hướng vì users không cộng dồn tuyến tính). |
| **Complication** | 0 form submit từ khách bên ngoài (theo kiểm tra 06/10). Không có key event cho click WhatsApp/DM. ≥20,7% pageviews MTD là trang `/travelframe-admin`, 17 sessions từ Tag Assistant. Meta ads chi 927.022 VND cho 14 conversation nhưng GA4 chỉ thấy 1 session `fb / paid` — quảng cáo không đi qua website. |
| **Question** | Website cần thay đổi gì để biến 19 người vào `/booking` mỗi tuần thành lead đo được, và đâu là con số thật để ra quyết định? |
| **Answer** | (A) Làm sạch đo lường, (B) chuyển `/booking` sang conversational CTA có tracking, (C) sửa lỗi rò rỉ (404, title trùng), (D) dồn traffic vào Instagram/Facebook organic, nơi đã chứng minh hiệu quả. |

---

## 3. Issue tree (MECE)

```
Tại sao website chưa tạo booking?
├── A. Đo lường có đáng tin?          → KHÔNG: lẫn admin + debug, thiếu key events
├── B. Đủ traffic đúng người chưa?     → ĐỦ ĐỂ TEST: 49 users social, IG + FB dẫn đầu
├── C. Hành trình có dẫn tới ý định?   → CÓ: 26% users chạm /booking
├── D. Có điểm chuyển đổi để hành động? → KHÔNG: 0 form submit, CTA chat chưa được đo
└── E. Có rò rỉ kỹ thuật?             → CÓ: /tour 404, PDF 404, title/slug trùng
```

---

## 4. Phát hiện và hàm ý (Finding → So what)

### A. Dữ liệu đang thổi phồng chất lượng

| Bằng chứng | So what |
|---|---|
| Admin pages ≥73/352 PV MTD (≥20,7%); tháng 9 ≥257/1.257 (≥20,4%) | Pageviews, avg duration, engagement rate không dùng được làm KPI cho đến khi lọc |
| `tagassistant.google.com`: 17 sessions/1 user (MTD), 59/1 (tháng 9) | Debug traffic chiếm 13% sessions MTD |
| Avg session duration 235s (MTD) vs 471s (tháng 9) | Mức giảm chủ yếu do tỷ trọng admin thay đổi, không phải hành vi khách xấu đi |
| `/news` 39 PV từ 7 users (5,6 PV/user) | Có dấu hiệu preview nội bộ từ CMS |
| `google / organic` 11 sessions nhưng chỉ 2 users | Organic search chưa phải kênh, chỉ là 2 người quay lại |

**Đính chính báo cáo 05–06/10:** các nhận định "engagement 52,1% vượt chuẩn ngành", "dwell time 4m46s top 5% ngành", "Google organic tăng 9→11 phiên" và "14 qualified leads" không đứng vững. Chỉ số engagement/duration lẫn admin, benchmark không có nguồn, và 14 là *conversation started* (CPA ≈ 66.216 VND/conversation), chưa phải qualified lead.

### B. Traffic: social là động cơ duy nhất đang chạy

Sessions đã loại Tag Assistant:

| Kênh | Tháng 9 (229) | MTD Oct (112) | Sessions/ngày |
|---|---:|---:|---:|
| Organic Social | 42 (18,3%) | 58 (51,8%) | 1,4 → 9,7 (~7×) |
| Direct | 169 (73,8%) | 38 (33,9%) | 5,6 → 6,3 |
| Organic Search | 18 (7,9%) | 11 (9,8%) | — (2 users) |
| Khác (Paid, Unassigned) | 0 | 5 (4,5%) | — |

Trong social MTD: Facebook 28 sessions (page_button 10 sessions/3 users, nhóm quay lại nhiều nhất), Instagram 26 (ig/social 18 + bio 8), Threads 4.
**So what:** UTM trên IG/FB đã hoạt động; tăng trưởng đến từ nội dung organic. Direct tháng 9 phần lớn là nội bộ. Paid Meta không đóng góp vào website (đúng thiết kế click-to-message), nên không được dùng GA4 để đánh giá ads.

### C. Hành trình: ý định cao, cầu nối yếu

| Bước (users MTD) | Users | % trên 73 |
|---|---:|---:|
| Toàn site | 73 | 100% |
| `/tours` | 26 | 35,6% |
| Trang tour chi tiết (3 tour có số) | ~6 | ~8% |
| `/booking` | 19 | 26,0% |
| Form submit bên ngoài | 0 | 0% |

**So what:** nhiều người nhảy thẳng từ `/` hoặc `/tours` vào `/booking` mà bỏ qua trang tour chi tiết, tức là quyết định khi chưa đọc đủ giá trị sản phẩm. `/booking` đạt mục tiêu ≥20% của Measurement Framework, nhưng không có điểm thu lead.

### D. Không có điểm chuyển đổi đo được

- Không có key event cho `click_whatsapp`, `click_ig_dm`, `booking_submit`.
- 6 `form_submit` ngày 04/10 là thao tác admin.
- **So what:** hiện không thể biết website có tạo DM/WhatsApp nào hay không. Mọi kết luận về ROI website đang là suy đoán.

### E. Rò rỉ kỹ thuật

| Lỗi | Ảnh hưởng |
|---|---|
| PDF lead magnet 404: 15 users tháng 9 (≈13% users), 1 user MTD | Lead magnet chết ngay tại điểm thu email/DM |
| `/tour` 404: 3 users MTD | Link hoặc breadcrumb hỏng |
| `/` có 2 page title; tháng 9 có bài `/news/...` mang title của tour | Metadata không nhất quán, hại CTR tìm kiếm |
| Slug trùng: `/news/hoa-lo-prison` và `/news/hoa-lo-prison-witness-history-heart-capital`; `/news/hoi-bread` và `/news/hoi-bread-best-banh-mi-world` | Duplicate content, chia tín hiệu SEO |
| `travelframe.vn` DNS chưa trỏ (P0 sẵn có) | Domain thương hiệu không dẫn khách tới site |

---

## 5. Ba phương án chiến lược

| Phương án | Mô tả | Ưu | Nhược |
|---|---|---|---|
| **1. Conversational-first** | `/booking` thành trang chọn tour + nút WhatsApp/IG DM là CTA chính | Khớp hành vi đã thấy (0 form, 14 conversation qua Meta); nhanh | Lead phân tán trong inbox, cần ghi CRM thủ công |
| **2. Form-first** | Rút gọn form còn 3 trường, thêm trust signals | Dữ liệu lead có cấu trúc | Chưa có bằng chứng khách chịu điền form |
| **3. Hybrid (khuyến nghị)** | CTA chat chính + form ngắn phụ, cả hai gắn key event | Đo được cả hai, so sánh sau 2 tuần | Thêm một chút công dev |

---

## 6. Ưu tiên hành động (impact × effort)

| # | Hành động | Impact | Effort | Owner | Hạn |
|---|---|:---:|:---:|---|---|
| 1 | GA4: internal traffic rule + data filter; chặn gtag trên `/travelframe-admin`; tắt Tag Assistant | Cao | Thấp | Technology-Automation | 3 ngày |
| 2 | Tạo key events `click_whatsapp`, `click_ig_dm`, `booking_submit` | Cao | Thấp | Technology-Automation | 3 ngày |
| 3 | CTA chat nổi trên `/booking`, `/gallery`, tour detail (Phương án 3) | Cao | Thấp–TB | Web | 7 ngày |
| 4 | Upload lại PDF hoặc gỡ link; 301 `/tour` → `/tours` | TB | Thấp | Web | 3 ngày |
| 5 | Chuẩn hóa title, 301 slug trùng về bản canonical | TB | Thấp | SEO | 14 ngày |
| 6 | Card tour trên `/` và `/tours` dẫn vào tour detail trước khi vào `/booking` | TB | TB | Web | 14 ngày |
| 7 | Sổ CRM hàng tuần: DM/WhatsApp → qualified → booking, ghi UTM nguồn | Cao | Thấp | Sales-CRM | Bắt đầu ngay |
| 8 | Trỏ DNS `travelframe.vn` | TB | Thấp | Rocky duyệt | P0 |

Các mục 1–3 và 8 thay đổi hệ thống live nên cần Rocky phê duyệt trước khi thực hiện.

---

## 7. KPI cho kỳ review tiếp theo (sau khi lọc nội bộ)

| KPI | Baseline hiện tại | Mục tiêu 14 ngày |
|---|---|---|
| Users bên ngoài/tuần | ~70–80 (ước tính, chưa lọc) | Đo sạch lần đầu |
| Social sessions/ngày | 9,7 | ≥10 |
| % users chạm `/booking` | 26% (chưa lọc) | ≥25% |
| Chat CTA click / users `/booking` | Chưa đo | ≥15% |
| Qualified leads/tuần (CRM) | Chưa đo | ≥5 |
| Booking xác nhận | 0 | ≥1 |

---

## 8. Giới hạn dữ liệu

- MCP GA4 hiện chỉ trả overview, nguồn và top pages; chưa có events, engagement rate, landing page hay path exploration. Phễu ở mục 4C dựa trên users theo trang, không phải path tuần tự.
- Chưa lọc được nội bộ ở cấp API; các tỷ lệ admin là mức tối thiểu (top 40/53 rows).
- Sample nhỏ (<100 users/kỳ): mọi tỷ lệ là chỉ dẫn hướng, không phải kết luận thống kê.
- Số 0 form submit bên ngoài lấy từ kiểm tra 06/10, chưa pull lại hôm nay.
