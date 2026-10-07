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
<!-- SHARED-AGENT-POLICY:END -->

## Codex execution

- Dùng `rg` để tìm file và text.
- Dùng `apply_patch` cho thay đổi nội dung thủ công.
- Đọc skill liên quan trong `Technology-Automation/Skills/Departments/<owner>/` trước khi thực hiện workflow chuyên biệt.
- Chạy test, `npm run test:skills` và `npm run workspace:check` trước khi báo hoàn tất.
- Báo rõ limitation hoặc test baseline không chạy được.
