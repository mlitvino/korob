# Design canvas mirror

Repo copy of the Korob design canvas on claude.ai:
https://claude.ai/artifact/YB7ayG42JFkvwBC7W9wys9 (private; share from its Share menu).

`project/` holds the canvas's own files exactly as served:

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
yarn test:design      # tokens.css matches theme.ts; canvas ↔ code contracts hold
yarn design:tokens    # rewrite project/tokens.css from theme.ts
```

`make test-design` runs the same checks from the repo root.

## Sync flow

1. Pull: download the current canvas files into `project/` (Claude: Artifact `read` with `paths`,
   `out_dir` = this folder). Do this first, so edits made in the browser are not lost.
2. Edit here (or change `theme.ts` and run `yarn design:tokens`).
3. Publish from here (Claude: Artifact publish with `root` = this folder). A publish over a newer
   browser edit is refused; pull again and redo the change.

## Canvas-only preview features

- **Global theme** (board `GlobalTheme`, Screens page): screens whose Theme tweak is `global` follow it.
  It is stored in the viewing app's local storage (shared by all boards, survives restarts), not in the
  design files, so other people and other devices start from the default. Not part of the app.
