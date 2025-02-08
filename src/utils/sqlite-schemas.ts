export const db_inventario_schema = {
  database: 'db_inventario',
  version: 1,
  encrypted: false,
  mode: 'full',
  tables: [
    {
      name: 'producto',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
        { column: 'nombre', value: 'TEXT NOT NULL' },
        { column: 'precio', value: 'REAL NOT NULL' },
        { column: 'unidad_medida', value: 'TEXT' },
        { column: 'categorias', value: 'TEXT' },
        { column: 'foto', value: 'BLOB' },
        { column: 'cod_barra', value: 'TEXT' },
        { column: 'stock', value: 'REAL' },

        // { foreignkey: "teacherId", value:"REFERENCES teachers(id) ON DELETE CASCADE"}
        // { column:'sql_deleted', value:'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))'},
        // { column:'last_modified', value:'INTEGER DEFAULT (strftime(\'%s\', \'now\'))'},
        // { constraint: 'PK_albumartist_albumname', value: 'PRIMARY KEY (id,nombre)'},
      ],
      // indexes: [
      //   { name: 'index_album_on_albumartist_albumname', value: 'albumartist,albumname' },
      //   { name: 'index_album_on_last_modified', value: 'last_modified DESC' },
      // ],
      // triggers: [
      //   {
      //     name: "classes_trigger_last_modified",
      //     timeevent: "AFTER UPDATE",
      //     logic: "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE images SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;END;"
      //   }
      // ],
      values: [
        [1, "Leche gloria grande", "3.50", "250 ml", "gloria,lacteo", null, null, 661],
        [2, "Leche gloria pequeña", "1.50", "100 ml", "gloria,lacteo", null, null, 662],
        [3, "Yogur gloria pequeña", "2.00", "150 ml", "gloria,lacteo", null, null, 663],
      ]
    },
  ],
};

