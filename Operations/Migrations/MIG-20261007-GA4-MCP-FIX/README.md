# MIG-20261007-GA4-MCP-FIX

## Scope

Sửa MCP Google Analytics (`travelframe-google-analytics`) không khởi động được trên Claude Desktop/Codex.

## Nguyên nhân

- `Scripts/google-analytics-mcp/run.sh` tính `ROOT` thiếu một cấp (`../..`) sau khi script được chuyển vào `Technology-Automation/Scripts/`. Kết quả: Node tìm file tại `Technology-Automation/Technology-Automation/MCP/...` → `MODULE_NOT_FOUND`, server chết ngay khi khởi động.
- Phụ: server crash (unhandled rejection) mỗi khi Google API trả lỗi, client chỉ thấy "disconnected".

## Thay đổi

1. `run.sh`: `ROOT` dùng `../../..`; bổ sung PATH Homebrew/nvm/Volta; chuyển tiếp tham số (`"$@"`).
2. `google-analytics-readonly.mjs` (v0.2.0): bắt lỗi từng tool, không crash; tự tìm key mặc định `~/.config/travelframe/ga4-service-account.json`; property mặc định 552867189; gợi ý xử lý lỗi quyền/key/mạng; chế độ `--doctor` để tự kiểm tra.
3. Test mới `run-scripts-paths.test.mjs`: kiểm tra mọi `Scripts/*/run.sh` trỏ tới file server có thật.

## Files

- `manifest.tsv`: danh sách file, loại thay đổi, SHA-256 trước/sau.
- `files.sha256`: checksum sau thay đổi.
- `validation-report.md`: kết quả kiểm tra.

## Rollback

Commit gốc trước batch: `aa4a25a`.

1. `git revert <commit của batch này>`, hoặc khôi phục từng file:
   `git checkout aa4a25a -- Technology-Automation/Scripts/google-analytics-mcp/run.sh Technology-Automation/MCP/google-analytics-readonly.mjs`
2. Xoá file test mới `Technology-Automation/Tests/legacy/mcp/run-scripts-paths.test.mjs`.
3. So sánh checksum với cột `sha256_before` trong `manifest.tsv`.
4. Khởi động lại Claude Desktop/Codex.

Lưu ý: rollback sẽ làm MCP GA4 lỗi khởi động trở lại.
