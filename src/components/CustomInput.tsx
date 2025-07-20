import { useEffect, useRef } from 'react';
import { Keyboard, TextInput, TextInputProps } from 'react-native';

export default function CustomInput({ ...rest }: TextInputProps) {
  const localInputRef = useRef<TextInput>(null);

  const keyboardDidHideCallback = () => {
    localInputRef.current && localInputRef.current.blur?.();
  };

  useEffect(() => {
    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHideCallback
    );

    return () => {
      keyboardDidHideSubscription?.remove();
    };
  }, []);

  return (
    <TextInput
      {...rest}
      ref={ref => {
        localInputRef && (localInputRef.current = ref as any);
      }}
      style={
        rest.style
          ? rest.style
          : {
              borderRadius: 8,
              height: 52,
              fontSize: 18,
              lineHeight: 28,
              paddingHorizontal: 16,
              backgroundColor: 'white',
            }
      }
    />
  );
}
