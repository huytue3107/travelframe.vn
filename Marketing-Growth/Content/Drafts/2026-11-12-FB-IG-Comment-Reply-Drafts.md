# Draft trả lời 38 comment ưu tiên — FB + IG (12/11/2026)

- Ngày lập: 2026-11-12 · Cập nhật: 2026-11-12 (thêm link website + UTM) · Owner: Marketing-Growth · Trạng thái: **Approved** (Rocky "Duyệt cả 38", 12/11/2026) · **38/38 Published**.
- Nguồn danh sách: [Data-Analytics/Reports/2026-11-12-FB-IG-New-Comments-Scan.md](../../../Data-Analytics/Reports/2026-11-12-FB-IG-New-Comments-Scan.md) — nhóm 1 (lead Food/Map) và nhóm 2 (câu hỏi / lên lịch đi).
- Văn phong: [Voice and Style Guide](../../../Brand-Strategy/2026-10-22-TravelFrame-Voice-And-Style-Guide.md) mục Comment/DM. Phần chữ của mỗi reply tối đa 2 câu, dưới 200 ký tự (không tính link), tối đa 1 emoji, không hashtag, không giá.
- Link: theo [UTM Tagging Guide](../../Guidelines/2026-10-03-TravelFrame-UTM-Tagging-Guide.md). Link đứng riêng một dòng, không dính emoji hay dấu câu. **Comment Instagram không chèn link** vì link không bấm được.
- Script đã kiểm tra tự động: 38 reply đạt chuẩn văn phong, không reply nào trùng nhau. Cả 15 reply FB đều có link web, không reply IG nào có link, mọi link trong DM đứng riêng dòng và có UTM. 9 trang web đích đều trả HTTP 200 ngày 12/11/2026.
- Thay thế các draft cũ "Pending Rocky Approval" #96–#101, #106 trong [Meta-Messenger-All-Interactions-Log.md](../Meta-Messenger-All-Interactions-Log.md). Các draft cũ đó dài hơn, nhiều emoji, có giá — chưa từng đăng.

## Kết quả thực hiện (12/11/2026)

- Đợt 1 (Graph API): đăng 27 reply (IG 23, FB 4) và gửi 19 DM Instagram. Đã đọc lại từng ID trên nền tảng: nội dung khớp bản duyệt, đứng tên Page/@travelframe.vn.
- 11 mục FB có DM (#14, #15, #19, #24–#28, #34–#36): token thiếu `pages_messaging` nên gửi private reply qua **Business Suite trên trình duyệt** (12/11/2026, 09:46–09:57 ICT), rồi đăng 11 reply công khai qua API. Tab Messenger có đúng 11 cuộc chat mới (DM-A 2, DM-B 1, DM-C 5, DM-D 3).
- ⚠️ **#25 bị gửi DM 2 lần.** Sau khi gửi, Meta bật hộp gợi ý "Automatically reply to comments with a private message", và nút dưới comment không đổi sang "See Chat". Agent tưởng chưa gửi nên gửi lại. Khung chat Messenger nhỏ không có tuỳ chọn thu hồi tin. Các mục sau đó gửi đúng 1 lần, kiểm tra bằng số bong bóng tin trong khung chat.
- Hộp gợi ý automation hiện nhiều lần và đều được đóng bằng Cancel. Đã kiểm tra trang Automations: không có automation mới, chỉ có "Comment to message – HANOI/Hanoi" và "FAQ" từ trước.
- ID reply và DM đã ghi vào [Meta-Messenger-All-Interactions-Log.md](../Meta-Messenger-All-Interactions-Log.md), STT #107–#144.
- DM-A được rút gọn 2 dòng dẫn để vừa giới hạn 1000 byte của Instagram (từ 1024 xuống 986 byte). Link và nội dung giữ nguyên.

## Cách link kéo traffic về website

| Kênh | Vị trí link | Số lượng |
|---|---|---|
| Facebook reply công khai | 1 link bấm được ngay dưới câu trả lời. Người khác đọc comment cũng bấm được | 15 reply |
| Facebook DM (private reply) | 2–3 link: bản đồ/bài địa điểm + food + photo | 11 DM |
| Instagram reply công khai | Không có link. Câu trả lời nhắc khách mở DM ("walking map", "photo ideas", "food map") | 23 reply |
| Instagram DM | 2–3 link như DM Facebook | 19 DM |

UTM: `utm_source` = `facebook` / `instagram` · `utm_medium` = `comment_reply` (reply FB công khai) / `dm` · `utm_campaign` = reel (`hang_ma_xmas`, `dong_tac_thrift`, `ngan_chay_toi`, `bit_tet`, `oq_food_pov`, `hanoi_guide`) · `utm_content` = bài đích. Đặt campaign theo reel để GA4 cho biết reel nào kéo traffic. Lưu ý: link food map trong thư viện UTM cũ dùng `utm_campaign=food_map`, nên khi lọc GA4 cần gộp cả hai.

Trang đích và số lần xuất hiện (reply FB + DM):

| Key | Trang | Lượt |
|---|---|---|
| `hang_ma_article` | [Hang Ma Street: Lanterns, Festivals & Paper Crafts](https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital) | 16 |
| `oq_walking_map` | [Hanoi Old Quarter Guide + bản đồ đi bộ PDF](https://travelframe.sidevn.com/news/hanoi-old-quarter-guide) | 13 |
| `oq_photoshoot` | [Old Quarter photoshoot — Dong Xuan Market](https://travelframe.sidevn.com/news/hanoi-old-quarter-photoshoot-harry-thin) | 12 |
| `street_style_photo` | [Hanoi Street Style Photoshoot](https://travelframe.sidevn.com/news/hanoi-street-style-photoshoot-harry-hanna) | 6 |
| `food_map` | [Hanoi Secret Food Map (PDF, 6 spots)](https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map) | 23 |
| `street_food_guide` | [Honest Hanoi Street Food Guide 2026](https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local) | 15 |
| `st_joseph` | [St. Joseph's Cathedral — best light, mass times](https://travelframe.sidevn.com/news/st-josephs-cathedral) | 11 |
| `photo_spots` | [15 Best Photo Spots in Hanoi](https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026) | 4 |
| `complete_guide` | [Complete Hanoi Travel Guide 2026](https://travelframe.sidevn.com/news/complete-hanoi-travel-guide-2026-what-do-eat-and-know-you-arrive) | 0 |

## Cách đăng sau khi duyệt

1. **Gửi DM trước, reply công khai sau.** 30/38 reply nói "sent to your DMs", nên chỉ đăng reply khi DM đã đi thật.
2. Facebook: DM bằng Private Reply theo comment ID (`send_facebook_private_reply`). Meta chỉ cho private reply **trong 7 ngày** kể từ lúc comment, nên comment ngày 10/11 hết hạn ngày 17/11. Reply công khai FB gửi phần chữ và link cách nhau bằng xuống dòng (`\n`), đúng như cột "Reply đề xuất".
3. Instagram: MCP automation chưa có tool DM cho Instagram. Gửi DM qua Business Suite/Orca như các lần trước, rồi đăng reply bằng `reply_instagram_comment`.
4. Giãn cách khoảng 2 giây giữa các lần gọi API, và ghi kết quả vào interactions log.
5. 8 reply không kèm DM: đăng thẳng. 3 reply IG (#11, #13, #38) hỏi khách có muốn nhận guide không; nếu khách đồng ý thì gửi DM-A hoặc DM-F.

## Mẫu DM (6)

Mỗi mẫu có 2 bản vì UTM khác nhau theo nền tảng. Phần chữ giống nhau.

### DM-A: Hàng Mã — pin + 3 spots nearby + map/photo — dùng cho 12 comment

<details><summary>Bản Facebook (utm_source=facebook)</summary>

```text
Hi! Here's the Hang Ma Street pin:
https://maps.google.com/?q=Hang+Ma+Street,+Hanoi

3 spots nearby, all a short walk:
1. Dong Xuan Market
2. O Quan Chuong, the last old city gate
3. Bach Ma Temple

Go on a weekday before dinner and walk on the shop side, then loop back after dark for the lights.

How Hang Ma changes from Mid-Autumn to Tết:
https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital?utm_source=facebook&utm_medium=dm&utm_campaign=hang_ma_xmas&utm_content=hang_ma_article

Our Old Quarter guide with a free walking map:
https://travelframe.sidevn.com/news/hanoi-old-quarter-guide?utm_source=facebook&utm_medium=dm&utm_campaign=hang_ma_xmas&utm_content=oq_walking_map

Want to be in the photos too? A photo walk around Dong Xuan Market:
https://travelframe.sidevn.com/news/hanoi-old-quarter-photoshoot-harry-thin?utm_source=facebook&utm_medium=dm&utm_campaign=hang_ma_xmas&utm_content=oq_photoshoot

TravelFrame — your local friend in Hanoi
```

</details>

<details><summary>Bản Instagram (utm_source=instagram)</summary>

```text
Hi! Here's the Hang Ma Street pin:
https://maps.google.com/?q=Hang+Ma+Street,+Hanoi

3 spots nearby, all a short walk:
1. Dong Xuan Market
2. O Quan Chuong, the last old city gate
3. Bach Ma Temple

Go on a weekday before dinner and walk on the shop side, then loop back after dark for the lights.

How Hang Ma changes from Mid-Autumn to Tết:
https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital?utm_source=instagram&utm_medium=dm&utm_campaign=hang_ma_xmas&utm_content=hang_ma_article

Our Old Quarter guide with a free walking map:
https://travelframe.sidevn.com/news/hanoi-old-quarter-guide?utm_source=instagram&utm_medium=dm&utm_campaign=hang_ma_xmas&utm_content=oq_walking_map

Want to be in the photos too? A photo walk around Dong Xuan Market:
https://travelframe.sidevn.com/news/hanoi-old-quarter-photoshoot-harry-thin?utm_source=instagram&utm_medium=dm&utm_campaign=hang_ma_xmas&utm_content=oq_photoshoot

TravelFrame — your local friend in Hanoi
```

</details>

### DM-B: Chợ Đông Tác — pin + photo/food — dùng cho 5 comment

<details><summary>Bản Facebook (utm_source=facebook)</summary>

```text
Here's the pin for Dong Tac Market (Chợ Đông Tác):
https://maps.google.com/?q=Cho+Dong+Tac,+Kim+Lien,+Hanoi

It's about a 15–20 minute ride from the city centre. Give it a few hours and come ready to bargain.

Found a great jacket? Here's what a street style photo walk in Hanoi looks like:
https://travelframe.sidevn.com/news/hanoi-street-style-photoshoot-harry-hanna?utm_source=facebook&utm_medium=dm&utm_campaign=dong_tac_thrift&utm_content=street_style_photo

Hungry after? Our free Hanoi food map:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=dm&utm_campaign=dong_tac_thrift&utm_content=food_map

TravelFrame — your local friend in Hanoi
```

</details>

<details><summary>Bản Instagram (utm_source=instagram)</summary>

```text
Here's the pin for Dong Tac Market (Chợ Đông Tác):
https://maps.google.com/?q=Cho+Dong+Tac,+Kim+Lien,+Hanoi

It's about a 15–20 minute ride from the city centre. Give it a few hours and come ready to bargain.

Found a great jacket? Here's what a street style photo walk in Hanoi looks like:
https://travelframe.sidevn.com/news/hanoi-street-style-photoshoot-harry-hanna?utm_source=instagram&utm_medium=dm&utm_campaign=dong_tac_thrift&utm_content=street_style_photo

Hungry after? Our free Hanoi food map:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=instagram&utm_medium=dm&utm_campaign=dong_tac_thrift&utm_content=food_map

TravelFrame — your local friend in Hanoi
```

</details>

### DM-C: Minh Thu (ngan cháy tỏi) + food/photo — dùng cho 9 comment

<details><summary>Bản Facebook (utm_source=facebook)</summary>

```text
Here's the garlic duck spot: Minh Thu, 31 Ly Quoc Su, near St. Joseph's Cathedral:
https://maps.google.com/?q=Minh+Thu,+31+Ly+Quoc+Su,+Hanoi

Go early, and bring a friend. One plate is meant for sharing.

More spots on our free Hanoi food map:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=dm&utm_campaign=ngan_chay_toi&utm_content=food_map

How to eat on the sidewalk like a local:
https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=facebook&utm_medium=dm&utm_campaign=ngan_chay_toi&utm_content=street_food_guide

The cathedral is a short walk away. Here's when the light is best for photos:
https://travelframe.sidevn.com/news/st-josephs-cathedral?utm_source=facebook&utm_medium=dm&utm_campaign=ngan_chay_toi&utm_content=st_joseph

TravelFrame — your local friend in Hanoi
```

</details>

<details><summary>Bản Instagram (utm_source=instagram)</summary>

```text
Here's the garlic duck spot: Minh Thu, 31 Ly Quoc Su, near St. Joseph's Cathedral:
https://maps.google.com/?q=Minh+Thu,+31+Ly+Quoc+Su,+Hanoi

Go early, and bring a friend. One plate is meant for sharing.

More spots on our free Hanoi food map:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=instagram&utm_medium=dm&utm_campaign=ngan_chay_toi&utm_content=food_map

How to eat on the sidewalk like a local:
https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=instagram&utm_medium=dm&utm_campaign=ngan_chay_toi&utm_content=street_food_guide

The cathedral is a short walk away. Here's when the light is best for photos:
https://travelframe.sidevn.com/news/st-josephs-cathedral?utm_source=instagram&utm_medium=dm&utm_campaign=ngan_chay_toi&utm_content=st_joseph

TravelFrame — your local friend in Hanoi
```

</details>

### DM-D: Bít tết (5 Nguyễn Trung Trực) + food/photo — dùng cho 3 comment

<details><summary>Bản Facebook (utm_source=facebook)</summary>

```text
Here's the bít tết spot: 5 Nguyen Trung Truc, Ba Dinh:
https://maps.google.com/?q=5+Nguyen+Trung+Truc,+Ba+Dinh,+Hanoi

Mix everything before your first bite, then use the bread for the sauce.

The other spots we actually eat at, on our free food map:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=dm&utm_campaign=bit_tet&utm_content=food_map

How to eat on the sidewalk like a local:
https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=facebook&utm_medium=dm&utm_campaign=bit_tet&utm_content=street_food_guide

Walking it off after? 15 photo spots with the best light and timing:
https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026?utm_source=facebook&utm_medium=dm&utm_campaign=bit_tet&utm_content=photo_spots

TravelFrame — your local friend in Hanoi
```

</details>

<details><summary>Bản Instagram (utm_source=instagram)</summary>

```text
Here's the bít tết spot: 5 Nguyen Trung Truc, Ba Dinh:
https://maps.google.com/?q=5+Nguyen+Trung+Truc,+Ba+Dinh,+Hanoi

Mix everything before your first bite, then use the bread for the sauce.

The other spots we actually eat at, on our free food map:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=instagram&utm_medium=dm&utm_campaign=bit_tet&utm_content=food_map

How to eat on the sidewalk like a local:
https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=instagram&utm_medium=dm&utm_campaign=bit_tet&utm_content=street_food_guide

Walking it off after? 15 photo spots with the best light and timing:
https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026?utm_source=instagram&utm_medium=dm&utm_campaign=bit_tet&utm_content=photo_spots

TravelFrame — your local friend in Hanoi
```

</details>

### DM-E: Food map chung + food/photo — dùng cho 1 comment

<details><summary>Bản Facebook (utm_source=facebook)</summary>

```text
Here's our free Hanoi food map with the spots we actually eat at:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=dm&utm_campaign=oq_food_pov&utm_content=food_map

What to order and where to sit, dish by dish:
https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=facebook&utm_medium=dm&utm_campaign=oq_food_pov&utm_content=street_food_guide

And 15 photo spots for between meals:
https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026?utm_source=facebook&utm_medium=dm&utm_campaign=oq_food_pov&utm_content=photo_spots

Tell us where you're staying and we'll point you to what's closest.

TravelFrame — your local friend in Hanoi
```

</details>

<details><summary>Bản Instagram (utm_source=instagram)</summary>

```text
Here's our free Hanoi food map with the spots we actually eat at:
https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=instagram&utm_medium=dm&utm_campaign=oq_food_pov&utm_content=food_map

What to order and where to sit, dish by dish:
https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=instagram&utm_medium=dm&utm_campaign=oq_food_pov&utm_content=street_food_guide

And 15 photo spots for between meals:
https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026?utm_source=instagram&utm_medium=dm&utm_campaign=oq_food_pov&utm_content=photo_spots

Tell us where you're staying and we'll point you to what's closest.

TravelFrame — your local friend in Hanoi
```

</details>

### DM-F: Hanoi guide — chỉ gửi khi khách trả lời muốn nhận — dùng cho 0 comment

<details><summary>Bản Facebook (utm_source=facebook)</summary>

```text
Here's our complete Hanoi guide: where to stay, what to eat and what to know before you land:
https://travelframe.sidevn.com/news/complete-hanoi-travel-guide-2026-what-do-eat-and-know-you-arrive?utm_source=facebook&utm_medium=dm&utm_campaign=hanoi_guide&utm_content=complete_guide

Our Old Quarter guide with a free walking map:
https://travelframe.sidevn.com/news/hanoi-old-quarter-guide?utm_source=facebook&utm_medium=dm&utm_campaign=hanoi_guide&utm_content=oq_walking_map

15 photo spots with the best light and timing:
https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026?utm_source=facebook&utm_medium=dm&utm_campaign=hanoi_guide&utm_content=photo_spots

TravelFrame — your local friend in Hanoi
```

</details>

<details><summary>Bản Instagram (utm_source=instagram)</summary>

```text
Here's our complete Hanoi guide: where to stay, what to eat and what to know before you land:
https://travelframe.sidevn.com/news/complete-hanoi-travel-guide-2026-what-do-eat-and-know-you-arrive?utm_source=instagram&utm_medium=dm&utm_campaign=hanoi_guide&utm_content=complete_guide

Our Old Quarter guide with a free walking map:
https://travelframe.sidevn.com/news/hanoi-old-quarter-guide?utm_source=instagram&utm_medium=dm&utm_campaign=hanoi_guide&utm_content=oq_walking_map

15 photo spots with the best light and timing:
https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026?utm_source=instagram&utm_medium=dm&utm_campaign=hanoi_guide&utm_content=photo_spots

TravelFrame — your local friend in Hanoi
```

</details>

Ghi chú DM:
- DM-A: 3 điểm gần Hàng Mã (chợ Đồng Xuân, Ô Quan Chưởng, đền Bạch Mã) là landmark phố cổ, không ghi khoảng cách. Bài photo walk của Thin chụp ở chợ Đồng Xuân, nên khớp với điểm số 1.
- DM-D: caption bài bít tết không ghi địa chỉ. "5 Nguyễn Trung Trực, Ba Đình" lấy từ các reply trước của Page. **[VERIFY]** nếu chưa chắc đúng quán trong video.
- Link Google Maps là link tìm kiếm, không có UTM vì không về website.

## 38 reply đề xuất

### Hàng Mã Christmas (18)

| # | Kênh | Giờ comment (ICT) | Comment | Reply đề xuất | Ký tự (không tính link) | Link web | DM | Comment ID | Ghi chú | Duyệt |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | IG | 11-11 00:31 | Map | Just sent the Hang Ma pin + 3 spots nearby to your DMs. Check message requests if it's not in your main inbox 🎄 | 112 | — | DM-A | `18118575080024320` |  | ✅ Đã đăng |
| 2 | IG | 11-11 03:33 | Map | It's in your DMs: the pin, 3 nearby stops and our free Old Quarter walking map. | 79 | — | DM-A | `18653425198062420` |  | ✅ Đã đăng |
| 3 | IG | 11-11 11:14 | MAP | Sent! Go on a weekday before dinner, then loop back once it's dark. | 67 | — | DM-A | `17882299287651667` |  | ✅ Đã đăng |
| 4 | IG | 11-11 14:10 | Map | Check your DMs for the pin and 3 spots nearby. Walk on the shop side once it gets busy. | 87 | — | DM-A | `17928133224427757` |  | ✅ Đã đăng |
| 5 | IG | 11-11 19:28 | Map👏 | Pin's on its way to your inbox, plus a guide to how the street changes for Tết. | 79 | — | DM-A | `18494613298104494` |  | ✅ Đã đăng |
| 6 | IG | 11-11 23:14 | MAP | Done, the Hang Ma pin and 3 nearby spots are in your DMs. | 57 | — | DM-A | `17954892390293316` |  | ✅ Đã đăng |
| 7 | IG | 11-12 01:21 | Map | Sent to your DMs. Are you visiting before Christmas or after? | 61 | — | DM-A | `18118211603023776` |  | ✅ Đã đăng |
| 8 | IG | 11-12 06:06 | Map | In your DMs now, with a few photo ideas for the area. Daytime shopping or night lights? | 87 | — | DM-A | `18004569360011631` |  | ✅ Đã đăng |
| 9 | IG | 11-12 08:45 | Map | Just DM'd you the pin. It's right in the Old Quarter, so it's easy to pair with dinner nearby. | 94 | — | DM-A | `17930579607672105` |  | ✅ Đã đăng |
| 10 | IG | 11-11 15:18 | Map! When does this usually begin? | The decorations are already up and stay until Christmas. Just sent the pin + 3 spots nearby to your DMs. | 104 | — | DM-A | `18361452712268426` |  | ✅ Đã đăng |
| 11 | IG | 11-11 04:43 | Jan | January works too! The street usually switches to red and gold for Tết by then, want our Hang Ma guide in your DMs? | 115 | — | — | `18129242092669578` | Câu trả lời mùa vụ, ghi "usually". Nếu khách đồng ý → gửi DM-A. | ✅ Đã đăng |
| 12 | IG | 11-11 17:41 | HCM doesn’t hv that? | Saigon gets into Christmas too, especially around Notre-Dame Cathedral and the parish neighborhoods in Go Vap. Hang Ma is Hanoi's street for buying the decorations. | 164 | — | — | `18351734971265924` |  | ✅ Đã đăng |
| 13 | IG | 11-12 05:47 | Nov.29! See u 🔜 ✨❣️ | See you soon! Want us to DM you the Hang Ma pin + 3 spots nearby for your first evening? | 88 | — | — | `18025945709868826` | Khách tới 29/11 — lead ấm cho PHOTO. Nếu đồng ý → gửi DM-A. | ✅ Đã đăng |
| 14 | FB | 11-11 00:10 | Map | Sent to your Messenger: the Hang Ma pin + 3 spots nearby 🎄 How the street changes from Mid-Autumn to Tết:<br>`https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital?utm_source=facebook&utm_medium=comment_reply&utm_campaign=hang_ma_xmas&utm_content=hang_ma_article` | 106 | hang_ma_article | DM-A | `122127243195479755_999347105935609` | Đã có người khác trả lời "Hàng Mã street" — vẫn gửi DM như CTA hứa. | ✅ Đã đăng |
| 15 | FB | 11-11 06:41 | Map | Check Messenger for the pin and 3 nearby stops. Our Old Quarter walking map is free here:<br>`https://travelframe.sidevn.com/news/hanoi-old-quarter-guide?utm_source=facebook&utm_medium=comment_reply&utm_campaign=hang_ma_xmas&utm_content=oq_walking_map` | 89 | oq_walking_map | DM-A | `122127243195479755_1683386806760478` | Đã có người khác trả lời "Hàng Mã street". | ✅ Đã đăng |
| 16 | FB | 11-11 02:27 | When does it start happening, Soon or now ? | It's already up and stays until Christmas, and weekday evenings before dinner are easiest. More on the street here:<br>`https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital?utm_source=facebook&utm_medium=comment_reply&utm_campaign=hang_ma_xmas&utm_content=hang_ma_article` | 115 | hang_ma_article | — | `122127243195479755_1435891618654953` |  | ✅ Đã đăng |
| 17 | FB | 11-11 22:24 | Ở đâu vậy bạn | Phố Hàng Mã, ngay trong phố cổ Hà Nội nha bạn. Đi chiều ngày thường trước giờ ăn tối sẽ đỡ đông, xem thêm ở đây:<br>`https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital?utm_source=facebook&utm_medium=comment_reply&utm_campaign=hang_ma_xmas&utm_content=hang_ma_article` | 112 | hang_ma_article | — | `122127243195479755_4558839847707312` | Khách Việt — trả lời tiếng Việt (bài web bằng tiếng Anh). | ✅ Đã đăng |
| 18 | FB | 11-11 23:56 | We get into Hanoi on 27th December, will this still be there? | The Christmas stock usually thins out after the 25th, and the street moves on to New Year and Tết decorations. Here's how it changes through the year:<br>`https://travelframe.sidevn.com/news/hang-ma-street-cultural-breath-heart-capital?utm_source=facebook&utm_medium=comment_reply&utm_campaign=hang_ma_xmas&utm_content=hang_ma_article` | 150 | hang_ma_article | — | `122127243195479755_2238272787098411` | Khách có ngày tới 27/12. | ✅ Đã đăng |

### Chợ Đông Tác (thrift) (5)

| # | Kênh | Giờ comment (ICT) | Comment | Reply đề xuất | Ký tự (không tính link) | Link web | DM | Comment ID | Ghi chú | Duyệt |
|---|---|---|---|---|---|---|---|---|---|---|
| 19 | FB | 11-10 15:42 | Map | Sent the Dong Tac Market pin to your Messenger, come ready to bargain! If you want photos in your new finds, here's a street style photo walk:<br>`https://travelframe.sidevn.com/news/hanoi-street-style-photoshoot-harry-hanna?utm_source=facebook&utm_medium=comment_reply&utm_campaign=dong_tac_thrift&utm_content=street_style_photo` | 142 | street_style_photo | DM-B | `122127024621479755_2017964102918481` | Thay draft cũ #99 trong log. | ✅ Đã đăng |
| 20 | IG | 11-10 14:12 | Map | Just sent the Cho Dong Tac pin to your DMs. Give yourself a few hours, the racks go all the way to the roof. | 108 | — | DM-B | `18077184863742254` | Thay draft cũ #96. | ✅ Đã đăng |
| 21 | IG | 11-10 21:32 | Map | Pin's in your DMs! Are you hunting for jackets or denim? | 56 | — | DM-B | `17981260719005471` | Thay draft cũ #106. | ✅ Đã đăng |
| 22 | IG | 11-11 03:19 | MAP | Sent! It's about a 15–20 minute ride from the city centre, and the pin is in your DMs. | 86 | — | DM-B | `18100818086531042` |  | ✅ Đã đăng |
| 23 | IG | 11-11 15:27 | Map | In your DMs now, plus our food map for after. Bargaining is part of the fun here 🛍️ | 84 | — | DM-B | `18351814570253111` |  | ✅ Đã đăng |

### Ngan cháy tỏi — Minh Thu (10)

| # | Kênh | Giờ comment (ICT) | Comment | Reply đề xuất | Ký tự (không tính link) | Link web | DM | Comment ID | Ghi chú | Duyệt |
|---|---|---|---|---|---|---|---|---|---|---|
| 24 | FB | 11-10 15:35 | Food | Sent the Minh Thu pin to your Messenger, go early if you can. Our free Hanoi food map is here too:<br>`https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=comment_reply&utm_campaign=ngan_chay_toi&utm_content=food_map` | 98 | food_map | DM-C | `122127020193479755_3401584906699295` | Thay draft cũ #98. | ✅ Đã đăng |
| 25 | FB | 11-10 22:50 | Food | Check your inbox for our food map. The duck spot is right by the cathedral, and here's when to see it at its best:<br>`https://travelframe.sidevn.com/news/st-josephs-cathedral?utm_source=facebook&utm_medium=comment_reply&utm_campaign=ngan_chay_toi&utm_content=st_joseph` | 114 | st_joseph | DM-C | `122127020193479755_1129353180077798` |  | ✅ Đã đăng |
| 26 | FB | 11-11 01:29 | Food | Food map's in your Messenger, and if you're making a food day of it, start with this guide:<br>`https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=facebook&utm_medium=comment_reply&utm_campaign=ngan_chay_toi&utm_content=street_food_guide` | 91 | street_food_guide | DM-C | `122127020193479755_965869276241202` |  | ✅ Đã đăng |
| 27 | FB | 11-11 06:53 | Food | Sent! The duck spot pin is in your inbox, and the full food map is here:<br>`https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=comment_reply&utm_campaign=ngan_chay_toi&utm_content=food_map` | 72 | food_map | DM-C | `122127020193479755_1314056674179178` |  | ✅ Đã đăng |
| 28 | FB | 11-11 13:26 | Food | Just sent it to your Messenger 🦆 After lunch, the cathedral is a short walk away:<br>`https://travelframe.sidevn.com/news/st-josephs-cathedral?utm_source=facebook&utm_medium=comment_reply&utm_campaign=ngan_chay_toi&utm_content=st_joseph` | 82 | st_joseph | DM-C | `122127020193479755_1895528004653121` |  | ✅ Đã đăng |
| 29 | FB | 11-12 03:28 | Hello | Hi there! The duck spot is Minh Thu on Ly Quoc Su, and our free Hanoi food map is here:<br>`https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=comment_reply&utm_campaign=ngan_chay_toi&utm_content=food_map` | 87 | food_map | — | `122127020193479755_1505974371346732` | Khách chỉ chào — trả lời thẳng kèm link, không gửi DM. | ✅ Đã đăng |
| 30 | IG | 11-10 14:39 | Food | Sent the Minh Thu pin + our Hanoi food map to your DMs 🦆 | 57 | — | DM-C | `18137119027784458` | Thay draft cũ #97. | ✅ Đã đăng |
| 31 | IG | 11-10 19:44 | 보내주세요 | DM으로 보내드렸어요! The Minh Thu pin and our Hanoi food map are in your inbox. | 71 | — | DM-C | `18095293616275344` | Khách Hàn ("gửi cho tôi"). Thay draft cũ #100. | ✅ Đã đăng |
| 32 | IG | 11-10 19:45 | food | In your DMs now, with the best time to see the cathedral nearby. Check message requests if it's hiding. | 103 | — | DM-C | `18114373036890225` | Thay draft cũ #101. | ✅ Đã đăng |
| 33 | IG | 11-12 09:03 | Food ❤️ | Glad this one made you hungry! The food map and the duck spot pin are in your DMs. | 82 | — | DM-C | `18033908132681095` |  | ✅ Đã đăng |

### Bít tết (3)

| # | Kênh | Giờ comment (ICT) | Comment | Reply đề xuất | Ký tự (không tính link) | Link web | DM | Comment ID | Ghi chú | Duyệt |
|---|---|---|---|---|---|---|---|---|---|---|
| 34 | FB | 11-11 12:22 | Food | Sent the bít tết spot to your Messenger. Mix everything before the first bite, and here's how to eat like a local:<br>`https://travelframe.sidevn.com/news/honest-hanoi-street-food-guide-2026-what-eat-where-sit-and-how-eat-local?utm_source=facebook&utm_medium=comment_reply&utm_campaign=bit_tet&utm_content=street_food_guide` | 114 | street_food_guide | DM-D | `122126420409479755_1790086612278039` |  | ✅ Đã đăng |
| 35 | FB | 11-11 23:58 | Food | Check your inbox for the steak spot. Our full food map is free here:<br>`https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=comment_reply&utm_campaign=bit_tet&utm_content=food_map` | 68 | food_map | DM-D | `122126420409479755_962936729906477` |  | ✅ Đã đăng |
| 36 | FB | 11-12 01:31 | Food | Just sent it to your Messenger. Save some bread for the sauce, and find the rest of our spots here:<br>`https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map?utm_source=facebook&utm_medium=comment_reply&utm_campaign=bit_tet&utm_content=food_map` | 99 | food_map | DM-D | `122126420409479755_1104633652633914` |  | ✅ Đã đăng |

### POV Old Quarter food (1)

| # | Kênh | Giờ comment (ICT) | Comment | Reply đề xuất | Ký tự (không tính link) | Link web | DM | Comment ID | Ghi chú | Duyệt |
|---|---|---|---|---|---|---|---|---|---|---|
| 37 | IG | 11-12 07:31 | Food | Our Hanoi food map is in your DMs. Which is first on your list, phở or bún chả? | 79 | — | DM-E | `17917245735491322` |  | ✅ Đã đăng |

### Thời tiết miền Nam (1)

| # | Kênh | Giờ comment (ICT) | Comment | Reply đề xuất | Ký tự (không tính link) | Link web | DM | Comment ID | Ghi chú | Duyệt |
|---|---|---|---|---|---|---|---|---|---|---|
| 38 | IG | 11-11 06:07 | Me going to Ho Chi Minh November 29 to December 3 is it good time ? | Good timing, the south is usually getting drier by early December, but pack a light rain layer. If Hanoi is on the route too, want our Hanoi guide in your DMs? | 159 | — | — | `18068855879788283` | Khớp bài IG 05/11 về thời tiết tháng 10–12. Nếu đồng ý → gửi DM-F. | ✅ Đã đăng |

## Không nằm trong batch này

37 comment chưa trả lời còn lại (tương tác, tag, sticker, nhạy cảm/spam) xem báo cáo quét. Comment "Gaada ormas yg bubarin ya? 😂" bị loại khỏi nhóm câu hỏi vì có dấu "?" nhưng thuộc nhóm nhạy cảm.
