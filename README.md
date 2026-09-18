# ONE MORE SIDE — prototype v2

A one-thumb idle game for Android. You start with a die that has **one side**.
Every coin buys it another side. A six-sided die reads **1 2 3 4 5 6**, exactly
like a real one. Once the die is big enough you stop buying sides and start
buying *what the faces do*: a face that pays double, then a face that pays a
jackpot.

There are four files and no build step.

| File | What it is |
|---|---|
| `index.html` | **The whole game.** Open it and it runs. No installer, no server, no internet. |
| `SPEC.md` | The design document the game was built from, plus an appendix listing everything the build had to change and why. |
| `sim.js` | A robot that plays the game 600 minutes at a time, nine different ways, and reports whether the pacing is right. |
| `check.js` | A spell-checker for the game. Catches broken code and wrong numbers before you ever open the page. |

---

## Play it right now

**On this computer:** double-click `index.html`.

**On your phone:** this is the one that matters — the game is designed for a
thumb, not a mouse. Put `index.html` in your GitHub Pages repo, push, and open
the link on your phone. (That is the same "public repo + Pages from main root"
convention you use for the other games.)

**Add `?dev=1` to the address** to get a row of cheat buttons at the bottom:
`+1K`, `+1M`, `+1B`, `+10 MIN` of income, `+20 SIDES`, `OFFLINE 2H`, `SEED V1`
(writes a fake old save and reloads, so the v1 migration can actually be tested
on a phone that never had one), `AD FAIL` (makes the next fake ad fail, so you
can check the reward still arrives), and `WIPE`. Those buttons do not exist
without `?dev=1`, so players can never reach them.

---

## What the player does

1. **Tap the die.** It spins and lands on a face. That face's number floats up
   *from that die* and goes into your coins.
2. **Buy the card at the bottom.** `+ SIDE` is always the first one. The shape
   visibly grows an edge — one side becomes a lens, then a triangle, then a
   square.
3. Around eight sides, **`×2 SIDE`** appears. It permanently doubles your highest
   face. That face turns blue and wears a small `×2` tag. Buy it twelve times and
   the twelve highest faces are all doubled.
4. Around twelve sides, **`JACKPOT SIDE`** appears. It turns the die's `1` — the
   worst face — into a gold star that pays a big multiple of the die's average.
   There is only ever **one** jackpot face per die. Buying it again makes it pay
   more, never adds a second one.
5. **`ROLLER`** rolls for you, forever, faster at each level.
6. **`+ DIE`** gives you a second and then a third die. When two dice land on the
   same number, both glow, a `DOUBLES ×2` tag pops between them, and both payouts
   are multiplied. A die that has landed its own jackpot face sits the match out
   — the jackpot pays the jackpot, it does not also pay doubles — so the tag and
   the glow only ever appear over coins that were actually multiplied.
7. **`RECAST`** is the reset-for-profit button. Everything goes back to one side
   and you keep a permanent multiplier. It works **three times**, and then the
   game says so instead of pretending there is a fourth. Every run is worth the
   same **16 shards**, printed on the card, so the moment it lights is the moment
   to press it. There is nothing to gain by waiting and nothing to work out.

Nothing in the game explains any of this in words. It is all shown.

---

## Everything on screen

- **Top-left:** sun/moon. A real light/dark switch that remembers your choice.
  Next to it, once you can afford your first skin, a **palette icon** opens
  SKINS.
- **Top-right:** speaker (mute) and gear (settings — mute, theme, version, and a
  hold-for-two-seconds erase).
- **Under the coins:** `MAX ROLL` — the biggest single payout your dice could
  possibly produce right now, *including* your shard multiplier, your skin set
  bonuses and Hot Hand. It is the same number the floats are paid in, so the two
  can never disagree.
- **The marker** is the little triangle above each die. **Whatever is under the
  marker is what you rolled.** That is the only thing that means "this face
  landed". Colour on a face never means "landed" — it means what *kind* of face
  it is: plain, blue `×2`, or gold ★ jackpot.
- **SKINS** is one screen with two rows of three. Three dice, three backgrounds.
  Buy them, wear whichever you like. **Own all three in a row and you get a
  permanent +10% income**, and the row says so. Skins survive a Recast.

---

## The two commands

Open a terminal in this folder. You need Node installed; nothing else.

```
node check.js
```
Fast. Compiles the game's code without opening a browser and checks about sixty
facts about it: that a six-sided die really does read 1 to 6, that the jackpot is
exactly one face, that the price ladders match the spec, that light mode is a
real design and not a filter, that the shapes don't tear during the grow
animation, and that the page has no internet links in it.

```
node sim.js
```
Slower — about a minute. Plays the whole game nine ways and prints a table:

- **reference** — the yardstick. 1.7 taps a second, buys the cheapest thing that
  makes more money. The pacing targets are judged on this one.
- **active** — a fast tapper who optimises.
- **optimiser** — the same 1.7 taps a second as the reference bot, but buys by
  return instead of by price. It finishes at 86 minutes against the reference
  bot's 130, which is why the game's length is quoted as a **range**, not a
  number: both are honest ways to play.
- **hoard-2x** — buys exactly what the optimiser buys but waits for twice the
  RECAST threshold before pressing it. It exists to prove that waiting can no
  longer win: same shards, same multiplier, 14 minutes slower.
- **casual** — one minute of play every ten minutes.
- **idle** — taps until the roller is bought, then never taps again.
- **never-prestige** — refuses to press RECAST, which is what most real players
  do.
- **jack-first** — buys only the sides the jackpot gate demands and banks the
  rest, so the game's headline moment cannot be rushed without anyone noticing.
- **rush-die** — beelines for the second die.

Only **reference** is a gate; the rest are printed for shape, so a `WARN` on one
of them is information, not a failure. When a bot stops buying because the only
card left would lower its income, the table says so on a `stalled:` line instead
of leaving an unexplained gap.

Then it checks six hard rules, the important ones being **no purchase ever makes
you poorer** and **you are never stuck for more than four minutes with nothing to
buy** — the second one up to the point where a player is offered RECAST and turns
it down, after which their gaps are printed as *off-curve* rather than counted
against the game. Both commands print `PASSED` / `GATE: PASS` at the end, or tell
you exactly what broke.

If you change a number in the game, run both. That is the whole test process.

---

## If you want to change a number

Everything the economy does lives in one place: the block near the top of
`index.html` that starts

```html
<script id="economy">
```

`sim.js` reads that exact block out of the page, so the robot and the real game
can never disagree. Every number has a comment saying what it is and, where it
was changed, what measurement forced the change.

You can try a number **without editing anything**:

```
node sim.js --set SIDE_GROWTH=1.15
node sim.js --set TIER3_MULT=10 --set ROLLER_GROWTH=2.8
```

If the result looks better, change it in `index.html` and run `node check.js`
(which may tell you a printed price ladder now needs updating too).

---

## Current state

Everything in the spec is built, and both commands pass:

- 11 of 11 pacing milestones inside ±35%, from the first side at 8 seconds to the
  shop emptying at 133 minutes.
- 6 of 6 hard rules pass, on all seven ways of playing.
- No dead zone over four minutes for anybody, including the player who never
  prestiges.

**The prototype is about two hours long and then it is over.** That is stated in
the spec on purpose. Making it longer means adding content, not fiddling with
prices — the appendix in `SPEC.md` explains why fiddling was tried and where it
failed.

### Saves

Saves are kept in the browser under `oms.save.v2`, with a durable copy in
Capacitor Preferences if the game is ever wrapped for the Play Store. **A v1 save
still loads**: your dice keep their side counts, and your coins, roller level,
shards and Recasts carry over. Face values were rebuilt from scratch in v2 (that
was the whole point), so the game tells you in one line when it migrates one. A
save that is neither v1 nor v2 starts a clean game rather than crashing.

If a save exists but **cannot be read** — a half-finished write, an app killed
mid-save — the game falls back to the v1 key, copies the unreadable text to
`oms.save.broken` so the next autosave cannot destroy it, and says in one line
that your run was set aside rather than silently lost.

### Ads

There are none. There is a clearly labelled **DEV PLACEHOLDER** rectangle that
stands in for one, at exactly two spots — doubling your offline earnings, and the
Hot Hand boost — and neither can appear in a first session. The reward is written
to your save *before* the fake ad runs, so a failed, cancelled or timed-out ad
still pays. That is the piece that is easy to get wrong for real money later, so
it is built correctly now.

### What is deliberately not here

No accounts, no cloud save, no leaderboards, no daily rewards, no second
currency, no loot boxes, and nothing random that you can buy. Every price in the
game is a fixed number you can see before you spend.

---

## Where this goes next

The spec's section 8 keeps a seam open: everything drawn goes through one
`THEME` object, and the polygon is the same object a spinning wheel or a slot
reel would be. Nothing in the economy would change. If that ever gets built it is
a **separate** Play listing, never a mode hidden inside this one.
