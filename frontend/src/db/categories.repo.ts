import { and, asc, eq, isNull, max } from 'drizzle-orm';
import uuid from 'react-native-uuid';

import type { Category } from '../types/Category';
import type { TransactionType } from '../types/Transaction';
import { categories, transactions, type SelectCategory } from './schema';
import { db } from './storage';

const toDomain = (row: SelectCategory): Category => {
  const base = {
    id: row.id,
    type: row.type,
    sortOrder: row.sortOrder,
    archivedAt: row.archivedAt === null ? null : new Date(row.archivedAt),
  };

  if (row.key !== null) {
    return { ...base, key: row.key, name: null };
  }
  if (row.name !== null) {
    return { ...base, key: null, name: row.name };
  }
  throw new Error(`Category ${row.id} has neither a key nor a name`);
};

const normalizeName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Category name must not be empty');
  }
  return trimmed;
};

export const CategoriesRepo = {
  async list(): Promise<Category[]> {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.type), asc(categories.sortOrder));
    return rows.map(toDomain);
  },

  async create(type: TransactionType, name: string): Promise<Category> {
    const [{ lastOrder }] = await db
      .select({ lastOrder: max(categories.sortOrder) })
      .from(categories)
      .where(eq(categories.type, type));

    const row: SelectCategory = {
      id: String(uuid.v4()),
      type,
      key: null,
      name: normalizeName(name),
      sortOrder: (lastOrder ?? -1) + 1,
      archivedAt: null,
    };
    await db.insert(categories).values(row);
    return toDomain(row);
  },

  async rename(id: string, name: string): Promise<Category> {
    const nextName = normalizeName(name);

    return db.transaction((tx) => {
      const row = tx.select().from(categories).where(eq(categories.id, id)).get();
      if (!row || row.archivedAt !== null) {
        throw new Error(`Category ${id} does not exist or is archived`);
      }

      if (row.key === null) {
        tx.update(categories).set({ name: nextName }).where(eq(categories.id, id)).run();
        return toDomain({ ...row, name: nextName });
      }

      const now = Date.now();
      const replacement: SelectCategory = {
        id: String(uuid.v4()),
        type: row.type,
        key: null,
        name: nextName,
        sortOrder: row.sortOrder,
        archivedAt: null,
      };

      tx.insert(categories).values(replacement).run();
      tx.update(transactions)
        .set({ categoryId: replacement.id, updatedAt: now })
        .where(eq(transactions.categoryId, id))
        .run();
      tx.update(categories).set({ archivedAt: now }).where(eq(categories.id, id)).run();

      return toDomain(replacement);
    });
  },

  async archive(id: string): Promise<void> {
    await db
      .update(categories)
      .set({ archivedAt: Date.now() })
      .where(and(eq(categories.id, id), isNull(categories.archivedAt)));
  },
};
