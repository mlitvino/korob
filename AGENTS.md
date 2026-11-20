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

## Quick Commands

- From repo root:
  - `make front` to run the Expo dev server (Expo Go, same network)
  - `make tunnel` to run the Expo dev server reachable from any network
  - `make preview` to build an installable Android APK on EAS
  - `make test` to run frontend tests
  - `make up` / `make down` / `make logs` to run the local server stack ([compose.yml](compose.yml), `http://127.0.0.1:8080/health`)
- From [frontend](frontend) (uses yarn — `yarn.lock` is the lockfile):
  - `yarn start`
  - `yarn test`
  - `yarn lint`
  - `yarn tsc`
  - `yarn fingerprint` to print the Android native fingerprint (see Over-the-Air Updates)

## Architecture Boundaries

- Keep Expo Router structure under [frontend/src/app](frontend/src/app): root stack + drawer group + modal route.
- Keep feature-local UI and logic under [frontend/src/features](frontend/src/features), grouped by page/flow concern. `transaction-list` (drawer page) and `transaction-form` (modal flow) stay separate features even though both are about transactions.
- Only truly reusable primitives go in [frontend/src/components](frontend/src/components) and [frontend/src/hooks](frontend/src/hooks); promote a view there once two features use it.
- Keep app settings state (settings, theme) in context modules under [frontend/src/contexts](frontend/src/contexts), with separate state and setter hooks.
- Read and write database data only through TanStack Query hooks in [frontend/src/queries](frontend/src/queries). Every write is a mutation hook that invalidates the queries it affects; components never call repos directly.
- Keep transaction domain model aligned with [frontend/src/types/Transaction.ts](frontend/src/types/Transaction.ts).
- Deleting a category is a soft delete (`archivedAt`): the row stays so past transactions keep their category name; the UI says Delete and there is no restore. A transaction is deleted for good, only from its details sheet (tap a row in the list).
- Use theme and locale infrastructure from [frontend/src/constants/theme.ts](frontend/src/constants/theme.ts), [frontend/src/contexts/ThemeContext.tsx](frontend/src/contexts/ThemeContext.tsx), and [frontend/src/locales/index.ts](frontend/src/locales/index.ts).

## Conventions That Matter

- TypeScript is strict; prefer `type` over `interface` for props and action unions.
- Use typed route params and mutation inputs; validate critical runtime params in modal flows.
- Balance is derived from transactions via `useBalance` in [frontend/src/queries/transactions.ts](frontend/src/queries/transactions.ts); never store it separately.
- Prefer translated strings and theme tokens over hardcoded labels and colors.
- Preserve provider order in [frontend/src/contexts/AppProviders.tsx](frontend/src/contexts/AppProviders.tsx): `SettingsProvider` → `ThemeProvider` → `PaperThemeProvider` → `QueryClientProvider`.

## Testing Expectations

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
- `theme.ts` is the source of truth. Colors in product boards and app code come from tokens (`outline` for unfilled chips and buttons, `scrim` for the dimming behind sheets and dialogs); `yarn test:design` rejects raw hex or `rgba()` in product boards. Use semantic roles (`actionPrimary`, `selection`, `focus`, …) where a component means a role; add a role to `roleSources` rather than reusing `accent` for a new meaning.
- The canvas `tokens.css` is generated: run `yarn design:tokens` after changing `theme.ts`. Canvas primitives follow code names/props, listed in [docs/design/components.json](docs/design/components.json).
- Code shared by many boards (global-theme follower, category names) lives once in `docs/design/canvas/blocks/*.block` and is copied into each board between `// <generated:NAME>` markers: edit the `.block` file, then run `yarn design:screens`. A new interactive screen needs the `global-theme` markers.
- `yarn test:design` (or `make test-design`) checks tokens, component contracts and the shared blocks; it is opt-in and not part of `yarn test` or CI.
- Canvas sync: pull the live files into `docs/design/canvas/project` first and read the diff (browser edits inside a marked region are overwritten by `yarn design:screens`), edit locally, run `yarn design:tokens` / `yarn design:screens` / `yarn test:design`, then publish from that folder. Details in the canvas README.
- A change to a component's props or look is made in both code and canvas, and its entry in `components.json` is updated.

## Commits

- `type(scope): short summary`, at most 50 characters; scope is the area changed (theme, ui, nav, home, list, form, settings, i18n, db, deps, proxy, ci). Types: feat, fix, refac, chore, test, docs.
- Prefer the subject line alone; if it cannot capture the change, add a blank line and a 1–2 line body (wrapped at 50) saying what and why.

## Reference Docs

- Product and environment overview: [README.md](README.md)
- Design docs: [docs/design](docs/design)

