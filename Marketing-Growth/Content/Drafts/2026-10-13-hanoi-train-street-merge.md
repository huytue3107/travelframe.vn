---
title: "Gộp 2 bài Train Street → node 71"
keep_node: 71
keep_url: "/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots"
retire_node: 80
retire_url: "/news/hanois-train-street-rhythm-time"
primary_keyword: "train street hanoi"   # 4,400/tháng US, KD 2 (OpenSEO 13/10/2026)
secondary_keywords:
  - "hanoi train street"
  - "is hanoi train street open"
  - "hanoi train street cafe"
  - "hanoi train street photos"
status: "Published 2026-10-13 (see SEO Fix Log §7)"
date: "2026-10-13"
---

# Gộp bài Train Street

## Vì sao gộp

- Hai bài cùng nhắm từ khóa "train street hanoi" nên tự cạnh tranh nhau trên Google.
- Hai bài **mâu thuẫn nhau**: node 71 nói "đừng mặc định là mở cửa, không đăng lịch tàu cố định". Node 80 nói "As of now it's open" và đưa giờ tàu cụ thể (7:00, 7:45, 8:45, 9:30pm). Node 71 cập nhật hơn, có nguồn tháng 4/2026.
- Node 80 có lỗi nội dung: phần CTA và FAQ bị dán nhầm từ bài 48-hour itinerary ("Is 48 hours enough for Hanoi?").

**Giữ node 71, retire node 80.** Chỉ chép sang những phần của node 80 không mâu thuẫn với node 71 (ánh sáng, góc nhìn, thời lượng ghé).

## Guardrail (giữ nguyên)

Theo SEO Fix Log 13/10: **không gắn bán tour vào Phố đường tàu.** Không thêm link tour hay link `/hanoi-photoshoot` vào bài này. Giữ dòng mềm hiện có ("For help planning a private, photo-friendly Hanoi walk…") và chỉ link sang bài hướng dẫn (photo spots, Old Quarter guide).

## Thay đổi trên node 71

### SEO title / H1

- **SEO title (≤60 ký tự):** `Hanoi Train Street 2026: Is It Open? Safety & Photo Guide`
- **H1:** `Hanoi Train Street in 2026: Is It Open, Is It Safe, and Where to Photograph It`
- **Meta description:** giữ bản đã sửa 13/10 ("A realistic, safety-focused guide to Hanoi Train Street in 2026: how access works, rules to respect, and alternative railway photo spots.")

### Thêm đoạn mở đầu "Quick answer" (chèn ngay sau đoạn intro đầu tiên)

> **Quick answer (October 2026):** Hanoi Train Street is the stretch of active railway between Phùng Hưng and Lê Duẩn, where trains pass a few steps from people's front doors. Access is controlled and changes without notice. Some days cafés along the line serve visitors, other days barriers are closed. Treat it as an optional stop, never stand on the tracks, and follow staff instructions immediately.

### Thêm section mới (chèn sau "Why We Do Not Publish a Fixed Train Street Schedule")

> ## What the Street Is Actually Like
>
> When access is permitted, the scene is quieter than viral videos suggest. Cafés along the line set out low stools behind a painted safety line, staff ask everyone to stay seated when a train is due, and the train itself moves slowly but weighs hundreds of tonnes. You feel the air shift before it fully appears.
>
> It is free to walk where access is open. Twenty to thirty minutes is enough to see the street. Allow longer if you plan to wait for a passing train, which is never guaranteed at a specific minute.
>
> ### Best light for photos
> The corridor is narrow, so midday light is flat and harsh. Late afternoon (around 5–6pm) brings low light along the tracks, catching the laundry lines and turning the rails amber. Early weekday evenings are usually less crowded than weekends.
>
> ### Ground level vs. upper floors
> At ground level you see how close daily life is to the railway. From an upper-floor window or balcony overlooking the line, where a business offers one, you can frame the whole scene: the curve of the tracks between houses, laundry overhead, and the train as one detail in a lived-in street. Both views only apply when access is permitted on the day.

### Thêm FAQ (vào block FAQ hiện có)

> **Is Hanoi Train Street open right now?**
> Access changes, so check on the day with your accommodation and follow any barrier or staff instruction. Social posts and blog timetables, including older ones, may already be out of date.
>
> **How long should I spend at Train Street?**
> 20–30 minutes to see the street. Waiting for a train can take much longer and may not happen at the time you expect.
>
> **Where is Hanoi Train Street?**
> The best-known section runs between Phùng Hưng street and Lê Duẩn, near Hanoi Railway Station, a short walk west of the Old Quarter.

### Link nội bộ thêm vào cuối bài (không phải tour)

> Planning the rest of your walk? See our [Hanoi Old Quarter guide](https://travelframe.sidevn.com/news/hanoi-old-quarter-guide) and the [15 best photo spots in Hanoi](https://travelframe.sidevn.com/news/15-best-photo-spots-hanoi-local-guide-light-timing-and-uncrowded-angles-2026).

(Link Old Quarter guide chỉ bật sau khi bài pillar mới được publish.)

### Sửa nút cuối bài

Bài đang có block "Want to taste it yourself? — Book a food tour / See tours". Block này không khớp chủ đề, và mâu thuẫn với guardrail. Nếu template cho phép tắt theo node thì tắt cho node 71. Nếu không, ghi vào ticket template ở Implementation Plan.

## Retire node 80 (cùng quy trình đã dùng cho node 64/66 ngày 13/10)

1. Mở node 80 → Unpublish → đổi alias sang `/archive/hanois-train-street-rhythm-time` (log: "SEO 13/10 merge into node 71").
2. Xoá redirect tự sinh trỏ `/news/hanois-train-street-rhythm-time` → `/archive/...` (nếu Redirect module tự tạo).
3. Tạo redirect 301: `/news/hanois-train-street-rhythm-time` → `/news/hanoi-train-street-2026-safety-first-guide-and-better-railway-photo-spots`.
4. Clear all caches. Kiểm tra: `curl -sI https://travelframe.sidevn.com/news/hanois-train-street-rhythm-time` phải trả về `301` và `location` trỏ tới bài 71.
5. Ảnh "Cre: Cherry on The World" trong node 80 là ảnh của bên thứ ba. **Không** chép sang node 71 nếu chưa có quyền dùng.

**Rollback:** publish lại node 80, đặt lại alias cũ, xoá redirect 301, revert revision của node 71.
