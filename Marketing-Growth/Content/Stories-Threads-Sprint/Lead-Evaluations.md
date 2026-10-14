# Lead Evaluations, sprint Story + Threads 09–15/10/2026

Kế hoạch: Marketing-Growth/Plans/2026-10-08-Story-Threads-Sprint-Orchestration.md

## Check-in 2026-10-08 #1 (ngay sau khi giao việc)

| Agent | Tiến độ | Vấn đề | Xử lý |
|---|---|---|---|
| Agent 2 (Codex) | Đã đọc plan + runbook, bắt đầu research | `agent-reach` không có CLI; kẹt ở prompt xin Computer Use cho Orca | Trưởng nhóm huỷ prompt; chỉ đạo dùng Orca CLI chỉ-đọc/WebFetch/Apify, ưu tiên research + lô 09/10 |
| Agent 3 (Antigravity) | Đã đọc plan, skill, log; đang chạy lệnh đọc tab Threads | Thanh trạng thái báo "AI: Out of credits" | Theo dõi; nếu dừng thì báo Rocky |

Chưa có lô nào để chấm. Vi phạm: 0.

## Chấm điểm lô 09/10 (2026-10-08, trưởng nhóm Claude)

### Lô Story, Agent 2: 7/10, cho qua có điều kiện
| Tiêu chí | Điểm | Ghi chú |
|---|---|---|
| Hook tò mò | 1/2 | "Solo in Hanoi? Try this before you pose." còn hiền, chưa phải "clickbait nặng" theo yêu cầu Rocky |
| Đúng sự thật | 2/2 | Không có giá/giờ/visa/thời tiết; chưa có bằng chứng consent ảnh người mẫu (chặn trước khi đăng) |
| Giá trị thực dụng | 1/2 | Mẹo tạo dáng chung chung; chưa dùng chủ đề đã chứng minh (đóng gói đồ, gọi bánh mì, tiền Việt) |
| Cơ chế tương tác | 2/2 | Poll + DM keyword PHOTO, đánh dấu rõ khung MANUAL |
| Giọng/không bait cấm | 1/2 | Khung 5 lặp lại ảnh khung 3; chuỗi chỉ 1 chủ đề |
Research chỉ là bản nháp: không quan sát được story thật của đối thủ (thiếu CLI agent-reach, bị chặn Computer Use). Script publish-story.mjs: dry-run đạt, luồng ghi thật chưa kiểm chứng.

### Lô Threads, Agent 3: 6/10, TRẢ VỀ SỬA (Agent 3 tự chấm 10/10, không chấp nhận)
| Tiêu chí | Điểm | Ghi chú |
|---|---|---|
| Hook tò mò | 1/2 | Mở bằng lời khen/"So glad", ít gây tò mò thật |
| Đúng sự thật | 1/2 | Nhiều số liệu không có nguồn dẫn: 35-40 USD/ngày, quẩy 10.000đ, phở 80-120k vs 35-45k, cước 13-15k/2km, "quẩy nhúng đúng 3 giây", giờ mở cửa; mục 4 nói về thủ tục xuất nhập cảnh/giấy khai sinh là tư vấn pháp lý chưa kiểm chứng; mục 10 "đảm bảo an toàn" tuyệt đối |
| Giá trị thực dụng | 2/2 | Chi tiết địa phương tốt (Long Biên 6:30, ngõ Huyện, ATM sân bay) |
| Cơ chế tương tác | 1/2 | Reply dài 3-4 câu, ít câu hỏi mở để kéo phản hồi |
| Giọng/không lặp khuôn | 1/2 | Cấu trúc lặp: mở bằng khen + cảm thán, nhồi `"plot twist"`/`"hidden gem"`/`"game changer"`; mục 10 xưng "As someone living in Hanoi" khi chưa xác nhận; chính là bệnh lặp khuôn của runner cũ |
URL thật chưa được kiểm tra từng cái (Threads cần đăng nhập). Việc cần làm: sửa theo mục trên, gắn nguồn dẫn được cho mọi con số hoặc bỏ số; bỏ/diễn đạt lại mục 4 và 10; rút ngắn còn 1-2 câu, thêm câu hỏi mở; đa dạng cấu trúc mở đầu; mỗi URL phải mở được và còn bình luận để reply.

Vi phạm quy tắc: 0 (không đăng, không like, không comment, không commit).

## Chấm lại sau vòng sửa (2026-10-08, trưởng nhóm Claude)

Rocky xác nhận consent ảnh người mẫu và cho đăng story qua Meta Business Suite (đăng tay, không cần public HTTPS). Đây chưa phải APPROVED lô.

| Lô | Điểm | Nhận xét |
|---|---|---|
| Story 09/10 (solo photo) | 8/10 | Hook plot twist, bỏ khung trùng ảnh, DM PHOTO ở khung 3, poll khung 4 |
| Story 10/10 (packing, tiền lẻ) | 8/10 | Chủ đề đã chứng minh, nguồn là draft nội bộ; tiền lẻ/kiểm số 0 cần giữ nguyên diễn đạt có nguồn |
| Story 11/10 (bánh mì) | 9/10 | Quiz "mang về", câu tiếng Việt có nguồn nội bộ, lời mời DM MENU |
| Threads 09/10 bản R1 | 7/10, qua | Đã bỏ số liệu thiếu nguồn, bỏ mục nhập cảnh, mỗi reply 2 câu + câu hỏi mở. Còn yếu: 16/16 reply cùng khuôn "câu khẳng định + câu hỏi", ít thông tin gây tò mò; Agent tự khẳng định đã mở 100% URL (chưa kiểm độc lập) |

Việc tiếp: Agent 2 chuyển lô thành checklist đăng tay Meta Business Suite. Agent 3 làm lô 10/10 với cấu trúc đa dạng, tác giả mới.

## Chấm 2026-10-11 22:30: phân tích reel viral + lô 5 reel (Agent 2)

- **Phân tích: tốt, trung thực về giới hạn.** Phát hiện quan trọng: reel viral DeRw7HjNeRB là footage có credit một creator TikTok, chưa có bằng chứng xin phép dùng lại. Rủi ro bản quyền/khiếu nại cho tài khoản. Số live trên IG web: khoảng 6.119 like, 187 comment.
- **Lô 5 reel 12/10: 6/10, trả về sửa.** Hook nhẹ, cả 5 trượt sang mẹo chụp ảnh bằng điện thoại, không giữ công thức đã thắng (khoảnh khắc đời thường + bất ngờ xã hội/đường phố, cảm xúc, không cần lời thoại). Cần viết lại theo công thức đó, mỗi reel một tình huống có thật quay được ở Hà Nội.
- **Comment ghim:** "Want the Hanoi photo-walk details? DM “PHOTO” and we’ll share them." Ngắn, không bait, đạt. Chờ Rocky duyệt và quyết định có giữ reel viral hay không.

## Quyết định Rocky 2026-10-11
- Reel quán cà phê DeRw7HjNeRB: Rocky xác nhận **đã có phép** dùng footage của creator TikTok. Giữ bài.
- Comment ghim: Rocky **duyệt** nguyên văn "Want the Hanoi photo-walk details? DM “PHOTO” and we’ll share them." Agent 3 đăng và ghim trên reel đó.
