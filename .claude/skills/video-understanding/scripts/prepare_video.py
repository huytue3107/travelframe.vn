#!/usr/bin/env python3
"""Build the source profile (source.json) for one video — video-understanding step 2.

Reuses what channel-scout already produced (video, info.json, transcript dir, Apify
posts JSON); never re-downloads and never moves existing files. The output
``source.json`` is the handoff contract consumed by the video-understanding skill
(see references/source-contract.md).

Matching rules (deliberate):
- video_key = sanitized <platform>/<native-id>, falling back to a SHA-256 prefix
  when a local file has no platform ID. Segments are filesystem-safe: lowercase,
  [a-z0-9._-] only, never "." or "..".
- Post captions are matched by native ID or canonical URL only. No fuzzy title,
  array-position, or file-mtime matching.
- Post caption, platform subtitles, ASR transcript and on-screen text are kept as
  four separate text sources; nothing is merged silently.
- Transcripts without a provenance sidecar are carried as "unverified", never
  silently promoted to trusted input.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

SKILL_SCRIPTS = Path(__file__).resolve().parent
VENDOR_DIR = SKILL_SCRIPTS / "vendor" / "claude_video"
sys.path.insert(0, str(VENDOR_DIR))

try:
    import frames  # vendored from bradautomates/claude-video (MIT)
except SystemExit as exc:  # ffprobe missing — fail with a clear message
    print(f"prepare_video: {exc}", file=sys.stderr)
    raise

SCHEMA_VERSION = 1

CAPTION_KEYS = ("caption", "text", "description", "desc", "title")
ID_KEYS = ("id", "code", "shortCode", "shortcode", "videoId", "video_id")
URL_KEYS = ("url", "postUrl", "videoUrl", "webpage_url", "link")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sanitize_segment(value: str) -> str:
    """Make one filesystem path segment: [a-z0-9._-] only, never '.' or '..'."""
    seg = (value or "").lower()
    seg = re.sub(r"[^a-z0-9._-]+", "-", seg)
    seg = seg.strip("-.")
    if not seg or seg in {".", ".."}:
        seg = "-"
    return seg[:120]


def canonical_url(url):
    """Lowercase host, strip www/query/fragment/trailing slash. Path case kept —
    Instagram shortcodes are case-sensitive."""
    if not url:
        return None
    try:
        parts = urlsplit(url.strip())
    except ValueError:
        return None
    if not parts.netloc:
        return None
    host = parts.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    path = (parts.path or "/").rstrip("/")
    out = host + path
    if parts.query:
        # The ID often lives in the query (youtube.com/watch?v=...) — keep it.
        out += "?" + parts.query
    return out


def load_json(path):
    try:
        with path.open(encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError) as exc:
        print(f"prepare_video: cannot read JSON {path}: {exc}", file=sys.stderr)
        return None


def iter_post_records(posts_data):
    """Yield post records from either a flat post list or profile records with
    ``latestPosts`` (the shape Apify instagram-profile-scraper returns)."""
    records = []
    if isinstance(posts_data, dict):
        posts_data = [posts_data]
    if not isinstance(posts_data, list):
        return records
    for item in posts_data:
        if not isinstance(item, dict):
            continue
        latest = item.get("latestPosts")
        if isinstance(latest, list):
            records.extend(r for r in latest if isinstance(r, dict))
        else:
            records.append(item)
    return records


def record_caption(record):
    for key in CAPTION_KEYS:
        value = record.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip(), key
    return None


def match_caption(posts_path, native_id, url):
    """Match a post caption by native ID first, then by canonical URL."""
    out = {"status": "missing", "reason": "no posts dataset provided",
           "value": None, "matched_by": None, "posts_path": None}
    if posts_path is None:
        return out
    out["posts_path"] = str(posts_path)
    if not posts_path.exists():
        out["reason"] = f"posts dataset not found: {posts_path}"
        return out
    posts_data = load_json(posts_path)
    if posts_data is None:
        out["reason"] = f"unreadable posts dataset: {posts_path}"
        return out

    url_canon = canonical_url(url)
    by_id = []
    by_url = []
    for record in iter_post_records(posts_data):
        if native_id:
            for key in ID_KEYS:
                value = record.get(key)
                if isinstance(value, str) and value.strip() == native_id:
                    by_id.append(record)
                    break
        if url_canon:
            for key in URL_KEYS:
                if canonical_url(record.get(key)) == url_canon:
                    by_url.append(record)
                    break

    records = by_id or by_url
    out["matched_by"] = "id" if by_id else ("url" if by_url else None)
    if not records:
        out["reason"] = "no record matches native id or canonical URL"
        return out

    caption_pairs = [record_caption(r) for r in records]
    captions = {pair[0] for pair in caption_pairs if pair}
    if len(captions) == 1:
        out["status"] = "matched"
        out["value"] = next(iter(captions))
        out["reason"] = None
    else:
        out["status"] = "unverified"
        out["reason"] = "conflicting or ambiguous caption across matched records"
    return out


def inspect_media(video_path):
    """FFprobe the actual container/streams; degrade to an error record when the
    clip is broken. Never gate on file extension."""
    media = {
        "path": str(video_path),
        "fingerprint_sha256": sha256_file(video_path),
        "status": "ok",
        "error": None,
    }
    try:
        meta = frames.get_metadata(str(video_path))
    except SystemExit as exc:
        media["status"] = "error"
        media["error"] = str(exc)
        return media
    media.update({
        "container_probe": "ffprobe",
        "duration_seconds": meta.get("duration_seconds"),
        "width": meta.get("width"),
        "height": meta.get("height"),
        "codec": meta.get("codec"),
        "size_bytes": meta.get("size_bytes"),
        "has_audio": meta.get("has_audio"),
    })
    return media


def collect_transcripts(transcripts_dir):
    """Separate ASR transcripts (with provenance) from unverified bare files.

    A transcript directory written by the fixed transcribe.sh carries
    provenance.json (fingerprint, engine, model, language). Directories without
    it — e.g. legacy `transcripts/video/` output — are recorded as unverified
    candidates and never auto-assigned."""
    if transcripts_dir is None:
        return {"status": "missing", "reason": "no transcript directory provided",
                "source": None, "verified": False, "paths": [], "provenance": None}
    if not transcripts_dir.is_dir():
        return {"status": "missing", "reason": f"transcript directory not found: {transcripts_dir}",
                "source": None, "verified": False, "paths": [], "provenance": None}

    provenance = None
    prov_path = transcripts_dir / "provenance.json"
    if prov_path.exists():
        prov = load_json(prov_path)
        if isinstance(prov, dict) and prov.get("transcript"):
            provenance = prov

    files = sorted(
        p for p in transcripts_dir.iterdir()
        if p.is_file() and p.suffix.lower() in {".srt", ".txt", ".json", ".vtt", ".tsv"}
        and p.name != "provenance.json"
    )
    if not files:
        return {"status": "missing", "reason": f"no transcript files in {transcripts_dir}",
                "source": None, "verified": False, "paths": [], "provenance": None}

    out = {
        "paths": [str(p) for p in files],
        "verified": provenance is not None,
        "provenance": provenance,
    }
    if provenance is not None:
        out["status"] = "present"
        out["source"] = provenance["transcript"].get("source", "local_whisper")
        out["reason"] = None
    else:
        out["status"] = "unverified"
        out["source"] = None
        out["reason"] = ("transcript files found but no provenance.json — cannot confirm "
                         "origin (legacy output predates provenance-aware transcribe.sh); "
                         "confirm manually or re-run transcribe.sh")
    return out


def platform_subtitles_from_info(info, video_dir):
    """Platform-provided subtitle tracks recorded by yt-dlp in info.json."""
    if not isinstance(info, dict):
        return {"status": "missing", "reason": "no metadata provided", "paths": []}
    # Local subtitle files sitting next to the video are the reliable signal.
    paths = []
    for p in sorted(video_dir.glob("*.vtt")) + sorted(video_dir.glob("*.srt")):
        if p.name not in ("provenance.json",):
            paths.append(str(p))
    if paths:
        return {"status": "present", "paths": paths,
                "reason": None, "declared_languages": sorted(
                    (info.get("requested_subtitles") or {}).keys()) if isinstance(
                    info.get("requested_subtitles"), dict) else None}
    if isinstance(info.get("subtitles"), dict) and info.get("subtitles"):
        return {"status": "missing", "paths": [],
                "reason": "platform subtitles exist remotely but were not downloaded"}
    return {"status": "missing", "reason": "no platform subtitles", "paths": []}


def detect_platform_identity(video_path, info):
    """Derive platform, native id, url, author and upload time.

    Preference order: yt-dlp info.json fields, then the channel-scout directory
    layout videos/<platform>/<run>/, then a bare local file keyed by SHA-256."""
    platform = None
    native_id = None
    url = None
    author = None
    upload_time = None

    if isinstance(info, dict):
        extractor = str(info.get("extractor") or info.get("extractor_key") or "")
        for name in ("youtube", "instagram", "tiktok", "facebook", "vimeo"):
            if name in extractor.lower():
                platform = name
                break
        rid = info.get("id")
        if isinstance(rid, str) and rid.strip():
            native_id = rid.strip()
        url = info.get("webpage_url") or info.get("original_url")
        author = info.get("uploader") or info.get("channel") or info.get("uploader_id")
        upload_time = info.get("upload_date") or info.get("timestamp")

    # Walk parents for the channel-scout layout videos/<platform>/<run>/.
    if platform is None:
        for parent in [video_path, *video_path.parents]:
            if parent.name == "videos" and parent.parent.name == "reference-library":
                candidates = [p for p in reversed(video_path.parents)
                              if p.parent.name == "videos"]
                if candidates:
                    platform = candidates[0].name
                break

    if platform is None:
        platform = "local"
    if native_id is None:
        native_id = sha256_file(video_path)[:16]
    return platform, native_id, url, author, upload_time


def build_source(args):
    video_path = Path(args.video).resolve()
    if not video_path.is_file():
        raise SystemExit(f"prepare_video: video not found: {video_path}")

    info = None
    if args.info:
        info = load_json(Path(args.info))
    else:
        candidate = video_path.parent / "info.json"
        if candidate.exists():
            info = load_json(candidate)

    platform, native_id, url, author, upload_time = detect_platform_identity(video_path, info)
    video_key = f"{sanitize_segment(platform)}/{sanitize_segment(native_id)}"
    media = inspect_media(video_path)

    caption = match_caption(
        Path(args.posts) if args.posts else None, native_id, url)
    subtitles = platform_subtitles_from_info(info, video_path.parent)
    transcripts = collect_transcripts(
        Path(args.transcripts) if args.transcripts else None)

    missing = []
    unverified = []
    if caption["status"] == "missing":
        missing.append(f"post_caption: {caption['reason']}")
    if caption["status"] == "unverified":
        unverified.append(f"post_caption: {caption['reason']}")
    if subtitles["status"] == "missing":
        missing.append(f"platform_subtitles: {subtitles['reason']}")
    if transcripts["status"] == "missing":
        missing.append(f"asr_transcript: {transcripts['reason']}")
    if transcripts["status"] == "unverified":
        unverified.append(f"asr_transcript: {transcripts['reason']}")
    if media["status"] == "error":
        unverified.append(f"media_probe: {media['error']}")

    asr_text = {
        "status": transcripts["status"],
        "source": transcripts["source"],
        "verified": transcripts["verified"],
        "paths": transcripts["paths"],
        "provenance": transcripts["provenance"],
        "reason": transcripts["reason"],
    }
    source = {
        "schema_version": SCHEMA_VERSION,
        "video_key": video_key,
        "platform": platform,
        "native_id": native_id,
        "source_url": url,
        "author": author,
        "source_upload_time": upload_time,
        "media": media,
        "texts": {
            "post_caption": caption,
            "platform_subtitles": subtitles,
            "asr_transcript": asr_text,
            "on_screen_text": {"status": "pending_frames",
                               "reason": "extracted in step 4-5 of the skill"},
        },
        "missing": missing,
        "unverified": unverified,
        "notes": [],
    }
    if not args.posts:
        source["notes"].append("no --posts passed: caption cannot be matched "
                               "against an Apify dataset")
    return source


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--video", required=True, help="path to the video file")
    parser.add_argument("--info", help="yt-dlp info.json (default: info.json next to video)")
    parser.add_argument("--posts", help="Apify posts JSON (flat list or profile latestPosts)")
    parser.add_argument("--transcripts", help="transcript directory (transcribe.sh output)")
    parser.add_argument("--out", required=True, help="run directory to write source.json into")
    args = parser.parse_args(argv)

    out_dir = Path(args.out)
    source_path = out_dir / "source.json"
    if source_path.exists():
        raise SystemExit(f"prepare_video: refusing to overwrite {source_path} — "
                         "use a fresh run directory")
    out_dir.mkdir(parents=True, exist_ok=True)

    source = build_source(args)
    source_path.write_text(
        json.dumps(source, indent=2, ensure_ascii=False), encoding="utf-8")
    print(source_path)
    flags = []
    if source["missing"]:
        flags.append(f"missing: {len(source['missing'])}")
    if source["unverified"]:
        flags.append(f"unverified: {len(source['unverified'])}")
    if flags:
        print("warning: " + "; ".join(flags), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
