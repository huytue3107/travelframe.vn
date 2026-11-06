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
- Chạy test, `npm run test:skills` và `npm run workspace:check` trước khi báo hoàn tất.
- Báo rõ limitation hoặc test baseline không chạy được.

### Checkpoint giữa các phiên Codex (thử nghiệm)

- Với việc cần nối qua nhiều phiên, lưu một checkpoint trong thư mục của công việc sau mỗi mốc kiểm chứng hoặc trước bước có rủi ro. Ghi việc đã làm và mức kiểm chứng, bằng chứng, việc còn mở, và một bước tiếp theo cụ thể.
- Khi tiếp tục, đọc checkpoint đúng công việc và đối chiếu bằng chứng với trạng thái hiện tại. Checkpoint dùng để bàn giao tiến độ. Quyết định dài hạn tra theo `Source precedence`, quyền thực hiện tra theo `Permissions`.
- Khi Rocky yêu cầu tiếp tục thử nghiệm checkpoint, mở [checkpoint thử nghiệm Codex](Technology-Automation/Handoffs/2026-11-06-Codex-Checkpoint-Pilot.md) và làm bước tiếp theo ở chế độ chỉ đọc.
