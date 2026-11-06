"""Automatic pair kerning from outline distance, emitted as class GPOS."""
import math
import unicodedata
import numpy as np

MIN_GAP = 34.0

SPECIAL = {"ơ": "o", "ư": "u", "đ": "d", "Ơ": "O", "Ư": "U", "Đ": "D"}


def base_of(ch):
    if ch in SPECIAL:
        return SPECIAL[ch]
    d = unicodedata.normalize("NFD", ch)
    b = d[0]
    if b in SPECIAL:
        return SPECIAL[b]
    return b


def _seg_points(contours, per_curve=8):
    pts = []
    for c in contours:
        cur, start = None, None
        for s in c:
            if s[0] == "M":
                cur = (s[1], s[2])
                start = cur
                pts.append(cur)
            elif s[0] == "L":
                p0 = cur
                for i in range(1, per_curve + 1):
                    t = i / per_curve
                    pts.append((p0[0] + (s[1] - p0[0]) * t,
                                p0[1] + (s[2] - p0[1]) * t))
                cur = (s[1], s[2])
            elif s[0] == "C":
                p0 = cur
                p1 = (s[1], s[2])
                p2 = (s[3], s[4])
                p3 = (s[5], s[6])
                for i in range(1, per_curve + 1):
                    t = i / per_curve
                    mt = 1 - t
                    x = (mt ** 3) * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t ** 3 * p3[0]
                    y = (mt ** 3) * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t ** 3 * p3[1]
                    pts.append((x, y))
                cur = p3
            elif s[0] == "Z":
                if start is not None:
                    pts.append(start)
                cur, start = None, None
    return pts


def side_points(contours, side, frac=0.5, cap=110):
    pts = _seg_points(contours)
    if not pts:
        return np.zeros((0, 2))
    xs = [p[0] for p in pts]
    lo, hi = min(xs), max(xs)
    span = max(hi - lo, 1e-6)
    if side == "right":
        sel = [p for p in pts if p[0] >= lo + span * (1 - frac)]
    else:
        sel = [p for p in pts if p[0] <= lo + span * frac]
    if len(sel) > cap:
        step = len(sel) / cap
        sel = [sel[int(i * step)] for i in range(cap)]
    return np.array(sel, dtype=float)


def pair_kern(ra, lb, adv_a, target):
    """ra: right-side points of A (x relative to A origin); lb: left points of B."""
    if len(ra) == 0 or len(lb) == 0:
        return 0.0
    # distance from each point of A to each point of B (B shifted by advance)
    b = lb + np.array([adv_a, 0.0])
    dx = ra[:, 0][:, None] - b[:, 0][None, :]
    dy = ra[:, 1][:, None] - b[:, 1][None, :]
    dist = np.sqrt(dx * dx + dy * dy)
    # only consider roughly horizontal neighbours (avoid measuring across the glyph)
    dist = np.where(b[:, 0][None, :] > ra[:, 0][:, None] - 40, dist, np.inf)
    d = float(dist.min())
    if not math.isfinite(d):
        return 0.0
    k = target - d
    # safety: never let the pair get closer than MIN_GAP
    if d + k < MIN_GAP:
        k = MIN_GAP - d
    return k


def build_kern(full, glyphs, target_low=84.0, target_up=88.0,
               min_kern=10, clamps=(-95, 22)):
    """full: char -> glyph dict ; returns list of (left_char, right_char, value)"""
    upper = [chr(c) for c in range(ord("A"), ord("Z") + 1)]
    lower = [chr(c) for c in range(ord("a"), ord("z") + 1)]
    sided = {}
    for set_, frac in ((upper, 0.55), (lower, 0.55)):
        for ch in set_:
            if ch not in full:
                continue
            cont = full[ch]["cont"]
            sided[ch] = {
                "r": side_points(cont, "right", frac),
                "l": side_points(cont, "left", frac),
                "adv": full[ch]["adv"],
            }
    pairs = []
    for lefts, rights, target in ((upper, upper, target_up), (lower, lower, target_low),
                                  (upper, lower, target_up), (lower, upper, target_up)):
        for a in lefts:
            if a not in sided:
                continue
            for b in rights:
                if b not in sided:
                    continue
                k = pair_kern(sided[a]["r"], sided[b]["l"], sided[a]["adv"], target)
                if abs(k) >= min_kern:
                    k = max(clamps[0], min(clamps[1], k))
                    pairs.append((a, b, round(k)))
    return pairs


def fea_text(full, pairs):
    import compile_font as C
    classes = {}
    for ch in full:
        b = base_of(ch)
        if not (b.isascii() and b.isalpha()):
            continue
        classes.setdefault(b, []).append(C.glyph_name(ch))
    lines = ["languagesystem DFLT dflt;", "languagesystem latn dflt;", ""]
    names = {}
    for b, chars in classes.items():
        if not (b.isalpha()):
            continue
        cname = ("UC_" if b.isupper() else "LC_") + b.upper()
        names[b] = cname
        lines.append("@%s = [%s];" % (cname, " ".join(sorted(chars))))
    lines.append("")
    lines.append("feature kern {")
    seen = set()
    for a, b, k in pairs:
        ca = names.get(base_of(a))
        cb = names.get(base_of(b))
        if not ca or not cb:
            continue
        key = (ca, cb, k)
        if key in seen:
            continue
        seen.add(key)
        lines.append("  pos @%s @%s %d;" % (ca, cb, k))
    lines.append("} kern;")
    return "\n".join(lines)


def apply_kerning(font_path, full, target_low=84.0, target_up=88.0):
    from fontTools.ttLib import TTFont
    from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
    pairs = build_kern(full, None, target_low, target_up)
    fea = fea_text(full, pairs)
    t = TTFont(font_path)
    addOpenTypeFeaturesFromString(t, fea)
    t.save(font_path)
    return len(pairs), fea
