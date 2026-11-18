import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const PAGE = 'f750bbb4-b526-4613-bb4f-b5b5b74294dc';
const PDF_PATH = path.resolve(process.cwd(), 'Creative-Production/Deliverables/TravelFrame-Hanoi-Secret-Food-And-Photo-Guide.pdf');

const EN_MSG = `Hi there! 🥩✨

Here is our "Hanoi Secret Food & Photo Map" with 6 local foodie spots (including that sizzling steak at 5 Nguyễn Trung Trực).

📸 Tip: We also run casual 2-hour photo walks where a local friend guides you through hidden alleys and captures candid vacation photos for just $30/hour. Let us know your travel dates if you would love to join! 🥖✈️`;

const VI_MSG = `Chào bạn! 🥩✨

TravelFrame gửi bạn file PDF bản đồ 6 quán ăn ngon phố cổ (kèm quán Bò Né xèo xèo số 5 Nguyễn Trung Trực nhé).

📸 Gợi ý nhỏ: Tụi mình có gói dạo phố chụp ảnh kỷ niệm tự nhiên chỉ từ 750k/h ($30/h) trọn gói cả nhóm. Khi nào bạn lên phố nhắn TravelFrame giữ lịch đẹp nha! ✨`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function orca(cmd, args) {
  return execFileSync(ORCA_ELECTRON, [ORCA_CLI, cmd, ...args], { encoding: 'utf8' });
}

function evalPage(expr) {
  const res = orca('eval', ['--page', PAGE, '--expression', expr, '--json']);
  try {
    const data = JSON.parse(res);
    return JSON.parse(data.result?.result || 'null');
  } catch (e) {
    return null;
  }
}

async function run() {
  console.log('=== TravelFrame Meta Inbox Batch Responder ===');
  
  // 1. Get list of conversation rows from sidebar
  const getThreadsExpr = `(() => {
    // Find all thread rows in the sidebar
    const rows = Array.from(document.querySelectorAll('[role="row"], div[role="presentation"]'));
    const threads = [];
    for (const r of rows) {
      const text = r.innerText || "";
      if (text.includes("Food") || text.includes("FOOD") || text.includes("commented on your post")) {
        // extract name
        const lines = text.split("\\n").map(l => l.trim()).filter(Boolean);
        const name = lines[0] || "Unknown";
        threads.push({ name, text: text.slice(0, 100) });
      }
    }
    return threads;
  })()`;

  const threads = evalPage(getThreadsExpr) || [];
  console.log(`Found ${threads.length} relevant candidate threads:`);
  for (const t of threads) {
    console.log(`- ${t.name}: ${t.text.replace(/\\n/g, ' ')}`);
  }

  // Find candidate names (like Lorna Bro, etc.)
  const candidateNames = ["Lorna Bro", "Quang Nguyễn", "John", "David", "Rachel", "Sarah", "Mark", "Emily", "Chris"];

  for (const name of candidateNames) {
    console.log(`\nChecking candidate: ${name}...`);
    
    // Click on thread
    const clickExpr = `(() => {
      const all = Array.from(document.querySelectorAll('span, div[dir="auto"], div'));
      const el = all.find(e => e.innerText && e.innerText.trim() === "${name}");
      if (el) {
        el.click();
        return true;
      }
      return false;
    })()`;

    const clicked = evalPage(clickExpr);
    if (!clicked) {
      console.log(`  Thread for "${name}" not visible in current sidebar view.`);
      continue;
    }

    console.log(`  Clicked "${name}", waiting 2s for thread to load...`);
    await sleep(2000);

    // Check if we already sent attachment/message to this user
    const checkSentExpr = `(() => {
      const msgs = document.querySelector('[role="main"], [region="Message list container with messages, suggestions and typing indicators"]');
      const text = document.body.innerText || "";
      const alreadySent = text.includes("TravelFrame-Hanoi-Secret-Food-And-Photo-Guide.pdf") || text.includes("Hanoi Secret Food & Photo Map");
      return alreadySent;
    })()`;

    const alreadySent = evalPage(checkSentExpr);
    if (alreadySent) {
      console.log(`  ⏩ Already sent to "${name}", skipping.`);
      continue;
    }

    console.log(`  Drafting message and uploading PDF for "${name}"...`);
    const isVi = name.includes('Nguyễn') || name.includes('Quang');
    const msg = isVi ? VI_MSG : EN_MSG;

    // Fill composer
    const cleanMsg = msg.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\\$/g, '\\$');
    const draftExpr = `(() => {
      const textbox = document.querySelector('[role=textbox]');
      if (!textbox) return false;
      textbox.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
      document.execCommand('insertText', false, \`${cleanMsg}\`);
      return true;
    })()`;
    evalPage(draftExpr);

    // Snapshot to find Attach ref
    const snap = orca('snapshot', ['--page', PAGE]);
    let attachRef = null;
    let sendRef = null;
    for (const line of snap.split('\n')) {
      if (line.includes('button "Attach a file"')) {
        const m = line.match(/ref=(e\d+)/);
        if (m) attachRef = m[1];
      }
      if (line.includes('button "Send"')) {
        const m = line.match(/ref=(e\d+)/);
        if (m) sendRef = m[1];
      }
    }

    if (attachRef) {
      console.log(`  Uploading PDF via ref ${attachRef}...`);
      try {
        orca('upload', ['--page', PAGE, '--element', attachRef, '--files', PDF_PATH]);
        console.log('  Upload triggered, waiting 4s for upload to complete...');
        await sleep(4000);
      } catch (err) {
        console.log('  Upload error:', err.message);
      }
    }

    // Snapshot again to get fresh Send button ref
    const snap2 = orca('snapshot', ['--page', PAGE]);
    let finalSendRef = null;
    for (const line of snap2.split('\n')) {
      if (line.includes('button "Send"') && !line.includes('disabled')) {
        const m = line.match(/ref=(e\d+)/);
        if (m) finalSendRef = m[1];
      }
    }

    if (finalSendRef) {
      console.log(`  Clicking Send button (ref ${finalSendRef})...`);
      orca('click', ['--page', PAGE, '--element', finalSendRef]);
      console.log(`  ✅ Successfully sent to "${name}"!`);
      await sleep(3000);
    } else {
      console.log(`  ⚠️ Send button not active for "${name}".`);
    }
  }

  console.log('\n=== Batch execution finished ===');
}

run().catch(console.error);
