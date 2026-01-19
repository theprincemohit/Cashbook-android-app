import React, { useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Button,
    Card,
    Chip,
    Dialog,
    FAB,
    Menu,
    Portal,
    SegmentedButtons,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { useCustomerContext } from '@/hooks/useCustomerContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';

export default function PassbookScreen() {
  const theme = useTheme();
  const { addEntry, deleteEntry, getBusinessEntries, getBusinessBalance } =
    usePassbookContext();
  const { businesses } = useBusinessContext();
  const { customers } = useCustomerContext();

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    businesses[0]?.id || ''
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ''
  );
  const [businessDropdownVisible, setBusinessDropdownVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [customerDropdownVisible, setCustomerDropdownVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const businessEntries = useMemo(
    () => getBusinessEntries(selectedBusinessId),
    [selectedBusinessId, getBusinessEntries]
  );

  const currentBalance = useMemo(
    () => getBusinessBalance(selectedBusinessId),
    [selectedBusinessId, getBusinessBalance]
  );

  const selectedBusiness = useMemo(
    () => businesses.find((b) => b.id === selectedBusinessId),
    [selectedBusinessId, businesses]
  );

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId),
    [selectedCustomerId, customers]
  );

  const handleAddEntry = () => {
    setAmount('');
    setDescription('');
    setTransactionType('credit');
    setSelectedCustomerId(customers[0]?.id || '');
    setDialogVisible(true);
  };

  const handleSave = () => {
    if (!amount.trim() || !description.trim() || !selectedCustomerId) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addEntry(
      selectedBusinessId,
      selectedBusiness?.name || 'Unknown Business',
      transactionType,
      numAmount,
      description.trim()
    );

    setDialogVisible(false);
    setAmount('');
    setDescription('');
  };

  const handleDeleteEntry = (id: string, desc: string) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete "${desc}"?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => deleteEntry(id),
          style: 'destructive',
        },
      ]
    );
  };

  const renderEntry = ({ item }: { item: any }) => (
    <Card style={[styles.entryCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.entryHeader}>
          <View style={styles.entryInfo}>
            <View style={styles.entryTitleRow}>
              <Text variant="titleSmall" style={{ fontWeight: 'bold', flex: 1 }}>
                {item.description}
              </Text>
              <Chip
                label={item.type.toUpperCase()}
                style={{
                  backgroundColor:
                    item.type === 'credit' ? '#4CAF50' : '#FF6B6B',
                }}
                textStyle={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}
              />
            </View>
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              {item.date.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.amountSection}>
            <Text
              variant="titleMedium"
              style={{
                color: item.type === 'credit' ? '#4CAF50' : '#FF6B6B',
                fontWeight: 'bold',
              }}>
              {item.type === 'credit' ? '+' : '-'} {item.amount.toFixed(2)}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Bal: {item.balance.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.deleteButtonRow}>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            onPress={() => handleDeleteEntry(item.id, item.description)}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Passbook
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Track transactions
          </Text>
        </View>

        {/* Business Selector */}
        <View style={styles.businessSelector}>
          <Text variant="labelMedium" style={{ marginBottom: 8 }}>
            Select Business
          </Text>
          <Menu
            visible={businessDropdownVisible}
            onDismiss={() => setBusinessDropdownVisible(false)}
            anchor={
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface },
                ]}
                onPress={() => setBusinessDropdownVisible(true)}>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: selectedBusinessId
                      ? theme.colors.onSurface
                      : theme.colors.onSurfaceVariant,
                    flex: 1,
                  }}>
                  {selectedBusiness?.name || 'Select Business'}
                </Text>
                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontSize: 18,
                  }}>
                  ▼
                </Text>
              </TouchableOpacity>
            }>
            {businesses.map((business) => (
              <Menu.Item
                key={business.id}
                onPress={() => {
                  setSelectedBusinessId(business.id);
                  setBusinessDropdownVisible(false);
                }}
                title={business.name}
                style={{
                  backgroundColor:
                    selectedBusinessId === business.id
                      ? `${theme.colors.primary}20`
                      : 'transparent',
                }}
              />
            ))}
          </Menu>
        </View>
       

        {/* Balance Card */}
        {selectedBusiness && (
          <MaterialCard
            title={selectedBusiness.name}
            subtitle="Current Balance">
            <View style={styles.balanceView}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Balance
              </Text>
              <Text
                variant="headlineLarge"
                style={{ color: theme.colors.primary, fontWeight: 'bold', marginTop: 4 }}>
                ${currentBalance.toFixed(2)}
              </Text>
            </View>
          </MaterialCard>
        )}

        {/* Transactions List */}
        {businessEntries.length === 0 ? (
          <MaterialCard
            title="No Transactions"
            subtitle="Get started by adding one">
            <Text
              variant="bodyMedium"
              style={{ textAlign: 'center', paddingVertical: 16 }}>
              No transactions yet for this business. Tap the + button to add one.
            </Text>
          </MaterialCard>
        ) : (
          <View style={styles.listContainer}>
            <Text variant="labelLarge" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              Transactions: {businessEntries.length}
            </Text>
            <FlatList
              data={businessEntries}
              renderItem={renderEntry}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
            />
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddEntry}
        label="Add Transaction"
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Add Transaction</Dialog.Title>
          <Dialog.Content>
            <View style={styles.customerSelectRow}>
              <Text variant="labelMedium" style={{ marginBottom: 8 }}>
                Customer
              </Text>
              <Menu
                visible={customerDropdownVisible}
                onDismiss={() => setCustomerDropdownVisible(false)}
                anchor={
                  <TouchableOpacity
                    style={[
                      styles.dropdownButton,
                      { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface },
                    ]}
                    onPress={() => setCustomerDropdownVisible(true)}>
                    <Text
                      variant="bodyMedium"
                      style={{
                        color: selectedCustomerId
                          ? theme.colors.onSurface
                          : theme.colors.onSurfaceVariant,
                        flex: 1,
                      }}>
                      {selectedCustomer?.name || 'Select Customer'}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        fontSize: 18,
                      }}>
                      ▼
                    </Text>
                  </TouchableOpacity>
                }>
                {customers.map((customer) => (
                  <Menu.Item
                    key={customer.id}
                    onPress={() => {
                      setSelectedCustomerId(customer.id);
                      setCustomerDropdownVisible(false);
                    }}
                    title={customer.name}
                    style={{
                      backgroundColor:
                        selectedCustomerId === customer.id
                          ? `${theme.colors.primary}20`
                          : 'transparent',
                    }}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.transactionTypeRow}>
              <Text variant="labelMedium" style={{ marginBottom: 8 }}>
                Transaction Type
              </Text>
              <SegmentedButtons
                value={transactionType}
                onValueChange={(value) => setTransactionType(value as 'credit' | 'debit')}
                buttons={[
                  {
                    value: 'credit',
                    label: 'Credit (+)',
                    style: { flex: 1 },
                  },
                  {
                    value: 'debit',
                    label: 'Debit (-)',
                    style: { flex: 1 },
                  },
                ]}
              />
            </View>

            <TextInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              placeholder="0.00"
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              placeholder="Enter transaction description"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSave}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  businessSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chipRow: {
    flexDirection: 'row',
  },
  balanceView: {
    paddingVertical: 8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  entryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  entryInfo: {
    flex: 1,
    marginRight: 12,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  deleteButtonRow: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginTop: 8,
  },
  transactionTypeRow: {
    marginBottom: 16,
  },
  customerSelectRow: {
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
});
