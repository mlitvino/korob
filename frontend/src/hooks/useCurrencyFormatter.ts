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

export function useCurrencyFormatter() {
  const { i18n } = useTranslation();
  const defaultCurrency = useCurrency();
  const locale = resolveLocale(i18n.language);

  return (amount: number, currency: CurrencyCode = defaultCurrency) => new Intl.NumberFormat(
    locale,
    { style: 'currency', currency, minimumFractionDigits: 2 },
  ).format(amount);
}
