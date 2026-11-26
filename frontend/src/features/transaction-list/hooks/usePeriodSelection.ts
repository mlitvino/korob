import { useCallback, useMemo, useState } from 'react';

import {
  periodBounds,
  rangeBounds,
  shiftDate,
  type Bounds,
  type CalendarPeriod,
  type PeriodMode,
} from '@/utils/period';

export function usePeriodSelection(initialMode: CalendarPeriod | 'all' = 'all') {
  const [mode, setMode] = useState<PeriodMode>(initialMode);
  /** Date the day, week, month and year modes are built around; kept across mode changes. */
  const [anchor, setAnchor] = useState(() => new Date());
  const [range, setRange] = useState<Bounds | null>(null);

  const bounds = useMemo(() => {
    if (mode === 'all') {
      return null;
    }
    return mode === 'range' ? range : periodBounds(mode, anchor);
  }, [anchor, mode, range]);

  const select = useCallback((next: CalendarPeriod | 'all') => setMode(next), []);

  const showCurrent = useCallback((next: CalendarPeriod) => {
    setAnchor(new Date());
    setMode(next);
  }, []);

  const step = useCallback((steps: number) => {
    if (mode !== 'all' && mode !== 'range') {
      setAnchor((current) => shiftDate(mode, current, steps));
    }
  }, [mode]);

  const pickRange = useCallback((first: Date, last: Date) => {
    setRange(rangeBounds(first, last));
    setMode('range');
  }, []);

  return { mode, anchor, bounds, select, showCurrent, step, pickDate: setAnchor, pickRange };
}
