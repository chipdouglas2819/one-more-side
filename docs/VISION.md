# ONE MORE SIDE: vision

Last updated: 2026-09-17

## The idea, in Nate's words (2026-09-16)

> "essentially a dice rolling app, where you start off with 1 sided dice, tap to roll, then buy another side of the dice, you can keep upgrading the dice to have higher possible rewards to upgrade it further, maybe at one point automating the dice, and being able to buy another dice. The other game idea would function essentially the same but your upgrading a slot machine as you continue to spin it."

## The hook

You start with a die that has exactly one side. Every coin buys it another side, and **the shape itself is the progress bar**: a circle becomes a lens, a triangle, a square, and onward to a 100-sided dial. No shipped dice game does this. The market leader, Idle Dice, keeps its dice at six sides and treats side count as a late unlock (see `research/competitor-scout-2026-09-17.md`).

## Who it's for

- Players who like the tension and payoff of rolling, spinning and hitting a jackpot, **without ever risking real money**. In Nate's words: "there is a good and healthy appeal to games that simulate gambling but dont cost actual money for people that are more conscious about it."
- Short check-ins on a phone, plus idle progress while away.
- Audience 13+. Art stays geometric and polished, never cartoon-cute, which keeps the game out of Google's child-focused Families rules.

## Nate's design rules (these override any designer's opinion)

1. **"Keep it simplistic, while maintaining maximum visual and UX aesthetics."**
2. **"Always show, don't tell."** If a mechanic needs a sentence to explain it, the visual is wrong. Unexplained things on screen, like a yellow line, a random "2x" or a gold face with no meaning, count as bugs.
3. **No "menu fiesta."** One main screen, one shop strip, one skins grid, one settings sheet. No sub-menus.
4. **Faces read 1 to N.** A six-sided die reads 1 2 3 4 5 6. Growth comes from buying what faces do (x2 sides, a jackpot side), more dice, speed and prestige, never from strange face numbers.
5. **Feedback lives where it happened.** Money appears above the die that earned it.
6. **Speed must never make it look worse.** A full, satisfying spin has to survive high roll speeds, 100-sided dice, many dice on screen, and rapid buying while holding a button.
7. **Collecting is part of the fun.** Buy and collect skins; completing a category gives a boost, but the player still chooses what the game looks like.
8. **Confirmations show numbers, not paragraphs.**

## What will decide success (Nate's read, 2026-09-17)

> "I like it, I like the simplistic design and easy to understand game. I see the difficulties would be that it would need to heavily rely on esthetics/graphics and presentation to do well."

Presentation quality is the product. Mechanics are simple on purpose; the feel of the tap, the spin, the landing, the growth of the shape and the look of the skins carry the game.

## Business frame

- Goal: modest supplemental income with near-zero upkeep and no paid marketing (the portfolio income plan lives in the local Project Hub, in its research folder, and is kept out of this public repo).
- Platform: **Android first** through Google Play. iPhone only if Android does well.
- Revenue: rewarded ads the player chooses to watch (Hot Hand, doubled offline earnings). No forced ads in a first session. Possible later: remove-ads or cosmetic purchases. Coins can never be cashed out or turned into anything of real value.
- Honest ceiling: the category leader reached roughly 500,000 installs over years; a dice idle with unremarkable presentation sits near 5,600. Presentation is the difference.

## Variants (same engine, later, separate store listings)

- **Spinning wheel:** a wheel with N wedges is the same N-sided shape seen from above. Nate's idea, 2026-09-17.
- **Slot machine:** a reel is a die with symbol faces; N reels rolled together with a payline check.
- Both count as "social casino" under Google's definitions: allowed, rated Teen, may earn lower ad rates, and must never use real casino branding or offer prizes of real value. The dice version is policy-clean. Details in `research/policy-scout-2026-09-17.md`.
