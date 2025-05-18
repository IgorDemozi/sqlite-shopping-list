import { blue } from '@/colors';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import ItemCard from '@/components/ItemCard';
import useItemsDatabase from '@/database/useItemsDatabase';
import { Item } from '@/types';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

export default function Items() {
  const [itemInput, setItemInput] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const itemsDB = useItemsDatabase();

  async function create() {
    try {
      const response = await itemsDB.create(itemInput).then(() => {
        setItemInput('');
        Alert.alert('Sucesso!', 'Item salvo!');
        getItems();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function update(data: Item) {
    try {
      const response = await itemsDB.update({ id: data.id, name: data.name }).then(() => {
        // setItemInput('');
        Alert.alert('Sucesso!', 'Item salvo!');
        getItems();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getItems() {
    try {
      const response = await itemsDB.getAllItems().then(res => {
        setItems(res);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function searchItem(search: string) {
    try {
      const response = await itemsDB.searchByName(search).then(res => {
        setItems(res);
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    searchItem(search);
  }, [search]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingHorizontal: 16,
      gap: 52,
      backgroundColor: blue.dark1,
    },
    viewOne: {
      gap: 16,
      height: 'auto',
    },
    viewTwo: {
      flex: 1,
      gap: 16,
    },
    flatList: {
      gap: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.viewOne}>
        <CustomInput onChangeText={setItemInput} placeholder="Novo item" value={itemInput} />
        <CustomButton title="Salvar" onPress={create} />
      </View>

      <View style={styles.viewTwo}>
        <CustomInput onChangeText={setSearch} placeholder="Pesquisar item" value={search} />
        <FlatList
          contentContainerStyle={styles.flatList}
          data={items}
          renderItem={({ item, index }) => <ItemCard key={index} name={item.name} />}
        />
      </View>
    </View>
  );
}
