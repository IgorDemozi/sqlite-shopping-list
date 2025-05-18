import { blue } from '@/colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type CustomButtonProps = {
  title: string;
  onPress: () => Promise<void>;
};

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: blue.light1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});

export default function CustomButton({ onPress, title }: CustomButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.customButton}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
