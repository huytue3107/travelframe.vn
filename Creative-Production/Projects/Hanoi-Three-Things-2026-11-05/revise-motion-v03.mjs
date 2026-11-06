import {readFileSync,writeFileSync} from 'node:fs';

const root=new URL('./',import.meta.url);
const timeline=JSON.parse(readFileSync(new URL('timeline-v02.json',root)));
const fps=30,bpm=108,quarter=60/bpm/4;
// Finite, held poses: four changes per musical beat, giving 7.2 pose changes/sec.
// Each pose is [x, y, rotation, scaleX, scaleY]. No smooth interpolation or timers.
const profiles={
 shock:[[0,1,-5,1.03,.97],[6,-4,5,.98,1.03],[-6,-10,-6,1,1.04],[4,-3,4,1,1],[0,1,5,1.03,.97],[-6,-5,-5,.98,1.03],[6,-10,6,1,1.04],[-4,-3,-4,1,1]],
 hungry:[[0,2,-3,1.05,.94],[-5,-2,0,1.02,.98],[-7,-8,4,.97,1.04],[-3,-4,2,1,1],[0,2,3,1.05,.94],[5,-2,0,1.02,.98],[7,-8,-4,.97,1.04],[3,-4,-2,1,1]],
 laugh:[[0,2,-3,1.04,.95],[1,-4,3,1.01,1],[3,-11,5,.98,1.03],[0,-4,1,1,1],[0,2,3,1.04,.95],[-1,-4,-3,1.01,1],[-3,-11,-5,.98,1.03],[0,-4,-1,1,1]],
 scream:[[0,1,-6,1.03,.97],[6,-6,7,1,1.02],[-6,-16,-7,.98,1.04],[4,-5,4,1,1],[0,1,6,1.03,.97],[-6,-6,-7,1,1.02],[6,-16,7,.98,1.04],[-4,-5,-4,1,1]],
 love:[[0,1,-3,1.03,.97],[-3,-4,-2,1,1],[0,-10,3,.99,1.03],[3,-4,2,1,1],[0,1,3,1.03,.97],[3,-4,2,1,1],[0,-10,-3,.99,1.03],[-3,-4,-2,1,1]],
 excited:[[0,2,-4,1.04,.94],[-5,-8,-3,1,1],[0,-18,5,.98,1.04],[5,-8,3,1,1],[0,2,4,1.04,.94],[5,-8,3,1,1],[0,-18,-5,.98,1.04],[-5,-8,-3,1,1]],
 sideeye:[[-8,0,-4,1.02,.99],[-8,0,-4,1.02,.99],[-3,-3,-1,1,1],[4,-2,3,1,1],[8,0,4,1.02,.99],[8,0,4,1.02,.99],[3,-3,1,1,1],[-4,-2,-3,1,1]],
 cool:[[-7,1,-5,1.03,.98],[-3,-3,-3,1,1],[3,-7,2,.99,1.02],[7,-3,5,1,1],[7,1,5,1.03,.98],[3,-3,3,1,1],[-3,-7,-2,.99,1.02],[-7,-3,-5,1,1]],
 happycry:[[0,2,-3,1.04,.96],[-4,-3,-2,1,1],[-2,-12,4,.99,1.03],[3,-4,2,1,1],[0,2,3,1.04,.96],[4,-3,2,1,1],[2,-12,-4,.99,1.03],[-3,-4,-2,1,1]]
};
const num=n=>Number(n.toFixed(6));
const events=[];
for(let n=0;n*quarter<timeline.duration;n++){
 const frame=Math.round(n*quarter*fps);
 events.push({quarterIndex:n,frame,time:frame/fps,phase:n%8});
}
const records=[];
for(const [index,scene] of timeline.scenes.entries()){
 const name=scene.cat.match(/meme-cat-(.+)\.png$/)?.[1];
 if(!profiles[name])throw Error('Unknown cat reaction '+scene.cat);
 const url=new URL(`compositions/${scene.id}.html`,root);
 let source=readFileSync(url,'utf8');
 source=source.replace(/\/\* MEME_REACTION_START \*\/[\s\S]*?\/\* MEME_REACTION_END \*\//g,'');
 source=source.replace(/\/\* STOPMOTION_START \*\/[\s\S]*?\/\* STOPMOTION_END \*\//g,'');
 // Remove the old smooth cat-only entrance while retaining photo/title motion.
 source=source.replace(new RegExp(`tl\\.fromTo\\('#${scene.id}-cat'[^\\n]*;\\r?\\n?`,'g'),'');
 const selector=`#${scene.id}-cat`,keys=[];
 const add=(time,props,kind)=>{keys.push({time:num(time),props,kind});};
 add(0,{transformOrigin:'50% 100%',x:0,y:0,rotation:0,scaleX:1,scaleY:1,opacity:index===0?1:0},'initial');
 if(index!==0){
  add(6/fps,{opacity:1,scaleX:.78,scaleY:.84,y:16,rotation:-7},'entrance');
  add(10/fps,{scaleX:1.06,scaleY:1.04,y:-8,rotation:4},'entrance');
  add(14/fps,{scaleX:1,scaleY:1,y:0,rotation:0},'entrance');
 }
 const sceneEnd=scene.start+scene.length;
 const settleAt=scene.length-(index===timeline.scenes.length-1?.34:.10);
 for(const beat of events){
  const local=beat.time-scene.start;
  if(local<(index===0?0:.50)||local>=settleAt)continue;
  const [x,y,rotation,scaleX,scaleY]=profiles[name][beat.phase];
  const props={opacity:1,x,y,rotation,scaleX,scaleY};
  add(Math.max(0,local-.00001),props,'beat-pose');
  keys[keys.length-1].globalFrame=beat.frame;
  keys[keys.length-1].quarterIndex=beat.quarterIndex;
 }
 add(num(settleAt),{x:0,y:0,rotation:0,scaleX:1,scaleY:1,opacity:1},'settle');
 keys.sort((a,b)=>a.time-b.time);
 if(keys.some(k=>k.time<0||k.time>=scene.length))throw Error('Keyframe outside scene '+scene.id);
 const code=keys.map(k=>`tl.set('${selector}',${JSON.stringify(k.props)},${k.time});`).join('\n');
 const marker=`/* STOPMOTION_START */\n${code}\n/* STOPMOTION_END */\n`;
 if(!source.includes('window.__timelines='))throw Error('Timeline registration not found');
 source=source.replace('window.__timelines=',marker+'window.__timelines=');
 writeFileSync(url,source);
 records.push({scene:scene.id,cat:name,start:scene.start,end:sceneEnd,length:scene.length,poses:keys});
}
writeFileSync(new URL('motion-v03.json',root),JSON.stringify({version:'v03',fps,bpm,musicPhaseSeconds:0,poseChangesPerSecond:bpm/60*4,beats:events,scenes:records},null,2));
writeFileSync(new URL('timeline-v03.json',root),JSON.stringify({...timeline,version:'v03',catMotion:'Beat-synchronized stepped GIF/stop-motion poses',bpm},null,2));
console.log(JSON.stringify({scenes:records.length,catVariants:Object.keys(profiles).length,bpm,poseChangesPerSecond:bpm/60*4,finitePoseKeys:records.reduce((n,s)=>n+s.poses.length,0)}));
