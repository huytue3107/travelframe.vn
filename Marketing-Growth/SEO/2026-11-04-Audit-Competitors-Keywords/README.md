---
title: TravelFrame — Audit, đối thủ và từ khoá
owner: Marketing-Growth
status: Review
created: 2026-11-05
data_date: 2026-11-04
---

# TravelFrame: ưu tiên hoàn thiện trang dịch vụ trước khi mở rộng bài viết

Nghiên cứu bằng OpenSEO, kiểm tra dữ liệu và website ngày 04/11/2026; hoàn thiện báo cáo ngày 05/11. Folder mang ngày bắt đầu nghiên cứu. Đề xuất đang ở trạng thái Review, chưa sửa website.

## Mở báo cáo

| Báo cáo | Nội dung |
|---|---|
| [Audit website](audit.html) | Hai ưu tiên, vấn đề kỹ thuật, Search Console, GA4, bằng chứng và giới hạn |
| [Nghiên cứu đối thủ](competitors.html) | SweetEscape, Localgrapher, Very Dep, Hoa Tran; phân biệt dịch vụ và nội dung |
| [Nghiên cứu từ khoá](keywords.html) | Từ ưu tiên, nhóm nội dung, trang đích và 34 từ đã tổng hợp |
| [Danh sách từ khoá CSV](keywords.csv) | Số liệu, nguồn, ngày và trang gợi ý để tái sử dụng |

## Ba quyết định đề xuất

1. **Hoàn thiện `/hanoi-photoshoot`:** đồng bộ giá với quyết định Approved còn hiệu lực, đưa ảnh Harry và case Hanna/Thin lên trang, giải thích hỗ trợ tạo dáng và có một lời mời liên hệ rõ ràng. Lợi ích là giúp khách quyết định; chưa có phép đo tăng booking.
2. **Thêm bản đồ gốc vào Old Quarter guide:** tuyến đi, điểm dừng, cách lưu và lựa chọn trời mưa; tận dụng các case ảnh đã có.
3. **Sửa ngôn ngữ/template theo phạm vi cụ thể:** bản `?lang=vi` chưa dịch, H1 của tour và mâu thuẫn itinerary. Giữ Santorini đang có thứ hạng tốt.

## Dữ liệu chính và cách đọc

- Audit mới kiểm tra 100 URL, tất cả trả 200; 200 ghi nhận vấn đề thuộc 9 loại, không phải 200 trang lỗi. Không chạy Lighthouse hoặc render JavaScript.
- Google Mỹ/en/desktop ngày 04/11: `photographer in hanoi` #15; `hanoi photographer` #28; `santorini park hanoi` #3. `hanoi photoshoot` không thấy trong 31 kết quả organic trả về, không suy ra nằm ngoài top 100.
- Search Console 04–31/10, Pacific Time, mọi thị trường/thiết bị: 17 click, 299 impressions. Trang photoshoot có 1 click/37 impressions.
- GA4 Organic Search cùng ngày lịch theo Asia/Saigon: 76 sessions so với 24 trong kỳ 28 ngày trước. Có khả năng traffic nội bộ; 0 key events không chứng minh 0 booking.
- Volume là ước tính Mỹ, phần lớn tái dùng dữ liệu tháng 10. Từ không có số liệu được ghi unknown; không cộng các biến thể dùng chung volume.
- Thị trường đối thủ chỉ được đọc định hướng từ mẫu SERP. Không xác minh chất lượng dịch vụ, thị phần hoặc hiệu quả doanh thu của đối thủ.

## Bằng chứng và kiểm tra

- [OpenSEO evidence](evidence.json): crawl, GSC, GA4, live SERP, cached metrics và dữ liệu đối thủ.
- [Public page evidence](public-pages.json): sitemap 61 URL và 18 HTML công khai đã đọc.
- [Opportunity shortlist](opportunities.md): lý do xếp ưu tiên và phản biện runner-up.
- [Validation](Validation.md): kết quả kiểm tra và trạng thái lưu.

Nghiên cứu sử dụng 282 credits theo chênh lệch số dư 6.881 → 6.599; không phải hoá đơn từng call. Không chạy lại nghiên cứu trả phí khi tiếp tục sau gián đoạn.

## Trạng thái lưu OpenSEO

Báo cáo HTML đã lưu local đầy đủ và đã lưu thành công lên OpenSEO ngày 05/11/2026. Đã đọc lại title, skill, kích thước và trạng thái private của cả ba bản:

- [SEO Audit — Nov 5, 2026](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/reports/22ec8beb-3491-440c-be55-19728660ea6c) — 19.612 bytes.
- [Competitive Landscape — Nov 5, 2026](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/reports/044aff12-13c7-44f9-a881-75332f755d0d) — 18.005 bytes.
- [Keyword Research — Nov 5, 2026](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/reports/602e0bbc-621d-4f7d-b1f7-b249e59cf944) — 22.023 bytes.

Lịch sử: ngày 05/11, bộ kiểm duyệt tự động từ chối lần lưu đầu vì cần Rocky cho phép rõ việc gửi dữ liệu GSC/GA4, giá và thông tin vận hành nội bộ vào dự án OpenSEO `travelframe.sidevn.com`. Sau câu hỏi nêu rõ phạm vi này, Rocky xác nhận: “oke lưu báo cáo đi”. Ba lần lưu được phép thực hiện và đều thành công; không chia sẻ công khai.

Chưa ghi research log: auto-review từ chối thao tác cập nhật bộ nhớ chung vì Rocky mới duyệt lưu ba báo cáo, chưa duyệt ghi dữ liệu nội bộ vào context riêng. Không thử lại thao tác này. Ba báo cáo vẫn đã lưu thành công và private; báo cáo và bằng chứng local đủ để tái sử dụng. Không sửa business overview/roadmap, lưu từ khoá, thay đổi tracker hoặc sửa website. Không tốn thêm credits nghiên cứu trong bước lưu; ba đường dẫn trên yêu cầu quyền vào dự án OpenSEO.
