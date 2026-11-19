import { roleSources, Themes, ThemeName, type ThemeRole } from '@/constants/theme';

const themeNames = Object.keys(Themes) as ThemeName[];

const luminance = (hex: string) => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

/** Expands #rgb / #rrggbb / #rrggbbaa into RGB channels, blending alpha over `base`. */
const toRgb = (hex: string, base = '#ffffff'): [number, number, number] => {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((ch) => ch + ch).join('');
  }
  const channels = [0, 2, 4].map((i) => parseInt(clean.substring(i, i + 2), 16));
  if (clean.length === 8) {
    const alpha = parseInt(clean.substring(6, 8), 16) / 255;
    const under = toRgb(base);
    return channels.map((c, i) => c * alpha + under[i] * (1 - alpha)) as [number, number, number];
  }
  return channels as [number, number, number];
};

const relativeLuminance = ([r, g, b]: [number, number, number]) => {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const contrast = (fg: string, bg: string, base?: string) => {
  const a = relativeLuminance(toRgb(fg, base));
  const b = relativeLuminance(toRgb(bg, base));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

describe('Themes', () => {
  it.each(themeNames)(
    '%s declares a mode that matches its canvas and text colors',
    (name) => {
      const { mode, canvas, text } = Themes[name];

      if (mode === 'dark') {
        expect(luminance(canvas)).toBeLessThan(0.5);
        expect(luminance(text)).toBeGreaterThan(0.5);
      } else {
        expect(luminance(canvas)).toBeGreaterThan(0.5);
        expect(luminance(text)).toBeLessThan(0.5);
      }
    },
  );

  it.each(themeNames)('%s text is readable (4.5:1) on every surface', (name) => {
    const t = Themes[name];
    for (const bg of [t.background, t.surface, t.canvas, t.inset, t.elevated]) {
      expect(contrast(t.text, bg, t.background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(themeNames)('%s amounts are readable (3:1, large text) on transaction cards', (name) => {
    const t = Themes[name];
    expect(contrast(t.income, t.canvas)).toBeGreaterThanOrEqual(3);
    expect(contrast(t.expense, t.canvas)).toBeGreaterThanOrEqual(3);
  });

  it.each(themeNames)('%s contrastText is readable on accent, income and expense fills', (name) => {
    const t = Themes[name];
    expect(contrast(t.contrastText, t.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.contrastText, t.income)).toBeGreaterThanOrEqual(3);
    expect(contrast(t.contrastText, t.expense)).toBeGreaterThanOrEqual(3);
  });

  it.each(themeNames)('%s resolves every semantic role to its palette token', (name) => {
    const t = Themes[name];
    for (const [role, source] of Object.entries(roleSources)) {
      expect(t[role as ThemeRole]).toBe(t[source]);
    }
  });

  it.each(themeNames)('%s keeps income, expense and accent distinct', (name) => {
    const t = Themes[name];
    const colors = [t.income, t.expense, t.accent].map((c) => c.toLowerCase());
    expect(new Set(colors).size).toBe(3);
  });
});
