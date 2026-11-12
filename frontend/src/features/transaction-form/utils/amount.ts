const AMOUNT_PATTERN = /^(\d+[.,]?\d*|[.,]\d+)$/;

export function parseAmount(input: string) {
  const trimmed = input.trim();
  if (!AMOUNT_PATTERN.test(trimmed)) {
    return null;
  }

  const value = Number(trimmed.replace(',', '.'));
  return value > 0 ? value : null;
}
