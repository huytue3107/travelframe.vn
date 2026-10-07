# Onpage SEO Specification: TravelFrame Homepage

- **URL:** `https://travelframe.vn/`
- **Tài liệu tham chiếu:** `Marketing-Growth/SEO/30-Day-SEO-Execution-Sprint/`
- **Chủ trì:** Marketing-Growth
- **Trạng thái:** `Review`
- **Mục tiêu:** Tối ưu hoá toàn diện trang chủ làm cổng đón chính cho các từ khoá thương mại ngắn và định danh thực thể thương hiệu trên Google Search.

---

## 1. Metadata & Thẻ Tiêu Đề (Onpage Meta)

| Thuộc tính | Nội dung tối ưu | Ghi chú & Giới hạn ký tự |
|---|---|---|
| **Title Tag** | `Private Hanoi Photo Tours & Vacation Photographer \| TravelFrame` | 64 ký tự (chuẩn hiển thị Google Desktop & Mobile) |
| **Meta Description** | `Discover Hanoi through the lens of a trusted local friend. Private candid photo walks, secret Old Quarter alleys, professional gear, and 48-hour delivery.` | 154 ký tự (chứa các từ khoá chính, gợi mở lợi ích rõ ràng) |
| **Canonical URL** | `https://travelframe.vn/` | Tránh trùng lặp nội dung với subdomain |
| **Open Graph Title** | `Private Hanoi Photo Tours & Vacation Photographer \| TravelFrame` | Hiển thị khi chia sẻ trên Facebook, WhatsApp, Threads |
| **Open Graph Description**| `Private candid photo walks and authentic local discovery in Hanoi. Get natural, cinematic travel memories delivered in 48 hours.` | Thân thiện với mạng xã hội |
| **Primary Keywords** | `hanoi photo tour`, `private photographer in hanoi`, `hanoi photo walk`, `vacation photographer vietnam`, `candid photographer hanoi` | Nhóm từ khoá Tier 1 P1 Gold |

---

## 2. Cấu Trúc Headings (H1 - H3 Hierarchy)

### `H1`: Experience Hanoi with a Local Friend Behind the Lens
> Dẫn nhập: Dẹp bỏ sự ngượng ngùng trước ống kính máy ảnh. Chúng tôi không chụp những bức ảnh lưu niệm cứng nhắc. TravelFrame đồng hành cùng bạn như một người bạn bản địa ấm áp, dẫn bạn qua những con ngõ thơm mùi cà phê và ghi lại những khoảnh khắc tự nhiên, giàu cảm xúc nhất.

### `H2`: Private Walking Photo Tours in Hanoi's Historic Heart
- `H3`: The Old Quarter Heritage Walk: French colonial shadows, morning markets, and steam from street-side pho cauldrons.
- `H3`: Sunrise on Long Bien Bridge: Catch the golden hour mist over the Red River alongside early commuter bicycles.
- `H3`: Train Street & Hidden Rail Alleys: Behavior-first safety routes through local living spaces away from mass tourist scuffles.

### `H2`: Why Travelers Choose TravelFrame Over Mass Marketplaces
- `H3`: Authentic Storytelling, Zero Stiff Posing: We guide your motion naturally so you feel relaxed and confident.
- `H3`: Professional Full-Frame Cameras & Prime Lenses: Crisp documentary aesthetics that smartphones cannot replicate.
- `H3`: Fast 48-Hour High-Resolution Delivery: Fully edited photos ready for your social feed while your trip is still unfolding.
- `H3`: Direct Local Connection: No middleman platform fees, no surprise costs, just honest local hospitality.

### `H2`: Transparent Experience Packages
- `H3`: Solo Traveler Explorer (2 Hours, Old Quarter Focus)
- `H3`: Couple & Honeymoon Walk (3 Hours, Romance & Hidden Cafes)
- `H3`: Cultural Ao Dai Experience (3 Hours, Heritage Temples & Traditional Costume)

### `H2`: Frequently Asked Questions (FAQ Section)
- `H3`: What if I am awkward in front of the camera?
- `H3`: How soon will I receive my edited photos?
- `H3`: What happens if it rains during our scheduled walk?
- `H3`: How do we meet up on the morning of the tour?

---

## 3. Mã Cấu Trúc Dữ Liệu Schema (JSON-LD)

Nhúng trực tiếp vào thẻ `<head>` của trang chủ để kích hoạt Rich Snippets trên kết quả tìm kiếm Google:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://travelframe.vn/#organization",
      "name": "TravelFrame",
      "url": "https://travelframe.vn",
      "logo": "https://travelframe.vn/assets/logo.png",
      "image": "https://travelframe.vn/assets/hanoi-photo-tour-hero.jpg",
      "description": "Boutique private photo walks and authentic travel experiences in Hanoi, Vietnam.",
      "telephone": "+84-98-123-4567",
      "email": "hello@travelframe.vn",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Old Quarter, Hoan Kiem District",
        "addressLocality": "Hanoi",
        "addressRegion": "Hanoi",
        "postalCode": "100000",
        "addressCountry": "VN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.0333,
        "longitude": 105.8500
      },
      "priceRange": "$$ (USD 40 - 150)",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "06:00",
          "closes": "21:00"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/travelframe.vn",
        "https://www.threads.net/@travelframe.vn"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://travelframe.vn/#photo-tour-service",
      "name": "Private Hanoi Photo Tours & Vacation Photography",
      "provider": {
        "@id": "https://travelframe.vn/#organization"
      },
      "serviceType": "Vacation Photography and Guided Walking Tour",
      "areaServed": {
        "@type": "City",
        "name": "Hanoi"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Hanoi Photo Tour Experiences",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Solo Traveler Photo Walk"
            },
            "price": "80",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Couple & Honeymoon Photo Experience"
            },
            "price": "140",
            "priceCurrency": "USD"
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://travelframe.vn/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What if I feel awkward or shy in front of the camera?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Almost all our guests tell us they are camera-shy! We do not ask you to freeze into artificial poses. Instead, we walk together, stop for egg coffee, browse fruit stalls, and capture natural in-between moments while you take in the city."
          }
        },
        {
          "@type": "Question",
          "name": "How quickly do I get my photos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You will receive a private preview link within 24 hours and your complete set of edited, high-resolution photos within 48 hours directly via Google Drive or private online gallery."
          }
        }
      ]
    }
  ]
}
</script>
```

---

## 4. Kiến Trúc Lời Kêu Gọi Hành Động (CTA Architecture)

1. **Primary Hero CTA:**
   - Nút 1: `"Book Your Private Photo Walk"` -> Mở Modal / Cuộn xuống Booking Section.
   - Nút 2: `"Chat on WhatsApp (+84 98...) / Instagram DM"` -> Liên hệ tức thì không cần chờ đợi.
2. **Sticky Header CTA:**
   - Nút `"Check Availability"` nổi bật ở góc phải màn hình desktop và thanh đáy mobile.
3. **Mid-page Trust Signal:**
   - Cam kết 3 không: *No stiff posing • No hidden fees • 48-hour photo delivery guarantee*.
