---
name: campaign-performance-report
description: Use when consolidating cross-channel marketing campaign performance reports by joining ad platform snapshots, web analytics, and confirmed booking revenue.
---

# Campaign Performance Report

## Purpose
Tổng hợp và chuẩn hóa báo cáo hiệu quả chiến dịch tiếp thị đa kênh bằng cách kết nối dữ liệu chi phí quảng cáo (Meta Ads), dữ liệu lưu lượng trang web (Google Analytics) và doanh thu đặt tour thực tế từ CRM thành một bức tranh duy nhất có mốc thời gian và định nghĩa chỉ số minh bạch.

## Read First
- `Data-Analytics/Measurement-Framework.md`
- Báo cáo chiến dịch trong `Marketing-Growth/Campaigns/`
- Snapshot dữ liệu gần nhất trong `Data-Analytics/Snapshots/`

## Inputs
- Mã định danh chiến dịch (`CMP-YYYYMM-SHORT-SLUG`)
- Khoảng thời gian báo cáo (Reporting Period: Ngày bắt đầu đến ngày kết thúc)
- Snapshot chi phí từ Meta Ads Manager (Chi tiêu, Impressions, Clicks, Message Conversations Started)
- Snapshot lưu lượng từ GA4 (Sessions, Users, Engagement Rate, Events)
- Báo cáo doanh thu thực tế từ Sales CRM (Tiền cọc, Tổng giá trị tour, Số lượng booking)

## Workflow
1. Thu thập dữ liệu từ các nguồn đã lưu vết (dated snapshots).
2. Kiểm tra tính đồng nhất của múi giờ (Timezone) và chu kỳ ngày giữa các bảng dữ liệu.
3. Tính toán các chỉ số tài chính và tiếp thị cốt lõi:
   - **Blended MER (Marketing Efficiency Ratio):** `Tổng Doanh Thu Booking / Tổng Chi Phí Ads`.
   - **CAC thực tế (Customer Acquisition Cost):** `Tổng Chi Phí Ads / Số Confirmed Bookings`.
   - **Cost per Lead (CPL):** `Tổng Chi Phí Ads / Số Inbound Inquiries`.
   - **Tỷ lệ chuyển đổi phễu (Funnel Conversion Rate):** `Inquiries -> Bookings`.
4. Lập báo cáo chi tiết theo mẫu `templates/performance-report.md`.
5. Nêu rõ các giới hạn dữ liệu (Limitations) và độ trễ quy kết (Attribution Lag).

## Output
- Báo cáo hiệu quả: `Data-Analytics/Campaign-Results/<campaign-id>/report-<period>.md`

## Approval Gates
- Báo cáo phục vụ hỗ trợ ra quyết định; các điều chỉnh ngân sách lớn dựa trên báo cáo cần Rocky phê duyệt.

## Guardrails
- Tuyệt đối KHÔNG cộng gộp các snapshot khác chu kỳ thời gian hoặc khác định nghĩa chỉ số vào làm một.
- Không suy đoán lượt tiếp cận (Reach) hay lượt nhấp (Clicks) thành doanh thu giả định.
- Phải ghi nhận rõ nguồn gốc dữ liệu (Provenance) và thời điểm chụp snapshot.

## Completion Criteria
- Báo cáo đầy đủ 8 mục tiêu chuẩn, có bảng tổng hợp số liệu trực quan.
- Ghi rõ hạn chế của dữ liệu và cảnh báo nếu mẫu dữ liệu quá nhỏ.
- Có khuyến nghị thực tiễn dựa trên dữ liệu cho đội ngũ Marketing.
