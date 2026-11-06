# Asset provenance — Three things in Hanoi

Owner: Creative-Production. Status: Review. Checked: 2026-11-05.

## Fonts — v04

- Headings: exact user-supplied `Creative-Production/Assets/Fonts/HeritageDisplay/HeritageDisplay-Regular.woff2`, copied to `assets/fonts/HeritageDisplay-Regular.woff2`. Its source README is retained beside the embedded font; this is the reconstructed font described in that README.
- Descriptions: local `#9Slide03 Montserrat ExtraBold.ttf`, embedded as `assets/fonts/Montserrat-ExtraBold.ttf`, CSS weight 800.
- Captions/signature: local `#9Slide03 Montserrat Black.ttf`, embedded as `assets/fonts/Montserrat-Black.ttf`, CSS weight 900.
- Both Montserrat files declare SIL Open Font License 1.1 in their embedded metadata. Source paths and file hashes are recorded in `fonts-v04.json`. There are no remote font requests. `font-audit-v04.json` confirms actual glyph rendering from these custom font files.

## V02 cat assets retained in v04

All 18 cat placements now use nine newly generated original meme stickers, replacing the previous five variants in the video. Created with the built-in image generation tool, with genuine transparent alpha and a white cutout border. The full final prompt set, generated source filenames and project image paths are in [meme-cat-prompts-v02.json](meme-cat-prompts-v02.json).

The new set includes an astonished white/orange cat, hungry chubby orange tabby, laughing white Persian, screaming grey British shorthair, blissful cream cat, celebrating tuxedo, suspicious black cat, confident chubby sunglasses cat and silver tabby crying happy tears. Original generated files are retained. No additional voice generation or paid external API call was made for v02.

## Photos

The complete photo ledger is [assets/asset-register.json](assets/asset-register.json): 14 distinct Pexels images used in the render, including creator, source page and license link. Seven used photos come from the existing TravelFrame stock library; seven were downloaded from verified public Pexels image URLs without reading credentials. An additional older bridge portrait is retained as an excluded source and is not rendered. Named Hanoi landmarks use real photography. Food close-ups illustrate the named dishes, not specific restaurants.

The people shown in coffee/portrait/couple stock are not represented as TravelFrame guests, staff, testimonials or proof of bookings. The photography invitation is the user's supplied script. Final publication review should check the visible people and branded properties against the intended commercial use.

Pexels license: https://www.pexels.com/license/

## Cats and paper

Five transparent AI cat stickers and the blank white paper background are reused from the earlier projects in this chat, chiefly `Vietnam-Weather-Oct-Dec-2026-11-05/assets/`. The orange chubby cat, cream cat, curious tabby, surprised tuxedo and sunglasses cream cat give the food/coffee/walking chapters different expressions. No new paid image generation was used.

## Audio

- Adam voice: one ElevenLabs generation through the previously authorized authenticated CLI. Voice ID `pNInz6obpgDQGcFmaJgB`; model `eleven_multilingual_v2`; same settings as the weather reel. Request contains no credentials.
- Script and alignment match exactly: 786 characters / 145 whitespace-separated words.
- Music: instrumental generated locally by the original `make-sound.py` synthesis, reused as a production method from the weather project and generated to this video's duration. No third-party track or sample.
- Pop, whoosh and camera-like click: original local synthesis. No recorded camera sample.
- `assets/gsap.min.js`: reused GSAP runtime from the established project.

## Content verification

The full user script is preserved in [SCRIPT.md](SCRIPT.md). Its food, coffee, Hoan Kiem and Old Quarter suggestions were checked against the official Vietnam Tourism pages below. No prices, venue opening times, specific package inclusions, access guarantees or customer outcomes were added.

- https://vietnam.travel/things-to-do/explore-old-quarter-your-way/
- https://vietnam.travel/things-to-do/3-walking-tours-ha-noi/

This is an editorial suggestion for a Hanoi visit, not a live itinerary or a published offer. Listening, pronunciation of Vietnamese dish/place names and final publication approval remain distinct from the technical render checks.
