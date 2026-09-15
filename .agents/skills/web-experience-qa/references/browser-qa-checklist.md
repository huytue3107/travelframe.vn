# Browser QA Checklist

Danh mục kiểm tra trải nghiệm người dùng trên website TravelFrame.

## 1. Responsive Layout & Visual Polish
- [ ] Hiển thị hoàn hảo trên Mobile Viewport (375px, 390px, 414px) và Desktop (1440px).
- [ ] Không có hiện tượng chữ tràn khung hoặc đè lên ảnh (text overlap).
- [ ] Thanh điều hướng (Navbar) và nút Booking luôn bấm được mượt mà trên mobile.

## 2. Booking Configurator Logic
- [ ] Chọn `Visual Package` (Photo Phone, Explorer, Complete, VIP) tính đúng đơn giá giờ.
- [ ] Chọn `Tour Package` (Experience, Standard, Plus, Premium) tính đúng giá nền.
- [ ] Tổng tạm tính hiển thị chính xác theo công thức niêm yết.
- [ ] Gói `Customize` hiển thị đúng chỉ dẫn liên hệ báo giá riêng.

## 3. Navigation & Links
- [ ] Tất cả các liên kết nội bộ (Tours, About, Contact, FAQ) hoạt động chuẩn, không có lỗi 404.
- [ ] Nút dẫn sang Instagram hoặc WhatsApp mở đúng tài khoản TravelFrame chính thức.

## 4. Performance & Console Health
- [ ] Thời gian tải trang ban đầu (LCP) dưới 2.5 giây trên mạng 4G.
- [ ] Không có lỗi nghiêm trọng (Uncaught Exception) trong Developer Console.
- [ ] Toàn bộ hình ảnh được tối ưu định dạng hiện đại (WebP/AVIF), có thẻ alt đầy đủ.
