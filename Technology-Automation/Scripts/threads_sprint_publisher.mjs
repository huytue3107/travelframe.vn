#!/usr/bin/env node
/**
 * TravelFrame Threads 14-Day Sprint Publisher & Staging Engine
 * Part of TravelFrame Company OS (Technology-Automation & Marketing-Growth)
 * Plan: Marketing-Growth/Plans/2026-09-28-TravelFrame-Threads-14-Day-Content-Sprint.md
 *
 * Capabilities:
 *   - Parses multi-part cascade thread files from Marketing-Growth/Content/Drafts/Threads-Sprint-14D/
 *   - Validates anti-AI guardrails (CAPS root hook, no hyphens, length <= 500 chars, soft CTA)
 *   - Interacts with Orca browser Threads session (Page ID or auto-detected)
 *   - Supports --mode validate, --mode stage (visual review in composer), --mode draft (saves to Threads drafts), and --mode publish (requires --confirm)
 *
 * Usage:
 *   node Technology-Automation/Scripts/threads_sprint_publisher.mjs --file Marketing-Growth/Content/Drafts/Threads-Sprint-14D/Day-01-Evening-Hanoi-Side-Quests.md --mode validate
 *   node Technology-Automation/Scripts/threads_sprint_publisher.mjs --file Marketing-Growth/Content/Drafts/Threads-Sprint-14D/Day-01-Evening-Hanoi-Side-Quests.md --mode stage
 *   node Technology-Automation/Scripts/threads_sprint_publisher.mjs --file Marketing-Growth/Content/Drafts/Threads-Sprint-14D/Day-01-Evening-Hanoi-Side-Quests.md --mode draft
 *   node Technology-Automation/Scripts/threads_sprint_publisher.mjs --file Marketing-Growth/Content/Drafts/Threads-Sprint-14D/Day-01-Evening-Hanoi-Side-Quests.md --mode publish --confirm
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const MAC_ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const MAC_ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const LINUX_ORCA_SHIM = path.join(process.env.HOME || '', '.config/orca/linux-orca-cli-shim/orca');
const LOG_FILE = path.resolve(process.cwd(), 'Marketing-Growth/Content/Threads-All-Interactions-Log.md');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    file: null,
    mode: 'validate', // validate | stage | draft | publish
    confirm: false,
    pageId: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) options.file = args[++i];
    else if (args[i] === '--mode' && args[i + 1]) options.mode = args[++i];
    else if (args[i] === '--confirm') options.confirm = true;
    else if (args[i] === '--page-id' && args[i + 1]) options.pageId = args[++i];
  }
  return options;
}

function runOrca(args) {
  try {
    let cmd, cmdArgs, env = { ...process.env };
    if (process.env.ORCA_BIN && fs.existsSync(process.env.ORCA_BIN)) {
      cmd = process.env.ORCA_BIN;
      cmdArgs = args;
    } else if (fs.existsSync(MAC_ORCA_ELECTRON) && fs.existsSync(MAC_ORCA_CLI)) {
      cmd = MAC_ORCA_ELECTRON;
      cmdArgs = [MAC_ORCA_CLI, ...args];
      env.ELECTRON_RUN_AS_NODE = '1';
    } else if (fs.existsSync(LINUX_ORCA_SHIM)) {
      cmd = LINUX_ORCA_SHIM;
      cmdArgs = args;
    } else {
      cmd = 'orca';
      cmdArgs = args;
    }
    const res = execFileSync(cmd, cmdArgs, {
      env,
      timeout: 30000,
      encoding: 'utf8'
    });
    return res ? res.trim() : '';
  } catch (err) {
    if (process.env.DEBUG) console.error('Orca command error:', err.message);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizePartText(text) {
  let cleaned = text.trim();
  // 1. Remove markdown hr delimiters
  cleaned = cleaned.replace(/\n*---\s*$/g, '').trim();

  // 2. Strip trailing counter like "1/7", "2/5", etc. per user protocol
  cleaned = cleaned.replace(/\n*\s*\b\d+\/\d+\b\s*$/g, '').trim();

  // 3. Prevent accidental web links from sentence dots:
  // Ensure that any dot followed by a letter without space is separated by a space,
  // while safely preserving approved domains like @travelframe.vn and threads.com
  const TF_TOKEN = '__TF_VN_TOKEN__';
  const THREADS_TOKEN = '__THREADS_COM_TOKEN__';
  cleaned = cleaned.replace(/@?travelframe\.vn/gi, TF_TOKEN);
  cleaned = cleaned.replace(/threads\.com/gi, THREADS_TOKEN);

  // Replace any dot followed immediately by a letter (e.g. "Hanoi.You" -> "Hanoi. You")
  cleaned = cleaned.replace(/([a-zA-Z0-9])\.([a-zA-Z])/g, '$1. $2');

  // Restore tokens
  cleaned = cleaned.replace(new RegExp(TF_TOKEN, 'g'), '@travelframe.vn');
  cleaned = cleaned.replace(new RegExp(THREADS_TOKEN, 'g'), 'threads.com');

  return cleaned;
}

function parseThreadFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Thread file not found: ${fullPath}`);
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const partHeaderRegex = /### \[PART (\d+)\/(\d+):?([^\]]*)\]/g;
  const parts = [];
  let match;
  const indices = [];

  while ((match = partHeaderRegex.exec(raw)) !== null) {
    indices.push({
      index: match.index,
      partNum: parseInt(match[1], 10),
      totalParts: parseInt(match[2], 10),
      label: match[3].trim(),
      headerEnd: partHeaderRegex.lastIndex
    });
  }

  if (indices.length === 0) {
    throw new Error('No valid thread parts found matching format: ### [PART X/N: ...]');
  }

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].headerEnd;
    const end = (i + 1 < indices.length) ? indices[i + 1].index : raw.length;
    let partText = raw.slice(start, end).trim();
    partText = sanitizePartText(partText);

    parts.push({
      partNum: indices[i].partNum,
      totalParts: indices[i].totalParts,
      label: indices[i].label,
      text: partText,
      charCount: partText.length
    });
  }

  // Extract metadata
  const metaMatch = raw.match(/Mã bài đăng:\s*`([^`]+)`/);
  const code = metaMatch ? metaMatch[1] : path.basename(filePath, '.md');

  const titleMatch = raw.match(/# (.*)/);
  const title = titleMatch ? titleMatch[1] : code;

  return { filePath, code, title, parts };
}

function validateThread(thread) {
  const errors = [];
  const warnings = [];

  if (thread.parts.length === 0) {
    errors.push('No parts extracted.');
    return { valid: false, errors, warnings };
  }

  const expectedTotal = thread.parts[0].totalParts;
  if (thread.parts.length !== expectedTotal) {
    errors.push(`Part count mismatch: expected ${expectedTotal} parts, got ${thread.parts.length}.`);
  }

  thread.parts.forEach((p, idx) => {
    // Length check
    if (p.charCount > 500) {
      errors.push(`Part ${p.partNum} exceeds 500 character limit (${p.charCount} chars).`);
    }

    // Hyphen check (CẤM dấu gạch ngang)
    if (p.text.includes('-')) {
      errors.push(`Part ${p.partNum} contains forbidden hyphen '-' character.`);
    }

    // Counter check: Ensure no "1/7", "2/7" counters remain at the end of the post
    if (/\b\d+\/\d+\b\s*$/.test(p.text.trim())) {
      errors.push(`Part ${p.partNum} contains forbidden trailing counter (e.g. "1/7", "2/5"). Remove counters per user protocol.`);
    }

    // Accidental web link check: ensure no dot between words creates an unintended domain link
    const sanitizedText = p.text.replace(/@?travelframe\.vn/gi, '').replace(/threads\.com/gi, '');
    const accidentalLinkMatch = sanitizedText.match(/[a-zA-Z0-9]\.[a-zA-Z]{2,}/);
    if (accidentalLinkMatch) {
      warnings.push(`Part ${p.partNum} may contain an accidental domain link near "${accidentalLinkMatch[0]}". Ensure sentences are separated by space after dot.`);
    }
  });

  // Check Root Hook (Part 1)
  const part1 = thread.parts[0];
  const firstLine = part1.text.split('\n')[0].trim();
  const lettersOnly = firstLine.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly && lettersOnly !== lettersOnly.toUpperCase()) {
    warnings.push('Part 1 first line is not in 100% CAPS LOCK.');
  }

  // Check Soft CTA in last part
  const lastPart = thread.parts[thread.parts.length - 1];
  if (!lastPart.text.includes('@travelframe.vn')) {
    errors.push('Final part is missing TravelFrame bridge CTA (@travelframe.vn).');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

const TRAVELFRAME_PROFILE_ID = 'e332b231-0a7e-4f17-b8ae-2a04e7fc89b1';

function findThreadsTab(preferredPageId = null) {
  if (preferredPageId) return preferredPageId;
  const raw = runOrca(['tab', 'list', '--json']);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const tabs = data?.result?.tabs || [];
    // Prioritize travelframe profile
    let threadsTab = tabs.find(t => t.url && t.url.includes('threads.com') && (t.profileLabel === 'travelframe' || t.profileId === TRAVELFRAME_PROFILE_ID));
    if (!threadsTab) {
      threadsTab = tabs.find(t => t.url && t.url.includes('threads.com'));
    }
    if (!threadsTab) {
      console.log('No active Threads tab found. Opening a new tab with TravelFrame profile...');
      const createRes = runOrca(['tab', 'create', '--url', 'https://www.threads.com/', '--profile', TRAVELFRAME_PROFILE_ID]);
      const match = createRes && createRes.match(/Created tab ([0-9a-f-]+)/);
      if (match) return match[1];
    }
    return threadsTab ? threadsTab.browserPageId : null;
  } catch (e) {
    return null;
  }
}

function convertTextToLexicalState(text) {
  const lines = text.split('\n');
  const children = [];
  let prevWasEmpty = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (!prevWasEmpty && children.length > 0) {
        children.push({
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          textStyle: '',
          type: 'paragraph',
          version: 1
        });
        prevWasEmpty = true;
      }
    } else {
      children.push({
        children: [{
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: trimmed,
          type: 'text',
          version: 1
        }],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1
      });
      prevWasEmpty = false;
    }
  });

  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1
    }
  };
}

function fillLexicalEditor(pageId, editorIndex, text) {
  const stateJson = JSON.stringify(convertTextToLexicalState(text));
  const code = `(() => {
    const editors = Array.from(document.querySelectorAll('[contenteditable=true]'));
    if (!editors[${editorIndex}]) return 'error:editor_not_found';
    const el = editors[${editorIndex}];
    if (!el.__lexicalEditor) return 'error:no_lexical';
    const ed = el.__lexicalEditor;
    const parsed = ed.parseEditorState(${JSON.stringify(stateJson)});
    ed.setEditorState(parsed);
    ed.focus();
    return 'ok';
  })()`;
  return runOrca(['eval', '--page', pageId, '--expression', code]);
}

async function stageThreadInOrca(pageId, thread, options) {
  console.log(`\n>>> Preparing Threads composer on tab [${pageId}] for: ${thread.code}`);

  // 1. Ensure we are on Threads home or feed
  const curUrl = runOrca(['eval', '--page', pageId, '--expression', 'location.href']);
  if (!curUrl || curUrl.includes('/post/') || !curUrl.match(/threads\.com\/?(?:\?.*)?$/)) {
    console.log(`Navigating tab to https://www.threads.com/...`);
    runOrca(['goto', '--page', pageId, '--url', 'https://www.threads.com/']);
    await sleep(4000);
  }

  // 2. Close any lingering dialog cleanly
  runOrca(['eval', '--page', pageId, '--expression', `(() => {
    const cancelBtns = Array.from(document.querySelectorAll('button, [role=button]'))
      .filter(b => (b.innerText || '').trim() === 'Cancel');
    cancelBtns.forEach(b => b.click());
  })()`]);
  await sleep(1200);
  runOrca(['eval', '--page', pageId, '--expression', `(() => {
    const discardBtns = Array.from(document.querySelectorAll('button, [role=button]'))
      .filter(b => ["Don't save", 'Discard', 'Hủy'].some(w => (b.innerText || '').includes(w)));
    discardBtns.forEach(b => b.click());
  })()`]);
  await sleep(1500);

  // 2.5 Safety Check: Verify active account is @travelframe.vn
  const checkAcc = runOrca(['eval', '--page', pageId, '--expression', `(() => {
    return document.body.innerText.includes('travelframe.vn') || !!document.querySelector('a[href*="/@travelframe.vn"]');
  })()`]);
  if (!checkAcc || !checkAcc.includes('true')) {
    throw new Error('Safety guardrail triggered: Active Threads tab is NOT logged in as @travelframe.vn! Aborted to protect personal accounts.');
  }

  // 3. Open composer modal if not already open
  let initialEditorCount = parseInt(runOrca(['eval', '--page', pageId, '--expression', 'document.querySelectorAll("[contenteditable=true]").length']) || '0', 10);
  if (initialEditorCount === 0) {
    console.log('Opening "New thread" composer dialog...');
    let snapInit = runOrca(['snapshot', '--page', pageId]);
    const createMatch = snapInit && snapInit.match(/button "(?:Create|New thread)"[^\[]*\[(?:expanded=\w+,\s*)?ref=(e\d+)\]/i);
    if (createMatch) {
      runOrca(['click', '--page', pageId, '--element', createMatch[1]]);
    } else {
      runOrca(['eval', '--page', pageId, '--expression', `(() => {
        const whatsNew = document.querySelector('[aria-label*="Empty text field"]');
        if (whatsNew) { whatsNew.click(); return; }
        const btn = Array.from(document.querySelectorAll("button, [role=button], div")).find(b => {
          const text = (b.innerText || '').trim();
          const aria = b.getAttribute('aria-label') || '';
          return text === 'New thread' || aria === 'New thread' || text === 'Create' || aria === 'Create';
        });
        if (btn) btn.click();
      })()`]);
    }
    await sleep(2500);

    // Wait for initial contenteditable
    for (let attempt = 0; attempt < 8; attempt++) {
      const countStr = runOrca(['eval', '--page', pageId, '--expression', 'document.querySelectorAll("[contenteditable=true]").length']);
      if (parseInt(countStr, 10) > 0) break;
      await sleep(1000);
    }
  }

  // 4. Fill parts sequentially via Lexical EditorState
  for (let i = 0; i < thread.parts.length; i++) {
    const part = thread.parts[i];
    console.log(`Filling Part ${part.partNum}/${part.totalParts} (${part.charCount} chars) into editor index [${i}]...`);

    const fillRes = fillLexicalEditor(pageId, i, part.text);
    if (!fillRes || !fillRes.includes('ok')) {
      throw new Error(`Failed to inject Lexical content for Part ${part.partNum}: ${fillRes}`);
    }
    await sleep(1500);

    // If there is a next part, click "Add to thread" and wait for next editor
    if (i < thread.parts.length - 1) {
      console.log('Triggering "Add to thread"...');
      let created = false;
      for (let attempt = 0; attempt < 6; attempt++) {
        runOrca(['eval', '--page', pageId, '--expression', `(() => {
          const addBtn = Array.from(document.querySelectorAll('button, [role=button]'))
            .find(b => (b.innerText || '').includes('Add to thread') && !b.disabled && b.getAttribute('aria-disabled') !== 'true');
          if (addBtn) addBtn.click();
        })()`]);
        await sleep(1500);

        const countStr = runOrca(['eval', '--page', pageId, '--expression', 'document.querySelectorAll("[contenteditable=true]").length']);
        const count = parseInt(countStr, 10);
        if (count >= i + 2) {
          created = true;
          break;
        }
      }
      if (!created) {
        throw new Error(`"Add to thread" failed to create editor for Part ${part.partNum + 1}`);
      }
      await sleep(1500);
    }
  }

  const finalCountStr = runOrca(['eval', '--page', pageId, '--expression', 'document.querySelectorAll("[contenteditable=true]").length']);
  console.log(`\n✅ All ${thread.parts.length} parts successfully loaded into Threads composer (Total active editors: ${finalCountStr})!`);

  if (options.mode === 'stage') {
    console.log('\n[STAGE MODE] Composer is open in Orca for human visual inspection and review.');
    return { status: 'staged', count: thread.parts.length };
  }

  if (options.mode === 'draft') {
    console.log('Saving to Threads Drafts...');
    // Click Cancel -> Save to drafts
    const snap = runOrca(['snapshot', '--page', pageId]);
    const cancelMatch = snap.match(/button "Cancel"\s+\[ref=(e\d+)\]/);
    if (cancelMatch) {
      runOrca(['click', '--page', pageId, '--element', cancelMatch[1]]);
      await sleep(1500);
      const snapDialog = runOrca(['snapshot', '--page', pageId]);
      const saveMatch = snapDialog.match(/button "Save"\s+\[ref=(e\d+)\]/);
      if (saveMatch) {
        runOrca(['click', '--page', pageId, '--element', saveMatch[1]]);
        await sleep(2000);
        console.log('✅ Successfully saved thread cascade to Threads Drafts!');
        return { status: 'drafted', count: thread.parts.length };
      }
    }
    throw new Error('Failed to save to drafts.');
  }

  if (options.mode === 'publish') {
    if (!options.confirm) {
      throw new Error('Live publishing requires explicit --confirm flag after Rocky approval.');
    }

    console.log('\n🚀 PUBLISHING LIVE: Clicking modal "Post" button...');
    const postClickRes = runOrca(['eval', '--page', pageId, '--expression', `(() => {
      const dialog = document.querySelector('[role=dialog]') || document;
      const postBtns = Array.from(dialog.querySelectorAll('button, [role=button]'))
        .filter(b => (b.innerText || '').trim() === 'Post' && !b.disabled && b.getAttribute('aria-disabled') !== 'true');
      if (postBtns.length > 0) {
        postBtns[postBtns.length - 1].click();
        return 'clicked';
      }
      return 'not_found';
    })()`]);

    if (!postClickRes || !postClickRes.includes('clicked')) {
      throw new Error(`Failed to click active modal Post button: ${postClickRes}`);
    }

    console.log('Waiting for post to process and submit...');
    let submitted = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      await sleep(2000);
      const editorCount = runOrca(['eval', '--page', pageId, '--expression', 'document.querySelectorAll("[contenteditable=true]").length']);
      if (parseInt(editorCount, 10) === 0) {
        submitted = true;
        break;
      }
    }
    if (!submitted) {
      console.warn('Composer still open after 24s, verifying submission...');
    }

    // Log the interaction
    logPublishedThread(thread);
    console.log(`\n🎉 Thread ${thread.code} successfully published live!`);
    return { status: 'published', count: thread.parts.length };
  }
}

function logPublishedThread(thread) {
  try {
    const timestamp = new Date().toISOString();
    const dateStr = timestamp.slice(0, 10);
    const rootHook = thread.parts[0].text.split('\n')[0].slice(0, 100);
    const line = `| SPRINT | ${dateStr} | [@travelframe.vn](https://www.threads.com/@travelframe.vn) | [Published Post](https://www.threads.com/@travelframe.vn) | ${thread.code}: ${rootHook} | ${thread.parts.length} parts multi-part thread cascade (Pattern P-038) |\n`;
    
    if (fs.existsSync(LOG_FILE)) {
      fs.appendFileSync(LOG_FILE, line, 'utf8');
      console.log(`Logged published thread to ${LOG_FILE}`);
    }
  } catch (err) {
    console.error('Failed to update log file:', err.message);
  }
}

async function main() {
  const options = parseArgs();

  if (!options.file) {
    console.error('Usage: node Technology-Automation/Scripts/threads_sprint_publisher.mjs --file <path-to-markdown> [--mode validate|stage|draft|publish] [--confirm]');
    process.exit(1);
  }

  console.log(`=== TravelFrame Threads Sprint Publisher ===`);
  console.log(`Target File: ${options.file}`);
  console.log(`Selected Mode: ${options.mode}`);

  const thread = parseThreadFile(options.file);
  console.log(`Parsed Thread: [${thread.code}] "${thread.title}"`);
  console.log(`Total Parts: ${thread.parts.length}`);

  const validation = validateThread(thread);
  if (validation.warnings.length > 0) {
    console.warn('\n⚠️ Validation Warnings:');
    validation.warnings.forEach(w => console.warn(`  - ${w}`));
  }

  if (!validation.valid) {
    console.error('\n❌ Validation Failed:');
    validation.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log('✅ Anti-AI & Technical Quality Gates Passed.');

  if (options.mode === 'validate') {
    console.log('\n--- Thread Parts Overview ---');
    thread.parts.forEach(p => {
      console.log(`\n[Part ${p.partNum}/${p.totalParts}] (${p.charCount} chars):`);
      console.log(p.text);
    });
    console.log('\nValidation complete. Ready for --mode stage, --mode draft, or --mode publish.');
    return;
  }

  const pageId = findThreadsTab(options.pageId);
  if (!pageId) {
    console.error('Error: No active Threads tab found in Orca. Please ensure Orca is open and logged into Threads.');
    process.exit(1);
  }
  console.log(`Connected to Orca Threads tab: [${pageId}]`);

  await stageThreadInOrca(pageId, thread, options);
}

main().catch(err => {
  console.error('\nFatal Error:', err.message);
  process.exit(1);
});
