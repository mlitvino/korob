import { renderHook } from '@testing-library/react-native';

import { useListFilters } from '@/features/transaction-list/hooks/useListFilters';

let mockParams: { filter?: string; period?: string } = {};
const mockSetParams = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  router: { setParams: (params: object) => mockSetParams(params) },
}));

describe('useListFilters', () => {
  beforeEach(() => {
    mockParams = {};
    mockSetParams.mockClear();
  });

  it('starts at all time and every type without a link', () => {
    const { result } = renderHook(() => useListFilters());

    expect(result.current.filter).toBe('all');
    expect(result.current.period.mode).toBe('all');
    expect(mockSetParams).not.toHaveBeenCalled();
  });

  it('uses a Home link from the very first render, so the full list never flashes', () => {
    mockParams = { filter: 'expense', period: 'week' };
    const renders: { filter: string; mode: string }[] = [];

    renderHook(() => {
      const filters = useListFilters();
      renders.push({ filter: filters.filter, mode: filters.period.mode });
      return filters;
    });

    expect(renders[0]).toEqual({ filter: 'expense', mode: 'week' });
    expect(mockSetParams).toHaveBeenCalledWith({ filter: undefined, period: undefined });
  });

  it('ignores unknown values in a link', () => {
    mockParams = { filter: 'refunds', period: 'banana' };
    const { result } = renderHook(() => useListFilters());

    expect(result.current.filter).toBe('all');
    expect(result.current.period.mode).toBe('all');
  });
});
