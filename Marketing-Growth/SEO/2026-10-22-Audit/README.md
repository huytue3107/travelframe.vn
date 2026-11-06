---
title: TravelFrame OpenSEO Audit 2026-10-22
owner: Marketing-Growth
status: Review
date: 2026-10-22
---

# OpenSEO audit, 22/10/2026

[Báo cáo trong OpenSEO](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/reports/35493e4e-d0bc-4641-af8a-ed829b0e9385). Bản HTML cục bộ là snapshot cùng nội dung đã lưu, không thay report trong project.

- [Crawl](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/audit?auditId=581260f5-31b6-4060-a79e-0e73edfd3cfd): 100 URL, 12 assets, tất cả 200; 172 issue instances/10 types, không critical trong mẫu. Không Lighthouse, không crawl có render JavaScript.
- Search Console URL Inspection xác nhận photoshoot và Old Quarter **Submitted and indexed**. Không quy kết nhân quả cho một chỉnh sửa cụ thể. Kỳ hiệu suất 22/09–19/10 PT chưa đo kết quả sau sửa 20/10.
- Ưu tiên đồng bộ bảng giá Approved 21/10 với website/booking, sau đó bổ sung bản đồ Old Quarter. Không sửa giá hay website trong audit này. Source-dependent template vẫn chờ máy chứa Drupal/theme.

## Evidence và giới hạn

- [evidence.json](evidence.json): dữ liệu audit/GSC/SERP, trích nguyên quyết định Approved, snapshot trang dịch vụ và dữ liệu booking/tour công khai. Không có credential hoặc dữ liệu booking khách.
- [opportunities.md](opportunities.md): shortlist và lý do lựa chọn; [report.html](report.html): báo cáo hoàn chỉnh.
- [Ảnh đầu trang photoshoot](photoshoot-first-screen.png): không thấy portfolio ở viewport đầu; 0 thẻ img trong HTML main không loại trừ gallery động/ảnh nền ở phần khác.
- 5 SERP Mỹ/en desktop depth20, 13–15 organic/mẫu, chưa thấy TravelFrame. Không kết luận vắng toàn bộ top20 organic. Volume tái dùng research13/10.
- Đọc pricing/booking, homepage, hiringguide, tour JSON, OldQuarter, Santorini EN/VI, TaHien, photo-spots CTA, sitemap. Đối chiếu LocalLens và MapsHanoi; không quy tính năng thành nguyên nhân xếp hạng.
- Reviewer độc lập đã yêu cầu làm rõ thứ tự Tours/map, lưu provenance giá và giới hạn kết luận ảnh; đã sửa trước khi save_report.

## Kiểm tra local

- HTML validation: PASS; 23.574 bytes khi lưu OpenSEO, không script/external assets, toàn bộ liên kết và rail hợp lệ.
- `npm run test:skills`: 15/15 PASS. `npm run workspace:check`: PASS toàn bộ trong lượt chạy 22/10, khác trạng thái baseline 20/10.
- `npm test`: **157/158 PASS**, một test ngoài phạm vi SEO thất bại: `separate plan-store instances cannot both consume one approval` (meta-ads-plan-store.test.mjs:838). Lỗi ENOENT đối với lifecycle.lock thay vì expected replay/consumed. Chạy riêng đúng test: **1/1 PASS**. Chưa xác định nguyên nhân; không gọi full suite là đạt và không sửa mã MCP trong task audit.
- Không chỉnh source Drupal, gửi booking thật, bật tracker/automation, chuyển domain, stage hoặc push. Bản report Review không phải approval triển khai.

## Nguồn có thẩm quyền

[Quyết định bảng giá](../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md) và [batch sửa 20/10](../2026-10-20-Audit-Fixes/README.md). Giữ nguyên báo cáo 20/10 để đối chiếu lịch sử; hai mẫu crawl khác 4 URL mỗi phía nên không diễn giải 175→172 thành điểm cải thiện toàn website.
