import { execFileSync } from 'node:child_process';

const ORCA_ELECTRON = '/Applications/Orca.app/Contents/MacOS/Orca';
const ORCA_CLI = '/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/cli/index.js';
const PAGE = 'f750bbb4-b526-4613-bb4f-b5b5b74294dc';

function run(cmd, args) {
  return execFileSync(ORCA_ELECTRON, [ORCA_CLI, cmd, ...args], { encoding: 'utf8' });
}

const expr = `(() => {
  const rows = Array.from(document.querySelectorAll('[role="row"], div[role="presentation"]'));
  return rows.map(r => r.innerText.trim()).filter(t => t.length > 0 && t.length < 250);
})()`;

const res = run('eval', ['--page', PAGE, '--expression', expr, '--json']);
console.log('Threads in Inbox:');
const data = JSON.parse(res);
const arr = JSON.parse(data.result?.result || '[]');
arr.forEach((item, i) => console.log(`[${i}] ${item.replace(/\n/g, ' | ')}`));
