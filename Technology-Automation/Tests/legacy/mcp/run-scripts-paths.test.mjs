import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Guards against launcher scripts pointing at the wrong folder after a directory move
// (e.g. ROOT resolved one level too shallow -> Technology-Automation/Technology-Automation/...).
const scriptsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../Scripts");

const launchers = readdirSync(scriptsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(scriptsDir, d.name, "run.sh"))
  .filter((p) => existsSync(p));

test("at least one MCP launcher script exists", () => {
  assert.ok(launchers.length > 0);
});

for (const script of launchers) {
  test(`${script.slice(scriptsDir.length + 1)} resolves to an existing server file`, () => {
    const source = readFileSync(script, "utf8");
    const rootMatch = source.match(/ROOT="\$\(cd "\$\(dirname "\$0"\)\/([^"]*)" && pwd\)"/);
    assert.ok(rootMatch, "ROOT assignment not found");
    const root = resolve(dirname(script), rootMatch[1]);
    const targets = [...source.matchAll(/"\$ROOT\/([^"]+\.m?js)"/g)].map((m) => m[1]);
    assert.ok(targets.length > 0, "no node entry point found");
    for (const t of targets) {
      assert.ok(existsSync(join(root, t)), `missing entry point: ${join(root, t)}`);
    }
  });
}
