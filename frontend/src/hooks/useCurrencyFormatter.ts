import { useTranslation } from 'react-i18next';

import { useCurrency } from '@/contexts/SettingsContext';

function resolveLocale(language: string) {
  if (language.startsWith('fi')) {
    return 'fi-FI';
  }

  return 'en-US';
}

export function useCurrencyFormatter() {
  const { i18n } = useTranslation();
  const currency = useCurrency();

  const formatter = new Intl.NumberFormat(resolveLocale(i18n.language), {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });

  return (amount: number) => formatter.format(amount);
}
