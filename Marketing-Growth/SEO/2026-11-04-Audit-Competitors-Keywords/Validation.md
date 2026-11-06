---
title: Validation — SEO research batch
owner: Marketing-Growth
status: Review
created: 2026-11-05
---

# Validation

- `npm test`: 158/158 pass; exit 0.
- `npm run test:skills`: 15/15 pass; exit 0.
- `npm run workspace:check`: 10 nhóm pass ở lượt trước khi tạo README này; chạy lại sau cùng ở bên dưới.
- HTML kiểm tra cấu trúc, title/H1, anchors, link attributes, không có external resources/script, kết thúc đầy đủ và CSS đúng starter template.
- CSV có 34 dòng từ khoá; label couple đã đồng bộ với provider intent `navigational`, nhận định thương mại được ghi riêng.
- Reviewer độc lập xác nhận số liệu audit/GSC/GA4/SERP và lập luận service trước map. Đã sửa label intent, khoảng trắng và làm rõ ba query match tương ứng hai tiêu đề trang.
- Quyết định giá Approved 21/10 đã được agent chính đối chiếu trực tiếp với `Executive/DEC-20261021-HOURLY-TIER-PRICING.md`; reviewer chỉ kiểm tra các file bằng chứng được giao.

## Lưu và phạm vi

- `save_report`: ba báo cáo đã lưu thành công sau khi Rocky xác nhận “oke lưu báo cáo đi” cho phạm vi dữ liệu nội bộ đã nêu. Lần từ chối trước đó được giữ trong lịch sử README. Không có public sharing.
- `get_report`: đọc lại cả ba bản; title, skill và bytes khớp file local; `shareUrl: null` xác nhận private. IDs: audit `22ec8beb-3491-440c-be55-19728660ea6c`, competitors `044aff12-13c7-44f9-a881-75332f755d0d`, keywords `602e0bbc-621d-4f7d-b1f7-b249e59cf944`.
- Research log chưa cập nhật: auto-review từ chối vì đây là ghi bộ nhớ chung ngoài phạm vi duyệt lưu ba báo cáo. Không retry hoặc đi đường vòng. Không thay đổi strategy hoặc website.
- Không thử form, tạo booking, payment, website mutation, outreach hoặc recurring tracking.
- Không stage, commit hoặc push; thay đổi không thuộc batch được giữ nguyên.
- Không tuyên bố đã kiểm tra giao diện render hoặc toàn bộ website ngoài mẫu.

## Kiểm tra cuối

- Sau khi tạo README, `npm run workspace:check` chạy lại: cả 10 nhóm PASS, exit 0.
- Ba HTML: audit 19.612 bytes; competitors 18.005 bytes; keywords 22.023 bytes. Cấu trúc, CSS, title/H1 và link attributes PASS.
- CSV 34 dòng, couple provider intent đã thống nhất; JSON chứa 100 crawl pages và 10 SERP outcomes: PASS.
- `git diff --check -- Marketing-Growth/SEO/2026-11-04-Audit-Competitors-Keywords`: exit 0. Đây là kiểm tra scoped, không tuyên bố workspace sạch.
