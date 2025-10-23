import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { Capacitor } from '@capacitor/core';
// TODO: understand how to setup this from the main.ts, App.vue, etc. Clean it up

const platform = Capacitor.getPlatform();

export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string | null;
}

export class DatabaseService {
  private sqlite: SQLiteHook;
  private db!: SQLiteDBConnection;
  private initPromise: Promise<void>; // To check that only one connection exists

  constructor(sqlite: SQLiteHook) {
    this.sqlite = sqlite;
    this.initPromise = this.init();
  }

  async init(): Promise<void> {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection('db_inventario', false)).result;

    if (ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection('db_inventario', false);
    } else {
      this.db = await this.sqlite.createConnection(
        'db_inventario',
        false,
        'no-encryption',
        1,
        false
      );
    }

    await this.db.open();
    // await sqlite.closeConnection("db_inventario", false);
  }

  private async ensureInitialized(): Promise<void> {
    await this.initPromise;
  }

  async close(): Promise<void> {
    await this.ensureInitialized();
    await this.db.close();
  }

  async getProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    const res = await this.db.query(
      `
        SELECT id, name, price, barcode
        FROM Product;
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
        WHERE name LIKE ?;
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
        WHERE barcode = ?;
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
      this.sqlite.saveToStore('db_inventario');
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
}
