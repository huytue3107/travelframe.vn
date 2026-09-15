# TravelFrame Skills Governance Framework

Tài liệu quy định vòng đời, tiêu chuẩn an toàn và quy trình quản trị kỹ năng (Agent Skills) của TravelFrame.

---

## 1. Vòng Đời Kỹ Năng (Skill Lifecycle)

Mỗi kỹ năng trong TravelFrame tuân thủ các trạng thái vòng đời sau:

```text
proposed -> pilot -> active -> paused -> deprecated -> archived
```

1. **`proposed`**: Kỹ năng đang được đề xuất hoặc nghiên cứu; chưa có mã nguồn hoặc SKILL.md chính thức trong repo.
2. **`pilot`**: Kỹ năng đang trong giai đoạn thử nghiệm có giám sát; yêu cầu review từng output trước khi áp dụng rộng rãi.
3. **`active`**: Kỹ năng đã vượt qua các bộ kịch bản kiểm thử (pressure/near-miss scenarios) và được đưa vào sử dụng chính thức.
4. **`paused`**: Tạm dừng sử dụng do phát hiện lỗi logic, thay đổi chính sách hoặc API upstream gặp sự cố.
5. **`deprecated`**: Kỹ năng chuẩn bị thay thế bởi phiên bản hoặc công cụ mới hơn; có replacement pointer.
6. **`archived`**: Đã ngừng sử dụng hoàn toàn và chuyển vào tài liệu lịch sử.

---

## 2. Quy Trình Thêm & Nâng Cấp Kỹ Năng

```text
research -> source audit -> pressure scenarios -> pilot -> review -> active
```

1. **Research:** Xác định nhu cầu thực tế của phòng ban, khảo sát pattern từ cộng đồng hoặc nội bộ.
2. **Source Audit:** Kiểm tra bản quyền, license, cam kết không copy code vi phạm bản quyền từ repo bên ngoài (áp dụng template `source-audit-template.md`).
3. **Pressure Scenarios:** Thiết lập tối thiểu 5 kịch bản (2 positive, 1 near-miss, 1 pressure, 1 missing-data) trong `activation-scenarios.json` để kiểm tra khả năng dừng trước approval gates.
4. **Pilot:** Triển khai vào `.agents/skills/`, khai báo trong manifest với trạng thái `pilot`.
5. **Review:** Đánh giá kết quả thực tế qua 1-2 tuần sử dụng, xác nhận không có drift hay side effect.
6. **Active:** Chuyển trạng thái sang `active` trong manifest sau khi Rocky phê duyệt.

---

## 3. Cổng Phê Duyệt & Giới Hạn Quyền (Approval Gates & Guardrails)

Mặc định, mọi kỹ năng chỉ được hoạt động ở quyền **Read, Draft, Review**.

### Hành động BẮT BUỘC dừng chờ Rocky phê duyệt:
- **Publish:** Đăng bài viết blog, post mạng xã hội, video lên bất kỳ nền tảng công khai nào.
- **Gửi tin nhắn (External Outreach):** Gửi email, tin nhắn Instagram DM hoặc tin nhắn hợp tác đối ngoại.
- **Sửa dữ liệu Live:** Sửa đổi Google Business Profile, bật/sửa kịch bản ManyChat đang live, sửa database sản xuất.
- **API trả phí:** Gọi bất kỳ API trả phí nào chỉ để kiểm thử (ví dụ: tạo ảnh AI Midjourney/Nano Banana có phí).
- **Phá hủy/Xóa dữ liệu:** Xóa file, thay đổi quyền truy cập, tạo remote Git hoặc thực hiện `git push`.

---

## 4. Nguyên Tắc Progressive Disclosure

Để tránh làm quá tải context window của mô hình AI:
- `SKILL.md` chỉ chứa hướng dẫn cốt lõi, use-condition, input/output contract và workflow chính.
- Hướng dẫn chi tiết, tài liệu tham khảo dài đặt trong thư mục con `references/`.
- Mã lệnh, script phụ trợ đặt trong thư mục con `scripts/`.
- Mẫu báo cáo, template kết quả đặt trong thư mục con `templates/`.
