import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text, useTheme } from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Avatar.Text size={80} label="AD" style={{ backgroundColor: theme.colors.primary }} />
        <Text variant="headlineMedium" style={styles.name}>
          Admin User
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          admin@example.com
        </Text>
      </View>

      <Divider style={styles.divider} />

      <MaterialCard title="Personal Information" subtitle="User details">
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Full Name
          </Text>
          <Text variant="bodyMedium">Admin User</Text>
        </View>
        <Divider style={styles.rowDivider} />
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Email
          </Text>
          <Text variant="bodyMedium">admin@example.com</Text>
        </View>
        <Divider style={styles.rowDivider} />
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Phone
          </Text>
          <Text variant="bodyMedium">+1 (555) 123-4567</Text>
        </View>
        <Divider style={styles.rowDivider} />
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Member Since
          </Text>
          <Text variant="bodyMedium">January 20, 2026</Text>
        </View>
      </MaterialCard>

      <MaterialCard title="Account Status" subtitle="Account information">
        <View style={styles.statusRow}>
          <Text variant="bodyMedium">Status</Text>
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
            Active
          </Text>
        </View>
      </MaterialCard>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  name: {
    marginTop: 12,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  infoRow: {
    paddingVertical: 12,
  },
  rowDivider: {
    marginVertical: 0,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  spacing: {
    height: 24,
  },
});
