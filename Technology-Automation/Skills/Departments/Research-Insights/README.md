# Research Insights Skills Playbook

Tài liệu hướng dẫn sử dụng và phối hợp các kỹ năng dành cho phòng ban Nghiên cứu & Dữ liệu Tri thức (Research Insights).

## 1. Trách Nhiệm Phòng Ban
Research Insights chịu trách nhiệm thu thập bằng chứng thị trường, phân tích đối thủ cạnh tranh, nghiên cứu xu hướng và lưu trữ tài nguyên tri thức (Library, Transcripts, Analysis, Knowledge runs) theo [WORKSPACE-MAP.md](../../../../WORKSPACE-MAP.md).

## 2. Danh Sách Kỹ Năng Thường Dùng
| Kỹ Năng | Mục Đích Chính | Mức Độ Sử Dụng | Cổng Phê Duyệt |
|---|---|---|---|
| `video-understanding` | Bóc tách transcript, ảnh chụp và cấu trúc video | Theo đợt nghiên cứu | Giữ nguyên bằng chứng gốc |
| `content-learning` | Trích xuất pattern và idea vào kho tri thức | Hàng tuần | Cập nhật backlog |
| `channel-evaluation` | Đánh giá tiềm năng kênh và đối thủ | Định kỳ | Không tự chạy paid scrape |
| `competitive-landscape` | Lập bản đồ thị trường và từ khóa đối thủ | Hàng tháng | Tham khảo chiến lược |
| `competitor-analysis` | Phân tích sâu một đối thủ cụ thể | Khi có đối thủ mới | Giữ nguyên provenance |

## 3. Câu Lệnh Kích Hoạt Mẫu (Sample Triggers)
- *"Phân tích video YouTube này và lưu toàn bộ transcript cùng ảnh chụp"* -> Kích hoạt `video-understanding`
- *"Rút trích các pattern thành công từ tài liệu phân tích quảng cáo"* -> Kích hoạt `content-learning`
- *"Đánh giá dấu ấn SEO và bộ từ khóa của đối thủ Hanoi Photoshoot"* -> Kích hoạt `competitor-analysis`

## 4. Tài Liệu Cần Đọc Trước (Read First)
- [Research-Insights/README.md](../../../../Research-Insights/README.md)
- [Research-Insights/Library/knowledge/patterns.md](../../../../Research-Insights/Library/knowledge/patterns.md)
- [Research-Insights/Library/knowledge/ideas-backlog.md](../../../../Research-Insights/Library/knowledge/ideas-backlog.md)

## 5. Vị Trí Lưu Trữ Đầu Ra (Output Paths)
- Transcripts: `Research-Insights/Library/transcripts/<slug>/`
- Phân tích video: `Research-Insights/Library/analysis/<slug>/`
- Knowledge Runs: `Research-Insights/Library/knowledge/runs/<run-date>/`
- Nghiên cứu đối thủ: `Research-Insights/Competitive/`

## 6. Khi Nào Bắt Buộc Phải Hỏi Rocky
- [ ] Sử dụng các dịch vụ scraping trả phí hoặc công cụ bên ngoài ngoài phạm vi cho phép.
- [ ] Xóa bỏ các snapshot lịch sử hoặc video đã tải về máy.

## 7. Quy Trình Ghép Nối Nhiều Kỹ Năng (Chained Workflows)
```text
video-understanding
  -> content-learning (Trích xuất Pattern/Ideas)
  -> competitive-landscape
  -> Bàn giao cho Marketing-Growth (Campaign Brief)
```

## 8. Ví Dụ Một Nhiệm Vụ Hoàn Chỉnh (End-to-End Walkthrough)
1. Tiếp nhận URL video nghiên cứu chiến lược Meta Ads.
2. Dùng `video-understanding` tải transcript, bóc tách 13 ảnh sơ đồ thuật toán.
3. Dùng `content-learning` tạo file `learning.md`, cập nhật các pattern mới vào `patterns.md` và ý tưởng vào `ideas-backlog.md`.
4. Chạy validator để xác nhận không có broken link hoặc lỗi format.

## 9. Các Lỗi Thường Gặp Cần Tránh
- **Ghi đè bằng chứng cũ:** Xóa file transcript cũ để ghi đè bản mới.
- **Copy văn phong đối thủ:** Lấy nguyên xi câu chữ của đối thủ mà không bản địa hóa theo định vị TravelFrame.

## 10. Checklist Bàn Giao (Handoff Checklist)
- [ ] Đầy đủ bundle hình ảnh minh họa trích xuất từ video.
- [ ] Cập nhật ID pattern và ideas backlog theo mã liên tục.
- [ ] Chạy `npm test` và `npm run workspace:check` đạt PASS.
