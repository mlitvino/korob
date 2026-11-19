module.exports = {
  preset: 'jest-expo',

  // Design checks run only via `yarn test:design`.
  testPathIgnorePatterns: ['/node_modules/', '/__design__/'],

  transformIgnorePatterns: [
    'node_modules/(?!' +
      '((jest-)?react-native|' +
      '@react-native(-community)?)|' +
      'expo(nent)?|' +
      '@expo(nent)?/.*|' +
      '@expo-google-fonts/.*|' +
      'react-navigation|' +
      '@react-navigation/.*|' +
      'react-native-paper|' +
      'react-native-paper-dates|' +
      'color|' +
      'color-string|' +
      'color-name|' +
      'color-convert|' +
      '@sentry/react-native|' +
      'native-base|' +
      'react-native-svg|' +
      'react-native-uuid' +
    ')',
  ],

  "collectCoverageFrom": [
    "**/*.{ts,tsx,js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/expo-env.d.ts",
    "!**/.expo/**",
    "!**/dist/**",
  ],
};
