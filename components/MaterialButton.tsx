import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

interface MaterialButtonProps {
  label: string;
  onPress: () => void;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}

export function MaterialButton({
  label,
  onPress,
  mode = 'contained',
  disabled = false,
  loading = false,
  icon,
  style,
}: MaterialButtonProps) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[styles.button, style]}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
});
