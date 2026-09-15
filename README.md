# TravelFrame Company Workspace

Workspace vận hành nội bộ cho TravelFrame, consumer-facing workstream thuộc Hanoi
Expert. Hệ thống kết nối chiến lược, research, content, creative production,
conversion, automation và reporting trong một Company OS có owner rõ ràng.

## Bắt đầu trong 60 giây

1. Đọc `AGENTS.md` nếu bạn là Codex hoặc agent chung; đọc thêm `CLAUDE.md` nếu chạy
   Claude.
2. Đọc `Executive/Current-State.md` để biết ưu tiên và quyết định đang mở.
3. Đọc `Brand-Strategy/Source-Of-Truth-Map.md` trước khi dùng claim, offer hoặc policy.
4. Mở `WORKSPACE-MAP.md` để tìm owner và đường dẫn đúng.
5. Đọc README của phòng ban liên quan trước khi ghi file.

## Source precedence

```text
Yêu cầu trực tiếp mới nhất của Rocky
-> quyết định Approved trong Executive
-> canonical source trong Side Agency vault
-> local approved artifact
-> working document
-> research snapshot
-> draft hoặc render chưa publish
```

## Company map

| Phòng ban | Trách nhiệm chính |
|---|---|
| `Executive/` | Ưu tiên, quyết định, quyền phê duyệt và current state |
| `Brand-Strategy/` | Brand, audience, product, offer, pricing và source map |
| `Research-Insights/` | Research, evidence, transcripts, analysis và knowledge |
| `Marketing-Growth/` | Campaign, calendar, content, distribution và publishing ledger |
| `Creative-Production/` | Source media, production, render, QA và deliverables |
| `Sales-CRM/` | Funnel, ManyChat, qualification, booking và customer journey |
| `Technology-Automation/` | MCP, scripts, tests, agents và technical runbooks |
| `Data-Analytics/` | Metrics, snapshots, campaign results và attribution |
| `Operations/` | SOP, inventory, migration, maintenance và change management |
| `Inbox/` | File chưa phân loại hoặc cần review owner |
| `Archive/` | Artifact ngừng dùng nhưng vẫn giữ provenance |

## Trạng thái chuẩn

- `Draft`: đang soạn.
- `Review`: chờ kiểm tra hoặc phê duyệt.
- `Approved`: đã được người có quyền duyệt.
- `Published`: có URL hoặc platform evidence.
- `Blocked`: thiếu quyết định, quyền hoặc bằng chứng.
- `Archived`: ngừng dùng nhưng không bị xóa.

Render không đồng nghĩa Approved hoặc Published.

## Luồng vận hành

```text
Research-Insights
-> Brand-Strategy
-> Marketing-Growth
-> Creative-Production
-> Marketing-Growth
-> Sales-CRM
-> Data-Analytics
-> Executive
```

`Operations` quản lý workflow xuyên phòng ban. `Technology-Automation` cung cấp công
cụ cho toàn hệ thống.

## Quyền mặc định

Agent được `Read + Draft + Review`. Cần Rocky phê duyệt rõ ràng trước khi:

- Publish hoặc sửa nội dung live.
- Gửi DM, email hoặc phản hồi khách.
- Bật/sửa ManyChat hay automation live.
- Dùng API trả phí.
- Xóa file hoặc thay đổi permission.
- Push Git hoặc tạo remote.

Không đọc, in hoặc commit `.env`, token hay credential. Dùng Keychain hoặc file local
đã ignore.

## Lệnh chính

```bash
npm test
npm run workspace:check
```

Trong migration, đọc `Operations/Migrations/` trước khi đổi đường dẫn hoặc di chuyển
file lớn.
