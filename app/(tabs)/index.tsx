import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Divider, Portal, Text, useTheme } from 'react-native-paper';

import { MaterialButton } from '@/components/MaterialButton';
import { MaterialCard } from '@/components/MaterialCard';
import { MaterialInput } from '@/components/MaterialInput';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const theme = useTheme();

  const handlePress = () => {
    setDialogVisible(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Material Design 3
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          React Native Paper Components
        </Text>
      </View>

      <Divider style={styles.divider} />

      <MaterialCard title="Input Components" subtitle="Text input examples">
        <MaterialInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
        <MaterialInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </MaterialCard>

      <MaterialCard title="Button Variants">
        <MaterialButton label="Contained" onPress={handlePress} mode="contained" />
        <MaterialButton label="Outlined" onPress={handlePress} mode="outlined" />
        <MaterialButton label="Text" onPress={handlePress} mode="text" />
        <MaterialButton label="Elevated" onPress={handlePress} mode="elevated" />
        <MaterialButton label="Tonal" onPress={handlePress} mode="contained-tonal" />
      </MaterialCard>

      <MaterialCard
        title="Interactive Card"
        subtitle="Tap to interact"
        onPress={() => alert('Card pressed!')}>
        <Text variant="bodyMedium">
          Cards provide a contained touchable surface to display information.
        </Text>
      </MaterialCard>

      <View style={styles.spacing} />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Material Dialog</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This is a Material Design 3 dialog component from React Native Paper.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  spacing: {
    height: 24,
  },
});
