---
name: visual-asset-pipeline
description: "Curate authentic travel stock photography via Pexels API and render AI imagery using Nano Banana for TravelFrame."
---

# Visual Asset Pipeline: Pexels Curation & Nano Banana AI Rendering

## Purpose & Overview

This skill guides agents and team members in acquiring, curating, and generating high-aesthetic visual assets for TravelFrame (blog posts, carousels, social covers, lead magnets, and marketing materials).

It implements a two-pronged visual strategy:
1. **Pexels Stock API (Real-Life Authenticity):** Best for actual Hanoi street scenes, food dishes, landmarks, local cafe culture, and verified travel moments.
2. **Nano Banana (Google AI Image Generation):** Best for custom editorial concepts, stylized carousels, 3D miniature travel figurines (Nano Banana viral style), and visual storyboards where stock photos do not exist.

---

## Tooling & Command Interface

### 1. Pexels Stock API CLI
Script path: `Technology-Automation/Scripts/fetch_media_asset.mjs`

- **Search Command:**
  ```bash
  node Technology-Automation/Scripts/fetch_media_asset.mjs search "<query>" --per-page <N> [--orientation landscape|portrait|square]
  ```
  *Examples:*
  - `node Technology-Automation/Scripts/fetch_media_asset.mjs search "hanoi old quarter street" --per-page 5 --orientation landscape`
  - `node Technology-Automation/Scripts/fetch_media_asset.mjs search "vietnamese coffee egg" --per-page 3`
  - `node Technology-Automation/Scripts/fetch_media_asset.mjs search "solo traveler walking street" --per-page 5 --orientation portrait`

- **Download & Attribution Command:**
  ```bash
  node Technology-Automation/Scripts/fetch_media_asset.mjs download <photoId> --dest Creative-Production/Assets/Stock
  ```
  *Output:* Automatically downloads high-resolution photo and creates a companion `.json` metadata file with photographer credit, license info, and ready-to-use markdown embed code.

### 2. Nano Banana AI Rendering (Google Imagen / Gemini Engine)
In Antigravity IDE or agent environments with the `generate_image` tool:

- **Aspect Ratios Supported:**
  - `16:9` or `3:2`: Blog header images, YouTube thumbnails, web banners.
  - `9:16`: Instagram Reels / Stories covers, Pinterest pins, vertical mobile backgrounds.
  - `1:1` or `4:5`: Instagram feed carousels, square profile graphics.
  - `4:3`: Editorial articles and guest guides.

---

## Curation vs. Generation Decision Matrix

| Asset Requirement | Recommended Source | Rationale |
|---|---|---|
| Famous dishes (Phở, Bún chả, Bánh mì, Cà phê trứng) | **Pexels API** | Must show authentic culinary ingredients; AI food can look unconvincing or unnaturally glossy. |
| Specific Hanoi landmarks (Temple of Literature, Long Bien Bridge) | **Pexels API** | Historical architecture must be accurate; AI often hallucinates pagoda details. |
| Conceptual cover: "Solo female traveler discovering hidden alley" | **Nano Banana** | Allows precise mood, wardrobe, and brand positioning without hiring a model. |
| 3D Miniature Travel Diorama / Viral Trend | **Nano Banana** | Hyper-detailed miniature clay/isometric diorama of Hanoi Train Street or a traditional street vendor. |
| Editorial infographic / Blog illustration | **Nano Banana** | Clean stylized vector or watercolor aesthetic. |

---

## Nano Banana Prompt Engineering Guide for TravelFrame

### Golden Aesthetic Rules (Voice & Style Playbook)
1. **Never use generic "AI glossy" prompts:** Avoid plastic skin, exaggerated teeth, neon saturation, or oversaturated sci-fi lighting.
2. **Adopt documentary & film camera terminology:**
   - Mention lens focal lengths: *"shot on 35mm f/1.8 lens"*, *"50mm natural perspective"*.
   - Mention film characteristics: *"subtle Kodak Portra 400 film grain"*, *"soft natural morning light"*, *"muted organic color grade"*.
3. **Hanoi Urban Palette:**
   - Weathered French ochre yellow walls, peeling green timber shutters, leafy tropical banyans, overhead wires, textured stone paving.

### Sample Nano Banana Prompts

#### Prompt A: Candid Solo Traveler Street Moment (Blog Hero — 3:2)
> *"Candid documentary travel photograph of an international solo female traveler in her late 20s wearing a simple white linen shirt, walking through a quiet, sun-dappled alley in Hanoi Old Quarter. Soft morning golden hour light cutting through banyan leaves, weathered ochre-yellow French colonial walls with moss in the background, vintage bicycles parked along flagstone sidewalk. Shot on 35mm prime lens, f/2.2, natural cinematic color grading, authentic textures, no artificial gloss, photorealistic."*

#### Prompt B: The Nano Banana 3D Miniature Figurine / Diorama Trend (1:1)
> *"A hyper-detailed 3D miniature diorama of a traditional Hanoi sidewalk coffee stall. Handcrafted clay and resin style, tilt-shift photography, tiny blue plastic stools, a miniature silver drip phin filter resting on a glass of egg coffee, tiny weathered French shophouse facade in the background with miniature paper lanterns. Warm morning sunbeam, playful and whimsical, studio macro lighting, high definition, clean depth of field."*

#### Prompt C: Atmospheric Rainy Hanoi Street (Instagram Cover — 9:16)
> *"Atmospheric street photography of Hanoi Old Quarter during a gentle evening drizzle. Glossy reflections of warm shop lights and red lanterns on the wet asphalt, a woman holding a clear umbrella walking past a traditional noodle soup stall with gentle steam rising into the cool air. Cinematic blue hour tones, 35mm film grain, moody, authentic, high aesthetic, documentary style."*

---

## Quality Checklist Before Publishing

- [ ] Realism check: Does the image feel like authentic Hanoi, or does it look like generic East Asian stock?
- [ ] Cultural respect (V-09): Are traditional garments, altars, or elders depicted respectfully?
- [ ] File location: Stock in `Creative-Production/Assets/Stock/`, AI renders in `Creative-Production/Assets/AI-Generated/`.
- [ ] Attribution: If from Pexels, photographer name and license credit recorded in companion metadata.
- [ ] Compression: Image exported to `.webp` or optimized `.jpg` for fast web performance (< 250 KB for web).

## TravelFrame Governance Contract
- **Owner:** Creative-Production (`Creative-Production/Assets/`)
- **Read First:** `Creative-Production/README.md`, `Brand-Strategy/Source-Of-Truth-Map.md`
- **Output:** `Creative-Production/Assets/`
- **Source Precedence:** Approved visual briefs > Generated assets.
- **Approval Gates:** BẮT BUỘC Rocky phê duyệt trước khi gọi API tạo ảnh AI trả phí (Nano Banana/Midjourney). Pexels API miễn phí tuân thủ quota.
- **Guardrails:** Chỉ dùng ảnh có bản quyền thương mại hoặc consent rõ ràng. Không tự ý coi asset render là Published.
- **Completion Criteria:** File ảnh lưu đúng định dạng, có metadata nguồn, license rõ ràng và ghi vào asset register.
