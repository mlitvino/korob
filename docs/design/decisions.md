# Korob design decisions

Log of design decisions and why they were made. Values live in `frontend/src/constants/theme.ts`, current rules in
`AGENTS.md` and `docs/design/canvas/README.md`; the canvas is https://claude.ai/artifact/YB7ayG42JFkvwBC7W9wys9.
The v1 → v2 migration notes (Nov 2026) were removed; `git log -- docs/design` has them.

## Roles and canvas sync (2026-11-19)
- `accent` carried four meanings, so `theme.ts` adds semantic roles via `roleSources`: `actionPrimary` / `onActionPrimary`, `actionSecondary` / `onActionSecondary`, `selection`, `focus`. All map to existing palette tokens: no visual change. Button, SettingsRow, Field and the paper date picker use them.
- The canvas lives in the repo at `docs/design/canvas/`; its `tokens.css` is generated from `theme.ts` (`yarn design:tokens`), and canvas primitives follow code names (`docs/design/components.json`). Checked by the opt-in `yarn test:design`.

## Updates since 2026-11-19 (2026-11-20)
Decisions made after the port; code and canvas both follow them.

- **Tokens:** `outline` (border of unfilled chips and filter buttons, ≥3:1 on `background` and `canvas`; dark `#7e7d81`, light `#666666`, black `#686868`, black_yellow `#696545`) and one `scrim` (50% black behind sheets, dialogs and the drawer; the canvas had 40% in places). Light `canvas` changed from `#c8c4cc` to `#f2f0f5` so sheets, drawer and cards no longer read as a different white; cards in light are now closer to the white background (1.13:1), revisit with a mid value such as `#e6e3ec` if they get too faint.
- **Contrast checks** in `constants/__tests__/theme.test.ts` (run in `yarn test`): text 4.5:1 on every surface, secondary text at 70%, amounts and fills 3:1, and non-text parts 3:1 (outline, focus ring, selection mark). Known and accepted: in the light theme income and expense are close for protanopia (CIE ΔE ≈ 6); amounts carry a +/− sign, so colour is never the only cue.
- **Categories:** chips (`CategoryChip`, wrapping rows, × deletes, + adds, 2px outline) in the form's picker sheet and in Settings → Categories, one shared editor sheet (`CategoryEditorSheet`, `useCategoryEditor`). The picker's chip list scrolls past half the screen height. Deleting is a soft delete (`archivedAt`): the row is kept, past transactions keep the name, nothing can be restored; the UI says Delete. Reason: no dangling references, and a future sync can send "deleted" as a flag.
- **Transactions:** tapping a row opens a details sheet (title "signed amount · category") with an editable comment and Delete (asks for confirmation). Long-pressing a row starts selection mode (checkboxes, select all, one confirmation deletes every selected row). Amount, category and date are not editable yet.
- **Navigation:** the add-transaction back arrow returns to where it was opened from (Home if opened without history); the drawer no longer adds a second 12px of padding on top of the library's.
- **Canvas structure:** the Screens page is arranged in titled flow lanes with sub-flows of one lane (Settings: Currency, Categories → editor, Appearance, Language) separated by a wider gap than the boards inside a sub-flow, small "tap …" notes between boards and a note listing what is not on the canvas yet (today: the empty Transactions list). Script code every screen needs is kept once in `docs/design/canvas/blocks/` and written into the boards by `yarn design:screens`. `yarn test:design` also rejects raw hex/`rgba()` colours in product boards.
- **Tests:** after-mutation assertions use `waitFor`, and "gone" assertions use `.not.toBeOnTheScreen()` (a failing `toBeNull()` on an element takes ~0.8 s and made tests flaky).

## Updates page (2026-11-23)
- **What:** a drawer page "Updates / Обновления / Päivitykset" listing releases, newest first: a date separator (the Transactions look) and one card per feature with a bold title and one or two lines on how to use it. Entries are hand-written in `features/updates/changelog.ts`, bundled in the JavaScript so each `eas update` carries its own "what's new", and are Russian only whatever the app language (user decision). No bug fixes, no build info.
- **Dot:** a small dot after the drawer label while the newest release id differs from the last opened one (AsyncStorage). Opening the page clears it; a new release brings it back. Its colour is the new `badge` role (maps to `accent`, 3:1 on the drawer background and the active item, checked in `theme.test.ts`). The label reads "Updates, new" to screen readers.
- **Dates:** release dates are parsed as local dates (`new Date(y, m - 1, d)`); `new Date('2026-11-23')` is UTC and showed the previous day west of UTC.
- **Canvas:** board `Updates` at the end of the Home & menu lane (the Transactions lane and the boards after it moved right by 612 px); `Drawer` has the item and an `unseen` tweak; `DrawerItem` has a canvas-only `badge` prop; `Colors` lists the `badge` role and its checks.
- **Open:** the drawer label is drawn by `UpdatesDrawerLabel`, which copies the drawer label style by hand; when a second item needs a badge, replace both with one shared drawer label that takes a `badge` prop. The persisted "last seen" store moves into `storage/` as `usePersistedValue(key)` when a second shared persisted value appears.
