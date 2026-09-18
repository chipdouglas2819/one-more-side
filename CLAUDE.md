# ONE MORE SIDE: instructions for AI sessions

Dice idle game prototype. Owner: Nate (they/them), very little programming experience, builds through AI sessions. Android first.

## Before working
1. Read `docs/README.md`, then `docs/VISION.md`. The design rules in VISION override any designer's preference: simple, show don't tell, no menu fiesta, faces read 1 to N, feedback appears where it happened, speed must never make it look worse.
2. Read `docs/FEEDBACK_LOG.md` and `docs/DECISIONS.md` before changing anything that looks already decided.
3. Rules and formulas are in `SPEC.md`; build-time changes and their measurements are in its Appendix A.

## While working
- All money numbers live in `<script id="economy">` in `index.html`, which touches no DOM. The game reads only from it. Economy changes go there and get recorded in SPEC.md Appendix A.
- Gates: `node check.js` and `node sim.js` must both pass before anything is published.
- Test in a browser at phone size (375x812). Taps closer than 100 ms are ignored by design.

## Before ending (required)
- New feedback from Nate goes into `docs/FEEDBACK_LOG.md` **verbatim**, dated, with the decision and a status.
- New decisions go into `docs/DECISIONS.md` with who made them and why.
- Update `docs/ROADMAP.md`, and `SPEC.md` if rules or numbers changed.
- Update this game's row in the hub: `C:\Users\Nate\Downloads\- Project Hub\README.md`, plus a dated line in the hub's `DECISIONS.md`.

## Publishing
Public repo `chipdouglas2819/one-more-side`, GitHub Pages from `main` at the repo root: https://chipdouglas2819.github.io/one-more-side/. Commit as `chipdouglas2819 <chipdouglas2819@gmail.com>`. Email a new link only when Nate asks.

## Privacy
This repo is public. Never commit personal details: finances, account emails, network addresses, the portfolio plan. Those stay in the local Project Hub.
