# Validation — MIG-20261007-META-ADS-MCP-RESTORE

Chạy 2026-10-07 trên bản sao workspace (Node v22).

| Kiểm tra | Kết quả |
|---|---|
| 15 file khôi phục so byte với `codex/meta-ads-mcp@9287651` | Khớp (3 file sửa có chủ đích: entry server, run.sh, runbook) |
| `node --test Tests/legacy/mcp/*.test.mjs Tests/mcp/meta-ads-*.test.mjs` | 158/158 pass |
| Riêng suite Meta Ads (gồm 5 test read-only mới) | 151/151 pass |
| Khởi động stdio với token giả, `tools/list` | Server `travelframe-meta-ads`, đúng 6 tool, tất cả `readOnlyHint=true` |
| `bash -n run.sh` | OK |
| `npm run test:skills` | 15/15 OK |
| `npm run workspace:check` | 9 PASS · 1 FAIL `legacy absolute paths` do 5 dòng trong `scratch/` có sẵn trước batch, không thuộc batch |
| Không có token/secret trong file batch | OK (test `source-safety` + grep) |

Chưa kiểm tra (cần máy Mac của Rocky, Keychain và mạng Meta):
- `run.sh` đọc Keychain thật và khởi động trong Claude Desktop.
- `list_ad_accounts` live, khóa `act_1423800382160162`, read smoke test theo runbook §5.
