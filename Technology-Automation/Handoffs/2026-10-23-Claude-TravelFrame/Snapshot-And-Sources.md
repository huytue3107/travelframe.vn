---
title: TravelFrame — snapshot và bản đồ nguồn bàn giao Claude
owner: Technology-Automation
status: Review
created: 2026-10-23
updated: 2026-10-23
---

# Snapshot có ngày, không phải dữ liệu live mới

Lượt tạo gói này đọc tài liệu workspace/vault và hồ sơ công việc; không audit lại website, đo lại SERP hay xác nhận lại tài khoản. Trước một thao tác live mới, Claude phải kiểm tra trạng thái cần thiết trong môi trường của nó. Mốc thời gian dùng Asia/Ho_Chi_Minh trừ dữ liệu ghi rõ thị trường/múi giờ khác.

## 1. Địa chỉ và trạng thái cần biết

| Hạng mục | Điều có nguồn đến thời điểm bàn giao | Cần lưu ý |
|---|---|---|
| Workspace trên máy hiện tại | `/Users/macbook/Codex GPT/travelframe.vn` | Đường dẫn máy khác có thể khác |
| Canonical TravelFrame | `/Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame` | Đọc qua Source-Of-Truth-Map; không sao chép cả vault |
| Host website được kiểm tra ở các lượt trước | `https://travelframe.sidevn.com` | Không mặc định `travelframe.vn` đã phục vụ cùng site |
| Domain travelframe.vn | Audit 22/10 không phân giải được trong môi trường kiểm tra | Chưa xác nhận hiện tại; không tự đổi DNS |
| OpenSEO project | `b97024a3-b095-44e9-9489-d5fce1361263` | Kiểm tra identity và project access trước nghiên cứu |
| Trang dịch vụ đã có | `/hanoi-photoshoot`, node104 theo ledger | Kiểm tra lại trước sửa; không tạo trang trùng |
| Old Quarter guide đã có | `/news/hanoi-old-quarter-guide`, node105 theo ledger | Không tạo pillar mới chỉ vì muốn thêm bản đồ |
| Source Drupal/theme | Rocky nói ở máy khác chưa đăng nhập/truy cập | Không hỏi lại như chưa từng biết; cần access khi việc sửa bắt buộc có source |

## 2. Snapshot ranking 22/10/2026

Google Mỹ, tiếng Anh, desktop. Đây là thứ hạng organic trong mẫu do OpenSEO trả về, không phải rank hiện tại và không áp dụng toàn cầu.

| Keyword | Vị trí tốt nhất trong mẫu | URL |
|---|---:|---|
| hanoi photoshoot | 18 | `/hanoi-photoshoot` |
| photographer in hanoi | 19 | `/hanoi-photoshoot` |
| hanoi photographer | 28 | `/hanoi-photoshoot` |
| hanoi couple photoshoot | 71 | `/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026` |
| private hanoi photo tour | 80 | `/hanoi-photoshoot` |
| things to do in hanoi old quarter | 75 | `/news/hanoi-old-quarter-guide` |
| hanoi old quarter attractions | 82 | `/news/hanoi-old-quarter-guide` |
| is hanoi train street open | 82 | `/news/hanois-train-street-rhythm-time` |

8/18 keyword có URL TravelFrame trong mẫu; không có top10. 10 query còn lại không thấy domain trong lượng organic được trả về, không kết luận ngoài top100. Riêng `hanoi photographer` dùng depth40 thành công sau lỗi depth100, trả33 organic. `photographer in hanoi` có cùng URL ở19/26, ghi vị trí tốt nhất19.

Nguồn đầy đủ: [README ranking](../../../Marketing-Growth/SEO/2026-10-22-Keyword-Rankings/README.md), [18 keyword CSV](../../../Marketing-Growth/SEO/2026-10-22-Keyword-Rankings/rankings.csv). [Báo cáo OpenSEO](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/reports/262b42bc-2f7d-4941-9255-afe5fe3dcc1a).

## 3. Quyết định thương mại và hướng SEO

Quyết định Approved 21/10: Basic $30/giờ, tối thiểu1h; Premium $60/giờ, tối thiểu2h; VIP $99/giờ, tối thiểu2h. Tối đa2 khách, từ khách thứ3 +$15/giờ/người; ảnh gốc24h, ảnh chỉnh sửa/video48h; taxi khách trả. Chi tiết deliverables và phần chưa chốt phải đọc trong [quyết định](../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md). Không suy rằng website đã áp dụng: audit22/10 vẫn thấy giá/SLA cũ ở body/booking.

Phương án Top1 ngày22/10 ở trạng thái **Review**: ưu tiên trang dịch vụ đang có ba vị trí18/19/28; ảnh mẫu và case có nguồn; đồng bộ offer/booking; sau đó map/guide và đối tác phù hợp. Lộ trình12 tuần tính từ batch đầu được duyệt và lên live, không mặc định bắt đầu22/10. Chưa tự cấp ngân sách, bật tracking, đổi giá hoặc cam kết thứ hạng.

Nguồn: [Top1 Plan](../../../Marketing-Growth/SEO/2026-10-22-Top1-Plan/Plan.md), [audit shortlist](../../../Marketing-Growth/SEO/2026-10-22-Audit/opportunities.md).

## 4. Case hoàn chỉnh: Thin cùng Harry

Theo [Publication.md](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Publication.md), đã publish23/10:

- URL: [Thin with Harry](https://travelframe.sidevn.com/news/hanoi-old-quarter-photoshoot-harry-thin).
- Node110; English; Stories; kicker Photography Stories.
- H1: `A Hanoi Old Quarter photoshoot with Harry: Thin in red`.
- Title xuất ra: `Hanoi Old Quarter Photoshoot: Thin With Harry | TravelFrame Vietnam`.
- Primary keyword đề xuất: `hanoi old quarter photoshoot`; có autocomplete en-US13/10, chưa xác minh volume/KD hoặc SERP riêng cho bài.
- Supporting keyword biên tập: `dong xuan market photoshoot`, `hanoi market photoshoot`, `street style photoshoot in hanoi`; chưa có metrics được xác minh.
- 4 ảnh từ 3 post Rocky chọn; 6 ảnh ứng viên đã xem, giữ source và web derivatives riêng.
- Approval: “Duyệt”, sau đó chỉ đạo “đăng lên website đi” cho đúng bài.
- Hồ sơ ghi CMS Published, anonymous HTTP200, text khớp, metadata/canonical, 4/4 ảnh và link dịch vụ/Instagram; không gửi DM hoặc booking thử.
- QA mobile dùng Chrome viewport390px, không phải thiết bị thật. Lượt tổng hợp này không lặp lại các kiểm tra live đó.

### Nguồn ảnh và cách chọn

| Post Rocky đưa | Ảnh dùng | Vai trò và điều quan sát được |
|---|---|---|
| [Dda473Fj_2F](https://www.instagram.com/p/Dda473Fj_2F/?img_index=8) | 08 | Hero: Thin váy đỏ/kính, quay lại, biển CHỢ ĐỒNG XUÂN |
| [DdmLRD5I2Mk](https://www.instagram.com/p/DdmLRD5I2Mk/?img_index=6) | 05 và06 | Hàng hóa, kiện hàng, cầu thang, lan can, người nền |
| [DdYpZDHI8rM](https://www.instagram.com/p/DdYpZDHI8rM/?img_index=1) | 01 | Dáng tay dang trước cửa cuốn bạc |

Các ngày17/18/22 tháng9 ghi ở source record là ngày đăng, không phải ngày chụp. Không gọi Thin là du khách/khách trả tiền/người mẫu chuyên nghiệp hoặc gán cảm xúc nếu chưa có xác nhận. Hướng dẫn tạo dáng trong bài là gợi ý cho người đọc dựa trên ảnh, không phải lời thoại Harry được ghi nhận.

### Những điểm chưa được giải quyết trong hồ sơ publish

1. Không thấy Thin trong trang đầu News và hai trang bộ lọc Stories đã kiểm tra. Chưa rõ nguyên nhân cache/query/sort/config; không gọi là lỗi cache đã xác định. Direct URL public và discovery qua danh sách là hai kết quả khác nhau.
2. Template News thêm `Want to taste it yourself? / Book a food tour`. CTA trong bài đúng dịch vụ chụp; template cần source/dev xử lý.
3. Không có bằng chứng trong lượt publish rằng Google đã index, có rank mới hoặc có booking từ bài.

### Tài liệu mẫu nên đọc

| Artifact | Bài học |
|---|---|
| [Brief.md](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Brief.md) | Audience, keyword có nhãn, khác biệt với Hanna |
| [Sources-And-Image-Plan.md](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Sources-And-Image-Plan.md) | Nguồn, claim register, provenance và ảnh |
| [Page-Copy.md](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Page-Copy.md) | Bài tiếng Anh hoàn chỉnh |
| [Preview.html](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Preview.html) | Bản cụ thể để duyệt; giữ Draft như lịch sử |
| [Approval.md](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Approval.md) | Tách duyệt nội dung và chỉ đạo publish |
| [Publish-Body.html](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Publish-Body.html) | Body thực gửi CMS, URL ảnh public và UUID |
| [Publication.md](../../../Marketing-Growth/Content/Drafts/2026-10-23-Thin-Harry-Dong-Xuan/Publication.md) | Public QA, bằng chứng và giới hạn |
| [Publication-Manifest.json](../../../Creative-Production/Deliverables/Thin-Harry-Web-2026-10-23/Publication-Manifest.json) | 4 file thực được dùng; tránh nhầm derivative dự kiến với file đã upload |

## 5. Case Hanna và giới hạn chuyển giao

URL đã ghi nhận từ công việc trước: [Hanna with Harry](https://travelframe.sidevn.com/news/hanoi-street-style-photoshoot-harry-hanna), node109. Source Rocky chọn: [Dd6PfVFo3BT](https://www.instagram.com/p/Dd6PfVFo3BT/?img_index=1).

Không gán kết quả QA4/4 của Thin cho Hanna. Ghi chú phiên trước cho biết sửa ảnh cuối của Hanna đã lưu nhưng chưa có lượt xác minh public mới đầy đủ. Nếu làm tiếp Hanna, phải kiểm tra trực tiếp trạng thái và toàn bộ ảnh sau lần sửa gần nhất.

## 6. Bản đồ nguồn để tiếp tục

Các link local bên dưới được tính từ thư mục gói trong workspace. Nếu chỉ upload gói vào Claude chat, cần cung cấp thêm tài liệu được chọn khi nhiệm vụ cần đọc chi tiết; không giả vờ đã truy cập các link local.

| Nguồn | Khi nào dùng |
|---|---|
| [README](../../../README.md), [AGENTS](../../../AGENTS.md), [CLAUDE](../../../CLAUDE.md), [Workspace Map](../../../WORKSPACE-MAP.md) | Khởi động, quyền và owner |
| [Current State](../../../Executive/Current-State.md) | Ưu tiên/quyết định; snapshot21/10, không phải trạng thái live mọi lĩnh vực |
| [Source Of Truth Map](../../../Brand-Strategy/Source-Of-Truth-Map.md) | Chỉ đường tới canonical vault |
| Vault `01-Brand-Source-Of-Truth.md`, `02-Audience-And-Funnel.md`, `11-Proof-And-Approved-Claims.md` trong nhánh TravelFrame | Brand/audience/claim; đọc ngày và đối chiếu quyết định mới |
| [Voice Playbook](../../../Research-Insights/Library/knowledge/voice-playbook.md) | Giọng và các pattern theo loại nội dung |
| [Voice/Style Guide22/10](../../../Brand-Strategy/2026-10-22-TravelFrame-Voice-And-Style-Guide.md) | Draft tổng hợp, không tự coi toàn bộ là Approved |
| [Field Notes identity](../../../Brand-Strategy/brand.md) | Approved cho series Field Notes, không phải master identity cho mọi asset |
| [Hourly Pricing decision](../../../Executive/DEC-20261021-HOURLY-TIER-PRICING.md) | Giá/điều kiện/SLA đã Approved, supersede phương án theo phiên |
| [Audit22/10](../../../Marketing-Growth/SEO/2026-10-22-Audit/README.md) và [shortlist](../../../Marketing-Growth/SEO/2026-10-22-Audit/opportunities.md) | Vấn đề có bằng chứng và mức ưu tiên |
| [Fixes20/10](../../../Marketing-Growth/SEO/2026-10-20-Audit-Fixes/README.md) | Thay đổi cũ và hồ sơ GSC; đọc evidence trước khi lặp việc |
| [Keyword system13/10](../../../Marketing-Growth/SEO/2026-10-13-Keyword-System-From-Mettavoyage/README.md) | Nguồn discovery/autocomplete, không thay volume/rank mới |
| [OpenSEO Runbook](../../Runbooks/OpenSEO-Runbook.md) | Bối cảnh hạ tầng; một số claim/setup cũ cần kiểm tra trước dùng |
| [OpenSEO Project Context](../../../Marketing-Growth/Plans/OpenSEO-TravelFrame-Project-Context.md) | Context cũ có24h edit SLA và domain/path dự kiến; không dùng làm nguồn thương mại/live hiện hành |
| [Published Ledger](../../../Marketing-Growth/Published-Ledger.md) | Bài có publication record; đối chiếu node và public evidence |
| [Meta runbook](../../Runbooks/Meta-Connection-And-Publishing-Runbook.md) | Trước mọi task FB/IG/token/MCP; không trích credential |
| [Seed Comment Playbook](../../../Marketing-Growth/Guidelines/2026-10-07-Seed-Comment-Playbook.md) | Sau publish FB/IG, đúng phạm vi được phép; không áp dụng tự động cho bài website |
| [Daily Reporting Standard](../../../Data-Analytics/Daily-Reporting-Standard.md) | Báo cáo08:30ICT, so sánh cùng cửa sổ, phễu8 bước |
| [Technology skill playbook](../../Skills/Departments/Technology-Automation/README.md) | Chọn skill/tool cho công việc kỹ thuật |
| [Marketing skill playbook](../../Skills/Departments/Marketing-Growth/README.md) | Chọn skill SEO/content/growth |

## 7. Kinh nghiệm phiên trước, cần xác minh lại khi dùng

Ghi chú lịch sử OpenSEO/Drupal giúp nhận ra hai kiểu lỗi: OAuth có thể giữ tài khoản cũ dù login báo thành công; CMS save có thể xong khi ảnh public còn lỗi. Các ghi chú này chỉ dùng để thiết kế kiểm tra, không phải xác nhận connection, version plugin hay trạng thái trang hôm nay.

Không đưa tài khoản, cookie, khóa truy cập hoặc log session vào gói. Khi cần bước xác thực của người dùng, dùng luồng đăng nhập chính thức và để người dùng tự nhập thông tin nhạy cảm.
