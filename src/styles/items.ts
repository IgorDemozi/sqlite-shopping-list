import { blue } from '@/colors';
import { StyleSheet } from 'react-native';

export const itemsStyles = StyleSheet.create({
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
  dialog: { backgroundColor: 'white' },
  dialogInput: {
    borderRadius: 8,
    height: 52,
    fontSize: 18,
    lineHeight: 28,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
  },
});
