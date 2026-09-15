# TravelFrame Skills Catalog

Danh mục toàn bộ 27 kỹ năng (Agent Skills) của TravelFrame được phân bổ theo 9 phòng ban nghiệp vụ.

---

## 1. Executive

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `executive-decision-record` | Biến đề xuất thành decision record có cấu trúc | `Executive/DEC-YYYYMMDD-SHORT-SLUG.md` | Rocky duyệt trước khi chuyển `Approved` | Proposed | [Executive Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Executive/README.md) |
| `executive-operating-review` | Tổng hợp báo cáo vận hành định kỳ PPP | `Executive/Snapshots/YYYY-MM-DD-Operating-Review.md` | Không tự coi reach là booking | Proposed | [Executive Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Executive/README.md) |

---

## 2. Brand Strategy

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `offer-governance` | So sánh và đối chiếu cấu trúc giá, gói dịch vụ, SLA | `Brand-Strategy/Offers-Pricing/` | Rocky duyệt mọi thay đổi giá và policy mới | Proposed | [Brand Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Brand-Strategy/README.md) |
| `customer-evidence-synthesis` | Tổng hợp problem, trigger, objection từ bằng chứng | `Research-Insights/Library/knowledge/` | Không biến bình luận riêng lẻ thành persona fact | Proposed | [Brand Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Brand-Strategy/README.md) |

---

## 3. Research Insights

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `channel-evaluation` | Đánh giá kênh phân phối nội dung | `Research-Insights/Library/` | Không tự chạy paid scrape | Active | [Research Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Research-Insights/README.md) |
| `competitive-landscape` | Lập bản đồ bối cảnh đối thủ SEO & thị trường | `Research-Insights/Competitive/` | Nguồn ngoài chỉ cung cấp pattern | Active | [Research Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Research-Insights/README.md) |
| `competitor-analysis` | Phân tích dấu ấn organic của một đối thủ cụ thể | `Research-Insights/Competitive/` | Giữ nguyên bằng chứng gốc | Active | [Research Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Research-Insights/README.md) |
| `content-learning` | Trích xuất tri thức và pattern từ tài nguyên | `Research-Insights/Library/knowledge/` | Không ghi đè raw evidence | Active | [Research Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Research-Insights/README.md) |
| `video-understanding` | Phân tích video tham khảo và bóc tách insight | `Research-Insights/Library/transcripts/` | Bảo toàn bundle hình ảnh trích xuất | Active | [Research Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Research-Insights/README.md) |

---

## 4. Marketing Growth

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `campaign-brief` | Tạo brief chiến dịch tiếp thị tích hợp trước khi sản xuất | `Marketing-Growth/Campaigns/CMP-YYYYMM-SLUG/` | Offer phải được duyệt trước | Proposed | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `content-writing` | Viết bài blog và nội dung truyền thông | `Marketing-Growth/Content/Drafts/` | Rocky duyệt trước khi Publish | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `humanizer` | Biên tập văn phong tự nhiên, loại bỏ AI-tone | Thay thế nội dung draft hiện hành | Không làm sai lệch fact và claim | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `keyword-clustering` | Gom nhóm từ khóa theo search intent | `Marketing-Growth/Content/Clusters/` | Tuân thủ OpenSEO context | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `keyword-research` | Nghiên cứu và sàng lọc từ khóa tiềm năng | `Marketing-Growth/Content/Drafts/` | Tuân thủ OpenSEO context | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `link-prospecting` | Tìm kiếm cơ hội backlink và đối tác liên kết | `Marketing-Growth/Content/Link-Prospects/` | Mọi outreach chỉ là Draft | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `local-seo` | Đánh giá tối ưu hóa hiện diện Google Maps | `Marketing-Growth/Plans/` | Không tự ý sửa Google Business Profile | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `seo-audit` | Kiểm toán SEO toàn diện cho domain | Báo cáo HTML tại review folder | Không tự động xuất bản báo cáo | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `seo-coach` | Tư vấn và định hướng workflow SEO | Phản hồi tương tác trong chat | Không xem coaching là approved strategy | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |
| `seo-project-setup` | Khởi tạo cấu hình và ngữ cảnh dự án OpenSEO | Cập nhật context OpenSEO | Review quyền ghi của MCP | Active | [Marketing Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md) |

---

## 5. Creative Production

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `creative-production-qa` | Kiểm định chất lượng asset trước handoff | `Creative-Production/Review/<project>/qa-<run>.md` | Không tự gắn mác Published | Proposed | [Creative Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Creative-Production/README.md) |
| `visual-asset-pipeline` | Tìm ảnh Pexels hoặc render ảnh Nano Banana | `Creative-Production/Assets/` | Rocky duyệt trước khi dùng API trả phí | Active | [Creative Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Creative-Production/README.md) |

---

## 6. Sales CRM

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `lead-qualification` | Đánh giá chất lượng inbound lead và tạo handoff | `Sales-CRM/Scripts/` hoặc `Sales-CRM/Funnels/` | Không lưu PII thật trong Git, không tự gửi tin | Proposed | [Sales Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Sales-CRM/README.md) |
| `manychat-flow-review` | Kiểm tra flow ManyChat trước khi bật live | `Sales-CRM/Automation/ManyChat/<flow>/review.md` | Rocky duyệt trước khi bật flow live | Proposed | [Sales Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Sales-CRM/README.md) |

---

## 7. Technology Automation

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `integration-design` | Thiết kế MCP, connector hoặc automation | `Technology-Automation/Runbooks/` | Mặc định read-only, duyệt thay đổi ghi live | Proposed | [Tech Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Technology-Automation/README.md) |
| `web-experience-qa` | Kiểm thử giao diện website qua browser automation | QA report và screenshots tại review folder | Không submit form thật trên live web | Proposed | [Tech Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Technology-Automation/README.md) |

---

## 8. Data Analytics

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `campaign-performance-report` | Tổng hợp báo cáo hiệu quả chiến dịch | `Data-Analytics/Campaign-Results/<id>/report.md` | Bắt buộc ghi rõ period và limitations | Proposed | [Analytics Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Data-Analytics/README.md) |

---

## 9. Operations

| Kỹ Năng | Trigger Sử Dụng | Output Dự Kiến | Approval Gate | Trạng Thái | Hướng Dẫn |
|---|---|---|---|---|---|
| `sop-change-control` | Quản trị thay đổi quy trình SOP có rollback | `Operations/Runbooks/` hoặc `Operations/Change-Management/` | Thay đổi quyền/redesign cần Rocky duyệt | Proposed | [Operations Guide](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Operations/README.md) |
