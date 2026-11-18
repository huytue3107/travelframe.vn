import { execFileSync } from 'node:child_process';

const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const PAGE = 'f750bbb4-b526-4613-bb4f-b5b5b74294dc';

const EN_MSG = `Hi there! 🥩✨ The sizzling steak & eggs from our video is at 5 Nguyễn Trung Trực (near Old Quarter). We have also put together our Hanoi Secret Food & Photo Guide with top local hidden spots.

📸 Tip: We also run casual 2-hour photo walks where a local friend guides you through hidden alleys and captures candid vacation photos for just $30/hour. Let us know your travel dates if you would love to join! 🥖✈️`;

const VI_MSG = `Chào bạn! 🥩✨ Quán Bít Tết / Bò Né xèo xèo trong video của TravelFrame ở số 5 Nguyễn Trung Trực (ngay Ba Đình / sát Phố Cổ Hà Nội) nhé!

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

async function replyToCommenter(name, isVi = false) {
  console.log(`\n--- Processing: ${name} ---`);
  
  // 1. Find and click "Send message" button for this commenter
  const clickSendMsgExpr = `(() => {
    const roleButtons = Array.from(document.querySelectorAll('[role="button"]'));
    let targetBtn = null;
    for (const btn of roleButtons) {
      if (btn.innerText?.trim() === 'Send message') {
        let p = btn;
        for (let i = 0; i < 8; i++) {
          p = p.parentElement;
          if (!p) break;
          if ((p.innerText || '').includes("${name}")) {
            targetBtn = btn;
            break;
          }
        }
        if (targetBtn) break;
      }
    }
    if (targetBtn) {
      targetBtn.click();
      return true;
    }
    return false;
  })()`;

  const clicked = evalPage(clickSendMsgExpr);
  if (!clicked) {
    console.log(`❌ "Send message" button not found for ${name} (maybe already sent or not visible).`);
    return false;
  }

  console.log(`Clicked "Send message" for ${name}, waiting for dialog...`);
  await sleep(2500);

  // 2. Fill message in dialog
  const msg = isVi ? VI_MSG : EN_MSG;
  const cleanMsg = msg.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  const fillExpr = `(() => {
    const tb = document.querySelector('[role="dialog"] [role="textbox"], [role="dialog"] textarea');
    if (!tb) return false;
    tb.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    document.execCommand('insertText', false, \`${cleanMsg}\`);
    return true;
  })()`;

  const filled = evalPage(fillExpr);
  if (!filled) {
    console.log(`❌ Failed to fill textbox in dialog for ${name}.`);
    // Close dialog if open
    evalPage(`(() => {
      const cancelBtn = Array.from(document.querySelectorAll('[role="dialog"] [role="button"]')).find(b => (b.innerText || '').includes('Go back') || (b.innerText || '').includes('Cancel'));
      if (cancelBtn) cancelBtn.click();
    })()`);
    return false;
  }

  console.log(`Filled message for ${name}, waiting 1s...`);
  await sleep(1000);

  // 3. Click Send Message button inside dialog
  const submitExpr = `(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const sendBtn = Array.from(dialog.querySelectorAll('[role="button"]')).find(b => (b.innerText || '').trim() === 'Send Message' && !b.disabled);
    if (sendBtn) {
      sendBtn.click();
      return true;
    }
    return false;
  })()`;

  const submitted = evalPage(submitExpr);
  if (!submitted) {
    console.log(`❌ Send Message button not active in dialog for ${name}.`);
    return false;
  }

  console.log(`Clicked "Send Message", waiting for completion...`);
  // Wait up to 10s for dialog to disappear
  for (let t = 0; t < 10; t++) {
    await sleep(1000);
    const dialogOpen = evalPage(`(() => !!document.querySelector('[role="dialog"]'))()`);
    if (!dialogOpen) {
      console.log(`✅ Successfully sent private reply to ${name}!`);
      await sleep(2000);
      return true;
    }
  }

  console.log(`⚠️ Dialog still open after 10s for ${name}.`);
  return false;
}

async function main() {
  console.log('=== Starting FB Comments Private Reply Dispatch ===');
  
  // Make sure comments are fully expanded
  evalPage(`(() => {
    const allRoleButtons = Array.from(document.querySelectorAll('[role="button"]'));
    const btn = allRoleButtons.find(b => (b.innerText || '').includes('View more comments'));
    if (btn) btn.click();
  })()`);
  await sleep(2000);

  const targets = [
    { name: 'Duane Sng', isVi: false },
    { name: 'Lotta Norrhede Wahlund', isVi: false },
    { name: 'Olli Hamann', isVi: false },
    { name: 'Sandra Walker', isVi: false },
    { name: 'Prasurya Borgohain', isVi: false },
    { name: 'Lan Nguyen', isVi: true },
    { name: 'John Taylor', isVi: false },
    { name: 'Leesha Nt', isVi: false }
  ];

  let successCount = 0;
  for (const t of targets) {
    const ok = await replyToCommenter(t.name, t.isVi);
    if (ok) successCount++;
    await sleep(2500); // polite delay between sends
  }

  console.log(`\n=== Finished! Successfully sent private replies to ${successCount}/${targets.length} commenters. ===`);
}

main().catch(console.error);
