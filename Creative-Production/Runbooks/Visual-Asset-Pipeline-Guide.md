# Visual Asset Pipeline Guide: Pexels API & Nano Banana AI Rendering

**Owner:** Creative-Production / Technology-Automation  
**Đối tượng áp dụng:** Toàn bộ nhân sự và AI Agent hoạt động trong workspace TravelFrame Company OS.  
**Mục tiêu:** Cung cấp quy chuẩn khai thác hình ảnh chất lượng cao, kết hợp giữa ảnh thực tế (Pexels API) và ảnh sáng tạo ý niệm (Nano Banana AI).

---

## 1. Tổng Quan Kiến Trúc Hình Ảnh

TravelFrame xây dựng hệ sinh thái hình ảnh dựa trên 2 trụ cột tương hỗ:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HỆ THỐNG ASSET HÌNH ẢNH TRAVELFRAME                   │
│                                                                        │
│   ┌─────────────────────────────────┐  ┌───────────────────────────┐   │
│   │        1. PEXELS STOCK API      │  │     2. NANO BANANA AI     │   │
│   │    (Ảnh Đời Thực - Chân Thực)   │  │   (Ảnh Sáng Tạo Ý Niệm)   │   │
│   ├─────────────────────────────────┤  ├───────────────────────────┤   │
│   │ • Ẩm thực thực tế (Phở, Bún chả)│  │ • Bìa minh họa ý niệm     │   │
│   │ • Địa danh lịch sử Hà Nội       │  │ • 3D Miniature diorama    │   │
│   │ • Khoảnh khắc đường phố tự nhiên│  │ • Concept nghệ thuật độc lạ│   │
│   │ • Giấy phép thương mại miễn phí │  │ • Tỷ lệ khung hình linh hoạt│   │
│   └────────────────┬────────────────┘  └─────────────┬─────────────┘   │
│                    │                                 │                 │
│                    ▼                                 ▼                 │
│         Creative-Production/Assets/Stock/     Assets/AI-Generated/     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Khai Thác Ảnh Đời Thực Qua Pexels API

### 2.1. Thiết lập Môi trường & Bảo Mật
- Khóa bí mật `PEXELS_API_KEY` được lưu trữ an toàn trong file `.env` tại thư mục gốc workspace (file này đã được đưa vào `.gitignore` để chống lộ secret).
- Tuyệt đối **không in, không commit, và không ghi API key** vào tài liệu công khai.

### 2.2. Công cụ CLI: `fetch_media_asset.mjs`
Vị trí script: `Technology-Automation/Scripts/fetch_media_asset.mjs`

#### Lệnh Tìm Kiếm (Search):
```bash
node Technology-Automation/Scripts/fetch_media_asset.mjs search "<từ_khóa>" --per-page <số_lượng> [--orientation landscape|portrait|square]
```

*Ví dụ thực tế cho TravelFrame:*
- Tìm ảnh phố cổ Hà Nội khổ ngang cho bài blog:
  ```bash
  node Technology-Automation/Scripts/fetch_media_asset.mjs search "hanoi old quarter street" --per-page 5 --orientation landscape
  ```
- Tìm ảnh cà phê trứng / ẩm thực:
  ```bash
  node Technology-Automation/Scripts/fetch_media_asset.mjs search "vietnamese egg coffee" --per-page 3
  ```
- Tìm ảnh khách du lịch solo khổ dọc cho bài viết / Pinterest:
  ```bash
  node Technology-Automation/Scripts/fetch_media_asset.mjs search "solo traveler walking street" --per-page 4 --orientation portrait
  ```

#### Lệnh Tải Về & Tự Động Ghi Nhận Bản Quyền (Download):
```bash
node Technology-Automation/Scripts/fetch_media_asset.mjs download <photoId> --dest Creative-Production/Assets/Stock
```

*Hệ thống sẽ tự động:*
1. Tải ảnh độ phân giải cao vào thư mục `Creative-Production/Assets/Stock/`.
2. Tạo file JSON siêu dữ liệu đính kèm (ghi nhận tên nhiếp ảnh gia, link nguồn Pexels, kích thước gốc, thẻ alt gợi ý).
3. Xuất sẵn đoạn mã Markdown kèm chú thích bản quyền chuẩn mực để chèn ngay vào bài viết blog:
   ```markdown
   ![Lively street scene in Hanoi's Old Quarter](./pexels-32014789-warren-yip.jpg)
   *Photo: Warren Yip / Pexels*
   ```

---

## 3. Khai Thác Ảnh Sáng Tạo Qua Nano Banana (Google AI)

### 3.1. Nano Banana là gì?
**Nano Banana** là dòng mô hình thế hệ mới nhất của Google (tích hợp trong hệ sinh thái Gemini / Imagen / Antigravity) chuyên về kết xuất và chỉnh sửa hình ảnh độ phân giải cao (lên tới 4K), hiểu sâu sắc bối cảnh văn hóa, chi tiết ánh sáng và chữ viết typography.

### 3.2. Khi nào nên dùng Nano Banana thay vì ảnh Stock?
- Khi cần hình ảnh **mang tính ý niệm cao** (ví dụ: *"Một du khách nữ ngồi bên ban công cổ điển Hà Nội, ánh nắng sớm rọi qua tán cây bàng"*).
- Khi tạo các **ảnh 3D Miniature Figurine / Diorama** theo trào lưu viral của Nano Banana (mô hình sa bàn thu nhỏ góc phố Tàu, gánh hàng rong, xích lô phố cổ).
- Khi ảnh stock trên mạng quá cứng nhắc hoặc không đúng trang phục, góc máy theo tinh thần thương hiệu TravelFrame.

### 3.3. Quy Chuẩn Prompt Chuẩn Gu TravelFrame (Aesthetic Guidelines)

| Quy tắc | Cần làm (Do) | Tuyệt đối tránh (Don't) |
|---|---|---|
| **Chất lượng da & người** | Miêu tả nét mặt tự nhiên, da có kết cấu thực tế, nụ cười chân thật, ánh mắt có chiều sâu. | Da bóng nhựa (plastic skin), răng trắng sứ siêu thực, tạo dáng gượng gạo của AI. |
| **Góc máy & ống kính** | Chỉ định thông số nhiếp ảnh: `35mm prime lens`, `f/2.0`, `natural documentary perspective`, `subtle 35mm film grain`. | Ảnh vẽ CGI, hiệu ứng 3D game fantasy trừ khi làm diorama. |
| **Bảng màu Hà Nội** | Vàng đất Pháp cổ (weathered ochre yellow), xanh rêu cổ kính, tán bàng xanh mướt, ánh nắng vàng sớm (golden hour). | Màu neon chói lọi, tương phản gắt gao phi thực tế. |
| **Tôn trọng văn hóa (V-09)** | Trang phục nhã nhặn, kín đáo khi ở đình chùa (áo dài, sơ mi linen); thể hiện nếp sống bình dị, ấm áp của người Hà Nội. | Biến dạng trang phục dân tộc, sai lệch kiến trúc tâm linh. |

### 3.4. Mẫu Prompt Thực Chiến

#### Mẫu 1: Bìa Bài Viết Blog Chuyên Nghiệp (Tỷ lệ 16:9 hoặc 3:2)
```text
Candid documentary travel photograph of an international solo traveler walking through a quiet, sun-dappled alley in Hanoi Old Quarter. Morning golden hour light filtering through banyan tree leaves, weathered ochre-yellow French colonial walls with moss, vintage bicycles parked along stone pavement. Shot on 35mm prime lens, f/2.2, subtle film grain, natural cinematic color grading, authentic textures, photorealistic, no artificial gloss.
```

#### Mẫu 2: Sa Bàn Thu Nhỏ 3D Miniature Diorama (Tỷ lệ 1:1)
```text
A hyper-detailed 3D miniature diorama of a traditional Hanoi sidewalk coffee stall. Handcrafted clay and resin aesthetic, tilt-shift macro photography, tiny blue plastic stools, a miniature silver drip phin filter resting on a glass of iced coffee, tiny weathered French shophouse facade with glowing paper lanterns. Warm morning sunbeam, playful and whimsical, studio lighting, sharp depth of field.
```

---

## 4. Quy Chuẩn Lưu Trữ File Trong Workspace

```
Creative-Production/Assets/
├── Raw/                     # Ảnh gốc từ máy ảnh của nhiếp ảnh gia TravelFrame
├── Stock/                   # Ảnh tải từ Pexels API kèm file metadata .json
└── AI-Generated/            # Ảnh render từ Nano Banana kèm file prompt .txt/.json
```

---

## 5. Danh Mục Lệnh Tắt Trong `package.json`

Để tiện dụng cho toàn bộ thành viên, các lệnh sau đã được đăng ký:

- **Tìm kiếm nhanh:**
  ```bash
  npm run media:search -- "hanoi street food"
  ```
- **Tải ảnh nhanh:**
  ```bash
  npm run media:download -- 32014789
  ```
