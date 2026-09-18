# SPEC v2 as originally synthesized (before build deviations)

Kept for history. The current spec is ../../SPEC.md; build deviations are in its Appendix A.

# ONE MORE SIDE — Build Spec v2.0

*Supersedes v1.0. Everything in v1 not contradicted here still stands (auto-roller, 3 dice, 3 Recasts, offline card, DEV ad stubs, save/sanitise, ECON block, sim gate, policy guardrails).*

---

## 1. Hook & Title

**ONE MORE SIDE.** You start with a die that has exactly one side. Every coin buys it another side, and the shape itself is the progress bar. A six-sided die reads **1 2 3 4 5 6**. Then you start buying *what the faces do*.

---

## 2. Core Loop & First Two Minutes

**Loop:** tap → the die spins and lands on a face → that face pays, the number floats up **from that die** → a full-width card says `+ SIDE` with a fixed price → tap → the polygon visibly grows an edge → repeat. Later the faces themselves get bought: a `×2 SIDE`, then a `JACKPOT SIDE`.

- **0:00** One pale shape on a ground line, a pulsing finger. Coins: 0. No text.
- **0:00–0:08** Each tap pivots it onto its flat; `+1` floats. ~1.7 taps/s.
- **0:02** `+ SIDE` slides up **ghosted**, reading `ROLL TO UNLOCK`, showing the faint outline of the polygon you'd get.
- **0:06** It lights: price **10**, progress ring filling.
- **0:09 FIRST PURCHASE.** Squash, split to a lens, a `2` stamps on the new edge, 6px shake, coin burst, thunk + rising chime, all other UI frozen 700 ms. `MAX ROLL 1 → 2`.
- **0:09–0:36** Sides 3, 4, 5, 6 arrive every ~6 s (cost rises 16%/side, income rises ~15%/side — the early drip is deliberately near-flat).
- **~0:36** Six sides. It reads as a die: 1,2,3,4,5,6. No copy says so.
- **0:40–1:10** At 8 sides the **`×2 SIDE`** card lights (120). Buy it: the top face tints and grows a small `×2` tag. Next landing on it pays double and the float is tinted to match.
- **1:10–2:00** `ROLLER — 600` appears; the player mashes toward it, sides 9–11 land on the way.

---

## 3. Systems, In Unlock Order

1. **THE DIE (t=0).** `die = { n, x2, tier, jack }`. Faces are `1..n`. A roll picks a uniform index `i ∈ [0,n)` and pays `faceValue(die, i)`.
2. **+ SIDE** (at 6 coins lifetime). Appends face `n+1`. Auto-targets the die with fewest sides. Never a choice. `MAX_SIDES = 100`.
3. **MAX ROLL readout** (t=0). One line under the dice, ticks up on every purchase.
4. **×2 SIDE** (at 8 sides on the target die). Each purchase doubles **one more face, highest first**: purchase `k` doubles face `n−k+1`. Cap `X2_MAX = 12` per die. Doubled faces are tinted and carry a small `×2` tag.
5. **ROLLER** (at 6 sides). Global auto-roll, L0–L11, L0 = 2.0 rolls/s. Manual taps still throw on a 100 ms cooldown. Survives Recast at half level.
6. **JACKPOT SIDE** (at 12 sides on that die **and** roller owned). Face index 0 — the die's `1` — becomes the jackpot: **gold with a star**. It pays `JACK_MULT(t) × (n+1)/2`. Further purchases raise `t`; **there is never a second jackpot face.** Tier `t` requires `n ≥ JACK_MULT(t)/3` sides on that die, so the jackpot grows with the die and the card greys out reading `NEEDS <x> SIDES` rather than silently underpaying.
7. **×3 TIER** (when a die has all 12 ×2 faces). One purchase per die; every doubled face becomes `×3`, tag changes to `×3`. One card, no sub-menu.
8. **+ DIE** (10 sides on die 1 **and** roller L2). New die born at one side. Cap **3**.
9. **DOUBLES / TRIPLES** (auto, from 2 dice, dice with `n ≥ 6` only). Landed numbers equal: all → `×3`, exactly a pair → `×2`. **No connecting line.** The matched dice glow, a `DOUBLES ×2` / `TRIPLES ×3` tag bursts at the midpoint between them for 500 ms, and *then* the per-die floats rise showing the already-multiplied amounts.
10. **SKINS** (first skin affordable). One panel, one grid: 3 die skins × 3 backgrounds. Slot 1 of each is owned from the start. Buy with coins, equip freely, **own all 3 in a category → permanent +10% income**, printed on the panel row. Skins and their bonus survive Recast.
11. **HOT HAND** (rewarded). Chip reads what it does *before* use: `HOT HAND ×3 · 2:00`. While active: countdown ring on the chip, a `×3` badge above the dice, and every float tinted hot-orange.
12. **RECAST — prestige** (250,000 × M run coins, max 3 runs). All dice → 1 side, x2/jackpot/tier → 0, coins → 0, roller → `floor(L/2)`. Kept: shards, multiplier, die slots, skins, half the roller. After run 3 the button reads `RUN 3/3 · ALL THREE RUNS DONE`.
13. **THEME TOGGLE** (t=0). Sun/moon corner icon, real toggle, persisted. **Not** a route into settings.
14. **OFFLINE CARD** (resume > 60 s). One line, one COLLECT, one optional ad DOUBLE.

---

## 4. Economy

All currency through `add/mul/cmp`.

### Faces
```
baseFace(i)  = i+1                       // i = 0..n-1, so faces read 1..n
baseAvg(n)   = (n+1)/2
```
`V(n)` and its 1.55 ladder are **deleted.**

**×2 sides.** With `x2 = k` doubled faces at tier `m ∈ {2,3}`, faces `n-k+1 .. n` pay `m ×` their number.
```
x2Extra(n,k,m) = (m-1) · k·(2n-k+1)/2
ΔE per purchase k = (m-1)·(n-k+1)/n
```
First ×2 on a 6-side die: `+6/6 = +1.00` on an average of 3.5 → **+29%**. The 12th on a 20-side die: `+9/20` → **+3%**. The whole 12-purchase track is worth +83% on a 20-side die and +22% on a 100-side die: **×2 sides are the mid-game engine and fade by design.**

**Jackpot.** Face 0 stops paying 1 and pays `jackVal`:
```
JACK_MULT(t) = ceil(8 · 1.9^(t-1))   t=1..6 → 8, 16, 29, 55, 104, 198
jackVal(n,t) = JACK_MULT(t) · (n+1)/2
gate: n ≥ ceil(JACK_MULT(t)/3)       → 3, 6, 10, 19, 35, 66 sides
```
Income multiplier from the jackpot ≈ `1 + JACK_MULT/n`; with the gate at `3n` the jackpot's share of a die's income is **bounded at exactly 75%**, so normal faces never stop mattering. Tiers roughly double a die's income each — this is the late-game engine, and its side gate is why buying sides stays worth doing to 100.

**Expected payout (single closed form, the only EV in the codebase):**
```
E(die) = [ n(n+1)/2 − 1 + jackVal + x2Extra ] / n
payout = (Σ_d faceValue(die_d, i_d)) · combo · M
M      = (1 + 0.15·shards) · (1 + 0.10·setsComplete) · (hot ? 3 : 1)
income/s = throwRate · Σ_d E(die_d) · c_hat · M
```
`combo`: participants are dice with `n ≥ 6`; all equal → 3, one pair → 2, else 1. `c_hat ≈ 1 + 2/n` at D=2.

### Costs
```
C_side(d,n)  = ceil(10   · 1.16^(n-2) · 4^(d-1))
C_x2(d,k)    = ceil(120  · 2.60^(k-1) · 4^(d-1))     k = 1..12
C_tier3(d)   = ceil(25 · C_x2(d,12))
C_jack(d,t)  = ceil(2500 · 2.80^(t-1) · 4^(d-1))     t = 1..6
C_roller(L)  = ceil(600  · 3.00^(L+1))               L = 0..11
C_die(N)     = 5000 · 12^(N-1)                        → 5,000; 60,000
skins        = die: 0 / 25,000 / 400,000   bg: 0 / 60,000 / 900,000
```

**Why 1.16 and not 2.2.** With faces `1..n`, one more side multiplies a die's base income by only `(n+2)/(n+1)` — 14% at n=6, 2% at n=50, 1% at n=99. Sides are **not** the growth engine any more, so their price cannot grow like one. `2.2^98 ≈ 10^33` is not a number in this game. The correct law is the **uniform-spread law**: total income growth across the prototype is ≈ `10^6`, spread over 98 side purchases → `10^(6/98) = 1.152`. Rounded to **1.16**, which keeps time-per-side near-flat in the opening (cost +16%/side against income +15%/side) and lets the exponential systems — ×2, jackpot, roller, dice, M — carry the rest. Sample prices: n=6 → 19, n=20 → 145, n=50 → 12,420, n=100 → 20,800,000. Sim may tune `SIDE_GROWTH` **only inside 1.12–1.20**.

### Prestige & offline (unchanged from v1)
```
threshold = 250000 · M      shards = floor(12 · (runCoins/threshold)^0.45)
offline   = 0.5 · autoRate(L) · Σ E(die) · c_hat · M · min(away, 14400)
```
Ad: rate → 1.0, cap → 28800 s, that claim only. Claim lives in the save and accumulates.

### Milestones (sim asserts, ±35%; bot = 1.7 taps/s, buys cheapest income-positive item)

| Milestone | Target (min) |
|---|---|
| First side | 0.15 (**must be < 0.4**) |
| 6 sides | 0.6 |
| First ×2 side | 1.2 |
| Auto-roller bought | 4 |
| 20 sides | 7 |
| First jackpot side | 9 |
| Second die | 14 |
| First Recast | 34 |
| 50 sides on die 1 | 55 |
| 100 sides on die 1 | 105 |
| End of prototype content | 135 |

**Honest statement:** at 135 minutes a committed player has 3 dice at 100 sides, 12 ×2 faces at tier 3, jackpot tier 6, roller L11, both skin sets and three Recasts spent — and the shop is empty for good. That is roughly an evening. Lengthening it means **more content**, not more tuning. Do not attempt to fix it with constants.

### Invariants the headless sim must assert
1. **Income never drops after any purchase** over the *reachable* shape set (what `+ SIDE`, `×2`, `JACKPOT`, `+ DIE` and a Recast can actually produce), including a Recast taken at threshold. Single-press residue ≤ 2%, cumulative dip ≤ 3.5%. The only known negative is growing the smaller of two level dice thinning a match; the `n ≥ 6` participation floor keeps it inside those bounds.
2. **No dead zone over 4 minutes** for an always-open player — asserted on every policy, including one that never presses RECAST. The 1.16 side curve is what makes this bound possible: there is essentially always a cheap next side.
3. `+ SIDE` is never strictly dominated by ROLLER.
4. **Doubles/triples contribution ≤ 15%** of coin-weighted income across the run; instantaneous peak bounded at 35% over all reachable shapes.
5. **Jackpot share ≤ 75%** of any single die's income (structural, but assert it — a broken gate is silent otherwise).
6. **Lifetime coins < 1e15** (tripwire for the plain-number currency helpers; expected peak ≈ 2e10).

---

## 5. Rendering

**Shape by side count** — regular n-gon resting edge-on on the ground line. `R = min(92 + 0.55·n, 140)` px; ×0.72 at D=2, ×0.58 at D=3.
- `n=1` circle with one chord sliced off the bottom; `n=2` lens (emit contact → left tip → over the top → right tip → contact, same winding as the polygon branch).
- `n=3..13` full polygon, every face numbered inside its own edge, rotated parallel to it, at 0.62R.
- `n=14..39` numerals only on the **4 edges nearest the 12-o'clock marker**; the rest become tick marks.
- `n=40..100` reads as a near-circle: ticks every `ceil(n/40)` edges, plus a **value window** at the marker showing the landed number in large type. The window is how a 100-sided die stays legible; it is not a fallback.

**Roll (RNG first, animation second).** Simulation resolves the roll and hands the renderer a result. In-place rotate to the fixed 12 o'clock marker: 2 turns + delta, easeOutQuart, 380 ms, squash 1.00→0.88→1.06→1.00, three alpha ghosts. **Whichever comes first — the tween landing or the next throw — pays the previous throw.**

**Fast-roll mode (> 8 rolls/s).** The polygon never stops: continuous spin blur at a rate proportional to the real roll rate, with a **strobed snap** 8×/s that holds a legible number in the marker window for ~60 ms. It still reads as a spin at any speed. Floats throttled to 8/s; skipped payouts are merged and shown as one summed float. Constant per-frame cost.

**Landed face.** Shown by **position** (it is under the marker) plus a 120 ms white edge flash. **Never by colour.** Colour means face *type* only:
| type | fill | mark |
|---|---|---|
| normal | bone / theme fg | none |
| ×2 (×3) | cool tint | small `×2` tag on the edge |
| jackpot | gold | ★ |

**Payout floats are per-die**, anchored to that die's screen x, rising 70 px over 700 ms (relative to canvas height, never a flat pixel offset). White / cyan > 100 / gold > 10k. Jackpot floats are gold with ★ and trigger a screen-space coin sparkle.

**Doubles burst.** Matched dice pulse a gold rim; `DOUBLES ×2` / `TRIPLES ×3` bursts once at the midpoint, 500 ms; then the per-die floats show the multiplied values. No thread, no line, no ambient graphic between dice ever.

**Add-a-side morph (600 ms, the money shot).** 240 arc-length-parameterised points, point-for-point lerp, easeOutBack 1.7, gold sweep on the new edge, numeral stamps 1.6×→1.0, expanding ring, 6 px shake, **UI frozen 700 ms** (income keeps accruing).

**Visual pass (no external assets, same canvas):**
- **Extruded rim** — a 4–6 px offset copy of the polygon behind the face, darkened, giving depth.
- **Soft lighting** — one linear gradient across the face plus a faint specular arc on the upper-left edges.
- **Landing burst** — dust/spark particles at the contact point, count and radius scaled by `payout / E(die)`.
- **Jackpot sparkle** — screen-space coin glints, 900 ms.
- **Tumble easing** — easeOutQuart plus a 40 ms overshoot settle.

One canvas, one rAF, cancelled when nothing animates and on `visibilitychange`. No physics, ever. `ResizeObserver` on `#stageWrap` drives `sizeCanvas`; no minimum logical height.

---

## 6. UI — 360 × 740

- **0–52 px.** Coin counter, centred, tabular, lerps over 180 ms. **Top-left:** sun/moon theme toggle (real toggle, persisted, both modes built from one token set — `--bg --surface --fg --dim --accent --gold --tint --danger`). **Top-right:** mute, then gear (settings). A palette chip appears beside mute once the first skin is affordable.
- **52–112 px.** `MAX ROLL n`. Hot Hand chip when available.
- **112–470 px.** Canvas.
- **470–740 px.** The shop. No tabs, no menu. Full-width 64 px cards: icon, label, fixed price, progress ring filling toward it. Locked cards show a **ghosted preview** of what you'd get. **At most 4 cards on screen**: `+ SIDE` pinned top, `RECAST` pinned bottom when lit, the middle two are the cheapest unlocked of `×2 SIDE`, `JACKPOT`, `×3 TIER`, `ROLLER`, `+ DIE`. Purchases commit **on release**, 12 px slide-off cancels. Owned upgrades never leave the shop.
- **SKINS panel.** One screen, one grid, 2 rows × 3 swatches, each drawn live (a mini die, a mini background). Each swatch shows price, or `OWNED`, or `EQUIPPED`. Under each row: `2 / 3 · COMPLETE FOR +10% INCOME`, filling to `+10% ACTIVE`. **No sub-menus, no tabs, no categories beyond those two rows.**
- **Settings (gear).** Mute, theme, hold-to-confirm hard reset, version. Nothing else.

All targets ≥ 44 px, all thumb-reachable.

---

## 7. Rewarded Ads — unchanged

`Ads.show(id)` stub; pending record written to the save **before** the SDK call; 6 s timeout; grant on success, failure, timeout, no-fill or resume alike; `grantReward` reads only its payload. Exactly two placements, neither in the first session (gated behind a Recast or a ≥30 min return): **OFFLINE DOUBLE** and **HOT HAND**. No interstitials, banners or IAP.

---

## 8. Slot / Wheel Reskin Seam

Build the seam, build zero slot code. All drawing goes through `THEME = { drawFace, faceLabel(i), palette, strings, sounds }`; the simulation reads values only and contains no user-visible "dice"/"side"/"face" strings.
- **A wheel is this n-gon viewed from above.** Same polygon, same uniform landed index, same marker — the marker becomes the pointer and the projection drops the extruded rim. Nothing in the economy changes.
- **A reel is a die with symbol faces.** `faceLabel(i)` returns a symbol; rotate-and-settle becomes translateY-and-settle on the same easing. `×2 SIDE` becomes a boosted symbol, `JACKPOT SIDE` the jackpot symbol, `+ SIDE` becomes `+ SYMBOL`.
- Doubles is already an evaluator over the landed-index array — that *is* a single payline. Multi-reel paylines are extra index sets over the same array.

Slot build, if ever: **separate Play listing, never an in-app mode.** All v1 policy guardrails carry over verbatim.

---

## 9. Long-Term Multi-Dice Layout (designed now, built later)

v2 ships **3 dice maximum**. The layout rule is defined ahead of time so it is never improvised:

| dice | arrangement | scale |
|---|---|---|
| 1–3 | one row | 1.00 / 0.72 / 0.58 |
| 4 | 2 × 2 | 0.50 |
| 5–9 | 3 × 3 | 0.38 |
| >9 | **hard cap at 9** | — |

One slot per die of exactly the width the fit-scale reserved, die centred in its slot; the placement rule and the scale rule read the same per-die budget. Past 9 dice the readable answer is not more polygons but a different object — out of scope, and the cap is what keeps it honest.

---

## 10. Out of Scope

Per-face editing, face swapping, reroll/wild/chain faces, a third face type. More than 3 dice, more than 100 sides, more than 3 Recasts, more than 6 jackpot tiers. Achievements, dailies, streaks, quests, events, minigames, a second currency, a shard shop. Skins beyond the two 3-item categories; skin rarity, crates, or any randomised purchase. Cloud save, accounts, leaderboards, servers, push notifications. Localisation, tutorial text, cutscenes. Landscape, tablet, iOS. 3D, WebGL, physics, imported libraries, Monte Carlo EV. Interstitials, IAP. Capacitor and AdMob integration — **the prototype must be fun in a phone browser first.**

**Build order:** the 1→2→3 side morph on the real phone, then the 100-side near-circle with its value window, then the jackpot landing. If any of those three is not satisfying on the device, stop and rethink before writing anything else.