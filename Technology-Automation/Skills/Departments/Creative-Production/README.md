# Creative Production Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Sản xuất Sáng tạo (Creative Production).

## 1. Trách Nhiệm Phòng Ban
Creative Production chịu trách nhiệm sản xuất hình ảnh, video ngắn (Reels, TikTok), tài liệu thiết kế (Carousels, Infographics, PDF Briefs) và kiểm soát chất lượng thẩm mỹ theo nhận diện thương hiệu TravelFrame theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `creative-production-qa` | Kiểm định toàn diện chất lượng tài sản sáng tạo | Trước mọi handoff | Không tự gắn Published |
| `visual-asset-pipeline` | Tìm ảnh stock Pexels hoặc render ảnh AI | Khi cần visual | Rocky duyệt API trả phí |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Kiểm định chất lượng bộ ảnh Carousel trước khi đưa vào chiến dịch"* -> Kích hoạt `creative-production-qa`
- *"Tìm 5 bức ảnh chụp phố cổ Hà Nội chất lượng cao trên Pexels"* -> Kích hoạt `visual-asset-pipeline`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Creative-Production/README.md](../../../../Creative-Production/README.md)
- Brief chiến dịch trong `Marketing-Growth/Campaigns/`
- Cẩm nang nhận diện thương hiệu TravelFrame

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Tài sản hình ảnh: `Creative-Production/Assets/`
- Sản phẩm bàn giao: `Creative-Production/Deliverables/`
- Biên bản QA: `Creative-Production/Review/<project>/`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Sử dụng các dịch vụ tạo ảnh AI trả phí (Nano Banana/Midjourney).
- [ ] Phê duyệt xuất bản bộ ảnh/video ra các kênh truyền thông chính thức.
- [ ] Mua bản quyền hình ảnh hoặc thuê thiết bị vượt ngân sách dự toán.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
campaign-brief (Marketing)
  -> visual-asset-pipeline (Curate ảnh/video)
  -> Thiết kế / Biên tập
  -> creative-production-qa (Kiểm định 6 trục)
  -> Rocky Phê Duyệt
  -> Handoff sang Marketing
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Tiếp nhận Production Index từ Campaign Brief của Marketing.
2. Dùng `visual-asset-pipeline` tuyển chọn các khung hình đạt chuẩn Indochine hoài cổ.
3. Thiết kế bộ Carousel 5 trang và dựng 1 video ngắn 15s.
4. Chạy `creative-production-qa` rà soát chính tả, màu sắc, safe area và bản quyền.
5. Lập báo cáo QA, đính kèm mã SHA-256 của file xuất xưởng và trình duyệt.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Text tràn ra ngoài Safe Area:** Phụ đề video bị che mất bởi thanh công cụ của Instagram.
- **Sử dụng nhạc dính bản quyền thương mại:** Dùng nhạc trend cá nhân cho bài chạy quảng cáo gây khóa tài khoản.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Biên bản QA đạt kết luận PASS hoặc PASS_WITH_NOTES.
- [ ] File đặt tên đúng quy chuẩn `TF-[PROJECT]-[ASSET]-[VERSION]`.
- [ ] Kiểm tra checksum SHA-256 chính xác.
