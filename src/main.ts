import { createApp, provide } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* SQLite imports */
import { defineCustomElements as jeepSqlite } from "jeep-sqlite/loader";
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { useState } from '@/composables/state';
import { db_inventario_schema } from '@/utils/sqlite-schemas';

jeepSqlite(window);

window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform();
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)

  const app = createApp(App)
    .use(IonicVue)
    .use(router);

  /* SQLite Global Variables*/

  // Only if you want to use the onProgressImport/Export events
  const [jsonListeners, setJsonListeners] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [message, setMessage] = useState("");
  provide('$isJsonListeners', {jsonListeners: jsonListeners, setJsonListeners: setJsonListeners});
  provide('$isModalOpen', {isModal: isModal, setIsModal: setIsModal});
  provide('$messageContent', {message: message, setMessage: setMessage});

  //  Existing Connections Store
  const [existConn, setExistConn] = useState(false);
  app.config.globalProperties.$existingConn = {existConn: existConn, setExistConn: setExistConn};

  try {
    if(platform === "web") {
      // Create the 'jeep-sqlite' Stencil component
      const jeepSqlite = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqlite);
      await customElements.whenDefined('jeep-sqlite');
      // Initialize the Web store
      await sqlite.initWebStore();
    }

    // initialize database schema
    const result = await sqlite.isJsonValid(JSON.stringify(db_inventario_schema));
    if(!result.result) {
      throw new Error(`isJsonValid: "db_inventario_schema" is not valid`);
    }
    const resJson = await sqlite.importFromJson(JSON.stringify(db_inventario_schema));
    if(resJson.changes && resJson.changes.changes && resJson.changes.changes < 0) {
      throw new Error(`importFromJson: "full" failed`);
    }

    router.isReady().then(() => {
      app.mount('#app');
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`)
  }
});

