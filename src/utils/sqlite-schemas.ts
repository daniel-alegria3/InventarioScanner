export const db_inventario_schema = {
  database: "db_name",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
    {
      name: "Product",
      schema: [
        { column: "id", value: "INTEGER PRIMARY KEY AUTOINCREMENT" },
        { column: "name", value: "TEXT NOT NULL" },
        { column: "price", value: "REAL NOT NULL" },
        { column: "barcode", value: "TEXT" },

        { column: "last_modified", value: "INTEGER DEFAULT (strftime('%s', 'now'))" },
        {
          column: "sql_deleted",
          value: "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))",
        },
      ],
      indexes: [
        { name: "index_album_on_barcode", value: "barcode" },
        { name: "index_product_on_last_modified", value: "last_modified DESC" },
      ],
      triggers: [
        {
          name: "product_trigger_last_modified",
          timeevent: "AFTER UPDATE",
          condition: "FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified",
          logic:
            "BEGIN UPDATE Product SET last_modified = (strftime('%s', 'now')) WHERE id=NEW.id; END;",
        },
      ],
    },
  ],
};
