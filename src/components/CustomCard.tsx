import { blue, red } from '@/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CustomCardProps = {
  name: string;
  bgColor?: string;
  onPressUpdate?: () => void;
  onPressDelete: () => void;
};

export default function CustomCard({
  name,
  bgColor = blue.light2,
  onPressUpdate,
  onPressDelete,
}: CustomCardProps) {
  const styles = StyleSheet.create({
    customCard: {
      padding: 12,
      backgroundColor: bgColor,
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

  return (
    <View style={styles.customCard}>
      <Text>{name}</Text>

      <View style={styles.buttonsContainer}>
        {onPressUpdate && (
          <TouchableOpacity style={styles.cardButton} onPress={onPressUpdate}>
            <FontAwesome size={20} name="pencil" color={blue.dark2} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.cardButton}>
          <FontAwesome size={20} name="trash" color={red.medium} onPress={onPressDelete} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
