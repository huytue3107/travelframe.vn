# Comment Mining — Reel "Café Dancing" (FB + IG)

- Ngày phân tích: 2026-10-10 13:10 ICT · Owner: Data-Analytics · Trạng thái: Working
- Nguồn: FB reel `1409099405611405_122117244915479755` (facebook.com/reel/1618560359816785) · IG media `18093120194454177` (instagram.com/reel/DeRw7HjNeRB)
- Dữ liệu: 81 comment + reply lấy qua Graph API (read-only), loại 2 comment của Page → **79 comment khán giả** (FB 63, IG 16)
- Snapshot thô (không lưu tên người comment): `scratch/reel3-comments-2026-10-10.json` · Phân loại tái lập được: `scratch/classify-reel3-comments.py`
- Độ tin cậy: **Trung bình**. Mẫu nhỏ, một bài, phân loại thủ công bởi 1 người. API chỉ trả comment đang hiển thị (Meta có thể đã tự ẩn một phần).

## 1. Chỉ số cảm xúc

Thang điểm từng comment theo thái độ với nội dung video: −2 thù địch · −1 tiêu cực · 0 trung tính/đùa/lạc đề · +1 tích cực · +2 rất tích cực.
NSS (Net Sentiment Score) = %tích cực − %tiêu cực, thang −100 → +100.

| Nhóm | n | Tích cực | Trung tính | Tiêu cực | Trong đó thù địch (−2) | NSS | Điểm TB | Điểm TB theo like |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Tất cả | 79 | 14 (18%) | 34 (43%) | 31 (39%) | 18 (23%) | **−22** | −0,39 | −0,56 |
| Facebook | 63 | 10 (16%) | 33 (52%) | 20 (32%) | 12 (19%) | −16 | −0,29 | −0,46 |
| Instagram | 16 | 4 (25%) | 1 (6%) | 11 (69%) | 6 (38%) | **−44** | −0,81 | −0,67 |
| Đúng chủ đề (bỏ cãi nhau chính trị) | 64 | 14 (22%) | 20 (31%) | 30 (47%) | 18 (28%) | −25 | −0,47 | −0,64 |

Điểm theo like thấp hơn điểm thường: comment tiêu cực được like nhiều hơn comment tích cực (nhóm tích cực 13 comment chỉ có 4 like).

## 2. Cụm chủ đề

| Mã | Chủ đề | Số comment | Like | Điểm TB | Câu tiêu biểu |
|---|---|---:|---:|---:|---|
| VAPE | Anh nhân viên hút vape phía sau (đùa, hỏi pháp luật, công an) | 18 | 37 | −0,06 | "That employee with vape is vibing 😂" (30 like, comment nhiều like nhất) |
| POS | Thích không khí, yêu Việt Nam | 13 | 4 | +1,31 | "Now that's my kinda cafe 🎵" · "Hồn nhiên dễ thương" |
| RAC | Phân biệt chủng tộc / hạ thấp nhân phẩm người nhảy | 11 | 33 | −2,00 | "Black fatigue coming to a Duong near you" · "Where is a zoo keeper??" · "Deport them immediately" |
| OVT | Du lịch quá tải, "Việt Nam đang bị phá", so với Bali/Thái | 10 | 23 | −1,40 | "On its way to becoming Bali 🤮" · "So Vietnam is finished??" |
| CRG | Cringe, "main character", không phải văn hoá cà phê Việt | 7 | 32 | −1,29 | "They do Everything to be the main character" (19 like) · "This is not what Vietnamese cafe culture!!" |
| POL | Cãi nhau chính trị trong reply | 8 | 17 | 0 | (không trích — lạc đề, có nội dung chính trị nhạy cảm) |
| INS | Chửi nhau giữa người comment | 7 | 0 | −0,14 | (không trích — tục) |
| DRUG | Ám chỉ chất kích thích | 2 | 0 | −0,50 | "They had something before they arrived" |
| JOKE | Đùa trung tính | 3 | 1 | 0 | "Havana Cuba 😂" |

Ghi chú diễn giải: 3 comment "fatigue" (FB/IG) được xếp RAC vì cùng thread có câu "Black fatigue" rõ ràng; đây là diễn giải, không phải chữ nguyên văn.

## 3. Insight khách hàng

1. **Reach đến từ phản ứng, không phải từ nhu cầu du lịch.** 0 comment chứa keyword HANOI (caption có kêu gọi), 0 câu hỏi về tour, giá, địa điểm quán. 6 comment có dấu "?" đều là câu hỏi tu từ hoặc mỉa mai. Seed comment C1 có 0 reply.
2. **Tệp khách quốc tế của TravelFrame ghét cảnh "du khách làm lố".** Cụm OVT + CRG (17 comment, 55 like) cho thấy người xem nước ngoài muốn một Hà Nội yên, thật, không bị du khách chiếm sân khấu. Một reply đổ lỗi thẳng cho mạng xã hội: "sadly due to social media. Vietnam will be just like thailand." Đây cũng là nỗi lo của chính nhóm khách TravelFrame nhắm tới.
3. **Người Việt xem video theo góc khác: nhân vật địa phương.** Người Việt gần như không bàn về người nhảy; họ bàn anh nhân viên vape (18 comment). Comment nhiều like nhất ở IG cũng là về anh này. Góc "người Hà Nội bình thản giữa cảnh ồn ào" mới là điểm thu hút, không phải đám đông nhảy.
4. **Giờ comment trùng giờ ban ngày ở Mỹ** (IG: 23:52–03:07 ICT, tức chiều ở Mỹ). Nhiều khả năng Meta đẩy reel sang tệp Mỹ, nơi chủ đề chủng tộc/du khách dễ gây tranh cãi. Không có dữ liệu quốc gia theo từng comment để khẳng định.
5. **Không thấy tín hiệu mua.** Account-level tăng 133 save, 175 share trong 24h, nhưng không tách được bao nhiêu thuộc về reel này và share đó là "share để chê" hay "share để rủ đi". Không nên dùng con số này làm bằng chứng nhu cầu.

## 4. Rủi ro

| Rủi ro | Mức | Bằng chứng |
|---|---|---|
| Thương hiệu đứng dưới chuỗi comment phân biệt chủng tộc | Cao | 11 comment RAC, 33 like, vẫn hiển thị |
| Bản quyền: video của người khác (credit TikTok @d_a_r_r_i_o_o), đăng 2 ngày sau tranh chấp bản quyền | Cao | Credit không thay cho quyền sử dụng |
| Hình ảnh vape trong nội dung thương hiệu | Trung bình | Comment nhắc lệnh cấm và công an |
| Cãi nhau chính trị dưới bài | Trung bình | 8 reply POL |

## 5. Đề xuất & Hành động đã thực thi

1. **Ẩn (hide, không xoá) 11 comment RAC:** ✅ **Đã hoàn tất lúc 13:17 ngày 10/10/2026 (theo phê duyệt trực tiếp của Rocky).** Toàn bộ 11 comment (8 Facebook, 3 Instagram) đã được ẩn thành công qua Meta Graph API với cờ `is_hidden=true` (FB) và `hide=true` (IG). 0 comment bị xoá, bảo toàn cấu trúc dữ liệu và khả năng khôi phục.
2. **Quyết định số phận reel:** xin phép bằng văn bản từ chủ video, hoặc lưu trữ (archive) reel. Với trạng thái tài khoản vừa có tranh chấp bản quyền, ưu tiên archive.
3. **Không lặp format "du khách quậy ở quán Việt".** Reach cao nhưng NSS −22 và không có lead.
4. **Format nên thử:** góc nhìn người Hà Nội bình thản, khoảnh khắc đời thường tự quay. Chính cụm VAPE cho thấy người xem bị hút bởi nhân vật địa phương.
5. Sửa ghi nhận trong báo cáo trưa 10/10: các bình luận không phải "tranh luận lành mạnh" và không nên "giữ nguyên làm nhiên liệu".

## 6. Nhật ký thực thi ẩn bình luận (10/10/2026 13:17 ICT)

- **Phương thức:** Meta Graph API `v25.0` qua Page Access Token / Instagram Management Scopes.
- **Trạng thái:** 11/11 thành công (`success: true`), 0 lỗi, 0 xóa dữ liệu.
- **Danh sách 11 comment đã ẩn:**
  1. `[FB]` `122117244915479755_1778163826556274`: *"The fatigue is setting in"*
  2. `[FB]` `122117244915479755_1082114691080617`: *"Tay My Tho yup"*
  3. `[FB]` `122117244915479755_1459124549448868`: *"Where is a zoo keeper??"*
  4. `[FB]` `122117244915479755_2692187307898716`: *"Thang Map yeah,do some special treatment to this one..in cage"*
  5. `[FB]` `122117244915479755_2461556844370482`: *"Take out the trash please 🙏🏼"*
  6. `[FB]` `122117244915479755_1127472116606167`: *"Black fatigue coming to a Duong near you real soon"*
  7. `[FB]` `122117244915479755_2939524313067504`: *"ghetto vibes"*
  8. `[FB]` `122117244915479755_1073612325581873`: *"We don’t like Niger crazy culture like that."*
  9. `[IG]` `18342378127258048`: *"Fatigue is global -"*
  10. `[IG]` `18112308668030781`: *"Hate it. Degenerate downtown LA vibes"*
  11. `[IG]` `17941532214438702`: *"Deport them immediately 🙌"*

## 7. Nhật ký kích hoạt tương tác Gen Z (10/10/2026 13:30 ICT)

- **Phương thức:** Meta Graph API `v25.0` qua Page Access Token / Instagram Comments API.
- **Trạng thái:** 13/13 thành công (100%), 0 lỗi.
- **Bình luận ghim mở tranh luận (Top-level):**
  - `[FB]` ID `122117244915479755_1109490344779360`
  - `[IG]` ID `18078086780412670`
  - *Nội dung:* "Bro walked into an anime opening sequence at 2 PM 💀 Real talk though, which travel vibe are you: A) Main character dancing on chairs 🕺 B) Fully dissociated on a 10cm plastic stool in a hidden alley with an iced coffee ☕️ Drop your team below, don't lie 👇"
- **Các phản hồi may đo tới khách hàng (11 replies):**
  - `[IG]` `17940452211364554`: Reply "That employee with vape is vibing" -> *"Bro is completely in his own tax bracket of peace 😭 Unbothered king literally did not miss a single puff 🗿"*
  - `[FB]` `122117244915479755_1782932266312516`: Reply thanh niên đứng sau gật gật -> *"Pin xã hội còn đúng 1% nên chỉ gật đầu bluetooth cho có lệ thôi bác ơi =))) Hệ hướng nội nhưng vô tình bị ném vào concert 😭"*
  - `[FB]` `122117244915479755_2618622948598684`: Reply hero is the local in the back -> *"10000+ aura. Bro said: 'Rent is paid, my shift is ending, y'all have fun though' 🗿"*
  - `[FB]` `122117244915479755_2647083532392500`: Reply ông đứng sau chill vậy -> *"Đúng kiểu 'tâm bất biến giữa dòng đời vạn biến' luôn á anh =))) Khách quẩy banh nóc nhưng anh vẫn giữ vững phong thái 10 điểm không có nhưng!"*
  - `[IG]` `18031448978858022`: Reply They do Everything to be the main character -> *"Heavy on the main character syndrome 😭 But no cap, real Hanoi cafe lore is just sipping robusta on a tiny sidewalk stool and minding your own business. This was definitely a glitch in the matrix lol."*
  - `[FB]` `122117244915479755_2137544057638971`: Reply This is not what Vietnamese cafe culture -> *"No cap! You won’t catch locals doing flashmobs at 2 PM 💀 Real Hanoi coffee hits different when you're hidden in a quiet French villa alleyway. You team dark phin or modern specialty?"*
  - `[IG]` `17973537339071159`: Reply On its way to becoming Bali -> *"Nightmare fuel fr 💀 That's why we're out here gatekeeping the quiet alleys. Don't worry, 99% of Hanoi is still untouched by TikTok chaos."*
  - `[IG]` `18133436854670473`: Reply I’d sooner the noise of the traffic -> *"Hanoi motorbike honking is lowkey soothing white noise once you lock in with a cold cà phê sữa đá though 🤝"*
  - `[FB]` `122117244915479755_2285440098977593`: Reply Their coffees are too strong -> *"Vietnamese robusta does NOT play 😭 One sip of cà phê đen and you're suddenly seeing sounds and finishing all your life goals. You gotta dilute it with condensed milk (nâu đá) to survive!"*
  - `[FB]` `122117244915479755_950318641051090`: Reply Now that’s my kinda cafe -> *"You're definitely built for the plot haha 💃 Are you always down for spontaneous vibes, or do you have a lowkey quiet coffee mode too?"*
  - `[FB]` `122117244915479755_1455805103237733`: Reply Hổn nhiên dễ thương -> *"Năng lượng cưng xỉu luôn ạ! Lâu lâu va vào chiếc vibe ngẫu hứng giải cứu ngày uể oải thế này cũng mlem phết ạ 🥰"*

