# Website pricing fix recommendations

Owner: Brand-Strategy / Executive  
Target: Website `travelframe.sidevn.com` and ManyChat booking flow  
Status: Draft for Rocky approval  

## Problem with the current pricing setup

The current website uses a compound estimator:

`Tour package base price + Visual package hourly rate x duration + add-ons`

This formula causes several problems for international travelers:

1. Visitors have to make two separate choices before knowing the cost. They must pick a Tour Package (Experience, Standard, Plus) and a Visual Package (Phone, Explorer, Complete, VIP).
2. The math is confusing. A Standard tour with the Complete package shows as $150 plus $50 times 3 hours, equaling $300. Most users do not understand why they are paying both a tour fee and an hourly photo fee.
3. The Phone package at $8 per hour undercuts the brand. Offering an iPhone package makes TravelFrame look like an amateur service instead of a specialized photography experience.
4. Turnaround times are too slow. Explorer takes 2 days, and Complete or VIP takes 3 days. Travelers staying in Hanoi for only 2 or 3 days want their photos before leaving for Halong Bay or Ninh Binh.

## Recommended pricing models

### Option 1. Flat rate by group size (recommended)

This model charges per session based on how many people join. Turnaround for all tiers is 24 hours.

| Package | Duration | Photos included | Delivery | Price (USD) | Price (VND) |
|---|---|---|---|---|---|
| Solo traveler | 1.5 hours | 35 color-graded photos | 24 hours | $75 | 1.950.000đ |
| Couple or pair | 2.0 hours | 50 color-graded photos | 24 hours | $130 | 3.380.000đ |
| Friends or family (3 to 5 people) | 2.5 hours | 70 color-graded photos | 24 hours | $180 | 4.680.000đ |

Included in every session:
- Private local photographer guide
- Walking route through Old Quarter streets and alleys
- Coffee or tea stop at a local cafe
- Private online gallery link with high-resolution downloads

Why this works:
- Solo travelers see a single $75 price tag, which fits common holiday budgets.
- Couples pay $65 per person, which is competitive with Airbnb Experiences in Hanoi.
- The 24-hour turnaround gives travelers a clear reason to book early in their stay.

### Option 2. Base session plus extra person

This model sets a base rate for one or two people, then adds a flat fee for each additional guest.

| Item | Details | Price (USD) |
|---|---|---|
| Standard private session | Up to 2 people, 1.5 hours, 40 photos, 24-hour delivery | $89 |
| Additional person | Includes 10 extra photos | +$30 per person |
| Extra 30 minutes | For additional locations like Long Bien Bridge | +$35 |

Why this works:
- Keeps the website menu simpler with one primary product.
- Groups can self-calculate easily without complex configurator math.

## Copy for the website booking page

Use this text on the pricing page:

```text
Private Hanoi photo tours

Simple pricing. No hidden fees. All photos delivered within 24 hours.

Solo Session
$75 (1.5 hours)
Designed for solo travelers. 35 edited digital photos, Old Quarter walking route, and a coffee break.

Couple Session
$130 (2 hours)
For couples and travel pairs. 50 edited digital photos, quiet heritage corners, and natural candid shots.

Small Group
$180 (2.5 hours)
For groups of 3 to 5 friends or families. 70 edited digital photos, group and individual portraits.

Need a custom time or larger group? Message us on Instagram @travelframe.vn or WhatsApp.
```

## ManyChat automated reply text

When a user comments or sends a DM asking for prices, send this text:

```text
Hi there! Here is our standard private photo tour pricing:

- Solo traveler: $75 (1.5h, 35 edited photos)
- Couple or pair: $130 (2h, 50 edited photos)
- Small group (3 to 5 people): $180 (2.5h, 70 edited photos)

All sessions include private guidance through the Old Quarter, a local coffee stop, and 24-hour photo delivery.

What dates will you be in Hanoi?
```
