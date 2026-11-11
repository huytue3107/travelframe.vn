"""Contour helpers: flattening, orientation, clearance, overlap removal."""
import numpy as np


def flatten(c, n=12):
    pts, cur = [], None
    for s in c:
        if s[0] in ("M", "L"):
            cur = (s[1], s[2])
            pts.append(cur)
        elif s[0] == "C":
            p0, p1, p2, p3 = cur, (s[1], s[2]), (s[3], s[4]), (s[5], s[6])
            for i in range(1, n + 1):
                t = i / n
                mt = 1 - t
                pts.append((mt ** 3 * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t ** 3 * p3[0],
                            mt ** 3 * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t ** 3 * p3[1]))
            cur = p3
    return pts


def area(c):
    p = flatten(c)
    a = 0.0
    for i in range(len(p)):
        x1, y1 = p[i]
        x2, y2 = p[(i + 1) % len(p)]
        a += x1 * y2 - x2 * y1
    return a / 2.0


def reverse(c):
    segs = [s for s in c if s[0] != "Z"]
    anchors = [(segs[0][1], segs[0][2])] + [(s[-2], s[-1]) for s in segs[1:]]
    out = [("M",) + anchors[-1]]
    for i in range(len(segs) - 1, 0, -1):
        s = segs[i]
        a = anchors[i - 1]
        if s[0] == "C":
            out.append(("C", s[3], s[4], s[1], s[2], a[0], a[1]))
        else:
            out.append(("L", a[0], a[1]))
    out.append(("Z",))
    return out


def _inside(pt, poly):
    x, y = pt
    inside = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xi = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if xi > x:
                inside = not inside
    return inside


def normalize(part):
    """Non-overlapping nested contours (a traced shape): solids CCW, holes CW."""
    polys = [flatten(c) for c in part]
    out = []
    for i, c in enumerate(part):
        probe = polys[i][0]
        depth = sum(1 for j, q in enumerate(polys) if j != i and _inside(probe, q))
        want_pos = depth % 2 == 0
        out.append(c if (area(c) > 0) == want_pos else reverse(c))
    return out


def transform(contours, sx=1.0, sy=1.0, dx=0.0, dy=0.0):
    out = []
    for c in contours:
        nc = []
        for s in c:
            if s[0] in ("M", "L"):
                nc.append((s[0], s[1] * sx + dx, s[2] * sy + dy))
            elif s[0] == "C":
                nc.append(("C", s[1] * sx + dx, s[2] * sy + dy, s[3] * sx + dx,
                           s[4] * sy + dy, s[5] * sx + dx, s[6] * sy + dy))
            else:
                nc.append(("Z",))
        out.append(nc)
    if sx * sy < 0:
        out = [reverse(c) for c in out]
    return out


def shear_y(contours, k):
    """y' = y + k*x  (k>0 makes a mark rise to the right)."""
    out = []
    for c in contours:
        nc = []
        for s in c:
            if s[0] in ("M", "L"):
                nc.append((s[0], s[1], s[2] + k * s[1]))
            elif s[0] == "C":
                nc.append(("C", s[1], s[2] + k * s[1], s[3], s[4] + k * s[3], s[5], s[6] + k * s[5]))
            else:
                nc.append(("Z",))
        out.append(nc)
    return out


def bbox(contours):
    pts = [p for c in contours for p in flatten(c, 6)]
    if not pts:
        return (0, 0, 0, 0)
    a = np.array(pts)
    return (a[:, 0].min(), a[:, 1].min(), a[:, 0].max(), a[:, 1].max())


def body_bbox(contours, ymax):
    """bbox of the points at or below ymax (ignores marks / horn above)."""
    pts = [p for c in contours for p in flatten(c, 6) if p[1] <= ymax]
    a = np.array(pts)
    return (a[:, 0].min(), a[:, 1].min(), a[:, 0].max(), a[:, 1].max())


def _dense(contours, step=6.0):
    pts = []
    for c in contours:
        p = flatten(c, 16)
        for i in range(len(p)):
            x1, y1 = p[i]
            x2, y2 = p[(i + 1) % len(p)]
            L = max(1, int(np.hypot(x2 - x1, y2 - y1) / step))
            for k in range(L):
                t = k / L
                pts.append((x1 + (x2 - x1) * t, y1 + (y2 - y1) * t))
    return np.array(pts)


def clearance(a, b):
    """Minimum distance between outlines a and b; negative if they overlap."""
    pa, pb = _dense(a), _dense(b)
    d = np.sqrt(((pa[:, None, :] - pb[None, :, :]) ** 2).sum(-1)).min()
    polys_b = [flatten(c) for c in b]
    polys_a = [flatten(c) for c in a]
    hit = any(_inside(tuple(p), q) for p in pa[::7] for q in polys_b) or \
        any(_inside(tuple(p), q) for p in pb[::7] for q in polys_a)
    return -d if hit else d


def lift_until_clear(mark, base, gap, step=4.0, limit=400):
    """Move mark up until it keeps at least `gap` units from base."""
    dy = 0.0
    m = mark
    while dy < limit:
        if clearance(m, base) >= gap:
            return m, dy
        dy += step
        m = transform(mark, dy=dy)
    return m, dy


def to_pathops(contours):
    import pathops
    p = pathops.Path()
    pen = p.getPen()
    for c in contours:
        for s in c:
            if s[0] == "M":
                pen.moveTo((s[1], s[2]))
            elif s[0] == "L":
                pen.lineTo((s[1], s[2]))
            elif s[0] == "C":
                pen.curveTo((s[1], s[2]), (s[3], s[4]), (s[5], s[6]))
            else:
                pen.closePath()
    return p


def clean(contours, clockwise):
    """Remove overlaps (nonzero union) and set a uniform outer direction."""
    import pathops
    p = to_pathops(contours)
    return pathops.simplify(p, fix_winding=True, clockwise=clockwise)
