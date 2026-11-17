import type { TextStyle } from 'react-native';

export type ThemeColor = {
    canvas: string;
    background: string;
    surface: string;
    inset: string;
    elevated: string;

    text: string;
    contrastText: string;

    separator: string;

    income: string;
    expense: string;

    /** App accent: primary buttons, selection checks, focus ring. */
    accent: string;
    /** Text color for react-native-paper date/time pickers. */
    pickerText: string;
};

export type ThemeMode = 'light' | 'dark';

export type Theme = ThemeColor & {
  mode: ThemeMode;
};

export type ThemeName =
  | 'dark'
  | 'light'
  | 'black'
  | 'black_yellow';

export const Themes: Record<ThemeName, Theme> = {
  light:  {
    mode: 'light',

    canvas:   '#c8c4cc',
    background: '#ffffff',
    surface:  '#c8c5d380',
    inset:    '#b8c8cf',
    elevated: '#c8c4cc',

    text:     '#000000',
    contrastText: '#ffffff',

    separator: '#020000',

    income:   '#1f6e4a',
    expense:  '#b83b3b',

    accent: '#413d46',
    pickerText: '#111111',
  },
  black: {
    mode: 'dark',

    canvas:   '#141314',
    background: '#0c0c0c',
    surface:  '#222125',
    inset:    '#413d4e',
    elevated: '#2a292c',

    text:     '#ffffff',
    contrastText: '#000',

    separator: '#ffffff1a',

    income:   '#449e75',
    expense:  '#e05c5c',

    accent: '#76d9b3',
    pickerText: '#ffffff',
  },
  dark: {
    mode: 'dark',

    canvas:   '#222025',
    background: '#2f2e33',
    surface:  '#262236',
    inset:    '#3a3257',
    elevated: '#413d46',

    text:     '#ffffff',
    contrastText: '#000',

    separator: '#ffffff1a',

    income:   '#5cc595',
    expense:  '#f27a7a',

    accent: '#8ec5ff',
    pickerText: '#ffffff',
  },
  black_yellow: {
    mode: 'dark',

    canvas:      '#070607',
    background:  '#000000',
    surface:     '#12100d',
    inset:       '#241f13',
    elevated:    '#342b18',

    text:        '#fff7a8',
    contrastText: '#000000',

    separator:   '#fff7a81a',

    income:      '#ffd600',
    expense:     '#ff9800',

    accent: '#fff7a8',
    pickerText: '#fff7a8',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
} as const;

/** Horizontal screen padding. */
export const gutter = spacing.lg;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '400' },
  headline: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} as const satisfies Record<string, TextStyle>;

export const opacity = {
  /** Dimmed text (labels, meta, values). */
  secondary: 0.7,
  pressed: 0.7,
  disabled: 0.4,
} as const;

/** Minimum touch target. */
export const touchTarget = 48;
