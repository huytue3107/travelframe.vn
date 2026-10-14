# Sprint điều phối: Story FB/IG + Tương tác Threads (09–15/10/2026)

- **Owner:** Marketing-Growth
- **Trưởng nhóm điều phối:** Claude (terminal "Nội dung story Facebook, Instagram")
- **Agent 2:** Codex (Orca terminal `term_cd9fac11…`), phụ trách Story FB + IG
- **Agent 3:** Antigravity (Orca terminal "Agent 3", `term_301379d5…`), phụ trách tương tác Threads
- **Trạng thái:** Working. Nội dung chỉ được đăng sau khi Rocky duyệt lô (batch) trong ngày.

## 1. Bối cảnh và mục tiêu

Nguồn: `Data-Analytics/Reports/2026-10-07-Fanpage-October-MTD-McKinsey-Report.md`.

- Reach/ngày Fanpage giảm 76% (34.920 → 8.460) vì không còn bài "mẹo thực dụng" bùng nổ. Ảnh tĩnh bán dịch vụ chỉ mang 2% reach.
- Follow/1.000 reach tăng ×8, nhưng comment giảm 56%. Tệp người xem đúng hơn, nhưng ít đối thoại.
- **Giới hạn cần hiểu đúng:** Story chủ yếu tới người đã follow, nên story không trực tiếp kéo reach mới. Vai trò của story là tạo tín hiệu tương tác (reply, sticker, tap, DM) để thuật toán ưu tiên feed/reel của kênh với follower, và đẩy DM (kênh chuyển đổi chính). Reach mới đến từ Threads + reel.

**Mục tiêu sprint 7 ngày (đo vào 16/10):**

| Chỉ số | Mục tiêu |
|---|---|
| Story IG: reach/story trung bình | ≥ 15% số follower |
| Story IG: tỷ lệ hoàn thành chuỗi (story cuối / story đầu) | ≥ 60% |
| Story: tổng reply + phản hồi sticker | ≥ 30 / tuần |
| DM mới từ story | ≥ 5 / tuần |
| Threads: reply nhận được trên comment của mình | ≥ 25 / tuần |
| Threads: follow mới | ≥ 40 / tuần |
| Vi phạm (thông tin sai, comment lặp khuôn, engagement-bait) | 0 |

## 2. Quy tắc chung (cả hai agent)

1. **Ngôn ngữ:** Tiếng Anh, đối tượng khách quốc tế đến/định đến Hà Nội, Việt Nam.
2. **Clickbait = tò mò mạnh nhưng đúng sự thật.** Được dùng: curiosity gap, plot twist, "don't do X in Hanoi", "locals never…", con số bất ngờ, câu hỏi gây tranh luận nhẹ. Cấm: bịa thông tin, giá/thời tiết/visa chưa kiểm chứng, khẩn cấp giả, "comment YES / share if…" (Meta giảm reach engagement-bait).
3. **Fact-check:** giá, giờ mở cửa, visa, thời tiết, giao thông phải re-check gần ngày đăng, ghi nguồn trong file draft.
4. **Bản quyền:** chỉ dùng ảnh/video của TravelFrame trong `Creative-Production/Assets/`. Không nhạc có bản quyền. Đọc `Data-Analytics/Reports/2026-10-08-Instagram-Copyright-Risk-Audit.md`.
5. **Giọng văn:** Warm local friend. Không gạch ngang kiểu AI, không hard-sell, không hotline/link quảng cáo trong comment.
6. **Meta/Threads:** đọc `Technology-Automation/Runbooks/Meta-Connection-And-Publishing-Runbook.md` trước khi đụng token hay API. Không đọc/in token. Không thêm chức năng ghi vào `travelframe-readonly.mjs`.
7. **Quyền đăng:** agent soạn lô cho ngày hôm sau → Rocky ghi `APPROVED` (hoặc sửa/xóa mục) trong file lô → agent mới được đăng đúng các mục đã duyệt. Mục không duyệt thì không đăng.
8. **Báo cáo:** mỗi agent cập nhật file STATUS của mình sau mỗi phiên làm việc. Trưởng nhóm đọc STATUS, chấm điểm và giao việc tiếp.

Thư mục làm việc chung: `Marketing-Growth/Content/Stories-Threads-Sprint/`

```
Stories-Threads-Sprint/
  STATUS-Agent2.md
  STATUS-Agent3.md
  Lead-Evaluations.md          (trưởng nhóm ghi)
  agent2-stories/
    research/                  nghiên cứu hook, đối thủ
    batches/YYYY-MM-DD-Story-Batch.md
    assets/YYYY-MM-DD/         khung 1080x1920 đã render
  agent3-threads/
    research/
    batches/YYYY-MM-DD-Threads-Batch.md
    logs/
```

## 3. Agent 2 (Codex): Story Facebook + Instagram

**Phase A, nghiên cứu (hạn: hết 08/10)**
1. Quét 8–10 tài khoản travel/Vietnam/Hanoi tiếng Anh có story mạnh (dùng `channel-scout`/Apify nếu cần, hoặc Orca browser). Ghi lại 20 mẫu hook story, cách dùng sticker, nhịp chuỗi.
2. Đọc lại bài mạnh của chính kênh: *Packing for Hanoi*, *Hungry in Vietnam? học gọi bánh mì*, tiền Việt, từ tiếng Việt cơ bản, phố đi bộ. Đây là chủ đề gốc để biến thành story.
3. Kiểm tra năng lực đăng: Graph API đăng story IG (`media_type=STORIES`) và FB Page (`photo_stories`). **API không hỗ trợ sticker poll/quiz/question/link.** Phải đánh dấu rõ khung nào "API" và khung nào "MANUAL" (cần sticker, Rocky đăng tay hoặc qua Meta Business Suite).
4. Output: `agent2-stories/research/2026-10-08-Story-Hook-Research.md`.

**Phase B, sản xuất hằng ngày**
- 4–6 khung story/ngày, dạng chuỗi có cốt truyện: Hook (khung 1) → mở dần thông tin (2–4) → sticker tương tác (poll/quiz/slider/question) → soft CTA DM keyword.
- Mỗi chuỗi một chủ đề "mẹo thực dụng" hoặc "plot twist Hà Nội". Ví dụ: "I paid 10x for this in Hanoi. Here's why 👀" → giá thật → quiz "Guess the local price?" → "DM 'PRICE' for my cheat sheet".
- Đăng cùng nội dung lên IG và FB Page.
- File lô: `agent2-stories/batches/2026-10-09-Story-Batch.md` (mỗi khung: text overlay, ảnh nguồn, sticker, API/MANUAL, nguồn fact-check).
- Render khung 1080x1920 vào `agent2-stories/assets/2026-10-09/`.

**Công cụ đăng:** viết script riêng `Technology-Automation/Scripts/meta-automation-mcp/publish-story.mjs`, mặc định `--dry-run`, chỉ đăng thật khi có cờ `--live` và lô đã có `APPROVED`. Kiểm tra bằng `test-publish-capability.mjs` theo runbook. Không sửa `travelframe-readonly.mjs`.

**Sau khi đăng:** sau 24 giờ kéo insights story (reach, taps forward/back, exits, replies) bằng API read-only, ghi vào STATUS.

## 4. Agent 3 (Antigravity): Tương tác Threads

**Phase A, nghiên cứu (hạn: hết 08/10)**
1. Danh sách 30 tài khoản/chủ đề Threads tiếng Anh nơi khách quốc tế bàn về Việt Nam/Hà Nội (travel creators, digital nomad, expat, solo female travel, food). Ghi follower, tần suất đăng, kiểu comment nhận được nhiều like.
2. Từ khóa tìm kiếm: `hanoi`, `vietnam trip`, `solo travel vietnam`, `hanoi food`, `vietnam itinerary`, `first time vietnam`, `hanoi autumn`.
3. Khai thác 30 top comment có tương tác cao, rút ra mô-típ (ghi thêm vào `Research-Insights/Library/knowledge/threads-high-engagement-comments.json`).
4. Đọc `Data-Analytics/Threads-Session-Evaluations.md`: runner có 2 lỗi chưa sửa (nhãn chủ đề lệch nội dung, comment lặp khuôn "Such a well planned route" ×14). **Chưa được chạy comment tự động bằng runner cho tới khi 2 lỗi này được sửa và trưởng nhóm duyệt.**
5. Output: `agent3-threads/research/2026-10-08-Threads-Target-Research.md`.

**Phase B, tương tác hằng ngày**
- Lô hằng ngày `agent3-threads/batches/2026-10-09-Threads-Batch.md`: 15–20 thread mục tiêu (URL thật), mỗi thread 1 reply viết riêng theo ngữ cảnh, kiểu "local insider + chi tiết tò mò" (ví dụ: "Plot twist: the best phở near Hoàn Kiếm closes at 9am. Most tourists show up at noon 😅"). Không câu nào lặp lại khuôn.
- Thêm 2 bài Threads gốc/ngày dạng câu hỏi gây tò mò hoặc tranh luận nhẹ (ví dụ: "Unpopular opinion: Hanoi is better than Hội An for first-timers. Change my mind").
- Sau khi Rocky duyệt: đăng tay qua Orca browser tab Threads, nhịp 45–75 giây, tối đa 20 comment/phiên, cooldown tác giả 30 bài.
- Ghi mọi tương tác vào `Marketing-Growth/Content/Threads-All-Interactions-Log.md`, lead thật vào STATUS.

## 5. Đánh giá của trưởng nhóm

Ghi tại `Stories-Threads-Sprint/Lead-Evaluations.md`, mỗi ngày một lần.

**Rubric chất lượng nội dung (10 điểm, chấm từng lô trước khi đưa Rocky duyệt):**

| Tiêu chí | Điểm |
|---|---|
| Hook tạo tò mò trong 1 giây đầu | 2 |
| Đúng sự thật, có nguồn kiểm chứng | 2 |
| Giá trị thực dụng cho khách quốc tế | 2 |
| Có cơ chế tương tác tự nhiên (sticker, câu hỏi) | 2 |
| Giọng thương hiệu, không lặp khuôn, không bait cấm | 2 |

Lô < 7/10 trả về agent sửa. Lô ≥ 7/10 chuyển Rocky duyệt.

**Scorecard hiệu quả agent (hằng ngày):** đúng hạn, % mục qua rubric lần đầu, số vi phạm, kết quả so với mục tiêu ở mục 1. Hai ngày liên tiếp dưới chuẩn thì trưởng nhóm đổi hướng nội dung hoặc phân công lại.

## 6. Lịch

| Ngày | Agent 2 | Agent 3 | Trưởng nhóm |
|---|---|---|---|
| 08/10 | Research + lô 09/10 + script dry-run | Research + lô 09/10 | Chấm lô, gửi Rocky |
| 09–14/10 | Đăng lô đã duyệt, soạn lô hôm sau, kéo insights | Tương tác lô đã duyệt, soạn lô hôm sau | Chấm điểm, điều chỉnh |
| 15/10 | Báo cáo tuần | Báo cáo tuần | Báo cáo tổng hợp cho Rocky |

## 7. Cập nhật phân vai (2026-10-08, theo yêu cầu Rocky)

- **Agent 2 (Codex): nghiên cứu, đào sâu, viết nội dung.** Toàn bộ nghiên cứu (đối thủ, trend, comment, khách hàng, hook, nguồn fact-check) và soạn lô Story, lô Threads (reply, bài gốc). Dùng gói kiến thức `Stories-Threads-Sprint/Agent2-Knowledge-Pack.md`.
- **Agent 3 (Antigravity): triển khai đăng.** Chỉ đăng và tương tác trên Meta Business Suite (Story IG/FB) và Threads, qua Orca browser CLI, đúng nội dung lô đã APPROVED. Không tự nghiên cứu, không sửa chữ. Ghi log và STATUS, báo lỗi và blocker.
- **Claude (trưởng nhóm):** giao việc, chấm lô theo rubric, chuyển Rocky duyệt, theo dõi Agent 3, báo cáo cho Rocky.
- Luồng: Agent 2 soạn gói → Claude chấm (≥7/10) → Rocky APPROVED → Agent 3 đăng → Agent 2 phân tích kết quả sau 24 giờ → vòng sau.

## 8. Điều chỉnh sau báo cáo 11/10 (Rocky duyệt "oke điều chỉnh")

Nguồn: `Data-Analytics/Reports/2026-10-11-Social-Performance-Report.md`.

- **Ưu tiên format:** reel POV đời thường + chi tiết bất ngờ, và mẹo thực dụng (tiếng Việt, tiền, đồ ăn, đi lại). Bám tin hot khi có (ví dụ BIGBANG).
- **Không đăng ảnh tĩnh bán dịch vụ lên feed.** Ảnh dịch vụ chuyển sang story hoặc ads.
- **Facebook tối đa 2–3 bài/ngày**, không dồn 10–12 bài.
- **Mỗi lô phải có kế hoạch đo:** story kéo insights sau 24 giờ, Threads ghi số reply nhận được.
- **Agent 2:** phân tích reel quán cà phê viral (DeRw7HjNeRB) và viết 5 reel cùng công thức + 1 comment ghim mời DM cho reel đó.
- **Agent 3:** sửa caption lịch Hanna (bài 2–7) trước 19:00 ngày 12/10.
