# Korob design decisions

Why things are the way they are. Values live in `frontend/src/constants/theme.ts`; rules in `AGENTS.md` and
`docs/design/canvas/README.md`; the canvas is https://claude.ai/artifact/YB7ayG42JFkvwBC7W9wys9.

**What goes here:** a non-obvious *why* that code, tests and the canvas cannot show, and that someone could undo
without knowing it. One line each, `Decision — why`, filed under a topic. Not here: what a feature does, wording,
layout, positions. Edit a line in place when a decision changes and delete it when it is gone; keep the file under
about 60 lines. History is in `git log -- docs/design`.

## Tokens and contrast
- Semantic roles (`roleSources`) instead of `accent` everywhere — `accent` carried four meanings; a new meaning gets a new role (`badge` is the drawer's new-updates dot).
- One `scrim` (50% black) and an `outline` token ≥3:1 on `background` and `canvas` — the canvas had 40% scrims and unfilled chips that vanished on cards.
- Light `canvas` is `#f2f0f5` — sheets, drawer and cards read as a different white before; cards are now close to the background (1.13:1), so try `#e6e3ec` if they get too faint.
- Light income and expense are close for protanopia (ΔE ≈ 6): accepted — amounts carry a +/− sign, so colour is never the only cue.

## Data and errors
- Deleting a category is a soft delete (`archivedAt`), with no restore — no dangling references on past transactions, and a future sync can send "deleted" as a flag.
- A failed first load shows `StartupErrorScreen` as an overlay, not a route — no deep link can reach it, and it covers the drawer; its text does not promise the data is safe, because a failed migration cannot guarantee that.
- Every error screen (startup, both `ErrorBoundary` fallbacks) has Restart (`Updates.reloadAsync`) — a caught error never crashes, so expo-updates never rolls back a bad update; reloading is how a fixed one gets in.
- Totals convert other currencies at the latest rate, not the rate of each transaction's day — one cached request instead of one per day, so it also works offline; each converted amount is rounded to cents before summing, so totals stay whole cents.
- Save and delete failures stay native alerts — they are not screens; the canvas lists their texts in a sticky on the Screens page.

## Content
- The Updates page is Russian only, whatever the app language, with no bug fixes — user decision; it ships inside the JavaScript so each `eas update` carries its own "what's new".
