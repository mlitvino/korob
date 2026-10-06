type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

let asyncStorage: StorageLike | null = null;

const getAsyncStorage = (): StorageLike | null => {
  if (asyncStorage) {
    return asyncStorage;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-async-storage/async-storage');
    asyncStorage = (mod.default ?? mod) as StorageLike;
    return asyncStorage;
  } catch (error) {
    console.error('AsyncStorage module is not available.', error);
    return null;
  }
};

const getStorage = (): StorageLike => {
  const storage = getAsyncStorage();
  if (!storage) {
    const message = 'AsyncStorage is not available.'
      + 'Make sure @react-native-async-storage/async-storage is installed and linked.';
    console.error(message);
    throw new Error(message);
  }

  return storage;
};

export const STORAGE_KEYS = {
  currency: 'settings.currency',
  language: 'settings.language',
  theme: 'settings.theme',
} as const;

export const loadJson = async <T>(key: string): Promise<T | null> => {
  const storage = getStorage();
  const raw = await storage.getItem(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error('Failed to parse storage payload for key:', key, error);
    throw error;
  }
};

export const saveJson = async <T>(key: string, value: T): Promise<void> => {
  const storage = getStorage();
  try {
    await storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save storage payload for key:', key, error);
    throw error;
  }
};

export const remove = async (key: string): Promise<void> => {
  const storage = getStorage();
  try {
    await storage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove storage payload for key:', key, error);
    throw error;
  }
};
