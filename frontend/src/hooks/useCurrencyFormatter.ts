import { useCurrency } from '@/contexts/SettingsContext';
import { useLocale } from '@/hooks/useLocale';
import type { CurrencyCode } from '@/types/Currency';

/** Formats whole cents as money, e.g. 1250 EUR in `en-US` → `€12.50`. */
export function formatCents(cents: number, currency: CurrencyCode, locale: string) {
  return new Intl.NumberFormat(
    locale,
    { style: 'currency', currency, minimumFractionDigits: 2 },
  ).format(cents / 100);
}

/** Returns a formatter for amounts in cents, in the app language and selected currency. */
export function useCurrencyFormatter() {
  const defaultCurrency = useCurrency();
  const locale = useLocale();

  return (cents: number, currency: CurrencyCode = defaultCurrency) =>
    formatCents(cents, currency, locale);
}
