import { useCallback, useEffect, useRef, useState } from 'react';

import { loadJson, saveJson } from '@/storage/persist';

/**
 * State backed by AsyncStorage. Saves only after the stored value has loaded,
 * so the initial value never overwrites it.
 * Returns `[value, setValue, isHydrated]`.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T),
  isValid: (value: unknown) => value is T,
): [T, (next: T) => void, boolean] {
  const [value, setValueState] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  /** Set when the caller changes the value before loading finished; that change wins. */
  const changedBeforeLoad = useRef(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const stored = await loadJson<unknown>(key);
        if (isActive && !changedBeforeLoad.current && isValid(stored)) {
          setValueState(stored);
        }
      } catch (error) {
        console.warn(`Failed to load ${key}`, error);
      } finally {
        if (isActive) {
          setIsHydrated(true);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
    // `isValid` is a type guard; it is not expected to change between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    void saveJson(key, value).catch((error) => console.warn(`Failed to save ${key}`, error));
  }, [key, value, isHydrated]);

  const setValue = useCallback((next: T) => {
    changedBeforeLoad.current = true;
    setValueState(next);
  }, []);

  return [value, setValue, isHydrated];
}
