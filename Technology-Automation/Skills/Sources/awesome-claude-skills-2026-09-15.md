# Source Audit: awesome-claude-skills Snapshot (2026-09-15)

- **Repository:** `https://github.com/travisvn/awesome-claude-skills`
- **Ngày kiểm tra:** 2026-09-15
- **Commit hash:** `1da55aa810f206d3fe2005e7e3989b15a275d942`
- **Người kiểm tra:** Technology-Automation Lead
- **Bản quyền root:** Không có file LICENSE chuẩn được GitHub API nhận diện.
- **Phân loại chung:** `research-index` (Danh mục tham khảo ý tưởng, KHÔNG copy nội dung).

---

## 1. Đánh Giá Chi Tiết Từng Nguồn Khảo Sát

| Nguồn / Dự Án | Phạm Vi Khảo Sát | Giấy Phép | Quyết Định | Sao Chép Mã | Đánh Giá Rủi Ro & Ghi Chú |
|---|---|---|---|---|---|
| `travisvn/awesome-claude-skills` | README, danh mục link | Không có LICENSE | `research-index` | **Không** | Chỉ dùng làm mục lục tra cứu ý tưởng nghiệp vụ. |
| `obra/superpowers` | Planning, TDD, Execution | MIT | `dependency` | **Không** | Dùng như runtime sub-skill trong môi trường agent. |
| Anthropic Document Skills | Xử lý DOCX, PDF, XLSX | Proprietary / Official | `dependency` | **Không** | Dùng khi thao tác với tài liệu Office, không vendor vào repo. |
| `webapp-testing` / Playwright | Browser testing workflows | Apache 2.0 / MIT | `adapt` | **Không** | Tiếp thu pattern viết `web-experience-qa` cho TravelFrame. |
| `mcp-builder` patterns | Khung thiết kế MCP tools | MIT | `adapt` | **Không** | Tiếp thu pattern hợp đồng dữ liệu cho `integration-design`. |
| `internal-comms` / Doc co-authoring | Mẫu tài liệu quản trị | MIT | `adapt` | **Không** | Tiếp thu cấu trúc văn bản cho Executive và Operations. |
| `web-asset-generator` | Tạo tài nguyên web | MIT | `defer` | **Không** | `visual-asset-pipeline` hiện tại đã bao phủ nhu cầu. |
| D3 Visualization Skills | Vẽ biểu đồ D3 | BSD-3-Clause | `defer` | **Không** | Chưa có nhu cầu dashboard phức tạp ở Phase 1. |
| Loki Mode / Startup Swarm | Multi-agent swarms | Unlicensed | `reject` | **Không** | Quyền hạn quá rộng, phá vỡ Company OS và approval gates. |
| Security / Fuzzing Skills | Quét bảo mật tự động | Nhiều loại | `defer` | **Không** | Chuyển sang chuyên đề bảo mật độc lập sau Phase 1. |
| iOS / Expo / shadcn | Lập trình ứng dụng di động | MIT | `reject` | **Không** | Nằm ngoài phạm vi dịch vụ web hiện tại của TravelFrame. |

---

## 2. Kết Luận Kiểm Định Phase 1

1. **100% Mã nguồn nội bộ:** Toàn bộ 12 kỹ năng mới và các scripts phụ trợ trong Phase 1 đều được viết mới hoàn toàn, thuộc sở hữu nội bộ (`license: project-internal`).
2. **Không có mã độc hại:** Không có dependency bên ngoài không rõ nguồn gốc được vendor trực tiếp vào repository.
