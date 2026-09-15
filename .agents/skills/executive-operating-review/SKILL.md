---
name: executive-operating-review
description: Use when synthesizing an Executive Operating Review covering Progress, Plans, Problems (PPP), open decisions, blockers, and core metrics for a specific reporting period.
---

# Executive Operating Review

## Purpose
Tổng hợp bức tranh vận hành định kỳ của TravelFrame theo khung PPP (Progress - Plans - Problems), rà soát các quyết định còn mở, các điểm nghẽn (blockers) và chỉ số kinh doanh then chốt giữa 9 phòng ban.

## Read First
- `Executive/Current-State.md`
- Báo cáo cập nhật từ các phòng ban trong chu kỳ báo cáo
- `Data-Analytics/Measurement-Framework.md` và các snapshot gần nhất

## Inputs
- Chu kỳ báo cáo (tuần, tháng, quý)
- Tiến độ hoàn thành công việc từ 9 phòng ban
- Kế hoạch ưu tiên của chu kỳ tiếp theo
- Trở ngại, rủi ro và các quyết định P0/P1 còn tồn đọng
- Số liệu đo lường thực tế (Leads, Bookings, Doanh thu, Chi phí)

## Workflow
1. Đọc `Executive/Current-State.md` để xác định các mục tiêu P0/P1 và proof gaps hiện có.
2. Thu thập dữ liệu vận hành từ các phòng ban sở hữu (Marketing, Sales, Operations, Tech...).
3. Phân định rạch ròi giữa: Sự thật khách quan (Fact), Diễn giải (Interpretation), Đề xuất (Recommendation), và Quyết định cần đưa ra (Decision Needed).
4. Lập bản tổng hợp theo mẫu `templates/operating-review.md`.
5. Đánh dấu rõ các chỉ số ước tính hoặc thiếu bằng chứng đối soát.

## Output
- Đường dẫn: `Executive/Snapshots/YYYY-MM-DD-Operating-Review.md`

## Approval Gates
- Báo cáo vận hành dùng để hỗ trợ ra quyết định; mọi điều chỉnh mục tiêu chiến lược P0 cần Rocky phê duyệt.

## Guardrails
- Tuyệt đối KHÔNG coi số liệu tiếp cận (reach) hay tương tác (engagement) mạng xã hội là lượt đặt tour (booking) hoặc doanh thu.
- Không che giấu các vấn đề (Problems) hoặc làm đẹp số liệu.
- Mọi nhận định về doanh thu phải dựa trên dữ liệu cọc/thanh toán có chứng từ.

## Completion Criteria
- Báo cáo hoàn tất tại `Executive/Snapshots/YYYY-MM-DD-Operating-Review.md`.
- Cấu trúc PPP phân định rõ ràng giữa fact và recommendation.
- Liệt kê đầy đủ blockers và các quyết định cần Rocky giải quyết.
