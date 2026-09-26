import { Themes, ThemeName } from '@/constants/theme';

const luminance = (hex: string) => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

describe('Themes', () => {
  it.each(Object.keys(Themes) as ThemeName[])(
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
});
