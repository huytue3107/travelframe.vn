import {readFileSync,writeFileSync} from 'node:fs';
const alignment=JSON.parse(readFileSync(new URL('assets/adam-alignment.json',import.meta.url))).alignment;
const text=alignment.characters.join('');
const at=phrase=>{const i=text.indexOf(phrase);if(i<0)throw Error(`Missing narration anchor ${phrase}`);return alignment.character_start_times_seconds[i];};
const voiceEnd=alignment.character_end_times_seconds.at(-1);
const duration=Math.ceil((voiceEnd+1.3)*30)/30;
const definitions=[
 ['Planning','VIETNAM TRIP?<br>OCTOBER–DECEMBER','CHECK BEFORE YOU PACK','cat-surprised.png','calendar','OCT · NOV · DEC'],
 ['Here’s something','SAME COUNTRY.<br>DIFFERENT WEATHER.','NORTH → CENTRAL → SOUTH','cat.png','regions','THREE REGIONS'],
 ['In Northern','NORTHERN VIETNAM','HANOI IN AUTUMN','cat-scarf.png','photo','old-quarter.jpg'],
 ['It’s a lovely','SLOW DOWN.<br>LOOK AROUND.','OLD QUARTER · HANOI','cat-cream.png','photo','old-quarter.jpg'],
 ['stop for coffee','COFFEE BREAK?<br>YES, PLEASE.','BRING YOUR CAMERA','cat-chubby.png','photo','coffee.jpg'],
 ['By December','DECEMBER?<br>PACK LAYERS.','A JACKET GOES IN THE BAG','cat-scarf.png','card','LAYERS + JACKET'],
 ['and warmer clothing','HEADING TO<br>THE MOUNTAINS?','PACK WARMER CLOTHING','cat-scarf.png','card','WARMER LAYERS'],
 ['In Central','CENTRAL VIETNAM','HUẾ · ĐÀ NẴNG · HỘI AN','cat-umbrella.png','rain','LATE-YEAR WEATHER'],
 ['can see heavy rain','HEAVY RAIN<br>AND STORMS','LATER MONTHS OF THE YEAR','cat-umbrella.png','rain','KEEP PLANS FLEXIBLE'],
 ['Keep your plans','KEEP YOUR<br>PLANS FLEXIBLE','HAVE AN INDOOR BACKUP','cat.png','photo','coffee.jpg'],
 ['Rain can continue','RAIN CAN CONTINUE<br>INTO DECEMBER','CHECK THE LOCAL FORECAST','cat-umbrella.png','rain','CHECK BEFORE YOU GO'],
 ['In Southern','SOUTHERN VIETNAM','IT STAYS WARM','cat-sun.png','sun','WARM YEAR-ROUND'],
 ['You may still','OCTOBER + NOVEMBER','SHOWERS CAN STILL HAPPEN','cat-umbrella.png','rain','BRING A RAIN LAYER'],
 ['while December','DECEMBER IS<br>GENERALLY DRIER','SEASONAL PATTERNS CAN VARY','cat-sun.png','sun','GENERALLY DRIER'],
 ['Wherever','CHECK CLOSE<br>TO YOUR TRIP','LOCAL FORECAST > GENERAL GUIDE','cat-surprised.png','card','CHECK YOUR DATES'],
 ['And if Hanoi','HANOI ON<br>YOUR LIST?','MAKE TIME TO SLOW DOWN','cat-cream.png','photo','lake.jpg'],
 ['explore its streets','EXPLORE.<br>CAPTURE THE IN-BETWEEN.','A LITTLE HANOI STORY','cat.png','photo','old-quarter.jpg'],
 ['Save this','SAVE THIS FOR<br>YOUR VIETNAM TRIP','TRAVELFRAME · TRAVEL WITH CURIOSITY','cat-chubby.png','calendar','OCT · NOV · DEC']
];
const scenes=definitions.map(([anchor,title,sub,cat,kind,value],i)=>({id:`weather${i+1}`,start:at(anchor),title,sub,cat,kind,value}));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const round=x=>Number(x.toFixed(3));
const cloud='<svg viewBox="0 0 300 200" aria-hidden="true"><path d="M62 136C10 136 15 66 69 67C77 9 164 0 183 65C231 26 293 82 267 122C258 138 242 143 223 143H62Z" fill="#f3f4f4" stroke="#202020" stroke-width="9"/><path d="M85 163l-12 25m67-25l-12 25m67-25l-12 25m67-25l-12 25" stroke="#ae2a1d" stroke-width="12" stroke-linecap="round"/></svg>';
const sun='<svg viewBox="0 0 300 220" aria-hidden="true"><g stroke="#202020" stroke-width="9" stroke-linecap="round"><circle cx="150" cy="110" r="59" fill="#e7b456"/><path d="M150 15V0m0 220v-15M55 110H30m240 0h-25M83 43L66 26m168 168l-17-17M83 177l-17 17M234 26l-17 17"/></g></svg>';
function art(s){
 if(s.kind==='photo')return `<div class="photo"><img src="assets/${s.value}" alt="Hanoi travel stock"></div>`;
 if(s.kind==='regions')return `<div class="visual-card regions"><b>NORTH</b><b>CENTRAL</b><b>SOUTH</b></div>`;
 if(s.kind==='calendar')return `<div class="visual-card calendar"><div>VIETNAM</div><b>OCT</b><b>NOV</b><b>DEC</b></div>`;
 if(s.kind==='rain'||s.kind==='sun')return `<div class="visual-card weather-icon">${s.kind==='rain'?cloud:sun}<strong>${s.value}</strong></div>`;
 return `<div class="visual-card text-card"><div class="tick">✓</div><strong>${s.value}</strong></div>`;
}
const shared=`#root{position:absolute;inset:0;width:1080px;height:1920px;font-family:Arial,sans-serif}.head{position:absolute;left:90px;top:286px;width:865px;text-align:center}.title{font-size:66px;line-height:1.13;font-weight:900;color:#ae2a1d;-webkit-text-stroke:4px #171717;paint-order:stroke fill;letter-spacing:-1.2px}.sub{font-size:31px;line-height:1.18;font-weight:800;margin-top:20px;color:#151515}.cat{position:absolute;left:104px;top:690px;width:440px;height:480px;object-fit:contain;object-position:bottom}.art{position:absolute;left:493px;top:630px;width:412px;height:435px}.photo{width:100%;height:100%;border:13px solid white;border-radius:3px;box-shadow:0 5px 17px #0003;overflow:hidden}.photo img{width:100%;height:100%;object-fit:cover}.visual-card{width:100%;height:100%;background:#fff;border:4px solid #202020;box-shadow:8px 9px 0 #0002;border-radius:8px;text-align:center;padding:32px 24px;color:#181818}.calendar{padding-top:0}.calendar div{background:#ae2a1d;color:white;font-size:37px;font-weight:900;padding:16px;margin:0 -24px 18px}.calendar b{display:block;font-size:60px;line-height:1.25}.regions{display:flex;flex-direction:column;gap:26px;justify-content:center}.regions b{font-size:43px;border-bottom:3px dashed #ae2a1d;padding:0 0 14px}.weather-icon svg{height:230px;width:100%}.visual-card strong{font-size:36px;font-weight:900;line-height:1.15;display:block;margin-top:20px}.text-card{display:flex;flex-direction:column;justify-content:center}.tick{font-size:115px;font-weight:900;color:#ae2a1d}.kicker{position:absolute;top:537px;left:90px;width:865px;text-align:center;color:#ae2a1d;font-size:26px;font-weight:800;letter-spacing:2px}`;
scenes.forEach((s,i)=>{
 s.end=scenes[i+1]?.start??duration;s.length=round(s.end-s.start);
 const content=`<template><style>${shared}</style><div id="root" data-composition-id="${s.id}" data-width="1080" data-height="1920"><div id="${s.id}-head" class="head"><div class="title" data-var-text="title">${s.title}</div><div class="sub" data-var-text="subtitle">${s.sub}</div></div><div id="${s.id}-art" class="art">${art(s)}</div><img id="${s.id}-cat" class="cat" src="assets/${s.cat}" alt="Expressive cat sticker"></div><script>const tl=gsap.timeline({paused:true});${i?`tl.fromTo('#${s.id}-head',{opacity:0,y:-22},{opacity:1,y:0,duration:.3,ease:'power3.out'},0);`:''}tl.fromTo('#${s.id}-art',{opacity:0,x:70,rotation:10},{opacity:1,x:0,rotation:4,duration:.44,ease:'back.out(1.1)'},.10);tl.fromTo('#${s.id}-cat',{opacity:0,y:70,scale:.88},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(1.4)'},.24);window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;</script></template>`;
 writeFileSync(new URL(`compositions/${s.id}.html`,import.meta.url),content);
});
const phrases=[
 'Planning a Vietnam trip', 'between October and December?',
 'Here’s something to know before you pack:', 'the weather can feel very different', 'from north to south.',
 'In Northern Vietnam,', 'Hanoi usually starts to feel cooler in autumn.',
 'It’s a lovely time to wander the Old Quarter,', 'stop for coffee and explore with your camera.',
 'By December, pack layers and a jacket —', 'and warmer clothing if you’re heading to the mountains.',
 'In Central Vietnam,', 'places like Huế, Đà Nẵng and Hội An',
 'can see heavy rain and storms', 'during the later months of the year.',
 'Keep your plans flexible,', 'and have a café or indoor activity in mind.',
 'Rain can continue into December,', 'so check the forecast before you go.',
 'In Southern Vietnam, it stays warm.', 'You may still see showers in October and November,',
 'while December generally brings drier weather.',
 'Wherever you’re going,', 'check the local forecast close to your trip.',
 'And if Hanoi is on your list,', 'save a little time to slow down,',
 'explore its streets', 'and capture the moments in between.',
 'Save this for your Vietnam trip.'
];
let cursor=0;
const chunks=phrases.map(phrase=>{const a=text.indexOf(phrase,cursor);if(a<0)throw Error(`Missing caption ${phrase}`);cursor=a+phrase.length;return [{word:phrase,a,b:cursor-1}];});
const caps=chunks.map((ws,i)=>{const start=Math.max(0,alignment.character_start_times_seconds[ws[0].a]-.025),natural=alignment.character_end_times_seconds[ws.at(-1).b]+.09,next=chunks[i+1]?alignment.character_start_times_seconds[chunks[i+1][0].a]-.025:duration;return `<div id="caption${i}" class="clip caption" data-start="${round(start)}" data-duration="${round(Math.min(natural,next)-start)}">${esc(ws.map(x=>x.word).join(' '))}</div>`;}).join('\n');
writeFileSync(new URL('compositions/captions.html',import.meta.url),`<template><style>#root{position:absolute;inset:0}.caption{position:absolute;left:127px;top:1192px;width:818px;text-align:center;font:700 39px/1.24 Arial,sans-serif;color:white;background:#1b1b1bf2;border-radius:10px;padding:14px 22px}</style><div id="root" data-composition-id="captions" data-width="1080" data-height="1920">${caps}</div><script>window.__timelines=window.__timelines||{};window.__timelines.captions=gsap.timeline({paused:true});</script></template>`);
const hosts=scenes.map(s=>`<div id="${s.id}" class="clip" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${round(s.start)}" data-duration="${s.length}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`).join('\n');
const sound=scenes.map((s,i)=>`<audio id="pop${i}" class="clip" src="assets/sfx/pop.wav" data-start="${round(s.start+.25)}" data-duration=".22" data-track-index="5" data-volume=".12"></audio>${i&&i%2===0?`<audio id="swoosh${i}" class="clip" src="assets/sfx/whoosh.wav" data-start="${round(s.start-.1)}" data-duration=".32" data-track-index="6" data-volume=".10"></audio>`:''}`).join('\n');
writeFileSync(new URL('index.html',import.meta.url),`<!doctype html><html lang="en"><head><meta charset="utf-8"><script src="assets/gsap.min.js"></script><style>*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#f4f3f0;font-family:Arial,sans-serif}#root{position:relative;width:1080px;height:1920px;overflow:hidden}.paper{position:absolute;inset:0;background:url('assets/paper-blank.png') center/cover}.brand{position:absolute;top:183px;right:125px;font-weight:900;font-size:28px;color:#ae2a1d;letter-spacing:1px}.note{position:absolute;top:1400px;left:140px;width:800px;text-align:center;font-size:28px;color:#6a6a6a}</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="1080" data-height="1920"><div class="paper"></div><div class="brand">TRAVELFRAME</div>${hosts}<div id="captions" class="clip" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${duration}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920"></div><div class="note">SEASONAL GUIDE · CHECK YOUR LOCAL FORECAST</div><audio id="voice" class="clip" src="assets/adam-voice.mp3" data-start="0" data-duration="${round(voiceEnd+.06)}" data-track-index="3" data-volume="1"></audio><audio id="music" class="clip" src="assets/original-music.wav" data-start="0" data-duration="${duration}" data-track-index="4" data-volume=".12" data-fade-in=".6" data-fade-out="1.8"></audio>${sound}</main><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>`);
writeFileSync(new URL('timeline.json',import.meta.url),JSON.stringify({duration,voiceEnd,scenes},null,2));
console.log(JSON.stringify({duration,scenes:scenes.length,captions:chunks.length}));
