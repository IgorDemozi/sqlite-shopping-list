import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { AsyncStorage } from 'expo-sqlite/kv-store';
import { items, lists, listsToItems } from './schema';

async function populateTables(db: ExpoSQLiteDatabase) {
  const value = AsyncStorage.getItemSync('dbInitialized');
  if (value) return;

  console.log('Populando tabelas...');

  try {
    await db.insert(lists).values([
      { id: 'teste1', name: 'lista teste 1' },
      { id: 'teste2', name: 'lesta teste 2' },
    ]);

    await db.insert(items).values([
      { id: '1111', name: 'banana' },
      { id: '2222', name: 'pimentão' },
      { id: '3333', name: 'maracujá' },
      { id: '4444', name: 'aveia' },
    ]);

    await db.insert(listsToItems).values([
      { listId: 'teste1', itemId: '1111' },
      { listId: 'teste1', itemId: '4444' },
      { listId: 'teste2', itemId: '2222' },
      { listId: 'teste2', itemId: '3333' },
    ]);
  } catch (error) {
    console.log(error);
  } finally {
    return '';
  }
}

export default populateTables;
