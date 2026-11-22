import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { loadJson, saveJson, STORAGE_KEYS } from '@/storage/persist';
import { CHANGELOG, type Release } from '../changelog';

// When a second shared persisted value appears, extract this store into a
// `usePersistedValue(key)` hook in `storage/` and use it in both places.
/** Module-level so the drawer label and the Updates screen see the same value. */
type State = { loaded: boolean; lastSeen: string | null };

let state: State = { loaded: false, lastSeen: null };
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

const setState = (next: State) => {
  state = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const load = () => {
  loading ??= (async () => {
    let lastSeen: string | null = null;
    try {
      const stored = await loadJson<unknown>(STORAGE_KEYS.lastSeenUpdate);
      lastSeen = typeof stored === 'string' ? stored : null;
    } catch (error) {
      console.warn('Failed to load last seen update', error);
    }
    // markSeen before the load finished wins
    setState({ loaded: true, lastSeen: state.lastSeen ?? lastSeen });
  })();
  return loading;
};

/** Forgets the in-memory value (tests only). */
export const resetLastSeenUpdate = () => {
  loading = null;
  state = { loaded: false, lastSeen: null };
};

/** Whether the changelog has a release the user has not opened yet. */
export function useUnseenUpdates(changelog: Release[] = CHANGELOG) {
  const { loaded, lastSeen } = useSyncExternalStore(subscribe, () => state);
  const latestId = changelog[0]?.id ?? null;

  useEffect(() => {
    void load();
  }, []);

  const markSeen = useCallback(() => {
    if (!latestId) {
      return;
    }
    setState({ loaded: true, lastSeen: latestId });
    saveJson(STORAGE_KEYS.lastSeenUpdate, latestId).catch((error) => {
      console.warn('Failed to save last seen update', error);
    });
  }, [latestId]);

  return { hasUnseen: loaded && latestId !== null && lastSeen !== latestId, markSeen };
}
