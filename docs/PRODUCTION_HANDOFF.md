# ONE MORE SIDE: production handoff

Last updated: 2026-09-18. Written from prototype v2.1.

## 1. What this document is and how to use it

This is the bridge from the prototype to a real Android release. It has two readers:

- **Nate**, who decides. Read sections 2, 3, 7, 9, 10 and 11, plus the steps marked **[Nate]** in section 8 (the launch checklist). Section 11 lists every open decision with a recommended default, so nothing stalls if you just say "go with the defaults". **One task is urgent:** developer verification in Play Console (section 8, step 1), due 30 September 2026.
- **A future builder** (a person or an AI session) who writes the code. Read everything, starting with sections 4 and 5.

How to use it:

1. Before any production work, read `README.md` in this folder and the files it lists. This document does not repeat `VISION.md`, `FEEDBACK_LOG.md` or `DECISIONS.md`. It points to them.
2. Work through the phases in section 10. Each ends with a check that proves it is done.
3. When a decision in section 11 gets made, record it in `DECISIONS.md` and mark it here.
4. Research findings are dated September 2026. Store rules, deadlines and plugin versions change. Re-check any date or version before relying on it.

Words used throughout:

| Term | Meaning |
|---|---|
| Prototype | The current game: one file, `index.html`, playable in a phone browser |
| Production build | The Android app that goes on Google Play |
| Capacitor | A free tool that wraps a web page in a real Android (and later iPhone) app and gives it access to phone features such as ads, purchases and vibration |
| WebView | The browser engine built into Android that a Capacitor app runs inside |
| Economy block | The part of `index.html` that holds every number and rule about coins, and nothing else |
| Gate | An automatic check that must pass before a build is published (`check.js`, `sim.js`) |
| Session | One AI coding session of about 2 to 3 hours |

## 2. The product in one page

Read `VISION.md`. It holds the idea in Nate's words, the hook (the shape of the die is the progress bar), the audience (13+, no real money ever), Nate's eight design rules, the business frame and the variants. Those rules override any designer's opinion, including anything in this document.

Three facts from it shape every choice below:

- **Presentation is the product.** The mechanics are simple on purpose. The category leader has about 500,000 installs; a dice idle game with ordinary presentation sits near 5,600 (`research/competitor-scout-2026-09-17.md`, from https://www.appbrain.com/app/idle-dice/de.lutsgames.idle_dice and store pages).
- **Players should keep playing for a year or two.** The prototype has about two hours (section 7).
- **Android first**, through Google Play. iPhone only if Android does well.

## 3. Recommendation: what to build it in, and why

**Keep the game as a web page and wrap it for Android with Capacitor 8.** Keep the current drawing method (Canvas 2D, the browser's built-in 2D drawing) for now. Move to PixiJS, a faster drawing library that uses the phone's graphics chip, only if a real low-end phone cannot keep up. Add Three.js, a 3D library, only if real 3D dice are ever wanted.

Nate said the game might need "some sort of game engine" (feedback F18). It does not need one yet. What it needs is a native wrapper for ads, billing and the store, and Capacitor gives that.

### Why

`sim.js` and `check.js` lift the exact economy block out of the page and run it, so the game and the simulator can never disagree about a number. Any non-JavaScript option loses that, or needs two copies of the rules that can drift apart. For a game balanced over a year or two of play, that is the strongest argument.

### Scores (1 = poor, 5 = excellent)

| Criterion | Web + Capacitor | Godot 4 | Unity 6 | Defold | Flutter + Flame |
|---|---|---|---|---|---|
| A non-programmer can drive it through AI | 5 | 3 | 2 | 2 | 3 |
| How well AI models write code for it | 5 | 3 | 4 | 2 | 3 |
| 2D speed on a low-end Android phone | 3 (Canvas) / 4 (Pixi) | 4 | 5 | 5 | 3 |
| AdMob rewarded ads and consent | 4 | 4 | 5 | 3 | 5 |
| Google Play Billing (Library 8+) | 4 | 4 | 5 | 4 | 4 |
| Build and signing on Windows | 4 | 4 | 4 | 5 | 4 |
| App size | 5 | 3 | 3 | 5 | 4 |
| Licence cost | 5 | 5 | 4 | 5 | 5 |
| Reuse of the economy and simulator | 5 | 1 | 1 | 1 | 1 |
| Path to iPhone later | 4 | 4 | 5 | 4 | 5 |
| Optional path to real 3D dice | 4 | 5 | 5 | 3 | 2 |
| **Total (of 55)** | **48** | **40** | **43** | **39** | **39** |

Unity's total looks close, but it wins on heavy rendering and 3D, which this game barely uses. It loses on the two things that decide the project: Nate driving it through AI, and keeping the simulator.

The plain total weights every row equally. Counting the two deciding rows (AI drivability, simulator reuse) twice gives Capacitor 58, Unity 46, Godot 44, Flutter 43, Defold 42: the same winner by a wider gap. Four rows are judgment from the evidence below, not measurements: AI drivability, AI code quality, path to iPhone and 3D dice. Capacitor's app-size 5 is an estimate until a build is measured.

### Evidence, briefly

- **Driving it through AI.** The game is one text file that AI tools can read, edit and check with `node check.js` and `node sim.js`. Godot, Unity and Defold keep real work in a visual editor (scenes, inspectors, import settings) that a text-only AI cannot reliably see or change. Flutter is code-only but means a new language (Dart) and toolchain.
- **AI code quality.** JavaScript is the most-used language among professional developers in the 2025 Stack Overflow survey (68.9%): https://survey.stackoverflow.co/2025/technology . GitHub's Octoverse 2025 reports TypeScript and JavaScript as the most-used languages on GitHub and links that to AI-assisted coding: https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/ . That more data means better AI output is an inference, not a measurement. Godot 4 renamed many Godot 3 APIs (https://docs.godotengine.org/en/stable/tutorials/migrating/upgrading_to_godot_4.html), and secondary blogs report AI assistants still writing the old names: https://dev.to/ziva/7-godot-4-api-calls-your-ai-assistant-still-gets-wrong-3ep6 , https://www.summerengine.com/blog/best-llm-for-godot . Treat those as hints. No benchmark was found for Lua (Defold) or Dart (Flame); those scores are judgment.
- **2D speed.** Drawing a 100-sided shape is cheap. The risk is how much else is drawn each frame (glows, shadows, particles) inside a cheap phone's WebView. Capacitor targets Android 7+ with the WebView updated through Play: https://capacitorjs.com/docs/android . PixiJS v8 cut CPU time per frame from about 50 ms to about 15 ms in its 100k-sprite benchmark: https://pixijs.com/blog/pixi-v8-launches , and v8.16 added a Canvas fallback: https://pixijs.com/blog/8.16.0 . The only independent cross-engine benchmark found (September 2024, iPad Air 4, not low-end Android) put Unity near 2,500 moving objects at 60 fps, Flame 2,000, Flutter 1,500 and Godot 4.2 about 500: https://filiph.net/text/benchmarking-flutter-flame-unity-godot.html . Defold's engine is under 2 MB: https://defold.com/manuals/optimization-size/ . Flutter's newer renderer is the default only on Android 10+ (API 29), so older cheap phones fall back: https://docs.flutter.dev/perf/impeller . This game draws dozens of dice, not thousands of objects, so all five are fast enough in principle. A real device test decides.
- **Ads and consent.** Google has required a certified consent tool for ads in the EEA and UK since 16 January 2024, and Switzerland since 31 July 2024: https://support.google.com/admob/answer/13554116 . Capacitor has the free `@capacitor-community/admob` v8 plugin with rewarded ads and consent calls: https://github.com/capacitor-community/admob , and a paid alternative announced September 2026: https://capawesome.io/blog/announcing-the-capacitor-admob-plugin/ . Godot: https://github.com/poingstudios/godot-admob-plugin , https://github.com/godot-sdk-integrations/godot-admob . Unity (maintained by Google): https://developers.google.com/admob/unity/quick-start , https://developers.google.com/admob/unity/reference/namespace/google-mobile-ads/ump/api . Flutter (maintained by Google): https://pub.dev/packages/google_mobile_ads , https://developers.google.com/admob/flutter/rewarded . Defold: https://github.com/defold/extension-admob/releases , with consent as a separate extension listed as Android only: https://defold.com/assets/ump/
- **Billing.** From 31 August 2026, new apps and updates must use Play Billing Library 8 or later, with extensions to 1 November 2026: https://developer.android.com/google/play/billing/deprecation-faq . Capacitor: RevenueCat's plugin https://github.com/RevenueCat/purchases-capacitor (the older Cordova plugin stays on Billing 7: https://www.revenuecat.com/docs/getting-started/installation/cordova ). Godot: https://github.com/godot-sdk-integrations/godot-google-play-billing , https://godotengine.org/asset-library/asset/4137 . Unity IAP 5.0.0 ships Billing 8: https://docs.unity.com/ugs/en-us/manual/overview/manual/release-notes . Defold lists Billing 8.4.0: https://github.com/defold/extension-iap/releases . Flutter: https://pub.dev/packages/purchases_flutter/changelog , https://github.com/flutter/flutter/issues/171523
- **Building on Windows.** All five work. Capacitor builds with Android Studio. Capacitor 8 defaults to compile and target SDK 36 (Android 16): https://capacitorjs.com/docs/updating/8-0 . Godot 4.7 needs OpenJDK 17, SDK 35 and NDK r28b: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html . Defold warns never to upload a debug-signed build: https://defold.com/manuals/android/
- **App size.** Capacitor uses the phone's own WebView, so the app is a native shell plus a roughly 200 KB page, likely a few MB (not yet measured). Flutter's docs give an old iOS example of about 5.4 MB: https://docs.flutter.dev/perf/app-size . Shrinking Godot means recompiling it: https://docs.godotengine.org/en/4.4/contributing/development/compiling/optimizing_for_size.html . A forum report puts an empty Unity APK near 17 MB, about 6 MB stripped: https://discussions.unity.com/t/what-the-minimum-size-of-built-apk-file/169929
- **Licences.** Unity Personal is free up to $200,000 revenue; the Runtime Fee was cancelled and Pro prices rose 5% from 12 January 2026: https://unity.com/blog/unity-is-canceling-the-runtime-fee , https://unity.com/products/pricing-updates . Unity can change its terms, so it scores 4. Free: Godot https://godotengine.org/license/ , Capacitor https://github.com/ionic-team/capacitor , Defold https://defold.com/license/ , Flame https://github.com/flame-engine/flame
- **iPhone.** Capacitor supports iOS 15+ and needs Xcode 26+: https://capacitorjs.com/docs/ios . Godot says iOS export needs a Mac with Xcode: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html . Plan on a Mac or a cloud Mac build service with any option.
- **3D dice.** Three.js is free JavaScript (https://threejs.org/ , https://github.com/mrdoob/three.js) and can draw 3D dice on a canvas while the rest stays as it is.

### The one test that decides

Run the wrapped build on a cheap, older Android phone (about 2 GB of memory), in the busiest scene: most dice, 100-sided morphs, particles, top roller speed. Target a steady 60 frames a second, hard minimum 50.

### What would change the call

1. **The phone test fails even after moving to PixiJS.** Switch to Defold (smallest and fastest 2D) or Godot (easier editor, better AI familiarity). Keep `sim.js` as the reference for the rules and check the port against it.
2. **Real-time 3D physics dice become the core look.** Switch to Godot 4 or Unity 6.
3. **`@capacitor-community/admob` stops keeping up with Google's rules.** Use Capawesome's paid plugin, or move to Flutter, where Google maintains the ads plugin.
4. **iPhone becomes urgent with no Mac.** Budget for a cloud Mac build service. Applies to every option.

## 4. Prototype architecture and what carries over

Line numbers refer to `index.html` as of v2.1 (about 4,250 lines). They will drift; search for the function name if a number is off.

### Files

| File | Role |
|---|---|
| `index.html` | The whole game: colour tokens, page skeleton, three scripts. No outside files or network (`check.js` enforces this) |
| `SPEC.md` | The rules (sections 1 to 10) plus Appendix A (A1 to A14): every place the build departs from the spec and the measurement behind it |
| `check.js` | Static gate: compiles every script and runs the economy and geometry code without a browser |
| `sim.js` | Economy gate: plays nine player styles for up to 600 simulated minutes |
| `CLAUDE.md` | Rules every AI session in this folder follows |

### The three scripts

1. **Paint hint** (lines 8 to 28). Runs before the first frame and sets light or dark mode from a quick stored copy, so light-mode players do not see a dark flash (SPEC A7). The save file stays the source of truth.
2. **Economy block**, `<script id="economy">` (372 to 1173). Numbers and rule changes only: no screen code, no timers, no player-visible text. It exposes one object, `ECON`.
3. **Game block**, `<script id="game">` (1175 to 4244). Input, drawing, sound, vibration, saving, ads, panels and dev tools. It reads the economy as `E`.

### Economy block contents

The rule: **every coin number the player sees or earns comes from `ECON`**. What it exports (1146 to 1171):

- **`K`**, the constants table (389 to 523): caps (`MAX_SIDES` 100, `MAX_DICE` 3, `MAX_ROLLER_LEVEL` 11, `MAX_RECASTS` 3), every price ladder, unlock gates, and combo, Recast, skin, offline and Hot Hand values. Every changed value carries a comment with the measurement that forced it.
- **Currency helpers** `add, sub, mul, cmp, gte`: the seam for very-large-number maths ("bignum") later. Ordinary numbers are safe for now (sim invariant 6).
- **Die maths, prices, multipliers, combo**: `dieExpected` (the one expected-value formula), `expectedPayout` (exact, no sampling), the `*Cost` ladders, `multiplier`, `comboFor`, `jackMult`.
- **State and actions**: `newState, buy, recast, roll, income, offlineEarnings`, the skin functions, and `sideTarget` (the smallest die, skipping to the next if that purchase would lower income, A10).
- **Formatting**: `fmt` (K, M, B, T, then aa, ab) and `fmtTime`.

Leaks to fix in production, all in the game block: `applyOfflineDouble` (3099) does its own maths, `creditCoins` (3019) adds coins directly, the shop's show thresholds live in `cardState`, and the 0.7 s freeze is hard-coded.

### Saving

- **Writing** (`save`, 1386): the whole state (`newState`, 827 to 854) as JSON under `oms.save.v2`. Immediate after purchases, Recast, settings, ad rewards and leaving the app; other changes wait up to 5 s.
- **Reading** (`loadAsync`, 1566): an unreadable save is set aside as `oms.save.broken`. `migrateV1` (1509) upgrades v1 saves and deletes the old one only after the new one reads back unchanged. `sanitise` (1431 to 1501) clamps every field so a damaged save cannot break the rules.
- **Storage** (1346 to 1384) writes to memory, the browser store and Capacitor Preferences (the phone's app storage), and prefers Preferences when reading.

### Frame loop

- The drawing loop sleeps between taps until the roller is bought, then runs continuously. Timers use a real clock, never counted frames, so a sleeping loop does not freeze cooldowns.
- On leaving the app it saves and stops. On return, time away is the smaller of the wall-clock gap and the device's steady clock plus 5 s, which blocks winding the phone clock forward within one session.

### Rolls

The rule is **resolve first, animate second**. `E.roll()` (1063) decides the result and pays it; the screen only plays it back. A new tap or an auto-roll pays any earlier result still animating, so no payout is lost. Above 8 rolls a second the dice spin continuously and flash the landed number for 60 ms every 0.125 s; payouts merge into fewer floats. This is the part feedback F7 says is not good enough (section 6).

### Drawing and input

- **Shapes** (1773 to 1939): 1 side is a circle with a flat, 2 a lens, 3 and up polygons. `drawDie` (2101) layers rim, face, x2 and jackpot wedges, highlight, target pulse, match glow and face marks.
- **Face marks** (2214): all numbered up to 13 sides; the 4 nearest the marker from 14 to 39; ticks plus a value window from 40 to 100. (`DECISIONS.md` and `FEEDBACK_LOG.md` F8 say "about 20 sides"; the code switches at 14 and 40. Correct both entries to match the code.) During a long hold on a 40+ side die, the window counts up the new top face instead of showing rolls (open question, section 11).
- **Growth morphs** (2687 to 2800): one per die, 240 points, chained so a held purchase is one continuous swell.
- **Input**: any press on the canvas rolls; taps under 100 ms apart are ignored. Shop cards buy on release; sliding off cancels. Hold-to-buy repeats from 350 ms, ramping from 4 to 15 buys a second, for + SIDE, x2 SIDE, JACKPOT SIDE and ROLLER only.
- **Sound** is synthesised in code (`Audio2`, 1583). Vibration uses `navigator.vibrate`, which does nothing on iPhone.
- **Theme and skins**: colours defined for dark and light (34 to 67); skins are data tables (1190 to 1212). `THEME` (1217) is the reskin seam for the wheel and slot versions: text, colours, face labels, face drawing, sounds.

### Ads seam

`Ads.showRewarded(placement)` (1657) is the **only** function to replace with a real ad network; it currently fakes a 1 s ad. `runRewarded` (1698) saves a pending reward with a unique id **before** showing the ad, waits at most 6 s, then grants the reward whether the ad succeeded or failed. Granting twice is impossible, and a crash mid-ad finishes on the next launch. Two placements, doubled offline earnings and Hot Hand, both hidden until the first Recast or a 30-minute absence. A real ad resolves on the "reward earned" callback; consent wraps around it; no caller changes. The one rule that changes: AdMob says the reward is delivered "upon completion of the required action" (https://support.google.com/admob/answer/7313578), so a player who closes the ad early should not be paid, while an ad that fails to load or errors still pays. See decision 9.

### Offline earnings and dev tools

On return, `E.offlineEarnings` pays the roller's rate at 50% for up to 4 hours. Unclaimed amounts accumulate in the save. The doubled offer re-prices the raw time away at the ad rate and cap (A11). `?dev=1` adds test buttons (coins, time, sides, offline, a v1 save, ad failure, wipe).

### What carries over

| Verdict | Parts | Why |
|---|---|---|
| **Keep as-is** | Economy block and constants; currency helpers; roll resolution and payout merging; shapes, morphs and hold-to-buy; theme, colours and skin tables; `sim.js`'s existing milestones and invariants | Pure, tested, measured, and the fixes are hard-won. The economy moves to its own module with the same exports. `sim.js` is the balance authority |
| **Port with changes** | Die and scene drawing; frame loop; saving; offline earnings; sound; shop and panels; paint hint; dev tools; `check.js`; `sim.js` itself (new loader, the fidelity gaps in known limit 10, new invariants for new content, section 5) | Stop per-frame allocation and recomputation; wait for the phone store, keep backups, chain versioned save upgrades; close the clock gap; replace synth sounds; move text into `THEME.strings`; native splash; strip dev tools from release; import modules instead of cutting source at text markers |
| **Rewrite** | Ads; vibration | Ads are a stub (needs a real SDK and consent); vibration moves to the Capacitor Haptics plugin |

### Known limits to fix

1. **Content ends at about 86 to 133 minutes**, depending on play style (`ROADMAP.md` rounds to about 130). Caps: 3 dice, 100 sides, 3 Recasts. See section 7.
2. **Randomness is not seeded** (`Math.random`), so rolls cannot be replayed, though `E.roll` already accepts a random source.
3. **Ads are fake**, and `resumePendingReward` (1710) matches on display text instead of an id.
4. **Clock trust**: forward phone-clock jumps across an app restart still pay offline time.
5. **Durability**: storage does not wait for the phone store to confirm (1376); up to 5 s of play can be lost; no backups.
6. **Per-frame cost**: the shop and side target are recomputed, and point arrays allocated, every frame.
7. **Text** is English only and partly outside `THEME.strings` (lines 352 to 356, 2672, 3006, 3060, 3352, 4157 to 4161).
8. **Platform**: no iPhone vibration, no reduced motion, no screen-reader layer.
9. **Brittle gates**: `check.js` cuts the source at literal text markers; its colour check misses `rgba(...)`.
10. **Simulator fidelity**: average income only; no hold-to-buy, freeze, Hot Hand or ad doubling; skins bought only at 4x price.
11. **No offline earnings before the roller**, so an early leaver earns nothing.
12. **No tap hit test**, and dev tools ship behind `?dev=1`.
13. **A player who never uses Recast progresses very slowly late in the game** (`ROADMAP.md`). The deeper prestige work in section 7 must account for it.

## 5. What is authoritative

When sources disagree, this is the order of authority:

1. **Nate's design rules** (`VISION.md`) and **Nate's feedback** (`FEEDBACK_LOG.md`, verbatim and dated). A feature that breaks a rule is a bug, however clever. The feedback log also records which points are still open (F7, F11, F16 and F18). Where each unfinished point is handled here:

| Feedback | Status in the log | Handled in |
|---|---|---|
| F1 wheel variant | planned | Section 9 |
| F4 art and presentation | production item | Section 6 |
| F6 more skin categories | planned | Section 6 (asset list), section 7 |
| F7 full spin at speed | open | Section 6, decision 2 |
| F8 dice to 100 sides | needs phone check | Section 6, decision 21 |
| F11 many dice, long-term play | open | Sections 6 and 7, decisions 6 to 8 |
| F16 jackpot sliver | open | Section 6, decision 3 |
| F18 game engine | open | Section 3, decision 1 |
| P1 and P2 hold-to-buy feel | needs phone check | Decision 20 |
2. **Decisions** (`DECISIONS.md`), including the rejected ideas, so nobody re-proposes them without knowing why they were dropped.
3. **`SPEC.md` plus Appendix A.** The spec says what was designed; Appendix A says where the build differs and why. Where they differ, Appendix A and the economy block win, because they were measured.
4. **The economy block.** The single source of every number. Changing a number anywhere else is wrong.
5. **The simulator invariants.** A balance change is accepted only if `sim.js` still passes.

### What the gates check

`check.js` asserts: every script compiles, with no outside files or web addresses (the game must work offline); a 6-sided die reads 1 to 6 and averages 3.5 ("faces read 1 to N"); the expected-value formula equals a brute-force sum; doubling starts at the highest face and stops at 12; exactly one jackpot face, face 1; price ladders match SPEC section 4; a pair pays x2 and three of a kind x3 (A13); unlocks (+ DIE at roller level 2, x2 at 9 sides, jackpot at 12 sides plus roller); Recast does exactly what its screen promises; each growth step moves every point less than 70% of the radius (a past bug made a bowtie); the Recast screen has no phrase of four or more words ("show, don't tell"); no raw hex colours in game code, and light mode defines every colour.

`sim.js` (steps 0.2 s using average income):
- The reference player hits 11 milestones within ±35% of target.
- **Invariant 1:** no purchase the player actually makes lowers income. Across 146,000 dice shapes, one forced + SIDE may lose at most 2%, a run of them 3.5%. The one-button player must never watch the counter shrink.
- **Invariant 2:** never more than 4 minutes with nothing affordable, until the player declines a lit RECAST.
- **Invariant 3:** + SIDE is beaten by ROLLER for at most 10% of playtime.
- **Invariant 4:** matches pay at most 15% of coins overall, 35% at peak.
- **Invariant 5:** the jackpot is at most 75% of a die's income.
- **Invariant 6:** lifetime coins stay under 10^15, the safe limit for ordinary numbers.
- Also: no + SIDE stall over 4 minutes; total content 60 to 180 minutes; waiting past a lit RECAST never pays off (A9: the lit button is the best button); each Recast earns back its income in under 60% of the time it took to build.

New content (section 7) will need new invariants and a longer content window. Add them to `sim.js` before building the content, not after.

## 6. Presentation, art and audio plan

Status tags: **[HAVE]** in the prototype, **[PARTIAL]** a first pass exists, **[NEW]** not built.

### Art direction

*Precision objects on a quiet table.* The die is the only thing that matters. It looks machined: enamel, cut stone, bone or anodised metal, with crisp edges, one soft key light, a gentle highlight and a contact shadow. The background is a calm gradient "table" with a faint vignette. One geometric sans-serif typeface, capitals for labels, even-width digits for numbers. Each skin has one surface colour. Gold means jackpot and one accent tint means x2; nothing else uses either.

**[NEW] That colour rule is a change, not a description.** Today gold also marks the hold border, a lit RECAST, the equipped skin, a completed set, the live Hot Hand chip, the Recast screen and floats over 10,000, and the x2 tint colours floats over 100 (`floatColor` in `index.html`); SPEC section 5 has matched dice "pulse a gold rim". Adopting the rule means giving those a different accent. It is decision 17; record it in `DECISIONS.md` if accepted.

Guardrails: no mascots, no faces or eyes on dice, no nursery pastels, no toy-like rounded bevels, no bouncing cartoon lettering, no casino symbols (chips, felt, card suits, lucky sevens). This keeps the game out of Google's child-focused Families rules (https://support.google.com/googleplay/android-developer/answer/9867159) and clear of ESRB's "Gambling Themes" descriptor, which casino imagery alone can trigger (https://www.esrb.org/ratings-guide/ , via `research/policy-scout-2026-09-17.md`). Motion is weighty and eased, never rubbery. Every skin has its own light and dark set [HAVE].

### The die at every stage

The shape is the progress bar, so it gets most of the art budget.

| Sides | What it is | Status |
|---|---|---|
| 1 | A smooth pebble with a single "1" pressed in; deliberately unfinished | [HAVE] as a blob |
| 2 | A thick coin; its roll is a flip | [HAVE] |
| 3 to 6 | Triangle to hexagon, every face numbered; at 6 it should read as a real die | [HAVE] shapes, [NEW] real-die finish |
| 7 to 13 | Polygons, every face numbered | [HAVE] |
| 14 to 39 | Near-circle with rim ticks, 4 faces nearest the marker numbered | [HAVE] |
| 40 to 100 | A machined dial: ticks, a marker, and a window showing the landed number | [HAVE] (feedback F8); 30-, 60- and 100-sided dice still need Nate's phone check |

**A 3D look?** Yes, as 2.5D: the same flat shape as the top face, plus a visible side wall, bevels, surface grain, a rim light and a real shadow. At 6 sides it reads as a hexagonal tile, at 100 as a heavy machined coin, and the growth morph works unchanged. Real solid dice do not fit: a fair 7- or 13-sided solid does not exist, and solids past 20 sides look like golf balls, which breaks "faces read 1 to N". A true 3D cube could appear once, in the store video or a Recast flourish.

### Full spin at any speed (F7, open)

Above 8 rolls a second the prototype never visibly lands, so Nate's "capture a full dice spin" is not met.

- **Option A, recommended:** each die always plays a complete roll (wind-up, spin, eased settle, landing thump), at most about 3 per die per second. Rolls resolved in between are added to it: the die shows the best face in the batch and the float shows the sum ("+1.2M") with a small "x14" counting the throws. At low speed it is identical to today. It also caps drawing cost on cheap phones.
- **Option B:** the die spins visibly faster as the roller levels up, like a flywheel, with a strobe "catch" every 0.5 s. Risk: it reads as a fan, not a die.
- **Option C:** most throws are silent; every Nth throw, jackpot or match gets a cinematic roll. Risk: it hides the roller's work.

Recommendation: A, borrowing B's faster spin only in the wind-up. Nate judges it on the phone.

### Many dice (F11, open)

| Dice | Layout |
|---|---|
| 1 to 3 | One row, scale 1.00 / 0.72 / 0.58 (SPEC section 9) [HAVE] |
| 4 | 2x2 grid at 0.50 (SPEC section 9), every die rolling fully |
| 5 to 9 | 3x3 grid at 0.38 (SPEC section 9), value windows earlier, one float per row |
| More than 9 (recommended) [NEW] | **This replaces SPEC section 9's hard cap at 9**; record it in `DECISIONS.md` when decision 6 is made. **Hero plus tray:** one large hero die (the player's pick, or the one with most sides) keeps full presentation; the rest sit in a tray of small dice with a short spin and one shared float, plus a running "+4.8M /s" total. Matches still fire DOUBLES or TRIPLES |
| Optional | **Stacks:** identical dice merge into one with a "x12" badge and a layered edge, so 100 dice can look like 8 objects |

Hard caps stay: 15 floats and 260 particles [HAVE], plus a per-frame drawing budget where the tray drops motion trails first.

### The jackpot sliver (F16, open)

On a 100-sided die the gold jackpot face is 3.6 degrees wide.
1. Draw it at least 10 degrees wide at any side count. The odds do not change; only the drawing widens.
2. Put a small faceted gold jewel on the rim above it, visible mid-spin.
3. Optional near-miss glint when the result lands within 2 faces of it. This is a mild gambling-feel device; keep it off unless Nate likes it.
4. The first jackpot ever gets a one-time bigger moment: gold burst, ring pulse and chord.

Recommendation: 1, 2 and 4 by default.

### Payout floats and bursts

Built [HAVE]: per-die floats in five lanes, merging at speed, a payout-sized dust burst, a gold jackpot sparkle, the DOUBLES or TRIPLES tag. New [NEW]: float styles by type (plain, tinted "x2", gold star, larger for a new best); numbers that pop and rise on a curve; tinted sparks for x2 and gold shards, a ring shockwave and a light sweep for jackpot; a thin stream of dots from die to balance; a balance count-up of 0.6 s or less (a v1 tester found it lagging).

### Asset list

**Die skins** [PARTIAL: Bone, Ember, Jade]. Target 12 at launch in 3 sets: *Stone* (Bone, Slate, Marble, Obsidian), *Metal* (Brass, Steel, Titanium, Gunmetal), *Glass* (Ember, Jade, Smoke, Prism). Each needs surface, rim and ink colours in light and dark, surface grain, a bevel style and a highlight profile.

**Backgrounds** [PARTIAL: Night, Dune, Vapor]. Target 8: tables (Walnut, Concrete, Paper, Slate) and gradients (Night, Dune, Vapor, Aurora), each with a vignette and a very slow drift.

**New skin categories**, each with a completion bonus [NEW]: roll trails (none, ink, ember, starlight); landing effects (dust, sparks, ripple, shards); markers (arrow, needle, notch, jewel); sound packs (Classic, Wood, Glass, Synth); number fonts (Geometric, Engraved, Stencil).

**Icons**, one line-weight set [PARTIAL]: add side, x2 side, jackpot side, roller, add die, Recast, Hot Hand, skins, settings [HAVE], sun and moon [HAVE], sound on/off, vibration on/off, watch ad, offline, keep and reset rows [HAVE], lock, check.

**Particles**: dust, spark, gold shard, star glint, ring shockwave, light sweep, stream dot, Recast embers.

**Sound effects** [PARTIAL: 5 synthesised blips]. Production uses recorded or designed samples, 3 to 4 variations each: tap (soft felt thump); roll wind-up (rising rattle); spin loop (airy whirr pitched by speed); land (solid click pitched by payout) [HAVE as a blip]; land x2 (click plus bright double tick); jackpot (rising three-note chord and shimmer) [HAVE]; match (paired clack plus chord or triad); buy [HAVE]; rising hold ticks [HAVE]; grow (low thump and upward sweep) [HAVE]; new die (heavy drop); Hot Hand on and off (whoosh, cooling hiss); Recast (molten pour, anvil ring); offline collect (coin cascade); panel open and close (paper slides); denied (muted tick).

**Music** [NEW]: one seamless 2 to 3 minute ambient loop (soft mallets and pads, about 80 beats a minute, no catchy melody to tire of), a lightly layered version during Hot Hand, its own volume control.

**Vibration patterns** [PARTIAL], through the Capacitor Haptics plugin: tap 8 ms; landing 10 ms; x2 landing 10/30/10; jackpot 12/40/12/40/24 [HAVE]; side grown 25 ms; new die 40 ms; Recast a rising 3-step ramp; hold-buy a tick every third purchase. Separate sound, music and vibration toggles in settings.

### Accessibility

- **Colour-blind safe** [PARTIAL]: colour is never the only cue. x2 faces get a "x2" mark or double rim notch, the jackpot its star and jewel, and floats repeat the mark. Use a tint that separates from gold under red-green colour blindness (for example blue-cyan). Today only colour separates x2 from normal faces.
- **Reduced motion** [NEW]: follow the phone setting plus a toggle: no shake, trails or bursts; rolls become a 150 ms settle.
- **Text size** [NEW]: the prototype has 9 to 11 px labels. Minimum 12 px (14 px body), survive Android font scaling to 130%, number window at least 18 px.
- **Also**: touch targets of at least 48 dp (Android's own guidance: https://support.google.com/accessibility/android/answer/7101858); text contrast of 4.5:1 or more in every theme and skin (WCAG: https://www.w3.org/TR/WCAG21/#contrast-minimum ; a `check.js` test could verify it).

Everything is drawn in code, with no image files. Keep the shapes procedural (the morph depends on them) and add textures only for grain, backgrounds and particles. The download stays small, and the wheel and slot versions reuse every system above.

## 7. The long-term content gap

Nate expects players to stay "a year or two". The prototype runs out after about two hours: the shop empties and Recast stops at 3 runs (a deliberate cap, because uncapped Recast looped forever in v1). This is the biggest gap between prototype and product (feedback F11). It needs new content, not price tuning (SPEC A1 and A9).

Candidates from `ROADMAP.md`, none decided:

| Candidate | What it is | Fit with Nate's rules | Main risk |
|---|---|---|---|
| **Face editing (second act)** | After 100 sides, upgrade what is on individual faces. Starts from the rejected "carved faces" idea in `DECISIONS.md` | Strong hook, and the x2 and jackpot sides already teach it. Must stay visual, with no rule text | Too many face types to learn; chained rerolls can loop forever (why it was cut from v1) |
| **More dice beyond 3** | The SPEC section 9 grid, then hero plus tray (section 6) | Directly answers F11 | Presentation cost on cheap phones |
| **Deeper prestige** | More Recast layers, or uncapped Recast with diminishing returns | Cheap to build on existing code | Uncapped Recast looped in v1; needs a sim invariant that proves it does not |
| **More skin categories** | Trails, landing effects, sound packs, tables, each with a set bonus | Nate asked for collecting (rule 7) | Bonuses stacking into runaway income |
| **Timed goals or light events** | Occasional goals | Only if they fit "no menu fiesta" | Extra screens; the weakest fit |

Suggested order: deeper prestige first (cheapest, and it extends every other layer), then face editing as the headline second act, then more dice, with skin categories added steadily. Each new layer gets its own sim milestones and invariants before it is built. Two years of hand-made content is not realistic; the long tail has to come from a prestige loop that keeps paying plus collecting, with new layers added over time.

## 8. Android launch checklist

Checked against Google, AdMob and Capacitor pages in September 2026. Re-check dates before submitting.

Each step is marked **[Nate]** (clicks in a website or on a phone; no code) or **[Builder]** (code, tools and commands; a person or an AI session). Where a step says "terminal", that means a command window opened in the project folder; the builder handles those.

**Do now**
1. [Nate] **Developer verification:** in Play Console, confirm the account and package show as verified on the home page. Enforcement starts in some countries on **30 September 2026** and goes global in 2027, so do this before any other work: https://developer.android.com/developer-verification/guides/google-play-console , https://android-developers.googleblog.com/2026/06/android-developer-verification.html

**Tools and project**
2. [Builder] Install Node.js (LTS), Android Studio (it bundles the Java JDK and the Android SDK) and Git. Capacitor's setup page lists the requirements: https://capacitorjs.com/docs/android
3. [Builder] Start from Nate's existing Capacitor Android project from another app (location in the local Project Hub, not in this public repo) to reuse its signing and plugin setup: copy its `android/` folder settings and `capacitor.config` pattern, not its web files. Then, in a terminal in the game folder, run `npx cap add android` and `npx cap sync`: https://capacitorjs.com/docs/android
4. [Builder] Choose the package name (`applicationId`, the app's permanent id, in the form `com.yourname.onemoreside`). It lives as `appId` in `capacitor.config` and as `applicationId` in `android/app/build.gradle`. **Never change it after the first upload**; Play treats a new id as a different app: https://developer.android.com/build/configure-app-module
5. [Builder] Target **Android 16 (API level 36)**, required for new apps and updates from **31 August 2026** (extension to 1 November 2026 on request); missing it blocks uploads: https://developer.android.com/google/play/requirements/target-sdk . The setting is `targetSdkVersion` in `android/variables.gradle`, which Capacitor 8 already sets to 36: https://capacitorjs.com/docs/updating/8-0

**Signing**
6. [Builder] Create or reuse an **upload key** (the file that proves an upload came from you); Google holds the real signing key through Play App Signing: https://developer.android.com/studio/publish/app-signing . Easiest route: Android Studio, menu **Build > Generate Signed App Bundle or APK**, which creates the key file and its passwords.
7. [Nate] **Back up the key file and both passwords** somewhere private and off this computer (a password manager plus a private cloud folder). Losing them means asking Google for an upload-key reset and waiting. **Never commit the key file or its passwords to the public repo.**
8. [Builder] Upload an **Android App Bundle** (`.aab`); new apps must use this format on Play: https://developer.android.com/guide/app-bundle . Build it with the same Android Studio menu, or in a terminal in the `android` folder with `gradlew.bat bundleRelease` on Windows (`./gradlew bundleRelease` elsewhere) once signing is configured.
9. [Builder] Raise `versionCode` (in `android/app/build.gradle`) by 1 for every upload; Play rejects a repeated number.

**Ads and consent**
10. [Nate] Create the app in AdMob and link it to Play Console (works before release): https://support.google.com/admob/answer/10298742 . Create one **rewarded ad unit** (an ad the player chooses to watch for a reward). No forced ads in a first session (`DECISIONS.md`).
11. [Builder] Use Google's official **test ad ids** in all development and testing (the Android rewarded test id is listed at https://developers.google.com/admob/android/test-ads ). Keep the real app id and ad unit id in one config file, and switch to them only for release builds (phase 8).
12. [Builder] Install `@capacitor-community/admob` and follow its Android setup (it adds the AdMob app id to `AndroidManifest.xml`): https://github.com/capacitor-community/admob
13. [Nate, then Builder] Use Google's **User Messaging Platform** (UMP, its consent tool) and request consent before loading any ad; required for the EEA, UK and Switzerland: https://developers.google.com/admob/android/privacy , https://developers.google.com/admob/android/privacy/gdpr . Nate creates the consent message in AdMob under **Privacy & messaging** (https://support.google.com/admob/answer/10107561); the builder calls it from the app. Gate only ads, never the game; the message appears once. Add a "Privacy choices" entry in settings so players can change their answer.
14. [Nate] On the same Privacy & messaging page, create the **US state regulations message** too: https://support.google.com/admob/answer/10862202 , https://support.google.com/admob/answer/10860309
15. [Builder] Publish an **app-ads.txt** file at the root of the developer website listed on the store page (the GitHub Pages site that hosts the privacy policy can hold it); AdMob checks it: https://support.google.com/admob/answer/9363762

**Play Console** (all [Nate])
16. Create the app as a free **Game**. **Free can never be changed to paid**; a paid version would need a new app: https://support.google.com/googleplay/android-developer/answer/6334373
17. **Content rating:** answer honestly. The dice version has no wagering and no simulated gambling, so the gambling answers are "No": https://support.google.com/googleplay/android-developer/answer/17190352 . Coins never cash out; real-money gambling is outside Play's rules without a licence: https://play.google.com/about/restricted-content/gambling/
18. **Target audience 13 and older.** Including under-13s pulls in the Families policy, which restricts ad SDKs: https://support.google.com/googleplay/android-developer/answer/9867159
19. **Data safety:** declare what the ad SDK collects (advertising id, device identifiers, app interactions, diagnostics), for advertising, shared with AdMob; encrypted in transit; no accounts, so no account data to delete: https://support.google.com/googleplay/android-developer/answer/10787469 . The answers must match the exact AdMob SDK version in the build; Google publishes the list per version: https://developers.google.com/admob/android/privacy/play-data-disclosure
20. **Privacy policy:** a short page at a stable address (GitHub Pages under the game's repo fits), covering AdMob's use of the advertising id. Every app must link one in the Data safety form, even one that collects nothing (same page as step 19), so it must exist before the first test track. Who writes and hosts it is decision 22.
21. **The other "App content" declarations:** ads ("Yes, my app contains ads", consistent with the audience settings), app access (no login needed), and the news, financial, health and government declarations (all "No"): https://support.google.com/googleplay/android-developer/answer/9859455 . Also set the category (Game, then Casual or Simulation) and a public contact email for the listing that is not a personal address.

**Closed test**
22. A personal developer account created after 13 November 2023 needs **at least 12 testers opted in for 14 days in a row** before production access. Early leavers do not count, so recruit extras: https://support.google.com/googleplay/android-developer/answer/14151465
23. [Nate] Invite testers: in the closed track, add an email list or a Google Group, then send testers the **opt-in link** from that page. Each tester must open it, opt in, install from Play and stay opted in for the 14 days: https://support.google.com/googleplay/android-developer/answer/9845334
24. [Builder] After the first upload, wait for Play's **Pre-launch report** (automatic tests on real devices) and fix crashes before inviting testers, so the 14-day clock is not wasted.

**Store listing** (all [Nate], with the builder capturing screenshots and video)
25. **Title**, 30 characters at most: "ONE MORE SIDE" (13) or "ONE MORE SIDE: Dice Idle" (24). **Short description**, 80 at most: front-load "dice", "idle", "clicker". **Full description**, up to 4,000: key terms 3 to 5 times, naturally: https://support.google.com/googleplay/android-developer/answer/13393723 , https://support.google.com/googleplay/android-developer/answer/11926878
26. **Icon (512x512 PNG):** one die mid-morph from triangle to square, new edge glowing, no text, readable at 48 px. **Feature graphic (1024x500):** pebble to coin to triangle to hexagon to 100-sided dial, with the title. Sizes: https://support.google.com/googleplay/android-developer/answer/9866151
27. **Eight portrait screenshots (1080x1920,** 9:16, meeting Google's 1080 px recommendation on the same page), captions of 4 words or fewer: the one-side start, the evolution strip, a gold jackpot, three dice with TRIPLES, a 100-sided dial, the skins grid, Recast x1.00 to x3.40, "no real money, ads optional".
28. **A 15 to 30 s video** from the real build: tap, grow through six shapes, roller, jackpot, jump to a 100-sided dial and three dice, logo. Play takes it only as a **YouTube video link**, and only the first 30 s autoplay (same page).

**After release**
29. [Nate] Check **Android vitals** (crashes, freezes, battery) weekly for a month, then monthly. Play may reduce the visibility of an app that crosses its bad-behaviour thresholds: https://developer.android.com/topic/performance/vitals
30. [Nate] Measure day-1 and day-7 retention, rewarded-ad views per player and ad revenue per thousand views (`ROADMAP.md`).

## 9. Wheel and slot variants

Both are Nate's ideas and reuse the same engine (`VISION.md`): a wheel with N wedges is the same N-sided shape seen from above, and a slot reel is a die with symbol faces, rolled together with a payline check. The `THEME` seam (section 4) already holds the parts that change.

They ship later, as **separate store listings**, never as a mode inside the dice app, because they change the rating and policy picture. `research/policy-scout-2026-09-17.md` has the detail.

- **Rating.** A wheel or reel game with no real money is "social casino" by Google's definition, even if the gambling look is only cosmetic. Answer "Yes" to simulated gambling. Expect Teen / 12+ (possibly higher in some regions). Families targeting is ruled out permanently. If the variant is ever advertised with Google Ads, it must not target minors: https://support.google.com/adspolicy/answer/15132179
- **Disclaimer** in the app and listing: no real-money gambling, no prizes of real-world value. Google Ads also requires "intended for users over legal gambling age" when advertising a social casino game (same page), but that line conflicts with a Teen rating. Default: leave the age line out, and add it (with an 18+ target audience) only if paid ads are ever run. This is decision 23.
- **Wording.** Never imply real winnings ("win real prizes", "cash out"). No real casino branding. No sweepstakes. Real-money gambling is a separate, heavily regulated program and out of scope.
- **Ads.** AdMob's restricted gambling category is defined by real money changing hands, so a no-cash variant should not land in it; if its inventory is flagged anyway, it "will likely receive less advertising" (https://support.google.com/publisherpolicies/answer/10437795), which lowers payouts. Check the ad account stays in good standing after launch. Advertising a social casino game needs Google Ads certification, which matters only if paid marketing is ever used.
- **Order.** Ship the dice version first, measure its ad payouts, then compare before investing in a variant.

## 10. Phased production plan

Effort is in AI sessions of about 2 to 3 hours. Estimates are rough and assume one focused session at a time. Calendar waits (tester days, store review) are listed separately.

| Phase | Work | Done when | Sessions |
|---|---|---|---|
| 0. Verify and phone check | First, developer verification (section 8, step 1; due 30 September 2026). Then Nate plays v2.1 and answers section 11, including the phone checks (decisions 2, 18 to 21) | Account verified; answers logged in `FEEDBACK_LOG.md` and `DECISIONS.md` | 0 to 1 (Nate's time) |
| 1. Wrap and device test | Capacitor project from the template; build to a phone; run the section 3 performance test on a cheap phone | 60 fps (at least 50) in the busiest scene, or a PixiJS decision | 2 to 3 |
| 2. Foundations | Economy as a module the gates import; the section 4 known limits (saves, clock, per-frame cost, text, haptics, reduced motion, dev tools, seeded randomness) | All gates pass; a save survives a forced close | 3 to 5 |
| 3. Core presentation | Fast-roll Option A (F7); 2.5D die look; float and burst tiers; jackpot minimum width and jewel (F16); colour-blind marks; text sizes | Nate says the spin feels "full" on the phone | 5 to 8 |
| 4. Assets | 12 die skins, 8 backgrounds, icon set, particles, sound effects, music loop, vibration patterns; contrast check in `check.js` | All section 6 assets in; every skin passes contrast | 4 to 6, plus sourcing sounds and music |
| 5. Long-term content | New sim milestones and invariants first; then deeper prestige, face editing, more dice with hero plus tray, new skin categories | `sim.js` shows the new content window with all invariants holding | 6 to 10 |
| 6. Ads and store setup | AdMob rewarded ads with test ids, UMP consent, privacy choices; privacy policy page; Play Console entry, rating, audience, data safety, App content declarations, app-ads.txt | Rewarded ads work on a phone with test ids; every Console section green | 3 to 4 |
| 7. Closed test | Upload, Pre-launch report, fix crashes, 12+ testers for 14 days, fix what they find | Production access granted | 1 to 2, plus 14+ days of waiting |
| 8. Launch | Store listing text, screenshots, feature graphic, video; real ad ids; production release | Live on Play | 2 |
| 9. After launch | Weekly vitals, retention and ad measurements; small fixes | First month reviewed | 1 a month |
| Later | Remove-ads or cosmetic purchase (Billing 8+); iPhone; wheel and slot listings | Separate decisions | Not estimated |

Total to launch: about 26 to 41 sessions, plus at least 14 days for the closed test. Once phase 2 is done, phase 6 can run alongside phases 3 to 5, and the 14-day closed test can run while content work continues. At least the first content layer (deeper prestige) should be in before the production release.

## 11. Open decisions for Nate

Each has a recommended default. Saying "defaults" accepts them all.

**Do now, before anything else:** developer verification in Play Console (section 8, step 1). Some countries enforce it from 30 September 2026.

| # | Decision | Recommended default |
|---|---|---|
| 1 | What to build the app in (F18) | Web page wrapped with Capacitor 8; PixiJS only if the phone test fails |
| 2 | Fast-roll presentation (F7) | Option A: a full visible roll per die, at most about 3 a second, with in-between throws added to it |
| 3 | Jackpot sliver on big dice (F16) | Draw it at least 10 degrees wide and add a rim jewel; odds unchanged |
| 4 | Near-miss glint next to the jackpot | Off; it adds gambling feel |
| 5 | Die look | 2.5D: flat shape with a side wall, bevel and shadow; skin sets Stone, Metal and Glass |
| 6 | Past 9 dice | Hero plus tray; add stacks only if needed. This replaces SPEC section 9's hard cap at 9 |
| 7 | First long-term content layer | Deeper prestige first, then face editing as the second act |
| 8 | Launch with new content or with the current two hours | Launch with at least the deeper prestige layer |
| 9 | Grant the reward when a real ad fails or is dismissed | Split the rule. Ad fails to load or errors: still grant it, as `ROADMAP.md` decided (never block progress). Player closes the ad early: no reward, because AdMob pays "upon completion" (https://support.google.com/admob/answer/7313578). The prototype grants in both cases; change it in phase 6 |
| 10 | Economy as its own file or an inline block extracted when building | Its own module file; update the `sim.js` and `check.js` loaders to import it |
| 11 | Paint-hint script or native splash in the app | Native splash and status-bar colour in the app; keep the paint hint for the web version |
| 12 | Source of sound effects and music | A royalty-free library with a commercial licence, with each licence recorded in `docs/`; AI-generated only with clear commercial rights |
| 13 | Low-end test phone | Test on a cheap, older Android phone (about 2 GB of memory) before committing to the phase 3 look |
| 14 | Remove-ads or cosmetic purchase | Not for launch; decide after measuring ad revenue. Then compare RevenueCat with a direct Play Billing plugin |
| 15 | Seeded (replayable) randomness | Yes, in phase 2; it helps debugging and costs little |
| 16 | Offline earnings before the roller | Leave as is unless the phone check shows early players quitting |
| 17 | Gold only for jackpot, the x2 tint only for x2 (section 6) | Yes, in phase 3; move the other gold and tint uses to a plain accent. Record in `DECISIONS.md` |
| 18 | Is the stretch from 5 sides to the auto-roller too grindy? (two v1 testers said so) | Phone check. If it drags, lower the roller price in the economy block and re-run `sim.js` |
| 19 | During a long hold on a 40+ side die, the window counts up the new top face instead of showing rolls | Phone check. Keep it unless it reads as confusing |
| 20 | Hold ramp feel: first repeat at 0.35 s, up to 15 buys a second; smooth rolls while holding (P1, P2) | Phone check. Keep the current values unless the thumb overshoots |
| 21 | Do 30-, 60- and 100-sided dice look good on the phone? (F8) | Phone check. Keep the current dial unless numbers are hard to read |
| 22 | Who writes and hosts the privacy policy (a hard requirement before closed testing) | The builder drafts it from AdMob's data list; Nate reviews it; host it on the game's GitHub Pages site with no personal contact details |
| 23 | "Legal gambling age" line in the wheel and slot disclaimer (section 9) | Leave it out and keep the Teen rating; add it, with an 18+ audience, only if paid ads are run |

Still unmeasured (the builder resolves these, not Nate): real frame rate and app size of a Capacitor build; RevenueCat pricing versus a free billing plugin; exact dates on Defold's release pages; iPhone builds without a Mac for Defold, Unity and Flutter; whether the template project already uses Play App Signing; whether the closed-test rule applies to the account (check privately, in the local Project Hub). The AI scores in section 3 are informed judgment; no benchmark exists.

## 12. Sources

### Project files
- `docs/README.md`, `docs/VISION.md`, `docs/FEEDBACK_LOG.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`
- `docs/research/`: competitor scout, policy scout, design panel, v1 and v2 specs as designed, verification history v1 and v2
- `../index.html`, `../SPEC.md`, `../check.js`, `../sim.js`, `../README.md`, `../CLAUDE.md`

### Engine and technology
- https://capacitorjs.com/docs/updating/8-0
- https://developer.android.com/build/configure-app-module
- https://developer.android.com/guide/app-bundle
- https://support.google.com/accessibility/android/answer/7101858
- https://www.w3.org/TR/WCAG21/#contrast-minimum
- https://survey.stackoverflow.co/2025/technology
- https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
- https://docs.godotengine.org/en/stable/tutorials/migrating/upgrading_to_godot_4.html
- https://dev.to/ziva/7-godot-4-api-calls-your-ai-assistant-still-gets-wrong-3ep6
- https://www.summerengine.com/blog/best-llm-for-godot
- https://capacitorjs.com/docs/android
- https://capacitorjs.com/docs/ios
- https://github.com/ionic-team/capacitor
- https://pixijs.com/blog/pixi-v8-launches
- https://pixijs.com/blog/8.16.0
- https://filiph.net/text/benchmarking-flutter-flame-unity-godot.html
- https://defold.com/manuals/optimization-size/
- https://defold.com/manuals/android/
- https://defold.com/license/
- https://docs.flutter.dev/perf/impeller
- https://docs.flutter.dev/perf/app-size
- https://github.com/flame-engine/flame
- https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html
- https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html
- https://docs.godotengine.org/en/4.4/contributing/development/compiling/optimizing_for_size.html
- https://godotengine.org/license/
- https://discussions.unity.com/t/what-the-minimum-size-of-built-apk-file/169929
- https://unity.com/blog/unity-is-canceling-the-runtime-fee
- https://unity.com/products/pricing-updates
- https://threejs.org/
- https://github.com/mrdoob/three.js

### Ads and consent
- https://developers.google.com/admob/android/test-ads
- https://support.google.com/admob/answer/7313578
- https://support.google.com/admob/answer/10107561
- https://support.google.com/admob/answer/10862202
- https://support.google.com/admob/answer/10860309
- https://support.google.com/admob/answer/9363762
- https://developers.google.com/admob/android/privacy/play-data-disclosure
- https://support.google.com/publisherpolicies/answer/10437795
- https://support.google.com/adspolicy/answer/15132179
- https://support.google.com/admob/answer/13554116
- https://support.google.com/admob/answer/10298742
- https://developers.google.com/admob/android/privacy
- https://developers.google.com/admob/android/privacy/gdpr
- https://github.com/capacitor-community/admob
- https://capawesome.io/blog/announcing-the-capacitor-admob-plugin/
- https://github.com/poingstudios/godot-admob-plugin
- https://github.com/godot-sdk-integrations/godot-admob
- https://developers.google.com/admob/unity/quick-start
- https://developers.google.com/admob/unity/reference/namespace/google-mobile-ads/ump/api
- https://pub.dev/packages/google_mobile_ads
- https://developers.google.com/admob/flutter/rewarded
- https://github.com/defold/extension-admob/releases
- https://defold.com/assets/ump/

### Billing
- https://developer.android.com/google/play/billing/deprecation-faq
- https://github.com/RevenueCat/purchases-capacitor
- https://www.revenuecat.com/docs/getting-started/installation/cordova
- https://github.com/godot-sdk-integrations/godot-google-play-billing
- https://godotengine.org/asset-library/asset/4137
- https://docs.unity.com/ugs/en-us/manual/overview/manual/release-notes
- https://github.com/defold/extension-iap/releases
- https://pub.dev/packages/purchases_flutter/changelog
- https://github.com/flutter/flutter/issues/171523

### Google Play policy and publishing
- https://support.google.com/googleplay/android-developer/answer/6334373
- https://support.google.com/googleplay/android-developer/answer/9859455
- https://support.google.com/googleplay/android-developer/answer/9845334
- https://support.google.com/googleplay/android-developer/answer/9866151
- https://developer.android.com/topic/performance/vitals
- https://www.esrb.org/ratings-guide/
- https://www.appbrain.com/app/idle-dice/de.lutsgames.idle_dice
- https://developer.android.com/studio/publish/app-signing
- https://developer.android.com/google/play/requirements/target-sdk
- https://developer.android.com/developer-verification/guides/google-play-console
- https://android-developers.googleblog.com/2026/06/android-developer-verification.html
- https://support.google.com/googleplay/android-developer/answer/14151465
- https://support.google.com/googleplay/android-developer/answer/17190352
- https://support.google.com/googleplay/android-developer/answer/9867159
- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/13393723
- https://support.google.com/googleplay/android-developer/answer/11926878
- https://play.google.com/about/restricted-content/gambling/
