# Phân tích video 28549149988100280

Ngày: 2026-11-02. Trạng thái: `analyzed_sampled`. Owner: Research-Insights. Nguồn: [Facebook gốc](https://www.facebook.com/reel/28549149988100280).

## 1. Tổng quan

Video của Nghề Content, định dạng giải thích bằng lời dẫn và hình ghép. Thời lượng ffprobe: 582.9 giây. Phân tích phục vụ nghiên cứu format, không xác minh lời khuyên marketing của tác giả.

## 2. Timeline quan sát

Mọi mốc là **ước lượng**, uniform sampling có thể chọn ảnh lệch khỏi nhãn nhiều giây. Focused pass ưu tiên cho hook/kết. Chữ trên màn hình được đọc riêng với transcript.

| Mốc ước lượng | Hình quan sát | Lời nói | Chữ trên màn hình | Evidence |
|---|---|---|---|---|
| ~0.0s | Hook dùng lưới video với số được khoanh để minh họa vấn đề. | Chưa đồng bộ từng câu; xem ASR máy | Chỉ kết luận từ hình được liên kết | [hook/0](hook/frame_0001.jpg) |
| ~4.0s | Bốn mốc màu trên một trục, kèm mèo chỉ tay. | Chưa đồng bộ từng câu; xem ASR máy | Chỉ kết luận từ hình được liên kết | [hook/4](hook/frame_0005.jpg) |
| ~200.4s | Clip thực hành cạnh danh sách các biến số minh họa. | Chưa đồng bộ từng câu; xem ASR máy | Chỉ kết luận từ hình được liên kết | [frames/11](frames/frame_0012.jpg) |
| ~574.8s | Danh sách quy trình xuất hiện trong khung kết. | Chưa đồng bộ từng câu; xem ASR máy | Chỉ kết luận từ hình được liên kết | [ending/0](ending/frame_0001.jpg) |

Transcript có 20 phân đoạn ASR. Đã đối chiếu đoạn mở/đoạn kết về chủ đề; không kiểm tra từng từ của toàn bộ lời nói. Lưu ý chất lượng: ASR chia đoạn 30 giây; một số từ ngành và từ lóng sai, không coi mốc là đồng bộ từng từ.

## 3. Hook và cấu trúc

Hook dùng chữ có phân cấp và hình minh họa/cutout. Các mốc trong bảng cho thấy đổi tình huống và cách chốt phần cuối. Không dùng dữ liệu lượt xem để suy ra nguyên nhân hiệu quả. Cấu trúc được suy ra từ hình đã xem kết hợp chủ đề trong ASR và báo cáo Gemini; không phải transcript câu-với-cảnh hoàn chỉnh.

## 4. Format và sản xuất

Quan sát trực tiếp: nền giấy nhăn sáng, tiêu đề xanh lơ viền đậm, chữ phụ màu đen, ảnh cắt nền/meme, thẻ hoặc screenshot và clip minh họa. Các biến thể được trỏ trong timeline. Không xác định tên font, phần mềm, plugin hay thời lượng animation chính xác.

Audio là **quan sát máy thứ cấp của watch/Gemini**, được Rocky cho phép phân tích cả 5 video trong chat. Không suy ra âm từ transcript hay ảnh. ~0:03: Âm kiểu thud theo chữ nhấn.; ~0:04: Âm kiểu whoosh theo chuyển sang sơ đồ.; ~1:23–1:25: Gemini mô tả audio của đoạn meme.

Các mốc SFX chưa được người nghe độc lập xác nhận; tham chiếu [bản ghi Gemini](gemini-answer.md). Không coi nguồn giọng người thật/AI là đã xác minh.

## 5. Caption bài đăng

Caption được lấy từ metadata Facebook qua yt-dlp, đối chiếu đúng native ID trong `posts.json`; trạng thái matching: `matched`. Nội dung cùng chủ đề đang phân tích, lưu trong [source.json](source.json). Caption không thay thế bằng chứng hình/âm và không xác minh hiệu quả của lời hứa.

## 6. Thống nhất, mâu thuẫn và claim chưa xác minh

- ASR xác định đúng hướng chủ đề chung nhưng chứa lỗi từ, nhất là từ lóng và tên riêng. Provenance verified chỉ xác nhận nguồn file/engine, không có nghĩa transcript đúng từng từ.
- Metadata không có subtitle nền tảng; không tự gọi phần chữ minh họa trên hình là phụ đề toàn bộ lời nói.
- Mốc từ báo cáo Gemini và uniform frames là ước lượng; dùng file video gốc khi cần đặt cut/cue.
- Mọi claim về thuật toán, kết quả, view, tốc độ phát triển kênh hoặc giọng người/AI vẫn là chưa xác minh. Không chuyển thành lời hứa cho TravelFrame.
- Xem giới hạn riêng trong [analysis.json](analysis.json), đặc biệt chất lượng ASR và trạng thái audio.

## 7. Bài học cho TravelFrame

Chuyển hướng dẫn du lịch thành vài bước có tiến trình và một thẻ tổng kết.

Đây là đề xuất suy luận, chưa được phê duyệt thành quy chuẩn. Áp dụng tiếng Anh ngắn, giọng người bạn địa phương, dữ kiện và hình ảnh đúng trải nghiệm. Xem [nghiên cứu tổng hợp](../../2026-11-02-TravelFrame-Video-Format-Study.md) để so sánh ba hướng.

## 8. Nguồn và giới hạn

- Hình: trực tiếp đọc 46 frame; các pass và toàn bộ index ở [frames.json](frames.json), có contact sheet tổng quan và focused hook/kết.
- Media, fingerprint, caption và các trạng thái thiếu: [source.json](source.json).
- Lời nói: [provenance](transcript/provenance.json); ASR máy có mốc gần đúng, chưa human-reviewed toàn bộ.
- Audio/motion: nguồn máy riêng nêu ở mục 4; hình gốc ưu tiên nếu có mâu thuẫn. Không có stem/project để xác nhận cấu trúc âm.
- Phạm vi: đúng video do Rocky chỉ định; không đánh giá retention hoặc quan hệ nhân quả với lượt xem, không lấy/đăng lại asset nguồn cho TravelFrame.

