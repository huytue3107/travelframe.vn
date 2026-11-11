"""Lowercase design, matched to the traced uppercase system."""
import math
import shape as S

XH = 500.0
ASC = 700.0
DESC = -180.0
T = 116.0   # thick (vertical stems)
N = 84.0    # thin (horizontal bars)

# per-glyph optical sidebearings (left, right)
SPACING = {
    "a": (42, 52), "b": (56, 44), "c": (46, 38), "d": (44, 56), "e": (44, 40),
    "f": (40, 26), "g": (42, 44), "h": (56, 56), "i": (56, 60), "j": (44, 60),
    "k": (56, 48), "l": (56, 60), "m": (56, 56), "n": (56, 56), "o": (42, 42),
    "p": (56, 44), "q": (44, 56), "r": (56, 30), "s": (40, 40), "t": (32, 34),
    "u": (56, 56), "v": (34, 34), "w": (34, 34), "x": (34, 34), "y": (34, 34),
    "z": (40, 40), "ı": (56, 60),
}


def _bowl(w, top, bot, left=0.0, tx=None, ty=None):
    cy = (top + bot) / 2.0
    ry = (top - bot) / 2.0
    cx = left + w / 2.0
    rx = w / 2.0
    return S.ring(cx, cy, rx, ry, T if tx is None else tx, N - 8 if ty is None else ty)


def o():
    return _bowl(404, XH + 6, -6), 404


def a():
    w = 400.0
    return S.merge(_bowl(w, XH - 106, -6, left=0), S.stem(w - T, T, 0, XH)), w


def n():
    w, r = 364.0, 182.0
    cy = XH - r
    tx = min(T, r - 26)
    return S.merge(
        S.stem(0, T, 0, cy + 6),
        S.stem(w - T, T, 0, cy + 6),
        S.arc_band(w / 2, cy, r, r, tx, N, math.pi, 0),
    ), w


def h():
    w, r = 364.0, 182.0
    cy = XH - r
    tx = min(T, r - 26)
    return S.merge(
        S.stem(0, T, 0, ASC),
        S.stem(w - T, T, 0, cy + 6),
        S.arc_band(w / 2, cy, r, r, tx, N, math.pi, 0),
    ), w


def u():
    w, r = 364.0, 182.0
    cy = r
    tx = min(T, r - 26)
    return S.merge(
        S.stem(0, T, cy - 6, XH),
        S.stem(w - T, T, cy - 6, XH),
        S.arc_band(w / 2, cy, r, r, tx, N, 0, -math.pi),
    ), w


def m():
    w = 566.0
    gap = (w - 3 * T) / 2.0
    stems = [0.0, T + gap, 2 * (T + gap)]
    r = (stems[1] - stems[0]) / 2.0
    cy = XH - r
    tx = min(T, r - 26)
    parts = [S.stem(x, T, 0, cy + 6) for x in stems]
    for i in range(2):
        cxx = stems[i] + (stems[i + 1] - stems[i]) / 2.0
        parts.append(S.arc_band(cxx, cy, r, r, tx, N, math.pi, 0))
    return S.merge(*parts), w


def b():
    w = 400.0
    return S.merge(_bowl(w, XH + 6, -6), S.stem(0, T, 0, ASC)), w


def d():
    w = 400.0
    return S.merge(_bowl(w, XH + 6, -6), S.stem(w - T, T, 0, ASC)), w


def p():
    w = 400.0
    return S.merge(_bowl(w, XH + 6, -6), S.stem(0, T, DESC, XH)), w


def q():
    w = 400.0
    return S.merge(_bowl(w, XH + 6, -6), S.stem(w - T, T, DESC, XH)), w


def g():
    w = 400.0
    ry = 124.0
    cy = DESC + ry
    return S.merge(
        _bowl(w, XH - 106, -6, left=0),
        S.stem(w - T, T, cy, XH),
        S.arc_band(w / 2, cy, w / 2, ry, T, N, 0, -math.radians(162)),
    ), w


def c():
    w = 386.0
    return S.merge(
        S.arc_band(w / 2, XH / 2 + 2, w / 2, XH / 2 + 2, T, N - 8,
                   math.radians(44), math.radians(316))
    ), w


def e():
    w = 400.0
    return S.merge(
        S.arc_band(w / 2, XH / 2 + 2, w / 2, XH / 2 + 2, T, N - 8,
                   math.radians(8), math.radians(326)),
        S.bar(0, w, XH * 0.455 - N / 2, N),
    ), w


def s():
    w = 336.0
    pts = [(w * 0.84, XH * 0.94), (w * 0.44, XH * 1.00), (w * 0.13, XH * 0.79),
           (w * 0.36, XH * 0.56), (w * 0.71, XH * 0.44), (w * 0.88, XH * 0.19),
           (w * 0.52, XH * -0.02), (w * 0.16, XH * 0.07)]
    return S.ribbon(pts, [N * 0.86, N * 0.95, T * 0.98, T, T * 0.98, N, N * 0.95,
                          N * 0.86]), w


def r():
    w = 276.0
    return S.merge(
        S.stem(0, T, 0, XH),
        S.stroke_outline([(T / 2, XH - 176), (T / 2 + 46, XH - 26), (w - 18, XH + 4)],
                         [N, N * 0.92, N * 0.55]),
    ), w


def f():
    w = 276.0
    return S.merge(
        S.stem(56, T, 0, ASC),
        S.stroke_outline([(56 + T / 2, ASC - 20), (56 + T / 2, ASC), (w, ASC)],
                         [N * 0.95, N * 0.9, N * 0.8]),
        S.bar(0, w - 16, XH - 30, N - 8),
    ), w


def t():
    w = 264.0
    return S.merge(
        S.stem(56, T, -26, ASC - 14),
        S.bar(0, w, XH - 26, N - 8),
    ), w


def i():
    w = 132.0
    return S.merge(S.stem(0, T, 0, XH), S.rect(0, XH + 120, T, XH + 216)), w


def j():
    w = 196.0
    rx, ry = 132.0, 124.0
    cy = DESC + ry
    return S.merge(
        S.stem(w - T, T, cy, XH),
        S.arc_band(w - rx, cy, rx, ry, T, N, 0, -math.radians(160)),
        S.rect(w - T, XH + 120, w, XH + 216),
    ), w


def dotlessi():
    return [S.stem(0, T, 0, XH)], 132.0


def l():
    return [S.stem(0, T, 0, ASC)], T


def k():
    w = 348.0
    return S.merge(
        S.stem(0, T, 0, ASC),
        S.stroke_outline([(w - 8, XH), (112, XH * 0.66), (w - 8, 0)],
                         [N * 0.95, T * 0.95, N * 0.95]),
    ), w


def v():
    w = 344.0
    return S.merge(
        S.poly([(0, XH), (w / 2, 0), (w, XH), (w - T * 0.93, XH),
                (w / 2, 92), (T * 0.93, XH)])
    ), w


def w():
    w = 512.0
    h = XH * 0.86
    q = w * 0.25
    p1 = S.poly([(0, XH), (T, XH), (q + T / 2, 0), (q - T / 2, 0)])
    p2 = S.poly([(q - T / 2, 0), (q + T / 2, 0), (2 * q + T / 2, h), (2 * q - T / 2, h)])
    p3 = S.poly([(2 * q - T / 2, h), (2 * q + T / 2, h), (3 * q + T / 2, 0), (3 * q - T / 2, 0)])
    p4 = S.poly([(3 * q - T / 2, 0), (3 * q + T / 2, 0), (w, XH), (w - T, XH)])
    return S.merge(p1, p2, p3, p4), w


def x():
    w = 336.0
    return S.merge(
        S.stroke_outline([(T / 2, XH), (w - T / 2, 0)], [T, T * 0.9]),
        S.stroke_outline([(w - T / 2, XH), (T / 2, 0)], [T, T * 0.9]),
    ), w


def y():
    w = 344.0
    return S.merge(
        S.stroke_outline([(T / 2, XH), (w / 2 - 34, XH * 0.18)], [T, T * 1.04]),
        S.stroke_outline([(w - T / 2, XH), (w / 2, XH * 0.30), (w / 2 - 96, DESC)],
                         [T, T * 0.92, T * 0.72]),
    ), w


def z():
    w = 316.0
    return S.merge(
        S.bar(0, w, XH - N, N),
        S.stroke_outline([(w - 40, XH - N), (40, N)], [T * 0.95, T * 0.9]),
        S.bar(0, w, 0, N),
    ), w


LOWER_FUNCS = {
    "a": a, "b": b, "c": c, "d": d, "e": e, "f": f, "g": g, "h": h,
    "i": i, "j": j, "k": k, "l": l, "m": m, "n": n, "o": o, "p": p,
    "q": q, "r": r, "s": s, "t": t, "u": u, "v": v, "w": w, "x": x,
    "y": y, "z": z, "ı": dotlessi,
}


def build_lower():
    out = {}
    for ch, fn in LOWER_FUNCS.items():
        cont, w = fn()
        if cont and isinstance(cont[0], tuple):
            cont = [cont]
        lsb, rsb = SPACING[ch]
        out[ch] = dict(cont=cont, adv=lsb + w + rsb, sb=lsb)
    return out
