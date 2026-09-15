#!/usr/bin/env python3
"""Extract and index frames from a video — adapter over the vendored claude-video
frames module (video-understanding steps 4-5).

What the adapter guarantees:
- Output goes into a NEW directory (frames/ inside the run dir); an existing
  frames.json is never overwritten.
- Uniform sampling across the full duration via upstream auto_fps, budget capped
  at --max-frames (default 100 for the first pass). Focused passes pass --start/
  --end to zoom into hook/CTA segments.
- Writes frames.json with index/timestamp/path/reason. Upstream uniform-mode
  timestamps are fps-derived estimates — the skill must label them as estimates.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

SKILL_SCRIPTS = Path(__file__).resolve().parent
VENDOR_DIR = SKILL_SCRIPTS / "vendor" / "claude_video"
sys.path.insert(0, str(VENDOR_DIR))

try:
    import frames  # vendored from bradautomates/claude-video (MIT)
except SystemExit as exc:
    print(f"extract_frames: {exc}", file=sys.stderr)
    raise


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("video", help="path to the video file")
    parser.add_argument("--out", required=True,
                        help="frames directory (created; must not contain frames.json)")
    parser.add_argument("--resolution", type=int, default=768,
                        help="horizontal edge of extracted frames (default 768)")
    parser.add_argument("--max-frames", type=int, default=100,
                        help="frame budget for this pass (default 100)")
    parser.add_argument("--start", help="focus start (SS, MM:SS or HH:MM:SS)")
    parser.add_argument("--end", help="focus end (SS, MM:SS or HH:MM:SS)")
    parser.add_argument("--no-dedup", action="store_true",
                        help="keep near-identical frames (needed for on-screen text passes)")
    args = parser.parse_args(argv)

    video = Path(args.video)
    if not video.is_file():
        raise SystemExit(f"extract_frames: video not found: {video}")

    out_dir = Path(args.out)
    if (out_dir / "frames.json").exists():
        raise SystemExit(f"extract_frames: refusing to overwrite {out_dir / 'frames.json'} — "
                         "use a fresh directory per pass")
    out_dir.mkdir(parents=True, exist_ok=True)

    meta = frames.get_metadata(str(video))
    start_sec = frames.parse_time(args.start) if args.start else None
    end_sec = frames.parse_time(args.end) if args.end else None
    full_duration = meta["duration_seconds"]

    effective_start = start_sec if start_sec is not None else 0.0
    effective_end = end_sec if end_sec is not None else full_duration
    effective_duration = max(0.0, effective_end - effective_start)

    focused = start_sec is not None or end_sec is not None
    if focused:
        fps, target = frames.auto_fps_focus(effective_duration, max_frames=args.max_frames)
    else:
        fps, target = frames.auto_fps(effective_duration, max_frames=args.max_frames)

    frames_out = frames.extract(
        str(video), out_dir, fps=fps, resolution=args.resolution,
        max_frames=args.max_frames, start_seconds=start_sec, end_seconds=end_sec,
    )
    deduped_count = 0
    if not args.no_dedup:
        frames_out, deduped_count = frames.dedupe_perceptual(frames_out)

    doc = {
        "schema_version": 1,
        "video": str(video.resolve()),
        "meta": meta,
        "fps": fps,
        "target": target,
        "focused": focused,
        "dedup": not args.no_dedup,
        "deduped_count": deduped_count,
        "timestamp_note": ("uniform-mode timestamps are fps-derived estimates, "
                           "not frame-exact pts_time"),
        "frames": frames_out,
    }
    out_path = out_dir / "frames.json"
    out_path.write_text(json.dumps(doc, indent=2, ensure_ascii=False), encoding="utf-8")
    print(out_path)
    print(f"frames: {len(frames_out)} (target {target}, fps {fps:.3f}, "
          f"focused={focused}, deduped {deduped_count})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
