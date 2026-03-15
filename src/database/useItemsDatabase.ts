import { Item, ListItem } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';

export default function useItemsDatabase() {
  const database = useSQLiteContext();

  async function create(name: string) {
    const statement = await database.prepareAsync(
      'INSERT INTO items (id, name, nameNormalized) VALUES ($id, $name)'
    );

    try {
      const insertedItemId = uuid.v4();

      const result = await statement.executeAsync({
        $id: insertedItemId,
        $name: name,
        $nameNormalized: name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
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
    const statement = await database.prepareAsync(
      'UPDATE items SET name = $name, nameNormalized = $nameNormalized WHERE id = $id'
    );

    try {
      const result = await statement.executeAsync({
        $id: data.id,
        $name: data.name,
        $nameNormalized: data.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
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
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getAllItems() {
    try {
      const query = 'SELECT * FROM items ORDER BY name COLLATE NOCASE ASC';
      const response = await database.getAllAsync<Item>(query);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function searchById(id: string) {
    const statement = await database.prepareAsync('SELECT * FROM items WHERE id = $id');

    try {
      const result = await statement.executeAsync<Item>({
        $id: id,
      });
      const item = await result.getFirstAsync();

      return item;
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function searchByName(name: string) {
    try {
      const normalizedNameParam = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const query =
        'SELECT * FROM items WHERE nameNormalized LIKE ? ORDER BY name COLLATE NOCASE ASC';
      const response = await database.getAllAsync<Item>(query, `%${normalizedNameParam}%`);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function getItemsFromList(listId: string) {
    try {
      const query = 'SELECT * FROM lists_items WHERE listId = ?';
      const response = await database.getAllAsync<ListItem>(query, listId);

      const items = await Promise.all(
        response.map(async listItem => await searchById(listItem.itemId))
      );

      const filteredItems = items.filter(item => item !== null);

      return filteredItems;
    } catch (error) {
      throw error;
    }
  }

  async function addItemToList(listId: string, itemId: string) {
    const statement = await database.prepareAsync(
      'INSERT INTO lists_items VALUES($id, $listId, $itemId)'
    );

    try {
      const newEntryId = uuid.v4();

      const result = await statement.executeAsync({
        $id: newEntryId,
        $listId: listId,
        $itemId: itemId,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function deleteItemFromList(listId: string, itemId: string) {
    const statement = await database.prepareAsync(
      'DELETE FROM lists_items WHERE listId = $listId AND itemId = $itemId'
    );

    try {
      const result = await statement.executeAsync({
        $listId: listId,
        $itemId: itemId,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return {
    create,
    searchByName,
    getAllItems,
    update,
    deleteItem,
    getItemsFromList,
    deleteItemFromList,
    addItemToList,
  };
}
