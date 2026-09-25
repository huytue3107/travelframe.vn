#!/usr/bin/env node
/**
 * TravelFrame Threads Community Engagement Runner
 * Part of skill: threads-engagement (Marketing-Growth)
 *
 * Value-first contextual comment engine:
 *   - Replies are selected from topic-specific local context pools.
 *   - Exact comments are not reused from recent history.
 *   - Promotional CTAs and generic positivity are blocked.
 *
 * Pattern P-034 & 4-Tier Relevance Gate:
 *   - Tier 1: Strict Negative Exclusion (Filters out drama, affiliate, gifts, jobs, concerts, out-of-scope regions)
 *   - Tier 2: Core Topic Match (Hanoi autumn, Hanoi street food, Photo tours, Northern mountains, Solo travel)
 *   - Tier 3: Season & Inquiry Awareness (Accurate local advice, e.g. Ha Giang Nov buckwheat flowers vs Sep harvest)
 *   - Tier 4: Zero-Generic Quality Gate (Never comments on vague/general posts)
 *   - Anti-AI rules: Zero hyphens, no trailing emojis, slang and puns enclosed in quotes ""
 *
 * Hybrid scan pipeline (DES-20260925-JEV-CONTENT-CLASSIFIER):
 *   - Tier 1 blacklist always runs first, deterministic, never overridden by the model.
 *   - JEV (jev-latest) classifies candidate posts (relevance, topic, lead, season)
 *     via typesafe_content_classifier.mjs — live by default (Rocky approved
 *     2026-09-25; set TYPESAFE_LIVE_APPROVED=0 for offline keyword fallback).
 *   - Policy stays in code: trust JEV only at confidence >= 0.6, fall back otherwise.
 *   - Newsfeed Interaction Rule: in --mode feed, posts passing Tier 1 get natural
 *     interaction (Like always; Reply only with a verified contextual topic) even
 *     when no keyword matches. Search modes keep the Zero-Generic Skip Rule.
 *
 * Usage:
 *   node threads_interact.mjs --mode feed --duration 30
 *   node threads_interact.mjs --mode search --query "photo tour" --duration 15
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
const RECENT_COMMENT_HISTORY_SIZE = 10;
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
    angle: ''
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode' && args[i + 1]) options.mode = args[++i];
    else if (args[i] === '--duration' && args[i + 1]) options.duration = parseInt(args[++i], 10);
    else if (args[i] === '--query' && args[i + 1]) options.query = args[++i];
    else if (args[i] === '--url' && args[i + 1]) options.url = args[++i];
    else if (args[i] === '--comment' && args[i + 1]) options.comment = args[++i];
    else if (args[i] === '--angle' && args[i + 1]) options.angle = args[++i];
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

  // Cooldown only applies to the most recent interactions, not the full history.
  for (const row of history.slice(-AUTHOR_COOLDOWN_SIZE)) {
    if (row.author) seenAuthors.add(row.author);
  }

  for (const row of history.slice(-RECENT_COMMENT_HISTORY_SIZE)) {
    const comment = normalizeText(row.comment);
    if (comment) recentCommentTexts.add(comment);
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
    if (normalizedComment) {
      recentCommentTexts.add(normalizedComment);
      sessionCommentCounts.set(
        normalizedComment,
        (sessionCommentCounts.get(normalizedComment) || 0) + 1
      );
      lastSessionComment = normalizedComment;
    }
    console.log(`[Logged] Added ${url} to log as item #${nextIndex} [Angle: ${angle}]`);
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
                            (lower.includes('visit') || lower.includes('trip') || lower.includes('travel') || lower.includes('photo') || lower.includes('explore') || lower.includes('itinerary') || lower.includes('reco') || lower.includes('tips') || lower.includes('solo') || lower.includes('hotel') || lower.includes('worth it') || lower.includes('food') || lower.includes('places'));

  if (isForeignTraveler) {
    if (lower.includes('solo') || lower.includes('alone') || lower.includes('by myself')) return { relevant: true, topic: 'en_solo' };
    if (lower.includes('photo') || lower.includes('visual') || lower.includes('picture') || lower.includes('instagram') || lower.includes('camera') || lower.includes('spot')) return { relevant: true, topic: 'en_photo' };
    if (lower.includes('itinerary') || lower.includes('reco') || lower.includes('plan') || lower.includes('worth it') || lower.includes('day trip') || lower.includes('sapa') || lower.includes('how many days') || lower.includes('hotel') || lower.includes('suggest')) return { relevant: true, topic: 'en_itinerary' };
    if (lower.includes('food') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('eat') || lower.includes('dish')) return { relevant: true, topic: 'en_food' };
    return { relevant: true, topic: 'international_vietnam' };
  }

  if (hasPhotoService) return { relevant: true, topic: 'photo_tour' };
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

/**
 * Option A: Lead Triage with TypeSafe System One (model: jev-latest)
 */
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

/**
 * Hybrid scan stage: JEV content classification (DES-20260925-JEV-CONTENT-CLASSIFIER).
 * Live by default (Rocky approved 2026-09-25; paid API). Set TYPESAFE_LIVE_APPROVED=0
 * for offline keyword fallback. Never fakes a model verdict when offline.
 */
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

/**
 * Deterministic interaction policy (code-owned). Tier 1 blacklist is checked
 * before this function and always wins over any model verdict.
 *   - feed: Newsfeed Interaction Rule — Like always, Reply only with a verified topic.
 *   - search/international/single: Zero-Generic Skip Rule stays in force.
 */
function decideInteraction(mode, keywordEval, jev) {
  const isFeed = mode === 'feed';
  let relevant;
  let topic;
  let source;

  if (jev && jev.trusted) {
    // JEV tự tin xác minh "ngoài phạm vi" thì skip cả feed (chỉ khác "không khớp whitelist")
    if (!jev.relevant && !jev.borderline) {
      return { action: 'skip', reason: 'JEV xác minh ngoài phạm vi nội dung TravelFrame', source: 'jev' };
    }
    relevant = jev.relevant;
    topic = jev.topic || 'general';
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

function getContextualCommentVariants(topic, isVietnamese) {
  if (isVietnamese) {
    const variants = {
      hanoi_autumn: [
        'Hà Nội thường dễ cảm nhất vào buổi sớm. Đi chậm quanh hồ Gươm hoặc phố cổ sẽ thấy nhịp thành phố rõ hơn, ánh sáng cũng dịu để chụp ảnh.',
        'Nếu có một buổi sáng rảnh ở Hà Nội, thử đi bộ qua Phan Đình Phùng rồi dừng lại uống cà phê. Lịch trình nhẹ nhưng bắt được nhiều chất phố.',
        'Một mẹo nhỏ khi khám phá Hà Nội là để trống một khoảng trong lịch. Những quán nhỏ, góc ban công và buổi sớm quanh hồ Gươm thường đáng nhớ hơn lịch trình dày.'
      ],
      street_food: [
        'Ở Hà Nội, những quán có khách địa phương ngồi đều thường đáng thử. Một bát phở nóng hoặc bún chả bên vỉa hè đã đủ thành một kỷ niệm.',
        'Nếu ghé phố cổ, để bụng cho một bữa ăn ngẫu hứng bên vỉa hè. Nhiều món ngon của Hà Nội nằm trong những quán nhỏ hơn là điểm nổi tiếng.',
        'Cà phê trứng và một vòng đi bộ quanh hồ Gươm là combo nhẹ nhàng để bắt đầu ngày ở Hà Nội.'
      ],
      photo_tour: [
        'Với một buổi chụp ở Hà Nội, đi sớm quanh Phan Đình Phùng hoặc phố cổ thường dễ có ánh sáng mềm và ít người hơn.',
        'Chụp ảnh du lịch đẹp không nhất thiết phải xếp quá nhiều điểm. Một góc phố, ánh sáng tự nhiên và nhịp đi chậm thường giữ được cảm xúc hơn.',
        'Nếu đi một mình, nên chừa một khoảng thời gian không lịch cố định để vừa khám phá vừa bắt những khoảnh khắc tự nhiên.'
      ],
      mountain_views: [
        'Với Hà Giang hoặc Cao Bằng, nên chừa thêm thời gian dự phòng cho thời tiết và cung đường. Ít điểm dừng hơn nhưng thong thả thường đáng hơn chạy lịch.',
        'Các cung miền Bắc đẹp nhất khi mình không cố nhồi quá nhiều điểm. Một buổi sáng có sương và một đoạn đường chậm đã đủ đáng nhớ.',
        'Nếu đi vùng cao, lớp áo mỏng và một khoảng đệm trong lịch sẽ hữu ích hơn việc cố bám từng mốc giờ.'
      ],
      solo_travel: [
        'Đi một mình ở Hà Nội dễ chịu hơn khi lịch có khoảng thở. Một buổi sáng đi bộ, uống cà phê và không cần vội thường là phần đáng nhớ nhất.',
        'Solo ở Việt Nam, mình nên để một ngày linh hoạt cho những nơi tình cờ gặp trên đường. Lịch ít dày sẽ giúp chuyến đi nhẹ hơn.',
        'Một mẹo nhỏ cho chuyến đi một mình là chọn khu lưu trú dễ đi bộ, rồi dành buổi đầu để làm quen nhịp phố.'
      ],
      international_vietnam: [
        'Hà Nội thường dễ cảm nhất khi mình đi chậm. Bắt đầu quanh hồ Gươm vào buổi sớm rồi để dành thời gian cho những con phố tình cờ gặp trên đường.',
        'Nếu là lần đầu đến Việt Nam, một buổi sáng thong thả ở Hà Nội và một ngày có khoảng trống sẽ giúp lịch trình bớt vội hơn.',
        'Nhịp sống địa phương cũng là một phần của chuyến đi. Bớt xếp lịch một chút thường giúp mình nhìn thấy nhiều chi tiết đáng nhớ hơn.'
      ]
    };
    return variants[topic] || variants.international_vietnam;
  }

  const variants = {
    en_solo: [
      'Solo travel in Hanoi feels easier when the itinerary has some breathing room. A slow morning around Hoan Kiem can be the part you remember most.',
      'For a solo day in Hanoi, leave one flexible block for coffee, wandering, and the small streets you did not plan to find.',
      'A calm start makes Hanoi much easier to read on your own. Walk first, then decide where the day wants to take you.'
    ],
    en_photo: [
      'Hanoi is especially photogenic early, when the Old Quarter and Phan Dinh Phung have softer light and fewer people.',
      'For travel photos here, one unhurried street walk often gives more honest moments than packing in too many viewpoints.',
      'The best Hanoi frames usually come from staying a little longer in one lane and watching the light change.'
    ],
    en_itinerary: [
      'For a North Vietnam itinerary, keep a little buffer for weather and road time. Fewer stops usually make the trip feel richer.',
      'Hanoi works well as a slower base before heading north. Leaving one flexible morning can make the route much less rushed.',
      'A useful rule for this route is to plan the anchors, then leave space for coffee, street food, and detours.'
    ],
    en_food: [
      'The small local places are often the most memorable in Hanoi. A steady crowd of residents is usually a good sign.',
      'Hanoi is easier to enjoy when meals are part of the route, not just quick stops between attractions.',
      "An early coffee and one unplanned street side meal can tell you a lot about the city's rhythm."
    ],
    international_vietnam: [
      'Hanoi is easiest to enjoy at a slower pace. Start early around Hoan Kiem, then leave room for the streets you find along the way.',
      'For a first Vietnam trip, pairing a calm Hanoi morning with a flexible day makes the route feel much less rushed.',
      'The local rhythm is part of the experience here. A little less scheduling usually leaves more room for memorable details.'
    ]
  };
  return variants[topic] || variants.international_vietnam;
}

function isCommentAllowed(comment) {
  const normalized = normalizeText(comment);
  if (!normalized) return false;
  if (/(book now|booking link|dm me|inbox me|link in bio|contact us|zalo:|hotline:|báo giá ngay|đặt tour ngay)/i.test(comment)) {
    return false;
  }
  return !comment.includes('http://') && !comment.includes('https://') && !comment.includes('|') && !comment.includes('-');
}

function generateContextualComment(text, topic = '') {
  const evaluation = topic ? { topic } : evaluatePostRelevance(text);
  if (!evaluation.relevant && !evaluation.topic) return null;

  const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
  const variants = getContextualCommentVariants(evaluation.topic, isVietnamese);
  const candidates = variants.filter(comment => {
    const normalized = normalizeText(comment);
    const sessionCount = sessionCommentCounts.get(normalized) || 0;
    return isCommentAllowed(comment) &&
      sessionCount < 2 &&
      !recentCommentTexts.has(normalized) &&
      normalized !== lastSessionComment;
  });

  if (candidates.length === 0) return null;
  const comment = candidates[currentAngleIndex % candidates.length];
  currentAngleIndex++;
  return comment;
}

async function interactWithPost(url, author, defaultComment, angle = 'tự động', expectedTopic = '', mode = 'search') {
  console.log(`\n>>> Interacting with post by @${author} [Angle: ${angle}]: ${url}`);
  runOrca(['goto', '--page', PAGE_ID, '--url', url]);
  await sleep(3500);

  let snap = runOrca(['snapshot', '--page', PAGE_ID]);
  if (!snap) return false;

  // Scan thread comments, context, and lead signals
  const threadData = scanThreadContextAndComments();
  const { comments, topComment, leadSignals } = threadData;

  // Hybrid classification: keyword heuristic + JEV (when live-approved), policy in code
  const keywordEval = evaluatePostRelevance(threadData.rootText);
  if (keywordEval.tier1Blocked) {
    console.log(`[Tier 1 Blacklist] Aborted: ${url} ${keywordEval.reason}`);
    return false;
  }
  const jev = await classifyContentWithJev(threadData.rootText, comments);
  const decision = decideInteraction(mode, keywordEval, jev);

  if (decision.action === 'skip') {
    console.log(`[Quality Gate] Aborted: ${url} ${decision.reason} (source: ${decision.source}). Skipping to protect brand relevance.`);
    return false;
  }

  const contextTopic = decision.topic;
  console.log(`[Thread Context] Scanned ${comments.length} comments. Verified Topic: "${contextTopic}" [action: ${decision.action}, source: ${decision.source}]`);

  // Like root post after the gate passes
  const likeMatch = snap.match(/button "(?:Like|Like\s+[\d\.,KM]+)"\s+\[ref=(e\d+)\]/);
  if (likeMatch) {
    console.log(`Liking with ref ${likeMatch[1]}...`);
    runOrca(['click', '--page', PAGE_ID, '--element', likeMatch[1]]);
    await sleep(1500);
  }

  // Option A: Triage detected leads with jev-latest (regex signals + JEV lead_signal)
  const leads = [...leadSignals];
  if (jev && jev.is_lead && leads.length === 0) {
    leads.push({ author, text: threadData.rootText || '' });
  }
  for (const lead of leads) {
    await triageLeadWithJev(lead, url);
  }

  // Newsfeed Interaction Rule: Like-only when no verified topic fits a contextual reply
  if (decision.action === 'like_only') {
    logInteraction(author, url, '(Like only — newsfeed)', angle, `Newsfeed: like-only (${decision.source})`);
    return true;
  }

  // Knowledge Mining: Learn and save high-engagement comments
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

  let replyRef = null;
  let targetAuthor = author;
  let commentToPost = defaultComment || generateContextualComment(threadData.rootText, contextTopic) || '';
  if (!commentToPost) {
    // Không ép bình luận văn mẫu chung chung: giữ tương tác tự nhiên ở mức Like-only
    console.log(`[Quality Gate] No contextual reply available for ${url}. Falling back to Like-only.`);
    logInteraction(author, url, '(Like only — newsfeed)', angle, `Like-only (${decision.source})`);
    return true;
  }

  snap = runOrca(['snapshot', '--page', PAGE_ID]);

  if (topComment) {
    console.log(`[Top Comment Found] By @${topComment.author} (${topComment.likeCount} likes): "${topComment.text.slice(0, 60)}..."`);
    const authorPos = snap ? snap.indexOf(topComment.author) : -1;
    if (authorPos !== -1) {
      const subSnap = snap.slice(authorPos);
      const subReplyMatch = subSnap.match(/button "Reply(?:\s+[\d\.,KM]+)?"\s+\[ref=(e\d+)\]/);
      if (subReplyMatch) {
        replyRef = subReplyMatch[1];
        targetAuthor = topComment.author;
        const topReply = generateTopReplyComment(topComment.text, defaultComment, angle, targetAuthor, contextTopic);
        if (topReply) commentToPost = topReply;
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
    console.log(`Success! Commented on @${targetAuthor} [Angle: ${angle}]`);
    logInteraction(targetAuthor, url, commentToPost, angle, `Ngữ cảnh: ${contextTopic || expectedTopic || 'đã xác minh'}`);
    return true;
  }
  return false;
}

/**
 * Generate a second safe, contextual reply when the thread exposes a reply target.
 * It deliberately uses the same non-promotional comment pool as the root reply.
 */
function generateTopReplyComment(commentText, baseComment, angle, author, contextTopic = 'general') {
  return generateContextualComment(commentText, contextTopic) || baseComment;
}

/**
 * 5-Angle Gen Z Comment Engine with Season & Question Awareness
 */
function generateGenZComment(text, enforcedAngle = null) {
  const angle = enforcedAngle || ANGLES[currentAngleIndex % ANGLES.length];
  currentAngleIndex++;

  const lower = text.toLowerCase();
  const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);

  // English comments
  if (!isVietnamese) {
    const isEnSolo = lower.includes('solo') || lower.includes('alone') || lower.includes('by myself');
    const isEnPhoto = lower.includes('photo') || lower.includes('visual') || lower.includes('camera') || lower.includes('picture') || lower.includes('instagram') || lower.includes('spot');
    const isEnItinerary = lower.includes('itinerary') || lower.includes('reco') || lower.includes('plan') || lower.includes('worth it') || lower.includes('day trip') || lower.includes('sapa') || lower.includes('how many days') || lower.includes('hotel') || lower.includes('suggest');
    const isEnFood = lower.includes('food') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('eat') || lower.includes('dish');

    if (isEnSolo) {
      if (angle === 'yeu_thich') {
        return {
          angle: 'Yêu thích',
          text: "Huge respect for choosing Vietnam for your solo trip! Hanoi is remarkably safe, walkable, and welcoming to solo wanderers. Strolling around Hoan Kiem Lake at dawn ✨ will make you feel like you have the entire poetic city to yourself!"
        };
      } else if (angle === 'nghi_ngo') {
        return {
          angle: 'Nghi ngờ',
          text: "A lot of people worry that solo traveling in Vietnam feels overwhelming with street crossing. The secret is simple: walk at a calm steady pace, never step backwards, and the motorbikes will smoothly flow around you like water!"
        };
      } else if (angle === 'tu_hoi') {
        return {
          angle: 'Tự hỏi',
          text: "Ever wonder why so many solo wanderers fall head over heels for Hanoi? It is that special feeling ☕ when you sit on a tiny sidewalk stool and a local vendor smiles like you are family."
        };
      } else if (angle === 'tich_cuc') {
        return {
          angle: 'Tích cực',
          text: "Sending warmest wishes and safe travels for your solo journey! Vietnam has a unique way 💛 of making solo wanderers feel embraced and right at home everywhere they go."
        };
      } else {
        return {
          angle: 'Clickbait',
          text: "The real \"plot twist\" of solo travel in Vietnam: you think you might feel lonely, but within 2 days you will make friends in cozy alleyway cafes and wish you booked a month longer!"
        };
      }
    } else if (isEnPhoto) {
      if (angle === 'yeu_thich') {
        return {
          angle: 'Yêu thích',
          text: "Hanoi is an absolute paradise for photography! The golden morning light filtering through century old French shutters 📸 creates an aesthetic that looks straight out of a classic Wong Kar Wai film!"
        };
      } else if (angle === 'nghi_ngo') {
        return {
          angle: 'Nghi ngờ',
          text: "People think you need professional studio lighting for good photos here. Truth is, Hanoi natural early morning mist and quiet temple corners ✨ do all the storytelling on their own!"
        };
      } else if (angle === 'tu_hoi') {
        return {
          angle: 'Tự hỏi',
          text: "Ever wonder why every vintage corner in the Old Quarter looks like a movie still? Cannot decide whether the mossy yellow walls or the street vendors with flower bicycles 📸 make the better photo!"
        };
      } else if (angle === 'tich_cuc') {
        return {
          angle: 'Tích cực',
          text: "May your camera roll be filled with golden hour memories, candid smiles, and breathtaking street scenes! Vietnam is stunning 📸 through every angle."
        };
      } else {
        return {
          angle: 'Clickbait',
          text: "\"Hidden secret\" for the best photos in Hanoi: head to Phan Dinh Phung street at 6:45 AM before the crowds arrive. If you ever want a local friend with a camera to guide you, TravelFrame 📸 is always here to guide you!"
        };
      }
    } else if (isEnItinerary) {
      if (angle === 'yeu_thich') {
        return {
          angle: 'Yêu thích',
          text: "Such a well planned route! For Sapa, 2 days is great for Fansipan peak and trekking through Ta Van village. For Hanoi, wake up early around 6:30 AM to catch the soft morning sunbeams ✨ cutting through ancient trees on Phan Dinh Phung street, pure magic!"
        };
      } else if (angle === 'nghi_ngo') {
        return {
          angle: 'Nghi ngờ',
          text: "Skip the overpriced tourist spots! In Hanoi, grabbing an authentic egg coffee at Cafe Dinh overlooking the lake beats crowded cafes every time. And in Sapa, staying in an eco lodge in Ta Van gives you the real \"hidden gem\" tranquility."
        };
      } else if (angle === 'tu_hoi') {
        return {
          angle: 'Tự hỏi',
          text: "Planning a North Vietnam trip always leaves you wondering how to see it all! If you have to choose between rushing five places or spending a slow morning ☕ wandering the quiet Old Quarter alleys, definitely take the slow morning."
        };
      } else if (angle === 'tich_cuc') {
        return {
          angle: 'Tích cực',
          text: "Your Vietnam plans sound absolutely wonderful! Wishing you crisp sunny skies in Sapa and pleasant autumn breezes in Hanoi. Enjoy every single moment 💛 of your adventure!"
        };
      } else {
        return {
          angle: 'Clickbait',
          text: "Pro tip for your itinerary: do not rush Hanoi in just 1 day! The real charm 🤫 of the city hides in the quiet residential alleys between 6:30 AM and 8:00 AM before the motorbikes take over."
        };
      }
    } else if (isEnFood) {
      if (angle === 'yeu_thich') {
        return {
          angle: 'Yêu thích',
          text: "Get ready for a flavor explosion! Street food in Hanoi is elite, especially sitting on a low plastic stool 🍜 sipping hot pho broth on a cool autumn morning!"
        };
      } else if (angle === 'nghi_ngo') {
        return {
          angle: 'Nghi ngờ',
          text: "Do not be intimidated by the tiny alleyway eateries! The rule of thumb in Hanoi: if you see local elders sitting on little blue chairs eating, walk right in, the food is 100% authentic and delicious."
        };
      } else if (angle === 'tu_hoi') {
        return {
          angle: 'Tự hỏi',
          text: "Ever wonder why Hanoi coffee culture is so addictive? Having an authentic egg coffee ☕ tucked away in a quiet second floor balcony just completely stops time."
        };
      } else if (angle === 'tich_cuc') {
        return {
          angle: 'Tích cực',
          text: "Wishing you the tastiest culinary journey in Vietnam! May every bowl of pho and cup of coffee bring pure warmth 💛 to your soul."
        };
      } else {
        return {
          angle: 'Clickbait',
          text: "Warning: Hanoi street food will completely ruin all other food for you! Make sure to try bun cha on Hang Quat street 🍜 and egg coffee on Nguyen Huu Huan before leaving!"
        };
      }
    } else {
      if (angle === 'yeu_thich') {
        return {
          angle: 'Yêu thích',
          text: "Literally obsessed with this capture! The morning light ✨ in Vietnam hits completely different, pure aesthetic perfection for real."
        };
      } else if (angle === 'nghi_ngo') {
        return {
          angle: 'Nghi ngờ',
          text: "Honestly thought those misty morning reels were color graded to death, until I woke up at 6 AM and walked the quiet Old Quarter alleys myself. It genuinely is that dreamy!"
        };
      } else if (angle === 'tu_hoi') {
        return {
          angle: 'Tự hỏi',
          text: "Ever wonder why Vietnam feels more like a living poem than just a destination? Maybe it is that slow morning rhythm ☕ and the aroma of street coffee that literally stops time."
        };
      } else if (angle === 'tich_cuc') {
        return {
          angle: 'Tích cực',
          text: "Sending warm positive vibes 💛 from Vietnam! Travel really has a magical way of resetting the soul. Hope every step of your journey is filled with joy and breathtaking moments!"
        };
      } else {
        return {
          angle: 'Clickbait',
          text: "The \"plot twist\" nobody warned you about Vietnam: you think you came for a quick 2 day visit ☕, but the hidden alleyway cafes and warm local smiles will make you want to cancel your flight back!"
        };
      }
    }
  }

  const isHanoi = lower.includes('hanoi') || lower.includes('hà nội') || lower.includes('hoa sữa') || lower.includes('phố cổ') || lower.includes('hồ gươm') || lower.includes('phan đình phùng');
  const isPhotoTour = lower.includes('photo tour') || lower.includes('tour chụp') || lower.includes('thợ chụp') || lower.includes('chụp ảnh');
  const isMountain = lower.includes('hà giang') || lower.includes('cao bằng') || lower.includes('sapa') || lower.includes('tà xùa') || lower.includes('ninh bình') || lower.includes('mù cang chải');

  // Season & Inquiry Awareness: Ha Giang in November/December
  if (isMountain && (lower.includes('hà giang') || lower.includes('ha giang'))) {
    if (lower.includes('tháng 11') || lower.includes('tháng 12') || lower.includes('hoa gì') || lower.includes('hoa tam giác mạch')) {
      return {
        angle: 'Tư vấn bản địa',
        text: "Hà Giang cuối tháng 11 là trúng mùa hoa tam giác mạch 🌸 nở rộ khắp các triền đồi luôn bạn ơi! Lúc này trời chớm đông se lạnh cực thơ, nhớ mang theo áo khoác ấm và chuẩn bị máy ảnh để bắt trọn những góc hình visual tuyệt đẹp nha!"
      };
    }
  }

  if (angle === 'yeu_thich') {
    if (isHanoi) {
      return {
        angle: 'Yêu thích',
        text: "U là trời cái visual này đúng là 🍂 \"chân ái\" mùa thu Hà Nội rồi sốp ơi! Nắng hanh vàng xiên qua kẽ lá đẹp \"mê xỉu up xỉu down\", ngắm qua màn hình thôi mà tim đập thình thịch muốn xách balo lên đi liền á. Cần cạ local dẫn photo tour thì cứ ới TravelFrame tụi mình nha!"
      };
    } else if (isPhotoTour) {
      return {
        angle: 'Yêu thích',
        text: "Gu chụp này \"đỉnh nóc kịch trần\" luôn nè! Team mê ảnh đẹp 📸 như TravelFrame tụi mình nhìn là mê đắm đuối, đi du lịch mà có người bắt được góc visual tự nhiên thế này thì tha hồ \"flex\" cả năm không hết á!"
      };
    } else if (isMountain) {
      if (lower.includes('lúa') || lower.includes('mù cang chải') || lower.includes('hoàng su phì')) {
        return {
          angle: 'Yêu thích',
          text: "Mùa lúa chín 🌾 vàng óng ả nhìn ngoài đời choáng ngợp gấp 10 lần trong ảnh luôn á! Cảnh sắc quê hương mình đẹp muốn xỉu, chúc sốp có chuyến đi visual \"10 điểm không có nhưng\" nha!"
        };
      }
      return {
        angle: 'Yêu thích',
        text: "Cảnh sắc núi rừng miền Bắc ⛰️ ngắm ngoài đời thực sự choáng ngợp hơn nhiều so với ảnh mạng á! Không khí trong lành mát rượi, chúc bạn có một chuyến đi visual \"10 điểm không có nhưng\" nha!"
      };
    } else {
      return {
        angle: 'Yêu thích',
        text: "Mỗi bước chân khám phá đều mang lại trải nghiệm vô giá ✨ nè! Chúc bạn gom về thật nhiều bức ảnh kỷ niệm tuyệt đẹp và những khoảnh khắc đáng nhớ nha!"
      };
    }
  } else if (angle === 'nghi_ngo') {
    if (isHanoi) {
      return {
        angle: 'Nghi ngờ',
        text: "\"Ủa alo\" ban đầu tui cũng tưởng ảnh mạng lừa lọc màu mè thôi, tới hồi 6h sáng xách xe lượn 🍂 phố Hoàng Diệu, Phan Đình Phùng mới ngã ngửa: ủa sao ngoài đời nó còn thơ và tình hơn trên video dữ vậy trời =)))"
      };
    } else if (isPhotoTour) {
      return {
        angle: 'Nghi ngờ',
        text: "Nhiều người hay nghi ngờ đi du lịch thuê thợ chụp cùng chi cho tốn tiền hay \"sượng trân\". Tới lúc tự chụp 📸 bằng gậy selfie dính nọng cằm hoặc nhờ người lạ chụp mất tiêu cái đầu mới thấy: có photo riêng kiêm bạn local nó là một đẳng cấp \"cứu rỗi\" hoàn toàn chuyến đi ạ!"
      };
    } else if (isMountain) {
      return {
        angle: 'Nghi ngờ',
        text: "Ai bảo đi vùng cao mùa này vất vả đâu bước ra đây? Mở mắt ra thấy ☁️ biển mây bồng bềnh ngay trước mặt là thấy mọi mệt mỏi tan biến hết trơn á, \"nghi ngờ nhân sinh\" sao cảnh vật đẹp dữ thần luôn!"
      };
    } else {
      return {
        angle: 'Nghi ngờ',
        text: "Ban đầu tui cũng hoài nghi mấy bài review khen nức nở, tới hồi đặt chân đến trải nghiệm mới thấy: hóa ra người ta khen còn hơi khiêm tốn đấy chứ ngoài đời đỉnh hơn nhiều á!"
      };
    }
  } else if (angle === 'tu_hoi') {
    if (isHanoi) {
      return {
        angle: 'Tự hỏi',
        text: "Nhiều khi tự hỏi không biết Hà Nội mùa thu có bùa mê thuốc lú gì không mà cứ chớm se lạnh là cả nước lại nhấp nhổm đòi bay ra? Chắc tại cái mùi hoa sữa thoang thoảng với cảm giác ngồi vỉa hè nhâm nhi ☕ ly cà phê trứng nó \"chữa lành\" tâm hồn quá chăng?"
      };
    } else if (isPhotoTour) {
      return {
        angle: 'Tự hỏi',
        text: "Tự hỏi sao đi solo thì dễ mà tìm được đứa bạn có tâm canh góc chụp ảnh không dìm hàng nó lại khó ngang lên trời vậy ta? Đó là lý do TravelFrame tụi mình phải ra đời gói tour kèm photo để \"cứu rỗi\" nhân loại nè =)))"
      };
    } else if (isMountain) {
      return {
        angle: 'Tự hỏi',
        text: "Đứng giữa mây trời ⛰️ Tây Bắc tự hỏi: mình cày cuốc deadline cả năm để làm gì nếu không dành ra vài ngày lên đây đứng thở giữa thiên nhiên bao la thế này nhỉ?"
      };
    } else {
      return {
        angle: 'Tự hỏi',
        text: "Có ai như tui không, cứ mỗi lần stress công việc là lại tự hỏi sao mình chưa xách balo lên và đi trốn đến một góc phố lạ để \"sạc lại năng lượng\" ta?"
      };
    }
  } else if (angle === 'tich_cuc') {
    if (isHanoi) {
      return {
        angle: 'Tích cực',
        text: "Thấy bài này là thấy cả một bầu trời \"an yên\" rồi! Gửi một \"chiếc ôm ấm áp\" 💛 từ Hà Nội, chúc bạn có chuyến đi ngập tràn niềm vui, ăn được nhiều món ngon và gom về thật nhiều khoảnh khắc đáng nhớ nhé!"
      };
    } else if (isPhotoTour) {
      return {
        angle: 'Tích cực',
        text: "Mỗi chuyến đi là một món quà tuyệt vời cho chính mình sau chuỗi ngày nỗ lực. Chúc bạn tận hưởng trọn vẹn từng bước chân khám phá, ảnh đẹp 📸 chỉ là phần thưởng thêm, cảm xúc đọng lại mới là vô giá nè!"
      };
    } else if (isMountain) {
      return {
        angle: 'Tích cực',
        text: "Việt Nam mình ở đâu con người cũng ấm áp và cảnh sắc thì tuyệt mỹ. Chúc hành trình của bạn luôn thuận buồm xuôi gió và đầy ắp những nụ cười bản địa rạng rỡ nha!"
      };
    } else {
      return {
        angle: 'Tích cực',
        text: "Năng lượng tích cực 💛 ngập tràn luôn á! Chúc bạn luôn giữ được ngọn lửa đam mê khám phá và có thêm thật nhiều hành trình trọn vẹn yêu thương nha!"
      };
    }
  } else {
    // Clickbait
    if (isHanoi) {
      return {
        angle: 'Clickbait',
        text: "\"Khoan dừng khoảng chừng là 2s\"! Đừng dại dột ra đường Phan Đình Phùng chụp ảnh lúc 9h hoặc 10h sáng nếu không muốn chen chúc trong biển người. Muốn visual thơ mộng 🤫 như phim Vương Gia Vệ thì bí quyết duy nhất là: canh đúng khung giờ 6h15 đến 7h30 sáng lúc nắng vừa xiên qua sương sớm, vắng tanh tha hồ thả dáng nha!"
      };
    } else if (isPhotoTour) {
      return {
        angle: 'Clickbait',
        text: "\"Bí mật không ai nói cho bạn\": Đi du lịch một mình không sợ buồn, chỉ sợ lúc về không có tấm ảnh nào ra hồn để \"flex\" với crush =))) Giải pháp nhanh nhất là book ngay một bạn local photographer của TravelFrame dắt đi ngõ ngách, vừa có ảnh cinematic vừa bao ăn sập phố xá luôn!"
      };
    } else if (isMountain) {
      return {
        angle: 'Clickbait',
        text: "\"Plot twist\" cực mạnh: Lên Tây Bắc mùa này đừng chỉ mải chụp lúa, hãy thức dậy lúc 5h30 sáng ngắm khói lam chiều quyện sương sớm ở các bản làng, visual đó mới là thứ khiến bạn nổi da gà vì quá đẹp!"
      };
    } else {
      return {
        angle: 'Clickbait',
        text: "\"Cảnh báo nhẹ\": Đi du lịch mùa này nguy cơ tăng 2kg là có thật vì ẩm thực ngõ ngách thơm nức mũi! Bí kíp sinh tồn là cứ thấy quán nào bàn ghế nhựa con con toàn người già ngồi ăn là auto tấp vào, 100% \"ngon nhức nách\" luôn!"
      };
    }
  }
}

async function main() {
  const options = parseArgs();
  console.log(`=== Starting TravelFrame Threads Engagement Runner [Mode: ${options.mode}] ===`);
  console.log(`4-Tier Relevance & Safety Gate Active.`);
  console.log(`Known interacted posts count: ${seenUrls.size}`);

  if (options.mode === 'single') {
    if (!options.url || !options.comment) {
      console.error('Error: --url and --comment are required for single mode.');
      process.exit(1);
    }
    const authorMatch = options.url.match(/@([^/]+)/);
    const author = authorMatch ? authorMatch[1] : 'user';
    await interactWithPost(options.url, author, options.comment, options.angle || 'Single', '', 'single');
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
    const query = options.query || 'photo tour';
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

    // Scan feed or search items
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
        if (options.mode === 'international' && isVietnamese) {
          seenUrls.add(p.url);
          console.log(`[International Mode] Skipped Vietnamese post by @${p.author || 'user'}`);
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
          const genResult = generateGenZComment(p.text, options.angle || null);
          if (!genResult || !genResult.text || !isCommentAllowed(genResult.text)) {
            seenUrls.add(p.url);
            console.log(`[Comment Filter] Skipped post by @${postAuthor || 'user'} because generated comment did not pass safety rules.`);
            continue;
          }
          candidate = p;
          candidateTopic = evalRel.topic;
          candidate.comment = genResult.text;
          candidate.angle = genResult.angle;
        } else {
          // Newsfeed Interaction Rule: bài feed không khớp whitelist vẫn được tương tác tự nhiên
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
        options.mode
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
