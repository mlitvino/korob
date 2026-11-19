import fs from 'fs';
import path from 'path';

import { buildTokensCss } from './tokensCss';

const TOKENS_PATH = path.resolve(__dirname, '../../../docs/design/canvas/project/tokens.css');

describe('design tokens', () => {
  it('canvas tokens.css matches theme.ts', () => {
    const expected = buildTokensCss();

    if (process.env.DESIGN_WRITE === '1') {
      fs.writeFileSync(TOKENS_PATH, expected);
      return;
    }

    const actual = fs.readFileSync(TOKENS_PATH, 'utf8');
    if (actual !== expected) {
      console.error('Canvas tokens.css is out of date with theme.ts: run `yarn design:tokens`.');
    }
    expect(actual).toBe(expected);
  });
});
