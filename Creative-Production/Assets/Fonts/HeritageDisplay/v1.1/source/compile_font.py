"""Compile contour dicts into a TrueType font."""
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.misc.timeTools import timestampNow


def glyph_name(ch):
    """ASCII-safe glyph name."""
    if ch.isascii() and (ch.isalnum() or ch in "&"):
        return ch
    return "uni%04X" % ord(ch)


def add_contour(pen, cont):
    for seg in cont:
        if seg[0] == "M":
            pen.moveTo((seg[1], seg[2]))
        elif seg[0] == "L":
            pen.lineTo((seg[1], seg[2]))
        elif seg[0] == "C":
            pen.curveTo((seg[1], seg[2]), (seg[3], seg[4]), (seg[5], seg[6]))
        else:
            pen.closePath()


def compile_otf(glyphs, cmap, path,
                family="Heritage Display", style="Regular",
                upm=1000, asc=980, desc=-300, cap=700, xheight=480):
    from fontTools.pens.t2CharStringPen import T2CharStringPen
    order = [".notdef"] + [n for n in glyphs if n != ".notdef"]
    fb = FontBuilder(upm, isTTF=False)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap({cp: n for cp, n in cmap.items() if n in glyphs})
    strings = {}
    hmtx = {}
    for name in order:
        if name == ".notdef":
            adv = 520
            pen = T2CharStringPen(adv, None)
            pen.moveTo((60, 0)); pen.lineTo((60, cap)); pen.lineTo((460, cap))
            pen.lineTo((460, 0)); pen.closePath()
        else:
            g = glyphs[name]
            adv = int(round(g["adv"]))
            pen = T2CharStringPen(adv, None)
            for c in g["cont"]:
                add_contour(pen, c)
        strings[name] = pen.getCharString()
        hmtx[name] = (adv, 0)
    psname = f"{family.replace(' ', '')}-{style}"
    fb.setupCFF(psname, {"FullName": f"{family} {style}", "FamilyName": family,
                         "Weight": style, "version": "1.000"}, strings, {})
    fb.setupHorizontalMetrics(hmtx)
    fb.setupHorizontalHeader(ascent=asc, descent=desc, lineGap=0)
    fb.setupNameTable({
        "familyName": family, "styleName": style,
        "uniqueFontIdentifier": psname, "fullName": f"{family} {style}",
        "psName": psname, "version": "Version 1.000",
    })
    fb.setupOS2(sTypoAscender=asc, sTypoDescender=desc, sTypoLineGap=0,
                sCapHeight=cap, sxHeight=xheight,
                usWinAscent=asc, usWinDescent=-desc, fsType=0, achVendID="TRFR")
    fb.setupPost()
    fb.font["head"].created = timestampNow()
    fb.font["head"].modified = timestampNow()
    fb.save(path)
    return path


def compile_ttf(glyphs, cmap, path,
                family="Heritage Display", style="Regular",
                upm=1000, asc=980, desc=-300, cap=700, xheight=480):
    """glyphs: {name: {'cont': contours, 'adv': width}} ; cmap: {codepoint: name}"""
    order = [".notdef"] + [n for n in glyphs if n != ".notdef"]
    fb = FontBuilder(upm, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap({cp: n for cp, n in cmap.items() if n in glyphs})

    glyf, hmtx = {}, {}
    for name in order:
        ttpen = TTGlyphPen(None)
        pen = Cu2QuPen(ttpen, max_err=0.8)
        if name == ".notdef":
            pen.moveTo((60, 0)); pen.lineTo((60, cap)); pen.lineTo((460, cap))
            pen.lineTo((460, 0)); pen.closePath()
            adv = 520
        else:
            g = glyphs[name]
            for c in g["cont"]:
                add_contour(pen, c)
            adv = g["adv"]
        try:
            glyf[name] = ttpen.glyph()
            hmtx[name] = (int(round(adv)), 0)
        except Exception as e:
            print("FAILED", name, e)
    fb.setupGlyf(glyf)
    fb.setupHorizontalMetrics(hmtx)
    fb.setupHorizontalHeader(ascent=asc, descent=desc, lineGap=0)
    fb.setupNameTable({
        "familyName": family, "styleName": style,
        "uniqueFontIdentifier": f"{family}-{style}",
        "fullName": f"{family} {style}", "psName": f"{family.replace(' ','')}-{style}",
        "version": "Version 1.000",
    })
    fb.setupOS2(sTypoAscender=asc, sTypoDescender=desc, sTypoLineGap=0,
                sCapHeight=cap, sxHeight=xheight,
                usWinAscent=asc, usWinDescent=-desc,
                fsType=0, achVendID="TRFR")
    fb.setupPost()
    fb.font["head"].created = timestampNow()
    fb.font["head"].modified = timestampNow()
    fb.save(path)
    return path
