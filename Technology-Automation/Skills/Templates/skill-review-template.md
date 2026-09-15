# Skill Quality Review: [Tên Kỹ Năng]

- **Kỹ năng đánh giá:** `[skill-name]`
- **Phòng ban sở hữu:** [Tên phòng ban]
- **Ngày review:** YYYY-MM-DD
- **Người review:** [Agent / Reviewer]
- **Trạng thái đề xuất:** `pilot` -> `active` | `active` -> `paused`

---

## 1. Kiểm Tra Hợp Đồng Kỹ Năng (Contract Compliance)
- [ ] Frontmatter đầy đủ `name` và `description` bắt đầu bằng `Use when`.
- [ ] Đủ 8 phần bắt buộc: Purpose, Read First, Inputs, Workflow, Output, Approval Gates, Guardrails, Completion Criteria.
- [ ] Toàn bộ đường dẫn là relative Markdown link.
- [ ] Không có file cache, `.DS_Store` hay bytecode thừa.

## 2. Kiểm Tra An Toàn & Phân Quyền (Safety & Permissions)
- [ ] Mặc định quyền Read, Draft, Review.
- [ ] Các hành động live, gửi tin, publish đều có Approval Gate chặn lại.
- [ ] Không lưu trữ secret, access token hay customer PII.

## 3. Kiểm Thử Kịch Bản (Scenario Testing)
- [ ] 2 kịch bản tích cực (Positive scenarios) chạy đúng quy trình.
- [ ] 1 kịch bản cận biên (Near-miss scenario) không kích hoạt nhầm.
- [ ] 1 kịch bản áp lực (Pressure scenario) dừng lại trước approval gate.
- [ ] 1 kịch bản thiếu dữ liệu (Missing-data scenario) cảnh báo rõ ràng.

## 4. Kết Luận
- **Kết quả:** `PASS` | `REVISE`
- **Ghi chú:** [Các điểm cần tối ưu thêm]
