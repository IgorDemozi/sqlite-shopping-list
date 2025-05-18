import { Item } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';

export default function useItemsDatabase() {
  const database = useSQLiteContext();

  async function create(name: string) {
    const statement = await database.prepareAsync(
      'INSERT INTO items (id, name) VALUES ($id, $name)'
    );

    try {
      const insertedItemId = uuid.v4();

      const result = await statement.executeAsync({
        $id: insertedItemId,
        $name: name,
      });

      const insertedRowId = result.lastInsertRowId.toString();

      return { insertedRowId, insertedItemId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function update(data: Item) {
    const statement = await database.prepareAsync('UPDATE items SET name = $name WHERE id = $id');

    try {
      const result = await statement.executeAsync({
        $id: data.id,
        $name: data.name,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function deleteItem(id: string) {
    const statement = await database.prepareAsync('DELETE FROM items WHERE id = $id');

    try {
      const result = await statement.executeAsync({
        $id: id,
      });
    } catch (error) {
      throw error;
    }
  }

  async function getAllItems() {
    try {
      const query = 'SELECT * FROM items ORDER BY name ASC';
      const response = await database.getAllAsync<Item>(query);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function searchByName(name: string) {
    try {
      const query = 'SELECT * FROM items WHERE name LIKE ? ORDER BY name ASC';
      const response = await database.getAllAsync<Item>(query, `%${name}%`);

      return response;
    } catch (error) {
      throw error;
    }
  }

  return { create, searchByName, getAllItems, update, deleteItem };
}
