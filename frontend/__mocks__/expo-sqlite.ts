const mockStatement = () => ({
  executeSync: () => ({
    getAllSync: () => [],
    getFirstSync: () => null,
    runSync: () => ({ lastInsertRowId: 0, changes: 0 }),
  }),
  finalizeSync: () => {},
});

const mockDb = () => ({
  execSync: () => {},
  prepareSync: () => mockStatement(),
  closeSync: () => {},
});

export const openDatabaseSync = () => mockDb();
export const openDatabaseAsync = async () => mockDb();
export const deleteDatabaseAsync = async () => {};
