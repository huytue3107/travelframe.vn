# TravelFrame — Measurement Framework & Weekly Snapshot Template

**Status:** Draft
**Owner:** Data-Analytics
**Created:** 2026-09-15

---

## 1. Funnel Metrics Definition

### Full Funnel

```
IG Reel Views → Accounts Reached → Profile Visit → Follow → Bio Click →
Website Visit → Tour Detail View → Booking Page → Booking Request →
Confirmed Booking → Paid Booking → Completed Tour → Review
```

### Metric Sources

| Metric | Source | Cách đo |
|---|---|---|
| Reel Views | IG Insights / MCP `get_instagram_insights` | `impressions` metric |
| Accounts Reached | IG Insights | `reach` metric |
| Non-Follower % | IG Insights | Audience breakdown |
| Profile Visits | IG Insights | `profile_views` metric |
| Follower Gain | IG Insights | `follower_count` delta |
| Bio Link Clicks | IG Insights | `website_clicks` metric |
| Website Users | GA4 Property `552867189` | `activeUsers` metric |
| Website Sessions | GA4 | `sessions` metric |
| Page Views by Path | GA4 | `screenPageViews` by `pagePath` |
| Booking Page Visits | GA4 | Filter `pagePath` = `/booking` hoặc `/booking/details` (cập nhật 2026-11-28; GA4 tháng 11 ghi nhận `/booking`, không thấy `/book-tour`) |
| Traffic Source | GA4 | `sessionSource` / `sessionMedium` |
| Avg Session Duration | GA4 | `averageSessionDuration` |
| DM Inquiries | Manual count (IG DM inbox) | Count weekly |
| Booking Requests | Manual count (IG DM + website form) | Count weekly |
| Paid Bookings | Manual count (confirmed payments) | Count weekly |
| Reviews | Manual count (Google, TripAdvisor, IG) | Count monthly |

---

## 2. KPI Targets

| Metric | Baseline (09-07/09-15) | Target Tuần 4 | Target Tháng 2 | Target Tháng 3 |
|---|---|---|---|---|
| IG Reached (30d) | 27.370 | 40.000 | 70.000 | 100.000 |
| Reached→Profile rate | 1,1% | 2,0% | 2,5% | 3,0% |
| Profile visits (30d) | 301 | 800 | 1.750 | 3.000 |
| Bio link clicks (30d) | Chưa đo | ≥50 | ≥120 | ≥200 |
| Website users (30d) | 8 | 50 | 120 | 200 |
| Website→booking page | Chưa đo | ≥20% | ≥22% | ≥25% |
| DM inquiries/tuần | Chưa đo | ≥5 | ≥10 | ≥15 |
| Bookings/tháng | 0 (attributed) | ≥1 | ≥3 | ≥5 |
| Saves/post (avg) | ~20 (estimated) | ≥25 | ≥40 | ≥50 |
| Share rate (avg) | ~0.85% (scams reel) | ≥1.0% | ≥1.2% | ≥1.5% |
| Story views | 80 | ≥150 | ≥250 | ≥300 |

---

## 3. Weekly Report Template v2 (từ 2026-11-28)

Lập sáng **thứ Hai** cho kỳ thứ Hai–Chủ nhật vừa qua, giờ Asia/Saigon.
Lưu vào `Data-Analytics/Reports/YYYY-MM-DD-Weekly-Report.md` (ngày = thứ Hai lập báo cáo).

Quy tắc:
- Số GA4 lấy bằng MCP `travelframe-google-analytics` v0.3.0+ với `exclude_internal: true`; ghi cả số thô ở mục 6.
- Nhóm trang theo `pagePath`, không theo `pageTitle`.
- Mỗi số ghi nguồn; số đếm tay ghi "(tay)"; chỗ suy luận ghi "(đoán)".
- Trang booking thật: `/booking`, `/booking/details` (không phải `/book-tour`).

```markdown
# Báo cáo tuần TravelFrame — [DD/MM–DD/MM]

Lập: [ngày giờ] · Trạng thái: Research snapshot · Nguồn: GA4 552867189, GSC, Meta Graph API, đếm tay

## 1. Kết luận
- Tốt nhất:
- Xấu nhất:
- Việc cần làm tuần tới:

## 2. Phễu (GA4 đã loại admin)
| Bước | Tuần này | Tuần trước | Δ |
|---|---:|---:|---:|
| IG reach | | | |
| IG profile visits | | | |
| Phiên web từ social | | | |
| Phiên web tổng (sạch) | | | |
| Xem /tours, /tour/*, /hanoi-photoshoot | | | |
| Xem /booking, /booking/details | | | |
| generate_lead | | | |
| DM "PHOTO" (tay) | | | |
| Booking xác nhận (tay) | | | |
| Doanh thu (tay, VND) | | | |

## 3. Nguồn traffic (sessions / users, đã loại admin)
| Kênh | Tuần này | Tuần trước | Δ |
|---|---:|---:|---:|
| Direct | | | |
| Google organic | | | |
| AI Assistant (ChatGPT, Gemini…) | | | |
| Facebook (mọi nguồn) | | | |
| Instagram (mọi nguồn) | | | |
| Khác | | | |

## 4. SEO (GSC)
| Chỉ số | Tuần này | Tuần trước |
|---|---:|---:|
| Clicks | | |
| Impressions | | |
| CTR | | |
| Vị trí TB | | |

- Top 10 trang theo clicks; bài mới trong tuần và trạng thái index (URL Inspection)

## 5. Social
| Kênh | Bài đăng | Reach | Saves | Shares |
|---|---:|---:|---:|---:|
| Instagram | | | | |
| Facebook | | | | |

- Top 3 bài:

## 6. Chất lượng dữ liệu
- Pageview admin còn lọt (mục tiêu < 3% tổng thô):
- Số thô: users / sessions / pageviews
- Cảnh báo bot: ngày có direct > 2 lần trung bình tuần với ~1 trang/phiên
- Chỗ đoán và số thiếu:

## 7. Việc tuần tới (tối đa 3, có owner)
- [ ]
```

## 3a. Weekly Snapshot Template v1 (2026-09-15, thay bằng v2 ở trên)

Chụp mỗi **Chủ nhật**, lưu vào `Data-Analytics/Snapshots/`.

Naming convention: `YYYY-MM-DD-Weekly-Snapshot.md`

```markdown
# TravelFrame Weekly Snapshot — [YYYY-MM-DD]

**Week:** [#] of 30-day plan
**Period:** [Monday] to [Sunday]

## Instagram Metrics

| Metric | Giá trị | vs Tuần trước | vs Baseline |
|---|---|---|---|
| Views (7d) | | | |
| Accounts reached (7d) | | | |
| Non-followers % | | | |
| Profile visits (7d) | | | |
| Follower gain (7d) | | | |
| Bio link clicks (7d) | | | |
| Story views (7d) | | | |

## Top 3 Posts (tuần này)

| Post | Views | Saves | Shares | Share Rate |
|---|---|---|---|---|
| 1. | | | | |
| 2. | | | | |
| 3. | | | | |

## Website (GA4)

| Metric | Giá trị | vs Tuần trước |
|---|---|---|
| Users (7d) | | |
| Sessions (7d) | | |
| /book-tour views | | |
| Top traffic source | | |
| Avg session duration | | |

## Conversion

| Metric | Giá trị |
|---|---|
| DM inquiries (tuần) | |
| Booking requests | |
| Confirmed bookings | |

## Content Published (tuần này)

| Day | Content | Format | Pillar | Performance Note |
|---|---|---|---|---|
| | | | | |

## Actions Next Week

- [ ] Action 1
- [ ] Action 2

## Notes

[Ghi nhận bất thường, quyết định thay đổi, bench list swap, v.v.]
```

---

## 4. Monthly Report Template

Lưu vào `Data-Analytics/Snapshots/` với tên `YYYY-MM-Monthly-Report.md`.

Nội dung:
1. Executive summary (3-5 dòng)
2. Funnel metrics vs targets (bảng)
3. Content performance ranking (top 10)
4. Channel breakdown (IG vs TikTok vs Website vs Other)
5. Conversion analysis (DM → booking rate)
6. Budget spent vs ROI (nếu chạy ads)
7. Recommendations for next month

---

## 5. Tool Setup Checklist

- [ ] GA4 property `552867189` có UTM tracking hoạt động
- [ ] IG Bio link có UTM parameters
- [ ] MCP token Meta được gia hạn (hiện đã expired 2026-09-14)
- [ ] GA4 MCP `google-analytics-readonly.mjs` hoạt động
- [ ] Tạo GA4 custom report: Traffic by Source/Medium + Booking page conversions
- [ ] Setup GA4 event: `booking_page_view` (custom event khi user vào /book-tour)
- [ ] Setup GA4 event: `tour_detail_view` (custom event khi user xem tour detail)
