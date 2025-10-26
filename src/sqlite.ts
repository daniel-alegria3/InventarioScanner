import type { App } from 'vue';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { useSQLite } from 'vue-sqlite-hook';

import { useState } from '@/composables/state';

jeepSqlite(window);

export const sqlite = new SQLiteConnection(CapacitorSQLite);

export async function initializeSQLite(app: App) {
  const platform = Capacitor.getPlatform();

  try {
    if (platform === 'web') {
      // Create the 'jeep-sqlite' Stencil component
      const jeepSqliteEl = document.createElement('jeep-sqlite');

      const baseUrl = import.meta.env.BASE_URL;
      jeepSqliteEl.wasmPath = `${baseUrl}assets`.replace(/\/\//g, '/');

      document.body.appendChild(jeepSqliteEl);
      await customElements.whenDefined('jeep-sqlite');

      // Initialize the Web store
      await sqlite.initWebStore();
    }

    // SQLite Global Variables
    // Only if you want to use the onProgressImport/Export events

    // TODO/DEBUG: fixup onProgress callbacks
    const { jsonListeners, setJsonListeners } = useState(true);
    const { isModal, setIsModal } = useState(false);
    const { message, setMessage } = useState('');

    const onProgressImport = async (progress: string) => {
      console.info(progress);
      // if (jsonListeners.value) {
      //   if (!isModal.value) setIsModal(true);
      //   setMessage(message.value.concat(`${progress}\n`));
      // }
    };
    const onProgressExport = async (progress: string) => {
      console.info(progress);
      // if (jsonListeners.value) {
      //   if (!isModal.value) setIsModal(true);
      //   setMessage(message.value.concat(`${progress}\n`));
      // }
    };

    // app.provide('isJsonListeners', { jsonListeners, setJsonListeners });
    // app.provide('isModalOpen', { isModal, setIsModal });
    // app.provide('message', { message, setMessage });

    app.provide('sqlite', useSQLite({ onProgressImport, onProgressExport }));
  } catch (err) {
    console.error(`SQLite initialization error: ${err}`);
    throw new Error(`Failed to initialize SQLite: ${err}`);
  }
}
