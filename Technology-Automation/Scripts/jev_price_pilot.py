"""Jev Ultrafast price pilot for TravelFrame (read-only competitor research).

The robot only navigates and searches; code then saves the result page text for review.
It never books, logs in, or submits personal data (robot Chrome has no accounts).

Run from the tool folder so .env and the venv resolve:
  cd Technology-Automation/Tools/jev-ultrafast
  uv run --env-file .env python ../../Scripts/jev_price_pilot.py \
      --name klook-en --url https://www.klook.com/en-US/ \
      --goal "Search for Hanoi photo tour and show the list of matching activities." \
      --out ../../../Research-Insights/Competitive/<folder>/raw
"""

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path

from jev_ultrafast import Agent

MAX_TICKS = 25  # hard cap on robot steps per run (cost guard)
SAFETY = " Stop on the search results list. Do not book, add to cart, sign in, or enter personal details."


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--name", required=True)
    p.add_argument("--url", required=True)
    p.add_argument("--goal", required=True)
    p.add_argument("--out", required=True)
    a = p.parse_args()

    goal = a.goal.strip() + SAFETY
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    record = {"name": a.name, "start_url": a.url, "goal": goal,
              "started_utc": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    t0 = time.perf_counter()
    state = None
    try:
        with Agent(a.url, goal) as agent:
            for i, state in enumerate(agent.run()):
                if state["status"] in ("done", "blocked") or i + 1 >= MAX_TICKS:
                    break
            # Code (not the model) reads the final page for review.
            text = agent.browser.evaluate("document.body ? document.body.innerText : ''") or ""
            url = agent.browser.evaluate("location.href")
            title = agent.browser.evaluate("document.title")
        record.update(
            status=state["status"] if state else "no-state",
            elapsed_ms=state["elapsed_ms"] if state else None,
            actions=[{k: h.get(k) for k in ("operation", "action", "text", "url")}
                     for h in (state or {}).get("history", [])],
            typesafe_decisions=len((state or {}).get("decisions", [])),
            text_calls=len((state or {}).get("text_calls", [])),
            final_url=url, final_title=title, page_text=text[:80000],
        )
    except Exception as error:  # record failures as failures, never as results
        record.update(status="error", error=f"{type(error).__name__}: {error}")
    record["wall_ms"] = round((time.perf_counter() - t0) * 1000)
    (out / f"{a.name}.json").write_text(json.dumps(record, ensure_ascii=False, indent=1))
    summary = {k: record.get(k) for k in ("name", "status", "elapsed_ms", "wall_ms", "typesafe_decisions",
                                           "text_calls", "final_url", "error")}
    summary["actions"] = record.get("actions")
    summary["page_chars"] = len(record.get("page_text", ""))
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
