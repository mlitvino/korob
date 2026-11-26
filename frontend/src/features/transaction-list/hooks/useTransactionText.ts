import { useTranslation } from 'react-i18next';

import { useCurrency } from '@/contexts/SettingsContext';
import { convertCents } from '@/utils/currency';
import { formatTimeInput, uses12HourClock } from '@/utils/dateTime';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useCategoryById } from '@/queries/categories';
import { useExchangeRates } from '@/queries/exchangeRates';
import type { Transaction } from '@/types/Transaction';

export function useTransactionText(transaction: Transaction) {
  const { i18n } = useTranslation();
  const categoryById = useCategoryById();
  const nameOf = useCategoryName();
  const formatCurrency = useCurrencyFormatter();
  const currency = useCurrency();
  const rates = useExchangeRates();
  const category = categoryById(transaction.categoryId);
  const sign = transaction.type === 'income' ? '+' : '−';

  const entered = formatCurrency(transaction.amountCents, transaction.currency);
  // without a rate the amount stays as entered, in its own currency
  const converted = convertCents(transaction.amountCents, transaction.currency, currency, rates);
  const shown = converted === null ? entered : formatCurrency(converted);

  return {
    amount: `${sign}${shown}`,
    /** The entered amount, only when `amount` shows it in another currency. */
    entered: shown === entered ? null : entered,
    category: category ? nameOf(category) : '',
    time: formatTimeInput(new Date(transaction.occurredAt), uses12HourClock(i18n.language)),
  };
}
