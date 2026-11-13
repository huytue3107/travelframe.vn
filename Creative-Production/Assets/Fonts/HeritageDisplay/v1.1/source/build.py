"""Heritage Display v1.1 build: trace -> compose -> remove overlaps -> TTF/OTF/WOFF2.

usage: python build.py <ref/a.png> <out_dir>
"""
import os
import sys
import unicodedata

import numpy as np
from PIL import Image
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.misc.timeTools import timestampNow
from fontTools.ttLib import TTFont

import fbuild
import geom as G
import compose as K
import construct as X
import lowercase as L
import kern as KF
import compile_font as C

FAMILY, STYLE, VERSION = "Heritage Display", "Regular", "1.102"
UPM, ASC, DESC, CAP, XH = 1000, 980, -300, 700, 500


def build_glyph_set(ref_png):
    img = np.asarray(Image.open(ref_png).convert("RGB"))
    img_b = np.asarray(Image.open(os.path.join(os.path.dirname(ref_png), "b.png")).convert("RGB"))
    upper = fbuild.build_upper(img, img_b)
    for v in upper.values():
        v["cont"] = G.normalize(v["cont"])
    marks = K.build_marks(img)
    lower = {}
    for ch, v in L.build_lower().items():
        lower[ch] = dict(cont=fbuild.shift(v["cont"], v["sb"], 0), adv=v["adv"])
    full = K.compose_all(upper, lower, marks)
    con = X.build_constructed()
    for k in ("0alt", "6", "9", "K", "T"):
        con.pop(k, None)
    full.update(con)
    # 9 = the traced 6 turned 180 degrees
    six = full["6"]
    x0, y0, x1, y1 = G.bbox(six["cont"])
    nine = G.transform(six["cont"], sx=-1, sy=-1, dx=x0 + x1, dy=y0 + y1)
    full["9"] = dict(cont=nine, adv=six["adv"])
    full[" "] = dict(cont=[], adv=260)
    full[" "] = dict(cont=[], adv=260)
    full["​"] = dict(cont=[], adv=0)
    return full


def compile_fonts(full, out_dir):
    names = {ch: C.glyph_name(ch) for ch in full}
    names["ı"] = "dotlessi"
    order = [".notdef"] + [names[ch] for ch in full]
    cmap = {ord(ch): names[ch] for ch in full}
    adv = {names[ch]: int(round(v["adv"])) for ch, v in full.items()}
    adv[".notdef"] = 520
    notdef = [[("M", 60, 0), ("L", 60, CAP), ("L", 460, CAP), ("L", 460, 0), ("Z",)],
              [("M", 110, 50), ("L", 410, 50), ("L", 410, CAP - 50), ("L", 110, CAP - 50), ("Z",)]]
    conts = {names[ch]: v["cont"] for ch, v in full.items()}
    conts[".notdef"] = notdef

    ymax, ymin = 0, 0
    for c in conts.values():
        if c:
            b = G.bbox(c)
            ymax, ymin = max(ymax, b[3]), min(ymin, b[1])
    win_asc, win_desc = int(max(ASC, ymax + 10)), int(max(-DESC, -ymin + 10))

    paths = {}
    for kind in ("ttf", "otf"):
        fb = FontBuilder(UPM, isTTF=(kind == "ttf"))
        fb.setupGlyphOrder(order)
        fb.setupCharacterMap(cmap)
        glyf, strings = {}, {}
        for n in order:
            p = G.clean(conts[n], clockwise=(kind == "ttf")) if conts[n] else None
            if kind == "ttf":
                tp = TTGlyphPen(None)
                if p is not None:
                    p.draw(Cu2QuPen(tp, max_err=0.6, reverse_direction=False))
                glyf[n] = tp.glyph()
            else:
                cp = T2CharStringPen(adv[n], None)
                if p is not None:
                    p.draw(cp)
                strings[n] = cp.getCharString()
        psname = f"{FAMILY.replace(' ', '')}-{STYLE}"
        if kind == "ttf":
            fb.setupGlyf(glyf)
        else:
            fb.setupCFF(psname, {"FullName": f"{FAMILY} {STYLE}", "FamilyName": FAMILY,
                                 "Weight": STYLE, "version": VERSION}, strings, {})
        fb.setupHorizontalMetrics({n: (adv[n], 0) for n in order})
        fb.setupHorizontalHeader(ascent=ASC, descent=DESC, lineGap=0)
        fb.setupNameTable({
            "familyName": FAMILY, "styleName": STYLE,
            "uniqueFontIdentifier": f"{VERSION};TRFR;{psname}",
            "fullName": f"{FAMILY} {STYLE}", "psName": psname,
            "version": f"Version {VERSION}",
        })
        fb.setupOS2(sTypoAscender=ASC, sTypoDescender=DESC, sTypoLineGap=0,
                    sCapHeight=CAP, sxHeight=XH, usWinAscent=win_asc, usWinDescent=win_desc,
                    fsType=0, achVendID="TRFR", fsSelection=0x40 | 0x80,
                    usWeightClass=400, version=4)
        fb.setupPost()
        fb.font["head"].fontRevision = float(VERSION)
        fb.font["head"].created = timestampNow()
        fb.font["head"].modified = timestampNow()
        path = os.path.join(out_dir, f"HeritageDisplay-Regular.{kind}")
        fb.save(path)
        paths[kind] = path
    return paths, names


# ---------------- kerning ----------------
HORN = set("ƠỜỚỞỠỢƯỪỨỬỮỰơờớởỡợưừứửữự")


def kerning_fea(full, names):
    """Class kerning on base letters + glyph exceptions where marks/horns change the gap."""
    pairs = KF.build_kern(full, None)
    base = {}
    for ch in full:
        b = KF.base_of(ch)
        if b.isascii() and b.isalpha():
            base.setdefault(b, []).append(ch)
    lines = ["languagesystem DFLT dflt;", "languagesystem latn dflt;", ""]
    for b, chars in sorted(base.items()):
        tag = ("UC_" if b.isupper() else "LC_") + b.upper()
        left = [names[c] for c in chars if c not in HORN]
        lines.append("@L_%s = [%s];" % (tag, " ".join(sorted(left))))
        lines.append("@R_%s = [%s];" % (tag, " ".join(sorted(names[c] for c in chars))))
    cls = {(a, b): k for a, b, k in pairs}

    # exceptions: accented glyph next to a base letter, measured on the real outlines
    sided = {}
    for ch, v in full.items():
        if not v["cont"]:
            continue
        sided[ch] = dict(r=KF.side_points(v["cont"], "right", 0.55),
                         l=KF.side_points(v["cont"], "left", 0.55), adv=v["adv"])
    bases = [c for c in sided if c.isascii() and c.isalpha()]
    accented = [c for c in sided if c not in bases and KF.base_of(c).isascii()
                and KF.base_of(c).isalpha()]
    exc = []
    for a in bases:
        for b in accented:
            tgt = 84.0 if (a.islower() and b.islower()) else 88.0
            k = KF.pair_kern(sided[a]["r"], sided[b]["l"], sided[a]["adv"], tgt)
            k = round(max(-95, min(22, k))) if abs(k) >= 10 else 0
            kc = cls.get((a, KF.base_of(b)), 0)
            if k > kc + 6:                       # class value would let them collide
                exc.append((a, b, k))
    for a in accented:
        if a not in HORN:
            continue
        for b in bases:
            tgt = 84.0 if (a.islower() and b.islower()) else 88.0
            k = KF.pair_kern(sided[a]["r"], sided[b]["l"], sided[a]["adv"], tgt)
            k = round(max(-95, min(22, k))) if abs(k) >= 10 else 0
            if k != 0:
                exc.append((a, b, k))

    lines += ["", "feature kern {"]
    for a, b, k in exc:
        lines.append("  pos %s %s %d;" % (names[a], names[b], k))
    seen = set()
    for a, b, k in pairs:
        ta = ("UC_" if a.isupper() else "LC_") + a.upper()
        tb = ("UC_" if b.isupper() else "LC_") + b.upper()
        if (ta, tb) in seen:
            continue
        seen.add((ta, tb))
        lines.append("  pos @L_%s @R_%s %d;" % (ta, tb, k))
    lines.append("} kern;")
    return "\n".join(lines), len(pairs), len(exc)


def fix_lsb(font, kind):
    """hmtx left side bearing must equal the outline's xMin.

    v1.0 wrote lsb=0 for every glyph; TrueType rasterisers then shift each outline
    left by its real xMin, which made the spacing lopsided.
    """
    hmtx = font["hmtx"]
    if kind == "ttf":
        glyf = font["glyf"]
        for n in font.getGlyphOrder():
            g = glyf[n]
            g.recalcBounds(glyf)
            hmtx[n] = (hmtx[n][0], g.xMin if g.numberOfContours else 0)
    else:
        cs = font["CFF "].cff.topDictIndex[0].CharStrings
        for n in font.getGlyphOrder():
            b = cs[n].calcBounds(cs)
            hmtx[n] = (hmtx[n][0], int(b[0] // 1) if b else 0)


def main():
    ref_png, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    full = build_glyph_set(ref_png)
    paths, names = compile_fonts(full, out_dir)
    fea, n_cls, n_exc = kerning_fea(full, names)
    for kind, p in paths.items():
        t = TTFont(p)
        fix_lsb(t, kind)
        addOpenTypeFeaturesFromString(t, fea)
        t.save(p)
    t = TTFont(paths["ttf"])
    t.flavor = "woff2"
    t.save(os.path.join(out_dir, "HeritageDisplay-Regular.woff2"))
    print("glyphs", len(full), "kern class pairs", n_cls, "exceptions", n_exc)


if __name__ == "__main__":
    main()
