# Internal Linking Architecture & Keyword Flow Matrix

- **Chủ trì:** Marketing-Growth
- **Trạng thái:** `Review`
- **Mục tiêu:** Thiết lập cấu trúc liên kết nội bộ chặt chẽ (Silo Architecture) dẫn dắt dòng chảy thẩm quyền (PageRank Flow) từ các bài viết hút traffic vĩ mô (TOFU / MOFU) về thẳng các trang dịch vụ chuyển đổi cao (BOFU Service Pages).

---

## 1. Sơ Đồ Dòng Chảy Liên Kết (Topic Silo Flow)

```text
[TOFU: Cẩm nang sinh tồn & Tiện ích]
  ├── /guides/how-to-cross-street-hanoi (Traffic sang đường)
  └── /guides/hanoi-currency-and-airport-guide (Traffic sân bay & đổi tiền)
        │
        ▼ (Internal links dẫn dắt về lịch trình & góc chụp)
[MOFU: Nam châm địa điểm & Bài so sánh]
  ├── /blog/best-photo-spots-hanoi (15 góc máy đẹp)
  ├── /blog/train-street-hanoi-safety-guide (An toàn đường tàu 2026)
  ├── /compare/flytographer-alternative-hanoi (Đánh chặn Flytographer)
  └── /compare/travelframe-vs-airbnb-and-tubudd (Đánh chặn Airbnb & Tubudd)
        │
        ▼ (Internal links chốt hạ thương mại với CTA rõ ràng)
[BOFU: Trang dịch vụ cốt lõi & Booking]
  ├── /private-photographer-hanoi (Core Service Page)
  ├── /tours/solo-traveler-photo-walk (Solo Female Package)
  ├── /packages/couple-photoshoot (Couple & Honeymoon Package)
  └── /tours/ao-dai-photo-experience (Ao Dai Experience)
        │
        ▼ (Chuyển đổi thực tế)
[Direct WhatsApp / Instagram DM / Booking Form]
```

---

## 2. Bảng Ma Trận Anchor Text & Đích Đến

| Trang nguồn (Source Page) | Anchor Text tự nhiên | Trang đích (Target Page) | Mục đích SEO |
|---|---|---|---|
| `/guides/how-to-cross-street-hanoi` | "guided private photo walk in Hanoi" | `/private-photographer-hanoi` | Chuyển đổi khách sợ sang đường sang có người dẫn |
| `/guides/how-to-cross-street-hanoi` | "15 best photo spots in Hanoi" | `/blog/best-photo-spots-hanoi` | Giữ chân người dùng đọc tiếp về địa điểm |
| `/guides/how-to-cross-street-hanoi` | "free 24h Hanoi Visual Guide" | `/free-guides/24h-hanoi-visual-guide` | Thu thập Lead Email/WhatsApp |
| `/guides/hanoi-currency-and-airport-guide`| "private photographer in Hanoi" | `/private-photographer-hanoi` | Khách vừa hạ cánh tìm dịch vụ chụp ảnh |
| `/guides/hanoi-currency-and-airport-guide`| "24h Hanoi visual itinerary" | `/free-guides/24h-hanoi-visual-guide` | Tải cẩm nang lịch trình |
| `/blog/best-photo-spots-hanoi` | "private Hanoi photo tour" | `/tours/hanoi-photo-walk` | Chốt khách muốn chụp tại 15 góc máy này |
| `/blog/best-photo-spots-hanoi` | "solo traveler photo walk" | `/tours/solo-traveler-photo-walk` | Hướng tới khách nữ đi một mình |
| `/blog/best-photo-spots-hanoi` | "train street safety guide 2026" | `/blog/train-street-hanoi-safety-guide` | Điều hướng sang bài an toàn đường ray |
| `/blog/train-street-hanoi-safety-guide` | "private photographer in Hanoi Old Quarter" | `/private-photographer-hanoi` | Khách muốn có thợ dẫn vào đường tàu an toàn |
| `/compare/flytographer-alternative-hanoi`| "transparent Hanoi photo packages" | `/private-photographer-hanoi` | So sánh giá xong xem bảng giá thực tế |
| `/compare/flytographer-alternative-hanoi`| "couple photoshoot in Hanoi" | `/packages/couple-photoshoot` | Dành cho cặp đôi muốn tiết kiệm chi phí |
| `/compare/travelframe-vs-airbnb-and-tubudd`| "book your private Hanoi photo session" | `/private-photographer-hanoi` | Khách chán tour nhóm Airbnb đặt tour riêng |

---

## 3. Quy Tắc Liên Kết Ngược (Breadcrumbs & Back-to-Hub)

Mọi bài viết cấp 2 và cấp 3 đều phải có Breadcrumb Schema hiển thị:
`Home > Blog / Guides > [Tên bài viết]`
Đồng thời ở chân trang luôn có cụm liên kết "Explore More Hanoi Experiences" dẫn về trang chủ và danh mục tour đầy đủ.
