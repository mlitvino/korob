---
applyTo: 'frontend/**'
---
# Frontend Copilot Instructions for Korob

Use this file for frontend-specific behavior. For repository-wide context, start with [AGENTS.md](../../AGENTS.md).

## Scope

- Active app code is under [frontend/src/app](../../frontend/src/app).

## Routing And Providers

- Keep Expo Router structure intact: root stack in [frontend/src/app/_layout.tsx](../../frontend/src/app/_layout.tsx), drawer group in [frontend/src/app/(drawer)](../../frontend/src/app/_layout.tsx), modal flow in [frontend/src/app/transaction-modal.tsx](../../frontend/src/app/transaction-modal.tsx).
- Preserve provider order in [frontend/src/contexts/AppProviders.tsx](../../frontend/src/contexts/AppProviders.tsx): `SettingsProvider` -> `ThemeProvider` -> `TransactionProvider` -> `BalanceProvider`.

## State, Theme, And Locale

- Keep context APIs split between state and dispatch hooks in [frontend/src/contexts](../../frontend/src/contexts).
- For transaction creation, update both transaction and balance reducers from the same submit flow.
- Prefer theme tokens and localization keys over hardcoded colors and labels:
  - [frontend/src/constants/theme.ts](../../frontend/src/constants/theme.ts)
  - [frontend/src/contexts/ThemeContext.tsx](../../frontend/src/contexts/ThemeContext.tsx)
  - [frontend/src/locales](../../frontend/src/locales)

## TypeScript And Tests

- TypeScript strict mode is required; prefer `type` over `interface` for props and action unions.
- Keep route params and reducer actions strongly typed.
- Follow `jest-expo` patterns from [frontend/src/components/__tests__](../../frontend/src/components/__tests__) and add/update tests for behavior changes.

## Commands

- Root: `make test`, `make front`, `make build`
- Frontend: `npm test`, `npm run lint`, `npm run tsc`

## Additional Context

- Product and environment overview: [README.md](../../README.md)
