"""TravelFrame display face — rebuilt from the reference specimen sheet.

Pipeline: raster crop -> threshold -> potrace -> cubic contours -> font units.
"""
import numpy as np
import potrace
from PIL import Image

UPM = 1000
CAP = 700.0
REF_BG = np.array([252, 201, 32])

# row -> (cap_top_px, baseline_px)
ROWS = {
    1: (947.5, 1067.0),
    2: (1137.0, 1256.0),
    3: (1327.5, 1445.0),
    4: (1521.5, 1640.0),
    5: (1711.5, 1830.0),
    6: (1901.0, 2022.0),
}

# char -> (row, x0, y0, x1, y1)
UPPER = {
    "A": (4, 25, 1521, 115, 1640),
    "Ă": (4, 131, 1495, 221, 1640),
    "Â": (1, 94, 920, 184, 1067),
    "B": (1, 304, 947, 392, 1067),
    "C": (1, 402, 948, 487, 1069),
    "D": (1, 732, 948, 822, 1067),
    "Đ": (1, 831, 948, 923, 1067),
    "E": (1, 1027, 948, 1099, 1067),
    "Ê": (1, 1110, 925, 1186, 1067),
    "F": (1, 1454, 948, 1524, 1067),
    "G": (1, 1527, 947, 1616, 1069),
    "H": (1, 1722, 950, 1828, 1067),
    "I": (1, 1836, 947, 1872, 1068),
    "J": (1, 1940, 921, 2037, 1067),
    "L": (2, 35, 1137, 110, 1256),
    "M": (2, 192, 1137, 317, 1256),
    "N": (2, 327, 1137, 419, 1256),
    "O": (2, 435, 1136, 526, 1259),
    "Ô": (2, 1044, 1114, 1134, 1259),
    "Ơ": (2, 1146, 1127, 1243, 1259),
    "P": (2, 1486, 1137, 1576, 1256),
    "Q": (2, 1584, 1136, 1678, 1258),
    "R": (2, 1790, 1137, 1881, 1256),
    "S": (6, 20, 1900, 105, 2022),
    "U": (6, 293, 1902, 376, 2022),
    "Ư": (3, 37, 1316, 136, 1448),
    "V": (3, 536, 1328, 625, 1445),
    "W": (3, 776, 1328, 913, 1445),
    "X": (3, 919, 1328, 1009, 1445),
    "Y": (3, 1104, 1326, 1193, 1448),
    "Z": (3, 1194, 1326, 1273, 1448),
    "0": (3, 1396, 1326, 1479, 1448),
    "1": (3, 1485, 1328, 1539, 1445),
    "2": (3, 1553, 1327, 1629, 1445),
    "3": (3, 1635, 1326, 1719, 1448),
    "4": (3, 1727, 1328, 1817, 1445),
    "5": (3, 1824, 1326, 1909, 1449),
    "6": (3, 1918, 1326, 2005, 1448),   # complete on the sheet (v1.0 redrew it by hand)
    "&": (3, 1282, 1326, 1388, 1448),
}

# mark -> (row, x0, y0, x1, y1, band)  band: 'top' picks highest ink band above cap
MARKS = {
    # name: (row, x0, y0, x1, y1)  tight box around the mark only
    "circumflex": (1, 1106, 921, 1189, 945),   # over Ê
    "breve": (4, 133, 1496, 219, 1519),        # over Ă (row 4)
    "grave": (1, 1188, 917, 1269, 945),        # over È
    "acute": (2, 559, 1106, 640, 1133),        # over Ó
    "hook": (1, 1889, 915, 1924, 945),         # over Ỉ
    "tilde": (3, 136, 1301, 225, 1323),        # over Ũ
}


def ink_mask(rgb, tol=90):
    d = np.abs(rgb.astype(int) - REF_BG).sum(2)
    return d > tol


def _path_of(curve):
    out = []
    p = curve.start_point
    out.append(("M", p.x, p.y))
    for seg in curve.segments:
        if seg.is_corner:
            c, e = seg.c, seg.end_point
            out.append(("L", c.x, c.y))
            out.append(("L", e.x, e.y))
        else:
            c1, c2, e = seg.c1, seg.c2, seg.end_point
            out.append(("C", c1.x, c1.y, c2.x, c2.y, e.x, e.y))
    out.append(("Z",))
    return out


def _coverage(crop, tol=90):
    """Anti-aliased ink coverage 0..1, normalised to the local ink colour."""
    d = np.abs(crop.astype(float) - REF_BG).sum(2)
    ink = d[d > tol]
    d_ink = np.percentile(ink, 90) if ink.size else 1.0
    return np.clip(d / max(d_ink, 1.0), 0.0, 1.0), d > tol


def _dilate(m, r=1):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def _erode(m, r=1):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out &= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def _open3(m):
    return _dilate(_erode(m, 1), 1) & m


def trace_region(img, x0, y0, x1, y1, pad=5, up=4, turd=4, alphamax=0.9, opttol=0.2,
                 keep="inside", min_area=40):
    """Return contours in original image pixel coordinates (floats).

    keep="inside": keep ink components whose centre lies inside [x0, x1] (drops
    slivers of neighbouring letters that leak into the crop).
    keep="largest": keep only the biggest component (used for marks).
    """
    import cc
    from PIL import ImageFilter
    H, W, _ = img.shape
    cx0, cy0 = max(0, x0 - pad), max(0, y0 - pad)
    cx1, cy1 = min(W, x1 + pad), min(H, y1 + pad)
    crop = img[cy0:cy1, cx0:cx1]
    alpha, mask = _coverage(crop)
    # letters touch their neighbours on the sheet: cut at the box edges, then an
    # opening (3x3) removes the 1-3 px slivers of the neighbour left at the cut
    win = np.zeros_like(mask)
    win[:, max(0, x0 - cx0):x1 - cx0 + 1] = True
    mask = _open3(mask & win)
    alpha = alpha * win
    lab, comps = cc.label(mask)
    comps = [c for c in comps if c["area"] >= min_area]
    if keep == "largest":
        comps = sorted(comps, key=lambda c: -c["area"])[:1]
    else:
        big = max(comps, key=lambda c: c["area"])
        wl, wr = max(0, x0 - cx0), x1 - cx0
        comps = [c for c in comps if x0 <= cx0 + c["cx"] <= x1 and
                 (c is big or c["x1"] - c["x0"] > 8 or
                  (c["x0"] > wl + 1 and c["x1"] < wr - 1))]
    keepm = np.isin(lab, [c["id"] for c in comps])
    alpha = alpha * (_dilate(keepm, 2) & win)
    a = Image.fromarray((alpha * 255).astype(np.uint8))
    a = a.resize((a.width * up, a.height * up), Image.BICUBIC)
    a = a.filter(ImageFilter.GaussianBlur(up * 0.35))
    arr = (np.asarray(a) < 128)          # potracer: True = background
    path = potrace.Bitmap(arr).trace(
        turdsize=turd * up,
        turnpolicy=getattr(potrace, "TURNPOLICY_MINORITY",
                           getattr(potrace, "POTRACE_TURNPOLICY_MINORITY", 0)),
        alphamax=alphamax, opticurve=True, opttolerance=opttol,
    )
    out = []
    for c in path:
        pc = _path_of(c)
        nc = []
        for seg in pc:
            if seg[0] == "M":
                nc.append(("M", cx0 + seg[1] / up, cy0 + seg[2] / up))
            elif seg[0] == "L":
                nc.append(("L", cx0 + seg[1] / up, cy0 + seg[2] / up))
            elif seg[0] == "C":
                nc.append(("C", cx0 + seg[1] / up, cy0 + seg[2] / up,
                           cx0 + seg[3] / up, cy0 + seg[4] / up,
                           cx0 + seg[5] / up, cy0 + seg[6] / up))
            else:
                nc.append(("Z",))
        out.append(nc)
    return out


def to_font(contours, scale, ox, oy, x0, y0):
    """Image px -> font units. x' = (x - x0)*scale + ox ; y' = (y0 - y)*scale + oy"""
    out = []
    for c in contours:
        nc = []
        for seg in c:
            if seg[0] == "M":
                nc.append(("M", (seg[1] - x0) * scale + ox, (y0 - seg[2]) * scale + oy))
            elif seg[0] == "L":
                nc.append(("L", (seg[1] - x0) * scale + ox, (y0 - seg[2]) * scale + oy))
            elif seg[0] == "C":
                nc.append(("C",
                           (seg[1] - x0) * scale + ox, (y0 - seg[2]) * scale + oy,
                           (seg[3] - x0) * scale + ox, (y0 - seg[4]) * scale + oy,
                           (seg[5] - x0) * scale + ox, (y0 - seg[6]) * scale + oy))
            else:
                nc.append(("Z",))
        out.append(nc)
    return out


def bbox(contours):
    xs, ys = [], []
    for c in contours:
        for seg in c:
            if seg[0] == "M":
                xs.append(seg[1]); ys.append(seg[2])
            elif seg[0] == "L":
                xs.append(seg[1]); ys.append(seg[2])
            elif seg[0] == "C":
                xs.extend([seg[1], seg[3], seg[5]]); ys.extend([seg[2], seg[4], seg[6]])
    if not xs:
        return (0, 0, 0, 0)
    return (min(xs), min(ys), max(xs), max(ys))


def shift(contours, dx, dy):
    out = []
    for c in contours:
        nc = []
        for seg in c:
            if seg[0] == "M" or seg[0] == "L":
                nc.append((seg[0], seg[1] + dx, seg[2] + dy))
            elif seg[0] == "C":
                nc.append(("C", seg[1] + dx, seg[2] + dy, seg[3] + dx, seg[4] + dy,
                           seg[5] + dx, seg[6] + dy))
            else:
                nc.append(("Z",))
        out.append(nc)
    return out


ROUND = set("COGSQØ06ÔƠỐỒỔỖỘỚỜỞỠỢỎÓÕỌ©®@")


def build_upper(img):
    glyphs = {}
    for ch, (row, x0, y0, x1, y1) in UPPER.items():
        captop, bl = ROWS[row]
        s = CAP / (bl - captop)
        cont = trace_region(img, x0, y0, x1, y1)
        lsb = 30 if ch in ROUND else 45
        f = to_font(cont, s, lsb, 0.0, x0, bl)
        adv = (x1 - x0) * s + 2 * lsb
        glyphs[ch] = dict(cont=f, adv=adv, lsb=lsb)
    return glyphs


def build_marks(img):
    """Marks in font units, centred on x=0 with their bottom on y=0 (native cap scale)."""
    marks = {}
    for name, (row, x0, y0, x1, y1) in MARKS.items():
        captop, bl = ROWS[row]
        s = CAP / (bl - captop)
        cont = trace_region(img, x0, y0, x1, y1, pad=2, keep="largest", min_area=20)
        f = to_font(cont, s, 0, 0, (x0 + x1) / 2.0, y1)
        bx0, by0, bx1, by1 = bbox(f)
        f = shift(f, -(bx0 + bx1) / 2.0, -by0)
        marks[name] = dict(cont=f, w=bx1 - bx0, h=by1 - by0)
    return marks


if __name__ == "__main__":
    img = np.asarray(Image.open("ref/a.png").convert("RGB"))
    g = build_upper(img)
    m = build_marks(img)
    for k, v in sorted(g.items()):
        print(f"{k} adv={v['adv']:.0f}")
    for k, v in m.items():
        print(f"mark {k}: w={v['w']:.0f} h={v['h']:.0f}")
