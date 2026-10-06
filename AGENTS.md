# Korob Agent Guide

This is the shared starting point for AI coding agents working in this repository.

## Project Snapshot

- Monorepo with an Expo React Native app in [frontend](frontend) and nginx in [nginx](nginx).
- The app targets **iOS and Android only** — there is no web target. Do not add `.web.ts` overrides, `Platform.OS === 'web'` branches, or `react-native-web`.
- nginx is the TLS gateway for a planned backend API; until that exists it only serves `/health`.
- Main app code is in [frontend/src](frontend/src).
- Local persistence: SQLite via expo-sqlite + Drizzle in [frontend/src/db](frontend/src/db); settings in AsyncStorage via [frontend/src/storage](frontend/src/storage).

## Quick Commands

- From repo root:
  - `make front` to run the Expo dev server (Expo Go, same network)
  - `make tunnel` to run the Expo dev server reachable from any network
  - `make preview` to build an installable Android APK on EAS
  - `make test` to run frontend tests
  - `make build` / `make start` / `make down` to manage the nginx container stack
- From [frontend](frontend) (uses yarn — `yarn.lock` is the lockfile):
  - `yarn start`
  - `yarn test`
  - `yarn lint`
  - `yarn tsc`

## Architecture Boundaries

- Keep Expo Router structure under [frontend/src/app](frontend/src/app): root stack + drawer group + modal route.
- Keep feature-local UI and logic under [frontend/src/features](frontend/src/features), grouped by page/flow concern.
- Keep global state in context/reducer modules under [frontend/src/contexts](frontend/src/contexts).
- Keep transaction domain model aligned with [frontend/src/types/Transaction.ts](frontend/src/types/Transaction.ts).
- Use theme and locale infrastructure from [frontend/src/constants/theme.ts](frontend/src/constants/theme.ts), [frontend/src/contexts/ThemeContext.tsx](frontend/src/contexts/ThemeContext.tsx), and [frontend/src/locales/index.ts](frontend/src/locales/index.ts).

## Conventions That Matter

- TypeScript is strict; prefer `type` over `interface` for props and action unions.
- Use typed route params and validate critical runtime params in modal flows.
- Balance is derived from transactions via `useBalance` in [frontend/src/contexts/TranscationContext.tsx](frontend/src/contexts/TranscationContext.tsx); never store it separately.
- Prefer translated strings and theme tokens over hardcoded labels and colors.
- Preserve provider layering in [frontend/src/contexts/AppProviders.tsx](frontend/src/contexts/AppProviders.tsx).

## Testing Expectations

- Use `jest-expo` patterns already used under [frontend/src/components/__tests__](frontend/src/components/__tests__).
- Add or update tests for behavioral changes; avoid shipping logic changes without coverage.

## Reference Docs

- Product and environment overview: [README.md](README.md)
- Frontend-focused coding instructions: [.github/instructions/frontend.instructions.md](.github/instructions/frontend.instructions.md)

