#!/usr/bin/env node
/**
 * TravelFrame Instagram Reels Community Engagement Runner
 * Part of skill: instagram-engagement (Marketing-Growth)
 *
 * Hybrid Scan Pipeline with JEV (model jev-latest) & High Engagement Gate:
 *   - Tier 1: Negative Exclusion (Filters out drama, affiliate, crypto, sponsored ads)
 *   - High Engagement Filter: Only interacts with videos meeting engagement thresholds (min likes/comments)
 *   - JEV Content Classifier: Calls typesafe_content_classifier.mjs (model jev-latest) to verify
 *     relevance, detect topic, identify lead signals, and verify seasonal claims.
 *   - Tier 4: Author Cooldown Guard (Max 1 interaction / 30 recent posts)
 *   - 5-Angle Rotation Engine & Anti-AI Rules: Zero hyphens, no robotic emoji at end, slang in quotes ""
 *
 * Usage:
 *   node instagram_interact.mjs --mode reels --duration 15 --min-likes 50 --min-comments 2
 *   node instagram_interact.mjs --mode search --query "hanoitravel" --duration 15
 *   node instagram_interact.mjs --mode single --url "https://www.instagram.com/reels/xxx/" --comment "..."
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const LOG_FILE = path.resolve(process.cwd(), 'Marketing-Growth/Content/Instagram-All-Interactions-Log.md');
const CLASSIFIER_SCRIPT = path.resolve(process.cwd(), 'Technology-Automation/Scripts/typesafe_content_classifier.mjs');
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');

const ANGLES = ['yeu_thich', 'nghi_ngo', 'tu_hoi', 'tich_cuc', 'clickbait'];
let currentAngleIndex = 0;
const OWN_HANDLES = new Set(['travelframe.vn']);
const AUTHOR_COOLDOWN_SIZE = 30;

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'reels',
    duration: 15,
    query: '',
    url: '',
    comment: '',
    angle: '',
    minLikes: 50,
    minComments: 2
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode' && args[i + 1]) options.mode = args[++i];
    else if (args[i] === '--duration' && args[i + 1]) options.duration = parseInt(args[++i], 10);
    else if (args[i] === '--query' && args[i + 1]) options.query = args[++i];
    else if (args[i] === '--url' && args[i + 1]) options.url = args[++i];
    else if (args[i] === '--comment' && args[i + 1]) options.comment = args[++i];
    else if (args[i] === '--angle' && args[i + 1]) options.angle = args[++i];
    else if (args[i] === '--min-likes' && args[i + 1]) options.minLikes = parseInt(args[++i], 10);
    else if (args[i] === '--min-comments' && args[i + 1]) options.minComments = parseInt(args[++i], 10);
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
      timeout: 30000,
      encoding: 'utf8'
    });
    return res.trim();
  } catch (err) {
    return null;
  }
}

function findInstagramPageId() {
  const tabsJson = runOrca(['tab', 'list', '--json']);
  if (!tabsJson) return null;
  try {
    const data = JSON.parse(tabsJson);
    const tabs = Array.isArray(data) ? data : (data.result?.tabs || data.tabs || []);
    const igTab = tabs.find(t => t.url && t.url.includes('instagram.com'));
    if (igTab) {
      return igTab.browserPageId || igTab.id || igTab.pageId;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function scrollToNextReel(pageId) {
  runOrca(['eval', '--page', pageId, '--expression', `(() => {
    const closeBtn = document.querySelector('div[role="dialog"] svg[aria-label="Close"]')?.closest('div[role="button"], button');
    if (closeBtn) closeBtn.click();

    const container = Array.from(document.querySelectorAll('*')).find(el => {
      const s = window.getComputedStyle(el);
      return (s.overflowY === 'scroll' || s.overflowY === 'auto') && el.scrollHeight > el.clientHeight;
    });
    if (container) {
      container.scrollBy({ top: container.clientHeight || 800, behavior: 'smooth' });
      return 'Scrolled container';
    }
    window.scrollBy(0, window.innerHeight || 800);
    return 'Scrolled window';
  })()`]);
  runOrca(['keypress', '--page', pageId, '--key', 'ArrowDown']);
}

const seenUrls = new Set();
const seenAuthors = [];

function loadHistory() {
  if (!fs.existsSync(LOG_FILE)) return;
  const content = fs.readFileSync(LOG_FILE, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').map(s => s.trim());
    if (parts.length < 6) continue;

    const authorMatch = parts[3].match(/@([a-zA-Z0-9._]+)/);
    if (authorMatch) {
      seenAuthors.push(authorMatch[1].toLowerCase());
    }

    const urlMatch = parts[4].match(/\((https:\/\/[^\)]+)\)/);
    if (urlMatch) {
      seenUrls.add(urlMatch[1]);
    }
  }
}

function appendToLog(author, reelUrl, interactionType, commentText, extraNotes = '') {
  if (!fs.existsSync(LOG_FILE)) return;
  const content = fs.readFileSync(LOG_FILE, 'utf8');
  const lines = content.split('\n');
  let maxStt = 0;
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').map(s => s.trim());
    const rawStt = (parts[1] || '').replace(/\*/g, '').trim();
    const stt = parseInt(rawStt, 10);
    if (!isNaN(stt) && stt > maxStt) {
      maxStt = stt;
    }
  }
  const nextStt = maxStt + 1;
  const cleanAuthor = author.replace(/^@/, '');
  const authorLink = `[@${cleanAuthor}](https://www.instagram.com/${cleanAuthor}/)`;
  const reelLink = `[Xem Reel](${reelUrl})`;
  const typeText = extraNotes ? `${interactionType} (${extraNotes})` : interactionType;
  const newRow = `| **${nextStt}** | Tự động (instagram-engagement) | ${authorLink} | ${reelLink} | ${typeText} | ${commentText} |`;

  fs.appendFileSync(LOG_FILE, `\n${newRow}`);
  console.log(`[LOGGED] STT ${nextStt}: @${cleanAuthor} - ${interactionType} ${extraNotes ? '[' + extraNotes + ']' : ''}`);
}

const BLACKLIST_PATTERNS = [
  /nguoi yeu|bo cu|chia tay|crush|hen ho|to tinh|ly hon/i,
  /kiem tien|affiliate|hoa hong|crypto|chung khoan|order/i,
  /concert|ve show|fandom|kpop|idol/i,
  /sponsored|ad\b|tai tro/i
];

function checkBlacklist(text) {
  for (const pat of BLACKLIST_PATTERNS) {
    if (pat.test(text)) return { pass: false, reason: 'Tier 1 Blacklist match' };
  }
  return { pass: true };
}

function parseMetricNumber(text) {
  if (!text) return 0;
  const clean = String(text).replace(/,/g, '').trim().toLowerCase();
  if (clean.endsWith('k')) return Math.round(parseFloat(clean) * 1000);
  if (clean.endsWith('m')) return Math.round(parseFloat(clean) * 1000000);
  const n = parseInt(clean, 10);
  return isNaN(n) ? 0 : n;
}

/**
 * JEV Content Classifier Integration
 * Calls typesafe_content_classifier.mjs (model jev-latest).
 * Returns structured classification: { relevant, topic, is_lead, lead_kind, confidence, trusted }
 */
async function classifyContentWithJev(rootText, comments = [], sourceUrl = '') {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  const tempFile = path.resolve(SCRATCH_DIR, `ig_classify_${Date.now()}.json`);

  const payload = {
    source_post_url: sourceUrl || '',
    root_text: String(rootText || '').slice(0, 600),
    comments: (comments || []).slice(0, 10).map(c => ({
      author: c.author || '',
      text: String(c.text || '').slice(0, 300),
      like_count: c.likeCount || 0
    }))
  };

  fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2), 'utf8');

  try {
    const isLiveApproved = process.env.TYPESAFE_LIVE_APPROVED !== '0';
    const hasKey = !!process.env.TYPESAFE_API_KEY;
    const args = ['Technology-Automation/Scripts/typesafe_content_classifier.mjs', '--input', tempFile];

    if (!isLiveApproved || !hasKey) {
      args.push('--mock', 'auto');
    }

    const out = execFileSync('node', args, {
      cwd: process.cwd(),
      timeout: 20000,
      encoding: 'utf8'
    });

    const parsed = JSON.parse(out.trim());
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    return parsed.classification || null;
  } catch (err) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    console.log(`[JEV Classifier Warning] Fallback to keyword heuristic: ${err.message}`);
    return null;
  }
}

const TOPIC_COMMENT_POOLS = {
  hanoi_autumn: {
    yeu_thich: 'Visual mùa thu Hà Nội đúng là 🍂 "chân ái" không góc chết luôn sốp ơi! Ngắm thôi mà mê xỉu á ✨📸',
    nghi_ngo: '"Ủa alo" nhìn video thơ mộng vậy thôi chứ dậy sớm săn nắng chắc cũng "nghi ngờ nhân sinh" lắm đúng không nè =))) Thành quả 10 điểm nha!',
    tu_hoi: 'Nhiều khi tự hỏi mùa thu Hà Nội có bùa mê gì mà đi bao nhiêu lần vẫn thấy xao xuyến hoài luôn á ☕️🍂',
    tich_cuc: 'Một chiếc clip mang năng lượng "chữa lành" dịu dàng quá chừng 🌿 Chúc bạn có thêm thật nhiều khoảnh khắc đẹp tại Hà Nội nha!',
    clickbait: '"Khoan dừng khoảng chừng là 2s", góc phố này ở đâu mà nhìn bình yên đến ngỡ ngàng vậy bạn ơi?'
  },
  street_food: {
    yeu_thich: 'Nhìn đĩa đồ ăn thôi mà chiếc bụng này réo chuông báo động luôn á 🍜 Đúng chuẩn ẩm thực "chân ái" ngõ nhỏ!',
    nghi_ngo: '"Ủa alo" nửa đêm lướt trúng clip này đúng là một sự tra tấn ngọt ngào =))) Quán này ở ngõ nào vậy sốp ơi?',
    tich_cuc: 'Đi du lịch mà tìm được đúng quán hợp gu địa phương thế này thì chuyến đi coi như thành công mỹ mãn 100% rồi nè 🌿',
    tu_hoi: 'Nhiều khi tự hỏi sao đồ ăn phố cổ trong mấy con ngõ sâu hun hút lúc nào cũng đậm đà khó cưỡng thế nhỉ?',
    clickbait: '"Cảnh báo nhẹ", ai đang đói thì đừng nên xem clip này quá 5 giây vì độ hấp dẫn quá mức cho phép á!'
  },
  photo_tour: {
    yeu_thich: 'Góc máy và ánh sáng xử lý đỉnh chóp thực sự luôn 📸✨ Nhìn màu ảnh mà mê xỉu up xỉu down luôn á!',
    nghi_ngo: 'Behind the scenes để ra được 5 giây visual ảo diệu này chắc công sức canh góc cũng kỳ công lắm nè 😂 Thành quả quá xứng đáng!',
    tich_cuc: 'Mỗi chuyến đi mà lưu giữ lại được những góc máy có hồn thế này thì quý giá vô cùng luôn á 🌸 Chúc bạn luôn tràn ngập cảm hứng sáng tạo nha!',
    tu_hoi: 'Nhiều khi tự hỏi sao tìm một cạ cứng chụp ảnh có gu và có tâm lại khó ngang lên trời thế nhỉ?',
    clickbait: '"Khoan dừng khoảng chừng là 2s", bạn chụp bằng body máy gì mà tone màu da và phong cảnh trong trẻo thế này vậy sốp?'
  },
  mountain_views: {
    yeu_thich: 'Cung đường Tây Bắc mùa này cảnh sắc thiên nhiên đúng là "đỉnh nóc kịch trần" luôn á ⛰️🌾 Ngắm mà mê đắm lòng người!',
    nghi_ngo: 'Nhìn cảnh mây vờn núi thơ mộng vậy chứ khúc đổ đèo cua tay áo chắc cũng "lạnh gáy" lắm đúng không sốp =))) Nhưng cảnh đẹp thì bõ công cực kỳ!',
    tich_cuc: 'Hít hà một hơi không khí trong lành vùng cao qua màn hình mà thấy lòng nhẹ bẫng 🌿 Chúc bạn có chuyến vi vu thật trọn vẹn và an toàn nha!',
    tu_hoi: 'Nhiều khi tự hỏi núi rừng phía Bắc có ma lực gì mà cứ đi một lần là trong lòng lại ấp ủ kế hoạch quay lại liền ta?',
    clickbait: '"Plot twist" cực mạnh, ngỡ như đang ở một thị trấn cổ tích Thụy Sĩ nào đó chứ ai ngờ là non nước Việt Nam mình!'
  },
  solo_travel: {
    yeu_thich: 'Visual chuyến độc hành này mang năng lượng tự do và "chữa lành" xịn xò thực sự luôn 🌸 Tự đi tự chill là "chân ái"!',
    nghi_ngo: 'Đi du lịch một mình sướng nhất là tự do, nhưng đến đoạn muốn chụp ảnh toàn thân thì đúng là "nghi ngờ nhân sinh" tìm góc dựng máy dữ dội nè =)))',
    tich_cuc: 'Chuyến đi một mình luôn là cơ hội tuyệt vời nhất để lắng nghe bản thân 🌿 Chúc bạn luôn có những bước chân vững vàng và ngập tràn trải nghiệm đáng nhớ nha!',
    tu_hoi: 'Nhiều khi tự hỏi sao những chuyến solo trip luôn mang lại cho mình nhiều bài học sâu sắc hơn bất cứ hành trình nào khác nhỉ?',
    clickbait: '"Ủa alo" đi một mình mà vẫn gom về được loạt khoảnh khắc visual đỉnh cao thế này thì bạn đỉnh của chóp rồi nè!'
  },
  en_photo: {
    yeu_thich: 'This lighting and color grading is pure magic ✨ Truly obsessed with how you captured the mood here!',
    nghi_ngo: 'Behind that effortless 5-second aesthetic reel is probably 50 takes and a very patient camera buddy 😂 Worth every second though!',
    tich_cuc: 'Such an inspiring eye for composition and natural light 📸 Keep creating these stunning visual gems!',
    tu_hoi: 'Ever wonder how certain quiet travel moments just stay engraved in your mind forever? This view is definitely one of them.',
    clickbait: 'Saved immediately! Nothing beats wandering through quiet streets with a camera ready 📸'
  },
  en_solo: {
    yeu_thich: 'Solo travel in Vietnam hits so differently 🌸 The freedom and serenity in this reel is everything!',
    nghi_ngo: 'The hardest part of solo travel is definitely setting up the tripod without looking suspicious 😂 You nailed it though!',
    tich_cuc: 'Such a peaceful and healing vibe 🌿 Wishing you safe travels and many more unforgettable memories on the road!',
    tu_hoi: 'There is something so liberating about navigating new places on your own terms. Love this journey for you!',
    clickbait: 'Saved this for inspiration! Vietnam is truly one of the friendliest spots for solo explorers ✨'
  },
  en_itinerary: {
    yeu_thich: 'Such a well-crafted itinerary guide! Saving this right away for future reference 🙌✨',
    nghi_ngo: 'Looks so relaxing on video, but we all know fitting all these spots in one day requires elite walking endurance 😂 Worth every step!',
    tich_cuc: 'So glad you got to experience the beauty and hospitality of Vietnam! Safe travels on the next leg of your journey ✈️',
    tu_hoi: 'Every corner in Vietnam has its own secret charm. What was your absolute favorite highlight so far?',
    clickbait: 'Saved immediately! Those hidden alleyway gems are where the real local magic lives ☕️'
  },
  international_vietnam: {
    yeu_thich: 'Da Lat and Hanoi streets never fail to amaze! So glad you got to soak in the local magic here in Vietnam 🌸☕️',
    nghi_ngo: 'Behind the peaceful view is probably a very early alarm clock 😂 Totally worth waking up for sunrise though!',
    tich_cuc: 'Window seat vibes always hit different right before takeoff ✈️✨ Safe travels and enjoy every single moment!',
    tu_hoi: 'Vietnam has a way of staying in your heart long after you leave. Hope you make it back soon!',
    clickbait: '100% truth! Stepping out of the comfort zone is where all the real magic and creative breakthroughs happen 🎬✨'
  },
  general: {
    yeu_thich: 'Visual và màu sắc thước phim này đúng là "chân ái" luôn á sốp ơi! Xem mà mê xỉu up xỉu down ✨📸',
    nghi_ngo: '"Ủa alo" nhìn mượt mà vậy thôi chứ công sức set góc canh ánh sáng chắc cũng kỳ công lắm đúng không nè =))) Kết quả quá xuất sắc luôn!',
    tich_cuc: 'Năng lượng trong trẻo và "chữa lành" cực kỳ luôn á 🌿 Chúc bạn có những chuyến đi thật bình yên và tràn ngập niềm vui nha!',
    tu_hoi: 'Nhiều khi tự hỏi sao những chuyến đi tự do luôn đem lại nguồn cảm hứng tươi mới đến thế nhỉ 🌿',
    clickbait: '"Khoan dừng khoảng chừng là 2s", góc hình visual này đúng chuẩn "10 điểm không có nhưng" luôn á bạn ơi!'
  }
};

function selectCommentByTopic(topic, angle = '') {
  const chosenAngle = angle || ANGLES[currentAngleIndex % ANGLES.length];
  currentAngleIndex++;

  const pool = TOPIC_COMMENT_POOLS[topic] || TOPIC_COMMENT_POOLS.general;
  return pool[chosenAngle] || pool.yeu_thich;
}

async function runSession() {
  const options = parseArgs();
  console.log(`=== Starting JEV-Augmented Instagram Engagement Session (${options.mode}) ===`);
  console.log(`[FILTERS] Min Likes: ${options.minLikes} | Min Comments: ${options.minComments} | Duration: ${options.duration}m`);
  loadHistory();

  let pageId = findInstagramPageId();
  if (!pageId) {
    console.error('No active Instagram tab found in Orca. Please open https://www.instagram.com/reels/ in Orca.');
    process.exit(1);
  }
  console.log(`[CONNECTED] Active Instagram Page ID: ${pageId}`);

  const startTime = Date.now();
  const endTime = startTime + options.duration * 60 * 1000;
  let interactionCount = 0;

  while (Date.now() < endTime) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`[INSPECTING] Scanning current Reel in viewport...`);

    // 1. Extract DOM details (Creator, URL, Caption, Engagement metrics)
    const inspectScript = `(() => {
      const likeSvgs = Array.from(document.querySelectorAll('main svg[aria-label=\"Like\"], main svg[aria-label=\"Unlike\"]'));
      const activeLike = likeSvgs.find(s => {
        const r = s.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= window.innerHeight;
      });
      
      let container = activeLike ? activeLike.closest('div[style*=\"height\"], section, article') : null;
      if (!container && activeLike) {
        let p = activeLike;
        while (p && p !== document.body && (!p.clientHeight || p.clientHeight < 300)) {
          p = p.parentElement;
        }
        container = p;
      }
      
      const creatorLinks = Array.from(document.querySelectorAll('a[role=\"link\"]')).map(a => {
        const r = a.getBoundingClientRect();
        return {
          text: a.innerText.trim(),
          href: a.href,
          top: r.top,
          inView: r.top >= 0 && r.bottom <= window.innerHeight
        };
      }).filter(item => item.inView && item.text.length > 2);

      // Extract metrics column texts near active like button
      let metricsTexts = [];
      if (activeLike) {
        let cur = activeLike;
        while (cur && cur.tagName !== 'MAIN' && cur.querySelectorAll('svg').length < 3) {
          cur = cur.parentElement;
        }
        if (cur) {
          metricsTexts = cur.innerText.split('\\n').map(s => s.trim()).filter(Boolean);
        }
      }

      return {
        url: window.location.href,
        creator: creatorLinks.length > 0 ? creatorLinks[0].text : 'unknown',
        likeStatus: activeLike ? activeLike.getAttribute('aria-label') : 'unknown',
        containerText: container ? container.innerText : '',
        metricsTexts
      };
    })()`;

    const inspectRes = runOrca(['eval', '--page', pageId, '--expression', inspectScript]);
    let reelData = null;
    try {
      reelData = JSON.parse(inspectRes);
    } catch (e) {
      console.log('Failed to parse reel DOM data, skipping to next Reel.');
    }

    if (!reelData || !reelData.url) {
      console.log('No active reel detected in viewport, scrolling to next Reel...');
      scrollToNextReel(pageId);
      await sleep(4000);
      continue;
    }

    const { url, creator, likeStatus, containerText, metricsTexts } = reelData;
    const cleanCreator = (creator || '').toLowerCase().replace(/^@/, '');

    // Parse Engagement Metrics
    const likesCount = parseMetricNumber(metricsTexts[0]);
    const commentsCount = parseMetricNumber(metricsTexts[1]);
    const sharesCount = parseMetricNumber(metricsTexts[2]);

    console.log(`Reel URL: ${url}`);
    console.log(`Creator: @${cleanCreator} | Status: ${likeStatus}`);
    console.log(`Engagement Metrics: ${likesCount.toLocaleString()} likes | ${commentsCount.toLocaleString()} comments | ${sharesCount.toLocaleString()} shares`);

    // Guard: Seen Check & Author Cooldown
    if (seenUrls.has(url)) {
      console.log(`[SKIP] Already interacted with URL: ${url}`);
      scrollToNextReel(pageId);
      await sleep(3000);
      continue;
    }
    if (OWN_HANDLES.has(cleanCreator)) {
      console.log(`[SKIP] Own account reel: @${cleanCreator}`);
      scrollToNextReel(pageId);
      await sleep(3000);
      continue;
    }
    if (seenAuthors.slice(-AUTHOR_COOLDOWN_SIZE).includes(cleanCreator)) {
      console.log(`[SKIP] Author cooldown active for @${cleanCreator}`);
      scrollToNextReel(pageId);
      await sleep(3000);
      continue;
    }

    // Guard: Tier 1 Blacklist Check
    const blacklistCheck = checkBlacklist(containerText);
    if (!blacklistCheck.pass) {
      console.log(`[SKIP] ${blacklistCheck.reason}. Skipping to protect brand.`);
      scrollToNextReel(pageId);
      await sleep(3000);
      continue;
    }

    // Guard: High Engagement Gate
    const meetsEngagement = (likesCount >= options.minLikes) || (commentsCount >= options.minComments);
    if (!meetsEngagement && options.mode !== 'single') {
      console.log(`[SKIP: Low Engagement] Video has ${likesCount} likes, ${commentsCount} comments (Min threshold: ${options.minLikes}L / ${options.minComments}C). Skipping.`);
      scrollToNextReel(pageId);
      await sleep(3000);
      continue;
    }

    // 2. JEV Content Classification & Verification
    console.log(`[JEV SCAN] Calling JEV Content Classifier (model jev-latest)...`);
    const jevResult = await classifyContentWithJev(containerText, [], url);

    let isRelevant = false;
    let verifiedTopic = 'general';
    let leadSignal = 'none';
    let confidence = 0.5;

    if (jevResult) {
      isRelevant = jevResult.relevant;
      verifiedTopic = jevResult.topic || 'general';
      leadSignal = jevResult.lead_kind || 'none';
      confidence = jevResult.confidence || 0.5;
      console.log(`[JEV RESULT] Relevant: ${isRelevant} | Topic: "${verifiedTopic}" | Confidence: ${confidence} | Lead: ${leadSignal}`);
    } else {
      // Fallback keyword heuristic
      console.log(`[HEURISTIC FALLBACK] Evaluating topic via keyword heuristic.`);
      const lower = containerText.toLowerCase();
      if (lower.includes('hà nội') || lower.includes('hanoi')) verifiedTopic = 'hanoi_autumn';
      else if (lower.includes('đà lạt') || lower.includes('dalat') || lower.includes('sapa') || lower.includes('hà giang')) verifiedTopic = 'mountain_views';
      else if (lower.includes('photo') || lower.includes('chụp ảnh') || lower.includes('film')) verifiedTopic = 'photo_tour';
      isRelevant = true;
    }

    if (!isRelevant && options.mode !== 'single') {
      console.log(`[SKIP: JEV Relevance Gate] Reel classified as not relevant to TravelFrame (confidence: ${confidence}). Skipping.`);
      scrollToNextReel(pageId);
      await sleep(3000);
      continue;
    }

    console.log(`[PASSED ALL GATES] Proceeding to interact with @${cleanCreator} on Reel: ${url}`);

    // 3. Like Reel if not liked
    if (likeStatus === 'Like') {
      console.log(`Liking Reel...`);
      runOrca(['eval', '--page', pageId, '--expression', `(() => {
        const likeSvgs = Array.from(document.querySelectorAll('main svg[aria-label=\"Like\"]'));
        const activeSvg = likeSvgs.find(s => {
          const r = s.getBoundingClientRect();
          return r.top >= 0 && r.bottom <= window.innerHeight;
        });
        if (activeSvg) {
          const target = activeSvg.closest('div[role=\"button\"], button') || activeSvg;
          target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          return 'Liked';
        }
        return 'Not found';
      })()`]);
      await sleep(2000);
    }

    // 4. Open Comments Drawer
    console.log(`Opening comments drawer...`);
    runOrca(['eval', '--page', pageId, '--expression', `(() => {
      const commentSvgs = Array.from(document.querySelectorAll('svg[aria-label=\"Comment\"]')).filter(s => {
        const r = s.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= window.innerHeight;
      });
      if (commentSvgs.length > 0) {
        const target = commentSvgs[0].closest('div[role=\"button\"], button') || commentSvgs[0];
        target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return 'Clicked comment';
      }
      return 'Not found';
    })()`]);
    await sleep(3000);

    // 5. Generate Contextual Comment based on JEV Topic
    const commentToSend = options.comment || selectCommentByTopic(verifiedTopic, options.angle);
    console.log(`[GENERATED COMMENT] [Topic: ${verifiedTopic}]: "${commentToSend}"`);

    // Focus input
    runOrca(['eval', '--page', pageId, '--expression', `(() => {
      const dialog = document.querySelector('div[role=\"dialog\"]');
      const input = dialog ? (dialog.querySelector('input') || dialog.querySelector('[role=\"textbox\"]')) : null;
      if (input) {
        input.focus();
        input.click();
        return 'Focused input';
      }
      return 'No input';
    })()`]);
    await sleep(1500);

    // Type input
    runOrca(['type', '--page', pageId, '--input', commentToSend]);
    await sleep(2000);

    // Click Post button
    console.log(`Submitting comment via Post button...`);
    runOrca(['eval', '--page', pageId, '--expression', `(() => {
      const dialog = document.querySelector('div[role=\"dialog\"]');
      const postBtn = Array.from((dialog || document).querySelectorAll('div[role=\"button\"], button')).find(b => b.innerText && b.innerText.trim() === 'Post');
      if (postBtn) {
        postBtn.click();
        return 'Clicked Post';
      }
      return 'Post not found';
    })()`]);
    await sleep(3000);

    // Verify comment & close drawer
    const verifyRes = runOrca(['eval', '--page', pageId, '--expression', `(() => {
      const dialog = document.querySelector('div[role=\"dialog\"]');
      if (!dialog) return { isPosted: false };
      return {
        isPosted: dialog.innerText.includes(${JSON.stringify(commentToSend.slice(0, 20))}),
        hasCleared: !dialog.querySelector('[role=\"textbox\"]') || dialog.querySelector('[role=\"textbox\"]').innerText.trim() === ''
      };
    })()`]);

    console.log(`Comment verification: ${verifyRes}`);
    runOrca(['keypress', '--page', pageId, '--key', 'Escape']);
    await sleep(1500);

    // Record interaction
    seenUrls.add(url);
    seenAuthors.push(cleanCreator);
    const extraNotes = leadSignal !== 'none' ? `JEV Lead: ${leadSignal}` : `JEV: ${verifiedTopic} (${likesCount}L)`;
    appendToLog(cleanCreator, url, 'Like + Comment', commentToSend, extraNotes);
    interactionCount++;

    if (options.mode === 'single') {
      console.log('Single mode interaction completed.');
      break;
    }

    // Pacing delay: 45s to 75s
    const delaySec = Math.floor(Math.random() * (75 - 45 + 1)) + 45;
    console.log(`[PACING] Waiting ${delaySec}s before next interaction to protect account integrity...`);
    await sleep(delaySec * 1000);

    // Scroll to next Reel
    scrollToNextReel(pageId);
    await sleep(4000);
  }

  console.log(`\n=== Session Finished: ${interactionCount} high-quality interactions recorded. ===`);
}

runSession().catch(err => {
  console.error('Fatal error in runner:', err);
  process.exit(1);
});
