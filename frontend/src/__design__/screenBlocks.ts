import fs from 'fs';
import path from 'path';

const CANVAS = path.resolve(__dirname, '../../../docs/design/canvas');

export const PROJECT = path.join(CANVAS, 'project');
export const BLOCKS = path.join(CANVAS, 'blocks');

/** Shared code that every board carries its own copy of (boards cannot import scripts). */
export const BLOCK_NAMES = ['global-theme', 'category-names'] as const;
export type BlockName = (typeof BLOCK_NAMES)[number];

const region = (name: BlockName) => new RegExp(
  `(^[ \\t]*// <generated:${name}>[^\\n]*\\n)[\\s\\S]*?(^[ \\t]*// </generated:${name}>)`,
  'm',
);

export const usesBlock = (source: string, name: BlockName) => region(name).test(source);

/** Returns the board source with the text between the markers replaced by the template. */
export function renderBoard(source: string, name: BlockName, body: string): string {
  return source.replace(
    region(name),
    (_all, open: string, close: string) => `${open}${body}${close}`,
  );
}

/** Template text, ending in a newline so it sits flush against the closing marker. */
export const readBlock = (name: BlockName) =>
  `${fs.readFileSync(path.join(BLOCKS, `${name}.block`), 'utf8').trimEnd()}\n`;
