"""Build the Hanoi Old Quarter 2-hour photo-walk map (v01, approved by Rocky 2026-11-09).

Input : source/osm-old-quarter-2026-11-09.json (Overpass snapshot, query in overpass-query.txt)
Output: map-v01.html (A4 page). PDF/PNG are printed from it with headless Chrome (see README).

The route is not drawn by hand: each leg is the shortest path on the OSM street graph
between snapped waypoints, so the line follows real streets and the distance is measured.
"""
import heapq
import html
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "map-v01.html"
DATA = json.loads((HERE / "osm-old-quarter-2026-11-09.json").read_text(encoding="utf-8"))

# Map window (lat/lon) and on-page size (viewBox units: 10 per mm).
LAT0, LAT1 = 21.0300, 21.0392
LON0, LON1 = 105.84875, 105.85384
VB_W, VB_H = 1180, 2220
WALK_KMH = 4.0  # relaxed photo-walk pace
START_CLOCK = 7 * 60


def hav(a, b):
    r = 6371000.0
    p1, p2 = math.radians(a[0]), math.radians(b[0])
    dp, dl = p2 - p1, math.radians(b[1] - a[1])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


# Equirectangular projection fitted to the window, preserving aspect via cos(lat).
_kx = math.cos(math.radians((LAT0 + LAT1) / 2))
_w_m = (LON1 - LON0) * _kx
_h_m = LAT1 - LAT0
_scale = min(VB_W / _w_m, VB_H / _h_m)
_ox = (VB_W - _w_m * _scale) / 2
_oy = (VB_H - _h_m * _scale) / 2


def proj(lat, lon):
    return (_ox + (lon - LON0) * _kx * _scale, _oy + (LAT1 - lat) * _scale)


def path_d(coords, close=False):
    pts = [proj(a, b) for a, b in coords]
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return d + (" Z" if close else "")


ways = [e for e in DATA["elements"] if e["type"] == "way"]
rels = [e for e in DATA["elements"] if e["type"] == "relation"]

# ---------- street graph ----------
graph, node_pos, node_streets = {}, {}, {}
for w in ways:
    t = w.get("tags", {})
    if "highway" not in t:
        continue
    ids, geom = w["nodes"], w["geometry"]
    for nid, g in zip(ids, geom):
        node_pos[nid] = (g["lat"], g["lon"])
        node_streets.setdefault(nid, set()).add(t.get("name", ""))
    for a, b in zip(ids, ids[1:]):
        d = hav(node_pos[a], node_pos[b])
        graph.setdefault(a, []).append((b, d))
        graph.setdefault(b, []).append((a, d))


def snap(street, lat, lon):
    cands = [n for n, s in node_streets.items() if street in s]
    if not cands:
        raise SystemExit(f"street not found: {street}")
    return min(cands, key=lambda n: hav(node_pos[n], (lat, lon)))


def shortest(a, b):
    dist, prev, pq = {a: 0.0}, {}, [(0.0, a)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == b:
            break
        if d > dist[u]:
            continue
        for v, w in graph.get(u, []):
            nd = d + w
            if nd < dist.get(v, 1e18):
                dist[v], prev[v] = nd, u
                heapq.heappush(pq, (nd, v))
    if b not in dist:
        raise SystemExit("no path")
    seq = [b]
    while seq[-1] != a:
        seq.append(prev[seq[-1]])
    return seq[::-1], dist[b]


# ---------- route ----------
# (key, street to snap on, lat, lon, dwell minutes, is_stop)
WAYPOINTS = [
    ("S", "Phố Hàng Đào", 21.03232, 105.85134, 10, True),
    ("v", "Phố Hàng Ngang", 21.03470, 105.85035, 0, False),
    ("1", "Phố Đồng Xuân", 21.03775, 105.84905, 15, True),
    ("v", "Phố Hàng Chiếu", 21.03700, 105.84960, 0, False),
    ("2", "Phố Hàng Chiếu", 21.03731, 105.85210, 10, True),
    ("v", "Phố Đào Duy Từ", 21.03600, 105.85260, 0, False),
    ("3", "Phố Mã Mây", 21.03437, 105.85342, 15, True),
    ("4", "Phố Hàng Bạc", 21.03405, 105.85296, 15, True),
    ("5", "Phố Tạ Hiện", 21.03490, 105.85200, 10, True),
    ("v", "Phố Tạ Hiện", 21.03589, 105.85216, 0, False),
    ("6", "Phố Hàng Buồm", 21.03598, 105.85099, 15, True),
]

snapped = [(k, snap(st, la, lo), dw, stop) for k, st, la, lo, dw, stop in WAYPOINTS]
route_nodes, legs = [snapped[0][1]], []
for (_, a, _, _), (_, b, _, _) in zip(snapped, snapped[1:]):
    seq, d = shortest(a, b)
    route_nodes += seq[1:]
    legs.append(d)
total_m = sum(legs)

# Clock time at each stop: walking time accumulates across non-stop waypoints.
clock, times, walk_since = START_CLOCK, {}, 0.0
for i, (k, _, dwell, stop) in enumerate(snapped):
    if i:
        walk_since += legs[i - 1]
    if stop:
        clock += walk_since / 1000 / WALK_KMH * 60
        walk_since = 0.0
        times[k] = clock
        clock += dwell
finish_clock = clock
walk_min = total_m / 1000 / WALK_KMH * 60

# Walk back from the finish to the start point (for the "back to the lake" note).
_, back_m = shortest(snapped[-1][1], snapped[0][1])


def fmt(mins):
    mins = int(round(mins / 5.0) * 5)
    return f"{mins // 60}:{mins % 60:02d}"


# ---------- SVG layers ----------
def ring_join(segs):
    """Join open way geometries into closed rings."""
    segs = [list(s) for s in segs]
    rings = []
    while segs:
        cur = segs.pop(0)
        changed = True
        while cur[0] != cur[-1] and changed:
            changed = False
            for i, s in enumerate(segs):
                if s[0] == cur[-1]:
                    cur += s[1:]
                elif s[-1] == cur[-1]:
                    cur += s[::-1][1:]
                elif s[-1] == cur[0]:
                    cur = s + cur[1:]
                elif s[0] == cur[0]:
                    cur = s[::-1] + cur[1:]
                else:
                    continue
                segs.pop(i)
                changed = True
                break
        rings.append(cur)
    return rings


water_paths = []
for r in rels:
    if r.get("tags", {}).get("natural") != "water":
        continue
    segs = [[(g["lat"], g["lon"]) for g in m["geometry"]] for m in r["members"] if m.get("geometry")]
    water_paths.append(" ".join(path_d(ring, True) for ring in ring_join(segs)))
for w in ways:
    if w.get("tags", {}).get("natural") == "water":
        water_paths.append(path_d([(g["lat"], g["lon"]) for g in w["geometry"]], True))

CLASS_W = {"primary": 26, "secondary": 24, "tertiary": 22, "residential": 18, "unclassified": 18,
           "living_street": 16, "pedestrian": 16, "service": 9, "footway": 7, "path": 7, "steps": 6}
street_paths = []
for w in ways:
    t = w.get("tags", {})
    if "highway" not in t:
        continue
    sw = CLASS_W.get(t["highway"], 8)
    street_paths.append((sw, path_d([(g["lat"], g["lon"]) for g in w["geometry"]])))
street_paths.sort()

rail_paths = [path_d([(g["lat"], g["lon"]) for g in w["geometry"]])
              for w in ways if w.get("tags", {}).get("railway") == "rail"]

market = [w for w in ways if w.get("tags", {}).get("name") == "Chợ Đồng Xuân" and "building" in w.get("tags", {})]
market_d = path_d([(g["lat"], g["lon"]) for g in market[0]["geometry"]], True) if market else ""

# Zone streets highlighted underneath the route.
ZONES = [
    ("1", ["Phố Hàng Chiếu", "Phố Đồng Xuân"], "Hàng Chiếu & Đồng Xuân"),
    ("2", ["Phố Mã Mây"], "Mã Mây"),
    ("3", ["Phố Hàng Bạc"], "Hàng Bạc"),
    ("4", ["Phố Tạ Hiện"], "Tạ Hiện"),
]
zone_paths = []
for _, streets, _ in ZONES:
    for w in ways:
        if w.get("tags", {}).get("name") in streets:
            zone_paths.append(path_d([(g["lat"], g["lon"]) for g in w["geometry"]]))

route_d = path_d([node_pos[n] for n in route_nodes])

# Stop markers: the place's own coordinate, projected onto the drawn route
# (OSM nodes can be 50 m apart, so snapping to a node would misplace the marker).
route_xy = [proj(*node_pos[n]) for n in route_nodes]


def on_route(lat, lon):
    px, py = proj(lat, lon)
    best = None
    for (x1, y1), (x2, y2) in zip(route_xy, route_xy[1:]):
        dx, dy = x2 - x1, y2 - y1
        t = 0.0 if dx == dy == 0 else max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
        qx, qy = x1 + t * dx, y1 + t * dy
        d = math.hypot(px - qx, py - qy)
        if best is None or d < best[0]:
            best = (d, qx, qy)
    return best[1], best[2]


marker_svg, marker_xy = [], []
for (k, _, la, lo, _, stop) in WAYPOINTS:
    if not stop:
        continue
    x, y = on_route(la, lo)
    marker_xy.append((x, y))
    marker_svg.append(f'<g class="mk"><circle cx="{x:.1f}" cy="{y:.1f}" r="34"/>'
                      f'<text x="{x:.1f}" y="{y:.1f}" dy="13">{k}</text></g>')

# Street labels: longest straight run of each street, text kept upright.
LABELS = ["Phố Hàng Bạc", "Phố Tạ Hiện", "Phố Mã Mây", "Phố Hàng Buồm", "Phố Hàng Chiếu", "Phố Đinh Liệt",
          "Phố Hàng Đào", "Phố Hàng Ngang", "Phố Hàng Đường", "Phố Đồng Xuân", "Phố Lương Văn Can",
          "Phố Đào Duy Từ", "Phố Cầu Gỗ", "Phố Đinh Tiên Hoàng", "Phố Hàng Mã", "Phố Hàng Bồ", "Phố Lê Thái Tổ",
          "Phố Hàng Bè", "Phố Gia Ngư", "Phố Hàng Giấy", "Phố Hàng Chĩnh", "Phố Nguyễn Siêu", "Phố Hàng Thùng"]
label_svg = []
for name in LABELS:
    best = None
    for w in ways:
        if w.get("tags", {}).get("name") != name:
            continue
        pts = [proj(g["lat"], g["lon"]) for g in w["geometry"]]
        for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
            L = math.hypot(x2 - x1, y2 - y1)
            mx_, my_ = (x1 + x2) / 2, (y1 + y2) / 2
            if any(math.hypot(mx_ - qx, my_ - qy) < 80 for qx, qy in marker_xy):
                continue  # keep labels clear of stop markers
            if best is None or L > best[0]:
                best = (L, x1, y1, x2, y2)
    if not best or best[0] < 60:
        continue
    L, x1, y1, x2, y2 = best
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    if not (40 < mx < VB_W - 40 and 40 < my < VB_H - 40):
        continue
    ang = math.degrees(math.atan2(y2 - y1, x2 - x1))
    if ang > 90:
        ang -= 180
    if ang < -90:
        ang += 180
    label_svg.append(
        f'<text class="st" transform="translate({mx:.1f},{my:.1f}) rotate({ang:.1f})" dy="-16">'
        f'{html.escape(name.replace("Phố ", ""))}</text>')

# Landmarks (dot + small caption), positions from OSM features.
LANDMARKS = [
    (21.03733, 105.85219, "Ô Quan Chưởng gate", 46, -40),
    (21.03598, 105.85099, "Bạch Mã Temple", -175, -55),
    (21.03809, 105.84942, "Đồng Xuân Market", 70, -20),
    (21.03073, 105.85237, "Ngọc Sơn Temple", -70, 75),
    (21.03077, 105.85280, "Thê Húc Bridge", 40, -20),
]
lm_svg = []
for la, lo, name, dx, dy in LANDMARKS:
    x, y = proj(la, lo)
    lm_svg.append(f'<circle class="lmd" cx="{x:.1f}" cy="{y:.1f}" r="9"/>'
                  f'<text class="lm" x="{x + dx:.1f}" y="{y + dy:.1f}">{html.escape(name)}</text>')

lake_x, lake_y = proj(21.03125, 105.85195)

# Scale bar: 200 m.
bar_px = 200 / 111320 * _scale

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB_W} {VB_H}" class="map">
<defs><clipPath id="clip"><rect width="{VB_W}" height="{VB_H}"/></clipPath></defs>
<g clip-path="url(#clip)">
<rect width="{VB_W}" height="{VB_H}" class="land"/>
<path class="water" fill-rule="evenodd" d="{' '.join(water_paths)}"/>
<text class="lake" x="{lake_x:.0f}" y="{lake_y:.0f}">HOÀN KIẾM LAKE</text>
{''.join(f'<path class="rail" d="{d}"/>' for d in rail_paths)}
{''.join(f'<path class="sc" stroke-width="{sw + 6}" d="{d}"/>' for sw, d in street_paths)}
{''.join(f'<path class="s" stroke-width="{sw}" d="{d}"/>' for sw, d in street_paths)}
<path class="market" d="{market_d}"/>
{''.join(f'<path class="zone" d="{d}"/>' for d in zone_paths)}
<path class="route-c" d="{route_d}"/>
<path class="route" d="{route_d}"/>
{''.join(label_svg)}
{''.join(lm_svg)}
{''.join(marker_svg)}
<g transform="translate({VB_W - 120},{90})" class="north"><path d="M0,-55 L22,25 L0,10 L-22,25 Z"/><text y="70">N</text></g>
<g transform="translate(50,{VB_H - 70})" class="scale"><rect width="{bar_px:.1f}" height="14"/><text y="-14">200 m</text></g>
</g>
<rect width="{VB_W}" height="{VB_H}" class="frame"/>
</svg>'''

# ---------- page ----------
STOPS = [
    ("S", "Hoàn Kiếm Lake, north end", "Start where Hàng Đào leaves the lake, at the Cầu Gỗ corner. From first light, locals jog, dance and practise tai chi around the lake."),
    ("1", "Đồng Xuân Market", "Walk north on Hàng Đào, Hàng Ngang and Hàng Đường, the night-market route on Friday–Sunday evenings. Đồng Xuân is the city's largest covered market; the food stalls around its edges are the draw."),
    ("2", "Ô Quan Chưởng gate", "Follow Hàng Chiếu east. First built in 1749, it is the only old city gate still standing, and motorbikes still pass through it."),
    ("3", "87 Mã Mây heritage house", "A restored merchant tube house: narrow at the front, deep at the back, with small courtyards. Entry about 20,000 VND. Check the fee and opening hours at the door."),
    ("4", "Hàng Bạc and Đình Kim Ngân", "Hàng Bạc was the silver street. Đình Kim Ngân, the communal house at 42 Hàng Bạc, honours the founders of the silversmith trade."),
    ("5", "Tạ Hiện", "Quiet in the morning. After dark it fills with low plastic stools, cold beer and music, so come back in the evening."),
    ("6", "Bạch Mã Temple, 76 Hàng Buồm", "One of the oldest temples in the quarter. Free to enter; usually closed at lunch. Dress modestly."),
]
ZONE_OF = {"1": "Zone 1", "2": "Zone 1", "3": "Zone 2", "4": "Zone 3", "5": "Zone 4"}
stop_html = []
for k, title, body in STOPS:
    z = ZONE_OF.get(k)
    ztag = f'<span class="ztag">{z}</span>' if z else ""
    stop_html.append(
        f'<li><span class="num">{k}</span><div><div class="when">{fmt(times[k])} {ztag}</div>'
        f'<h3>{html.escape(title)}</h3><p>{html.escape(body)}</p></div></li>')

zones_html = "".join(f'<li><b>{z}</b> {html.escape(lbl)}</li>' for z, _, lbl in ZONES)
km = total_m / 1000
page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Hanoi Old Quarter Walking Map: 2-Hour Photo Walk | TravelFrame</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
@page {{ size: A4; margin: 0; }}
:root {{ --paper:#EDE6D6; --ink:#202528; --brick:#A0402C; --mustard:#E2A838; --green:#3A4B3A; --water:#B9CBC4; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ background: var(--paper); }}
body {{ width: 210mm; height: 297mm; color: var(--ink); font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden; }}
.draft {{ position: absolute; top: 6mm; right: 10mm; font: 700 7.5pt 'Space Mono', monospace; color: var(--brick); border: 1.2px solid var(--brick); padding: 1mm 2mm; letter-spacing: .08em; }}
header {{ position: absolute; left: 10mm; top: 9mm; right: 10mm; }}
.kicker {{ font: 700 8pt 'Space Mono', monospace; letter-spacing: .12em; color: var(--brick); }}
h1 {{ font: 400 27pt/1 'Anton', sans-serif; letter-spacing: .01em; margin-top: 1.5mm; }}
.sub {{ font: 400 8.5pt 'Space Mono', monospace; margin-top: 2mm; }}
.map {{ position: absolute; left: 10mm; top: 40mm; width: 118mm; height: 222mm; }}
.land {{ fill: #E6DDC8; }}
.water {{ fill: var(--water); stroke: #8FAAA1; stroke-width: 3; }}
.lake {{ font: 700 26px 'Space Mono', monospace; fill: #5E7D73; letter-spacing: .15em; text-anchor: middle; }}
.sc {{ fill: none; stroke: #C9BEA5; stroke-linecap: round; stroke-linejoin: round; }}
.s {{ fill: none; stroke: #FBF8F1; stroke-linecap: round; stroke-linejoin: round; }}
.rail {{ fill: none; stroke: #8A8170; stroke-width: 8; stroke-dasharray: 18 10; }}
.market {{ fill: #D9C7A0; stroke: #B49F72; stroke-width: 3; }}
.zone {{ fill: none; stroke: var(--mustard); stroke-width: 60; stroke-opacity: .55; stroke-linecap: round; stroke-linejoin: round; }}
.route-c {{ fill: none; stroke: #FBF8F1; stroke-width: 22; stroke-linecap: round; stroke-linejoin: round; }}
.route {{ fill: none; stroke: var(--brick); stroke-width: 12; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 30 16; }}
.st {{ font: 600 21px 'Plus Jakarta Sans', sans-serif; fill: #4A4F52; text-anchor: middle; paint-order: stroke; stroke: #FBF8F1; stroke-width: 6px; }}
.lm {{ font: 700 22px 'Plus Jakarta Sans', sans-serif; fill: var(--green); paint-order: stroke; stroke: #F4EFE3; stroke-width: 7px; }}
.lmd {{ fill: var(--green); stroke: #F4EFE3; stroke-width: 4; }}
.mk circle {{ fill: var(--ink); stroke: var(--mustard); stroke-width: 6; }}
.mk text {{ font: 400 38px 'Anton', sans-serif; fill: var(--mustard); text-anchor: middle; }}
.north path {{ fill: var(--ink); }} .north text {{ font: 700 26px 'Space Mono', monospace; text-anchor: middle; fill: var(--ink); }}
.scale rect {{ fill: var(--ink); }} .scale text {{ font: 700 22px 'Space Mono', monospace; fill: var(--ink); }}
.frame {{ fill: none; stroke: var(--ink); stroke-width: 4; }}
aside {{ position: absolute; left: 133mm; top: 40mm; width: 67mm; }}
.zones {{ list-style: none; font-size: 7.5pt; margin-bottom: 3mm; padding: 2mm 2.5mm; background: rgba(226,168,56,.28); }}
.zones li {{ margin: .6mm 0; }} .zones b {{ font-family: 'Space Mono', monospace; }}
.stops {{ list-style: none; }}
.stops li {{ display: flex; gap: 2.2mm; margin-bottom: 2.6mm; }}
.num {{ flex: 0 0 6.5mm; height: 6.5mm; border-radius: 50%; background: var(--ink); color: var(--mustard); font: 400 11pt/6.5mm 'Anton', sans-serif; text-align: center; }}
.when {{ font: 700 6.8pt 'Space Mono', monospace; color: var(--brick); }}
.ztag {{ color: var(--ink); background: rgba(226,168,56,.45); padding: 0 1mm; margin-left: 1mm; }}
.stops h3 {{ font: 800 8.4pt/1.2 'Plus Jakarta Sans', sans-serif; margin: .4mm 0 .5mm; }}
.stops p {{ font-size: 6.9pt; line-height: 1.38; }}
.finish {{ font-size: 6.9pt; line-height: 1.38; border-top: 1px solid var(--ink); padding-top: 2mm; margin-top: 1mm; }}
.tips {{ margin-top: 3mm; background: var(--ink); color: var(--paper); padding: 2.5mm 3mm; font-size: 6.8pt; line-height: 1.4; }}
.tips h4 {{ font: 700 7pt 'Space Mono', monospace; letter-spacing: .1em; color: var(--mustard); margin-bottom: 1mm; }}
.tips li {{ margin-left: 3mm; }}
footer {{ position: absolute; left: 10mm; right: 10mm; bottom: 9mm; display: flex; justify-content: space-between; align-items: flex-end; gap: 6mm; }}
.cta {{ font: 800 9pt 'Plus Jakarta Sans', sans-serif; }} .cta span {{ color: var(--brick); }}
.cta small {{ display: block; font: 400 7pt 'Space Mono', monospace; margin-top: 1mm; }}
.attr {{ font: 400 6pt 'Space Mono', monospace; text-align: right; color: #55584f; }}
</style></head><body>
<header>
  <div class="kicker">TRAVELFRAME · HANOI FIELD MAP</div>
  <h1>HANOI OLD QUARTER: A 2-HOUR PHOTO WALK</h1>
  <p class="sub">4 zones · {len([s for s in snapped if s[3]]) - 1} stops · {km:.1f} km on foot ({walk_min:.0f} min walking) · start 7:00 for soft light and quiet streets</p>
</header>
{svg}
<aside>
  <ul class="zones">{zones_html}</ul>
  <ol class="stops">{''.join(stop_html)}</ol>
  <p class="finish"><b>Finish around {fmt(finish_clock)}.</b> Back to the lake: about {back_m / 1000 / WALK_KMH * 60:.0f} minutes on foot ({back_m:.0f} m) south via Hàng Ngang and Hàng Đào. Times are approximate.</p>
  <div class="tips"><h4>PHOTO TIPS</h4><ul>
    <li>Look for yellow facades, green shutters and lanterns; early light is soft and the streets are emptier.</li>
    <li>Check the top of your frame: stray power cables can cut across a portrait.</li>
    <li>Smile and say "Xin chào" before photographing people or shops. If they say no, move on.</li>
  </ul></div>
</aside>
<footer>
  <div class="cta">Want photos of <span>you</span> on this walk? Message <span>PHOTO</span> to @travelframe.vn on Instagram.
    <small>Full guide: travelframe.sidevn.com/news/hanoi-old-quarter-guide</small></div>
  <div class="attr">Map data © OpenStreetMap contributors (ODbL)<br>Route measured on OSM streets · checked 9 Nov 2026</div>
</footer>
</body></html>'''

OUT.write_text(page, encoding="utf-8")
print(f"wrote {OUT.name}: route {total_m:.0f} m, walk {walk_min:.0f} min, finish {fmt(finish_clock)}, back {back_m:.0f} m")
for k, title, _ in STOPS:
    print(f"  {k} {fmt(times[k])} {title}")
