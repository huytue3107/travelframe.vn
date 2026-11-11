"""Constructed glyphs filling the gaps in the specimen sheet."""
import math
import shape as S

CAP = 700.0
TH = 147.0    # thick stem
TN = 106.0    # thin bar


def K():
    return S.merge(
        S.rect(0, 0, TH, CAP),
        S.poly([(100, 296), (100, 424), (660, CAP), (660, CAP - 122)]),
        S.poly([(100, 386), (100, 514), (660, 128), (660, 0)]),
    ), 710


def T():
    w = 630.0
    return S.merge(
        S.rect(0, CAP - TN, w, CAP),
        S.rect(w / 2 - TH / 2, 0, w / 2 + TH / 2, CAP),
    ), w


def J():
    r = 158.0
    w = 2 * r
    return S.merge(
        S.rect(r, r, w, CAP),
        S.arc_band(r, r, r, r, TH, 108, 0, -math.pi),
    ), w


def zero():
    w = 495.0
    return S.ring(w / 2, 350, w / 2, 355, 149, 113), w


def six():
    w = 495.0
    return S.merge(
        S.ring(w / 2, 190, w / 2, 200, 149, 113),
        S.rect(0, 190, TH, 620),
        S.ribbon([(TH / 2, 600), (190, 690), (430, CAP)], [TH, TH * 0.9, TN * 0.9]),
    ), w


def seven():
    w = 495.0
    return S.merge(
        S.rect(0, CAP - TN, w, CAP),
        S.ribbon([(w - 40, CAP - TN), (60, 0)], [130, 145]),
    ), w


def eight():
    w = 495.0
    return S.merge(
        S.ring(w / 2, 520, 205, 180, 140, 108),
        S.ring(w / 2, 180, w / 2, 180, 149, 113),
    ), w


def nine():
    w = 495.0
    return S.merge(
        S.ring(w / 2, 510, w / 2, 195, 149, 113),
        S.rect(w - TH, 90, w, 510),
        S.ribbon([(w - TH / 2, 130), (300, 24), (60, 0)], [TH, TH * 0.85, TN * 0.8]),
    ), w


def period():
    return [S.ellipse(78, 78, 78, 78)], 210


def comma():
    return S.merge(
        S.ellipse(78, 92, 78, 78),
        S.ribbon([(96, 60), (84, -30), (30, -130)], [120, 100, 60]),
    ), 210


def colon():
    return S.merge([S.ellipse(78, 78, 78, 78)], [S.ellipse(78, 372, 78, 78)]), 210


def semicolon():
    c, _ = comma()
    return S.merge(c, [S.ellipse(78, 372, 78, 78)]), 210


def hyphen():
    return [S.rect(0, 292, 310, 292 + TN)], 400


def endash():
    return [S.rect(0, 292, 500, 292 + TN)], 590


def emdash():
    return [S.rect(0, 292, 700, 292 + TN)], 790


def slash():
    return S.merge(S.ribbon([(400, CAP), (0, 0)], [110, 120])), 480


def paren_open():
    return S.merge(S.arc_band(390, 350, 390, 360, 108, 108,
                              math.radians(128), math.radians(232))), 300


def paren_close():
    return S.merge(S.arc_band(-90, 350, 390, 360, 108, 108,
                              math.radians(52), math.radians(-52))), 300


def bracket_open():
    return S.merge(S.rect(0, 0, TN, CAP), S.rect(0, CAP - TN, 300, CAP),
                   S.rect(0, 0, 300, TN)), 380


def bracket_close():
    return S.merge(S.rect(280, 0, 280 + TN, CAP), S.rect(0, CAP - TN, 280 + TN, CAP),
                   S.rect(0, 0, 280 + TN, TN)), 380


def quotesingle():
    return S.merge(S.ribbon([(70, CAP), (30, 560)], [130, 90])), 190


def quotedbl():
    return S.merge(S.ribbon([(70, CAP), (30, 560)], [120, 85]),
                   S.ribbon([(250, CAP), (210, 560)], [120, 85])), 370


def question():
    return S.merge(
        S.ribbon([(40, 560), (150, 690), (320, 640), (300, 470), (150, 400)], [110, 100, 100, 95, 105]),
        [S.ellipse(150, 150, 78, 78)],
    ), 440


def exclam():
    return S.merge(
        S.ribbon([(120, CAP), (120, 300)], [150, 120]),
        [S.ellipse(120, 90, 78, 78)],
    ), 300


def asterisk():
    return S.merge(
        S.ribbon([(160, 700), (160, 430)], [90, 70]),
        S.ribbon([(20, 650), (300, 480)], [90, 70]),
        S.ribbon([(300, 650), (20, 480)], [90, 70]),
    ), 340


def bullet():
    return [S.ellipse(90, 330, 90, 90)], 240


def middot():
    return [S.ellipse(60, 330, 58, 58)], 200


CONSTRUCTED = {
    "K": K, "T": T, "J": J,
    "0alt": zero, "6": six, "7": seven, "8": eight, "9": nine,
    ".": period, ",": comma, ":": colon, ";": semicolon,
    "-": hyphen, "–": endash, "—": emdash, "/": slash,
    "(": paren_open, ")": paren_close, "[": bracket_open, "]": bracket_close,
    "'": quotesingle, '"': quotedbl, "?": question, "!": exclam,
    "*": asterisk, "•": bullet, "·": middot,
}


PADDED = set("JKT6789")


def build_constructed():
    out = {}
    for ch, fn in CONSTRUCTED.items():
        cont, w = fn()
        if cont and isinstance(cont[0], tuple):
            cont = [cont]
        pad = 90 if ch in PADDED else 40
        # split the padding over both sides (v1.0 put all of it on the right)
        cont = [[(s[0],) + tuple(v + (pad / 2 if i % 2 == 0 else 0) for i, v in enumerate(s[1:]))
                 for s in cn] for cn in cont]
        out[ch] = dict(cont=cont, adv=w + pad)
    return out
