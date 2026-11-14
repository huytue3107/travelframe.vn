---
title: Yêu cầu Google lập chỉ mục 6 trang sau SEO Audit 14/11
owner: Marketing-Growth
status: Done
date: 2026-11-14
source_report: OpenSEO SEO Audit — Nov 14, 2026 (report 87eb8f5b), đề xuất 1
approval: Rocky chọn "Gửi index 6 trang" (Google) rồi "Gửi Bing" trong chat 14/11/2026
---

# Kết quả

Search Console, property `https://travelframe.sidevn.com/`, Kiểm tra URL rồi Yêu cầu lập chỉ mục, trong built-in browser (phiên đăng nhập có sẵn). Gửi từ 17:31 đến 17:39 ICT ngày 14/11/2026. Cả 6 trang đều nhận thông báo "Đã yêu cầu lập chỉ mục: URL đã được thêm vào hàng đợi ưu tiên thu thập dữ liệu".

## Bing

Đã gửi lúc 17:41 ICT, qua Bing Webmaster Tools → URL Submission, cùng 6 URL. Bing báo "Success: 6 URLs submitted Succesfully". Danh sách hiện cả 6 với mốc "Today at 17:41". Hạn mức ngày trước khi gửi còn 98.

Trước đó, 3 URL đã từng được gửi lên Bing, đều sau lần sửa gần nhất của trang:

- /hanoi-photoshoot: 13/11 lúc 11:00.
- St Joseph's: 12/11 lúc 10:52.
- Airport to Old Quarter: 10/11 lúc 22:07.

Train Street, Old Quarter guide và Secret Food Map không có trong 25 dòng gần nhất của danh sách. Rocky duyệt gửi đủ 6 trang, nên 3 trang trên được gửi lại.

| Trang | Trước khi gửi (Search Console) | Kiểm tra lại qua API lúc 17:39 ICT |
|---|---|---|
| [/hanoi-photoshoot](https://travelframe.sidevn.com/hanoi-photoshoot) | Trên Google; Google đọc lần cuối 13/11 10:40, trước khi trang mới lên (khoảng 10:55); kết quả tìm kiếm vẫn hiện "from $8 … No deposit" | Chưa đọc lại (vẫn 13/11 10:40) |
| [St Joseph's Cathedral](https://travelframe.sidevn.com/news/st-josephs-cathedral) | Trên Google; đọc lần cuối 16/10, trước phần Giáng sinh thêm ngày 12/11 | Chưa đọc lại (vẫn 16/10) |
| [Train Street 2026](https://travelframe.sidevn.com/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots) | Trên Google; đọc lần cuối 17/10, trước bản cập nhật 9/11 | Đã đọc lại lúc 17:36 |
| [Old Quarter guide](https://travelframe.sidevn.com/news/hanoi-old-quarter-guide) | Trên Google; đọc lần cuối 20/10, trước link 9/11 và nút bản đồ 10/11 | Chưa đọc lại (vẫn 20/10) |
| [Hanoi airport to Old Quarter](https://travelframe.sidevn.com/news/hanoi-airport-to-old-quarter) | Không có trên Google ("Discovered, currently not indexed") | Đã đọc lúc 17:38, "Submitted and indexed" |
| [Secret Food Map](https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map) | Không có trên Google | API trả "URL is unknown to Google" ngay sau khi gửi |

Giờ ghi theo ICT. Giờ đọc lấy từ `lastCrawlTime` của URL Inspection API (OpenSEO `inspect_urls`), đổi từ UTC.

# Việc tiếp theo

- **21/11/2026:** chạy lại URL Inspection cho 6 trang.
  - Với /hanoi-photoshoot, xem dòng mô tả trên Google đã đổi sang "from 30 USD/hour" chưa.
  - Không gửi lại sớm hơn. Search Console cho biết gửi lại không làm URL lên trước trong hàng đợi.
- **Bing:** cùng ngày 21/11, dùng URL Inspection trong Bing Webmaster Tools để kiểm tra 6 trang.
