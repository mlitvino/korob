import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { memoizeUntilFailure } from './memoizeUntilFailure';
import * as schema from './schema';
import migrations from './migrations/migrations';

export const sqliteDb = SQLite.openDatabaseSync('korob.db');
sqliteDb.execSync('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqliteDb, { schema });
export type DbClient = typeof db;

/** A failed migration is not cached, so a retry runs it again. */
export const initDb = memoizeUntilFailure(() => migrate(db, migrations));
