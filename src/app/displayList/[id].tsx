import CustomCard from '@/components/CustomCard';
import useItemsDatabase from '@/database/useItemsDatabase';
import { itemsStyles } from '@/styles/items';
import { Item } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Button, Dialog, Portal, Snackbar } from 'react-native-paper';

export default function DisplayList() {
  const params = useLocalSearchParams<{ id: string; listName: string }>();
  const itemsDB = useItemsDatabase();
  const [items, setItems] = useState<Item[]>([]);
  const [currentItemId, setCurrentItemId] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  useEffect(() => {
    getItemsFromList();
  }, []);

  async function getItemsFromList() {
    try {
      const response = await itemsDB.getItemsFromList(params.id).then(res => {
        console.log('res => ', res);
        setItems(res);
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

  function handleDelete() {
    deleteItemFromList(currentItemId);
    handleCloseDialog();
  }

  function handleCloseDialog() {
    setDeleteModalIsVisible(false);
    setCurrentItemId('');
  }

  function handleSnack(visible: boolean, message: string) {
    setIsSnackbarVisible(visible);
    setSnackbarMessage(message);
  }

  return (
    <View style={itemsStyles.container}>
      <Text>{params.listName}</Text>
      <FlatList
        contentContainerStyle={itemsStyles.flatList}
        data={items}
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
        <Dialog visible={deleteModalIsVisible} style={itemsStyles.dialog}>
          <Dialog.Title>Remover item da lista?</Dialog.Title>

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
