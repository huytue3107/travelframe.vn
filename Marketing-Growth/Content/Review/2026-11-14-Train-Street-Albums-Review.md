---
title: Rà soát 2 album Train Street trên website
owner: Marketing-Growth
status: Review
date: 2026-11-14
requested_by: Rocky ("Rà 2 album", chat 14/11/2026)
scope: Chỉ đọc. Chưa sửa gì trên site.
---

# Kết luận

**Có vi phạm.** Album 119 và album 51 đang Published. Cả hai hiện trên trang /gallery, gắn nhãn "Local Experience Route". Có 3 ảnh khách đứng, nhảy hoặc ngồi **trên đường ray**. Ảnh bìa album 119, cảnh cặp đôi đi trên ray, còn hiện ở **trang chủ**, khối "Moments we've captured".

Các quy định bị vi phạm:

- [Voice & Style Guide 22/10](../../../Brand-Strategy/2026-10-22-TravelFrame-Voice-And-Style-Guide.md): Train Street bắt buộc "không lên đường ray".
- Quyết định của Rocky ngày 14/11 cho bộ Viator: không dùng ảnh trên đường ray.
- Bối cảnh OpenSEO (positioning): không thực hiện hoặc quảng bá việc chụp ảnh trên đường ray Train Street.

Nhãn "Local Experience Route" khiến khách hiểu Train Street là một điểm trong tuyến tour TravelFrame bán. Điều này trái quy định không bán tour hay buổi chụp gắn với hành lang đường sắt.

Không tìm thấy hồ sơ duyệt đăng 2 album này trong workspace.

# Chi tiết

## Album 119: "Hanoi Train Street – A Romantic Local Experience"

Published, tạo ngày 10/11/2026 lúc 09:34 (admin). URL `/album/hanoi-train-street-romantic-local-experience` chuyển hướng 301 về /gallery. Album chỉ hiện dưới dạng ô ảnh trên /gallery và mở ra xem trong lightbox.

| Ảnh | Nội dung | Đánh giá |
|---|---|---|
| DSC04501-13 (ảnh bìa, cũng hiện ở trang chủ) | Cặp đôi nắm tay đi giữa hai thanh ray | Vi phạm |
| DSC04524-14 | Cặp đôi nhảy, chân đặt trên ray | Vi phạm |
| DSC04536-15 | Cặp đôi ôm nhau, đường ray ngay phía sau | Có thể đang đứng trong hành lang ray; nên bỏ |
| DSC04194-7 | Cặp đôi trên ban công quán, tàu chạy sát bên | Không lên ray, nhưng là buổi chụp ở Train Street |
| DSC04266-9 | Như trên, khách cầm điện thoại chụp; watermark 102 | Không lên ray, nhưng là buổi chụp ở Train Street |
| DSC04435-10 | Cặp đôi ngồi trước cửa chớp; watermark 102 | Không thấy ray |

## Album 51: "Night in Hanoi Train Street"

Published, tạo ngày 26/8/2026 lúc 11:18 (admin). URL album cũng chuyển hướng 301 về /gallery.

| Ảnh | Nội dung | Đánh giá |
|---|---|---|
| DSC00484-2 (ảnh bìa) | Người mẫu trước tường đỏ | Không thấy ray |
| DSC00379-2 | Chân dung, nền đèn phố | Không thấy ray |
| DSC00589-2 | Người mẫu ngồi chân trần trên ray (ảnh đen trắng) | Vi phạm |
| DSC09965-Edit-2 | Người mẫu đứng trên phố đi bộ | Không thấy ray |
| DSC09909-2 | Người mẫu trước Café de Mayfair | Không phải Train Street |

## Các trang khác đã quét

Đã quét 78 URL trong sitemap, cộng thêm trang chủ và /gallery, tìm ảnh hoặc chú thích có chữ "train":

- **Trang chủ**, khối "Moments we've captured": ảnh DSC04501-13, link về /gallery.
- **/gallery**: 2 ô album nói trên.
- **Bài Complete Hanoi travel guide**: ảnh tư liệu tàu chạy qua, khách ngồi hai bên, không ai đứng trên ray. Không phải ảnh buổi chụp TravelFrame, nên không xem là vi phạm.

# Đề xuất (chờ Rocky duyệt, chưa làm)

1. **Trang chủ:** thay ảnh DSC04501-13 trong khối "Moments we've captured" bằng một ảnh Phố Cổ đã duyệt. Ví dụ ảnh của bộ Thin hoặc Hanna đang dùng trên /hanoi-photoshoot, credit Harry Pham / 102 Koncept.
2. **Album 119:** chuyển sang Unpublished, vì toàn bộ album là buổi chụp ở Train Street. Cách mềm hơn là bỏ 3 ảnh trên ray, đổi ảnh bìa, đổi tên và bỏ nhãn "Local Experience Route". Tuy vậy, ảnh ban công vẫn gắn với hành lang ray.
3. **Album 51:** bỏ ảnh DSC00589-2. Đổi tên album sang tên không nhắc Train Street, vì 4 ảnh còn lại không chụp ở đó (ví dụ "Night in Hanoi Old Quarter").
4. Cả ba việc đều là sửa site live, cần Rocky duyệt. Không xoá file ảnh trên server. Ghi revision log và hồ sơ trước và sau khi sửa.

Câu hỏi cần Rocky trả lời: chọn cách 2 nào cho album 119 (Unpublished hay chỉ bỏ ảnh), và có cần giữ bộ ảnh này cho mục đích nội bộ không.

# Cách kiểm tra đã dùng

- Đọc /gallery và trang chủ bằng curl không đăng nhập ngày 14/11/2026, lấy danh sách ảnh từ thuộc tính `data-album` của từng ô.
- Tải 11 ảnh về thư mục tạm, thu nhỏ rồi xem bằng mắt từng ảnh.
- Lấy trạng thái, ngày tạo và người tạo từ trang /admin/content.
