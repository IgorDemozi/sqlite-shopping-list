import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import ItemCard from '@/components/ItemCard';
import useItemsDatabase from '@/database/useItemsDatabase';
import { itemsStyles } from '@/styles/items';
import { Item } from '@/types';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { Button, Dialog, Portal, Snackbar } from 'react-native-paper';

export default function Items() {
  const [itemInput, setItemInput] = useState('');
  const [updateInput, setUpdateInput] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [currentItemId, setCurrentItemId] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [updateModalIsVisible, setUpdateModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const itemsDB = useItemsDatabase();

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    searchItem(search);
  }, [search]);

  async function create() {
    try {
      if (itemInput !== '') {
        const response = await itemsDB.create(itemInput).then(() => {
          setItemInput('');
          handleSnack(true, 'Dados salvos!');
          getItems();
        });
      } else return;
    } catch (error) {
      console.log(error);
    }
  }

  async function update(data: Item) {
    try {
      const response = await itemsDB.update({ id: data.id, name: data.name }).then(() => {
        setUpdateInput('');
        handleSnack(true, 'Dados salvos!');
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

  async function deleteItem(id: string) {
    try {
      const response = await itemsDB.deleteItem(id).then(() => {
        handleSnack(true, 'Item apagado');
        getItems();
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleUpdate() {
    if (currentItemId !== '') {
      update({ id: currentItemId, name: updateInput });
      handleCloseDialog();
    } else return;
  }

  function handleDelete() {
    if (currentItemId !== '') {
      console.log('teste handleDelete id => ', currentItemId);

      deleteItem(currentItemId);
      handleCloseDialog();
    } else return;
  }

  function handleCloseDialog() {
    setUpdateModalIsVisible(false);
    setDeleteModalIsVisible(false);
    setCurrentItemId('');
    setUpdateInput('');
  }

  function handleSnack(visible: boolean, message: string) {
    setIsSnackbarVisible(visible);
    setSnackbarMessage(message);
  }

  return (
    <View style={itemsStyles.container}>
      <View style={itemsStyles.viewOne}>
        <CustomInput onChangeText={setItemInput} placeholder="Novo item" value={itemInput} />
        <CustomButton title="Salvar" onPress={create} />
      </View>

      <View style={itemsStyles.viewTwo}>
        <CustomInput onChangeText={setSearch} placeholder="Pesquisar item" value={search} />
        <FlatList
          contentContainerStyle={itemsStyles.flatList}
          data={items}
          renderItem={({ item, index }) => (
            <ItemCard
              key={index}
              name={item.name}
              onPressUpdate={() => {
                setCurrentItemId(item.id);
                setUpdateInput(item.name);
                setUpdateModalIsVisible(true);
              }}
              onPressDelete={() => {
                setCurrentItemId(item.id);
                setDeleteModalIsVisible(true);
              }}
            />
          )}
        />
      </View>

      <Portal>
        <Dialog visible={updateModalIsVisible} style={itemsStyles.dialog}>
          <Dialog.Title>Editar item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              onChangeText={setUpdateInput}
              placeholder="Novo nome"
              value={updateInput}
              style={itemsStyles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseDialog}>Cancelar</Button>
            <Button onPress={handleUpdate}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={deleteModalIsVisible} style={itemsStyles.dialog}>
          <Dialog.Title>Apagar item?</Dialog.Title>

          <Dialog.Actions>
            <Button onPress={handleCloseDialog}>Cancelar</Button>
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
