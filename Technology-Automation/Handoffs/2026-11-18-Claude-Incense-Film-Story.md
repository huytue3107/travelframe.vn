---
title: Handoff — bài làng hương Quảng Phú Cầu (story Harry), 18/11/2026
owner: Technology-Automation
status: Done, chờ phê duyệt bước tiếp theo
created: 2026-11-18
---

# Việc đã làm (có bằng chứng)

| Việc | Kết quả | Bằng chứng |
|---|---|---|
| Nghiên cứu từ khoá làng hương và film | Xong, không lưu từ khoá | OpenSEO report `18720a9d`; [README và keywords.csv](../../Marketing-Growth/SEO/2026-11-18-Keyword-Research-Incense-Village-Film/README.md) |
| Viết và đăng bài tiếng Anh về Harry ở làng hương | Đã đăng, node 139, Published 14:29:59 ICT 18/11/2026 | https://travelframe.sidevn.com/news/incense-village-photoshoot-hanoi ; [Publication.md](../../Marketing-Growth/Content/Drafts/2026-11-18-incense-village-film-story/Publication.md) |
| Kiểm tra trang public khi không đăng nhập | HTTP 200, canonical, og:image, 7 link nội bộ 200, trong sitemap, 375 px không tràn | Publication.md, mục Kiểm tra trang live |
| Ghi sổ | Dòng mới ở [Published-Ledger.md](../../Marketing-Growth/Published-Ledger.md) | — |

Bài giữ bài hướng dẫn node 68 tại URL cũ và link sang đó 3 lần. Không sửa node nào khác.

# Đang chờ

- Harry xác nhận phần film: máy, loại film, lab, bộ nào là film thật; bài hiện chỉ nói "some of them on film" và không nêu giá, hạn giao hay gói film.
- Quyền ảnh: bài không dùng ảnh Harry, ảnh Viktor hay thư mục `Fin FIlm` (6 PNG mang nhãn "Made with Google AI"; `Fin 05.jpg` là ảnh quét film nhưng chưa rõ consent). Cần Harry và người trong ảnh đồng ý, rồi Rocky duyệt.
- Rocky duyệt gửi index (Google Request Indexing, Bing URL Submission) cho URL mới.
- Rocky duyệt một câu link từ node 68 sang bài mới (tránh hai trang tranh cùng truy vấn).
- Rocky quyết định có bán chụp film không (giá, số cuộn, hạn giao, lab).

# Bước tiếp theo

1. Sau khi Harry xác nhận, cập nhật bài ở `/node/139/edit` (nguồn lấy từ `textarea[name="body[0][value]"]`, không dùng HTML render).
2. Sau khi Rocky duyệt index, gửi Google và Bing, ghi vào `Marketing-Growth/SEO/` cùng đợt kiểm tra 21/11.
3. Kiểm tra lại khoảng 16/12/2026: Search Console truy vấn chứa "incense"; SERP Mỹ "incense village photoshoot".

# Ghi chú vận hành

- Đăng qua trình duyệt nhúng Orca, tab `95995ab5-6c66-45d6-8f4c-d457d4583ce8` (phiên biên tập do phiên Codex mở). Chrome local chỉ là phiên ẩn danh; dùng để kiểm tra trang public.
- Lớp chống bot của site chặn curl và WebFetch (trang "One moment, please..."); trình duyệt thật vượt được khi tab hiện trên màn hình.
- Không dùng API trả phí, không đọc hay in credential.
