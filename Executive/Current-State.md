# TravelFrame Current State

**Snapshot date:** 2026-10-26
**Bản trước:** [Snapshots/2026-09-15-Current-State.md](Snapshots/2026-09-15-Current-State.md)

## Approved

- 2026-10-21: Bảng giá theo giờ Basic $30 / Premium $60 (tối thiểu 2h) / VIP $99 (tối thiểu 2h), tối đa
  2 khách: [DEC-20261021-HOURLY-TIER-PRICING](DEC-20261021-HOURLY-TIER-PRICING.md). Chưa áp dụng lên website.
- 2026-10-09: Meta Ads photo walk 14 ngày, 300.000 VND/ngày, trần media 4.200.000 VND
  (prospect 210.000 + warm 90.000 VND/ngày khi tệp khả dụng):
  [DEC-20261009-WARM-PHOTO-DM](DEC-20261009-WARM-PHOTO-DM.md). Draft + prelaunch audit
  xong 13/10. **Chưa kích hoạt live.**
- Company OS dùng folder English, không đánh số; Side Agency vault là canonical source.
- Migration chạy theo batch, có checksum, validation và rollback.
- Agent mặc định Read, Draft, Review.
- Hệ thống Agent Skills Active theo `MIG-20260915-SKILLS-PHASE1`.

## Chỉ đạo của Rocky (trong chat, chưa có DEC record)

- 2026-10-07: Ưu tiên thu hút khách Mỹ / khách quốc tế; Google Business Profile là bước đầu
  (địa chỉ nhà hay văn phòng chưa chốt; khách thường gặp ở meeting point).
- 2026-10-07: Sau mỗi bài FB/IG, Page tự đăng ≥2 seed comment (không áp dụng Threads).
- 2026-10-21: Chấp nhận reach ngắn hạn giảm để giảm số bài, chuyển từ repost sang nội dung
  tự sản xuất có khách thật.
- 2026-10-22: Quy chuẩn báo cáo hằng ngày (áp dụng từ 23/10): khung 6 phần cố định, chụp số
  liệu 08:30 ICT, 8 quy tắc chuẩn mực (phễu 8 bước đứng trước follower, so với hôm qua cùng giờ
  và 7 ngày trước, trạng thái Xanh/Vàng/Đỏ theo ngưỡng 10%, không dùng từ cảm tính hay emoji,
  đủ mẫu ≥30 phiên mới kết luận, đo bài mốc 24h/72h, đề xuất ≤5 việc gần doanh thu có link
  workspace): xem `Data-Analytics/Daily-Reporting-Standard.md`.

## Working

- 2026-11-18: Rocky đổi tên dự án Hanoi Expert thành TravelFrame trong Second Brain.
- Instagram DM là conversion path ưu tiên.
- Content: Hanoi utility, local discovery, photography; series Field Notes VJ (identity duyệt 04/10).

## Cập nhật Social & Inbox (2026-11-18 mốc 14:50 ICT, nguồn: Meta Graph API & GA4 Data API)

| Chỉ số | Giá trị |
|---|---|
| Follower live (14:50 ICT 18/11) | FB **3.540** (`+7` vs trưa nay; `+23` vs tối 17/11; `+41` vs sáng 16/11; `+126` vs 13/11; `+373 / +11,8%` vs 10/11; `+628 / +21,6%` vs 2.912 ngày 02/11), IG **783** (`+3` vs 17/11; `+10` vs 16/11; `+17` vs 15/11; **237 media** với 2 Reel mới xuất bản tối 17/11: *How to cross the street in Vietnam* `Df2J6B6Njp5` và *When is the best time to visit Hanoi?* `Df1-A6StE93` — **100% Reels đã cấy live cặp seed comment C1+C2**) |
| Inbox & Comment đã xử lý & Chờ duyệt | Đã xử lý **215 lượt** (`+11` superseded/skipped, tổng cộng **226 mục** đã giải quyết dứt điểm). Đã phản hồi toàn bộ các lead và tương tác inbound #219–#226 (gồm #219 @adrianadorso, #220 bờ hồ, #221 chạy bộ, #222 @_.zayn._.slay._ nhận guide, #223 @talking.turtles.are.real, #224 kỷ niệm qua đường, #225 đi cẩn thận, #226 khen video độc đáo). Hiện **0 tồn đọng pending comment** trong log! |
| Tồn đọng bị sót (kiểm tra 10:34–10:42 ICT 12/11) | **Threads `/messages/` & `/activity`:** chưa trả lời `@htxty.26` (`Seen` 11/11), `@hiiiii_121` (hỏi tiếp giá), `@thii_hae` (`3d`), `@hitifnek` (`4d`), `@haiyen_booking` (`3d`), `@ms_money_moves` (`3d`), `@gmva0203` (`1w`), `@jvtrips` (`2w`), `@straw.dau` (`2w`); **1** Request ngoài tệp (`@ilya.hill`). **IG Direct:** `Hidden Requests` **1** (`Shivam Panday`), `Requests` **1** (`Manasvi \| Mayank`), `Primary` còn `Ziv學長` (`2d`), `Trang Linh` (`1w`), `Kanjani` (`2w`), `NATHASYA VM`, `Kalpana`. **IG Comments/Tags:** `@_wuchr` tag `07/11`, `@standingbarhanoi` đính chính địa chỉ `20/10`, 4 lead IG `16–23/10`. **FB `16–23/10`:** trượt 3 câu hỏi + 4 `"Hanoi"` giữa 2 đợt audit. |
| Lead Pipeline (`Lead-Pipeline-Tracker.csv`) | Đồng bộ lên **97 lead** (`L-01` đến `L-96`, 98 dòng gồm header): **19 `Quoted`**, **40 `Guide-Sent`** (cả `L-95` và `L-96` đều đã gửi cẩm nang/bản đồ qua DM), **26 `Inquiry`**, **11 `Qualified-unconfirmed`**, **1 `Meeting-Scheduled`**, **0 `Deposited / Booked / Delivered`** (`payment_evidence` rỗng, doanh thu `$0`). |

## Chỉ số (2026-11-18 mốc 14:50 ICT · Meta Graph API & GA4 Data API)

| Chỉ số | Giá trị |
|---|---|
| GA4 ngày 18/11, 17/11 & MTD | Hôm nay **18/11** (00:00–14:50 ICT): **5 users**, **5 sessions**, **6 views** (Bounce `60,0%`, TB `16,5s`; Nguồn: 2 Direct, 2 Google Organic, 1 **Threads `threads / social`** chuyển đổi vào `/tours`; Realtime 14:50 ICT: **4 active interactions** xem bài viết Photoshoot làng hương Quảng Phú Cầu). Ngày **17/11** (trọn ngày bùng nổ traffic): **24 users**, **32 sessions**, **105 views** (`40,63%` bounce, TB `262,5s ~ 4m22s`; Nguồn: Direct 14, Google Organic 8, **AI Assistant `chatgpt.com` 7 sessions / 7 users**, Organic Social 3; Top pages: `/tour/colors-delta-craft-villages-expedition` 9, `/tour/hanoi-early-bird-sunrise-local-markets` 9, `/hanoi-photoshoot` 8, `/tour/french-colonial-historical-footsteps` 8, `/tour/spiritual-west-lake-breeze` 8, `/tours` 7). Tháng 11 MTD (`01–18/11`): **155 users**, **348 sessions**, **1.434 views** (`41,67%` bounce, TB `472,9s ~ 7m53s`). Lũy kế `01/10–18/11`: **537 users**, **1.100 sessions**, **3.930 views**. |
| Form booking gửi đi / Doanh thu | **0 đơn / $0** (`0 Deposited · 0 Booked · 0 Delivered`) |
| IG reach | Chu kỳ 24h chốt 15:00 ICT 18/11: **13.483 accounts**; chu kỳ hôm trước chốt 15:00 ICT 17/11: **19.248 accounts** (đỉnh cao nhất tháng) |
| IG views | Chu kỳ 24h chốt 15:00 ICT 18/11: **19.898 views**; chu kỳ hôm trước: **27.292 views** |
| IG tương tác sâu | Chu kỳ 24h chốt 15:00 ICT 18/11: **674 accounts engaged**; chu kỳ hôm trước: **1.068 accounts engaged** |
| Lượt xem trang cá nhân IG | **81 profile visits** (chu kỳ chốt 15:00 ICT 17/11) |
| Lượt bấm link bio IG | **4 website taps** |
| Nội dung mới, Product & SEO `17–18/11` | **Reels:** Xuất bản 3 Reel mới ngày 17/11: *How to cross the street in Vietnam* (`Df2J6B6Njp5` IG **22 likes**, 4 cmt / FB `2341488743294049` 3 shares), *When is the best time to visit Hanoi?* (`Df1-A6StE93` IG 1 like / FB `1865782518210101`), *Exploring Hanoi doesn't have to cost a fortune* (`Df1jOMltQI8` IG 1 like / FB `1116929091220536`). **100% Reels đã cấy live cặp seed comment C1+C2**. Các Reel trước tiếp tục tăng trưởng: *Running in Hanoi traffic* (`DfzH7iftreH`) **35 likes IG**, *Hoan Kiem Lake local life* (`Dfzh7raNsSu`) **13 likes IG**, *Giáng sinh lung linh* (`DfwMvVNtOHa`) duy trì **168 likes IG**, 6 cmt. **Product:** *The Hanoi Handbook v04* (**$12**, ô 02 `/ebooks` `Coming soon`, tiếp tục chờ server cấu hình `file_private_path` & PayPal). |
| Booking / doanh thu đã đối soát | **0** ($0 / 0 đơn · 0 Deposited · 0 Booked) |

Lưu ý: GA4 ngày 10/11 còn 22/96 top views quản trị CMS và 3 views 404 từ link dính ký tự (`/toursLet`, `/news/hanoi-secret-food-photo-map📸`). Meta daily bucket tính theo ngày PST (`15:00 ICT hôm trước – 15:00 ICT hôm sau`).

## Open P0

- **Pricing**: đã chốt 21/10; còn thiếu chi phí thợ thực tế và mức đặt cọc.
- Product ladder và package chính thức.
- Delivery SLA.
- Legal / payment model (nhận cọc thế nào).
- Brand architecture cuối cùng; DNS travelframe.vn.
- Phễu `/booking` không ra form submit.
- Tracker lead → báo giá → cọc: đã có bản draft (`Data-Analytics/Lead-Pipeline-Tracker.csv`), cần người nhập liệu hằng ngày.

## Open P1

- Ngày kích hoạt chiến dịch WARM-PHOTO-DM và người trực inbox.
- Persona launch chính; package duration và capacity.
- ManyChat value-first hay follower-gated; lead magnet fulfillment.
- Lọc traffic nội bộ GA4.
- Google Business Profile.

## Known proof gaps

- Chưa có booking count và revenue attribution.
- Chưa có testimonial/consent register hoàn chỉnh.
- Render không mặc định là published.
- Giá, access, visa, weather, transport phải re-check gần ngày publish.

## Workspace

- Migration sang Company OS hoàn tất 15/09; xem `Operations/Migrations/`.
- 2026-10-21: 12 báo cáo cũ trong `Data-Analytics/Reports/` (17/09–06/10) được Rocky gỡ có
  chủ đích; bản gốc trong git history.
