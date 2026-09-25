# TravelFrame — IG Profile Optimization Guide

**Status:** Draft
**Owner:** Marketing-Growth
**Created:** 2026-09-15
**Depends on:** Rocky approval for primary conversion path

---

## 1. Bio Optimization

### Current Issue
Bio chưa rõ ràng về dịch vụ photo tour. Visitor đến từ Reels utility content
nhưng không hiểu TravelFrame bán gì.

### Recommended Bio

```
📸 Private Hanoi Photo Tours
Explore Hanoi with a local friend.
We guide. You explore. You keep the photos.
👇 Book your experience
[link with UTM]
```

**Giải thích lựa chọn:**
- Dòng 1: Định danh rõ — `Private Hanoi Photo Tours` (keyword chính)
- Dòng 2: Brand promise ngắn gọn theo Guest Guide
- Dòng 3: Value prop 3 mệnh đề (V-02 voice rule: câu ngắn, mỗi ý 1 câu)
- Dòng 4: CTA rõ ràng hướng về link
- Emoji: ≤5, mỗi emoji gắn ý nghĩa (V-03)

### Bio Link UTM

```
https://travelframe.sidevn.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio_link&utm_content=profile
```

---

## 2. Highlights Structure

| Highlight | Icon Color | Nội dung | Mục đích |
|---|---|---|---|
| `PHOTOTOUR` | Teal `#008AA3` | Tour walkthrough, BTS, client reactions | Giải thích dịch vụ |
| `HANOI` | Teal `#008AA3` | Best spots, tips, local discovery | Travel utility |
| `REVIEWS` | Teal `#008AA3` | Testimonials, client photos (khi có consent) | Social proof |
| `PRICE` | Teal `#008AA3` | Packages overview, what's included | Giảm friction |
| `FAQ` | Teal `#008AA3` | How to book, what to wear, meeting point | Trust building |

### Cover Specs
- Size: 1080 x 1920 px (Stories dimension)
- Display area: center 640 x 640 px circle
- Style: Icon trắng trên nền teal `#008AA3`, minimal
- Font: Sans-serif, bold, ALL CAPS
- Không gradient, không decorative orb (theo brand visual identity)

---

## 3. Pinned Posts Strategy

### Pin #1: "What is TravelFrame?" (Brand Explainer)
- **Format:** Carousel 5-7 slides
- **Content:**
  - Slide 1: "Not just a tour. Not just a photoshoot."
  - Slide 2: "Explore Hanoi with a local friend"
  - Slide 3: "Choose your mood" (4 moods: Heritage, Everyday, Style, After Dark)
  - Slide 4: "We handle the route. You enjoy the day."
  - Slide 5: "Go home with photos you'll actually love."
  - Slide 6: "Starting from $56/person" (Experience + Photo Phone)
  - Slide 7: CTA — "DM us your travel dates 💬"
- **CTA:** DM @travelframe.vn

### Pin #2: Portfolio Showcase
- **Format:** Carousel 10 slides
- **Content:** Best photography work across 4 moods
  - Mix of Heritage Hanoi, Everyday Hanoi, Hanoi in Style, Hanoi After Dark
  - Each slide: full-bleed photo + subtle location tag overlay
- **Caption:** "This is what your Hanoi trip could look like. Every photo taken during a real TravelFrame experience."
- **CTA:** Save for your trip planning

### Pin #3: Social Proof / BTS
- **Format:** Reel 30-45s
- **Content:** POV footage of a photo tour in action
  - Nếu chưa có client consent: dùng test shoot, framing thành thật
  - Theo điều kiện sản xuất trong Content Calendar mục 5
- **CTA:** DM to book your experience

---

## 4. UTM Parameter Templates

### Standard UTM Convention

| Parameter | Convention | Example |
|---|---|---|
| `utm_source` | Platform name | `instagram`, `tiktok`, `facebook`, `google` |
| `utm_medium` | Channel type | `social`, `organic`, `cpc`, `email`, `referral` |
| `utm_campaign` | Campaign slug | `bio_link`, `scams_reel`, `24h_hanoi` |
| `utm_content` | Content variant | `profile`, `story_swipeup`, `reel_caption` |

### Pre-Built UTMs

| Use Case | Full URL |
|---|---|
| Bio link | `travelframe.sidevn.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio_link&utm_content=profile` |
| Story swipe-up | `travelframe.sidevn.com/?utm_source=instagram&utm_medium=social&utm_campaign=story_link&utm_content=swipeup` |
| Reel caption link | `travelframe.sidevn.com/?utm_source=instagram&utm_medium=social&utm_campaign={reel_slug}&utm_content=caption` |
| TikTok bio | `travelframe.sidevn.com/?utm_source=tiktok&utm_medium=social&utm_campaign=bio_link&utm_content=profile` |
| Email CTA | `travelframe.sidevn.com/?utm_source=email&utm_medium=email&utm_campaign={email_slug}&utm_content=cta_button` |
| Facebook post | `travelframe.sidevn.com/?utm_source=facebook&utm_medium=social&utm_campaign={post_slug}&utm_content=post_link` |

---

## 5. Implementation Checklist

- [ ] Rocky approves bio text
- [ ] Update IG bio with UTM link
- [ ] Create 5 Highlight covers (teal icons)
- [ ] Populate Highlights with existing Story content
- [ ] Create Pin #1 carousel (brand explainer)
- [ ] Create Pin #2 carousel (portfolio)
- [ ] Create Pin #3 reel (BTS / test shoot)
- [ ] Pin all 3 posts
- [ ] Verify UTM tracking in GA4 (test click → check realtime)
