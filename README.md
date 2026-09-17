# ONE MORE SIDE

A die that starts with one side. Every coin buys it another side, and the shape
itself is the progress bar.

Four files, no build step, no internet:

| File | What it is |
|---|---|
| `index.html` | The whole game. Open it and it runs. |
| `SPEC.md` | The design spec this was built from, word for word. |
| `sim.js` | A number-cruncher that plays the game thousands of times without drawing anything, to check the pacing. |
| `check.js` | A spell-checker for the code. Catches typos before you waste a phone test. |

---

## Play-testing it

### On your computer

Double-click `index.html`. It opens in your browser. Make the window narrow and
tall (like a phone) to see what players will see.

### On your phone — the test that actually matters

The game is one file, so the easiest route is a tiny local web server:

1. Open a terminal in this folder.
2. Run: `npx --yes http-server . -p 8477`
3. It prints a few addresses. Pick the one that starts `http://192.168.` — that
   is this computer's address on your home wifi.
4. On your phone, on the same wifi, open that address and add `/index.html`.

Add it to your home screen and it opens full-screen, like an app.

**The one thing to judge first:** buy the first three or four sides and watch the
shape change — circle to lens to triangle to square. The spec says if that
transition is not satisfying on a real phone, stop and rethink before anything
else. Everything else in the game is in service of that moment.

### Hidden developer tools

Add `?dev=1` to the address (`.../index.html?dev=1`) and a small purple row of
buttons appears at the bottom left: give yourself coins, simulate two hours
away, force the ad to fail, wipe the save. **Players never see these** — they
only exist when `?dev=1` is in the address. Never put that in a link you share.

### Wiping your save

Gear icon (top right) → hold the red button for two seconds. Or use the `WIPE`
dev button.

---

## Running the two checks

You need Node.js installed (nodejs.org, the "LTS" button). Then open a terminal
in this folder.

### `node check.js`

Reads the code inside `index.html` and makes sure it has no typos, that it runs
on its own, and that the number ladders still match the spec. Takes a second.
It ends in either `PASSED` or `FAILED` with a list.

Run this after **any** edit to `index.html`. It catches the class of mistake
that otherwise shows up as a blank white screen on your phone.

### `node sim.js`

Plays the game six different ways at high speed and prints how many minutes
each one takes to reach the milestones in the spec:

- **reference** — the spec's own yardstick player: taps about 1.7 times a
  second and always buys the cheapest thing that increases income. This is the
  one that PASSES or FAILS; the rest are shown for shape.
- **active** — a keen player tapping 3 times a second and buying the best value.
- **casual** — someone who plays for one minute every ten minutes.
- **idle** — someone who taps until the auto-roller is bought and then never
  taps again.
- **never-prestige** — buys like the reference player but never presses RECAST.
  This is the commonest real behaviour there is: resetting feels like losing.
- **rush-die** — buys the bare minimum to open `+ DIE` and banks everything else
  for it, which is the trap the roller precondition exists to narrow.

Current result: the reference player passes all six milestones.

| Milestone | Spec target | Reference | Active | Casual | Idle | Never-prestige | Rush-die |
|---|---|---|---|---|---|---|---|
| First extra side | 0.2 min | 0.10 | 0.05 | 0.10 | 0.10 | 0.10 | 0.10 |
| Six sides | 1.5 min | 1.62 | 0.92 | 10.62 | 1.62 | 1.62 | 1.62 |
| Auto-roller bought | 4 min | 3.89 | 1.72 | 30.90 | 3.89 | 3.89 | 13.54 |
| Second die | 9 min | 11.73 | 9.76 | 60.00 | 16.67 | 11.73 | 16.54 |
| First Recast | 30 min | 26.38 | 20.38 | 100.00 | 36.77 | never | 31.19 |
| End of content | 105 min | 101.89 | 91.49 | 280.98 | 123.29 | never | 106.70 |

The casual column is *supposed* to be slow — that player is only at the game
10% of the time. It is printed so you can see that a ten-minutes-a-day player
still finishes in a few weeks rather than never. Anything outside the ±35% band
now prints `WARN` rather than `PASS`; it used to quietly call an early finish a
pass, which is how the active tapper finishing in 0.59× the target went
unnoticed.

Below the table `sim.js` prints six hard invariants — all six currently pass —
and then re-checks the two pacing bounds on **every** always-open policy, not
just the reference player. That second block is not decoration: the 45-minute
"there is always something to work toward" rule was being checked only on a bot
that Recasts, and a player who declines the Recast was sitting at 52 minutes.

`node sim.js --verbose` adds a line for every single side purchased, with the
price and how long the player waited for it. That is the best view of pacing.

### Trying a different number without touching the game

```
node sim.js --set SIDE_GROWTH=2.05
```

This runs the whole simulation as if side prices climbed more slowly, and
prints the milestones. Nothing is saved — it is a what-if. Once you like a
number, change it in `index.html` in the block described below.

---

## How the code is arranged

`index.html` has exactly two pieces of code in it.

### 1. The economy block

Search `index.html` for `<script id="economy">`. Everything between there and
the next `</script>` is pure arithmetic: prices, payouts, what a Recast does.
It draws nothing and touches no buttons.

`sim.js` reads *this exact block* out of the file. That is the point: the
simulator and the game cannot disagree about a price, because there is only one
copy of every number.

All the constants sit together at the top of that block in a list called `K`.
If you want the game slower or faster, that list is where you go — and then run
`node sim.js` to see what it did to the pacing.

### 2. The game block

Search for `<script id="game">`. Drawing, tapping, sound, saving, ads. It asks
the economy block for every number it displays and never invents one.

---

## Where the ad hooks are

Search `index.html` for `var Ads = {`.

Right now `Ads.showRewarded()` is a **placeholder**: it shows a labelled dark
overlay with a one-second progress bar that says "DEV PLACEHOLDER — NO REAL AD
NETWORK". No ad network is contacted, nothing is downloaded.

To wire up a real network later (AdMob, after Capacitor wrapping), replace the
body of `showRewarded` so it calls the real SDK and returns a promise that
resolves when the player earns the reward. **Change nothing else.** Everything
around it already handles the hard part:

- `runRewarded()` writes a "you are owed this" note into the save file
  **before** the ad is asked for.
- The ad gets six seconds. Then the reward is granted — whether the ad played,
  failed, timed out, or there was nothing to show.
- If the phone kills the app mid-ad, `resumePendingReward()` finds that note on
  the next launch and pays out.
- `grantReward()` is keyed to a transaction id, so a reward can never be paid
  twice.

Net effect: a broken ad never costs the player anything and they never notice.

There are exactly two places an ad can appear, and neither can happen in a
first session:

1. **Offline double** — on the welcome-back card, after being away 30+ minutes.
2. **Hot hand** — the small chip under `MAX ROLL`; triple payouts for two
   minutes, 20 minute cooldown, and the player has to press it.

No banners, no interstitials, no purchases.

---

## Where the slot reskin seam is

The spec wants the *option* of a slot-machine version later, without rewriting
the game. Search `index.html` for `var THEME = {`.

Everything the player sees or hears goes through that one object: the wording on
every button, the colours, the numerals on the faces, and `drawUnit`, which is
the function that paints a die. The economy block underneath never contains the
words "dice", "side" or "face" in anything the player reads — it deals in
"units" and "faces by index".

So a slot version would be: a second `THEME` whose `drawUnit` slides reels down
instead of spinning a polygon, whose wording says `+ SYMBOL` instead of
`+ SIDE`. Every price, payout and unlock carries over untouched. The match
bonus is already written as a check over the list of what landed — which is
exactly what a payline is.

**Do not build it yet.** The spec is blunt about this: ship the dice version,
measure a month of real ad revenue, and only then decide. A slot build also has
to be a separate Play listing with a simulated-gambling declaration.

---

## Things worth knowing before you ship

- **Saving.** The game saves under the key `oms.save.v1`, at most every five
  seconds and whenever you switch away. Once it is wrapped with Capacitor it
  reads **Capacitor Preferences first** and treats browser storage as a mirror —
  Android's "clear storage" and some phone cleaners wipe a WebView's browser
  storage, and reading only that would throw away a player's whole run. An
  existing browser save is copied into Preferences the first time the wrapper
  sees it. If storage refuses entirely (private mode), the game keeps playing
  from memory instead of breaking. Anything loaded is range-checked before it is
  used, so a hand-edited or half-written save cannot lock the game up.
- **The faces are not 1..N, and that is the whole design.** Face `n` is worth
  `ceil(1.55^(n-1))` — 1, 2, 3, 4, 6, 9, 14, 22, 34, 52 … — so a five-sided die
  reads 1 2 3 4 6 and a six-sided one reads 1 2 3 4 6 9. There is no 5 and there
  never will be. `MAX ROLL` shows the best single throw those faces can produce,
  which is why it reads 6 at five sides and 9 at six. If it counted sides instead
  it would be a side counter, and a new side would stop feeling like a raise.
  A tester will read this as a bug on first sight; the exponential values are
  what make each side worth buying, so watch for it in feedback but do not
  "fix" it.
- **Taps are limited to ten a second.** A hundred-millisecond cooldown per tap is
  deliberate (it is in the spec) and sits above any human mash rate. Scripted
  click bursts will look like they are being swallowed. Real thumbs are not.
- **Being away.** Close the game and the auto-roller keeps earning at half rate,
  up to four hours. Watch the optional ad and that claim becomes full rate for
  up to eight hours. Under a minute away is paid straight into your balance with
  no card, because the game genuinely stops earning while it is in the
  background. **An uncollected claim is written into the save**, so backgrounding
  the welcome-back card, or the phone killing the app while it is open, cannot
  lose it — and a second short absence adds to the claim instead of replacing it.
- **Erasing the save is press-and-hold and cannot double-fire.** Two fingers on
  the red button used to start two timers; the one that was orphaned went on
  wiping the save every tenth of a second, with the settings panel already closed
  and no way to stop it short of killing the page.
- **Sound.** Four beeps generated by the browser itself. No audio files. Phones
  refuse to make noise until the first tap, which the game handles.
- **Nothing is downloaded.** No fonts, no libraries, no analytics, no network
  calls at all. `check.js` fails the build if a web address ever appears in the
  file.
- **Store policy.** One currency, earned only by rolling, never purchasable.
  Every price fixed and shown. No crates or mystery purchases. Declare a 13+
  audience and do not opt into Designed for Families. This is what keeps the
  dice version clear of Google's gambling and loot-box rules.

---

## Where this build knowingly departs from the spec

Eight places. Each was a simulator or phone finding, not a preference. `SPEC.md`
has since been amended to match the shipped numbers, so this list is the history
of *why* — read it before you change any of them back.

1. **Side prices climb 2.2× per side instead of 1.95×.** At the spec's number
   the reference player burned through all three runs in 49 minutes against the
   150 minute target of the time, and every other milestone landed 20–40% early.
   Side price growth is the lever the spec names for this; face values are
   untouched. (The target itself has since moved — see item 8.)
2. **A Recast now needs 250,000 × your current multiplier, not a flat 250,000.**
   Coins earned include your multiplier, so with the flat number a big
   multiplier handed you another full shard payout for no new progress — the
   simulator found it could Recast 317 times in ten hours. Scaling the bar keeps
   the spec's "ten times the wait pays 2.8× the shards" honest.
3. **The match bonus ignores dice with fewer than six sides, and two matching
   dice out of three pay ×2.** Under the spec's rule two one-sided dice matched
   on *every* throw, so growing a die *lowered* your income — the exact trap the
   spec's first invariant forbids. Both tweaks exist to keep income rising after
   every purchase, and on any path a player actually walks it now does. One
   residue is unavoidable and is measured rather than hidden: with three dice,
   growing the smaller of two dice that are level thins the match it was part of.
   The floor was four; walking the shapes a player can genuinely reach showed
   that was too generous. From `20/4/4` — which you reach by buying the third die
   while the second is still small — income stayed **below where it started for
   nine consecutive purchases**, bottoming out 8.9% down. That is the one button
   in the shop making the coin counter run backwards for minutes at a time. At
   six sides the worst single purchase is 1.8% and the worst run is 3.0% over
   five purchases, and `sim.js` now asserts both, over the reachable shapes
   rather than over every arithmetically possible one.
4. **The landed face is read at the bottom, not at a 12 o'clock notch.** With an
   odd number of sides, putting an edge at the top puts a corner at the bottom,
   and the die looks like it is balancing on a point. Reading the resting edge
   keeps it sitting flat on the ground line at every side count, and matches the
   "tumbles onto its flat" language in the spec's opening two minutes.
5. **Numerals switch to tick marks whenever they stop fitting, not strictly at
   14 sides.** With three dice on screen each one is 58% size, and a twelve-sided
   die at that scale was an unreadable pile of digits.
6. **The roller has twelve levels climbing ×3.0, not nine climbing ×3.2, and
   Recast is capped at three runs.** With the roller topping out early, the last
   four sides of die 3 were the only purchase left in the game and the simulated
   player sat 6, 9 and 14 minutes in a row with the whole shop greyed out. Eleven
   levels fixed that for the reference player but left a player who never presses
   RECAST with a **52-minute** stretch at the four-and-a-half hour mark with
   nothing affordable at all, then an empty shop for good. The twelfth level
   takes that to 39 minutes. Be careful here: thirteen and fourteen levels make
   it dramatically *worse* (106 and 237 minutes), because once the sides are
   maxed the only thing left in the shop is a roller level costing hundreds of
   millions. Twelve is a measured optimum, not a guess. The Recast cap is what
   makes "content ends after run 3" true in the code: without it, recasting the
   moment the button lights up pays a flat 12 shards forever and the multiplier
   has no ceiling at all.
7. **`+ DIE` needs three roller levels, not one.** The spec claimed the roller
   precondition closed the save-for-the-die trap. It did not — buying the
   minimum ten sides, then a single roller level purely to satisfy the gate, then
   banking, still reached the auto-roller at 13.5 minutes against a 4-minute
   target. Three levels cost 7,800 coins against the die's 5,000, so a normal
   player never notices (the reference bot owns them by minute 11) and skipping
   the roller stops being a shortcut. It still does not *close* the trap, and
   nothing can: a player is free to hoard from minute zero. `sim.js` runs a
   `rush-die` policy so the size of the hole is measured every run rather than
   asserted in prose.
8. **End of content is 105 minutes, not 150.** Not a tuning choice — a
   measurement. A grid over the four constants the spec nominates (120
   combinations) found exactly three that keep every milestone in band, hold the
   ten-minute time-per-side ceiling, and keep a never-prestige player inside the
   45-minute rule. The longest run any of them produced was 107 minutes.
   Stretching prices to 2.3× does reach 145 minutes, but the worst gap between
   purchases goes to 18 minutes. **This is the commercial fact worth staring at:
   a committed player finishes everything in an evening and a half, and after
   that there is nothing to press and nothing for the offline card to fund.**
   Making it longer means more content, not different numbers.

Three spec invariants are also *measured* differently, because as literally
worded they cannot be satisfied by the design they describe:

- "Income never decreases after any purchase, including a Recast" — a Recast
  resets your dice on purpose, so income must drop. What the simulator asserts
  instead is that no ordinary purchase ever lowers income (it never does), and
  that the climb back after a Recast is far shorter than the climb out was
  (2.5–4.6 minutes against 26–45).
- "+SIDE is never dominated by ROLLER" — the *first* roller purchase is meant to
  beat buying a side; doubling your throw rate for 600 coins is the whole point
  of the unlock. The simulator measures the share of playtime +SIDE spends as
  the worse button instead, and holds it under 10%. It currently sits at 7.0%.
- "Time per side stays within 6 seconds and 10 minutes" — the **six-second floor
  is scoped to die 1 of run 1 on purpose.** Buying a newborn die four sides in a
  couple of seconds on late-game income is the *point* of a Recast. The simulator
  reports sub-second gaps there because it does not model the game's own 700 ms
  lockout after each `+ SIDE`, which is what stops purchases queueing on a real
  phone. The **ten-minute ceiling** is the reference player's; other always-open
  styles earn less per throw and are held to thirteen minutes, and a player who
  declines the Recast has given up the multiplier, so only the 45-minute rule
  binds them.

---

## Known rough edges

- Nothing is wrapped for Android yet. This is a web page, on purpose — the spec
  says prove it is fun in a phone browser first.
- Content genuinely ends after the third Recast. The spec chose to say that
  plainly rather than fake more depth. Three dice at twenty sides, and that is
  the game.
- The Hot Hand chip only appears once you have finished a Recast or come back
  after half an hour away, so you will not see it in your first sitting.
