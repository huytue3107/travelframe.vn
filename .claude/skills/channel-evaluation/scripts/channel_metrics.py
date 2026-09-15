#!/usr/bin/env python3
"""Deterministic engagement metrics for one channel from an Apify posts JSON.

All numbers in the evaluation report MUST come from this script's output — the
LLM never computes metrics itself. Missing fields become null plus entries in
`missing[]`; nothing is inferred, no network calls, stdlib only.

Supported shapes: flat post list OR profile records with `latestPosts`
(same convention as prepare_video.iter_post_records). Field names are probed;
unknown platforms (TikTok/YouTube) may need one sample scrape to confirm names
before trusting output.
"""
from __future__ import annotations

import argparse
import json
import statistics
import sys
from datetime import datetime, timezone
from pathlib import Path

PROFILE_FIELDS = ("username", "followersCount", "postsCount", "biography")
POST_FIELDS = {
    "id": ("id",),
    "shortCode": ("shortCode", "short_code"),
    "url": ("url", "postUrl", "webpage_url"),
    "type": ("type",),
    "timestamp": ("timestamp", "createTime", "upload_date"),
    "likes": ("likesCount", "diggCount", "likeCount"),
    "comments": ("commentsCount", "commentCount"),
    "views": ("videoViewCount", "playCount", "viewCount"),
}
FOLLOWERS_KEYS = ("followersCount", "followerCount", "subscribersCount")


def first_present(record: dict, keys: tuple):
    for k in keys:
        if k in record and record[k] is not None:
            return record[k]
    return None


def iter_post_records(posts_data):
    records = []
    if isinstance(posts_data, dict):
        posts_data = [posts_data]
    if not isinstance(posts_data, list):
        return records, {}
    profile = {}
    for item in posts_data:
        if not isinstance(item, dict):
            continue
        latest = item.get("latestPosts")
        if isinstance(latest, list):
            for key in FOLLOWERS_KEYS + ("username", "postsCount"):
                if item.get(key) is not None:
                    profile[key] = item[key]
            records.extend(r for r in latest if isinstance(r, dict))
        elif any(k in item for k in ("likesCount", "diggCount", "likeCount")):
            records.append(item)
        else:
            for key in FOLLOWERS_KEYS + ("username", "postsCount"):
                if item.get(key) is not None:
                    profile[key] = item[key]
    return records, profile


def parse_ts(value):
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def row_from(record: dict, followers, now) -> tuple[dict, list[str]]:
    missing = []
    row = {"id": None, "shortCode": None, "url": None, "type": None,
           "timestamp": None, "likes": None, "comments": None, "views": None,
           "is_pinned": bool(record.get("isPinned")),
           "comments_disabled": bool(record.get("isCommentsDisabled")),
           "caption_chars": None, "n_hashtags": None, "n_mentions": None,
           "child_posts": len(record.get("childPosts") or []) or None,
           "engagement": None, "er": None, "rel_er": None, "age_days": None}
    for field, keys in POST_FIELDS.items():
        value = first_present(record, keys)
        row[field] = value
        if value is None:
            missing.append(f"{field} missing on {record.get('shortCode') or record.get('id')}")
    caption = record.get("caption")
    if isinstance(caption, str):
        row["caption_chars"] = len(caption)
        row["n_hashtags"] = len(record.get("hashtags") or [])
        row["n_mentions"] = len(record.get("mentions") or [])
    if row["likes"] is not None and row["comments"] is not None:
        row["engagement"] = row["likes"] + row["comments"]
        if followers:
            row["er"] = round(row["engagement"] / followers, 6)
    ts = parse_ts(row["timestamp"])
    if ts is not None and ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    if ts is not None:
        row["age_days"] = max(0, int((now - ts).total_seconds() // 86400))
    return row, missing


def build_rows(records, followers):
    rows, missing = [], []
    for record in records:
        row, row_missing = row_from(record, followers, NOW)
        rows.append(row)
        missing.extend(row_missing)
    return rows, missing


NOW = datetime.now(timezone.utc)


def _median(values):
    vals = [v for v in values if v is not None]
    return round(statistics.median(vals), 6) if vals else None


def channel_stats(rows, followers):
    live = [r for r in rows if not r["is_pinned"]]

    def vals_of(items, key):
        return [r[key] for r in items if r[key] is not None]

    er_values = vals_of(rows, "er")
    live_er = vals_of(live, "er")
    live_likes = vals_of(live, "likes")
    stats = {
        "followers_used": followers,
        "n_posts": len(rows),
        "n_pinned": sum(1 for r in rows if r["is_pinned"]),
        "median_er": round(statistics.median(er_values), 6) if er_values else None,
        "median_er_without_pinned": (round(statistics.median(live_er), 6)
                                     if live_er else None),
        "median_likes": (round(statistics.median(vals_of(rows, "likes")), 2)
                         if vals_of(rows, "likes") else None),
        "median_likes_without_pinned": (round(statistics.median(live_likes), 2)
                                        if live_likes else None),
        "median_views_video": None,
        "cadence": {},
        "formats": {},
        "top_by_rel_er": [],
        "bottom_by_rel_er": [],
        "flags": [],
    }
    view_vals = [r["views"] for r in rows if r["type"] == "Video"
                 and r["views"] is not None]
    if view_vals:
        stats["median_views_video"] = round(statistics.median(view_vals), 2)
    ts_list = sorted(parse_ts(r["timestamp"]) for r in rows
                     if parse_ts(r["timestamp"]))
    if len(ts_list) >= 2:
        gaps = [(b - a).total_seconds() / 86400 for a, b in zip(ts_list, ts_list[1:])]
        span_days = (ts_list[-1] - ts_list[0]).total_seconds() / 86400
        stats["cadence"] = {
            "span_days": round(span_days, 1),
            "posts_per_week": round(len(ts_list) / span_days * 7, 2) if span_days > 0 else None,
            "median_gap_days": round(statistics.median(gaps), 1),
        }
    for rtype in sorted({r["type"] for r in rows if r["type"]}):
        subset = [r for r in rows if r["type"] == rtype]
        fmt_er = vals_of(subset, "er")
        fmt_likes = vals_of(subset, "likes")
        fmt_views = vals_of(subset, "views")
        stats["formats"][rtype] = {
            "count": len(subset),
            "median_likes": statistics.median(fmt_likes) if fmt_likes else None,
            "median_er": (round(statistics.median(fmt_er), 6) if fmt_er else None),
            "median_views": (round(statistics.median(fmt_views), 2)
                             if fmt_views else None),
        }
    scored = sorted([r for r in rows if r["rel_er"] is not None],
                    key=lambda r: r["rel_er"], reverse=True)
    def brief(r):
        return {"id": r["id"], "shortCode": r["shortCode"],
                "rel_er": r["rel_er"], "type": r["type"]}
    stats["top_by_rel_er"] = [brief(r) for r in scored[:3]]
    stats["bottom_by_rel_er"] = [brief(r) for r in reversed(scored[-3:])]
    if followers is None:
        stats["flags"].append("followers missing — ER unavailable, only raw counts")
    if len(rows) < 10:
        stats["flags"].append(f"small sample: {len(rows)} posts (<10) — stats are indicative")
    return stats


def rel_er_fixup(rows):
    er_values = [r["er"] for r in rows if r["er"] is not None and not r["is_pinned"]]
    if not er_values:
        return
    med = statistics.median(er_values)
    for r in rows:
        if r["er"] is not None and med:
            r["rel_er"] = round(r["er"] / med, 3)


def main(argv=None):
    global NOW
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--posts", required=True, help="Apify posts JSON")
    parser.add_argument("--out", required=True, help="directory for metrics.json")
    parser.add_argument("--now", help="ISO date for age calc (default: now UTC)")
    args = parser.parse_args(argv)

    posts_path = Path(args.posts)
    data = json.loads(posts_path.read_text(encoding="utf-8"))
    records, profile = iter_post_records(data)
    followers = first_present(profile, FOLLOWERS_KEYS)

    NOW = datetime.now(timezone.utc)
    if args.now:
        parsed = parse_ts(args.now)
        if parsed is None:
            raise SystemExit(f"cannot parse --now: {args.now}")
        NOW = parsed

    rows, missing = build_rows(records, followers)
    rel_er_fixup(rows)
    stats = channel_stats(rows, followers)
    doc = {
        "source_file": str(posts_path),
        "profile": {k: profile.get(k) for k in ("username", "followersCount", "postsCount")},
        "snapshot_note": ("followersCount/ER là snapshot tại lúc scrape — ER là xấp xỉ, "
                          "không phải ER tại thời điểm từng post"),
        "rows": rows,
        "stats": stats,
        "missing_fields": missing,
    }
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "metrics.json"
    if out_path.exists():
        raise SystemExit(f"refusing to overwrite {out_path} — use a fresh run dir")
    out_path.write_text(json.dumps(doc, indent=2, ensure_ascii=False), encoding="utf-8")
    print(out_path)
    print(f"posts: {len(rows)} | followers: {followers} | "
          f"median_er: {stats['median_er']} | flags: {stats['flags']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
