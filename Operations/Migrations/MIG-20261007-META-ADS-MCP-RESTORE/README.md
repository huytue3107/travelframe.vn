# MIG-20261007-META-ADS-MCP-RESTORE

- Owner: Technology-Automation · Ngày: 2026-10-07 · Trạng thái: Draft (chờ Rocky review, chưa commit, chưa push)
- Yêu cầu: Rocky đồng ý khôi phục Meta Ads MCP và nối ở chế độ chỉ đọc trước (2026-10-07).

## Bối cảnh

Meta Ads MCP được xây trên nhánh `codex/meta-ads-mcp` (20 commit, tip `9287651`, 2026-09-17)
nhưng chưa bao giờ merge vào `main`. Code chỉ nằm trong `.worktrees/meta-ads-mcp`, chỉ đăng ký
cho Codex, và chưa khóa ad account. Claude Desktop vì vậy không có tool Ads nào.

Đã xác minh trong Ads Manager (2026-10-07): chiến dịch TravelFrame `02.10_Travelframe_Prospecting`
chạy trên **TKQC SIDE112 2 · `act_1423800382160162`** thuộc **BM SIDE 112** (`655212548774099`),
không thuộc BM TravelFrame. Account đang dừng vì chạm account spending limit.

## Thay đổi

1. Khôi phục nguyên văn 15 file từ `codex/meta-ads-mcp@9287651` (code, test, store-token, runbook)
   bằng `git show`, không merge, không đổi lịch sử nhánh.
2. `travelframe-meta-ads.mjs`: thêm chế độ `META_ADS_MODE`.
   - Mặc định / `read`: chỉ đăng ký 6 tool đọc: `get_ad_account`, `list_ad_accounts`,
     `list_campaigns`, `get_campaign_structure`, `get_ads_insights`, `get_delivery_state`.
   - `full`: đăng ký toàn bộ tool plan/approval/write như thiết kế gốc (cần Rocky duyệt riêng).
   - Giá trị khác → lỗi khởi động (fail closed).
3. `run.sh`: đặt `META_ADS_MODE=read` mặc định; thêm PATH Homebrew/nvm/Volta cho Claude Desktop
   (cùng bài học MIG-20261007-GA4-MCP-FIX); chuẩn hóa biến `ROOT` theo test launcher chung.
4. Test mới `meta-ads-read-only-mode.test.mjs` (5 test).
5. `package.json`: thêm `test:meta-ads`, `mcp:meta-ads`; `test:mcp` chạy thêm suite Meta Ads.

Không đụng: `travelframe-readonly.mjs`, `travelframe-meta-automation.mjs`, Keychain, token,
cấu hình Claude Desktop, ad account, ngân sách, billing.

## Files

- `manifest.tsv`: path, loại thay đổi, nguồn, SHA-256 trước/sau.
- `files.sha256`: checksum sau thay đổi.
- `validation-report.md`: kết quả kiểm tra.

## Rollback

Base `main@ea9a887`. Batch chưa commit nên rollback là xóa/khôi phục đúng file trong manifest:

```bash
cd "/Users/macbook/Codex GPT/travelframe.vn"
git checkout ea9a887 -- package.json
rm -rf Technology-Automation/MCP/meta-ads Technology-Automation/Scripts/meta-ads-mcp
rm -f Technology-Automation/MCP/travelframe-meta-ads.mjs \
      Technology-Automation/Runbooks/TravelFrame-Meta-Ads-MCP-Runbook.md \
      Technology-Automation/Tests/mcp/meta-ads-*.test.mjs
```

Nếu đã đăng ký vào Claude Desktop: xóa block `travelframe-meta-ads` trong config rồi khởi động lại app.
Nhánh `codex/meta-ads-mcp` vẫn còn nguyên để khôi phục lại khi cần.

## Đăng ký Claude Desktop (2026-10-07, Rocky duyệt "cách B")

- Đã thêm `mcpServers.travelframe-meta-ads` vào `~/Library/Application Support/Claude/claude_desktop_config.json`.
- Backup trước khi sửa: `claude_desktop_config.json.bak-20261007-meta-ads` (cùng thư mục, mode 0600).
- Keychain: token Ads có; ID ad account chưa khóa → MCP chạy ở discovery mode cho tới khi khóa.
- Rollback config: chép đè file backup lên `claude_desktop_config.json`, rồi khởi động lại Claude Desktop.

## Kết quả live sau đăng ký (2026-10-07 16:08 +07)

- Claude Desktop ghi đè config khi thoát; phải thêm block lúc app đã tắt. Đã làm lại bằng script
  (backup thứ 2: `claude_desktop_config.json.bak-20261007-meta-ads-2`). MCP lên, đúng 6 tool đọc.
- `list_ad_accounts` → token hợp lệ nhưng `me/adaccounts` trả rỗng: danh tính sở hữu token chưa được
  gán quyền vào TKQC SIDE112 2. Chưa khóa account. Chờ Rocky cấp quyền hoặc tạo token mới (runbook §4).
