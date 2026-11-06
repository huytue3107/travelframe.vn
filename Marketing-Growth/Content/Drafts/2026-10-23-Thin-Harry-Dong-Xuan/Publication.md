---
title: Thin and Harry — website publication
owner: Marketing-Growth
status: Published
published_date: 2026-10-23
timezone: Asia/Ho_Chi_Minh
node: 110
url: https://travelframe.sidevn.com/news/hanoi-old-quarter-photoshoot-harry-thin
---

# Đã xuất bản

[A Hanoi Old Quarter photoshoot with Harry: Thin in red](https://travelframe.sidevn.com/news/hanoi-old-quarter-photoshoot-harry-thin)

Rocky đã duyệt bài/4 ảnh, sau đó yêu cầu trực tiếp “đăng lên website đi”. Đã tạo News node/110, ngôn ngữ English, category Stories, kicker Photography Stories, URL alias theo brief. Tắt tự dịch VI; không đổi gói/giá, template, DNS, tracking hoặc bài khác.

## Bằng chứng

- CMS Content hiển thị đúng tiêu đề, trạng thái **Published**, link Edit `/node/110/edit?destination=/admin/content`.
- Truy cập HTTP không kèm cookie nhận **200**; [snapshot công khai](evidence/public-page.html), [kiểm tra metadata và tài nguyên](evidence/public-check.json).
- Title: `Hanoi Old Quarter Photoshoot: Thin With Harry | TravelFrame Vietnam`. Suffix do CMS thêm một lần. Description khớp brief, canonical là URL bài, không có meta noindex.
- Nội dung text trong `article.article-body > div` khớp nguyên văn [Publish-Body.html](Publish-Body.html); H1 được CMS xuất riêng, chỉ có một H1 trên trang.
- Đủ 4 ảnh, alt riêng, width/height. 4 tài nguyên HTTP 200, Content-Type đúng; Chrome đã cuộn và xác nhận cả 4 `complete=true`, `naturalWidth>0`: [render evidence](evidence/desktop-render.json).
- Main image WebP đã lưu trong CMS; đồng thời chèn vào body để thấy ảnh đầu trong bài. Ba ảnh còn lại dùng JPEG tối ưu vì bộ upload CKEditor chỉ nhận JPEG/PNG/GIF. Giữ đúng ảnh, tỉ lệ, màu và nội dung đã duyệt, không crop hoặc chỉnh mặt/người nền. Chưa xác nhận thumbnail ở danh sách tin vì không thấy bài trong mẫu danh sách đã kiểm tra.
- Trang dịch vụ `/hanoi-photoshoot` trả 200. CTA Instagram dẫn `https://www.instagram.com/travelframe.vn/`. Không gửi DM hoặc booking thử.
- Desktop 1322px và mobile 390px không tràn ngang. Đã xem ảnh chụp desktop, mobile và vùng ảnh chợ. Mobile là Chrome giả lập viewport, chưa phải kiểm tra máy iPhone/Android thật.
- [Ảnh trang không đăng nhập trong in-app browser](evidence/public-anonymous.png); [desktop](evidence/published-desktop.png); [mobile](evidence/published-mobile.png); [vùng ảnh chợ](evidence/published-market-images.png).

## Giới hạn đã biết

Template News chung vẫn thêm khối `Want to taste it yourself? / Book a food tour` sau bài. CTA đặt chụp trong bài đã đúng. Đây là vấn đề template đã biết, source đang ở máy khác; không sửa source hoặc chèn CSS/JS để che trong lượt đăng bài này.

Không thấy bài ở trang đầu `/news` hoặc hai trang của bộ lọc Stories (`category=4`; trang thứ hai được mở theo link Last page công khai). [Trang Stories đầu](evidence/news-listing.json), [trang Stories cuối](evidence/news-listing-page2.json). CMS xác nhận Published và URL trực tiếp trả 200 không đăng nhập, nên không ghi đây là lỗi đăng thất bại. Chưa xác định nguyên nhân thuộc cache, truy vấn, sắp xếp hay cấu hình danh sách; không tự sửa các cấu hình đó khi chưa có bằng chứng. Cần kiểm tra source để xử lý khả năng khám phá bài qua danh sách.

Published xác nhận trang truy cập công khai, không đồng nghĩa Google đã index hoặc từ khóa tăng hạng. Không gửi yêu cầu index, bật tracking trả phí hoặc tuyên bố top 1.

Bản Preview/Draft và bằng chứng duyệt trước đó được giữ nguyên làm lịch sử. Trạng thái hiện tại của bài là Published theo hồ sơ này.

## Kiểm tra workspace sau xuất bản

`npm test` 158/158 PASS; `npm run test:skills` 15/15 PASS; `npm run workspace:check` PASS đủ 10 nhóm. Các kiểm tra này xác nhận tài liệu/công cụ local, không thay thế bằng chứng public hoặc giải quyết giới hạn danh sách nêu trên.
