/* check.js - syntax gate for index.html.
   Pulls every inline <script> block out of the page, compiles each one with
   vm.Script, then evaluates the economy block on its own and pokes it to make
   sure the numbers the simulator relies on are actually there.
   Exits non-zero if anything fails.  Run:  node check.js                    */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FILE = path.join(__dirname, 'index.html');
const html = fs.readFileSync(FILE, 'utf8');

const problems = [];
const blocks = [];

const re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
let m;
while ((m = re.exec(html)) !== null) {
  const attrs = m[1] || '';
  if (/\bsrc\s*=/i.test(attrs)) {
    problems.push(`external script found (the build must be self-contained): ${attrs.trim()}`);
    continue;
  }
  const idMatch = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs);
  const before = html.slice(0, m.index);
  blocks.push({
    id: idMatch ? idMatch[1] : '(no id)',
    code: m[2],
    line: before.split('\n').length
  });
}

if (blocks.length === 0) problems.push('no inline <script> blocks found in index.html');

console.log(`check.js - ${path.basename(FILE)}`);
console.log(`  script blocks: ${blocks.length}`);

for (const b of blocks) {
  try {
    new vm.Script(b.code, { filename: `index.html#${b.id}`, lineOffset: b.line });
    console.log(`  OK   <script id="${b.id}"> at line ${b.line} (${b.code.split('\n').length} lines)`);
  } catch (err) {
    console.log(`  FAIL <script id="${b.id}"> at line ${b.line}`);
    console.log(`       ${err.message}`);
    problems.push(`syntax error in script "${b.id}": ${err.message}`);
  }
}

/* The economy block must stand alone: no DOM, no browser globals. */
const econ = blocks.find((b) => b.id === 'economy');
if (!econ) {
  problems.push('no <script id="economy"> block - sim.js has nothing to read');
} else {
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    vm.runInContext(econ.code, sandbox, { filename: 'index.html#economy' });
  } catch (err) {
    problems.push(`economy block threw while loading: ${err.message}`);
  }
  const E = sandbox.ECON;
  if (!E) {
    problems.push('economy block did not attach globalThis.ECON');
  } else {
    const needed = [
      'faceValue', 'sideCost', 'rollerCost', 'autoRate', 'unitCost', 'shardsFor',
      'globalMult', 'expectedPayout', 'maxRoll', 'newState', 'buy', 'recast',
      'roll', 'income', 'offlineEarnings', 'fmt', 'K'
    ];
    const missing = needed.filter((n) => E[n] === undefined);
    if (missing.length) problems.push(`ECON is missing: ${missing.join(', ')}`);

    /* spot checks against the spec's published ladders */
    const faces = [1, 2, 3, 4, 6, 9, 14, 22, 34, 52, 81, 125, 193, 299, 463, 717, 1110, 1721, 2667, 4134];
    faces.forEach((v, i) => {
      if (E.faceValue(i + 1) !== v) problems.push(`faceValue(${i + 1}) = ${E.faceValue(i + 1)}, spec says ${v}`);
    });
    /* 12 levels at growth 3.0 - see SPEC.md section 4. The spec's original 9
       levels at 3.2 left nothing to buy but the last four sides of die 3, and
       the shop sat greyed out for 14 minutes at a stretch; 11 levels still left
       a never-prestige player a 52-minute wall in the run-3 tail. */
    const rollers = [600, 1800, 5400, 16200, 48600, 145800, 437400, 1312200,
                     3936600, 11809800, 35429400, 106288200];
    rollers.forEach((v, i) => {
      /* The spec prints this ladder rounded, the formula says ceil; a one-coin
         gap on a six-figure price is noise, anything larger is a real bug. */
      const got = E.rollerCost(i - 1);
      if (Math.abs(got - v) > 1) problems.push(`rollerCost(level ${i - 1}) = ${got}, spec says ${v}`);
    });
    if (E.unitCost(1) !== 5000 || E.unitCost(2) !== 60000) problems.push('unitCost ladder is not 5000 / 60000');
    if (E.expectedPayout([1]) !== 1) problems.push('expectedPayout([1]) should be exactly 1');
    if (Math.abs(E.expectedPayout([6]) - 25 / 6) > 1e-9) problems.push('expectedPayout([6]) should be 25/6');
    if (E.maxRoll([1]) !== 1 || E.maxRoll([2]) !== 2) problems.push('maxRoll should read 1 then 2 on the first purchase');
    /* one purchase per level from -1 (not owned) up to MAX_ROLLER_LEVEL-1 */
    if (E.K.MAX_ROLLER_LEVEL + 1 !== rollers.length) problems.push('roller ladder length does not match MAX_ROLLER_LEVEL');
    /* the Recast cap is what makes "content ends after run 3" true in the code */
    {
      const s = E.newState();
      s.recasts = E.K.MAX_RECASTS;
      s.runCoins = E.recastThreshold(s) * 100;
      if (E.unlocked(s, 'recast')) problems.push('recast is still offered past MAX_RECASTS');
    }
    /* +DIE must never be reachable before the roller - that ordering is the
       difference between replaying the good two minutes and a 37-minute hole.
       The gate is three roller levels, not one: at L0 a player could still bank
       for the die and hand-roll for 13 minutes. */
    {
      const s = E.newState();
      s.units = [E.K.UNLOCK_UNIT_SIDES];
      if (E.unlocked(s, 'unit')) problems.push('+DIE unlocks before the roller is owned');
      s.roller = 0;
      if (E.unlocked(s, 'unit')) problems.push('+DIE unlocks at roller L0 - the hand-rolling trap is open');
      s.roller = 1;
      if (E.unlocked(s, 'unit')) problems.push('+DIE unlocks at roller L1 - the hand-rolling trap is open');
      s.roller = 2;
      if (!E.unlocked(s, 'unit')) problems.push('+DIE does not unlock at roller L2');
      s.units = [E.K.UNLOCK_UNIT_SIDES - 1];
      if (E.unlocked(s, 'unit')) problems.push('+DIE unlocks below UNLOCK_UNIT_SIDES');
    }
    /* the combo floor is what keeps a forced + SIDE from lowering income; if it
       ever goes back below 6, sim.js invariant 1 is the thing that will fail */
    if (E.K.COMBO_MIN_SIDES < 6) problems.push('COMBO_MIN_SIDES below 6 reopens the income-negative + SIDE trap');
    if (E.fmt(9999) !== '9999' || !/^10\.00K$/.test(E.fmt(10000))) problems.push('fmt should stay plain to 9999 then switch to K');

    console.log('  OK   economy block runs headless and exposes ECON');
  }
}

/* cheap self-containment checks: the prototype must make no network requests */
if (/<link\b[^>]*rel=["']?stylesheet/i.test(html)) problems.push('external stylesheet link found');
if (/https?:\/\/(?!schemas\.)/i.test(html.replace(/<!--[\s\S]*?-->/g, ''))) {
  problems.push('an http(s) URL appears in index.html - the prototype must be offline-clean');
}

console.log('');
if (problems.length) {
  console.log(`FAILED (${problems.length})`);
  problems.forEach((p) => console.log('  - ' + p));
  process.exit(1);
}
console.log('PASSED - index.html compiles clean and ECON matches the spec ladders.');
