# Stop-motion / GIF jiggle — v03

Status: Review — rendered and validated. Owner: Creative-Production.

Rocky requested playful rhythmic jiggle for the cat icons, in a stop-motion/GIF style. Use all nine meme cats from v02, with distinct stepped motion for each expression: shocked head tremble, hungry belly wobble, laughing bounce, screaming paw hops, coffee-bliss sway, celebrating jump, suspicious side-eye lean, confident swagger and happy-tear bob.

The original music is synthesized at 108 BPM from phase zero, verified in `make-sound.py`. Place four held pose steps per beat on this global music grid, rounded independently to 30 fps. This gives a 7.2-step-per-second grid, mainly with four- or five-frame holds; repeated side-eye poses hold longer for a comic pause. Explicit finite GSAP sets preserve the stepped look and deterministic frame seeking. There are no timers, unseeded randomness or infinite timelines. The requested repeating character movement intentionally replaces the prior single-reaction treatment.

Cat entrances also land in three held poses. Keep the first cat visible in the opening thumbnail, preserve caption space and allow the final Save CTA to settle for 0.34 seconds. Preserve narration, music/SFX, photographs, caption wording and scene timing. Keep v02 MP4 and source archive available. The exported motion record is `motion-v03.json`.

Verify every scene and a close sequence across several pose holds. Check the rendered cat region for low motion within holds and clear jumps between poses, and verify that AAC audio matches v02 exactly.

Delivered: [TF-Hanoi-Three-Things-Stopmotion-v03.mp4](TF-Hanoi-Three-Things-Stopmotion-v03.mp4), 53.466667 seconds, Full HD vertical / 30 fps. Every scene and a consecutive-frame sequence was reviewed. The decoded file shows pose jumps exactly at the expected sampled frames 38, 42 and 46, with near-static intervening frames. AAC audio matches v02 byte-for-byte. QA: [qa-v03.md](../../Review/Hanoi-Three-Things-2026-11-05/qa-v03.md).
