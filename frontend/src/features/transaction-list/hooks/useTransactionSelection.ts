import { useCallback, useEffect, useMemo, useState } from 'react';

const NONE: ReadonlySet<string> = new Set();

export function useTransactionSelection(visibleIds: readonly string[]) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(NONE);

  useEffect(() => {
    setSelectedIds((current) => {
      if (current.size === 0) {
        return current;
      }
      const visible = new Set(visibleIds);
      const kept = [...current].filter((id) => visible.has(id));
      return kept.length === current.size ? current : new Set(kept);
    });
  }, [visibleIds]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectedIds(NONE), []);
  const selectAll = useCallback(() => setSelectedIds(new Set(visibleIds)), [visibleIds]);

  return useMemo(() => ({
    selectedIds,
    selecting: selectedIds.size > 0,
    allSelected: visibleIds.length > 0 && selectedIds.size === visibleIds.length,
    toggle,
    selectAll,
    clear,
  }), [clear, selectAll, selectedIds, toggle, visibleIds.length]);
}
