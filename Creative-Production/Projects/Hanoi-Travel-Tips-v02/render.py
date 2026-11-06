from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import hashlib, json, zipfile

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parents[1] / 'Deliverables/2026-10-22-Hanoi-Travel-Tips-v02'
OUT.mkdir(parents=True, exist_ok=True)
S = 2
CREAM, INK, TEAL = '#F5F1E8', '#243C38', '#397F80'
FONTS = ROOT / 'fonts'

def font(kind, size):
    name = {'serif':'cormorantgaramond-CormorantGaramond[wght].ttf',
            'script':'ooohbaby-OoohBaby-Regular.ttf',
            'sans':'dmsans-DMSans[opsz,wght].ttf'}[kind]
    f = ImageFont.truetype(str(FONTS / name), round(size*S))
    if kind == 'serif': f.set_variation_by_axes([500])
    return f

cards = [
 ('829507803_18100118699217614_8657453606628423510_n.jpg','YOUR HANOI','photo walk','A LITTLE PREP. A BETTER PHOTO STORY.',
  ['Wear something you feel good in.', 'Bring water. Leave room for little discoveries.']),
 ('829941228_18100118744217614_577863110685873324_n.jpg','KEEP IT','comfortable','WHAT TO WEAR',
  ['Choose clothes you can move in.', 'One simple accessory can tell your story.']),
 ('830572775_18100118792217614_6094730540638961114_n.jpg','PAUSE. LOOK.','take it in','A LITTLE PHOTO ETIQUETTE',
  ['Choose permitted pedestrian areas.', 'Keep railway tracks clear. Follow local signs.']),
 ('830695322_18100118708217614_5484071910853353928_n.jpg','LET THE CITY','frame you','COMPOSITION NOTES',
  ['Look for lines, layers and little details.', 'Keep paths clear while taking photos.']),
 ('831340261_18100118735217614_8295756362089996179_n.jpg','FIND YOUR','own rhythm','POSING NOTES',
  ['Relax your shoulders. Keep it natural.', 'Choose a safe, permitted place to pause.']),
 ('831568064_18100118672217614_5666467836984100281_n.jpg','TAKE HOME','a little Hanoi','YOUR PHOTO WALK CHECKLIST',
  ['Water, comfortable shoes and a curious eye.', 'Your everyday moments are worth keeping.']),
]

manifest = []
for i, (source, title, script, category, tips) in enumerate(cards, 1):
    src = Path('/Users/macbook/Downloads') / source
    before = hashlib.sha256(src.read_bytes()).hexdigest()
    canvas = Image.new('RGB', (1080*S, 1350*S), CREAM)
    draw = ImageDraw.Draw(canvas)
    def text(x, y, value, kind, size, fill=INK, anchor='lt'):
        f = font(kind, size)
        box = draw.textbbox((x*S,y*S), value, font=f, anchor=anchor)
        assert 0 <= box[0] and box[2] <= 1080*S and box[1] >= 0 and box[3] <= 1350*S, (i,value,box)
        draw.text((x*S,y*S), value, font=f, fill=fill, anchor=anchor)
    def spaced(value, y, size, gap, fill=INK):
        f = font('sans', size)
        width=sum(draw.textlength(c,font=f) for c in value)+(len(value)-1)*gap*S
        x=(1080*S-width)/2
        for c in value:
            draw.text((x,y*S),c,font=f,fill=fill,anchor='lt')
            x+=draw.textlength(c,font=f)+gap*S
    spaced('TRAVELFRAME  /  HANOI NOTES', 48, 17, 4)
    text(540, 108, title, 'serif', 78, anchor='mt')
    text(540, 188, script, 'script', 106, anchor='mt')
    draw.line((72*S, 318*S,1008*S,318*S),fill=TEAL,width=2*S)
    spaced(category, 337, 16, 2, TEAL)
    original=ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    if original.width > original.height:
        photo=ImageOps.contain(original,(984*S,700*S),Image.Resampling.LANCZOS)
    else:
        photo=ImageOps.fit(original,(984*S,700*S),Image.Resampling.LANCZOS,centering=(0.5,0.04))
    canvas.paste(photo,((1080*S-photo.width)//2,390*S+(700*S-photo.height)//2))
    for row,tip in enumerate(tips):
        y=1143+row*54
        draw.ellipse((77*S,(y+2)*S,97*S,(y+22)*S),outline=TEAL,width=2*S)
        draw.line((82*S,(y+12)*S,87*S,(y+17)*S,94*S,(y+7)*S),fill=TEAL,width=2*S)
        text(119,y,tip,'sans',28)
    draw.line((72*S,1260*S,1008*S,1260*S),fill='#CBD4CB',width=S)
    text(72,1283,'@travelframe.vn','sans',20)
    text(1008,1283,f'{i:02d} / 06','sans',20,anchor='rt')
    final=canvas.resize((1080,1350),Image.Resampling.LANCZOS)
    target=OUT/f'TF-HANOI-TIPS-{i:02d}-v02.png'
    final.save(target)
    assert Image.open(target).size == (1080,1350)
    assert before == hashlib.sha256(src.read_bytes()).hexdigest()
    manifest.append({'card':i,'source':str(src),'source_sha256':before,'output':target.name,
      'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'size':[1080,1350],
      'headline':[title,script],'category':category,'tips':tips})

sheet=Image.new('RGB',(1080,920),'#E7E5DC')
for i, item in enumerate(manifest):
    thumb=Image.open(OUT/item['output']).resize((352,440),Image.Resampling.LANCZOS)
    sheet.paste(thumb,(4+(i%3)*360,8+(i//3)*456))
sheet.save(OUT/'TravelFrame-Hanoi-Tips-v02-Preview.jpg',quality=94)
(OUT/'Manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
with zipfile.ZipFile(OUT/'TravelFrame-Hanoi-Tips-v02.zip','w',zipfile.ZIP_DEFLATED) as archive:
    for item in manifest: archive.write(OUT/item['output'],item['output'])
print(json.dumps({'output':str(OUT),'cards':len(manifest),'dimensions':[1080,1350],'source_files_unchanged':True},indent=2))
