import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const project = path.dirname(fileURLToPath(import.meta.url));
const faces = `/* FONTS_V04_START */
@font-face{font-family:'HeritageDisplay';src:url('assets/fonts/HeritageDisplay-Regular.woff2') format('woff2');font-style:normal;font-weight:400;font-display:block}
@font-face{font-family:'Montserrat';src:url('assets/fonts/Montserrat-ExtraBold.ttf') format('truetype');font-style:normal;font-weight:800;font-display:block}
@font-face{font-family:'Montserrat';src:url('assets/fonts/Montserrat-Black.ttf') format('truetype');font-style:normal;font-weight:900;font-display:block}
/* FONTS_V04_END */`;
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const stripTags = value => value.replace(/<[^>]+>/g,'');
const evidence = [];

function revise(file, transform) {
  const target = path.join(project,file);
  const before = fs.readFileSync(target,'utf8');
  const scripts = html => [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>m[0]).join('\n');
  let after = before.replace(/\/\* FONTS_V04_START \*\/[\s\S]*?\/\* FONTS_V04_END \*\//g,'');
  after = transform(after).replace('<style>','<style>'+faces);
  if (scripts(before) !== scripts(after)) throw new Error('Unexpected motion/script change: '+file);
  fs.writeFileSync(target,after);
  evidence.push({file,scriptSha256:hash(scripts(after)),sha256:hash(after)});
}

for(let i=1;i<=18;i++) {
  revise(`compositions/hanoi${i}.html`, html => html
    .replace(/font-family:Arial,sans-serif/g,"font-family:'Montserrat',sans-serif")
    .replace(/\.title\{[^}]*\}/, ".title{font-family:'HeritageDisplay',sans-serif;font-size:72px;line-height:1.18;font-weight:400;font-synthesis:none;letter-spacing:0;color:#ae2a1d;-webkit-text-stroke:2px #161616;paint-order:stroke fill}"));
}
revise('compositions/captions.html', html => html.replace('font:900 58px/1.18 Arial,sans-serif',"font:900 58px/1.18 'Montserrat',sans-serif"));
revise('index.html', html => html.replace(/font-family:Arial,sans-serif/g,"font-family:'Montserrat',sans-serif"));

const timeline = JSON.parse(fs.readFileSync(path.join(project,'timeline-v03.json'),'utf8'));
timeline.version='v04';
timeline.typography={headings:'HeritageDisplay Regular',headingSize:72,headingStroke:2,description:'Montserrat ExtraBold 800',captions:'Montserrat Black 900',captionSize:58};
fs.writeFileSync(path.join(project,'timeline-v04.json'),JSON.stringify(timeline,null,2)+'\n');

const manifest = {
  revision:'v04',status:'Review',owner:'Creative-Production',
  titleFamily:'HeritageDisplay',bodyFamily:'Montserrat',
  headingSize:72,headingWeight:400,descriptionSize:30,descriptionWeight:800,captionSize:58,captionWeight:900,
  fontSources:[
    {file:'assets/fonts/HeritageDisplay-Regular.woff2',source:'Creative-Production/Assets/Fonts/HeritageDisplay/HeritageDisplay-Regular.woff2',provenance:'User-supplied reconstructed display font. See bundled HeritageDisplay-README.md.'},
    {file:'assets/fonts/Montserrat-ExtraBold.ttf',source:'/Users/macbook/Library/Fonts/#9Slide03 Montserrat ExtraBold.ttf',license:'Embedded name-table license: SIL Open Font License 1.1'},
    {file:'assets/fonts/Montserrat-Black.ttf',source:'/Users/macbook/Library/Fonts/#9Slide03 Montserrat Black.ttf',license:'Embedded name-table license: SIL Open Font License 1.1'}
  ].map(item=>({...item,sha256:hash(fs.readFileSync(path.join(project,item.file)))})),
  compositions:evidence,
  titles:Array.from({length:18},(_,index)=>{
    const html=fs.readFileSync(path.join(project,`compositions/hanoi${index+1}.html`),'utf8');
    return {scene:index+1,title:stripTags(html.match(/class="title">(.*?)<\/div>/)[1].replace(/<br>/g,' / '))};
  }),
  priorSourceArchive:'source-v03.zip',
  changes:'Typography only. Existing scripts, cat motion, scene times, captions, photographs and audio retained.'
};
fs.writeFileSync(path.join(project,'fonts-v04.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({updated:evidence.length,headingFont:manifest.titleFamily,bodyFont:manifest.bodyFamily}));
