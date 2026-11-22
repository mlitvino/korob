import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { STORAGE_KEYS } from '@/storage/persist';
import type { Release } from '../../changelog';
import { resetLastSeenUpdate, useUnseenUpdates } from '../useUnseenUpdates';

const release = (id: string): Release => ({
  id, date: id, features: [{ title: 't', howTo: 'h' }],
});
const OLD = [release('2026-11-01')];
const NEW = [release('2026-11-23'), release('2026-11-01')];

beforeEach(async () => {
  await AsyncStorage.clear();
  resetLastSeenUpdate();
});

describe('useUnseenUpdates', () => {
  it('is unseen when nothing is stored', async () => {
    const { result } = renderHook(() => useUnseenUpdates(OLD));
    await waitFor(() => expect(result.current.hasUnseen).toBe(true));
  });

  it('is seen after markSeen, and stores the id', async () => {
    const { result } = renderHook(() => useUnseenUpdates(OLD));
    await waitFor(() => expect(result.current.hasUnseen).toBe(true));
    await act(async () => result.current.markSeen());
    expect(result.current.hasUnseen).toBe(false);
    expect(await AsyncStorage.getItem(STORAGE_KEYS.lastSeenUpdate))
      .toBe(JSON.stringify('2026-11-01'));
  });

  it('is seen when the stored id is the latest', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.lastSeenUpdate, JSON.stringify('2026-11-23'));
    const { result } = renderHook(() => useUnseenUpdates(NEW));
    await waitFor(() => expect(result.current.hasUnseen).toBe(false));
  });

  it('is unseen again when a newer release appears', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.lastSeenUpdate, JSON.stringify('2026-11-01'));
    const { result } = renderHook(() => useUnseenUpdates(NEW));
    await waitFor(() => expect(result.current.hasUnseen).toBe(true));
  });

  it('shares the seen state between hook instances', async () => {
    const a = renderHook(() => useUnseenUpdates(OLD));
    const b = renderHook(() => useUnseenUpdates(OLD));
    await waitFor(() => expect(a.result.current.hasUnseen).toBe(true));
    await act(async () => a.result.current.markSeen());
    expect(b.result.current.hasUnseen).toBe(false);
  });
});
