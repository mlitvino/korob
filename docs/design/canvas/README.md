# Design canvas mirror

Repo copy of the Korob design canvas on claude.ai:
https://claude.ai/artifact/YB7ayG42JFkvwBC7W9wys9 (private; share from its Share menu).

`project/` holds the canvas's own files exactly as served (`blocks/` holds source for shared script blocks, see below):

- `canvas.json` — pages (Foundations / Components / Screens), board positions, spec notes.
- `tokens.css` — **generated** from `frontend/src/constants/theme.ts`. Do not edit by hand.
- `*.dc.html` — one file per board. Primitives are imported by the overview boards and screens with `<dc-import>`.

## Source of truth

- Tokens: `theme.ts` → `yarn design:tokens` (in `frontend/`) regenerates `project/tokens.css`.
- Components: the code in `frontend/src/components` and `features/*`. Canvas primitives use the same
  names and props; `docs/design/components.json` lists what is shared, canvas-only (preview props such
  as `state`, `href`, `lang`) and code-only.

## Checks (opt-in, not in `yarn test` or CI)

```bash
cd frontend
yarn test:design      # tokens.css matches theme.ts; contracts hold; shared blocks identical;
                      # product boards contain no hex or rgba() colors (flag artwork excepted)
yarn design:tokens    # rewrite project/tokens.css from theme.ts
yarn design:screens   # rewrite the shared script blocks in every board from blocks/
```

`make test-design` runs the same checks from the repo root. Color contrast (text 4.5:1, amounts and non-text parts
such as outlines, focus ring and selection mark 3:1) is checked by `frontend/src/constants/__tests__/theme.test.ts`,
which runs in the normal `yarn test`.

## Sync flow

1. Pull: download the current canvas files into `project/` (Claude: Artifact `read` with `paths`,
   `out_dir` = this folder). Do this first, so edits made in the browser are not lost. Moving boards or notes
   in the browser changes `canvas.json` (positions, order): adopt the live file before editing.
2. Edit here (or change `theme.ts` and run `yarn design:tokens`).
3. Publish from here (Claude: Artifact publish with `root` = this folder). A publish over a newer
   browser edit is refused; pull again and redo the change.

## Screens page

One titled lane per flow (Home & menu, Transactions, Add a transaction, Settings), entry screen on the left,
overlays right after their parent, small "tap …" notes in the gaps. A new screen goes at the end of its lane.
In a lane with several sub-flows (Settings) the sub-flows stay in one row, separated by a wider gap (400 px)
than the boards inside a sub-flow (200 px).
A note on the page lists flows that have no board yet; update it when one is added.

## Shared script blocks

A board cannot import a script, so code that every screen needs is kept once in `blocks/` and copied
into each board between marker comments (`// <generated:NAME>` … `// </generated:NAME>`).

- `blocks/global-theme.block`: follow the Global theme (all interactive screens; `AddIncome` and
  `GlobalTheme` are exempt).
- `blocks/category-names.block`: category names in en / fi / ru (`Categories`, `CategorySheet`).

Edit the file in `blocks/`, then run `yarn design:screens`. A new screen gets the markers with its
script; `yarn test:design` names any board whose block differs or that is missing one. After pulling
from the canvas, read the diff before generating: it overwrites edits made inside a marked region.

## Canvas-only preview features

- **Global theme** (board `GlobalTheme`, Screens page): screens whose Theme tweak is `global` follow it.
  It is stored in the viewing app's local storage (shared by all boards, survives restarts), not in the
  design files, so other people and other devices start from the default. Not part of the app.
