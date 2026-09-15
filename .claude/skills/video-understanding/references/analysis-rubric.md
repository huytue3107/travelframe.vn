# Rubric phân tích — format analysis.md (8 mục) và analysis.json

## analysis.md — 8 mục bắt buộc, tiếng Việt, quote giữ nguyên ngôn ngữ nguồn

1. **Tổng quan** — video nói gì, dành cho ai, thông điệp chính (1-3 câu).
2. **Bảng timeline** — cột: mốc thời gian (ước lượng) | cảnh quan sát | lời nói |
   chữ màn hình | evidence (frame index / transcript line).
3. **Hook & cấu trúc** — hook hình ảnh, hook lời nói, hook caption; vấn đề →
   triển khai → kết luận/CTA.
4. **Format & sản xuất** — bố cục chữ, B-roll, chuyển cảnh quan sát được.
   KHÔNG suy luận nhạc/giọng/nhịp audio chỉ từ transcript.
5. **Caption bài đăng** — bổ sung gì, CTA, hashtag, quan hệ với video.
6. **Thống nhất / mâu thuẫn / claim cần kiểm chứng** — giá, địa điểm, ưu đãi…
   Không khẳng định địa điểm chỉ vì caption gọi tên.
7. **Bài học cho TravelFrame** — câu ngắn, ấm, thực tế, hơi vui; giữ Ý TƯỞNG làm
   nội dung, không sao chép câu chữ; không dùng claim chưa xác minh. Không tự viết post.
8. **Nguồn & giới hạn** — frame đã đọc (index/timestamp ước lượng), coverage,
   gaps, trạng thái.

## analysis.json

- Mỗi observation: `{kind: "visual"|"speech"|"screen_text"|"caption",
  timestamp_estimate, text, evidence: {frame_index | transcript_path+line | record}, }`
- Suy luận tách riêng: `{kind: "inference", basis: [...], reason: "..."}`
- Chỉ số engagement (nếu dataset có): ghi nguồn + ngày lấy; KHÔNG dùng làm bằng chứng
  "hook gây viral".

## Trạng thái kết thúc

| Trạng thái | Khi nào |
|---|---|
| `analyzed_sampled` | Đủ 7 bước, coverage đạt, mọi claim có bằng chứng |
| `partial` | Thiếu vision/caption/lời nói, hoặc hết budget 200 ảnh |
| `blocked` | Không đọc được file, không có dữ liệu nào phân tích được |

## Tiêu chí chấm điểm report

- ✅ Mỗi claim có evidence pointer thật (frame xem rồi, không phải frame "lân cận").
- ✅ Timestamp ước lượng luôn được gắn nhãn.
- ✅ Suy luận không trộn lẫn quan sát; missing data được ghi.
- ❌ Trừ điểm: suy luận nhạc/tông giọng từ transcript; kết luận địa điểm từ caption;
  mô tả chi tiết video chưa từng xem.
