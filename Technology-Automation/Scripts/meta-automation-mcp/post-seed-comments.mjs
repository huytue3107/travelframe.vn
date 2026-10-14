// Đăng seed comment từ file JSON. Mặc định DRY-RUN; thêm --live để đăng thật.
// JSON: [{"platform":"fb"|"ig","id":"<post_id|media_id>","text":"..."}]
// Dùng: node post-seed-comments.mjs plan.json [--live] [--delay=1800]
import fs from "node:fs";
import { execSync } from "node:child_process";
const [file, ...flags] = process.argv.slice(2);
const live = flags.includes("--live");
const delay = Number((flags.find(f=>f.startsWith("--delay="))||"--delay=5").split("=")[1]);
const V = process.env.META_GRAPH_VERSION || "v25.0";
const kc = (a,s)=>{try{return execSync(`security find-generic-password -a "${a}" -s "${s}" -w 2>/dev/null`,{encoding:"utf8"}).trim()}catch{return ""}};
const token = kc("travelframe-page-access","travelframe-meta-automation-token");
if (!token) throw new Error("No token in Keychain");
const H = {Authorization:`Bearer ${token}`};
const PAGE = process.env.TRAVELFRAME_PAGE_ID || "1409099405611405";
const pt = (await (await fetch(`https://graph.facebook.com/${V}/${PAGE}?fields=access_token`,{headers:H})).json()).access_token;
const items = JSON.parse(fs.readFileSync(file,"utf8"));
for (const [i,it] of items.entries()) {
  if (!live) { console.log(`DRY ${i+1}/${items.length} ${it.platform} ${it.id}: ${it.text}`); continue; }
  const tok = it.platform==="fb" ? (pt||token) : token;
  const r = await fetch(`https://graph.facebook.com/${V}/${it.id}/comments`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${tok}`},body:JSON.stringify({message:it.text})});
  const j = await r.json();
  console.log(`${j.id?"OK ":"ERR"} ${i+1}/${items.length} ${it.platform} ${it.id} ${j.id||j.error?.message}`);
  if (j.error) break;
  await new Promise(r=>setTimeout(r,delay*1000));
}
