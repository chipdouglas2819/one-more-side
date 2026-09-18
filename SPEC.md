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
- **0:40–1:10** At 9 sides the **`×2 SIDE`** card lights (120). Buy it: the top face tints and grows a small `×2` tag. Next landing on it pays double and the float is tinted to match.
- **1:10–2:00** `ROLLER — 600` appears; the player mashes toward it, sides 9–11 land on the way.

---

## 3. Systems, In Unlock Order

1. **THE DIE (t=0).** `die = { n, x2, tier, jack }`. Faces are `1..n`. A roll picks a uniform index `i ∈ [0,n)` and pays `faceValue(die, i)`.
2. **+ SIDE** (at 6 coins lifetime). Appends face `n+1`. Auto-targets the die with fewest sides — falling through to the next-smallest when growing the smallest one would *lower* income, which happens only at the `COMBO_MIN_SIDES` crossing. Never a choice. `MAX_SIDES = 100`.
3. **MAX ROLL readout** (t=0). One line under the dice, ticks up on every purchase.
4. **×2 SIDE** (at 9 sides on the target die; was 8, see A14). Each purchase doubles **one more face, highest first**: purchase `k` doubles face `n−k+1`. Cap `X2_MAX = 12` per die. Doubled faces are tinted and carry a small `×2` tag.
5. **ROLLER** (at 6 sides). Global auto-roll, L0–L11, L0 = 2.0 rolls/s. Manual taps still throw on a 100 ms cooldown. Survives Recast at half level.
6. **JACKPOT SIDE** (at 12 sides on that die **and** roller owned). Face index 0 — the die's `1` — becomes the jackpot: **gold with a star**. It pays `JACK_MULT(t) × (n+1)/2`. Further purchases raise `t`; **there is never a second jackpot face.** Tier `t` requires `n ≥ JACK_MULT(t)/3` sides on that die, so the jackpot grows with the die and the card greys out reading `NEEDS <x> SIDES` rather than silently underpaying.
7. **×3 TIER** (when a die has all 12 ×2 faces). One purchase per die; every doubled face becomes `×3`, tag changes to `×3`. One card, no sub-menu.
8. **+ DIE** (10 sides on die 1 **and** roller L2). New die born at one side. Cap **3**.
9. **DOUBLES / TRIPLES** (auto, from 2 dice, dice with `n ≥ 6` only). Landed numbers equal: three dice → `×3`, any pair → `×2` (so with two dice a match is always `DOUBLES ×2`; appendix A13). **No connecting line.** The matched dice glow, a `DOUBLES ×2` / `TRIPLES ×3` tag bursts at the midpoint between them for 500 ms, and *then* the per-die floats rise showing the already-multiplied amounts.
10. **SKINS** (first skin affordable). One panel, one grid: 3 die skins × 3 backgrounds. Slot 1 of each is owned from the start. Buy with coins, equip freely, **own all 3 in a category → permanent +10% income**, printed on the panel row. Skins and their bonus survive Recast.
11. **HOT HAND** (rewarded). Chip reads what it does *before* use: `HOT HAND ×3 · 2:00`. While active: countdown ring on the chip, a `×3` badge above the dice, and every float tinted hot-orange. While cooling down it reads `HOT HAND ↻ 17m 59s` (no `×3`, so it cannot be read as a running buff), dimmed and not tappable.
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
First ×2 on a 9-side die: `+9/9 = +1.00` on an average of 5 → **+20%**. The 12th on a 20-side die: `+9/20` → **+3%**. The whole 12-purchase track is worth +83% on a 20-side die and +22% on a 100-side die: **×2 sides are the mid-game engine and fade by design.**

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
`combo`: participants are dice with `n ≥ 6`; three equal → 3, a pair → 2, else 1 (A13). `c_hat ≈ 1 + 2/n` at D=2.

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
threshold = 250000 · (1 + 0.15·shards)      shards = floor(12 · min(runCoins/threshold, 2)^0.45)
offline   = 0.5 · autoRate(L) · Σ E(die) · c_hat · M · min(away, 14400)
```
Ad: rate → 1.0, cap → 28800 s, that claim only. Claim lives in the save and accumulates.

### Milestones (sim asserts, ±35%; bot = 1.7 taps/s, buys cheapest income-positive item)

**These targets are asserted against the reference bot only.** Other reasonable
ways to play land outside ±35% on individual rows without producing a bad
experience — a jackpot beeline reaches the first jackpot at 5.1 min, a
second-die rush reaches 20 sides at 9.9, a deep prestige hoard reaches its first
Recast at 78. `sim.js` prints all of them as WARN for shape. The four opening
marks — first side, 6 sides, first ×2, 20 sides — hold on every policy measured.

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

**Honest statement — content length is a RANGE, 86–130 minutes, not a number.**
The reference bot buys the cheapest income-positive card, which is what the
shop's own progress rings point at, and finishes at 130.3 min. A player who
works out that the jackpot is the big lever and buys by return instead, at the
*same* 1.7 taps/s, finishes at 86.1 (`optimiser` in `sim.js`, which asserts the
band as well as printing it). The milestone table above is the reference bot's;
the optimiser's mid-game rows are roughly half of it, and that is a difference
in buying order, not a bug. At either end a committed player finishes with 3
dice at 100 sides, 12 ×2 faces at tier 3, jackpot tier 6, roller L11, both skin
sets and three Recasts spent — and the shop is empty for good. That is roughly
an evening. Lengthening it means **more content**, not more tuning. Do not
attempt to fix it with constants.

### Invariants the headless sim must assert
1. **Income never drops after any purchase** over the *reachable* shape set (what `+ SIDE`, `×2`, `JACKPOT`, `+ DIE` and a Recast can actually produce), including a Recast taken at threshold. Single-press residue ≤ 2%, cumulative dip ≤ 3.5%. The only known negative is growing the smaller of two level dice thinning a match; the `n ≥ 6` participation floor keeps it inside those bounds.
2. **No dead zone over 4 minutes** for an always-open player — asserted on every policy, including one that never presses RECAST, *up to the moment RECAST lights and that player turns it down*. The 1.16 side curve is what makes this bound possible: there is essentially always a cheap next side. After declining the reset, a hoarder is grinding 16×-priced third-die upgrades at a multiplier the game offered to raise, and `sim.js` measures and prints those gaps (21 of them, longest 10.3 min) as *off-curve* rather than gating on them. The bound used to "hold" for that player only because `sideTarget` froze them out of `+ SIDE` entirely so they had nothing to buy at all — a worse outcome than a gap, and the reason the rule changed.
3. `+ SIDE` is never strictly dominated by ROLLER.
4. **Doubles/triples contribution ≤ 15%** of coin-weighted income across the run; instantaneous peak bounded at 35% over all reachable shapes.
5. **Jackpot share ≤ 75%** of any single die's income (structural, but assert it — a broken gate is silent otherwise).
6. **Lifetime coins < 1e15** (tripwire for the plain-number currency helpers; measured peak 4.71e9 on the jackpot beeline, which banks tier after tier for ten hours, and 4.94e8 on the reference bot — the peak is taken across *every* policy the sim runs, not just the reference one. That leaves five and a half orders of magnitude of headroom against the 9.01e15 exact-integer limit, which is ample for a 3-dice / 100-side / 6-tier cap, and no bignum is needed).

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
- **470–740 px.** The shop. No tabs, no menu. Full-width 64 px cards: icon, label, fixed price, progress ring filling toward it. Locked cards show a **ghosted preview** of what you'd get. **At most 4 cards on screen**: `+ SIDE` pinned top, `RECAST` pinned bottom when lit, the middle two are the cheapest unlocked of `×2 SIDE`, `JACKPOT`, `×3 TIER`, `ROLLER`, `+ DIE`. Purchases commit **on release**, 12 px slide-off cancels; **holding** a repeatable card keeps buying (appendix A12). Owned upgrades never leave the shop.
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

---
---

# Appendix A — what the build changed, and why

*Not part of the spec above. This is the record of every place the shipped code
disagrees with it. The spec grants the simulator the right to tune `SIDE_GROWTH`;
everything else here is a defect the sim found in the spec's own numbers, with
the measurement that forced the change. `node sim.js` reproduces all of it.*

## A1. Cost constants

| Constant | Spec | Built | Why |
|---|---|---|---|
| `SIDE_BASE` | 10 | **13** | At 10 the opening drip was 4.3 s a side and six sides landed at 0.38 min against the spec's own 0.6 target. 13 gives the ~6 s cadence section 2 describes. |
| `SIDE_GROWTH` | 1.16 | **1.13** | Inside the 1.12–1.20 band the spec allows. At 1.16 the hundredth side costs 20.7M and the side track costs 3.1B per run against a peak income of 13M/min: the bot reached 100 sides at t=382 min against a 105 target and sat in **26 dead zones, the longest 131 minutes**. |
| `X2_BASE` | 120 | **90** | Puts the first ×2 at 1.4 min against the spec's 1.2. |
| `X2_GROWTH` | 2.60 | **2.00** | At 2.60 the twelve-step track spans 120 → 4.4M, a 37,000× cost range for a track the spec itself values at +22% income on a 100-side die. Its last purchases were the worst coins in the game. |
| `TIER3_MULT` | 25 | **6** | The ×3 tier is worth about +7% on a 100-side die. At 25× the last ×2 it cost 23M on die 3 and measured as a single **131-minute wait** — on its own, most of the prototype's stated length — for a 7% raise. |
| `ROLLER_GROWTH` | 3.00 | **2.70** | The twelfth roller level at 3.00 costs 106M: the single most expensive thing in the game and the last dead zone in every run. |
| `RECAST_AT` | 250,000 | **840,000** | The bot cleared 250k at t=20 min against a 34-minute target; 420,000 landed it at 25.7. The doubled 840,000 pays for the flat shard payout of A9 and lands the first Recast at 36.33 — 1.07× the 34-minute target, inside the band. |
| `JACK_BASE` | 2,500 | **4,000** | At 2,500 a player who buys only the sides the jackpot gate demands reached the game's headline moment at 4.06 min against a 9-minute target — outside the band on the fast side, and it burns the reveal before the ×2 track has started. 4,000 moves the reference bot to 10.41 and that beeline to 5.10. 5,500 pushes the reference bot outside the band the other way. |
| `SHARD_COEF` | 12 | **16** | See A9. |
| `SHARD_RATIO_CAP` | — (new) | **1** | See A9. |

Published ladders after the change (die 1): sides `13 15 17 19 22 24 28 31 35 40
45 50 57 64 72 82 92 104 118`, n=50 → 4,589, n=100 → 2,068,383. ×2 `90 … 184,320`.
×3 tier 1,105,920. Roller `600 … 33,354,364`. Everything else — the jackpot
ladder, `+ DIE`, skins, offline, Hot Hand — is exactly as printed above.
Jackpot costs after the change (die 1): `4,000 11.20K 31.36K 87.81K 245.86K
688.41K`.

## A9. The shard payout is FLAT — every run is worth exactly 16 shards

Spec: `shards = floor(12 · (runCoins/threshold)^0.45)`, unbounded in the ratio.
Built: `SHARD_COEF = 16`, `SHARD_RATIO_CAP = 1` and `RECAST_AT` doubled to
840,000. The ratio saturates at 1, so a run pays exactly 16 shards and the game
exactly 48 — `M ×8.20`, or ×9.84 with both skin sets — the moment the card
lights.

The number of Recasts is capped at 3 and the per-press payout was not, so the
only correct play was to bank as long as possible, and the RECAST card lighting
at exactly the threshold was the game's own "show, don't tell" signal telling the
player to take the worse action. Measured with identical buying at 1.7 taps/s:
pressing at the threshold ended content at 132.7 min with `M ×7.68`; waiting for
twice it ended at 128.6 with ×9.84. Faster *and* 28% stronger — dominance on both
axes, not a trade-off.

**Clamping the ratio at 2 did not fix that, and this appendix used to claim it
did.** A cap only moves the ceiling; every coin banked *up to* the cap still paid
more (12 shards at 1.0×, 13 at 1.25×, 14 at 1.5×, 16 at 2.0×), so waiting still
won on both axes — 88.7 min / 36 shards / ×7.68 pressing at the threshold against
86.0 / 48 / ×9.84 waiting for 2×.

A flat payout removes the incentive instead of bounding it. `sim.js` now asserts
this directly rather than arguing it in prose: the `hoard-2x` policy buys exactly
what `optimiser` buys and differs only in waiting for twice the threshold, and it
finishes at **100.5 min with the same 48 shards and the same ×9.84** against the
optimiser's 86.1. Waiting costs 14 minutes and buys nothing. The lit button is
the best button *by construction*.

The card says so by having nothing more to offer: once RECAST is lit it reads a
fixed `+16 SHARDS` over a plain progress ring, with the run counter as its price.
No rising number, no second bar, nothing to explain.

## A2. The match multiplies the matched dice, not the whole throw

Spec section 4 writes `payout = (Σ_d faceValue) · combo · M`. Built as
`paid[d] = faceValue_d · (d matched ? combo : 1) · M`.

The spec's form makes the bonus scale with a die that took **no part** in the
match. With dice at 100 and 6 sides — reachable, because `+ DIE` appends a
one-sided die and the auto-target then grows it — the 6/6 match was worth a
multiple of the 100-side die's average, and growing one of the small dice thinned
it enough to cost **7.5% of income over 13 consecutive presses**. That is the
coin counter going backwards for minutes on the only button the player has, which
is exactly what invariant 1 forbids, and no participation floor fixes it.

It is also what the screen already shows: two dice glowing, two multiplied floats
over them, and nothing over the third.

## A3. A die on its own jackpot face sits the match out entirely

`comboEligible(die, i)` is false on a jackpot face, and `matchedSet`, `comboFor`,
`setOwnEV`, `maxRoll` and `roll` all read it. One jackpot face is worth thousands
of ordinary ones; letting a match land on it made the match bonus dwarf
everything else and reopened the same monotonicity hole as A2. The rule is one
sentence to a player — *the jackpot pays the jackpot, it does not also pay
doubles* — and the gold star float and the DOUBLES tag never argue over the same
coins.

**The first build only did the economy half.** `comboFace` zeroed the *payout*
contribution, but `comboFor` and `matchedSet` still compared raw landed indices,
so the match was still **declared**: two dice that each owned a jackpot and both
landed index 0 glowed gold and burst a full `DOUBLES ×2` tag between them while
multiplying nothing at all. The game announced a multiplier it had not paid,
which is the worst form of the "i dont know why some are randomly 2x" confusion
this appendix exists to close. Excluding the die from the *set* rather than
zeroing its *value* makes the paid match and the drawn match the same object:
fewer than two dice left means combo 1, no tag and no glow.

## A4. The jackpot side gate is solved, not printed

Spec: `gate = ceil(JACK_MULT(t)/3)` → 3, 6, 10, 19, 35, 66.
Built: the smallest `n` at which the jackpot's share of that die is actually
≤ 75%, floored at the 12-side unlock → **12, 12, 12, 19, 36, 67**.

The printed gate breaks its own bound: tier 5 at 35 sides takes 75.03%, tier 1 at
3 sides takes 76.2%. Solving the inequality directly makes invariant 5 structural
instead of approximate, and the ladder moves by at most one side.

`JACK_MULT` is `ceil`, as the formula says, so tiers 5 and 6 are **105 and 199**;
the spec's table prints 104 and 198, which is `round`. The formula won.

## A5. Two milestone targets

- **20 sides: 7 min → 1.5 min.** The spec's own opening script has sides arriving
  every ~6 s on a near-flat drip, which puts the twentieth side just under two
  minutes. 7 minutes would need sides to cost roughly four times what the spec's
  own side law prices them at. The design is right; the table was not.
- **50 and 100 sides are measured on the final run.** A Recast puts every die back
  to one side on purpose, so "50 sides on die 1" first happens at minute eight on
  a die the player is about to melt down. The spec's table runs these two *after*
  the first Recast and *before* the end of content, so what is measured is the die
  the player finishes with.

Every other target in the table is hit as written.

## A6. Invariant 1 is asserted over a lattice superset

The spec says "the reachable shape set". The build scans every combination of
side counts on a coarse ladder (1–14, then 16 … 100) for one, two and three dice,
crossed with eight upgrade profiles (x2 0, 1, 2, 3, 6, 12, with and without
jackpots) — 146,224 shapes. Doubled faces are only given to dice at or above
`X2_UNLOCK_SIDES`, so every scanned shape is at least possible in kind. Testing a superset is stronger than testing the reachable set and does
not need an argument about which shapes `+ DIE` and a Recast can produce. The
played path of all six policies is checked exactly, on every purchase, as well.

## A10. `+ SIDE` falls through the `COMBO_MIN_SIDES` cliff

`sideTarget` always targeted the die with the fewest sides. The press that takes
a die from 5 to 6 joins it to the match and thins the match it joins, so it is
the one forced purchase that can lower income — measured at −1.19% on 18/18/5
down to −0.23% on 100/100/5, always recovered by the next side. The dip itself is
inside invariant 1's 2% bound and is fine.

What was not fine is what it did to a player who declines income-negative
purchases. Because the smallest die was the *only* target the rule would ever
offer, that player was locked out of `+ SIDE` on **every** die, not just the small
one. Three of the eight simulated policies parked at big/big/5 — never-prestige
froze at 60/59/5 and made zero purchases of any kind for the following 400
minutes — with dice 1 and 2 capped at 60 sides and the jackpot stuck at tier 5.
Roughly half the prototype was unreachable for a player who does not prestige,
which is the single most common idle-game behaviour. The reference bot never saw
it only because a Recast resets all three dice at once, so they grow in lockstep.

Built: among dice under `MAX_SIDES`, smallest first, take the first whose `+1`
does not lower `expectedPayout`, falling back to the smallest if none qualify.
Four lines. The reference bot is unaffected to two decimal places on every
milestone, and the hoarder now reaches 100/100 sides and jackpot tier 6. See
invariant 2 for the dead zones that appear once that player is no longer frozen —
they are real, and they are better than nothing to buy at all.

## A7. Rendering

- **The marker is at 12 o'clock and the landed face is the top face.** Section 5
  says both "resting edge-on on the ground line" and "rotate to the fixed 12
  o'clock marker". v1 put the marker at the ground, where the landed numeral sits
  under the die. The shape still rests on the ground line; the face you read is
  the one under the marker at the top, which is also what section 8 needs when
  that marker becomes a wheel's pointer.
- **Outlines start at the midpoint of face 0, not at the bottom of the shape.**
  Starting at the bottom inserts a chord straight through the middle, and the
  3→4 morph — the first thing a new player sees — lerped through a
  self-intersecting bowtie. `check.js` now asserts that every outline is a closed
  walk no longer than its own perimeter, and that every morph moves each of its
  240 points smoothly.
- **The landing flash is the theme accent, not white.** White on a white face in
  light mode is not a flash.
- **The palette chip sits beside the theme toggle on the left**, not beside mute.
  Three controls on the right ran a six-figure coin counter straight under them.
- **The morph keeps the money shot above 13 sides.** `drawFaceMarks` used to bail
  out entirely while `morphPts` was set on a die over 13 sides, so every side
  purchase from the fourteenth on — almost all of them — morphed into a blank
  polygon and lost the 1.6×→1.0 numeral stamp section 5 calls the money shot.
  Only the per-edge ticks and the four `near`-mode numerals genuinely cannot be
  placed on an interpolating outline. The stamp is drawn during the morph, and on
  a near-circle (40+ sides, where there is no rim to stamp) the **value window**
  pops the new highest face instead.
- **Doubled and jackpot faces wear a pip on the rim**, not only a tick. Past 13
  sides the wedge tint is a few degrees wide and the tick is one line among a
  hundred; a filled dot survives any side count. The first `×2` and the first
  `JACKPOT` ever bought also print one line naming the colour, once each.
- **Payout floats use five lanes and round rather than floor.** A human tapping
  at their own pace lands four to six floats inside one 700 ms lifetime, so three
  lanes still stacked two deep. `fmt` floors, which is right for a balance the
  player must not be told they have more of than they do and wrong for a payout:
  after one Recast `M` is 3.40 and a face worth 3 pays 10.20, so every float
  under-reported by up to a coin while the counter climbed the true amount.
- **Shop cards shrink to 58 px below 700 px of viewport height.** Four 64 px
  cards plus gaps and padding is 298 px against the 270 px section 6 reserves; on
  a 360×640 device that left the canvas 230 px and `fitScale` resolved a 100-side
  die to an 8.8 px edge. 64 px is the smallest comfortable thumb target, so it is
  kept wherever there is room.
- **The theme is written to a synchronous `localStorage` key as well as the
  save**, and a tiny inline script in `<head>` applies it before first paint. The
  save is still the source of truth; under Capacitor it arrives through an IPC
  round trip, so a light-mode player used to see a full dark page and a dark
  status bar on every launch.

## A11. Wall-clock buffs are re-clamped at read time, not only at load

`sanitise()` clamped `hotUntil` on load, which left the whole running session
open: take a Hot Hand, wind the device clock back an hour without reloading, and
`Date.now()` sits an hour below `hotUntil` — `×3` on every roll, up to 54 a
second, until the next reload. `hotLeftMs()` is now the only place the game layer
reads `hotUntil`, it pulls the value back to at most `HOT_DURATION_S` whenever it
is read, and it runs every frame and before every throw.

`OFFLINE_CAP_AD_S` was dead. `applyOfflineDouble` doubled the figure that had
*already* been clamped to the four-hour cap, so an eight-hour absence paid 14,400
rate-seconds where the spec says 28,800 — exactly half — and it was the one place
the game computed currency outside ECON. The raw away time is now kept on the
save and the doubled figure comes from `E.offlineEarnings(st, away, true)`, which
applies the ad rate *and* the ad cap. `pendingOfflineAway` is only incremented
when the absence actually produced a claim, so a hundred 20-second app switches
no longer bank phantom away time against no coins.

## A12. Hold to buy, chained morphs, and the Recast screen (v2.1)

*From the owner's feedback after playing v1. No economy constant changed;
everything here is presentation state in `<script id="game">`, and every
purchase is still an ordinary `E.buy`.*

**Hold-to-buy timing** (the `HOLD` table in the game script, asserted by
`check.js`):

- Repeatable cards: `+ SIDE`, `×2 SIDE`, `JACKPOT SIDE`, `ROLLER`. Not `RECAST`,
  not `+ DIE`, not skins, and not `×3 TIER` — it is one purchase per die and a
  flourish of its own, so it stays a tap.
- A quick tap still buys exactly one, **on release**; the 12 px slide-off still
  cancels. Holding: the first repeat at **350 ms**, then **4/s ramping linearly
  to 15/s over 2 s**. At most 3 purchases per frame, and no backlog is banked
  after a stalled frame.
- The repeater stops on release, `pointercancel`, the finger leaving the card
  (once repeating, drift inside the card is not a cancel), the card leaving the
  shop or locking, an `×2` / `JACKPOT` card switching to a different die, a panel
  opening, the page being hidden, or funds running out. `+ SIDE` keeps going
  across dice — it always grows the smallest die, so alternating is its normal
  behaviour, not a target change.
- One press at a time across the whole shop: a second finger is ignored.
- While repeating the card is pressed (gold border) and its ring sweeps round.
  Sound is one short tick per purchase, a semitone higher each time (capped),
  at most ~16/s; haptics at most ~12/s. Jackpot glints merge.

**Chained morphs:**

- One morph per die (`G.morphs`), stored unscaled and in the die's own frame,
  drawn at the die's **current** rotation — the die keeps rolling (or spinning
  in fast mode) while it grows, and its ground contact is read off the outline
  actually drawn.
- A purchase on a die that is already morphing starts from the outline **as
  drawn this frame** and heads for the new one: 0.2 s, easeOutCubic, no
  overshoot, no ring, no shake, no UI freeze. `check.js` asserts the retarget
  is jump-free.
- A roll in flight when its die grows is re-aimed at the new shape's flat
  without moving the rotation drawn that frame.
- During a hold the rim numerals wait; ticks, ×2/★ tints and pips stay; on a
  40+ side die the value window counts the new top face up with a small pulse.
- When the hold ends, **one** settle: 0.6 s easeOutBack onto the final shape,
  the expanding ring, the numeral stamp, one grow chord, one small shake.
- A plain tap is unchanged: the 600 ms money shot with the 700 ms freeze. A
  second `+ SIDE` tap inside that freeze is no longer dropped: it buys and
  retargets the running morph (other cards still wait out the freeze). A
  re-tap while that die is still morphing is treated like a hold step plus
  one settle: no new 700 ms freeze, no re-shake, so fast tapping never keeps
  the stage frozen. Auto-roll payouts that land during a freeze are merged and
  shown as one float when it ends, never dropped.
- The settle after a hold keeps the value window at full opacity (no blink) and
  starts exactly where the swell is drawn (no first-frame jump); its flourish is
  a +5% swell and return (`1 + 0.05·sin(πt)`), visible even when the last
  chained step had already parked.
- The first `+ SIDE` on a die at rest keeps its landed face under the marker
  (the outline is carried round by the difference), so ×2 / ★ wedges and pips
  never jump to another rotation.
- During a hold the numeral under the marker stays readable on dice under 40
  sides; the other rim numerals wait. On 40+ sides the window still counts up.
- `+ DIE` clears any running morph, which is stored at the old dice count's
  radius and would otherwise draw its die too large in the narrower slot.
- A middle card under the finger stays in the shop until release, even if it
  is no longer one of the two cheapest and even after the repeater stopped for
  funds or a retarget; the shop reshuffles after the thumb lifts. A hold that
  bought nothing (the card was a few coins short at 350 ms) falls back to a tap:
  it buys one on release if it can. Shop cards set `touch-action: none` and block the context menu, and
  only the primary button presses them, so Android panning or a long-press
  callout cannot cancel a hold.

**The Recast screen** is numbers and icons, no sentences: title, `RUN n/3`,
the payout multiplier as the hero (`×1.20 → ×4.08`, computed by running
`E.recast` on a copy), `◆ +16`, a KEEP row (shards, dice, roller level, skins),
a RESET row (sides → 1, coins → 0, ×2 ★), and CANCEL / RECAST. `check.js`
fails if a paragraph or a four-word string comes back.

## A13. A pair always pays ×2, and the RECAST bar ignores skin sets (v2.1 fixes)

**Pair rule.** `comboFor` paid `COMBO_MULT` (×3) whenever *every participant*
matched, so with two participating dice a pair paid ×3 and burst `TRIPLES ×3`
between two dice. When a third die reached `COMBO_MIN_SIDES` that pair fell to
×2, and on 100/100/5 the 5→6 press lowered income by 0.235% (upgraded) to
0.349% (plain). A10's fall-through cannot help there because the small die is
the only die left under `MAX_SIDES`, so a player who declines income-negative
purchases froze for good: `never-prestige` stalled 239.7 min at 100/100/5 and
`jack-first` stalled 389.1 min and never reached end of content.

Built (rule change, no constant changed): three matching dice pay ×3, any pair
pays ×2 (`comboFor`, the two-participant branch of `expectedPayout`, and
`maxRoll`). The burst word follows the number of matched dice. Measured with
`node sim.js`:

- Reference gate: all 11 milestones PASS; first Recast 36.33 → 36.68 min, end
  of content 130.29 → 130.46 min.
- Forced `+ SIDE` purchases that lower EV over the 91,390 scanned shapes:
  426 (worst −1.71%) → 3 (worst −0.03%, 6/6/6 → 7/6/6). *Corrected in A14:
  that shape gave ×2 faces to 6-sided dice, which cannot happen; the reachable
  worst case was 8/8/8 and is now removed.*
- Match bonus is 1.0% of coins banked. No policy stalls; `jack-first` now
  finishes at 240.7 min and `never-prestige` grows all three dice to 100.
- `sim.js` now fails any always-open policy with a `+ SIDE` stall over 4 min,
  and its invariant-1 scan presses `E.sideTarget` (the shipped rule) instead of
  a copy of the old fewest-sides rule.

**RECAST threshold.** It was `RECAST_AT × runMult`, and `runMult` includes the
+10% skin-set bonus, so buying the skin that completed a set could push the
threshold above the run's coins and switch off a lit RECAST. It is now
`RECAST_AT × (1 + 0.15·shards)`. Measured: the reference bot is unchanged to two
decimals (it completes no set before its Recasts); the optimiser ends 86.3 →
86.0 min, `hoard-2x` 100.3 → 98.9 min, all gates and invariants PASS.

**v1 save.** After a migration the old `oms.save.v1` key is removed, but only
once the v2 save has been written and read back.

## A14. ×2 SIDE unlocks at 9 sides, not 8 (v2.1 fixes)

**Measured problem.** An independent scan of every die at 6–16 sides with every
per-die ×2 count (1,124,864 shapes) found 12 shapes, all 8/8/8 with 1–3 ×2 faces
on each die, where every die's +1 lowers EV, so `E.sideTarget` must offer a
losing `+ SIDE`. Worst: 8/8/8 with ×2 1/2/2 at **−0.228%** (re-measured here
against ECON). Growing an 8-sided die shifts its ×2 faces up one index and thins
the matched pairs. A player who only buys sides and refuses losing purchases is
frozen there for good. `sim.js` missed it: its scan gave ×2 faces to dice below
the unlock (reporting an unreachable 6/6/6 case) and its coarse profiles never
produced 8/8/8 with 1–3 ×2.

**Built.** `X2_UNLOCK_SIDES` 8 → **9**. `sim.js` now clamps ×2 to 0 below the
unlock and scans ×2 profiles 1, 2 and 3 too (146,224 shapes).

**Measured with `node sim.js`:**

- With the new profiles at 8: 3 losing forced `+ SIDE` purchases, worst −0.15%
  at 8/8/8 (×2 2/2/2). At 9: **0**, worst 0.00%.
- Reference gate: all 11 milestones PASS; first ×2 side stays at 1.39 min, end of
  content 130.46 → 130.47 min. Optimiser 86.0 min unchanged. INVARIANTS PASS.
- The hoard proof now runs hoard levels 1.5×, 2× and 4× for both the cheapest and
  the return-on-investment buyer; every one ends no sooner and with no more
  shards than pressing RECAST when it lights.

## A8. Not built

- **`c_hat`** appears in the spec's `income/s` line as an approximation.
  `expectedPayout` integrates the match exactly, so there is nothing to
  approximate and no `c_hat` anywhere in the code.
- **The `V(n)` deletion is complete.** Nothing in the build knows the 1.55 ladder
  existed, except the v1 save migration, which keeps a die's side count and throws
  its old face values away.
