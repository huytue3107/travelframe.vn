# Threads Session Evaluations

## Snapshot 2026-09-26 12:4x — Chu kỳ 1

### Phạm vi

Đánh giá chu kỳ tự động đầu tiên, ngày 26/09/2026, trên rows 464-488 của `Marketing-Growth/Content/Threads-All-Interactions-Log.md`, tổng 25 dòng, tất cả thuộc bảng "Giai đoạn Tự động". Mốc cuối: #488. Hiện tại không còn runner nào đang chạy: phiên c1 feed 5 phút (11:20-11:25), phiên c2 feed 20 phút khởi động 11:46 và dừng 11:52 vì phát hiện chạy song song với phiên international 30 phút khởi động thủ công lúc 11:41; phiên international kết thúc khoảng 12:11.

### Metrics

| Chỉ số | Giá trị |
|---|---|
| Tổng rows | 25 (464-488) |
| Angle nhiều nhất | Yêu thích 7, Nghi ngờ 7 |
| Angle còn lại | Clickbait 4, Tích cực 3, Tự hỏi 3, Newsfeed 1 |
| Topic nhiều nhất | en_itinerary 7, en_solo 4 |
| Topic còn lại | international_vietnam 3, pricing_budget 3, en_food 2, mountain_views 2, street_food 1, en_photo 1, hanoi_autumn 1, Newsfeed like-only 1 |
| Trùng lặp author/URL | 1 cặp: #473 và #474 (@xuan.thetraveler, cùng URL DdtW6u8kbwu) |
| Like-only | #475 (@lyssbncglr, Newsfeed) |
| Leads | 0 |

Ghi chú metrics: tổng angle đếm được 25, khớp số rows. Nhiều comment template lặp giữa các tác giả khác nhau (ví dụ "Huge respect for choosing Vietnam..." ở 473/474/487) nhưng trùng author và URL chỉ có cặp 473/474, có vẻ là bản ghi trùng lặp khi log.

### Giọng thương hiệu

Tổng kết: 12 pass, 12 warn, 1 fail. Không có comment nào chứa dấu gạch ngang ngắt câu hay emoji cuối câu máy móc; comment tiếng Việt duy nhất (#469) dùng ngoặc kép đúng chuẩn.

Warn (kèm row):

- #468: slang Gen Z "hits completely different" không đặt trong ngoặc kép (vi phạm nhẹ quy tắc 1.2.3).
- #469: lệch topic, comment nói cảnh mùa thu phố Hoàng Diệu/Phan Đình Phùng trong khi bài là street_food.
- #470: lặp nguyên văn câu ở #465 (template "Such a well planned route..."), rủi ro spam văn mẫu.
- #476: lệch topic, comment tích cực chung chung, không chạm tới nội dung pricing_budget.
- #479: lặp nguyên văn câu ở #464 (template "Pro tip... do not rush Hanoi").
- #480: lặp nguyên văn câu ở #478 (template "Planning a North Vietnam trip...").
- #482: lệch topic (en_food nhưng comment chỉ nói lịch trình/sáng sớm Phan Đình Phùng) và lặp nguyên văn câu #465.
- #483: lặp nguyên văn câu ở #477 (template "Skip the overpriced tourist spots...").
- #484: topic mountain_views nhưng lời khuyên dồn về phố cổ Hà Nội, không nhắc núi non; đồng thời lặp nguyên văn câu #478.
- #485: lặp nguyên văn câu ở #481 (template "Your Vietnam plans sound absolutely wonderful...").
- #486: lệch topic (pricing_budget nhưng comment chỉ là tip lịch trình) và lặp nguyên văn câu #464.
- #487: lặp nguyên văn template "Huge respect for choosing Vietnam..." đã dùng ở #473 và #474.

Fail (kèm row):

- #474: spam trùng lặp rõ ràng, cùng author @xuan.thetraveler, cùng bài post, comment giống hệt 100% #473, vi phạm quy tắc dedup và author cooldown (playbook 4.3, 5.6).

Các nhóm template bị tái sử dụng nguyên văn 2-3 lần trong phạm vi xét: 464/479/486, 465/470/482, 478/480/484, 473/487, 477/483, 481/485. Lệch topic cột Ngữ cảnh: #469, #476, #482, #484, #486.

### Hành vi phiên

**Phiên c1: `scratch/feed_session_20260926.log`, feed 5 phút (11:20-11:25).** 10 candidates, 8 skips, 2 comments, 10 JEV requests (9 trusted), 0 leads. Comments: @pmlmng #468, @noaccclonenha #469. Skip rate 8/10 do Newsfeed Rule chọn toàn bài phi du lịch. Lưu ý: @pmlmng JEV không trusted (conf 0.54) nhưng vẫn được comment qua fallback keyword "international_vietnam" (source: keyword), có thể là intentional fallback nhưng nên xem lại. Bug: @songwriterplus bị chọn lặp 2 lần cùng URL (Ddt5ITIjvpW), JEV request và abort trùng, nghĩa là fix "stop re-scanning skipped posts" chưa phủ Newsfeed path.

**Phiên c2: `scratch/feed_session_20260926_c2.log`, feed 20 phút, dừng sớm do chạy song song.** 4 candidates, 2 skips, 1 comment, 4 JEV requests (3 trusted), 0 leads. Comment: @xuan.thetraveler #473; like-only: @lyssbncglr #475. @lyssbncglr conf 0.08 untrusted nhưng vẫn like; action like_only rủi ro thấp, chấp nhận được. Phiên dừng sau khoảng 5 phút hiệu dụng vì xung đột với phiên manual cùng tab.

**Chất lượng skip của JEV.** Skip của c1 (8) và c2 (2) đều hợp lý. c1: @meea.xo (mua nhà, phi du lịch), @therealmadamcj (trích dẫn cuộc sống), @lan.sunnyera (FL chéo tiếng Việt), @songwriterplus (chủ đề Native Americans), @thespiralsupport (follow-for-follow), @geauxescargot (en_food nhưng là cranberry/fall flavor, không liên quan travel brand), đều relevant=false với conf cao (0.85-1.0), skip đúng. @realtaylorsharp ("On my way up to Utah") là nội dung travel-ish nhưng ngoài phạm vi TravelFrame (Việt Nam/du lịch địa phương), skip vẫn chấp nhận được. c2: @scholarsfane (sinh nhật) và @musicmccracken ("*poof*" nội dung rác), skip đúng, conf 0.98. Nhận xét chung: JEV hoạt động chính xác ở vai trò lọc, nhưng tỷ lệ skip 8/10 ở c1 cho thấy Newsfeed Rule chọn bài kém; hầu hết thời gian phiên bị tiêu vào JEV request rồi abort thay vì bài travel thật.

### Cảnh báo

1. **Chạy song song 2 runner phá author cooldown.** Phiên c2 (dính feed tab Orca) chạy song song với một phiên international khởi động thủ công lúc 11:41 từ terminal ngoài (không có session log) trên cùng tab Orca. Hệ quả: #473 (c2, @xuan.thetraveler) và #474 (phiên international) trùng cả tác giả lẫn URL @xuan.thetraveler/post/DdtW6u8kbwu; author cooldown bị phá, bài bị tương tác 2 lần từ 2 phiên. Đây là nguồn gốc của fail #474.
2. **c1 re-scan lặp.** @songwriterplus/post/Ddt5ITIjvpW được Newsfeed Rule chọn và JEV-abort 2 lần liên tiếp trong cùng phiên, lãng phí 2 JEV requests; dedup skip chưa chặn path Newsfeed.
3. **c1 inconsistency gate.** @pmlmng JEV relevant=false, conf=0.54 (untrusted) nhưng vẫn đi tiếp và comment nhờ "Verified Topic: international_vietnam [source: keyword]"; nhánh keyword fallback bỏ qua kết quả JEV untrusted.

Khuyến nghị chính từ cảnh báo: chỉ chạy 1 runner tại mỗi thời điểm. Trước khi khởi động runner mới, kiểm tra không còn phiên nào (cũ hay thủ công) đang giữ tab feed.

### Khuyến nghị

- Chỉ chạy 1 runner tại mỗi thời điểm; thêm lock hoặc check phiên đang chạy trước khi start.
- Sửa dedup skip để chặn cả Newsfeed path (tránh re-scan @songwriterplus loại này).
- Xem lại nhánh keyword fallback: JEV untrusted (conf thấp) không nên đi tiếp vào comment.
- Lọc candidate trước khi gọi JEV để giảm tỷ lệ skip 8/10 của Newsfeed Rule, tránh lãng phí JEV requests.
- Đa dạng hóa template comment tiếng Anh: các template đang lặp 2-3 lần trong phạm vi 25 rows; kiểm tra topic khớp cột Ngữ cảnh trước khi đăng.
- Sửa quy tắc 1.2.3: slang Gen Z cần đặt trong ngoặc kép (case #468).
- Ghi log phiên thủ công (phiên international 11:41 không có session log) để đánh giá truy vết được.

Mốc đánh giá sau: log row #488
