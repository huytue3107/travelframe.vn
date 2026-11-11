"""Assemble the full Vietnamese glyph set.

Stacking follows the reference sheet (Ồ, Ầ, Ễ in ref/a.png and ref/b.png):
- a tone on a circumflex (sắc / huyền / hỏi) sits over the roof's right half;
- a tilde on a circumflex, or any tone on a breve, stacks straight above;
- every mark is lifted until it keeps a fixed clearance from the letter.
"""
import shape as S
import geom as G

CAP = 700.0
XH = 500.0
LOW_K = 0.8          # lowercase marks: stroke weight ratio lower/upper (116/147)
# The traced sắc/huyền are almost flat strokes; tilt them so that huyền reads
# as falling and sắc as rising (otherwise "à" is easily read as "ă").
TONE_TILT = 0.16

TONES = ["grave", "acute", "hook", "tilde", "dot"]

VOWEL_MAP = [
    ("A", "À", "Á", "Ả", "Ã", "Ạ"),
    ("Ă", "Ằ", "Ắ", "Ẳ", "Ẵ", "Ặ"),
    ("Â", "Ầ", "Ấ", "Ẩ", "Ẫ", "Ậ"),
    ("E", "È", "É", "Ẻ", "Ẽ", "Ẹ"),
    ("Ê", "Ề", "Ế", "Ể", "Ễ", "Ệ"),
    ("I", "Ì", "Í", "Ỉ", "Ĩ", "Ị"),
    ("O", "Ò", "Ó", "Ỏ", "Õ", "Ọ"),
    ("Ô", "Ồ", "Ố", "Ổ", "Ỗ", "Ộ"),
    ("Ơ", "Ờ", "Ớ", "Ở", "Ỡ", "Ợ"),
    ("U", "Ù", "Ú", "Ủ", "Ũ", "Ụ"),
    ("Ư", "Ừ", "Ứ", "Ử", "Ữ", "Ự"),
    ("Y", "Ỳ", "Ý", "Ỷ", "Ỹ", "Ỵ"),
]

LOW_VOWELS = [
    ("a", "à", "á", "ả", "ã", "ạ"),
    ("ă", "ằ", "ắ", "ẳ", "ẵ", "ặ"),
    ("â", "ầ", "ấ", "ẩ", "ẫ", "ậ"),
    ("e", "è", "é", "ẻ", "ẽ", "ẹ"),
    ("ê", "ề", "ế", "ể", "ễ", "ệ"),
    ("i", "ì", "í", "ỉ", "ĩ", "ị"),
    ("o", "ò", "ó", "ỏ", "õ", "ọ"),
    ("ô", "ồ", "ố", "ổ", "ỗ", "ộ"),
    ("ơ", "ờ", "ớ", "ở", "ỡ", "ợ"),
    ("u", "ù", "ú", "ủ", "ũ", "ụ"),
    ("ư", "ừ", "ứ", "ử", "ữ", "ự"),
    ("y", "ỳ", "ý", "ỷ", "ỹ", "ỵ"),
]

# base letter whose body (without horn / modifier) centres the tone mark
BODY_OF = {"Ă": "A", "Â": "A", "Ê": "E", "Ô": "O", "Ơ": "O", "Ư": "U",
           "ă": "a", "â": "a", "ê": "e", "ô": "o", "ơ": "o", "ư": "u", "i": "ı"}


def build_marks(img):
    import fbuild
    raw = fbuild.build_marks(img)
    marks = {}
    for k, v in raw.items():
        cont = G.normalize(v["cont"])
        if k in ("acute", "grave"):
            cont = G.shear_y(cont, TONE_TILT if k == "acute" else -TONE_TILT)
            b = G.bbox(cont)
            cont = G.transform(cont, dx=-(b[0] + b[2]) / 2.0, dy=-b[1])
            v = dict(v, w=b[2] - b[0], h=b[3] - b[1])
        marks[k] = dict(v, cont=cont)
    return marks


def _mark(marks, name, k, target_w=None, sx_extra=1.0, sy_extra=1.0):
    """Mark scaled by k, optionally squeezed horizontally to target_w. bottom-centre at 0."""
    m = marks[name]
    sx = k * sx_extra
    if target_w is not None and name != "hook":
        sx = min(sx, target_w / m["w"])
    return G.transform(m["cont"], sx=sx, sy=k * sy_extra)


def _place(mark, cx, y, base, gap):
    b = G.bbox(mark)
    m = G.transform(mark, dx=cx - (b[0] + b[2]) / 2.0, dy=y - b[1])
    m, _ = G.lift_until_clear(m, base, gap)
    return m


def _dot_below(base, cx, r, y, gap):
    """Dot below; slides right if the letter has a descender in the way (ỵ)."""
    for dx in range(0, 400, 6):
        d = [S.ellipse(cx + dx, y, r, r)]
        if G.clearance(d, base) >= gap:
            return d
    return [S.ellipse(cx, y, r, r)]


def _tone_glyph(base_cont, body, tone, marks, k, modifier, top_gap, stack_gap, dot_r, dot_y):
    """base_cont: the letter (with its own circumflex/breve/horn). body: bbox of plain body."""
    cx = (body[0] + body[2]) / 2.0
    bw = body[2] - body[0]
    native = marks["acute"]["w"] * k
    target = max(1.2 * bw, 0.64 * native)

    if tone == "dot":
        return list(base_cont) + _dot_below(base_cont, cx, dot_r, dot_y, gap=1.6 * top_gap)

    full_top = G.bbox(base_cont)[3]
    if modifier == "circumflex" and tone in ("grave", "acute", "hook"):
        roof = G.bbox(base_cont)
        rw = roof[2] - roof[0]
        if tone == "hook":
            m = _mark(marks, "hook", k * 0.86)
            mx = cx + 0.30 * rw
        else:
            m = _mark(marks, tone, k, sx_extra=0.62, sy_extra=0.92)
            mb = G.bbox(m)
            # sắc starts low on the left, so it starts past the apex (over the
            # lower right slope); huyền starts high, so it can begin at the apex.
            start = 0.10 if tone == "acute" else -0.04
            mx = cx + start * rw + (mb[2] - mb[0]) / 2.0
        y0 = full_top - 0.55 * (marks["circumflex"]["h"] * k)
        return list(base_cont) + _place(m, mx, y0, base_cont, stack_gap)

    if modifier in ("circumflex", "breve"):
        s = 0.86 if tone == "tilde" else 0.8
        m = _mark(marks, tone, k * s, target_w=target)
        return list(base_cont) + _place(m, cx, full_top, base_cont, stack_gap)

    m = _mark(marks, tone, k, target_w=target)
    return list(base_cont) + _place(m, cx, body[3] + 10, base_cont, top_gap)


def _modifier_of(ch):
    if ch in "ĂăÂâÊêÔô":
        return "breve" if ch in "Ăă" else "circumflex"
    return None


def compose_all(upper, lower, marks):
    out = {}
    for ch, v in upper.items():
        out[ch] = dict(cont=v["cont"], adv=v["adv"])

    # ---------- uppercase tones ----------
    for row in VOWEL_MAP:
        base = row[0]
        b = upper[base]
        body_src = upper[BODY_OF.get(base, base)]["cont"]
        body = G.body_bbox(body_src, CAP + 12)
        for ch, tone in zip(row[1:], TONES):
            cont = _tone_glyph(b["cont"], body, tone, marks, 1.0, _modifier_of(base),
                               top_gap=30, stack_gap=22, dot_r=54, dot_y=-102)
            out[ch] = dict(cont=cont, adv=b["adv"])

    # ---------- lowercase modifiers ----------
    lower_vn = dict(lower)

    def with_modifier(base_ch, name):
        b = lower[base_ch]
        body = G.bbox(b["cont"])
        m = _mark(marks, name, LOW_K, target_w=1.05 * (body[2] - body[0]))
        cont = list(b["cont"]) + _place(m, (body[0] + body[2]) / 2.0, body[3] + 10,
                                        b["cont"], 24)
        return dict(cont=cont, adv=b["adv"])

    lower_vn["ă"] = with_modifier("a", "breve")
    lower_vn["â"] = with_modifier("a", "circumflex")
    lower_vn["ê"] = with_modifier("e", "circumflex")
    lower_vn["ô"] = with_modifier("o", "circumflex")

    def horn(base_ch, stem):
        """Horn modelled on the traced Ơ/Ư: a flat flag continuing the top stroke."""
        b = lower[base_ch]
        bx0, by0, bx1, by1 = G.bbox(b["cont"])
        w = bx1 - bx0
        if stem:      # ư: grows out of the right stem
            pts = [(bx1 - 58, XH - 70), (bx1 - 50, XH + 6), (bx1 + 2, XH + 40),
                   (bx1 + 90, XH + 44)]
            th = [116, 108, 80, 72]
        else:         # ơ: the bowl's top stroke runs on to the right, like the capital
            pts = [(bx0 + 0.52 * w, XH - 30), (bx0 + 0.80 * w, XH + 10),
                   (bx1 - 4, XH + 36), (bx1 + 56, XH + 42)]
            th = [80, 80, 76, 70]
        h = S.ribbon(pts, th)
        cont = list(b["cont"]) + [h]
        right = G.bbox([h])[2]
        return dict(cont=cont, adv=max(b["adv"], right + 26))

    lower_vn["ơ"] = horn("o", stem=False)
    lower_vn["ư"] = horn("u", stem=True)

    d = lower["d"]
    dx0, dy0, dx1, dy1 = G.bbox(d["cont"])
    bar = S.rect(dx1 - 200, 552, dx1 + 40, 552 + 92)
    lower_vn["đ"] = dict(cont=list(d["cont"]) + [bar], adv=d["adv"] + 8)

    for ch, v in lower_vn.items():
        out[ch] = v

    # ---------- lowercase tones ----------
    for row in LOW_VOWELS:
        base = row[0]
        b = lower_vn[base]
        tone_base = lower_vn["ı"]["cont"] if base == "i" else b["cont"]
        body = G.bbox(lower_vn[BODY_OF.get(base, base)]["cont"])
        for ch, tone in zip(row[1:], TONES):
            src = b["cont"] if tone == "dot" else tone_base
            cont = _tone_glyph(src, body, tone, marks, LOW_K, _modifier_of(base),
                               top_gap=24, stack_gap=18, dot_r=46, dot_y=-96)
            out[ch] = dict(cont=cont, adv=b["adv"])
    return out
