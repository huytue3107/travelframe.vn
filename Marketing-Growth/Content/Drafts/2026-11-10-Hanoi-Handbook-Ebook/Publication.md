---
title: The Hanoi Handbook — đăng lên /ebooks
owner: Marketing-Growth
status: "Published — đang bán $12 (QR), PDF v04 đã xác minh sha256 ngày 13/11/2026"
updated: 2026-11-12
timezone: Asia/Ho_Chi_Minh
admin: https://travelframe.sidevn.com/travelframe-admin/ebooks/2/edit
public: https://travelframe.sidevn.com/ebooks
product_url_when_live: https://travelframe.sidevn.com/ebooks/hanoi-handbook
---

# Đăng The Hanoi Handbook lên /ebooks

## Quyết định

Ngày 12/11/2026, trong chat:

- Rocky nói "đẹp rồi cho lên phần ebook của travelframe đi", rồi chọn "Bán $12, thay ô 02".
- Sau đó Rocky chỉ chỗ đăng: `https://travelframe.sidevn.com/travelframe-admin/ebooks`.

## Thay đổi live (12/11/2026)

Claude sửa sản phẩm số 2 trong trang quản trị ebook rồi bấm Lưu. Hệ thống báo "Đã lưu cẩm nang".

| Trường | Trước | Sau |
|---|---|---|
| Tên | Hanoi, between the lines. | The Hanoi Handbook |
| Slug | hanoi-between-the-lines | hanoi-handbook |
| Trạng thái | Sắp ra mắt | Sắp ra mắt (giữ nguyên vì chưa có PDF) |
| Giá | 12.00 | 12.00 |
| Ấn bản / số trang | 2026 / trống | 2026–27 / 25 |
| Tagline | Food streets, rituals… | Your first trip, sorted: arrival, money, food, manners and three easy days. |
| Eyebrow, lede, nội dung, mục lục, câu nhấn | trống | đã điền (copy trong [Ebooks-Store-Ticket](Ebooks-Store-Ticket.md)) |
| Bản VI | chỉ có tagline cũ | tên, eyebrow, tagline, lede, câu nhấn |
| Bìa vẽ bằng chữ | Hanoi, \*between\* the lines. · Xanh lá | The \*Hanoi\* Handbook. · Đỏ rượu |
| Ảnh bìa | chưa có | `image-1794455801684.jpg` (fid 1000), cùng 435.146 byte với `store-assets/hanoi-handbook-cover-1200x1800.jpg` |
| PDF | chưa có | chưa có (xem mục chặn) |

## Bằng chứng (curl không cookie, 12/11/2026)

- `/ebooks` trả 200.
- Thẻ có `data-ebook-slug="hanoi-handbook"`, hiện "The Hanoi Handbook", tagline mới, giá $12 và "Coming soon".
- Không còn chữ "between the lines", không có markup admin.
- `/ebooks/hanoi-handbook` trả 404, đúng với sản phẩm chưa bán. Slug cũ cũng trả 404.

## Ảnh bìa (12/11/2026)

- Rocky chọn file trong form và bấm "Tai len". File lên server có kích thước 424,95 KB, khớp file local (md5 `4d76d3323db214aa82d86b884fdd135e`).
- Claude bấm Lưu; hệ thống báo "Đã lưu cẩm nang".
- Kiểm tra bằng curl không cookie:
  - Thẻ `hanoi-handbook` trên `/ebooks` dùng `<img class="ebk-cover__img">` với 2 bản WebP (`tf_480`, `tf_800`).
  - Bản `tf_800` trả 200, `image/webp`, 800×1200.
- Trên màn hình: theme cắt ảnh theo khung thẻ, nên logo ở góc dưới bìa bị che một phần. Mặt trống, khung vòm và chữ HANOI Handbook vẫn hiện rõ.

## Đang chặn

Xem [Ebooks-Store-Ticket](Ebooks-Store-Ticket.md):

- **S1:** chưa cấu hình `file_private_path`, nên chưa tải PDF lên được.
- **S2:** PayPal chưa cấu hình, trang thanh toán báo "Checkout is not open yet".

## Kiểm tra ngày 13/11/2026

Sau ngày 12/11, developer hoặc Rocky đã chuyển cửa hàng sang **thanh toán QR**: khách quét mã, bấm "I have paid", đội xác nhận rồi mới gửi PDF qua email. Ô 02 đã gắn PDF và chuyển sang **Đang bán**.

- **Trên web (curl không cookie):**
  - `/ebooks` trả 200; thẻ ghi "View guide →" và link tới `/ebooks/hanoi-handbook`.
  - Trang sản phẩm trả 200, có nút "Buy now" dẫn tới `/checkout?ebook=hanoi-handbook`.
  - `/ebooks` và `/ebooks/terms` đã đổi sang mô tả thanh toán QR, nhưng mục Privacy trong terms vẫn còn câu cũ "Payment details stay with PayPal".
- **Trong admin:**
  - Có 1 đơn **EB-ADY5YY** (QR, 12/11 07:54, "Đã thanh toán", email đã gửi, đã tải 0/10). Chưa rõ đây là đơn thử hay đơn thật.
  - **Sai file:** PDF đang bán là `TravelFrame-Hanoi-Handbook-2026-v03.pdf`. Claude tải về qua link "Tải thử" của admin và tính sha256: `72519a28…bca0`, khớp v03, 5.721.837 byte. Bản v03 có chữ "Free" trên bìa, câu "Free to share" ở trang cuối (trái với terms "personal use") và câu sai về lịch bảo trì Lăng Bác.
  - **Cần thay bằng v04:** sha256 `f4f3fe93…21f6`. Theo form, khi thay file thì mọi khách đã mua đều nhận bản mới.
- Chưa ghi Published-Ledger cho tới khi thay xong v04 và kiểm lại sha256.
- **Cập nhật cùng ngày:** sau lần thay file đầu tiên, sản phẩm **không còn PDF**.
  - Admin ghi "Chưa có — Đang bán — THIẾU FILE"; `/travelframe-admin/ebooks/2/file` trả 404.
  - Thẻ public quay về "Coming soon".
  - File v03 đã bị gỡ nhưng v04 chưa được lưu. Có thể đã tick "Xóa file PDF hiện tại", hoặc rời trang trước khi bấm Lưu.
  - Cần tải v04 lên lại. Trong thời gian này, link tải của đơn EB-ADY5YY nhiều khả năng không dùng được.

## Thay PDF sang v04 (13/11/2026, 16:17 ICT)

- **Lần tải đầu:** Rocky tải lại file nhưng chọn nhầm v03 (fid 1012). Claude **không Lưu**, bấm Remove để gỡ bản tạm và mở Finder bôi sẵn file v04.
- **Lần tải thứ hai:** Rocky tải đúng `TravelFrame-Hanoi-Handbook-2026-v04.pdf` (fid 1013). Claude bấm Lưu; hệ thống báo "Đã lưu cẩm nang".
- **Kiểm tra trong admin:** dòng sản phẩm ghi "TravelFrame-Hanoi-Handbook-2026-v04.pdf · 5.46 MB · Đang bán". Link "Tải thử" trả 200 `application/pdf`, 5.723.069 byte, sha256 `f4f3fe93174e282e4654174fa58bc8798b509ecbd1daada3651a94cd7fa221f6`, **khớp v04**.
- **Kiểm tra public (curl không cookie):**
  - Thẻ `/ebooks` ghi "View guide →".
  - `/ebooks/hanoi-handbook` và `/checkout?ebook=hanoi-handbook` trả 200.
  - `/travelframe-admin/ebooks/2/file` khi chưa đăng nhập: 302 về trang login.
  - Trang sản phẩm không có link `.pdf` nào.
- **Đơn EB-ADY5YY:** theo ghi chú của form ("mọi khách đã mua nhận luôn bản mới"), đơn này giờ tải được v04. Claude chưa kiểm bằng link của khách.
- Đã ghi `Published-Ledger.md`.

## Còn lại

- Mục Privacy trong `/ebooks/terms` vẫn còn câu "Payment details stay with PayPal", trong khi thanh toán giờ là QR.
- Ticket S2 (PayPal) không còn cần nếu giữ thanh toán QR. Cần chốt lại với developer.

## Rollback

Danh sách giá trị cũ nằm ở cuối ticket. Đơn hàng: 0, nên đổi lại không ảnh hưởng khách nào.
