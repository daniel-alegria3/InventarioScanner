import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';

export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    unidad_medida: string | null;
    categorias: string[] | null; // comma separated values
    foto: any | null; // TODO: give it a proper type
    cod_barra: string | null; // TODO: prone to change
    stock: number | null; // TODO: prone to change
}

export class DatabaseService {
    private sqlite: SQLiteHook | undefined;
    private db!: SQLiteDBConnection;

    constructor(sqlite: SQLiteHook | undefined) {
        this.sqlite = sqlite;
    }

    async init(): Promise<void> {
        const ret = await this.sqlite.checkConnectionsConsistency();
        const isConn = (await this.sqlite.isConnection("db_inventario", false)).result;

        if (ret.result && isConn) {
            this.db = await this.sqlite.retrieveConnection("db_inventario", false);
        } else {
            this.db = await this.sqlite.createConnection("db_inventario", false, "no-encryption", 1, false);
        }

        // await sqlite.closeConnection("db_inventario", false);
    }

    async obtener_productos(): Promise<Producto[]> {
        await this.db.open();
        const res = await this.db.query(`
            SELECT id, nombre, precio, unidad_medida, categorias, foto, cod_barra
            FROM producto;
        `);
        await this.db.close();
        return this.array_to_producto(res.values as any[]);
    }

    async obtener_productos_por_texto(texto: string): Promise<Producto[]> {
        await this.db.open();
        let texto_buscar = `%${texto}%`;
        const res = await this.db.query(`
            SELECT id, nombre, precio, unidad_medida, categorias, foto, cod_barra, stock
            FROM producto
            WHERE nombre LIKE ? OR categorias LIKE ?;`,
            [texto_buscar, texto_buscar]
        );
        await this.db.close();
        return this.array_to_producto(res.values as any[]);
    }

    async obtener_productos_por_nombre_y_categorias(nombre: string, categorias: string[]): Promise<Producto[]> {
        await this.db.open();
        let name = `%${nombre}%`;
        let categories = categorias.map(cat => `LIKE %${cat}%`).join(" OR ");
        const res = await this.db.query(`
            SELECT id, nombre, precio, unidad_medida, categorias, foto, cod_barra, stock
            FROM producto
            WHERE nombre LIKE ? OR (${categories});`,
            [name]
        );
        await this.db.close();
        return this.array_to_producto(res.values as any[]);
    }

    async obtener_producto_por_cod_barra(cod_barra: string): Promise<Producto[]> {
        await this.db.open();
        const res = await this.db.query(`
            SELECT id, nombre, precio, unidad_medida, categorias, foto, cod_barra, stock
            FROM producto
            WHERE cod_barra = ?;`,
            [cod_barra]
        );
        await this.db.close();
        return this.array_to_producto(res.values as any[]);
    }

    async añadir_producto(producto: Producto): Promise<void> {
        await this.db.open();
        const res = await this.db.run(`
            INSERT INTO producto (nombre, precio, unidad_medida, categorias, foto, cod_barra, stock)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            this.producto_to_array(producto)
        );
        await this.check_run_response(res);
        await this.db.close();
    }

    async quitar_producto(id: string): Promise<void> {
        await this.db.open();
        const res = await this.db.run("DELETE FROM producto WHERE id = ?", [id]);
        await this.check_run_response(res);
        await this.db.close();
    }

    async actualizar_producto(id: string, producto: Producto): Promise<void> {
        await this.db.open();
        const params = this.producto_to_array(producto).concat([id]);
        const res = await this.db.run(`
            UPDATE producto
            SET nombre = ?, precio = ?, unidad_medida = ?, categorias = ?, foto = ?, cod_barra = ?, stock = ?
            WHERE id = ?`,
            params
        );
        await this.check_run_response(res);
        await this.db.close();
    }

    async check_run_response(res: any): Promise<void> {
        // For db.run() using INSERT, UPDATE and DELETE
        if(res.changes && res.changes.changes && res.changes.changes < 0) {
            throw new Error(`Error: sqlite query failed`);
        }
    }

    producto_to_array(producto: Producto): any[] {
        let cats;
        let categorias = producto.categorias ?? null;
        if (categorias) {
            cats = categorias.join(",");
        }
        return [
            producto.nombre,
            producto.precio,
            producto.unidad_medida ?? null,
            cats,
            producto.foto ?? null,
            producto.cod_barra ?? null,
            producto.stock ?? null,
        ];
    }

    array_to_producto(array: any[]): Producto[] {
        return array.map(this.tranformar_categorias);
    }

    tranformar_categorias(obj: any): Producto {
        return {
            ...obj,
            categorias: obj.categorias ? obj.categorias.split(",") : [],
        }
    }
}
