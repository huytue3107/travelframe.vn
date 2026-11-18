# Runbook: Jev Ultrafast — robot trình duyệt cho nghiên cứu web

- **Chủ trì:** Technology-Automation
- **Người dùng chính:** Research-Insights, Web QA
- **Trạng thái:** Draft (pilot 2026-11-18)
- **Phê duyệt:** Rocky yêu cầu cài đặt và chạy pilot, 2026-11-18
- **Mã nguồn:** `Technology-Automation/Tools/jev-ultrafast/` (clone `browser-use/jev-ultrafast`,
  commit `cf3c406`, MIT; thư mục `Tools/` đã gitignore)

## 1. Công cụ này là gì

Robot nhận một mục tiêu viết bằng lời (ví dụ "Search for Hanoi photo tour and show the results"),
rồi tự click, gõ và cuộn trên trang web. Mỗi bước có 2 phần:

- **TypeSafe Jev** chọn thao tác (CLICK, TYPE_TEXT, SELECT, SCROLL, WAIT, DONE, BLOCKED) và phần tử
  trên trang, trong 1 request.
- **Model văn bản** (OpenRouter) chỉ được gọi khi cần gõ chữ vào ô nhập.

Đầu ra của model không bao giờ biến thành lệnh, selector hay JavaScript. Robot chỉ chọn trong danh sách
phần tử mà nó thấy trên trang.

> Repo gốc nay là bản thử nghiệm; tính năng tương đương được duy trì trong Browser Use
> (`Agent(task, mode='ultrafast')`). Cân nhắc chuyển nếu dùng lâu dài.

## 2. Cấu hình (đã làm 2026-11-18)

| Thành phần | Giá trị |
|---|---|
| Python | 3.13 qua `uv` (tự quản lý trong `.venv`) |
| Chrome của robot | Instance riêng, profile `~/.jev-ultrafast-chrome`, cổng `9333`, **không đăng nhập tài khoản nào** |
| `.env` (chmod 600, gitignore) | `TYPESAFE_API_KEY`, `TEXT_MODEL_API_KEY` (OpenRouter), `TEXT_MODEL=google/gemini-2.5-flash-lite`, `BU_CDP_URL=http://127.0.0.1:9333`, `BH_TELEMETRY=0`, `ANONYMIZED_TELEMETRY=false` |

Model mặc định của repo (`inception/mercury-2.5`) đã bị gỡ khỏi OpenRouter nên phải đổi sang Gemini 2.5 Flash Lite.

Không bật "Allow remote debugging" trên Chrome chính. Như vậy robot không chạm tới Facebook,
Meta Business Suite, Gmail hay ví thanh toán.

## 3. Cách chạy

**Giao diện điều khiển (cho người dùng):**
bấm đúp `Technology-Automation/Tools/jev-ultrafast/Start-Jev-Ultrafast.command`.
File này mở Chrome của robot (nếu chưa mở) và trang `http://127.0.0.1:8766`. Dừng bằng cách đóng cửa sổ Terminal.

**Pilot thu thập (script, lưu kết quả JSON):**

```bash
cd "Technology-Automation/Tools/jev-ultrafast"
uv run --env-file .env python ../../Scripts/jev_price_pilot.py \
  --name viator-en --url https://www.viator.com/ \
  --goal "Search for Hanoi photo tour and show the list of matching tours." \
  --out ../../../Research-Insights/Competitive/<thư-mục>/raw
```

Script tự thêm ràng buộc an toàn vào mục tiêu ("Stop on the search results list. Do not book, add to cart,
sign in…"), giới hạn 25 bước mỗi lần, và ghi lỗi thành lỗi chứ không ghi thành kết quả.

## 4. Kết quả pilot 2026-11-18

| Lượt | Ngôn ngữ mục tiêu | Kết quả | Thời gian | Nhận xét |
|---|---|---|---|---|
| Wikipedia: Hanoi → Hồ Hoàn Kiếm | Anh | DONE ✓ | 13,8s | Gõ tìm kiếm rồi mở đúng bài |
| Wikipedia: Hanoi → Hồ Hoàn Kiếm | Việt | DONE ✓ | 17,2s | Gõ "Hồ Hoàn Kiếm", Wikipedia chuyển hướng đúng |
| Klook: tìm "Hanoi photo tour" | Anh | BLOCKED ✗ | <1s | Robot không nhận ra ô tìm kiếm của Klook (điều khiển tùy biến) |
| Viator: tìm "Hanoi photo tour" | Anh | BLOCKED ✗ | 20,5s | Gõ đúng, nhưng chọn gợi ý tự động trỏ vào 1 tour cụ thể thay vì trang danh sách |
| Viator: tìm tour chụp ảnh Hà Nội | Việt | BLOCKED ✗ | 8,5s | Gõ "Hà Nội" có dấu vào trang tiếng Anh, gợi ý không khớp, lặp lại rồi dừng |

Dữ liệu giá cuối cùng được lấy bằng cách **mở thẳng URL trang kết quả** và để code đọc nội dung
(không gọi model), xem [snapshot giá](../../Research-Insights/Competitive/2026-11-18-Hanoi-Photo-Tour-Price-Snapshot-Klook-Viator.md).

Chi phí pilot: khoảng 35 request TypeSafe và 5 lần gọi model văn bản, tổng dưới vài cent.

## 5. Bài học vận hành

1. **Viết mục tiêu bằng tiếng Anh** cho trang nước ngoài. Model văn bản gõ theo ngôn ngữ của mục tiêu.
   Mục tiêu tiếng Việt làm robot gõ "Hà Nội" có dấu, và gợi ý của trang tiếng Anh không khớp.
   Tiếng Việt vẫn dùng tốt với trang hỗ trợ tiếng Việt (ví dụ Wikipedia).
2. **Nếu đã biết URL kết quả, mở thẳng URL đó.** Robot đáng giá ở những luồng không có URL cố định
   (form, bộ lọc, nhiều bước). Với trang có URL tìm kiếm ổn định, code đọc trực tiếp sẽ nhanh, rẻ và chắc hơn.
3. **Robot báo "DONE" chưa phải bằng chứng.** Luôn kiểm tra URL và nội dung cuối như script đang làm.
4. **Ngoài khả năng của bản MVP:** shadow DOM, iframe, canvas, upload file, tab pop-up, cuộn lồng nhau.
   Klook và nhiều trang đặt tour dùng các thành phần này.

## 6. Ranh giới an toàn

- Chỉ dùng cho **đọc và tìm kiếm** trên trang công khai. Không đăng nhập tài khoản TravelFrame/Side Agency
  vào Chrome của robot.
- Không dùng để like, comment, gửi tin nhắn, đặt tour hay điền form có thật. Các thao tác này thuộc cổng phê duyệt
  của Rocky trong `CLAUDE.md`, và đã có quy trình riêng (Meta API, Orca).
- Mỗi lần chạy tốn phí TypeSafe và OpenRouter. Key OpenRouter nên có hạn mức riêng (đề xuất $5).
- Không in hoặc commit `.env`. Khi đổi key TypeSafe hoặc OpenRouter, cập nhật trong `.env` của công cụ.

## 7. Bảo trì và rollback

- Cập nhật: `cd Tools/jev-ultrafast && git pull && uv sync`. Sau đó chạy `uv run pytest` và
  `uv run --env-file .env python scripts/check_guards.py` (21 kiểm tra, không gọi model).
- Gỡ bỏ: xóa `Technology-Automation/Tools/jev-ultrafast/`, `~/.jev-ultrafast-chrome/`,
  `Technology-Automation/Scripts/jev_price_pilot.py` và runbook này. Không có hệ thống live nào phụ thuộc.
