import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Icon, Text, useTheme } from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { useLanguageContext } from '@/context/LanguageContext';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { useCustomerContext } from '@/hooks/useCustomerContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { businesses } = useBusinessContext();
  const { customers } = useCustomerContext();
  const { entries } = usePassbookContext();

  const businessCount = businesses.length;
  const customerCount = customers.length;
  const transactionCount = entries.length;

  // Calculate summary statistics
  const totalBalance = entries.reduce((sum, entry) => {
    return entry.type === 'credit' ? sum + entry.amount : sum - entry.amount;
  }, 0);

  const totalCredit = entries
    .filter((e) => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalDebit = entries
    .filter((e) => e.type === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('home')}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Dashboard Overview
        </Text>
      </View>

       {/* Statistics Card */}
      <MaterialCard title={t('transactionHistory')} subtitle="Financial Summary">
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('totalCredit')}
            </Text>
            <Text variant="titleMedium" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              ${totalCredit.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('totalDebit')}
            </Text>
            <Text variant="titleMedium" style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
              ${totalDebit.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('balance')}
            </Text>
            <Text
              variant="titleMedium"
              style={{
                color: totalBalance >= 0 ? '#4CAF50' : '#FF6B6B',
                fontWeight: 'bold',
              }}>
              ${totalBalance.toFixed(2)}
            </Text>
          </View>
        </View>
      </MaterialCard>

      {/* Quick Stats */}
      {businessCount > 0 && (
        <MaterialCard title="Business Overview" subtitle={`You have ${businessCount} active business(es)`}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Avg Customers
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                {(customerCount / businessCount).toFixed(1)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Avg Transactions
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                {(transactionCount / businessCount).toFixed(1)}
              </Text>
            </View>
          </View>
        </MaterialCard>
      )}
      
      {/* Summary Cards Grid */}
      <View style={styles.gridContainer}>
        {/* Business Count Card */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon source="briefcase" size={20} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" style={[styles.countText, { color: theme.colors.primary }]}>
              {businessCount}
            </Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer }}>
              {t('businessPlural')}
            </Text>
          </Card.Content>
        </Card>

        {/* Customer Count Card */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon source="account-multiple" size={20} color={theme.colors.tertiary} />
            </View>
            <Text variant="headlineMedium" style={[styles.countText, { color: theme.colors.tertiary }]}>
              {customerCount}
            </Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onTertiaryContainer }}>
              {t('customerPlural')}
            </Text>
          </Card.Content>
        </Card>

        {/* Transaction Count Card */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon source="receipt" size={20} color={theme.colors.secondary} />
            </View>
            <Text variant="headlineMedium" style={[styles.countText, { color: theme.colors.secondary }]}>
              {transactionCount}
            </Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer }}>
              {t('transactions')}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.spacing} />
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
  gridContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  summaryCard: {
    borderRadius: 12,
    flexBasis: '48%',
    marginBottom: 12,
    minHeight: 110,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    marginBottom: 2,
  },
  countText: {
    marginVertical: 4,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#e0e0e0',
  },
  spacing: {
    height: 24,
  },
});
