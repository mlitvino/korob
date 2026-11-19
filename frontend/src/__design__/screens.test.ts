import fs from 'fs';
import path from 'path';

import { BLOCK_NAMES, PROJECT, readBlock, renderBoard, usesBlock } from './screenBlocks';

/** Boards that do not resolve the global theme themselves. */
const EXEMPT = [
  'GlobalTheme.dc.html', // where the theme is chosen
  'AddIncome.dc.html', // wraps AddExpense and passes its theme through
];

type BoardMeta = { page: string; is_interactive?: boolean };

const write = process.env.DESIGN_WRITE === '1';
const read = (board: string) => fs.readFileSync(path.join(PROJECT, board), 'utf8');
const boards = fs.readdirSync(PROJECT).filter((file) => file.endsWith('.dc.html'));
const canvas = JSON.parse(read('canvas.json')) as { boards: Record<string, BoardMeta> };

describe.each(BLOCK_NAMES)('generated block %s', (name) => {
  it('is identical in every board that uses it', () => {
    const body = readBlock(name);
    const stale: string[] = [];

    for (const board of boards) {
      const source = read(board);
      if (!usesBlock(source, name)) {
        continue;
      }
      const expected = renderBoard(source, name, body);
      if (write) {
        fs.writeFileSync(path.join(PROJECT, board), expected);
      } else if (source !== expected) {
        stale.push(board);
      }
    }

    expect({ block: name, outOfDate: stale }).toEqual({ block: name, outOfDate: [] });
  });
});

it('every interactive screen follows the global theme', () => {
  const missing = Object.entries(canvas.boards)
    .filter(([board, meta]) => (
      meta.page === 'screens' && meta.is_interactive && !EXEMPT.includes(board)
    ))
    .map(([board]) => board)
    .filter((board) => !usesBlock(read(board), 'global-theme'));

  expect(missing).toEqual([]);
});
