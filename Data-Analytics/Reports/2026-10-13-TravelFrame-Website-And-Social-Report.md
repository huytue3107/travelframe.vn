# TravelFrame: Website và Social, cập nhật 2026-10-13

- Owner: Data-Analytics
- Status: Review
- Captured: 2026-10-13 khoảng 10:00 GMT+7
- Kỳ chính: 2026-10-06–2026-10-12; kỳ trước: 2026-09-29–2026-10-05
- Nguồn: GA4 Data API property 552867189; Meta read-only MCP; Facebook Business Suite Results.

## 1. Kết luận điều hành

Instagram phục hồi mạnh về phân phối và tương tác, nhưng website giảm đáng kể. Facebook tăng tương tác nhưng giảm tổng views và nhấp liên kết. Chưa có bằng chứng đối soát booking/doanh thu để xác nhận tăng trưởng kinh doanh.

Ưu tiên: nối content giải trí đang nổi bật với trải nghiệm photo walk, đo qualified inquiries và kiểm tra tracking chuyển đổi trước khi quyết định tăng ngân sách.

## 2. Website

GA4 Asia/Saigon; hostname travelframe.sidevn.com. Lọc nguồn Tag Assistant và các đường dẫn /travelframe-admin, /admin, /login, /user, /node. Không khẳng định bộ lọc đã loại hết truy cập nội bộ trên trang công khai.

| Chỉ số | 06–12/10 | 29/09–05/10 | Thay đổi |
|---|---:|---:|---:|
| Active users | 53 | 95 | -44,2% |
| New users | 45 | 89 | -49,4% |
| Sessions | 78 | 152 | -48,7% |
| Pageviews | 163 | 377 | -56,8% |
| Engagement rate | 47,4% | 57,9% | -10,5 điểm % |
| /booking active users | 16 | 22 | -27,3% |
| /booking views | 21 | 41 | -48,8% |
| Key events | 0 | 0 | Chưa ghi nhận |

Sessions theo ngày: 06/10: 6; 07/10: 8; 08/10: 7; 09/10: 19; 10/10: 7; 11/10: 11; 12/10: 20. Ngày 12/10 engagement rate đang bằng 0%, cần kiểm tra lại sau xử lý dữ liệu. Ngày 09/10 từng báo 0% trong bản trước, hiện đã thành 73,7%; không quy số 0 tạm thời thành hành vi khách.

Trang /tours: 20 users/36 views; trang chủ: 18/34; /booking: 16/21; cẩm nang photographer: 10/11. Người dùng từng trang có thể trùng nhau.

Nguồn sessions: Direct 22; Google organic 15; Facebook 19; Instagram 11; Threads 6; not set 12; data not available 1. Các dòng theo source có thể không cộng đúng aggregate sessions do GA4 tổng hợp dimension; dùng 78 sessions làm tổng kỳ. Không cộng users theo nguồn.

## 3. Instagram

Meta insights total_value, since/until được yêu cầu theo GMT+7; backend Meta có thể có quy tắc bucket riêng. Chưa tách organic/paid.

| Chỉ số | 06–12/10 | 29/09–05/10 | Thay đổi |
|---|---:|---:|---:|
| Reach | 110.799 | 41.940 | +164,2% |
| Views | 177.759 | 81.666 | +117,7% |
| Content interactions | 7.963 | 3.078 | +158,7% |
| Saves | 863 | 1.031 | -16,3% |
| Shares | 952 | 461 | +106,5% |
| Profile visits | 697 | 378 | +84,4% |

Follower snapshot: 510; media count: 137. So snapshot 09/10 có 425 followers: tăng 85, nhưng đây không phải net follower gain của kỳ báo cáo và chưa phân tách organic/paid.

Profile visits/reach giảm từ khoảng 0,90% xuống 0,63%; đây là tỷ số chỉ số, không phải conversion rate của cùng nhóm người. Saves/reach giảm từ khoảng 2,46% xuống 0,78%. Reach tăng nhanh hơn mức tăng hành động tìm hiểu hồ sơ, còn saves giảm tuyệt đối.

## 4. Facebook

Dashboard Pacific time. Tại khoảng 10:00 GMT+7 ngày 13/10, Pacific vẫn khoảng 20:00 ngày 12/10; ngày cuối còn khoảng bốn giờ, nên số liệu kỳ hiện tại tạm tính. Không coi cùng lịch ngày là cùng cửa sổ với GA4/IG.

| Chỉ số | 06–12/10 tạm tính | 29/09–05/10 | Thay đổi |
|---|---:|---:|---:|
| Views | 303.721 | 379.984 | -20,1% |
| Content interactions | 3.673 | 2.297 | +59,9% |
| Visits | 2.033 | 1.868 | +8,8% |
| Link clicks | 79 | 201 | -60,7% |

Các chỉ số trên cộng từ daily Primary/Secondary trong Business Suite. Không cộng daily viewers để suy ra unique viewers cả kỳ. Headline viewers hiển thị khoảng 159,7K; không lấy dấu tăng/giảm từ biểu tượng chưa đọc được. Follower snapshot qua API: 2.063, tăng 329 so snapshot 09/10 là 1.734; khác cửa sổ với bảng tuần.

## 5. Nội dung nổi bật

Media 30 bài trả về được lọc theo timestamp 06–12/10. Likes/comments là lũy kế đến lúc kiểm tra, không cùng định nghĩa account interactions trong tuần.

| Nội dung | Likes | Comments | Link |
|---|---:|---:|---|
| Café Hà Nội lúc 2 PM, mọi người nhảy múa | 4.358 | 86 | https://www.instagram.com/reel/DeRw7HjNeRB/ |
| Bánh mì Hà Nội | 133 | 1 | https://www.instagram.com/reel/DeJOZXZNPBJ/ |
| Travel moments: living rent-free | 72 | 5 | https://www.instagram.com/reel/DeJtdsmNxQp/ |
| Cách nói no, thank you bằng tiếng Việt | 48 | 1 | https://www.instagram.com/reel/DeY-Pi2NYVz/ |
| Ba câu khi không hiểu tiếng Việt | 30 | 1 | https://www.instagram.com/reel/DeQeq0JjYVz/ |

Reel café vượt xa các bài khác theo likes/comments trong mẫu đọc được. Đây là tín hiệu về tình huống bất ngờ và trải nghiệm địa phương, chưa chứng minh format tạo booking hoặc giải thích toàn bộ tăng trưởng reach. Cần media insights, retention và attribution để xác định đóng góp.

## 6. Phễu và giới hạn chuyển đổi

Facebook + Instagram sessions giảm từ 76 xuống 30, khoảng 60,5%, dù Instagram reach tăng mạnh. Facebook link clicks cũng giảm 60,7%. Đây là điểm đáng ưu tiên kiểm tra giữa nội dung → CTA → website; chưa xác định nguyên nhân là creative, link, tracking hoặc thay đổi khách.

GA4 events trả về: page_view 163, user_engagement 90, session_start 73, scroll 61, first_visit 45, click 2. Chưa có booking success/form_submit trong dữ liệu đã lọc; key events bằng 0 không chứng minh booking ngoài đời bằng 0. Chưa đọc đối soát qualified DM, báo giá, cọc hoặc doanh thu trong lần này; không tính CAC/MER/ROAS.

Đường dẫn PDF bị báo Page not found ở lần kiểm tra 09/10; chưa kiểm tra lại live trong lần này, không khẳng định còn lỗi hôm nay. /booking đã có nút WhatsApp/IG ở lần kiểm tra trước. Không dùng số liệu hiện tại để kết luận shadowban hoặc nguyên nhân thuật toán.

## 7. Hành động ưu tiên

1. Marketing-Growth: thử content nối trải nghiệm café với photo walk dành cho nữ solo traveler; CTA PHOTO kèm ngày đến Hà Nội. Đo qualified inquiries thay vì chỉ likes.
2. Data-Analytics + Technology-Automation: kiểm tra link profile/Page button, UTM và đường đi tới booking; audit nhấp WhatsApp/IG và event gửi yêu cầu thành công. Loại test traffic, đối soát với lead thật.
3. Marketing-Growth: thử lại các chủ đề utility dễ lưu như gọi món, từ chối lịch sự, chuẩn bị photo walk; tránh chỉ nhân bản content giải trí vì reach cao.
4. Sales-CRM: ghi source/content ID cho inquiry → báo giá → cọc → booking để xác định nội dung tạo doanh thu.

## 8. Quyết định và kiểm chứng

Chưa tăng ngân sách chỉ dựa trên Instagram phục hồi. Review sau khi có đủ bảy ngày Facebook đã khép lại và GA4 hoàn tất xử lý. So sánh theo từng nguồn, tách paid/organic trước khi kết luận.

Kết nối Meta read-only mới đọc thành công đúng Page 1409099405611405 và IG 17841438272497512. Không cần đổi token để đọc báo cáo này. Không sửa dữ liệu live, ngân sách hoặc đăng nội dung.
