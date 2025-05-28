import { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
             DROP TABLE lists;
             DROP TABLE items;
             DROP TABLE lists_items;
             `);

  await database.execAsync(`
       CREATE TABLE IF NOT EXISTS lists (
          id varchar(36) PRIMARY KEY,
          name TEXT NOT NULL
       );
       `);

  await database.execAsync(`
     CREATE TABLE IF NOT EXISTS items (
        id varchar(36) PRIMARY KEY,
        name TEXT NOT NULL
     );
     `);

  await database.execAsync(`
     CREATE TABLE IF NOT EXISTS lists_items (
        id varchar(36) PRIMARY KEY,
        listId varchar(36),
        itemId varchar(36),
        FOREIGN KEY (listId)
           REFERENCES lists (id)
        FOREIGN KEY (itemId)
           REFERENCES items (id)
     );
     `);

  await database.execAsync(`
       INSERT INTO lists VALUES (12345, 'lista teste');
       `);

  await database.execAsync(`
       INSERT INTO items VALUES (1111, 'banana');
       INSERT INTO items VALUES (2222, 'canela');
       INSERT INTO items VALUES (3333, 'pimenta');
       `);

  await database.execAsync(`
       INSERT INTO lists_items VALUES (123, 12345, 1111);
       INSERT INTO lists_items VALUES (456, 12345, 2222);
       INSERT INTO lists_items VALUES (789, 12345, 3333);
       `);
}
