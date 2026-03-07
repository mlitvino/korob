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
};

export type ThemeName =
  | 'dark'
  | 'light'
  | 'black';

export const Themes: Record<ThemeName, ThemeColor> = {
  light:  {
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
  },
  black: {
    canvas:   '#3f3c44',
    background: '#0c0c0c',
    surface:  '#222125',
    inset:    '#413d4e',
    elevated: '#2a292c',

    text:     '#ffffff',
    contrastText: '#000',

    separator: '#ffffff1a',

    income:   '#449e75',
    expense:  '#e05c5c',
  },
  dark: {
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
  },
};
