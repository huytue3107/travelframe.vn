"""Parametric contour construction in font units (y-up, baseline = 0)."""
import math

KAPPA = 0.5522847498


def _area(c):
    a = 0.0
    pts = [s for s in c if s[0] in ("M", "L", "C")]
    # flatten roughly for area sign: sample curve endpoints + controls is enough for orientation
    poly = []
    for s in c:
        if s[0] == "M" or s[0] == "L":
            poly.append((s[1], s[2]))
        elif s[0] == "C":
            poly.append((s[5], s[6]))
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        a += x1 * y2 - x2 * y1
    return a / 2.0


def orient(c, clockwise=True):
    if (_area(c) > 0) == clockwise:
        return c
    # reverse
    pts = c[:-1]
    # rebuild reversed path using endpoints
    segs = []
    for s in pts:
        if s[0] == "M":
            segs.append(("M", s[1], s[2]))
        elif s[0] == "L":
            segs.append(("L", s[1], s[2]))
        elif s[0] == "C":
            segs.append(("C", s[1], s[2], s[3], s[4], s[5], s[6]))
    # reversed traversal
    start = None
    rev = []
    # collect anchor points in order
    anchors = [(segs[0][1], segs[0][2])]
    for s in segs[1:]:
        anchors.append((s[-2], s[-1]))
    n = len(anchors)
    rev.append(("M", anchors[-1][0], anchors[-1][1]))
    for i in range(n - 1, 0, -1):
        s = segs[i]
        if s[0] == "L":
            rev.append(("L", anchors[i - 1][0], anchors[i - 1][1]))
        else:
            rev.append(("C", s[3], s[4], s[1], s[2], anchors[i - 1][0], anchors[i - 1][1]))
    rev.append(("Z",))
    return rev


def rect(x0, y0, x1, y1):
    if x1 <= x0:
        x0, x1 = x1, x0
    if y1 <= y0:
        y0, y1 = y1, y0
    c = [("M", x0, y0), ("L", x0, y1), ("L", x1, y1), ("L", x1, y0), ("Z",)]
    return orient(c, True)


def stem(x, w, y0, y1):
    return rect(x, y0, x + w, y1)


def bar(x0, x1, y, h):
    return rect(x0, y, x1, y + h)


def _arc_segments(cx, cy, rx, ry, a0, a1, steps=None):
    """Return list of ('C', ...) segments approximating the elliptical arc a0->a1 (radians)."""
    if steps is None:
        steps = max(1, int(math.ceil(abs(a1 - a0) / (math.pi / 2))))
    out = []
    for i in range(steps):
        t0 = a0 + (a1 - a0) * i / steps
        t1 = a0 + (a1 - a0) * (i + 1) / steps
        d = t1 - t0
        k = 4.0 / 3.0 * math.tan(d / 4.0)
        p0 = (cx + rx * math.cos(t0), cy + ry * math.sin(t0))
        p3 = (cx + rx * math.cos(t1), cy + ry * math.sin(t1))
        d0 = (-rx * math.sin(t0), ry * math.cos(t0))
        d1 = (-rx * math.sin(t1), ry * math.cos(t1))
        p1 = (p0[0] + k * d0[0], p0[1] + k * d0[1])
        p2 = (p3[0] - k * d1[0], p3[1] - k * d1[1])
        out.append(("C", p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]))
    return out


def ellipse(cx, cy, rx, ry):
    a0 = 0.0
    p = (cx + rx, cy)
    c = [("M", p[0], p[1])]
    c += _arc_segments(cx, cy, rx, ry, a0, a0 + 2 * math.pi)
    c.append(("Z",))
    return orient(c, True)


def ring(cx, cy, rx, ry, tx, ty):
    """Outer ellipse + inner counter (hole)."""
    return [orient(ellipse(cx, cy, rx, ry), True),
            orient(ellipse(cx, cy, rx - tx, ry - ty), False)]


def arc_band(cx, cy, rx, ry, tx, ty, a0, a1, hole=False):
    """Closed band following an elliptical arc; ends capped radially."""
    irx, iry = rx - tx, ry - ty
    c = [("M", cx + rx * math.cos(a0), cy + ry * math.sin(a0))]
    c += _arc_segments(cx, cy, rx, ry, a0, a1)
    c.append(("L", cx + irx * math.cos(a1), cy + iry * math.sin(a1)))
    c += _arc_segments(cx, cy, irx, iry, a1, a0)
    c.append(("Z",))
    return orient(c, not hole)


def poly(points, hole=False):
    c = [("M", points[0][0], points[0][1])]
    for p in points[1:]:
        c.append(("L", p[0], p[1]))
    c.append(("Z",))
    return orient(c, not hole)


def quad_band(p0, p1, p2, w0, w1=None):
    """Band along a quadratic curve from p0 to p2 with control p1."""
    if w1 is None:
        w1 = w0
    # offset in y direction only (approximation good for near-horizontal curves)
    outer = [("M", p0[0], p0[1] + w0), ("C",
              p0[0] + (p1[0] - p0[0]) * 2 / 3, p0[1] + w0 + (p1[1] - p0[1]) * 2 / 3,
              p2[0] - (p2[0] - p1[0]) * 2 / 3, p2[1] + w1 - (p2[1] - p1[1]) * 2 / 3,
              p2[0], p2[1] + w1)]
    outer += [("L", p2[0], p2[1] - w1), ("C",
              p2[0] - (p2[0] - p1[0]) * 2 / 3, p2[1] - w1 - (p2[1] - p1[1]) * 2 / 3,
              p0[0] + (p1[0] - p0[0]) * 2 / 3, p0[1] - w0 + (p1[1] - p0[1]) * 2 / 3,
              p0[0], p0[1] - w0), ("Z",)]
    return orient(outer, True)


def cubic_path(p0, c1, c2, p3):
    return [("M", p0[0], p0[1]), ("C", c1[0], c1[1], c2[0], c2[1], p3[0], p3[1])]


def bezier_band(p0, c1, c2, p3, w0, w3):
    """Ribbon along a cubic, offset mostly vertically."""
    o = [("M", p0[0], p0[1] + w0 / 2),
         ("C", c1[0], c1[1] + w0 / 2, c2[0], c2[1] + w3 / 2, p3[0], p3[1] + w3 / 2),
         ("L", p3[0], p3[1] - w3 / 2),
         ("C", c2[0], c2[1] - w3 / 2, c1[0], c1[1] - w0 / 2, p0[0], p0[1] - w0 / 2),
         ("Z",)]
    return orient(o, True)


def merge(*groups):
    out = []
    for g in groups:
        if isinstance(g, list) and g and isinstance(g[0], tuple):
            out.append(g)
        else:
            out.extend(g)
    return out


def catmull_rom(points, samples=12):
    """Densify a polyline with Catmull-Rom splines."""
    pts = [points[0]] + list(points) + [points[-1]]
    out = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        for j in range(samples):
            t = j / samples
            t2, t3 = t * t, t * t * t
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t +
                       (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
                       (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t +
                       (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
                       (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
    out.append(pts[-2])
    return out


def ribbon(points, thick, samples=14):
    """Offset a centreline polyline into a closed band. thick: float or list per point."""
    pts = catmull_rom(points, samples)
    n = len(pts)
    if not isinstance(thick, (list, tuple)):
        thick = [thick] * n
    elif len(thick) != n:
        # resample thickness list
        src = thick
        thick = [src[min(len(src) - 1, int(i / (n - 1) * len(src)))] for i in range(n)]
    left, right = [], []
    for i in range(n):
        if i == 0:
            dx, dy = pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]
        elif i == n - 1:
            dx, dy = pts[-1][0] - pts[-2][0], pts[-1][1] - pts[-2][1]
        else:
            dx, dy = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        L = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / L, dx / L
        h = thick[i] / 2.0
        left.append((pts[i][0] + nx * h, pts[i][1] + ny * h))
        right.append((pts[i][0] - nx * h, pts[i][1] - ny * h))
    # round the ends
    c = [("M", left[0][0], left[0][1])]
    for p in left[1:]:
        c.append(("L", p[0], p[1]))
    for p in reversed(right):
        c.append(("L", p[0], p[1]))
    c.append(("Z",))
    return orient(c, True)


def _cross(a, b):
    return a[0] * b[1] - a[1] * b[0]


def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1])


def stroke_outline(points, widths, miter_limit=3.2):
    """Sharp-cornered outline along a polyline (miter joins)."""
    pts = [tuple(p) for p in points]
    n = len(pts)
    if not isinstance(widths, (list, tuple)):
        widths = [widths] * n
    dirs = []
    for i in range(n - 1):
        d = _sub(pts[i + 1], pts[i])
        L = math.hypot(d[0], d[1]) or 1.0
        dirs.append((d[0] / L, d[1] / L))

    def norm(d):
        return (-d[1], d[0])

    left, right = [], []
    for i in range(n):
        if i == 0:
            dv = dirs[0]
            nv = norm(dv)
            w = widths[0] / 2.0
            left.append((pts[0][0] + nv[0] * w, pts[0][1] + nv[1] * w))
            right.append((pts[0][0] - nv[0] * w, pts[0][1] - nv[1] * w))
        elif i == n - 1:
            dv = dirs[-1]
            nv = norm(dv)
            w = widths[-1] / 2.0
            left.append((pts[-1][0] + nv[0] * w, pts[-1][1] + nv[1] * w))
            right.append((pts[-1][0] - nv[0] * w, pts[-1][1] - nv[1] * w))
        else:
            d0, d1 = dirs[i - 1], dirs[i]
            n0, n1 = norm(d0), norm(d1)
            w = widths[i] / 2.0
            den = _cross(d0, d1)
            if abs(den) < 1e-6:
                nx = (n0[0] + n1[0]) / 2.0
                ny = (n0[1] + n1[1]) / 2.0
                left.append((pts[i][0] + nx * w, pts[i][1] + ny * w))
                right.append((pts[i][0] - nx * w, pts[i][1] - ny * w))
            else:
                t = w * (_cross(n1, d1) - _cross(n0, d1)) / den
                q = (pts[i][0] + n0[0] * w + d0[0] * t,
                     pts[i][1] + n0[1] * w + d0[1] * t)
                if math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]) > miter_limit * w:
                    q = (pts[i][0] + (n0[0] + n1[0]) * w * 0.5,
                         pts[i][1] + (n0[1] + n1[1]) * w * 0.5)
                left.append(q)
                right.append((2 * pts[i][0] - q[0], 2 * pts[i][1] - q[1]))
    c = [("M", left[0][0], left[0][1])]
    for p in left[1:]:
        c.append(("L", p[0], p[1]))
    for p in reversed(right):
        c.append(("L", p[0], p[1]))
    c.append(("Z",))
    return orient(c, True)
