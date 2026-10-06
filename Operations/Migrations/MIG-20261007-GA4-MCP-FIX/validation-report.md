# Validation — MIG-20261007-GA4-MCP-FIX

Ngày: 2026-10-07

| Kiểm tra | Kết quả |
|---|---|
| `run.sh --doctor` trên MacBook (Rocky chạy) | OK node v25.8.1 · OK key · OK property 552867189 · OK truy vấn GA4 (activeUsers 7 ngày = 96) |
| MCP xuất hiện lại trong Cowork (4 tool `travelframe-google-analytics__*`) | OK |
| `npm run test:mcp` | # pass 6 # fail 0  |
| Test hồi quy mô phỏng lỗi cũ (`../..`) | Phát hiện được |
| Server không crash khi thiếu key / key sai đường dẫn | OK, trả `isError` và vẫn nhận request tiếp |
| `npm run test:skills` | OK |
| `npm run workspace:check` | 1 mục FAIL có sẵn, không thuộc batch (đường dẫn tuyệt đối trong `scratch/`) |
| `sha256sum -c files.sha256` | 3/3 OK |
