import { opacity, roleSources, Themes, ThemeName, type ThemeRole } from '@/constants/theme';
import { contrast, toRgb, withOpacity } from '@/testing/colorMath';

const themeNames = Object.keys(Themes) as ThemeName[];

const luminance = (hex: string) => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
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

  it.each(themeNames)('%s secondary text (70%) stays readable (4.5:1) on every surface', (name) => {
    const t = Themes[name];
    for (const bg of [t.background, t.surface, t.canvas, t.inset, t.elevated]) {
      const under = toRgb(bg, t.background);
      const text = withOpacity(toRgb(t.text), under, opacity.secondary);
      expect(contrast(text, under)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(themeNames)('%s outlines and marks are visible (3:1, non-text)', (name) => {
    const t = Themes[name];
    // Unfilled chips and filter buttons sit on the screen background or on a sheet.
    expect(contrast(t.outline, t.background, t.background)).toBeGreaterThanOrEqual(3);
    expect(contrast(t.outline, t.canvas, t.canvas)).toBeGreaterThanOrEqual(3);
    // Focus ring in fields, selection mark on grouped rows.
    expect(contrast(t.focus, t.inset, t.background)).toBeGreaterThanOrEqual(3);
    expect(contrast(t.selection, t.surface, t.background)).toBeGreaterThanOrEqual(3);
  });
});
