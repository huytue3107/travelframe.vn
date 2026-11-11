"""Specimen sheet + before/after comparison.

usage: python specimen.py <new.ttf> <old.ttf> <out_dir>
"""
import os
import sys
from PIL import Image, ImageDraw
from fontTools.ttLib import TTFont
import hbrender as HB

YEL = (252, 201, 32)
RED = (208, 84, 50)
BROWN = (111, 53, 31)


def specimen(ttf, out):
    W, H = 1700, 2300
    im = Image.new("RGB", (W, H), YEL)
    d = ImageDraw.Draw(im)

    def txt(x, y, s, size, fill=RED):
        HB.draw_shaped(im, d, ttf, s, x, y, size, fill)

    n_glyphs = len(TTFont(ttf).getGlyphOrder()) - 1
    d.rectangle([0, 0, W, 8], fill=RED)
    txt(70, 70, "HERITAGE", 150)
    txt(70, 230, "DISPLAY", 150)
    txt(74, 400, f"v1.1 · {n_glyphs} glyph · đủ 134 chữ cái tiếng Việt · kerning có ngoại lệ cho dấu", 30, BROWN)

    y = 470
    txt(70, y, "CHỮ IN HOA", 26, BROWN)
    txt(70, y + 42, "AĂÂBCDĐEÊFGHIJKLMNOÔƠPQRSTUƯVWXYZ", 56)
    txt(70, y + 124, "0123456789  & ? ! ., : ; - / ( ) [ ] ' \" *", 56)

    y = 680
    txt(70, y, "CHỮ THƯỜNG", 26, BROWN)
    txt(70, y + 50, "aăâbcdđeêfghijklmnoôơpqrstuưvwxyz", 64)

    y = 830
    txt(70, y, "DẤU THANH TIẾNG VIỆT", 26, BROWN)
    rows = ["À Á Ả Ã Ạ   Ằ Ắ Ẳ Ẵ Ặ   Ầ Ấ Ẩ Ẫ Ậ",
            "È É Ẻ Ẽ Ẹ   Ề Ế Ể Ễ Ệ   Ì Í Ỉ Ĩ Ị",
            "Ò Ó Ỏ Õ Ọ   Ồ Ố Ổ Ỗ Ộ   Ờ Ớ Ở Ỡ Ợ",
            "Ù Ú Ủ Ũ Ụ   Ừ Ứ Ử Ữ Ự   Ỳ Ý Ỷ Ỹ Ỵ",
            "à á ả ã ạ   ằ ắ ẳ ẵ ặ   ầ ấ ẩ ẫ ậ   è é ẻ ẽ ẹ",
            "ề ế ể ễ ệ   ì í ỉ ĩ ị   ò ó ỏ õ ọ   ồ ố ổ ỗ ộ",
            "ờ ớ ở ỡ ợ   ù ú ủ ũ ụ   ừ ứ ử ữ ự   ỳ ý ỷ ỹ ỵ"]
    for i, r in enumerate(rows):
        txt(70, y + 48 + i * 72, r, 50)

    y = 1420
    txt(70, y, "MẪU CHỮ", 26, BROWN)
    txt(70, y + 50, "ĐIỆU PHỐ CỔ", 112)
    txt(70, y + 190, "Phởriends with Phở", 86)
    txt(70, y + 300, "Nội Bài · Hoàn Kiếm · Trấn Quốc · Thăng Long", 52)
    txt(70, y + 380, "Hà Nội mùa thu, phố cổ rêu phong. Những gánh hàng rong vẫn", 36, BROWN)
    txt(70, y + 428, "len lỏi qua từng con ngõ nhỏ, mang theo hương cốm, hương sữa", 36, BROWN)
    txt(70, y + 476, "nóng và cả tiếng rao quen thuộc của một thời. Tấn, Tới, Vũng, Yên.", 36, BROWN)

    txt(70, H - 86, "UPM 1000 · cap 700 · x-height 500 · ascender 980 · descender -300 · dựng lại từ ảnh", 24, BROWN)
    d.rectangle([0, H - 14, W, H], fill=RED)
    im.save(out)


def compare(new, old, out):
    lines = [("NỘI BÀI · HOÀN KIẾM · THĂNG LONG", 74),
             ("Nội Bài · Hoàn Kiếm · Trấn Quốc · Thăng Long", 62),
             ("Ấ Ầ Ố Ồ Ắ Ằ Ứ Ừ   ấ ầ ố ồ ắ ằ ứ ừ ỵ", 62),
             ("wave · Long · Phở · ướt · Tấn Tới Yên", 62)]
    W, block = 1700, 120
    H = 120 + 2 * (60 + block * len(lines))
    im = Image.new("RGB", (W, H), YEL)
    d = ImageDraw.Draw(im)
    y = 40
    for label, path in (("TRƯỚC (v1.0)", old), ("SAU (v1.1)", new)):
        HB.draw_shaped(im, d, new, label, 70, y, 30, BROWN)
        y += 60
        for s, size in lines:
            HB.draw_shaped(im, d, path, s, 70, y, size, RED)
            y += block
        y += 20
        d.line([(0, y - 10), (W, y - 10)], fill=BROWN, width=2)
    im.save(out)


if __name__ == "__main__":
    new, old, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    specimen(new, os.path.join(out_dir, "specimen.png"))
    compare(new, old, os.path.join(out_dir, "before-after.png"))
    print("ok")
