import {readFileSync,writeFileSync,existsSync} from 'node:fs';

const root=new URL('./',import.meta.url);
const names=['shock','hungry','laugh','hungry','sideeye','scream','excited','love','sideeye','love','excited','happycry','scream','sideeye','laugh','shock','cool','happycry'];
const positions=[
 {left:70,top:795,width:390,height:360},
 {left:80,top:820,width:380,height:325},
 {left:610,top:800,width:315,height:345}
];
const timeline=JSON.parse(readFileSync(new URL('timeline.json',root)));
for(const name of new Set(names))if(!existsSync(new URL(`assets/meme-cat-${name}.png`,root)))throw Error('Missing meme cat: '+name);

timeline.scenes.forEach((scene,i)=>{
 const file=new URL(`compositions/${scene.id}.html`,root),name=names[i],p=positions[i%3];
 let source=readFileSync(file,'utf8');
 const cat=new RegExp(`<img\\b[^>]*id="${scene.id}-cat"[^>]*>`);
 if(!cat.test(source))throw Error('Cat image not found: '+scene.id);
 source=source.replace(cat,tag=>tag
  .replace(/src="[^"]+"/,`src="assets/meme-cat-${name}.png"`)
  .replace(/alt="[^"]*"/,`alt="Expressive ${name} cat meme sticker"`)
  .replace(/style="[^"]*"/,`style="left:${p.left}px;top:${p.top}px;width:${p.width}px;height:${p.height}px"`));
 source=source.replace(/\/\* MEME_REACTION_START \*\/[\s\S]*?\/\* MEME_REACTION_END \*\//g,'');
 let reaction='';
 if(name==='shock'||name==='scream')reaction=`tl.to('#${scene.id}-cat',{rotation:-7,duration:.10,ease:'power2.out'},.90);tl.to('#${scene.id}-cat',{rotation:6,duration:.10,ease:'power2.inOut'},1.00);tl.to('#${scene.id}-cat',{rotation:0,duration:.14,ease:'power2.out'},1.10);`;
 if(name==='hungry')reaction=`tl.to('#${scene.id}-cat',{scale:1.07,y:-8,duration:.16,ease:'back.out(1.3)'},1.05);tl.to('#${scene.id}-cat',{scale:1,y:0,duration:.18,ease:'power2.out'},1.21);`;
 if(name==='laugh'||name==='happycry')reaction=`tl.to('#${scene.id}-cat',{y:-10,rotation:4,duration:.12,ease:'power2.out'},.88);tl.to('#${scene.id}-cat',{y:0,rotation:0,duration:.17,ease:'power2.out'},1.00);`;
 if(name==='sideeye')reaction=`tl.to('#${scene.id}-cat',{rotation:-6,x:8,duration:.20,ease:'power3.out'},1.05);`;
 if(name==='cool')reaction=`tl.to('#${scene.id}-cat',{scale:1.06,rotation:-3,duration:.25,ease:'power3.out'},1.12);`;
 if(name==='love')reaction=`tl.to('#${scene.id}-cat',{scale:1.06,y:-6,duration:.22,ease:'power3.out'},1.00);`;
 if(name==='excited')reaction=`tl.to('#${scene.id}-cat',{y:-16,rotation:5,duration:.12,ease:'power2.out'},.90);tl.to('#${scene.id}-cat',{y:0,rotation:0,duration:.20,ease:'back.out(1.25)'},1.02);`;
 source=source.replace('window.__timelines=',`/* MEME_REACTION_START */${reaction}/* MEME_REACTION_END */\nwindow.__timelines=`);
 writeFileSync(file,source);
 scene.cat=`meme-cat-${name}.png`;
});
writeFileSync(new URL('timeline-v02.json',root),JSON.stringify({...timeline,version:'v02',catVariants:new Set(names).size},null,2));
console.log(JSON.stringify({scenes:names.length,newCatVariants:new Set(names).size,version:'v02'}));
