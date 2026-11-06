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

- TravelFrame là consumer-facing workstream thuộc Hanoi Expert.
- Instagram DM là conversion path ưu tiên.
- Content: Hanoi utility, local discovery, photography; series Field Notes VJ (identity duyệt 04/10).

## Chỉ số (2026-11-06 mốc 22:45 ICT, nguồn: Meta Graph API v26.0 & GA4 Data API)

| Chỉ số | Giá trị |
|---|---|
| GA4 MTD lũy kế (01/10–06/11) | **412 users**, **838 sessions** (+8 sessions so với 05/11 · tăng trưởng liên tục), **2.950 views** (+16 views); thời lượng phiên duy trì đỉnh cao **344,2s (~5m44s)**, bounce rate tiếp tục hạ sâu còn **53,10%**; `/booking` 162 views, `/booking/details` **131 views**, `/tours` **428 views** (+4 views), `/tour/spiritual-west-lake-breeze` **161 views**, `/tour/food-tour` **125 views**, `/tour/french-colonial-historical-footsteps` **100 views**, `/tour/cinematic-hanoi-visual-storytelling-walk` **57 views** |
| Form booking gửi đi | 0 ghi nhận đối soát cọc |
| IG reach 24h mốc 22:45 ICT | **3.245 accounts** (+24,8% so với 2.601 lúc chiều; đỉnh ngày: 4.391 accounts) [Xanh] |
| IG views 24h mốc 22:45 ICT | **5.058 views** (+27,8% so với 3.957 lúc chiều; đỉnh ngày: 6.984 views) [Xanh] |
| IG accounts engaged 24h | **169 accounts** (+30 accounts so với chiều 139; tương tác sâu) [Xanh] |
| Lượt xem trang cá nhân IG (24h) | 25 visits [Vàng] |
| Follower live (22:45 ICT 06/11) | FB **3.088** (+1 mới, +14 trong 24h; **+728 / +30,8%** vs 2.360 ngày 23/10), IG **604** (lập đỉnh mới **604 followers** · **216 media** (+4 Reels mới đăng chiều tối 06/11)) |
| Reels mới đăng 06/11 | *5 Michelin spots under $5* (6 likes IG, 1 comment), *Food IS culture* (3 likes IG, 1 comment), *Hanoi traffic 2x speed #1* (3 likes IG), *Hanoi traffic 2x speed #2* (0 likes IG, mới đăng 25p), *Phơmen cocktail Tây Hồ* (17 likes IG, 1 comment), *Craving Bánh Mì* (18 likes IG, 1 comment) |
| Lead Pipeline phát sinh | **17 leads** (100% 17/17 leads đã tiếp cận; bao gồm khách Rebecca Spinola đã được chăm sóc qua Messenger) |
| Booking / doanh thu đã đối soát | **0** |

Lưu ý: GA4 vẫn có traffic kiểm thử nội bộ localhost:8093 chưa được lọc (5/19 phiên ngày 28/10).

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
