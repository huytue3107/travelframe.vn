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

const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
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
    const res = execFileSync(ORCA_ELECTRON, [ORCA_CLI, ...args], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
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
    // Remove markdown hr delimiters
    partText = partText.replace(/\n*---\s*$/g, '').trim();

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

    // Check numbering format at end of part
    const endExpected = `${p.partNum}/${p.totalParts}`;
    if (!p.text.trim().endsWith(endExpected)) {
      warnings.push(`Part ${p.partNum} does not cleanly end with expected counter "${endExpected}".`);
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

function findThreadsTab(preferredPageId = null) {
  if (preferredPageId) return preferredPageId;
  const raw = runOrca(['tab', 'list', '--json']);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const tabs = data?.result?.tabs || [];
    const threadsTab = tabs.find(t => t.url && t.url.includes('threads.com'));
    return threadsTab ? threadsTab.browserPageId : null;
  } catch (e) {
    return null;
  }
}

async function stageThreadInOrca(pageId, thread, options) {
  console.log(`\n>>> Preparing Threads composer on tab [${pageId}] for: ${thread.code}`);

  // 1. Ensure we are on Threads home or feed
  const curUrl = runOrca(['eval', '--page', pageId, '--expression', 'location.href']);
  if (!curUrl || !curUrl.includes('threads.com')) {
    console.log(`Navigating tab to https://www.threads.com/...`);
    runOrca(['goto', '--page', pageId, '--url', 'https://www.threads.com/']);
    await sleep(3500);
  }

  // 2. Close any lingering dialog
  runOrca(['eval', '--page', pageId, '--expression', `(() => {
    const cancelBtn = Array.from(document.querySelectorAll('div[role=dialog] button, div[role=dialog] [role=button]'))
      .find(b => (b.innerText || '').includes('Cancel'));
    if (cancelBtn) cancelBtn.click();
    const dontSave = Array.from(document.querySelectorAll('div[role=dialog] button, div[role=dialog] [role=button]'))
      .find(b => (b.innerText || '').includes("Don't save"));
    if (dontSave) dontSave.click();
  })()`]);
  await sleep(1500);

  // 3. Open composer modal
  console.log('Opening "New thread" composer dialog...');
  runOrca(['eval', '--page', pageId, '--expression', `(() => {
    const composeBtn = document.querySelector('div[aria-label="Empty text field. Type to compose a new post."]')
      || Array.from(document.querySelectorAll('button, [role=button]')).find(b => (b.innerText || '').includes('New thread'));
    if (composeBtn) composeBtn.click();
  })()`]);
  await sleep(2500);

  // 4. Fill parts sequentially
  for (let i = 0; i < thread.parts.length; i++) {
    const part = thread.parts[i];
    console.log(`Filling Part ${part.partNum}/${part.totalParts} (${part.charCount} chars)...`);

    // Snapshot to find textboxes
    await sleep(1000);
    const snap = runOrca(['snapshot', '--page', pageId]);
    if (!snap) throw new Error('Failed to take snapshot of composer.');

    // Find all textboxes in the dialog
    const boxMatches = [...snap.matchAll(/textbox "Empty text field\.[^"]*"\s+\[ref=(e\d+)\]/g)];
    if (boxMatches.length === 0) {
      throw new Error(`Could not find composer textbox for Part ${part.partNum}`);
    }

    // The active target textbox for current part is the last one in the tree
    const targetBoxRef = boxMatches[boxMatches.length - 1][1];
    console.log(`Target textbox ref: [${targetBoxRef}]`);
    runOrca(['fill', '--page', pageId, '--element', targetBoxRef, '--value', part.text]);
    await sleep(1500);

    // If there is a next part, click "Add to thread"
    if (i < thread.parts.length - 1) {
      console.log('Triggering "Add to thread"...');
      let clicked = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = runOrca(['eval', '--page', pageId, '--expression', `(() => {
          const addBtn = Array.from(document.querySelectorAll('button, [role=button]'))
            .find(b => (b.innerText || '').includes('Add to thread') && !b.disabled && !b.getAttribute('aria-disabled'));
          if (addBtn) {
            addBtn.click();
            return 'clicked';
          }
          return 'not_ready';
        })()`]);
        if (res && res.includes('clicked')) {
          clicked = true;
          break;
        }
        await sleep(1200);
      }
      if (!clicked) {
        throw new Error(`"Add to thread" button was not ready after filling Part ${part.partNum}`);
      }
      await sleep(2000);
    }
  }

  console.log(`\n✅ All ${thread.parts.length} parts successfully loaded into Threads composer!`);

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

    console.log('\n🚀 PUBLISHING LIVE: Clicking "Post"...');
    const snap = runOrca(['snapshot', '--page', pageId]);
    const postMatch = snap.match(/button "Post"\s+\[ref=(e\d+)\]/);
    if (!postMatch) {
      throw new Error('Post button not found in composer.');
    }

    runOrca(['click', '--page', pageId, '--element', postMatch[1]]);
    console.log('Waiting for post to process and submit...');
    await sleep(7000);

    // Verify dialog is closed
    const afterSnap = runOrca(['snapshot', '--page', pageId]);
    if (afterSnap && afterSnap.includes('New thread')) {
      console.warn('Composer dialog still visible, waiting additional 4s...');
      await sleep(4000);
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
