import { MaterialCard } from '@/components/MaterialCard';
import { useLanguageContext } from '@/context/LanguageContext';
import { useTeamContext } from '@/context/TeamContext';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { useCustomerContext } from '@/hooks/useCustomerContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';
import { router } from 'expo-router';
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
  Appbar,
  Button,
  Dialog,
  IconButton,
  Menu,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';

export default function PassbookScreen() {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { currentUser, canEdit } = useTeamContext();
  const { addEntry, deleteEntry, updateEntry, getBusinessEntries, getBusinessBalance } =
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
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [customerDropdownVisible, setCustomerDropdownVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

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
      Alert.alert(t('error'), t('pleaseEnterAllFields'));
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(t('error'), 'Please enter a valid amount');
      return;
    }

    addEntry(
      selectedBusinessId,
      selectedBusiness?.name || 'Unknown Business',
      transactionType,
      numAmount,
      description.trim(),
      currentUser?.id || 'admin_001'
    );

    setDialogVisible(false);
    setAmount('');
    setDescription('');
  };

  const handleDeleteEntry = (id: string, desc: string, createdBy: string) => {
    if (!canEdit(createdBy)) {
      Alert.alert(t('error'), 'You can only delete transactions you created');
      return;
    }
    Alert.alert(
      t('deleteTransaction'),
      `${t('areYouSureDelete')} "${desc}"?`,
      [
        { text: t('cancel'), onPress: () => {}, style: 'cancel' },
        {
          text: t('delete'),
          onPress: () => deleteEntry(id),
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditEntry = (entryId: string) => {
    const entry = getBusinessEntries(selectedBusinessId).find((e) => e.id === entryId);
    if (!entry) return;

    setEditingEntryId(entryId);
    setTransactionType(entry.type);
    setAmount(entry.amount.toString());
    setDescription(entry.description);
    setEditDialogVisible(true);
  };

  const handleUpdateEntry = () => {
    if (!amount.trim() || !description.trim()) {
      Alert.alert(t('error'), t('pleaseEnterAllFields'));
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(t('error'), 'Please enter a valid amount');
      return;
    }

    if (editingEntryId) {
      updateEntry(
        editingEntryId,
        transactionType,
        numAmount,
        description.trim()
      );

      setEditDialogVisible(false);
      setEditingEntryId(null);
      setAmount('');
      setDescription('');
    }
  };

  const menu = () => (
     <Menu
            visible={businessDropdownVisible}
            onDismiss={() => setBusinessDropdownVisible(false)}
            anchor={
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  { backgroundColor: theme.colors.surface },
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
                  {selectedBusiness?.name}   ▼
                </Text>
                {/* <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontSize: 18,
                  }}>
                  ▼
                </Text> */}
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
  );
  const renderEntry = ({ item }: { item: any }) => (
    <View style={[styles.tableRow, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }]}>
      <Text style={[styles.tableCell, { flex: 1.2 }]} numberOfLines={1}>
        {item.name || 'Customer Name'}
      </Text>
      <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>
        {item.description}
      </Text>
      <Text style={[styles.tableCell, { flex: 0.9, textAlign: 'center' }]}>
        {item.date.toLocaleDateString()}
      </Text>
      <Text
        style={[
          styles.tableCell,
          {
            flex: 1,
            textAlign: 'right',
            color: item.type === 'credit' ? '#4CAF50' : '#FF6B6B',
            fontWeight: 'bold',
          },
        ]}>
       {item.amount}
      </Text>
      <View style={[styles.tableCell, { flex: 1.2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 4 }]}>
        {canEdit(item.createdBy) && (
          <>
            <IconButton
              icon="pencil"
              iconColor={theme.colors.primary}
              size={16}
              style={styles.iconButton}
              onPress={() => handleEditEntry(item.id)}
            />
            <IconButton
              icon="delete"
              iconColor={theme.colors.error}
              size={16}
              style={styles.iconButton}
              onPress={() => handleDeleteEntry(item.id, item.description, item.createdBy)}
            />
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={menu()} />
      
      <Appbar.Action icon="dots-vertical" onPress={() => {}} />
    </Appbar.Header>
      <ScrollView style={styles.scrollView}>

         {/* Balance Card */}
          <MaterialCard title={t('transactionHistory')} subtitle="Financial Summary">
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('totalCredit')}
                </Text>
                <Text variant="titleMedium" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  ₹{currentBalance.toFixed(2)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('totalDebit')}
                </Text>
                <Text variant="titleMedium" style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                  ₹{currentBalance.toFixed(2)}
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
                    color: currentBalance >= 0 ? '#4CAF50' : '#FF6B6B',
                    fontWeight: 'bold',
                  }}>
                  ₹{currentBalance.toFixed(2)}
                </Text>
              </View>
            </View>
          </MaterialCard>

        {/* Transactions List */}
        {businessEntries.length === 0 ? (
          <MaterialCard
            title={t('noTransactions')}
            subtitle={t('getStartedTransaction')}>
            <Text
              variant="bodyMedium"
              style={{ textAlign: 'center', paddingVertical: 16 }}>
              {t('noTransactionsBusiness')}
            </Text>
          </MaterialCard>
        ) : (
          <View style={styles.listContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text variant="labelLarge" style={{ paddingHorizontal: 16, marginBottom: 12 }}>
              {t('transactions')}: {businessEntries.length} 
               
            </Text>
           <Button  onPress={() => router.push({  pathname: '/add-transaction',
            params: { businessId: selectedBusiness?.id} })} >
              {t('addTransaction')}
            </Button>
            </View>
            {/* Table Header */}
            <View style={[styles.tableHeader, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.tableHeaderCell, { flex: 1.2 }]} numberOfLines={1}>
                {t('name')}
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.5 }]} numberOfLines={1}>
                {t('remarks')}
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.9, textAlign: 'center' }]}>
                {t('date')}
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>
                {t('amount')}
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.9, textAlign: 'center' }]}>
                {t('action')}
              </Text>
            </View>
            {/* Table Rows */}
            <FlatList
              data={businessEntries}
              renderItem={renderEntry}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
            />
          </View>
        )}
      </ScrollView>

      

      <Portal>
        <Dialog 
        style={{ backgroundColor: theme.colors.surface }}
        visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{t('addTransaction')}</Dialog.Title>
          <Dialog.Content>
            <View style={styles.customerSelectRow}>
              <Text variant="labelMedium" style={{ marginBottom: 8 }}>
                {t('customer')}
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
                      {selectedCustomer?.name || t('selectCustomer')}
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
                {t('entryType')}
              </Text>
              <SegmentedButtons
                value={transactionType}
                onValueChange={(value) => setTransactionType(value as 'credit' | 'debit')}
                buttons={[
                  {
                    value: 'credit',
                    label: t('credit'),
                    style: { flex: 1 },
                  },
                  {
                    value: 'debit',
                    label: t('debit'),
                    style: { flex: 1 },
                  },
                ]}
              />
            </View>

            <TextInput
              label={t('entryAmount')}
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              placeholder="0.00"
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <TextInput
              label={t('description')}
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              placeholder={t('enterTransactionDescription')}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>{t('cancel')}</Button>
            <Button mode="contained" onPress={handleSave}>
              {t('add')}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog 
        style={{ backgroundColor: theme.colors.surface }}
        visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>{t('editTransaction')}</Dialog.Title>
          <Dialog.Content>
            <View style={styles.transactionTypeRow}>
              <Text variant="labelMedium" style={{ marginBottom: 8 }}>
                {t('entryType')}
              </Text>
              <SegmentedButtons
                value={transactionType}
                onValueChange={(value) => setTransactionType(value as 'credit' | 'debit')}
                buttons={[
                  {
                    value: 'credit',
                    label: t('credit'),
                    style: { flex: 1 },
                  },
                  {
                    value: 'debit',
                    label: t('debit'),
                    style: { flex: 1 },
                  },
                ]}
              />
            </View>

            <TextInput
              label={t('entryAmount')}
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              placeholder="0.00"
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <TextInput
              label={t('description')}
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              placeholder={t('enterTransactionDescription')}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setEditDialogVisible(false);
              setEditingEntryId(null);
              setAmount('');
              setDescription('');
            }}>
              {t('cancel')}
            </Button>
            <Button mode="contained" onPress={handleUpdateEntry}>
              {t('update')}
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
  listContainer: {
    paddingVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 16,
    marginTop: 0,
  },
  tableHeaderCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 12,
    paddingHorizontal: 4,
  },
  iconButton: {
    margin: 0,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 8,
    gap: 8,
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
});
