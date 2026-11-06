"""Assemble the full Vietnamese glyph set."""
import math
import shape as S
import fbuild

CAP = 700.0
XH = 500.0

TONES = ["grave", "acute", "hook", "tilde", "dot"]
# target width of a tone mark as a fraction of the base letter's ink width
MARK_RATIO = {"grave": 0.56, "acute": 0.56, "hook": 0.34, "tilde": 0.54}

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


def mirror_x(contours, cx=0.0):
    out = []
    for c in contours:
        nc = []
        for seg in c:
            if seg[0] in ("M", "L"):
                nc.append((seg[0], 2 * cx - seg[1], seg[2]))
            elif seg[0] == "C":
                nc.append(("C", 2 * cx - seg[1], seg[2], 2 * cx - seg[3], seg[4],
                           2 * cx - seg[5], seg[6]))
            else:
                nc.append(("Z",))
        out.append(nc)
    return out


def scale(contours, s, cx=0.0, cy=0.0):
    out = []
    for c in contours:
        nc = []
        for seg in c:
            if seg[0] in ("M", "L"):
                nc.append((seg[0], cx + (seg[1] - cx) * s, cy + (seg[2] - cy) * s))
            elif seg[0] == "C":
                nc.append(("C", cx + (seg[1] - cx) * s, cy + (seg[2] - cy) * s,
                           cx + (seg[3] - cx) * s, cy + (seg[4] - cy) * s,
                           cx + (seg[5] - cx) * s, cy + (seg[6] - cy) * s))
            else:
                nc.append(("Z",))
        out.append(nc)
    return out


def build_marks(img):
    raw = fbuild.build_marks(img)
    marks = dict(raw)
    marks["grave"] = dict(cont=mirror_x(raw["acute"]["cont"]), w=raw["acute"]["w"],
                          h=raw["acute"]["h"])
    return marks


def place_tone(base_cont, marks, tone, cx, top, bw, shrink=1.0):
    m = marks[tone]
    s = (bw * MARK_RATIO[tone] * shrink) / max(m["w"], 1.0)
    s = max(0.4, min(1.6, s))
    return list(base_cont) + fbuild.shift(scale(m["cont"], s), cx, top)


def compose_all(upper, lower, marks):
    out = {}
    for ch, v in upper.items():
        out[ch] = dict(cont=v["cont"], adv=v["adv"])

    # ---------- uppercase ----------
    for base, grave, acute, hook, tilde, dot in VOWEL_MAP:
        if base not in upper:
            continue
        b = upper[base]
        bx0, by0, bx1, by1 = fbuild.bbox(b["cont"])
        cx = (bx0 + bx1) / 2.0
        bw = bx1 - bx0
        stacked = base in ("Ă", "Â", "Ê", "Ô")
        y_top = by1 + (32 if stacked else 24)
        shrink = 0.86 if stacked else 1.0
        for ch, tone in zip((grave, acute, hook, tilde, dot), TONES):
            if tone == "dot":
                cont = list(b["cont"]) + [S.ellipse(cx, -84, 58, 58)]
            else:
                cont = place_tone(b["cont"], marks, tone, cx, y_top, bw, shrink)
            out[ch] = dict(cont=cont, adv=b["adv"])

    # ---------- lowercase modifiers ----------
    lower_vn = dict(lower)

    def with_mark(base_ch, mark_name, sm=0.86, gap=22):
        b = lower[base_ch]
        bx0, by0, bx1, by1 = fbuild.bbox(b["cont"])
        cx = (bx0 + bx1) / 2.0
        m = marks[mark_name]
        cont = list(b["cont"]) + fbuild.shift(scale(m["cont"], sm), cx, by1 + gap)
        return dict(cont=cont, adv=b["adv"])

    lower_vn["ă"] = with_mark("a", "breve")
    lower_vn["â"] = with_mark("a", "circumflex")
    lower_vn["ê"] = with_mark("e", "circumflex")
    lower_vn["ô"] = with_mark("o", "circumflex")

    def horn(base_ch):
        b = lower[base_ch]
        bx0, by0, bx1, by1 = fbuild.bbox(b["cont"])
        pts = [(bx1 - 52, XH + 2), (bx1 + 22, XH + 54), (bx1 + 76, XH + 44)]
        h = S.ribbon(pts, [88, 78, 46])
        return dict(cont=list(b["cont"]) + [h], adv=b["adv"])

    lower_vn["ơ"] = horn("o")
    lower_vn["ư"] = horn("u")

    d = lower["d"]
    dx0, dy0, dx1, dy1 = fbuild.bbox(d["cont"])
    bar = S.rect(dx1 - 200, 552, dx1 + 48, 552 + 100)
    lower_vn["đ"] = dict(cont=list(d["cont"]) + [bar], adv=d["adv"])

    for ch, v in lower_vn.items():
        out[ch] = v

    # ---------- lowercase tones ----------
    for base, grave, acute, hook, tilde, dot in LOW_VOWELS:
        b = lower_vn[base]
        bx0, by0, bx1, by1 = fbuild.bbox(b["cont"])
        cx = (bx0 + bx1) / 2.0
        bw = bx1 - bx0
        stacked = base in ("ă", "â", "ê", "ô")
        y_top = by1 + (26 if stacked else 20)
        shrink = 0.88 if stacked else 1.0
        for ch, tone in zip((grave, acute, hook, tilde, dot), TONES):
            if tone == "dot":
                cont = list(b["cont"]) + [S.ellipse(cx, -96, 48, 48)]
            else:
                cont = place_tone(b["cont"], marks, tone, cx, y_top, bw, shrink)
            out[ch] = dict(cont=cont, adv=b["adv"])
    return out
