/* check.js - syntax gate for index.html.
   Pulls every inline <script> block out of the page, compiles each one with
   vm.Script, then evaluates the economy block on its own and pokes it to make
   sure the ladders the simulator relies on are actually there.
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

const approx = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 1 : tol);

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
    const K = E.K;
    const needed = [
      'faceValue', 'faceType', 'dieExpected', 'sideCost', 'x2Cost', 'jackCost',
      'tier3Cost', 'rollerCost', 'autoRate', 'unitCost', 'skinCost', 'shardsFor',
      'globalMult', 'runMult', 'expectedPayout', 'maxRoll', 'newState', 'newDie',
      'buy', 'recast', 'roll', 'income', 'offlineEarnings', 'jackMult', 'jackGate',
      'buySkin', 'setsComplete', 'fmt', 'K'
    ];
    const missing = needed.filter((n) => E[n] === undefined);
    if (missing.length) problems.push(`ECON is missing: ${missing.join(', ')}`);

    /* --- faces read 1..n, full stop. This is the whole point of v2. --- */
    {
      const d = E.newDie();
      d.n = 6;
      for (let i = 0; i < 6; i++) {
        if (E.faceValue(d, i) !== i + 1) problems.push(`a plain 6-sided die must read 1..6; face ${i} paid ${E.faceValue(d, i)}`);
      }
      if (Math.abs(E.dieExpected(d) - 3.5) > 1e-12) problems.push('E(6-sided die) should be exactly 3.5');
      if (Math.abs(E.dieExpected({ n: 100, x2: 0, tier: 2, jack: 0 }) - 50.5) > 1e-12) {
        problems.push('E(100-sided die) should be exactly 50.5');
      }
    }

    /* --- x2 track: highest face first, capped, never reaching face 0 --- */
    {
      const d = { n: 6, x2: 1, tier: 2, jack: 0 };
      if (E.faceValue(d, 5) !== 12) problems.push('the first x2 must double the highest face');
      if (E.faceValue(d, 4) !== 5) problems.push('the first x2 must double exactly one face');
      if (Math.abs(E.dieExpected(d) - 4.5) > 1e-12) problems.push('one x2 on a 6-sided die should take E from 3.5 to 4.5');
      const d3 = { n: 20, x2: 12, tier: 3, jack: 0 };
      const plain = 10.5;
      const want = plain + 2 * 12 * (2 * 20 - 12 + 1) / 2 / 20;
      if (Math.abs(E.dieExpected(d3) - want) > 1e-9) problems.push('x2Extra closed form disagrees with the spec');
      if (K.X2_MAX !== 12) problems.push('X2_MAX must be 12');
    }

    /* --- the closed form must equal a brute sum over the faces, always --- */
    {
      const shapes = [
        { n: 6, x2: 0, tier: 2, jack: 0 }, { n: 13, x2: 5, tier: 2, jack: 0 },
        { n: 20, x2: 12, tier: 3, jack: 2 }, { n: 41, x2: 7, tier: 2, jack: 4 },
        { n: 100, x2: 12, tier: 3, jack: 6 }, { n: 12, x2: 11, tier: 2, jack: 1 }
      ];
      for (const d of shapes) {
        let sum = 0;
        for (let i = 0; i < d.n; i++) sum += E.faceValue(d, i);
        if (Math.abs(sum / d.n - E.dieExpected(d)) > 1e-9) {
          problems.push(`dieExpected disagrees with the face sum at ${JSON.stringify(d)}`);
        }
      }
    }

    /* --- jackpot: one face, face 0, share bounded at 75% --- */
    {
      const mults = [8, 16, 29, 55, 105, 199];
      mults.forEach((v, i) => {
        if (E.jackMult(i + 1) !== v) problems.push(`jackMult(${i + 1}) = ${E.jackMult(i + 1)}, expected ${v}`);
      });
      if (E.jackMult(K.JACK_MAX_TIER + 1) !== undefined && K.JACK_MAX_TIER !== 6) {
        problems.push('JACK_MAX_TIER must be 6');
      }
      for (let t = 1; t <= K.JACK_MAX_TIER; t++) {
        const n = E.jackGate(t);
        if (n > K.MAX_SIDES) problems.push(`jackpot tier ${t} is unreachable: needs ${n} sides`);
        const share = E.jackShare({ n, x2: 0, tier: 2, jack: t });
        if (share > K.JACK_SHARE_CAP + 1e-9) {
          problems.push(`jackpot tier ${t} at its gate takes ${(share * 100).toFixed(1)}% of the die (cap 75%)`);
        }
      }
      const d = { n: 20, x2: 0, tier: 2, jack: 1 };
      if (E.faceType(d, 0) !== 'jack') problems.push('the jackpot must be face index 0');
      let jacks = 0;
      for (let i = 0; i < d.n; i++) if (E.faceType(d, i) === 'jack') jacks++;
      if (jacks !== 1) problems.push(`a die has ${jacks} jackpot faces; there is only ever one`);
    }

    /* --- cost ladders, printed in SPEC.md section 4 --- */
    {
      /* The published ladder for SIDE_BASE 13 / SIDE_GROWTH 1.13. See the
         comments on those two constants for why they moved off the spec's 10
         and 1.16, and SPEC.md section 4. */
      const sides = [13, 15, 17, 19, 22, 24, 28, 31, 35, 40, 45, 50, 57, 64, 72, 82, 92, 104, 118];
      sides.forEach((v, i) => {
        const got = E.sideCost(1, i + 2);
        if (!approx(got, v)) problems.push(`sideCost(1, ${i + 2}) = ${got}, spec says ${v}`);
      });
      if (!approx(E.sideCost(1, 50), 4589, 2)) {
        problems.push(`sideCost(1,50) = ${E.sideCost(1, 50)}, expected 4589`);
      }
      if (!approx(E.sideCost(1, 100), 2068383, 200)) {
        problems.push(`sideCost(1,100) = ${E.sideCost(1, 100)}, expected about 2.07M`);
      }
      if (K.SIDE_GROWTH < 1.12 || K.SIDE_GROWTH > 1.20) {
        problems.push(`SIDE_GROWTH ${K.SIDE_GROWTH} is outside the 1.12-1.20 band the spec allows`);
      }
      const rollers = [600, 1620, 4374, 11810, 31887, 86094, 232453, 627622,
                       1694578, 4575359, 12353468, 33354364];
      rollers.forEach((v, i) => {
        const got = E.rollerCost(i - 1);
        if (!approx(got, v)) problems.push(`rollerCost(level ${i - 1}) = ${got}, spec says ${v}`);
      });
      if (K.MAX_ROLLER_LEVEL + 1 !== rollers.length) problems.push('roller ladder length does not match MAX_ROLLER_LEVEL');
      if (E.unitCost(1) !== 5000 || E.unitCost(2) !== 60000) problems.push('unitCost ladder is not 5000 / 60000');
      if (E.x2Cost(1, 1) !== 90 || E.x2Cost(1, 12) !== 184320) {
        problems.push('x2 ladder does not run 90 .. 184320 over its twelve steps');
      }
      if (E.x2Cost(2, 1) !== 360) problems.push('the per-die 4x cost multiplier is missing from x2Cost');
      /* JACK_BASE moved 2500 -> 4000: at 2500 a jackpot beeline reached the
         game's headline moment at 4.06 min against a 9-minute target. See
         SPEC.md appendix A1. */
      if (E.jackCost(1, 1) !== 4000 || !approx(E.jackCost(1, 6), 4000 * Math.pow(2.8, 5), 2)) {
        problems.push('jackpot ladder does not start at 4000 with growth 2.80');
      }
      if (!approx(E.tier3Cost(1), K.TIER3_MULT * E.x2Cost(1, 12), 2)) problems.push('tier3Cost is not TIER3_MULT x the last x2');
      if (E.skinCost('die', 1) !== 25000 || E.skinCost('die', 2) !== 400000) problems.push('die skin prices are not 0 / 25000 / 400000');
      if (E.skinCost('bg', 1) !== 60000 || E.skinCost('bg', 2) !== 900000) problems.push('background prices are not 0 / 60000 / 900000');
    }

    /* --- shape and scale rules --- */
    if (K.MAX_SIDES !== 100) problems.push('MAX_SIDES must be 100');
    if (K.MAX_DICE !== 3) problems.push('MAX_DICE must be 3 in v2');
    if (E.expectedPayout([E.newDie()]) !== 1) problems.push('a one-sided die must pay exactly 1');

    /* --- combo: still one evaluator over the landed-index array --- */
    {
      const two = [{ n: 6, x2: 0, tier: 2, jack: 0 }, { n: 6, x2: 0, tier: 2, jack: 0 }];
      if (E.comboFor(two, [3, 3]) !== K.COMBO_MULT) problems.push('two matching dice must pay the triples multiplier');
      if (E.comboFor(two, [3, 4]) !== 1) problems.push('two different faces must pay no bonus');
      const small = [{ n: 5, x2: 0, tier: 2, jack: 0 }, { n: 5, x2: 0, tier: 2, jack: 0 }];
      if (E.comboFor(small, [1, 1]) !== 1) problems.push('dice under COMBO_MIN_SIDES must sit the match out');
      if (K.COMBO_MIN_SIDES < 6) problems.push('COMBO_MIN_SIDES below 6 reopens the income-negative + SIDE trap');
    }

    /* --- the gates that keep the opening honest --- */
    {
      const s = E.newState();
      s.dice = [{ n: K.UNLOCK_UNIT_SIDES, x2: 0, tier: 2, jack: 0 }];
      if (E.unlocked(s, 'unit')) problems.push('+DIE unlocks before the roller is owned');
      s.roller = 1;
      if (E.unlocked(s, 'unit')) problems.push('+DIE unlocks at roller L1 - the hand-rolling trap is open');
      s.roller = 2;
      if (!E.unlocked(s, 'unit')) problems.push('+DIE does not unlock at roller L2');
      s.dice = [{ n: K.UNLOCK_UNIT_SIDES - 1, x2: 0, tier: 2, jack: 0 }];
      if (E.unlocked(s, 'unit')) problems.push('+DIE unlocks below UNLOCK_UNIT_SIDES');
    }
    {
      const s = E.newState();
      s.dice = [{ n: 7, x2: 0, tier: 2, jack: 0 }];
      if (E.unlocked(s, 'x2')) problems.push('x2 SIDE unlocks below 8 sides');
      s.dice = [{ n: 8, x2: 0, tier: 2, jack: 0 }];
      if (!E.unlocked(s, 'x2')) problems.push('x2 SIDE does not unlock at 8 sides');
      s.dice = [{ n: 11, x2: 0, tier: 2, jack: 0 }];
      s.roller = 0;
      if (E.unlocked(s, 'jack')) problems.push('JACKPOT unlocks below 12 sides');
      s.dice = [{ n: 12, x2: 0, tier: 2, jack: 0 }];
      s.roller = -1;
      if (E.unlocked(s, 'jack')) problems.push('JACKPOT unlocks before the roller');
      s.roller = 0;
      if (!E.unlocked(s, 'jack')) problems.push('JACKPOT does not unlock at 12 sides with the roller owned');
      s.dice = [{ n: 12, x2: 11, tier: 2, jack: 0 }];
      if (E.unlocked(s, 'x2')) problems.push('the x2 track must stop before it can reach face 0');
    }

    /* --- Recast keeps what the panel says it keeps --- */
    {
      const s = E.newState();
      s.recasts = K.MAX_RECASTS;
      s.runCoins = E.recastThreshold(s) * 100;
      if (E.unlocked(s, 'recast')) problems.push('recast is still offered past MAX_RECASTS');
      const s2 = E.newState();
      s2.dice = [{ n: 40, x2: 6, tier: 2, jack: 3 }, { n: 30, x2: 2, tier: 2, jack: 1 }];
      s2.slots = 2; s2.roller = 7; s2.skinDie = [true, true, true];
      s2.runCoins = E.recastThreshold(s2) * 2;
      E.recast(s2);
      if (s2.dice.some((d) => d.n !== 1 || d.x2 !== 0 || d.jack !== 0 || d.tier !== K.TIER_BASE)) {
        problems.push('Recast must put every die back to one plain side');
      }
      if (s2.slots !== 2) problems.push('Recast must keep die slots');
      if (s2.roller !== 3) problems.push('Recast must keep half the roller level');
      if (E.skinCount(s2, 'die') !== 3) problems.push('Recast must keep skins');
    }

    /* --- skins: a completed set is a permanent +10% --- */
    {
      const s = E.newState();
      const before = E.runMult(s);
      s.skinDie = [true, true, true];
      if (Math.abs(E.runMult(s) - before * 1.1) > 1e-12) problems.push('a completed skin set is not worth +10%');
      s.skinBg = [true, true, true];
      if (E.setsComplete(s) !== 2) problems.push('both sets complete should read 2');
    }

    /* --- the readout the player reads as a promise --- */
    {
      if (E.maxRoll([E.newDie()]) !== 1) problems.push('MAX ROLL must start at 1');
      if (E.maxRoll([{ n: 2, x2: 0, tier: 2, jack: 0 }]) !== 2) problems.push('MAX ROLL must read 2 after the first purchase');
      const d = [{ n: 6, x2: 1, tier: 2, jack: 0 }];
      if (E.maxRoll(d) !== 12) problems.push('MAX ROLL must include the doubled face');
    }

    if (E.fmt(9999) !== '9999' || !/^10\.00K$/.test(E.fmt(10000))) problems.push('fmt should stay plain to 9999 then switch to K');
    if (K.SAVE_VERSION !== 2) problems.push('SAVE_VERSION must be 2');

    console.log('  OK   economy block runs headless and exposes ECON');
  }
}

/* --- the shape outlines, run headless ------------------------------------
   The morph is the money shot and it is a point-for-point lerp between two
   resampled outlines, so both outlines have to be honest closed walks that
   start at the same place and run the same way round. A walk whose length
   exceeds the shape's own perimeter is doubling back through the middle - which
   is exactly what the 3->4 morph did when the outline started at the bottom of
   the shape while the marker and the vertex walk started at the top. */
{
  const g = blocks.find((b) => b.id === 'game');
  if (g) {
    const a = g.code.indexOf('var TOP = -Math.PI / 2;');
    const b = g.code.indexOf('function easeOutQuart');
    if (a < 0 || b < 0) problems.push('cannot find the geometry helpers in the game block');
    else {
      const sb = { Math: Math, E: { K: { MAX_SIDES: 100 } } };
      vm.createContext(sb);
      try {
        vm.runInContext(g.code.slice(a, b), sb, { filename: 'index.html#geometry' });
        for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 20, 40, 60, 100]) {
          const pts = sb.outline(n, 100);
          let walk = 0;
          for (let i = 0; i < pts.length - 1; i++) {
            walk += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
          }
          const ideal = n >= 3 ? 2 * n * 100 * Math.sin(Math.PI / n) : 2 * Math.PI * 100;
          if (walk > ideal * 1.3) {
            problems.push(`outline(${n}) walks ${walk.toFixed(0)} against a perimeter of ` +
              `${ideal.toFixed(0)} - it is crossing itself`);
          }
        }
        for (const n of [1, 2, 3, 4, 5, 6, 11, 12, 39, 40, 99]) {
          const p = sb.resample(sb.outline(n, 100), 240);
          const q = sb.resample(sb.outline(n + 1, 100), 240);
          let worst = 0;
          for (let i = 0; i < 240; i++) worst = Math.max(worst, Math.hypot(p[i][0] - q[i][0], p[i][1] - q[i][1]));
          if (worst > 70) problems.push(`the ${n} -> ${n + 1} morph moves a point ${worst.toFixed(0)}px of a 100px radius`);
        }
        console.log('  OK   shape outlines are closed walks and every morph lerps smoothly');
      } catch (err) {
        problems.push(`geometry helpers threw: ${err.message}`);
      }
    }
  }
}

/* --- the game block must not name a raw colour: both themes come from tokens */
const gameBlock = blocks.find((b) => b.id === 'game');
if (gameBlock) {
  const skinSection = gameBlock.code.indexOf('var THEME');
  const afterSkins = gameBlock.code.slice(skinSection);
  const hex = afterSkins.match(/#[0-9a-fA-F]{6}\b/g);
  if (hex && hex.length) {
    problems.push(`the game block names ${hex.length} raw colour(s) outside the skin tables: ${hex.slice(0, 4).join(', ')}`);
  }
}

/* cheap self-containment checks: the prototype must make no network requests */
if (/<link\b[^>]*rel=["']?stylesheet/i.test(html)) problems.push('external stylesheet link found');
if (/https?:\/\/(?!schemas\.)/i.test(html.replace(/<!--[\s\S]*?-->/g, ''))) {
  problems.push('an http(s) URL appears in index.html - the prototype must be offline-clean');
}

/* both themes must be defined, or light mode is a filter over the dark one */
if (!/:root\[data-theme="light"\]/.test(html)) problems.push('no light-mode token set on :root');
const TOKENS = ['--bg', '--surface', '--fg', '--dim', '--accent', '--gold', '--tint', '--danger'];
const lightBlock = (/:root\[data-theme="light"\]\{([\s\S]*?)\}/.exec(html) || [])[1] || '';
for (const t of TOKENS) {
  if (!lightBlock.includes(t + ':')) problems.push(`light mode does not define ${t}`);
}

console.log('');
if (problems.length) {
  console.log(`FAILED (${problems.length})`);
  problems.forEach((p) => console.log('  - ' + p));
  process.exit(1);
}
console.log('PASSED - index.html compiles clean and ECON matches the spec ladders.');
