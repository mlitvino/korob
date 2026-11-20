import fs from 'fs';
import path from 'path';

import { PROJECT } from './screenBlocks';

/** Documentation boards style themselves; the checks below are for product boards. */
const DOC_BOARDS = /^(Comp|Colors|Typography|SpacingRadius|GlobalTheme)/;
/** Flag artwork keeps its own colors. */
const ARTWORK = ['SettingsRow.dc.html'];

const productBoards = fs.readdirSync(PROJECT)
  .filter((file) => file.endsWith('.dc.html') && !DOC_BOARDS.test(file))
  .filter((file) => !ARTWORK.includes(file));

const styledLines = (board: string) => fs.readFileSync(path.join(PROJECT, board), 'utf8')
  .split('\n')
  .filter((line) => !line.includes('data-props'));

describe('product boards take colors from tokens', () => {
  it.each(productBoards)('%s has no hex or rgba() colors', (board) => {
    const colors = /#[0-9a-f]{3,8}\b|rgba?\(/gi;
    const raw = styledLines(board).flatMap((line) => line.match(colors) ?? []);

    expect(raw).toEqual([]);
  });
});
