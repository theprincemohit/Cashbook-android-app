import { DrawerContentScrollView, DrawerItemList, DrawerNavigationProp } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Text, useTheme } from 'react-native-paper';

interface DrawerContentProps {
  navigation: DrawerNavigationProp<any>;
  state: any;
}

export function DrawerContent(props: DrawerContentProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.colors.background }}>
      <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          Cashbook
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
          Welcome, User
        </Text>
      </View>

      <DrawerItemList {...props} />

      <Divider style={styles.divider} />

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}>
          Logout
        </Button>
        <Text variant="labelSmall" style={[styles.version, { color: theme.colors.onSurfaceVariant }]}>
          Version 1.0.0
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  divider: {
    marginVertical: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logoutButton: {
    marginBottom: 12,
  },
  version: {
    textAlign: 'center',
  },
});
