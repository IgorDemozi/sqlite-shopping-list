import { blue, red } from '@/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ItemCardProps = {
  name: string;
  onPressUpdate: () => void;
  onPressDelete: () => void;
};

const styles = StyleSheet.create({
  itemCard: {
    padding: 12,
    backgroundColor: blue.light2,
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardButton: {
    backgroundColor: blue.light1,
    borderRadius: 8,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: blue.dark2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default function ItemCard({ name, onPressUpdate, onPressDelete }: ItemCardProps) {
  return (
    <View style={styles.itemCard}>
      <Text>{name}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cardButton} onPress={onPressUpdate}>
          <FontAwesome size={20} name="pencil" color={blue.dark2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardButton}>
          <FontAwesome size={20} name="trash" color={red.medium} onPress={onPressDelete} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
