import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  Menu,
  Portal,
  Text,
  useTheme
} from 'react-native-paper';

import { deleteTransactionById, getTransactionByPassbookId } from '@/api/transactionApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { currencyFormat, formatDateTime } from '@/utils';
import { router, useLocalSearchParams } from 'expo-router';

export default function TransactionScreen() {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const params = useLocalSearchParams();
  
  const { activePassbookId } = useBusinessContext();
  const [transactions, setTransactions] = React.useState<any[]>([]);

  const [visible, setVisible] = useState('0');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>('');

  const openMenu = (id: any) => setVisible(id);
  const closeMenu = (id: any) => setVisible(id);

  const deleteTransaction = async (id: string) => {
    try {
      const result = await deleteTransactionById(id);
      console.log("Result of deleteTransactionById API call:", result);
      if (result.status === 204) {
        setTransactions((prev) => prev.filter((txn) => txn.id !== id)); 
        console.log(`Transaction with id ${id} deleted successfully`);
      } else {
        console.error(`Failed to delete transaction with id ${id}. Status code: ${result.status}`);
      }
    } catch (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
    }
  };

  const loadData = async () => {
    try {
      const { data, status } = await getTransactionByPassbookId(activePassbookId);
      console.log("Fetched transaction Entries:", data);
      if (status == 200) {
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.formId, params.refresh]); // Re-fetch data when formId or refresh param changes

  const summary = transactions.reduce((accumulator, currentValue) => {
    if(currentValue.txn_type === 'credit') {
      accumulator.credit += currentValue.amount;
    } else {     
       accumulator.debit += currentValue.amount;
    }
     return accumulator;
   
  }, {total: 0, credit: 0, debit: 0}); 
  summary.total = summary.credit - summary.debit;
  console.log("Transaction summary calculated:", summary);
  const SummaryCard = () => (
    <MaterialCard title={t('transactionHistory')}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('totalCredit')}
          </Text>
          <Text variant="titleMedium" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
            ₹ {summary.credit}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('totalDebit')}
          </Text>
          <Text variant="titleMedium" style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
            ₹ {summary.debit}
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
              fontWeight: 'bold',
            }}>
            ₹ {summary.total}
          </Text>
        </View>
      </View>
    </MaterialCard>
  )
  const renderCustomerItem = ({ item }: { item: any }) => (
    <Card mode='contained' style={[styles.customerCard, { backgroundColor: theme.colors.surface, marginHorizontal: 0, marginBottom: 0, borderRadius: 0 }]}>
      <Card.Content>
        <View style={[styles.customerHeader, { padding: 0 }]}>
          <View style={[styles.customerInfo, { width: '60%' }]}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.description}

            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
              {/* {item.createdAt.toLocaleDateString("en-Us",{ year: "numeric", month: "short", day: "numeric"})}  |  
                {item.createdAt.toLocaleTimeString("en-Us",{ hour: "2-digit", minute: "2-digit" })}
               */}
                {formatDateTime(item.created_at)}
             {/* <Text>{"Apr 15, 2026 | 10:30 AM"}</Text>  */}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', textAlign: 'right', color: item.txn_type === 'credit' ? '#4CAF50' : '#FF6B6B' }}>
              {currencyFormat(item.amount)}

            </Text>
             
          </View>
          <View style={{
            paddingTop: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            height: 10,
            zIndex: 999,
            backgroundColor: theme.colors.surface,
          }}>
            <Menu
              visible={item.id === visible}
              onDismiss={() => closeMenu('0')}
              anchor={<IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => openMenu(item.id)}
              />}
            >
              <Menu.Item onPress={() => {
                closeMenu('0');
                router.push({
                  pathname: '/add-transaction',
                  params: {
                    formId: item.id,
                    customerName: item.description,
                    formDescription: item.description,
                    formAmount: item.amount,
                    formType: item.txn_type,
                    formAction: "update",
                  },
                })
              }} title="Edit" />
              <Divider />
              <Menu.Item onPress={() => {
                setSelectedTransactionId(item.id);
                setShowModal(true);
                closeMenu('0');
              }} title="Delete" />

            </Menu>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.push({
          pathname: '/passbook',
          params: {},
        })} />
        <Appbar.Content title="Transaction" />
        <Appbar.Action icon="plus" onPress={() => router.push({
          pathname: '/add-transaction',
          params: {
            formId: 0,
            formName: 'Transaction',
            formDescription: '',
            formAmount: 0,
            formType: 'credit',
            formAction: "Add",
          },
        })} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <SummaryCard />
        {transactions.length === 0 ? (
          <MaterialCard title="No transactions" subtitle="Get started by adding one">
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              You haven't added any transactions yet. Tap the + button to add one.
            </Text>
          </MaterialCard>
        ) : (
          <><View style={styles.listContainer}>
            <Text variant="labelMedium" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              Total {transactions.length === 1 ? 'Customer' : 'transactions'}: {transactions.length}
            </Text>
            <FlatList
              data={transactions}
              renderItem={renderCustomerItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              contentContainerStyle={{ paddingHorizontal: 5 }}
            />
          </View>
           <Portal>
              <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                {/* <Dialog.Title>Login Error</Dialog.Title> */}
                <Dialog.Content>
                  <Text variant="bodyMedium">Are you sure you want to delete this transaction id: ?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => {
                    deleteTransactionById(selectedTransactionId);
                    setShowModal(false);
                    loadData();
                  }}>Yes</Button>
                  <Button onPress={() => {
                    setShowModal(false);
                  }}>No</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
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
