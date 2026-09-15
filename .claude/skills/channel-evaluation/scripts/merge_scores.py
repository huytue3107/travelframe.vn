#!/usr/bin/env python3
"""Merge two independent rubric passes into final scores.json.

Adversarial double-scoring contract: two raters score the same posts with the
same rubric (scoring-rubric.md). Per criterion, |delta| <= 1 -> resolved with
the rounded mean; |delta| > 1 -> UNRESOLVED (both ratings kept, no blurred
average). Every score must carry evidence, else the entry is flagged.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

CRITERIA = ("hook", "structure", "cta", "caption", "production")


def load_scores(path):
    doc = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(doc, dict) or not isinstance(doc.get("posts"), list):
        raise SystemExit(f"invalid scores file (want {{rater, posts[]}}): {path}")
    return doc


def resolve(mean_raw):
    """Deterministic round-half-up for x.5 means of two 0-2 ints."""
    return int(mean_raw + 0.5)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--a", required=True, help="rater A scores JSON")
    parser.add_argument("--b", required=True, help="rater B scores JSON")
    parser.add_argument("--out", required=True, help="output scores.json path")
    args = parser.parse_args(argv)

    doc_a = load_scores(args.a)
    doc_b = load_scores(args.b)
    by_id_b = {str(p.get("post_id")): p for p in doc_b["posts"]}



def merge_pass(rater_a: dict, rater_b: dict) -> dict:
    by_b = {str(p.get("post_id")): p for p in rater_b["posts"]}
    out_posts = []
    n_resolved = n_unresolved = n_no_evidence = 0
    for pa in rater_a["posts"]:
        pid = str(pa.get("post_id"))
        pb = by_b.get(pid)
        entry = {"post_id": pid, "url": pa.get("url"), "raters": {}}
        if pb is None:
            entry["status"] = "unresolved"
            entry["note"] = f"post missing in rater B file: {pid}"
            out_posts.append(entry)
            n_unresolved += 1
            continue
        entry["url"] = pb.get("url") or pa.get("url")
        entry["scores"] = {}
        unresolved_here = False
        for crit in CRITERIA:
            sa = (pa.get("scores") or {}).get(crit)
            sb = (pb.get("scores") or {}).get(crit)
            if not sa or not sb:
                entry["scores"][crit] = {"final": None, "status": "unresolved",
                                         "note": "criterion missing in one rater"}
                unresolved_here = True
                continue
            a_score, b_score = sa.get("score"), sb.get("score")
            a_ev, b_ev = sa.get("evidence"), sb.get("evidence")
            if not a_ev or not b_ev:
                entry["scores"][crit] = {"final": None, "status": "unresolved",
                                         "note": "evidence missing in one rater",
                                         "a": sa, "b": sb}
                n_no_evidence += 1
                unresolved_here = True
                continue
            if a_score is None or b_score is None:
                entry["scores"][crit] = {"final": None, "status": "unresolved",
                                         "note": "score missing", "a": sa, "b": sb}
                unresolved_here = True
                continue
            delta = abs(int(a_score) - int(b_score))
            if delta <= 1:
                entry["scores"][crit] = {
                    "final": resolve_mean(int(a_score), int(b_score)),
                    "status": "resolved", "a": sa, "b": sb, "delta": delta,
                }
                n_resolved += 1
            else:
                entry["scores"][crit] = {"final": None, "status": "unresolved",
                                         "delta": delta, "a": sa, "b": sb}
                n_unresolved += 1
                unresolved_here = True
        total = sum(s["final"] for s in entry["scores"].values()
                    if isinstance(s, dict) and s.get("final") is not None)
        entry["total"] = total if total is not None else None
        entry["status"] = "unresolved" if unresolved_here else "resolved"
        out_posts.append(entry)

    unmatched_b = [str(p.get("post_id")) for p in rater_b["posts"]
                   if str(p.get("post_id")) not in
                   {str(p2.get("post_id")) for p2 in rater_a["posts"]}]
    for pid in unmatched_b:
        out_posts.append({"post_id": pid, "status": "unresolved",
                          "note": "post missing in rater A file"})
        n_unresolved += 1
    return {
        "posts": out_posts,
        "summary": {
            "rater_a": rater_a.get("rater"), "rater_b": rater_b.get("rater"),
            "criteria_resolved": n_resolved,
            "criteria_unresolved": n_unresolved,
            "missing_evidence": n_no_evidence,
            "posts": len(out_posts),
        },
    }


def resolve_mean(a: int, b: int):
    return int((a + b) / 2 + 0.5)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--a", required=True, help="rater A scores JSON")
    parser.add_argument("--b", required=True, help="rater B scores JSON")
    parser.add_argument("--out", required=True, help="output scores.json path")
    args = parser.parse_args(argv)

    doc_a = load_scores(args.a)
    doc_b = load_scores(args.b)
    merged = merge_pass(doc_a, doc_b)
    out_path = Path(args.out)
    if out_path.exists():
        raise SystemExit(f"refusing to overwrite {out_path} — use a fresh path")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(merged, indent=2, ensure_ascii=False),
                        encoding="utf-8")
    print(out_path)
    s = merged["summary"]
    print(f"posts: {s['posts']} | resolved: {s['criteria_resolved']} | "
          f"unresolved: {s['criteria_unresolved']} | no-evidence: {s['missing_evidence']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
