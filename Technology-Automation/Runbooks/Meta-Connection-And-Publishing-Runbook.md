# Runbook — Kết nối Meta (Facebook + Instagram), token và đăng bài

- Owner: Technology-Automation · Cập nhật: 2026-10-07 · Trạng thái: Approved (Rocky yêu cầu lưu làm hướng dẫn chuẩn)
- Đọc file này TRƯỚC KHI làm bất kỳ việc gì liên quan: token Meta, MCP `travelframe-meta`,
  đọc số liệu FB/IG, phân tích comment, đăng bài, seed comment.
- Mục tiêu: không phải dò lại từ đầu. Mọi ID, vị trí, lỗi đã gặp và cách xử lý đều ở đây.

## 1. Bản đồ tài sản (ID cố định)

| Thành phần | Giá trị |
|---|---|
| Business portfolio | **Vietnam in Frames Hanoi Local & Playgrounds** · `1616308550118477` |
| Facebook Page | travelframe.vn · `1409099405611405` (Primary Page) |
| Instagram Business | @travelframe.vn · `17841438272497512` |
| Meta app dùng cho TravelFrame | **TravelFrame Automation** (tên cũ: TravelFrame Read Only) · `1386893646976470` · chế độ Unpublished (đủ dùng nội bộ) |
| Configuration (Login for Business) | TravelFrame Read Only MCP · `2634460951256208` — chỉ tạo token USER ngắn hạn, KHÔNG dùng cho production |
| System User | **Tue** · `61594981028618` · Admin · đã gán Page + Instagram (Full access) + app |
| App KHÔNG được dùng | side-agency `1860192954576963` (thuộc BM `1041404607485460`) — không có quyền IG publish |
| Ad accounts | Không nằm trong portfolio này (ở BM khác) → token ads phải tách riêng |

Link nhanh:
- System users: `https://business.facebook.com/latest/settings/system_users?business_id=1616308550118477&selected_user_id=61594981028618`
- App dashboard: `https://developers.facebook.com/apps/1386893646976470/dashboard/?business_id=1616308550118477`
- Quyền của app (use cases): `https://developers.facebook.com/apps/1386893646976470/use_cases/`
- Nội dung Page (90 ngày, có số liệu từng bài): `https://business.facebook.com/latest/posts/published_posts?asset_id=1409099405611405&business_id=1616308550118477`
- Inbox comment FB: `https://business.facebook.com/latest/inbox/facebook?asset_id=1409099405611405&business_id=1616308550118477&mailbox_id=1409099405611405`

## 2. Kiến trúc kết nối

| Thành phần | Vai trò | Ghi chú |
|---|---|---|
| `Technology-Automation/MCP/travelframe-readonly.mjs` | MCP `travelframe-meta` (CHỈ ĐỌC): Page, posts, IG profile/media/insights, comment, Messenger | Có test bắt buộc không có POST/DELETE. **Không thêm chức năng ghi vào file này.** Tự đổi System User token → Page token cho `/posts`. |
| `Technology-Automation/MCP/travelframe-meta-automation.mjs` | MCP ghi: trả lời comment FB/IG (có `dry_run`) | Chưa có tool đăng bài. Tool đăng bài (khi làm) đặt ở đây, mỗi lần đăng cần Rocky duyệt. |
| `Technology-Automation/Scripts/meta-automation-mcp/fix-token.sh` | Lưu token vào Keychain (làm sạch, kiểm tra với Meta trước khi lưu); `--check` kiểm tra token đang lưu | Không in token. Chỉ Rocky chạy chế độ lưu. |
| `Technology-Automation/Scripts/meta-automation-mcp/test-publish-capability.mjs` | Kiểm tra quyền + thử đăng KHÔNG công khai: FB bài `published=false` rồi xoá; IG tạo container, KHÔNG publish | Agent được phép chạy để chẩn đoán. Không in token. |
| macOS Keychain | `account=macbook / service=travelframe-meta-readonly` và `account=travelframe-page-access / service=travelframe-meta-automation-token` | `fix-token.sh` ghi cùng 1 token vào cả 2 chỗ. |

## 3. Trạng thái chuẩn (baseline 2026-10-07)

- Token: **SYSTEM_USER · app TravelFrame Automation · không bao giờ hết hạn**.
- Đã kiểm chứng: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`, `instagram_basic`,
  `instagram_content_publish`; FB tạo/xoá bài ẩn OK; IG container FINISHED.
- Còn thiếu: `pages_messaging` (Messenger lỗi #200) và có thể `pages_read_user_content`
  (API comment FB trả rỗng). Sửa bằng cách tạo lại token System User và tick thêm 2 quyền này.
- GitHub: commit `2d4835d` đã tạo, Rocky cần tự chạy `git push origin main` (máy agent không có credential GitHub).

## 4. Quy trình chuẩn theo yêu cầu của Rocky

### "Check token / kết nối Meta thế nào"
1. Gọi `get_travelframe_connection` (MCP `travelframe-meta`).
2. Chạy bài thử (Claude: qua tool osascript trên Mac; Codex: chạy trực tiếp trên Mac):
   `cd "/Users/macbook/Codex GPT/travelframe.vn" && node Technology-Automation/Scripts/meta-automation-mcp/test-publish-capability.mjs`
3. Đạt khi: `SYSTEM_USER`, `hết hạn: không bao giờ`, mọi dòng ✅.
4. Thử thêm `list_facebook_conversations` (cần `pages_messaging`) nếu việc có dính Messenger.

### "Token hết hạn / lỗi Session has expired / Cannot parse access token"
| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Session has expired on …` (mốc giờ chẵn) | Token USER ngắn hạn (Graph API Explorer/Configuration) | Làm token System User Never (mục 5) |
| `Invalid OAuth access token - Cannot parse` | Token lưu sai: dính ngoặc kép, khoảng trắng, dán thiếu | Chạy lại `fix-token.sh` (tự làm sạch) |
| `Invalid OAuth 2.0 Access Token` ở `/posts` | Dùng token không phải Page token | MCP đã tự đổi; nếu vẫn lỗi → reload connector |
| `(#10) Requires instagram_content_publish` | Token tạo từ app sai (side-agency) hoặc thiếu quyền | Token phải từ app TravelFrame Automation, tick quyền |
| `(#200) Requires permission: pages_messaging` | Token thiếu quyền Messenger | Tạo lại token, tick `pages_messaging` |
| `No permissions available — Assign an app role to the system user` | System User chưa được gán app | Business Settings → Apps → TravelFrame Automation → Assign people → Tue → Full control |
| Quyền đã thêm vào app nhưng token vẫn thiếu | Token tạo trước khi thêm quyền, hoặc Configuration chưa chọn quyền | Tạo token MỚI sau khi lưu quyền |
| Instagram "Nothing assigned yet" ở System User | Chưa gán quyền IG cho Tue | Instagram accounts → Manage → Full control |

### "Phân tích nội dung / comment Facebook"
1. Số liệu từng bài: mở trang Content (link mục 1) → "Last 90 days" → cuộn để tải hết → trích bảng
   bằng JS trong trình duyệt. Cột theo thứ tự: Reach, Views, Viewers, Follows, Interactions, Likes,
   Comments, Shares, Saves, Link clicks… Bài chạy ads có chữ "from ads" → tách riêng.
2. Comment: Inbox → Facebook comments → mở từng thread (click vào dòng phụ dưới caption), bấm
   "View more comments/replies" rồi đọc text. Không ghi tên người comment vào báo cáo.
3. Instagram: `list_instagram_media`, `get_instagram_insights` (metric_type=total_value).
4. Báo cáo lưu `Data-Analytics/Reports/YYYY-MM-DD-<slug>.md`. Mẫu: `2026-10-07-Facebook-Content-And-Comment-Audit.md`.

### "Đăng bài lên FB/IG"
- Hiện tại: chưa có tool đăng bài qua API. Hai cách:
  1. Business Suite → Create post/reel (trình duyệt), agent điền sẵn, chụp preview, **Rocky trả lời "đăng" mới bấm Publish**.
  2. Khi làm tool API: đặt trong `travelframe-meta-automation.mjs` (`publish_facebook_post`, `publish_instagram_media`), có `dry_run`, mỗi lần đăng cần Rocky duyệt.
- Sau khi đăng: bắt buộc chạy bước Seed comment theo
  `Marketing-Growth/Guidelines/2026-10-07-Seed-Comment-Playbook.md` và ghi `Data-Analytics/Seed-Comment-Tracker.csv`
  (chỉ Facebook + Instagram, không áp dụng Threads).

## 5. Tạo token System User hạn Never (Rocky tự làm — agent chỉ mở trang và hướng dẫn)

1. Business Settings → System users → **Tue**.
2. Assigned assets: Page travelframe.vn = Full access; Instagram travelframe.vn = Full access.
3. Business Settings → Apps → TravelFrame Automation → Assign people → Tue → Full control.
4. Tue → **Generate token** → app **TravelFrame Automation** → Set expiry **Never** (mặc định là 60 days — phải đổi) →
   tick quyền: `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`, `pages_manage_posts`,
   `pages_manage_engagement`, `pages_messaging`, `instagram_basic`, `instagram_content_publish`,
   `instagram_manage_comments`, `instagram_manage_insights`, `instagram_manage_messages`, `business_management`.
5. Copy token → Terminal: `./Technology-Automation/Scripts/meta-automation-mcp/fix-token.sh` → dán.
6. Kiểm tra: `fix-token.sh --check` hoặc `test-publish-capability.mjs` (mục 4).
7. Reload connector Meta trong app Claude.

KHÔNG lấy token từ Graph API Explorer (luôn ngắn hạn). KHÔNG dán token vào chat; nếu đã dán → Revoke và tạo token mới.

## 6. Giới hạn của agent (đã xác nhận 2026-10-07)

- Agent KHÔNG: đọc/in/lưu token, nhập token vào ô web, ghi Keychain, tạo System User, gán quyền/tài sản,
  bấm Generate token, push GitHub. Hệ thống chặn các thao tác cấp quyền — đừng thử lại bằng cách khác;
  mở đúng trang và hướng dẫn Rocky bấm.
- Agent ĐƯỢC: đọc số liệu qua MCP, đọc Business Suite/Developer bằng trình duyệt, chạy
  `test-publish-capability.mjs`, sửa code/script trong workspace, commit (không push) khi Rocky yêu cầu.
- Mọi thao tác công khai (đăng bài, đăng/trả lời comment, gửi tin nhắn) cần Rocky duyệt từng lần.
