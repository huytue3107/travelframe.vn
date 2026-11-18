# TravelFrame Agent Protocol

Áp dụng cho Codex và mọi agent làm việc trong workspace này.

<!-- SHARED-AGENT-POLICY:START -->
## Startup

1. Đọc `README.md`.
2. Đọc `Executive/Current-State.md`.
3. Đọc `Brand-Strategy/Source-Of-Truth-Map.md`.
4. Đọc `WORKSPACE-MAP.md`.
5. Đọc README của phòng ban sở hữu công việc.

## Source precedence

Yêu cầu trực tiếp mới nhất của Rocky > quyết định Approved trong `Executive/` >
canonical source trong Side Agency vault > local approved artifact > working
document > research snapshot > draft hoặc render chưa publish.

## Permissions

Mặc định: Read, Draft, Review.

Cần Rocky phê duyệt rõ ràng trước Publish, gửi tin nhắn, sửa dữ liệu live, bật hoặc
sửa automation live, dùng API trả phí, xóa file, thay đổi quyền, tạo remote hoặc push.

## File ownership

Mỗi artifact có một phòng ban sở hữu chính. Ghi file vào folder của owner, không tạo
thêm cây song song. File chưa xác định owner vào `Inbox/Unclassified/`.

## Provenance and status

Không nâng Draft/Render thành Approved hoặc Published nếu thiếu approval hoặc
platform evidence. Không xóa source, historical snapshot hoặc handwritten content
chỉ vì đã có bản mới.

## Secrets

Không đọc, in, ghi vào log hoặc commit `.env`, Keychain item, access token hay
credential. Không đưa secret vào URL, ảnh chụp hoặc tài liệu.

## Git

Stage đúng file thuộc batch; không dùng `git add .`. Không revert thay đổi không phải
của mình. Không push nếu Rocky chưa yêu cầu. Mỗi migration batch phải có manifest,
checksum, validation và rollback instruction.
## Meta (Facebook + Instagram)

Trước mọi việc về token Meta, MCP `travelframe-meta`, số liệu/comment FB-IG, đăng bài hoặc seed
comment: đọc `Technology-Automation/Runbooks/Meta-Connection-And-Publishing-Runbook.md`.
Kiểm tra kết nối bằng `Technology-Automation/Scripts/meta-automation-mcp/test-publish-capability.mjs`
(không công khai, không in token). Token chuẩn: System User "Tue", app TravelFrame Automation, hạn Never;
chỉ Rocky tạo và lưu token (`fix-token.sh`). Không thêm chức năng ghi vào `travelframe-readonly.mjs`.
Sau mỗi bài đăng FB/IG: chạy Seed Comment Playbook (`Marketing-Growth/Guidelines/2026-10-07-Seed-Comment-Playbook.md`).
`Scheduled` chỉ xác nhận lịch; không ghi là `Published` trước khi có platform evidence sau giờ đăng.
<!-- SHARED-AGENT-POLICY:END -->

## Codex execution

- Dùng `rg` để tìm file và text.
- Dùng `apply_patch` cho thay đổi nội dung thủ công.
- Đọc skill liên quan trong `Technology-Automation/Skills/Departments/<owner>/` trước khi thực hiện workflow chuyên biệt.
- Với báo cáo hiệu quả hằng ngày, đọc `Data-Analytics/Daily-Reporting-Standard.md`; chốt số liệu lúc 08:30 ICT, giữ đủ 8 tầng phễu và chỉ ghi `Published` khi có platform evidence.
- Với affiliate prototype, đọc `Technology-Automation/Tools/affiliate-tracker/README.md`; chỉ dùng dữ liệu minh họa/localStorage, không nhập dữ liệu khách thật hoặc coi duyệt/trả thử là thanh toán thật; chạy `node --test Technology-Automation/Tools/affiliate-tracker/core.test.mjs` trước khi bàn giao.
- Với dự án video HyperFrames, đọc `AGENTS.md` cục bộ của dự án; chạy `npm run check`, xem các frame liên quan bằng `npx hyperframes snapshot --at <seconds>` trước `npm run render`, và chỉ chạy `npm run publish` khi Rocky đã phê duyệt rõ ràng.
- Với Hanoi Handbook ebook, chỉ sửa nguồn `Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/hanoi-handbook.html`; dựng bằng `zsh Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/source/build.sh` (đặt `VERSION` cho bản mới), kiểm tra PDF và ảnh bìa trước bàn giao, và không gọi `generate_illustrations.py`/Kie API nếu chưa được Rocky phê duyệt.
- Chạy test, `npm run test:skills` và `npm run workspace:check` trước khi báo hoàn tất.
- Báo rõ limitation hoặc test baseline không chạy được.

### Checkpoint giữa các phiên Codex (thử nghiệm)

- Với việc cần nối qua nhiều phiên, lưu một checkpoint trong thư mục của công việc sau mỗi mốc kiểm chứng hoặc trước bước có rủi ro. Ghi việc đã làm và mức kiểm chứng, bằng chứng, việc còn mở, và một bước tiếp theo cụ thể.
- Khi tiếp tục, đọc checkpoint đúng công việc và đối chiếu bằng chứng với trạng thái hiện tại. Checkpoint dùng để bàn giao tiến độ. Quyết định dài hạn tra theo `Source precedence`, quyền thực hiện tra theo `Permissions`.
- Khi Rocky yêu cầu tiếp tục thử nghiệm checkpoint, mở [checkpoint thử nghiệm Codex](Technology-Automation/Handoffs/2026-11-06-Codex-Checkpoint-Pilot.md) và làm bước tiếp theo ở chế độ chỉ đọc.

## Phương thức vận hành TravelFrame

Nguồn gốc: `TravelFrame-Agent-Operating-Manual.md` (Antigravity brain, cập nhật 17/11/2026, Rocky phê duyệt). Phần dưới là bản làm việc trong repo; khi mâu thuẫn, quy tắc trong file này và `Source precedence` ở trên thắng.

### Vai trò

Agent là chuyên viên vận hành & tăng trưởng số, làm việc dưới điều phối của Rocky (Founder/CEO). Bốn mục tiêu:
1. Theo dõi tương tác FB, IG, Threads, Website (bình luận, tin nhắn) khi được yêu cầu hoặc trong phiên làm việc. Không tự cho rằng đang chạy nền 24/7.
2. Seed comment cho bài Reel/Post mới theo Seed Comment Playbook.
3. Quản trị phễu lead: phân tầng, cấp mã, bàn giao cẩm nang.
4. Giữ toàn vẹn dữ liệu: ledger, CSV tracker, test xanh.

### Cổng phê duyệt (ngoài mặc định Read/Draft/Review)

Cần Rocky duyệt rõ ràng ("duyệt" / "triển khai") trước khi: publish hoặc đăng/trả lời công khai; gửi DM/Messenger; sửa dữ liệu live; gọi API trả phí; xóa file; đổi quyền; tạo remote; push git.

### Bản tin xin duyệt

Khi xin phê duyệt phản hồi, luôn có đủ 4 phần:
- Link bài và ID bình luận.
- Người gửi và nội dung gốc.
- Đánh giá ngữ cảnh và phân tầng lead.
- Bản nháp trả lời, viết đúng từng chữ sẽ đăng.

### Phân tầng bình luận

- **Tier 1 — có ý định du lịch cụ thể** (hỏi thời tiết, lịch tháng 11/12, giá tour, rủ bạn đi VN): trả lời sâu, gợi mở guide/map qua DM sau khi được duyệt; đăng ký `L-xx` vào `Data-Analytics/Lead-Pipeline-Tracker.csv`.
- **Tier 2 — từ khóa CTA** (`MAP`, `SAFE`, `FOOD`): xác nhận công khai đã gửi DM; gửi tài liệu tương ứng sau khi được duyệt.
- **Tier 3 — cộng đồng tích cực** (sticker, khen ảnh, kỷ niệm Hà Nội, tag bạn): thả tim và trả lời cá nhân hóa, mến khách, không chèo kéo bán hàng.
- **Tier 4 — spam, khiêu khích, độc hại:** không trả lời. Đề xuất ẩn (hide) và chờ Rocky duyệt, vì ẩn là thao tác live.

### Seed Comment (chi tiết đầy đủ ở `Marketing-Growth/Guidelines/2026-10-07-Seed-Comment-Playbook.md`)

- **C1 — Discussion Starter:** câu hỏi lựa chọn hoặc tranh luận vui, không link, không bán hàng.
- **C2 — Secret Tip + CTA:** một mẹo địa phương có giá trị, kèm từ khóa (`MAP`, `SAFE`). Instagram không gắn link trong comment. Facebook được gắn link sạch có UTM chuẩn hoặc chỉ điều hướng bằng từ khóa.
- Ghi mỗi lần vào `Data-Analytics/Seed-Comment-Tracker.csv` (19 cột, kiểm tra header trước khi ghi).

### Phễu lead

1. Khi khách hỏi lịch trình, báo giá hoặc gửi từ khóa, cấp mã `L-YYYYMMDD-xx`.
2. Bàn giao cẩm nang sau khi được duyệt: Hanoi Secret Food & Photo Guide, bản đồ phố cổ, quy tắc sang đường an toàn.
3. Trạng thái: `New` → `Guide-Sent` → `Qualified` → `Consultation-Scheduled` → `Booked`. Ghi vào `Data-Analytics/Lead-Pipeline-Tracker.csv` (18 cột, kiểm tra header trước khi ghi).

### Kỹ thuật Meta

- Trước mọi việc liên quan Meta, đọc `Technology-Automation/Runbooks/Meta-Connection-And-Publishing-Runbook.md`.
- Viết script riêng bằng file `.mjs` trong thư mục scratch, không chạy chuỗi `node -e` hoặc bash lồng nhiều tầng.
- Facebook: trả lời cấp 1 và 2 bằng `POST /{comment_id}/comments`. Thả tim bằng `POST /{comment_id}/likes`.
- Instagram: chỉ có một cấp trả lời. Khi trả lời sub-comment, dùng `POST /{parent_comment_id}/replies` kèm `@username`.
- Facebook Page `travelframe.vn` ID `1409099405611405`; Graph API v21.0. Thao tác trên Page/Reels dùng Page token (`GET /{PAGE_ID}?fields=access_token`); endpoint Instagram Business dùng token gốc. Cả hai lấy theo runbook, không tự đọc Keychain.
- Ghi audit trail tương tác vào `Marketing-Growth/Content/Instagram-All-Interactions-Log.md`, `Meta-Messenger-All-Interactions-Log.md`, `Threads-All-Interactions-Log.md` (cùng thư mục).
- Cẩm nang bàn giao lead: `Creative-Production/Deliverables/TravelFrame-Hanoi-Secret-Food-And-Photo-Guide-v2.pdf` (bản mới nhất; bản v1 giữ làm lịch sử).
- Bản gốc đầy đủ của manual (sơ đồ, ví dụ C1/C2): `Technology-Automation/Runbooks/TravelFrame-Agent-Operating-Manual.md`.
- **Token:** Secrets là quy tắc ưu tiên. Agent không tự đọc Keychain hay in token. Dù manual có ghi lệnh `security find-generic-password`, việc lấy token do Rocky/runbook xử lý. Cần token để chạy thì hỏi Rocky trước.

### Sau khi thực hiện (bắt buộc trước khi báo hoàn tất)

1. `npm run test:skills` đạt 15/15 PASS.
2. `npm run workspace:check` không lỗi.
3. `git status`: chỉ các file thuộc phạm vi phiên; stage từng file, không `git add .`; không push nếu Rocky chưa yêu cầu.
4. Báo kết quả kèm bằng chứng: ID phản hồi, permalink, timestamp từ Graph API. Không ghi `Published` nếu chưa có bằng chứng từ nền tảng; bài `Scheduled` chỉ là lịch.

### Checkpoint cho chuỗi việc dài

Khi việc kéo dài hoặc chuyển phiên, lưu `Technology-Automation/Handoffs/<YYYY-MM-DD>-<tên>.md` gồm: việc đã làm kèm ID bằng chứng, việc đang chờ duyệt, bước tiếp theo.
