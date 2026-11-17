import { useTranslation } from 'react-i18next';

import { useCurrency } from '@/contexts/SettingsContext';
import type { CurrencyCode } from '@/types/Currency';

export function resolveLocale(language: string) {
  if (language.startsWith('fi')) {
    return 'fi-FI';
  }

  if (language.startsWith('ru')) {
    return 'ru-RU';
  }

  return 'en-US';
}

/** Formats whole cents as money, e.g. 1250 EUR in `en-US` → `€12.50`. */
export function formatCents(cents: number, currency: CurrencyCode, locale: string) {
  return new Intl.NumberFormat(
    locale,
    { style: 'currency', currency, minimumFractionDigits: 2 },
  ).format(cents / 100);
}

/** Returns a formatter for amounts in cents, in the app language and selected currency. */
export function useCurrencyFormatter() {
  const { i18n } = useTranslation();
  const defaultCurrency = useCurrency();
  const locale = resolveLocale(i18n.language);

  return (cents: number, currency: CurrencyCode = defaultCurrency) =>
    formatCents(cents, currency, locale);
}
