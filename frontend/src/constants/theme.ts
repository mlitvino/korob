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

    pickerAccent: string;
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

    income:   '#4caf82',
    expense:  '#e05c5c',

    pickerAccent: '#413d46',
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

    pickerAccent: '#76d9b3',
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

    income:   '#fff',
    expense:  '#fff',

    pickerAccent: '#8ec5ff',
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

    pickerAccent: '#ffd600',
    pickerText: '#fff7a8',
  },
};
