"""Render a TravelFrame booking confirmation card (PNG 2160x2700 + PDF).

Usage (from the project folder):
  python3 -I source/build.py data/<ref>.json [--art <image>] [--out renders/]

The art image is AI-generated without text. Every word and number on the card
is typeset here from the data file, so prices and dates are always exact.
Needs: playwright (Chromium or Google Chrome).
"""
import argparse
import html
import json
import os
import pathlib

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent


def render_template(data, art_override=None):
    """Generic mode: data names its template and fills {{KEY}} placeholders."""
    tpl = (ROOT / data["template"]).read_text(encoding="utf-8")
    art_file = art_override or data["art"]["file"]
    fields = dict(data["fields"])
    fields["ART_URL"] = (ROOT / art_file).resolve().as_uri()
    fields["FACTS"] = "\n".join(
        f'<div><div class="k">{html.escape(f["k"])}</div><div class="v">{html.escape(f["v"])}'
        f'<small>{html.escape(f.get("small", ""))}</small></div></div>' for f in data.get("facts", []))
    for k, v in fields.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    return tpl


def render_html(data, art_override=None):
    if "template" in data:
        return render_template(data, art_override)
    tpl = (ROOT / "source" / "card.html").read_text(encoding="utf-8")
    art = data["art"]
    art_file = art_override or art["file"]
    art_url = (ROOT / art_file).resolve().as_uri()
    cells = "\n".join(
        f'<div class="cell"><div class="label">{html.escape(c["label"])}</div>'
        f'<div class="value">{c["value"]}</div></div>' for c in data["cells"])
    chips = "".join(
        f'<span class="chip{" gift" if c.get("gift") else ""}">{html.escape(c["text"])}</span>'
        for c in data["chips"])
    repl = {
        "ART_URL": art_url,
        "ART_H": str(art.get("height", 760)),
        "ART_POS": art.get("position", "center"),
        "ART_FADE": "fade" if art.get("fade", True) else "",
        "PANEL_TOP": str(art.get("panel_top", 640)),
        "STAMP_BOTTOM": html.escape(data["stamp_bottom"]),
        "STAMP_DATE": html.escape(data["stamp_date"]),
        "EYEBROW": html.escape(data["eyebrow"]),
        "HEADLINE": data["headline"],
        "FOR_LINE": html.escape(data["for_line"]),
        "CELLS": cells,
        "CHIPS": chips,
        "FOOT_LEFT": html.escape(data["foot_left"]),
        "FOOT_RIGHT": html.escape(data["foot_right"]),
    }
    for k, v in repl.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    return tpl


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("data")
    ap.add_argument("--art")
    ap.add_argument("--out", default="renders")
    ap.add_argument("--suffix", default="")
    a = ap.parse_args()

    data = json.loads((ROOT / a.data).read_text(encoding="utf-8"))
    page_html = render_html(data, a.art)
    tmp = ROOT / "source" / f".render-{data['ref']}.html"
    tmp.write_text(page_html, encoding="utf-8")
    out = ROOT / a.out
    out.mkdir(parents=True, exist_ok=True)
    stem = f"{data['ref']}-card{a.suffix}"

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
        except Exception:
            browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1080, "height": 1350}, device_scale_factor=2)
        page.goto(tmp.as_uri())
        page.wait_for_load_state("networkidle")
        page.evaluate("document.fonts.ready")
        overflow = page.evaluate(
            "() => { const p = document.querySelector('.panel, .label').getBoundingClientRect();"
            " const f = document.querySelector('.foot, .facts').getBoundingClientRect();"
            " return Math.round(f.top - p.bottom); }")
        page.screenshot(path=str(out / f"{stem}.png"), full_page=False)
        page.pdf(path=str(out / f"{stem}.pdf"), width="1080px", height="1350px",
                 print_background=True, page_ranges="1")
        browser.close()
    tmp.unlink()
    print(f"wrote {out / stem}.png and .pdf; gap between panel and footer: {overflow}px")
    if overflow < 16:
        print("WARNING: text panel is crowding the footer")


if __name__ == "__main__":
    main()
