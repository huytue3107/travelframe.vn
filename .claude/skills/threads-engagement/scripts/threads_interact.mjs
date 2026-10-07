#!/usr/bin/env node
/**
 * TravelFrame Threads Community Engagement Runner
 * Part of skill: threads-engagement (Marketing-Growth)
 *
 * Value-first contextual comment engine:
 *   - Replies are selected from topic-specific local context pools.
 *   - Exact comments are not reused from recent history (last 60 interactions tracked).
 *   - Promotional CTAs and generic positivity are blocked.
 *   - English / International traveler focus support (--lang en).
 *
 * Pattern P-034 & 4-Tier Relevance Gate:
 *   - Tier 1: Strict Negative Exclusion (Filters out drama, affiliate, gifts, jobs, concerts, out-of-scope regions)
 *   - Tier 2: Core Topic Match (Hanoi autumn, Hanoi street food, Photo tours, Northern mountains, Solo travel, Budget)
 *   - Tier 3: Season & Inquiry Awareness (Accurate local advice)
 *   - Tier 4: Zero-Generic Quality Gate (Never comments on vague/general posts)
 *   - Anti-AI rules: Zero hyphens, no trailing emojis, slang enclosed in quotes ""
 *
 * Hybrid scan pipeline (DES-20260925-JEV-CONTENT-CLASSIFIER):
 *   - Tier 1 blacklist always runs first, deterministic, never overridden by the model.
 *   - JEV (jev-latest) classifies candidate posts (relevance, topic, lead, season)
 *     via typesafe_content_classifier.mjs.
 *   - Newsfeed Interaction Rule: in --mode feed, posts passing Tier 1 get natural
 *     interaction (Like always; Reply only with a verified contextual topic).
 *
 * Usage:
 *   node threads_interact.mjs --mode feed --duration 20 --lang en
 *   node threads_interact.mjs --mode search --query "hanoi photo" --duration 7 --lang en
 *   node threads_interact.mjs --mode single --url "https://www.threads.com/@user/post/xxx" --comment "..."
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PAGE_ID = '4c9a2fab-28f2-44d8-96d5-b6f108dc9404';
const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const LOG_FILE = path.resolve(process.cwd(), 'Marketing-Growth/Content/Threads-All-Interactions-Log.md');
const MINED_COMMENTS_FILE = path.resolve(process.cwd(), 'Research-Insights/Library/knowledge/threads-high-engagement-comments.json');
const TRIAGE_SCRIPT = path.resolve(process.cwd(), 'Technology-Automation/Scripts/typesafe_lead_triage.mjs');
const CLASSIFIER_SCRIPT = path.resolve(process.cwd(), 'Technology-Automation/Scripts/typesafe_content_classifier.mjs');
const JEV_CONF_GATE = 0.6;

const ANGLES = ['yeu_thich', 'nghi_ngo', 'tu_hoi', 'tich_cuc', 'clickbait'];
let currentAngleIndex = 0;
const OWN_HANDLES = new Set(['travelframe.vn']);
const AUTHOR_COOLDOWN_SIZE = 30;
const RECENT_COMMENT_HISTORY_SIZE = 60; // Increased to 60 to prevent cross-session repetition
const sessionCommentCounts = new Map();
const recentCommentTexts = new Set();
let lastSessionComment = '';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'feed',
    duration: 15,
    query: '',
    url: '',
    comment: '',
    angle: '',
    lang: 'all'
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode' && args[i + 1]) options.mode = args[++i];
    else if (args[i] === '--duration' && args[i + 1]) options.duration = parseInt(args[++i], 10);
    else if (args[i] === '--query' && args[i + 1]) options.query = args[++i];
    else if (args[i] === '--url' && args[i + 1]) options.url = args[++i];
    else if (args[i] === '--comment' && args[i + 1]) options.comment = args[++i];
    else if (args[i] === '--angle' && args[i + 1]) options.angle = args[++i];
    else if (args[i] === '--lang' && args[i + 1]) options.lang = args[++i];
  }
  return options;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runOrca(args) {
  try {
    const res = execFileSync(ORCA_ELECTRON, [ORCA_CLI, ...args], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
      timeout: 25000,
      encoding: 'utf8'
    });
    return res.trim();
  } catch (err) {
    return null;
  }
}

const seenUrls = new Set();
const seenAuthors = new Set();

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHandle(value) {
  return String(value || '').replace(/^@/, '').trim().toLowerCase();
}

function parseInteractionRows(logContent) {
  const rows = [];
  for (const line of String(logContent || '').split('\n')) {
    const match = line.match(
      /^\|\s*(\d+)\s*\|.*?\|\s*\[@([^\]]+)\]\([^)]*\)\s*\|\s*\[Xem bài\]\(([^)]+)\)\s*\|\s*([^|]*)\|\s*(.*?)\s*\|\s*$/
    );
    if (!match) continue;
    rows.push({
      index: Number(match[1]),
      author: normalizeHandle(match[2]),
      url: match[3],
      topic: match[4].trim(),
      comment: match[5].trim()
    });
  }
  return rows;
}

function loadInteractionHistory() {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    return parseInteractionRows(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

try {
  const history = loadInteractionHistory();
  for (const row of history) {
    seenUrls.add(row.url);
  }

  // Cooldown only applies to the most recent interactions
  for (const row of history.slice(-AUTHOR_COOLDOWN_SIZE)) {
    if (row.author) seenAuthors.add(row.author);
  }

  // Load last 60 comments to prevent repetition across sessions
  for (const row of history.slice(-RECENT_COMMENT_HISTORY_SIZE)) {
    const comment = normalizeText(row.comment);
    if (comment && !comment.startsWith('(like only')) {
      recentCommentTexts.add(comment);
    }
  }
} catch (e) {}

function loadMinedComments() {
  try {
    if (fs.existsSync(MINED_COMMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(MINED_COMMENTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveMinedComment(entry) {
  try {
    const list = loadMinedComments();
    const exists = list.some(item => item.author === entry.author && item.text === entry.text);
    if (!exists) {
      list.push(entry);
      fs.writeFileSync(MINED_COMMENTS_FILE, JSON.stringify(list, null, 2), 'utf8');
      console.log(`[Knowledge Mining] Learned & saved high-engagement comment by @${entry.author} (${entry.like_count} likes, motif: "${entry.reusable_motif}")`);
    }
  } catch (e) {
    console.error('Failed to save mined comment:', e.message);
  }
}

function logInteraction(author, url, comment, angle = 'Tự động', topic = 'Tương tác cộng đồng') {
  try {
    if (!fs.existsSync(LOG_FILE)) return;
    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    const rows = parseInteractionRows(logContent);
    const nextIndex = rows.reduce((max, row) => Math.max(max, row.index), 0) + 1;
    const safeComment = comment.replace(/\|/g, ', ').replace(/\n/g, ' ');
    const newLine = `| ${nextIndex} | Giai đoạn Tự động (Yếu tố: ${angle}) | [@${author}](https://www.threads.com/@${author}) | [Xem bài](${url}) | ${topic} | ${safeComment} |\n`;
    fs.writeFileSync(LOG_FILE, logContent.trim() + '\n' + newLine);
    seenUrls.add(url);
    seenAuthors.add(normalizeHandle(author));
    const normalizedComment = normalizeText(comment);
    if (normalizedComment && !normalizedComment.startsWith('(like only')) {
      recentCommentTexts.add(normalizedComment);
      sessionCommentCounts.set(
        normalizedComment,
        (sessionCommentCounts.get(normalizedComment) || 0) + 1
      );
      lastSessionComment = normalizedComment;
    }
    console.log(`[Logged] Added ${url} to log as item #${nextIndex} [Angle: ${angle}, Topic: ${topic}]`);
  } catch (e) {
    console.error('Failed to log interaction:', e.message);
  }
}

/**
 * 4-Tier Relevance & Safety Evaluator
 * Guarantees 100% brand alignment with TravelFrame Hanoi & Northern Vietnam photo tours
 */
function evaluatePostRelevance(text) {
  const lower = text.toLowerCase();

  // Tier 1: Negative Exclusion List (Immediate Rejection)
  const blacklist = [
    // Relationship / Drama / Dating / Gossip
    'người yêu', 'bồ cũ', 'chia tay', 'crush', 'tỏ tình', 'ly hôn', 'ly thân', 'cưới xin', 'yêu đương', 'tình cảm', 'hẹn hò',
    // Monetization / Affiliate / Financial / Jobs / Sales
    'earn money', 'affiliate', 'hoa hồng', 'kiếm tiền', 'thu nhập', 'tuyển dụng', 'tìm việc', 'việc làm',
    'crypto', 'chứng khoán', 'forex', 'đầu tư', 'bán hàng', 'order', 'xách tay', 'mua quà', 'quà tặng',
    // Entertainment / Concerts / Kpop / Showbiz
    'concert', 'vé concert', 'idol', 'fandom', 'kpop', 'show ca nhạc', 'vé show', 'vé ca nhạc', 'ca sĩ',
    // Out-of-Scope Destinations (Abroad / Non-target domestic provinces)
    'thái lan', 'nhật bản', 'hàn quốc', 'châu âu', 'nước mỹ', 'du học', 'visa', 'thủy nguyên', 'hải phòng', 'đà lạt', 'phú quốc'
  ];

  for (const bad of blacklist) {
    if (lower.includes(bad)) {
      return { relevant: false, tier1Blocked: true, reason: `Chứa từ khóa loại trừ: "${bad}"` };
    }
  }

  // Tier 2: Positive Core Topics Matching TravelFrame Focus
  const hasHanoiLocation = lower.includes('hà nội') || lower.includes('hanoi') || lower.includes('hoàng diệu') ||
                           lower.includes('phan đình phùng') || lower.includes('phố cổ') || lower.includes('hồ gươm') ||
                           lower.includes('hồ tây') || lower.includes('cầu long biên');

  const hasNorthernMountain = lower.includes('hà giang') || lower.includes('sapa') || lower.includes('tà xùa') ||
                              lower.includes('mù cang chải') || lower.includes('bản giốc') || lower.includes('cao bằng') ||
                              lower.includes('ninh bình');

  const hasPhotoService = lower.includes('photo tour') || lower.includes('tour chụp ảnh') || lower.includes('thuê thợ ảnh') ||
                          lower.includes('thợ chụp') || lower.includes('chụp ảnh du lịch') || lower.includes('chụp kỷ niệm') ||
                          (lower.includes('chụp ảnh') && (hasHanoiLocation || hasNorthernMountain || lower.includes('du lịch')));

  const isSoloTravel = (lower.includes('solo trip') || lower.includes('solo travel') || lower.includes('đi một mình')) &&
                       (hasHanoiLocation || hasNorthernMountain || lower.includes('vietnam') || lower.includes('việt nam'));

  const isForeignTraveler = !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text) &&
                            (lower.includes('hanoi') || lower.includes('vietnam') || lower.includes('old quarter') || lower.includes('sapa') || lower.includes('ha giang') || lower.includes('ninh binh')) &&
                            (lower.includes('visit') || lower.includes('trip') || lower.includes('travel') || lower.includes('photo') || lower.includes('explore') || lower.includes('itinerary') || lower.includes('reco') || lower.includes('tips') || lower.includes('solo') || lower.includes('hotel') || lower.includes('worth it') || lower.includes('food') || lower.includes('places') || lower.includes('cost') || lower.includes('price') || lower.includes('budget'));

  if (isForeignTraveler) {
    if (lower.includes('solo') || lower.includes('alone') || lower.includes('by myself')) return { relevant: true, topic: 'en_solo' };
    if (lower.includes('photo') || lower.includes('visual') || lower.includes('picture') || lower.includes('instagram') || lower.includes('camera') || lower.includes('spot')) return { relevant: true, topic: 'en_photo' };
    if (lower.includes('itinerary') || lower.includes('reco') || lower.includes('plan') || lower.includes('worth it') || lower.includes('day trip') || lower.includes('sapa') || lower.includes('how many days') || lower.includes('hotel') || lower.includes('suggest')) return { relevant: true, topic: 'en_itinerary' };
    if (lower.includes('food') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('eat') || lower.includes('dish')) return { relevant: true, topic: 'en_food' };
    if (lower.includes('cost') || lower.includes('price') || lower.includes('budget') || lower.includes('cheap') || lower.includes('expensive')) return { relevant: true, topic: 'pricing_budget' };
    return { relevant: true, topic: 'international_vietnam' };
  }

  if (hasPhotoService) return { relevant: true, topic: 'photo_tour' };
  if (lower.includes('giá') || lower.includes('chi phí') || lower.includes('budget') || lower.includes('bảng giá')) {
    if (hasHanoiLocation || hasNorthernMountain || lower.includes('du lịch') || lower.includes('tour')) {
      return { relevant: true, topic: 'pricing_budget' };
    }
  }
  if (hasHanoiLocation) {
    if (lower.includes('ăn') || lower.includes('cà phê') || lower.includes('phở') || lower.includes('bún chả') || lower.includes('quán')) {
      return { relevant: true, topic: 'street_food' };
    }
    return { relevant: true, topic: 'hanoi_autumn' };
  }
  if (hasNorthernMountain) return { relevant: true, topic: 'mountain_views' };
  if (isSoloTravel) return { relevant: true, topic: 'solo_travel' };

  return { relevant: false, tier1Blocked: false, reason: 'Không khớp với các địa danh hoặc dịch vụ du lịch cốt lõi của TravelFrame' };
}

/**
 * Scan multi-comments, synthesize thread context, and detect lead signals
 */
function scanThreadContextAndComments() {
  const raw = runOrca(['eval', '--page', PAGE_ID, '--expression', `(() => {
    const rootEl = document.querySelector('article, div[data-pressable-container="true"]');
    const rootText = rootEl ? (rootEl.innerText || '') : '';
    const nodes = Array.from(document.querySelectorAll('div[data-pressable-container="true"], article')).slice(1);
    const comments = [];
    for (const node of nodes) {
      const text = node.innerText || '';
      if (text.includes('travelframe.vn')) continue;
      let likeCount = 0;
      const match = text.match(/(?:Like|Thích)\\s*([\\d\\.,KM]+)/i);
      if (match) {
        likeCount = parseFloat(match[1].replace(/,/g, ''));
        if (match[1].includes('K')) likeCount *= 1000;
      }
      let replyCount = 0;
      const repMatch = text.match(/(?:Reply|Trả lời)\\s*([\\d\\.,KM]+)/i);
      if (repMatch) {
        replyCount = parseFloat(repMatch[1].replace(/,/g, ''));
        if (repMatch[1].includes('K')) replyCount *= 1000;
      }
      const authorEl = node.querySelector('a[href^="https://www.threads.com/@"]:not([href*="/post/"])') || node.querySelector('a');
      const commentAuthor = authorEl ? authorEl.innerText.trim().replace(/^@/, '') : '';
      if (text.length > 8 && commentAuthor) {
        comments.push({
          author: commentAuthor,
          text: text.slice(0, 300).replace(/\\n+/g, ' '),
          likeCount,
          replyCount
        });
      }
    }
    return JSON.stringify({ rootText: rootText.slice(0, 300), comments });
  })()`]);

  if (!raw) return { rootText: '', comments: [], topComment: null, contextTopic: 'general', leadSignals: [] };

  try {
    const data = JSON.parse(raw);
    const comments = data.comments || [];
    comments.sort((a, b) => b.likeCount - a.likeCount);
    const topComment = comments.length > 0 && comments[0].likeCount >= 1 ? comments[0] : null;

    const fullEvaluation = evaluatePostRelevance(data.rootText);
    const contextTopic = fullEvaluation.relevant ? fullEvaluation.topic : 'general';

    const leadSignals = [];
    for (const c of comments) {
      const lowerC = c.text.toLowerCase();
      if (/giá (tour|gói|chụp)|bao nhiêu (một|1) (buổi|tour)|tư vấn (mình|em)|có thợ chụp|book tour|xin info tour/i.test(lowerC)) {
        leadSignals.push(c);
      }
    }

    return {
      rootText: data.rootText,
      comments,
      topComment,
      contextTopic,
      leadSignals
    };
  } catch (e) {
    return { rootText: '', comments: [], topComment: null, contextTopic: 'general', leadSignals: [] };
  }
}

async function triageLeadWithJev(leadComment, postUrl) {
  console.log(`\n[Lead Triage] 🔔 High-intent lead detected from @${leadComment.author}: "${leadComment.text}"`);
  console.log(`[Lead Triage] Routing to TypeSafe System One (model: jev-latest)...`);

  const statePayload = {
    source: 'manual',
    subscriber: {
      id: `threads_${leadComment.author}`,
      language: 'vi'
    },
    conversation: [
      { role: 'user', text: leadComment.text }
    ],
    fields: {
      TF_Source_Post: postUrl
    }
  };

  const scratchDir = path.resolve(process.cwd(), 'scratch');
  const tempStateFile = path.resolve(scratchDir, `lead_triage_${Date.now()}.json`);
  try {
    fs.mkdirSync(scratchDir, { recursive: true });
    fs.writeFileSync(tempStateFile, JSON.stringify(statePayload, null, 2), 'utf8');

    const useLive = process.env.TYPESAFE_LIVE_APPROVED !== '0';
    const args = useLive
      ? [TRIAGE_SCRIPT, '--input', tempStateFile, '--live']
      : [TRIAGE_SCRIPT, '--mock', 'photo_tour_ready', '--input', tempStateFile];

    const triageOut = execFileSync('node', args, { encoding: 'utf8', timeout: 15000 });
    const triageResult = JSON.parse(triageOut);
    console.log(`[Lead Triage Jev] Decision: ${triageResult.decision?.route || 'triage_complete'}, Priority: ${triageResult.decision?.priority || 'P1'}`);
    console.log(`[Lead Triage Jev] Purchase Intent Score: ${triageResult.answers?.purchase_intent?.score || 'N/A'}`);

    if (fs.existsSync(tempStateFile)) fs.unlinkSync(tempStateFile);
    return triageResult;
  } catch (err) {
    console.error(`[Lead Triage Error]:`, err.message);
    if (fs.existsSync(tempStateFile)) fs.unlinkSync(tempStateFile);
    return null;
  }
}

let jevUnavailable = false;

async function classifyContentWithJev(rootText, comments) {
  if (process.env.TYPESAFE_LIVE_APPROVED === '0') {
    console.log('[JEV Classifier] Offline (TYPESAFE_LIVE_APPROVED=0). Dùng keyword heuristic.');
    return null;
  }
  if (jevUnavailable) return null;

  const payload = {
    source_post_url: '',
    root_text: String(rootText || '').slice(0, 600),
    comments: (comments || []).slice(0, 10).map(c => ({
      author: c.author || '',
      text: String(c.text || '').slice(0, 300),
      like_count: c.likeCount || 0
    }))
  };

  const scratchDir = path.resolve(process.cwd(), 'scratch');
  const tempFile = path.resolve(scratchDir, `content_classify_${Date.now()}.json`);
  try {
    fs.mkdirSync(scratchDir, { recursive: true });
    fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2), 'utf8');
    const out = execFileSync('node', [CLASSIFIER_SCRIPT, '--input', tempFile, '--live'], {
      encoding: 'utf8',
      timeout: 15000
    });
    const result = JSON.parse(out);
    const c = result.classification;
    console.log(`[JEV Classifier] relevant=${c.relevant} topic="${c.topic}" lead=${c.is_lead} conf=${c.confidence} trusted=${c.trusted}`);
    return c;
  } catch (err) {
    if (/TYPESAFE_API_KEY/.test(err.message)) jevUnavailable = true;
    console.error(`[JEV Classifier Error] ${err.message.split('\n')[0]} — fallback keyword heuristic.`);
    return null;
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }
}

function decideInteraction(mode, keywordEval, jev) {
  const isFeed = mode === 'feed';
  let relevant;
  let topic;
  let source;

  if (jev && jev.trusted) {
    if (!jev.relevant && !jev.borderline) {
      return { action: 'skip', reason: 'JEV xác minh ngoài phạm vi nội dung TravelFrame', source: 'jev' };
    }
    relevant = jev.relevant;
    topic = jev.topic_trusted === false ? (keywordEval.topic || 'general') : (jev.topic || 'general');
    source = 'jev';
  } else {
    if (jev && jev.below_fallback && !isFeed) {
      return { action: 'skip', reason: 'JEV confidence dưới ngưỡng fallback, không xác minh được ngữ cảnh', source: 'jev' };
    }
    relevant = keywordEval.relevant;
    topic = keywordEval.topic || 'general';
    source = 'keyword';
  }

  if (relevant) return { action: 'comment', topic, source };
  if (isFeed) return { action: 'like_only', topic: 'general', source };
  return { action: 'skip', reason: keywordEval.reason || 'Nội dung chung chung, không xác minh được ngữ cảnh', source };
}

function isCommentAllowed(comment) {
  const normalized = normalizeText(comment);
  if (!normalized) return false;
  if (/(book now|booking link|dm me|inbox me|link in bio|contact us|zalo:|hotline:|báo giá ngay|đặt tour ngay)/i.test(comment)) {
    return false;
  }
  // Anti-AI / Quality check: no URLs, no pipes, no hyphens
  if (comment.includes('http://') || comment.includes('https://') || comment.includes('|') || comment.includes('-')) {
    return false;
  }
  // No robotic trailing emojis
  if (/[\p{Extended_Pictographic}]\s*[.!?]?$/u.test(comment.trim())) {
    return false;
  }
  return true;
}

const POOLS = {
  // --- EN SOLO ---
  en_solo: {
    yeu_thich: [
      "Huge respect for choosing Vietnam for your solo trip! Hanoi is remarkably safe, walkable, and welcoming to solo wanderers. Strolling around Hoan Kiem Lake ✨ at dawn will make you feel like you have the entire poetic city to yourself!",
      "Solo in Vietnam is honestly one of the best decisions you can make. The moment you sit on a tiny sidewalk stool ☕ watching the city wake up, you will know you picked the right place!",
      "Vietnam solo trips hit different because the locals genuinely treat you like family. A morning walk around the Old Quarter with an egg coffee ✨ in hand and you will forget you are traveling alone!"
    ],
    nghi_ngo: [
      "A lot of people worry that solo traveling in Vietnam feels overwhelming with street crossing. The secret is simple: walk at a calm steady pace, never step backwards, and the motorbikes 🛵 will smoothly flow around you like water!",
      "Everyone says Vietnam is chaotic for solo travelers, but plot twist: the chaos has a rhythm. Once you stop fighting it and just walk steady ☕ the city starts making perfect sense!",
      "\"Is Vietnam safe for solo travelers?\" gets asked a million times. Honest answer: you will feel safer walking Hanoi at midnight than most major cities. The biggest danger 🍜 is honestly eating too much pho!"
    ],
    tu_hoi: [
      "Ever wonder why so many solo wanderers fall head over heels for Hanoi? It is that special feeling ☕ when you sit on a tiny sidewalk stool and a local vendor smiles like you are family.",
      "Something about Vietnam solo travel just rewires your brain. You arrive stressed, and somewhere between the third egg coffee ☕ and your first alley detour, everything just clicks.",
      "What is it about Hanoi that turns a 5 day solo trip into \"maybe I should stay a month\"? Asking 🤔 for literally every solo traveler who has ever visited!"
    ],
    tich_cuc: [
      "Sending warmest wishes and safe travels for your solo journey! Vietnam has a unique way 💛 of making solo wanderers feel embraced and right at home everywhere they go.",
      "Solo travel is the ultimate gift you give yourself 💛 and Vietnam is going to reward that courage with incredible food, warm smiles, and views that stay with you forever!",
      "There is something magical about exploring a new country on your own terms. Vietnam will give you stories 💛 you will be telling for years. Have the best time!"
    ],
    clickbait: [
      "The real \"plot twist\" of solo travel in Vietnam: you think you might feel lonely, but within 2 days you will make friends in cozy alleyway cafes ☕ and wish you booked a month longer!",
      "Nobody warned me about the biggest risk of solo travel in Vietnam: you will fall in love with the country so hard that planning your return trip ✈️ starts before you even leave for home!",
      "Solo travel unpopular opinion: Vietnam is genuinely easier alone than with a group. You eat what you want, wander where you want, and somehow end up at the best hidden spots ☕ because you have no set plan!"
    ]
  },

  // --- EN PHOTO ---
  en_photo: {
    yeu_thich: [
      "Hanoi is an absolute paradise for photography! The golden morning light 📸 filtering through century old French shutters creates an aesthetic that looks straight out of a classic Wong Kar Wai film!",
      "This visual is pure art! Vietnam has this magical quality where every random alley 📸 turns into a perfectly composed frame without even trying.",
      "Obsessed with this vibe! The light in Hanoi between 6:30 and 7:30 AM is genuinely unmatched ✨ making everything look like a film still, no editing needed."
    ],
    nghi_ngo: [
      "People think you need professional studio lighting for good photos here. Truth is, Hanoi natural early morning mist 📸 and quiet temple corners do all the storytelling on their own!",
      "Thought the Vietnam aesthetic was all filters and presets. Then I saw the actual golden hour on Phan Dinh Phung street at 6:45 AM 📸 and realized the camera was barely keeping up with reality!",
      "\"You edited this right?\" is the most common question about Hanoi photos. The actual answer ✨ is that the city just looks like this at sunrise, with minimal editing!"
    ],
    tu_hoi: [
      "Ever wonder why every vintage corner in the Old Quarter looks like a movie still? Cannot decide whether the mossy yellow walls or the street vendors with flower bicycles 📸 make the better photo!",
      "How does Hanoi manage to make every single narrow alley photogenic? Other cities wish they had this kind of effortless aesthetic 📸 honestly!",
      "Sometimes I wonder if Hanoi was designed by a cinematographer. The layers of light, shadow, and texture ✨ in every corner are almost too perfect to be accidental."
    ],
    tich_cuc: [
      "This capture genuinely made my day! Vietnam through a camera lens ✨ is something everyone should experience at least once. Keep shooting, these are gorgeous!",
      "The way you caught this moment is beautiful 📸 because Vietnam gives such generous light and texture to work with. Wishing you many more frames like this!",
      "Every photo from Vietnam tells a little story. This one has such warmth and honesty in it ✨ and it is wonderful seeing the country through fresh eyes!"
    ],
    clickbait: [
      "\"Hidden secret\" for the best photos in Hanoi: head to Phan Dinh Phung street at 6:45 AM before the crowds arrive. The light at that hour 📸 is genuinely cinematic perfection!",
      "The one photography hack nobody shares about Hanoi: skip the tourist viewpoints entirely. Walk into any random residential alley at golden hour 📸 and you will get frames that look professionally art directed!",
      "Plot twist for photographers visiting Vietnam: the most beautiful shots 📸 are not at the famous spots, but in the early morning alleys where locals brew fresh coffee."
    ]
  },

  // --- EN ITINERARY ---
  en_itinerary: {
    yeu_thich: [
      "Such a thoughtful route! For Sapa, two days gives you plenty of time for village walks, while in Hanoi, catching the morning sunbeams ✨ along Phan Dinh Phung street is unforgettable.",
      "Love this itinerary energy! One tip that makes a huge difference: leave your first Hanoi morning completely open ✨ because the best discoveries happen when you are not rushing to the next pin.",
      "Solid plan! The real game changer for North Vietnam trips is adding one buffer day with zero agenda. That is usually when the best food finds and photo moments ✨ happen naturally.",
      "Great route layout! Pairing the bustling energy of Hanoi with the peaceful mountain terraces of Sapa 🌾 creates the absolute perfect balance for a North Vietnam trip."
    ],
    nghi_ngo: [
      "Skip the overpriced tourist spots! In Hanoi, an authentic egg coffee at Cafe Dinh overlooking the lake beats crowded cafes every time. In Sapa, an eco lodge in Ta Van 🌿 gives you genuine tranquility.",
      "Hot take: half the \"must visit\" spots in Hanoi tourist guides are actually skippable. The real magic is in the unplanned alleys, the early morning markets, and that random pho shop 🍜 your driver swears by!",
      "Unpopular opinion: a perfect Vietnam itinerary has at least two days with nothing scheduled. Those are the days you find the egg coffee spot ☕ with no English menu and the view that is not on any blog."
    ],
    tu_hoi: [
      "How do you fit Hanoi, Sapa, and Ha Long Bay without it feeling like a sprint? Honestly, choosing slow mornings ☕ over more checkpoints usually makes the whole trip feel twice as long in the best way!",
      "The eternal Vietnam itinerary dilemma: see everything in 7 days or actually enjoy 3 places properly? Having done both ☕ I can confirm the unhurried version wins every time.",
      "Real question: does anyone actually regret skipping one tourist spot to spend an extra morning wandering quiet alleys with coffee ☕? Never heard of anyone regretting it!"
    ],
    tich_cuc: [
      "This route is going to be incredible! North Vietnam has a way of exceeding every expectation 💛 especially when you give yourself room to breathe between the highlights!",
      "What an exciting trip ahead! Vietnam rewards travelers who stay curious and open 💛 and you are going to come back with the best stories. Enjoy every moment!",
      "The fact that you are planning this carefully means you are already set for an amazing trip 💛 Vietnam is going to surprise you in the best ways!"
    ],
    clickbait: [
      "Pro tip for your itinerary: do not rush Hanoi in just 1 day! The real charm 🤫 hides in the quiet residential alleys between 6:30 AM and 8:00 AM before the motorbikes take over.",
      "The #1 itinerary mistake in Vietnam: scheduling every single hour. The best meal you will eat, the best photo you will take, and the best conversation 🤫 will all happen during unplanned time!",
      "Insider tip that most travel blogs will not tell you: book your Sapa stay in Ta Van village instead of the main town 🤫 so you wake up to rice terraces and clouds instead of construction noise."
    ]
  },

  // --- EN FOOD ---
  en_food: {
    yeu_thich: [
      "Get ready for a flavor explosion! Street food in Hanoi is elite, especially sitting on a low plastic stool 🍜 sipping hot pho broth on a cool autumn morning!",
      "Vietnam street food is genuinely life changing! The first time you eat bun cha on a tiny sidewalk table 🍜 with charcoal smoke drifting past, you will understand why people keep coming back.",
      "The food scene in Vietnam is unreal! Pro tip: the best meals are almost always at the places with plastic stools, no menu in English 🍜 and a steady line of locals waiting."
    ],
    nghi_ngo: [
      "Do not be intimidated by the tiny alleyway eateries! The rule of thumb in Hanoi: if you see local elders sitting on little blue chairs eating 🍜 walk right in, the food is 100% authentic and delicious.",
      "\"Is street food safe in Vietnam?\" is the most asked question and the answer is almost always yes. Those tiny stalls with the highest local turnover 🍜 are fresher than most restaurant kitchens!",
      "Forget the restaurants with English menus and AC. The real Hanoi food experience is squeezing onto a plastic stool in an alley 🍜 pointing at what the person next to you is eating, and being amazed every single time!"
    ],
    tu_hoi: [
      "Ever wonder why Hanoi coffee culture is so addictive? Having an authentic egg coffee ☕ tucked away in a quiet second floor balcony just completely stops time.",
      "Why does a modest bowl of pho from a street vendor somehow taste better than fancy restaurants? Vietnam food logic ☕ is beautifully unfair in the best way!",
      "How is it possible that a city this compact has this many incredible food spots? Every single alley in Hanoi hides at least one dish 🍜 that will genuinely change your standards forever."
    ],
    tich_cuc: [
      "Wishing you the tastiest culinary journey in Vietnam! May every bowl of pho and cup of coffee 💛 bring pure warmth to your soul.",
      "Vietnam food adventures are the best kind of adventures 💛 and your taste buds are about to go on the trip of a lifetime. Enjoy every bite!",
      "The food in Vietnam is one of those things that connects everyone 💛 sitting down with strangers, sharing a meal, and leaving feeling like old friends."
    ],
    clickbait: [
      "Warning: Hanoi street food will completely ruin all other food for you! Make sure to try bun cha on Hang Quat street 🍜 and egg coffee on Nguyen Huu Huan before leaving town!",
      "Nobody tells you this but the biggest expense in Vietnam is eating six meals a day 🍜 because everything is so affordable and tastes incredible!",
      "The one food rule in Hanoi that has never failed me: if the stool is tiny, the menu is handwritten, and there is a queue of locals at 7 AM 🍜 sit down immediately for the best meal of your trip!"
    ]
  },

  // --- EN PRICING BUDGET ---
  pricing_budget_en: {
    yeu_thich: [
      "Vietnam is unbelievably kind to travel budgets! A hearty bowl of pho 🍜 on a sidewalk stool costs barely two dollars, yet the flavor beats fancy restaurants every time.",
      "One of the best surprises here is how far your budget goes! Starting your morning with a dollar iced coffee ☕ by the lake sets such a peaceful tone for the day.",
      "Travel in Vietnam feels so refreshing because the richest experiences cost almost nothing. A morning stroll through the flower market ✨ and an egg coffee are pure luxury without the price tag."
    ],
    nghi_ngo: [
      "People often ask if you need a huge budget to travel comfortably in Vietnam. Honestly, keeping meals local 🍜 and taking Grab makes your days both cheaper and much more authentic!",
      "A common worry is getting overcharged as a visitor. The easiest local rule is simple: ask the price with a smile before ordering ☕ or pick stalls where prices are clearly posted.",
      "You do not need luxury tour packages to see the real North Vietnam. Booking trains directly and having local street food 🍜 gives you a trip that feels ten times more genuine."
    ],
    tu_hoi: [
      "How does a two dollar sidewalk meal in Hanoi manage to taste so incredible? Something about the fresh herbs and simmering broth 🍜 completely redefines value for money.",
      "Ever wonder why Vietnam travelers always rave about everyday costs? Sitting on a tiny plastic stool ☕ sipping freshly brewed coffee proves that the best moments are truly simple.",
      "Why do people find Vietnam so easy to budget for? Because wandering the historic alleys and soaking in the atmosphere ✨ costs literally nothing and stays in your memory longest."
    ],
    tich_cuc: [
      "Wishing you a fantastic journey full of great value! May every cozy cafe and street food corner 💛 bring pure joy without breaking the bank.",
      "Vietnam is such a generous destination for travelers! Enjoy every affordable bowl of noodles 💛 and all the wonderful memories you will bring home.",
      "So excited for your adventure! With delicious food everywhere at modest prices 💛 you can truly relax and focus on enjoying the journey."
    ],
    clickbait: [
      "A quiet local secret for Hanoi dining: step one street away from the main tourist squares. The food becomes tastier 🤫 and the prices drop by half immediately!",
      "The biggest budget surprise in Vietnam: the cheaper the plastic stool, the more incredible the meal 🍜 turns out to be. Trust the locals and eat where they gather!",
      "Travel tip for keeping costs easy: download Grab for transparent ride fares 🤫 and save your budget for that extra round of egg coffee."
    ]
  },

  // --- EN MOUNTAIN VIEWS ---
  mountain_views_en: {
    yeu_thich: [
      "The Northern mountains of Vietnam ⛰️ are genuinely breathtaking in person! The crisp air and endless layered ridges will make you feel like you stepped inside a classical painting.",
      "Driving through the northern passes is pure adventure! The scenery around Sapa and Ha Giang 🌾 looks ten times more magnificent than any travel video can capture.",
      "The mountain landscapes here are unforgettable! Waking up above a sea of morning clouds ☁️ in a quiet valley homestay is something every traveler should experience."
    ],
    nghi_ngo: [
      "People worry that mountain roads in North Vietnam are too rugged to handle. Take it slow, hire an experienced local driver ⛰️ and the journey becomes the most peaceful part of your entire trip!",
      "Thought the mountain terraced views were exaggerated by drone footage. Then I stood on the edge of the pass at sunrise ⛰️ and realized real life is far more dramatic!",
      "You do not need to be an extreme hiker to enjoy Northern Vietnam. Even gentle valley walks between traditional villages 🌾 offer incredible views without exhaustion."
    ],
    tu_hoi: [
      "Ever wonder why travelers get so emotional about the Northern Vietnam mountains? Standing high on a winding pass ⛰️ watching clouds roll through the valley puts everything into perspective.",
      "How does Northern Vietnam manage to feel so remote yet so welcoming? Every small mountain village ☕ greets you with genuine smiles and hot tea.",
      "What is it about the mountain air up north that makes you forget all your deadlines back home ⛰️? Nature here truly has a way of resetting your spirit."
    ],
    tich_cuc: [
      "Wishing you safe roads and clear sunny skies for your mountain travels! May the grand mountain peaks 💛 and warm village hospitality stay with you forever.",
      "Exploring Northern Vietnam is such a rewarding adventure 💛 wishing you crisp mornings, stunning vistas, and wonderful encounters along every winding pass!",
      "May your mountain journey be filled with awe and wonder 💛 North Vietnam is ready to show you some of the most beautiful landscapes on earth!"
    ],
    clickbait: [
      "The secret to the best mountain views up north: wake up at 5:30 AM before sunrise. Watching the morning mist 🤫 rise off the terraced valleys is an experience you will never forget!",
      "Insider tip for the northern passes: pack warm layers even in pleasant months. The weather changes fast in the highlands ⛰️ and having a cozy jacket makes all the difference!",
      "The biggest surprise about visiting the northern mountains: you come for the epic landscapes 🤫 but you end up remembering the warmth of the village families most of all."
    ]
  },

  // --- EN GENERAL / INTERNATIONAL ---
  en_general: {
    yeu_thich: [
      "Literally obsessed with this capture! The morning light ✨ in Vietnam hits completely different, pure aesthetic perfection for real.",
      "This is the kind of content that makes you stop scrolling and just stare ✨ because Vietnam really is that photogenic without any filters!",
      "Everything about this is gorgeous! Vietnam has a way of making ordinary moments look absolutely cinematic ✨ and you captured it with such heart."
    ],
    nghi_ngo: [
      "Honestly thought those misty morning reels were color graded to death, until I woke up at 6 AM and walked the quiet Old Quarter alleys ☕ myself. It genuinely is that dreamy!",
      "Was convinced Vietnam travel content was overhyped until I actually explored the backstreets. Turns out the reality ✨ is somehow even more poetic than the videos!",
      "\"There is no way it actually looks like that\" is what I said before visiting. Seeing the sunrise light up Hanoi 📸 proved that real life here is truly cinematic!"
    ],
    tu_hoi: [
      "Ever wonder why Vietnam feels more like a living poem than just a destination? Maybe it is that slow morning rhythm ☕ and the aroma of street coffee that quietly stops time.",
      "What is it about Vietnam that makes people completely rethink their travel priorities? Everyone arrives for a brief visit ☕ and leaves wanting to stay for months!",
      "Genuine question: has anyone ever visited Vietnam and not immediately started daydreaming 🤔 about their next trip back? The charm is irresistible!"
    ],
    tich_cuc: [
      "This genuinely brought a smile to my face! Wishing you the most incredible time 💛 Vietnam has a way of filling your heart with warmth you did not know you needed.",
      "Love seeing people experience Vietnam for the first time 💛 the country has so much beauty, kindness, and unforgettable moments waiting for you!",
      "Sending the warmest vibes from Vietnam 💛 may your journey be full of unexpected discoveries, amazing food, and the kind of memories that last forever!"
    ],
    clickbait: [
      "The \"plot twist\" nobody warned you about Vietnam: you think you came for a quick visit ☕ but the hidden alleyway cafes and warm local smiles will make you want to extend your stay!",
      "Nobody talks about the real side effect of visiting Vietnam: a permanent craving for egg coffee ☕ an attachment to tiny sidewalk stools, and an urge to plan your next trip immediately!",
      "The thing about Vietnam that no travel guide mentions: it is not the landmarks that get you, it is the quiet morning 🤫 when a stranger shares fresh tea and smiles. That is what stays with you."
    ]
  },

  // --- VI HANOI AUTUMN ---
  hanoi_autumn_vi: {
    yeu_thich: [
      "Visual mùa thu Hà Nội kiểu này nhìn là biết 🍂 \"chữa lành\" tâm hồn rồi nè! Cái cảm giác sáng sớm lượn Phan Đình Phùng lúc nắng vàng xiên qua sương, không filter nào đọ được ngoài đời á!",
      "Nắng hanh vàng xiên qua kẽ lá đẹp mê đắm 🍂 ngắm qua màn hình thôi mà tim đập thình thịch muốn xách balo lên đi dạo phố liền á!",
      "Hà Nội mùa thu nó khác biệt kiểu: sáng ra hít một hơi không khí se lạnh 🍂 thoang thoảng hoa sữa là tự nhiên thấy lòng bình yên đến lạ."
    ],
    nghi_ngo: [
      "Trước tui cũng \"nghi ngờ nhân sinh\" lắm, nghĩ Hà Nội mùa thu chắc chỉ đẹp qua filter. Xong 6h sáng ra đường Hoàng Diệu thấy nắng 🍂 xiên qua hàng sấu, chịu thua luôn, thực tế đẹp hơn ảnh mạng á!",
      "Cứ tưởng team mê thu Hà Nội là sống ảo thôi, tới hồi tự đi mới thấy: 6h30 sáng Phan Đình Phùng vắng tanh 🍂 sương mờ mờ, nắng vàng nhẹ, quay video không cần filter mà đã đẹp nức nở rồi!",
      "Ban đầu tui cũng tưởng ảnh mạng lừa lọc màu mè, tới hồi sáng sớm xách xe lượn phố Hoàng Diệu 🍂 mới ngã ngửa vì ngoài đời còn thơ và tình hơn trên video!"
    ],
    tu_hoi: [
      "Nhiều khi tự hỏi không biết Hà Nội mùa thu có bùa mê thuốc lú gì không mà cứ chớm se lạnh là ai cũng muốn ghé? Chắc tại cái mùi hoa sữa thoang thoảng với cảm giác ngồi vỉa hè nhâm nhi ☕ ly cà phê trứng nó bình yên quá chăng?",
      "Tự hỏi sao Hà Nội mùa thu cứ quay video bất kỳ góc nào cũng ra cinematic dữ vậy ta ☕? Không biết là do thời tiết, do ánh sáng, hay do cái thành phố này nó tình từ trong nét sống?",
      "Có ai giải thích giúp tui tại sao cứ dịp này là lại nôn nao muốn ra Hà Nội không 🍂? Rõ ràng đã đi nhiều lần rồi mà năm nào cũng thấy xao xuyến y như lần đầu!"
    ],
    tich_cuc: [
      "Thấy bài này là thấy cả một bầu trời an yên rồi! Gửi một chiếc ôm ấm áp 💛 từ Hà Nội, chúc bạn có chuyến đi ngập tràn niềm vui và gom về thật nhiều khoảnh khắc đáng nhớ nhé!",
      "Ngắm Hà Nội qua góc nhìn của bạn ấm áp quá đi 💛 chúc hành trình luôn thuận buồm xuôi gió, gom về nhiều ảnh đẹp và kỷ niệm ngọt ngào nha!",
      "Hà Nội chào đón bạn bằng gió mùa thu se lạnh và những ly cà phê thơm nức 💛 chúc chuyến đi này là chuyến đi đáng nhớ nhất trong năm nha bạn ơi!"
    ],
    clickbait: [
      "Bật mí nhỏ cho ai muốn có ảnh thu thơ mộng: đừng dại dột ra đường Phan Đình Phùng lúc 9h hay 10h sáng. Muốn visual thơ mộng 🤫 như phim Vương Gia Vệ thì bí quyết duy nhất là: canh đúng khung giờ 6h15 đến 7h30 sáng!",
      "Mẹo săn ảnh thu Hà Nội không phải ai cũng biết: hãy rẽ vào các ngõ nhỏ phố cổ lúc 6h sáng khi trời còn mờ sương 🤫 visual đẹp ngỡ ngàng mà không cần chen chúc ai đâu!",
      "Gợi ý nho nhỏ: con đường chụp ảnh thu vắng và thơ nhất đôi khi là Hoàng Diệu lúc 6h15 sáng 🤫 nắng xiên qua hàng cây cổ thụ đẹp đến lặng người đấy nha!"
    ]
  },

  // --- VI STREET FOOD ---
  street_food_vi: {
    yeu_thich: [
      "Ẩm thực phố cổ đúng là đỉnh của chóp luôn á! Buổi sáng se lạnh xà vào một hàng phở gánh nóng hổi 🍜 ngắm nhịp phố thức giấc thì không gì sánh bằng!",
      "Mê nhất cái văn hóa ăn vỉa hè Hà Nội! Ngồi ghế nhựa con con ☕ nhâm nhi ly cà phê trứng béo ngậy, vừa ăn vừa ngắm dòng người qua lại thấy bình yên lạ lùng.",
      "Món ngon Hà Nội đúng là có sức hút kỳ lạ! Bát bún chả thơm lừng mùi than quạt 🍜 hay đĩa bánh cuốn nóng đều khiến người ta nhớ mãi không quên."
    ],
    nghi_ngo: [
      "Nhiều người cứ tìm quán to biển hiệu lớn, chứ dân sành ăn Hà Nội toàn rẽ vào ngõ sâu 🍜 quán nào bàn ghế mộc mạc mà đông người già ngồi ăn là auto ngon chuẩn vị!",
      "Ai bảo ăn vỉa hè là sợ không chuẩn vị? Cứ nhìn hàng nào nước dùng thơm phức 🍜 khách địa phương ra vào nườm nượp là yên tâm về độ tươi ngon!",
      "Đừng vội tin mấy quán review rầm rộ trên mạng! Cứ đi bộ quanh phố cổ lúc sáng sớm ☕ thấy chỗ nào khói nghi ngút là ghé vào, bảo đảm khám phá ra chân ái ẩm thực!"
    ],
    tu_hoi: [
      "Tự hỏi sao cũng là bát phở hay ly cà phê mà ngồi ăn ở vỉa hè Hà Nội ☕ nó lại có phong vị cuốn hút đến thế nhỉ? Chắc tại cái hồn phố cổ nó ngấm vào từng món ăn!",
      "Có ai như mình không, đi đâu xa cũng chỉ thèm cái cảm giác 🍜 sáng sớm ngồi xì xụp bát phở nóng bên góc phố thân quen? Bình dị mà gây thương nhớ vô cùng!",
      "Nhiều khi tự hỏi vì sao ẩm thực ngõ nhỏ Hà Nội lại làm xiêu lòng bao du khách ☕? Có lẽ chính sự mộc mạc và chân thành của người nấu đã tạo nên hương vị đặc biệt này."
    ],
    tich_cuc: [
      "Chúc bạn có những trải nghiệm ẩm thực thật trọn vẹn tại Hà Nội! Mong từng món ngon vỉa hè 💛 và ly cà phê thơm sẽ mang lại thật nhiều niềm vui cho bạn.",
      "Ẩm thực Hà Nội luôn chào đón bạn bằng hương vị ấm áp và đậm đà 💛 chúc chuyến đi ngập tràn những bữa ăn ngon miệng và kỷ niệm đẹp nha!",
      "Thưởng thức trọn vẹn ẩm thực bản địa là cách tuyệt nhất để hiểu một vùng đất 💛 chúc bạn khám phá được nhiều góc quán ưng ý nhé!"
    ],
    clickbait: [
      "Bật mí nhỏ cho chuyến đi ăn sập Hà Nội: cứ canh quán nào đông dân bản địa lúc 7h sáng 🤫 là tấp vào ngay, bảo đảm chuẩn vị truyền thống mà giá cực kỳ hạt dẻ!",
      "Bí kíp ăn ngon không lo bỡ ngỡ: hãy rẽ vào các ngõ nhỏ cắt ngang Hàng Bạc hay Hàng Buồm 🍜 những viên ngọc ẩm thực ẩn mình toàn nằm ở đó thôi á!",
      "Cảnh báo nhẹ: ẩm thực ngõ phố Hà Nội rất dễ gây nghiện 🤫 ăn một lần là nhớ mãi hương vị nước dùng thanh ngọt và cà phê đậm đà đấy nha!"
    ]
  },

  // --- VI PRICING BUDGET ---
  pricing_budget_vi: {
    yeu_thich: [
      "Du lịch Hà Nội thích nhất là chi phí cực kỳ hợp lý! Một buổi sáng ăn phở 🍜 rồi uống cà phê vỉa hè chỉ tốn vài chục nghìn mà cảm giác thư thái vô cùng.",
      "Chi phí ở miền Bắc rất dễ chịu cho các bạn trẻ mê xê dịch! Đi chậm rãi, ăn quán địa phương ☕ vừa tiết kiệm vừa chạm đúng chất sống bản địa.",
      "Trải nghiệm đáng giá nhất đôi khi lại có chi phí rất nhỏ! Đi bộ quanh hồ Gươm sớm mai ✨ rồi thưởng thức ly cà phê trứng nóng là đủ cho một ngày trọn vẹn."
    ],
    nghi_ngo: [
      "Nhiều bạn lo đi du lịch hay bị phụ thu. Mẹo nhỏ của tụi mình là cứ hỏi giá trước nhẹ nhàng ☕ hoặc chọn những quán có bảng giá rõ ràng là yên tâm tuyệt đối!",
      "Không cần ngân sách quá lớn mới có chuyến đi đáng nhớ! Tránh những điểm quá thương mại 🍜 và chọn trải nghiệm gần gũi với đời sống thường nhật sẽ thấy chuyến đi ý nghĩa hơn nhiều.",
      "Ai bảo du lịch là phải tốn kém? Chọn homestay gần trung tâm để tiện đi bộ ☕ và ăn uống theo gu người địa phương sẽ giúp tối ưu chi phí rất nhiều."
    ],
    tu_hoi: [
      "Tự hỏi sao Hà Nội lại hào phóng với du khách đến thế? Chỉ với ngân sách vừa phải 🍜 bạn đã có thể thưởng thức những món ăn ngon nức tiếng và ngắm trọn cảnh đẹp phố phường.",
      "Nhiều khi tự hỏi điều gì làm nên một chuyến đi đáng nhớ? Không phải những bữa ăn đắt đỏ ☕ mà chính là sự ấm áp của người bản địa và những khoảnh khắc dung dị bên đường.",
      "Có bao giờ bạn thấy chi tiêu hợp lý lại mang đến sự tự do tuyệt vời nhất không ✨? Không áp lực lịch trình, cứ thong dong khám phá từng góc phố mình yêu thích."
    ],
    tich_cuc: [
      "Chúc bạn có chuyến đi thật vui vẻ và tiết kiệm! Mong rằng mọi chi tiêu 💛 đều mang lại giá trị trải nghiệm xứng đáng và ngập tràn niềm vui.",
      "Du lịch thông minh và thảnh thơi là món quà tuyệt vời cho bản thân 💛 chúc bạn có một hành trình thật ưng ý và nhiều kỷ niệm đẹp nha!",
      "Gửi lời chúc tốt đẹp nhất đến hành trình của bạn 💛 mong bạn tận hưởng trọn vẹn vẻ đẹp Hà Nội với chi phí thật hợp lý nhé!"
    ],
    clickbait: [
      "Bí kíp bỏ túi để vi vu Hà Nội không lo về giá: chỉ cần đi lệch ra khỏi trục phố chính chừng hai dãy nhà 🤫 đồ ăn vừa ngon chuẩn vị vừa có mức giá địa phương cực mềm!",
      "Mẹo tối ưu chi phí cho chuyến đi: ưu tiên đi bộ trong phố cổ hoặc đặt xe công nghệ có giá hiện sẵn 🛵 vừa chủ động lịch trình vừa không lo phát sinh chi phí.",
      "Tiết lộ nhỏ: những trải nghiệm đẹp nhất ở Hà Nội như ngắm bình minh cầu Long Biên hay dạo phố rợp bóng cây ✨ đều hoàn toàn miễn phí đấy nha!"
    ]
  },

  // --- VI PHOTO TOUR ---
  photo_tour_vi: {
    yeu_thich: [
      "Gu chụp này rất có hồn luôn nè! Team mê ảnh đẹp 📸 nhìn là thích ngay, đi du lịch mà có người bắt được góc visual tự nhiên thế này thì ngắm mãi không chán á!",
      "Visual bộ ảnh này chất lượng quá trời luôn! Đi du lịch mà có ảnh chụp tự nhiên 📸 kiểu này thì về nhà ngắm lại thấy vui cả năm, đẹp từng khoảnh khắc luôn!",
      "Ảnh đẹp quá bạn ơi, từng tấm đều giữ được cái hồn của khoảnh khắc 📸 tự nhiên và chân thật, không cần chỉnh sửa cầu kỳ mà vẫn cuốn hút!"
    ],
    nghi_ngo: [
      "Nhiều người hay lo đi du lịch chụp ảnh cùng người lạ sẽ bị gượng gạo. Nhưng khi đi cùng một bạn local có tâm 📸 biết dẫn vào ngõ vắng thì mọi cử chỉ đều tự nhiên hết!",
      "Thuê người chụp đi chơi sao cho tự nhiên nhất? Bí quyết là chọn người dẫn bản địa 📸 vừa dạo phố vừa trò chuyện, bắt khoảnh khắc lúc mình cười thoải mái nhất!",
      "Chụp ảnh du lịch đẹp không nằm ở việc tạo dáng cầu kỳ. Người đồng hành local 📸 biết lúc nào ánh sáng đẹp nhất và góc nào vắng người để mình thoải mái dạo chơi."
    ],
    tu_hoi: [
      "Tự hỏi sao đi du lịch một mình thì dễ mà tìm được góc chụp tự nhiên không bị gượng gạo lại khó thế nhỉ? Có một người bạn local đi cùng 📸 bắt trọn khoảnh khắc đúng là điều tuyệt vời!",
      "Có ai tự hỏi sao tự chụp selfie hoài không bao giờ bắt được góc rộng tự nhiên không 📸? Cần có ai đó đứng từ xa canh ánh sáng và chụp lúc mình không để ý mới có ảnh có hồn!",
      "Tự hỏi điều gì làm nên một bức ảnh du lịch sống mãi với thời gian 📸? Chắc chắn là nụ cười rạng rỡ và cảm xúc chân thật của chính mình trong chuyến đi!"
    ],
    tich_cuc: [
      "Mỗi chuyến đi là một món quà tuyệt vời cho chính mình sau chuỗi ngày nỗ lực! Ảnh đẹp 📸 chỉ là phần thưởng thêm, cảm xúc đọng lại mới là điều vô giá nè.",
      "Chuyến đi nào cũng xứng đáng được lưu giữ bằng những tấm ảnh chân thật 📸 và tràn đầy cảm xúc. Chúc bạn gom về thật nhiều khoảnh khắc đáng nhớ nha!",
      "Đi du lịch mà có ảnh đẹp mang về là niềm vui lớn rồi 📸 chúc bạn có thêm nhiều chuyến đi trọn vẹn và tràn đầy năng lượng tích cực nha!"
    ],
    clickbait: [
      "Bí mật để có ảnh du lịch đẹp tự nhiên: đừng cố tạo dáng giữa trưa nắng gắt. Hãy canh lúc 6h30 sáng khi nắng xiên qua kẽ lá 📸 ánh sáng lúc đó làm da dẻ ai cũng sáng bừng tự nhiên!",
      "Gợi ý cho ai thích chụp ảnh kỷ niệm: những bức hình đẹp nhất thường là lúc bạn đang thưởng thức món ăn 🍜 hoặc mải ngắm phố phường, cứ tự nhiên là đẹp nhất!",
      "Mẹo chụp ảnh phố cổ: chọn trang phục màu sáng hoặc trung tính 📸 để nổi bật trên nền tường vàng rêu phong của Hà Nội, lên hình cực kỳ sang và ấm áp!"
    ]
  },

  // --- VI MOUNTAIN ---
  mountain_views_vi: {
    yeu_thich: [
      "Cảnh sắc núi rừng miền Bắc ⛰️ ngắm ngoài đời thực sự choáng ngợp hơn nhiều so với ảnh mạng á! Không khí trong lành mát rượi, chúc bạn có một chuyến đi tuyệt vời nha!",
      "Vùng cao miền Bắc mùa này ⛰️ cảnh sắc đẹp tới mức giơ điện thoại lên quay bừa cũng ra những thước phim thơ mộng! Chúc bạn gom về thật nhiều khoảnh khắc đáng nhớ nha!",
      "Núi rừng Tây Bắc đúng là chốn bình yên cho tâm hồn ⛰️ mỗi khúc cua lại mở ra một bức tranh mới, đẹp tới mức cứ muốn đứng ngắm mãi không thôi!"
    ],
    nghi_ngo: [
      "Ai bảo đi vùng cao mùa này vất vả đâu bước ra đây? Mở mắt ra thấy biển mây bồng bềnh ☁️ ngay trước hiên homestay là thấy mọi mệt mỏi tan biến hết trơn á!",
      "Trước tui cũng sợ lên vùng cao đường xá quanh co. Đi xong mới thấy: cái khoảnh khắc ☁️ sáng sớm mở mắt ra thấy sương giăng đỉnh đèo nó bù đắp hết mọi vất vả luôn á!",
      "Đi vùng cao có mệt không? Đi xe thì có chút ê ẩm đấy, nhưng đứng trước thung lũng bao la ⛰️ hít căng lồng ngực không khí se lạnh thì thấy hoàn toàn xứng đáng!"
    ],
    tu_hoi: [
      "Đứng giữa mây trời Tây Bắc ⛰️ tự hỏi: mình miệt mài với guồng quay công việc cả năm để làm gì nếu không dành ra vài ngày lên đây đứng thở giữa thiên nhiên bao la thế này nhỉ?",
      "Tự hỏi sao mỗi lần lên vùng cao là cảm giác như được làm mới lại toàn bộ tâm hồn vậy ⛰️? Có lẽ không khí trong lành và sự tĩnh lặng của núi rừng có sức mạnh diệu kỳ!",
      "Có ai đứng trên đỉnh đèo ngắm mây trôi ⛰️ rồi tự hỏi sao mình không đi sớm hơn không? Chuyến đi nào đưa mình về với thiên nhiên cũng đều vô giá cả!"
    ],
    tich_cuc: [
      "Việt Nam mình ở đâu con người cũng ấm áp và cảnh sắc thì tuyệt mỹ 💛 chúc hành trình của bạn luôn an toàn, thuận buồm xuôi gió và đầy ắp những nụ cười rạng rỡ nha!",
      "Vùng cao miền Bắc mùa nào cũng có vẻ đẹp riêng 💛 chúc bạn có chuyến đi an toàn, gom về thật nhiều kỷ niệm và những góc hình thật thơ mộng nha!",
      "Cung đường nào mà đi bằng cả trái tim thì cung đường đó sẽ đẹp gấp bội 💛 chúc bạn tận hưởng trọn vẹn từng khúc đèo và từng ánh bình minh vùng cao nha!"
    ],
    clickbait: [
      "Gợi ý cho ai sắp lên vùng cao: hãy thức dậy lúc 5h30 sáng ngắm khói lam chiều quyện sương sớm ở các bản làng 🤫 khoảnh khắc tĩnh lặng đó mới là thứ chạm sâu vào cảm xúc nhất!",
      "Mẹo săn mây vùng cao: chọn homestay ở sườn đồi cao và thức dậy trước khi mặt trời mọc 🤫 lúc sương tan dần và ánh nắng đầu tiên chiếu rọi, cảnh sắc sẽ khiến bạn nổi da gà vì quá đẹp!",
      "Đi vùng cao đừng quên mang theo một chiếc áo khoác ấm 🤫 thời tiết trên đèo thay đổi rất nhanh, chuẩn bị chu đáo sẽ giúp chuyến đi trọn vẹn hơn rất nhiều!"
    ]
  },

  // --- VI SOLO ---
  solo_travel_vi: {
    yeu_thich: [
      "Độc hành ở Hà Nội là một trải nghiệm cực kỳ tuyệt vời! Một mình thong dong ngắm phố cổ ☕ ghé quán cà phê nhỏ đọc sách hay ngắm dòng người qua lại thấy lòng an yên lạ kỳ.",
      "Đi một mình có cái tự do mà không chuyến đi nào có được! Sáng dậy sớm đón bình minh 🍂 thích dừng ở đâu thì dừng, không cần nhìn đồng hồ hay chiều lòng ai khác.",
      "Hà Nội rất hiền hòa và an toàn cho các bạn đi solo! Dạo bước quanh hồ Tây buổi chiều tà ✨ ngắm hoàng hôn buông xuống mặt nước là kỷ niệm nhớ mãi."
    ],
    nghi_ngo: [
      "Nhiều bạn sợ đi một mình sẽ cô đơn hay buồn chán. Nhưng chỉ cần ngồi xuống một quán trà đá vỉa hè ☕ nghe các cô chú trò chuyện rôm rả là thấy ấm áp như ở nhà ngay!",
      "Ai bảo đi solo là khó chụp ảnh đẹp? Chọn khung giờ sớm khi nắng xiên nhẹ 📸 dựng chân máy nhỏ hoặc nhờ một người bạn địa phương là có ngay những góc hình rất tự nhiên!",
      "Đi một mình ở Việt Nam dễ chịu hơn bạn nghĩ nhiều! Người dân luôn sẵn lòng chỉ đường 🛵 và giúp đỡ khi bạn cần, chỉ cần giữ nụ cười thân thiện trên môi."
    ],
    tu_hoi: [
      "Tự hỏi sao đi solo lại giúp con người ta tìm lại chính mình nhanh đến thế? Có lẽ những khoảng lặng một mình ☕ giữa thành phố lạ giúp ta lắng nghe bản thân rõ ràng hơn.",
      "Có ai từng thử một mình lang thang giữa phố phường lúc sáng sớm chưa 🍂? Cảm giác cả góc phố tĩnh lặng như thuộc về riêng mình thực sự rất đặc biệt.",
      "Nhiều khi tự hỏi vì sao người ta lại mê du lịch một mình đến vậy? Chắc bởi vì cảm giác tự do quyết định từng bước chân ✨ là điều quý giá nhất."
    ],
    tich_cuc: [
      "Chúc bạn có một chuyến độc hành thật an toàn và giàu cảm hứng! Mong hành trình này 💛 sẽ mang lại cho bạn sự tự tin và thật nhiều trải nghiệm đáng nhớ.",
      "Đi một mình là dũng cảm và yêu thương bản thân 💛 chúc bạn tận hưởng trọn vẹn từng khoảnh khắc bình yên và tìm thấy nguồn năng lượng mới nha!",
      "Gửi năng lượng ấm áp đến chuyến đi của bạn 💛 chúc bạn gặp nhiều người tốt, gom nhiều ảnh đẹp và luôn mỉm cười trên mọi nẻo đường nhé!"
    ],
    clickbait: [
      "Lời khuyên thật lòng cho bạn nào chuẩn bị solo Hà Nội: hãy để trống một buổi sáng không lên lịch trình 🤫 cứ đi theo cảm xúc và rẽ vào con ngõ bạn thấy tò mò, bất ngờ thú vị đang đợi bạn!",
      "Mẹo an toàn kinh điển khi đi du lịch một mình: chọn homestay ở khu vực trung tâm dễ đi bộ 🛵 và luôn lưu số hỗ trợ cần thiết trong điện thoại nha!",
      "Một điều bất ngờ của việc đi du lịch một mình: bạn nghĩ sẽ cô đơn nhưng thực ra ☕ bạn sẽ kết nối được với nhiều người bạn mới thú vị hơn bao giờ hết!"
    ]
  },

  // --- VI GENERAL ---
  vi_general: {
    yeu_thich: [
      "Mỗi bước chân khám phá đều mang lại trải nghiệm vô giá! Chúc bạn gom về thật nhiều bức ảnh kỷ niệm tuyệt đẹp ✨ và những khoảnh khắc đáng nhớ nha!",
      "Visual bài này đẹp quá bạn ơi ✨ nhìn là biết đi du lịch bằng cả trái tim luôn á! Chúc có thêm nhiều chuyến đi tuyệt vời như vậy nha!",
      "Hình ảnh và năng lượng bài này tích cực quá ✨ xem xong là muốn xách balo lên đi ngay! Chúc bạn luôn giữ được đam mê khám phá nha!"
    ],
    nghi_ngo: [
      "Ban đầu tui cũng hoài nghi mấy bài review khen nức nở, tới hồi đặt chân đến trải nghiệm mới thấy: hóa ra cảnh đẹp ngoài đời 🌿 còn thơ mộng hơn trên ảnh nhiều á!",
      "Trước tui cũng hay đắn đo với mấy bài travel đẹp quá. Tới hồi tự đi mới giật mình ✨ hóa ra ngoài đời còn đẹp hơn ảnh, thật mà!",
      "Có đi mới thấy Việt Nam mình đẹp nhường nào 🌿 không chỉ cảnh đẹp mà cảm giác gió mát, mùi cỏ cây, không filter nào diễn tả nổi!"
    ],
    tu_hoi: [
      "Có ai như tui không, cứ mỗi lần mệt mỏi công việc là lại tự hỏi sao mình chưa xách balo lên ☕ và đi trốn đến một góc phố lạ để sạc lại năng lượng ta?",
      "Tự hỏi sao đi du lịch về xong thì tinh thần lại phấn chấn gấp đôi ta ✨? Có khi sạc pin bằng chuyến đi mới là cách chăm sóc bản thân đúng nghĩa nhất!",
      "Nhiều khi tự hỏi: mình làm việc chăm chỉ để làm gì nếu không phải để đổi lấy những trải nghiệm ✨ và khoảnh khắc đáng nhớ nhỉ? Đi thôi, không cần lý do!"
    ],
    tich_cuc: [
      "Năng lượng tích cực ngập tràn luôn á 💛 chúc bạn luôn giữ được ngọn lửa đam mê khám phá và có thêm thật nhiều hành trình trọn vẹn yêu thương nha!",
      "Xem bài của bạn xong thấy lòng nhẹ nhõm 💛 và muốn đi du lịch ngay luôn á! Chúc bạn luôn vui vẻ, khỏe mạnh và có thêm nhiều chuyến đi đáng nhớ nha!",
      "Mỗi chuyến đi đều là một trải nghiệm quý giá 💛 cảm ơn bạn vì đã chia sẻ năng lượng tích cực, chúc hành trình tiếp theo còn tuyệt vời hơn nữa nha!"
    ],
    clickbait: [
      "Bật mí cho ai chưa biết: đi du lịch Việt Nam không cần lịch trình quá dày cộm 🤫 chỉ cần một buổi sáng thong thả, một quán cà phê vỉa hè và bước chân thong dong, vậy là đủ cho một chuyến đi hoàn hảo!",
      "Kinh nghiệm du lịch bất hủ: đừng chỉ mải chụp ảnh check in 🤫 hãy dành thời gian ngồi trò chuyện với người bản địa, đó mới là những câu chuyện bạn nhớ mãi sau này!",
      "Mẹo nhỏ cho chuyến đi trọn vẹn: hãy thức dậy sớm hơn thường lệ một chút ☕ bạn sẽ thấy một nhịp sống hoàn toàn khác của thành phố trước khi dòng xe cộ bắt đầu nhộn nhịp!"
    ]
  }
};

const _poolState = {};

function pickFromPool(slotKey, variants) {
  if (!Array.isArray(variants) || variants.length === 0) return null;

  const freshVariants = variants.filter(comment => {
    if (!isCommentAllowed(comment)) return false;
    const normalized = normalizeText(comment);
    if (recentCommentTexts.has(normalized)) return false;
    if ((sessionCommentCounts.get(normalized) || 0) > 0) return false;
    if (normalized === lastSessionComment) return false;
    return true;
  });

  if (freshVariants.length > 0) {
    if (!_poolState[slotKey]) {
      _poolState[slotKey] = { idx: Math.floor(Math.random() * freshVariants.length) };
    }
    const state = _poolState[slotKey];
    const pick = freshVariants[state.idx % freshVariants.length];
    state.idx++;
    return pick;
  }

  // Fallback: lowest session count
  const validVariants = variants.filter(isCommentAllowed);
  if (validVariants.length === 0) return null;
  const sorted = [...validVariants].sort((a, b) => {
    const countA = sessionCommentCounts.get(normalizeText(a)) || 0;
    const countB = sessionCommentCounts.get(normalizeText(b)) || 0;
    return countA - countB;
  });

  for (const candidate of sorted) {
    if (normalizeText(candidate) !== lastSessionComment) {
      return candidate;
    }
  }
  return sorted[0] || null;
}

function pickWithAngleFallback(topicKey, targetAngle, poolsMap) {
  const pool = poolsMap[targetAngle] || poolsMap.yeu_thich;
  const directPick = pickFromPool(`${topicKey}:${targetAngle}`, pool);
  if (directPick) return { angleKey: targetAngle, text: directPick };

  for (const altAngle of ANGLES) {
    if (altAngle === targetAngle) continue;
    const altPool = poolsMap[altAngle];
    if (!altPool) continue;
    const altPick = pickFromPool(`${topicKey}:${altAngle}`, altPool);
    if (altPick) return { angleKey: altAngle, text: altPick };
  }
  return null;
}

/**
 * Unified Comment Engine with Angle Rotation, Topic Alignment, and History Deduplication
 */
function generateGenZComment(text, enforcedAngle = null, expectedTopic = '') {
  const angle = enforcedAngle || ANGLES[currentAngleIndex % ANGLES.length];
  currentAngleIndex++;

  const lower = String(text || '').toLowerCase();
  const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
  const angleLabel = angle === 'yeu_thich' ? 'Yêu thích' : angle === 'nghi_ngo' ? 'Nghi ngờ' : angle === 'tu_hoi' ? 'Tự hỏi' : angle === 'tich_cuc' ? 'Tích cực' : 'Clickbait';

  // ======================================================================
  // ENGLISH COMMENT POOLS
  // ======================================================================
  if (!isVietnamese) {
    let resolvedTopic = 'en_general';
    let poolsMap = POOLS.en_general;

    if (expectedTopic === 'en_solo' || (!expectedTopic && (lower.includes('solo') || lower.includes('alone') || lower.includes('by myself')))) {
      resolvedTopic = 'en_solo';
      poolsMap = POOLS.en_solo;
    } else if (expectedTopic === 'en_photo' || (!expectedTopic && (lower.includes('photo') || lower.includes('visual') || lower.includes('camera') || lower.includes('picture') || lower.includes('instagram') || lower.includes('spot')))) {
      resolvedTopic = 'en_photo';
      poolsMap = POOLS.en_photo;
    } else if (expectedTopic === 'en_itinerary' || (!expectedTopic && (lower.includes('itinerary') || lower.includes('reco') || lower.includes('plan') || lower.includes('worth it') || lower.includes('day trip') || lower.includes('how many days') || lower.includes('hotel') || lower.includes('suggest')))) {
      resolvedTopic = 'en_itinerary';
      poolsMap = POOLS.en_itinerary;
    } else if (expectedTopic === 'en_food' || expectedTopic === 'street_food' || (!expectedTopic && (lower.includes('food') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('eat') || lower.includes('dish')))) {
      resolvedTopic = 'en_food';
      poolsMap = POOLS.en_food;
    } else if (expectedTopic === 'pricing_budget' || (!expectedTopic && (lower.includes('cost') || lower.includes('budget') || lower.includes('price') || lower.includes('cheap') || lower.includes('expensive') || lower.includes('vnd') || lower.includes('dollar')))) {
      resolvedTopic = 'pricing_budget';
      poolsMap = POOLS.pricing_budget_en;
    } else if (expectedTopic === 'mountain_views' || (!expectedTopic && (lower.includes('sapa') || lower.includes('ha giang') || lower.includes('mountain') || lower.includes('pass') || lower.includes('trek')))) {
      resolvedTopic = 'mountain_views';
      poolsMap = POOLS.mountain_views_en;
    } else {
      resolvedTopic = expectedTopic || 'international_vietnam';
      poolsMap = POOLS.en_general;
    }

    const pick = pickWithAngleFallback(resolvedTopic, angle, poolsMap);
    if (!pick) {
      const fallbackPick = pickWithAngleFallback('en_general', angle, POOLS.en_general);
      return fallbackPick ? { angle: angleLabel, text: fallbackPick.text, topic: resolvedTopic } : null;
    }
    return { angle: angleLabel, text: pick.text, topic: resolvedTopic };
  }

  // ======================================================================
  // VIETNAMESE COMMENT POOLS
  // ======================================================================
  let resolvedTopic = 'vi_general';
  let poolsMap = POOLS.vi_general;

  const isHanoi = lower.includes('hanoi') || lower.includes('hà nội') || lower.includes('hoa sữa') || lower.includes('phố cổ') || lower.includes('hồ gươm') || lower.includes('phan đình phùng');
  const isPhotoTour = lower.includes('photo tour') || lower.includes('tour chụp') || lower.includes('thợ chụp') || lower.includes('chụp ảnh');
  const isMountain = lower.includes('hà giang') || lower.includes('cao bằng') || lower.includes('sapa') || lower.includes('tà xùa') || lower.includes('ninh bình') || lower.includes('mù cang chải');
  const isStreetFood = lower.includes('ăn') || lower.includes('cà phê') || lower.includes('phở') || lower.includes('bún chả') || lower.includes('quán');
  const isBudget = lower.includes('giá') || lower.includes('chi phí') || lower.includes('tiền') || lower.includes('budget') || lower.includes('đắt') || lower.includes('rẻ');
  const isSolo = lower.includes('solo') || lower.includes('một mình') || lower.includes('độc hành');

  if (expectedTopic === 'street_food' || (!expectedTopic && isStreetFood)) {
    resolvedTopic = 'street_food';
    poolsMap = POOLS.street_food_vi;
  } else if (expectedTopic === 'pricing_budget' || (!expectedTopic && isBudget)) {
    resolvedTopic = 'pricing_budget';
    poolsMap = POOLS.pricing_budget_vi;
  } else if (expectedTopic === 'photo_tour' || (!expectedTopic && isPhotoTour)) {
    resolvedTopic = 'photo_tour';
    poolsMap = POOLS.photo_tour_vi;
  } else if (expectedTopic === 'mountain_views' || (!expectedTopic && isMountain)) {
    resolvedTopic = 'mountain_views';
    poolsMap = POOLS.mountain_views_vi;
  } else if (expectedTopic === 'solo_travel' || (!expectedTopic && isSolo)) {
    resolvedTopic = 'solo_travel';
    poolsMap = POOLS.solo_travel_vi;
  } else if (expectedTopic === 'hanoi_autumn' || (!expectedTopic && isHanoi)) {
    resolvedTopic = 'hanoi_autumn';
    poolsMap = POOLS.hanoi_autumn_vi;
  } else {
    resolvedTopic = expectedTopic || 'general';
    poolsMap = POOLS.vi_general;
  }

  const pick = pickWithAngleFallback(resolvedTopic, angle, poolsMap);
  if (!pick) {
    const fallbackPick = pickWithAngleFallback('vi_general', angle, POOLS.vi_general);
    return fallbackPick ? { angle: angleLabel, text: fallbackPick.text, topic: resolvedTopic } : null;
  }
  return { angle: angleLabel, text: pick.text, topic: resolvedTopic };
}

function generateContextualComment(text, topic = '') {
  const genResult = generateGenZComment(text, null, topic);
  return (genResult && genResult.text && isCommentAllowed(genResult.text)) ? genResult.text : null;
}

function generateTopReplyComment(commentText, baseComment, angle, author, contextTopic = 'general') {
  const genResult = generateGenZComment(commentText, angle, contextTopic);
  return (genResult && genResult.text && isCommentAllowed(genResult.text)) ? genResult.text : baseComment;
}

async function interactWithPost(url, author, defaultComment, angle = 'tự động', expectedTopic = '', mode = 'search', options = {}) {
  console.log(`\n>>> Interacting with post by @${author} [Angle: ${angle}]: ${url}`);
  runOrca(['goto', '--page', PAGE_ID, '--url', url]);
  await sleep(3500);

  let snap = runOrca(['snapshot', '--page', PAGE_ID]);
  if (!snap) return false;

  const threadData = scanThreadContextAndComments();
  const { comments, topComment, leadSignals } = threadData;

  const keywordEval = evaluatePostRelevance(threadData.rootText);
  if (keywordEval.tier1Blocked) {
    console.log(`[Tier 1 Blacklist] Aborted: ${url} ${keywordEval.reason}`);
    seenUrls.add(url);
    return false;
  }

  const jev = await classifyContentWithJev(threadData.rootText, comments);
  const decision = decideInteraction(mode, keywordEval, jev);

  if (decision.action === 'skip') {
    console.log(`[Quality Gate] Aborted: ${url} ${decision.reason} (source: ${decision.source}). Skipping to protect brand relevance.`);
    seenUrls.add(url);
    return false;
  }

  const contextTopic = decision.topic;
  console.log(`[Thread Context] Scanned ${comments.length} comments. Verified Topic: "${contextTopic}" [action: ${decision.action}, source: ${decision.source}]`);

  // Like root post
  const likeMatch = snap.match(/button "(?:Like|Like\s+[\d\.,KM]+)"\s+\[ref=(e\d+)\]/);
  if (likeMatch) {
    console.log(`Liking with ref ${likeMatch[1]}...`);
    runOrca(['click', '--page', PAGE_ID, '--element', likeMatch[1]]);
    await sleep(1500);
  }

  // Lead triage
  const leads = [...leadSignals];
  if (jev && jev.is_lead && leads.length === 0) {
    leads.push({ author, text: threadData.rootText || '' });
  }
  for (const lead of leads) {
    await triageLeadWithJev(lead, url);
  }

  if (decision.action === 'like_only') {
    logInteraction(author, url, '(Like only — newsfeed)', angle, `Newsfeed: like-only (${decision.source})`);
    return true;
  }

  // Check language constraint (English traveler focus)
  const isPostVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(threadData.rootText);
  if (options.lang === 'en' && isPostVietnamese) {
    console.log(`[EN-Focus] Skipping comment on Vietnamese post by @${author} (like-only per sprint focus).`);
    logInteraction(author, url, '(Like only — newsfeed)', angle, `Newsfeed: like-only (EN-focus: skip VN comment)`);
    return true;
  }

  // Knowledge Mining
  if (topComment && topComment.likeCount >= 2) {
    let motif = 'Cảm xúc xê dịch chân thực và gắn kết bản địa';
    if (contextTopic === 'street_food') motif = 'Mẹo lùng quán ăn ngõ sâu và văn hóa cà phê vỉa hè';
    else if (contextTopic === 'photo_tour') motif = 'Giải tỏa ngại ống kính và canh giờ vàng chụp ảnh';
    else if (contextTopic === 'hanoi_autumn') motif = 'Cảm nhận sâu sắc se lạnh mùa thu và nhịp sống sáng sớm';
    else if (contextTopic === 'solo_travel') motif = 'Khích lệ độc hành và giải phóng áp lực bạn đồng hành';
    else if (contextTopic === 'mountain_views') motif = 'Tôn vinh vẻ đẹp hùng vĩ thực tế vượt trội ảnh mạng';
    else if (contextTopic === 'pricing_budget') motif = 'Bí quyết tối ưu chi phí và giá trị trải nghiệm thực tế';

    saveMinedComment({
      post_url: url,
      author: topComment.author,
      text: topComment.text,
      like_count: topComment.likeCount,
      topic: contextTopic,
      angle: angle,
      reusable_motif: motif,
      mined_at: new Date().toISOString()
    });
  }

  // Generate comment strictly matching verified topic
  const verifiedTopic = contextTopic || expectedTopic || 'general';
  const genResult = generateGenZComment(threadData.rootText, angle, verifiedTopic);
  let commentToPost = genResult?.text || defaultComment || '';
  let finalTopic = genResult?.topic || verifiedTopic;
  let finalAngle = genResult?.angle || angle;

  if (!commentToPost || !isCommentAllowed(commentToPost)) {
    console.log(`[Quality Gate] No contextual reply available for ${url}. Falling back to Like-only.`);
    logInteraction(author, url, '(Like only — newsfeed)', angle, `Like-only: no valid comment (${decision.source})`);
    return true;
  }

  snap = runOrca(['snapshot', '--page', PAGE_ID]);

  let replyRef = null;
  let targetAuthor = author;

  if (topComment) {
    console.log(`[Top Comment Found] By @${topComment.author} (${topComment.likeCount} likes): "${topComment.text.slice(0, 60)}..."`);
    const authorPos = snap ? snap.indexOf(topComment.author) : -1;
    if (authorPos !== -1) {
      const subSnap = snap.slice(authorPos);
      const subReplyMatch = subSnap.match(/button "Reply(?:\s+[\d\.,KM]+)?"\s+\[ref=(e\d+)\]/);
      if (subReplyMatch) {
        replyRef = subReplyMatch[1];
        targetAuthor = topComment.author;
        const topReply = generateTopReplyComment(topComment.text, commentToPost, finalAngle, targetAuthor, finalTopic);
        if (topReply && isCommentAllowed(topReply)) commentToPost = topReply;
        console.log(`[Strategy] Replying directly to Top Comment by @${targetAuthor} with ref ${replyRef}`);
      }
    }
  }

  if (!replyRef && snap) {
    const rootReplyMatch = snap.match(/button "Reply(?:\s+[\d\.,KM]+)?"\s+\[ref=(e\d+)\]/);
    if (rootReplyMatch) {
      replyRef = rootReplyMatch[1];
      console.log(`[Strategy] Replying to root post by @${author} with ref ${replyRef}`);
    }
  }

  if (replyRef) {
    console.log(`Opening reply composer with ref ${replyRef}...`);
    runOrca(['click', '--page', PAGE_ID, '--element', replyRef]);
    await sleep(2500);
  }

  // Textbox
  snap = runOrca(['snapshot', '--page', PAGE_ID]);
  const boxMatch = snap ? snap.match(/textbox "Empty text field\.[^"]*"\s+\[ref=(e\d+)\]/) : null;
  if (!boxMatch) {
    console.log('Composer textbox not found.');
    return false;
  }

  console.log(`Filling comment into ${boxMatch[1]}...`);
  runOrca(['fill', '--page', PAGE_ID, '--element', boxMatch[1], '--value', commentToPost]);
  await sleep(2000);

  // Submit button
  snap = runOrca(['snapshot', '--page', PAGE_ID]);
  const submitMatch = snap ? snap.match(/button "(?:Reply|Post)"\s+\[ref=(e\d+)\]/) : null;
  if (submitMatch) {
    console.log(`Submitting reply with ref ${submitMatch[1]}...`);
    runOrca(['click', '--page', PAGE_ID, '--element', submitMatch[1]]);
    await sleep(4000);
    console.log(`Success! Commented on @${targetAuthor} [Angle: ${finalAngle}, Topic: ${finalTopic}]`);
    logInteraction(targetAuthor, url, commentToPost, finalAngle, `Ngữ cảnh: ${finalTopic}`);
    return true;
  }
  return false;
}

async function main() {
  const options = parseArgs();
  console.log(`=== Starting TravelFrame Threads Engagement Runner [Mode: ${options.mode}, Lang: ${options.lang}] ===`);
  console.log(`4-Tier Relevance & Safety Gate Active. Tracked recent comments: ${recentCommentTexts.size}`);
  console.log(`Known interacted posts count: ${seenUrls.size}`);

  if (options.mode === 'single') {
    if (!options.url || !options.comment) {
      console.error('Error: --url and --comment are required for single mode.');
      process.exit(1);
    }
    const authorMatch = options.url.match(/@([^/]+)/);
    const author = authorMatch ? authorMatch[1] : 'user';
    await interactWithPost(options.url, author, options.comment, options.angle || 'Single', '', 'single', options);
    console.log('Single interaction complete.');
    return;
  }

  const endTime = Date.now() + options.duration * 60 * 1000;

  const INTERNATIONAL_QUERIES = [
    'Hanoi travel',
    'Vietnam itinerary',
    'Hanoi Sapa',
    'Vietnam solo travel',
    'Hanoi Old Quarter',
    'Ha Giang loop',
    'Vietnam trip',
    'Hanoi food'
  ];
  let currentQueryIndex = 0;

  if (options.mode === 'international') {
    const query = INTERNATIONAL_QUERIES[currentQueryIndex];
    console.log(`[International Mode] Searching: "${query}"`);
    runOrca(['goto', '--page', PAGE_ID, '--url', `https://www.threads.com/search?q=${encodeURIComponent(query)}&serp_type=default`]);
    await sleep(3500);
  } else if (options.mode === 'search') {
    const query = options.query || 'hanoi photo';
    console.log(`Searching for: ${query}`);
    runOrca(['goto', '--page', PAGE_ID, '--url', `https://www.threads.com/search?q=${encodeURIComponent(query)}&serp_type=default`]);
    await sleep(3500);
  } else {
    runOrca(['goto', '--page', PAGE_ID, '--url', 'https://www.threads.com/']);
    await sleep(3500);
  }

  let consecutiveMisses = 0;
  while (Date.now() < endTime) {
    const remainingMins = Math.round((endTime - Date.now()) / 60000);
    console.log(`[Status] Time remaining: ~${remainingMins} mins.`);

    const scanRaw = runOrca(['eval', '--page', PAGE_ID, '--expression', `(() => {
      const articles = Array.from(document.querySelectorAll('div[data-pressable-container="true"], article'));
      return JSON.stringify(articles.map(a => {
        const text = a.innerText || '';
        const postLink = a.querySelector('a[href*="/post/"]');
        const authorLink = a.querySelector('a[href^="https://www.threads.com/@"]:not([href*="/post/"])') || a.querySelector('a');
        return {
          text: text.slice(0, 300),
          url: postLink ? postLink.href : null,
          author: authorLink ? authorLink.innerText.trim() : null
        };
      }).filter(p => p.url && p.text.length > 20));
    })()`]);

    let posts = [];
    if (scanRaw) {
      try { posts = JSON.parse(scanRaw); } catch (e) {}
    }

    let candidate = null;
    let candidateTopic = null;
    for (const p of posts) {
      if (!seenUrls.has(p.url)) {
        const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(p.text);
        if ((options.mode === 'international' || (options.mode === 'search' && options.lang === 'en')) && isVietnamese) {
          seenUrls.add(p.url);
          console.log(`[EN-Focus] Skipped Vietnamese post in search mode by @${p.author || 'user'}`);
          continue;
        }

        const authorMatch = p.url.match(/@([^/]+)/);
        const postAuthor = normalizeHandle(authorMatch ? authorMatch[1] : p.author);
        if (OWN_HANDLES.has(postAuthor)) {
          seenUrls.add(p.url);
          console.log(`[Own Account] Skipped post by @${postAuthor}`);
          continue;
        }

        if (postAuthor && seenAuthors.has(postAuthor)) {
          seenUrls.add(p.url);
          console.log(`[Author Cooldown] Skipped post by @${postAuthor} (already interacted recently)`);
          continue;
        }

        const evalRel = evaluatePostRelevance(p.text);
        const isFeedMode = options.mode === 'feed';

        if (evalRel.tier1Blocked) {
          seenUrls.add(p.url);
          console.log(`[Tier 1 Blacklist] Skipped post by @${p.author || 'user'}: "${p.text.slice(0, 50)}..." (${evalRel.reason})`);
          continue;
        }

        if (!evalRel.relevant && !isFeedMode) {
          seenUrls.add(p.url);
          console.log(`[Filtered Out] Skipped post by @${p.author || 'user'}: "${p.text.slice(0, 50)}..." (${evalRel.reason})`);
          continue;
        }

        if (evalRel.relevant) {
          if (options.lang === 'en' && isVietnamese && isFeedMode) {
            // Newsfeed natural like-only for Vietnamese posts when focusing on English
            candidate = p;
            candidateTopic = 'general';
            candidate.comment = '';
            candidate.angle = 'Newsfeed';
            console.log(`[Newsfeed Rule] Selected Vietnamese post by @${postAuthor || 'user'} for Like-only (EN focus).`);
          } else {
            const genResult = generateGenZComment(p.text, options.angle || null, evalRel.topic);
            if (!genResult || !genResult.text || !isCommentAllowed(genResult.text)) {
              seenUrls.add(p.url);
              console.log(`[Comment Filter] Skipped post by @${postAuthor || 'user'} because generated comment did not pass safety rules.`);
              continue;
            }
            candidate = p;
            candidateTopic = genResult.topic || evalRel.topic;
            candidate.comment = genResult.text;
            candidate.angle = genResult.angle;
          }
        } else {
          candidate = p;
          candidateTopic = 'general';
          candidate.comment = '';
          candidate.angle = 'Newsfeed';
          console.log(`[Newsfeed Rule] Selected post by @${postAuthor || 'user'} for natural feed interaction: "${p.text.slice(0, 50)}..."`);
        }
        break;
      }
    }

    if (candidate) {
      consecutiveMisses = 0;
      const authorMatch = candidate.url.match(/@([^/]+)/);
      const author = authorMatch ? authorMatch[1] : (candidate.author || 'user');
      const success = await interactWithPost(
        candidate.url,
        author,
        candidate.comment,
        candidate.angle || 'Tự động',
        candidateTopic,
        options.mode,
        options
      );

      // Return to search/feed and scroll down
      runOrca(['eval', '--page', PAGE_ID, '--expression', 'window.history.back()']);
      await sleep(3000);
      const currentLoc = runOrca(['eval', '--page', PAGE_ID, '--expression', 'location.href']);
      if (currentLoc && currentLoc.includes('/post/')) {
        runOrca(['eval', '--page', PAGE_ID, '--expression', 'window.history.back()']);
        await sleep(2500);
      }
      if (options.mode === 'international') {
        const checkLoc = runOrca(['eval', '--page', PAGE_ID, '--expression', 'location.href']);
        if (checkLoc && !checkLoc.includes('/search')) {
          const query = INTERNATIONAL_QUERIES[currentQueryIndex];
          runOrca(['goto', '--page', PAGE_ID, '--url', `https://www.threads.com/search?q=${encodeURIComponent(query)}&serp_type=default`]);
          await sleep(3500);
        }
      }

      // Pacing delay (45 to 75 seconds) only if interacted
      if (success) {
        const delay = Math.floor(45000 + Math.random() * 30000);
        console.log(`Pacing: Waiting ${(delay / 1000).toFixed(0)}s before next post...`);
        await sleep(delay);
      } else {
        await sleep(4000);
      }

      // Scroll down
      runOrca(['eval', '--page', PAGE_ID, '--expression', 'window.scrollBy(0, 1000 + Math.floor(Math.random() * 300))']);
      await sleep(3000);
    } else {
      consecutiveMisses++;
      console.log(`No verified travel posts in current viewport (Miss #${consecutiveMisses}). Scrolling down...`);
      if (options.mode === 'international' && consecutiveMisses >= 3) {
        currentQueryIndex = (currentQueryIndex + 1) % INTERNATIONAL_QUERIES.length;
        const nextQuery = INTERNATIONAL_QUERIES[currentQueryIndex];
        console.log(`[International Mode] Rotating to search query: "${nextQuery}"`);
        runOrca(['goto', '--page', PAGE_ID, '--url', `https://www.threads.com/search?q=${encodeURIComponent(nextQuery)}&serp_type=default`]);
        await sleep(4000);
        consecutiveMisses = 0;
      } else if (consecutiveMisses >= 6) {
        if (options.mode === 'international') {
          currentQueryIndex = (currentQueryIndex + 1) % INTERNATIONAL_QUERIES.length;
          const nextQuery = INTERNATIONAL_QUERIES[currentQueryIndex];
          console.log(`[International Mode] Rotating search query: "${nextQuery}"`);
          runOrca(['goto', '--page', PAGE_ID, '--url', `https://www.threads.com/search?q=${encodeURIComponent(nextQuery)}&serp_type=default`]);
          await sleep(4000);
          consecutiveMisses = 0;
        } else {
          console.log('Reached end of viewport matches. Refreshing feed to top for fresh posts...');
          runOrca(['goto', '--page', PAGE_ID, '--url', 'https://www.threads.com/']);
          await sleep(5000);
          consecutiveMisses = 0;
        }
      } else {
        runOrca(['eval', '--page', PAGE_ID, '--expression', 'window.scrollBy(0, 1200 + Math.floor(Math.random() * 300))']);
        await sleep(5000 + Math.floor(Math.random() * 2000));
      }
    }
  }

  console.log(`=== Session completed at ${new Date().toLocaleTimeString()} ===`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
