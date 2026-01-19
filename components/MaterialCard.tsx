import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';

interface MaterialCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function MaterialCard({
  title,
  subtitle,
  children,
  style,
  onPress,
}: MaterialCardProps) {
  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      {title && (
        <Card.Title
          title={title}
          subtitle={subtitle}
        />
      )}
      {children && (
        <Card.Content>
          {children}
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 12,
  },
});
