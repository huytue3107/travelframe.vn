# STATUS Agent2

_Cập nhật sau mỗi phiên: việc đã làm, file output, blocker, câu hỏi cho trưởng nhóm._

## 2026-10-08 — Phase A research

- **Đã làm:** Đọc quy tắc sprint, runbook Meta, copyright-risk audit, voice-playbook/patterns và các bài mẫu TravelFrame về qua đường Hà Nội, bánh mì, cụm từ tiếng Việt và photo confidence. Thu thập nguồn công khai để lập danh sách 10 profile Vietnam/Hanoi và xây 20 hook mẫu gốc.
- **File:** `agent2-stories/research/2026-10-08-Story-Hook-Research.md`
- **Trạng thái:** `Draft / partial research`.
- **Blocker:** Không xem được Story đang hoạt động/đã lưu của 10 profile nên chưa thể khẳng định hook, sticker, cadence nào được quan sát trực tiếp. `agent-reach doctor --json` không chạy vì CLI không có; truy cập Orca UI bị từ chối. Báo cáo đã ghi rõ danh sách chỉ là candidate và hook là mẫu mới, không phải trích dẫn.
- **An toàn Meta:** Không đọc token, không gọi API ghi. Không chạy `test-publish-capability.mjs` vì script tạo bài Facebook ẩn rồi xóa.
- **Câu hỏi cho trưởng nhóm:** Có thể cấp lại phương thức chỉ đọc để quan sát Story/Highlights của 8–10 profile không? Nếu chưa, coi phần account scan là research gap cần duyệt thủ công.

## 2026-10-08 — Phase B batch and renders

- **Đã làm (bản đầu, sau đó sửa theo đánh giá lead):** Soạn chuỗi tiếng Anh cho solo Hanoi photo confidence; khung có sticker được đánh dấu `MANUAL`, ảnh tĩnh là `API`.
- **Batch:** `agent2-stories/batches/2026-10-09-Story-Batch.md` — `Draft`, `approval: DRAFT`.
- **Assets hiện hành:** `agent2-stories/assets/2026-10-09/frame-01.jpg` … `frame-04.jpg`; mỗi file 1080×1920, chỉ dùng ảnh từ thư viện TravelFrame. Provenance/hash nằm trong manifest; Frame 5 đã được bỏ.
- **Blocker trước publish:** README thư viện ảnh yêu cầu xác nhận consent/usage riêng; chưa thấy bằng chứng consent trong workspace. Cần xác nhận trước khi dùng ảnh người mẫu trên Story live. Batch chưa được Rocky duyệt; không publish.
- **Cập nhật render:** Bản hiện hành có 4 khung và 4 ảnh nguồn riêng trong chuỗi; manifest khớp ảnh nguồn trong batch.
- **Câu hỏi cho trưởng nhóm:** Vui lòng review batch và xác nhận consent/usage của ảnh trước khi Rocky duyệt. Research vẫn cần quan sát Story/Highlights trực tiếp khi có phương thức read-only.

## 2026-10-08 — Phase C publisher dry-run

- **Đã làm:** Tạo `Technology-Automation/Scripts/meta-automation-mcp/publish-story.mjs`. Mặc định dry-run; live yêu cầu `--live`, đúng `approval: APPROVED`, asset base HTTPS; pause để thêm/kiểm tra khung MANUAL; không ghi token vào log.
- **Dry-run:** `node Technology-Automation/Scripts/meta-automation-mcp/publish-story.mjs --batch Marketing-Growth/Content/Stories-Threads-Sprint/agent2-stories/batches/2026-10-09-Story-Batch.md` → exit 0; nhận diện 5 khung, thứ tự API/API/API/MANUAL/API và file ảnh cục bộ.
- **An toàn:** Dry-run xác nhận không đọc Keychain/token, không gọi mạng và không gọi Meta API. Không chạy `test-publish-capability.mjs`, vì script đó tạo bài FB ẩn rồi xóa.
- **Giới hạn:** Luồng POST thật chưa kiểm chứng do lệnh sprint cấm gọi API ghi. Cần approval đúng lô, xác nhận consent, asset base public HTTPS và review kỹ thuật trước lần live đầu tiên.
- **Blocker/câu hỏi:** Bản research thiếu quan sát Story trực tiếp; batch còn chờ lead/Rocky review và consent ảnh. Chưa có câu hỏi mới ngoài hai mục trên.

## 2026-10-08 — Phase D revisions and batches for 10–11/10

- **09/10:** Đã nâng hook thành “Plot twist: the pose isn’t the first thing to fix.”, bỏ Frame 5 trùng ảnh Frame 3 và rút batch còn 4 khung. Chuỗi có 4 ảnh nguồn riêng; khung poll là `MANUAL`, các khung tĩnh `API`.
- **10/10:** Tạo chuỗi 5 khung “Hanoi packing tip” với mẹo giữ vài tờ VND mệnh giá nhỏ dễ lấy và kiểm tra số 0; poll là `MANUAL`. Không đưa tỷ giá/giá hoặc khẳng định quầy nào chỉ nhận tiền mặt.
- **11/10:** Tạo chuỗi 5 khung “Hungry in Vietnam?” dạy “Cho mình một bánh mì” và “mang về”; quiz là `MANUAL`. Nội dung bám bài Field Notes đã duyệt.
- **Files:** `agent2-stories/batches/2026-10-09-Story-Batch.md`, `2026-10-10-Story-Batch.md`, `2026-10-11-Story-Batch.md`; assets và `manifest.json` tương ứng trong `agent2-stories/assets/2026-10-09/`, `2026-10-10/`, `2026-10-11/`.
- **Render:** Tất cả 14 khung hiện hành đều 1080×1920; mỗi chuỗi dùng file ảnh nguồn khác nhau ở từng khung. Chỉ dùng ảnh TravelFrame, không dùng ảnh stock/AI. Manifest lưu nguồn và SHA-256.
- **Dry-run:** Chạy `publish-story.mjs` riêng cho cả ba batch; mỗi lệnh exit 0, nhận diện đúng 4/5/5 khung và mode `API`/`MANUAL`. Không đọc Keychain/token, không gọi mạng/API.
- **Blocker:** Cả ba batch vẫn `approval: DRAFT`; chưa có bằng chứng consent/usage ảnh. Cần xác nhận quyền sử dụng trước khi đăng. Luồng POST thật chưa kiểm chứng.
- **Câu hỏi cho trưởng nhóm:** Vui lòng review hook/copy và ảnh của ba batch; phần research Story đối thủ vẫn cần quan sát trực tiếp nếu có phương thức read-only.
- **An toàn:** Không đăng thật, không gọi API ghi, không commit/push.

## 2026-10-08 — Phase E Meta Business Suite handoff

- **Lead scores:** Rocky/lead reports 09/10 = 8/10, 10/10 = 8/10, 11/10 = 9/10; all pass. Rocky confirmed image consent on 2026-10-08.
- **Batch metadata:** Added `consent: confirmed by Rocky 2026-10-08` at the top of all three batch files; retained `approval: DRAFT` in each.
- **Manual workflow:** Reclassified every frame `MANUAL`; each batch now includes frame order, exact image path, sticker placement/content where applicable, caption (none separate), proposed local posting time, and IG/FB handling. Removed HTTPS and publisher-script requirements from these batch workflows.
- **Files:** `agent2-stories/batches/2026-10-09-Story-Batch.md`, `2026-10-10-Story-Batch.md`, `2026-10-11-Story-Batch.md`.
- **Gate:** Do not publish until Rocky changes the relevant batch's `approval: DRAFT` to `approval: APPROVED`. No stories have been posted; no API write was called.
- **Current blocker:** Approval for each exact batch is still `DRAFT`. Proposed times are planning suggestions, not verified optimal audience times.

## 2026-10-08 — Story 09/10 publishing attempt blocked

- **Batch gate:** Re-read `agent2-stories/batches/2026-10-09-Story-Batch.md`; it contains `approval: APPROVED`. The instruction limits this attempt to the four 09/10 frames; 10/10 and 11/10 remain untouched.
- **Attempt time:** 09:49 ICT. Computer Use rejected opening `https://business.facebook.com/latest`; the tool reported that browser access was denied by the user. I stopped immediately and did not try another browser or access path.
- **Posting result:** 0/4 frames posted; no story was verified on Instagram or Facebook, and no per-frame screenshots could be captured because the Business Suite page never opened.
- **Safety:** No API write, login/password entry, or action outside Story publishing was attempted. `STORY 09/10 DONE` is intentionally not recorded.
- **Retry:** At 10:04 ICT, after Rocky explicitly granted Computer Use again, the browser tool reported that a saved user permission setting blocks `business.facebook.com`. I stopped and did not try Orca, another browser, or another access path.
- **Blocker:** The saved browser permission setting must be changed through the normal app permission controls before the approved manual posting can proceed.

## 2026-10-08 — 12/10 story draft and 24-hour insights checklist

- **Handoff:** Per Rocky’s direction, 09/10 Story publishing belongs to Agent 3. Agent 2 did not access Meta, publish, or attempt to duplicate that work. `STORY 09/10 DONE` is not asserted here.
- **Topic decision:** “Hanoi weather: what to wear in autumn” was not used because internal weather/clothing material found is Draft and contains unverified seasonal specifics. Switched to “Cảm ơn,” a TravelFrame Vietnamese phrase topic recorded in the 03/10 published IG backfill.
- **Batch:** `agent2-stories/batches/2026-10-12-Story-Batch.md` — five English frames, `status: Draft`, `approval: DRAFT`; sticker frame is explicitly `MANUAL` due native Poll. Story text is ready; five unique TravelFrame source images and 1080×1920 renders remain pending selection/production.
- **Insights checklist:** Added to the 12/10 batch: capture actual publish time/platform/frame identifiers, then after ≥24h record reach, taps forward/back, exits, replies and poll votes if exposed; mark unavailable metrics `N/A`, never infer zero. No read-only API call has been made because 12/10 is not published and there are no story IDs/timestamps to query.
- **Files:** `agent2-stories/batches/2026-10-12-Story-Batch.md`, this status file.
- **Blocker:** Need creative photo selection/render and lead/Rocky approval of the exact batch before any live use. Insights collection is blocked until a verified publish event plus 24h has elapsed.
- **Questions for lead:** Please review whether “Cảm ơn” is the preferred fallback topic; no weather claims are included. Confirm whether Agent 3’s 09/10 handoff requires any additional status wording.
- **Safety:** No story posted; no Meta API read/write called; no credentials accessed; no commit/push.

## 2026-10-08 — Role reassignment, deep dive, Threads and Story drafts

- **Role:** Per Rocky’s reassignment, Agent 2 owns all research and copy for FB/IG Stories and Threads (replies plus original posts). Agent 3 is execution-only for exact Rocky-approved content. No posting was performed.
- **Research:** Read the Knowledge Pack, canonical TravelFrame vault notes 00–14, listed knowledge/comment/competitor/market sources, owned-channel reports, metric definitions, Threads outcome/session records, and internal channel/video/evaluation material. A scoped research subagent checked channel/video benchmarks and made no edits.
- **Synthesis:** `agent2-stories/research/2026-10-08-Deep-Dive-Synthesis.md` contains 10 evidence-backed findings, 15 original evidence-derived hooks, fact-checkable topics, limitations, and questions for Rocky. Owned-channel reports are Draft snapshots; no causal hook claims are made.
- **Threads 10/10:** Replaced unsupported historical, venue, traffic and slow-travel claims with 15 varied contextual reply drafts and 2 fact-bounded original posts in `agent3-threads/batches/2026-10-10-Threads-Batch.md`. Kept `approval: DRAFT`. Existing target permalinks could not be opened in the public research browser; Agent 3 must match the live post against its saved context and skip any mismatch, without rewriting.
- **Story 12/10:** Refined curiosity hook for “Cảm ơn” using the owned-channel signal that Vietnamese-learning Reels recorded 28.4 saves/1,000 reach (five-Reel sample). Updated `agent2-stories/batches/2026-10-12-Story-Batch.md`; `approval: DRAFT`. Five unique TravelFrame image selections/renders remain pending.
- **Insights:** The 12/10 batch has a ≥24-hour checklist for publish timestamp, platform, frame IDs, reach, taps forward/back, exits, replies and votes where available. No insights call was made because this batch is unpublished and has no frame IDs/timestamp.
- **Blockers:** Story images/renders and exact-batch lead/Rocky approval remain pending. Thread targets must match their exact live context before execution. Recheck any volatile facts before publication.
- **Safety:** No Story or Thread published; no write API or paid research API called; no credential accessed; no commit/push. 09/10 publishing remains Agent 3’s responsibility; Agent 2 will not post it.
- **Validation:** `npm test` passed (158 tests); `npm run test:skills` passed (15 tests). `npm run workspace:check` failed on pre-existing unrelated broken links in skills and legacy absolute paths in `scratch/` and `Technology-Automation/Runbooks/TravelFrame-Meta-Ads-MCP-Runbook.md`. New Markdown files have no trailing whitespace.

## 2026-10-11 — Apify scan and JEV evaluation of Facebook 61579885502723

- **Request:** Rocky requested an Apify scan of `https://www.facebook.com/profile.php?id=61579885502723`, then live JEV classification/ranking for TravelFrame fit.
- **Collection:** After Rocky updated local `APIFY_TOKEN`, authentication succeeded. Apify returned the page as `That-Creative-CEO` (ID confirmed); 100 unique public videos/Reels were collected across two batches, 2026-06-09 to 2026-10-09 UTC. Apify usage totaled USD 0.542. No duplicate post IDs.
- **JEV:** Completed 100 requests, seven typed decisions per post (topic, audience, usefulness, photo bridge, hook, fact risk, adaptation). Caption-only: the videos were not played or transcribed.
- **Evaluation:** 96 posts classified unrelated and 4 as photography. All 100 had low TravelFrame audience fit, usefulness and Hanoi/photo bridge; all 100 were marked `skip` for adaptation. Four high-hook examples tie at 30/100, below the structure-only threshold. The report recommends no direct source-topic adaptation and records a few hook/CTA mechanics as separate creative references.
- **Metrics:** Public snapshot medians: 1,637.5 views, 39.5 likes, 7 comments (89 observed), 2 shares. Reach, saves, follows, DMs, bookings and revenue are unavailable; counts are not age-normalized or causal evidence.
- **Files:** `Research-Insights/Library/evaluation/facebook-61579885502723/2026-10-11/evaluation.md`; `Research-Insights/Library/channels/facebook-61579885502723/2026-10-11/` (`posts-raw.json`, per-batch raw files, `posts-normalized.json`, `posts-jev-classified.json`, `posts-ranked.json`, `analysis-summary.json`, `collection-status.json`); `Technology-Automation/Scripts/facebook_content_fit_research.mjs`.
- **Blocker / follow-up:** None for the requested caption-based scan. Reviewing actual video frames/audio would be a separate deeper analysis; no post was published or reused.
- **State:** Complete; no Meta write, commit or push.
- **Checks:** Script syntax passed; integrity check confirms 100 unique raw IDs, 100 normalized records and 100 JEV records with seven answers each. `npm test` passed (158/158) and `npm run test:skills` passed (15/15). `npm run workspace:check` still fails on existing unrelated broken skill links and legacy absolute paths in `scratch/` and the Meta Ads runbook.

## 2026-10-11 — Café Reel outlier analysis, five new Reel drafts, and Story insight check

- **Research:** Read the 2026-10-11 Social Performance Report and sprint orchestration §8. Used read-only Instagram media metadata and Orca browser viewing only. The Reel is about 14.8 seconds; the latest Instagram MCP snapshot returned 3,882 likes and 80 comments, versus 3,876 likes in the report snapshot. Instagram’s browser view showed 6,119 likes and 187 combined comments, including a separate 107 Facebook comments; these are not Instagram-only counts.
- **Comparison:** Among 26 recent VIDEO posts with 1–15 likes from 2026-09-23 through 2026-10-11, median likes were 5 and median comments 0.5. The same-day comparators were the Vietnamese phrase Reel (30 likes/1 comment) and photo-process Reel (11 likes/1 comment). These are descriptive comparisons only; individual reach and watch-time data are unavailable. The report’s roughly 70% reach concentration covers two days and is not a per-Reel reach attribution.
- **Comments/audio limits:** Meta read-only media listing returns counts, not Instagram comment text. Orca exposed 10 comments in the first visible slice (2 page-authored, 8 viewer-authored), with replies collapsed; the rest of the Instagram comments were not accessible in that view. The analysis labels this as a low-confidence sample and does not claim to classify all 80. The Reel player was muted and did not expose an audio title, so audio contribution remains unverified. The active UI showed the Reel as already liked; no like state was changed and no comment was posted.
- **Files:** Added agent2-stories/research/2026-10-11-Viral-Cafe-Reel-Analysis.md and agent2-stories/batches/2026-10-12-Viral-Formula-Reels.md. The batch contains five English, phone-shootable Hanoi POV concepts, original-footage and consent requirements, fact-check sources, and the requested short PHOTO pinned-comment draft. approval: DRAFT.
- **Story 09/10 insights:** Attempted read-only get_instagram_insights. The available tool is account-level and did not provide per-Story/per-frame metrics; the requested taps/exits metrics are not exposed by this interface. No values were filled as zero. Existing report says 4/4 frames went live and the poll was absent; per-frame metrics remain N/A pending an approved Business Suite read-only export or story IDs supported by an insights endpoint.
- **Blockers/questions:** Need an approved export or access path to all 80 Instagram comment texts to finish full comment mining; need the target audio track or source audio review if sound analysis must be conclusive; need Story frame IDs or a Business Suite metrics export for per-frame reach/taps/replies/exits.
- **Safety:** No like, comment, pin, DM, Reel publish or write API call. No credentials, commit or push.
- **Validation:** npm test passed (158/158); npm run test:skills passed (15/15). workspace:check still fails on six unrelated broken skill links and six legacy absolute paths. Full git diff --check also flagged an unrelated blank line at EOF in Marketing-Growth/Plans/OpenSEO-TravelFrame-Project-Context.md:79. The three task files have no trailing whitespace and end with a newline.

## 2026-10-11 — Rewrite of the five 12/10 Reels after lead review

- **Lead feedback addressed:** Replaced all five phone-photography tips with the requested winning structure: a concrete Hanoi location/time followed by an unexpected, filmable street/social moment. Each Reel opens on the real scene and has one short overlay line, a brief POV caption, and an open comment question.
- **Batch:** Overwrote `agent2-stories/batches/2026-10-12-Viral-Formula-Reels.md`; `approval: DRAFT` retained. Concepts: Hoàn Kiếm morning warm-up, Hàng Đào mobile fruit seller, Phùng Hưng sidewalk barber, Trúc Bạch wedding procession, and Tạ Hiện mobile karaoke.
- **Truth/production gates:** Locations and times are proposed scouting windows only. Each concept may be used only if self-shot footage confirms the exact event, time, and place; no event is described as recurring. Require consent from identifiable people, use unique TravelFrame footage, mute source audio, and skip any scene that does not occur or lacks consent. No third-party video or audio.
- **Preserved prior deliverable:** Kept the existing café Reel pinned-comment draft in the batch, clearly separate from the five new concepts and still draft-only.
- **Files:** `agent2-stories/batches/2026-10-12-Viral-Formula-Reels.md`, this status file.
- **Blocker:** The five scenes have not been filmed or consent-checked. The batch is ready for review, not publication. No questions for the lead.
- **Safety:** No posting, comment, or API write; no commit/push.
- **Validation:** `npm test` passed (158/158); `npm run test:skills` passed (15/15). Batch-specific checks passed: DRAFT gate, five Reel sections, five one-line overlays, captions and consent notes; no photography-tip framing, trailing whitespace, or missing final newline. `npm run workspace:check` still fails on the same unrelated six markdown links and six legacy absolute paths in skill docs, `scratch/`, and the Meta Ads runbook.
