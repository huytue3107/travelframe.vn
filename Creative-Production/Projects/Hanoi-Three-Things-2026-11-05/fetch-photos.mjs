import {writeFile,readFile} from 'node:fs/promises';
const photos = [
 {id:32871412,file:'egg-coffee.jpg',photographer:'Sóc Năng Động',url:'https://www.pexels.com/photo/close-up-of-vietnamese-egg-coffee-on-a-wooden-table-32871412/',context:'Vietnamese egg coffee close-up; dish illustration, not a specific Hanoi venue.'},
 {id:31567118,file:'street-cafe.jpg',photographer:'Quý Nguyễn',url:'https://www.pexels.com/photo/charming-hanoi-street-with-l-etage-cafe-view-31567118/',context:'Hanoi street and balcony cafe; no venue recommendation or access guarantee.'},
 {id:28751876,file:'balcony-cafe.jpg',photographer:'tuan nguyen',url:'https://www.pexels.com/photo/charming-hanoi-cafe-exterior-on-a-balcony-28751876/',context:'Hanoi cafe balcony exterior.'},
 {id:35542948,file:'lake-bridge.jpg',photographer:'Ama Journey',url:'https://www.pexels.com/photo/scenic-view-of-hoan-kiem-lake-bridge-in-hanoi-35542948/',context:'People walking on the bridge at Hoan Kiem Lake.'},
 {id:30000236,file:'coffee-break.jpg',photographer:'Felix Young',url:'https://www.pexels.com/photo/woman-enjoying-coffee-on-urban-balcony-30000236/',context:'Stock model having a coffee in Hanoi. Not a TravelFrame customer or testimonial.'},
 {id:29245149,file:'lake-walk.jpg',photographer:'Dang Hong',url:'https://www.pexels.com/photo/young-woman-walking-by-hoan-kiem-lake-in-hanoi-29245149/',context:'Stock portrait at Hoan Kiem Lake. Not a TravelFrame customer.'}
];
for(const photo of photos) {
 const response=await fetch(`https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=1400`);
 if(!response.ok) throw Error(`${photo.id}: HTTP ${response.status}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(!response.headers.get('content-type')?.startsWith('image/')) throw Error('Expected image');
 await writeFile(new URL(`assets/${photo.file}`,import.meta.url),bytes);
 Object.assign(photo,{license:'https://www.pexels.com/license/',checked:'2026-11-05',bytes:bytes.length});
 console.log(`${photo.file}: ${bytes.length} bytes`);
}
const register=JSON.parse(await readFile(new URL('assets/asset-register.json',import.meta.url)));
await writeFile(new URL('assets/asset-register.json',import.meta.url),JSON.stringify([...register,...photos],null,2));
