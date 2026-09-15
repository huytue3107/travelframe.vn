# ManyChat Flow Review Checklist

Bảng kiểm tra 8 tiêu chí chuẩn mực cho kịch bản tự động hóa tin nhắn TravelFrame.

## 1. Trigger & Keyword Specificity
- [ ] Từ khóa kích hoạt cụ thể (ví dụ: `HANOIPHOTO`, `AUTUMN`, `TOURGUIDE`), tránh từ đơn quá phổ biến gây kích hoạt nhầm.
- [ ] Xử lý phân biệt chữ hoa/thường và lỗi gõ phím nhẹ.

## 2. Value-First Opening Message
- [ ] Tin nhắn đầu tiên chào đón thân thiện, xưng danh TravelFrame rõ ràng.
- [ ] Cung cấp ngay giá trị đã hứa trong quảng cáo (bản đồ, cẩm nang, bảng giá).

## 3. Lightweight Qualification
- [ ] Hỏi tối đa 2 câu hỏi sàng lọc nhanh (Thời gian dự kiến, Đi mấy người).
- [ ] Có các nút bấm nhanh (Quick Replies) để khách bấm tiện lợi trên điện thoại.

## 4. Human Handoff Routing
- [ ] Có nút rõ ràng: "Chat with our local team" / "Gặp tư vấn viên".
- [ ] Khi khách bấm gặp người thật, bot tự động Pause flow và gửi thông báo cho nhân viên trực inbox.

## 5. Fallback Handling
- [ ] Khi khách gõ nội dung bot không hiểu, tin nhắn phản hồi lịch sự hướng dẫn chọn lại hoặc chuyển máy cho tư vấn viên.

## 6. Tags & Custom Field Mapping
- [ ] Gắn tag nguồn chiến dịch chính xác (ví dụ: `camp_meta_autumn_2026`).
- [ ] Lưu ngày chụp vào Custom Field định dạng ngày tháng hợp lệ.

## 7. 24-Hour Policy Compliance
- [ ] Tuân thủ chính sách cửa sổ tin nhắn 24 giờ của Meta; không gửi tin nhắn quảng cáo ngoài khung giờ cho phép mà không có Message Tag hợp lệ.

## 8. Emergency Stop Condition
- [ ] Khách gõ `STOP`, `UNSUBSCRIBE` hoặc thể hiện sự khó chịu -> Bot dừng ngay lập tức.
