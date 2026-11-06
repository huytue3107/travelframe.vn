# First Coffee in Hanoi — Adam v02

Ngày 2026-11-03 · Review, chưa duyệt đăng. Thay giọng Samantha bằng ElevenLabs Adam (`pNInz6obpgDQGcFmaJgB`), model `eleven_multilingual_v2`. Một lần tạo cho sáu câu, sau đó cắt thành sáu đoạn dựa trên alignment do ElevenLabs trả về; đặt vào sáu cảnh và kéo dài thời gian phụ đề theo giọng mới. Giữ video v01, nhạc tạm và các SFX.

File: `TF-First-Coffee-Hanoi-Adam-v02.mp4`, SHA-256 `844d771271c6aa3268992be4c306807c1775670a5ec61ee815afab117a049cec`. FFprobe: H.264 1080×1920 30 fps, AAC, 34 giây; giải mã toàn file không lỗi. FFmpeg đo -15.39 LUFS và true peak -1.60 dBTP. Kiểm tra máy cho thấy mỗi đoạn giọng nằm gọn trong cảnh; chưa nghe kiểm tra độc lập phát âm, nhịp, mix và điểm cắt.

Nhạc nền vẫn là nhạc tạm chưa xác minh được trang cấp phép cụ thể; không coi bản này là sẵn sàng đăng. Các hạn chế về ảnh AI, màu chữ, SFX và safe area trong `REVIEW.md` vẫn áp dụng. HyperFrames lint: 0 lỗi, 8 cảnh báo cấu trúc đã tồn tại. `npm test`: 158/158, `npm run test:skills`: 15/15; `npm run workspace:check` báo đường dẫn tuyệt đối do HyperFrames ghi trong `.hyperframes/video-state.json:351`, một file lịch sử tự sinh của chính dự án này.
