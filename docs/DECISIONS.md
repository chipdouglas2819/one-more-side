# Decisions

Newest first. "Nate" means Nate decided; "Claude" means Claude made a routine call Nate can overturn. Formula-level changes made during building, each with the measurement that forced it, are in `../SPEC.md` Appendix A and are not repeated here.

## Product and design

| Date | Decision | Why | By |
|---|---|---|---|
| 2026-09-18 | Any matching pair pays x2 and is labelled DOUBLES; three of a kind pays x3 and is labelled TRIPLES | v2 paid x3 for two matching dice and labelled it TRIPLES, which repeated the "why is it randomly 2x" confusion; the old rule could also freeze + SIDE at 100/100/5 | Claude, from v2.1 review and economy check |
| 2026-09-18 | Hold-to-buy covers + SIDE, x2 SIDE, JACKPOT SIDE and ROLLER; RECAST, + DIE, the x3 tier and skins stay tap-only | Those are big one-off moments that deserve their own flourish, and an accidental hold on RECAST would be costly | Claude |
| 2026-09-18 | The Recast threshold ignores the skin set bonus | Completing a skin set could switch off a lit RECAST button | Claude |
| 2026-09-17 | Hold-to-buy on repeatable upgrades; fast buying presented as one smooth growth; Recast screen cut to numbers | Nate's prestige feedback (`FEEDBACK_LOG.md` P1 to P3) | Nate |
| 2026-09-17 | Faces read 1 to N; growth comes from x2 sides, a jackpot side, dice, roller speed and Recast | Coin-value faces (1, 2, 3, 4, 6, 9) confused Nate | Nate |
| 2026-09-17 | x2 side doubles the highest faces one at a time; one jackpot face per die, never two | A second jackpot would make the die feel random rather than built; one gold face is readable at a glance | Claude |
| 2026-09-17 | The jackpot face is the die's 1, so the lowest roll becomes the most exciting | Turns the worst outcome into the best without adding a new face | Claude (v2 designer) |
| 2026-09-17 | A match multiplies only the matched dice, and never a jackpot face | Multiplying the whole throw or a jackpot made a match worth thousands of normal rolls and broke pacing | Claude (v2 build) |
| 2026-09-17 | Sides go to 100; cost grows 13 to 16% per side instead of 2.2x | With faces 1 to N one more side adds little income, so its price can't grow exponentially; 2.2 per side would make side 100 cost about 10^33 | Claude |
| 2026-09-17 | Past about 20 sides the die draws as a dial with the landed number in a window | Individual numerals become unreadable on a phone | Claude |
| 2026-09-17 | Keep 3 dice on screen for now; a documented grid plan for more later | Nate raised late-game crowding; building the grid before the content exists would be wasted | Claude |
| 2026-09-17 | Minimal skins: 3 die looks, 3 backgrounds, one grid, +10% for a complete category | Nate asked for collectible skins with a set bonus and free choice | Nate (feature); Claude (scope) |
| 2026-09-17 | Combo line removed; matches shown by glow plus a named burst | Nate couldn't tell what the line or the random 2x meant | Nate |
| 2026-09-17 | Positioning: the thrill of rolling and jackpots, never real money | Nate's view of the healthy appeal of simulated gambling | Nate |
| 2026-09-17 | Wheel and slot versions become separate listings later | Google treats them as social casino: Teen rating, possibly weaker ad payouts. Keeping dice clean protects its rating | Claude, from policy research |
| 2026-09-17 | Every upgrade has a fixed, shown price; nothing random is ever bought | Random paid items trigger loot-box odds disclosure and gambling territory | Claude, from policy research |
| 2026-09-17 | Art stays geometric; declare audience 13+ | Cute, child-appealing art can pull the app into Google's Families rules, which restrict ad networks | Claude, from policy research |
| 2026-09-17 | Prestige ("Recast") capped at 3 runs; the prototype ends honestly at about 2 hours | Uncapped, v1's Recast paid the same reward forever and looped. Real long-term content is a production item | Claude |
| 2026-09-17 | Recast keeps half the roller level, die slots and skins | The climb back must feel fast; a full wipe felt punishing in competitor reviews | Claude (design panel) |
| 2026-09-17 | Automation never gets taken away | The loudest complaint about Idle Dice 2 is that an idle game stops being idle | Claude (competitor research) |
| 2026-09-17 | Rewarded ads only, placeholders in the prototype; no forced ads in a first session | Idle Dice lost rating on iOS when an ad update froze the game and withheld rewards | Claude (competitor research) |
| 2026-09-17 | Taps faster than 10 a second are ignored | Stops auto-clickers; a human thumb tops out below that | Claude (v1 spec) |
| 2026-09-17 | Dice first, Android first, iPhone later | Nate's call | Nate |

## Technical

| Date | Decision | Why | By |
|---|---|---|---|
| 2026-09-17 | One self-contained `index.html`, no external files or network | Same as Nate's other prototypes: plays from GitHub Pages on a phone, wraps cleanly for Android | Claude |
| 2026-09-17 | All numbers live in one `<script id="economy">` block with no screen code; the game reads only from it | The simulator and the game can never disagree about money | Claude |
| 2026-09-17 | `sim.js` gates pacing: every milestone within plus or minus 35% of target, plus hard rules (no purchase lowers income, no dead zone over 4 minutes, no overflow) | Balance bugs a non-programmer can't see get caught automatically | Claude |
| 2026-09-17 | `check.js` compiles every script and asserts the price ladders | Catches broken builds before publishing | Claude |
| 2026-09-17 | Saves are versioned; a v1 save upgrades into v2 with a one-line notice | Nobody loses progress between versions | Claude |
| 2026-09-17 | Offline earnings computed by formula on return, capped at 4 hours (8 with the ad) | Never simulate while closed; also makes changing the phone clock pointless | Claude |
| 2026-09-17 | No game engine for the prototype | Canvas in a web page handles these shapes at 60 frames a second; the production choice stays open | Claude |
| 2026-09-18 | `×2 SIDE` unlocks at 9 sides instead of 8 | At 8/8/8 with 1-3 doubled faces every + SIDE lowered income, so a careful player could get stuck; at 9 no such shape exists and pacing is unchanged (SPEC A14) | Claude, from an independent economy review |

## Rejected ideas (kept so they aren't lost)

From the three-design panel (`research/design-panel-v1-2026-09-17.md`):
- **Carved face types (Double, Reroll, Wild, Chain):** too many things to learn for v1, and chained rerolls risk infinite loops. The x2 and jackpot sides are the simple version of this. Worth revisiting as a late-game "edit your faces" layer.
- **Momentum (+15% per tap, decaying in 3 seconds):** invisible, and punishes putting the phone down.
- **Tapping a die's edge to pick a face:** conflicts with tap-to-roll and needs tiny touch targets.
- **Pie-wedge die and top-down spinner:** read as wheels, not dice. Nate's wheel variant would use exactly this look, as its own listing.
- **An auto-roller slower than a thumb:** buying automation must never feel like a downgrade.
- **Uncapped prestige:** looped forever in v1 testing.
