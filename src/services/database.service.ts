import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { Prop } from 'ionicons/dist/types/stencil-public-runtime';

const DB_INVENTARIO = "inventariodb";

export interface Producto {
    id: number;
    nombre: string;
    barcode: string; // TODO: prone to change
    precio: number;
    unidad_medida: string;
    categorias: string; // comma separated values
    foto:any; // TODO: give it a proper type
}

const DB_INVENTARIO_SCHEMA = `CREATE TABLE IF NOT EXISTS ${DB_INVENTARIO}
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                nombre TEXT NOT NULL,
                                barcode TEXT NOT NULL,
                                precio REAL NOT NULL,
                                unidad_medida TEXT,
                                categorias TEXT,
                                foto BLOB
                             `;


export class DatabaseService {
    private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    private db!: SQLiteDBConnection;
    // private producto: WritableSignal<Producto[]> = signal<Producto[]>([]); // from angular signal function


    constructor() {}

    async initialize_connection() {
        this.db = await this.sqlite.createConnection(
            DB_INVENTARIO,   // database name
            false,           // encryption?
            'no-encryption', // mode: 'no-encryption', 'secret'
            1,               // version number
            false            // readonly?
        );

        await this.db.open();
        await this.db.execute(DB_INVENTARIO_SCHEMA);
        await this.load_productos();
        return true;
    }

    async load_productos() {
        const productos = await this.db.run('SELECT * FROM (?);', [DB_INVENTARIO]);
        this.producto.set(productos.values || [])
    }

}
