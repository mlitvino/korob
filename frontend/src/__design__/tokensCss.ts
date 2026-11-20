import {
  gutter,
  opacity,
  radius,
  roleSources,
  scrim,
  spacing,
  Themes,
  touchTarget,
  typography,
  type ThemeColor,
  type ThemeName,
} from '@/constants/theme';

/** Android font scale previewed by the canvas stress switch. */
const FONT_SCALE = 1.3;

/** Dark first: it is also the `:root` default on the canvas. */
const THEME_ORDER: ThemeName[] = ['dark', 'light', 'black', 'black_yellow'];

const PALETTE_KEYS: (keyof ThemeColor)[] = [
  'canvas', 'background', 'surface', 'inset', 'elevated', 'text', 'contrastText',
  'separator', 'outline', 'income', 'expense', 'accent', 'pickerText',
];

const HEADER = [
  '/* Generated from frontend/src/constants/theme.ts by `yarn design:tokens`.',
  '   Do not edit by hand. Colors live on [data-theme]; :root defaults to dark. */',
].join('\n');

const ROLES_NOTE = '/* Semantic roles (roleSources in theme.ts), set on every themed element. */';

const FONT_SCALE_NOTE = `/* Android font scale ${FONT_SCALE} (canvas stress test), rounded. */`;

const STATES = [
  '/* State rules, shared by every component. */',
  '.is-pressed { opacity: var(--opacity-pressed); }',
  '.is-disabled { opacity: var(--opacity-disabled); pointer-events: none; }',
  '.is-secondary { opacity: var(--opacity-secondary); }',
  '.is-focused { border-color: var(--focus) !important; }',
].join('\n');

const kebab = (name: string) => name.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);

const block = (selector: string, lines: string[]) => {
  const body = lines.map((line) => (line ? `  ${line}` : '')).join('\n');
  return `${selector} {\n${body}\n}`;
};

/** Renders the canvas `tokens.css` from `theme.ts`. */
export function buildTokensCss(): string {
  const palettes = THEME_ORDER.map((name) => {
    const selector = name === 'dark' ? ':root,\n[data-theme="dark"]' : `[data-theme="${name}"]`;
    return block(selector, PALETTE_KEYS.map((key) => `--${kebab(key)}: ${Themes[name][key]};`));
  });

  const roles = block(':root,\n[data-theme]', Object.entries(roleSources).map(
    ([role, source]) => `--${kebab(role)}: var(--${kebab(source)});`,
  ));

  const typeSteps = Object.entries(typography);

  const scales = block(':root', [
    ...Object.entries(spacing).map(([key, value]) => `--spacing-${key}: ${value}px;`),
    `--gutter: ${gutter}px;`,
    '',
    ...Object.entries(radius).map(([key, value]) => `--radius-${key}: ${value}px;`),
    '',
    ...typeSteps.flatMap(([step, style]) => [
      `--type-${kebab(step)}-size: ${style.fontSize}px;`,
      `--type-${kebab(step)}-line: ${style.lineHeight}px;`,
      `--type-${kebab(step)}-weight: ${style.fontWeight};`,
    ]),
    '',
    ...Object.entries(opacity).map(([key, value]) => `--opacity-${key}: ${value};`),
    '',
    `--touch-target: ${touchTarget}px;`,
    `--scrim: ${scrim};`,
  ]);

  const scaled = typeSteps.flatMap(([step, style]) => [
    `--type-${kebab(step)}-size: ${Math.round(style.fontSize * FONT_SCALE)}px;`,
    `--type-${kebab(step)}-line: ${Math.round(style.lineHeight * FONT_SCALE)}px;`,
  ]);
  const fontScale = block(`[data-font-scale="${FONT_SCALE}"]`, scaled);

  const sections = [
    HEADER,
    ...palettes,
    `${ROLES_NOTE}\n${roles}`,
    scales,
    `${FONT_SCALE_NOTE}\n${fontScale}`,
    STATES,
  ];
  return `${sections.join('\n\n')}\n`;
}
