import { blue } from '@/colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type CustomButtonProps = {
  title: string;
  bgColor?: string;
  onPress: () => Promise<void> | void;
};

export default function CustomButton({ onPress, title, bgColor = blue.light1 }: CustomButtonProps) {
  const styles = StyleSheet.create({
    customButton: {
      backgroundColor: bgColor,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
  });
  return (
    <TouchableOpacity onPress={onPress} style={styles.customButton}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
