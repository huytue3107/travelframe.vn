# Gói kiến thức cho Agent 2 (Research và Content)

Owner: Marketing-Growth · Cập nhật 2026-10-08 · Mục đích: Agent 2 đào sâu bằng toàn bộ kiến thức TravelFrame trước khi viết bất kỳ nội dung nào. Chỉ đọc, không sao chép nguồn canonical.

## 1. Thứ tự đọc bắt buộc (nguồn chuẩn)
Canonical: `/Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame/` (đọc theo `Brand-Strategy/Source-Of-Truth-Map.md`, 00 đến 14):
brand, audience và funnel, sản phẩm và trải nghiệm khách, chính sách vận hành, content system, **06 Safety và Verified Travel Facts**, **11 Proof và Approved Claims**, 13 ví dụ và feedback, 14 metric. Mâu thuẫn thì ghi lại, không tự chọn nguồn.
Ngoài ra: `Executive/Current-State.md`, `Data-Analytics/Metric-Definitions.md`.

## 2. Kho tri thức nội dung và thị trường (`Research-Insights/Library/knowledge/`)
- `voice-playbook.md`, `patterns.md`, `ideas-backlog.md`: giọng, mẫu hook, ý tưởng đã có.
- `2026-09-17-customer-evidence-synthesis.md`, `2026-09-26-customer-evidence-synthesis.md`: bằng chứng khách hàng.
- `2026-09-17-mined-social-comments.json`, `2026-09-26-meta-social-comments-audit.json`: comment thật đã khai thác.
- `threads-high-engagement-comments.json`: 35 mô-típ comment hiệu quả.
- `2026-09-genz-travel-slang-trends.md`, `2026-09-22-seo-market-intelligence-and-dataset-synthesis.md`, `Market-Intelligence-Action-Plan-2026-09-17.md`.
- `2026-09-17-hanoi-local-places-directory.md`, `2026-09-18-vietnam-street-crossing-scraped-data.json`: dữ liệu địa điểm và thực địa.
- `2026-10-01-competitor-fb-evaluated.json`: đối thủ Facebook đã chấm.
- Thư viện kênh và video: `Research-Insights/Library/{channels,videos,transcripts,analysis,evaluation}`, `Research-Insights/Competitive/`.

## 3. Số liệu hiệu quả của chính kênh
- `Data-Analytics/Reports/2026-10-07-Fanpage-October-MTD-McKinsey-Report.md` (bài mẹo thực dụng là động cơ reach).
- `2026-10-07-Facebook-Content-And-Comment-Audit.md`, `2026-10-08-Instagram-Copyright-Risk-Audit.md`.
- `Marketing-Growth/Published-Ledger.md`, `Marketing-Growth/Content/Threads-Outcome-Tracking.md`, `Data-Analytics/Threads-Session-Evaluations.md`.
- Kế hoạch: `Marketing-Growth/Plans/` (đặc biệt Content-Direction-Plan, Threads-14-Day-Sprint, Solo-Female-Hanoi-14-Day, Field-Notes-B2).

## 4. Skill nghiên cứu nên dùng (`.claude/skills/`)
`content-learning`, `comment-mining`, `outlier-post-finder`, `competitor-social-research`, `competitor-profiling`, `trend-discovery`, `social-listening-brief`, `audience-research`, `customer-research`, `transcript-intelligence`, `product-demand-research`, `creator-profile-teardown`. Subagent có sẵn: `channel-scout`, `video-analyst`, `channel-evaluator`, `content-writer`.

## 5. Quy tắc nghiên cứu
1. Mọi nhận định ghi nguồn (đường dẫn file hoặc URL) và mức tin cậy (quan sát trực tiếp, suy luận, giả định).
2. Số liệu có ngày (giá, giờ, visa, thời tiết, giao thông) phải re-check gần ngày đăng. Không có nguồn thì bỏ.
3. Mỗi gói giao cho Agent 3 phải đủ: chủ đề, chuỗi khung hoặc nội dung cuối cùng, nguồn fact-check, cơ chế tương tác, điểm tự kiểm. Agent 3 không tự nghiên cứu hay sửa nội dung.
