# Research Snapshot: Giá "Hanoi photo tour" trên Klook và Viator

- **Ngày chụp:** 2026-11-18 (giờ US locale, đơn vị USD)
- **Phòng ban:** Research-Insights
- **Trạng thái:** Research snapshot (không phải quyết định giá)
- **Cách thu thập:** Pilot Jev Ultrafast + code đọc trang kết quả tìm kiếm công khai, không đăng nhập
  (xem [runbook](../../Technology-Automation/Runbooks/2026-11-18-Jev-Ultrafast-Browser-Agent-Runbook.md)).
- **Dữ liệu thô:** `2026-11-18-jev-price-pilot/raw/` (`klook-search.json`, `viator-search.json`, `viator-en.json`)
- **Phạm vi:** Klook trang 1/2 của 25 kết quả; Viator trang 1 = 24/200+ kết quả.
  Giá là giá "from" do nền tảng hiển thị; chưa mở từng trang chi tiết để kiểm tra số khách/giờ.

## 1. Tour có yếu tố chụp ảnh/thợ ảnh

### Viator

| Sản phẩm | Thời lượng | Giá from | Rating (review) | Ghi chú |
|---|---|---|---|---|
| Hanoi Street Photography with a Pro – Phone & Camera | 2h30 | $35 | 4.9 (40) | Học chụp |
| Private Hanoi Photoshoot – Iconic Spots & Hidden Gems | 2h | $40 | 4.8 (21) | Gần nhất với mô hình TravelFrame |
| Cultural Hanoi Photo Walk – Street Photography Tour | 2h | $50 | 5.0 (7) | Giá đổi theo số khách |
| Experience Hanoi with a photographer | — | $65 | 5.0 (2) | Mục quảng bá |
| Hanoi Train Street & Hidden Streets Private Photoshoot | — | $66/nhóm | — | Mục quảng bá |
| Hanoi Old Quarter & Hoàn Kiếm Lake Photoshoot | — | $66/nhóm | — | Mục quảng bá |
| Hanoi Old Quarter Private Walking Tour and Photoshoot | 2h | $86/nhóm | chưa có review | |
| Hanoi Explorer Photo Tour (Vietnam in Focus) | 4h, 5:30 sáng | $125 | 4.9 (41) | Tối đa 5 khách, đón khách sạn, dạy chụp |
| Hanoi by Night Photo Tour | 4h | $125 | 5.0 (4) | |
| Hanoi by dawn Photo Tour | 4h30 | $135 | 5.0 (9) | |
| Hanoi On the Tracks Photo Tour | 4h | $151 | 4.9 (34) | |
| Ultimate Quang Phu Cau Photo Experience | — | $189 | 4.9 (13) | Mục quảng bá |
| Ninh Binh Photo Explorer | — | $305 | 5.0 (6) | Mục quảng bá |

Mục "quảng bá" là khối "Explore our promoted experiences" trên trang Hanoi Explorer Photo Tour.
Viator ghi rõ họ hưởng hoa hồng cao hơn với các mục này.

### Klook

| Sản phẩm | Giá | Rating (review) • đã đặt | Ghi chú |
|---|---|---|---|
| Ao Dai Rental & Professional Photoshoot in Hanoi Old Quarter | $12.85 | 4.8 (78) • 800+ | Áo dài + chụp |
| Royal Vietnamese Costume Rental & Professional Photoshoot | $21.89 | 5.0 (5) • mới | |
| Instagram Incense Quang Phu Cau Village Tour & Train Street | $24.25 | 4.9 (902) • 8K+ | Klook's choice, private |
| Hanoi Instagram Private Tour by Motorbike or Car | from $35.39 | 4.9 (1.1K) • 6K+ | Klook's choice |
| Hanoi in Frames: Hot Spots around Hoan Kiem Lake (Ao Dai option) | $41.29 | 5.0 (3) | |
| Hanoi Instagram Vintage Jeep Tour with Photographer | from $52.75 | 4.9 (45) • 100+ | Klook's choice |
| Hanoi City Photography Guide Tours | $161.69 | — | 3–5h |
| Ultimate Hanoi Photography Guide Tour | $639.40 | — | |

Kết quả còn lại trên trang (city tour, Ninh Bình, Sapa, e-bike) không phải tour ảnh nên không đưa vào bảng.

## 2. So với bảng giá TravelFrame đang Approved

Bảng giá theo giờ (DEC-20261021-HOURLY-TIER-PRICING): Basic $30/giờ · Premium $60/giờ (tối thiểu 2h) ·
VIP $99/giờ (tối thiểu 2h).

| Gói TravelFrame 2 giờ | Giá | Đối thủ tương đương trên marketplace |
|---|---|---|
| Basic 2h | $60 | Photoshoot riêng 2h: $40–86 (Viator) |
| Premium 2h | $120 | Tour ảnh 4h có thợ dẫn: $125–151 (Viator) |
| VIP 2h | $198 | Chỉ "Ultimate Quang Phu Cau" ($189) và gói Ninh Bình ($305) cao hơn |

## 3. Nhận định

1. **Hai mặt bằng giá khác nhau.** Klook bán khối lượng lớn ở mức $12–35 (gói "Instagram" và thuê
   áo dài kèm chụp, 6K–8K lượt đặt). Viator định vị tour ảnh có thợ dẫn ở mức $125–151 cho 4 giờ.
   Đây là hai nhóm khách khác nhau.
2. **Basic 2h ($60) nằm trong khoảng photoshoot riêng 2h trên Viator ($40–86).** Premium 2h ($120) đắt hơn
   các photoshoot 2h nhưng ngang tour 4h. Giá Premium chỉ đứng được nếu khách thấy rõ phần cộng thêm
   (trang điểm, video recap, Polaroid).
3. **VIP 2h ($198) gần như cao nhất thị trường cho 2 giờ.** Lợi thế cần nêu bật là trang phục,
   video dài và 30 ảnh chỉnh/giờ.
4. **Chủ đề bán chạy trùng với nội dung TravelFrame:** Train Street, làng hương Quảng Phú Cầu,
   áo dài, chụp sáng sớm và ban đêm. Có thể đóng gói thành tour theo chủ đề để so sánh trực tiếp.
5. **Mô hình "giá theo nhóm"** ($66–86/nhóm) đang có trên Viator. TravelFrame tính tối đa 2 khách
   trong giá gói, nên cần ghi rõ điều này khi lên marketplace.

## 4. Giới hạn

- Snapshot 1 thời điểm, 1 locale (US), chưa đọc trang chi tiết từng sản phẩm, trừ Hanoi Explorer Photo Tour.
- Giá "from" có thể là giá/người hoặc giá/nhóm tùy sản phẩm.
- Chưa có GetYourGuide, Airbnb Experiences.
