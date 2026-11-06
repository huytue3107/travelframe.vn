# Typography update — v04

Status: Review. Owner: Creative-Production. Date: 2026-11-05.

Rocky requested the supplied HeritageDisplay font for every scene headline and Montserrat for descriptions and captions. Embed the exact local font files in the project so rendering does not depend on installed fonts or external font requests.

Use HeritageDisplay Regular at 72 px with native kerning and a 2 px dark outline, retaining TravelFrame red #AE2A1D. The regular weight and thinner outline preserve the distinctive cuts and counters. Descriptions use Montserrat ExtraBold 800 at 30 px; synchronized captions use Montserrat Black 900 at 58 px. The small TravelFrame signature uses Montserrat Black.

Preserve every narration/caption word, all scene/audio timing, photos and v03 stop-motion/GIF cat animation. `revise-fonts-v04.mjs` asserts that script blocks remain byte-identical during the revision. `fonts-v04.json` records the font files, source paths, hashes and typography settings. The prior v03 editable scene source is retained in `source-v03.zip` and its MP4 remains available.

For reconstruction from the original builder, run v01 build, v02 cat revision, v03 motion revision, then v04 font revision in that order. Current scene HTML is already at v04 and should be opened directly for editing.

Review all scene headings, the longest Montserrat caption groups and accented Vietnamese names before delivery. Verify local font loading and actual font use rather than relying on declared CSS alone. Font provenance follows the supplied HeritageDisplay README and embedded SIL OFL 1.1 metadata in the existing local Montserrat files. No new external or paid service is needed.

Rendered: [TF-Hanoi-Three-Things-Heritage-v04.mp4](TF-Hanoi-Three-Things-Heritage-v04.mp4), 53.466667 seconds, 1080 × 1920 / 30 fps. All 18 scene samples and one decoded final-file frame were inspected. Actual glyph sources are verified for all headings and sampled descriptions/captions. Audio matches v03 exactly; a comparison of all 20 HTML files verifies that scripts and non-style markup are unchanged. QA: [qa-v04.md](../../Review/Hanoi-Three-Things-2026-11-05/qa-v04.md).
