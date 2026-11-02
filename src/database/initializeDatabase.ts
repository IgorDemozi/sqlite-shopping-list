import { SchemaVersion } from '@/types';
import { SQLiteDatabase } from 'expo-sqlite';
import useItemsDatabase from './useItemsDatabase';

async function createTables(database: SQLiteDatabase) {
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS Version (key TEXT PRIMARY KEY, value TEXT);`
  );

  await database.execAsync(
    `INSERT OR IGNORE INTO Version (key, value) VALUES ("schema_version", "1");`
  );

  await database.execAsync(`
   CREATE TABLE IF NOT EXISTS lists (
      id varchar(36) PRIMARY KEY,
      name TEXT NOT NULL
   );
   `);

  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS items (id varchar(36) PRIMARY KEY, name TEXT NOT NULL);`
  );

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
}

async function addNameNormalizedColumn(database: SQLiteDatabase) {
  await database.execAsync(`
      ALTER TABLE items ADD COLUMN nameNormalized TEXT;
   `);
}

async function updateSchemaVersion(version: number, database: SQLiteDatabase) {
  const statement = await database.prepareAsync(
    'UPDATE Version SET value = $value WHERE key = "schema_version"'
  );

  try {
    const result = await statement.executeAsync({
      $value: version,
    });
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function updateSchema(database: SQLiteDatabase) {
  try {
    const query = 'SELECT value FROM Version WHERE key = "schema_version"';
    const schemaVersion = await database.getAllAsync<SchemaVersion>(query);

    let currentVersion = schemaVersion[0].value;

    console.log('currentVersion antes do if => ', currentVersion);

    if (currentVersion < 2) {
      try {
        await addNameNormalizedColumn(database);
        await updateSchemaVersion(currentVersion, database);

        const itemsDB = useItemsDatabase();
        const items = await itemsDB.getAllItems();

        items.map(async item => await itemsDB.update(item));

        currentVersion = 2;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        return;
      }
    }

    console.log('currentVersion depois do if => ', currentVersion);
  } catch (error) {
    console.error('Database schema update failed', error);
  }
}

async function resetDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
      DROP TABLE IF EXISTS lists;
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS lists_items;
      DROP TABLE IF EXISTS Version;
   `);
}

async function populateDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
      INSERT INTO lists VALUES (12345, 'lista teste 1');
      INSERT INTO lists VALUES (67890, 'lista teste 2');
   `);
  await database.execAsync(`
      INSERT INTO items VALUES (1111, 'banana');
      INSERT INTO items VALUES (2222, 'canela');
      INSERT INTO items VALUES (3333, 'pimentão');
      INSERT INTO items VALUES (4444, 'aveia');
      INSERT INTO items VALUES (5555, 'laranja');
   `);
  // await database.execAsync(`
  //     INSERT INTO items VALUES (1111, 'banana', 'banana');
  //     INSERT INTO items VALUES (2222, 'canela', 'canela');
  //     INSERT INTO items VALUES (3333, 'pimentão', 'pimentao');
  //     INSERT INTO items VALUES (4444, 'aveia', 'aveia');
  //     INSERT INTO items VALUES (5555, 'laranja', 'laranja');
  //  `);
  await database.execAsync(`
      INSERT INTO lists_items VALUES (123, 12345, 1111);
      INSERT INTO lists_items VALUES (456, 12345, 2222);
      INSERT INTO lists_items VALUES (789, 12345, 3333);
      INSERT INTO lists_items VALUES (159, 67890, 4444);
      INSERT INTO lists_items VALUES (156, 67890, 5555);
   `);
}

export async function initializeDatabase(database: SQLiteDatabase) {
  // resetDatabase(database);
  // createTables(database);
  // populateDatabase(database);
  // updateSchema(database);
}
