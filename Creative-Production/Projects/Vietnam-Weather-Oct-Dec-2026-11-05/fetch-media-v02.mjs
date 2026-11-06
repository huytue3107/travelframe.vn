import {writeFileSync} from 'node:fs';
const assets=[
 [32979923,'hoi-an-street.jpg','Mare Collantes','https://www.pexels.com/photo/charming-streetscape-of-h-i-an-ancient-town-32979923/','Hoi An street'],
 [38190221,'hoi-an-river.jpg','Tuan Vy','https://www.pexels.com/photo/colorful-riverside-buildings-in-hoi-an-vietnam-38190221/','Hoi An riverside'],
 [33908279,'sapa-terraces.jpg','Son Hoa Nguyen','https://www.pexels.com/photo/stunning-rice-terraces-in-sapa-vietnam-33908279/','Sa Pa terraces; geography illustration, not December conditions'],
 [26619997,'saigon-river.jpg','Theodore Nguyen','https://www.pexels.com/photo/a-river-with-buildings-in-the-background-26619997/','Ho Chi Minh City skyline'],
 [33101039,'saigon-sunset.jpg','Felix Schickel','https://www.pexels.com/photo/stunning-ho-chi-minh-city-skyline-at-sunset-33101039/','Ho Chi Minh City sunset; not a forecast'],
 [16408712,'rain-detail.jpg','Darya Grey_Owl','https://www.pexels.com/photo/close-up-of-raindrops-on-umbrella-16408712/','Generic raindrops on umbrella; no geographic claim'],
 [9186152,'packing.jpg','Timur Weber','https://www.pexels.com/photo/packing-suitcase-for-traveling-9186152/','Generic travel packing'],
 [9185832,'warm-clothes.jpg','Timur Weber','https://www.pexels.com/photo/hands-of-a-woman-packing-clothes-into-a-suitcase-9185832/','Generic packing warm clothes']
];
const ledger=await Promise.all(assets.map(async([id,file,photographer,source,description])=>{
 const url=`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
 const r=await fetch(url);if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw Error(`Image ${id}: HTTP ${r.status}`);
 writeFileSync(new URL(`assets/${file}`,import.meta.url),Buffer.from(await r.arrayBuffer()));
 return {id,file,photographer,source,description,license:'Pexels Free License, source page checked 2026-11-05',download_url:url};
}));
writeFileSync(new URL('assets/new-photo-ledger-v02.json',import.meta.url),JSON.stringify(ledger,null,2));
console.log(`Downloaded ${ledger.length} photos without credentials.`);
