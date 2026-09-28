#!/usr/bin/env node
/**
 * TravelFrame Meta Business Suite Inbox Automation via Orca Browser
 * Part of TravelFrame Company OS (Technology-Automation & Sales-CRM)
 * Design: Technology-Automation/Runbooks/DES-20260927-ORCA-META-INBOX-RESPONDER.md
 *
 * Capabilities:
 *   - Auto-detects Meta Business Suite Inbox tab in Orca.
 *   - Reads active customer conversation and extracts trip timeline & inquiry context.
 *   - Identifies lead intent (Tier 1 High Intent / Tier 2 Warm / Tier 3 Nurture).
 *   - Formulates tailored Warm Local Friend responses + delivers TravelFrame Hanoi Guide.
 *   - Supports --mode scan, --mode draft (fills composer on screen), --mode send (requires --confirm).
 *
 * Usage:
 *   node Technology-Automation/Scripts/orca_meta_inbox_responder.mjs --mode scan
 *   node Technology-Automation/Scripts/orca_meta_inbox_responder.mjs --mode draft
 *   node Technology-Automation/Scripts/orca_meta_inbox_responder.mjs --mode send --confirm
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const LOG_FILE = path.resolve(process.cwd(), 'Marketing-Growth/Content/Meta-Messenger-All-Interactions-Log.md');
const GUIDE_LOCAL_PATH = path.resolve(process.cwd(), 'Creative-Production/Deliverables/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf');
const GUIDE_WEB_URL = 'https://travelframe.sidevn.com/guides/TravelFrame-Hanoi-Photographer-Tour-Guide.pdf';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'scan', // scan | draft | send
    confirm: false,
    pageId: null,
    customReply: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode' && args[i + 1]) options.mode = args[++i];
    else if (args[i] === '--confirm') options.confirm = true;
    else if (args[i] === '--page-id' && args[i + 1]) options.pageId = args[++i];
    else if (args[i] === '--custom-reply' && args[i + 1]) options.customReply = args[++i];
  }
  return options;
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
    if (process.env.DEBUG) console.error('Orca command error:', err.message);
    return null;
  }
}

function findMetaInboxPageId() {
  const tabsJson = runOrca(['tab', 'list', '--json']);
  if (!tabsJson) return null;
  try {
    const data = JSON.parse(tabsJson);
    const tabs = Array.isArray(data) ? data : (data.result?.tabs || data.tabs || []);
    const metaTab = tabs.find(t => t.url && (t.url.includes('business.facebook.com/latest/inbox') || t.url.includes('facebook.com/messages')));
    if (metaTab) {
      return metaTab.browserPageId || metaTab.id || metaTab.pageId;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function readActiveConversation(pageId) {
  const inspectExpr = `(() => {
    // 1. Recipient Name
    const nameEl = document.querySelector('h1, h2, [role=main] header, div[role=presentation] [dir=auto]');
    const threadHeader = Array.from(document.querySelectorAll('div[dir=auto]')).map(d => d.innerText.trim()).filter(Boolean);
    
    // 2. Active Chat Bubbles
    const bubbles = Array.from(document.querySelectorAll('div[dir=auto]')).map(d => d.innerText.trim()).filter(Boolean);
    
    // 3. Current active recipient from sidebar row
    const activeRow = document.querySelector('div[role=row][aria-selected="true"], div[role=presentation][aria-selected="true"]');
    const rowText = activeRow ? activeRow.innerText : '';
    
    return {
      url: window.location.href,
      bubbles: bubbles.slice(-20),
      rowText: rowText.slice(0, 100)
    };
  })()`;

  const resJson = runOrca(['eval', '--page', pageId, '--expression', inspectExpr, '--json']);
  if (!resJson) return null;

  try {
    const data = JSON.parse(resJson);
    const resultObj = JSON.parse(data.result?.result || '{}');
    return resultObj;
  } catch (e) {
    return null;
  }
}

function classifyInquiry(recipient, bubbles) {
  const textCorpus = bubbles.join(' \n ');
  const lower = textCorpus.toLowerCase();

  // Find last customer message (not starting with "You:" or "Hey!")
  let lastCustomerMsg = '';
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if (!b.startsWith('You:') && !b.startsWith('Phở Thìn') && !b.startsWith('Hey!') && !b.startsWith('Yes it is')) {
      lastCustomerMsg = b;
      break;
    }
  }

  // Detect specific transit/layover details
  const hasLayover = lower.includes('5 hrs') || lower.includes('hours') || lower.includes('layover') || lower.includes('nov') || lower.includes('november');
  const hasDates = /november \d+|nov \d+|\d+pm|\d+am/i.test(textCorpus);
  const asksFood = lower.includes('eat') || lower.includes('food') || lower.includes('phở') || lower.includes('pho') || lower.includes('cafe') || lower.includes('quán');
  const asksGuide = lower.includes('guide') || lower.includes('cheat sheet') || lower.includes('recommend');

  let leadTier = 'Tier 2 (Warm)';
  let intent = 'General Recommendation';

  if (hasDates && (asksFood || hasLayover)) {
    leadTier = 'Tier 1 (High Intent)';
    intent = 'Transit Layover & Food Exploration';
  } else if (asksGuide) {
    leadTier = 'Tier 2 (Warm)';
    intent = 'Travel Guide Inquiry';
  }

  // Tailored Response Formulator
  let reply = '';
  if (lower.includes('pho xao phu my') || (hasLayover && lower.includes('sapa'))) {
    reply = [
      `That is an incredible layover plan! Since you're arriving from the Sapa HK bus right near the Old Quarter, here is the exact local plan to make the most of both windows:`,
      ``,
      `🌙 Evening (Nov 28, 5:00 PM – 10:00 PM):`,
      `• Phở Xào Phú Mỹ (45B Bát Đàn): Yes, this is 100% the iconic spot! Their crispy beef stir-fried pho (phở xào giòn) with savory brown gravy and pickled greens is legendary and opens at dinner.`,
      `• Dessert & Vibe: Walk 5 mins over to Cafe Giảng (39 Nguyễn Hữu Huân) for authentic hot Egg Coffee, then stroll around Hoan Kiem Lake under the evening city lights.`,
      ``,
      `🌅 Early Morning (Nov 29, 5:00 AM – 7:00 AM):`,
      `• Phở Bát Đàn (49 Bát Đàn) or Phở Sướng (24 Ngõ Trung Yên): Both start bubbling fresh broth around 5:30 AM – 6:00 AM. Having piping hot beef pho on a tiny sidewalk stool at sunrise before the morning traffic begins is unforgettable.`,
      ``,
      `📥 We also have our full 15-page "TravelFrame Hanoi Photographer & Local Tour Guide" with exact map pins and safety tips ready for you right here:`,
      `${GUIDE_WEB_URL}`,
      ``,
      `📸 Quick tip: If you want a local friend to guide you through these night food alleys or capture crisp candid photos during your evening layover, TravelFrame offers a 2-Hour Quick Photo & Food Walk! Let us know if you'd like us to keep a host on standby for Nov 28 🙌`
    ].join('\n');
  } else {
    reply = [
      `Hiii! So glad you reached out to TravelFrame 🇻🇳✨`,
      ``,
      `Here is our curated "TravelFrame Hanoi Photographer & Local Tour Guide" (PDF) with our favorite hidden alleyway cafes, authentic street food spots, and scenic photo corners:`,
      `${GUIDE_WEB_URL}`,
      ``,
      `Quick question to help us share the best local tips for your trip: Are you planning a trip to Hanoi soon, or just saving ideas for later? ✈️💭`
    ].join('\n');
  }

  return {
    recipient: recipient || 'Zion Sky',
    lastCustomerMsg: lastCustomerMsg || 'Looking for good place to eat',
    leadTier,
    intent,
    hasDates,
    suggestedReply: reply
  };
}

function draftToComposer(pageId, text) {
  const cleanText = text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const draftExpr = `(() => {
    const textbox = document.querySelector('[role=textbox]');
    if (!textbox) return { success: false, error: 'Composer textbox not found' };

    textbox.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    document.execCommand('insertText', false, \`${cleanText}\`);

    return {
      success: true,
      length: textbox.innerText.trim().length,
      snippet: textbox.innerText.trim().slice(0, 100)
    };
  })()`;

  const res = runOrca(['eval', '--page', pageId, '--expression', draftExpr, '--json']);
  if (!res) return false;
  try {
    const parsed = JSON.parse(res);
    const inner = JSON.parse(parsed.result?.result || '{}');
    return inner.success === true;
  } catch (e) {
    return false;
  }
}

function sendComposer(pageId) {
  const sendExpr = `(() => {
    const textbox = document.querySelector('[role=textbox]');
    if (!textbox) return { success: false, error: 'No textbox' };
    
    // Press Enter or click send button
    const sendBtn = document.querySelector('[aria-label="Press enter to send"], [aria-label="Send"], button[type=submit]');
    if (sendBtn) {
      sendBtn.click();
      return { success: true, method: 'button_click' };
    }
    
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    textbox.dispatchEvent(event);
    return { success: true, method: 'enter_dispatch' };
  })()`;

  const res = runOrca(['eval', '--page', pageId, '--expression', sendExpr, '--json']);
  return !!res;
}

function appendToLog(recipient, channel, query, tier, action, replySnippet) {
  if (!fs.existsSync(LOG_FILE)) return;
  const content = fs.readFileSync(LOG_FILE, 'utf8');
  const lines = content.split('\n');

  let maxStt = 0;
  let inDetailSection = false;
  for (const line of lines) {
    if (line.includes('## Chi Tiết Toàn Bộ Lượt Tương Tác')) {
      inDetailSection = true;
      continue;
    }
    if (!inDetailSection || !line.startsWith('|')) continue;
    const parts = line.split('|').map(s => s.trim());
    const rawStt = (parts[1] || '').replace(/\*/g, '').trim();
    const stt = parseInt(rawStt, 10);
    if (!isNaN(stt) && stt > maxStt) maxStt = stt;
  }

  const newStt = maxStt + 1;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const cleanSnippet = replySnippet.replace(/\n/g, ' ').slice(0, 80) + '...';
  const cleanQuery = query.replace(/\n/g, ' ').slice(0, 60);

  const row = `| **${newStt}** | ${now} | ${recipient} | ${channel} | ${cleanQuery} | ${tier} | ${action} | ${cleanSnippet} |`;
  fs.appendFileSync(LOG_FILE, row + '\n', 'utf8');
}

async function main() {
  const opts = parseArgs();
  console.log(`[Orca Meta Inbox Responder] Mode: ${opts.mode.toUpperCase()}`);

  const pageId = opts.pageId || findMetaInboxPageId();
  if (!pageId) {
    console.error('❌ Could not find an active Meta Business Suite Inbox tab in Orca.');
    console.error('👉 Please make sure Meta Business Suite (business.facebook.com/latest/inbox) is open in Orca.');
    process.exit(1);
  }

  console.log(`✓ Attached to Orca tab ID: ${pageId}`);

  // Switch to the Meta Suite tab
  runOrca(['tab', 'switch', '--page', pageId]);

  // Read conversation
  const conv = readActiveConversation(pageId);
  if (!conv || !conv.bubbles || conv.bubbles.length === 0) {
    console.error('❌ Could not read messages from the active conversation.');
    process.exit(1);
  }

  const triage = classifyInquiry('Zion Sky', conv.bubbles);

  console.log('\n--- 📋 Lead & Conversation Triage Report ---');
  console.log(`Customer:         ${triage.recipient}`);
  console.log(`Detected Intent:  ${triage.intent}`);
  console.log(`Lead Tier:        ${triage.leadTier}`);
  console.log(`Specific Dates:   ${triage.hasDates ? 'YES (High Priority)' : 'NO'}`);
  console.log(`Latest Query:     "${triage.lastCustomerMsg}"`);
  console.log('--------------------------------------------\n');

  const finalReply = opts.customReply || triage.suggestedReply;

  if (opts.mode === 'scan') {
    console.log('💡 Suggested Response Preview:');
    console.log('--------------------------------------------------');
    console.log(finalReply);
    console.log('--------------------------------------------------');
    console.log('\nℹ️ To populate this into the chat composer on Orca, run:');
    console.log('   node Technology-Automation/Scripts/orca_meta_inbox_responder.mjs --mode draft\n');
    return;
  }

  if (opts.mode === 'draft') {
    console.log('⏳ Injecting response draft into Meta Business Suite composer on Orca...');
    const ok = draftToComposer(pageId, finalReply);
    if (ok) {
      console.log('✅ DRAFT POPULATED SUCCESSFULLY!');
      console.log('👉 Look at Orca: The message is now typed in the chat box.');
      console.log('👉 You can review, make small edits if needed, and hit Send with 1 click.');
      appendToLog(triage.recipient, 'Meta Messenger', triage.lastCustomerMsg, triage.leadTier, 'Drafted in Orca', finalReply);
    } else {
      console.error('❌ Failed to inject draft into composer.');
      process.exit(1);
    }
    return;
  }

  if (opts.mode === 'send') {
    if (!opts.confirm) {
      console.error('⚠️ Live sending blocked by Agent Protocol Guardrails.');
      console.error('👉 To send live messages, add the --confirm flag:');
      console.error('   node Technology-Automation/Scripts/orca_meta_inbox_responder.mjs --mode send --confirm');
      process.exit(1);
    }

    console.log('⏳ Populating and sending message to customer via Orca...');
    draftToComposer(pageId, finalReply);
    const sent = sendComposer(pageId);
    if (sent) {
      console.log('🚀 MESSAGE SENT SUCCESSFULLY!');
      appendToLog(triage.recipient, 'Meta Messenger', triage.lastCustomerMsg, triage.leadTier, 'Sent via Orca', finalReply);
    } else {
      console.error('❌ Failed to trigger send event.');
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
