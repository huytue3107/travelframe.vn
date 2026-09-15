---
name: campaign-brief
description: Use when creating an integrated marketing campaign brief package (Brief, Decisions, Production-Index, Results-And-Learnings) before content and creative production begin.
---

# Campaign Brief

## Purpose
Thiết lập bộ tài liệu khởi động chiến dịch tiếp thị hoàn chỉnh (Campaign Brief Package) nhằm đồng bộ mục tiêu, đối tượng mục tiêu, thông điệp cốt lõi, yêu cầu sáng tạo, ngân sách và chỉ số đo lường giữa Marketing và Creative Production trước khi tiến hành sản xuất tài nguyên.

## Read First
- `Brand-Strategy/Source-Of-Truth-Map.md`
- Các gói dịch vụ và bảng giá đã được duyệt trong `Brand-Strategy/Offers-Pricing/`
- Kế hoạch tiếp thị tổng thể trong `Marketing-Growth/Plans/`
- Kết quả và bài học từ các chiến dịch trước

## Inputs
- Tên chiến dịch và mã định danh (`CMP-YYYYMM-SHORT-SLUG`)
- Mục tiêu kinh doanh và mục tiêu marketing (Leads, Bookings, MER, CAC)
- Phân khúc khách hàng mục tiêu và thị trường địa lý (Inbound Pre-trip vs In-destination)
- Gói dịch vụ trọng tâm (Offer)
- Kênh phân phối chính (Meta Ads, Instagram Organic, SEO Blog)
- Ngân sách dự kiến và thời gian triển khai

## Workflow
1. Kiểm tra trạng thái phê duyệt của gói dịch vụ trọng tâm. Nếu gói dịch vụ chưa được Rocky duyệt, gắn nhãn chiến dịch là `Blocked` cho đến khi có quyết định chính thức.
2. Khởi tạo thư mục chiến dịch tại `Marketing-Growth/Campaigns/CMP-YYYYMM-SHORT-SLUG/`.
3. Tạo 4 file thành phần theo mẫu chuẩn:
   - `Brief.md`: Mục tiêu, thông điệp, kênh, ngân sách, CTA, tiêu chí đo lường.
   - `Decisions.md`: Ghi nhận các quyết định thiết kế chiến dịch và lý do.
   - `Production-Index.md`: Danh mục tài sản sáng tạo cần sản xuất (Assets manifest).
   - `Results-And-Learnings.md`: Bộ khung ghi nhận kết quả và bài học rút ra.
4. Chuyển hồ sơ chiến dịch tới Rocky để phê duyệt ngân sách và định hướng.

## Output
- Thư mục: `Marketing-Growth/Campaigns/CMP-YYYYMM-SHORT-SLUG/`
- Chứa: `Brief.md`, `Decisions.md`, `Production-Index.md`, `Results-And-Learnings.md`

## Approval Gates
- **BẮT BUỘC có sự phê duyệt của Rocky** đối với ngân sách và thông điệp chiến dịch trước khi kích hoạt sản xuất tài nguyên hoặc chạy quảng cáo.
- Không được chạy chiến dịch dựa trên gói giá chưa được duyệt.

## Guardrails
- Không tự ý tạo thêm thư mục nếu mã chiến dịch đã tồn tại.
- Không cam kết mức CPA hoặc ROAS phi thực tế khi thiếu cơ sở lịch sử.
- Đảm bảo các tuyên bố (claims) về dịch vụ phải tuân thủ nghiêm ngặt Source-Of-Truth.

## Completion Criteria
- Thư mục chiến dịch có đủ 4 file thành phần với cấu trúc chuẩn hóa.
- Brief xác định rõ ràng chỉ số thành công (Primary Metric, Guardrail Metric).
- Trạng thái chiến dịch ghi nhận rõ ràng (Draft / Review / Blocked / Approved).
