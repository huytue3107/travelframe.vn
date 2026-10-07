# GA4 Website Analytics Snapshot — 2026-10-07

- **Captured:** 2026-10-07 01:05 (Asia/Saigon)
- **Source:** GA4 Data API, property `552867189`, qua MCP `travelframe-google-analytics`
- **Status:** Research snapshot (raw, chưa lọc internal traffic)
- **Periods:** MTD 2026-10-01 → 2026-10-07 01:05 (≈6 ngày) | Tháng 9 2026-09-01 → 2026-09-30
- **Note:** Query 2026-09-01 → 09-07 trả 0 rows (property chưa ghi dữ liệu giai đoạn này).

## Overview

| Metric | MTD Oct | Sep (30 ngày) |
|---|---:|---:|
| activeUsers | 73 | 113 |
| sessions | 126 | 287 |
| screenPageViews | 352 | 1.257 |
| bounceRate | 50,0% | 45,6% |
| averageSessionDuration | 235,4s | 471,2s |

## Sessions by source/medium (sessions / users)

| Channel | Source/Medium | Oct MTD | Sep |
|---|---|---:|---:|
| Direct | (direct) / (none) | 38 / 20 | 169 / 78 |
| Referral (internal debug) | tagassistant.google.com / referral | 17 / 1 | 59 / 1 |
| Organic Social | ig / social | 18 / 16 | 7 / 7 |
| Organic Social | instagram / bio | 8 / 8 | — |
| Organic Social | instagram.com, l.instagram.com / referral | — | 5 / 5 |
| Organic Social | facebook.com / referral | 13 / 13 | 9 / 8 |
| Organic Social | facebook / page_button | 10 / 3 | — |
| Organic Social | l./lm./m.facebook.com / referral | 5 / 5 | 18 / 7 |
| Organic Social | threads / social | 4 / 4 | — |
| Organic Social | zalo | — | 3 / 3 |
| Organic Search | google / organic | 11 / 2 | 18 / 6 |
| Paid Social | fb / paid | 1 / 1 | — |
| Unassigned / Cross-network | (not set), (data not available) | 4 / 4 | — |
| **Tổng theo bảng nguồn** | | **129** | **288** |

Tổng bảng nguồn lệch nhẹ với overview (129 vs 126; 288 vs 287) do một session có thể mang nhiều giá trị source.

## Top pages Oct MTD (pageviews / users) — 40/53 rows

Public: `/` 67/≤32 (cộng 2 title, users có thể trùng) · `/tours` 52/26 · `/booking` 43/19 · `/news` 39/7 · `/gallery` 11/8 · `/about` 9/3 ·
`/contact` 5/3 · `/news/hanoi-photographer-tour-guide` 9/9 (2 title) · `/guides` 3/3 · `/tour/spiritual-west-lake-breeze` 3/2 ·
`/tour/cinematic-hanoi-visual-storytelling-walk` 2/2 · `/tour/hanoi-early-bird-sunrise-local-markets` 2/2 · `/reviews` 2/1.

Lỗi: `/tour` (404) 3/3 · `/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf` (404) 1/1 · `/admin` (Access denied) 1/1.

Admin/internal (≥73 PV): `/travelframe-admin/bills` 17 · `/content/news` 16 · `/bills/11` 8 · `/customers` 8 · `/bills/1` 5 ·
`/guides/guide-2/edit` 5 · `/customers/9` 4 · `/bills/10` 3 · `/guides` 3 · `/content/tours` 2 · `/login` 1.

## Top pages Sep (selected)

`/` 266/≤87 (cộng 2 title, users có thể trùng) · `/news` 108/14 · `/tours` 101/22 · `/booking` 73/20 · `/gallery` 60/19 ·
`/guides/...Tour-Guide.pdf` (404) 20/15 · admin paths ≥257 PV (top 40).

## Geography (GA4 UI, Demographic details, captured 2026-10-07 ~01:30)

### Country — 2026-10-01 → 2026-10-07 (active users / engaged sessions / avg engagement per user)

Vietnam 38 / 42 / 3m57s · United States 19 / 9 / 1m26s · Philippines 5 / 2 / 36s · Ireland 3 / 3 / 5s ·
India 2 / 2 / 18s · Sweden 2 / 2 / 7s · Australia 1 · France 1 · Israel 1 · Qatar 1 · South Korea 1 · UAE 1. Tổng 73.

### City — cùng kỳ (active users)

Hanoi 33 · Prineville 5 · Altoona 3 · Dublin 3 · (not set) 2 · Forest City 2 · Fort Worth 2 · Ho Chi Minh City 2 · Lulea 2 ·
Quezon City 2 · San Jose 2 · Zephyr Cove 2 · Abu Dhabi, Adelaide, Angeles, Cebu City, Da Nang, Daejeon, Doha, Guwahati,
Haiphong, Kiryat Malakhi, Manila, Mumbai, Renton 1 mỗi nơi (top 25).

### Country — 28 ngày 2026-09-09 → 2026-10-06

Vietnam 114 · United States 27 · Australia 5 · Philippines 5 · India 4 · Ireland 3 · Netherlands 3 · Sweden 3 · UAE 3 ·
Germany 2 · Israel 2 · Norway 2 · (not set) 1 · Canada 1 · France 1 · Malaysia 1 (8m10s) · Qatar 1 · South Korea 1. Tổng 176.

### Caveat

Prineville, Altoona, Forest City, Fort Worth (US), Luleå (SE) và khu vực Dublin (IE) trùng địa điểm data center của Meta;
các user này có thời gian tương tác 0–7 giây → nghi là trình thu thập link preview/kiểm duyệt quảng cáo của Meta, chưa xác minh.
Hanoi gồm cả traffic nội bộ của đội ngũ.
