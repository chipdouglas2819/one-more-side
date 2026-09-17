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
- **0:02** `+ SIDE` slides up from the bottom **ghosted**, reading `ROLL TO UNLOCK`, showing the faint outline of the polygon you'd get. ROLLER and + DIE both get this preview; the first button in the game used to be the one that didn't, leaving the shop completely empty until the sixth coin.
- **0:06** It lights: price `10`, progress ring filling as coins accrue.
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
4. **ROLLER (unlocks at 6 sides).** Global auto-roll, 11 levels (L0–L10). **Level 0 is 2.0 rolls/s, above comfortable thumb speed (~1.7/s) — hard acceptance test on a real phone.** Manual taps still add an extra throw on a 100 ms cooldown. Never gated, never fuelled, never removed mid-run; survives prestige at half level.
5. **+ DIE (unlocks at 10 sides on die 1 **and** roller level 2).** New die born at **one side**. Because + SIDE auto-targets the smallest, the player replays the best two minutes with late-game income. Cap: **3 dice**. The roller condition is not a price gate — L0+L1+L2 costs 7,800 against the die's 5,000, and the reference bot already owns Lv2 by 11 minutes, so it costs a normal player nothing. It narrows a trap: saving for the die first leaves the player hand-rolling at 1.7/s while every + SIDE coin goes to a newborn die at 4× price. **It does not close it.** No unlock gate can: a player is free to hoard from minute zero, and a bot that buys the minimum 10 sides and then banks still reaches the auto-roller at **13.5 min against a 4-minute target**. What the gate guarantees is that by the time a second die exists the roller is at 3.65 rolls/s rather than 2.0, and that skipping the roller is never a shortcut to the die. The earlier claim that this ordering closed the trap was wrong and the simulator now runs a `rush-die` policy that measures it every time.
6. **COMBO (auto, from 2 dice).** One evaluator over the landed index set. Only dice with **≥ 6 sides** take part (`COMBO_MIN_SIDES`); below that a match is so likely that growing a die would *lower* income, which is the trap invariant 1 forbids. Of the participating dice: all equal → `×3`; exactly a pair equal → `×2`; otherwise `×1`. With two dice those first two are the same event, so two dice behave exactly as "all equal → ×3"; the pair tier exists only so that adding a third die can never cost income. Readable from the visual — **only the dice that actually matched** glow gold and link with a light thread, and the floating number is anchored over them, never over a die that sat the combo out. The die + SIDE will grow **pulses gold**; with two or three dice that is the player's only cue, because they never get to choose.
7. **RECAST — prestige (unlocks at 250,000 × M coins earned this run, capped at 3 runs).** All dice → 1 side, coins → 0, roller → `floor(L/2)`. **Retained:** shards, global multiplier, die slots owned, half the roller. Recast screen leads with what you keep. After the third Recast the button stays on screen reading `RUN 3/3 · ALL THREE RUNS DONE` and never lights again — the cap is what makes "content ends after run 3" true in the code rather than only in this document.
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
`combo` is evaluated over the dice with `S ≥ 6` only: all of them equal → 3, exactly a pair equal → 2, else 1. Fewer than two such dice → 1.
Measured `c_hat`: D=1 → 1.00; D=2 → `1 + 2/S ≈ 1.10`; D=3 → `1 + 2/S² ≈ 1.02` plus the pair tier, so ~1.15 at equal side counts. **Do not assume more.**

*`COMBO_MIN_SIDES` changed from 4 to 6.* At 4, walking the shapes a player can actually reach found 34 where the forced + SIDE **lowers** income, the worst by 3.9%, and from `20/4/4` — reached by buying die 3 while die 2 is still small — income stayed below its starting level for **nine consecutive presses**, troughing 8.9%. That is the only button in the shop making the coin counter run backwards for minutes. At 6 it is 15 shapes, worst 1.8%, deepest run 3.0% over five presses, and the specific trap (a big die beside two small ones) is gone because dice under 6 sit the combo out. Going to 8 buys little more (0.7% over one press) and deletes the combo from the early part of **every** run, including the whole replay after each Recast.

**Income:** `coins/s = throwRate · (Σ_d E(S_d)) · c_hat · M`

**Auto-roll:** `autoRate(L) = 2.0 · 1.35^L`, L = 0..11 → 2.00, 2.70, 3.65, 4.92, 6.64, 8.97, 12.11, 16.34, 22.06, 29.79, 40.21, 54.29
`C_roller(L) = ceil(600 · 3.0^(L+1))`, 12 purchases → 600, 1800, 5400, 16200, 48600, 145800, 437400, 1312200, 3936600, 11809800, 35429400, 106288200

*Changed twice: from the original 9 purchases at growth 3.2 to 11, and now to 12.* With the roller topping out at Lv8, the last four sides of die 3 were the only purchase left in the game and the reference bot sat 6, 9 and 14 minutes in a row with the whole shop greyed out — invariant 5 broken whole-game at 864 s between sides. Topping out at Lv10 fixed the reference bot but left a player who never presses RECAST — the most common idle-game behaviour there is, because resetting feels like losing — with a **52.3-minute** stretch at t=309 min with nothing affordable, breaking invariant 2 outright, and then an empty shop for good at t=361 min. One more level takes that to 39.1 min.
**The direction is not monotonic and guessing here is a mistake:** Lv13 and Lv14 make the never-prestige wall far *worse* (106 and 237 min), because once the sides are maxed the only item left in the shop is a roller level costing hundreds of millions. Lv11 at growth 3.0 is the measured optimum; 2.9 drops end-of-content out of band and 3.1 breaks the 600 s side ceiling at 687 s.

**Side cost:** `C_side(d, n) = ceil(10 · 2.2^(n-2) · 4^(d-1))` for the n-th side of die d.
Die 1 (sides 2..20): 10, 22, 49, 107, 235, 516, 1134, 2495, 5488, 12073, 26560, 58432, 128551, 282811, 622183, 1368801, 3011362, 6624996, 14574990. Die 2 = ×4, die 3 = ×16.
Income grows ~1.28–1.47× per side against cost ×2.2 → time-per-side lengthens ~1.50–1.72×.

*Changed from the spec's original 1.95.* At 1.95 the reference bot burned through all three runs in 49 minutes against the 150-minute target and every other milestone landed 20–40% early. `V(n)` was not touched.

**Die slots:** `C_die(N) = 5000 · 12^(N-1)` → 5,000 then 60,000. Slots are permanent through Recast.

**Prestige:**
```
threshold    = 250000 · M              (M is fixed for the whole of a run)
shardsGained = floor( 12 · (runCoins / threshold)^0.45 )
M            = 1 + 0.15 · totalShards
maximum of 3 Recasts
```
Anti-hoarding: **within a run**, 10× the wait yields 2.8× shards, so recasting promptly is always correct. The threshold is measured against the multiplier you already own, or coins earned this run would include `M` and a big `M` would hand you another full payout for no new progress. That scaling means the *prompt* payout is a flat 12 shards on every run, which is why the run count is capped: without the cap the game is an identical five-minute loop with no ceiling on `M`, which is the opposite of what the line below promises. Shards buy nothing — they are `M` and only `M`. Content honestly ends after run 3, and the Recast button says so.

**Offline (closed form, never simulated):**
```
offline = 0.5 · autoRate(L) · Σ_d E(S_d) · c_hat · M · min(secondsAway, 14400)
```
Cap 4 h; the rewarded ad raises the rate factor to 1.0 and the cap to 28800 s for that claim only. `<60 s` → **grant** and show nothing (the rAF loop is cancelled while the page is hidden, so those seconds are not earned in game either; dropping them meant a player app-switching for 30–50 s at a time earned nothing at all for that time). Clamp elapsed to `[0, cap]`.

**The uncollected claim lives in the save** (`pendingOffline`, `pendingOfflineSeconds`), never in a field on the loop object, and `handleReturn` **accumulates** into it rather than assigning. Every `save()` advances `savedAt`, so a claim held only in memory was destroyed twice over: by an app kill five seconds after the card opened, and by a second `handleReturn` when the player switched apps for ninety seconds and came back to find four hours of income replaced by a few hundred coins.

**EV source of truth:** one closed-form `expectedPayout()` over the live `faces` arrays. No Monte Carlo, no second formula.

**Milestones (simulator asserts, ±35%, bot = 1.7 taps/s while open, always buys cheapest income-positive purchase):**

| Milestone | Target (min) |
|---|---|
| First side (d1→d2) | 0.2 (must be <0.4) |
| 6 sides | 1.5 |
| Auto-roller bought | 4 |
| Second die | 9 |
| First Recast | 30 |
| End of content (3 dice, d20, 3rd Recast) | 105 |

*End of content changed from 150.* 150 is not reachable. A grid over `SIDE_GROWTH` × `UNLOCK_UNIT_SIDES` × `MAX_ROLLER_LEVEL` × `ROLLER_GROWTH` — 120 combinations — found exactly **three** that keep every milestone in band, hold the whole-game 10-minute time-per-side ceiling, and keep a never-prestige player inside the 45-minute purchase bound. The longest run any of the three produced was **107.4 min**. `SIDE_GROWTH 2.3` does reach 144.7 min but takes the worst gap between sides to 1091 s and the never-prestige wall to 116 min, and the spec's own range stops at 2.30, so there is no lever left. The target now says what the economy does: the reference bot lands at 101.9 min and an active tapper at 91.5.
**This is a commercial fact, not a balance nicety.** A committed player exhausts everything in an evening and a half, and after 20/20/20 Lv11 on run 3 there is nothing to press and nothing for the offline card to fund. Lengthening it means more content, not more tuning.

**Hard invariants the headless sim must assert:**
1. Income never decreases after any purchase, **including a Recast taken at its unlock threshold**. Asserted three ways: nothing on the played path may lower income; a walk over every shape a player can **reach** bounds the single-press residue at **2%**; and the same walk bounds the *cumulative* dip at **3.5%**, because a run of losing presses is what a player actually notices, not one of them. Reachable means what + SIDE and + DIE can actually produce — + SIDE always grows the auto-target, + DIE appends a one-sided die, a Recast returns every owned die to one side — which is 1602 shapes, not the 20³ cube. Growing the smaller of two level dice thins the match it was part of, so a multiplicative combo cannot be made perfectly monotonic: at `COMBO_MIN_SIDES = 6`, 15 reachable shapes lose EV, worst 1.80% (`20/6/6 → 20/7/6`), deepest run 3.01% over five presses. A policy that merely *declines* the losing purchase hides this, which is why it is walked rather than sampled.
2. No purchase is ever more than 45 min of current income away, except `C_side(1,20)`. **Asserted on every always-open policy, not only the reference bot** — including one that never presses RECAST, which is where the 52-minute wall that this bound is supposed to forbid was actually hiding.
3. `+ SIDE` is never strictly dominated by ROLLER at any point in the run.
4. Combo contribution ≤ 15% of total measured income. **This is coin-weighted across the whole run, not a per-configuration bound.** The *instantaneous* share peaks higher when dice happen to hold equal side counts (32.1% at 6/6/6, falling as `2/(S+2)` — 12.9% at 20/20/20), because `+ SIDE` auto-targets the smallest die and so keeps them level. Capping the instantaneous figure at 15% would need `COMBO_MIN_SIDES ≥ 12`, which deletes the combo from most of the game; the banked figure on the reference path is 12.6%. The sim walks every reachable shape and bounds the instantaneous peak at 35% so the two figures cannot drift apart unnoticed.
5. Time-per-side stays within 6 s – 10 min. **The 10-minute ceiling is asserted whole-game** — over every die and every run, not only die 1 of run 1. Scoped narrowly it reads PASS while the real tail of the game sits at 14 minutes with a greyed-out shop. Two deliberate scopings:
   - **The 6-second floor is die 1 of run 1 only.** The post-Recast burst, where late-game income buys a newborn die four sides in a couple of seconds, is the *point* of the prestige — "replay the best two minutes with late-game income". The simulator reports sub-second gaps there because it does not model the game's own **700 ms `+ SIDE` lockout** (`tryBuy` returns early while `frozen()`), which is what actually bounds the burst on a phone: consecutive purchases cannot queue, so the morph never stutters.
   - **The 600 s ceiling is the reference bot's.** Other always-open styles earn less per throw and are held to 780 s (measured: 619 s for a save-for-best-ROI tapper, 611 s for a pure idler). A player who declines the Recast forgoes the multiplier, so their side gaps are long by construction — 3777 s — and only the 45-minute rule of invariant 2 binds them.
6. Lifetime coins stay inside exact double-integer range (tripwire for the plain-number currency helpers).

Tune order if a milestone misses: side growth first, and only inside 1.90–2.30 — raise it if the run finishes early, lower it if milestones land late. Roller reach (`MAX_ROLLER_LEVEL` / `ROLLER_GROWTH`) is the lever for a dead tail, not for overall pace. Never touch `V(n)`.

---

## 5. UI — 360 × 740 Portrait

**Layout, top to bottom:**
- **0–56 px:** coin counter, centred, tabular figures, lerps up over 180 ms. Tiny mute toggle top-right.
- **56–120 px:** `MAX ROLL n`. Below it during buffs only: a small flame chip.
- **120–470 px:** canvas. Die(s) on a ground line, dpr-scaled.
- **470–740 px:** the shop — no menu, no tabs. Up to four full-width 64 px buttons stacked: `+ SIDE`, `ROLLER`, `+ DIE`, `RECAST`. Each shows icon, label, price, and a **progress ring that fills as coins approach the price**. Locked buttons show a **ghosted preview** (faint outline of the polygon you'd get). All targets ≥ 44 px, all thumb-reachable. **Purchases commit on release, not on press**, with a 12 px slide-off cancel — Android's own convention, and the reason a thumb crossing the shop on its way to the die cannot buy anything, RECAST included. An upgrade already owned never leaves the shop: ROLLER and + DIE stay visible after a Recast puts every die back to one side.

**The canvas measures its own element, not the window.** `#shop` grows by 72 px every time a card appears, `#stageWrap` is `flex:1` and shrinks to match, and no `resize` event fires for that. With the backing store fixed at its boot height, `#stage`'s `inset:0; height:100%` box stretched a 602-tall bitmap into a 322-tall one — every polygon a flattened ellipse from the first purchase onward, which is exactly the `d1→d2` morph the build order says to validate first. A `ResizeObserver` on `#stageWrap` drives `sizeCanvas`, `refreshShop` calls it on both visibility transitions for browsers without one, and it early-returns when the box has not changed so calling it every frame is free. There is **no minimum logical height**: a 200 px floor against a shorter element reintroduced the same aspect break permanently on any viewport under ~618 CSS px. The payout float is likewise positioned and travels relative to `CH`, not a flat 150/70 px, or it slides off the top of a 360×640 phone.

**Die drawing by side count** — regular S-gon resting edge-on on the ground line, circumradius `R = 96 + 2.2·min(S,20)` px (capped ~140; ×0.72 at D=2, ×0.58 at D=3). Horizontal layout is **one slot per die of exactly the width the fit-scale reserved**, die centred in its slot: the placement rule and the scale rule must use the same per-die budget or the dice overlap at 360 px on every phone. Face numerals sit inside their own edge, rotated parallel to it, at 0.62R, font `clamp(9, edgeLen·0.42, 34)`. Corner rounding `2 + S·0.35`.
- `S=1`: circle with one chord sliced off the bottom (bespoke path).
- `S=2`: lens, two arcs (bespoke path). Flips end-over-end.
- `S=3..13`: regular polygon.
- `S≥14`: stop labelling every facet; number only the 4 edges nearest contact, rest become ticks, landed value shown in the big readout.

**Roll animation (RNG-first, animation-second — architectural law):** the simulation resolves a roll and returns a result object; the renderer only plays back a result it is handed. **In-place rotate to a fixed 12 o'clock notch**: 2 full turns + delta to bring the winning edge under the notch, easeOutQuart, 380 ms, with squash 1.00→0.88→1.06→1.00 and three alpha-ghost copies for motion blur. On landing: winning edge flashes white 120 ms, value floats up 70 px over 700 ms (white / cyan >100 / gold >10k).

**Payout feedback is owed to the throw, not to the tween.** The settle is 380 ms but from roller Lv1 the rolls arrive every 370 ms or less, so a feedback hook that waits for the tween to finish simply never fires — floats, the land blip and the edge flash all vanish from Lv1 to Lv4, which is most of a session. Whichever happens first, the tween landing or the next throw starting, pays the previous one. *(Rolling along a ground line was rejected: 3× the code, highest ship-broken risk.)*

**Add-a-side morph (600 ms, the money shot):** sample the S-gon and (S+1)-gon at **240 arc-length-parameterised points**, lerp point-for-point with easeOutBack (1.7). New edge draws in with a gold sweep; numeral stamps at 1.6×→1.0; expanding ring; 6px shake; MAX ROLL ticks; **every other element on screen is frozen for 700 ms**. The freeze is a *UI* freeze: auto-roll income keeps accruing through it and through any open panel, only the die tween, the float and the blip are held back. (Pausing income too cost 0.7 s of auto-roll on every `+ SIDE` — about 15 rolls at Lv8 — and all of it while a panel was up, with no offline credit to compensate because the page is still visible.)

All outlines must start at the ground contact and wind the same way, or the lerp folds the shape through itself. The `S=2` lens is the one that is easy to get wrong: emit it contact → left tip → over the top → right tip → contact, the same order the polygon branch uses, not as two left-to-right arcs.

**High-speed mode (>8 rolls/s):** per-roll animation replaced by a continuous blur; value numerals sprayed at a **throttled 8/s regardless of actual rate**; coin counter lerps. Constant per-frame cost.

**Performance:** one canvas, one rAF; **cancel rAF entirely when nothing animates and on `visibilitychange`**. No physics, ever.

**Numbers:** plain to 9999, then K, M, B, T, then aa, ab, ac… Two significant decimals.

**Sound:** four WebAudio-synthesised blips generated in code (roll, land, buy, side-added). No files. Mute toggle persisted.

**Palette:** charcoal background, bone-white die, amber landed facet, gold combos. Geometric, matte, adult. No mascot, no eyes, no nursery colours.

**Save:** single versioned JSON (`v:1`), written on a 5 s debounce (a `setTimeout`, not the rAF loop — the loop stops when nothing animates, so a frame-counted debounce never fires in the pre-roller game) and on `visibilitychange`/`pagehide`. **Capacitor Preferences is the store and is read first at boot**, with a `localStorage` mirror as the fallback; an existing browser save is migrated into Preferences the first time the wrapper sees it. Reading only the mirror means an Android "clear storage" or an OEM cleaner wipes the player's run even though the durable copy is intact. Anything that gets past the version check is coerced and clamped on load, because localStorage is player-editable and one `NaN` in `coins` locks out every purchase forever.

**Buff clocks are absolute wall time** (`Date.now()`), stored and restored. On the page-local clock they reset to zero on every load, so the Hot Hand cooldown was unenforceable: watch the ad, take the ×3, refresh, watch again. A restored buff is clamped to its own full length, and a cooldown further away than its own length is treated as finished, so neither direction of clock jump can be farmed.

---

## 6. Rewarded Ads (no-op adapter)

All ads go through one stub:
```js
Ads.show(id) -> Promise<void>   // prototype: resolves after 300ms; Ads.forceFail toggle for testing
grantReward(txId, fn)           // idempotent by txId
```
**Rule (non-negotiable):** write the pending-reward record to the save **before** calling the SDK, call with a 6 s timeout, and grant the reward on success, failure, timeout, no-fill, or resume-with-pending-record alike. A failed ad costs the player nothing and is never noticed.

**The grant function reads everything it needs from the record's payload, never from memory.** A resumed reward runs on a fresh page where the in-memory away-time is still 0, so a signature-less `applyOfflineDouble` grants exactly zero coins for an ad the player already watched, and clears the record either way. Resume runs *after* the welcome-back card opens, so the doubled amount lands on the card the player is looking at.

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
