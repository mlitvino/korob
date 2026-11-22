import { act, renderHook } from '@testing-library/react-native';

import { useTransactionSelection } from '@/features/transaction-list/hooks/useTransactionSelection';

const setup = (initial: string[]) => renderHook(
  ({ ids }: { ids: string[] }) => useTransactionSelection(ids),
  { initialProps: { ids: initial } },
);

describe('useTransactionSelection', () => {
  it('starts with the first toggle and ends when the last row is unselected', () => {
    const { result } = setup(['a', 'b']);
    expect(result.current.selecting).toBe(false);

    act(() => result.current.toggle('a'));
    expect(result.current.selecting).toBe(true);
    act(() => result.current.toggle('a'));
    expect(result.current.selecting).toBe(false);
  });

  it('selects every visible row, then reports all selected', () => {
    const { result } = setup(['a', 'b', 'c']);

    act(() => result.current.selectAll());
    expect([...result.current.selectedIds]).toEqual(['a', 'b', 'c']);
    expect(result.current.allSelected).toBe(true);
    act(() => result.current.clear());
    expect(result.current.selecting).toBe(false);
  });

  it('drops rows that are no longer visible, so hidden rows are never deleted', () => {
    const { result, rerender } = setup(['a', 'b', 'c']);
    act(() => result.current.selectAll());

    rerender({ ids: ['b'] });
    expect([...result.current.selectedIds]).toEqual(['b']);

    rerender({ ids: ['a', 'b', 'c'] });
    expect([...result.current.selectedIds]).toEqual(['b']);
    expect(result.current.allSelected).toBe(false);
  });
});
