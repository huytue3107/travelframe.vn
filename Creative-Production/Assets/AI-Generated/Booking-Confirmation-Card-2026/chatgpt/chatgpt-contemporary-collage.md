---
title: "Prompt ChatGPT — tác phẩm cắt dán đương đại cho thiệp xác nhận"
owner: Creative-Production
status: "Đã chọn biến thể A (15/11/2026), dùng trong thiệp Elena Allday"
created: 2026-11-15
target: "Ô hình vuông 640×640 trong source/card-contemporary.html (xuất 1:1, càng lớn càng tốt)"
---

# Prompt (dán nguyên khối vào ChatGPT)

```text
Create a square 1:1 image. No text, letters, numbers or logos anywhere in the image.

[SUBJECT] A minimalist contemporary-art collage celebrating a birthday photo walk in Hanoi's French Quarter. One tall arched colonial window cut from mustard-ochre paper. Behind it, offset to the upper right, a large flat vermilion-red circle (#BD100A) like a low sun. On the left, a deep-teal (#0B6E80) louvred shutter built from thin paper strips, slightly tilted. Tucked inside the arch, a white-bordered instant photo whose picture is a single small red dot on black. One fine black ink line of a peach-blossom branch crossing the red circle, with a few soft pink petals.

[MATERIAL AND TEXTURE] Hand-cut matte paper with visible fibres and slightly uneven scissor edges; subtle risograph grain with tiny colour misregistration; real paper layers a few millimetres apart.

[LIGHTING] Soft, diffuse gallery light from the upper left; very gentle cast shadows under each paper layer; no glare, no hotspots.

[ENVIRONMENT] Plain warm off-white gallery wall (#F2EEE6) with generous negative space. The composition sits in the centre and lower part of the frame, standing on a thin black horizontal ground line.

[CAMERA SIMULATION] Photographed straight on, 100mm macro lens, f/8, ISO 100; flat frontal view with no perspective distortion.

[DEPTH CONTROL] Everything sharp from edge to edge; no bokeh, no blur, only the shallow real depth between paper layers.

[STYLE] Confident, playful, editorial contemporary art print; geometric clarity in the spirit of mid-century cut-paper collage and Bauhaus composition, but entirely original.

[AVOID] No text, words, typography or logos; no people or faces; no realistic buildings or landmarks; no gradients; no glossy 3D render; no clutter or extra objects; no frame or border around the image.
```

# Ghi chú
- Hình xuất ra đặt vào `art/` của dự án Booking-Confirmation-Card-2026, rồi dựng bằng
  `python3 -I source/build.py data/TF-20261115-BDAY-contemporary.json --suffix=-contemporary --art art/<file>.png`.
- Ghi lại tên model, ngày tạo, link chat ChatGPT trong file này sau khi tạo.

# Kết quả 15/11/2026

Tạo trong ChatGPT (tài khoản của Rocky), chat "Create Hanoi Collage Image":
https://chatgpt.com/c/6af956b6-26b8-83ec-8e41-206a79a2b974

Mỗi hình PNG 1254×1254. Đã tải về `~/Downloads` trên Mac, chưa chép vào workspace.

| Biến thể | File trong Downloads | Nội dung | Prompt bổ sung |
|---|---|---|---|
| A | `tf-collage-b817eb47.png` | Vòm cửa, mặt trời đỏ, cửa chớp teal, ảnh instant, cành đào | Prompt gốc ở trên |
| B | `tf-collage-29beb184.png` | Vòm cửa, mặt trời đỏ, cành đào, bánh kem giấy có nến | Thay ảnh instant và cửa chớp bằng bánh kem tối giản, giữ nguyên phong cách |
| C | `tf-collage-7e1512dc.png` | Vòm cửa, mặt trời đỏ, cành đào, hai cô gái khoác tay (không vẽ mặt) | Thay cửa chớp và ảnh instant bằng hai bóng người cắt giấy, một váy kem đội mũ cói, một váy teal |
