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
    // Topic chỉ tin khi JEV tự tin (topic_trusted); ngược lại dùng topic từ khóa
    // để tránh nhận nhãn lệch (general/en_itinerary trên bài tiếng Việt).
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
    seenUrls.add(url); // tránh quét lại (mỗi lần quét = 1 request JEV trả phí)
    return false;
  }
  const jev = await classifyContentWithJev(threadData.rootText, comments);
  const decision = decideInteraction(mode, keywordEval, jev);

  if (decision.action === 'skip') {
    console.log(`[Quality Gate] Aborted: ${url} ${decision.reason} (source: ${decision.source}). Skipping to protect brand relevance.`);
    seenUrls.add(url); // tránh quét lại (mỗi lần quét = 1 request JEV trả phí)
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
 * Pool picker: rotates through variants per slot, never picks the same one twice in a row.
 * slotKey = e.g. "en_solo:yeu_thich"
 */
const _poolState = {};
function pickFromPool(slotKey, variants) {
  if (!_poolState[slotKey]) _poolState[slotKey] = { idx: 0 };
  const state = _poolState[slotKey];
  const pick = variants[state.idx % variants.length];
  state.idx++;
  return pick;
}

/**
 * 5-Angle Gen Z Comment Engine with Season & Question Awareness
 * v2: 3 variants per (topic × angle) slot, rotating to prevent repetition.
 */
function generateGenZComment(text, enforcedAngle = null) {
  const angle = enforcedAngle || ANGLES[currentAngleIndex % ANGLES.length];
  currentAngleIndex++;

  const lower = text.toLowerCase();
  const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);

  // Helper: map angle key to Vietnamese display name
  const angleLabel = angle === 'yeu_thich' ? 'Yêu thích' : angle === 'nghi_ngo' ? 'Nghi ngờ' : angle === 'tu_hoi' ? 'Tự hỏi' : angle === 'tich_cuc' ? 'Tích cực' : 'Clickbait';

  // ======================================================================
  // ENGLISH COMMENT POOLS
  // ======================================================================
  if (!isVietnamese) {
    const isEnSolo = lower.includes('solo') || lower.includes('alone') || lower.includes('by myself');
    const isEnPhoto = lower.includes('photo') || lower.includes('visual') || lower.includes('camera') || lower.includes('picture') || lower.includes('instagram') || lower.includes('spot');
    const isEnItinerary = lower.includes('itinerary') || lower.includes('reco') || lower.includes('plan') || lower.includes('worth it') || lower.includes('day trip') || lower.includes('sapa') || lower.includes('how many days') || lower.includes('hotel') || lower.includes('suggest');
    const isEnFood = lower.includes('food') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('eat') || lower.includes('dish');

    // --- EN SOLO ---
    if (isEnSolo) {
      const pools = {
        yeu_thich: [
          "Huge respect for choosing Vietnam for your solo trip! Hanoi is remarkably safe, walkable, and welcoming to solo wanderers. Strolling around Hoan Kiem Lake at dawn ✨ will make you feel like you have the entire poetic city to yourself!",
          "Solo in Vietnam is honestly one of the best decisions you can make. The moment you sit on a tiny sidewalk stool ☕ watching the city wake up, you will know you picked the right place!",
          "Vietnam solo trips hit different because the locals genuinely treat you like family. A morning walk around the Old Quarter with an egg coffee in hand ✨ and you will forget you are traveling alone!"
        ],
        nghi_ngo: [
          "A lot of people worry that solo traveling in Vietnam feels overwhelming with street crossing. The secret is simple: walk at a calm steady pace, never step backwards, and the motorbikes will smoothly flow around you like water!",
          "Everyone says Vietnam is chaotic for solo travelers, but plot twist: the chaos has a rhythm. Once you stop fighting it and just walk steady ☕ the city starts making perfect sense!",
          "\"Is Vietnam safe for solo travelers?\" gets asked a million times. Honest answer: you will feel safer walking Hanoi at midnight than most major cities. The biggest danger is eating too much pho 🍜 honestly!"
        ],
        tu_hoi: [
          "Ever wonder why so many solo wanderers fall head over heels for Hanoi? It is that special feeling ☕ when you sit on a tiny sidewalk stool and a local vendor smiles like you are family.",
          "Something about Vietnam solo travel just rewires your brain. You arrive stressed, and somewhere between the third egg coffee and your first alley detour ☕ everything just clicks.",
          "What is it about Hanoi that turns a 5 day solo trip into \"maybe I should stay a month\"? Asking for literally every solo traveler who has ever visited 🤔"
        ],
        tich_cuc: [
          "Sending warmest wishes and safe travels for your solo journey! Vietnam has a unique way 💛 of making solo wanderers feel embraced and right at home everywhere they go.",
          "Solo travel is the ultimate gift you give yourself 💛 and Vietnam is going to reward that courage with incredible food, warm smiles, and views that stay with you forever!",
          "There is something magical about exploring a new country on your own terms. Vietnam will give you stories 💛 you will be telling for years. Have the best time!"
        ],
        clickbait: [
          "The real \"plot twist\" of solo travel in Vietnam: you think you might feel lonely, but within 2 days you will make friends in cozy alleyway cafes and wish you booked a month longer!",
          "Nobody warned me about the biggest risk of solo travel in Vietnam: you WILL fall in love with the country so hard that planning your return trip starts before you even leave 😭✈️",
          "Solo travel unpopular opinion: Vietnam is genuinely easier alone than with a group. You eat what you want, wander where you want, and somehow end up at the best hidden spots ☕ because you have no plan!"
        ]
      };
      const pool = pools[angle] || pools.clickbait;
      return { angle: angleLabel, text: pickFromPool(`en_solo:${angle}`, pool) };
    }

    // --- EN PHOTO ---
    if (isEnPhoto) {
      const pools = {
        yeu_thich: [
          "Hanoi is an absolute paradise for photography! The golden morning light filtering through century old French shutters 📸 creates an aesthetic that looks straight out of a classic Wong Kar Wai film!",
          "This visual is pure art! Vietnam has this magical quality where every random alley 📸 turns into a perfectly composed frame without even trying.",
          "Obsessed with this vibe! The light in Hanoi between 6:30 and 7:30 AM is genuinely unmatched ✨ it makes everything look like a film still, no editing needed."
        ],
        nghi_ngo: [
          "People think you need professional studio lighting for good photos here. Truth is, Hanoi natural early morning mist and quiet temple corners ✨ do all the storytelling on their own!",
          "Thought the Vietnam aesthetic was all filters and presets. Then I saw the actual golden hour on Phan Dinh Phung street at 6:45 AM 📸 and realized the camera was barely keeping up with reality!",
          "\"You edited this right?\" is the most common question about Hanoi photos. The actual answer is the city just looks like this at sunrise ✨ the editing is minimal!"
        ],
        tu_hoi: [
          "Ever wonder why every vintage corner in the Old Quarter looks like a movie still? Cannot decide whether the mossy yellow walls or the street vendors with flower bicycles 📸 make the better photo!",
          "How does Hanoi manage to make every single narrow alley photogenic? Other cities wish they had this kind of effortless aesthetic 📸 honestly!",
          "Sometimes I wonder if Hanoi was designed by a cinematographer. The layers of light, shadow, and texture in every corner ✨ are almost too perfect to be accidental."
        ],
        tich_cuc: [
          "This capture genuinely made my day! Vietnam through a camera lens ✨ is something everyone should experience at least once. Keep shooting, these are gorgeous!",
          "The way you caught this moment is beautiful 📸 Vietnam gives such generous light and texture to work with. Wishing you many more frames like this!",
          "Every photo from Vietnam tells a little story. This one has such warmth and honesty in it ✨ love seeing the country through fresh eyes!"
        ],
        clickbait: [
          "\"Hidden secret\" for the best photos in Hanoi: head to Phan Dinh Phung street at 6:45 AM before the crowds arrive. The light at that hour is genuinely 📸 cinematic perfection!",
          "The one photography hack nobody shares about Hanoi: skip the tourist viewpoints entirely. Walk into any random residential alley at golden hour 📸 and you will get frames that look professionally art directed!",
          "Plot twist for photographers visiting Vietnam: the most beautiful shots are not at the famous spots. They are in the 6 AM alleys where grandmas brew coffee and cats sleep on motorbikes 📸🐱"
        ]
      };
      const pool = pools[angle] || pools.clickbait;
      return { angle: angleLabel, text: pickFromPool(`en_photo:${angle}`, pool) };
    }

    // --- EN ITINERARY ---
    if (isEnItinerary) {
      const pools = {
        yeu_thich: [
          "Such a well planned route! For Sapa, 2 days is great for Fansipan peak and trekking through Ta Van village. For Hanoi, catch the 6:30 AM sunbeams ✨ on Phan Dinh Phung, pure magic!",
          "Love this itinerary energy! One tip that makes a huge difference: leave your first Hanoi morning completely open ✨ the best discoveries happen when you are not rushing to the next pin.",
          "Solid plan! The real game changer for North Vietnam trips is adding one buffer day with zero agenda. That is usually when the best food finds and photo moments happen ✨"
        ],
        nghi_ngo: [
          "Skip the overpriced tourist spots! In Hanoi, an authentic egg coffee at Cafe Dinh overlooking the lake beats crowded cafes every time. In Sapa, an eco lodge in Ta Van gives you the real \"hidden gem\" tranquility.",
          "Hot take: half the \"must visit\" spots in Hanoi tourist guides are actually skippable. The real magic is in the unplanned alleys, the 6 AM markets, and that random pho shop 🍜 your taxi driver swears by!",
          "Unpopular opinion: a perfect Vietnam itinerary has at least 2 days with nothing scheduled. Those are the days you find the egg coffee spot with no English menu ☕ and the view that is not on any blog."
        ],
        tu_hoi: [
          "How do you fit Hanoi, Sapa, AND Ha Long Bay without it feeling like a sprint? Honestly, choosing slow mornings over more checkpoints ☕ usually makes the whole trip feel twice as long in the best way!",
          "The eternal Vietnam itinerary dilemma: see everything in 7 days or actually enjoy 3 places properly? Having done both ☕ I can confirm the slow version wins every time.",
          "Real question: does anyone actually regret skipping one tourist spot to spend an extra morning wandering quiet alleys with coffee? Never heard of it happening ☕"
        ],
        tich_cuc: [
          "This route is going to be incredible! North Vietnam has a way of exceeding every expectation 💛 especially when you give yourself room to breathe between the highlights!",
          "What an exciting trip ahead! Vietnam rewards travelers who stay curious and open 💛 you are going to come back with the best stories. Enjoy every moment!",
          "The fact that you are planning this carefully means you are already set for an amazing trip 💛 Vietnam is going to surprise you in the best ways!"
        ],
        clickbait: [
          "Pro tip for your itinerary: do not rush Hanoi in just 1 day! The real charm 🤫 hides in the quiet residential alleys between 6:30 AM and 8:00 AM before the motorbikes take over.",
          "The #1 itinerary mistake in Vietnam: scheduling every hour. The best meal you will eat, the best photo you will take, and the best conversation you will have 🤫 will all happen during unplanned time!",
          "Insider tip that most travel blogs will not tell you: book your Sapa hotel in Ta Van village instead of Sapa town 🤫 you wake up to rice terraces and clouds instead of tourist shops. Thank me later!"
        ]
      };
      const pool = pools[angle] || pools.clickbait;
      return { angle: angleLabel, text: pickFromPool(`en_itinerary:${angle}`, pool) };
    }

    // --- EN FOOD ---
    if (isEnFood) {
      const pools = {
        yeu_thich: [
          "Get ready for a flavor explosion! Street food in Hanoi is elite, especially sitting on a low plastic stool 🍜 sipping hot pho broth on a cool autumn morning!",
          "Vietnam street food is genuinely life changing! The first time you eat bun cha on a tiny sidewalk table 🍜 with the charcoal smoke drifting past, you will understand why people keep coming back.",
          "The food scene in Vietnam is unreal! Pro tip: the best meals are almost always at the places with plastic stools, no menu in English 🍜 and a line of locals waiting."
        ],
        nghi_ngo: [
          "Do not be intimidated by the tiny alleyway eateries! The rule of thumb in Hanoi: if you see local elders sitting on little blue chairs eating, walk right in, the food is 100% authentic and delicious.",
          "\"Is street food safe in Vietnam?\" is the most asked question and the answer is almost always yes. Those tiny stalls with the highest local turnover 🍜 are fresher than most restaurant kitchens!",
          "Forget the restaurants with English menus and AC. The real Hanoi food experience is squeezing onto a plastic stool in an alley 🍜 pointing at what the person next to you is eating, and being amazed every single time!"
        ],
        tu_hoi: [
          "Ever wonder why Hanoi coffee culture is so addictive? Having an authentic egg coffee ☕ tucked away in a quiet second floor balcony just completely stops time.",
          "Why does a 50 cent bowl of pho from a street vendor somehow taste better than any pho you have ever had at a proper restaurant? Vietnam food logic ☕ is beautifully unfair!",
          "How is it possible that a city this small has this many incredible food spots? Every single alley in Hanoi hides at least one dish 🍜 that will genuinely change your standards forever."
        ],
        tich_cuc: [
          "Wishing you the tastiest culinary journey in Vietnam! May every bowl of pho and cup of coffee bring pure warmth 💛 to your soul.",
          "Vietnam food adventures are the best kind of adventures 💛 your taste buds are about to go on the trip of a lifetime. Enjoy every bite!",
          "The food in Vietnam is one of those things that connects everyone 💛 you will sit down with strangers, share a meal, and leave feeling like old friends."
        ],
        clickbait: [
          "Warning: Hanoi street food will completely ruin all other food for you! Make sure to try bun cha on Hang Quat street 🍜 and egg coffee on Nguyen Huu Huan before leaving!",
          "Nobody tells you this but the biggest expense in Vietnam is not hotels or tours, it is that you will eat 6 meals a day because everything costs $2 and tastes incredible 🍜😭",
          "The one food rule in Hanoi that has never failed me: if the stool is tiny, the menu is handwritten, and there is a queue of locals at 7 AM, sit down immediately 🍜 you are about to have the best meal of your trip!"
        ]
      };
      const pool = pools[angle] || pools.clickbait;
      return { angle: angleLabel, text: pickFromPool(`en_food:${angle}`, pool) };
    }

    // --- EN GENERAL (fallback for English) ---
    const enGeneralPools = {
      yeu_thich: [
        "Literally obsessed with this capture! The morning light ✨ in Vietnam hits completely different, pure aesthetic perfection for real.",
        "This is the kind of content that makes you stop scrolling and just stare ✨ Vietnam really is that photogenic. No filter needed!",
        "Everything about this is gorgeous! Vietnam has a way of making ordinary moments look absolutely cinematic ✨ and you captured it perfectly."
      ],
      nghi_ngo: [
        "Honestly thought those misty morning reels were color graded to death, until I woke up at 6 AM and walked the quiet Old Quarter alleys myself. It genuinely is that dreamy!",
        "Was 100% convinced Vietnam travel content was overhyped until I actually went. Turns out the reality is somehow even more beautiful than the reels? Make it make sense 😭",
        "\"There is no way it actually looks like that\" is what I said before visiting Vietnam. Now I am the one posting sunset pics that people think are fake. The irony is real ☕"
      ],
      tu_hoi: [
        "Ever wonder why Vietnam feels more like a living poem than just a destination? Maybe it is that slow morning rhythm ☕ and the aroma of street coffee that literally stops time.",
        "What is it about Vietnam that makes people completely rethink their travel priorities? Everyone goes for a week and comes back wanting to live there ☕",
        "Genuine question: has anyone ever visited Vietnam and NOT immediately started planning their next trip back? Because I have never met that person 🤔"
      ],
      tich_cuc: [
        "This genuinely brought a smile to my face! Wishing you the most incredible time 💛 Vietnam has a way of filling your heart with warmth you did not know you needed.",
        "Love seeing people experience Vietnam for the first time 💛 the country has so much beauty, kindness, and unforgettable moments waiting for you!",
        "Sending the warmest vibes from Vietnam 💛 may your journey be full of unexpected discoveries, amazing food, and the kind of memories that last forever!"
      ],
      clickbait: [
        "The \"plot twist\" nobody warned you about Vietnam: you think you came for a quick 2 day visit ☕, but the hidden alleyway cafes and warm local smiles will make you want to cancel your flight back!",
        "Nobody talks about the real side effect of visiting Vietnam: a permanent craving for egg coffee, an unreasonable attachment to plastic stools, and an uncontrollable urge to book another flight 😭☕",
        "The thing about Vietnam that no travel guide mentions: it is not the sights that get you, it is the random Tuesday morning 🤫 when a stranger shares their coffee and tells you their life story. That is what makes you stay."
      ]
    };
    const pool = enGeneralPools[angle] || enGeneralPools.clickbait;
    return { angle: angleLabel, text: pickFromPool(`en_general:${angle}`, pool) };
  }

  // ======================================================================
  // VIETNAMESE COMMENT POOLS
  // ======================================================================
  const isHanoi = lower.includes('hanoi') || lower.includes('hà nội') || lower.includes('hoa sữa') || lower.includes('phố cổ') || lower.includes('hồ gươm') || lower.includes('phan đình phùng');
  const isPhotoTour = lower.includes('photo tour') || lower.includes('tour chụp') || lower.includes('thợ chụp') || lower.includes('chụp ảnh');
  const isMountain = lower.includes('hà giang') || lower.includes('cao bằng') || lower.includes('sapa') || lower.includes('tà xùa') || lower.includes('ninh bình') || lower.includes('mù cang chải');

  // Season & Inquiry Awareness: Ha Giang in November/December
  if (isMountain && (lower.includes('hà giang') || lower.includes('ha giang'))) {
    if (lower.includes('tháng 11') || lower.includes('tháng 12') || lower.includes('hoa gì') || lower.includes('hoa tam giác mạch')) {
      return {
        angle: 'Tư vấn bản địa',
        text: pickFromPool('vi_hagiang_season', [
          "Hà Giang cuối tháng 11 là trúng mùa hoa tam giác mạch 🌸 nở rộ khắp các triền đồi luôn bạn ơi! Lúc này trời chớm đông se lạnh cực thơ, nhớ mang theo áo khoác ấm và chuẩn bị máy ảnh để bắt trọn những góc hình visual tuyệt đẹp nha!",
          "Cuối tháng 11 lên Hà Giang là đúng chuẩn \"timing vàng\" nè! Hoa tam giác mạch 🌸 tím hồng phủ kín đồi, sáng sớm sương giăng mờ ảo, chỉ cần giơ máy lên là có ngay ảnh triệu view á!",
          "Tháng 11 lên Hà Giang là \"auto win\" về visual nha bạn! Hoa tam giác mạch nở rộ 🌸 kết hợp ruộng bậc thang vàng cuối mùa, trời se lạnh mặc áo len đi giữa hoa là có ảnh đẹp lung linh không cần chỉnh sửa gì luôn!"
        ])
      };
    }
  }

  // --- VI HANOI ---
  if (isHanoi) {
    const pools = {
      yeu_thich: [
        "U là trời cái visual này đúng là 🍂 \"chân ái\" mùa thu Hà Nội rồi sốp ơi! Nắng hanh vàng xiên qua kẽ lá đẹp \"mê xỉu up xỉu down\", ngắm qua màn hình thôi mà tim đập thình thịch muốn xách balo lên đi liền á!",
        "Visual Hà Nội mùa thu kiểu này nhìn là biết 🍂 \"chữa lành\" level max rồi nè! Cái cảm giác sáng sớm xách xe lượn Phan Đình Phùng lúc nắng vàng xiên qua sương, không filter nào đọ được ngoài đời á!",
        "Hà Nội mùa thu nó khác biệt kiểu: sáng ra hít một hơi không khí se lạnh 🍂 thoang thoảng hoa sữa là tự nhiên muốn gọi hết bạn bè lên đây liền. Visual tự nhiên thơ hơn cả phim á sốp ơi!"
      ],
      nghi_ngo: [
        "\"Ủa alo\" ban đầu tui cũng tưởng ảnh mạng lừa lọc màu mè thôi, tới hồi 6h sáng xách xe lượn 🍂 phố Hoàng Diệu, Phan Đình Phùng mới ngã ngửa: ủa sao ngoài đời nó còn thơ và tình hơn trên video dữ vậy trời =)))",
        "Trước tui cũng \"nghi ngờ nhân sinh\" lắm, nghĩ Hà Nội mùa thu chắc chỉ đẹp qua filter. Xong 6h sáng ra đường Hoàng Diệu thấy nắng 🍂 xiên qua hàng sấu, chịu thua luôn, thực tế đẹp hơn ảnh mạng á!",
        "Cứ tưởng team Hà Nội mùa thu là \"sống ảo\" chứ gì, tới hồi tự đi mới thấy: 6h30 sáng Phan Đình Phùng vắng tanh 🍂 sương mờ mờ, nắng vàng nhẹ, quay video không cần filter mà đã đẹp nức nở rồi =)))"
      ],
      tu_hoi: [
        "Nhiều khi tự hỏi không biết Hà Nội mùa thu có bùa mê thuốc lú gì không mà cứ chớm se lạnh là cả nước lại nhấp nhổm đòi bay ra? Chắc tại cái mùi hoa sữa thoang thoảng với cảm giác ngồi vỉa hè nhâm nhi ☕ ly cà phê trứng nó \"chữa lành\" tâm hồn quá chăng?",
        "Tự hỏi hoài sao Hà Nội mùa thu cứ quay video bất kỳ góc nào cũng ra cinematic dữ vậy ta? Không biết là do thời tiết, do ánh sáng, hay do cái thành phố này nó \"tình\" từ trong xương ra vậy ☕?",
        "Có ai giải thích giúp tui tại sao cứ tháng 9, 10 là lại cuống cuồng muốn bay ra Hà Nội không? Rõ ràng đã đi 5 lần rồi mà năm nào cũng \"sốt ruột\" y hệt 🍂 bùa Hà Nội mùa thu mạnh quá trời!"
      ],
      tich_cuc: [
        "Thấy bài này là thấy cả một bầu trời \"an yên\" rồi! Gửi một \"chiếc ôm ấm áp\" 💛 từ Hà Nội, chúc bạn có chuyến đi ngập tràn niềm vui, ăn được nhiều món ngon và gom về thật nhiều khoảnh khắc đáng nhớ nhé!",
        "Ngắm Hà Nội qua góc nhìn của bạn ấm áp quá đi 💛 chúc hành trình luôn thuận buồm xuôi gió, gom về nhiều ảnh đẹp và kỷ niệm ngọt ngào nha!",
        "Hà Nội chào đón bạn bằng gió mùa thu se lạnh và những ly cà phê nóng hổi đó 💛 chúc chuyến đi này là chuyến đi đáng nhớ nhất trong năm nha bạn ơi!"
      ],
      clickbait: [
        "\"Khoan dừng khoảng chừng là 2s\"! Đừng dại dột ra đường Phan Đình Phùng chụp ảnh lúc 9h hoặc 10h sáng nếu không muốn chen chúc trong biển người. Muốn visual thơ mộng 🤫 như phim Vương Gia Vệ thì bí quyết duy nhất là: canh đúng khung giờ 6h15 đến 7h30 sáng!",
        "\"Bật mí nhỏ\" cho ai sắp ra Hà Nội: đừng đi thẳng ra Hoàn Kiếm, hãy rẽ vào các ngõ nhỏ phố cổ lúc 6h sáng khi trời còn mờ sương 🤫 visual level \"Wong Kar-wai\" mà không cần thuê quay phim đâu!",
        "Plot twist: cái chỗ chụp ảnh đẹp nhất Hà Nội mùa thu không phải Phan Đình Phùng đâu, mà là con đường Hoàng Diệu lúc 6h15 sáng 🤫 vắng, nắng xiên, lá rụng. Biết rồi thì đừng nói ai nha!"
      ]
    };
    const pool = pools[angle] || pools.clickbait;
    return { angle: angleLabel, text: pickFromPool(`vi_hanoi:${angle}`, pool) };
  }

  // --- VI PHOTO TOUR ---
  if (isPhotoTour) {
    const pools = {
      yeu_thich: [
        "Gu chụp này \"đỉnh nóc kịch trần\" luôn nè! Team mê ảnh đẹp 📸 như TravelFrame tụi mình nhìn là mê đắm đuối, đi du lịch mà có người bắt được góc visual tự nhiên thế này thì tha hồ \"flex\" cả năm không hết á!",
        "Visual bộ ảnh này chất lượng quá trời luôn! Đi du lịch mà có ảnh chụp tự nhiên 📸 kiểu này thì về nhà \"flex\" cả năm không hết á, đẹp từng khoảnh khắc luôn!",
        "Ảnh đẹp quá sốp ơi, từng tấm đều giữ được cái hồn của khoảnh khắc 📸 tự nhiên và chân thật. Đi du lịch gom về bộ ảnh thế này thì khỏi cần filter chi cho mệt!"
      ],
      nghi_ngo: [
        "Nhiều người hay nghi ngờ đi du lịch thuê thợ chụp cùng chi cho tốn tiền hay \"sượng trân\". Tới lúc tự chụp 📸 bằng gậy selfie dính nọng cằm mới thấy: có photo riêng kiêm bạn local nó là một đẳng cấp \"cứu rỗi\" hoàn toàn chuyến đi ạ!",
        "\"Thuê thợ chụp đi chơi sao mà tự nhiên được?\" Ủa thì vấn đề là bạn chọn đúng thợ local 📸 biết dẫn đi ngõ ngách, vừa chụp vừa kể chuyện, tự nhiên ra hết á!",
        "Tưởng photo tour chỉ là mấy tấm ảnh pose cứng giữa phố. Ai ngờ đi xong mới hiểu: người dẫn local 📸 biết lúc nào nắng đẹp, góc nào vắng, chụp lúc mình cười tự nhiên, đó mới là ảnh đáng giá!"
      ],
      tu_hoi: [
        "Tự hỏi sao đi solo thì dễ mà tìm được đứa bạn có tâm canh góc chụp ảnh không dìm hàng nó lại khó ngang lên trời vậy ta? Photo tour sinh ra là để \"cứu rỗi\" nhân loại nè =)))",
        "Tự hỏi sao mọi người đi du lịch mà ảnh lúc nào cũng đẹp long lanh vậy ta 📸? Hóa ra bí mật là có bạn local đi cùng canh góc, bắt khoảnh khắc tự nhiên, còn mình thì chỉ cần \"vui chơi hết mình\" thôi á!",
        "Có ai tự hỏi sao tự chụp hoài không bao giờ đẹp bằng ảnh travel creator chụp giúp không? Đáp án: vì bạn không thấy 📸 khoảnh khắc tự nhiên nhất của chính mình, cần có ai đó bắt hộ!"
      ],
      tich_cuc: [
        "Mỗi chuyến đi là một món quà tuyệt vời cho chính mình sau chuỗi ngày nỗ lực. Ảnh đẹp 📸 chỉ là phần thưởng thêm, cảm xúc đọng lại mới là vô giá nè!",
        "Chuyến đi nào cũng xứng đáng được lưu giữ bằng những tấm ảnh chân thật 📸 và tràn đầy cảm xúc. Chúc bạn gom về thật nhiều khoảnh khắc đáng nhớ nha!",
        "Đi du lịch mà có ảnh đẹp mang về là bonus lớn nhất rồi 📸 chúc bạn có thêm nhiều chuyến đi trọn vẹn và tràn đầy năng lượng tích cực nha!"
      ],
      clickbait: [
        "\"Bí mật không ai nói cho bạn\": Đi du lịch một mình không sợ buồn, chỉ sợ lúc về không có tấm ảnh nào ra hồn để \"flex\" =))) Giải pháp là book ngay bạn local photographer dắt đi ngõ ngách, vừa có ảnh cinematic vừa bao ăn sập phố xá luôn!",
        "Plot twist: tấm ảnh du lịch đẹp nhất không phải ảnh pose ở landmark, mà là lúc bạn đang ăn phở 🍜 sáng, mồ hôi lấm tấm, cười toe toét. Cần ai đó chụp khoảnh khắc đó hộ thôi!",
        "\"Cảnh báo nhẹ\": thuê thợ chụp local đi cùng một lần rồi sẽ không bao giờ muốn tự chụp selfie nữa đâu 📸 biết trước nói trước, đừng trách =)))"
      ]
    };
    const pool = pools[angle] || pools.clickbait;
    return { angle: angleLabel, text: pickFromPool(`vi_photo:${angle}`, pool) };
  }

  // --- VI MOUNTAIN ---
  if (isMountain) {
    if (angle === 'yeu_thich') {
      if (lower.includes('lúa') || lower.includes('mù cang chải') || lower.includes('hoàng su phì')) {
        return {
          angle: 'Yêu thích',
          text: pickFromPool('vi_mountain_lua:yeu_thich', [
            "Mùa lúa chín 🌾 vàng óng ả nhìn ngoài đời choáng ngợp gấp 10 lần trong ảnh luôn á! Cảnh sắc quê hương mình đẹp muốn xỉu, chúc sốp có chuyến đi visual \"10 điểm không có nhưng\" nha!",
            "Ruộng bậc thang mùa lúa chín 🌾 lúc nắng sáng chiếu xiên vàng rực thì camera nào chụp cũng đẹp luôn á! Thiên nhiên mình \"max visual\" tới mức không cần chỉnh sửa gì!",
            "Lúa chín vàng rực cả thung lũng 🌾 nhìn ngoài đời mà tim đập thình thịch luôn á bạn ơi! Quê hương mình đẹp tới mức ảnh mạng chụp \"có tâm\" cỡ nào cũng không diễn tả hết được!"
          ])
        };
      }
      return {
        angle: 'Yêu thích',
        text: pickFromPool('vi_mountain:yeu_thich', [
          "Cảnh sắc núi rừng miền Bắc ⛰️ ngắm ngoài đời thực sự choáng ngợp hơn nhiều so với ảnh mạng á! Không khí trong lành mát rượi, chúc bạn có một chuyến đi visual \"10 điểm không có nhưng\" nha!",
          "Vùng cao miền Bắc mùa này ⛰️ visual đỉnh tới mức giơ điện thoại lên quay bừa cũng ra clip triệu view á! Chúc sốp có chuyến đi gom về thật nhiều khoảnh khắc tuyệt đẹp nha!",
          "Núi rừng Tây Bắc đúng là \"thiên đường\" cho team mê cảnh đẹp ⛰️ mỗi khúc cua lại mở ra một bức tranh mới, đẹp tới mức cứ đứng ngẩn người ra ngắm thôi!"
        ])
      };
    }
    const mountainPools = {
      nghi_ngo: [
        "Ai bảo đi vùng cao mùa này vất vả đâu bước ra đây? Mở mắt ra thấy ☁️ biển mây bồng bềnh ngay trước mặt là thấy mọi mệt mỏi tan biến hết trơn á, \"nghi ngờ nhân sinh\" sao cảnh vật đẹp dữ thần luôn!",
        "Trước tui cũng sợ lên vùng cao đường xá khó đi lắm. Đi xong mới thấy: ủa mệt thật nhưng mà cái khoảnh khắc ☁️ sáng sớm mở mắt ra thấy biển mây, nó \"bù\" hết mọi vất vả luôn á!",
        "\"Lên Tây Bắc chi cho cực\" tui hay nghe câu này lắm. Xong lên tới nơi thấy cảnh ⛰️ hùng vĩ tới mức quên luôn 6 tiếng ngồi xe, chỉ biết \"ơ trời ơi đẹp quá\" thôi =)))"
      ],
      tu_hoi: [
        "Đứng giữa mây trời ⛰️ Tây Bắc tự hỏi: mình cày cuốc deadline cả năm để làm gì nếu không dành ra vài ngày lên đây đứng thở giữa thiên nhiên bao la thế này nhỉ?",
        "Tự hỏi sao mỗi lần lên vùng cao là cảm giác như được \"reset\" lại toàn bộ tâm hồn vậy ⛰️? Có lẽ không khí trong lành và sự yên tĩnh nó chữa lành thật sự!",
        "Có ai lên tới đỉnh đèo, ngắm mây trôi bồng bềnh ⛰️ rồi tự hỏi: sao mình không lên đây sớm hơn ta? Thôi muộn còn hơn không, đi ngay và luôn!"
      ],
      tich_cuc: [
        "Việt Nam mình ở đâu con người cũng ấm áp và cảnh sắc thì tuyệt mỹ. Chúc hành trình của bạn luôn thuận buồm xuôi gió và đầy ắp những nụ cười bản địa rạng rỡ nha!",
        "Vùng cao miền Bắc mùa nào cũng có cái đẹp riêng 💛 chúc bạn có chuyến đi an toàn, gom về thật nhiều kỷ niệm và ảnh visual \"đỉnh nóc\" nha!",
        "Cung đường nào mà đi bằng cả đam mê thì cung đường đó sẽ đẹp gấp đôi 💛 chúc bạn tận hưởng trọn vẹn từng khúc cua, từng bình minh vùng cao nha!"
      ],
      clickbait: [
        "\"Plot twist\" cực mạnh: Lên Tây Bắc mùa này đừng chỉ mải chụp lúa, hãy thức dậy lúc 5h30 sáng ngắm khói lam chiều quyện sương sớm ở các bản làng 🤫 visual đó mới là thứ khiến bạn nổi da gà vì quá đẹp!",
        "\"Bật mí\" cho ai sắp lên Tây Bắc: dậy lúc 5h sáng leo lên điểm cao nhất gần homestay 🤫 lúc sương tan, biển mây hiện ra, visual lúc đó chỉ có mình bạn và trời đất, camera nào cũng thành máy ảnh chuyên nghiệp!",
        "Đi vùng cao mà không dậy trước bình minh thì bỏ phí phân nửa chuyến đi rồi nha 🤫 cái khoảnh khắc mặt trời ló ra sau đỉnh núi lúc 5h45, sương tan dần, ruộng bậc thang hiện rõ, visual đó không filter nào tạo nổi!"
      ]
    };
    const pool = mountainPools[angle] || mountainPools.clickbait;
    return { angle: angleLabel, text: pickFromPool(`vi_mountain:${angle}`, pool) };
  }

  // --- VI GENERAL (fallback for Vietnamese) ---
  const viGeneralPools = {
    yeu_thich: [
      "Mỗi bước chân khám phá đều mang lại trải nghiệm vô giá ✨ nè! Chúc bạn gom về thật nhiều bức ảnh kỷ niệm tuyệt đẹp và những khoảnh khắc đáng nhớ nha!",
      "Visual bài này đẹp quá sốp ơi ✨ nhìn là biết đi du lịch bằng cả trái tim luôn á! Chúc có thêm nhiều chuyến đi tuyệt vời như vậy nha!",
      "Hình ảnh và năng lượng bài này tích cực quá ✨ xem xong là muốn xách balo lên đi ngay! Chúc bạn luôn giữ được đam mê khám phá nha!"
    ],
    nghi_ngo: [
      "Ban đầu tui cũng hoài nghi mấy bài review khen nức nở, tới hồi đặt chân đến trải nghiệm mới thấy: hóa ra người ta khen còn hơi khiêm tốn đấy chứ ngoài đời đỉnh hơn nhiều á!",
      "Trước tui cũng hay \"hmm thật không ta\" với mấy bài travel đẹp quá. Tới hồi tự đi mới giật mình: ủa ngoài đời còn đẹp hơn ảnh, thật mà! =)))",
      "\"Chắc photoshop chứ gì\" tui cũng từng nghĩ vậy. Xong tới nơi mới thấy: không chỉ đẹp bằng mà còn đẹp hơn ảnh, kèm theo cái cảm giác gió mát, mùi cỏ cây, không filter nào diễn tả nổi!"
    ],
    tu_hoi: [
      "Có ai như tui không, cứ mỗi lần stress công việc là lại tự hỏi sao mình chưa xách balo lên và đi trốn đến một góc phố lạ để \"sạc lại năng lượng\" ta? ✨",
      "Tự hỏi sao đi du lịch về xong thì tuần đầu tiên làm việc hiệu quả gấp đôi ta ✨? Có khi \"sạc pin\" bằng chuyến đi mới là cách chăm sóc bản thân đúng nghĩa nhất!",
      "Nhiều khi tự hỏi: mình tiết kiệm tiền để làm gì nếu không phải để đổi lấy những trải nghiệm và khoảnh khắc đáng nhớ nhỉ ✨? Đi thôi, không cần lý do!"
    ],
    tich_cuc: [
      "Năng lượng tích cực 💛 ngập tràn luôn á! Chúc bạn luôn giữ được ngọn lửa đam mê khám phá và có thêm thật nhiều hành trình trọn vẹn yêu thương nha!",
      "Xem bài của bạn xong thấy lòng nhẹ nhõm 💛 và muốn đi du lịch ngay luôn á! Chúc bạn luôn vui vẻ, khỏe mạnh và có thêm nhiều chuyến đi đáng nhớ nha!",
      "Mỗi chuyến đi đều là một phiên bản \"nâng cấp\" của mình 💛 cảm ơn bạn vì đã chia sẻ năng lượng tích cực, chúc hành trình tiếp theo còn tuyệt vời hơn nữa nha!"
    ],
    clickbait: [
      "\"Cảnh báo nhẹ\": Đi du lịch mùa này nguy cơ tăng 2kg là có thật vì ẩm thực ngõ ngách thơm nức mũi 🤫! Bí kíp sinh tồn là cứ thấy quán nào bàn ghế nhựa con con toàn người già ngồi ăn là auto tấp vào, 100% \"ngon nhức nách\" luôn!",
      "\"Plot twist\" kinh điển của dân du lịch: đặt vé bay về rồi mà đêm cuối vẫn ước \"giá mà ở thêm 3 ngày\" 😭 thôi lần sau book dài hơn nha, trust me!",
      "\"Bật mí\" cho ai chưa biết: đi du lịch Việt Nam không cần lịch trình dày cộm 🤫 chỉ cần một buổi sáng thong thả, một quán cà phê vỉa hè, và bước chân đi theo bụng (theo nghĩa đen, đến đâu có quán ngon thì dừng), vậy là đủ chuyến đi hoàn hảo!"
    ]
  };
  const pool = viGeneralPools[angle] || viGeneralPools.clickbait;
  return { angle: angleLabel, text: pickFromPool(`vi_general:${angle}`, pool) };
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
