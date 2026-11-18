import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const address = '127.0.0.1';
const port = 4178;
const host = `${address}:${port}`;
const origin = `http://${host}`;
const liveDashboard = new URL('../../Data-Analytics/Dashboards/TravelFrame-Website-Meta-Live-Dashboard.html', import.meta.url);
const metaMcp = fileURLToPath(new URL('../MCP/travelframe-readonly.mjs', import.meta.url));
const property = 'properties/552867189';
const streamId = '15726825662';
const site = 'travelframe.sidevn.com';
const pageId = '1409099405611405';
const igId = '17841438272497512';
const second = 1000;
const minute = 60 * second;
const day = 24 * 60 * minute;
const timeout = { timeout: 10 * second, retry: null };

const analytics = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || join(homedir(), '.config', 'travelframe', 'ga4-service-account.json'),
  fallback: 'rest',
});

const fields = (...names) => names.map(name => ({ name }));
const match = (fieldName, value, matchType = 'EXACT') => ({
  filter: { fieldName, stringFilter: { value, matchType, caseSensitive: false } },
});
const all = (...expressions) => ({ andGroup: { expressions } });
const exclude = notExpression => ({ notExpression });
const count = value => {
  if (value == null || value === '') return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
};
const values = row => row.metricValues.map(field => count(field.value));

// Cache only sanitized values. Concurrent tabs share a request and errors retain the last good read.
function cached(ttl, read) {
  let value = null;
  let checkedAt = null;
  let capturedAt = null;
  let expiresAt = 0;
  let pending;
  let error = false;
  return async () => {
    if (Date.now() >= expiresAt && !pending) {
      pending = (async () => {
        try {
          value = await read();
          capturedAt = new Date().toISOString();
          error = false;
        } catch {
          error = true;
        } finally {
          checkedAt = new Date().toISOString();
          expiresAt = Date.now() + (error ? Math.min(ttl, minute) : ttl);
          pending = undefined;
        }
      })();
    }
    await pending;
    return { value, capturedAt, checkedAt, refreshAfter: expiresAt, error };
  };
}

const websiteRealtime = cached(minute, async () => {
  const [report] = await analytics.runRealtimeReport({
    property,
    minuteRanges: [
      { name: 'last30', startMinutesAgo: 29, endMinutesAgo: 0 },
      { name: 'last5', startMinutesAgo: 4, endMinutesAgo: 0 },
    ],
    metrics: fields('activeUsers', 'screenPageViews'),
    dimensionFilter: match('streamId', streamId),
  }, timeout);

  const rows = new Map(report.rows.map(row => [row.dimensionValues[0].value, values(row)]));
  if (rows.size && !rows.has('last30')) throw new Error('Unexpected GA4 Realtime window');
  const last30 = rows.get('last30') ?? [0, 0];
  const last5 = rows.get('last5') ?? [0, 0];
  return { users30: last30[0] ?? null, views30: last30[1] ?? null, users5: last5[0] ?? null };
});

const siteTraffic = [
  match('hostName', site),
  exclude(match('pagePath', '/(en/)?(travelframe-admin|admin|login|user|node)(/.*)?', 'FULL_REGEXP')),
  exclude(match('sessionSourceMedium', 'localhost|127[.]0[.]0[.]1|0[.]0[.]0[.]0|tagassistant', 'PARTIAL_REGEXP')),
];
const bookingEvents = ['begin_booking', 'begin_checkout', 'generate_lead', 'purchase'];
const websiteToday = cached(5 * minute, async () => {
  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  const query = { property, dateRanges: [{ startDate: date, endDate: date }] };
  const [[report], [eventReport]] = await Promise.all([
    analytics.runReport({ ...query, metrics: fields('sessions', 'screenPageViews'), dimensionFilter: all(...siteTraffic) }, timeout),
    analytics.runReport({
      ...query,
      dimensions: fields('eventName'),
      metrics: fields('eventCount'),
      dimensionFilter: all(...siteTraffic, match('eventName', `^(${bookingEvents.join('|')})$`, 'FULL_REGEXP')),
    }, timeout),
  ]);
  if (report.metadata?.timeZone !== 'Asia/Saigon' && report.metadata?.timeZone !== 'Asia/Ho_Chi_Minh') {
    throw new Error('Unexpected reporting timezone');
  }
  const [sessions = null, views = null] = report.rows.length ? values(report.rows[0]) : [];
  const hasDayData = report.rows.length > 0 || eventReport.rows.length > 0;
  const events = Object.fromEntries(bookingEvents.map(name => [name, hasDayData ? 0 : null]));
  for (const row of eventReport.rows) events[row.dimensionValues[0].value] = values(row)[0];
  return { date, sessions, views, events };
});

async function openMeta() {
  const client = new Client({ name: 'travelframe-dashboard', version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['--use-system-ca', metaMcp],
    stderr: 'ignore',
    env: { META_GRAPH_VERSION: 'v26.0' },
  });
  try {
    await client.connect(transport, timeout);
    return client;
  } catch (error) {
    await client.close();
    throw error;
  }
}

async function metaRead(client, name, args = {}) {
  const result = await client.callTool({ name, arguments: args }, undefined, timeout);
  if (result.isError) throw new Error('Meta request failed');
  return JSON.parse(result.content[0].text);
}

function latestPost(payload, channel) {
  if (!Array.isArray(payload.data)) throw new Error('Missing Meta post list');
  const post = payload.data[0];
  if (!post) return null;
  const allowedHosts = channel === 'ig' ? ['www.instagram.com', 'instagram.com'] : ['www.facebook.com', 'facebook.com'];
  const link = URL.parse(post.permalink || post.permalink_url || '');
  const url = link?.protocol === 'https:' && allowedHosts.includes(link.hostname) ? link.origin + link.pathname : null;
  const rawDate = post.timestamp || post.created_time;
  return {
    title: (post.caption || post.message || 'Bài viết mới nhất').split('\n')[0].trim().slice(0, 128),
    publishedAt: new Date(rawDate).toISOString(),
    url,
    ...(channel === 'ig' ? { likes: count(post.like_count), comments: count(post.comments_count) } : { shares: count(post.shares?.count) }),
  };
}

const unix = date => String(Math.floor(date / second));
async function instagramInsights(client) {
  const now = Date.now();
  const history = await metaRead(client, 'get_instagram_insights', {
    metrics: 'reach', period: 'day', metric_type: 'time_series', since: unix(now - 4 * day), until: unix(now),
  });
  const ends = (history.data?.find(metric => metric.name === 'reach')?.values ?? [])
    .map(row => Date.parse(row.end_time)).filter(end => Number.isFinite(end) && end <= now);
  if (!ends.length) throw new Error('Missing Instagram day bucket');
  const end = Math.max(...ends);
  const start = end - day;
  const totals = await metaRead(client, 'get_instagram_insights', {
    metrics: 'reach,views,total_interactions,profile_views', period: 'day', metric_type: 'total_value',
    since: unix(start + second), until: unix(end),
  });
  const measures = Object.fromEntries(totals.data.map(metric => [metric.name, count(metric.total_value?.value)]));
  if (measures.reach == null || measures.views == null) throw new Error('Missing Instagram daily totals');
  return { start: new Date(start).toISOString(), end: new Date(end).toISOString(),
    reach: measures.reach, views: measures.views, interactions: measures.total_interactions ?? null, profileViews: measures.profile_views ?? null };
}

// Profile, posts and Insights may fail independently. Reuse the same local MCP connection within a refresh.
let metaBatch;
async function withMeta(read) {
  if (!metaBatch) metaBatch = { client: openMeta(), reads: 0 };
  const batch = metaBatch;
  batch.reads++;
  try {
    return await read(await batch.client);
  } finally {
    if (--batch.reads === 0) {
      metaBatch = undefined;
      await batch.client.then(client => client.close(), () => {});
    }
  }
}
const metaProfile = (id, name) => cached(5 * minute, () => withMeta(async client => {
  const profile = await metaRead(client, name);
  if (profile.id !== id || count(profile.followers_count) == null) throw new Error('Meta profile unavailable');
  return { followers: count(profile.followers_count) };
}));
const metaPost = (channel, name) => cached(5 * minute, () => withMeta(async client => {
  const payload = await metaRead(client, name, { limit: 1 });
  if (channel === 'fb' && payload.page_id !== pageId) throw new Error('Unexpected Facebook Page');
  return latestPost(payload, channel);
}));
const sources = {
  website: { realtime: websiteRealtime, today: websiteToday },
  meta: {
    instagram: metaProfile(igId, 'get_instagram_profile'),
    facebook: metaProfile(pageId, 'get_facebook_page_info'),
    igPost: metaPost('ig', 'list_instagram_media'),
    fbPost: metaPost('fb', 'list_facebook_page_posts'),
    insights: cached(5 * minute, () => withMeta(instagramInsights)),
  },
};

const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  if (request.headers.host !== host || (request.headers.origin && request.headers.origin !== origin) ||
      (request.url !== '/' && request.headers['sec-fetch-site'] === 'cross-site')) {
    response.writeHead(403).end();
    return;
  }
  if (request.method !== 'GET') {
    response.writeHead(405, { Allow: 'GET' }).end();
    return;
  }
  try {
    if (request.url === '/') {
      const html = await readFile(liveDashboard);
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Frame-Options': 'DENY' }).end(html);
      return;
    }
    const group = /^\/api\/realtime\/(website|meta)$/.exec(request.url)?.[1];
    if (!group) {
      response.writeHead(404).end();
      return;
    }
    const data = await Promise.all(Object.entries(sources[group]).map(async ([name, read]) => [name, await read()]));
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(Object.fromEntries(data)));
  } catch {
    response.writeHead(503).end();
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Cổng ${port} đang được sử dụng.` : 'Không mở được dashboard.');
  process.exitCode = 1;
});
server.listen(port, address, () => console.log(`TravelFrame Dashboard · ${origin}/`));
