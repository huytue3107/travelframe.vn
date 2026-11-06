import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=new URL('./',import.meta.url);
const a=JSON.parse(readFileSync(new URL('assets/adam-alignment.json',root))).alignment;
const text=a.characters.join('');
const request=JSON.parse(readFileSync(new URL('adam-request.json',root)));
if(text!==request.text) throw Error('Voice alignment does not match the supplied script');
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','json',fileURLToPath(new URL('assets/adam-voice.mp3',root))]));
const voiceEnd=Number(probe.format.duration),duration=Math.ceil((voiceEnd+1.3)*30)/30;
const r=n=>Number(n.toFixed(3));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const folder='compositions';mkdirSync(new URL(folder+'/',root),{recursive:true});

// Each shot starts on the corresponding spoken phrase, using character-level alignment.
const shots=[
 ['Only have time','HANOI:<br>ONLY 3 THINGS?','Food. Coffee. A little wandering.','pho.jpg','lake.jpg','cat-surprised.png'],
 ['First,','01 /<br>EAT LOCAL.','Find a little neighbourhood spot.','pho.jpg','old-quarter.jpg','cat-chubby.png'],
 ['Start your morning','A WARM BOWL.<br>A GOOD START.','Phở for the morning.','pho.jpg','street-cafe.jpg','cat-cream.png'],
 ['or try bún chả','LUNCH PLANS?<br>BÚN CHẢ.','Grilled pork, noodles, fresh herbs.','bun-cha.jpg','pho.jpg','cat-chubby.png'],
 ['Take your time,','SLOW BITES.<br>STREET VIEWS.','Watch Hanoi happen around you.','old-quarter.jpg','bun-cha.jpg','cat.png'],
 ['and enjoy','THE LITTLE<br>DETAILS COUNT.','Take it all in.','street-cafe.jpg','cathedral.jpg','cat-cream.png'],
 ['Second,','02 /<br>COFFEE TIME.','A Vietnamese coffee pause.','coffee.jpg','balcony-cafe.jpg','cat-sun.png'],
 ['Try an egg coffee,','EGG COFFEE?<br>YES, PLEASE.','A little cup of Hanoi.','egg-coffee.jpg','coffee.jpg','cat-chubby.png'],
 ['and find a seat','PICK A SEAT.<br>WATCH HANOI.','Your favourite coffee. A street view.','coffee-break.jpg','street-cafe.jpg','cat.png'],
 ['Sometimes','A BREAK IS<br>PART OF THE TRIP.','Pause. Sip. Look around.','balcony-cafe.jpg','egg-coffee.jpg','cat-cream.png'],
 ['And third,','03 /<br>EXPLORE ON FOOT.','The scenic route starts here.','lake-bridge.jpg','old-quarter.jpg','cat-surprised.png'],
 ['Walk around','HOÀN KIẾM<br>LAKE WALKS.','Start by the water.','lake.jpg','lake-bridge.jpg','cat.png'],
 ['then wander','NEXT:<br>THE OLD QUARTER.','Let curiosity lead.','old-quarter.jpg','street-cafe.jpg','cat-sun.png'],
 ['Look up','LOOK UP.<br>PEEK DOWN THE ALLEYS.','Balconies above. Little lanes below.','balcony-cafe.jpg','old-quarter.jpg','cat-surprised.png'],
 ['and let yourself','TAKE THE<br>SCENIC ROUTE.','Leave room for a little wandering.','cathedral.jpg','lake-walk.jpg','cat-cream.png'],
 ['Want to be','YOU.<br>IN THE FRAME.','Your own Hanoi story.','couple.jpg','lake-walk.jpg','cat-chubby.png'],
 ['Explore Hanoi','YOUR DAY.<br>YOUR HANOI STORY.','With a local photographer.','hanoi-portrait.jpg','coffee-break.jpg','cat.png'],
 ['Save this','SAVE THIS<br>FOR YOUR HANOI TRIP.','Eat local. Sip slowly. Wander more.','bun-cha.jpg','egg-coffee.jpg','cat-chubby.png']
];
let shotCursor=0;
const scenes=shots.map((s,i)=>{
 const index=text.indexOf(s[0],shotCursor);if(index<0)throw Error('Missing shot phrase '+s[0]);shotCursor=index+s[0].length;
 return {id:`hanoi${i+1}`,start:i===0?0:r(Math.max(0,a.character_start_times_seconds[index]-.035)),title:s[1],sub:s[2],images:[s[3],s[4]],cat:s[5]};
});
scenes.forEach((s,i)=>s.length=r((scenes[i+1]?.start??duration)-s.start));

const layouts=[
 {a:[335,595,540,365,-4],b:[495,845,385,275,6],cat:[92,825,355,335]},
 {a:[115,590,540,370,4],b:[570,825,345,285,-5],cat:[100,860,345,300]},
 {a:[360,580,510,355,-4],b:[180,840,430,280,5],cat:[640,850,270,310]}
];
const crop={'egg-coffee.jpg':'50% 68%','coffee.jpg':'50% 65%','street-cafe.jpg':'50% 35%','balcony-cafe.jpg':'50% 55%','coffee-break.jpg':'50% 32%','lake-walk.jpg':'50% 27%','couple.jpg':'50% 32%','portrait.jpg':'50% 28%'};
const style=`#root{position:absolute;inset:0;font-family:Arial,sans-serif}.head{position:absolute;left:90px;top:270px;width:870px;text-align:center}.title{font-size:65px;line-height:1.10;font-weight:900;letter-spacing:-1.1px;color:#ae2a1d;-webkit-text-stroke:4px #161616;paint-order:stroke fill}.sub{font-size:30px;font-weight:800;margin-top:18px;line-height:1.15;color:#202020}.under{margin:18px auto 0;width:140px;height:7px;background:#ae2a1d;transform-origin:left center}.photo{position:absolute;padding:13px;background:white;box-shadow:0 8px 18px #0003;border-radius:3px}.window{height:100%;overflow:hidden}.window img{width:100%;height:100%;object-fit:cover;display:block}.tape{position:absolute;top:-12px;left:35%;width:30%;height:27px;background:#e4d9b7c9;z-index:2}.cat{position:absolute;object-fit:contain;object-position:bottom;z-index:5}.flash{position:absolute;inset:0;background:white;z-index:8;pointer-events:none;opacity:0}`;
scenes.forEach((s,i)=>{
 const l=layouts[i%3];
 const photo=(id,arr,file,z)=>`<div id="${id}" class="photo" data-layout-allow-overlap style="left:${arr[0]}px;top:${arr[1]}px;width:${arr[2]}px;height:${arr[3]}px;z-index:${z}"><div class="tape"></div><div class="window" data-layout-allow-overflow><img id="${id}-img" src="assets/${file}" alt="${esc(file.replace('.jpg','').replaceAll('-',' '))}" style="object-position:${crop[file]??'50% 50%'}"></div></div>`;
 const html=`<template><style>${style}</style><div id="root" data-composition-id="${s.id}" data-width="1080" data-height="1920"><div id="${s.id}-head" class="head"><div id="${s.id}-title" class="title">${s.title}</div><div id="${s.id}-sub" class="sub">${s.sub}</div><div id="${s.id}-line" class="under"></div></div>${photo(s.id+'-a',l.a,s.images[0],1)}${photo(s.id+'-b',l.b,s.images[1],2)}<img id="${s.id}-cat" class="cat" src="assets/${s.cat}" alt="Expressive cat sticker" style="left:${l.cat[0]}px;top:${l.cat[1]}px;width:${l.cat[2]}px;height:${l.cat[3]}px"><div id="${s.id}-flash" class="flash"></div></div><script>
const tl=gsap.timeline({paused:true});
${i?`tl.fromTo('#${s.id}-head',{scale:.94},{scale:1,duration:.27,ease:'back.out(1.25)'},0);`:''}
tl.fromTo('#${s.id}-line',{scaleX:0},{scaleX:1,duration:.28,ease:'power3.out'},.22);
${i?`tl.fromTo('#${s.id}-a',{opacity:0,x:${i%2?-130:130},y:20,rotation:${l.a[4]*3}},{opacity:1,x:0,y:0,rotation:${l.a[4]},duration:.45,ease:'power4.out'},.12);`:`tl.set('#${s.id}-a',{rotation:${l.a[4]}},0);`}
tl.fromTo('#${s.id}-b',{opacity:0,y:100,scale:.78,rotation:${-l.b[4]*2}},{opacity:1,y:0,scale:1,rotation:${l.b[4]},duration:.40,ease:'back.out(1.25)'},.66);
${i?`tl.fromTo('#${s.id}-cat',{opacity:0,y:50,scale:.75},{opacity:1,y:0,scale:1,duration:.40,ease:'back.out(1.6)'},.34);`:''}
${s.length>3?`tl.to('#${s.id}-a-img',{scale:1.12,duration:.24,ease:'power3.out'},${r(Math.min(1.65,s.length*.5))});`:''}
${s.length>4?`tl.to('#${s.id}-b',{rotation:${-l.b[4]/2},duration:.22,ease:'power2.inOut'},${r(s.length*.63)});`:''}
${[0,6,10,15,16].includes(i)?`tl.set('#${s.id}-flash',{opacity:.30},.65);tl.to('#${s.id}-flash',{opacity:0,duration:.10},.66);`:''}
window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;</script></template>`;
 writeFileSync(new URL(`${folder}/${s.id}.html`,root),html);
});

const phrases=[
 'Only have time','for three things in Hanoi?','Here’s how I’d spend it.',
 'First, find a little','local food spot.',
 'Start your morning','with a warm bowl','of phở,','or try bún chả','for lunch.',
 'Take your time,','watch the street outside,','and enjoy the little','details around you.',
 'Second, stop for','Vietnamese coffee.',
 'Try an egg coffee,','or order your favourite','and find a seat','where you can watch','Hanoi go by.',
 'Sometimes the best part','of exploring','is taking a break.',
 'And third,','discover the city on foot.',
 'Walk around Hoàn Kiếm Lake,','then wander into','the Old Quarter.',
 'Look up at','the old balconies,','peek down the little alleys,','and let yourself take','the scenic route.',
 'Want to be','in the photos too?',
 'Explore Hanoi','with a local photographer','and take home memories','of your day.',
 'Save this','for your Hanoi trip.'
];
let cursor=0;
const captions=phrases.map((p,i)=>{
 const start=text.indexOf(p,cursor);if(start<0)throw Error('Missing caption '+p);
 if(text.slice(cursor,start).trim()) throw Error('Uncaptioned speech before '+p);
 cursor=start+p.length;
 return {id:`group${i}`,text:p,start:a.character_start_times_seconds[start],end:a.character_end_times_seconds[cursor-1],words:[...p.matchAll(/\S+/g)].map((m,j)=>({id:`g${i}w${j}`,text:m[0],start:a.character_start_times_seconds[start+m.index],end:a.character_end_times_seconds[start+m.index+m[0].length-1]}))};
});
if(text.slice(cursor).trim())throw Error('Uncaptioned final words');
const captionHtml=captions.map((e,i)=>{
 const start=r(Math.max(0,e.start-.02));
 const end=r(Math.min(captions[i+1]?captions[i+1].start-.025:duration,e.end+.10));
 if(end<=start)throw Error('Invalid caption interval');
 return `<div id="${e.id}" class="clip group" data-start="${start}" data-duration="${r(end-start)}"><div id="${e.id}-inner" class="line">${e.words.map(w=>`<span id="${w.id}">${esc(w.text)}</span>`).join(' ')}</div></div>`;
}).join('\n');
const capTweens=captions.map(e=>`tl.fromTo('#${e.id}-inner',{scale:.94,y:9},{scale:1,y:0,duration:.15,ease:'power3.out'},${r(Math.max(0,e.start-.02))});${e.words.map(w=>`tl.set('#${w.id}',{backgroundColor:'#ae2a1d',color:'#fff',webkitTextStrokeWidth:'0px'},${r(w.start)});tl.set('#${w.id}',{backgroundColor:'transparent',color:'#1c1c1c',webkitTextStrokeWidth:'6px'},${r(w.end)});`).join('')}`).join('\n');
writeFileSync(new URL(`${folder}/captions.html`,root),`<template><style>#root{position:absolute;inset:0}.group{position:absolute;left:105px;top:1190px;width:850px;text-align:center;overflow:visible}.line{font:900 58px/1.18 Arial,sans-serif;letter-spacing:-1px}.line span{display:inline-block;padding:2px 8px;border-radius:8px;color:#1c1c1c;-webkit-text-stroke:6px white;paint-order:stroke fill;white-space:nowrap}</style><div id="root" data-composition-id="captions" data-width="1080" data-height="1920">${captionHtml}</div><script>const tl=gsap.timeline({paused:true});${capTweens}window.__timelines=window.__timelines||{};window.__timelines.captions=tl;</script></template>`);
const hosts=scenes.map(s=>`<div id="${s.id}" class="clip" data-composition-id="${s.id}" data-composition-src="${folder}/${s.id}.html" data-start="${s.start}" data-duration="${s.length}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>`).join('\n');
const sounds=scenes.flatMap((s,i)=>[
 `<audio id="popA${i}" class="clip" src="assets/sfx/pop.wav" data-start="${r(s.start+.12)}" data-duration=".22" data-track-index="5" data-volume=".09"></audio>`,
 `<audio id="popB${i}" class="clip" src="assets/sfx/${[0,6,10,15,16].includes(i)?'shutter':'pop'}.wav" data-start="${r(s.start+.66)}" data-duration="${[0,6,10,15,16].includes(i)?'.16':'.22'}" data-track-index="6" data-volume=".07"></audio>`,
 [1,6,10,15,17].includes(i)?`<audio id="swoosh${i}" class="clip" src="assets/sfx/whoosh.wav" data-start="${r(Math.max(0,s.start-.1))}" data-duration=".32" data-track-index="7" data-volume=".10"></audio>`:''
]).join('\n');
writeFileSync(new URL('index.html',root),`<!doctype html><html lang="en"><head><meta charset="utf-8"><script src="assets/gsap.min.js"></script><style>*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#f4f3f0;font-family:Arial,sans-serif}#root{position:relative;width:1080px;height:1920px;overflow:hidden}.paper{position:absolute;inset:0;background:url('assets/paper-blank.png') center/cover}.brand{position:absolute;top:183px;right:125px;font-weight:900;font-size:28px;color:#ae2a1d;letter-spacing:1px}</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="1080" data-height="1920"><div class="paper"></div><div class="brand">TRAVELFRAME</div>${hosts}<div id="captions" class="clip" data-composition-id="captions" data-composition-src="${folder}/captions.html" data-start="0" data-duration="${duration}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920"></div><audio id="voice" class="clip" src="assets/adam-voice.mp3" data-start="0" data-duration="${voiceEnd}" data-track-index="3" data-volume="1"></audio><audio id="music" class="clip" src="assets/original-music.wav" data-start="0" data-duration="${duration}" data-track-index="4" data-volume=".12" data-fade-in=".6" data-fade-out="1.8"></audio>${sounds}</main><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>`);
const stats={duration,voiceEnd,scenes,captionGroups:captions.length,photoFrames:scenes.length*2,uniquePhotos:new Set(scenes.flatMap(s=>s.images)).size};
writeFileSync(new URL('timeline.json',root),JSON.stringify(stats,null,2));
writeFileSync(new URL('captions.json',root),JSON.stringify(captions,null,2));
const stamp=t=>new Date(Math.round(t*1000)).toISOString().slice(11,23).replace('.',',');
writeFileSync(new URL('captions.srt',root),captions.map((e,i)=>`${i+1}\n${stamp(e.start)} --> ${stamp(e.end)}\n${e.text}\n`).join('\n'));
console.log(JSON.stringify({duration,voiceEnd,scenes:scenes.length,photoFrames:stats.photoFrames,uniquePhotos:stats.uniquePhotos,captionGroups:captions.length}));
