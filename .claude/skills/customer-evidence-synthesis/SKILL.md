---
name: customer-evidence-synthesis
description: Use when synthesizing customer problems, triggers, objections, and verbatim quotes from qualitative feedback, reviews, sales inquiries, and campaign interactions.
---

# Customer Evidence Synthesis

## Purpose
Tổng hợp các vấn đề cốt lõi, động lực mua hàng (triggers), rào cản tâm lý (objections) và ngôn ngữ thực tế của du khách từ các nguồn bằng chứng định tính (tin nhắn tư vấn, đánh giá thực tế, phản hồi sau tour), chuyển hóa thành tri thức phục vụ định vị thương hiệu.

## Read First
- `Brand-Strategy/Source-Of-Truth-Map.md`
- `Executive/Current-State.md`
- Các tài liệu tổng hợp persona hiện có

## Inputs
- Bằng chứng thô: Phản hồi khách hàng sau tour, tin nhắn hỏi đáp tư vấn (đã ẩn danh tính PII), đánh giá trên Tripadvisor/Google Maps.
- Dữ liệu phản hồi từ các chiến dịch quảng cáo.

## Workflow
1. Thu thập dữ liệu bằng chứng, đảm bảo ĐÃ ẨN TOÀN BỘ PII (email, số điện thoại, tên đầy đủ).
2. Phân loại bằng chứng theo lược đồ `references/evidence-schema.md`: Problem, Trigger, Objection, Verbatim Quote, Segment (Solo, Couple, Family, Creator).
3. Đánh giá mức độ tin cậy (Confidence Level: High/Medium/Low) dựa trên số lần lặp lại độc lập.
4. Lập báo cáo tổng hợp tri thức khách hàng.
5. Đề xuất cập nhật vào hồ sơ khách hàng mục tiêu của Brand Strategy.

## Output
- Đường dẫn: `Research-Insights/Library/knowledge/YYYY-MM-DD-customer-evidence-synthesis.md`

## Approval Gates
- Việc cập nhật chính thức vào Brand Persona Canonical Source cần sự phê duyệt của Brand Lead / Rocky.

## Guardrails
- Tuyệt đối KHÔNG biến một bình luận riêng lẻ thành sự thật đại diện cho toàn bộ phân khúc khách hàng (persona fact).
- Mọi insight bắt buộc phải dẫn chiếu (pointer) tới nguồn bằng chứng cụ thể và có mốc thời gian.
- Không lưu trữ bất kỳ thông tin cá nhân định danh (PII) nào vào kho tài liệu Git.

## Completion Criteria
- Báo cáo tổng hợp tri thức hoàn chỉnh theo schema chuẩn.
- Có tối thiểu 3 nhóm phát hiện rõ rệt kèm verbatim trích dẫn.
- Toàn bộ dữ liệu tuân thủ quy định bảo mật thông tin khách hàng.
