# Hệ thống theo dõi đối tác affiliate TravelFrame

**Trạng thái:** Bản thử nghiệm · **Cập nhật:** 2026-10-30

Tài liệu này mô tả bản thử hệ thống theo dõi đơn vị giới thiệu khách cho TravelFrame: từ khách được giới thiệu đến booking, tour hoàn thành và hoa hồng. Dữ liệu trong ứng dụng là dữ liệu minh họa; các chính sách và tính năng được đề xuất cho vận hành chính thức cần được thống nhất trước khi áp dụng.

## 1. Mục tiêu

- Biết mỗi đối tác mang đến bao nhiêu khách và các khách đó đang ở bước nào.
- Theo dõi số tour hoàn thành, tiền đã thu, tiền hoàn và chi phí.
- Tính hoa hồng theo gói và theo dõi khoản chờ duyệt, được duyệt hoặc đã trả thử.
- Nhận diện trường hợp thiếu chứng cứ, tranh chấp hoặc khoản thưởng quá hạn.

## 2. Chính sách dùng trong bản thử

Nguồn tham khảo là tài liệu `TravelFrame-Referral-Rewards.docx`. Chính sách trong ứng dụng được gắn mã **REF-DEMO-v1** và chưa mặc định là thỏa thuận đã duyệt cho mọi đối tác.

| Gói | Giá tour | Tối thiểu | Hoa hồng giới thiệu |
|---|---:|---:|---:|
| Basic | 30 USD/giờ | 1 giờ | 5% |
| Premium | 60 USD/giờ | 2 giờ | 10% |
| VIP | 99 USD/giờ | 2 giờ | 15% |

Khách được giảm 5% trong bản thử. Hoa hồng tính trên giá tour trước giảm. Tài liệu gốc nêu thưởng khi tour đã hoàn thành và thanh toán, thời hạn trả trong 7 ngày sau tour, một ưu đãi mỗi booking và không tự sử dụng mã giới thiệu.

**Ví dụ:** Premium 3 giờ có giá gốc 180 USD. Khách được giảm 9 USD, còn thanh toán 171 USD. Hoa hồng là 10% × 180 USD = **18 USD**. Sau khi trừ hoa hồng còn 153 USD, trước chi phí tour và phí thanh toán.

Tài liệu B2B cũ từng nêu mức hoa hồng 15% chung. Cần kiểm tra thỏa thuận của từng đối tác trước khi áp dụng chính sách; bản thử chưa hỗ trợ chính sách B2B riêng hoặc các khoản phụ thu.

## 3. Các phần trong bản thử

### Tổng quan

Hiển thị tiền thu ròng, số tour hoàn thành, hoa hồng đủ điều kiện chưa trả và số đối tác đang xem. Có biểu đồ tiền thu theo đối tác, danh sách khoản quá hạn, cơ hội cần rà soát và bảng hiệu quả đối tác.

Tiền thu ròng bằng tổng đã thu trừ tổng đã hoàn và **bao gồm cả tiền cọc**. Tour hoàn thành được hiển thị riêng. Phần đóng góp chỉ hiện khi các dòng đang xem đều có chi phí; chưa gồm chi phí hỗ trợ đối tác phân bổ.

### Đối tác

Mỗi đối tác có tên, nhóm và mã referral riêng. Bảng hiển thị số cơ hội, số đủ điều kiện, số tour hoàn thành và tiền thu ròng. Có thể lọc theo đối tác hoặc tìm bằng tên và mã.

### Khách và booking

Mỗi dòng là một cơ hội khách được gắn với một đối tác. Có thể nhập gói, số giờ, ngày tour dự kiến, bằng chứng nguồn giới thiệu và xác nhận nguồn. Sau đó cập nhật tiến độ, tổng đã thu, tổng đã hoàn, chi phí và chứng từ.

Các trạng thái trong bản thử: **Mới → Đủ điều kiện → Đã báo giá → Đã cọc → Đã xác nhận → Hoàn thành**; có nhánh **Đã hủy**. Ngày tour và gói ở giai đoạn đầu có thể chỉ là dự kiến.

### Đối soát hoa hồng

Mỗi tour hoàn thành có dòng thể hiện đối tác, giá gốc, tỷ lệ, số tiền thưởng, hạn trả và trạng thái. Bản thử cho phép mô phỏng duyệt thưởng và ghi đã trả bằng mã chứng từ thử; thao tác không thực hiện chuyển tiền.

Trạng thái gồm: **Chưa đủ điều kiện**, **Cần rà soát**, **Chờ duyệt**, **Được duyệt**, **Đã trả thử**. Trong bản thử, khoản thưởng chỉ sẵn sàng duyệt khi tour hoàn thành, đã thu đủ, có chứng từ và nguồn giới thiệu được xác minh. Tour hủy, có hoàn tiền hoặc tranh chấp được đưa vào rà soát. Sau khi duyệt, dòng bị khóa chỉnh sửa và không thể ghi trả thử hai lần.

## 4. Cách thử

1. Thêm một đối tác thử và đặt mã referral duy nhất.
2. Vào **Khách & booking**, thêm khách thử và chọn đối tác.
3. Cập nhật tiến độ, bằng chứng nguồn giới thiệu, chứng từ và số tiền đã thu.
4. Khi tour hoàn thành và đã thu đủ, vào **Đối soát hoa hồng** để duyệt thử và ghi mã chứng từ trả thử.
5. Dùng **Xuất bản sao JSON** để lưu dữ liệu; dùng **Khôi phục bản sao** khi cần. Khôi phục sẽ thay dữ liệu hiện tại trên trình duyệt.

## 5. Giới hạn hiện tại

- Đây là bản thử chạy trên máy, lưu dữ liệu trong trình duyệt; chưa có đăng nhập, phân quyền hoặc đồng bộ giữa nhiều người. Không nhập dữ liệu khách thật hay tài khoản nhận tiền.
- Chưa kết nối CRM, website, QR, ngân hàng hoặc hệ thống gửi thông báo. Không có thanh toán thật.
- Chỉ hỗ trợ USD và chính sách thử cố định. Chưa có khách thêm, phụ thu, chính sách theo từng hợp đồng hoặc điều chỉnh sau khi đã duyệt/trả.
- Tiền thu, hoàn và chi phí được nhập thủ công. Nhật ký trong bản thử không phải sổ kế toán hoặc lịch sử kiểm toán bất biến.
- Dashboard chưa có bộ lọc kỳ, phân tích cohort hay các chỉ số reach/click. Những số chưa thu thập không được suy thành 0.
- Dữ liệu trình duyệt có thể mất khi xóa dữ liệu, đổi trình duyệt hoặc đổi địa chỉ truy cập; nên xuất bản sao trước khi thay đổi môi trường.

## 6. Các điểm cần chốt trước khi vận hành thật

1. Chính sách hoa hồng và giảm giá áp dụng cho từng loại đối tác, bao gồm các thỏa thuận B2B đã có.
2. Cơ sở tính hoa hồng đối với phụ thu, khách thêm, thuế, hoàn tiền và phí chuyển tiền.
3. Quy tắc đối chiếu khách trùng, nhiều đối tác cùng giới thiệu và thời hạn ghi nhận nguồn.
4. Người nhập liệu, người duyệt, quyền xem của đối tác và nơi lưu dữ liệu chung.
5. Quy trình xử lý hoàn tiền hoặc tranh chấp sau khi đã trả thưởng.

Thiết kế chi tiết và đề xuất mở rộng: `2026-10-30-Affiliate-Tracking-System-Draft.md` trong cùng thư mục. Bản Markdown này mô tả hệ thống; nó không thay thế giao diện ứng dụng tương tác.
