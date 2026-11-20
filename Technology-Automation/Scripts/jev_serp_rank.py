"""Find TravelFrame's organic Google position for a keyword (read-only).

The Jev robot only types the query on google.com and stops on the results page.
Code (not the model) reads organic results page by page and finds TravelFrame's domains.

Run from the jev-ultrafast tool folder:
  cd Technology-Automation/Tools/jev-ultrafast
  uv run --env-file .env python ../../Scripts/jev_serp_rank.py \
      --keyword "photographer in hanoi" --pages 5 --out <dir>
"""

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from jev_ultrafast import Agent

DOMAINS = ("travelframe.sidevn.com", "travelframe.vn")
MAX_TICKS = 15

EXTRACT = r"""
(() => {
  const blocked = /\/sorry\//.test(location.href) || /unusual traffic/i.test(document.body.innerText);
  const seen = new Set(); const out = [];
  // Google wraps result links in /goto?url=...; the visible <cite> holds the real "https://host › path".
  for (const h3 of document.querySelectorAll('#rso a h3, #search a h3')) {
    const a = h3.closest('a'); if (!a) continue;
    if (a.closest('#tads, #bottomads, [data-text-ad]')) continue;
    const block = a.closest('[data-hveid]') || a.parentElement;
    const cite = a.querySelector('cite') || (block && block.querySelector('cite'));
    const shown = cite ? cite.innerText.trim() : '';
    const key = h3.innerText.trim() + '|' + shown;
    if (seen.has(key)) continue; seen.add(key);  // keep results without a cite so ranks stay honest
    out.push({title: h3.innerText.trim(), url: shown});
  }
  return JSON.stringify({url: location.href, blocked, results: out});
})()
"""


DIAG = r"""
JSON.stringify({url: location.href, title: document.title, h3: document.querySelectorAll('h3').length,
  rso: !!document.querySelector('#rso'), text: document.body.innerText.slice(0, 600)})
"""


def read_page(b, timeout=12.0):
    """Poll until organic results render (or Google blocks), then return them."""
    deadline = time.time() + timeout
    data = json.loads(b.evaluate(EXTRACT))
    while not data["results"] and not data["blocked"] and time.time() < deadline:
        time.sleep(1)
        data = json.loads(b.evaluate(EXTRACT))
    if not data["results"]:
        data["diag"] = json.loads(b.evaluate(DIAG))
    return data


def host(u):
    """Host from a cite string like 'https://www.example.com › news › page' or a plain URL."""
    first = u.split(" › ")[0].split(" ")[0].strip()
    if "://" not in first:
        first = "https://" + first
    try:
        return (urlparse(first).hostname or "").lower()
    except ValueError:
        return ""


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--keyword", required=True)
    p.add_argument("--pages", type=int, default=5)
    p.add_argument("--out", required=True)
    a = p.parse_args()

    goal = (f'Search Google for "{a.keyword}". Stop when the search results page is shown. '
            "Do not click any result, ad, map or sign-in button.")
    rec = {"keyword": a.keyword, "goal": goal, "domains": DOMAINS,
           "run_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"), "pages": []}
    with Agent("https://www.google.com/?hl=en", goal) as agent:
        state = None
        for i, state in enumerate(agent.run()):
            if state["status"] in ("done", "blocked") or i + 1 >= MAX_TICKS:
                break
        rec["robot"] = {"status": state["status"] if state else None,
                        "elapsed_ms": state["elapsed_ms"] if state else None,
                        "actions": [{k: h.get(k) for k in ("operation", "action", "text")}
                                    for h in (state or {}).get("history", [])]}
        b = agent.browser
        first = read_page(b)
        if "/search" not in first["url"]:
            rec["error"] = "robot did not reach a results page"
            rec["diag"] = first.get("diag")
        else:
            base = first["url"].split("&start=")[0]
            rank = 0
            for page in range(a.pages):
                if page:
                    b.call("Page.navigate", url=f"{base}&start={page * 10}")
                    time.sleep(2)
                data = first if page == 0 else read_page(b)
                if data.get("diag"):
                    rec.setdefault("diag", []).append({"page": page + 1, **data["diag"]})
                if data["blocked"]:
                    rec["error"] = f"Google blocked page {page + 1} (captcha/unusual traffic)"
                    break
                rows = []
                for r in data["results"]:
                    rank += 1
                    rows.append({"rank": rank, "title": r["title"], "url": r["url"], "host": host(r["url"])})
                rec["pages"].append({"page": page + 1, "url": data["url"], "results": rows})
                if not rows:
                    break
    hits = [r for pg in rec["pages"] for r in pg["results"] if any(r["host"].endswith(d) for d in DOMAINS)]
    rec["travelframe_hits"] = hits
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    slug = a.keyword.replace(" ", "-")
    (out / f"serp-{slug}.json").write_text(json.dumps(rec, ensure_ascii=False, indent=1))
    print(json.dumps({"robot": rec.get("robot"), "error": rec.get("error"), "diag": rec.get("diag"),
                      "results_read": sum(len(pg["results"]) for pg in rec["pages"]),
                      "travelframe_hits": hits,
                      "top10": [(r["rank"], r["host"], r["title"][:60]) for r in
                                (rec["pages"][0]["results"] if rec["pages"] else [])][:10]},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
