import { inject } from 'vue';
import { DatabaseService, Product } from '@/services/DatabaseService';
import { SQLiteHook } from 'vue-sqlite-hook/dist';

let dbInstance: DatabaseService | null = null;

export function useDatabase(): DatabaseService {
  if (dbInstance) {
    return dbInstance;
  }

  const sqlite = inject<SQLiteHook>('$sqlite');

  if (!sqlite) {
    throw new Error('SQLite not provided. Make sure to provide $sqlite in your app.');
  }

  dbInstance = new DatabaseService(sqlite);
  return dbInstance;
}

export type { Product };
