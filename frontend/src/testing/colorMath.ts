// Test-only: WCAG contrast helpers for checking theme colors.

export type Rgb = [number, number, number];

/** Expands #rgb / #rrggbb / #rrggbbaa into RGB channels, blending alpha over `base`. */
export function toRgb(hex: string, base = '#ffffff'): Rgb {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((ch) => ch + ch).join('');
  }
  const channels = [0, 2, 4].map((i) => parseInt(clean.substring(i, i + 2), 16));
  if (clean.length === 8) {
    const alpha = parseInt(clean.substring(6, 8), 16) / 255;
    const under = toRgb(base);
    return channels.map((c, i) => c * alpha + under[i] * (1 - alpha)) as Rgb;
  }
  return channels as Rgb;
}

/** `fg` drawn at `opacity` over `bg`, like text with the secondary opacity. */
export const withOpacity = (fg: Rgb, bg: Rgb, opacity: number): Rgb => (
  fg.map((c, i) => c * opacity + bg[i] * (1 - opacity)) as Rgb
);

const linear = (channel: number) => {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = ([r, g, b]: Rgb) => (
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
);

/** WCAG contrast ratio between two colors; alpha colors are blended over `base`. */
export function contrast(fg: string | Rgb, bg: string | Rgb, base?: string): number {
  const a = relativeLuminance(typeof fg === 'string' ? toRgb(fg, base) : fg);
  const b = relativeLuminance(typeof bg === 'string' ? toRgb(bg, base) : bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
