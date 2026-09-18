# Feedback log

Every piece of Nate's feedback on this game, verbatim, newest first. Each entry lists the decision taken and its status. Status values: **done** (in the current build), **in progress**, **planned** (in `ROADMAP.md`), **open** (no decision yet), **declined** (with reason).

---

## 2026-09-17: documentation

> "also ensure all thoughts, ideas and direction are getting documented if we need to move from this prototype to actual build"

| Decision | Status |
|---|---|
| This `docs/` folder: vision, feedback log, decisions, roadmap, research archive, production handoff | done, except `PRODUCTION_HANDOFF.md`: in progress, written after v2.1 lands |
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
| F7 | Capture a full dice spin at any speed | v2: tumble animation with easing. In fast-roll mode (above 8 rolls a second) the landed number shows in about 60 ms flashes. Nate's bar is not yet met at high speed | **open**: needs a production solution |
| F8 | Render dice with up to 100 sides | v2: numbered faces to about 20 sides, then a dial with the landed number in a window, up to 100. Checked in a browser, not yet on Nate's phone | done; needs phone check |
| F9 | Faces must read 1 to 6, not coin values | v2: faces read 1 to N | done |
| F10 | Buy a multiplied side or jackpot side for each die | v2: x2 side (doubles the highest faces one at a time, up to 12, later x3) and one jackpot side per die (the 1 face turns gold with a star and pays big; its tier rises with purchases) | done |
| F11 | Many dice on screen late in a long game ("after someone plays a year or two") | v2 caps at 3 dice and about 130 minutes of content. The layout plan for more dice is in `SPEC.md`. **Nate expects years of play; the prototype has two hours.** This is the largest gap between prototype and product | **open**: see `ROADMAP.md`, long-term progression |
| F12 | Money should appear above the die it came from | v2: per-die payout floats | done; v2.1 re-checked: floats stay separate with two and three dice |
| F13 | Unexplained yellow line between dice | v2: removed. Matching dice glow and a "DOUBLES x2" or "TRIPLES x3" tag bursts between them | done |
| F14 | Unexplained random 2x | Same fix as F13: the burst names the match before the multiplied floats rise | done; v2.1 fixed a mislabel where two matching dice said TRIPLES. Now any pair is DOUBLES x2 and three of a kind is TRIPLES x3 |
| F15 | Light/dark button opens settings instead | v2: the sun/moon icon is a real toggle; settings has its own gear icon | done; v2.1 fixed a dark flash on launch in light mode |
| F16 | Unclear what the yellow side of the die means | v2: the landed face is shown by position and a flash; color now means face type only (normal, x2, jackpot) | done; v2.1 added an outline so x2 and jackpot marks show on every skin. On a 100-sided die the jackpot face is still a thin sliver: **open**, Nate's call whether to enlarge it |
| F17 | Hot Hand's benefit isn't communicated | v2: the chip reads "HOT HAND x3" with its duration, shows a countdown while active, and adds a x3 badge above the dice | done; v2.1: ready and active read HOT HAND x3 with the time; cooldown reads HOT HAND with a refresh symbol and is dimmed |
| F18 | "It will eventually need to be made into some sort of game engine" | Claude's view: not for the prototype; a canvas web build wrapped with Capacitor can do this. The engine choice for production stays **open** and is evaluated in `PRODUCTION_HANDOFF.md` | open |

---

## 2026-09-17: publishing

> "also ensure this will be testable on my github, while emailing me the link to try it, just like the other games."

Decision: public repo `chipdouglas2819/one-more-side` with GitHub Pages; link emailed as a reply in the "gamez" thread. Status: done (v1 at https://chipdouglas2819.github.io/one-more-side/).

---

## 2026-09-17: choosing this game first

> "i do really like the slot/dice idea. likely only on android as idt i could actually make alot of money off these, if they do well i can think iphone."

Decision: dice first, Android first, iPhone only after traction; slot as a later reskin. Status: done.

---

## 2026-09-16: the original idea

> "1 is essentially a dice rolling app, where you start off with 1 sided dice, tap to roll, then buy another side of the dice, you can keep upgrading the dice to have higher possible rewards to upgrade it further, maybe at one point automating the dice, and being able to buy another dice. The other game idea would function essentially the same but your upgrading a slot machine as you continue to spin it."

Decision: built as ONE MORE SIDE v1: one-sided start, buy sides, auto-roller, more dice. Status: done.
