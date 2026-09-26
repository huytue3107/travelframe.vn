# Threads Session Evaluations

## Snapshot 2026-09-26 12:51 — Chu kỳ 1

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

Ghi chú metrics: tổng angle đếm được 25, khớp số rows. Nhiều comment template lặp giữa các tác giả khác nhau (ví dụ "Huge respect for choosing Vietnam..." ở 473/474/487) nhưng trùng author và URL chỉ có cặp 473/474, nguyên nhân là 2 runner song song cùng tương tác một bài (xem Cảnh báo 1), không phải lỗi ghi log.

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

**Phiên c1: `scratch/feed_session_20260926.log`, feed 5 phút (11:20-11:25).** 10 candidates, 8 skips, 2 comments, 10 JEV requests (9 trusted), 0 leads. Comments: @pmlmng #468, @noaccclonenha #469. Skip rate 8/10 do Newsfeed Rule chọn toàn bài phi du lịch. Lưu ý: @pmlmng JEV không trusted (conf 0.54) nhưng vẫn được comment qua fallback keyword "international_vietnam" (source: keyword); đây là hành vi theo thiết kế (feed mode fallback keyword khi conf ≥ 0.5, DES-20260925), không phải lỗi, nhưng đáng cân nhắc siết nếu muốn an toàn hơn. Bug re-scan: @songwriterplus bị chọn lặp 2 lần cùng URL (Ddt5ITIjvpW), lãng phí 1 JEV request; lưu ý c1 chạy TRƯỚC khi fix được áp dụng, fix đánh dấu seenUrls trên đường skip đã commit 579403c ngay sau đó và phủ đúng path Newsfeed, phiên sau sẽ xác nhận.

**Phiên c2: `scratch/feed_session_20260926_c2.log`, feed 20 phút, dừng sớm do chạy song song.** 4 candidates, 2 skips, 1 comment, 4 JEV requests (3 trusted), 0 leads. Comment: @xuan.thetraveler #473; like-only: @lyssbncglr #475. @lyssbncglr conf 0.08 untrusted nhưng vẫn like; action like_only rủi ro thấp, chấp nhận được. Phiên dừng sau khoảng 5 phút hiệu dụng vì xung đột với phiên manual cùng tab.

**Chất lượng skip của JEV.** Skip của c1 (8) và c2 (2) đều hợp lý. c1: @meea.xo (mua nhà, phi du lịch), @therealmadamcj (trích dẫn cuộc sống), @lan.sunnyera (FL chéo tiếng Việt), @songwriterplus (chủ đề Native Americans), @thespiralsupport (follow-for-follow), @geauxescargot (en_food nhưng là cranberry/fall flavor, không liên quan travel brand), đều relevant=false với conf cao (0.85-1.0), skip đúng. @realtaylorsharp ("On my way up to Utah") là nội dung travel-ish nhưng ngoài phạm vi TravelFrame (Việt Nam/du lịch địa phương), skip vẫn chấp nhận được. c2: @scholarsfane (sinh nhật) và @musicmccracken ("*poof*" nội dung rác), skip đúng, conf 0.98. Nhận xét chung: JEV hoạt động chính xác ở vai trò lọc, nhưng tỷ lệ skip 8/10 ở c1 cho thấy Newsfeed Rule chọn bài kém; hầu hết thời gian phiên bị tiêu vào JEV request rồi abort thay vì bài travel thật.

### Cảnh báo

1. **Chạy song song 2 runner phá author cooldown.** Phiên c2 (dính feed tab Orca) chạy song song với một phiên international khởi động thủ công lúc 11:41 từ terminal ngoài (không có session log) trên cùng tab Orca. Hệ quả: #473 (c2, @xuan.thetraveler) và #474 (phiên international) trùng cả tác giả lẫn URL @xuan.thetraveler/post/DdtW6u8kbwu; author cooldown bị phá, bài bị tương tác 2 lần từ 2 phiên. Đây là nguồn gốc của fail #474.
2. **c1 re-scan lặp.** @songwriterplus/post/Ddt5ITIjvpW được Newsfeed Rule chọn và JEV-abort 2 lần liên tiếp trong cùng phiên, lãng phí 1 JEV request; đã fix (đánh dấu seenUrls trên đường skip, commit 579403c) ngay sau khi c1 kết thúc.
3. **c1 keyword fallback khi JEV untrusted.** @pmlmng JEV relevant=false, conf=0.54 (untrusted) nhưng vẫn đi tiếp và comment nhờ "Verified Topic: international_vietnam [source: keyword]". Theo thiết kế (feed mode fallback keyword khi conf ≥ 0.5), không phải lỗi; nếu muốn an toàn hơn có thể siết ngưỡng fallback cho hành vi comment.

Khuyến nghị chính từ cảnh báo: chỉ chạy 1 runner tại mỗi thời điểm. Trước khi khởi động runner mới, kiểm tra không còn phiên nào (cũ hay thủ công) đang giữ tab feed.

### Khuyến nghị

- Chỉ chạy 1 runner tại mỗi thời điểm; cân nhắc thêm lockfile vào runner (can approval Rocky) hoặc luôn check `ps` trước khi start.
- Dedup skip: đã fix (commit 579403c); xác nhận hiệu lực ở phiên tự động tiếp theo.
- Lọc candidate trước khi gọi JEV để giảm tỷ lệ skip 8/10 của Newsfeed Rule, tránh lãng phí JEV requests.
- Đa dạng hóa template comment tiếng Anh: các template đang lặp 2-3 lần trong phạm vi 25 rows; kiểm tra topic khớp cột Ngữ cảnh trước khi đăng.
- Tuân thủ quy tắc 1.2.3: slang tiếng Anh cần đặt trong ngoặc kép (case #468).
- Ghi log phiên thủ công (phiên international 11:41 không có session log) để đánh giá truy vết được.

Mốc đánh giá sau: log row #488

## Snapshot 2026-09-26 13:41 — Chu kỳ 2

Không có hoạt động mới: 0 runner đang chạy, log dừng ở #488 (không đổi từ chu kỳ 1). Không cần đánh giá workflow khi 0 dòng mới. Monitor vẫn gắn; chờ phiên thủ công hoặc chu kỳ sau.

Mốc đánh giá sau: log row #488

## Snapshot 2026-09-26 14:59 — Chu kỳ 3

Không có hoạt động mới: 0 runner, log dừng ở #488. Monitor đã gắn lại.

Mốc đánh giá sau: log row #488

## Snapshot 2026-09-26 15:47 — Chu kỳ 4

Không có hoạt động mới: 0 runner, log dừng ở #488. Đã 3 chu kỳ liên tiếp im lặng (từ 12:11 khi phiên international kết thúc). Monitor vẫn gắn.

Mốc đánh giá sau: log row #488

## Snapshot 2026-09-26 16:52 — Chu kỳ 5

Không có hoạt động mới: 0 runner, log dừng ở #488. Monitor vẫn gắn.

Mốc đánh giá sau: log row #488

## Snapshot 2026-09-26 17:47 — Chu kỳ 6

**Phiên đang chạy:** international 30 phút (PID 61905, Rocky khởi động 17:41:49, dự kiến kết thúc ~18:12), 1 runner duy nhất, không xung đột. Đã ghi nhận, không can thiệp.

**Phạm vi:** rows #489-492 (4 tương tác mới từ phiên này).

**Metrics:** Angle xoay tua hợp lệ (Yêu thích x2, Tự hỏi x1, Clickbait x1), 0 like-only, 0 trùng author/URL trong phạm vi. Topic: en_itinerary x2, en_food x2.

**Giọng thương hiệu:** 3/4 pass, 1 warn (#492: lệch ngữ cảnh, cột en_itinerary nhưng comment khen ảnh/aesthetic; đồng thời lặp nguyên văn #468). 0 fail. Không vi phạm gạch ngang, emoji đặt đúng giữa câu.

**Cảnh báo chính (tiếp diễn từ chu kỳ 1):** spam văn mẫu, 3/4 dòng tái sử dụng template cũ: #492 trùng 100% #468, #490 trùng 100% #443, #489 là bản rút gọn template "Such a well planned route..." (đã dùng tối thiểu 4 lần: #465, #470, #482, #489). Chỉ #491 là comment mới hoàn toàn và là tốt nhất batch (gợi ý quán cụ thể: bún chả Hàng Quất, cà phê trứng Nguyễn Hữu Huân).

**Điểm tốt:** phiên single-runner hoạt động sạch; angle rotation đúng; comment #491 cho thấy pool có chất lượng khi sinh mới.

**Khuyến nghị:** runner đang bơm lại template pool cũ thay vì sinh comment mới theo ngữ cảnh; cần mở rộng/thay thế template đã dùng ≥2 lần trước khi cho batch tiếp theo (cần Rocky phê duyệt sửa runner).

Mốc đánh giá sau: log row #492

## Snapshot 2026-09-26 18:34 — Chu kỳ 7 (đánh giá trọn phiên international 17:41)

**Phiên đã kết thúc** (~18:12), 1 runner duy nhất suốt phiên, sạch. **Phạm vi:** rows #493-506 (14 tương tác).

**Metrics:** 0 like-only, 0 trùng author/URL trong phạm vi (author cooldown OK). Angle: Tích cực 4, Tự hỏi 4, Clickbait 2, Nghi ngờ 2, Yêu thích 2. Topic: en_itinerary 7, mountain_views 3, hanoi_autumn 2, pricing_budget 1, international_vietnam 1.

**Giọng thương hiệu: 6 pass / 3 warn / 5 fail.** Không vi phạm gạch ngang hay emoji cuối câu. Fail:
- #498: lặp nguyên văn lần thứ 6 "Huge respect for choosing Vietnam..."
- #499: slang "plot twist" KHÔNG đặt ngoặc kép (vi phạm bắt buộc 1.2/5.5)
- #504: trùng nguyên văn #496 vừa đăng TRONG CÙNG phiên (10 dòng trước) + lệch ngữ cảnh hanoi_autumn
- #505: trùng nguyên văn #497 vừa đăng trong cùng phiên + lệch ngữ cảnh mountain_views
- #506: trùng nguyên văn #489 (họ "Such a well planned route" đạt mốc 13 lần toàn file)

Warn: #495 (mở đầu "Ever wonder why..." lần thứ 12), #496 (mountain_views nhưng generic), #501 (template "Skip the overpriced tourist spots" lần thứ 6).

**Cảnh báo nghiêm trọng:** máy đang xả template cũ thay vì viết mới. 2/3 fail là lặp nguyên văn, kể cả trùng TRONG CÙNG PHIÊN (#504=#496, #505=#497) — cho thấy đường sinh comment theo angle (generateGenZComment) không kiểm tra dedup comment gần đây (recentCommentTexts chỉ áp cho đường pool theo topic). 3 template nóng nhất: "Such a well planned route" 13 lần, "Ever wonder why" 12 lần, "Huge respect" + "Skip the overpriced" 6 lần mỗi cái.

**Khuyến nghị cần Rocky phê duyệt sửa runner:**
1. Đưa dedup recentCommentTexts vào cả đường generateGenZComment (chặn trùng trong phiên như #504/#505).
2. Bắt buộc ngoặc kép cho slang trong template EN (case #499).
3. Mở rộng/thay thế template EN đã dùng >=3 lần (13/12/6/6) hoặc nối phase cá nhân hoá JEV.

Mốc đánh giá sau: log row #506

## Snapshot 2026-09-26 18:47 — Chu kỳ 8

Không có hoạt động mới kể từ chu kỳ 7 (0 runner, log dừng ở #506). Đang chờ Rocky quyết định 3 fix runner (dedup in-session, ngoặc kép slang, thay template cũ).

Mốc đánh giá sau: log row #506

## Snapshot 2026-09-26 19:41 — Chu kỳ 9

Không có hoạt động mới (0 runner, log dừng ở #506). Vẫn đang chờ Rocky quyết định 3 fix runner.

Mốc đánh giá sau: log row #506
