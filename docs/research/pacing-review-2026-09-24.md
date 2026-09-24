# Pacing review: first session and milestone curve

Design review, 2026-09-24, on the shipped v2.1 economy. Source: `node sim.js` (unchanged), plus a scratch timeline script that loads the same `<script id="economy">` block the way `sim.js` does and logs every purchase. `index.html`, `sim.js` and `check.js` were not modified. No network; the genre numbers are the ones already in this folder (competitor scout, design panel judges) plus the usual first-session rules: first purchase inside 10 s, a new mechanic every 1 to 3 min early on, automation before tapping gets tiring (2 to 5 min), a first big moment inside 10 to 15 min, a visible goal when session 1 ends.

Nate, 2026-09-24, verbatim: "im also a bit concerned about the pacing of the game, when we should give the player 2 dice, when each upgrade should happen. i know we need to get through alot more before balancing, but i want to ensure the pacing is optimal for engagement and fun". Nothing in the economy was changed; this is input for the later balancing pass.

## Summary

1. The opening is right. First purchase at 8 s, a six-sided die at 27 s, a new side every 4 to 6 s for the first 80 s, first x2 at 1:24. The v1 "5 to 6 sides is a grind" complaint is gone: there is something affordable every 4 to 18 s all the way to the auto-roller.
2. The auto-roller lands at 4.7 min for a player who always buys the cheapest thing (the sim's gate bot), 1.8 min for one who saves for it, 1.0 min for a fast tapper. 4.7 is the top of the acceptable window, and SPEC section 2's own script says about 2:00, so the spec disagrees with its own milestone table.
3. The second die is fine by the clock: 12.2 min (cheapest buyer), 5.9 (saver), 4.1 (fast tapper), 17.3 (idle). The problem is what follows it: the next new thing is the first Recast, 16 to 24 minutes later, the RECAST card stays hidden until about minute 26 for the cheapest buyer, and the third die (60,000) is hidden behind cheaper cards for the whole first run.
4. The first jackpot is a weak moment. At tier 1 it pays exactly 2x the doubled top face the player already sees every few seconds, and for the cheapest buyer it lands on a 48-side dial where the gold face is a 7.5 degree sliver. It becomes a real jackpot at tier 3 (29x an average face): minute 29 for the cheapest buyer, minute 10 for a fast tapper.
5. The first x2 lands on a 17-side die for the cheapest buyer, past the 13-side point where the die stops showing every number. Only faster or saving players see their first x2 on a numbered die.
6. Sameness, not dead zones, is the mid-game problem. Minutes 5 to 10 are twelve near-identical + SIDE buys on a 33 to 48 side die; minutes 15 to 36 are about forty + SIDE buys on 40+ side dials with one x2, jackpot tier or roller level per minute or less. The sim reports no dead zone because a side is always affordable.
7. Session 1 (10 to 15 min) ends without a visible long goal for the cheapest buyer: no RECAST card, no third die on screen, skins not yet affordable, and a player who quits before the roller (4.7 min) earns nothing offline.
8. Change now, low risk: show the RECAST card earlier (a presentation constant, not economy); halve X2_BASE so the first x2 lands on a numbered die; fix the spec's roller target. Measured effects are in section 5.
9. Playtest first: the jackpot ladder reshape, a cheaper first roller level, a cheaper third die, and any answer to the dial-zone sameness.
10. Leave the second die's timing alone. It is set by roller level 2 plus 5,000 coins; section 5 shows what the candidate delays do to the gate.

## 1. What the simulator reports

Minutes to each milestone, `node sim.js`, tolerance 35%. Reference is the gate. 50 and 100 sides are measured on the final run (never-prestige has no final run, so its 11.7 is run 1).

| Milestone | Target | reference | active | optimiser | hoard-2x | idle | never-prestige | jack-first | rush-die | casual |
|---|---|---|---|---|---|---|---|---|---|---|
| First side | 0.15 | 0.13 | 0.07 | 0.13 | 0.13 | 0.13 | 0.13 | 0.13 | 0.13 | 0.13 |
| 6 sides | 0.6 | 0.45 | 0.26 | 0.45 | 0.45 | 0.45 | 0.45 | 0.45 | 0.45 | 0.45 |
| First x2 | 1.2 | 1.39 | 0.57 | 1.85 | 1.85 | 1.39 | 1.39 | 119.5 | 9.14 | 10.4 |
| Roller | 4 | 4.73 | 1.03 | 1.78 | 1.78 | 4.73 | 4.73 | 2.14 | 1.80 | 40.7 |
| 20 sides | 1.5 | 1.69 | 1.28 | 2.25 | 2.25 | 1.69 | 1.69 | 35.0 | 9.92 | 10.7 |
| First jackpot | 9 | 10.41 | 2.95 | 4.46 | 4.46 | 14.49 | 10.41 | 5.10 | 13.87 | 60 |
| Second die | 14 | 12.19 | 4.05 | 5.86 | 5.86 | 17.26 | 12.19 | 119.6 | 8.97 | 70 |
| First Recast | 34 | 36.68 | 21.08 | 25.85 | 34.21 | 50.62 | never | 87.21 | 37.83 | 130 |
| 50 sides | 55 | 68.97 | 44.78 | 52.06 | 64.93 | 92.47 | 11.74 | 168.8 | 70.12 | 230 |
| 100 sides | 105 | 124.7 | 75.46 | 83.61 | 96.47 | 152.7 | 503.8 | 235.0 | 125.9 | 340 |
| End of content | 135 | 130.5 | 77.79 | 85.99 | 98.86 | 158.7 | never | 240.7 | 131.6 | 350 |

Policies: reference 1.7 taps/s, cheapest income-positive card; active 3.0 taps/s, best return per coin; optimiser 1.7 taps/s, best return; hoard-2x waits for twice the Recast threshold; idle stops tapping once the roller is bought; casual plays 60 s every 10 min.

Dead zones (nothing affordable for over 4 min): 0 on every always-open policy. Longest stretch: reference 2.6 min (t=130), active 1.9, optimiser 1.9, hoard-2x 1.9, idle 2.7, jack-first 2.6, rush-die 2.6. Never-prestige: 21.0 min at t=551 after declining Recast at 36.7, with 37 more off-curve zones, shop empty for good at 551 min. Casual: 34 zones, longest 10 min (closes the game, not gated). + SIDE stalls: 0 everywhere. Content length 86 to 130 min. Recast climb-back 1.2, 5.3, 5.5 min. All six invariants PASS: no income drop over 146,224 shapes; + SIDE dominated by ROLLER for 3.2% of playtime, first at 10.9 min; match bonus 1.0% of coins (peak 25% at 6/6/6); jackpot share worst 71%; peak lifetime 5.89e8.

## 2. The first 15 minutes, purchase by purchase

Reference bot (1.7 taps/s, buys the cheapest thing that raises income). Income in coins/s.

| Time | What happens | Income |
|---|---|---|
| 0:03 | + SIDE lights at 13 | 1.7 |
| 0:08 | First side. Then one side every 4 to 6 s | 2.6 |
| 0:18 | ROLLER preview appears ghosted (4 sides) | |
| 0:27 | 6 sides. ROLLER lights at 600 = 101 s of income | 6.0 |
| 0:40 | 9 sides. x2 SIDE lights at 90 | 8.5 |
| 0:57 | 13 sides, the last shape that shows every number | 11.9 |
| 1:24 | First x2, on a 17-side die (tick mode) | 17.0 |
| 1:41 | 20 sides | 19.6 |
| 2:11, 3:25 | x2 #2 at 23 sides, x2 #3 at 29 sides. Gaps between buys 8 to 13 s | 30.4 |
| 4:44 | ROLLER L0 at 33 sides, after about 480 taps. JACKPOT lights at 4,000 = 54 s of income | 34 to 74 |
| 4:44 to 10:24 | 12 sides (33 to 48), x2 #4 to #6, ROLLER L1 (7:04). Gaps grow from 9 to 30 s. The die becomes a dial at 40 sides (6:15) | 74 to 133 |
| 10:24 | First jackpot, tier 1, on a 48-side die | 151 |
| 11:20 | ROLLER L2. + DIE lights at 5,000 = 27 s of income | 186 |
| 12:11 | Second die. It goes 1 to 13 sides in 6 s, 1 to 20 in 17 s, 1 to 39 by 14:52 | 194 |
| 15:00 | Dice 50 and 39, roller L2, jackpot tier 1, 15% of the way to RECAST. RECAST card hidden (shows at 50%, about minute 26). + DIE #3 at 60,000 not on screen (two cheaper middle cards) | 330 |

Purchases per minute, reference, minutes 0 to 14: 12, 10, 7, 4, 4, 6, 3, 4, 2, 3, 2, 2, 30, 8, 5. Longest waits with nothing affordable: ten of 21 to 30 s between 7:55 and 12:11, none over a minute in the first 15. Longest run of consecutive + SIDE buys: 16 over 70 s (the opening, which is the shape show and is fine).

Active tapper (3.0 taps/s, buys by return, saves for it).

| Time | What happens |
|---|---|
| 0:04 | First side. 6 sides at 0:15, 9 at 0:22 (x2 lights), 12 at 0:30 |
| 0:34 | First x2, on a 12-side die (numbers still shown) |
| 1:02 | ROLLER L0 at 13 sides, after 25 s of saving. Income 24 to 40/s |
| 2:57 | First jackpot at 31 sides (tick mode), after 35 s of saving |
| 3:32 | ROLLER L2, + DIE lights |
| 4:03 | Second die. 1 to 12 sides in 6 s, 1 to 24 in 32 s |
| 5:20 to 9:44 | ROLLER L3, jackpot tier 2, L4, die 2 jackpot, jackpot tier 3 |
| 10:00 to 12:04 | Nothing bought for 135 s (saving for ROLLER L5 at 86,000) |
| 15:19 to 19:17 | One buy, then nothing for 238 s (ROLLER L6 at 232,000) |
| 20:06 | Third die. 21:05 first Recast |

Purchases per minute, active, minutes 0 to 20: 13, 18, 6, 2, 26, 8, 2, 4, 7, 3, 0, 0, 13, 1, 0, 1, 0, 0, 0, 3, 35. The sim counts none of those zero minutes as dead zones because a cheaper card was affordable; to the player they are 2 to 4 minute waits for one roller level.

Optimiser (1.7 taps/s, buys by return): saves from 11 sides for 59 s and buys the roller at 1:47; first x2 at 1:51 on an 11-side die; jackpot 4:28 at 31 sides; second die 5:52; zero-purchase minutes at 9 and 13 to 14; Recast 25:51. Idle (stops tapping at the roller): income drops from 74 to 41/s the moment taps stop; waits of 21 to 49 s from minute 6; jackpot 14:30, second die 17:15.

Minutes between new kinds of purchase (side, x2, roller, jackpot, die, Recast):

| Path | side to x2 | x2 to roller | roller to jackpot | jackpot to die | die to next new thing |
|---|---|---|---|---|---|
| reference | 1.3 | 3.3 | 5.7 | 1.8 | 24.5 (Recast 36:41; die 3 at 46:18 in run 2; x3 tier in run 3) |
| optimiser | roller first, 1.6; x2 4 s later | | 2.6 | 1.4 | 20.0 (Recast 25:51) |
| active | 0.5 | 0.5 | 1.9 | 1.1 | 16.0 (die 3 20:06, Recast 21:05) |

## 3. Against the benchmarks

| Benchmark | reference | optimiser | active | Verdict |
|---|---|---|---|---|
| First purchase inside 10 s | 7.6 s | 7.6 s | 4.2 s | Met |
| New mechanic every 1 to 3 min in session 1 | 1.3, 3.3, 5.7, 1.8 then 24 | 1.6, 2.6, 1.4 then 20 | 0.5, 0.5, 1.9, 1.1 then 16 | Met up to the second die, then a 16 to 24 min gap |
| Automation at 2 to 5 min | 4.7 | 1.8 | 1.0 | At the edge for the cheapest buyer |
| First big moment inside 10 to 15 min | jackpot 10.4, die 12.2 | 4.5, 5.9 | 3.0, 4.1 | Inside, but the jackpot itself is weak (4.5) |
| Session 1 ends on a hook | RECAST visible about 26 min | about 19 | about 14 | Not met for the cheapest buyer |

The design panel judges said the same things in advance: first purchase under 12 s, everything a stranger needs inside ten minutes, and "the 250k RECAST gate at about 30 min is beyond what a first session on a phone typically lasts". The build's Recast is at 36.7 min and its card appears at about 26.

## 4. The six questions

**4.1 Is the second die too late or too early?** Neither by the clock. It arrives when the player has roller L2 and 5,000 coins: 12.2 min for the cheapest buyer, 4 to 6 for engaged players, 17 for an idler. For the cheapest buyer it is the third new mechanic in three minutes (jackpot 10:24, roller L2 11:20, die 12:11, doubles seconds later), which is good drip-feed. Two things are off. First, the panel's stated payoff, "re-experience the best five minutes with late-game income behind it", lasts 6 s: die 2's sides cost 52 to 200 against 190/s income, so it goes 1 to 13 sides in a flurry (a hold does it in about 2 s). That is a burst of morphs, not a replay; whether the burst is satisfying is a playtest question. Second, and more important, nothing new follows it for 16 to 24 minutes (section 2). The right fix is after the die, not to the die.

**4.2 Is 6 sides to the roller still grindy?** Not in the v1 sense. In v1 sides 5 and 6 cost 235 and 516 with nothing else to buy; now the stretch 0:27 to 4:44 has 27 side buys and 3 x2 buys, never more than 18 s apart. What remains is 4.3 min of continuous tapping (about 480 taps at 1.7/s) for a player who never saves, and the roller card sitting at 600 the whole time (100 s of income at 6 sides, 50 s at 13). A saver has it at 1:47, a fast tapper at 1:02. SPEC section 2 describes the saver ("1:10 to 2:00 ROLLER 600 appears; the player mashes toward it") while the milestone table says 4 min and the gate bot lands at 4.73, so the spec's script and its table disagree by a factor of two. Real players will sit between 2 and 4.7 min. The roller's effect when it lands is unambiguous: +118% income for the reference bot, +67% for the fast tapper, and 2.0 rolls/s is above thumb speed as the panel demanded.

**4.3 Sameness.** The sim only measures "nothing affordable". The other failure is buying the same thing many times with nothing new happening, and the 1.13 side curve creates it by design: sides are always the cheapest card, they pay +2% each past 33 sides and +1% past 50, and from 40 sides the morph is a near-circle to a near-circle with the window counting up by one. Reference path: 4:44 to 10:24 is 12 sides, 3 x2 and one roller level in 5.7 min; 12 min to 36 min is about 60 purchases of which about 40 are + SIDE on 40+ side dials, with 20 to 57 s waits between them and one x2, jackpot tier or roller level per minute or less. Purchases per minute fall from 12 to 2. This is the honest cost of "sides are not the growth engine any more" (SPEC section 4): sides are load-bearing for the jackpot gate, so they cannot be removed, but each one is a smaller event than the last. Not a constant problem; see recommendation 6.

**4.4 Does the x2 arrive before the base loop is understood?** No. The card lights at 9 sides (0:40) after 8 side buys, and is bought at 1:24 (reference) after 16, or 0:34 (active) after 11. By then the loop tap, number, coins, + SIDE, bigger shape has run a dozen times. The real problem is the opposite: on the reference path the first x2 lands on a 17-side die, which is in tick mode (only the four faces nearest the marker are numbered), so "the top face is now tinted and doubled" is only visible when that face is near the marker. The spec's script has it at 9 sides. The cheapest buyer takes it late because 90 coins is more than any side until side 18 (92). Halving X2_BASE moves it to about 12 sides; see recommendation 2.

**4.5 Is the first jackpot a real moment?** Not at tier 1. The jackpot pays JACK_MULT x (n+1)/2, and JACK_MULT(1) = 8, so on any die it is 6.5x an average plain face and exactly 2x the top doubled face the player already lands on about one roll in eight. Measured at the moment of purchase:

| Path | Die | Jackpot pays | Top x2 face | Plain face avg | Share of die income | Lands once per | First hit expected in | Gold wedge |
|---|---|---|---|---|---|---|---|---|
| reference (10:24) | 48 sides, 6 x2 | 196 | 96 | 30 | 12% | 48 rolls | 11 s | 7.5 deg |
| optimiser / active | 31 sides, 4 x2 | 128 | 62 | 20 | 17% | 31 rolls | 5 to 7 s | 11.6 deg |
| earliest possible (12 sides) | 12 sides, 0 x2 | 52 | 12 | 6.5 | 40% | 12 rolls | 3 s | 30 deg |

The 12-side version is a jackpot: 8x the average face, 4x the top face, 40% of the die, a face you can see. Nobody reaches it except the jack-first beeline (5.1 min), because 4,000 coins is 2 to 4 min of income at 12 sides and the cheapest buyer never saves. Tier 2 (16x) is 4x the top x2 face; tier 3 (29x) is 7x and is where it starts to feel like one: minute 29 (reference), 12.6 (optimiser), 9.7 (active). The wedge width is already an open question in ROADMAP; the payout ratio is the other half.

**4.6 Does session 1 end on a hook?** For the cheapest buyer at 10 to 15 min the shop shows + SIDE (about 5,000), x2 (5,760), jackpot tier 2 (11,200) or roller L3 (11,800). The shop keeps only the two cheapest middle cards (index.html `refreshShop`), so + DIE #3 at 60,000 is never on screen in run 1 on that path (it needs both of the two cheapest middle cards above 60,000, which first happens after the Recast). The RECAST card appears at half its threshold (index.html `cardState`, `threshold * 0.5`), which is about minute 26. The skins chip appears at about minute 8 but 25,000 is 80 s of income and the bot never has 100,000 spare. Offline earnings are zero before the roller (`autoRate(-1)` = 0), so a player who leaves before 4.7 min gets no return card; the casual policy shows what that looks like at the extreme: roller on the fifth visit. The fast tapper ends a 15 min session mid-way through a 238 s save for roller L6, with RECAST at 55%.

## 5. Measured candidate changes

(pending: filled in from `node sim.js --set ...` runs)

## 6. Recommendations

(pending)

## 7. Method

`node sim.js` at v2.1, unchanged, 2026-09-24: GATE PASS, INVARIANTS PASS, content length 86 to 130 min. Timeline script: same purchase choosers as `sim.js` (cheapest income-positive; best return per coin with the + DIE lookahead), 0.2 s steps, skins bought at 4x cost, Recast pressed when lit; it logs each purchase with cost, gap and income before and after, unlock moments, waits with nothing affordable, and per-minute purchase counts. Candidate constants were tried with `node sim.js --set NAME=VALUE`, which changes nothing on disk. Jackpot-moment numbers come from `ECON.faceValue`, `dieExpected`, `jackShare` and `autoRate` on the shipped block. Read modes (numbers to 13 sides, four nearest numbered to 39, window from 40) are `readMode` in index.html.
