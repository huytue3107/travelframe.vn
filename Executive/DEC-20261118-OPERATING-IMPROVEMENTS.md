---
title: Phương án cải thiện sau Operating Review 18/11
owner: Executive
status: Draft
created: 2026-11-18
updated: 2026-11-18
approver: Rocky
---

# DEC-20261118-OPERATING-IMPROVEMENTS

**Trạng thái:** Draft — chờ Rocky phê duyệt từng phương án. Chưa có nội dung nào trong file này là Approved.

## Context

[Operating Review 18/11](Snapshots/2026-11-18-Operating-Review.md) chốt pilot từ nửa cuối tháng 8 đến 18/11: mục tiêu 10 booking trả phí, kết quả đối soát 0 booking và $0 doanh thu. [Lead Tracker](../Data-Analytics/Lead-Pipeline-Tracker.csv) có 97 hồ sơ: 40 Guide-Sent, 26 Inquiry, 19 Quoted, 11 Qualified-unconfirmed, 1 Meeting-Scheduled, 0 Deposited/Booked/Delivered. Đầu phễu có tín hiệu (FB 3.540, IG 783 follower; Reel Survival Guide 77.688 views FB), nhưng vòng báo giá → cọc → phục vụ → bàn giao → phản hồi chưa hoàn tất lần nào.

Phân định theo khung review: số liệu trên là Fact. Nhận định "nghẽn ở đoạn cuối phễu, không phải đầu phễu" là Interpretation. Sáu phương án dưới là Recommendation. Mục "Quyết định cần Rocky chốt" trong từng phương án là Decision Needed.

## Phương án 1 — Đóng báo giá tồn tệp foreign (P0)

- **Phạm vi (Rocky chốt 18/11):** chỉ khách nước ngoài cần dẫn tour. Lọc còn **9 Quoted** (8 cũ 26–31/10 + Fernando) + 1 Meeting-Scheduled; 10 lead domestic/out-of-scope đề xuất chuyển Lost. Hai tin Threads đã duyệt trước đó bị hủy vì là kỷ yếu khách Việt. Chi tiết trong [bản rà soát Sales-CRM](../Sales-CRM/Funnel/2026-11-18-Quoted-Review-DRAFT.md).
- **Vấn đề:** 9 Quoted foreign + 1 Meeting-Scheduled đang treo, là nguồn booking gần nhất.
- **Hành động:** Sales-CRM rà từng báo giá còn phù hợp ngày đi của khách; follow-up một vòng có script thống nhất; nếu khách đồng ý thì ghi booking bằng xác nhận văn bản + chứng từ, rồi ghi chi phí, thời gian bàn giao và phản hồi sau trải nghiệm.
- **Owner:** Sales-CRM + Executive.
- **Đo lường:** số Quoted → Deposited → Booked; thời gian bàn giao thực tế; phản hồi khách.
- **Quyết định cần Rocky chốt:** điều kiện thương mại dùng cho đợt follow-up này; danh sách khách được liên hệ theo quy trình live.

## Phương án 2 — Chốt 1 đường nhận cọc (P0)

- **Vấn đề:** mức cọc và cách thanh toán treo từ [DEC giá giờ](DEC-20261021-HOURLY-TIER-PRICING.md); [DEC quà tặng](DEC-20261112-GIFT-DATE-CHANGE-REFUND.md) cũng ghi nhận còn mở. Không có cọc thì không thể có Booked đối soát được.
- **Hành động:** chốt mức cọc, phương thức (PayPal / chuyển khoản / tiền mặt) và kênh chốt đơn chính (DM hay web). Dùng [Hanoi Handbook $12](../Creative-Production/Projects/Hanoi-Handbook-Ebook-2026/README.md) làm phép thử thanh toán trước khi áp cho tour, vì file v04 đã sẵn mà đang kẹt `file_private_path` và cấu hình PayPal.
- **Owner:** Executive (quyết định) + Technology-Automation (kỹ thuật thanh toán).
- **Đo lường:** giao dịch cọc đầu tiên có chứng từ; Handbook bán được hay không và vì sao.
- **Quyết định cần Rocky chốt:** mức cọc, phương thức nhận tiền, kênh chốt đơn chính.

## Phương án 3 — Sửa đường đặt web tối thiểu (P0)

- **Vấn đề:** [Ticket booking 24/10](../Sales-CRM/Funnel/2026-10-24-Booking-Fix-Ticket.md) treo từ 24/10 chờ duyệt từng hạng mục. Basic 1 giờ không đặt được trong builder; dải "no deposit" trên trang chủ còn mâu thuẫn với chính sách đang soạn (xem [hồ sơ cập nhật 13/11](../Marketing-Growth/Content/Drafts/2026-11-13-Hanoi-Photoshoot-Refresh/Adjustment-Publication.md)).
- **Hành động:** duyệt và làm các mục P0/P1 của ticket: bảng giá giờ ở bước 1, form chỉ cần tên + 1 kênh liên hệ + ngày + số khách, nút IG DM cạnh tổng giá, đánh dấu `purchase` và `contact_click` làm key event GA4, lọc traffic nội bộ. Xử lý nốt dải cam kết trang chủ và Basic 1 giờ.
- **Owner:** Technology-Automation + Sales-CRM.
- **Đo lường:** so 7 ngày trước/sau deploy (đủ ≥30 phiên): `/tours` → `/booking`, `add_to_cart` → `begin_checkout` → `purchase`, số `contact_click`, số request thật về inbox.
- **Quyết định cần Rocky chốt:** tick duyệt từng hạng mục trong ticket; trả lời 5 câu hỏi mở cuối ticket (repo deploy, nơi nhận request, makeup/trang phục tính cho mấy khách, có thu cọc online ngay không).

## Phương án 4 — Tách 2 phễu đo lường (P1)

- **Vấn đề:** 42/97 dòng tracker lệch schema 18 cột; guide và nhu cầu mua đang trộn chung nên không tính được stage conversion hay attribution. Chi phí marketing toàn kỳ chưa đối soát nên chưa có CAC/MER.
- **Hành động:** Data-Analytics chuẩn hóa CSV về đủ 18 cột, bổ sung định danh nguồn (`source_ref`); nhánh nhận guide chỉ đo nurture; nhánh mua đo riêng qua 3 câu hỏi (ngày đi, số khách, loại buổi chụp). Đối soát chi phí toàn kỳ một lần.
- **Owner:** Data-Analytics + Sales-CRM (nhập liệu).
- **Đo lường:** 100% dòng đúng schema; conversion từng stage; CAC/MER lần đầu có số.
- **Quyết định cần Rocky chốt:** không cần quyết định thương mại; chỉ cần chốt người nhập liệu hằng ngày (đang mở trong Current State).

## Phương án 5 — Scale đúng winners (P1)

- **Vấn đề:** [báo cáo content 09/11](../Data-Analytics/Reports/2026-11-09-TravelFrame-Instagram-Facebook-Content-Winners.md) cho thấy công thức thắng là món/địa điểm cụ thể và mẹo lần đầu, nhưng CTA hiện tại chỉ kéo guide, chưa đo nhu cầu mua. SEO có tín hiệu click nhỏ (`/hanoi-photoshoot` 85 hiển thị, 2 click).
- **Hành động:** Marketing-Growth giữ công thức winners cho đầu vào, đồng thời gắn câu hỏi mua (ngày đi, số khách, loại buổi chụp) trên nội dung portfolio và trang dịch vụ. SEO theo [cơ hội audit 17/11](../Marketing-Growth/SEO/2026-11-17-TravelFrame-SEO-Audit/opportunities.md): giữ URL bài lễ đang có click, đặt link "1-hour photoshoot" cạnh Custom Tour, chẩn đoán robots/sitemap bằng Search Console URL Inspection.
- **Owner:** Marketing-Growth + Brand-Strategy.
- **Đo lường:** số lead trả lời đủ 3 câu hỏi mua trên nội dung portfolio/service; impressions/clicks Search Console theo trang.
- **Quyết định cần Rocky chốt:** không cần quyết định mới; bám các quyết định giá và chính sách đã duyệt.

## Phương án 6 — Kết luận đợt affiliate (P1)

- **Vấn đề:** [checkpoint đối tác](../Marketing-Growth/Campaigns/CMP-202611-HANOI-LODGING-AFFILIATE/Checkpoint.md) xác nhận 77 email đã gửi, nhưng chưa xác minh partner activation hoặc đơn từ đối tác.
- **Hành động:** rà reply và bounce sau đợt gửi; đề xuất mở rộng hoặc dừng.
- **Owner:** Marketing-Growth.
- **Đo lường:** số reply, số partner kích hoạt, số đơn quy được về đối tác.
- **Quyết định cần Rocky chốt:** mở rộng hay dừng sau khi có kết quả rà soát.

## Thứ tự khuyến nghị

P0 trước (phương án 1 + 2 + 3): đóng báo giá tồn, chốt đường cọc, sửa đường đặt tối thiểu. Ba việc này cùng phục vụ một mốc duy nhất là booking đối soát đầu tiên. P1 sau (4 + 5 + 6): chuẩn hóa đo lường, scale winners có CTA mua, kết luận affiliate. Không scale ads hay mở chiến dịch mới trước khi vòng báo giá → cọc đầu tiên được ghi nhận có chứng từ.

## Tác động phòng ban

- **Sales-CRM:** chủ trì phương án 1; phối hợp phương án 3 (form, DM) và 4 (nhập liệu).
- **Technology-Automation:** chủ trì kỹ thuật phương án 2 và 3.
- **Data-Analytics:** chủ trì phương án 4.
- **Marketing-Growth + Brand-Strategy:** chủ trì phương án 5 và 6.
- **Executive:** gom quyết định trình Rocky; cập nhật Current State sau phê duyệt.

## Review Date

2026-11-25: kiểm tra booking/cọc đối soát đầu tiên và tiến độ P0. Nếu đến hạn vẫn 0 Deposited thì review lại offer và kênh chốt đơn.

## Approval Evidence

- Rocky, chat 18/11/2026 (P0-2): chốt **"xác nhận trước, cọc sau"** — giữ "gửi yêu cầu trước, xác nhận sau", cọc thủ công sau khi chốt lịch; chưa mở cọc online.
- Rocky, chat 18/11/2026: chốt **kênh chốt đơn chính là WhatsApp**.
- Rocky, chat 18/11/2026 (P0-3): duyệt **phạm vi P0 + P1** trong ticket booking 24/10 (bảng giá giờ, form nhẹ, nút IG DM, key event GA4, lọc traffic nội bộ).
- Rocky, chat 18/11/2026 (P0-1): duyệt **danh sách gửi foreign** (Fernando + 8 Quoted cũ + DM 3 lead nóng 58/63/94); gói tin trong [Send Package](../Sales-CRM/Scripts/2026-11-18-Foreign-Followup-Send-Package.md), chờ gửi thủ công.

Các phương án còn lại vẫn chờ duyệt. Chưa gửi tin nhắn, chưa sửa live, chưa publish theo file này.
