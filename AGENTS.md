# Korob Agent Guide

This is the shared starting point for AI coding agents working in this repository.

## Project Snapshot

- Monorepo with an Expo React Native app in [frontend](frontend) and nginx deployment files in [nginx](nginx).
- Main app code is in [frontend/src](frontend/src).
- Reference code in [frontend/app-example](frontend/app-example) is not production code.

## Quick Commands

- From repo root:
  - `make build` to build and start dev containers
  - `make start` to start existing containers
  - `make down` to stop containers
  - `make front` to run Expo directly
  - `make test` to run frontend tests
- From [frontend](frontend):
  - `npm start`
  - `npm test`
  - `npm run lint`
  - `npm run tsc`

## Architecture Boundaries

- Keep Expo Router structure under [frontend/src/app](frontend/src/app): root stack + drawer group + modal route.
- Keep global state in context/reducer modules under [frontend/src/contexts](frontend/src/contexts).
- Keep transaction domain model aligned with [frontend/src/types/Transaction.tsx](frontend/src/types/Transaction.tsx).
- Use theme and locale infrastructure from [frontend/src/constants/theme.ts](frontend/src/constants/theme.ts), [frontend/src/contexts/ThemeContext.tsx](frontend/src/contexts/ThemeContext.tsx), and [frontend/src/locales/index.ts](frontend/src/locales/index.ts).

## Conventions That Matter

- TypeScript is strict; prefer `type` over `interface` for props and action unions.
- Use typed route params and validate critical runtime params in modal flows.
- For new transactions, update both transaction and balance reducers in the same submit path.
- Prefer translated strings and theme tokens over hardcoded labels and colors.
- Preserve provider layering in [frontend/src/contexts/AppProviders.tsx](frontend/src/contexts/AppProviders.tsx).

## Testing Expectations

- Use `jest-expo` patterns already used under [frontend/src/components/__tests__](frontend/src/components/__tests__).
- Add or update tests for behavioral changes; avoid shipping logic changes without coverage.

## Reference Docs

- Product and environment overview: [README.md](README.md)
- Frontend-focused coding instructions: [.github/instructions/copilot.instructions.md](.github/instructions/copilot.instructions.md)
