import CustomButton from '@/components/CustomButton';
import CustomCard from '@/components/CustomCard';
import CustomInput from '@/components/CustomInput';
import useListsDatabase from '@/database/useListsDatabase';
import { itemsStyles } from '@/styles/items';
import { List } from '@/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Snackbar } from 'react-native-paper';

export default function Lists() {
  const [lists, setLists] = useState<List[]>([]);
  const [currentListId, setCurrentListId] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newListName, setNewListName] = useState('');
  const [newListModalIsVisible, setNewListModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const listsDB = useListsDatabase();

  useEffect(() => {
    getLists();
  }, []);

  async function getLists() {
    try {
      const response = await listsDB.getAllLists().then(res => {
        setLists(res);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function createList(name: string) {
    try {
      const response = await listsDB.create(name).then(() => {
        setNewListName('');
        setNewListModalIsVisible(false);
        handleSnack(true, 'Lista criada');
        getLists();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteList(id: string) {
    try {
      const response = await listsDB.deleteList(id).then(() => {
        handleSnack(true, 'Lista apagada');
        getLists();
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleDelete() {
    if (currentListId !== '') {
      deleteList(currentListId);
      handleCloseDeleteDialog();
    } else return '';
  }

  function handleCloseDeleteDialog() {
    setDeleteModalIsVisible(false);
    setCurrentListId('');
  }

  function handleSnack(visible: boolean, message: string) {
    setIsSnackbarVisible(visible);
    setSnackbarMessage(message);
  }

  const styles = StyleSheet.create({
    newListDialogView: {
      paddingHorizontal: 16,
      gap: 16,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 8,
      height: 48,
      fontSize: 18,
      lineHeight: 28,
      paddingHorizontal: 12,
    },
  });

  return (
    <View style={itemsStyles.container}>
      <StatusBar barStyle="light-content" />

      <CustomButton onPress={() => setNewListModalIsVisible(true)} title="Nova lista" />

      <FlatList
        contentContainerStyle={itemsStyles.flatList}
        data={lists}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              router.navigate({
                pathname: '/displayList/[id]',
                params: { id: item.id, listName: item.name },
              })
            }
          >
            <CustomCard
              key={index}
              name={item.name}
              onPressDelete={() => {
                setCurrentListId(item.id);
                setDeleteModalIsVisible(true);
              }}
            />
          </TouchableOpacity>
        )}
      />

      <Portal>
        <Dialog visible={newListModalIsVisible} style={itemsStyles.dialog}>
          <Dialog.Title>Criar nova lista</Dialog.Title>

          <View style={styles.newListDialogView}>
            <View>
              <CustomInput
                placeholder="Digite o nome da nova lista"
                onChangeText={setNewListName}
                value={newListName}
                style={styles.modalInput}
              />
            </View>

            <CustomButton title="Criar" onPress={() => createList(newListName)} />
          </View>

          <Dialog.Actions style={{ marginTop: 16 }}>
            <Button onPress={() => setNewListModalIsVisible(false)}>Voltar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={deleteModalIsVisible} style={itemsStyles.dialog}>
          <Dialog.Title>Apagar lista?</Dialog.Title>

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
