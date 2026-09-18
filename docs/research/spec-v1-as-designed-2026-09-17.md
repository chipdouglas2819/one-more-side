# SPEC v1 as originally synthesized (before build deviations)

Kept for history. The current spec is ../../SPEC.md.

# ONE MORE SIDE — Final Build Spec v1.0

## 1. Hook & Title

**Working title:** ONE MORE SIDE
**Hook:** You start with a die that has exactly one side; every coin buys it another side, and the shape itself is the progress bar.

---

## 2. Core Loop & First Two Minutes

**Loop:** Tap die → it tumbles, lands on a face → that face's value pays coins → one big button says `+ SIDE` with a price → tap → the polygon visibly grows an edge with the next number on it → repeat. Later: auto-roller, then a second die born at one side.

**First two minutes (target, simulator-checked):**

- **0:00** One pale shape on charcoal: a circle with one flat spot on the bottom, resting on a ground line. A pulsing finger icon. Coins: 0. No text.
- **0:00–0:10** Each tap tumbles it one pivot onto its flat; `+1` floats up. ~1.7 taps/s.
- **0:06** `+ SIDE — 10` slides up from the bottom with a progress ring filling as coins accrue.
- **0:10–0:12 FIRST PURCHASE.** Ball squashes, splits into a lens, a `2` stamps onto the new edge, 6px screen shake, coin burst, low thunk + rising chime, **all other UI frozen 700 ms**. `MAX ROLL 1 → 2` ticks under the die. Button re-prices to 20.
- **0:12–0:30** Side 3 (~0:22) → triangle. Side 4 (~0:35) → square.
- **0:35–1:20** Sides 5, 6. Values outpace side count (5→6, 6→9), payouts visibly jump.
- **~1:20** Six sides: the object reads as a die. No copy says so.
- **1:20–2:00** `ROLLER — 600` appears. Player mashes toward it; side 7 lands on the way.

---

## 3. Systems, In Unlock Order

1. **THE DIE (t=0).** `die = { faces: [int] }`. `S = faces.length`. A roll picks uniform index `i ∈ [0,S)` and pays `faces[i]`. That is the whole simulation.
2. **+ SIDE (unlocked at 6 coins earned).** Appends `V(S+1)`. With multiple dice it **auto-targets the die with the fewest sides** (that die pulses). Never a choice.
3. **MAX ROLL readout (t=0).** One line under the die: `MAX ROLL n`. Counts up digit-by-digit on each side purchase.
4. **ROLLER (unlocks at 6 sides).** Global auto-roll, 9 levels. **Level 0 is 2.0 rolls/s, above comfortable thumb speed (~1.7/s) — hard acceptance test on a real phone.** Manual taps still add an extra throw on a 100 ms cooldown. Never gated, never fuelled, never removed mid-run; survives prestige at half level.
5. **+ DIE (unlocks at 10 sides on die 1).** New die born at **one side**. Because + SIDE auto-targets the smallest, the player replays the best two minutes with late-game income. Cap: **3 dice**.
6. **COMBO (auto, from 2 dice).** Over the landed index set: all equal → `×3`; otherwise `×1`. That is the entire rule — readable from the visual (matching faces glow and link with a light thread) and low-variance.
7. **RECAST — prestige (unlocks at 250,000 coins earned this run).** All dice → 1 side, coins → 0, roller → `floor(L/2)`. **Retained:** shards, global multiplier, die slots owned, half the roller. Recast screen leads with what you keep.
8. **OFFLINE CARD (on any resume >60 s).** One line, one big COLLECT, one optional ad DOUBLE.

No files/pips sink, no achievements, no dailies, no tokens, no face types, no second currency.

---

## 4. Economy

All currency arithmetic goes through `add/mul/cmp` helpers from line one (bignum swap later is mechanical).

**Face values (exponential — this is the backbone):**
```
V(n) = ceil(1.55^(n-1))
n=1..20: 1,2,3,4,6,9,14,22,34,52,81,125,193,299,463,717,1110,1721,2667,4134
```
A die with S sides has `faces = [V(1)..V(S)]`.

**Expected value per die:** `E(S) = (1/S) · Σ_{n=1..S} V(n)`
```
E(1..20) = 1, 1.5, 2, 2.5, 3.2, 4.17, 5.57, 7.63, 10.6, 14.7,
           20.7, 29.4, 42.0, 60.4, 87.2, 126.6, 184.4, 269.8, 396, 583
```

**Per-throw payout:** `payout = (Σ_d faces_d[rand_d]) · combo · M`
`combo = 3 if all landed indices equal and D ≥ 2, else 1`.
Measured `c_hat`: D=1 → 1.00; D=2 → `1 + 2/S ≈ 1.10`; D=3 → `1 + 2/S² ≈ 1.02` plus pair-free, so ~1.05. **Do not assume more.**

**Income:** `coins/s = throwRate · (Σ_d E(S_d)) · c_hat · M`

**Auto-roll:** `autoRate(L) = 2.0 · 1.35^L`, L = 0..8 → 2.00, 2.70, 3.65, 4.92, 6.64, 8.97, 12.1, 16.3, 22.1
`C_roller(L) = ceil(600 · 3.2^L)` → 600, 1920, 6144, 19661, 62915, 201327, 644245, 2061584, 6597070

**Side cost:** `C_side(d, n) = ceil(10 · 1.95^(n-2) · 4^(d-1))` for the n-th side of die d.
Die 1 (sides 2..20): 10, 20, 38, 74, 145, 282, 550, 1073, 2092, 4080, 7956, 15515, 30254, 58995, 115040, 224329, 437441, 853010, 1663370. Die 2 = ×4, die 3 = ×16.
Income grows ~1.40–1.47× per side against cost ×1.95 → time-per-side lengthens a controlled ~1.32×.

**Die slots:** `C_die(N) = 5000 · 12^(N-1)` → 5,000 then 60,000. Slots are permanent through Recast.

**Prestige:**
```
shardsGained = floor( 12 · (runCoins / 250000)^0.45 )
M = 1 + 0.15 · totalShards
```
Anti-hoarding: 10× the wait yields 2.8× shards, so recasting promptly is always correct. Shards buy nothing — they are `M` and only `M`. Content honestly ends after run 3; state that rather than faking depth.

**Offline (closed form, never simulated):**
```
offline = 0.5 · autoRate(L) · Σ_d E(S_d) · c_hat · M · min(secondsAway, 14400)
```
Cap 4 h; the rewarded ad raises the rate factor to 1.0 and the cap to 28800 s for that claim only. `<60 s` → grant and show nothing. Clamp elapsed to `[0, cap]`.

**EV source of truth:** one closed-form `expectedPayout()` over the live `faces` arrays. No Monte Carlo, no second formula.

**Milestones (simulator asserts, ±25%, bot = 1.7 taps/s while open, always buys cheapest income-positive purchase):**

| Milestone | Target (min) |
|---|---|
| First side (d1→d2) | 0.2 (must be <0.4) |
| 6 sides | 1.5 |
| Auto-roller bought | 4 |
| Second die | 9 |
| First Recast | 30 |
| End of content (3 dice, d20, 3rd Recast) | 150 |

**Hard invariants the headless sim must assert:**
1. Income never decreases after any purchase, **including a Recast taken at its unlock threshold**.
2. No purchase is ever more than 45 min of current income away, except `C_side(1,20)`.
3. `+ SIDE` is never strictly dominated by ROLLER at any point in the run.
4. Combo contribution ≤ 15% of total measured income.
5. Time-per-side stays within 6 s – 10 min across the whole run.

Tune order if a milestone misses: side growth 1.95 → 1.90 first; never touch `V(n)`.

---

## 5. UI — 360 × 740 Portrait

**Layout, top to bottom:**
- **0–56 px:** coin counter, centred, tabular figures, lerps up over 180 ms. Tiny mute toggle top-right.
- **56–120 px:** `MAX ROLL n`. Below it during buffs only: a small flame chip.
- **120–470 px:** canvas. Die(s) on a ground line, dpr-scaled.
- **470–740 px:** the shop — no menu, no tabs. Up to four full-width 64 px buttons stacked: `+ SIDE`, `ROLLER`, `+ DIE`, `RECAST`. Each shows icon, label, price, and a **progress ring that fills as coins approach the price**. Locked buttons show a **ghosted preview** (faint outline of the polygon you'd get). All targets ≥ 44 px, all thumb-reachable.

**Die drawing by side count** — regular S-gon resting edge-on on the ground line, circumradius `R = 96 + 2.2·min(S,20)` px (capped ~140; ×0.72 at D=2, ×0.58 at D=3). Face numerals sit inside their own edge, rotated parallel to it, at 0.62R, font `clamp(9, edgeLen·0.42, 34)`. Corner rounding `2 + S·0.35`.
- `S=1`: circle with one chord sliced off the bottom (bespoke path).
- `S=2`: lens, two arcs (bespoke path). Flips end-over-end.
- `S=3..13`: regular polygon.
- `S≥14`: stop labelling every facet; number only the 4 edges nearest contact, rest become ticks, landed value shown in the big readout.

**Roll animation (RNG-first, animation-second — architectural law):** the simulation resolves a roll and returns a result object; the renderer only plays back a result it is handed. **In-place rotate to a fixed 12 o'clock notch**: 2 full turns + delta to bring the winning edge under the notch, easeOutQuart, 380 ms, with squash 1.00→0.88→1.06→1.00 and three alpha-ghost copies for motion blur. On landing: winning edge flashes white 120 ms, value floats up 70 px over 700 ms (white / cyan >100 / gold >10k). *(Rolling along a ground line was rejected: 3× the code, highest ship-broken risk.)*

**Add-a-side morph (600 ms, the money shot):** sample the S-gon and (S+1)-gon at **240 arc-length-parameterised points**, lerp point-for-point with easeOutBack (1.7). New edge draws in with a gold sweep; numeral stamps at 1.6×→1.0; expanding ring; 6px shake; MAX ROLL ticks; **every other element on screen is frozen for 700 ms**.

**High-speed mode (>8 rolls/s):** per-roll animation replaced by a continuous blur; value numerals sprayed at a **throttled 8/s regardless of actual rate**; coin counter lerps. Constant per-frame cost.

**Performance:** one canvas, one rAF; **cancel rAF entirely when nothing animates and on `visibilitychange`**. No physics, ever.

**Numbers:** plain to 9999, then K, M, B, T, then aa, ab, ac… Two significant decimals.

**Sound:** four WebAudio-synthesised blips generated in code (roll, land, buy, side-added). No files. Mute toggle persisted.

**Palette:** charcoal background, bone-white die, amber landed facet, gold combos. Geometric, matte, adult. No mascot, no eyes, no nursery colours.

**Save:** single versioned JSON (`v:1`), written on a 5 s debounce and on `visibilitychange`. Capacitor Preferences as the store with a `localStorage` mirror.

---

## 6. Rewarded Ads (no-op adapter)

All ads go through one stub:
```js
Ads.show(id) -> Promise<void>   // prototype: resolves after 300ms; Ads.forceFail toggle for testing
grantReward(txId, fn)           // idempotent by txId
```
**Rule (non-negotiable):** write the pending-reward record to the save **before** calling the SDK, call with a 6 s timeout, and grant the reward on success, failure, timeout, no-fill, or resume-with-pending-record alike. A failed ad costs the player nothing and is never noticed.

**Exactly two placements. Neither can appear in the first session** (both gated behind a completed Recast or a return after ≥30 min away):
1. **OFFLINE DOUBLE** — on the welcome-back card: rate 0.5→1.0 and cap 4 h→8 h for that claim.
2. **HOT HAND** — ×3 payouts for 2 min, player-initiated from a small flame chip, 20 min cooldown, never a popup, never covers the die.

No interstitials. No banners. No IAP. The store description can honestly say "no purchases, ads optional."

---

## 7. Slot Reskin Seam

Build the seam, build **zero** slot code.

1. **Data:** a face is a value plus a theme-supplied label. The simulation reads values only and never contains the strings "dice", "side" or "face" in any user-visible position.
2. **Renderer:** all drawing goes through `THEME = { drawDie(ctx, die, state), faceLabel(i), palette, strings, currencyName, sounds }`. Dice theme is the only implementation shipped. The slot theme replaces rotate-and-settle with translateY-and-settle on the same easing, reusing the settle bounce and number pop verbatim.
3. **Scoring:** combo is already an evaluator over a landed-index array — that *is* a single-payline evaluator. Multi-reel paylines are extra index sets over the same array.
4. Every economy formula and constant carries over unchanged. `+ SIDE` becomes `+ SYMBOL` on the identical ladder: a reel that starts with one symbol and grows.

---

## 8. Policy Guardrails

- **One currency, earned only by rolling.** Never purchasable with real money, never redeemable, transferable, or convertible. This single rule keeps the app entirely outside Play's Real-Money Gambling policy.
- **Every price fixed and displayed. No randomized purchase, mystery face, or crate of any kind** — loot-box odds disclosure never applies.
- **Declare 13+ target audience. Never opt into Designed for Families.** Keep art geometric and adult; no childlike imagery or "for kids" wording anywhere in the app or listing. Google assesses the declared audience against the actual art, and a mismatch is a suspension ground.
- **Dice build: answer the IARC simulated-gambling questions "no" — honestly.** A plain numbered die with deterministic purchases is not casino simulation.
- **Slot build, if ever: separate Play listing, never an in-app mode.** Declare simulated gambling honestly (expect Teen/12+), use abstract original symbols only, no real casino brands/logos/trade dress, add the disclaimer string ("No real-money gambling. No prizes of real-world value. Intended for users of legal gambling age"), no cash-out/sweepstakes/tournament-with-prize. Ship dice first and measure real rewarded eCPM for a month before building it — AdMob may classify slot inventory as gambling-related and cut fill.
- No paid user acquisition for a slot build without Google Ads social-casino certification.

---

## 9. Out of Scope

Per-face editing, face types, effect faces (×2 / reroll / wild / chain), face swapping. A FILE/pip/sharpen sink of any kind. Tap-an-edge-to-select or any hit-testing on the die. Achievements, statistics, pause screen. Daily die, streaks, streak forgiveness, tokens, any calendar-date logic. Heirloom/retained faces or any deferred hidden state. Night Die, shard shop, skill trees, a second currency. Cards, decks, duels, quests, events, roulette, minigames. More than 3 dice, more than 20 sides, more than 3 prestige layers. Rolling-along-the-ground animation, 3D, WebGL, physics engines, any imported library. Monte Carlo EV. Interstitials, IAP, currency packs. Cloud save, accounts, leaderboards, any server. Push notifications. Localization, tutorial text, cutscenes. Settings beyond mute and a hold-to-confirm hard reset. Landscape, tablet, iOS. The slot build itself — only the THEME seam ships. Capacitor wrapping and AdMob integration — the prototype must be fun in a phone browser first.

**Build order:** d1→d2→d3 morph with placeholder art **first**. If that transition is not satisfying on the actual phone, stop and rethink before writing anything else.