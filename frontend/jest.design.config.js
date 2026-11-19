// Opt-in design checks (canvas ↔ theme.ts). Not part of `yarn test` or CI.
const base = require('./jest.config');

module.exports = {
  ...base,
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/src/__design__/**/*.test.ts'],
};
