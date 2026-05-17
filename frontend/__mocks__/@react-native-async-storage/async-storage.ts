type Storage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
};

const store = new Map<string, string>();

const AsyncStorage: Storage = {
  getItem: async (key) => store.get(key) ?? null,
  setItem: async (key, value) => {
    store.set(key, value);
  },
  removeItem: async (key) => {
    store.delete(key);
  },
  clear: async () => {
    store.clear();
  },
};

export default AsyncStorage;
export const getItem = AsyncStorage.getItem;
export const setItem = AsyncStorage.setItem;
export const removeItem = AsyncStorage.removeItem;
export const clear = AsyncStorage.clear;
