import { SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
// TODO: understand how to setup this from the main.ts, App.vue, etc. Clean it up

import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
// TODO: learn and clean this up

import { db_inventario_schema } from '@/utils/sqlite-schemas';

const platform = Capacitor.getPlatform();

export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string | null;
}

export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db_name: string;
  private db!: SQLiteDBConnection;
  private initPromise: Promise<void>; // To check that only one connection exists

  constructor(sqlite: SQLiteConnection, db_name: string) {
    this.sqlite = sqlite;
    this.db_name = db_name;
    this.initPromise = this.init();
  }

  async init(): Promise<void> {
    const isdb = (await this.sqlite.isDatabase(this.db_name)).result;
    if (!isdb) {
      await this.create();
      return;
    }
    await this.connect();
  }

  async connect(): Promise<void> {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection(this.db_name, false)).result;

    if (ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(this.db_name, false);
    } else {
      this.db = await this.sqlite.createConnection(
        this.db_name,
        false,
        'no-encryption',
        1,
        false
      );
    }

    await this.db.open();
  }

  async create(): Promise<void> {
    try {
      const db_schema_string = JSON.stringify({
        ...db_inventario_schema,
        database: this.db_name,
      });

      // Validate database schema
      const result = await this.sqlite.isJsonValid(db_schema_string);
      if (!result.result) {
        throw new Error(`isJsonValid: schema not valid`);
      }

      // Import database schema
      const resJson = await this.sqlite.importFromJson(db_schema_string);
      if (resJson.changes && resJson.changes.changes && resJson.changes.changes < 0) {
        throw new Error(`importFromJson: "full" failed`);
      }

      await this.connect();
      await this.sqlite.saveToStore(this.db_name);
    } catch (err) {
      throw new Error(`Failed to create new database: ${err}`);
    }
  }

  private async ensureInitialized(): Promise<void> {
    await this.initPromise;
  }

  async close(): Promise<void> {
    await this.ensureInitialized();
    await this.db.close();
    await this.sqlite.closeConnection(this.db_name, false);
  }

  //----------------------------------------------------------------------------

  async getProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    const res = await this.db.query(
      `
        SELECT id, name, price, barcode
        FROM Product
        WHERE sql_deleted = 0;
      `
    );
    return res.values as Product[];
  }

  async getProductsByName(name: string): Promise<Product[]> {
    await this.ensureInitialized();
    const res = await this.db.query(
      `
        SELECT id, name, price, barcode
        FROM Product
        WHERE name LIKE ?
        AND sql_deleted = 0;
      `,
      [`%${name}%`]
    );
    return res.values as Product[];
  }

  async getProductsByBarcode(barcode: string): Promise<Product[]> {
    await this.ensureInitialized();
    const res = await this.db.query(
      `
        SELECT id, name, price, barcode
        FROM Product
        WHERE barcode = ?
        AND sql_deleted = 0;
      `,
      [barcode]
    );
    return res.values as Product[];
  }

  async addProduct(product: Product): Promise<void> {
    await this.ensureInitialized();
    const res = await this.db.run(
      `
        INSERT INTO Product (name, price, barcode)
        VALUES (?, ?, ?);
      `,
      this.product_to_array(product)
    );
    await this.check_run_response(res);
  }

  async removeProduct(id: number): Promise<void> {
    await this.ensureInitialized();
    const res = await this.db.run('DELETE FROM Product WHERE id = ?', [id]);
    await this.check_run_response(res);
  }

  async removeProducts(ids: number[]): Promise<void> {
    await this.ensureInitialized();

    const statements = ids.map((id) => ({
      statement: 'DELETE FROM Product WHERE id = ?',
      values: [id],
    }));
    const res = await this.db.executeSet(statements);
    await this.check_run_response(res);
  }

  async updateProduct(id: string, product: Product): Promise<void> {
    await this.ensureInitialized();
    const res = await this.db.run(
      `
        UPDATE Product
        SET name = ?, price = ?, barcode = ?
        WHERE id = ?
      `,
      this.product_to_array(product).concat([id])
    );
    await this.check_run_response(res);
  }

  async check_run_response(res: any): Promise<void> {
    // For db.run() using INSERT, UPDATE and DELETE
    if (res.changes && res.changes.changes && res.changes.changes < 0) {
      throw new Error(`Error: sqlite query failed`);
    }
    // WARN: this is essential
    if (platform === 'web') {
      await this.sqlite.saveToStore(this.db_name);
    }
  }

  product_to_array(product: Product): any[] {
    return [
      product.name,
      product.price,
      (product.barcode ?? '').trim() === '' ? null : product.barcode,
    ];
  }

  array_to_product(array: any[]): Product[] {
    return array.map((row) => {
      return {
        ...row,
      };
    });
  }

  //----------------------------------------------------------------------------

  // TODO: https://capawesome.io/blog/the-file-handling-guide-for-capacitor/#read-a-file
  // TODO: add loading modal or/and notify user when operations are done

  async exportJson() {
    await this.ensureInitialized();
    try {
      await Filesystem.requestPermissions();

      const jsonData = await this.db.exportToJson('full');

      const jsonDataString = JSON.stringify(
        // Set this up now to make this.importJson non-overwritable
        { ...jsonData.export, mode: 'partial' },
        null,
        2
      );
      const filename = `inventario-scanner-${this.db_name}-${Date.now()}.json`;

      if (platform === 'web') {
        const blob = new Blob([jsonDataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        await FilePicker.requestPermissions();

        const saved = await Filesystem.writeFile({
          path: filename,
          data: jsonDataString,
          encoding: Encoding.UTF8,
          directory: Directory.Cache,
        });

        await Share.share({
          title: 'Exportar Database',
          text: `Exportar '${this.db_name}'`,
          url: saved.uri,
          dialogTitle: 'Compartir Backup',
        });
      }

      await this.db.setSyncDate(new Date().toISOString());
      await this.db.deleteExportedRows();
    } catch (error) {
      console.error('Export failed/canceled:', error);
    }
  }

  async importJson() {
    await this.ensureInitialized();
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/json'],
        limit: 1,
      });

      if (result.files.length > 0) {
        const file = result.files[0];
        let jsonDataString: string;

        if (platform === 'web') {
          if (!file.blob) {
            throw new Error('No file data available');
          }
          jsonDataString = await file.blob.text();
        } else {
          if (!file.path) {
            throw new Error('No file path available');
          }
          const contents = await Filesystem.readFile({
            path: file.path,
            encoding: Encoding.UTF8,
          });
          jsonDataString = contents.data as string;
        }

        await this.close();
        if (!(await this.sqlite.isJsonValid(jsonDataString)).result) {
          throw new Error(`isJsonValid: backup not valid`);
        }
        await this.sqlite.importFromJson(jsonDataString);
        await this.init();

        if (platform === 'web') {
          await this.sqlite.saveToStore(this.db_name);
        }

        await this.db.setSyncDate(new Date().toISOString());
        await this.db.deleteExportedRows();
      }
    } catch (error) {
      console.log('Import failed/canceled', error);
    }
  }
}
