import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text, useTheme } from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { useLanguageContext } from '@/context/LanguageContext';
import { useProtectedRoute } from '@/hooks/useAuthRoute';

export default function ProfileScreen() {
  useProtectedRoute();
  const theme = useTheme();
  const { t } = useLanguageContext();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Avatar.Text size={80} label="AD" style={{ backgroundColor: theme.colors.primary }} />
        <Text variant="headlineMedium" style={styles.name}>
          {t('adminUser')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          admin@example.com
        </Text>
      </View>

      <Divider style={styles.divider} />

      <MaterialCard title={t('personalInformation')} subtitle={t('userDetails')}>
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('fullName')}
          </Text>
          <Text variant="bodyMedium">Admin User</Text>
        </View>
        <Divider style={styles.rowDivider} />
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('email')}
          </Text>
          <Text variant="bodyMedium">admin@example.com</Text>
        </View>
        <Divider style={styles.rowDivider} />
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('phone')}
          </Text>
          <Text variant="bodyMedium">+1 (555) 123-4567</Text>
        </View>
        <Divider style={styles.rowDivider} />
        <View style={styles.infoRow}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('memberSince')}
          </Text>
          <Text variant="bodyMedium">January 20, 2026</Text>
        </View>
      </MaterialCard>

      <MaterialCard title={t('accountStatus')} subtitle={t('accountInformation')}>
        <View style={styles.statusRow}>
          <Text variant="bodyMedium">{t('status')}</Text>
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
            {t('active')}
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
