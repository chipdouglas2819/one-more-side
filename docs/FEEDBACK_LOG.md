# Feedback log

Every piece of Nate's feedback on this game, verbatim, newest first. Each entry lists the decision taken and its status. Status values: **done** (in the current build), **in progress**, **planned** (in `ROADMAP.md`), **open** (no decision yet), **declined** (with reason).

---

## 2026-09-24: keep going, and the skipped sections

> "i have to step away for awhile, so keep going and make sure everything is tested and refined, also work on the skipped sections too"

| # | Point | Decision | Status |
|---|---|---|---|
| K1 | Keep going; everything tested and refined | v2.2 built from the three entries below. Every animation change was checked frame by frame in headless Chromium at 375x812 (every painted frame captured and tiled into contact sheets) and on the 18-combination skins matrix; `node check.js` and `node sim.js` pass unchanged | done (v2.2); needs Nate's phone |
| K2 | The skipped sections | The two items still open from the first playtest were reworked: F7 (a full spin at any speed) by the throw sized to the roll interval, and F16 (x2 and jackpot marks past 13 sides, the jackpot sliver on a 100-sided die) by the bands. Their rows below carry the new status. Pacing (C1) has its review written and waits for Nate | done (v2.2) for F7 and F16; pacing open |

---

## 2026-09-24: skins

> "and make sure everything will always look good regardless of what skins the player uses"

| # | Point | Decision | Status |
|---|---|---|---|
| S1 | Everything must look good on every skin | Each die skin carries its own x2 and jackpot mark colours, dark and light, chosen against that skin's face (the page-level tint and gold were picked against the background and vanished on the orange EMBER and mint JADE dice). The 18-combination matrix (3 die skins x 3 backgrounds x 2 themes) is screenshot-checked on every visual change from now on | done (v2.2) |

---

## 2026-09-24: pacing

> "im also a bit concerned about the pacing of the game, when we should give the player 2 dice, when each upgrade should happen. i know we need to get through alot more before balancing, but i want to ensure the pacing is optimal for engagement and fun"

| # | Point | Decision | Status |
|---|---|---|---|
| C1 | When the second die and each upgrade should arrive | No economy number changed: Nate said balancing comes later. The analysis lives in `research/pacing-review-2026-09-24.md` (milestone times for every simulated way of playing, the first 15 minutes purchase by purchase, the six pacing questions, candidate constants measured with `node sim.js --set`). The item is in `ROADMAP.md` under open questions | open: review written, balancing deferred until Nate has played v2.2 |

---

## 2026-09-24: the dice themselves (after playing v2.1)

> "I think the blue outline on the faces for x2 is too much, and the 2x doesnt seem to always appear on the bottom of the face consistently for all dice. im also not a fan of the beginning dice. 1 sided shouldnt even be able to be flipped, as kinda a joke about a 1 sided dice, some sort of estetic solution please. im also not a fan of how the 2 sided one flips, just seems inconsistent. im also not a fan of the auto flip annimation. please ensure highest production quality possible, and /resume always consider the player expereience to be engaging and estetically pleasing as possible with optimal ux. use whatever tools you need to make this a polished game"

| # | Point | Decision | Status |
|---|---|---|---|
| V1 | The blue outline on x2 faces is too much | The tinted wedge from the centre to the edge is gone. A doubled or jackpot face wears a band along its own edge, 13% of the radius deep, with a faint ink seam on its inner edge. Colour still means face type only. The band does the job at every side count, so the thick tick and pip past 13 sides are gone too; at 100 sides it is a coloured notch | done (v2.2); needs Nate's phone |
| V2 | The 2x is not in the same place on every face | The x2 / x3 tag and the jackpot star sit on the band, parallel to the edge, never upside down, so they are in the same place on every face of every die at every rotation. Before, the tag hung off the numeral, which was flipped face by face to stay upright, so it landed toward the centre on some faces and toward the rim on others. The numerals themselves are now drawn upright on the screen, each on its own face's apothem inside the band (Claude's call; Nate can overturn) | done (v2.2) |
| V3 | Not a fan of the beginning dice; a one-sided die should not be flippable, as a joke | The one-sided die cannot be flipped. A tap kicks it and it rocks on its flat like a weeble, tipping onto its round side by about 25 to 33 degrees and falling back, gone in about two seconds; the 1 rocks with it. The lean is capped so a fast roller can never tip it over. In fast mode it shivers instead of spinning. The payout fires at the same moment a throw's would. A one-sided die has nowhere else to land | done (v2.2); needs Nate's phone |
| V4 | The two-sided flip is inconsistent | The two-sided die is a coin and flips over: the lens goes edge-on and comes back the other way up, its two numerals foreshortening and swapping places, never mirrored. Before it spun in the plane like a propeller, stood on its tip twice a turn, hopped up the ground line and turned a different amount for each result | done (v2.2); needs Nate's phone |
| V5 | Not a fan of the auto flip animation | The roll is a throw: the die hops off the ground line, turns in the air and lands flat under the marker with a squash and its dust. The turn is sized to the time it has, so under the roller the die visibly lands on every result instead of flickering (v2 gave every roll two full turns in 380 ms). Motion blur is spread over the angle turned each frame; numerals fade with speed and come back as the throw slows. The coin gets a short bright flick sound and the disc a soft low knock | done (v2.2); needs Nate's phone |
| V6 | Highest production quality; engaging, aesthetically pleasing, optimal UX; use whatever tools are needed | Adopted as the bar for every visual change: checked frame by frame in headless Chromium at phone size before publishing, on all 18 skin and theme combinations (the harness is a tool, not part of the game). The final judgement is on Nate's phone | in progress (standing rule) |

---

## 2026-09-17: documentation

> "also ensure all thoughts, ideas and direction are getting documented if we need to move from this prototype to actual build"

| Decision | Status |
|---|---|
| This `docs/` folder: vision, feedback log, decisions, roadmap, research archive, production handoff | done; `PRODUCTION_HANDOFF.md` done 2026-09-18 |
| `CLAUDE.md` in the game folder requires every future session to keep these files current | done |

---

## 2026-09-17: prestige feel (after playing v1)

> "forgot to mention, when you prestige, you should be able to hold down upgrades to purchase them faster, and it shouldnt negatively effect the visual estetics of the dice rolling. the prestige is also over explained when you initially press it."

| # | Point | Decision | Status |
|---|---|---|---|
| P1 | Hold down upgrades to buy faster | Press and hold any repeatable shop card to auto-repeat. The first repeat comes after about 350 ms, ramping from about 4 to about 15 buys a second. A quick tap still buys one; sliding off cancels. Not on Recast or skins | done (v2.1): holding + SIDE bought 17 sides in 2.2 s in a browser check; feel still needs Nate's phone |
| P2 | Fast buying must not hurt the roll visuals | While holding: no per-purchase freeze or shake, the growth morph retargets smoothly, sounds collapse into a rising tick, and rolls and payouts continue with full presentation | done (v2.1); smoothness to be judged on the phone |
| P3 | Prestige over-explained | The Recast screen becomes the multiplier change as the headline, one line of what you keep, one of what resets, and two buttons | done (v2.1): the screen now reads RECAST, RUN 1/3, x1.00 -> x3.40, +16, KEEP and RESET icon rows, CANCEL and RECAST |

---

## 2026-09-17: first phone playtest of v1

> "Hmm well that social casino thing you mentioned is worrying, as i had another idea from this one, is basically the same thing but spinning wheels, its unfortunate because i think there is a good and healthy appeal to games that simulate gambling but dont cost actual money for people that are more conscious about it. Initial thoughts, I like it, I like the simplistic design and easy to understand game. I see the difficulties would be that it would need to heavily rely on esthetics/graphics and presentation to do well. Also keeping it so simplistic and easy to understand without making it a menu fiesta. Always show dont tell. It may also be difficult implementing skins, background or dice. I think we should be able to buy/collect skins, if you collect all in a category you get a boost, but still able to pick what your game looks like. It has to simulate properly and capture a full dice spin, while being able to keep up the animations properly with the speed, or being able to properly render the dice with up to 100 sides for instance. I also am not really a fan of the dice not being 1,2,3,4,5,6 for 6 sided, it is confusing. I think you should be able to buy a multiplied side or jackpot side for each dice. it may also be difficult rendering so many dice properly on screen towards end game (after someone plays a year or two) while keeping it all visually satisfying. I also think the money should be appearing above whichever dice it came from. it also doesnt communicate to me what the yellow line is between the different dice in the center of them that appears randomly. I also dont know why some are randomly 2x? the light/dark mode button doesnt work, it just goes to settings where it doesnt exist. im also unsure, or it wasnt communicated what the yellow side of the dice is/means. also doesnt communicate to the player the benifit of the hot hand. we gotta keep it simplistic, while maintaining maximum visual and ux estectics. I imagine it will eventually need to be made into some sort of game engine to get what im looking for."

| # | Point | Decision | Status |
|---|---|---|---|
| F1 | Worried about the "social casino" label; spinning-wheel variant idea | Nothing is banned. The wheel is a reskin of the same engine (an N-gon seen from above), shipped later as its own listing with a Teen rating. Recorded in `VISION.md` and `ROADMAP.md` | planned |
| F2 | Healthy appeal of gambling-feel games without real money | Adopted as the positioning in `VISION.md`. Coins never cash out | done (positioning) |
| F3 | Likes the simple, easy-to-understand design | Kept as design rule 1 | done |
| F4 | Success depends on aesthetics, graphics and presentation | v2 visual pass: shape depth, lighting, landing burst, jackpot sparkle. A real art pass is a production need, see `PRODUCTION_HANDOFF.md` | partly done; production item |
| F5 | No menu fiesta; show, don't tell | Design rules 2 and 3. One shop strip, one skins grid, one settings sheet | done; applies to every change |
| F6 | Buy and collect skins; completing a category gives a boost; free choice of look | v2: 3 die skins and 3 backgrounds bought with coins; completing a category gives +10% income for good; equip any owned skin | done (minimal); more categories planned |
| F7 | Capture a full dice spin at any speed | v2: tumble animation with easing. In fast-roll mode (above 8 rolls a second) the landed number shows in about 60 ms flashes. Nate's bar is not yet met at high speed | reworked in v2.2 as a throw with per-landing rest and adaptive blur; needs Nate's phone check |
| F8 | Render dice with up to 100 sides | v2: numbers on every face up to 13 sides, tick marks from 14 to 39, then a dial with the landed number in a window from 40 to 100. Checked in a browser, not yet on Nate's phone | done; needs phone check |
| F9 | Faces must read 1 to 6, not coin values | v2: faces read 1 to N | done |
| F10 | Buy a multiplied side or jackpot side for each die | v2: x2 side (doubles the highest faces one at a time, up to 12, later x3) and one jackpot side per die (the 1 face turns gold with a star and pays big; its tier rises with purchases) | done |
| F11 | Many dice on screen late in a long game ("after someone plays a year or two") | v2 caps at 3 dice and about 130 minutes of content. The layout plan for more dice is in `SPEC.md`. **Nate expects years of play; the prototype has two hours.** This is the largest gap between prototype and product | **open**: see `ROADMAP.md`, long-term progression |
| F12 | Money should appear above the die it came from | v2: per-die payout floats | done; v2.1 re-checked: floats stay separate with two and three dice |
| F13 | Unexplained yellow line between dice | v2: removed. Matching dice glow and a "DOUBLES x2" or "TRIPLES x3" tag bursts between them | done |
| F14 | Unexplained random 2x | Same fix as F13: the burst names the match before the multiplied floats rise | done; v2.1 fixed a mislabel where two matching dice said TRIPLES. Now any pair is DOUBLES x2 and three of a kind is TRIPLES x3 |
| F15 | Light/dark button opens settings instead | v2: the sun/moon icon is a real toggle; settings has its own gear icon | done; v2.1 fixed a dark flash on launch in light mode |
| F16 | Unclear what the yellow side of the die means | v2: the landed face is shown by position and a flash; color now means face type only (normal, x2, jackpot) | done; v2.1 added an outline so x2 and jackpot marks show on every skin. v2.2: bands replace the wedge, tick and pip at every side count; the 100-side jackpot face is a gold notch; still open whether it needs a pulse |
| F17 | Hot Hand's benefit isn't communicated | v2: the chip reads "HOT HAND x3" with its duration, shows a countdown while active, and adds a x3 badge above the dice | done; v2.1: ready and active read HOT HAND x3 with the time; cooldown reads HOT HAND with a refresh symbol and is dimmed |
| F18 | "It will eventually need to be made into some sort of game engine" | Claude's view: not for the prototype; a canvas web build wrapped with Capacitor can do this. The engine choice for production stays **open** and is evaluated in `PRODUCTION_HANDOFF.md` | open |

---

## 2026-09-17: publishing

> "also ensure this will be testable on my github, while emailing me the link to try it, just like the other games."

Decision: public repo `chipdouglas2819/one-more-side` with GitHub Pages; link emailed to Nate. Status: done (v1 at https://chipdouglas2819.github.io/one-more-side/).

---

## 2026-09-17: choosing this game first

> "i do really like the slot/dice idea. likely only on android as idt i could actually make alot of money off these, if they do well i can think iphone."

Decision: dice first, Android first, iPhone only after traction; slot as a later reskin. Status: done.

---

## 2026-09-16: the original idea

> "1 is essentially a dice rolling app, where you start off with 1 sided dice, tap to roll, then buy another side of the dice, you can keep upgrading the dice to have higher possible rewards to upgrade it further, maybe at one point automating the dice, and being able to buy another dice. The other game idea would function essentially the same but your upgrading a slot machine as you continue to spin it."

Decision: built as ONE MORE SIDE v1: one-sided start, buy sides, auto-roller, more dice. Status: done.
