import CustomButton from '@/components/CustomButton';
import CustomCard from '@/components/CustomCard';
import CustomCheckbox from '@/components/CustomCheckbox';
import CustomInput from '@/components/CustomInput';
import useItemsDatabase from '@/database/useItemsDatabase';
import { itemsStyles } from '@/styles/items';
import { Item } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Dialog, Portal, Snackbar } from 'react-native-paper';

export default function DisplayList() {
  const params = useLocalSearchParams<{ id: string; listName: string }>();
  const itemsDB = useItemsDatabase();
  const [itemsFromList, setItemsFromList] = useState<Item[]>([]);
  const [currentItemId, setCurrentItemId] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [searchModalIsVisible, setSearchModalIsVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [searchItems, setSearchItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    getItemsFromList();
  }, []);

  useEffect(() => {
    getItems();
  }, [itemsFromList]);

  useEffect(() => {
    searchItem(search);
  }, [search]);

  async function getItemsFromList() {
    try {
      const response = await itemsDB.getItemsFromList(params.id).then(res => {
        setItemsFromList(res);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteItemFromList(itemId: string) {
    try {
      const response = await itemsDB.deleteItemFromList(params.id, itemId).then(() => {
        handleSnack(true, 'Item removido da lista');
        getItemsFromList();
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleAddItemsToList(items: Item[]) {
    try {
      items.forEach(element => {
        addItemToList(element);
      });
      setSearchModalIsVisible(false);
      getItemsFromList();
      setSelectedItems([]);
      handleSnack(true, 'Itens adicionados à lista.');
    } catch (error) {
      console.log(error);
    }
  }

  async function addItemToList(item: Item) {
    try {
      const response = await itemsDB.addItemToList(params.id, item.id);
    } catch (error) {
      console.log(error);
    }
  }

  async function getItems() {
    try {
      const response = await itemsDB.getAllItems().then(res => {
        const listIds = itemsFromList.map(obj => obj.id);
        const filteredItems = res.filter(resItem => !listIds.includes(resItem.id));

        setSearchItems(filteredItems);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function searchItem(search: string) {
    try {
      const response = await itemsDB.searchByName(search).then(res => {
        const listIds = itemsFromList.map(obj => obj.id);
        const filteredItems = res.filter(resItem => !listIds.includes(resItem.id));

        console.log('itemsFromList search => ', itemsFromList);
        console.log('filteredItems search => ', filteredItems);

        setSearchItems(filteredItems);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleDelete() {
    deleteItemFromList(currentItemId);
    handleCloseDeleteDialog();
  }

  function handleCloseDeleteDialog() {
    setDeleteModalIsVisible(false);
    setCurrentItemId('');
  }

  function handleSnack(visible: boolean, message: string) {
    setIsSnackbarVisible(visible);
    setSnackbarMessage(message);
  }

  const styles = StyleSheet.create({
    modalInput: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 8,
      height: 48,
      fontSize: 18,
      lineHeight: 28,
      paddingHorizontal: 12,
    },
    searchDialogView: {
      paddingHorizontal: 16,
      gap: 16,
    },
    searchDialogFlatList: {
      gap: 12,
    },
  });

  return (
    <View style={itemsStyles.container}>
      <Text>{params.listName}</Text>

      <CustomButton onPress={() => setSearchModalIsVisible(true)} title="Adicionar item" />

      <FlatList
        contentContainerStyle={itemsStyles.flatList}
        data={itemsFromList}
        renderItem={({ item, index }) => (
          <CustomCard
            key={index}
            name={item.name}
            onPressDelete={() => {
              setCurrentItemId(item.id);
              setDeleteModalIsVisible(true);
            }}
          />
        )}
      />

      <Portal>
        <Dialog visible={searchModalIsVisible} style={itemsStyles.dialog}>
          <Dialog.Title>Pesquisar item</Dialog.Title>

          <View style={styles.searchDialogView}>
            <View>
              <CustomInput onChangeText={setSearch} value={search} style={styles.modalInput} />
            </View>

            <View>
              <FlatList
                contentContainerStyle={styles.searchDialogFlatList}
                data={searchItems}
                renderItem={({ item }) => (
                  <CustomCheckbox item={item} setSelectedItems={setSelectedItems} />
                )}
              />
            </View>

            <CustomButton title="Adicionar" onPress={() => handleAddItemsToList(selectedItems)} />
          </View>

          <Dialog.Actions style={{ marginTop: 16 }}>
            <Button onPress={() => setSearchModalIsVisible(false)}>Voltar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={deleteModalIsVisible} style={itemsStyles.dialog}>
          <Dialog.Title>Remover item da lista?</Dialog.Title>

          <Dialog.Actions>
            <Button onPress={handleCloseDeleteDialog}>Cancelar</Button>
            <Button onPress={handleDelete}>Apagar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Snackbar
          visible={isSnackbarVisible}
          onDismiss={() => setIsSnackbarVisible(false)}
          duration={2000}
          action={{
            label: 'OK',
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}
