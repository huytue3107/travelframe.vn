---
title: Where to Eat in Hanoi Old Quarter — bộ bài viết
owner: Marketing-Growth
status: Published 2026-11-12 (node 124) — xem Publication.md
created: 2026-11-12
---

# Nội dung

| File | Nội dung |
|---|---|
| [Keyword-Plan.md](Keyword-Plan.md) | Cụm từ khoá, bản đồ chống trùng, lệnh OpenSEO cần chạy |
| [Page-Copy.md](Page-Copy.md) | Bài tiếng Anh: 12 quán, địa chỉ, giờ, giá, nhận xét khách, FAQ |
| [Sources-And-Claims.md](Sources-And-Claims.md) | Nguồn từng claim, điểm cần kiểm thực địa |
| [Photo-Plan.md](Photo-Plan.md) | 10 ảnh giấy phép mở đã tải + shot list chụp mới |
| `assets/commons/` | Ảnh Wikimedia Commons 1280px |

# Metadata đề xuất

- H1: Where to Eat in Hanoi Old Quarter: 12 Local Spots with Addresses (2026)
- SEO title: Best Food in Hanoi Old Quarter: 12 Spots + Addresses (CMS thêm " | TravelFrame Vietnam")
- Meta description: xem frontmatter Page-Copy (≈155 ký tự)
- Slug: `/news/where-to-eat-hanoi-old-quarter`
- Schema: Article (template có sẵn) + FAQPage + ItemList (cần Sơn hỗ trợ nếu CKEditor lọc `<script>`)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Where to eat in Hanoi Old Quarter",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "item": {"@type": "Restaurant", "name": "Phở Gia Truyền", "address": "49 Bát Đàn, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 2, "item": {"@type": "Restaurant", "name": "Phở Khôi Hói", "address": "50 Hàng Vải, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 3, "item": {"@type": "Restaurant", "name": "Xôi Yến", "address": "35B Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 4, "item": {"@type": "Restaurant", "name": "Bún Chả Đắc Kim", "address": "1 Hàng Mành, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 5, "item": {"@type": "Restaurant", "name": "Bún Chả Ta", "address": "21 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 6, "item": {"@type": "Restaurant", "name": "Bún Bò Nam Bộ Bách Phương", "address": "73-75 Hàng Điếu, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 7, "item": {"@type": "Restaurant", "name": "Miến Lươn Đông Thịnh", "address": "87 Hàng Điếu, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 8, "item": {"@type": "Restaurant", "name": "Bánh Mì 25", "address": "25 Hàng Cá, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 9, "item": {"@type": "CafeOrCoffeeShop", "name": "Café Giảng", "address": "39 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 10, "item": {"@type": "Restaurant", "name": "Chè Bốn Mùa", "address": "4 Hàng Cân, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese desserts", "priceRange": "₫"}},
    {"@type": "ListItem", "position": 11, "item": {"@type": "Restaurant", "name": "Chả Cá Thăng Long", "address": "6B Đường Thành, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫₫"}},
    {"@type": "ListItem", "position": 12, "item": {"@type": "Restaurant", "name": "Phở Gà Nguyệt", "address": "5B Phủ Doãn, Hoàn Kiếm, Hà Nội", "servesCuisine": "Vietnamese", "priceRange": "₫"}}
  ]
}
```

# Link nội bộ

Bài mới link ra (7): node 65 street food guide, node 117 food map, bún chả/Lã Vọng/Bami/Café Giảng/Tạ Hiện, `/hanoi-photoshoot`.

Đề xuất link vào (cần Rocky duyệt khi sửa node live):
- Node 105 Old Quarter guide, mục "Where to eat": thêm 1 câu dẫn sang bài này.
- Node 65 street food guide, Part 4: thêm 1 câu "addresses by time of day".
- 6 bài C4 lẻ: thêm link "More Old Quarter food spots" (đúng ghi chú "thêm link hub C4" của content audit 07/10).

# Trước khi đăng

1. Chạy OpenSEO (Keyword-Plan mục 5), chỉnh title/H2 theo số liệu.
2. Chụp ít nhất nhóm P0 trong Photo-Plan; thay ảnh cũ.
3. Kiểm thực địa giá Đắc Kim, Xôi Yến.
4. Rocky duyệt nội dung và publish (agent không tự đăng).
