import fs from 'fs';
import path from 'path';

type Contract = {
  code: string[];
  shared: string[];
  canvasOnly: string[];
  codeOnly: string[];
};

const REPO = path.resolve(__dirname, '../../..');
const CANVAS = path.join(REPO, 'docs/design/canvas/project');

const { components } = JSON.parse(
  fs.readFileSync(path.join(REPO, 'docs/design/components.json'), 'utf8'),
) as { components: Record<string, Contract> };

const canvasIndex = JSON.parse(fs.readFileSync(path.join(CANVAS, 'canvas.json'), 'utf8')) as {
  boards: Record<string, { page?: string }>;
};

/** Primitive boards: the Components page minus the `Comp*` overview boards. */
const primitives = Object.entries(canvasIndex.boards)
  .filter(([file, board]) => board.page === 'components' && !file.startsWith('Comp'))
  .map(([file]) => file.replace(/\.dc\.html$/, ''));

/** Prop names declared in a board's `data-props` (single- or entity-quoted). */
const boardProps = (name: string) => {
  const html = fs.readFileSync(path.join(CANVAS, `${name}.dc.html`), 'utf8');
  const match = html.match(/data-props=(['"])([\s\S]*?)\1/);
  if (!match) return [];
  const json = match[2].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  return Object.keys(JSON.parse(json)).filter((key) => !key.startsWith('$'));
};

describe('canvas ↔ code component contracts', () => {
  it('every canvas primitive has a contract', () => {
    expect(primitives.filter((name) => !components[name])).toEqual([]);
  });

  it('every contract points to a canvas primitive', () => {
    expect(Object.keys(components).filter((name) => !primitives.includes(name))).toEqual([]);
  });

  it.each(Object.entries(components))('%s maps to existing code files', (_, contract) => {
    expect(contract.code.filter((file) => !fs.existsSync(path.join(REPO, file)))).toEqual([]);
  });

  it.each(Object.entries(components))('%s canvas props are all listed', (name, contract) => {
    const listed = [...contract.shared, ...contract.canvasOnly];
    expect(boardProps(name).filter((prop) => !listed.includes(prop))).toEqual([]);
    expect(contract.shared.filter((prop) => !boardProps(name).includes(prop))).toEqual([]);
  });

  it.each(Object.entries(components))('%s shared props exist in code', (_, contract) => {
    const source = contract.code.map((file) => fs.readFileSync(path.join(REPO, file), 'utf8')).join('\n');
    expect(contract.shared.filter((prop) => !new RegExp(`\\b${prop}\\b`).test(source))).toEqual([]);
  });
});
