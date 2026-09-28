---
title: "Thống kê các marketplace cạnh tranh với TravelFrame ở Hà Nội"
date: 2026-09-28
status: Review
owner: Research-Insights
scope: "Klook, Viator, GetYourGuide, Airbnb Experiences"
---

# Thống kê marketplace cạnh tranh với TravelFrame

## Phạm vi

Bổ sung cho [nghiên cứu 12 website đối thủ và 4 marketplace ngày 2026-09-27](2026-09-27-TravelFrame-Competitor-Website-Research.md). Chỉ so các nền tảng ở cấp **domain authority** và kiểm tra **một danh mục liên quan đến ảnh tại Hà Nội**. Không dùng traffic, review hay số listing của toàn domain làm số khách, booking hoặc doanh thu tại Hà Nội.

## 1. Sức mạnh domain: Ahrefs qua Monid

| Nền tảng | Domain | Domain Rating (DR) | Ahrefs Rank | Ngày yêu cầu báo cáo | Run ID |
|---|---|---:|---:|---|---|
| Airbnb Experiences | airbnb.com | 92 | 288 | 2026-09-28 | `01M3KFS4S57VNBZ1KA8S07F3KM` |
| GetYourGuide | getyourguide.com | 90 | 1.638 | 2026-09-28 | `01M3KFS2PQY8P5QHPVW2KVHKXD` |
| Viator | viator.com | 90 | 1.919 | 2026-09-28 | `01M3KFS0HKBJ048V68WA4V9Q3P` |
| Klook | klook.com | 85 | 4.800 | 2026-09-28 | `01M3KFRQY28Y9KTZKPD403SN1Z` |

Nguồn: Ahrefs `/site-explorer/domain-rating` qua Monid; bốn run trả về `COMPLETED`, mỗi run một kết quả, giá USD 0,006/run, tổng chi phí USD 0,024. Số dư ghi nhận sau đó USD 0,1546. Đây là chỉ số sức mạnh hồ sơ backlink cấp domain, **không đo khả năng xếp hạng trang Photo Walk cụ thể**, tỷ lệ chuyển đổi hoặc thị phần tour ảnh Hà Nội. Ahrefs Rank nhỏ hơn thể hiện vị trí xếp hạng domain cao hơn trong chính chỉ số này, không phải thứ hạng Google cho một keyword.

Để tham chiếu cùng nhà cung cấp, batch ngày **2026-09-27** cho `withlocals.com` DR 67, `flytographer.com` DR 63, `forevervacation.com` DR 44, `localgrapher.com` DR 43, `vespaadventures.com` DR 42. Đó là domain doanh nghiệp/dịch vụ, không cùng quy mô hay inventory với các marketplace. Batch trước không chỉ định country; số `organic traffic` bằng 0 ở một số domain phải coi là giá trị endpoint, không phải kết luận không có traffic.

## 2. Độ phủ danh mục hiển thị

| Nền tảng | Trang/danh mục kiểm tra | Số hiển thị | Độ tin cậy và phạm vi |
|---|---|---:|---|
| Klook | [Hanoi Photoshoot](https://www.klook.com/en-US/destination/c34-hanoi/1044-photo-shoot/) | **3** mục "things to do" | Bản trang công cụ đọc được lưu đệm từ khoảng 2 tháng trước; bộ lọc danh mục hẹp và có thể phụ thuộc locale/ngày. Không phải toàn bộ tour ảnh trên Klook. |
| Viator | [Hanoi Photography Tours](https://www.viator.com/Hanoi-tours/Photography-Tours/d351-g12-c26028) | **56** kết quả | Bản trang công cụ đọc được lưu đệm từ khoảng 2 tuần trước; danh mục rộng có cả kết quả ngoại vi/không cùng loại photoshoot. Một bản index khác ghi 58, nên không dùng để khẳng định inventory cố định. |
| GetYourGuide | [Danh mục Hanoi](https://www.getyourguide.com/destinations/hanoi-l205/) | **32** photography tours; **27** photoshoots | Chỉ có bản index được crawl khoảng 5 tháng trước. Lượt mở trang hiện tại chuyển về homepage, không thể xác nhận lại count; hai nhánh có thể trùng sản phẩm, **không cộng thành 59**. |
| Airbnb Experiences | [Things to do in Hanoi](https://www.airbnb.com/hanoi-vietnam/things-to-do) | **Chưa xác định** tổng mục liên quan đến ảnh | Trang thành phố có danh mục đa dạng, không công bố một tổng số photography/photowalk rõ trong dữ liệu đọc được. Có [ví dụ Hanoi Cultural Photowalk](https://www.airbnb.com/experiences/302596), nhưng một ví dụ không chứng minh inventory. |

Số listing thay đổi theo ngày, locale, bộ lọc và khả năng đặt; bảng này ghi **giá trị hiển thị của trang**, không phải điều tra đầy đủ tất cả SKU trên mỗi nền tảng. Nguồn Viator gồm tour hướng dẫn khách chụp bằng máy của họ và dịch vụ có người chụp ảnh cho khách: hai nhu cầu khác nhau. Trang Klook cũ trong brief trả lỗi khi Monid đọc, nhưng danh mục photoshoot cụ thể nêu trên đã đọc được bằng tìm kiếm công khai; không coi sự khác nhau đó là dấu hiệu Klook hết dịch vụ.

## 3. Hàm ý cho TravelFrame

1. **Không đặt KPI đánh bại DR của sàn.** Chọn query/use case ngách và trang dịch vụ rõ offer; đo từ Search Console/CRM thay vì so domain authority toàn cầu.
2. **Tách hai loại đối thủ trên trang kết quả:** "photography tour" dạy chụp ảnh khác "photoshoot" có photographer chụp cho khách. TravelFrame cần kiểm tra SERP và intent trước khi dùng keyword hoặc so giá.
3. **Ưu tiên direct booking đã duyệt.** Chỉ nghiên cứu phí hoa hồng, chính sách hủy, lịch và margin của một marketplace sau khi commercial truth, capacity và tracking được chốt.
4. **Chưa có dữ liệu** về organic traffic, backlink count, số booking, doanh thu và thị phần Hà Nội của bốn marketplace trong lượt bổ sung này. Không điền 0 vào các cột đó; không gọi đây là đối chiếu Semrush.

## Nguồn và khả năng lặp lại

- Ahrefs run ID được ghi ở bảng 1; input là target domain và `date=2026-09-28`, endpoint `/site-explorer/domain-rating`, mỗi kết quả một domain. Không lưu credential.
- Bảng 2 dẫn thẳng tới trang danh mục hoặc ví dụ chính thức của từng nền tảng; ngày biên soạn 2026-09-28, tuổi crawl của mỗi nguồn được nêu tại từng dòng. Cần đọc lại chính các danh mục trước quyết định listing hoặc pricing.
- Bản [kế hoạch website từ nghiên cứu đối thủ](../../Marketing-Growth/Plans/2026-09-28-TravelFrame-Competitor-Led-Website-Growth-Plan.md) ở trạng thái Review. Phụ lục này không là phê duyệt đăng bán hoặc chi phí mới.
