import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';

interface MaterialInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  mode?: 'flat' | 'outlined';
  style?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

export function MaterialInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  disabled = false,
  mode = 'outlined',
  style,
  multiline = false,
  numberOfLines = 1,
}: MaterialInputProps) {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      editable={!disabled}
      mode={mode}
      style={[styles.input, style]}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    marginHorizontal: 12,
  },
});
