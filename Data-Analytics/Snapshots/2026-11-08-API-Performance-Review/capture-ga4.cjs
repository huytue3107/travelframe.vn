const fs = require('node:fs');
const path = require('node:path');
const { homedir } = require('node:os');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const property = 'properties/552867189';
const host = 'travelframe.sidevn.com';
const detail = process.argv.includes('--detail');
const client = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(homedir(), '.config/travelframe/ga4-service-account.json'),
  fallback: 'rest',
});
const output = { source: 'GA4 Data API', property, capture_started_at_utc: new Date().toISOString(), reports: {} };
const dates = { week: ['2026-11-01','2026-11-07'], previous_week: ['2026-10-25','2026-10-31'], day: ['2026-11-07','2026-11-07'], previous_day: ['2026-11-06','2026-11-06'], week_ago_day: ['2026-10-31','2026-10-31'] };
const rolls = { cutoff08: ['2026-11-07','2026-11-08'], cutoff07: ['2026-11-06','2026-11-07'], cutoff01: ['2026-10-31','2026-11-01'] };
const tasks = [];
const base = ['activeUsers','sessions','screenPageViews','keyEvents'];
const sf = (fieldName, matchType, value) => ({ filter: { fieldName, stringFilter: {matchType,value,caseSensitive:false} } });
const and = (...expressions) => ({ andGroup: { expressions } });
const knownHost = sf('hostName','EXACT',host);
const knownDevSource = sf('sessionSourceMedium','PARTIAL_REGEXP','localhost|127[.]0[.]0[.]1|tagassistant');
const hostNonDevSource = and(knownHost,{notExpression:knownDevSource});
function collect(name, range, dims, metrics, dimensionFilter, notes) {
  tasks.push(async () => {
    const start = new Date().toISOString();
    const request = { property,dateRanges:[{startDate:range[0],endDate:range[1]}],
      dimensions:dims.map(name=>({name})),metrics:metrics.map(name=>({name})),limit:500,
      ...(dimensionFilter?{dimensionFilter}:{}) };
    try {
      const [r] = await client.runReport(request, {timeout:25000});
      output.reports[name] = { request, requested_at_utc:start, received_at_utc:new Date().toISOString(),
        metadata:r.metadata, row_count:r.rowCount, notes,
        rows:(r.rows||[]).map(x=>Object.fromEntries([
          ...dims.map((k,i)=>[k,x.dimensionValues[i].value]),
          ...metrics.map((k,i)=>[k,Number(x.metricValues[i].value)]),
        ])) };
    } catch (err) {
      output.reports[name] = {request,requested_at_utc:start,error:{code:err.code??null,message:String(err.message).replace(/([?&](?:access_token|key)=)[^&\s]+/gi,'$1[REDACTED]').slice(0,600)}};
    }
  });
}
if (!detail) {
for (const [name,range] of Object.entries(dates)) {
  collect(name+'_overview',range,[],base);
  collect(name+'_hosts',range,['hostName'],['sessions','screenPageViews','activeUsers']);
  collect(name+'_sources',range,['hostName','sessionSourceMedium'],['sessions','screenPageViews']);
  collect(name+'_pages',range,['hostName','pagePath'],['screenPageViews','activeUsers']);
  collect(name+'_events',range,['hostName','eventName'],['eventCount','totalUsers','totalRevenue']);
  if (name.includes('week') && !name.includes('day')) {
    collect(name+'_site_non_dev',range,[],base,hostNonDevSource,'Removes only detected test source strings, not all internal traffic');
  }
}
collect('daily_all',['2026-10-25','2026-11-07'],['date'],base);
collect('daily_site_non_dev',['2026-10-25','2026-11-07'],['date'],base,hostNonDevSource);
for (const [name,range] of Object.entries(rolls)) {
  const [a,b]=range.map(d=>d.replaceAll('-',''));
  const expr='^(?:'+a+'(?:08[3-5][0-9]|(?:09|1[0-9]|2[0-3])[0-5][0-9])|'+b+'(?:(?:0[0-7])[0-5][0-9]|08[0-2][0-9]))$';
  const minute = sf('dateHourMinute','FULL_REGEXP',expr);
  collect(name+'_overview',range,[],base,minute,'GA4 reporting timezone; event-minute window [08:30,08:30); late processing can update counts');
  collect(name+'_booking_pages',range,['hostName','pagePath'],['screenPageViews','activeUsers'],and(minute,sf('pagePath','FULL_REGEXP','^/booking(?:/.*)?$')));
  collect(name+'_event_dates',range,['date','eventName'],['eventCount'],and(minute,sf('eventName','EXACT','session_start')));
}
} else {
  collect('conversion_event_origin',dates.week,['dateHour','hostName','pagePath','eventName','sessionSourceMedium'],['eventCount','totalUsers','totalRevenue'],sf('eventName','FULL_REGEXP','^(?:form_submit|generate_lead|purchase)$'));
  for (const [name,range] of [['week',dates.week],['previous_week',dates.previous_week]]) {
    collect(name+'_site_booking_sources',range,['pagePath','sessionSourceMedium'],['screenPageViews','activeUsers'],and(knownHost,sf('pagePath','FULL_REGEXP','^/booking(?:/.*)?$')));
  }
}
async function main() {
  let cursor=0;
  await Promise.all(Array.from({length:5},async()=>{while(cursor<tasks.length)await tasks[cursor++]();}));
  output.capture_completed_at_utc=new Date().toISOString();
  fs.writeFileSync(path.join(__dirname,detail?'ga4-detail.json':'ga4.json'),JSON.stringify(output,null,2)+'\n');
  const report=Object.entries(output.reports);
  console.log(JSON.stringify({success:report.filter(([,v])=>!v.error).length,
    errors:report.filter(([,v])=>v.error).map(([k,v])=>[k,v.error]),
    overview:Object.fromEntries(report.filter(([k])=>detail||k.endsWith('_overview')||k.endsWith('_site_non_dev')).map(([k,v])=>[k,{timezone:v.metadata?.timeZone,rows:v.rows}]))},null,2));
  await client.close();
  if (detail?report.some(([,v])=>v.error):!output.reports.week_overview?.rows?.length) process.exitCode=1;
}
main().catch(e=>{console.error(e.code||e.name);process.exitCode=1;});
