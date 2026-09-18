# ONE MORE SIDE: documentation

Everything needed to move this game from prototype to a real build lives in this folder, so nothing depends on any one chat session.

Read in this order:

| File | What it holds |
|---|---|
| `VISION.md` | What the game is, who it's for, the design rules it must follow, what success looks like |
| `FEEDBACK_LOG.md` | Every piece of Nate's feedback, verbatim and dated, with the decision taken and its status |
| `DECISIONS.md` | Design and technical decisions, why they were made, who made them, and what was rejected |
| `ROADMAP.md` | What's done, what's next, the Android path, the long-term content gap, the wheel and slot variants |
| `PRODUCTION_HANDOFF.md` | How to turn the prototype into a production build: architecture, what's authoritative, engine options, asset needs, test gates to carry over (written after v2.1) |
| `../SPEC.md` | The current build spec: every rule and formula, plus Appendix A with every change made during building and the measurement that forced it |
| `../README.md` | How to play-test and run the checks, written for a non-programmer |
| `research/` | Policy and competitor research, the three-design panel with judges' scores and rejected ideas, the original specs, and the full review, economy and playtest history of each version |

## Keeping it current

Any session that works on this game must, before ending:
1. Add any new feedback from Nate to `FEEDBACK_LOG.md`, verbatim, with the decision and status.
2. Add any decision to `DECISIONS.md` with who made it and why.
3. Update `ROADMAP.md` and, if rules or numbers changed, `../SPEC.md`.

The same rules are in `../CLAUDE.md`, which AI sessions opened in this folder read automatically.
