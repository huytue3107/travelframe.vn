# TravelFrame ManyChat - Ready-to-Paste Scripts

Date: 2026-09-14

## Mục tiêu

1. Tăng follower từ người đã comment vào Reel.
2. Gửi đúng nội dung đã hứa trước khi bán hàng.
3. Thu thập thời gian đi, số khách và nhu cầu.
4. Chuyển lead quan tâm tour/phototour sang đội TravelFrame.

## Nguyên tắc

- Voice: warm local friend, concise, practical, lightly playful.
- Dùng English đơn giản cho khách quốc tế.
- Mỗi tin nhắn chỉ có một hành động chính.
- Không hỏi email trước khi gửi tài liệu đã hứa.
- Không cam kết lịch, giá, Train Street access hoặc thời tiết.
- Tất cả booking cần được đội TravelFrame xác nhận trực tiếp.

---

## Flow 1 - Grow Followers From Comments

### Trigger

- Chọn `next post or reel` nếu chuẩn bị đăng nội dung mới.
- Ưu tiên `a specific word or words`.
- Keyword phải trùng CTA trên Reel, ví dụ: `HANOI`, `SAV`, `PHOTO`, `VN`.

### Opening DM

> Hey {{first_name}}! I’ve got the bonus guide from this post ready for you 🇻🇳
>
> Follow @travelframe.vn, then tap below and I’ll send it straight over.

Button:

`I’m following ✅`

### Sau khi khách follow

> Welcome to the TravelFrame community! ✨
>
> Here’s your guide 👇

Button:

`Open my guide`

### Follow-up nếu khách chưa hoàn tất

> Still planning your Vietnam trip?
>
> Your guide is waiting above. Follow @travelframe.vn and tap the button whenever
> you’re ready 🇻🇳

---

## Flow 2 - Keyword SAV: Hanoi Safety Guide

### Trigger

Reel: `Dc5hZioNTx0`

Keywords:

`SAV`, `SAVE`, `SAFETY`, `SCAM`, `SAC`, `SAB`

### Public replies

Randomize:

1. `Your Hanoi safety guide is on its way. Check your DMs 📩`
2. `Sent! Your local safety tips are waiting in your inbox 🇻🇳`
3. `Done ✨ Check your DMs and message requests!`

### Opening DM

> Hey {{first_name}}! Your Hanoi Safety Mini Guide is ready 🇻🇳
>
> Follow @travelframe.vn, then tap below and I’ll send it straight over.

Button:

`I’m following ✅`

### Guide delivery

> HANOI SAFETY MINI GUIDE 📌
>
> 💵 Say the note amount out loud before handing over cash.
> 👟 Decline any shoe repair you didn’t request.
> 🍍 Ask the price before accepting photo props or fruit baskets.
> 🚕 Use Grab or a reputable taxi and check the plate before getting in.
> 🚂 Follow barriers and local instructions at Train Street. Access can change.
> 💰 Keep smaller notes ready for street food and local shops.
>
> Save this message before your trip.

### Engagement question

> What would help you next?

Quick replies:

- `Money guide`
- `Hanoi itinerary`
- `Photo spots`

### Conversion bridge

After `Photo spots`:

> We can also help plan a local Hanoi route and guide your group, with natural
> travel photos along the way 📸
>
> When will you be in Hanoi?

Quick replies:

- `This month`
- `In 1-3 months`
- `Later this year`

Next:

> How many people are travelling?

Quick replies:

- `Just me`
- `2 people`
- `3-4 people`
- `5+ people`

Handoff:

> Perfect. A TravelFrame team member will check the route and availability, then
> reply personally. Please send your preferred date below.

Actions:

- Tag `TF_Source_SAV`.
- Tag `TF_Intent_PhotoTour`.
- Save preferred date.
- Assign to a human.

---

## Flow 3 - Keyword HANOI: Local Travel Tips

### Trigger

Keywords:

`HANOI`, `HA NOI`, `HÀ NỘI`, `LOCAL`

### Public replies

1. `Your Hanoi Starter Pack is waiting in your DMs 🇻🇳`
2. `Sent! Check your inbox for our local Hanoi tips 📩`
3. `Done — your Hanoi planning just got easier ✨`

### Opening DM

> Hey {{first_name}}! Your Hanoi Starter Pack is ready 🇻🇳
>
> Follow @travelframe.vn, then tap below to unlock it.

Button:

`I’m following ✅`

### Starter Pack

> HANOI STARTER PACK
>
> 📍 Old Quarter: lively, central and convenient for a first visit.
> 🌿 West Lake: slower, quieter and better for a relaxed stay.
> 🚕 Use Grab and always check the plate before getting in.
> 💵 Carry smaller cash notes for markets, street food and local cafes.
> 👟 Pack comfortable shoes. Hanoi is best explored slowly.
> 🌦️ Check the live forecast 3-5 days before arrival.
> 🚂 Train Street access can change, so always follow local barriers.

### Qualification

> When are you visiting Hanoi?

Quick replies:

- `This month`
- `In 1-3 months`
- `Later this year`
- `Just researching`

Next:

> Who are you travelling with?

Quick replies:

- `Solo`
- `My partner`
- `Friends`
- `Family`

### Offer

> Would you like the TravelFrame team to suggest a local route for your group?

Quick replies:

- `Yes, please`
- `Photo experience 📸`
- `Just send tips`

For `Yes, please`:

> Great! Send your preferred date and the number of guests. Our local team will
> check availability and reply personally.

For `Photo experience 📸`:

Start Flow 4.

For `Just send tips`:

> No problem. What are you most interested in?

Quick replies:

- `Food`
- `Weather`
- `Safety`
- `Hidden spots`

---

## Flow 4 - Keyword PHOTO: Tour and Phototour Conversion

### Trigger

Keywords:

`PHOTO`, `PHOTOSHOOT`, `PHOTOTOUR`, `PORTRAIT`, `COUPLE`

### Opening DM

> Hey {{first_name}}! We’d love to help turn your Hanoi trip into more than
> random phone photos 📸
>
> Let’s find the right experience for you.

Button:

`Plan my experience`

### Question 1

> What kind of experience are you interested in?

Quick replies:

- `Quick photo walk`
- `Photos + Reel`
- `Full-day story`
- `Not sure yet`

### Question 2

> Who will be in the photos?

Quick replies:

- `Just me`
- `Couple`
- `Friends`
- `Family`

### Question 3

> What date will you be in Hanoi?

User input:

Save as `TF_Travel_Date`.

### Question 4

> Which Hanoi mood feels most like you?

Quick replies:

- `Heritage Hanoi`
- `Everyday Hanoi`
- `Hanoi in Style`
- `After Dark`

### Human handoff

> Got it! A TravelFrame team member will check the route and availability, then
> reply personally.
>
> Your booking is only confirmed after the date, plan and inclusions are agreed
> in writing.
>
> In the meantime, you can explore our tour packages, routes, and live price estimates here:
> 🔗 https://travelframe.sidevn.com/tours?utm_source=instagram&utm_medium=dm&utm_campaign=inbound_pitch&utm_content=view_packages

Button:

`Explore Tours & Rates 📸` (URL: `https://travelframe.sidevn.com/tours?utm_source=instagram&utm_medium=dm&utm_campaign=inbound_pitch&utm_content=view_packages`)

Actions:

- Tag `TF_Intent_PhotoTour`.
- Save package interest, party type, travel date and mood.
- Assign to a human.
- Notify the TravelFrame team.

---

## Flow 5 - Keyword VN: Vietnam Trip Planning

### Trigger

Keywords:

`VN`, `VIETNAM`, `ROUTE`, `ITINERARY`

### Opening DM

> Hey {{first_name}}! Let’s make your Vietnam planning a little easier 🇻🇳
>
> Tap below and tell us what kind of trip you’re dreaming about.

Button:

`Plan my trip`

### Segmentation

> What travel style sounds most like you?

Quick replies:

- `Food + culture`
- `Nature + views`
- `Beaches + chill`
- `A bit of everything`

Next:

> How many days do you have?

Quick replies:

- `3-5 days`
- `6-9 days`
- `10+ days`

Next:

> Will Hanoi be part of your trip?

Quick replies:

- `Yes`
- `Maybe`
- `Not this time`

For `Yes` or `Maybe`:

> Perfect. When will you arrive in Hanoi?

Save the answer and offer:

- `Hanoi local route`
- `Photo experience`
- `Talk to the team`

Note:

Do not promise a downloadable `7D6N` itinerary until a real, approved itinerary
file is ready.

---

## Flow 6 - Default Reply and Main Menu

### Default Reply

> Hey! I may not have understood that yet, but I can still help 👋
>
> What are you looking for?

Quick replies:

- `Hanoi tips`
- `Vietnam itinerary`
- `Photo experience`
- `Talk to a person`

### Main Menu

- `Plan Hanoi`
- `Travel safely`
- `Photo experiences`
- `Talk to TravelFrame`

### Conversation Starters

- `What should I know before visiting Hanoi?`
- `Help me plan my Hanoi route`
- `Tell me about your photo experiences`
- `I want to talk to the team`

### Human handoff message

> Of course! Please send your travel date, group size and what you need help
> with. A TravelFrame team member will reply personally as soon as possible.

---

## Optional Email Capture

Only ask after the promised guide has been delivered.

> Want more Hanoi tips beyond Instagram? 🇻🇳
>
> Drop your email below for occasional local guides, photo-friendly routes and
> useful trip-planning updates.
>
> No spam — just genuinely helpful Vietnam tips.

---

## Recommended Tags

- `TF_Source_SAV`
- `TF_Source_HANOI`
- `TF_Source_VN`
- `TF_Source_PHOTO`
- `TF_Trip_ThisMonth`
- `TF_Trip_1to3Months`
- `TF_Trip_Later`
- `TF_Researching`
- `TF_Party_Solo`
- `TF_Party_Couple`
- `TF_Party_Friends`
- `TF_Party_Family`
- `TF_Intent_TravelTips`
- `TF_Intent_LocalTour`
- `TF_Intent_PhotoTour`
- `TF_Status_Qualified`
- `TF_Status_HumanHandoff`

## Recommended Custom Fields

- `TF_Travel_Date`
- `TF_Trip_Horizon`
- `TF_Party_Type`
- `TF_Party_Size`
- `TF_Travel_Style`
- `TF_Hanoi_Mood`
- `TF_Content_Interest`
- `TF_Source_Post`

## Launch Order

1. `SAV` for the existing safety Reel.
2. `HANOI` for local tips and weather content.
3. `PHOTO` for direct conversion.
4. Default Reply, Main Menu and Conversation Starters.
5. `VN` after the promised itinerary asset is approved.
