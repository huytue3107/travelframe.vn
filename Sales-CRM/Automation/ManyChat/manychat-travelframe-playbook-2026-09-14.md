# TravelFrame ManyChat Playbook

Date: 2026-09-14

## Goal

Turn Instagram non-followers into:

1. Engaged followers who return for practical Vietnam and Hanoi tips.
2. Qualified travel leads with a known travel date, party type, and interest.
3. Photo-tour inquiries ready for a human reply.

Primary conversion path:

`Reel comment -> Private Reply -> Useful guide -> Follow prompt -> Lead qualification -> Photo-tour handoff`

## Voice

- English that international visitors can scan quickly.
- Warm local friend, practical, lightly playful.
- Give value before asking for a booking.
- One clear action per message.
- Do not promise Train Street access, exact prices, or availability.

## Core Automation Structure

### Step 1 - Public comment reply

Randomize between:

- `Sent it to your DMs 📩`
- `Your Hanoi guide is waiting in your inbox 👀`
- `Done! Check your message requests too ✨`

### Step 2 - Opening private reply

This first message should contain one button so the visitor actively opens the
conversation.

Message:

> Hey {{first_name}}! Your guide is ready 🇻🇳
> Tap below and I’ll send it right over.

Button:

`Send my guide`

### Step 3 - Deliver the promised value

Deliver useful information inside the DM. Do not require a follow before showing
the guide.

### Step 4 - Follow prompt

> Hope this makes your trip a little easier!
> Follow @travelframe.vn for practical local tips, hidden Hanoi spots, and
> photo-friendly routes.

Quick reply:

`Following ✅`

### Step 5 - Qualify the lead

> When are you visiting Hanoi?

Quick replies:

- `This month`
- `In 1-3 months`
- `Later this year`
- `Just researching`

Then:

> Who are you travelling with?

Quick replies:

- `Solo`
- `My partner`
- `Friends`
- `Family`

### Step 6 - Conversion bridge

> Nice! We can also suggest a Hanoi photo route that fits your travel style,
> with local guidance and natural photos along the way. Want to see the
> experience options?

Buttons:

- `Show me 📸`
- `Just travel tips`

For `Show me 📸`:

> Perfect. Send us your travel date and group size, and a local TravelFrame
> team member will help you personally.

Actions:

- Apply tag `TF_Intent_PhotoTour`.
- Notify or assign to a human.
- Mark as a qualified inquiry after travel date and group size are received.

For `Just travel tips`:

> No pressure at all. What would help most?

Quick replies:

- `Food spots`
- `Local itinerary`
- `Weather + packing`
- `Safety + money`

## Flow 1 - Keyword SAV

Trigger keywords:

`SAV`, `SAVE`, `SAFETY`, `SCAM`, common misspellings such as `SAC` and `SAB`.

Opening private reply:

> Hey {{first_name}}! Your Hanoi Safety Mini Guide is ready 🇻🇳
> Tap below to get it.

Button:

`Get the safety guide`

Guide message:

> HANOI SAFETY MINI GUIDE 📌
>
> 💵 Say the note amount out loud before handing over cash.
> 👟 Decline any shoe repair you did not request.
> 🍍 Ask the price before accepting props or fruit baskets for photos.
> 🚕 Use Grab or a reputable taxi and check the plate before getting in.
> 🚂 Follow barriers and local instructions at Train Street. Access can change.
> 💰 Keep smaller notes ready for street food and local shops.
>
> Save this message before your trip.

Follow prompt:

> Follow @travelframe.vn for more honest Hanoi tips without the travel panic ✨

Qualification question:

> Want the next guide too?

Quick replies:

- `Hanoi food map`
- `Money cheat sheet`
- `Photo spots`

## Flow 2 - Keyword HANOI

Trigger keywords:

`HANOI`, `HA NOI`, `HÀ NỘI`.

Opening private reply:

> Hey {{first_name}}! Here’s your Hanoi Starter Pack 🇻🇳
> Tap below and let’s make planning easier.

Button:

`Open my Hanoi guide`

Guide message:

> HANOI STARTER PACK
>
> 📍 Stay near the Old Quarter for a lively first visit, or around West Lake for
> a slower pace.
> 🚕 Use Grab and always check the plate before getting in.
> 💵 Carry some smaller cash notes for markets, street food, and local cafes.
> 👟 Pack comfortable shoes. Hanoi is best explored slowly and on foot.
> 🌦️ Bring light layers and check the live forecast 3-5 days before arrival.
> 🚂 Treat Train Street access as changeable and follow local barriers.

Follow prompt:

> Follow @travelframe.vn and we’ll keep your Hanoi planning simple, local, and
> actually useful.

Qualification:

Ask travel timing and party type, then offer:

- `Build my Hanoi route`
- `Show photo experiences`

## Flow 3 - Keyword VN

Trigger keywords:

`VN`, `VIETNAM`, `ROUTE`, `ITINERARY`.

Opening private reply:

> Your Vietnam route is ready 🇻🇳
> Tap below to choose your travel style.

Button:

`Plan my Vietnam trip`

Segmentation question:

> What kind of trip sounds most like you?

Quick replies:

- `Food + culture`
- `Nature + views`
- `Beaches + chill`
- `A bit of everything`

Next question:

> How many days do you have?

Quick replies:

- `3-5 days`
- `6-9 days`
- `10+ days`

Response:

> Great choice. We’ll use that to send you more relevant Vietnam ideas instead
> of random travel spam.

Hanoi bridge:

> Will Hanoi be part of your route?

Quick replies:

- `Yes`
- `Maybe`
- `Not this trip`

For `Yes` or `Maybe`, continue to the Hanoi route and photo-experience bridge.

## Flow 4 - Keyword PHOTO

Trigger keywords:

`PHOTO`, `PHOTOSHOOT`, `PHOTOTOUR`, `COUPLE`, `PORTRAIT`.

Opening message:

> Hey {{first_name}}! We’d love to help you turn Hanoi into more than random
> phone photos 📸

Question 1:

> What kind of experience are you looking for?

Quick replies:

- `Quick photo walk`
- `Photos + Reel`
- `Full-day story`
- `Not sure yet`

Question 2:

> Who will be in the photos?

Quick replies:

- `Just me`
- `Couple`
- `Friends`
- `Family`

Question 3:

> What date will you be in Hanoi?

User input:

Save to custom field `TF_Travel_Date`.

Question 4:

> Which Hanoi mood feels most like you?

Quick replies:

- `Heritage Hanoi`
- `Everyday Hanoi`
- `Hanoi in Style`
- `After Dark`

Handoff:

> Got it! A TravelFrame team member will check the route and availability, then
> reply personally. We don’t confirm a slot until the date and plan are agreed
> in writing.
>
> In the meantime, feel free to explore our tour packages and transparent pricing here:
> 🔗 https://travelframe.sidevn.com/tours?utm_source=instagram&utm_medium=dm&utm_campaign=inbound_pitch&utm_content=view_packages

Actions:

- Apply tag `TF_Intent_PhotoTour`.
- Apply party-type and mood tags.
- Assign conversation to a human.
- Notify the team with travel date, party type, and selected mood.

## Flow 5 - Default Reply and Main Menu

Default reply:

> Hey! I may not have understood that yet, but I can still help 👋
> What are you looking for?

Quick replies:

- `Hanoi tips`
- `Vietnam itinerary`
- `Photo experience`
- `Talk to a person`

Main Menu:

- `Plan Hanoi`
- `Travel safely`
- `Photo experiences`
- `Talk to TravelFrame`

Conversation Starters:

- `What should I know before visiting Hanoi?`
- `Help me plan my Hanoi route`
- `Tell me about your photo experiences`
- `I want to talk to the team`

## Tags

- `TF_Source_IG_SAV`
- `TF_Source_IG_HANOI`
- `TF_Source_IG_VN`
- `TF_Source_IG_PHOTO`
- `TF_Trip_ThisMonth`
- `TF_Trip_1to3Months`
- `TF_Trip_Later`
- `TF_Researching`
- `TF_Party_Solo`
- `TF_Party_Couple`
- `TF_Party_Friends`
- `TF_Party_Family`
- `TF_Intent_PhotoTour`
- `TF_Intent_TravelTips`
- `TF_Status_Qualified`
- `TF_Status_HumanHandoff`

## Custom Fields

- `TF_Travel_Date`
- `TF_Trip_Horizon`
- `TF_Party_Type`
- `TF_Party_Size`
- `TF_Travel_Style`
- `TF_Hanoi_Mood`
- `TF_Content_Interest`
- `TF_Source_Post`

## Launch Order

1. Replace the generic `SAV` template and test it with the existing scam Reel.
2. Configure Default Reply, Main Menu, and Conversation Starters.
3. Add `HANOI` for weather, local tips, and Hanoi planning Reels.
4. Add `PHOTO` as the direct inquiry flow.
5. Add `VN` only after a real itinerary deliverable is approved.

Do not activate `VN` with a promised downloadable itinerary until the itinerary
actually exists.

## Weekly Metrics

- Reel comments by keyword.
- Opening-message button click rate.
- Guide delivery rate.
- Reply rate to travel-timing question.
- Qualified inquiries.
- Human handoffs.
- Photo-tour bookings attributed to ManyChat.
- Instagram follower change during each campaign period.

Follower attribution is directional unless Instagram or ManyChat exposes a
verified follow event for this account.
