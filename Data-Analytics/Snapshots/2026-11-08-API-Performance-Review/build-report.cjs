const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const deps = '/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const folder = path.resolve(__dirname, '../../Reports');
const stem = '2026-11-08-TravelFrame-Website-Meta-API-Review';
const load = name => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
const ga = load('ga4.json').reports;
const meta = load('meta-initial.json').results;
const weekly = load('meta-weekly.json');
const host = 'travelframe.sidevn.com';
const colors = { ink:'#142c41', blue:'#1b5a76', mist:'#b6c6d2', orange:'#be673c', mute:'#506573', rule:'#dde5e9' };
const {ink, blue, mist, orange, mute, rule} = colors;
const fmt = n => Number(n).toLocaleString('vi-VN', {maximumFractionDigits:1});
const esc = x => String(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const text = (x,y,s,{size=14,fill=ink,weight=400,anchor='start'}={}) =>
  '<text x="'+x+'" y="'+y+'" fill="'+fill+'" font-size="'+size+'" font-weight="'+weight+'" text-anchor="'+anchor+'">'+esc(s)+'</text>';
const line = (x1,y1,x2,y2,stroke=rule,dash='') =>
  '<line x1="'+x1+'" x2="'+x2+'" y1="'+y1+'" y2="'+y2+'" stroke="'+stroke+'" '+(dash?'stroke-dasharray="'+dash+'"':'')+'/>';
const rect = (x,y,w,h,fill,rx=0) =>
  '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" rx="'+rx+'"/>';
const chart = (title,sub,draw,footer) =>
  '<figure class="chart"><svg viewBox="0 0 570 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(title)+'">'
  +text(24,33,title,{size:20,weight:700})+text(24,57,sub,{size:12,fill:mute})+draw
  +line(24,292,546,292)+text(24,315,footer,{size:11,fill:mute})+'</svg></figure>';

function igWeek() {
  const metrics = (name) => Object.fromEntries(weekly[name].data.data.map(m=>[m.name,m.total_value.value]));
  const prev=metrics('previous_week'), cur=metrics('week');
  const keys=[['reach','Reach'],['views','Views'],['saves','Saves'],['shares','Shares'],['website_clicks','Bấm website']];
  const x=133,w=219;
  let draw=line(x+w,78,x+w,273,mute,'4 4')+text(x+w,86,'100',{size:11,fill:mute,anchor:'middle'});
  keys.forEach(([key,label],i)=>{
    const y=103+33*i,ratio=cur[key]/prev[key], change=(ratio-1)*100;
    draw += text(24,y+15,label,{size:14})+rect(x,y,w*ratio,20,blue,3)
      +text(x+w+13,y+15,(change<0?'−':'+')+fmt(Math.abs(change))+'%',{size:12,weight:700})
      +text(547,y+15,fmt(prev[key])+' → '+fmt(cur[key]),{size:12,fill:mute,anchor:'end'});
  });
  return chart('01 / Instagram: giảm trên cả 5 chỉ số','Hai kỳ truy vấn 7 ngày · giá trị kỳ trước = 100',draw,'Đường dọc: mốc kỳ trước. Cột phải: số tuyệt đối trước → mới.');
}
function igDay() {
  const d=meta.reach_daily.data.data[0].values.filter(x=>x.end_time.slice(0,10)>='2026-10-25'&&x.end_time.slice(0,10)<='2026-11-07');
  const left=55,right=540,base=250;
  const px=i=>left+i*(right-left)/(d.length-1), py=n=>base-154*n/10000;
  let draw='';
  [0,3000,6000,9000].forEach(n=>{draw+=line(left,py(n),right,py(n))+text(left-8,py(n)+4,fmt(n),{size:10,anchor:'end',fill:mute});});
  draw+=line((px(6)+px(7))/2,92,(px(6)+px(7))/2,250,mute,'4 4');
  draw+='<polyline points="'+d.map((v,i)=>px(i)+','+py(v.value)).join(' ')+'" fill="none" stroke="'+blue+'" stroke-width="3"/>';
  d.forEach((v,i)=>{
    const x=px(i),y=py(v.value),day=v.end_time.slice(8,10)+'/'+v.end_time.slice(5,7);
    draw+='<circle cx="'+x+'" cy="'+y+'" r="4" fill="'+blue+'"><title>'+esc(day+' · '+fmt(v.value)+' reach')+'</title></circle>';
    if (i%2===0||i===d.length-1) draw+=text(x,271,day,{size:10,fill:mute,anchor:'middle'});
    if ([0,7,12,13].includes(i)) draw+=text(x,y-10,fmt(v.value),{size:11,anchor:'middle',weight:700});
  });
  return chart('02 / Reach theo ngày đo của Meta','25/10–07/11 · trục ngang là ngày kết thúc bucket',draw,'Ngày Meta chốt 14:00 ICT đến 01/11; từ 02/11 chốt 15:00 ICT.');
}
function sessions() {
  const weeks=[['25–31/10','previous_week'],['01–07/11','week']].map(([label,key])=>{
    const total=ga[key+'_overview'].rows[0].sessions;
    const retained=ga[key+'_site_non_dev'].rows[0].sessions;
    return {label,total,retained,excluded:total-retained};
  });
  const x=30,w=456, scale=w/Math.max(...weeks.map(x=>x.total));
  let draw='';
  weeks.forEach(({label,total,retained,excluded},i)=>{
    const y=107+i*83;
    draw+=text(x,y-10,label,{weight:700})+rect(x,y,scale*retained,31,blue)
      +rect(x+scale*retained,y,scale*excluded,31,orange)
      +text(x+scale*retained/2,y+21,fmt(retained),{fill:'#fff',anchor:'middle',weight:700})
      +text(x+scale*(retained+excluded/2),y+21,fmt(excluded),{fill:'#fff',anchor:'middle',weight:700})
      +text(x+scale*total+10,y+21,fmt(total),{weight:700});
  });
  draw+=rect(30,253,12,12,blue,2)+text(49,264,'Phần còn lại sau lọc',{size:12})
    +rect(247,253,12,12,orange,2)+text(266,264,'Lưu lượng kỹ thuật đã tách',{size:12});
  return chart('03 / Website: tổng phiên giảm, sau lọc tăng','GA4 · cùng hai tuần lịch ICT · số phiên',draw,'Tách hostname và nguồn test đã nhận diện. Phần còn lại vẫn có thể lẫn nội bộ.');
}
function booking() {
  const values=(key,p) => ga[key+'_pages'].rows.find(x=>x.hostName===host&&x.pagePath===p)?.screenPageViews??0;
  const rows=['/booking','/booking/details','/booking/payment'].map(p=>[p,values('previous_week',p),values('week',p)]);
  const max=Math.max(...rows.flatMap(([,a,b])=>[a,b])), x=173, w=320;
  let draw='';
  rows.forEach(([p,a,b],i)=>{
    const y=104+i*54;
    draw+=text(24,y+12,p,{size:12})+rect(x,y-3,w*a/max,15,mist,2)+rect(x,y+16,w*b/max,15,blue,2)
      +text(x+w*a/max+8,y+9,fmt(a),{size:12})+text(x+w*b/max+8,y+28,fmt(b),{size:12,weight:700});
  });
  draw+=rect(24,263,11,11,mist,2)+text(42,273,'25–31/10',{size:12,fill:mute})
    +rect(166,263,11,11,blue,2)+text(184,273,'01–07/11',{size:12,fill:mute});
  return chart('04 / Trang booking: các điểm đo đi khác hướng','GA4 · lượt xem trên hostname website',draw,'Từng đường dẫn được đếm riêng; các hàng không tạo thành phễu người dùng.');
}

const style = [
  '*{box-sizing:border-box}body{margin:0;background:#e9eff2;color:#233b4d;font:15px/1.58 system-ui,Arial,sans-serif}',
  'main{max-width:1240px;margin:auto;background:#fff;padding:0 48px 40px}header{background:#142c41;color:white;margin:0 -48px;padding:40px 48px 34px}',
  '.kicker{font-size:12px;letter-spacing:.16em;color:#bad7e2;font-weight:700}h1{font-size:clamp(28px,4vw,43px);line-height:1.12;letter-spacing:-.025em;margin:16px 0 9px}',
  'header p{margin:0;color:#dcecf1;font-size:16px}h2{font-size:25px;line-height:1.2;margin:40px 0 13px;padding-top:14px;border-top:2px solid #c9dce5;color:#142c41}',
  'h3{font-size:19px;margin:30px 0 9px;color:#194a62}p,li{max-width:1100px}li{margin-bottom:6px}a{color:#155c76;overflow-wrap:anywhere}',
  'code{font-size:.92em;background:#eef3f5;padding:1px 4px;border-radius:3px;overflow-wrap:anywhere}.table-wrap{overflow-x:auto;margin:12px 0 18px}',
  'table{width:100%;border-collapse:collapse;font-size:13px;line-height:1.45;min-width:640px}th,td{padding:10px 11px;border-bottom:1px solid #e1e7eb;vertical-align:top}',
  'th{background:#23495f;color:white;font-weight:650;text-align:left}tr:nth-child(even){background:#f4f7f9}td[align=right]{font-variant-numeric:tabular-nums}',
  '#charts{display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#eef3f5;padding:14px;margin:19px 0 25px;border-radius:9px}',
  '.chart{margin:0;background:#fff;border:1px solid #d9e4eb;border-radius:7px}.chart svg{display:block;width:100%;height:auto;font-family:system-ui,Arial,sans-serif;font-variant-numeric:tabular-nums}',
  'footer{margin-top:32px;padding-top:14px;border-top:1px solid #dae5eb;color:#506573;font-size:12px}',
  '@media(max-width:780px){main{padding:0 18px 24px}header{margin:0 -18px;padding:29px 18px}#charts{grid-template-columns:1fr;padding:8px}h2{font-size:22px}}',
  '@media print{body{background:#fff}main{max-width:none;padding:0}header{margin:0;padding:15px;color:#142c41;background:#f0f4f6}header p,.kicker{color:#415b6b}table{min-width:0;font-size:10px}tr,.chart{break-inside:avoid}}'
].join('\n');

async function main() {
  const {marked} = await import(pathToFileURL(path.join(deps,'marked/lib/marked.esm.js')).href);
  const md = fs.readFileSync(path.join(folder,stem+'.md'),'utf8').replace(/^# .*?\n/,'');
  const charts = '<div id="charts">'+[igWeek(),igDay(),sessions(),booking()].join('')+'</div>';
  const article = marked.parse(md).replace('<!-- performance-charts -->',charts)
    .replace(/<table>/g,'<div class="table-wrap"><table>').replace(/<\/table>/g,'</table></div>');
  const html = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
    +'<title>TravelFrame · Website và Meta API · 08/11/2026</title><style>'+style+'</style></head><body><main>'
    +'<header><div class="kicker">TRAVELFRAME / BẢN ĐỐI CHIẾU API / 08.11.2026</div><h1>Hiệu quả website và Meta</h1>'
    +'<p>Instagram giảm độ phủ theo tuần. Website có thêm phiên sau khi loại lưu lượng kiểm thử nhận diện được.</p></header>'
    +article+'<footer>Data-Analytics · Meta Graph API, GA4 Data API và tracker nội bộ · Các kỳ và giới hạn đo ghi ở từng bảng.</footer></main></body></html>';
  const doc=path.join(folder,stem+'.html');
  fs.writeFileSync(doc,html+'\n');
  const {chromium}=require(path.join(deps,'playwright'));
  const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1040},deviceScaleFactor:1.5});
    await page.route('https://**/*',route=>route.abort());
    await page.route('http://**/*',route=>route.abort());
    await page.goto(pathToFileURL(doc).href);
    await page.locator('#charts').screenshot({path:path.join(folder,stem+'-Charts.png')});
    const measure=()=>page.evaluate(()=>({
      sections:[...document.querySelectorAll('h2')].map(x=>x.textContent),
      tables:document.querySelectorAll('table').length,
      funnelRows:document.querySelector('table tbody').rows.length,
      chartCount:document.querySelectorAll('#charts svg').length,
      pageOverflow:document.documentElement.scrollWidth>innerWidth,
      outOfBoundsChartText:[...document.querySelectorAll('#charts svg text')].filter(e=>{
        const a=e.getBoundingClientRect(), b=e.ownerSVGElement.getBoundingClientRect();
        return a.left<b.left-1||a.right>b.right+1||a.top<b.top-1||a.bottom>b.bottom+1;
      }).map(x=>x.textContent)
    }));
    const desktop=await measure();
    await page.setViewportSize({width:390,height:844});
    const mobile=await measure();
    fs.writeFileSync(path.join(__dirname,'layout-check.json'),JSON.stringify({desktop,mobile},null,2)+'\n');
    console.log(JSON.stringify({desktop,mobile}));
    for(const r of [desktop,mobile]) if(r.sections.length!==6||r.funnelRows!==8||r.chartCount!==4||r.pageOverflow||r.outOfBoundsChartText.length) process.exitCode=1;
  } finally {await browser.close();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
