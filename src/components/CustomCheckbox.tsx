import { Item } from '@/types';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

interface CustomCheckboxProps {
  item: Item;
  selectedItems: Item[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

export default function CustomCheckbox({
  item,
  selectedItems,
  setSelectedItems,
}: CustomCheckboxProps) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (selectedItems.some(select => select.id === item.id)) {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    if (checked) {
      setSelectedItems(prev => prev.concat(item));
    } else {
      setSelectedItems(prev => prev.filter(a => a.id !== item.id));
    }
  }, [checked]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked(!checked);
        }}
      />
      <Text>{item.name}</Text>
    </View>
  );
}
