---
title: Yêu cầu Google lập chỉ mục 6 trang sau SEO Audit 14/11
owner: Marketing-Growth
status: Done
date: 2026-11-14
source_report: OpenSEO SEO Audit — Nov 14, 2026 (report 87eb8f5b), đề xuất 1
approval: Rocky chọn "Gửi index 6 trang" trong chat 14/11/2026
---

# Kết quả

Search Console, property `https://travelframe.sidevn.com/`, Kiểm tra URL rồi Yêu cầu lập chỉ mục, trong built-in browser (phiên đăng nhập có sẵn). Gửi từ 17:31 đến 17:39 ICT ngày 14/11/2026. Cả 6 trang đều nhận thông báo "Đã yêu cầu lập chỉ mục: URL đã được thêm vào hàng đợi ưu tiên thu thập dữ liệu".

Chỉ gửi Google. Chưa gửi Bing.

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
- **Bing:** muốn gửi URL Submission cho cùng 6 trang thì cần Rocky duyệt riêng.
