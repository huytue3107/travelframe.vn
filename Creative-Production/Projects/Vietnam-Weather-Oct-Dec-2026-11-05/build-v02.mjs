import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const old=JSON.parse(readFileSync(new URL('timeline.json',import.meta.url)));
const a=JSON.parse(readFileSync(new URL('assets/adam-alignment.json',import.meta.url))).alignment;
const text=a.characters.join(''),duration=old.duration;
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const r=n=>Number(n.toFixed(3));
const folder='compositions/v02';mkdirSync(new URL(folder+'/',import.meta.url),{recursive:true});
const pictures=[
 ['packing.jpg','PACK FOR YOUR ROUTE','hoi-an-street.jpg','VIETNAM'],
 ['sapa-terraces.jpg','NORTH','saigon-sunset.jpg','SOUTH'],
 ['old-quarter.jpg','HANOI','cathedral.jpg','AUTUMN WALKS'],
 ['old-quarter.jpg','OLD QUARTER','bridge.jpg','WANDER A LITTLE'],
 ['coffee.jpg','COFFEE STOP','lake.jpg','BRING YOUR CAMERA'],
 ['packing.jpg','PACK LAYERS','warm-clothes.jpg','ADD A JACKET'],
 ['sapa-terraces.jpg','SA PA · NORTHERN HIGHLANDS','warm-clothes.jpg','WARMER CLOTHING'],
 ['hoi-an-street.jpg','HỘI AN','hoi-an-river.jpg','CENTRAL VIETNAM'],
 ['rain-detail.jpg','RAIN DETAIL','hoi-an-street.jpg','KEEP PLANS FLEXIBLE'],
 ['coffee.jpg','CAFÉ BREAK','hoi-an-river.jpg','A FLEXIBLE ITINERARY'],
 ['rain-detail.jpg','SHOWERS CAN CONTINUE','hoi-an-street.jpg','CHECK BEFORE YOU GO'],
 ['saigon-sunset.jpg','HO CHI MINH CITY','saigon-river.jpg','SOUTHERN VIETNAM'],
 ['rain-detail.jpg','OCT · NOV SHOWERS','saigon-river.jpg','STAY FLEXIBLE'],
 ['saigon-sunset.jpg','GENERALLY DRIER','photographer.jpg','HO CHI MINH CITY'],
 ['packing.jpg','CHECK YOUR DATES','rain-detail.jpg','CHECK LOCAL WEATHER'],
 ['lake.jpg','SLOW DOWN IN HANOI','cathedral.jpg','LOOK AROUND'],
 ['old-quarter.jpg','EXPLORE THE STREETS','bridge.jpg','CAPTURE THE IN-BETWEEN'],
 ['hoi-an-river.jpg','SAVE FOR YOUR TRIP','old-quarter.jpg','VIETNAM · OCT–DEC']
];
const titles=[
 'VIETNAM IN<br>OCT–DEC?', 'ONE COUNTRY.<br>DIFFERENT WEATHER.', 'NORTH:<br>HELLO, AUTUMN.',
 'GET LOST<br>IN THE LITTLE STREETS.', 'COFFEE.<br>CAMERA. REPEAT.', 'DECEMBER?<br>LAYER UP.',
 'MOUNTAIN PLANS?<br>PACK WARMER.', 'NEXT STOP:<br>CENTRAL VIETNAM.', 'RAIN + STORMS?<br>STAY FLEXIBLE.',
 'ALWAYS HAVE<br>A PLAN B.', 'DECEMBER CAN<br>STILL BE RAINY.', 'SOUTH:<br>STILL WARM.',
 'OCT + NOV?<br>SHOWERS CAN HAPPEN.', 'DECEMBER?<br>GENERALLY DRIER.', 'BEFORE YOU GO:<br>CHECK THE FORECAST.',
 'HANOI ON<br>YOUR LIST?', 'SLOW DOWN.<br>NOTICE MORE.', 'SAVE THIS.<br>PACK SMARTER.'
];
const layouts=[
 {a:[335,595,540,365,-4],b:[495,845,385,275,6],cat:[92,825,355,335]},
 {a:[115,590,540,370,4],b:[570,825,345,285,-5],cat:[100,860,345,300]},
 {a:[360,580,510,355,-4],b:[180,840,430,280,5],cat:[640,850,270,310]}
];
const style=`#root{position:absolute;inset:0;font-family:Arial,sans-serif}.head{position:absolute;left:90px;top:270px;width:870px;text-align:center}.title{font-size:65px;line-height:1.10;font-weight:900;letter-spacing:-1.1px;color:#ae2a1d;-webkit-text-stroke:4px #161616;paint-order:stroke fill}.sub{font-size:30px;font-weight:800;margin-top:18px;line-height:1.15;color:#202020}.under{margin:18px auto 0;width:140px;height:7px;background:#ae2a1d;transform-origin:left center}.photo{position:absolute;padding:13px;background:white;box-shadow:0 8px 18px #0003;border-radius:3px}.window{height:100%;overflow:hidden}.window img{width:100%;height:100%;object-fit:cover;display:block}.label{position:absolute;bottom:10px;left:12px;width:calc(100% - 24px);text-align:center;color:#222;font-size:28px;line-height:1.05;font-weight:800}.tape{position:absolute;top:-12px;left:35%;width:30%;height:27px;background:#e4d9b7c9;z-index:2}.cat{position:absolute;object-fit:contain;object-position:bottom;z-index:5}.flash{position:absolute;inset:0;background:white;z-index:8;pointer-events:none;opacity:0}.mini{position:absolute;left:100px;top:510px;font-size:28px;letter-spacing:2px;font-weight:800;color:#ae2a1d}`;
const scenes=old.scenes.map((s,i)=>({...s,id:`v2scene${i+1}`,title:titles[i],images:pictures[i]}));
scenes.forEach((s,i)=>{
 const l=layouts[i%layouts.length],pic=s.images;
 const photo=(id,arr,file,label,z)=>`<div id="${id}" class="photo" data-layout-allow-overlap style="left:${arr[0]}px;top:${arr[1]}px;width:${arr[2]}px;height:${arr[3]}px;z-index:${z}"><div class="tape"></div><div class="window" data-layout-allow-overflow><img id="${id}-img" src="assets/${file}" alt="${esc(label)}"></div></div>`;
 const markup=`<template><style>${style}</style><div id="root" data-composition-id="${s.id}" data-width="1080" data-height="1920"><div id="${s.id}-head" class="head"><div class="title">${s.title}</div><div class="sub">${s.sub}</div><div id="${s.id}-line" class="under"></div></div>${photo(s.id+'-a',l.a,pic[0],pic[1],1)}${photo(s.id+'-b',l.b,pic[2],pic[3],2)}<img id="${s.id}-cat" class="cat" src="assets/${s.cat}" alt="Expressive cat sticker" style="left:${l.cat[0]}px;top:${l.cat[1]}px;width:${l.cat[2]}px;height:${l.cat[3]}px"><div id="${s.id}-flash" class="flash"></div></div><script>
const tl=gsap.timeline({paused:true});${i?`tl.fromTo('#${s.id}-head',{opacity:0,scale:.94},{opacity:1,scale:1,duration:.27,ease:'back.out(1.25)'},0);`:''}
tl.fromTo('#${s.id}-line',{scaleX:0},{scaleX:1,duration:.28,ease:'power3.out'},.22);
tl.fromTo('#${s.id}-a',{opacity:0,x:${i%2?-130:130},y:20,rotation:${l.a[4]*3}},{opacity:1,x:0,y:0,rotation:${l.a[4]},duration:.45,ease:'power4.out'},.12);
tl.fromTo('#${s.id}-b',{opacity:0,y:100,scale:.78,rotation:${-l.b[4]*2}},{opacity:1,y:0,scale:1,rotation:${l.b[4]},duration:.40,ease:'back.out(1.25)'},.66);
tl.fromTo('#${s.id}-cat',{opacity:0,y:50,scale:.75},{opacity:1,y:0,scale:1,duration:.40,ease:'back.out(1.6)'},.34);
${s.length>3?`tl.to('#${s.id}-a-img',{scale:1.12,duration:.24,ease:'power3.out'},${r(Math.min(1.65,s.length*.5))});`:''}
${s.length>4?`tl.to('#${s.id}-b',{rotation:${-l.b[4]/2},duration:.22,ease:'power2.inOut'},${r(s.length*.63)});`:''}
${i%3===0?`tl.set('#${s.id}-flash',{opacity:.30},.65);tl.to('#${s.id}-flash',{opacity:0,duration:.10},.66);`:''}
window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;</script></template>`;
 writeFileSync(new URL(`${folder}/${s.id}.html`,import.meta.url),markup);
});
const phrases=[
 'Planning a Vietnam trip','between October and December?',
 'Here’s something to know','before you pack:','the weather can feel','very different','from north to south.',
 'In Northern Vietnam,','Hanoi usually starts','to feel cooler in autumn.',
 'It’s a lovely time','to wander the Old Quarter,','stop for coffee','and explore with your camera.',
 'By December,','pack layers and a jacket —','and warmer clothing','if you’re heading to the mountains.',
 'In Central Vietnam,','places like Huế,','Đà Nẵng and Hội An','can see heavy rain','and storms','during the later months','of the year.',
 'Keep your plans flexible,','and have a café','or indoor activity in mind.',
 'Rain can continue into December,','so check the forecast','before you go.',
 'In Southern Vietnam,','it stays warm.','You may still see showers','in October and November,','while December generally','brings drier weather.',
 'Wherever you’re going,','check the local forecast','close to your trip.',
 'And if Hanoi','is on your list,','save a little time','to slow down,','explore its streets','and capture the moments','in between.',
 'Save this','for your Vietnam trip.'
];
let cursor=0;const entries=phrases.map((p,i)=>{const start=text.indexOf(p,cursor);if(start<0)throw Error('Caption missing '+p);cursor=start+p.length;return {id:`group${i}`,text:p,start:a.character_start_times_seconds[start],end:a.character_end_times_seconds[cursor-1],words:[...p.matchAll(/\S+/g)].map((m,j)=>({id:`g${i}w${j}`,text:m[0],start:a.character_start_times_seconds[start+m.index],end:a.character_end_times_seconds[start+m.index+m[0].length-1]}))};});
const captionHtml=entries.map((e,i)=>{const end=Math.min(entries[i+1]?entries[i+1].start-.025:duration,e.end+.10);return `<div id="${e.id}" class="clip group" data-start="${r(Math.max(0,e.start-.02))}" data-duration="${r(end-Math.max(0,e.start-.02))}"><div id="${e.id}-inner" class="line">${e.words.map(w=>`<span id="${w.id}">${esc(w.text)}</span>`).join(' ')}</div></div>`;}).join('\n');
const capTweens=entries.map(e=>`tl.fromTo('#${e.id}-inner',{scale:.94,y:9},{scale:1,y:0,duration:.15,ease:'power3.out'},${r(Math.max(0,e.start-.02))});${e.words.map(w=>`tl.set('#${w.id}',{backgroundColor:'#ae2a1d',color:'#fff',webkitTextStrokeWidth:'0px'},${r(w.start)});tl.set('#${w.id}',{backgroundColor:'transparent',color:'#1c1c1c',webkitTextStrokeWidth:'6px'},${r(w.end)});`).join('')}`).join('\n');
writeFileSync(new URL(`${folder}/captions-v02.html`,import.meta.url),`<template><style>#root{position:absolute;inset:0}.group{position:absolute;left:105px;top:1190px;width:850px;text-align:center;overflow:visible}.line{font:900 58px/1.18 Arial,sans-serif;letter-spacing:-1px}.line span{display:inline-block;padding:2px 8px;border-radius:8px;color:#1c1c1c;-webkit-text-stroke:6px white;paint-order:stroke fill;white-space:nowrap}</style><div id="root" data-composition-id="captionsv2" data-width="1080" data-height="1920">${captionHtml}</div><script>const tl=gsap.timeline({paused:true});${capTweens}window.__timelines=window.__timelines||{};window.__timelines.captionsv2=tl;</script></template>`);
const hosts=scenes.map(s=>`<div id="${s.id}" class="clip" data-composition-id="${s.id}" data-composition-src="${folder}/${s.id}.html" data-start="${r(s.start)}" data-duration="${s.length}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`).join('\n');
const sounds=scenes.flatMap((s,i)=>[
 `<audio id="v2popA${i}" class="clip" src="assets/sfx/pop.wav" data-start="${r(s.start+.12)}" data-duration=".22" data-track-index="5" data-volume=".09"></audio>`,
 `<audio id="v2popB${i}" class="clip" src="assets/sfx/${i%3===0?'shutter':'pop'}.wav" data-start="${r(s.start+.66)}" data-duration="${i%3===0?'.16':'.22'}" data-track-index="6" data-volume=".07"></audio>`,
 i%3===0?`<audio id="v2swoosh${i}" class="clip" src="assets/sfx/whoosh.wav" data-start="${r(Math.max(0,s.start-.1))}" data-duration=".32" data-track-index="7" data-volume=".10"></audio>`:''
]).join('\n');
writeFileSync(new URL('index.html',import.meta.url),`<!doctype html><html lang="en"><head><meta charset="utf-8"><script src="assets/gsap.min.js"></script><style>*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#f4f3f0;font-family:Arial,sans-serif}#root{position:relative;width:1080px;height:1920px;overflow:hidden}.paper{position:absolute;inset:0;background:url('assets/paper-blank.png') center/cover}.brand{position:absolute;top:183px;right:125px;font-weight:900;font-size:28px;color:#ae2a1d;letter-spacing:1px}</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="1080" data-height="1920"><div class="paper"></div><div class="brand">TRAVELFRAME</div>${hosts}<div id="captionsv2" class="clip" data-composition-id="captionsv2" data-composition-src="${folder}/captions-v02.html" data-start="0" data-duration="${duration}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920"></div><audio id="voice" class="clip" src="assets/adam-voice.mp3" data-start="0" data-duration="${old.voiceEnd}" data-track-index="3" data-volume="1"></audio><audio id="music" class="clip" src="assets/original-music.wav" data-start="0" data-duration="${duration}" data-track-index="4" data-volume=".12" data-fade-in=".6" data-fade-out="1.8"></audio>${sounds}</main><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>`);
writeFileSync(new URL('timeline-v02.json',import.meta.url),JSON.stringify({duration,scenes,captionGroups:entries.length,photoFrames:scenes.length*2,uniquePhotos:new Set(pictures.flatMap(x=>[x[0],x[2]])).size},null,2));
console.log(JSON.stringify({scenes:scenes.length,photoFrames:scenes.length*2,uniquePhotos:new Set(pictures.flatMap(x=>[x[0],x[2]])).size,captionGroups:entries.length}));
