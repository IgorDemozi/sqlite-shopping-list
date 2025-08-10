import { List } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';

export default function useListsDatabase() {
  const database = useSQLiteContext();

  async function create(name: string) {
    const statement = await database.prepareAsync('INSERT INTO lists VALUES ($id, $name)');

    try {
      const newId = uuid.v4();

      const result = await statement.executeAsync({
        $id: newId,
        $name: name,
      });

      const insertedRowId = result.lastInsertRowId.toString();

      return { insertedRowId, newId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getAllLists() {
    try {
      const query = 'SELECT * FROM lists ORDER BY name COLLATE NOCASE ASC';
      const response = await database.getAllAsync<List>(query);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function deleteList(id: string) {
    const statement = await database.prepareAsync('DELETE FROM lists WHERE id = $id');

    try {
      const result = await statement.executeAsync({
        $id: id,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return { create, getAllLists, deleteList };
}
