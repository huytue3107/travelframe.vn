# Hanoi Dong Xuan Video Series Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce two 9:16 English-American TravelFrame videos about Hanoi, plus one connected master video, using Pexels footage, VBee voice AI, and HyperFrames.

**Architecture:** Keep one local production folder with scripts, downloaded Pexels clips, VBee narration, attribution metadata, and three rendered MP4 outputs. Each standalone composition is a separate HyperFrames HTML source; the master concatenates the two reviewed renders with a short transition.

**Tech Stack:** Pexels Video API, VBee AIVoice API, FFmpeg, HyperFrames HTML/GSAP, local filesystem.

---

### Task 1: Lock scripts and source plan

**Files:**
- Create: `output/hanoi-dong-xuan-series/scripts/top-3-hanoi-spots.txt`
- Create: `output/hanoi-dong-xuan-series/scripts/one-day-hanoi-itinerary.txt`
- Create: `output/hanoi-dong-xuan-series/asset-plan.md`

- [ ] Write a short hook, three location beats, practical payoff, and save/share CTA for Video 1.
- [ ] Write a morning-to-night route for Video 2 using Dong Xuan Market, Old Quarter, Hoan Kiem Lake, Temple of Literature, and Train Street.
- [ ] Mark claims that require current verification and keep them out of the voiceover unless verified.

### Task 2: Search and download Pexels footage

**Files:**
- Create: `output/hanoi-dong-xuan-series/assets/`
- Create: `output/hanoi-dong-xuan-series/pexels-results.json`

- [ ] Search Pexels Video API for vertical or crop-safe footage matching Hanoi market, Old Quarter, Hoan Kiem Lake, Temple of Literature, Train Street, street food, and walking shots.
- [ ] Download a small, coherent set of clips with usable duration and retain each Pexels URL and photographer attribution.
- [ ] Reject footage that is clearly the wrong city or cannot be responsibly labeled as a Hanoi location.

### Task 3: Generate narration

**Files:**
- Create: `output/hanoi-dong-xuan-series/audio/video-1.wav`
- Create: `output/hanoi-dong-xuan-series/audio/video-2.wav`

- [ ] Submit the approved English scripts to VBee using the requested voice code.
- [ ] Verify both audio files with FFprobe and record duration, sample rate, and channels.
- [ ] Keep API credentials out of source files and rendered metadata.

### Task 4: Build HyperFrames compositions

**Files:**
- Create: `output/hanoi-dong-xuan-series/video-1/index.html`
- Create: `output/hanoi-dong-xuan-series/video-2/index.html`
- Create: `output/hanoi-dong-xuan-series/shared/DESIGN.md`

- [ ] Define TravelFrame visual identity: charcoal and off-white base, teal accent `#008AA3`, clean sans typography, warm local-friend tone.
- [ ] Add muted video clips, separate narration audio, timed text overlays, captions, source credits, and entrance transitions.
- [ ] Keep all captions within the 9:16 safe area and avoid claims not supported by the asset plan.

### Task 5: Validate and render

**Files:**
- Create: `output/hanoi-dong-xuan-series/renders/top-3-hanoi-spots.mp4`
- Create: `output/hanoi-dong-xuan-series/renders/one-day-hanoi-itinerary.mp4`
- Create: `output/hanoi-dong-xuan-series/renders/hanoi-dong-xuan-series.mp4`

- [ ] Run HyperFrames lint, validate, inspect, and preview checks on both compositions.
- [ ] Render both standalone videos at 1080x1920, 30 fps.
- [ ] Join the two reviewed videos with a short crossfade and verify the final duration and streams with FFProbe.

### Task 6: Final handoff

- [ ] Confirm all three MP4 files exist and open cleanly.
- [ ] Confirm Pexels attribution is present in the project notes and final end card or caption area.
- [ ] Report the three output paths, durations, and any footage or claim limitations.
