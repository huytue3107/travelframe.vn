---
title: Wuchr and Harry — draft verification
owner: Marketing-Growth
status: Review
created: 2026-10-23
updated: 2026-10-23
---

# Kết quả kiểm tra

- Đã xem trực tiếp cả 8 ảnh của carousel DeqskH_ox_2 ở kích thước lớn trong built-in browser. Caption, location và thời điểm đăng đọc từ DOM.
- Bài khoảng 950 từ, một H1, 7 H2 (gồm FAQ và CTA), 3 H3 FAQ, 5 ảnh, mỗi ảnh có alt riêng. Có một CTA Instagram PHOTO, link ngữ cảnh tới `/hanoi-photoshoot` và trang Trang Tien guide.
- Body không có giá, gói, số ảnh, SLA, lời thoại, testimonial hay ngày chụp. Không nêu tên thương hiệu thấy trong ảnh. Phần "bất ngờ" chỉ kể những gì nhìn thấy trong ảnh.
- Preview render trong built-in browser (viewport 590px): 5/5 ảnh `complete` và `naturalWidth>0`, không tràn ngang. Đây không phải kiểm tra trên thiết bị di động thật. Ảnh lấy từ URL CDN tạm, sẽ hết hạn.
- `npm test`: 158/158 pass. `npm run test:skills`: 15/15 OK. `npm run workspace:check`: PASS 10/10 nhóm (lượt đầu báo thiếu Validation.md; đã tạo và chạy lại).

# Chặn / chưa làm

- Source ảnh chưa tải được: proxy chặn CDN Instagram. Chưa có SHA-256 và web derivative. Link ảnh trong Page-Copy trỏ tới đường dẫn derivative dự kiến.
- Credit "Harry Pham / 102 Koncept" cần Rocky xác nhận.
- Keyword chưa có volume/KD/SERP. Chưa kiểm tra trùng slug trong CMS.
- Chưa tạo node, chưa publish, không stage/push Git.

# Sau xuất bản (2026-10-23)

- npm test: # pass 158 # fail 0
- npm run test:skills: Ran 15 tests in 0.190s OK
- npm run workspace:check: 10/10 PASS
- Bằng chứng live: [Publication.md](Publication.md). Test local không thay thế kiểm tra live.
