import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Slot } from 'expo-router';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import populateTables from '../../db/PopulateTables';
import migrations from '../../drizzle/migrations';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

export const DATABASE_NAME = 'shoppingList.db';
const expoDB = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDB);

export default function Layout() {
  const { success, error } = useMigrations(db, migrations);

  useDrizzleStudio(expoDB);

  // useEffect(() => {
  //   populateTables(db);
  // }, []);

  useEffect(() => {
    console.log('teste');

    if (error) {
      console.log('erro => ', error.message);
    }

    if (!success) {
      console.log('Carregando...');
    }

    if (success) {
      console.log('success');
      populateTables(db);
    }
  }, [success, error]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    );
  }

  return (
    // <Suspense fallback={<ActivityIndicator size="large" />}>
    <SafeAreaProvider>
      <Provider>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          // options={{ enableChangeListener: true }}
          // useSuspense
          // onInit={initializeDatabase}
        >
          <Slot />
        </SQLiteProvider>
      </Provider>
    </SafeAreaProvider>
    // </Suspense>
  );
}
