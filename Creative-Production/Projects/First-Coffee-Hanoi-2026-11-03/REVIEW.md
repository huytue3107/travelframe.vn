# First Coffee in Hanoi — bản render xem thử

Ngày 2026-11-03 · Trạng thái: Review, chưa được duyệt đăng.

Bản 34 giây, 1080 × 1920, 30 fps, H.264/AAC. Theo sáu cảnh storyboard «First coffee in Hanoi · Bản bám mẫu» và lời dẫn hiện trong ứng dụng ngày dựng; rút nhịp từ khoảng 45 xuống 34 giây. Hình mèo và các ly cà phê là ảnh AI minh họa, không phải footage thực tế. Tiêu đề đã nằm trong ảnh AI nên tông đỏ có sai lệch, chưa thể coi là màu #AE2A1D chính xác. Chữ TRAVELFRAME bổ sung bằng #AE2A1D; đó là chữ đánh máy, không phải logo gốc.

Chuyển động dùng hai lớp cắt từ mỗi ảnh đã ghép sẵn: tiêu đề và nhóm hình, xuất hiện theo nhịp; không phải hoạt họa độc lập của từng mèo, ly, thìa hoặc dòng sữa. Có 6 tiếng pop và 3 whoosh, không có tiếng rót, thìa hoặc không gian quán thực; giọng tiếng Anh là giọng hệ thống Samantha. Màu sắc và cách hiện hình là bản thử gần mẫu, không tuyên bố tái tạo chính xác chuyển động/âm thanh video nguồn.

## Nguồn âm thanh

- Pop và whoosh: thư viện đi kèm `/Users/macbook/.agents/skills/media-use/audio/assets/sfx/`; `CREDITS.md` của thư viện ghi nguồn Pixabay Content License, nhưng chưa đối chiếu trang nguồn cụ thể của từng file.
- Nhạc tạm `assets/music-temp.mp3` sao chép từ dự án nội bộ An Khang Việt. Ghi chú mã nguồn của dự án đó ghi Mixkit Free Music licence; chưa tìm được tên bài, tác giả hoặc trang cấp phép cụ thể. Chỉ dùng cho bản review, cần thay hoặc xác minh trước khi đăng.
- Voice: giọng tổng hợp macOS Samantha chạy trên máy; cần nghe và duyệt phát âm.

## QA

1. Nội dung: các câu khuyên hỏi tùy lựa chọn tại quán, không nêu giá hoặc khẳng định mọi cửa hàng có cùng tùy chọn. Chưa có xác nhận chuyên môn/biên tập.
2. Thương hiệu: màu chữ trong ảnh AI gần đỏ, không chuẩn mã màu; logo bổ sung là chữ thuần.
3. Kỹ thuật: ffprobe xác nhận 34 s, H.264 1080 × 1920, 30 fps, AAC; decode toàn bộ không lỗi. SHA-256 `74f15d25f93d2d98a1f6e3f250cc1987a8db3be4669a16e41be1ce43212ff0cd`.
4. Vùng an toàn: đã xem snapshot cả sáu cảnh, song phụ đề tại y=1390 có thể bị giao diện nền tảng che trên một số thiết bị; cần kiểm tra trong ứng dụng trước khi đăng.
5. Bản quyền: nhạc tạm và SFX cần xác minh nguồn cụ thể; hình AI chỉ là minh họa, không suy ra là ảnh địa điểm thật.
6. Âm thanh: file có voice, nhạc, pop, whoosh. Đo bằng FFmpeg: tích hợp -14.10 LUFS, true peak -1.41 dBTP. Chưa nghe kiểm tra độc lập toàn bộ, không khẳng định giọng/mix hoặc SFX tương đồng hoàn toàn với mẫu.

HyperFrames check: không lỗi lint, runtime hoặc layout; có cảnh đứng hình quá 3 giây và cảnh báo cấu trúc một file. Bản này để Rocky nghe/xem và góp ý, chưa đạt kiểm định phát hành. Cảnh yếu nhất là cảnh 5: ảnh menu và mèo dính trong một lớp, hiệu ứng không tách từng vật thể như storyboard; muốn khớp mẫu hơn cần làm lại thành các lớp độc lập.

Workspace checks: `npm test` 158/158; `npm run test:skills` 15/15; `npm run workspace:check` pass tại thời điểm kiểm tra.
