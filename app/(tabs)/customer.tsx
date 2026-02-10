import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  useTheme
} from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { useLanguageContext } from '@/context/LanguageContext';
import { Customer, useCustomerContext } from '@/hooks/useCustomerContext';
import { router } from 'expo-router';

export default function CustomerScreen() {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { customers } = useCustomerContext();

  const SummaryCard = () => (
          <MaterialCard title={t('transactionHistory')} subtitle="Financial Summary">
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('totalCredit')}
                </Text>
                <Text variant="titleMedium" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  ₹ 10.00
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('totalDebit')}
                </Text>
                <Text variant="titleMedium" style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                  ₹ 10.00
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
                    color: 10 >= 0 ? '#4CAF50' : '#FF6B6B',
                    fontWeight: 'bold',
                  }}>
                  ₹ 10.00
                </Text>
              </View>
            </View>
          </MaterialCard>
  )
  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <Card mode='contained' style={[styles.customerCard, { backgroundColor: theme.colors.surface, marginHorizontal:0, marginBottom: 0, borderRadius:0 }]}>
      <Card.Content>
        <View style={[styles.customerHeader, { padding:0 }]}>
          <View style={styles.customerInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.name}
              
            </Text>
             <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
              {item.createdAt.toLocaleDateString("en-Us",{ year: "numeric", month: "short", day: "numeric"})}  |  
                {item.createdAt.toLocaleTimeString("en-Us",{ hour: "2-digit", minute: "2-digit" })}
              
            </Text>
          </View>
           <View style={styles.customerInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', textAlign: 'right' }}>
              $10.00
              
            </Text>
             <Text variant="titleMedium" style={{ fontWeight: 100, padding:0, backgroundColor: theme.colors.error, textAlign: 'center', fontSize: 8, color: "#fff" }}>
              Credit
              
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor:  '#ecedee'  }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.push({
                                    pathname: '/passbook',
                                    params: { },
                                  })} />
        <Appbar.Content title="Customer" />
        <Appbar.Action icon="plus" onPress={() => router.push({
                                    pathname: '/add-transaction',
                                    params: { formId: 0,
                                    formName: 'Transaction',
                                    formAction: "Add",
                                    formType: "Transaction"
                                     },
                                  })} />
      </Appbar.Header>
     
      <ScrollView style={styles.scrollView}>
        <SummaryCard />
        {customers.length === 0 ? (
          <MaterialCard title="No Customers" subtitle="Get started by adding one">
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              You haven't added any customers yet. Tap the + button to add one.
            </Text>
          </MaterialCard>
        ) : (
          <View style={styles.listContainer}>
            <Text variant="labelMedium" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              Total {customers.length === 1 ? 'Customer' : 'Customers'}: {customers.length} 
            </Text>
             <FlatList
              data={customers}
              renderItem={renderCustomerItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              contentContainerStyle={{ paddingHorizontal: 5 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  customerCard: {
    borderRadius: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerInfo: {
    
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
