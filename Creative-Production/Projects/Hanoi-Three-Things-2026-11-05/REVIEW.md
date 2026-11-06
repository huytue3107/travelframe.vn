# Review — Three things in Hanoi

Status: Review. Owner: Creative-Production. Date: 2026-11-05.

## Current revision v04

All 18 scene headlines now use the exact user-supplied HeritageDisplay Regular font, embedded locally. The display size is 72 px, regular weight, with native kerning and a 2 px dark outline to retain the distinctive letter cuts. TravelFrame red #AE2A1D remains. Descriptions use Montserrat ExtraBold 800 and captions use Montserrat Black 900, also embedded locally.

All 18 scene samples were inspected in two contact sheets. Accented names including BÚN CHẢ and HOÀN KIẾM display correctly, long headings remain within their text boxes, and the larger Montserrat caption groups wrap clearly. A browser font audit confirms actual custom-font glyph use for all 18 titles plus description/caption samples; the 18 title and 42 caption containers have no horizontal overflow. Final composition checks have zero findings. The original v03 scripts and all non-style markup are retained; its source archive and MP4 are preserved.

## Previous revision v03

Rocky requested rhythmic jiggle in a stop-motion/GIF style. All nine cats now use expression-specific held poses on the original 108 BPM music grid: four pose steps per beat, 7.2 pose changes per second, held for four or five output frames. The 18 scenes contain 394 explicit finite pose keys, including stepped entrances and final settles. Repeating character motion is intentional for this request and supersedes the prior single-reaction treatment.

Every scene plus a consecutive-frame sequence at 1.17–1.53s was visually inspected. Caption spacing remains clear, with stronger belly wobble, head shake, hops, side-eye lean and sunglasses swagger. The final composition check has zero findings. Photos, headings, caption text, narration and music/SFX timing remain unchanged. The v02 source archive and MP4 are retained. Motion timing and pose metadata are saved in `motion-v03.json`.

## Previous revision v02

Rocky requested more diverse and stronger cat meme emotions. Every cat placement has been replaced with nine new original transparent stickers. The larger silhouettes and clear shock, hunger, laughter, side-eye, love, celebration, confidence and happy-tear reactions are paired with each spoken beat. A single short gesture animates each reaction, with no repeated idle loop. Photos, headings, captions, narration, timings and audio placement are preserved.

The complete source of v01 is retained in `source-v01.zip` and its MP4 is retained. Current scene HTML contains the v02 cat changes; `revise-cats-v02.mjs` applies this revision without rebuilding unrelated scene content. The asset and prompt manifest is `meme-cat-prompts-v02.json`. Final v02 measurements and validation belong in `qa-v02.md` under the project review folder.

## Previous v01 review

## Creative decisions

The existing paper/red/cat format is continued from the weather v02 rather than introducing a new visual direction. The supplied script becomes food → coffee → walking, then the photography invitation and Save CTA. There are 18 scenes, 36 photo placements, 14 distinct photographs, five cat variants and 42 caption groups. The full script and captions are preserved; headings are shorter editorial summaries.

The hook and a photo are already visible in frame zero. Three alternating collage arrangements, taped frames, a second-photo entrance, cat pops, selected punch-ins and camera flashes provide visual changes. Each numbered chapter has a transition cue; music and SFX are locally synthesized originals.

## Visual inspection and fixes

The original review export contains 36 beat samples and 17 seams, plus phone sheets. All scene opening/midpoint frames were inspected. Selected seams and phone-width frames were inspected for safe placement, readable caption highlights and the relationship between cat/photograph/headline.

- t=19.7s · egg coffee · original shot duration was only 1.14 seconds → carry the shot through “or order your favourite,” then change to the seated coffee portrait at “and find a seat.” New duration approximately 2.35 seconds.
- scene seams · title and photos all started invisible → keep each title visible on the cut and animate only its entrance scale, avoiding a blank stage frame.
- t=45–50s · portrait · the initial bridge portrait cropped the face and showed a railway-track setting → replace it with Pexels 28916432, a clear Hanoi portrait against a rustic wall. Excluded source retained, unused.

The weakest area is repeated food/Old Quarter imagery during the first chapter. Distinct photos, swapped frame arrangements, expression changes and dish-specific close-ups keep it legible; a future shoot could replace stock with original street-food and walking footage.

## Measurement and limits

The Adam request and returned character alignment match the supplied script, 786 characters / 145 whitespace-separated words. Voice duration is 52.152018 seconds. Timeline duration is 53.466667 seconds at 30 fps. Check results, final-file probe, full decode, checksum and mix measurements are recorded in the QA report.

The sound is measured, not independently listened to. Pronunciation of phở, bún chả and Hoàn Kiếm and the full mix still require listening review before publication. Photos of people are licensed stock illustrations, not TravelFrame guest/service evidence. No publication was performed.

HyperFrames reports four globally missing/outdated skills; the installed working CLI was retained. Several reused transparent cats exceed the 2 MB inline bundle threshold. Local preview/render resolves the packaged asset files; no standalone HTML bundle is being delivered or claimed self-contained.
