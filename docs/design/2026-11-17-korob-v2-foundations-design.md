# Korob v2 design — Foundations

Canvas: https://claude.ai/artifact/YB7ayG42JFkvwBC7W9wys9 (page "Foundations v2")

## Intent
Make the current look consistent before any visual redesign. Keep the palette, the 4 themes
(light, dark, black, black_yellow) and the layouts; fix the bugs the v1 canvas surfaced and replace
ad-hoc values with rules that map onto `frontend/src/constants/theme.ts`.

- Goal: one source of truth for colors, type, spacing and radii; every value used in the app is a step on a scale.
- Non-goal: a new visual identity, new layouts, fewer themes.
- Anti-goal: v2 pages overwriting v1 — the v1 pages stay as the "before".

## Approaches
- **A — staged, shared components (picked):** Foundations v2 → review → Components v2 → Screens v2 built from the shared component boards. One definition per component; foundation mistakes are caught before they spread.
- B — staged, screens copy styles: rejected, repeats v1's drift.
- C — all pages at once: rejected, a foundation correction would touch every board.

## Colors
All 12 tokens and values stay, except:

| Theme | Token | v1 | v2 | Why |
|---|---|---|---|---|
| Dark | income | `#fff` | `#5cc595` | income and expense were identical |
| Dark | expense | `#fff` | `#f27a7a` | 〃 |
| Light | income | `#4caf82` | `#1f6e4a` | 1.6:1 on cards (`canvas`) → 3.6:1 |
| Light | expense | `#e05c5c` | `#b83b3b` | 2.1:1 on cards → 3.3:1 |

Usage rules:
- `text` is for text and icons only, never a fill. Form fields and the Done button fill with `inset`.
- `contrastText` only on `income`/`expense` fills.
- Targets: body text 4.5:1; amounts (20px bold, large text) 3:1. All v2 pairs pass.

## Type
Platform font (Roboto on Android). Weights 400 / 600 / 700 (500 → 600).

| Step | Size / line height |
|---|---|
| display | 30 / 36 |
| headline | 24 / 32 |
| title | 20 / 28 (absorbs 18, 17) |
| body | 16 / 24 (absorbs 15) |
| body-sm | 14 / 20 (absorbs 13) |
| caption | 12 / 16 |

Dimmed text (75/80/85% opacity) → one `secondary` treatment: `text` at 70% (≥7.4:1 in all themes).

## Spacing and radii
- Spacing: xs 4 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 3xl 32 · 4xl 48. Screen gutter = 16.
- Radii: sm 8 (fields, chips, small buttons) · md 12 (cards, panels, settings groups) · lg 16 (sheets) · full (circle buttons).
- Fixed widths become fluid: totals card, button panel, transaction form → full width − 2 × 16.
- Touch targets ≥ 48. Drawer 250 → 280; header icon 26 → 24; circle-button icon 38 → 40.

## Left to the builder
- Exact mapping of each v1 spacing value where two steps fit (e.g. 10 → 8 or 12) — decide per component in Components v2.
- How tokens are expressed in code (`theme.ts` additions for type/spacing/radii) — separate task after Screens v2.

## Components v2 (page "Components v2")
12 primitives, each one `.dc.html` with a `theme` prop (light/dark/black/black_yellow) plus variant/size/state props;
4 overview boards import them in all 4 themes. Screens v2 imports the same primitives.

| Component | Variants / props | States |
|---|---|---|
| Header | drawer · back; title | — |
| DrawerItem | active | pressed |
| CircleButton | income · expense; lg 80 / md 64 | pressed, disabled |
| Button | primary (`pickerAccent` fill) · secondary (`elevated`); lg 56 / md 48; icon | pressed, disabled |
| FilterChips | selected all · income · expense | — |
| TotalsCard | — (full width) | — |
| BalancePanel | — (full width, md circle buttons) | — |
| DateSeparator | label | — |
| TransactionItem | income · expense | — |
| Field | input · picker; label, value | focused |
| SettingsRow | nav · value · option; position only/first/middle/last | selected, pressed |
| Sheet | selected category (options = SettingsRow, Done = Button) | — |

Decisions made while building (calls, open to review):
- `pickerAccent` is the app accent: primary Button, selection checkmark, focus ring. Consider renaming it to `accent` in `theme.ts`.
- One SettingsRow replaces three row styles (divider rows, bordered option cards, sheet chips).
- Balance panel uses md circle buttons (64) so it fits 360 dp; lg (80) stays available.
- Drawer active fill: hard-coded blue 12% → `inset` (`elevated` equals `canvas` in Light).
- Back icon: chevron → Android arrow; settings sub-pages drop the in-page "‹ Title" link.
- Pressed = 70% opacity, disabled = 40%.

## Screens v2 (page "Screens v2")
Same 10 boards as v1 (`<Name>V2.dc.html`, 412 × 892, `theme` tweak), each composed only from Components v2 primitives —
no screen-local styling beyond the background and padding. Drawer and Category picker import Home / Add expense underneath.

Screen-level changes vs v1:
- Gutter 16 everywhere (Transactions was 12; Add expense form was a fixed 300 column).
- Settings sub-pages (Appearance, Currency, Language): back header with the page title; no "Settings" header + "‹ Title" link.
- Settings rows show their current value (Currency → EUR, Appearance → theme, Language → English).
- Category picker: centered card → bottom sheet anchored to the screen edge.
- Add expense keeps the vertically centered form; the amount field is shown focused.
- Language rows keep their flags (`SettingsRow` `flag` prop).

## Ported to code (2026-11-17)
v2 now lives in code; code is the source of truth from here on.
- Tokens: `frontend/src/constants/theme.ts` — color fixes, `pickerAccent` → `accent`, `spacing` / `gutter` / `radius` / `typography` / `opacity` / `touchTarget`. Contrast rules are enforced by `constants/__tests__/theme.test.ts`.
- Black Yellow accent changed to `#fff7a8` (canvas: `#ffd600`, which equalled income) — user decision.
- Components: `Button`, `CircleButton`, `Field` (`FieldInput` / `FieldPicker`), `SettingsRow`, `HeaderLeft`, `DrawerMenuButton` in `frontend/src/components/`; `IconButton` removed.
- Category sheet: RN `Modal` sliding from the bottom (no new dependency; `@expo/ui` BottomSheet's universal layer needs SDK 56).
- Settings sub-pages use the settings stack's own header with the native back arrow.
- Not ported: `+not-found.tsx`, `LoadingOverlay`, `features/debug` still use literal sizes.
- Settings → Categories (added later) has no canvas board: it is composed only from `SettingsRow`, `Button`, `FieldInput` and `Sheet`.
