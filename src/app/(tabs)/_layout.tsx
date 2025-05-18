import { blue } from '@/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function TabLayout() {
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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: blue.dark2,
        tabBarInactiveTintColor: blue.medium,
        tabBarActiveBackgroundColor: blue.light1,
        // tabBarInactiveBackgroundColor: blue.light1,
        headerTintColor: blue.light1,
        transitionSpec: { animation: 'spring', config: { bounciness: 0, speed: 20 } },
        animation: 'shift',
        tabBarButton: props => (
          <TouchableOpacity children={props.children} onPress={props.onPress} style={props.style} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Listas',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />,
          headerStyle: {
            backgroundColor: blue.dark2,
          },
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Itens',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="edit" color={color} />,
          headerStyle: {
            backgroundColor: blue.dark2,
          },
        }}
      />
    </Tabs>
  );
}
