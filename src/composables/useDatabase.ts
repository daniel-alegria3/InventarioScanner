import { inject } from "vue";
import { DatabaseService, Product } from "@/services/DatabaseService";
import { SQLiteConnection } from "@capacitor-community/sqlite";

let dbInstance: DatabaseService | null = null;

export function useDatabase(): DatabaseService {
  if (dbInstance) {
    return dbInstance;
  }

  const sqlite = inject<SQLiteConnection>("sqlite");
  if (!sqlite) {
    throw new Error('SQLite not provided. Make sure to provide "sqlite" in your app.');
  }
  dbInstance = new DatabaseService(sqlite, "db_inventario");
  return dbInstance;
}

export type { Product };
