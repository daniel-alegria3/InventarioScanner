import type { App } from "vue";
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { defineCustomElements as jeepSqlite } from "jeep-sqlite/loader";

export const sqlite = new SQLiteConnection(CapacitorSQLite);

export async function initializeSQLite(app: App) {
  const platform = Capacitor.getPlatform();

  try {
    if (platform === "web") {
      jeepSqlite(window);

      const jeepSqliteEl = document.createElement("jeep-sqlite");

      const baseUrl = import.meta.env.BASE_URL;
      jeepSqliteEl.wasmPath = `${baseUrl}assets`.replace(/\/\//g, "/");

      document.body.appendChild(jeepSqliteEl);
      await customElements.whenDefined("jeep-sqlite");

      await sqlite.initWebStore();
    }

    const onProgressImport = async (progress: string) => {
      console.info(progress);
    };
    const onProgressExport = async (progress: string) => {
      console.info(progress);
    };

    if (platform !== "electron") {
      (CapacitorSQLite as any).addListener("sqliteImportProgressEvent", (e: any) => {
        onProgressImport(e.progress);
      });
      (CapacitorSQLite as any).addListener("sqliteExportProgressEvent", (e: any) => {
        onProgressExport(e.progress);
      });
    }

    app.provide("sqlite", sqlite);
  } catch (err) {
    console.error(`SQLite initialization error: ${err}`);
    throw new Error(`Failed to initialize SQLite: ${err}`);
  }
}
