import { parseAmount } from '@/features/transaction-form/utils/amount';

describe('parseAmount', () => {
  it.each([
    ['12', 12],
    ['12.5', 12.5],
    ['12,5', 12.5],
    ['12,50', 12.5],
    ['0,99', 0.99],
    [',5', 0.5],
    ['.5', 0.5],
    ['12.', 12],
    ['12,', 12],
    ['  7,25 ', 7.25],
  ])('parses %p as %p', (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each(['', ' ', '0', '0,00', '-5', 'abc', '12,5,3', '1.2.3', '1,000.50', '1 000', ',', '.'])(
    'rejects %p',
    (input) => {
      expect(parseAmount(input)).toBeNull();
    },
  );
});
