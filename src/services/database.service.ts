import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { Prop } from 'ionicons/dist/types/stencil-public-runtime';

const DB_INVENTARIO = "inventariodb";

export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    unidad_medida: string | null;
    categorias: string | null; // comma separated values
    foto: any | null; // TODO: give it a proper type
    cod_barra: string | null; // TODO: prone to change
}

const DB_INVENTARIO_SCHEMA = `CREATE TABLE IF NOT EXISTS producto
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                nombre TEXT NOT NULL,
                                precio REAL NOT NULL,
                                unidad_medida TEXT,
                                categorias TEXT,
                                foto BLOB
                                cod_barra TEXT,
                             `;


export class DatabaseService {
    private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    private db!: SQLiteDBConnection;


    constructor() {}

    async initialize_connection(): Promise<void> {
        this.db = await this.sqlite.createConnection(
            DB_INVENTARIO,   // database name
            false,           // encryption?
            'no-encryption', // mode: 'no-encryption', 'secret'
            1,               // version number
            false            // readonly?
        );

        await this.db.open();
        await this.db.execute(DB_INVENTARIO_SCHEMA);
    }

    async obtener_productos(): Promise<Producto[]> {
        const productos = await this.db.execute('SELECT * FROM producto;');
        return productos.values as Producto[];
    }

    async obtener_productos_por_texto(texto: string): Promise<Producto[]> {
        let texto_buscar = `%${texto}%`;
        const productos = await this.db.run("SELECT * FROM producto WHERE nombre LIKE ? OR categorias LIKE ?;", [texto_buscar, texto_buscar]);
        return productos.values as Producto[];
    }

    async obtener_producto_por_cod_barra(cod_barra: string): Promise<string> {
        const productos = await this.db.run("SELECT * FROM producto WHERE cod_barra = ?;", [cod_barra]);
        return productos.values[0];
    }

    async añadir_producto(detalles: []): Promise<void> {
        this.db.run("INSERT INTO producto (nombre, precio, unidad_medida, categorias, foto, cod_barra) VALUES (?, ?, ?, ?, ?, ?);", detalles);
    }

    async quitar_producto(id: string): Promise<void> {
        this.db.run("DELETE FROM producto WHERE id = ?", [id]);
    }

    async actualizar_producto(id: string, detalles: []): Promise<void> {
        this.db.run("UPDATE producto SET nombre = ?, precio = ?, unidad_medida = ?, categorias = ?, foto = ?, cod_barra = ? WHERE id = ?", detalles.concat([id]));
    }
}
