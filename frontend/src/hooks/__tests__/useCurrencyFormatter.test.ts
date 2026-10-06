import { resolveLocale } from '@/hooks/useCurrencyFormatter';

describe('resolveLocale', () => {
  it.each([
    ['en', 'en-US'],
    ['fi', 'fi-FI'],
    ['ru', 'ru-RU'],
    ['ru-RU', 'ru-RU'],
    ['de', 'en-US'],
  ])('maps %s to %s', (language, expected) => {
    expect(resolveLocale(language)).toBe(expected);
  });
});
