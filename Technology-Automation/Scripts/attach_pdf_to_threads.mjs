import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const PAGE = 'f750bbb4-b526-4613-bb4f-b5b5b74294dc';
const PDF_PATH = path.resolve(process.cwd(), 'Creative-Production/Deliverables/TravelFrame-Hanoi-Secret-Food-And-Photo-Guide.pdf');

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

async function attachPdfToThread(name) {
  console.log(`\n=== Processing PDF Attachment for: ${name} ===`);
  
  // 1. Click on user thread
  const clickThreadExpr = `(() => {
    const all = Array.from(document.querySelectorAll('span, div[dir="auto"], div'));
    const el = all.find(e => e.innerText && e.innerText.trim() === "${name}");
    if (el) {
      el.click();
      return true;
    }
    return false;
  })()`;

  const clicked = evalPage(clickThreadExpr);
  if (!clicked) {
    console.log(`❌ Thread for "${name}" not found in sidebar.`);
    return false;
  }

  console.log(`Clicked "${name}", waiting 2s...`);
  await sleep(2000);

  // 2. Check if PDF already sent in active thread
  const checkAlreadySentExpr = `(() => {
    // Only check the message history area (not the left sidebar)
    const regions = Array.from(document.querySelectorAll('[role="main"], div[aria-label*="Messages"], div[role="region"]'));
    for (const reg of regions) {
      const text = reg.innerText || "";
      if (text.includes("TravelFrame-Hanoi-Secret-Food-And-Photo-Guide.pdf")) {
        return true;
      }
    }
    return false;
  })()`;

  const alreadySent = evalPage(checkAlreadySentExpr);
  if (alreadySent) {
    console.log(`⏩ PDF already sent to "${name}", skipping.`);
    return true;
  }

  // 3. Snapshot to find "Attach a file" button
  const snap = orca('snapshot', ['--page', PAGE]);
  let attachRef = null;
  for (const line of snap.split('\n')) {
    if (line.includes('button "Attach a file"')) {
      const m = line.match(/ref=(e\d+)/);
      if (m) attachRef = m[1];
    }
  }

  if (!attachRef) {
    console.log(`❌ "Attach a file" button not found for "${name}".`);
    return false;
  }

  console.log(`Found attach button (ref ${attachRef}), uploading PDF...`);
  try {
    orca('upload', ['--page', PAGE, '--element', attachRef, '--files', PDF_PATH]);
  } catch (err) {
    console.log(`Upload command error:`, err.message);
    return false;
  }

  console.log(`Waiting 4s for PDF upload to process...`);
  await sleep(4000);

  // 4. Snapshot again to find enabled Send button
  const snap2 = orca('snapshot', ['--page', PAGE]);
  let sendRef = null;
  for (const line of snap2.split('\n')) {
    if (line.includes('button "Send"') && !line.includes('disabled')) {
      const m = line.match(/ref=(e\d+)/);
      if (m) sendRef = m[1];
    }
  }

  if (!sendRef) {
    console.log(`⚠️ Send button not enabled for "${name}". Waiting 3 more seconds...`);
    await sleep(3000);
    const snap3 = orca('snapshot', ['--page', PAGE]);
    for (const line of snap3.split('\n')) {
      if (line.includes('button "Send"') && !line.includes('disabled')) {
        const m = line.match(/ref=(e\d+)/);
        if (m) sendRef = m[1];
      }
    }
  }

  if (sendRef) {
    console.log(`Clicking Send button (ref ${sendRef})...`);
    orca('click', ['--page', PAGE, '--element', sendRef]);
    console.log(`✅ Successfully sent PDF to "${name}"!`);
    await sleep(2500);
    return true;
  } else {
    console.log(`❌ Send button still not available for "${name}".`);
    return false;
  }
}

async function main() {
  console.log('=== Starting PDF Attachments to Messenger Threads ===');
  
  const targets = [
    'Leesha Nt',
    'John Taylor',
    'Lan Nguyen',
    'Prasurya Borgohain',
    'Sandra Walker',
    'Olli Hamann',
    'Lotta Norrhede Wahlund',
    'Duane Sng'
  ];

  let successCount = 0;
  for (const name of targets) {
    const ok = await attachPdfToThread(name);
    if (ok) successCount++;
    await sleep(2000);
  }

  console.log(`\n=== Finished! PDF sent to ${successCount}/${targets.length} threads. ===`);
}

main().catch(console.error);
