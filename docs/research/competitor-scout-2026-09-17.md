# Competitor teardown: dice idle and slot-building games

Research agent with web access, 2026-09-17. Every point cites a URL and a short quote. Not independently fact-checked beyond the agent's own fetches.

## Summary
The dice-idle niche is real but narrow, and its leader is beatable on exactly the axis the owner cares about. Idle Dice (Lutz Schoenfelder / Lutsgames) is the category king on Android — ~500k+ Play installs, ~4.7 stars, ~14k ratings — but its dice are fixed six-sided objects that gain LEVELS and MULTIPLIERS, not sides. Sides appear only as a late-game tier list of separate "multiplier dice" (D2, D4, D6...D100) that you unlock as new units after buying five regular dice. Idle Dice 2 went the opposite way from the owner's concept: 25 independently upgraded dice plus a deckbuilding card layer, and its top Steam complaints are UI bloat and "it stops being idle." Idle Dice 3D (Gilvius Games) is the only other dice idle with explicit multi-sided dice and it is tiny (~5.6k downloads, 4.40 from 71 ratings) — evidence the niche has one giant and a long tail of failures, not a crowded field. Face-level customization DOES exist, but only in premium run-based roguelike dicebuilders on PC/Steam (Die in the Dungeon, Dicey Stakes, Thrice-a-Dice, Dicer, Dice Hard) — never in a free idle game on Android. On the slot side, Luck be a Landlord is a $4.99 premium roguelike with 100k+ installs and 4.39 stars that deliberately has no microtransactions, while the free idle slot space is either dead (Idle Slots unpublished April 2024, 2.13 stars) or is casino-manager tycoon rather than machine-building. CRITICAL ANSWER TO THE OWNER'S QUESTION: no shipped game — mobile or web — starts the player at a 1-sided die and sells sides one at a time with the die's shape visibly evolving, and no free idle game lets the player customize individual faces. Both halves of the owner's hook are genuinely unclaimed. The nearest miss is Dunno Dice Incremental, an obscure browser game where a "Power" stat raises side count but then RESETS the die to a smaller size — the shape is a stat readout, not the toy.

## Implications for ONE MORE SIDE
- THE HOOK IS UNCLAIMED, AND IT IS THE EXACT ONE THE OWNER ALREADY WANTS. Nothing shipped starts at d1 and sells sides one at a time with the shape visibly changing. Idle Dice fixes dice at six sides and treats side count as a late unlock ladder of separate units; Idle Dice 2 scales the NUMBER of dice; Idle Dice 3D offers assorted side counts but as pre-made objects; Dunno Dice raises side count then resets it. Face-level customization exists only in premium PC roguelikes. The owner should not water this down or add unrelated systems — the differentiation is already sitting in the concept as stated.
- MAKE THE SHAPE THE PROGRESS BAR. In every competitor, progress is a number on a button. Here the die itself should be the readout: d1 (a blank marker), d2 (a coin that flips), d3, d4 (tetrahedron), d6 (cube), d8, d12, d20 — each purchase visibly re-forms the object with a satisfying transform animation. Budget real effort on the d1->d4 transitions specifically; that first five minutes is the entire store-listing pitch and the only thing a screenshot can convey without marketing spend.
- EARLY SIDES MUST BE CHEAP AND FAST, NOT EXPONENTIAL. A player buying side 2 and side 3 in the first ninety seconds is the whole retention hook. Space the first ~6 sides minutes apart, then let costs steepen. The Incrementing Dice failure (players could not tell what the central die did) is the warning: every added side must produce an immediate visible payoff — literally show the new face appearing in rolls and the max roll going up.
- COPY THE DRIP-FEED, REJECT THE BOLT-ONS. What players praise in Idle Dice 2 is staged reveals and playability without a wiki; what they hate is UI sprawl and a deckbuilder stapled on. One die on one screen is a structural advantage on a phone. Do not add cards, roulette, duels, or a second currency. The second die should arrive only after the first die is fully evolved, and should be a deliberate, earned moment.
- AUTOMATION MUST BE MONOTONIC. The loudest Idle Dice 2 complaint is that an 'idle' game stops being idle. Once auto-roll is bought it should never be taken away or gated behind re-tapping. Offline earnings must be computed with a closed-form formula on resume, never simulated — this also solves the 20%-per-hour battery complaint that dogs Idle Dice.
- REWARDED ADS: GRANT THE REWARD LOCALLY AND IDEMPOTENTLY. Idle Dice's iOS rating is 4.0 versus 4.7 on Android specifically because an ads update froze the game and withheld promised bonuses. Wrap every ad call in a timeout, grant the bonus on failure, and never block progression behind an ad. The competitive opening is a $0-IAP, ads-optional game standing against a leader with a $49.99 top SKU — that positioning is free marketing in the store description and in r/incremental_games, which is the only audience an owner with zero marketing budget can realistically reach.
- PRESTIGE SHOULD BE 'RECAST THE DIE', NOT A GLOBAL WIPE. Idle Dice 2's per-die ascension is the better model and it fits the fantasy: melt the die down, keep a permanent multiplier plus one retained face, start again at d1. This preserves the joy of re-watching the shape grow instead of punishing the player by deleting it, and it reuses the exact same UI.
- PHASE TWO IS FACES, NOT FEATURES. Once side count saturates (around d20-d100), the natural and still-unclaimed second act is editing what is ON each face — upgrading a face's value, or giving one face a multiplier or a re-roll. This is proven fun in premium PC dicebuilders and has never appeared in a free mobile idle. Build the die as an array of face objects from day one so this is a content patch, not a rewrite.
- KEEP THE SLOT SEAM CLEAN AND TREAT IT AS A RESKIN, NOT A SEQUEL. Model a die as {faces[], multiplier, autoRollRate} and a reel as one die with symbol faces; a slot machine is then N dice rolled together with a payline evaluator over the result array. The reel that starts with one symbol and gains symbols one at a time is the identical hook. The free idle-slot space is genuinely vacant — the closest title was delisted in 2024 at 2.13 stars, and Luck be a Landlord is premium and run-based, so it does not compete for this audience.
- AVOID SYMBOL/CONTENT BLOAT IN THE SLOT MODE. Luck be a Landlord's own top complaint is 152 symbols drowning strategy. Ship the reel with a handful of symbols and add them at the same deliberate pace as dice sides.
- BE HONEST ABOUT THE CEILING. Idle Dice 3D shows that shipping a dice idle with varied side counts earns ~5.6k downloads if the execution and first-impression are unremarkable. Roughly 500k-750k installs is the ceiling the leader reached over years. For a few-hundred-dollars-a-month target with zero marketing, the realistic plan is: nail the d1->d6 opening minutes, ship free with optional rewarded ads, post once to r/incremental_games and a web portal (CrazyGames/Coolmath, where Idle Dice itself was born as a browser game in 2018), and let the store listing's screenshots of an evolving die do the selling.

## Findings
- Idle Dice is the category leader on Android and the benchmark to beat: roughly 500k-750k downloads and a 4.76 rating from ~14k ratings, which is an unusually high score for a free idle game and means quality bar, not novelty, is the barrier to entry.  
  Source: https://www.appbrain.com/app/idle-dice/de.lutsgames.idle_dice  
  Quote: "rated 4.76 out of 5 stars, based on 14 thousand ratings"
- Idle Dice's core loop is roll -> earn -> buy upgrades and MORE dice, with scoring from poker-style combos across multiple dice. The satisfaction is combinatorial (matching numbers across a pool), not about any single die becoming a more interesting object. This is the loop the owner's concept diverges from.  
  Source: https://www.crazygames.com/game/idle-dice  
  Quote: "adding more dice increases your ability to earn big points through combo rolls"
- Crucially, in Idle Dice the player's regular dice are permanently six-sided and are upgraded by LEVEL and MULTIPLIER. Side count only appears later as a separate tier ladder of distinct 'multiplier dice' units you unlock after buying five regular dice — so sides are a unit tier, never a purchasable increment on your own die.  
  Source: https://idle-dice.fandom.com/wiki/Dice  
  Quote: "starting off at D2 and later on D4, 6, 8, 10, 12, 20 and finally 100"
- Idle Dice monetizes aggressively with a deep IAP ladder up to $49.99, a $9.99 remove-ads, a $29.99 'Epic Pack' and consumable currency bundles. This is the model a rewarded-ads-only entrant is explicitly NOT copying, and it is where the leader is most vulnerable to a 'no dark patterns' positioning.  
  Source: https://apps.apple.com/us/app/idle-dice-incremental-game/id1504039347  
  Quote: "Starter Pack ($9.99)... Epic Pack ($29.99)... 2600 Bonus Points ($49.99)"
- Idle Dice's iOS rating is only 4.0 versus 4.7 on Android, and the visible complaint is that a later update added ads that freeze the game after viewing and withhold the promised bonus. For an entrant whose entire revenue is rewarded ads, this is the single highest-value engineering lesson: the reward must be granted locally and idempotently even if the ad SDK fails.  
  Source: https://apps.apple.com/us/app/idle-dice-incremental-game/id1504039347  
  Quote: "ads have caused game freezes post-ad viewing, preventing players from receiving advertised bonuses"
- Battery drain is a recurring, specific Idle Dice complaint — around 20% per hour — because it runs continuous animated physics/rolling in the foreground. A single-HTML-file entrant wrapped in Capacitor must throttle animation when backgrounded and compute offline earnings mathematically rather than simulating rolls.  
  Source: https://appgrooves.com/app/idle-dice-incremental-game-by-lutz-schoenfelder  
  Quote: "destroys battery, losing around 20% in one hour"
- Idle Dice 2 is the sequel and it scaled the WRONG axis for the owner's concept: it multiplied the number of dice rather than deepening any one die. This is direct evidence that the 'one evolving die' design space was left on the table by the leader.  
  Source: https://store.steampowered.com/app/2238180/Idle_Dice_2/  
  Quote: "Up to 25 dice to upgrade independently"
- Idle Dice 2 bolted a trading-card deckbuilder onto the dice engine — exactly the 'unrelated systems' the owner wants to avoid. Its ascension/prestige is per-die at level 100, doubling that die's value and granting a random card, which keeps prestige tied to the object rather than to a global reset.  
  Source: https://www.cityparkgames.com/games/idle-dice-2  
  Quote: "Leveling up a die to level 100 earns it an Ascension, which doubles the point value"
- The loudest Idle Dice 2 complaint is UI bloat from all those parallel dice and cards — players have to hunt for the controls. A game with ONE die on screen is structurally immune to this, and that is a marketing-free advantage on a phone screen.  
  Source: https://steamcommunity.com/app/2238180/reviews/?browsefilter=toprated  
  Quote: "one of the worst user interfaces ever, seemingly designed to actively keep important parts hidden"
- The second-loudest Idle Dice 2 complaint is that the idle layer evaporates and the game becomes active grinding, despite the name. An entrant should keep automation monotonic — once a die auto-rolls it should never demand tapping again.  
  Source: https://steamcommunity.com/app/2238180/reviews/?browsefilter=toprated  
  Quote: "the idle mechanic disappears waaaay before all of this"
- What players PRAISE in Idle Dice 2 is drip-fed mechanics, layered progression, and legibility without a wiki. This is the copyable part: reveal one new system at a time and keep it understandable unaided.  
  Source: https://steamcommunity.com/app/2238180/reviews/?browsefilter=toprated  
  Quote: "it's not so complicated that you'll feel compelled to look up a guide"
- Idle Dice 2 also proves a pure no-store model earns goodwill rather than resentment, and its store page explicitly frames ads as optional and non-blocking. A rewarded-ads-only entrant can claim the same high ground honestly.  
  Source: https://store.steampowered.com/app/2238180/Idle_Dice_2/  
  Quote: "Watching ads is entirely optional and the game is balanced to play without"
- Idle Dice 3D is the closest existing thing to 'dice with varying side counts' as a headline feature — and it has essentially failed commercially, with ~5.6k downloads and only 71 ratings. Varying side counts alone is therefore NOT a hook; the evolution and the tactility are.  
  Source: https://www.appbrain.com/app/idle-dice-3d-incremental-game/com.GilviusGames.IdleDice3D  
  Quote: "downloaded 5.6 thousand times, with 150 downloads in the last 30 days"
- Incrementing Dice / the itch.io dice-incremental tail shows the failure mode of an obscure central-die mechanic: players could not tell what the big die did or why leveling it mattered. If the die's growth is the whole pitch, each added side must produce an immediate, visible, legible payoff.  
  Source: https://axolotism.itch.io/dice  
  Quote: "I couldn't quite grasp what the big die in the middle actually meant"
- Dunno Dice Incremental is the nearest published attempt at sides-as-progression, and it deliberately undoes the growth: the die's side count climbs then collapses back to a small die in exchange for a Magic point. The die is a number, not a growing object — which leaves the owner's 'visibly evolving shape' hook intact.  
  Source: https://jamuspsi.github.io/dunno/  
  Quote: "When it gets big enough, it resets down to a smaller size, but gains a point of Magic"
- Per-face customization — the owner's natural phase-two hook — exists only in premium, run-based roguelike dicebuilders on PC, never in a free mobile idle. Die in the Dungeon sells exactly this fantasy, confirming the mechanic is proven fun while being completely absent from the idle genre.  
  Source: https://store.steampowered.com/app/2026820/Die_in_the_Dungeon/  
  Quote: "build every die your way: set its faces, add unique properties"
- Thrice-a-Dice and Dicey Stakes confirm the face-editing mechanic is an active PC indie trend with a shared vocabulary (swap, replace, combine faces), which means the design is validated but the mobile idle audience has never been served it.  
  Source: https://shempufi.itch.io/thrice-a-dice  
  Quote: "swap, replace individual faces or combine them to suit your strategy"
- Luck be a Landlord is the definitive slot-building game and it is PREMIUM and run-based, not idle: $4.99 up front, 100k+ installs, 4.39 stars, and a deliberate refusal of microtransactions. It does not compete for the free idle slot audience at all, so the owner's phase-two slot reskin does not collide with it.  
  Source: https://play.google.com/store/apps/details?id=com.trampolinetales.lbal&hl=en_US  
  Quote: "This game does not contain any real-world currency gambling or microtransactions"
- Luck be a Landlord's own top complaint is content bloat — 152 symbols drowning strategy. For the slot reskin, the symbol pool must grow slowly and each symbol must be individually legible, mirroring the side-by-side pacing of the dice mode.  
  Source: https://play.google.com/store/apps/details?id=com.trampolinetales.lbal&hl=en_US  
  Quote: "it's so bloated with the different symbols you can get that you can't actually strategize"
- The free idle-slot space is genuinely vacant rather than contested: the most on-target title, Idle Slots, was pulled from Play in 2024 with a 2.13 rating, and what remains under 'idle slot' searches is casino-MANAGER tycoon (build a floor of machines) rather than upgrading one machine. A 'grow one slot machine' game has no incumbent.  
  Source: https://www.appbrain.com/app/idle-slots/com.phonegap.IdleSlots  
  Quote: "unpublished from the Google Play store on April 1, 2024"
- Random Dice (111 Percent, ~15M downloads, 4.05 from ~620k ratings) is a PvP tower defense with dice as units and a gacha economy — it shares only the word 'dice'. It is useful as contrast: it proves the dice aesthetic has mass-market reach, while its mediocre 4.05 rating relative to Idle Dice's 4.7 shows monetization pressure costs goodwill.  
  Source: https://www.appbrain.com/app/random-dice-defense/com.percent.royaldice  
  Quote: "rated 4.05 out of 5 stars based on 620 thousand ratings"