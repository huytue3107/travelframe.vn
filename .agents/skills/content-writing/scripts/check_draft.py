#!/usr/bin/env python3
"""Machine-checkable draft verdict for TravelFrame content drafts.

Checks (stdlib only, no network):
- n-gram overlap (>=8 words) between the draft and external sources -> hard fail
  unless the span sits inside ONE short quoted span in the draft.
- [VERIFY] marker count -> status flagged when > 0.
- Voice checklist per content type (reel / carousel / video).
- Traceability: entry IDs cited in sources.md must exist in the knowledge files;
  duplicate entry IDs inside knowledge files -> hard fail.

Exit code: 0 = pass/flagged, 1 = fail, 2 = usage error.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

NGRAM = 8
SIGNOFF_RE = re.compile(r"travelframe\s*[—–-]\s*your local friend in hanoi", re.I)
HASHTAG_TOKEN_RE = re.compile(r"#[a-z0-9_]+", re.I)
CTA_RE = re.compile(r"\b(save|share|comment|send|dm|bookmark)\b", re.I)
SLIDE_RE = re.compile(r"^##\s*Slide\s*(\d+)\s*[—–-]", re.I | re.M)
ENTRY_HEADER_RE = re.compile(r"^##\s*([PIV])-(\d+)\b", re.M)
ENTRY_REF_RE = re.compile(r"(?<![A-Za-z-])([PIV])-(\d+)(?![0-9])")
PRICE_RE = re.compile(
    r"(\$ ?\d[\d,]*(?:\.\d+)?(?:\s*(?:–|-|—|to)\s*\$? ?\d[\d,]*(?:\.\d+)?)?)"
    r"|\b(\d[\d,]*(?:\.\d+)?\s?(?:VND|vnd|k VND|k))\b"
)
PRICE_OK_RE = re.compile(r"\[VERIFY\]|VERIFIED|Indicative|ask first", re.I)
VERIFY_TOKEN = "[VERIFY]"


def normalize(text: str) -> list[str]:
    text = text.lower().replace("’", "'").replace("“", '"').replace("”", '"')
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return text.split()


def ngrams(tokens: list[str], n: int) -> set[tuple]:
    return {tuple(tokens[i:i + n]) for i in range(len(tokens) - n + 1)}


def quoted_spans(raw: str) -> tuple[list[str], str]:
    """Return (quoted spans, raw with quoted spans removed)."""
    spans = re.findall(r'"([^"]{1,300})"', raw) + re.findall(r"“([^”]{1,300})”", raw)
    stripped = re.sub(r'"[^"]{1,300}"', " ", raw, flags=re.S)
    stripped = re.sub(r"“[^”]{1,300}”", " ", stripped, flags=re.S)
    return spans, stripped


def strip_boilerplate(text: str) -> str:
    """Brand-identity lines are ours by definition (V-06): drop the sign-off line
    and pure hashtag lines from BOTH sides of the overlap check."""
    lines = []
    for raw_line in text.splitlines():
        s = raw_line.strip()
        if SIGNOFF_RE.search(s):
            continue
        tokens = s.split()
        if tokens and all(HASHTAG_TOKEN_RE.fullmatch(tok) for tok in tokens):
            continue
        lines.append(raw_line)
    return "\n".join(lines)


def check_overlap(draft_raw: str, sources: dict[str, str],
                  flags: list[str], hard: list[str]) -> dict:
    draft_raw = strip_boilerplate(draft_raw)
    sources = {k: strip_boilerplate(v) for k, v in sources.items()}
    spans, stripped = quoted_spans(draft_raw)
    if len(spans) > 1:
        hard.append(f"more than one quoted span in draft ({len(spans)}) — keep max 1")
    draft_tokens = normalize(stripped)
    draft_grams = ngrams(draft_tokens, NGRAM)
    overlaps = []
    for src_path, src_text in sources.items():
        src_grams = ngrams(normalize(src_text), NGRAM)
        for gram in draft_grams & src_grams:
            overlaps.append({"span": " ".join(gram), "source": src_path})
        if overlaps:
            break  # one source with hits is enough detail
    if overlaps:
        hard.append(f"verbatim {NGRAM}-word overlap with external source: "
                    + overlaps[0]["span"][:80])
    return {"quoted_spans": len(spans), "overlaps": len(overlaps),
            "first_overlap": overlaps[0]["span"][:120] if overlaps else None}


def check_reel(text: str, flags: list[str], checks: dict,
               expect_hashtag: bool = True) -> None:
    checks["signoff"] = bool(SIGNOFF_RE.search(text))
    if not checks["signoff"]:
        flags.append("reel missing brand sign-off line")
    hashtag_lines = [ln for ln in text.splitlines()
                     if len(HASHTAG_TOKEN_RE.findall(ln)) >= 4]
    checks["hashtag_line"] = bool(hashtag_lines)
    if not checks["hashtag_line"] and expect_hashtag:
        flags.append("reel missing hashtag line (>=4 #tags)")
    checks["brand_hashtag"] = bool(re.search(r"#travelframe\b", text, re.I))
    if not checks["brand_hashtag"] and expect_hashtag:
        flags.append("reel missing #travelframe hashtag")
    checks["cta"] = bool(CTA_RE.search(text))
    if not checks["cta"]:
        flags.append("reel missing CTA (save/share/comment/dm)")


def check_carousel(text: str, flags: list[str], checks: dict) -> None:
    slides = [int(m.group(1)) for m in SLIDE_RE.finditer(text)]
    checks["slide_count"] = len(slides)
    if not (5 <= len(slides) <= 7):
        flags.append(f"carousel must have 5-7 '## Slide N —' headers, found {len(slides)}")
    bad_prices = []
    for i, line in enumerate(text.splitlines(), 1):
        if PRICE_RE.search(line) and not PRICE_OK_RE.search(line):
            bad_prices.append({"line": i, "text": line.strip()[:100]})
    checks["price_lines_without_verify"] = len(bad_prices)
    if bad_prices:
        flags.append(f"price without VERIFY/Indicative/ask-first at line {bad_prices[0]['line']}")


def check_video(text: str, script_text: str | None, flags: list[str], checks: dict) -> None:
    checks["brand_bridge"] = bool(SIGNOFF_RE.search(text))
    if not checks["brand_bridge"]:
        flags.append("asset-plan missing brand bridge sign-off")
    lowered = text.lower()
    if "train street" in lowered:
        sections = re.split(r"^##\s", text, flags=re.M)
        section = next((s for s in sections if "train street" in s.lower()), "")
        safe = re.search(r"barrier|safety|access|tracks?|security|neighborhood",
                         section, re.I)
        checks["train_street_safety"] = bool(safe)
        if not safe:
            flags.append("Train Street mentioned without safety language "
                         "(barrier/access/tracks/security)")
    checks["script_present"] = bool(script_text and script_text.strip())
    if not checks["script_present"]:
        flags.append("narration script missing or empty (--script)")




def check_traceability(sources_md: str | None, knowledge_dir: Path | None,
                       flags: list[str], checks: dict, hard: list[str]) -> None:
    if sources_md is None or knowledge_dir is None:
        checks["traceability"] = {"skipped": True}
        return
    sources_path = Path(sources_md)
    if sources_path.is_file():
        sources_text = sources_path.read_text(encoding="utf-8")
    else:
        hard.append(f"sources.md not found: {sources_path}")
        sources_text = ""
    knowledge_files: dict[str, str] = {}
    dupes: set[str] = set()
    if knowledge_dir.is_dir():
        for md in sorted(knowledge_dir.glob("*.md")):
            for m in ENTRY_HEADER_RE.finditer(md.read_text(encoding="utf-8")):
                entry_id = f"{m.group(1)}-{int(m.group(2)):03d}"
                if entry_id in knowledge_files:
                    dupes.add(entry_id)
                knowledge_files[entry_id] = md.name
    cited = sorted({f"{k}-{int(n):03d}" for k, n in ENTRY_REF_RE.findall(sources_text)})
    missing = [eid for eid in cited if eid not in knowledge_files]
    if dupes:
        hard.append(f"duplicate entry IDs in knowledge base: {sorted(dupes)}")
    if missing:
        hard.append(f"sources.md cites unknown entry IDs: {missing}")
    if not cited:
        flags.append("sources.md cites no pattern/voice/idea IDs — "
                     "content-writing step 2 requires picking patterns")
    checks["traceability"] = {"cited": len(cited), "missing": missing}


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--draft", required=True, help="draft file to check")
    parser.add_argument("--type", required=True, choices=["reel", "carousel", "video"])
    parser.add_argument("--script", help="narration .txt (video type)")
    parser.add_argument("--sources-md", help="sources.md with cited entry IDs")
    parser.add_argument("--knowledge", help="knowledge base directory")
    parser.add_argument("--sources", nargs="*", default=[],
                        help="external source files for verbatim-overlap check")
    parser.add_argument("--expect-hashtag", action="store_true", default=True,
                        help="require hashtag line (reel caption yes, reel script no); "
                             "pass --no-expect-hashtag for narration files")
    parser.add_argument("--no-expect-hashtag", dest="expect_hashtag",
                        action="store_false")
    args = parser.parse_args(argv)

    draft = Path(args.draft)
    if not draft.is_file():
        print(json.dumps({"error": f"draft not found: {draft}"}))
        return 2
    draft_raw = draft.read_text(encoding="utf-8")

    flags: list[str] = []
    hard: list[str] = []
    checks: dict = {}

    sources: dict[str, str] = {}
    for s in args.sources:
        sp = Path(s)
        if sp.is_file():
            sources[str(sp)] = sp.read_text(encoding="utf-8", errors="replace")
        else:
            hard.append(f"source file not found: {sp}")
    checks["overlap"] = check_overlap(draft_raw, sources, flags, hard)

    verify_count = draft_raw.count(VERIFY_TOKEN)
    checks["verify_count"] = verify_count
    if verify_count:
        flags.append(f"{verify_count} [VERIFY] marker(s) remain — status drafted_flagged")

    script_text = None
    if args.script:
        script_path = Path(args.script)
        script_text = script_path.read_text(encoding="utf-8") if script_path.is_file() else None

    if args.type == "reel":
        check_reel(draft_raw, flags, checks, expect_hashtag=args.expect_hashtag)
    elif args.type == "carousel":
        check_carousel(draft_raw, flags, checks)
    elif args.type == "video":
        check_video(draft_raw, script_text, flags, checks)
    else:
        print(json.dumps({"error": f"unknown type: {args.type}"}))
        return 2

    check_traceability(args.sources_md,
                       Path(args.knowledge) if args.knowledge else None,
                       flags, checks, hard)

    status = "fail" if hard else ("flagged" if flags else "pass")
    verdict = {
        "type": args.type,
        "draft": str(draft),
        "status": status,
        "flags": flags,
        "hard_errors": hard,
        "checks": checks,
    }
    print(json.dumps(verdict, indent=2, ensure_ascii=False))
    return 1 if status == "fail" else 0


if __name__ == "__main__":
    sys.exit(main())
