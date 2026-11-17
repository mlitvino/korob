import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { usePersistedState } from '@/hooks/usePersistedState';

const KEY = 'test.value';
const isString = (value: unknown): value is string => typeof value === 'string';

describe('usePersistedState', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loads the stored value and only then reports hydrated', async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify('stored'));
    const { result } = renderHook(() => usePersistedState(KEY, 'default', isString));

    expect(result.current[0]).toBe('default');
    expect(result.current[2]).toBe(false);
    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(result.current[0]).toBe('stored');
  });

  it('ignores stored values that fail validation', async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify(42));
    const { result } = renderHook(() => usePersistedState(KEY, 'default', isString));

    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(result.current[0]).toBe('default');
  });

  it('keeps a change made before loading finished and saves it', async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify('stored'));
    const { result } = renderHook(() => usePersistedState(KEY, 'default', isString));

    act(() => result.current[1]('picked'));

    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(result.current[0]).toBe('picked');
    await waitFor(async () => {
      expect(await AsyncStorage.getItem(KEY)).toBe(JSON.stringify('picked'));
    });
  });
});
