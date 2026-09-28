import type { Transaction } from '@/types/Transaction';

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export const mockTransactions: Transaction[] = [
  {
    id: 'seed-salary',
    type: 'income',
    category: 'salary',
    amount: 2500,
    createdAt: daysAgo(28),
    description: 'Monthly salary',
  },
  {
    id: 'seed-freelance',
    type: 'income',
    category: 'freelance',
    amount: 350,
    createdAt: daysAgo(20),
    description: 'Freelance project',
  },
  {
    id: 'seed-housing',
    type: 'expense',
    category: 'housing',
    amount: 900,
    createdAt: daysAgo(27),
    description: 'Rent',
  },
  {
    id: 'seed-food-1',
    type: 'expense',
    category: 'food',
    amount: 65,
    createdAt: daysAgo(15),
    description: 'Groceries',
  },
  {
    id: 'seed-transport',
    type: 'expense',
    category: 'transport',
    amount: 40,
    createdAt: daysAgo(12),
    description: 'Bus pass',
  },
  {
    id: 'seed-entertainment',
    type: 'expense',
    category: 'entertainment',
    amount: 25,
    createdAt: daysAgo(8),
    description: 'Cinema',
  },
  {
    id: 'seed-shopping',
    type: 'expense',
    category: 'shopping',
    amount: 120,
    createdAt: daysAgo(5),
    description: 'New shoes',
  },
  {
    id: 'seed-food-2',
    type: 'expense',
    category: 'food',
    amount: 42,
    createdAt: daysAgo(2),
    description: 'Restaurant',
  },
];
