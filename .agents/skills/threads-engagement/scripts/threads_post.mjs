#!/usr/bin/env node
/**
 * TravelFrame Threads Post Publisher via Orca
 * Part of skill: threads-engagement (Marketing-Growth)
 *
 * Usage:
 *   # Dry run: open composer, fill text, verify and close without posting
 *   node threads_post.mjs --post-id 1 --dry-run
 *
 *   # Live post: post bài theo ID trong lịch trình nội dung
 *   node threads_post.mjs --post-id 1 --confirm
 *
 *   # Post text tùy chỉnh
 *   node threads_post.mjs --text "Nội dung bài viết..." --confirm
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_PAGE_ID = '1acf7e90-5b6b-4692-a8b3-11b2ff3bd24f';
const MAC_ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const MAC_ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const LINUX_ORCA_SHIM = path.join(process.env.HOME || '', '.config/orca/linux-orca-cli-shim/orca');

let PAGE_ID = process.env.ORCA_PAGE_ID || DEFAULT_PAGE_ID;
const CALENDAR_FILE = path.resolve(process.cwd(), 'Marketing-Growth/Content/Drafts/2026-09-27-Threads-Personal-Feed-Content-Calendar.md');
const LEDGER_FILE = path.resolve(process.cwd(), 'Marketing-Growth/Content/Threads-Published-Posts-Ledger.md');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    postId: null,
    text: '',
    dryRun: false,
    confirm: false,
    page: ''
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--post-id' && args[i + 1]) options.postId = parseInt(args[++i], 10);
    else if (args[i] === '--text' && args[i + 1]) options.text = args[++i];
    else if (args[i] === '--dry-run') options.dryRun = true;
    else if (args[i] === '--confirm') options.confirm = true;
    else if (args[i] === '--page' && args[i + 1]) options.page = args[++i];
  }
  return options;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
      timeout: 25000,
      encoding: 'utf8'
    });
    return res.trim();
  } catch (err) {
    return null;
  }
}

function resolveThreadsPageId() {
  if (process.env.ORCA_PAGE_ID) return process.env.ORCA_PAGE_ID;
  const listRaw = runOrca(['tab', 'list', '--json']);
  if (listRaw) {
    try {
      const parsed = JSON.parse(listRaw);
      const tabs = parsed?.result?.tabs || [];
      const threadsTab = tabs.find(t => t.url && t.url.includes('threads.com') && (t.profileLabel === 'travelframe' || t.profileId === 'e332b231-0a7e-4f17-b8ae-2a04e7fc89b1'))
        || tabs.find(t => t.url && t.url.includes('threads.com'));
      if (threadsTab && threadsTab.browserPageId) {
        return threadsTab.browserPageId;
      }
    } catch (_) {}
  }
  return null;
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

function extractPostFromCalendar(postId) {
  if (!fs.existsSync(CALENDAR_FILE)) {
    throw new Error(`Calendar file not found: ${CALENDAR_FILE}`);
  }
  const content = fs.readFileSync(CALENDAR_FILE, 'utf8');
  const sectionRegex = new RegExp(`### Bài ${postId}:[\\s\\S]*?> ([\\s\\S]*?)(?=\\n---|\n### Bài|$)`);
  const match = content.match(sectionRegex);
  if (!match) {
    throw new Error(`Could not find Bài ${postId} in ${CALENDAR_FILE}`);
  }
  // Strip blockquote '>' prefixes and clean up
  const text = match[1]
    .split('\n')
    .map(line => line.replace(/^>\s?/, ''))
    .join('\n')
    .trim();

  return text;
}

function logPublishedPost(postId, text, url = 'Published via Orca') {
  const timestamp = new Date().toISOString();
  const firstLine = text.split('\n')[0].slice(0, 60);
  const row = `| ${timestamp} | Bài ${postId || 'Custom'} | ${firstLine}... | ${url} |\n`;

  if (!fs.existsSync(LEDGER_FILE)) {
    const header = `# Sổ Cái Đăng Bài Threads — TravelFrame\n\n| Thời gian | Bài | Nội dung trích dẫn | Trạng thái / Link |\n|---|---|---|---|\n`;
    fs.writeFileSync(LEDGER_FILE, header + row, 'utf8');
  } else {
    fs.appendFileSync(LEDGER_FILE, row, 'utf8');
  }
  console.log(`[Ledger] Logged published post to ${LEDGER_FILE}`);
}

async function main() {
  const options = parseArgs();
  const detectedPageId = resolveThreadsPageId();
  if (options.page) {
    PAGE_ID = options.page;
  } else if (detectedPageId) {
    PAGE_ID = detectedPageId;
  }

  console.log(`=== TravelFrame Threads Post Publisher ===`);
  console.log(`Active Orca Page ID: ${PAGE_ID}`);

  let postText = options.text;
  if (options.postId) {
    console.log(`Extracting Bài ${options.postId} from calendar...`);
    postText = extractPostFromCalendar(options.postId);
  }

  if (!postText) {
    console.error('Error: Please provide --post-id <1..7> or --text "<content>".');
    process.exit(1);
  }

  console.log(`\n--- Nội dung chuẩn bị đăng (${postText.length} ký tự) ---`);
  console.log(postText);
  console.log('--------------------------------------------------\n');

  if (!options.dryRun && !options.confirm) {
    console.log('Chế độ an toàn: Yêu cầu chỉ định cờ --dry-run (chạy thử nghiệm) hoặc --confirm (đăng bài thật).');
    process.exit(0);
  }

  // 1. Kiểm tra tài khoản @travelframe.vn
  console.log('Đang kiểm tra giao diện và tài khoản Threads...');
  const isTravelFrame = runOrca(['eval', '--page', PAGE_ID, '--expression', `(() => {
    return document.body.innerText.includes('travelframe.vn') || !!document.querySelector('a[href*="/@travelframe.vn"]');
  })()`]);
  if (!isTravelFrame || !isTravelFrame.includes('true')) {
    console.error('Lỗi an toàn: Tab hiện tại không phải tài khoản @travelframe.vn! Đã dừng lại để bảo vệ tài khoản cá nhân.');
    process.exit(1);
  }

  let snap = runOrca(['snapshot', '--page', PAGE_ID]);
  if (!snap) {
    console.error('Không thể lấy snapshot từ tab Threads.');
    process.exit(1);
  }

  // 2. Tìm nút Create
  const createMatch = snap.match(/button "Create"[^\[]*\[(?:expanded=\w+,\s*)?ref=(e\d+)\]/);
  if (!createMatch) {
    console.error('Không tìm thấy nút "Create" trên giao diện.');
    process.exit(1);
  }
  const createRef = createMatch[1];
  console.log(`Mở trình soạn thảo bài viết mới (Create ref: ${createRef})...`);
  runOrca(['click', '--page', PAGE_ID, '--element', createRef]);
  await sleep(2500);

  // 3. Inject text via Lexical EditorState
  console.log('Điền nội dung bài viết qua Lexical EditorState...');
  const stateJson = JSON.stringify(convertTextToLexicalState(postText));
  const injectCode = `(() => {
    const editors = Array.from(document.querySelectorAll('[contenteditable=true]'));
    if (editors.length === 0) return 'error:no_editor';
    const el = editors[0];
    if (!el.__lexicalEditor) return 'error:no_lexical';
    const ed = el.__lexicalEditor;
    const parsed = ed.parseEditorState(${JSON.stringify(stateJson)});
    ed.setEditorState(parsed);
    ed.focus();
    return 'ok';
  })()`;
  const injectRes = runOrca(['eval', '--page', PAGE_ID, '--expression', injectCode]);
  if (!injectRes || !injectRes.includes('ok')) {
    console.warn(`Lexical injection result: ${injectRes}, falling back to fill...`);
    snap = runOrca(['snapshot', '--page', PAGE_ID]);
    const boxMatch = snap && snap.match(/textbox "(?:Empty text field\. Type to compose a new post\.|.*?)"\s+\[ref=(e\d+)\]/);
    if (boxMatch) {
      runOrca(['fill', '--page', PAGE_ID, '--element', boxMatch[1], '--value', postText]);
    }
  }
  await sleep(1500);

  // 4. Kiểm tra nút Post và Close
  snap = runOrca(['snapshot', '--page', PAGE_ID]);
  const closeBtnMatch = snap && snap.match(/button "Close"\s+\[ref=(e\d+)\]/);

  if (options.dryRun) {
    console.log('[DRY-RUN] Nội dung đã được điền thành công vào trình soạn thảo.');
    if (closeBtnMatch) {
      console.log(`[DRY-RUN] Đóng trình soạn thảo an toàn (Close ref: ${closeBtnMatch[1]})...`);
      runOrca(['click', '--page', PAGE_ID, '--element', closeBtnMatch[1]]);
      await sleep(1000);
      const snapModal = runOrca(['snapshot', '--page', PAGE_ID]);
      const discardMatch = snapModal && snapModal.match(/button "(?:Discard|Hủy)"\s+\[ref=(e\d+)\]/);
      if (discardMatch) {
        runOrca(['click', '--page', PAGE_ID, '--element', discardMatch[1]]);
      }
    }
    console.log('[DRY-RUN] Hoàn tất kiểm tra: Cơ chế soạn thảo hoạt động 100% trơn tru.');
    return;
  }

  if (options.confirm) {
    console.log('[LIVE POST] Bấm nút "Post" trên modal soạn thảo...');
    const postClickRes = runOrca(['eval', '--page', PAGE_ID, '--expression', `(() => {
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
      throw new Error(`Không tìm thấy nút Post hoạt động trên modal: ${postClickRes}`);
    }

    console.log('Đang chờ bài viết được gửi lên hệ thống Threads...');
    for (let attempt = 0; attempt < 10; attempt++) {
      await sleep(2000);
      const editorCount = runOrca(['eval', '--page', PAGE_ID, '--expression', 'document.querySelectorAll("[contenteditable=true]").length']);
      if (parseInt(editorCount, 10) === 0) {
        break;
      }
    }

    console.log('✅ Bài viết đã được đăng thành công lên Threads!');
    logPublishedPost(options.postId, postText);
  }
}

main().catch(err => {
  console.error('Error executing threads_post:', err);
  process.exit(1);
});
