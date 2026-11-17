// Test-only: an in-memory database with the real migrations applied, driven by
// Drizzle's expo-sqlite driver on top of Node's built-in SQLite.
import fs from 'fs';
import path from 'path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as schema from '@/db/schema';
import journal from '@/db/migrations/meta/_journal.json';

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

// The subset of expo-sqlite's SQLiteDatabase that drizzle-orm/expo-sqlite calls.
function toExpoClient(sqlite: DatabaseSync) {
  return {
    prepareSync(source: string) {
      const statement = sqlite.prepare(source);
      const isReader = statement.columns().length > 0;

      const execute = (params: SQLInputValue[], asArrays: boolean) => {
        if (!isReader) {
          const { changes, lastInsertRowid } = statement.run(...params);
          return {
            changes,
            lastInsertRowId: lastInsertRowid,
            getAllSync: () => [],
            getFirstSync: () => null,
          };
        }
        statement.setReturnArrays(asArrays);
        const rows = statement.all(...params);
        return {
          changes: 0,
          lastInsertRowId: 0,
          getAllSync: () => rows,
          getFirstSync: () => rows[0] ?? null,
        };
      };

      return {
        executeSync: (params: SQLInputValue[]) => execute(params, false),
        executeForRawResultSync: (params: SQLInputValue[]) => execute(params, true),
      };
    },
  };
}

// `until` stops after that migration tag; call `migrate()` later to apply the rest.
export function createTestDb({ until }: { until?: string } = {}) {
  const sqlite = new DatabaseSync(':memory:');
  // Same as the app (db/storage.ts): enforce foreign keys from the start.
  sqlite.exec('PRAGMA foreign_keys = ON');
  let applied = 0;

  const migrate = (stopAfter?: string) => {
    for (const entry of journal.entries.slice(applied)) {
      // `--> statement-breakpoint` is an SQL comment, so whole files can run as-is.
      sqlite.exec(fs.readFileSync(path.join(MIGRATIONS_DIR, `${entry.tag}.sql`), 'utf8'));
      applied += 1;
      if (entry.tag === stopAfter) {
        break;
      }
    }
  };

  migrate(until);

  return {
    sqlite,
    db: drizzle(toExpoClient(sqlite) as never, { schema }),
    migrate,
  };
}

export type TestDb = ReturnType<typeof createTestDb>;
