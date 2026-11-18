"""Draw a stylised Dong Son bronze drum face (after the Ngoc Lu drum) as SVG.

Bands from the centre out: 14-ray sun star with hatched wedges, dotted ring,
circles joined by tangent lines, ladder hatching, a ring of Lac birds flying
counter-clockwise, ladder, tangent circles, saw-tooth, dotted rim.
This is a simplified, contemporary rendering, not a reproduction of one drum.

Usage: python3 -I drum_svg.py <out.svg> <colour> [--window]
  --window  leave everything inside the inner ladder ring (r < 226 of 500)
            empty, so an illustration can sit in a circular window framed by
            the bird ring and the outer bands.
"""
import math
import sys

C = 500  # centre of a 1000 x 1000 viewBox


def pol(r, a):
    return C + r * math.cos(a), C + r * math.sin(a)


def fmt(x):
    return f"{x:.1f}"


def ring(r, w):
    return f'<circle cx="{C}" cy="{C}" r="{r}" fill="none" stroke-width="{w}"/>'


def star(rays=14, r_out=150, r_in=46):
    pts, hatch = [], []
    for i in range(rays * 2):
        a = -math.pi / 2 + i * math.pi / rays
        r = r_out if i % 2 == 0 else r_in
        pts.append(pol(r, a))
    poly = " ".join(f"{fmt(x)},{fmt(y)}" for x, y in pts)
    # nested chevrons (feather marks) in the wedge between each pair of rays
    for i in range(rays):
        a_mid = -math.pi / 2 + (2 * i + 1) * math.pi / rays
        for k in range(4):
            r_tip = 62 + k * 21
            spread = math.pi / rays * 0.62
            x0, y0 = pol(r_tip, a_mid)
            for side in (-1, 1):
                x1, y1 = pol(r_tip + 17, a_mid + side * spread * (46 / (r_tip + 17)) * 2.2)
                hatch.append(f'<line x1="{fmt(x0)}" y1="{fmt(y0)}" x2="{fmt(x1)}" y2="{fmt(y1)}" stroke-width="3"/>')
    return f'<polygon points="{poly}" stroke="none"/>' + "".join(hatch)


def dots(r, n, size):
    out = []
    for i in range(n):
        x, y = pol(r, 2 * math.pi * i / n)
        out.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{size}" stroke="none"/>')
    return "".join(out)


def tangent_circles(r, n, cr):
    out = []
    for i in range(n):
        a = 2 * math.pi * i / n
        x, y = pol(r, a)
        out.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{cr}" fill="none" stroke-width="3"/>')
        out.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{cr * 0.28:.1f}" stroke="none"/>')
        b = 2 * math.pi * (i + 1) / n
        for side in (-1, 1):  # tangent lines joining neighbours, top and bottom
            x1, y1 = pol(r + side * cr, a)
            x2, y2 = pol(r + side * cr, b)
            out.append(f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke-width="3"/>')
    return "".join(out)


def ladder(r1, r2, n):
    out = [ring(r1, 3), ring(r2, 3)]
    for i in range(n):
        a = 2 * math.pi * i / n
        x1, y1 = pol(r1, a)
        x2, y2 = pol(r2, a)
        out.append(f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke-width="2.4"/>')
    return "".join(out)


def sawtooth(r1, r2, n):
    pts = []
    for i in range(n * 2 + 1):
        a = 2 * math.pi * i / (n * 2)
        pts.append(pol(r1 if i % 2 == 0 else r2, a))
    return '<polyline fill="none" stroke-width="3" points="' + " ".join(f"{fmt(x)},{fmt(y)}" for x, y in pts) + '"/>'


# Lac bird in side view, flying towards +x, back (raised wing) towards -y.
# Long beak, crest plumes, one raised feathered wing, streaming tail.
BIRD = ("M48,2 L28,0.2 C26,-3.5 21,-3.5 19,-1 C15,0 12,-1 8,-1.5 C2,-2.5 -8,-2 -12,0 L-14,1.5 "
        "C-8,6 4,7 10,4 C14,3 17,2.5 20,3 C22,4 26,4 28,2.6 Z "
        "M22,-2.5 L13,-13 L11,-12 L18,-2 Z M20,-2 L8,-10 L7,-8.5 L16,-1.5 Z "
        "M8,-1.5 C2,-10 -6,-22 -16,-32 L-15,-27 L-20,-29 L-18,-23 L-23,-24 L-19,-17 L-24,-17 "
        "L-18,-11 L-22,-10 L-14,-5 L-10,-2 Z "
        "M-12,0 L-44,-8 L-41,-3 L-50,0 L-41,3 L-46,9 L-14,3 Z "
        "M-2,5 L-8,12 L-7,12.8 L0,6 Z")


def birds(r, n, scale):
    out = []
    for i in range(n):
        a = 2 * math.pi * i / n
        x, y = pol(r, a)
        heading = math.degrees(a) - 90  # tangent, counter-clockwise on the page
        # mirror y so the raised wing points out towards the rim
        out.append(f'<path d="{BIRD}" stroke="none" transform="translate({fmt(x)} {fmt(y)}) rotate({heading:.1f}) scale({scale} {-scale})"/>')
    return "".join(out)


def drum(colour, window=False):
    parts = []
    if not window:
        parts += [star(), ring(158, 3), dots(170, 64, 3.2), ring(182, 3),
                  tangent_circles(203, 28, 14)]
    parts += [ladder(226, 240, 120),
              birds(290, 12, 1.32),
              ladder(345, 359, 160),
              tangent_circles(381, 46, 15),
              ring(404, 3), sawtooth(410, 428, 90), ring(434, 3),
              dots(446, 120, 3.4), ring(460, 6), ring(476, 12)]
    body = "".join(parts)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">'
            f'<g fill="{colour}" stroke="{colour}" stroke-linecap="round">{body}</g></svg>')


if __name__ == "__main__":
    out, colour = sys.argv[1], sys.argv[2]
    open(out, "w").write(drum(colour, window="--window" in sys.argv))
    print("wrote", out)
