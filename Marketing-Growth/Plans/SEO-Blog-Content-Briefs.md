# TravelFrame — SEO Blog Content Briefs

**Status:** Draft
**Owner:** Marketing-Growth
**Created:** 2026-09-15
**Target:** Website `travelframe.sidevn.com` blog section

---

## Brief #1: Hanoi Travel Guide 2026 (Pillar Page)

### Overview
- **URL slug:** `/blog/hanoi-travel-guide-2026`
- **Target keywords:** `hanoi travel guide 2026`, `hanoi travel tips`, `visiting hanoi`
- **Word count:** 3,000-4,000 words
- **Type:** Pillar page — internal links to all other blog posts and tour pages
- **Persona:** P5 (First-timer), P1 (Solo traveler)
- **Intent:** Informational → Commercial
- **Schema:** FAQPage + TouristDestination

### Structure

1. **H1:** The Complete Hanoi Travel Guide 2026
2. **Intro:** Why Hanoi, best time to visit, what makes it different
3. **H2: Getting There & Getting Around**
   - Flights, visa (link to official source, date-checked)
   - Airport to city (Grab, bus — verified claims only)
   - Getting around: walking, Grab, cyclo
4. **H2: Where to Stay**
   - Old Quarter vs West Lake vs French Quarter
   - Budget ranges (indicative, per V-08)
5. **H2: What to See**
   - Top attractions with honest takes
   - Hidden gems (brand bridge to TravelFrame)
   - Internal link to: tour pages
6. **H2: What to Eat**
   - Must-try dishes with price ranges (verified per 06-Safety)
   - Internal link to: `/blog/hanoi-street-food-guide`
7. **H2: Best Photo Spots**
   - Internal link to: `/blog/best-photo-spots-hanoi`
   - Brand bridge: mention TravelFrame photo tour naturally
8. **H2: Safety Tips**
   - Based on verified claims from 06-Safety register
   - Internal link to: IG Scams content
9. **H2: Budget Breakdown**
   - Daily budget ranges (indicative)
   - Planning conversion rate (date-checked)
10. **H2: FAQ**
    - "Is Hanoi safe?" / "How many days in Hanoi?" / "Best time to visit?"
    - FAQPage schema markup
11. **CTA:** "Want a local to show you around? TravelFrame photo tours →"

### SEO Notes
- Update annually (include year in title)
- Build internal links from every other blog post
- Target featured snippet for "hanoi travel guide"
- Refresh prices/visa info quarterly

---

## Brief #2: Best Photo Spots in Hanoi

### Overview
- **URL slug:** `/blog/best-photo-spots-hanoi`
- **Target keywords:** `hanoi photo spots`, `instagram spots hanoi`, `hanoi photography locations`, `best places for photos hanoi`
- **Word count:** 2,000-2,500 words
- **Type:** Brand bridge content
- **Persona:** P2 (Couple), P3 (Creator), P1 (Solo)
- **Intent:** Informational → Commercial
- **Schema:** ItemList + TouristAttraction

### Structure

1. **H1:** 15 Best Photo Spots in Hanoi (A Photographer's Guide)
2. **Intro:** Why Hanoi is one of Southeast Asia's most photogenic cities
3. **H2: Old Quarter Spots** (5 locations)
   - Each with: what makes it special, best time, camera tips
   - Include "ask before photographing people" (V-09)
4. **H2: Iconic Landmarks** (4 locations)
   - Temple of Literature, St. Joseph's Cathedral, Long Bien Bridge, Opera House
5. **H2: Hidden Gems** (3 locations)
   - Less-known spots that TravelFrame guides know
   - Brand bridge: "Our guides take travelers here during photo tours"
6. **H2: Best Times for Light** (3 sections)
   - Golden hour locations
   - Blue hour locations
   - Rainy day locations (Hanoi rain creates atmosphere)
7. **H2: Photo Tips**
   - What to wear, how to pose, camera settings for street
8. **CTA:** "Skip the selfie stick. Book a TravelFrame photo tour →"

### SEO Notes
- High Pinterest + Google Images potential
- Each spot needs 1-2 high-quality images
- Include Google Maps embed or coordinates
- Target "People Also Ask" questions

---

## Brief #3: Hanoi Street Food Guide 2026

### Overview
- **URL slug:** `/blog/hanoi-street-food-guide`
- **Target keywords:** `hanoi street food`, `what to eat in hanoi`, `hanoi food guide`, `best food hanoi`
- **Word count:** 2,500-3,000 words
- **Type:** Utility content (high save/share potential)
- **Persona:** P1 (Solo), P4 (Friend group), P5 (First-timer)
- **Intent:** Informational
- **Schema:** ItemList + Recipe (for dishes)

### Structure

1. **H1:** The Honest Hanoi Street Food Guide 2026
2. **Intro:** Why Hanoi food is different, etiquette basics
3. **H2: The Must-Try Dishes** (8-10 dishes)
   - Phở, Bún Chả, Bánh Cuốn, Bánh Mì, Cà Phê Trứng, Bún Ốc, Chả Cá, Nem
   - Each: description, where to try, price range (indicative, V-08), photo
4. **H2: How to Eat Like a Local**
   - Follow the crowd, eat at peak hours
   - Point at dishes, use Google Translate
   - Ask price before sitting (V-07 verified claim)
5. **H2: Food Streets to Walk**
   - Hang Ma, Tong Duy Tan, Cam Chi, Ta Hien
6. **H2: Budget**
   - What $5 / $10 / $20 buys you (indicative ranges, V-08)
7. **H2: Safety**
   - Water, ice, allergies, chopsticks
8. **CTA:** "Eat Hanoi with a local guide → TravelFrame Culinary Tour"

### SEO Notes
- Strong Featured Snippet potential for dish lists
- Food photos essential (from TravelFrame portfolio or Pexels with credit)
- Include "hanoi food tour" keyword for commercial bridge
- Cross-link to tour page: A Taste of Hanoi Culinary Tour

---

## Brief #4: FAQ Page

### Overview
- **URL slug:** `/faq`
- **Target keywords:** long-tail questions about Hanoi tours
- **Type:** Conversion support + GEO optimization
- **Schema:** FAQPage

### Questions to Include

**About Hanoi:**
1. Is Hanoi safe for solo travelers?
2. What is the best time to visit Hanoi?
3. How many days should I spend in Hanoi?
4. Do I need a visa to visit Vietnam?
5. What currency is used in Vietnam?

**About TravelFrame:**
6. What is TravelFrame?
7. What's included in a TravelFrame tour?
8. How much does a TravelFrame tour cost?
9. How do I book a tour?
10. How many photos do I get?
11. When do I receive my photos?
12. What if it rains?
13. Can I customize my tour route?
14. Do you offer tours for couples/groups?
15. Do you take video too?

### SEO Notes
- Each answer 50-100 words
- FAQ schema for Google rich results
- Link each answer to relevant tour page
- AI-extractable structure (clear headings, bullets)

---

## TouristTrip Schema Recommendation

Add to each tour detail page:

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": "The Spiritual & West Lake Breeze",
  "description": "Private Hanoi tour exploring temples, pagodas and West Lake with professional photography.",
  "touristType": "Cultural tourism",
  "itinerary": {
    "@type": "ItemList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Ho Chi Minh Mausoleum"},
      {"@type": "ListItem", "position": 2, "name": "Quan Thanh Temple"}
    ]
  },
  "offers": {
    "@type": "Offer",
    "price": "250",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "provider": {
    "@type": "LocalBusiness",
    "name": "TravelFrame",
    "url": "https://travelframe.sidevn.com"
  },
  "duration": "PT6H",
  "maximumAttendeeCapacity": 4
}
```

Apply similar schema to all 7 tour pages. This enables Google rich results
showing price, duration, and availability directly in search.
