import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import * as schema from './schema';
import migrations from './migrations/migrations';

const sqliteDb = SQLite.openDatabaseSync('korob.db');

export const db = drizzle(sqliteDb, { schema });
export type DbClient = typeof db;

export const initDb = async (): Promise<void> => {
  await migrate(db, migrations);
};
