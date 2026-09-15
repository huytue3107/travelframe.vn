# TravelFrame - Master Summary

**Ngày tổng hợp:** 2026-09-15
**Phạm vi:** Vault Side Agency, workspace TravelFrame local, Guest Guide, content system, channel snapshots, automation, production assets và decision log.
**Nguyên tắc đọc:** Tách rõ `approved`, `working`, `snapshot`, `unverified` và `open decision`. Không coi nội dung đã render là nội dung đã publish; không coi views là booking evidence.

## 1. Executive Summary

TravelFrame hiện là consumer-facing workstream thuộc dự án Hanoi Expert, tập trung vào trải nghiệm khám phá Hà Nội cùng local host/guide, kết hợp walking experience, photography và short-form video.

Brand đang có nền tảng tương đối hoàn chỉnh ở bốn lớp:

1. Guest Guide 10 trang đã xuất bản dưới dạng PPTX/PDF.
2. Hệ thống content và visual identity đã được định nghĩa.
3. Workspace đã có pipeline nghiên cứu kênh, phân tích video, viết nội dung, carousel, video render và Meta read-only reporting.
4. Funnel comment keyword -> DM -> qualification -> human handoff đã được thiết kế bằng ManyChat.

Điểm nghẽn lớn nhất không nằm ở khả năng làm content mà ở lớp thương mại và vận hành:

- Brand architecture chưa chốt giữa Hanoi Expert, TravelFrame và The Hanoi Edit.
- Package, giá, duration, capacity và delivery SLA chưa có bản cuối.
- Chưa chốt legal operating model, payment, deposit, cancellation và weather policy.
- Chưa có booking/testimonial/portfolio thật đủ chuẩn để làm proof.
- Chưa có attribution hoàn chỉnh từ content tới inquiry, booking và revenue.

## 2. Brand Và Định Vị

### Tên và tài sản đang dùng

- Working brand: `TravelFrame`.
- Instagram: `@travelframe.vn`.
- Facebook Page: `travelframe.vn`.
- Domain từng xuất hiện trong funnel/script: `travelframe.sidevn.com`.
- Chưa có bằng chứng local xác nhận TravelFrame là pháp nhân, registered trademark hoặc house brand cuối cùng.

### Offer cốt lõi

Khám phá Hà Nội với một local host/guide, nhận hỗ trợ route, local storytelling, posing guidance, ảnh chỉnh sửa và video dọc.

TravelFrame không nên bị định vị chỉ là:

- Walking tour giá rẻ.
- Photoshoot thuần túy.
- Page tổng hợp Vietnam travel tips.

Định vị làm việc:

> Explore Hanoi with a local expert and turn the trip into your personal visual story.

Hình ảnh cô đọng hơn trong Guest Guide là `your Hanoi friend`: khách chọn nhịp trải nghiệm và điều muốn lưu giữ; TravelFrame biến chuyến đi thành câu chuyện bằng ảnh và phim.

### Brand voice

- Warm local friend.
- Practical, concise, lightly playful.
- English đơn giản, dễ quét với khách dùng English như ngôn ngữ thứ hai.
- Cho giá trị trước, bán hàng sau.
- Không fear-based, không fake urgency, không giả testimonial.
- Một nội dung chỉ nên có một hành động chính.

### Visual identity

- Mobile-first, editorial, dùng ảnh lớn.
- Accent teal `#008AA3`.
- Charcoal `#18211D`.
- Off-white/xám xanh nhạt `#EDF1EF`.
- Sage CTA `#DCE9E4`.
- Card radius tối đa 8 px.
- Không gradient trang trí, orb hoặc bo góc lớn.
- Narrative arc: Arrival -> Curiosity -> Connection -> Pause -> Belonging -> Afterglow.
- Pexels là hệ ảnh tạm trước pilot; cần thay dần bằng portfolio thật.

## 3. Brand Architecture

| Tên | Vai trò hiện tại | Trạng thái |
|---|---|---|
| Hanoi Expert | Project nội bộ, local tour + photo/vlog | Active |
| TravelFrame | Consumer-facing brand trên social, guide và content | Working |
| The Hanoi Edit | Premium hotel-concierge concept | Phương án song song |

**Open decision P0:** Chọn kiến trúc thương hiệu cuối cùng và xác định TravelFrame là brand, product line hay workstream.

## 4. Khách Hàng Mục Tiêu

Thứ tự persona đang được ghi nhận:

1. Solo female traveler, 23-40 tuổi: muốn thoải mái, có local support và ảnh đẹp.
2. Couple/honeymoon: muốn bộ ảnh kỷ niệm tốt hơn ảnh điện thoại.
3. Creator/digital nomad: cần vertical footage, Reel và local story.
4. Nhóm bạn 2-4 người: muốn private experience, vui và dễ chia sẻ.
5. Khách quốc tế lần đầu tới Việt Nam: cần checklist, app, safety, transport và itinerary.
6. Premium couple/family 35-55: thuộc nhánh hotel-concierge, chưa phải direct MVP chính.

**Open decision P1:** Chọn một persona launch chính. Hiện content đang phục vụ audience rộng hơn offer trực tiếp.

## 5. Product Ladder

Package có bằng chứng mạnh nhất hiện nằm trong Guest Guide:

| Package | Experience | Deliverable | Included / khách tự trả |
|---|---|---|---|
| Quick Photo Walk | Walking tour | 10 edited photos | Food, drinks, entrance tickets tự trả |
| Signature Story Tour | Walking tour | 25 edited photos + Reel 30-45 giây | Food, drinks, entrance tickets tự trả |
| Premium Full-Day | Private full-day experience | 35 edited photos + short film 60-90 giây + 5 selected raw clips | Private car, water và 1 meal theo written itinerary |

Guest Guide không hiển thị giá. Package, itinerary, inclusions và delivery timing chỉ được khóa bằng written booking confirmation.

Các package name cũ như Snapshot/Story Walk/Vlog Journey và premium hotel packages vẫn tồn tại trong source khác, vì vậy bảng trên chưa được coi là commercial offer cuối cùng.

### Bốn route mood

- **Heritage Hanoi:** phố cũ, ban công, đền/chùa và texture kiến trúc.
- **Everyday Hanoi:** café, chợ, chuyển động đời thường và chi tiết địa phương.
- **Hanoi in Style:** French Quarter, portrait gọn và kiến trúc sạch.
- **Hanoi After Dark:** phố đêm, neon và footage điện ảnh.

### Guest flow

1. Chọn package.
2. Chọn tối đa hai mood.
3. Gửi ngày đi, số khách, hotel/area và nhu cầu ảnh/video.
4. TravelFrame đề xuất route.
5. Khách đổi 1-2 điểm trước xác nhận.
6. Trong tour có gentle posing guidance và sample preview.
7. Delivery và revision theo written confirmation.

### Chưa có bản vận hành cuối

- Duration của Quick và Signature.
- Meeting point.
- Group capacity.
- Operating calendar.
- Primary và backup host.
- Năng lực hậu kỳ mỗi tuần.
- Route chi tiết theo mood.
- Bảng giá và quy tắc upgrade/downgrade.

## 6. Operations Và Policies

### Đã được ghi nhận

- Written confirmation là nơi khóa package, itinerary, inclusions và delivery.
- Gallery gửi qua contact dùng khi booking.
- Social sharing cần consent và phạm vi sử dụng bằng văn bản.
- Khách có thể gửi một small revision request sau bàn giao.
- Food/coffee pause là optional; khách tự trả nếu không được ghi là included.
- Walking tour là MVP; xe máy không thuộc product core.
- Direct booking trước, OTA sau khi có portfolio và review.
- eSIM là tiện ích/affiliate/concierge support, không phải sản phẩm cốt lõi.
- Không dùng drone trong MVP.
- Không cam kết Train Street trong route cố định.

### Launch gates còn mở

- Host tiếng Anh chính và backup.
- Payment gateway cho thẻ quốc tế.
- Deposit, deadline thanh toán, cancellation, no-show và weather policy.
- Bảo hiểm trách nhiệm và legal operating model.
- Licensed tour partner hay direct host.
- Data retention, gallery access và quyền sử dụng raw footage.
- Incident/escalation process cho solo traveler.

### Delivery SLA đang mâu thuẫn

Các nguồn từng nêu `24-48 giờ`, `72 giờ`, `3-5 ngày` và `5 ngày`. Cho đến khi chốt năng lực hậu kỳ, copy công khai không được hứa SLA cố định.

## 7. Funnel Và Conversion

### Funnel hiện tại

`Reel/Facebook -> keyword comment -> private DM -> guide -> follow prompt -> qualification -> package interest -> human handoff -> written quote/confirmation -> deposit booking`

### Keyword đang dùng hoặc đề xuất

- `SAV`, `SAVE`, `SAFETY`, `SCAM`: Hanoi Safety Mini Guide.
- `HANOI`, `LOCAL`: Hanoi Starter Pack.
- `VN`, `VIETNAM`, `ROUTE`, `ITINERARY`: Vietnam trip segmentation.
- `PHOTO`, `PHOTOSHOOT`, `PHOTOTOUR`, `COUPLE`, `PORTRAIT`: photo-tour qualification.
- Các keyword cũ: `HL`, `H24`, `NORTH`.

### Dữ liệu cần thu

- Travel timing.
- Party type và group size.
- Preferred date.
- Package interest.
- Hanoi mood.
- Nhu cầu travel tip hay photo experience.

### ManyChat đã thiết kế

Có playbook và ready-to-paste scripts cho:

- Grow followers from comments.
- Safety guide.
- Hanoi Starter Pack.
- Vietnam trip planning.
- Photo-tour conversion.
- Default reply/main menu.
- Human handoff.
- Tags và custom fields.

**Lưu ý:** Hai bản ManyChat đang khác nhau ở logic follower gate. Playbook nói nên giao giá trị trước khi yêu cầu follow; ready-to-paste scripts yêu cầu follow trước khi mở guide. Cần chốt một chính sách trước khi triển khai.

### Primary conversion path

Kế hoạch content mới ngày 2026-09-14 chọn Instagram DM làm primary conversion path trong 30 ngày đầu. Tuy vậy, decision log tổng vẫn chưa chuyển mục này sang `Decided`.

## 8. Content Strategy

### Vai trò content

TravelFrame dùng practical Vietnam/Hanoi content để tạo reach, saves và shares; sau đó nối nhẹ sang photography và local photo-tour.

Ba vai trò:

- Viral content: kéo reach.
- Utility content: kéo save/share.
- Conversion content: kéo profile visit, DM và booking intent.

### Content mix trong vault

- 50% Travel Utility.
- 25% Destination Discovery.
- 15% Photography.
- 10% TravelFrame/offer.

### Content mix trong thiết kế mới 2026-09-14

- 40% essential travel tips.
- 30% Hidden Hanoi/local discovery.
- 20% couple/portrait photography.
- 10% BTS/testimonial/social proof.

Hai mix không mâu thuẫn lớn về chiến lược, nhưng cần chọn một taxonomy duy nhất cho reporting.

### Ba series mới

- Hanoi Survival Guide.
- Hanoi Spots Worth Saving.
- Your Hanoi Photoshoot.

### Format

- Reels 18-30 giây là engine reach chính.
- Carousel 6-8 slide cho checklist, map và itinerary.
- Story 2-4 frame/ngày để build trust và conversion.
- Highlights: `HANOI`, `PHOTO TOUR`, `REVIEWS`, `PRICE`, `FAQ`.

### Content formulas đã học

- Hook first-time/time-pressure + promise cụ thể.
- Itinerary theo mốc thời gian.
- Countdown top 3/top 5.
- Trap -> practical move.
- `Pro move:` cho hành động cụ thể.
- Save + send-to-a-specific-friend.
- Comment keyword -> DM guide.
- Loss-aversion hook cho mistake content.
- Save-first hook cho checklist.

### Guardrails

- Không ép photo-tour pitch vào đầu utility Reel.
- Không copy wording/credibility/discount code của benchmark creator.
- Không dùng số liệu, giá, app availability, thời tiết hoặc access chưa verify.
- Không giả client, testimonial hoặc before/after.
- Không dùng ảnh khách nếu chưa có consent.
- Train Street luôn phải có safety/access caveat.

## 9. Channel Performance

### Instagram screenshot snapshot

**Captured:** 2026-09-07 21:47 +07:00
**Nguồn:** Phân tích text từ 6 ảnh Instagram Insights, không phải API export.

| Metric 30 ngày | Giá trị |
|---|---:|
| Views | 41.921 |
| Accounts reached | 27.370 |
| Non-followers | 98,7% |
| Interactions | Khoảng 1.700 |
| Profile visits | 301 |
| Reached-to-profile | Khoảng 1,10% |
| Story views | Khoảng 80 |

Tín hiệu chính:

- Reels là growth engine.
- Discovery rất mạnh so với follower base.
- Practical Hanoi utility thắng aesthetic-only content.
- Train Street là acquisition topic hiệu quả nhưng không nên trở thành toàn bộ identity.
- Conversion từ reach sang profile, follow, link và booking còn yếu hoặc chưa đo được.

### Content winners trong snapshot 2026-09-07

| Content | Views | Tín hiệu |
|---|---:|---|
| 5 Tourist Scams You Need to Avoid in Hanoi | 14,9K | 126 shares |
| POV Train Street | 7,3K | 24 comments |
| Hanoi Train Street 2026 Quick Guide | 4,4K | 80 shares |
| 5 Train Street Cafes | 4,0K | 31 shares |

Quick Guide có share/view tốt hơn content chỉ có reach lớn. Bài reach thấp nhưng share rate cao nên được giữ concept và thử lại hook/cover.

### Instagram API report đã ghi nhận trước đó

Một report 30 ngày qua Meta API từng ghi nhận:

- 219.025 views.
- 133.224 reach.
- 5.367 accounts engaged.
- 10.737 interactions.
- 1.416 profile views.
- 7 website clicks.
- 191 followers.
- 59 media được API trả về: 53 video, 5 carousel và 1 image.

Đây là một dated API snapshot đã được ghi nhận trong lịch sử làm việc, không phải số live được refresh trong bản tổng hợp này. Không trộn trực tiếp với snapshot screenshot 2026-09-07 vì thời điểm và định nghĩa metric có thể khác.

### Facebook snapshot đã ghi nhận trước đó

- Page: `travelframe.vn`.
- 69 followers tại thời điểm kiểm tra.
- Category: `Local & travel website`.
- 29 post đọc được, trong khoảng 2026-09-09 đến 2026-09-14.
- Post có shares cao nhất quan sát được: Reel `5 things not to do in Vietnam`, 13 shares.
- Comments/reactions và broader Page Insights chưa đọc được do thiếu `pages_read_user_content` hoặc Page Public Content Access.

## 10. Metrics Cần Dùng

### Channel

- Views.
- Accounts reached.
- Likes, comments, saves, shares.
- Profile visits.
- Follows.
- Bio-link clicks.

### Funnel

- Reached-to-profile = profile visits / accounts reached.
- Profile-to-follow = new follows / profile visits.
- Profile-to-link = bio-link clicks / profile visits.
- Link-to-inquiry = qualified inquiries / tracked landing sessions.
- Inquiry-to-booking = paid bookings / qualified inquiries.
- Revenue per booking.
- Content-attributed revenue chỉ khi tracking path đủ bằng chứng.

### Business definitions còn thiếu

- Qualified inquiry.
- Booking được tính ở bước nào.
- Gross collected, recognized revenue hay net revenue.
- Source attribution rule.

Mỗi campaign và asset nên có stable `campaign-id`, `asset-id`, reporting period, captured time, source type và limitation.

## 11. Content Calendar Và Production Status

### Calendar trong vault

Calendar 30 ngày từ 2026-09-12 đến 2026-10-11 gồm:

- Scams, Train Street, transport, prices và first-timer tips.
- Hidden Hanoi, Ninh Bình, Sapa, Hà Giang và night Hanoi.
- Photo spots, posing, tourist-vs-photographer và photo-tour BTS.
- Lead magnets `H24` và `NORTH`.
- Week 1 scripts và Story layer.

### Calendar mới trong workspace

Thiết kế mới từ 2026-09-15 đến 2026-10-14:

- 30 Reels.
- 8 Carousel.
- Story tối thiểu 2 frame/ngày.
- Batch workflow: Monday research/script, Tuesday-Wednesday shoot, Thursday-Friday edit.
- Review dữ liệu sau 24 giờ và 72 giờ.

**Open conflict:** Hai calendar chồng nhau nhưng khác ngày bắt đầu, taxonomy và một số deliverable. Cần chọn calendar master trước khi tiếp tục sản xuất hoặc reporting.

### Carousel đã build

- Day 3: `24h Hanoi`, 7 slide, mục tiêu Save.
- Day 11: `What things cost in Hanoi`, draft; nhiều giá còn `VERIFY`.
- Day 15: `Old Quarter`, 7 slide.
- Output render 2160 x 2700, đúng tỷ lệ Instagram 4:5.

### Video/Reel assets đã render

Series Hanoi/Dong Xuan có:

- Top 3 Hanoi Spots.
- One-Day Hanoi Itinerary.
- Master Reels compilation.
- Narration audio.
- SRT.
- Cover/tagline options.
- Review frames.
- HyperFrames source compositions.

Các render cũ được kiểm kê:

- 7 Places in Vietnam.
- 10 Things Must Know Before Visiting Ha Long Bay.
- 12 Things To Do in Sapa.
- Vietnam Cheat Sheet.

Render không đồng nghĩa đã publish. Bốn render cũ chưa có ledger/platform evidence xác nhận trạng thái live.

### Guest Guide

- PPTX 10 slide.
- PDF 10 trang.
- 6 ảnh Pexels và preview/contact sheet.
- CTA chính: DM `@travelframe.vn`.

### Content plan document

- `TravelFrame-30-Day-Content-Plan-2026-09-14.docx`.
- Source design lưu dưới Markdown để tiếp tục chỉnh.

### Draft khác

- eSIM setup Reel script, caption, sources và evaluation.
- Vietnam airport SIM caption.
- `Easy photo spot` tại Phùng Hưng chưa khóa on-camera subject.
- Weather cheat sheet September-December mới là draft climate guidance.

## 12. Research Và Learning System

Workspace có một reference library để:

- Lưu video nguồn và transcript.
- Quét dữ liệu kênh.
- Chấm content/channel bằng metric và double-rater.
- Ghi pattern, voice rules và ideas backlog.
- Giữ provenance để không copy benchmark mù quáng.

Kênh `@themikeytravels` được spot-check trên 12 Reels gần đây từ account có 72 post và 1.216 followers tại thời điểm snapshot. Hai viral post làm mẫu bị skew mạnh, nên insight chỉ dùng làm experiment signal:

- Mistake/loss-aversion hook cho reach.
- Save-first itinerary cho saves/shares.
- Photography transformation cho conversion bridge.

Đề xuất sequence:

1. `3 Mistakes That Waste Your First Day in Hanoi`.
2. `Save This 3-Hour Hanoi Morning`.
3. `Why Your Hanoi Photos Still Look Touristy`.

## 13. Tools Và Technical Capability

### Read-only Meta MCP

Workspace có local MCP:

- Server: `mcp/travelframe-readonly.mjs`.
- Runner: `scripts/travelframe-mcp/run.sh`.
- Credentials lấy từ macOS Keychain.
- Token được redact khỏi response.
- Chỉ có read tools cho connection, Instagram profile, media và insights.
- Không có publish, message, edit hoặc delete endpoint.

Page và Instagram Business linkage từng được xác minh:

- Facebook Page ID: `1409099405611405`.
- Instagram Business Account ID: `17841438272497512`.

Permission set từng hoạt động:

- `instagram_basic`
- `instagram_manage_insights`
- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_metadata`

Mọi connector state và permission phải được kiểm tra lại ở workflow nhạy cảm.

### Content production stack

- Local source video library.
- Pexels footage research.
- HyperFrames video compositions/render.
- Local audio/narration và subtitle.
- Carousel HTML/CSS renderer.
- Local Whisper transcription.
- Video understanding pipeline với frame extraction.
- Channel evaluator và content draft checker.
- ManyChat automation scripts.

### Workspace footprint kiểm kê ngày 2026-09-14

- `Source video`: khoảng 1,5 GB.
- `output`: khoảng 1,0 GB.
- `travelframe-guest-guide`: khoảng 31 MB.
- `carousels`: khoảng 21 MB.
- `reference-library`: khoảng 816 KB.
- Local files nổi bật: khoảng 179 JPG, 84 MP4, 42 PNG, 41 Markdown và 33 JSON, không tính `node_modules`.

## 14. Safety Và Approved Claims

### Có thể dùng trong scope đã ghi

- Book Grab trong app và kiểm tra biển số/tài xế.
- Mai Linh có official app/hotline `1055`.
- Từ chối unsolicited shoe repair hoặc fruit/photo props trước khi dịch vụ bắt đầu.
- Đồng ý full price trước khi nhận dịch vụ/props.
- Tuân thủ barrier và hướng dẫn tại Train Street.
- Chuẩn bị VND mệnh giá nhỏ.
- Không cam kết Train Street access.
- Không dùng testimonial hoặc ảnh khách khi chưa có proof/consent.

### Dated facts cần re-check trước publish

Snapshot nguồn 2026-09-06 từng ghi:

- Street phở: 40.000-65.000 VND.
- Short central-Hanoi GrabBike: 20.000-30.000 VND.
- Planning conversion: 1 USD xấp xỉ 26.000 VND.
- E-visa có thể lên đến 90 ngày.
- Một số visa exemption/entry rules có date-bound conditions.

Không tái sử dụng các con số này như thông tin hiện tại nếu chưa kiểm tra lại.

### Không được nâng thành fact

- Một tình huống là `common`, `frequent` hoặc có tần suất cụ thể.
- Train Street luôn mở hoặc café invitation tạo quyền vào.
- GrabBike/taxi app an toàn tuyệt đối.
- Giá từ video/blog là official tariff.
- `Best place`, mùa đi và danh sách điểm đến trong render là fact đã verify.

## 15. Proof Gaps

Chưa có đủ bằng chứng cho:

- Booking count.
- Paid customer result.
- Verified testimonial library.
- Consent register cho ảnh/video khách.
- Revenue/inquiry attribution theo asset.
- Final legal model.
- Final package, price và SLA.
- Ownership/legal status của domain, handle và brand.
- Approved example register có reviewer và approval date.

## 16. Open Decisions Ưu Tiên

### P0

1. Brand architecture.
2. Product ladder chính thức.
3. Bảng giá.
4. Delivery SLA.
5. Legal operating model.

### P1

1. Primary conversion path.
2. Persona launch chính.
3. Package duration và capacity.
4. Lead magnet fulfillment.
5. Publish status của các render.
6. Calendar master: bản 2026-09-12 hay bản 2026-09-15.
7. ManyChat policy: value-first hay follower-gated.

### P2

1. Chuyển từ Pexels sang portfolio thật.
2. Chuẩn hóa approved/rejected examples.
3. Hoàn thiện attribution và CRM definitions.

## 17. Đề Xuất Thứ Tự Thực Thi

1. Chốt năm quyết định P0 bằng owner và decision date.
2. Chọn Instagram DM làm primary path chính thức hoặc thay bằng kênh khác.
3. Chốt một calendar master và một taxonomy content.
4. Hoàn thiện lead magnets thật trước khi bật keyword automation.
5. Chọn ManyChat value-first để giữ niềm tin, trừ khi có lý do rõ để follower-gate.
6. Chạy pilot thật để tạo portfolio, consented BTS và testimonial.
7. Thiết lập campaign/asset IDs và snapshot 24h/72h.
8. Định nghĩa qualified inquiry, booking và revenue.
9. Review sau 30 ngày dựa trên profile visits, DMs, qualified inquiries và bookings, không chỉ views.

## 18. Canonical Sources

### Vault

- `SA/01-Projects/Hanoi-Expert/TravelFrame/00-MOC-TravelFrame.md`
- `01-Brand-Source-Of-Truth.md`
- `02-Audience-And-Funnel.md`
- `03-Product-And-Guest-Experience.md`
- `04-Operations-And-Policies.md`
- `05-Content-System.md`
- `06-Safety-And-Verified-Travel-Facts.md`
- `07-Source-Catalog.md`
- `08-Decision-Log.md`
- `09-Instagram-Insights-Snapshot-2026-09-07-2147.md`
- `10-Content-Calendar-30-Ngay-2026-09.md`
- `11-Proof-And-Approved-Claims.md`
- `12-Tools-And-Permissions.md`
- `13-Examples-And-Feedback.md`
- `14-Metric-Definitions.md`

### Workspace

- `travelframe-guest-guide/`
- `Marketing-Growth/Content/Carousels/`
- `output/hanoi-dong-xuan-series/`
- `Marketing-Growth/Plans/TravelFrame-30-Day-Content-Plan-2026-09-14.docx`
- `Sales-CRM/Automation/ManyChat/manychat-travelframe-playbook-2026-09-14.md`
- `Sales-CRM/Automation/ManyChat/manychat-travelframe-ready-scripts-2026-09-14.md`
- `Research-Insights/Library/`
- `mcp/travelframe-readonly.mjs`
- `docs/superpowers/specs/2026-09-14-travelframe-30-day-content-design.md`

## 19. Freshness And Limitations

- Bản tổng hợp được lập ngày 2026-09-15 và phản ánh local sources có đến hết 2026-09-14.
- Không quét cloud files chưa sync xuống máy.
- Không refresh live Instagram/Facebook metrics trong lượt tổng hợp này.
- Snapshot screenshot và API report không được cộng hoặc so trực tiếp khi period/definition khác nhau.
- Giá, visa, weather, transport, café và Train Street phải được re-check gần ngày publish.
- Nội dung đã draft/render chưa mặc định là approved hoặc published.
