---
title: Wuchr and Harry — website publication
owner: Marketing-Growth
status: Published
published_date: 2026-10-23
timezone: Asia/Ho_Chi_Minh
node: 111
url: https://travelframe.sidevn.com/news/hanoi-night-photoshoot-harry-wuchr
---

# Đã xuất bản

[A bus, a crosswalk and one stare: Wuchr's Hanoi night photoshoot](https://travelframe.sidevn.com/news/hanoi-night-photoshoot-harry-wuchr)

Theo [Approval.md](Approval.md). Tạo News node/111: English, tắt tự dịch VI, category Stories, kicker Photography Stories, format Full HTML, alias thủ công, Published. Không sửa template, giá, DNS, tracking hay bài khác.

## Ảnh

- Không lưu được file gốc về máy vì proxy shell chặn `fbcdn.net`. Trình duyệt đọc trực tiếp 8 file gốc từ CDN, tính SHA-256 (ghi tại [Raw README](../../../../Creative-Production/Assets/Raw/Wuchr-Trang-Tien-2026-10-23/README.md)) và tạo web derivative bằng canvas. Chỉ thu nhỏ: ảnh dọc 1200×1601, ảnh ngang 1600×1066, chất lượng 0.85. Không crop, không đổi màu, không chỉnh nội dung.
- Hero `DeqskH_ox_2-04.webp` upload qua field Main image (fid 864) và chèn đầu body. Bốn ảnh inline JPEG upload qua endpoint upload ảnh CKEditor5 `full_html`, dùng UUID do hệ thống cấp (xem [Publish-Body.html](Publish-Body.html)).
- Dung lượng file public khớp từng byte với derivative đã tạo: 138.866 / 135.845 / 195.811 / 165.153 / 237.811.

## Bằng chứng

- CMS `/admin/content`: node 111 **Published**, cập nhật 23 Oct 2026 15:04.
- Kiểm tra không cookie (`fetch` với `credentials:'omit'`; curl từ shell bị proxy chặn): HTTP 200, không có markup admin. [public-check.json](evidence/public-check.json).
- Title xuất ra `Hanoi Night Photoshoot That the Streets Completely Stole | TravelFrame Vietnam`, suffix chỉ thêm một lần. Description đúng brief (152 ký tự). Canonical là URL bài, không có meta robots noindex, og:image là hero.
- Một H1 do CMS xuất từ Title. Đoạn mở đầu body khớp Publish-Body.
- 5/5 ảnh trả 200, đúng MIME, có alt. Đã cuộn hết trang, cả 5 ảnh `complete` với `naturalWidth` đúng.
- Link nội bộ `/hanoi-photoshoot` và Trang Tien guide trả 200. Link Instagram không kiểm được status (no-cors). Không gửi DM hay đặt lịch thử.
- Viewport built-in browser rộng 590px: không tràn ngang. [Ảnh chụp đầu trang](evidence/published-top-590px.jpg). Chưa kiểm tra desktop rộng hoặc thiết bị di động thật.

## Giới hạn đã biết

- Template News vẫn thêm khối `Want to taste it yourself? / Book a food tour` (vấn đề template đã biết, source ở máy khác).
- Bài không xuất hiện ở trang đầu `/news` và `/news?category=4`. Bài Thin cũng vậy. Chưa xác định nguyên nhân.
- Published không có nghĩa là đã được Google index hay tăng hạng.
- Chưa có bản derivative trong `Creative-Production/Deliverables`, vì shell không tải được file từ site hay CDN.

## Kiểm tra workspace

Xem kết quả lần chạy cuối trong [Validation.md](Validation.md).
