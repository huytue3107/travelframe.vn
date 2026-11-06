---
title: TravelFrame - OpenSEO audit implementation
owner: Marketing-Growth
date: 2026-10-20
status: Live changes verified; both priority URLs queued by Google; template work blocked on Drupal source
---

# Điều chỉnh website theo OpenSEO audit

Rocky yêu cầu trong chat: “bạn điều chỉnh theo báo cáo để cải thiện website đi”. Phạm vi là các chỉnh sửa trong [SEO Audit — Oct 20, 2026](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/reports/6cf6867c-ff8f-41ae-a980-9ec62ec1d963). Thực hiện qua phiên quản trị Drupal hiện có; không đọc credential, không sửa booking engine, DNS hoặc quyền truy cập.

## Đã cập nhật trên website

| Khu vực | Thay đổi đã xác minh |
|---|---|
| Homepage | Thêm khối “Plan your Hanoi photo walk” với hai liên kết HTML tới trang photoshoot và Old Quarter. Hiển thị ở cuối nội dung, trước footer. |
| Homepage EN/VI | Bỏ lời hứa giao ảnh chung 24–48 giờ; chuyển sang thời hạn xác nhận cho gói khách chọn. SEO description mặc định EN bỏ cam kết 24 giờ. |
| FAQ EN/VI | Bỏ điều kiện đặt cọc 50%, hủy miễn phí trước 48 giờ và các điều kiện địa điểm/thời tiết chưa chốt; yêu cầu xác nhận bằng văn bản theo booking. Thêm câu hỏi về thời hạn/số ảnh. Không tự đặt chính sách thương mại mới. |
| Santorini, node 86 | Thay đoạn Day 1 và FAQ 48-hour itinerary bằng câu hỏi riêng về loại ảnh, kết hợp Yên Sở và việc cần xác nhận với venue. Thêm liên kết Old Quarter. |
| Tạ Hiện, node 84 | Thay đoạn Day 1 và FAQ 48-hour itinerary bằng câu hỏi riêng về buổi sáng/buổi tối, việc gọi đồ và cách kiểm tra giá. Thêm liên kết photoshoot và Old Quarter phù hợp. |
| Hiring photographer, node 91 | Bỏ package cũ 90/120 phút với 35–50 ảnh/24 giờ; dẫn sang trang package và written confirmation. Bỏ thống kê 60%/90% chưa có evidence. Sửa số WhatsApp về 0925148581 với link quốc tế đúng. Sửa H4/H5 nhảy cấp, đổi CTA live availability thành estimate. |
| 15 photo spots, node 92 | Bỏ cam kết chung 35–50 ảnh trong 24 giờ; dẫn về điều kiện gói đã xác nhận. Sửa link guide cũ đang quay về chính bài này và sửa heading. Đã rút trường SEO title trong CMS nhưng HTML công khai vẫn dùng title bài dài; phần xuất title chưa được sửa. |

Giữ nguyên URL, publication status và ba ảnh trong mỗi bài được sửa. Không thêm ảnh khách, testimonial hay thống kê mới. Bản EN/VI của nội dung blog chưa dịch thật vẫn là hạng mục riêng; batch này không gọi API dịch.

## Liên kết từ trang Tours

Đã thử đặt cùng khối liên kết trên homepage và Tours. HTML công khai có liên kết, nhưng JavaScript của Tours khóa viewport để vận hành bản đồ, khiến khối đặt dưới bản đồ không hiển thị cho người đọc. Đã loại Tours khỏi phạm vi hiển thị, giữ khối trên homepage. Không để lại liên kết mới bị khuất trên Tours.

Khối hiện tại:

- Content block UUID: `60f869e0-1e0e-4e30-a8a3-afebab3eda29`.
- Placement machine name: `travelframe_seo2010hanoiphotoshootandoldquarterlinks`.
- Region: `content`; visibility: `<front>`; không hiện title quản trị.
- Body dùng lớp `section`, `section--light`, `container` đang có trong theme.

## Kiểm tra sau thay đổi

- [validation.json](validation.json): 10 kiểm tra PASS trên 11 URL công khai, không dùng phiên admin.
- Cả 11 URL trả 200. Trang photoshoot và Old Quarter không có noindex, URL/canonical vẫn hoạt động.
- Bốn bài sửa giữ đủ ba ảnh mỗi bài; không còn FAQ 48 giờ ở Santorini/Tạ Hiện, không còn heading nhảy cấp trong bốn bài.
- Hai guide không còn số WhatsApp cũ, cam kết giao 24 giờ hoặc phần trăm booking không có nguồn.
- Homepage có hai liên kết mới; FAQ và Tours không có khối này.
- Xác nhận trực quan homepage và Santorini trong thư mục [evidence](evidence). Ảnh Tours là bằng chứng của thử nghiệm trước khi bỏ placement ở Tours.
- `npm test`: 158/158 PASS; `npm run test:skills`: 15/15 PASS.
- `npm run workspace:check`: FAIL do broken Markdown links và legacy absolute paths có sẵn, gồm `.agents/skills/`, `.claude/settings.local.json` và `scratch/`. Không sửa các file ngoài phạm vi để làm xanh kiểm tra.

Các test workspace không chứng minh Google đã lập chỉ mục. [OpenSEO run 72693e77](https://app.openseo.so/p/b97024a3-b095-44e9-9489-d5fce1361263/audit?auditId=72693e77-0497-4b63-a63e-5bb09ff14f82) hoàn tất lúc 09:12 ICT, 100/100 URL, không chạy Lighthouse. Lưu đầy đủ trong `openseo-audit-*.json` và [openseo-comparison.json](openseo-comparison.json).

| Chỉ báo OpenSEO | Trước | Sau |
|---|---:|---:|
| Heading nhảy cấp | 43 | 38 |
| Meta description quá dài | 4 | 3 |
| Title quá dài | 50 | 54 |
| Tổng issue instance | 177 | 175 |

Bốn URL bài đã sửa không còn `heading-order-skip`; bản `?lang=vi` của Tạ Hiện cũng hết lỗi này. Homepage không còn description quá dài. Hai mẫu quét khác nhau một URL ngôn ngữ, thời gian phản hồi cũng biến động, nên không diễn giải tổng 177→175 thành điểm cải thiện toàn website. Duplicate title/description ở nhiều bản ngôn ngữ, pagination và title dài vẫn còn; SEO title node 92 chưa phản ánh ra HTML. Cả photoshoot và Old Quarter được crawler đọc 200, indexable và có trong sitemap; đây không phải bằng chứng Google đã index.

## Việc chưa thực hiện

1. **Google indexing:** Theo chỉ dẫn mới của Rocky, dùng profile Chrome Son đang đăng nhập và có quyền với đúng property. Đã gửi `/hanoi-photoshoot` và `/news/hanoi-old-quarter-guide`; cả hai có xác nhận “Đã yêu cầu lập chỉ mục” và “URL đã được thêm vào hàng đợi ưu tiên thu thập dữ liệu”. Xem [gsc-indexing-requests.json](gsc-indexing-requests.json) và ảnh `evidence/gsc-*-requested.png`. Google chưa xác nhận index thành công; không gửi lặp lại hoặc coi hàng đợi là đã xuất hiện trên Google.
2. **Template và SEO title:** đưa liên kết vào bảng chọn tour, H1 riêng từng tour, thống nhất stop/overview của Early Bird, CTA food-tour toàn site và sửa cách template dùng trường SEO title. Chưa có mã nguồn Drupal trong workspace; đã hỏi Rocky vị trí source/repository. Không chèn JavaScript/CSS vào nội dung để né việc sửa template.
3. **Portfolio/claims:** chưa thêm ảnh khách hoặc review khi chưa có consent/provenance. Không đổi giá, công thức tính tiền hoặc duyệt một chính sách đặt cọc mới.
4. **Domain, ngôn ngữ và nội dung mở rộng:** chưa chuyển domain, chưa dịch blog, chưa làm bản đồ Old Quarter, chưa mở rộng các bài mới hoặc sửa toàn bộ 17 bài từng được ghi nhận có FAQ mẫu.

## Khôi phục

- **Bốn node:** vào node → Revisions, khôi phục revision ngay trước các log bắt đầu bằng `SEO 20/10 OpenSEO`. Node 91 có hai revision trong batch, nên chọn bản trước cả hai. Các file `node-*-before.html` là nguồn body trước khi chỉnh; `node-*-after.html` là nội dung dự kiến gửi vào editor, có thể khác khoảng trắng so với Drupal chuẩn hóa.
- **Cấu hình chung:** mở TravelFrame settings, khôi phục đúng năm trường theo `before` trong [settings-changes.json](settings-changes.json), rồi Save configuration. Không ghi đè các trường khác.
- **Khối liên kết:** trong Block layout của TravelFrame, Disable placement `travelframe_seo2010hanoiphotoshootandoldquarterlinks`. Giữ content block và snapshots để có thể bật lại; không cần xóa dữ liệu.
- `manifest-sha256.json` ghi checksum của snapshot, log và evidence trong batch, không bao gồm chính manifest.

Nguồn điều kiện thương mại: [SEO Fix Log 13/10](../2026-10-13-SEO-Fix-Log.md) ghi approval cho package theo configurator; canonical vault Operations/Policies yêu cầu written booking confirmation cho các điều kiện chưa chốt. Không nâng thông tin quan sát được trên website thành policy đã duyệt.
