import { initializeDatabase } from '@/database/initializeDatabase';
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Provider>
        <SQLiteProvider databaseName="shoppingList.db" onInit={initializeDatabase}>
          <Slot />
        </SQLiteProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
