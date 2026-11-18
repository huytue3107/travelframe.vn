"""Render a preview of an email template with sample data (desktop 640px + mobile 375px).

Usage: python3 -I preview.py <template.html> <sample.json> <out-prefix>
Fills {{merge_tags}} from the JSON, then screenshots with Playwright.
Fails if any {{tag}} is left unfilled.
"""
import json
import pathlib
import re
import sys

from playwright.sync_api import sync_playwright

tpl_path, data_path, out = sys.argv[1:4]
tpl = pathlib.Path(tpl_path).read_text(encoding="utf-8")
data = json.loads(pathlib.Path(data_path).read_text(encoding="utf-8"))
base = pathlib.Path(tpl_path).resolve().parent
for k, v in data.items():
    if k == "hero_image_url" and not v.startswith(("http", "file:")):
        v = (base / v).resolve().as_uri()
    tpl = tpl.replace("{{" + k + "}}", v)
left = sorted(set(re.findall(r"\{\{\s*([a-z_]+)\s*\}\}", tpl)))
if left:
    sys.exit(f"unfilled merge tags: {left}")
tmp = base / ".preview.html"
tmp.write_text(tpl, encoding="utf-8")
with sync_playwright() as p:
    try:
        b = p.chromium.launch()
    except Exception:
        b = p.chromium.launch(channel="chrome")
    for name, w in (("desktop", 640), ("mobile", 375)):
        pg = b.new_page(viewport={"width": w, "height": 900}, device_scale_factor=2)
        pg.goto(tmp.as_uri())
        pg.wait_for_load_state("networkidle")
        pg.screenshot(path=f"{out}-{name}.png", full_page=True)
        h = pg.evaluate("document.documentElement.scrollHeight")
        sw = pg.evaluate("document.documentElement.scrollWidth")
        print(f"{name}: {w}x{h}px, horizontal overflow: {sw > w}")
    b.close()
tmp.unlink()
