# Spot check · 2026-11-02

## Đã kiểm tra

- MCP `get_travelframe_connection`: Facebook Page 1409099405611405 và IG Business 17841438272497512 khớp tài sản TravelFrame trong runbook.
- `get_instagram_profile`: username travelframe.vn, follower snapshot 595, media_count 203.
- `list_instagram_media`: phân trang tới hết feed trả về, 201 ID duy nhất; 105 bài tháng 10, 96 bài tháng 9. Lưu trường cần thiết trong source-posts.json.
- `list_facebook_page_posts`: 100 bài; trường shares chỉ có ở 26 bài. Không coi missing là 0.
- `list_facebook_post_comments`: ba bài Flambé, Survival Guide, street food. Phản hồi không có next page; chỉ kết luận trên các comment được trả về, không gán unique users.
- Meta Business Suite trang Published, Last 90 days, xác nhận đúng tên travelframe.vn. Có các hàng crossposted FB/IG và cả hàng tài khoản khác (ví dụ creator carousel), nên không lấy bảng hỗn hợp này làm baseline cho TravelFrame.

## Chưa xác minh được

- Web fetch ba permalink IG Flambé, gọi món, từ chối lịch sự đều trả Cache miss; public URL spot check unavailable. Số chính đến từ API đã xác thực, không tuyên bố public page đã xác minh độc lập.
- Business Suite tạo export Facebook Post/Lifetime/Creation date, 1–31/10; UI nói Dates are shown in Pacific Time. Export báo complete, nhưng download không trả file và browser session sau đó bị unattached. Không dùng số từ file export chưa tải được, không dùng Pacific window thay ICT.
- Script test-publish-capability đã chạy nhưng báo không tìm thấy token trong Keychain ở môi trường local. Connector read-only vẫn đọc dữ liệu thành công; không coi đây là bằng chứng token đang hết hạn hay tài khoản mất quyền. Không thay đổi hoặc truy xuất token.
- Agent Reach CLI không có sẵn. Nguồn thu thập là connector chuyên dụng và Business Suite chỉ đọc; không dùng paid scraper/API bên ngoài.

## Giới hạn đánh giá

Không có dữ liệu media insights từng bài và không xem video, nên không chấm rubric video/production hay lập hai rating như một audit creative đầy đủ. Run có trạng thái partial, hoàn thành phần tìm outlier tương tác và phân tích caption/comment. Không suy luận rằng hook, nhạc hoặc nhịp dựng gây ra kết quả.
