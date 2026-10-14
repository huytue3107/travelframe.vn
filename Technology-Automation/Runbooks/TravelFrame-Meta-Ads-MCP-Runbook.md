---
title: TravelFrame Meta Ads MCP Runbook
status: Working
owner: Technology Automation
created: 2026-09-17
updated: 2026-10-07
---

# TravelFrame Meta Ads MCP Runbook

## 1. Mục đích và trạng thái

MCP này chỉ quản lý Meta Ads của TravelFrame. Nó tách biệt với MCP organic
read-only hiện có.

Trạng thái ngày 2026-09-17:

- Source, test, launcher, local registration và local approval flow đã sẵn sàng.
- Page bị khóa: `1409099405611405`.
- Instagram Business Account bị khóa: `17841438272497512`.
- Meta Graph API mặc định: `v26.0`.
- OAuth configuration `TravelFrame Meta Ads MCP` đã được tạo trong app
  `side-agency`.
- Ads access token đã được lưu trong macOS Keychain.
- Business chứa Page TravelFrame đã được xác minh là
  `Vietnam in Frames Hanoi Local & Playgrounds`.
- Chưa khóa ad account vì Business TravelFrame hiện chưa trả về ad account sở
  hữu hoặc client nào, và không có account accessible nào được chứng minh là
  gắn với Page TravelFrame.
- MCP đã qua handshake và live discovery bằng `list_ad_accounts`; read smoke
  theo account và mọi write vẫn chờ bước khóa đúng ad account.

Cập nhật 2026-10-07 (MIG-20261007-META-ADS-MCP-RESTORE):

- Code đã được khôi phục vào `main` (trước đó chỉ nằm trên nhánh `codex/meta-ads-mcp`).
- Ad account TravelFrame đang dùng: **TKQC SIDE112 2 · `act_1423800382160162`**, thuộc
  **BM SIDE 112** (`655212548774099`). Chưa khóa vào Keychain; khóa sau khi `list_ad_accounts`
  xác nhận token nhìn thấy account này.
- `META_ADS_MODE`: mặc định `read`, chỉ có 6 tool đọc. `full` mở toàn bộ tool write/plan và chỉ
  bật khi Rocky duyệt riêng. Giá trị khác làm MCP từ chối khởi động.
- Đăng ký cho Claude Desktop (key `travelframe-meta-ads`):

```json
"travelframe-meta-ads": {
  "command": "/bin/zsh",
  "args": ["<workspace>/Technology-Automation/Scripts/meta-ads-mcp/run.sh"]
}
```

## 2. Ranh giới an toàn

- Không nhận access token, ad account, Page hoặc Instagram ID qua MCP tool.
- Không có tool delete, billing, permission, currency, timezone hoặc account
  spending limit.
- Campaign, ad set và ad mới luôn được tạo ở `PAUSED`.
- Activation cần một plan và native approval riêng.
- Mỗi write dùng plan digest, approval receipt một lần, before-state check,
  read-after-write và audit JSONL đã redacted.
- Creative đang chạy được thay bằng clone-and-replace. Ad thay thế bắt đầu ở
  `PAUSED`.

## 3. Meta app và quyền

Dùng Meta app `side-agency`.

Quyền Ads cần thiết:

- `ads_read`
- `ads_management`
- `business_management`

Quyền asset dùng để xác minh Page và Instagram:

- `pages_show_list`
- `pages_read_engagement`
- `instagram_basic`

Chỉ bổ sung `business_management` nếu bước discovery chứng minh tài khoản hiện
tại không thể liệt kê Business hoặc ad account TravelFrame. Không xin quyền
publish organic, inbox hoặc comment cho connector Ads này.

## 4. Kết nối lần đầu

1. Mở OAuth của app `side-agency`.
2. Rocky tự đăng nhập, xử lý 2FA/security challenge và duyệt quyền.
3. Không dán token vào chat, tài liệu, ảnh chụp hoặc terminal command history.
4. Lưu token bằng helper:

```bash
Technology-Automation/Scripts/meta-ads-mcp/store-token.sh
```

Helper đọc token ở chế độ ẩn và lưu Keychain service
`travelframe-meta-ads`, account `meta-ads-access-token`.

5. Dùng token chỉ với read calls để liệt kê ad account có quyền truy cập.
6. Dùng tool `list_ad_accounts` để đọc các account accessible trước khi khóa
   account.
7. Đối chiếu Business owner, Page `travelframe.vn`, Page ID và Instagram ID.
8. Chỉ sau khi xác minh đúng account, lưu `act_<digits>` vào Keychain service
   `travelframe-meta-ads-account`, account `ad-account-id`.
9. Restart Codex để MCP mới được nạp.

Không chọn account dựa vào tên gần giống hoặc account đầu tiên API trả về.
Nếu chưa có account phù hợp, MCP vẫn khởi động được ở discovery mode; các tool
theo campaign, insight, delivery và write sẽ fail closed cho tới khi account
được khóa.

## 5. Read smoke test

Chạy theo thứ tự:

1. `get_ad_account`
2. `list_campaigns`
3. `get_ads_insights` với khoảng ngày ngắn và field allowlist
4. `get_delivery_state` với object ID vừa đọc từ account đã khóa

Đạt khi:

- Account ID khớp Keychain local.
- Page và Instagram linkage khớp ID đã khóa.
- Currency và timezone được trả về.
- Không có token trong response, paging URL, error hoặc audit.
- Object từ ad account khác bị từ chối.

Trước khi khóa account, chỉ chạy `list_ad_accounts`. Tool này trả về account
accessible, Business metadata và trạng thái cần chọn account; nó không tự khóa
hoặc tự suy đoán account TravelFrame.

## 6. Tạo campaign

Luồng bắt buộc:

```text
draft_campaign_plan
-> review_plan
-> apply_plan_paused
-> kiểm tra read-back
-> activate_plan bằng approval thứ hai
```

Plan phải nêu rõ:

- Objective, conversion destination và buying type.
- Budget strategy, currency và campaign spend limit.
- Start/end time cùng timezone.
- Audience, placements, optimization goal và billing event.
- Page/Instagram actor.
- Creative, CTA và destination URL.
- Business owner, approval reason và source document.

Không có ngân sách mặc định. Số tiền dùng minor units theo contract của Meta
cho currency của ad account.

## 7. Điều khiển và chỉnh sửa

Các tool write được phép:

- `pause_entities`
- `resume_entities`
- `change_budget`
- `change_schedule`
- `change_targeting`
- `change_placements`
- `replace_creative`
- `rollback_plan`

Mỗi lần gọi tạo plan mới, hiện native macOS approval, kiểm tra before-state và
ghi audit. Không dùng một approval cho hai hành động.

## 8. Kiểm tra audit và local state

State mặc định:

```text
~/.codex/travelframe-meta-ads/
```

Các vùng chính:

- `plans/`
- `approvals/`
- `audit/events.jsonl`
- `receipt-signing.key`

File dùng mode `0600`, directory dùng mode `0700`. Không sửa plan, receipt hoặc
signing key bằng tay. Backup phải giữ nguyên permission và không đưa lên Git,
Drive dùng chung hoặc tài liệu khách hàng.

## 9. Reconnect và thu hồi

Khi token hết hạn:

1. Dừng MCP hoặc tắt registration.
2. Thu hồi token cũ trong Meta Business Integrations/App settings.
3. Tạo token mới bằng OAuth user-operated.
4. Chạy lại `store-token.sh`.
5. Restart Codex.
6. Chạy đủ read smoke test trước khi báo reconnect thành công.

Không dùng token organic cũ làm Ads write token nếu quyền và asset binding chưa
được xác minh lại.

## 10. Emergency disable

Cách dừng nhanh nhất:

1. Tắt hoặc xóa local block `[mcp_servers.travelframe_meta_ads]`.
2. Restart Codex.
3. Nếu nghi ngờ credential bị lộ, xóa Keychain item và revoke token trong Meta.
4. Dùng Ads Manager để pause campaign trực tiếp nếu cần phản ứng tức thời.
5. Giữ audit và plan files để điều tra; không xóa lịch sử.

MCP không có cơ chế emergency bypass approval. Pause qua MCP vẫn cần approval.

## 11. Live write test

Live write test chỉ chạy sau một yêu cầu phê duyệt riêng của Rocky.

Test an toàn:

- Tạo campaign/ad set/ad thử nghiệm với ngân sách được Rocky nêu rõ.
- Giữ toàn bộ object ở `PAUSED`.
- Xác minh IDs, configured status, effective status và audit.
- Không activate trong cùng approval.
- Xóa object không nằm trong scope của MCP; nếu cần cleanup, dùng Ads Manager
  sau khi Rocky duyệt riêng.
