import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import {
  isTypeFilter,
  type FilterType,
} from '@/features/transaction-list/hooks/useFilteredTransactions';
import { usePeriodSelection } from '@/features/transaction-list/hooks/usePeriodSelection';
import { isCalendarPeriod } from '@/utils/period';

type LinkParams = { filter?: string; period?: string };

const parseLink = ({ filter, period }: LinkParams) => ({
  filter: isTypeFilter(filter) ? filter : null,
  period: isCalendarPeriod(period) ? period : null,
});

/**
 * Type filter and period of the list. A link from Home (`filter`, `period` params) sets them,
 * from the first render on; the params are then cleared so the same link applies again.
 */
export function useListFilters() {
  const { filter: filterParam, period: periodParam } = useLocalSearchParams<LinkParams>();
  const initial = parseLink({ filter: filterParam, period: periodParam });
  const [filter, setFilter] = useState<FilterType>(initial.filter ?? 'all');
  const period = usePeriodSelection(initial.period ?? 'all');
  const { showCurrent } = period;

  useEffect(() => {
    if (!filterParam && !periodParam) {
      return;
    }
    const link = parseLink({ filter: filterParam, period: periodParam });
    if (link.filter) {
      setFilter(link.filter);
    }
    if (link.period) {
      showCurrent(link.period);
    }
    router.setParams({ filter: undefined, period: undefined });
  }, [filterParam, periodParam, showCurrent]);

  return { filter, setFilter, period };
}
