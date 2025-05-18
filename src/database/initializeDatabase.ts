import { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
     CREATE TABLE IF NOT EXISTS items (
        id varchar(36) PRIMARY KEY,
        name TEXT NOT NULL
     );
    `);
}
