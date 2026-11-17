const AMOUNT_PATTERN = /^(\d*)(?:[.,](\d{0,2}))?$/;

/** Parses user input like `12`, `12,5` or `.99` into whole cents; null if invalid or zero. */
export function parseAmount(input: string): number | null {
  const match = AMOUNT_PATTERN.exec(input.trim());
  if (!match) {
    return null;
  }

  const [, whole, fraction = ''] = match;
  if (!whole && !fraction) {
    return null;
  }

  const cents = Number(whole || '0') * 100 + Number(fraction.padEnd(2, '0'));
  return cents > 0 ? cents : null;
}
