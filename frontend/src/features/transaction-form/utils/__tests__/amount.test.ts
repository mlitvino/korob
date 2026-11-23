import { parseAmount } from '@/features/transaction-form/utils/amount';

describe('parseAmount', () => {
  it.each([
    ['12', 1200],
    ['12.5', 1250],
    ['12,5', 1250],
    ['12,50', 1250],
    ['0,99', 99],
    ['0.29', 29],
    [',5', 50],
    ['.5', 50],
    ['12.', 1200],
    ['12,', 1200],
    ['  7,25 ', 725],
    ['1234567.89', 123456789],
  ])('parses %p as %p cents', (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each([
    '',
    ' ',
    '0',
    '0,00',
    '-5',
    'abc',
    '12,5,3',
    '1.2.3',
    '1,000.50',
    '1 000',
    ',',
    '.',
    '12.345',
    '0,001',
  ])(
    'rejects %p',
    (input) => {
      expect(parseAmount(input)).toBeNull();
    },
  );
});
