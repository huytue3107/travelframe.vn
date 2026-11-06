import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import fbuild, compile_font as C, lowercase as L, compose as K, construct as X

YEL = (252, 201, 32)
RED = (208, 84, 50)
BROWN = (111, 53, 31)
BLUE = (130, 141, 163)
CREAM = (247, 232, 193)

OUT = '/sessions/zealous-charming-hawking/mnt/travelframe.vn/Creative-Production/Assets/Fonts/HeritageDisplay'
os.makedirs(OUT, exist_ok=True)

img = np.asarray(Image.open('ref/a.png').convert('RGB'))
upper = fbuild.build_upper(img)
marks = K.build_marks(img)
lower = {}
for ch, v in L.build_lower().items():
    lower[ch] = dict(cont=fbuild.shift(v['cont'], v['sb'], 0), adv=v['adv'])

full = K.compose_all(upper, lower, marks)
con = X.build_constructed()
con.pop('0alt', None)
full.update(con)
full[' '] = dict(cont=[], adv=260)
full[' '] = dict(cont=[], adv=260)
full['​'] = dict(cont=[], adv=0)

glyphs, cmap = {}, {}
for ch, v in full.items():
    n = C.glyph_name(ch)
    glyphs[n] = {'cont': v['cont'], 'adv': v['adv']}
    cmap[ord(ch)] = n

ttf = os.path.join(OUT, 'HeritageDisplay-Regular.ttf')
otf = os.path.join(OUT, 'HeritageDisplay-Regular.otf')
C.compile_ttf(glyphs, cmap, ttf)
C.compile_otf(glyphs, cmap, otf)

import kern as KF
n_pairs, _ = KF.apply_kerning(ttf, full)
KF.apply_kerning(otf, full)
print('kern pairs:', n_pairs)

# woff2
try:
    from fontTools.ttLib import TTFont
    f = TTFont(ttf)
    f.flavor = 'woff2'
    f.save(os.path.join(OUT, 'HeritageDisplay-Regular.woff2'))
    print('woff2 ok')
except Exception as e:
    print('woff2 skipped:', e)

# ---------------- specimen ----------------
import hbrender as HB

W, H = 1700, 2300
im = Image.new('RGB', (W, H), YEL)
d = ImageDraw.Draw(im)


def txt(x, y, s, size, fill=RED):
    HB.draw_shaped(im, d, ttf, s, x, y, size, fill)


d.rectangle([0, 0, W, 8], fill=RED)
txt(70, 60, "HERITAGE", 150)
txt(70, 208, "DISPLAY", 150)
txt(74, 372, "Dựng lại từ bảng mẫu tham chiếu · 219 glyph · kerning đầy đủ · tiếng Việt", 32, BROWN)

y = 450
txt(70, y, "CHỮ IN HOA", 26, BROWN)
txt(70, y + 42, "AĂÂBCDĐEFGHIJKLMNOÔƠPQRSTUƯVWXYZ", 56)
txt(70, y + 116, "0123456789  & ? ! ., : ; - / ( ) [ ] ' \" *", 56)

y = 636
txt(70, y, "CHỮ THƯỜNG", 26, BROWN)
txt(70, y + 42, "aăâbcdđeêghiklmnoôơpqrstuưvxy", 62)
txt(70, y + 120, "0123456789  & ? ! ., : ; - /", 62)

y = 852
txt(70, y, "DẤU THANH TIẾNG VIỆT", 26, BROWN)
txt(70, y + 42, "À Á Ả Ã Ạ   Ằ Ắ Ẳ Ẵ Ặ   Ầ Ấ Ẩ Ẫ Ậ", 48)
txt(70, y + 104, "È É Ẻ Ẽ Ẹ   Ề Ế Ể Ễ Ệ   Ì Í Ỉ Ĩ Ị", 48)
txt(70, y + 166, "Ò Ó Ỏ Õ Ọ   Ồ Ố Ổ Ỗ Ộ   Ờ Ớ Ở Ỡ Ợ", 48)
txt(70, y + 228, "Ù Ú Ủ Ũ Ụ   Ừ Ứ Ử Ữ Ự   Ỳ Ý Ỷ Ỹ Ỵ", 48)
txt(70, y + 290, "à á ả ã ạ   ằ ắ ẳ ẵ ặ   ầ ấ ẩ ẫ ậ   è é ẻ ẽ ẹ   ề ế ể ễ ệ", 48)

y = 1290
txt(70, y, "MẪU CHỮ", 26, BROWN)
txt(70, y + 46, "ĐIỆU PHỐ CỔ", 108)
txt(70, y + 176, "Phởriends with Phở", 84)
txt(70, y + 268, "Hà Nội mùa thu, phố cổ rêu phong. Những gánh hàng rong vẫn", 36, BROWN)
txt(70, y + 316, "len lỏi qua từng con ngõ nhỏ, mang theo hương cốm, hương sữa", 36, BROWN)
txt(70, y + 364, "nóng và cả tiếng rao quen thuộc của một thời.", 36, BROWN)

y = 1960
txt(70, y, "BẢNG MẪU GỐC (THAM CHIẾU)", 24, BROWN)
ref = Image.open('ref/a.png').convert('RGB').crop((0, 1290, 2048, 1450))
ref = ref.resize((W - 140, int(160 * (W - 140) / 2048)), Image.LANCZOS)
im.paste(ref, (70, y + 36))

txt(70, H - 86, f"UPM 1000 · cap 700 · x-height 500 · 219 glyph · {n_pairs} cặp kern · dựng lại từ ảnh", 24, BROWN)
d.rectangle([0, H - 14, W, H], fill=RED)

im.save(os.path.join(OUT, 'specimen.png'))
print('saved to', OUT)
for f in sorted(os.listdir(OUT)):
    fp = os.path.join(OUT, f)
    if os.path.isfile(fp):
        print(' ', f, os.path.getsize(fp))
