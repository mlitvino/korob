import { useTranslation } from 'react-i18next';

import { formatTimeInput, uses12HourClock } from '@/utils/dateTime';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { useCategoryById } from '@/queries/categories';
import type { Transaction } from '@/types/Transaction';

export function useTransactionText(transaction: Transaction) {
  const { i18n } = useTranslation();
  const categoryById = useCategoryById();
  const nameOf = useCategoryName();
  const formatCurrency = useCurrencyFormatter();
  const category = categoryById(transaction.categoryId);
  const sign = transaction.type === 'income' ? '+' : '−';

  return {
    amount: `${sign}${formatCurrency(transaction.amountCents, transaction.currency)}`,
    category: category ? nameOf(category) : '',
    time: formatTimeInput(new Date(transaction.occurredAt), uses12HourClock(i18n.language)),
  };
}
