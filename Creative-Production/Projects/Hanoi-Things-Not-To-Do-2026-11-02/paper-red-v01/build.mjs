import { readFileSync, writeFileSync } from 'node:fs';

const scenes = [
  {start:0,end:2.322,title:'5 THINGS YOU<br>SHOULDN’T DO',sub:'IN HANOI',image:'old-quarter.jpg',cat:'cat-surprised.png'},
  {start:2.322,end:7.245,title:'DON’T ORDER<br>VIETNAMESE COFFEE',sub:'ONE CUP IS NEVER ENOUGH',image:'coffee.jpg',cat:'cat-cream.png'},
  {start:7.245,end:12.608,title:'DON’T WANDER<br>THE OLD QUARTER',sub:'YOU MIGHT GET LOST IN TIME',image:'old-quarter.jpg',cat:'cat.png'},
  {start:12.608,end:18.982,title:'DON’T STOP<br>FOR PHO',sub:'YOU’LL WANT ANOTHER BOWL',image:'pho.jpg',cat:'cat-chubby.png'},
  {start:18.982,end:24.509,title:'DON’T WALK AROUND<br>HOAN KIEM LAKE',sub:'YOUR CAMERA ROLL IS AT RISK',image:'lake.jpg',cat:'cat-surprised.png'},
  {start:24.509,end:31.985,title:'DON’T EXPLORE<br>WITH A LOCAL',sub:'UNLESS YOU WANT YOUR OWN STORY',image:'bridge.jpg',cat:'cat-cream.png'},
  {start:31.985,end:35.7,title:'MAKE HANOI<br>YOUR STORY',sub:'MESSAGE TRAVELFRAME',image:'old-quarter.jpg',cat:'cat-chubby.png'}
];
const phrases=[
  'Five things you shouldn\'t do in Hanoi.',
  'First, don\'t order Vietnamese coffee.', 'One cup can easily become a daily ritual.',
  'Second, don\'t wander the Old Quarter.', 'You might lose track of time in its little streets.',
  'Third, don\'t stop for pho.', 'Before you finish,', "you'll already be thinking about your next bowl.",
  "Fourth, don't take a walk around Hoan Kiem Lake.", 'Your camera roll may never recover.',
  "And finally, don't explore Hanoi", 'with a local photographer,', 'unless you want to take home', 'a story that feels like yours.',
  'Message TravelFrame to plan your photo walk.'
];
const a=JSON.parse(readFileSync(new URL('assets/adam-alignment.json',import.meta.url))).alignment;
const script=a.characters.join('');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let cursor=0;
const captions=phrases.map((phrase,i)=>{
  const index=script.indexOf(phrase,cursor);
  if(index<0) throw new Error(`Narration phrase missing: ${phrase}`);
  cursor=index+phrase.length;
  const start=Math.max(0,a.character_start_times_seconds[index]-.04);
  const end=a.character_end_times_seconds[cursor-1]+.08;
  return `<div id="cap${i}" class="clip cap-wrap" data-start="${start.toFixed(3)}" data-duration="${(end-start).toFixed(3)}" data-track-index="2"><div class="caption">${esc(phrase)}</div></div>`;
}).join('\n');
const visuals=scenes.map((s,i)=>`<section id="scene${i}" class="clip scene" data-start="${s.start}" data-duration="${(s.end-s.start).toFixed(3)}" data-track-index="1"><div class="head"><div class="title">${s.title}</div><div class="sub">${s.sub}</div></div><div class="photo"><img src="assets/${s.image}" alt=""></div><img class="cat" src="assets/${s.cat}" alt=""><div class="symbol">${i===0?'?':i===6?'♥':'!'}</div></section>`).join('\n');
const pops=scenes.map((s,i)=>`<audio id="pop${i}" class="clip" src="assets/sfx/pop.mp3" data-start="${(s.start+.24).toFixed(3)}" data-duration=".7" data-track-index="5" data-volume=".18"></audio>`).join('\n');
const whooshes=scenes.slice(1).map((s,i)=>`<audio id="whoosh${i}" class="clip" src="assets/sfx/whoosh-short.mp3" data-start="${(s.start-.15).toFixed(3)}" data-duration=".55" data-track-index="6" data-volume=".10"></audio>`).join('\n');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><script src="assets/gsap.min.js"></script><style>
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Arial,sans-serif;background:#f4f3f0}#root,.scene{position:absolute;inset:0;width:1080px;height:1920px;overflow:hidden}.paper{position:absolute;inset:0;background-image:url('assets/paper-source.png');background-size:100% 800%;background-position:center bottom}.brand{position:absolute;top:180px;right:115px;color:#ae2a1d;font-size:26px;letter-spacing:1px;font-weight:900}.head{position:absolute;left:80px;top:292px;width:920px;text-align:center}.title{color:#ae2a1d;-webkit-text-stroke:5px #151515;paint-order:stroke fill;font-size:70px;line-height:1.12;font-weight:1000;letter-spacing:-1px}.sub{font-size:35px;line-height:1.15;font-weight:900;color:#171717;margin-top:19px}.photo{position:absolute;left:490px;top:615px;width:416px;height:460px;background:white;border:14px solid white;border-radius:5px;transform:rotate(5deg);box-shadow:0 7px 18px #0003;overflow:hidden}.photo img{width:100%;height:100%;object-fit:cover}.cat{position:absolute;left:105px;top:700px;width:450px;height:485px;object-fit:contain;object-position:bottom}.symbol{position:absolute;left:192px;top:590px;font-weight:900;font-size:110px;color:#151515;-webkit-text-stroke:11px white;paint-order:stroke fill;transform:rotate(-12deg)}.cap-wrap{position:absolute;left:130px;top:1190px;width:820px;text-align:center}.caption{display:inline-block;color:white;background:#181818ed;font-weight:750;font-size:39px;line-height:1.22;padding:13px 22px;border-radius:10px}.footer{position:absolute;top:1540px;left:0;width:100%;text-align:center;font-size:25px;color:#777;font-weight:700;letter-spacing:2px}
</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="35.7" data-width="1080" data-height="1920"><div class="paper"></div><div class="brand">TRAVELFRAME</div>${visuals}${captions}<div class="footer">A LITTLE HANOI STORY</div><audio id="voice" class="clip" src="assets/adam-voice.mp3" data-start="0" data-duration="34.55" data-track-index="3" data-volume="1"></audio><audio id="music" class="clip" src="assets/music-temp.mp3" data-start="0" data-duration="35.7" data-track-index="4" data-volume=".12" data-fade-in=".7" data-fade-out="1.8"></audio>${pops}${whooshes}</main><script>window.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});const starts=${JSON.stringify(scenes.map(s=>s.start))};starts.forEach((t,i)=>{let s='#scene'+i;if(i)tl.fromTo(s+' .head',{opacity:0,y:-35,scale:.94},{opacity:1,y:0,scale:1,duration:.34,ease:'power3.out'},t);tl.fromTo(s+' .photo',{opacity:0,x:90,rotation:12},{opacity:1,x:0,rotation:5,duration:.48,ease:'back.out(1.2)'},t+.12);tl.fromTo(s+' .cat',{opacity:0,y:80,scale:.87},{opacity:1,y:0,scale:1,duration:.50,ease:'back.out(1.4)'},t+.27);tl.fromTo(s+' .symbol',{opacity:0,scale:.5},{opacity:1,scale:1,duration:.28,ease:'back.out(1.4)'},t+.50)});window.__timelines.main=tl;</script></body></html>`;
writeFileSync(new URL('index.html',import.meta.url),html);
