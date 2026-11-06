---
title: Thin and Harry — sources and image plan
owner: Marketing-Growth
status: Draft
created: 2026-10-23
updated: 2026-10-23
---

# Nguồn và phạm vi kiểm tra

| Nguồn | Đã đọc/xem | Dùng trong bài |
|---|---|---|
| [Dda473Fj_2F, ảnh 8](https://www.instagram.com/p/Dda473Fj_2F/?img_index=8) | Caption, location DONG XUAN Market; ảnh 7 và 8; ngày đăng 18/09/2026 theo metadata công khai | Hero ảnh 8: Thin, váy đỏ, kính, quay đầu, chữ CHỢ ĐỒNG XUÂN nhìn thấy. Ảnh 7 giữ source, không chèn. |
| [DdmLRD5I2Mk, ảnh 6](https://www.instagram.com/p/DdmLRD5I2Mk/?img_index=6) | Caption, location Chợ Đồng Xuân; ảnh 5 và 6; ngày đăng 22/09/2026 | Ảnh 5: kiện hàng, váy đỏ. Ảnh 6: cầu thang, lan can, kiện hàng, người nền. |
| [DdYpZDHI8rM, ảnh 1](https://www.instagram.com/p/DdYpZDHI8rM/?img_index=1) | Caption, location Chợ Đồng Xuân; ảnh 1 và 2; ngày đăng 17/09/2026 theo metadata công khai | Ảnh 1: cửa cuốn, tay dang, ánh sáng và bóng rõ. Ảnh 2 dùng để đối chiếu biến thể tư thế, không chèn. |

Đọc bằng Browser Harness, DOM/accessibility của phiên Chrome hiện có, không dùng API trả phí. agent-reach CLI không có trong PATH; dùng fallback Browser Harness theo jev-ultrafast. Instagram chỉ tải ảnh chính sau khi tab được activate và có thời gian render. Không đọc cookies, token hoặc state nội bộ. Chỉ tải URL ảnh hiện diện trong DOM carousel. Web search fetch ba post bị throttled; không dùng nội dung từ fetch lỗi làm bằng chứng.

## Patterns / voice

- [Voice Playbook](../../../../Research-Insights/Library/knowledge/voice-playbook.md): V-01, V-02, V-07, V-09; warm local friend, một ý mỗi câu, claim có nguồn và hỏi trước khi dùng không gian/chụp người.
- Audience canonical: `/Users/macbook/SideAgency/SA/01-Projects/Hanoi-Expert/TravelFrame/02-Audience-And-Funnel.md`; khách muốn xuất hiện trong ảnh, không phải học vận hành máy ảnh.
- [Keyword system](../../../SEO/2026-10-13-Keyword-System-From-Mettavoyage/keyword-system.csv): autocomplete en-US cho `hanoi old quarter photoshoot`.
- [Top1 plan](../../../SEO/2026-10-22-Top1-Plan/Plan.md): một trang dịch vụ chính, bài có bằng chứng hỗ trợ.

## Claim register

| Claim | Trạng thái / cách dùng |
|---|---|
| Nhân vật tên Thin và chụp với Harry | Rocky cung cấp; caption hai post tag @thin.m.mon.52459 và Harry. |
| Bối cảnh Đồng Xuân | Tag địa điểm của cả ba post và chữ CHỢ ĐỒNG XUÂN nhìn rõ trong hero. Không gọi tên từng ngõ/quầy bên trong. |
| Trang phục đỏ, kính, cửa cuốn, kiện hàng, cầu thang | Đã xem trực tiếp sáu ảnh. |
| Film look / editorial và flash | Mô tả từ caption; ảnh có ánh sáng/bóng tương ứng. Không suy ra chụp bằng film, thiết bị hay thông số. |
| Những lời Harry nói hoặc thứ tự Thin được hướng dẫn | Không có BTS/audio xác minh; không kể như sự kiện. |
| Thin là người mẫu chuyên nghiệp, du khách hoặc khách trả tiền | Chưa xác minh; không gán trong bài. |
| Thin trước đó ngại máy ảnh / tự tin hơn sau buổi chụp | Không có lời xác nhận; không dùng. |
| Harry có thể nhận đúng ngày khách yêu cầu | Không hứa; CTA yêu cầu trao đổi availability. |
| Ba post cùng ngày/cùng một tour liên tục | Chưa xác minh; không dựng timeline; phân biệt ngày đăng với ngày chụp. |
| Gói, giá, số ảnh, SLA, địa điểm chắc chắn được chụp | Không thêm claim thương mại. |
| Bộ ảnh dùng cho draft theo yêu cầu Rocky | Có yêu cầu trực tiếp chọn ba post. Chưa publish hoặc mở rộng quyền sử dụng ngoài yêu cầu. |

## Kế hoạch ảnh

| File | Vai trò | Nguồn |
|---|---|---|
| Dda473Fj_2F-08.webp | Hero, nhìn rõ địa điểm | Post 1 / ảnh 8 |
| DdYpZDHI8rM-01.webp | Ví dụ tư thế và ánh sáng | Post 3 / ảnh 1 |
| DdmLRD5I2Mk-05.webp | Màu sắc giữa hàng hóa | Post 2 / ảnh 5 |
| DdmLRD5I2Mk-06.webp | Khung rộng, không gian chợ | Post 2 / ảnh 6 |

Alt text mô tả từng ảnh trong Page-Copy, không nhồi keyword. Bản web chỉ resize/compress; không crop, đổi màu, sửa mặt, xóa watermark hoặc người nền. Source Instagram được giữ nguyên byte cùng SHA-256; không gọi là file máy ảnh gốc.

## Kiểm tra

- Đã tự đọc bài theo copywriting/humanizer: không dựng hội thoại, testimonial, cảm xúc hoặc thông số; không dùng công thức phủ định đối lập.
- Kiểm tra file ảnh, link local, HTML render và các bộ kiểm tra workspace ghi tại `Validation.md` sau khi chạy.
