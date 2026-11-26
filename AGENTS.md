# Korob Agent Guide

This is the shared starting point for AI coding agents working in this repository.

## Project Snapshot

- Monorepo with an Expo React Native app in [frontend](frontend) and a Caddy proxy in [proxy](proxy).
- The app targets **iOS and Android only** — there is no web target. Do not add `.web.ts` overrides, `Platform.OS === 'web'` branches, or `react-native-web`.
- The proxy serves `api.korob.mlitvino.dev` behind the VPS edge Caddy (which terminates TLS). Until the backend exists it only answers `GET /health` with `{"status":"ok","version":"<commit sha>"}`.
- Production runs [deploy/compose.yml](deploy/compose.yml) on the VPS. [cd.yml](.github/workflows/cd.yml) runs the CI checks ([ci.yml](.github/workflows/ci.yml)), pushes `ghcr.io/mlitvino/korob-proxy:<sha>` and deploys it with `mlitvino/vps-deploy` on every push to `main`; nothing is built on the server. Keep that file complete (no override files), with no published ports and no secrets.
- One image per service, all tagged with the same commit SHA: `korob-proxy` and, once the Go backend exists, `korob-api` (service `api`, port 3000, in `backend/`). Only the proxy joins `edge_korob`; the proxy and `api` share the app's private `default` network, and the proxy forwards to `api:3000`.
- Main app code is in [frontend/src](frontend/src).
- Local persistence: SQLite via expo-sqlite + Drizzle in [frontend/src/db](frontend/src/db); settings in AsyncStorage via [frontend/src/storage](frontend/src/storage).
- The only network call is exchange rates: [frontend/src/api/exchangeRates.ts](frontend/src/api/exchangeRates.ts) (Frankfurter v1, no key, reply checked before use) through `useExchangeRates`; the last rates are kept in AsyncStorage so totals still convert offline. Everything else works without a connection.

## Quick Commands

- From repo root:
  - `make front` to run the Expo dev server (Expo Go, same network)
  - `make tunnel` to run the Expo dev server reachable from any network
  - `make preview` to build an installable Android APK on EAS
  - `make test` to run frontend tests; `make format` / `make format-check` to format with dprint / check it (CI runs the check); `make lint-compile` for lint + tsc; `make migrations-check` to verify the schema has a migration
  - `make up` / `make down` / `make logs` to run the local server stack ([compose.yml](compose.yml), `http://127.0.0.1:8080/health`)
- From [frontend](frontend) (uses yarn — `yarn.lock` is the lockfile):
  - `yarn start`
  - `yarn test`
  - `yarn lint` (ESLint: correctness rules only, not formatting)
  - `yarn tsc`
  - `yarn fingerprint` to print the Android native fingerprint (see Over-the-Air Updates)

## Architecture Boundaries

- Keep Expo Router structure under [frontend/src/app](frontend/src/app): root stack + drawer group + modal route.
- Keep feature-local UI and logic under [frontend/src/features](frontend/src/features), grouped by page/flow concern. `transaction-list` (drawer page) and `transaction-form` (modal flow) stay separate features even though both are about transactions.
- Only truly reusable primitives go in [frontend/src/components](frontend/src/components) and [frontend/src/hooks](frontend/src/hooks); promote a view there once two features use it.
- Shared pure helpers (no React) go in [frontend/src/utils](frontend/src/utils): `period.ts` (period bounds, `sumInBounds` for totals), `dateTime.ts`, `locale.ts`. Dates and money use the app language through `useLocale`, never the phone's (`toLocaleDateString(undefined)`).
- Keep app settings state (settings, theme) in context modules under [frontend/src/contexts](frontend/src/contexts), with separate state and setter hooks.
- Read and write database data only through TanStack Query hooks in [frontend/src/queries](frontend/src/queries). Every write is a mutation hook that invalidates the queries it affects; components never call repos directly.
- Keep transaction domain model aligned with [frontend/src/types/Transaction.ts](frontend/src/types/Transaction.ts).
- Deleting a category is a soft delete (`archivedAt`): the row stays so past transactions keep their category name; the UI says Delete and there is no restore. A transaction is deleted for good, only from its details sheet (tap a row in the list) or from selection mode on the list (long-press a row, then Delete selected; one confirmation for all selected rows).
- The Updates drawer page ([frontend/src/features/updates](frontend/src/features/updates)) shows a hand-written, Russian-only changelog bundled in the JavaScript: [changelog.ts](frontend/src/features/updates/changelog.ts), newest release first, feature title plus one or two lines on how to use it, no bug fixes. **Before each `eas update` that adds a feature, add a release entry there** (ids are unique dates, sorted newest first; a test checks it). A new release id brings the unseen dot back in the drawer; the last opened id is kept in AsyncStorage (`STORAGE_KEYS.lastSeenUpdate`) by a small shared store in `useUnseenUpdates`. When a second shared persisted value appears, move that store into a `usePersistedValue(key)` hook in `storage/`.
- A failed first load of data (migrations or the first read) shows `StartupErrorScreen` with Try again; mutation failures use `Alert.alert` with a translated message. A new startup path must not cache a rejected promise (`memoizeUntilFailure`).
- Money is whole cents everywhere (`amountCents`, `parseAmount`, `formatCents`); never store or sum floats. Totals in another currency convert each amount at the latest rate and round it to cents (`convertCents`, `sumInBounds`). Every screen (balance, totals, list rows) shows the currency from Settings, with no `≈`; the details sheet also shows the entered amount; a currency without a rate is left out and named by `MissingRatesNote`. A transaction's own amount and currency never change.
- A schema change needs a committed migration: run `yarn migration:generate` (CI runs `make migrations-check` and fails without it).
- A new string goes into all three locales (en, fi, ru) and `LocaleResource`; `locales/__tests__` checks they match.
- Use theme and locale infrastructure from [frontend/src/constants/theme.ts](frontend/src/constants/theme.ts), [frontend/src/contexts/ThemeContext.tsx](frontend/src/contexts/ThemeContext.tsx), and [frontend/src/locales/index.ts](frontend/src/locales/index.ts).

## Conventions That Matter

- Formatting is dprint ([frontend/dprint.json](frontend/dprint.json)): single quotes, semicolons, trailing commas on multiline, 2-space indent, 100 columns. Run `make format` before committing; ESLint no longer checks formatting. dprint is **not yet in `package.json`** (a new dependency or script changes the native fingerprint), so `make` runs it through `npx`; see [local/plan.md](local/plan.md) for moving it in at the next native build.
- TypeScript is strict; prefer `type` over `interface` for props and action unions.
- Use typed route params and mutation inputs; validate critical runtime params in modal flows.
- Balance is derived from transactions via `useBalance` in [frontend/src/queries/transactions.ts](frontend/src/queries/transactions.ts); never store it separately.
- Prefer translated strings and theme tokens over hardcoded labels and colors.
- Preserve provider order in [frontend/src/contexts/AppProviders.tsx](frontend/src/contexts/AppProviders.tsx): `SettingsProvider` → `ThemeProvider` → `PaperThemeProvider` → `QueryClientProvider`.

## Testing Expectations

- Render with `renderWithApp` ([frontend/src/testing/renderWithApp.tsx](frontend/src/testing/renderWithApp.tsx)) and use `createTestDb` (real SQLite) for database tests. Tests have no network: `fetch` rejects ([frontend/src/testing/jestSetup.ts](frontend/src/testing/jestSetup.ts)) unless a test mocks a reply.
- Use `jest-expo` patterns already used under [frontend/src/components/__tests__](frontend/src/components/__tests__).
- Add or update tests for behavioral changes; avoid shipping logic changes without coverage.
- Theme colors are checked by `constants/__tests__/theme.test.ts` (text 4.5:1 on every surface, secondary text, amounts and non-text parts 3:1): a new color or theme must pass it.
- Assert that something is gone with `expect(queryBy…(…)).not.toBeOnTheScreen()`, never `.toBeNull()` on an element: a failing `toBeNull()` pretty-prints the whole React instance (~0.8 s), which blocks the event loop inside `waitFor` and makes tests flaky. After a mutation, wait for the result with `waitFor`; React gets refreshed query data a tick after the mutation promise resolves.

## Over-the-Air Updates (EAS Update)

- Installed apps get JavaScript-only changes with `eas update` (channels `preview` and `production` in [frontend/eas.json](frontend/eas.json); `runtimeVersion` policy `fingerprint` in [frontend/app.json](frontend/app.json)). A change that alters the native fingerprint cannot be delivered that way: it needs a new build (`make preview` or a production build), and builds made before it stop receiving updates.
- **Warn the user, in the final message and without being asked,** when a change needs a new build. That is any change that:
  - adds, removes or upgrades a dependency with native code (anything autolinked: `expo-*`, `react-native-*`, `@expo/*`), or upgrades the Expo SDK or React Native;
  - edits `plugins` or a native field in `app.json` (icon, splash, permissions, `package` / `bundleIdentifier`, `newArchEnabled`, `edgeToEdgeEnabled`, `updates`, `runtimeVersion`) or `eas.json` build profiles;
  - edits the `scripts` section of `frontend/package.json`: Expo hashes it into the fingerprint, so even adding a yarn script changes the runtime version.
- To check, run `yarn fingerprint` (from `frontend/`) before and after the change: a different hash means a new build is required.
- Database migrations ship inside the JavaScript bundle: an update that adds one changes the database on every phone that installs it, and another update cannot undo that. Say so when adding a migration, and test it on the `preview` channel first.

## Design Canvas

- [docs/design/canvas](docs/design/canvas) mirrors the claude.ai design canvas; see its README for the sync flow.
- `theme.ts` is the source of truth. Colors in product boards and app code come from tokens (`outline` for unfilled chips and buttons, `scrim` for the dimming behind sheets and dialogs); `yarn test:design` rejects raw hex or `rgba()` in product boards. Use semantic roles (`actionPrimary`, `selection`, `focus`, …) where a component means a role; add a role to `roleSources` rather than reusing `accent` for a new meaning (`badge` is the new-updates dot in the drawer).
- The canvas `tokens.css` is generated: run `yarn design:tokens` after changing `theme.ts`. Canvas primitives follow code names/props, listed in [docs/design/components.json](docs/design/components.json).
- Shared script blocks (`blocks/*.block`), `yarn design:screens`, `yarn test:design` (opt-in, not in `yarn test` or CI) and the sync flow are in the [canvas README](docs/design/canvas/README.md). Pull the live files and read the diff before editing: browser edits inside a marked region are overwritten by `yarn design:screens`.
- A change to a component's props or look is made in both code and canvas, and its entry in `components.json` is updated. The drawer's Updates item is drawn by `UpdatesDrawerLabel` (listed under `DrawerItem`'s code); the canvas `badge` prop stays canvas-only until one shared drawer label with a `badge` prop replaces it.

## Commits

- `type(scope): short summary`, at most 50 characters; scope is the area changed (theme, ui, nav, home, list, form, settings, i18n, db, deps, proxy, ci). Types: feat, fix, refac, chore, test, docs.
- Prefer the subject line alone; if it cannot capture the change, add a blank line and a 1–2 line body (wrapped at 50) saying what and why.

## Reference Docs

- Product and environment overview: [README.md](README.md)
- Design docs: [docs/design](docs/design). [decisions.md](docs/design/decisions.md) keeps only a non-obvious *why* that code, tests and the canvas cannot show, as one line under a topic; do not add a section per feature, and edit or delete lines when a decision changes.

