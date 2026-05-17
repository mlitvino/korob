import type { Transaction } from '../types/Transaction';

const STORAGE_KEY = 'korob:transactions';

const loadFromStorage = (): Transaction[] => {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Array<Omit<Transaction, 'createdAt'> & { createdAt: string }>;
    return parsed.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (error) {
    console.warn('Failed to load transactions from localStorage', error);
    return [];
  }
};

const saveToStorage = (items: Transaction[]): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    const payload = items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to save transactions to localStorage', error);
  }
};

let inMemoryTransactions: Transaction[] = loadFromStorage();

export const TransactionsRepo = {
  async list(): Promise<Transaction[]> {
    return [...inMemoryTransactions].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  async getById(id: string): Promise<Transaction | null> {
    const found = inMemoryTransactions.find((item) => item.id === id);
    return found ?? null;
  },

  async insert(input: Transaction): Promise<void> {
    inMemoryTransactions = [
      input,
      ...inMemoryTransactions.filter((item) => item.id !== input.id),
    ];
    saveToStorage(inMemoryTransactions);
  },

  async deleteById(id: string): Promise<void> {
    inMemoryTransactions = inMemoryTransactions.filter((item) => item.id !== id);
    saveToStorage(inMemoryTransactions);
  },

  async clear(): Promise<void> {
    inMemoryTransactions = [];
    saveToStorage(inMemoryTransactions);
  },
};
