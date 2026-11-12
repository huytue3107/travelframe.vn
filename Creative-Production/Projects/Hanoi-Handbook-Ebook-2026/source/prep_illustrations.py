"""Prepare AI watercolor illustrations for the handbook layout.

Each PNG has its own slightly different off-white "paper". We find that paper
colour (per channel, high percentile), stretch it to pure white, and save a
web-size JPEG. In the page the image is drawn with mix-blend-mode: multiply,
so white becomes the page's own ivory and the painting sits straight on the
paper with no visible rectangle.

Usage: python3 -I prep_illustrations.py <png_dir> <out_dir>
"""
import math
import os
import sys

from PIL import Image, ImageChops

MAX_SIDE = 1500
BORDER = 0.03      # outer frame used to sample the paper colour
HEADROOM = 0.975   # paper is pushed slightly past white so its texture clips
FEATHER = 0.05     # edge band (share of the short side) faded to white, so paint
                   # that touches the image edge never shows a hard straight line


def paper_colour(im):
    """Median colour of bright pixels in the outer frame (the unpainted paper)."""
    w, h = im.size
    bw, bh = max(2, int(w * BORDER)), max(2, int(h * BORDER))
    px = im.load()
    samples = []
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            if bw <= x < w - bw and bh <= y < h - bh:
                continue
            r, g, b = px[x, y]
            if 0.299 * r + 0.587 * g + 0.114 * b > 215:
                samples.append((r, g, b))
    if len(samples) < 50:
        return (250, 246, 238)
    return tuple(sorted(c[i] for c in samples)[len(samples) // 2] for i in range(3))


def feather_edges(im):
    """Blend the outer band of the image towards white with a cosine ramp."""
    w, h = im.size
    band = max(4, int(min(w, h) * FEATHER))

    def ramp(i, n):
        d = min(i, n - 1 - i)
        return 1.0 if d >= band else 0.5 - 0.5 * math.cos(math.pi * d / band)

    col = Image.new("L", (w, 1)); col.putdata([round(255 * ramp(x, w)) for x in range(w)])
    row = Image.new("L", (1, h)); row.putdata([round(255 * ramp(y, h)) for y in range(h)])
    mask = ImageChops.multiply(col.resize((w, h)), row.resize((w, h)))
    return Image.composite(im, Image.new("RGB", (w, h), "white"), mask)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    for name in sorted(os.listdir(src)):
        if not name.endswith(".png"):
            continue
        im = Image.open(os.path.join(src, name)).convert("RGB")
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        paper = paper_colour(im)
        lut = []
        for p in paper:
            lut += [min(255, round(v * 255 / (p * HEADROOM))) for v in range(256)]
        out = im.point(lut)
        out = feather_edges(out)
        out.save(os.path.join(dst, name[:-4] + ".jpg"), "JPEG", quality=80, optimize=True, progressive=True)
        print(f"{name}: paper rgb{tuple(paper)}")


if __name__ == "__main__":
    main()
