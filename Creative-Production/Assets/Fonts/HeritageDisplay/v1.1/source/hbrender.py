"""Render text with HarfBuzz shaping (real GPOS kerning) into a PNG."""
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont


def shape_render(path, lines, out, size=120, bg=(252, 201, 32), fg=(208, 84, 50),
                 pad=40, line_gap=1.45):
    data = open(path, 'rb').read()
    face = hb.Face(data)
    hbfont = hb.Font(face)
    tt = TTFont(path)
    cmap = tt.getBestCmap()
    rev = {}
    for cp, name in cmap.items():
        rev.setdefault(name, chr(cp))
    glyph_order = tt.getGlyphOrder()
    pil = ImageFont.truetype(path, size)
    lh = int(size * line_gap)
    im = Image.new('RGB', (2200, pad * 2 + lh * len(lines)), bg)
    d = ImageDraw.Draw(im)
    for i, text in enumerate(lines):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(hbfont, buf, {"kern": True, "liga": False})
        x = pad
        y = pad + i * lh
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            name = glyph_order[info.codepoint]
            ch = rev.get(name)
            gx = x + pos.x_offset * size / tt['head'].unitsPerEm
            gy = y - pos.y_offset * size / tt['head'].unitsPerEm
            if ch:
                d.text((gx, gy), ch, font=pil, fill=fg)
            x += pos.x_advance * size / tt['head'].unitsPerEm
    im.save(out)
    return out


if __name__ == "__main__":
    import sys
    p = sys.argv[1]
    shape_render(p, [
        "Điệu phố cổ Hà Nội",
        "Phởriends with Phở",
        "aVATyWo. aVATyWo.",
        "áo ảo ập õng ứ ự",
    ], sys.argv[2], size=110)
    print("ok")


def draw_shaped(im, d, path, text, x, y, size, fill=(208, 84, 50)):
    """Draw text with real GPOS kerning at (x, y)."""
    data = _DATA.get(path)
    if data is None:
        data = _DATA[path] = open(path, 'rb').read()
    face = hb.Face(data)
    hbfont = hb.Font(face)
    tt = _TT.get(path)
    if tt is None:
        tt = _TT[path] = TTFont(path)
    cmap = tt.getBestCmap()
    rev = _REV.get(path)
    if rev is None:
        rev = {}
        for cp, name in cmap.items():
            rev.setdefault(name, chr(cp))
        _REV[path] = rev
    order = tt.getGlyphOrder()
    pil = ImageFont.truetype(path, size)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": False})
    upm = tt['head'].unitsPerEm
    pen = x
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        ch = rev.get(order[info.codepoint])
        if ch:
            d.text((pen + pos.x_offset * size / upm, y - pos.y_offset * size / upm),
                   ch, font=pil, fill=fill)
        pen += pos.x_advance * size / upm
    return pen


_DATA, _TT, _REV = {}, {}, {}
