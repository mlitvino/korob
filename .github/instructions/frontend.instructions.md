---
applyTo: 'frontend/**'
---
# Frontend Copilot Instructions for Korob

Use this file for frontend-specific behavior. For repository-wide context, start with [AGENTS.md](../../AGENTS.md).

## Scope

- Active app code is under [frontend/src/app](../../frontend/src/app).
- Feature modules live under [frontend/src/features](../../frontend/src/features).

## Feature Structure

- Use feature-first organization for non-shared domain code:
  - [frontend/src/features/transaction-list](../../frontend/src/features/transaction-list) for the transactions drawer page (filtering, list item rendering, date grouping).
  - [frontend/src/features/transaction-form](../../frontend/src/features/transaction-form) for modal transaction creation flow (form, date/time pickers, form helpers).
- Keep these as separate features even though both are in the transaction domain; they back different pages and evolve independently.
- Keep only truly reusable primitives in shared folders such as [frontend/src/components](../../frontend/src/components) and [frontend/src/hooks](../../frontend/src/hooks).

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

- Root: `make test`, `make front`, `make tunnel`, `make preview`
- Frontend: `yarn test`, `yarn lint`, `yarn tsc`

## Additional Context

- Product and environment overview: [README.md](../../README.md)
