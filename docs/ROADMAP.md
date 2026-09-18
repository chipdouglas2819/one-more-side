# Roadmap

Last updated: 2026-09-18

## Done

- **v1 (2026-09-17):** one-sided start, buy sides, shape morph, auto-roller, up to 3 dice, match bonus, 3 Recasts, offline earnings, placeholder ads. Published at https://chipdouglas2819.github.io/one-more-side/
- **v2 (published 2026-09-18):** all of Nate's first-playtest feedback: faces 1 to N, x2 and jackpot sides, dice to 100 sides, per-die payouts, named DOUBLES and TRIPLES, a working theme toggle, clearer Hot Hand, a minimal skins grid with a set bonus, a visual pass, v1 save migration. About 130 minutes of content.

- **v2.1 (published 2026-09-18):** hold-to-buy with a speed ramp; purchases during a hold play as one smooth swell with no freeze or shake; a Recast screen of numbers and icons only. Also fixed from re-checking v2: two matching dice were labelled TRIPLES; an economy dead end at 100/100/5 sides; a rarer one at 8/8/8 (the x2 side now unlocks at 9 sides); a light-mode launch flash; faint x2 and jackpot marks on dark skins; Hot Hand's cooldown looking active.

## Now

- Nate plays v2.1 on their phone.
- Write `PRODUCTION_HANDOFF.md` from the final v2.1 code.

## Open questions only Nate can settle by playing

- Does the fast-roll presentation feel like "a full dice spin" at roller level 3 and up? (Feedback F7)
- Do 30-, 60- and 100-sided dice look good on their actual phone? (F8)
- Is the stretch between 5 sides and the auto-roller too grindy? (Flagged by two v1 testers)
- During a long hold on a die with 40 or more sides, the number window counts up the new top face instead of showing rolls. Keep it or change it?
- On a 100-sided die the jackpot face is a thin sliver. Should it get a minimum width or a pulse the first time it lands?
- Does the hold ramp (first repeat at 0.35 s, up to 15 buys a second) feel right under a thumb?

## Next: Android

Order of work. Most of these are one-time costs shared with every future app on the account.

1. **Wrap with Capacitor**, using InfuseCalc's Android project (`Downloads\InfuseCalc Project\infusecalc`) as the template.
2. **Real rewarded ads:** swap the placeholder `Ads` adapter for AdMob rewarded ads (Hot Hand, offline double). Keep the rules: grant the reward even if the ad fails, never block progress behind an ad, no forced ads in a first session.
3. **Saves on device:** the code already writes to Capacitor Preferences as well as the browser store; verify on a real device.
4. **Play Console (Nate's existing personal developer account; details in the local Project Hub):**
   - create the app;
   - register it for Android developer verification (Google's notice gave a September 30, 2026 deadline; check whether it still applies);
   - content rating questionnaire: answer honestly; the dice version has no simulated gambling;
   - target audience 13+, not Families;
   - Data safety form: the ad SDK collects data, so disclose it; privacy policy page required;
   - store listing: put the key phrase in the title (search-store keyword strategy).
5. **Closed test:** a personal account created after November 13, 2023 needs 12 testers opted in for 14 consecutive days before production access. One-time gate for the account.
6. **Production release** and measurement: day-1 and day-7 retention, rewarded-ad views per user, ad revenue per thousand views.

## Later: the long-term content gap (biggest prototype-to-product gap)

Nate expects people to play "a year or two". The prototype has about two hours, then an empty shop. A real build needs a long-tail progression design before launch or soon after. Candidates, none decided:
- **Face editing as the second act:** after 100 sides, upgrade what's on individual faces. Proven fun in PC dice-builders and absent from mobile idle games. The rejected "carved faces" from the design panel are the starting point.
- **More dice beyond 3:** the grid plan in `../SPEC.md` (2x2, then 3x3 with shrinking dice, then a hard cap), plus presentation that stays satisfying with many dice (merged payouts, a single hero die, summaries).
- **Deeper prestige:** more Recast layers, or an uncapped prestige with diminishing returns, instead of the prototype's 3-run cap.
- **More skin categories:** roll trails, landing effects, sound packs, table surfaces; each category with its own completion bonus.
- **Timed goals or light events,** only if they fit the "no menu fiesta" rule.

## Later: variants (separate listings, same engine)

- **Wheel:** Nate's idea. An N-wedge wheel is the same shape seen from above.
- **Slot:** reels as dice with symbol faces and a payline check.
- Both are social casino by Google's definition: Teen rating, a disclaimer (no real money, no prizes of real value), no real casino branding, no cash-out or sweepstakes features, possibly weaker ad payouts. Ship after the dice version and compare ad payouts before investing further.

## Known limits of the prototype

Full lists are in `research/verification-history-v1.md`, `research/verification-history-v2.md` and `../SPEC.md` Appendix A.
- Fast-roll mode shows the landed number in brief flashes rather than a full spin.
- Never tested on a real low-end Android phone with three 100-sided dice at top roller speed.
- A player who never uses Recast progresses very slowly late in the game.
- Content ends at about 130 minutes.
