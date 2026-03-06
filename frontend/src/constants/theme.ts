export type ThemeColors = {
    canvas: string;
    background: string;
    surface: string;
    inset: string;
    elevated: string;

    text: string;
    textMuted: string;

    separator: string;

    income: string;
    expense: string;
};

export const Themes: Record<string, ThemeColors> = {
  light:  {
    canvas:   '#222025',
    background: '#2f2e33',
    surface:  '#262236',
    inset:    '#3a3257',
    elevated: '#413d46',

    text:     '#ffffff',
    textMuted: 'rgba(255,255,255,0.5)',

    separator: 'rgba(255,255,255,0.1)',

    income:   '#4caf82',
    expense:  '#e05c5c',
  },
  dark: {
    canvas:   '#222025',
    background: '#2f2e33',
    surface:  '#262236',
    inset:    '#3a3257',
    elevated: '#413d46',

    text:     '#ffffff',
    textMuted: 'rgba(255,255,255,0.5)',

    separator: 'rgba(255,255,255,0.1)',

    income:   '#4caf82',
    expense:  '#e05c5c',
  },
};
