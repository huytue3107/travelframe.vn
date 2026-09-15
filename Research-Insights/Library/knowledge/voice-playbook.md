# TravelFrame Voice Playbook

Knowledge base giọng brand — seed từ exemplar của chính TravelFrame (self_exemplar).
Sửa chỉ qua lượt học content-learning; mỗi thay đổi ghi vào `runs/`.

## Giọng & xưng hô

## V-01 | Warm local friend tone   (confidence: 3 nguồn)
- Cấu trúc: xưng hô như bạn địa phương thân thiện; practical, ấm, lightly playful; không giáo điều, không giọng quảng cáo
- Nguồn: Creative-Production/Projects/Hanoi-Dong-Xuan-Series/shared/DESIGN.md (2026-09-11), Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (2026-09-11), Creative-Production/Projects/Hanoi-Dong-Xuan-Series/scripts/top-3-hanoi-spots.txt (2026-09-11)
- Áp dụng cho TravelFrame: mọi loại nội dung (reel, caption, carousel, video script)

## Cấu trúc câu

## V-02 | Câu ngắn, mỗi ý một câu   (confidence: 2 nguồn)
- Cấu trúc: câu ngắn (4-12 từ là HƯỚNG DẪN, không phải ngưỡng cứng — exemplar có câu 14 từ gồm 2-3 mệnh đề ngắn); 1 ý chính mỗi câu; câu "Pro move:" gói tip thực hành
- Nguồn: Creative-Production/Projects/Hanoi-Dong-Xuan-Series/scripts/top-3-hanoi-spots.txt (2026-09-11), Creative-Production/Projects/Hanoi-Dong-Xuan-Series/scripts/one-day-hanoi-itinerary.txt (2026-09-11)
- Áp dụng cho TravelFrame: narration + caption; overlay text càng ngắn càng tốt
- Ghi chú: sửa theo review 2026-09-12 — exemplar có câu 14 từ 3 mệnh đề; 4-12 từ là hướng dẫn, nguyên tắc thực sự là mỗi câu ≤2 mệnh đề ngắn

## Emoji & ký hiệu

## V-03 | Emoji vừa phải, gắn ý nghĩa   (confidence: 1 nguồn)
- Cấu trúc: ≤5 emoji phần nội dung/caption (dòng ký tên không tính ✈️); mỗi emoji gắn 1 dòng ý (🛬 landing, 💰 giá); không dùng emoji trang trí dàn trải
- Nguồn: Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (2026-09-11)
- Áp dụng cho TravelFrame: caption; reel script không dùng emoji trong narration

## CTA chuẩn

## V-04 | Save + send cho nội dung danh sách/lộ trình   (confidence: 2 nguồn)
- Cấu trúc: kết bằng save prompt + send-to-a-friend, twist persona cụ thể ("the friend who still has no itinerary")
- Nguồn: Creative-Production/Projects/Hanoi-Dong-Xuan-Series/scripts/top-3-hanoi-spots.txt (2026-09-11), Creative-Production/Projects/Hanoi-Dong-Xuan-Series/scripts/one-day-hanoi-itinerary.txt (2026-09-11)
- Áp dụng cho TravelFrame: reel/video dạng danh sách, itinerary

## V-05 | Comment-keyword + DM flow khi có steps/offer   (confidence: 1 nguồn)
- Cấu trúc: mời comment keyword → DM gửi steps; ghi rõ "no sponsor" nếu so sánh nhà mạng/sản phẩm
- Nguồn: Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (2026-09-11)
- Áp dụng cho TravelFrame: nội dung có tài liệu hướng dẫn kèm, affiliate

## Hashtag & ký tên

## V-06 | Ký tên brand + dòng hashtag cuối   (confidence: 1 nguồn)
- Cấu trúc: dòng ký tên "TravelFrame — your local friend in Hanoi" (caption thêm ✈️); hashtag ≥4, luôn có #travelframe
- Nguồn: Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (2026-09-11)
- Áp dụng cho TravelFrame: mọi caption + asset-plan brand bridge

## Cấm (guardrails)

## V-07 | Không claim chưa xác minh, không hứa Train Street   (confidence: 2 nguồn)
- Cấu trúc: không thêm giá/lịch/ưu đãi chưa xác minh (DESIGN.md). Quy ước v1 của workspace: số chưa verify được phép xuất hiện kèm `[VERIFY]` ngay tại chỗ + bảng claim trong sources.md, và PHẢI verify trước đăng. Nguồn này là quy ước mới, không có trong exemplar — được ghi nhận qua learning run 2026-09-12.
- Nguồn: Creative-Production/Projects/Hanoi-Dong-Xuan-Series/shared/DESIGN.md (2026-09-11), Marketing-Growth/Content/Carousels/README.md (2026-09-11)
- Áp dụng cho TravelFrame: mọi loại nội dung. Footage chợ chỉ là "market B-roll" trừ khi hình chứng minh.
- Ghi chú: sửa theo review 2026-09-12 — bỏ mệnh đề "kết mọi nội dung bằng save/share" (đó là guardrail riêng của series Hanoi trong DESIGN.md, xung đột V-05); quy ước [VERIFY] ghi rõ là quy ước mới có ngày; bỏ nguồn esim caption khỏi entry này vì nó không trực tiếp chứng minh các mệnh đề.

## V-08 | Quy tắc giá 2 nguồn + nhãn Indicative   (confidence: 1 nguồn)
- Cấu trúc: mỗi nhóm giá cần tối thiểu 2 nguồn gần thời điểm đăng; không đủ → range rộng + nhãn `Indicative` hoặc bỏ số; "ask first" giữ nguyên không kèm số
- Nguồn: Marketing-Growth/Content/Carousels/README.md (2026-09-11)
- Áp dụng cho TravelFrame: mọi claim giá (carousel, reel, caption)

## V-09 | Train Street an toàn hành vi + hỏi trước khi chụp   (confidence: 2 nguồn)
- Cấu trúc: nội dung nhắc Train Street BẮT BUỘC có ngôn ngữ an toàn (barriers / local security / không lên ray); mọi advice chụp ảnh địa điểm phải có "ask first"; không hứa access/giờ tàu
- Nguồn: Creative-Production/Projects/Hanoi-Dong-Xuan-Series/scripts/top-3-hanoi-spots.txt (2026-09-11), Creative-Production/Projects/Hanoi-Dong-Xuan-Series/scripts/one-day-hanoi-itinerary.txt (2026-09-11)
- Áp dụng cho TravelFrame: reel/video/carousel nhắc Train Street hoặc chụp ảnh người/chợ
