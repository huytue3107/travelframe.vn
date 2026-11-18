---
title: "Phân cụm 4 chủ đề long-tail Hà Nội + danh sách sửa live (09/11/2026)"
owner: Marketing-Growth
status: "Review; L1–L4 đã live 09/11 (xem SEO Fix Log §9)"
source: "OpenSEO Competitive Landscape bc82f002 (09/11); get_keyword_metrics + get_serp_results US/en desktop 09/11"
---

# Phân cụm long-tail Hà Nội

Số liệu: OpenSEO `get_keyword_metrics` (Mỹ, tiếng Anh) và `get_serp_results` (desktop), ngày 09/11/2026. KD là độ khó từ khoá (0–100).

## Cụm → trang đích

| Cụm | Từ khoá (lượt/tháng, KD) | Trang đích | Việc |
|---|---|---|---|
| **Quảng Phú Cầu (làng hương)** | incense village hanoi 390 (0) · quang phu cau incense village 320 (0) · incense village hanoi tour 140 · incense village vietnam 140 · hanoi incense village 110 | Bài hiện có `/news/cam-phu-cau-incense-village-photography-guide` (node 68) | **Sửa tên sai "Cam Phu Cau" thành "Quang Phu Cau"** ở title, SEO title, meta và body. Giữ URL. Thay 2 ảnh `rednotedownloader.com_photos*` bằng ảnh gốc |
| **French Quarter** | french quarter hanoi 590 (0) · hanoi french quarter 590 · hanoi opera house 1.300 (4) | Bài mới "Hanoi French Quarter guide"; "hanoi opera house" giữ ở bài Tràng Tiền (node 81) | SERP là dạng hướng dẫn theo khu (điểm phải xem, chỗ ở). Bài Tràng Tiền chỉ phủ một góc, nên viết bài khu riêng và link 2 chiều |
| **Day trips** | day trips from hanoi 720 (0) · hanoi day trips 260 · best day trips from hanoi 110 · bat trang ceramic village 720 (3) | Bài mới "Day trips from Hanoi" (hub); "bat trang ceramic village" thuộc bài Bát Tràng (node 70) | Hub link tới Bát Tràng, Quảng Phú Cầu, Santorini Park. SERP: Reddit #1, marketplace tour, blog |
| **Street food** | hanoi street food 480 (0) · street food hanoi 480 · best street food in hanoi 30 | Bài hiện có: street food guide (node 65) | Không viết bài mới, vì title node 65 đã có "Hanoi Street Food Guide 2026". Bổ sung nội dung đi ăn thực tế |
| Street food tour (thương mại) | hanoi street food tour 590 (0, CPC 2,48) | Tour hiện có `/tour/taste-hanoi-culinary-delights-street-vibes` | Không dùng bài blog cho từ khoá này, để tránh tranh với trang tour |

**Đã kiểm tra trùng từ khoá:** Search Console 10/10–06/11 chưa có trang TravelFrame nào nhận truy vấn của 4 cụm này. Riêng "hanoi street food" đang vào bản `?lang=vi` của node 65 (vị trí khoảng 90).

## Danh sách sửa live (chờ đăng nhập admin)

| # | Trang | Thay đổi | Kiểm tra |
|---|---|---|---|
| L1 | `/news/santorinipark` (404, còn lượt hiển thị trong Search Console) | Redirect 301 sang `/news/santorini-park-lovely-photo-spot-right-outside-hanoi` | `curl -sI` trả 301 kèm `location` đúng |
| L2 | Train Street (node 71) | Thêm đoạn "2026 update" có ngày và nguồn vào khối Quick answer (nội dung bên dưới) | Bài hiển thị đoạn mới; không còn mâu thuẫn |
| L3 | Quảng Phú Cầu (node 68) | Sửa tên làng ở title, SEO title, meta và body; thêm "Ứng Hòa, about 35 km south of central Hanoi" | `curl` title chứa "Quang Phu Cau", body không còn "Cam Phu" |
| L4 | Bát Tràng (node 70) | Bỏ hậu tố trùng "\| TravelFrame" trong SEO title | `<title>` chỉ còn một lần "TravelFrame Vietnam" |

### Nội dung L2 (Train Street, tiếng Anh)

> **2026 update (checked 9 November 2026):** In February 2026, Vietnam's Ministry of Construction and the Hanoi People's Committee agreed to cut the number of passenger trains and stop freight trains on the Hanoi – Long Biên – Gia Lâm section, which includes Train Street. The changes were scheduled for completion before 1 July 2026, so expect fewer trains than older guides describe. We could not confirm the current timetable, so ask your hotel or a café on the day, and never wait on the tracks.

Nguồn:
- [VOV, 25/02/2026](https://vov.vn/xa-hoi/ha-noi-giam-tan-xuat-tau-qua-pho-ca-phe-duong-tau-dung-tau-hang-noi-do-post1271185.vov)
- [Thể thao & Văn hóa, 26/02/2026](https://thethaovanhoa.vn/giam-tau-khach-dung-tau-hang-qua-pho-ca-phe-duong-tau-va-cau-long-bien-20260226195530011.htm)
- [Vietcetera, 10/03/2026](https://vietcetera.com/en/hanoi-cuts-train-services-to-famous-train-street-can-it-remain-a-tourist-magnet)
- [Giáo dục Thủ đô](https://giaoducthudo.giaoducthoidai.vn/cam-xe-qua-cau-long-bien-trong-2-thang-nguoi-dan-di-chuyen-the-nao-208163.html): mốc trước 01/07

**Đính chính báo cáo bc82f002:** snippet VnExpress chỉ nói về "đề xuất dừng tàu khách". Quyết định thực tế ngày 25–27/02/2026 là **giảm** tàu khách và **dừng** tàu hàng. Chưa tìm thấy nguồn xác nhận việc thực hiện sau 01/07/2026. Vì vậy đoạn L2 chỉ viết "expect fewer trains", không khẳng định tàu đã giảm.

## Bài mới cần viết (thêm vào lịch biên tập)

1. Hanoi French Quarter guide: French Quarter 590 + 590.
2. Day trips from Hanoi: 720 + 260 + 110.

Cả hai bài cần ảnh gốc theo quy tắc của lịch biên tập.
