---
name: threads-engagement
description: >
  Tương tác, lắng nghe cộng đồng, phát hiện khách hàng tiềm năng và bình luận
  trên mạng xã hội Threads của TravelFrame (@travelframe.vn). Sử dụng trình duyệt
  Orca để duyệt feed, tương tác với các bài viết hiển thị trên newsfeed (không chỉ
  tương tác nội dung qua từ khóa), tìm kiếm chủ đề du lịch (Hà Nội, mùa thu, ẩm thực
  ngõ hẻm, photo tour, solo trip, Tây Bắc), tương tác bằng văn phong Warm Local Friend & Gen Z,
  tuân thủ cơ chế an toàn không reload trang, pacing 45s-75s và ghi nhật ký tự động.
---

# threads-engagement

Kỹ năng tự động hóa và điều khiển việc tương tác, nuôi dưỡng cộng đồng và săn tìm khách hàng tiềm năng trên mạng xã hội Threads cho TravelFrame (`@travelframe.vn`).

---

## 1. Mục Đích & Phạm Vi
- **Mục tiêu:** Xây dựng hiện diện tự nhiên, ấm áp của TravelFrame trên Threads; tiếp cận du khách trong và ngoài nước đang lên kế hoạch du lịch; tạo thiện cảm qua giá trị thực tế trước khi giới thiệu dịch vụ.
- **Tập trung:**
  1. Thảo luận du lịch Hà Nội mùa thu, phố cổ, ẩm thực ngõ hẻm, cà phê, ngắm hoàng hôn hồ Tây.
  2. Nhu cầu tìm **Photo Travel Tour**, thuê thợ ảnh đồng hành, tour trải nghiệm visual 1:1, solo trip.
  3. Cung đường vùng cao miền Bắc: Hà Giang, Cao Bằng, Sapa, Tà Xùa, Mù Cang Chải, Ninh Bình.
  4. Hỗ trợ, giải đáp cho khách quốc tế và creator tìm kiếm góc chụp bản địa.

---

## 2. Quy Trình Vận Hành 5 Bước

### Bước 1: Khởi động & Kiểm tra Trạng thái Trình duyệt Orca
- Đảm bảo Orca đang chạy và tab Threads (`https://www.threads.com/`) đang mở.
- Tra cứu ID tab qua lệnh:
  ```bash
  ELECTRON_RUN_AS_NODE=1 "/Applications/Orca.app/Contents/MacOS/Orca" \
    "/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js" tab list --json
  ```
- Kiểm tra danh sách bài đã tương tác trước đó từ `Marketing-Growth/Content/Threads-All-Interactions-Log.md` để tránh trùng lặp.

### Bước 2: Quét & Sàng lọc Nội dung Bằng Bộ Lọc 4 Tầng (4-Tier Relevance & Safety Gate)

- **Nguyên tắc Tương tác Newsfeed (Newsfeed Interaction Rule — BẮT BUỘC):**
  - Trong phiên lướt feed (`--mode feed`), Agent **BẮT BUỘC tương tác (Like và/hoặc Reply tự nhiên) với các bài viết hiển thị trên newsfeed**, **KHÔNG chỉ tương tác với nội dung tìm được qua từ khóa** (`--mode search`).
  - Bài viết trên newsfeed **không cần khớp Tầng 2 (Whitelist từ khóa)** vẫn được Like và/hoặc Reply đúng ngữ cảnh bài viết, như hành vi của một người dùng thật đang lướt bảng tin.
  - Khi chưa xác minh được ngữ cảnh để viết Reply phù hợp, **Like là đủ** (đúng hành vi người dùng thật); tuyệt đối không ép bình luận văn mẫu chung chung. Nếu JEV tự tin xác minh bài **ngoài phạm vi** nội dung TravelFrame thì vẫn skip.
  - Tầng 1 (Blacklist loại trừ) vẫn áp dụng cho mọi bài newsfeed; pacing 45s-75s, author cooldown và quy tắc không hard-sell giữ nguyên.
  - Chỉ bài viết khớp từ khóa du lịch/photo tour mới đi tiếp quy trình xử lý sâu: đọc context thread, khai thác Top Comment (Pattern P-034) và lead triage `jev-latest`.
  - Bộ lọc 4 Tầng dưới đây áp dụng đầy đủ cho **tương tác theo từ khóa**; riêng bài newsfeed trong chế độ feed chỉ cần vượt Tầng 1.

- **Tầng 1 (Blacklist loại trừ tuyệt đối):**
  - Tự động loại bỏ và KHÔNG tương tác bất kỳ bài viết nào chứa từ khóa:
    - *Tình cảm / Drama:* `người yêu`, `bồ cũ`, `chia tay`, `crush`, `hẹn hò`, `tỏ tình`, `ly hôn`...
    - *Tài chính / Kiếm tiền:* `earn money`, `affiliate`, `hoa hồng`, `kiếm tiền`, `crypto`, `chứng khoán`, `order`, `mua quà`...
    - *Giải trí / Showbiz:* `concert`, `vé concert`, `vé show`, `fandom`, `kpop`, `idol`, `ca sĩ`...
    - *Địa danh ngoài phạm vi:* `mỹ`, `nhật bản`, `hàn quốc`, `thái lan`, `châu âu`, `thủy nguyên`, `hải phòng`, `đà lạt`, `phú quốc`...
- **Tầng 2 (Whitelist địa danh & dịch vụ cốt lõi):**
  - Bắt buộc bài viết phải chứa ít nhất một trong các thực thể trọng tâm của TravelFrame:
    - *Địa danh Hà Nội:* `hà nội`, `hanoi`, `hoàng diệu`, `phan đình phùng`, `phố cổ`, `hồ gươm`, `hồ tây`, `cầu long biên`...
    - *Vùng cao miền Bắc:* `hà giang`, `sapa`, `tà xùa`, `mù cang chải`, `cao bằng`, `bản giốc`, `ninh bình`...
    - *Dịch vụ du lịch visual:* `photo tour`, `tour chụp ảnh`, `thuê thợ ảnh`, `thợ chụp`, `solo travel / solo trip tại VN`...
- **Tầng 3 (Zero-Generic Quality Gate - Bỏ Qua Tuyệt Đối):**
  - Nếu bài viết chỉ nhắc chung chung về "đi chơi", "du lịch" mà không xác định được rõ địa danh hay dịch vụ cốt lõi (`contextTopic === 'general'`), hệ thống **BỎ QUA NGAY LẬP TỨC** (`skip`), tuyệt đối không like hay bình luận gượng ép. Thà bỏ qua 10 bài viết còn hơn tương tác lệch 1 bài gây tổn hại hình ảnh thương hiệu. (Quy tắc bỏ qua này áp dụng cho tương tác theo từ khóa; riêng bài viết trên newsfeed trong phiên lướt feed không bị chặn bởi điều kiện `contextTopic === 'general'`, xem Newsfeed Interaction Rule.)
- **Tầng 4 (Author Cooldown Guard - Tránh Lặp Tác Giả):**
  - Duy trì ghi nhớ các tác giả đã tương tác trong 30 bài gần nhất từ log. Tự động bỏ qua các bài viết mới từ cùng một tác giả trong phiên để tránh gây cảm giác spam hoặc làm phiền người dùng.
- **Phân loại ngữ nghĩa bằng JEV (Hybrid Scan Pipeline):**
  - Sau Tier 1 (hard stop, không bao giờ bị model override) và prefilter từ khóa, Agent phân loại ứng viên bằng `Technology-Automation/Scripts/typesafe_content_classifier.mjs` (model `jev-latest`, 4 typed questions: `content_relevance`, `topic`, `lead_signal`, `season_claim`).
  - Chỉ tin kết quả JEV khi `confidence >= 0.6`; dưới ngưỡng fallback `0.5` thì search mode skip, feed mode Like-only. Quyết định cuối nằm trong code policy, không giao cho model.
  - **Live là mặc định** (Rocky duyệt 2026-09-25 — API trả phí, mỗi ứng viên 1 request). Cần `TYPESAFE_API_KEY`; đặt `TYPESAFE_LIVE_APPROVED=0` để bắt chạy offline/mock (xem `Technology-Automation/Runbooks/DES-20260925-JEV-CONTENT-CLASSIFIER.md`).
  - `lead_signal` từ JEV bổ sung cho regex lead hiện có; lead phát hiện được vẫn đi tiếp luồng lead triage `jev-latest`.

### Bước 3: Đánh giá & Xoay Tua Văn Phong Gen Z (5-Angle Rotation Engine)
- **Quy chuẩn kỹ năng viết Content (Humanizer & Anti-AI Tells):**
  - ❌ **CẤM tuyệt đối dùng dấu gạch ngang `-`** trong toàn bộ văn bản (thay bằng dấu phẩy, ba chấm `...`, ngoặc đơn hoặc tách câu tự nhiên).
  - ❌ **CẤM đặt icon / emoji ở cuối câu một cách máy móc**: Phân bổ icon ngẫu nhiên ở giữa câu hoặc đặt ngay cạnh từ khóa mang tính cảm xúc; kết thúc câu bằng hư từ tự nhiên (`nè`, `á`, `nha`, `ạ`, `=)))`) hoặc dấu chấm câu.
  - ✅ **BẮT BUỘC đặt từ nói lái, tiếng lóng (slang), ẩn ý, chơi chữ trong dấu ngoặc kép `""`**:
    Ví dụ: `"chân ái"`, `"mê xỉu"`, `"đỉnh nóc kịch trần"`, `"lùa gà"`, `"nghi ngờ nhân sinh"`, `"10 điểm không có nhưng"`, `"flex nhẹ"`, `"cứu rỗi"`, `"khoan dừng khoảng chừng là 2s"`, `"plot twist"`, `"chữa lành"`, `"xu cà na"`, `"sượng trân"`.
  - ✅ **Bắt buộc bắt trend hiện tại**: Tham vấn cẩm nang slang & trend mới nhất từ Agent `AGT-MKT-TREND-01` trước khi viết.
- **Xoay tua tuần tự qua 5 yếu tố tâm lý:**
  1. **Yêu thích (Adoration / Hype):** Say đắm cảnh sắc, tán thưởng gu visual (*"chân ái", "mê xỉu up xỉu down", "đỉnh nóc kịch trần"*).
  2. **Nghi ngờ (Skepticism / Reality Check):** Lật ngược nghi vấn hài hước, phản biện thực tế (*"ủa alo tưởng... ai ngờ...", "nghi ngờ nhân sinh"*).
  3. **Tự hỏi (Wondering / Existential Thoughts):** Tự vấn nội tâm kích thích tương tác (*"nhiều khi tự hỏi...", "sao tìm bạn chụp ảnh có tâm khó ngang lên trời?"*).
  4. **Tích cực (Pure Positivity / Healing):** Năng lượng ấm lòng, lời chúc an yên (*"chiếc ôm ấm áp", "chữa lành"*).
  5. **Clickbait (Intrigue / Teaser / Plot Twist):** Mở đầu giật mình tò mò (*"khoan dừng khoảng chừng là 2s", "plot twist cực mạnh", "cảnh báo nhẹ"*).
- **Nguyên tắc chuyển đổi:**
  - **Value-First:** Chia sẻ kinh nghiệm thực tế trước (giờ chụp vắng, quán ăn ngõ hẻm ngon, trang phục phù hợp).
  - **No Hard-Sell:** Lồng ghép TravelFrame như giải pháp cứu cánh cho team mê đi một mình/mê ảnh đẹp, tuyệt đối không quăng link bán tour hay báo giá lộ liễu.
  - **Đa ngữ:** Tiếng Việt 100% chuẩn dấu chính tả; Tiếng Anh tự nhiên, mượt mà cho khách quốc tế/creator.

### Bước 4: Thao tác Tương tác, Đọc Context Thread & Khai Thác Top Comment (Pattern P-034)
- **Quy trình chuẩn trên DOM:**
  1. Mở chi tiết bài viết (click link SPA hoặc chuyển URL).
  2. **Quét sâu Context Thread & Multi-Comments (Pattern P-034):**
     - Đọc bài gốc và trích xuất danh sách 10 đến 20 bình luận hiển thị trong thread.
     - Phân tích chủ đề thảo luận thực tế của cộng đồng: góc chụp ảnh (`photo_tour`), thời tiết mùa thu (`hanoi_autumn`), ẩm thực ngõ nhỏ (`street_food`), cung đường miền núi (`mountain_views`), du lịch một mình (`solo_travel`), chi phí (`pricing_budget`).
     - Lọc ra các **Top High-Engagement Comments** (bình luận có lượt like cao nhất hoặc từ 2 tim trở lên).
     - **Tích lũy tri thức (Knowledge Mining):** Tự động lưu các bình luận xuất sắc và trích xuất motif tái sử dụng vào [threads-high-engagement-comments.json](../../../Research-Insights/Library/knowledge/threads-high-engagement-comments.json).
     - **Chiến lược phản hồi 2 chiều:** Bấm Reply trực tiếp vào Top Comment để tiếp nối luồng thảo luận sôi nổi nếu tìm thấy, hoặc Reply bài gốc với văn phong trúng tim đen theo ngữ cảnh đã phân tích.
  3. Bấm nút **Like** (nếu chưa like).
  4. Điền nội dung bình luận vào `textbox` bằng `orca fill`.
  5. Bấm nút **Reply** xác nhận đăng bình luận.
  6. **Ấn nút Back (`window.history.back()`)** để quay về đúng vị trí đang xem trên Feed.
  7. **Cuộn xuống tiếp tục** (`window.scrollBy(0, 1000)`).
- **Quy tắc vàng:**
  - ❌ **CẤM:** Không reload trang liên tục (`orca goto` lặp đi lặp lại trên cùng 1 trang feed sẽ làm mất độ sâu scroll).
  - ⏱️ **Pacing:** Giãn cách tự nhiên từ **45s đến 75s** giữa mỗi lượt tương tác để tránh cơ chế anti-spam của Meta.

### Bước 5: Ghi Nhật Ký & Lead Triage Bằng Model `jev-latest` (Phương Án A)
- Mỗi tương tác thành công phải được lưu lại vào:
  - [Threads-All-Interactions-Log.md](../../../Marketing-Growth/Content/Threads-All-Interactions-Log.md)
- **Cơ chế Lead Triage (Phương án A):**
  - Khi quét thấy bình luận hoặc tin nhắn hỏi về giá tour, thuê thợ chụp, lịch trình, đặt lịch hẹn (High-Intent Lead).
  - Hệ thống tự động chuyển payload qua kịch bản `typesafe_lead_triage.mjs` để mô hình **`jev-latest`** (TypeSafe System One) chấm điểm `purchase_intent` (thang điểm >= 2.5) và định tuyến xử lý (gán tag ManyChat và escalate cho nhân viên tư vấn).


---

## 3. Bộ Nguyên Tắc & Lưu Ý Hạn Chế Phát Sinh Vấn Đề (Quality & Brand Safety Guardrails)

Nhằm đảm bảo 100% tính chính xác, an toàn thương hiệu và tránh tình trạng tương tác lệch ngữ cảnh, Agent bắt buộc phải tuân thủ nghiêm ngặt 6 lưu ý sau:

1. **Nguyên tắc Sàng lọc Ngữ cảnh 4 Tầng (4-Tier Gate):**
   - Không chỉ dựa vào 1 từ khóa đơn lẻ. Bắt buộc kiểm tra qua Tầng 1 (Blacklist loại trừ: drama, affiliate, crypto, concert, địa danh ngoài phạm vi) và Tầng 2 (Whitelist địa danh cốt lõi: Hà Nội, Vùng cao Tây Bắc/Đông Bắc, dịch vụ photo tour/solo trip).

2. **Nguyên tắc Bỏ Qua Tuyệt Đối (Zero-Generic Skip Rule):**
   - Khi quét một bài viết chỉ có nội dung chung chung hoặc không thể xác định rõ ràng ngữ cảnh (`contextTopic === 'general'`), hệ thống **BẮT BUỘC BỎ QUA NGAY LẬP TỨC** (`skip`).
   - Kim chỉ nam: *"Thà bỏ lỡ 10 bài viết còn hơn tương tác lệch 1 bài gây tổn hại hình ảnh chuyên nghiệp của thương hiệu."*
   - **Ngoại lệ (Newsfeed Interaction Rule):** Bài viết hiển thị trên newsfeed trong phiên lướt feed vẫn phải được Like và/hoặc Reply tự nhiên dù không khớp từ khóa hoặc chưa xác định được `contextTopic`; nguyên tắc bỏ qua tuyệt đối chỉ chặn **tương tác theo từ khóa**. Nguyên tắc này không bao giờ cho phép bình luận lệch chủ đề hay spam văn mẫu chung chung.

3. **Nguyên tắc Chuẩn Xác Tri Thức Mùa Vụ & Trả Lời Đúng Trọng Tâm (Season & Intent Accuracy):**
   - Luôn đối chiếu đặc trưng mùa vụ thực tế trước khi bình luận:
     - *Hà Giang / Vùng cao:* Tháng 9 đến tháng 10 là mùa lúa chín; Tháng 11 đến tháng 12 là mùa hoa tam giác mạch và sương mù rét buốt; Tháng 1 đến tháng 2 là mùa hoa đào, hoa lê. Tuyệt đối không bình luận "lúa chín vàng óng" vào tháng 11 hay tháng 12.
     - *Hà Nội:* Tháng 9 đến tháng 11 là mùa thu heo may, hoa sữa, cốm non; Tháng 12 đến tháng 2 là mùa đông rét ngọt, sương sớm phố cổ.
   - Nếu tác giả đặt câu hỏi cụ thể (ví dụ: *"đi Hà Giang cuối tháng 11 có hoa gì không?", "thuê xe máy ở đâu?"*), câu trả lời phải trực tiếp giải đáp câu hỏi của họ, tuyệt đối không dùng mẫu câu cảm thán sáo rỗng.

4. **Bộ Quy Chuẩn Kỹ Năng Viết Content (Content Writing Constraints):**
   - ❌ **CẤM tuyệt đối dùng dấu gạch ngang `-`** trong mọi câu chữ.
   - ❌ **CẤM đặt emoji ở cuối câu một cách rập khuôn**: Đặt emoji ngẫu nhiên ở giữa câu hoặc ngay cạnh từ cảm xúc (`📸`, `✨`, `🍂`, `☕`, `💛`), kết thúc câu bằng các từ ngữ khí tự nhiên (`nè`, `á`, `nha`, `ạ`, `=)))`) hoặc dấu chấm câu.
   - ✅ **BẮT BUỘC đặt slang, từ nói lái, ẩn ý trong ngoặc kép `""`**: `"chân ái"`, `"mê xỉu"`, `"đỉnh nóc kịch trần"`, `"lùa gà"`, `"nghi ngờ nhân sinh"`, `"10 điểm không có nhưng"`, `"cứu rỗi"`, `"khoan dừng khoảng chừng là 2s"`, `"plot twist"`, `"chữa lành"`.
   - ✅ **Luôn cập nhật slang/trend mới** từ kho tri thức trước khi sinh nội dung.

5. **Nguyên tắc Giãn Cách Tác Giả & Tần Suất (Author Cooldown & Anti-Spam):**
   - Giữ khoảng cách tối đa 1 tương tác / 1 tác giả trong 30 bài gần nhất từ log hoặc trong suốt phiên chạy. Không bình luận 2 bài liên tiếp của cùng 1 người.
   - Pacing tự nhiên giữa các tương tác: **45 giây đến 75 giây**.

6. **Nguyên tắc Đọc Sâu Context Thread & Bình Luận Con (Deep Context & Multi-Comment Reading):**
   - Đọc toàn bộ luồng hội thoại (bài gốc và 10-20 comment con) để nắm bắt tâm lý người đọc.
   - Nếu có Top Comment nổi bật nhận nhiều like, ưu tiên bấm Reply trực tiếp vào Top Comment để tham gia tự nhiên vào câu chuyện, biến TravelFrame thành một người bạn local đồng điệu thay vì phát biểu độc thoại.

---

## 4. Lệnh Thực Thi Sẵn Có

```bash
# Chạy phiên tương tác 30 phút tự động trên feed
node .agents/skills/threads-engagement/scripts/threads_interact.mjs --mode feed --duration 30

# Chạy quét và tương tác theo từ khóa photo tour
node .agents/skills/threads-engagement/scripts/threads_interact.mjs --mode search --query "photo tour" --duration 15

# Tương tác đích danh vào 1 bài viết cụ thể
node .agents/skills/threads-engagement/scripts/threads_interact.mjs --mode single --url "<threads-post-url>" --comment "<nội dung>"

# Phân loại nội dung offline (mock) bằng JEV content classifier
node Technology-Automation/Scripts/typesafe_content_classifier.mjs --mock hanoi_photo_relevant
```

---

## 4. Tài Liệu Tham Khảo Liên Quan
- [references/playbook.md](references/playbook.md)
- [Threads-All-Interactions-Log.md](../../../Marketing-Growth/Content/Threads-All-Interactions-Log.md)
- [DES-20260923-TYPESAFE-LEAD-TRIAGE.md](../../../Technology-Automation/Runbooks/DES-20260923-TYPESAFE-LEAD-TRIAGE.md)
