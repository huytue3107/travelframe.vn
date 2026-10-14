# Instagram @travelframe.vn — Rà soát nội dung nghi vấn bản quyền

- Ngày lập: 2026-10-08 · Owner: Data-Analytics · Trạng thái: Draft cho Rocky
- Bối cảnh: tài khoản dính tranh chấp bản quyền ngày 07/10/2026.
- Nguồn: MCP `travelframe-meta` (`list_instagram_media`, 143/144 bài, 02/09 – 07/10/2026) và xem ảnh bìa của 34 bài có rủi ro.
- Giới hạn: API không trả về audio, không xem được toàn bộ video và không đọc được Account Status. Danh sách dưới đây là **nghi vấn**, cần team xác nhận bài nào là footage tự quay.

## Kết luận chính

Rủi ro lớn nhất không nằm ở nhạc mà ở **footage của người khác**:

- **12 reel** ghi "video source: @…", tức đăng lại video của creator khác.
- **Ít nhất 4 reel** có người thật trong khung hình và caption ở ngôi thứ nhất của creator, nhưng **không ghi nguồn**. Trong đó có reel mới nhất ngày 07/10.

Ghi nguồn không đồng nghĩa với có quyền đăng: mỗi bài kiểu này đều có thể bị chủ sở hữu báo vi phạm, và nhiều báo cáo vi phạm sở hữu trí tuệ có thể dẫn tới khóa tài khoản.

Ngoài ra, 56/119 video bị Meta ẩn trường `media_url`. Theo tài liệu Graph API, Meta làm vậy khi video chứa nội dung có bản quyền (thường là nhạc). Đây là tín hiệu cần kiểm tra, chưa phải bằng chứng vi phạm.

## Nhóm 1 — Đỏ: footage người khác, không ghi nguồn (xử lý ngay)

| # | Ngày | Link | Dấu hiệu |
|---|---|---|---|
| 000 | 07/10 | https://www.instagram.com/reel/DeMCpUYNpQn/ | Cô gái nước ngoài quay chính mình, chữ trên video "POV: the first meal on my first ever solo trip…". **Ứng viên số 1 gây tranh chấp hôm qua** |
| 004 | 06/10 | https://www.instagram.com/reel/DeJYiCZNsGU/ | Cô gái nước ngoài ăn uống, chữ "You know the food is good when you hear this" |
| 107 | 10/09 | https://www.instagram.com/reel/DdGT3SVtmpV/ | Thúng chai ở Hội An, caption ngôi thứ nhất ("the second I got into the basket boat") |
| 036 | 29/09 | https://www.instagram.com/reel/Dd32xqITcQ9/ | Cặp đôi váy cưới cầm cờ đi bão: clip viral của người khác |
| 002 | 06/10 | https://www.instagram.com/reel/DeJtdsmNxQp/ | Người mẫu ở cầu Long Biên. Cần xác nhận có phải buổi chụp của TravelFrame không |
| 111 | 09/09 | https://www.instagram.com/reel/DdEL1QSJG-O/ | "EATING BÁNH MÌ BE LIKE": dạng meme, cần xác nhận nguồn |

## Nhóm 2 — Cam: footage người khác, chỉ ghi nguồn (chưa chắc đã xin phép)

| # | Ngày | Link | Nguồn ghi | Likes |
|---|---|---|---|---|
| 079 | 15/09 | https://www.instagram.com/reel/DdUOzsgNcCk/ | "kaiden" (mặt người quay chính mình) | 296 |
| 086 | 13/09 | https://www.instagram.com/reel/DdOwJkMJ3BC/ | @itsmeelprimo | 308 |
| 091 | 12/09 | https://www.instagram.com/reel/DdLqpMsNS78/ | @mihadayroi | 156 |
| 071 | 19/09 | https://www.instagram.com/reel/DddzqNqNKbC/ | @alohalouise_ | 115 |
| 089 | 12/09 | https://www.instagram.com/reel/DdMDu6xp4sH/ | @hviehuong09 (mặt người) | 84 |
| 088 | 13/09 | https://www.instagram.com/reel/DdNl3EONoo7/ | @troncuatho._ | 43 |
| 074 | 18/09 | https://www.instagram.com/reel/DdblZ_yJke-/ | @dzdink | 34 |
| 087 | 13/09 | https://www.instagram.com/reel/DdN3dG7NiKO/ | @rosellevytiaco | 24 |
| 057 | 23/09 | https://www.instagram.com/reel/Ddn-Im0NTf2/ | linhnht97 | 21 |
| 093 | 12/09 | https://www.instagram.com/reel/DdLZ_eAtq_I/ | @emwaddington | 16 |
| 069 | 20/09 | https://www.instagram.com/reel/DdfxO8chWgl/ | @huientoof19 | 11 |
| 066 | 21/09 | https://www.instagram.com/reel/DdiY1LSt5ku/ | @zhong2409 | 6 |

Lưu ý chiến lược: 4 trong số các reel nhiều like nhất kênh (#079, #086, #091, #071) là video đăng lại. Tăng trưởng hiện đang dựa một phần vào nội dung không thuộc quyền của TravelFrame.

## Nhóm 3 — Cam: địa điểm ngoài khu vực hoạt động (nhiều khả năng là footage lấy từ nguồn khác)

TravelFrame chỉ hoạt động ở Hà Nội. Các reel dưới đây quay ở nơi khác và không ghi nguồn. Nếu không phải team tự quay thì xếp vào Nhóm 1.

| # | Link | Nội dung |
|---|---|---|
| 037 | https://www.instagram.com/reel/Dd3kYnETbb8/ | Hoàng hôn Đà Lạt |
| 043 | https://www.instagram.com/reel/Dd00r0aNRFt/ | Rừng dừa Bảy Mẫu, Hội An |
| 110 | https://www.instagram.com/reel/DdEMk6lpNyr/ | "Next stop: Vietnam", cảnh biển |
| 121 | https://www.instagram.com/reel/Dc_G7zkNnHq/ | 12 điểm ở Sapa (flycam) |
| 122 | https://www.instagram.com/reel/Dc_Agktt3gC/ | Vịnh Hạ Long |
| 123 | https://www.instagram.com/reel/Dc-zLzDN53P/ | 7 địa điểm Việt Nam |
| 124 | https://www.instagram.com/reel/Dc-TnyAtUXN/ | Flycam "VIETNAM", caption về chuyến đi solo |

## Nhóm 4 — Vàng: sự kiện và thương hiệu của bên thứ ba

| # | Link | Rủi ro |
|---|---|---|
| 015 | https://www.instagram.com/reel/Dd_kM_OpQ5l/ | Ảnh bìa là sân khấu concert BIGBANG. Footage concert và nhạc BIGBANG thuộc quyền của ban tổ chức |
| 070 | https://www.instagram.com/p/DdeE-aviVx7/ | Poster "BIGBANG in Hanoi" do TravelFrame thiết kế, có logo/lightstick. Rủi ro thương hiệu, mức thấp hơn |
| 035 | https://www.instagram.com/reel/Dd33CukTxM3/ | Đi bão: xác nhận có phải team tự quay không |

## Nhóm 5 — Nhạc: 56/119 video bị Meta ẩn `media_url`

- Các bài này trải từ 03/09 đến 05/10. Từ 06/10 trở đi chưa có bài nào bị ẩn.
- Nếu nhạc được chèn từ thư viện Instagram cho tài khoản Business thì nhìn chung không sao.
- Nếu nhạc được ghép sẵn từ CapCut hoặc TikTok rồi mới tải lên thì có rủi ro. Cần team cho biết quy trình dựng video đang dùng cách nào.
- Danh sách số thứ tự bài (theo file `scratch/ig_audit/media.json`): 6, 7, 8, 11, 13, 17, 25, 29, 37, 51, 52, 53, 55, 64, 66, 69, 74, 75, 77, 79, 80, 82, 83, 84, 85, 88, 90, 93, 95, 96, 101, 103, 106, 108, 109, 110, 114, 118, 121–137, 139.

## Tín hiệu khác

- Profile báo 144 bài nhưng API chỉ trả 143. Có thể một bài đã bị gỡ hoặc ẩn, cần đối chiếu với mục *Removed content* trong Account Status.

## Đề xuất xử lý

1. **Hôm nay:** Archive (không xóa, vẫn khôi phục được) toàn bộ Nhóm 1, ưu tiên #000. Đối chiếu với Account Status để biết bài nào đang bị tranh chấp.
2. **Trong 48 giờ:** với Nhóm 2 và Nhóm 3, nhắn creator xin phép bằng văn bản. Bài nào không có phản hồi đồng ý thì Archive.
3. **Nhóm 4:** gỡ phần footage concert BIGBANG trong #015, hoặc Archive bài này.
4. **Quy trình từ nay:**
   - Chỉ đăng footage do team tự quay, hoặc footage có giấy phép bằng văn bản (DM hoặc email đồng ý, lưu ảnh chụp màn hình).
   - Nhạc chèn trong app từ thư viện được phép cho tài khoản Business.
   - Không dùng clip concert hay clip viral của người khác.

Việc Archive là thao tác trên tài khoản live nên cần Rocky thực hiện hoặc duyệt từng bước.

## Cập nhật 09:01 ngày 08/10/2026 — kiểm tra lại sau khi lưu trữ

Nguồn: MCP `travelframe-meta`. Profile hiện báo 138 bài, API trả về 137 bài; trước đó là 144 và 143, tức vẫn lệch 1 bài như cũ.

**Đã ẩn khỏi kênh (6 bài Instagram và 2 bài Facebook):**
- Instagram: #000, #004, #036, #107, #111, và #037 (Đà Lạt, thuộc Nhóm 3).
- Facebook: reel 963043220186590 và reel 891622660563916.
- Lưu ý: API không phân biệt được bài đã lưu trữ với bài đã xóa. Theo Rocky, toàn bộ là lưu trữ.

**Vẫn đang hiển thị:**
- #002 (Long Biên): chờ xác nhận có phải footage của team không.
- Nhóm 2: 12/12 bài. 5 bài có bản trên Facebook: 1598734935077261, 1098486089248659, 1031914576551604, 1810163299995555, 1106753432003164.
- Nhóm 3: 6 bài còn lại. 5 bài có bản trên Facebook: 2147618582632796, 1633290318412422, 2300381350796952, 2858749061184791, 1616032203574612.
- Nhóm 4: 3/3 bài. #015 BIGBANG có bản trên Facebook: 29429866293282885.
- Nhạc: 55/113 video vẫn bị Meta ẩn `media_url`.
