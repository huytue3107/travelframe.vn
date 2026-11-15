---
title: Nội dung cho 6 tuyến sản phẩm trong thư viện Viktor (tóm tắt cho Rocky)
owner: Marketing-Growth
status: Draft
created: 2026-11-14
source_library: Marketing-Growth/Content/viktor-travelframe/
scope_decision: Rocky chọn phương án mặc định (chat 14/11/2026)
---

# Nội dung cho 6 tuyến sản phẩm Viktor

Phạm vi Rocky duyệt ngày 14/11/2026: mỗi tuyến sản phẩm có 1 bộ listing copy và 1 bài social (reel hoặc carousel cho Instagram và Facebook), kèm caption, seed comment và `sources.md`. Destination Visuals không làm gói riêng. Tất cả ở trạng thái Draft: chưa đăng, chưa render, chưa sửa site.

Viktor là Viator (Rocky xác nhận 14/11/2026). Listing viết cho Viator. Bảng giá, mục Call to action và dòng ký tên trong listing chỉ dùng cho Google Business Profile và trang dịch vụ, bỏ khi nhập Viator. Không nhập lên Viator khi chưa có duyệt riêng.

## Từng tuyến

| Tuyến | Listing | Bài social | Thư mục |
|---|---|---|---|
| 01 Couple Photo Walk | Private Couple Photo Walk: ban ngày, buổi tối, ăn mặc trang trọng; gợi ý Premium 2h 120 USD, VIP 2h 198 USD | Carousel 6 slide: Day, dusk or dressed up? | [2026-11-14-viktor-couple-photo-walk](2026-11-14-viktor-couple-photo-walk/sources.md) |
| 02 Solo Photo Walk | Solo Traveler Photo Walk: từ 30 USD/1h | Carousel 7 slide: 5 solo travel photos a selfie can't take | [2026-11-14-viktor-solo-photo-walk](2026-11-14-viktor-solo-photo-walk/sources.md) |
| 03 Áo Dài Heritage | Áo Dài Photoshoot bên Hồ Gươm và phố cổ: VIP 2h 198 USD gồm áo dài | Reel: First time in an áo dài? 4 things that make the photos | [2026-11-14-viktor-ao-dai-heritage](2026-11-14-viktor-ao-dai-heritage/sources.md) |
| 04 Friends & Family | Photo Walk cho nhóm bạn và gia đình: +15 USD/người/giờ từ khách thứ 3 (ví dụ 4 khách Premium 2h = 180 USD) | Carousel 7 slide: Someone is always missing from the group photo | [2026-11-14-viktor-friends-family-photo-walk](2026-11-14-viktor-friends-family-photo-walk/sources.md) |
| 05 Làng hương Quảng Phú Cầu | Chụp ở làng hương, cách Hà Nội khoảng 35 km; giá chụp theo tầng giờ, xe và thời lượng để trống | Reel: The red village an hour from Hanoi | [2026-11-14-viktor-incense-village-photoshoot](2026-11-14-viktor-incense-village-photoshoot/sources.md) |
| 06 Fashion Editorial | Fashion Editorial ở phố cổ: chợ Đồng Xuân, cửa cuốn, xe máy, xích lô; gợi ý Premium hoặc VIP | Reel: One dress, three Old Quarter backdrops | [2026-11-14-viktor-fashion-editorial-photoshoot](2026-11-14-viktor-fashion-editorial-photoshoot/sources.md) |
| 07 Destination Visuals | Không làm | Không làm | 7 ảnh poster có chữ (Hà Nội, Sa Pa, Hạ Long, Hà Giang, Ninh Bình, Tam Đảo). Chỉ ảnh Hà Nội (cầu Long Biên) hợp với listing Hà Nội, dùng làm ảnh phụ |

Mỗi thư mục có `listing.md`, bài social (`slides-text.md` hoặc `reel-script.md`), `caption.md`, `seed-comments.md` và `sources.md`. Mọi bài social dùng keyword PHOTO. Mỗi listing có bảng ảnh đề xuất lấy từ thư viện.

## Nhập lên Viator

Tên trường trong giao diện supplier của Viator có thể khác bảng dưới, cần đối chiếu khi nhập. [VERIFY]

| Mục trong `listing.md` | Trường trên Viator |
|---|---|
| Listing title | Tên sản phẩm |
| Summary, Full description | Mô tả tổng quan |
| Highlights | Điểm nổi bật, nếu có trường này |
| What you'll do | Lịch trình |
| Included, Not included | Bao gồm, Không bao gồm |
| Good to know, FAQ | Thông tin thêm |
| Meeting point | Điểm hẹn |
| Pricing | Option và giá: mỗi tầng một option theo số giờ; không ghi giá trong mô tả |
| Ảnh đề xuất | Ảnh sản phẩm: không dùng ảnh trên đường ray, ảnh có chữ overlay hoặc watermark |
| Call to action, dòng ký tên | Bỏ; không đưa link, số điện thoại hay lời mời nhắn ngoài Viator |

## Kết quả check_draft.py (14/11/2026)

Tất cả file đạt `pass` hoặc `flagged` (chỉ còn `[VERIFY]`): 0 lỗi cứng, 0 trùng câu với nguồn ngoài, không file nào có đoạn trong ngoặc kép. Trạng thái bàn giao của cả 6 tuyến: **drafted_flagged**. Phần mô tả gói trong listing giữ nguyên câu chữ của trang /hanoi-photoshoot đã duyệt, để giá và quyền lợi khớp trang live.

## Claim còn [VERIFY]

### Chung cho cả 6 listing

- Điểm hẹn (đang ghi: thường gần Hồ Gươm; tuyến Fashion: trong phố cổ).
- Giá bán trên Viator sau hoa hồng. Listing kit 13/10 ghi hoa hồng OTA thường 20–30%; Rocky quyết giá bán.
- Chính sách mưa, đổi lịch, huỷ (Open P0 legal/payment). Trên Viator, chính sách huỷ chọn trong phần cài đặt sản phẩm.
- Consent của người trong ảnh. README thư viện ghi rõ phân loại không phải consent.

### Riêng từng tuyến

| Tuyến | Còn [VERIFY] |
|---|---|
| Couple | Chỉ phần chung |
| Solo | Chỉ phần chung |
| Áo dài | Size và màu áo dài có sẵn cho VIP; áo dài cho khách thứ 2; chỗ gợi ý thuê áo dài cho Basic và Premium; cách nói người nước ngoài mặc áo dài được đón nhận; mẹo ngồi (kéo vạt sau sang bên) nhờ người trong team xác nhận |
| Friends & Family | Số khách tối đa; trẻ em tính là khách hay miễn phí; makeup, outfit trên Premium, VIP áp dụng cho ai trong nhóm |
| Làng hương | Giá xe khứ hồi; có tính giờ di chuyển vào giờ chụp không; số giờ tối thiểu; thời gian đi khoảng 1 giờ; phí chụp trong sân nhà dân; đón ngoài trung tâm; tour làng nghề trọn ngày (trang tour còn giá cũ); người mẫu là khách hay mẫu, tác giả bộ ảnh |
| Fashion | Credit bộ streetwear (có watermark 102 nhưng chưa rõ người trong ảnh); không gồm stylist, làm tóc, makeup đậm; chỉ dùng cá nhân, chụp cho brand báo giá riêng; chỗ thay đồ; số look trong 2 giờ |

## Ảnh: điểm cần biết

- **Train Street.** Nhiều ảnh couple, solo, áo dài, friends chụp trên đường ray. Mỗi listing có danh sách ảnh không được dùng.
- **Credit 102 Koncept.** Bộ váy đỏ ở chợ Đồng Xuân (tuyến Fashion) khớp bộ Thin, và bộ áo trắng ở cầu Long Biên (tuyến Solo) khớp bộ Hanna. Cả hai đã đăng trên /hanoi-photoshoot, credit Harry Pham / 102 Koncept, Rocky đã đồng ý dùng (D3, 13/11). Không gọi Thin hay Hanna là khách trả tiền khi chưa xác nhận.
- **Friends & Family thiếu ảnh.** Thư viện có 15 ảnh, không có ảnh nhóm từ 3 người, không có ảnh gia đình có trẻ em (trừ 1 ảnh trên đường ray). Cần 1 buổi chụp nhóm có consent trước khi đăng tuyến này.
- **Ảnh có chữ hoặc watermark.** Làng hương 05-1 và 05-13 có chữ in sẵn; ảnh Long Biên của tuyến Solo có chữ overlay; một ảnh streetwear tuyến Fashion có watermark 102. Không dùng các ảnh này trên Viator.

## Bài website (Rocky duyệt viết cả 4 bài, chat 14/11/2026)

Trước đó website đã có bài cho Couple, Solo, Làng hương và 3 bài case Fashion (Thin, Hanna, Wuchr). Chưa có trang cho Áo dài và Friends & Family.

| Bài | Loại | URL đề xuất | Thư mục | Còn [VERIFY] |
|---|---|---|---|---|
| Vietnam Photoshoot Ideas: 6 Styles to Shoot in Hanoi | Bài tổng hợp mới, từ khoá vietnam photoshoot (2.400, KD 0) | `/news/vietnam-photoshoot` | [2026-11-14-vietnam-photoshoot-hub](2026-11-14-vietnam-photoshoot-hub/sources.md) | 2 link tới bài mới chưa đăng; xe đi làng hương; áo dài trong VIP; chính sách mưa |
| Áo Dài Photoshoot in Hanoi | Bài mới | `/news/ao-dai-photoshoot-hanoi` | [2026-11-14-ao-dai-photoshoot-hanoi](2026-11-14-ao-dai-photoshoot-hanoi/sources.md) | Volume từ khoá; mẹo ngồi; cách nói về khách nước ngoài mặc áo dài; size, màu, áo dài cho khách thứ 2, áo dài nam; link bài tổng hợp |
| Family and Group Photoshoot in Hanoi | Bài mới | `/news/family-photoshoot-hanoi` | [2026-11-14-family-photoshoot-hanoi](2026-11-14-family-photoshoot-hanoi/sources.md) | Volume từ khoá; số khách tối đa; trẻ em; makeup, outfit cho nhóm; link bài tổng hợp |
| Sửa giá bài Couple | Bản vá Body cho bài đang chạy | URL giữ nguyên | [2026-11-14-couple-page-price-refresh](2026-11-14-couple-page-price-refresh/Brief.md) Đã đăng 14/11 lúc 16:58 ICT ([Publication.md](2026-11-14-couple-page-price-refresh/Publication.md)); đã gửi index Google và Bing lúc 17:04 |

Thứ tự đăng đề xuất: sửa bài Couple, rồi bài áo dài và bài gia đình, sau cùng bài tổng hợp (để link nội bộ không bị hỏng).

Ảnh: bài áo dài chỉ có ảnh thư viện chưa có consent. Bài gia đình thiếu ảnh nhóm, cần 1 buổi chụp nhóm có consent. Bài tổng hợp đăng được với 3 ảnh Harry đã có trên site nếu ảnh thư viện chưa được duyệt.

## Bài website chuẩn SEO theo từng tuyến (cập nhật 15/11/2026)

Rocky yêu cầu ngày 15/11/2026: mỗi tuyến sản phẩm có một bài web chuẩn SEO. Search Console 3 tháng (12/8 đến 12/11) cho thấy các bài Solo, Làng hương và 3 bài case Fashion đều 0 lượt hiển thị. Vì vậy sửa hoặc đổi tiêu đề các bài này không làm mất thứ hạng nào.

| Tuyến | Bài web | Trạng thái | Từ khoá chính (Google Ads, Mỹ) |
|---|---|---|---|
| 01 Couple | `/news/couple-honeymoon-photoshoot-hanoi-relaxed-candid-guide-2026` | Đã đăng bản sửa giá 14/11 | hanoi couple photoshoot 10 |
| 02 Solo | Làm mới bài đang chạy, giữ URL: [2026-11-15-solo-page-refresh](2026-11-15-solo-page-refresh/Brief.md) | Draft | solo photoshoot 260 |
| 03 Áo dài | Bài mới `/news/ao-dai-photoshoot-hanoi`: [2026-11-14-ao-dai-photoshoot-hanoi](2026-11-14-ao-dai-photoshoot-hanoi/sources.md) | Draft | Không có dữ liệu |
| 04 Friends & Family | Bài mới `/news/family-photoshoot-hanoi`: [2026-11-14-family-photoshoot-hanoi](2026-11-14-family-photoshoot-hanoi/sources.md) | Draft; thiếu ảnh nhóm có consent | Không có dữ liệu |
| 05 Làng hương | Viết lại bài node 68, giữ URL: [2026-11-15-incense-village-page-rewrite](2026-11-15-incense-village-page-rewrite/Brief.md) | Đã đăng 15/11 lúc 10:52 ICT ([hồ sơ](2026-11-15-incense-village-page-rewrite/Publication.md)); đã gửi index Google 10:58, Bing 10:59 | incense village hanoi 390, quang phu cau incense village 320 |
| 06 Fashion | Bài mới `/news/fashion-photoshoot-hanoi`, trang mẹ của 3 bài case: [2026-11-15-fashion-photoshoot-hanoi](2026-11-15-fashion-photoshoot-hanoi/sources.md) | Draft | Chưa có số |
| Bài tổng hợp | `/news/vietnam-photoshoot`: [2026-11-14-vietnam-photoshoot-hub](2026-11-14-vietnam-photoshoot-hub/sources.md) | Draft | vietnam photoshoot 2.400 theo Google Ads, chỉ khoảng 5 theo clickstream (SEO Audit 14/11) |

Điểm chính:

- **Bài Solo từng hiện ghi chú nội bộ cho khách đọc** (mục "Editorial Notes" và câu "No price... is presented as approved commercial truth"). Đã xoá lúc 10:46 ICT ngày 15/11/2026, Rocky duyệt "Xoá ngay": [hồ sơ](2026-11-15-solo-page-refresh/Publication-Quick-Fix.md). Bản làm mới đầy đủ vẫn là Draft.
- **Bài làng hương cũ là bài dựng từ khung chung.** Phần lớn nói về phở, lừa đảo, eSIM, an toàn cho nữ đi một mình. Đây là tuyến có nhu cầu tìm kiếm lớn nhất, nên làm trước.
- Số Google Ads có thể cao hơn nhiều so với lượt tìm thật (ví dụ vietnam photoshoot). Chưa đo clickstream cho các từ khoá trong bảng.
- Ngày 15/11, 3 bài web ngày 14/11 (áo dài, gia đình, tổng hợp) đổi sang chính tả Mỹ cho khớp thị trường Mỹ. Bài tổng hợp có thêm link sang bài Fashion và anchor mới cho bài Solo.

Thứ tự đăng đề xuất: (1) xoá ghi chú nội bộ trên bài Solo (đã làm 15/11); (2) bài làng hương (đã đăng 15/11); (3) bài Solo đầy đủ; (4) bài Fashion, kèm 1 câu link từ 3 bài case; (5) bài áo dài và gia đình; (6) bài tổng hợp. Mỗi bước là sửa site live, cần Rocky duyệt.

## Rocky cần quyết trước khi đăng

1. Giá bán trên Viator sau hoa hồng, và cách chia option (mỗi tầng một option theo số giờ).
2. Gói làng hương: giá xe, số giờ tối thiểu, có tính giờ di chuyển không.
3. Nhóm: số khách tối đa, giá trẻ em.
4. Consent cho các bộ ảnh ngoài Thin và Hanna.
