import { MaterialCard } from '@/components/MaterialCard';
import { useLanguageContext } from '@/context/LanguageContext';
import { useTeamContext } from '@/context/TeamContext';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { useCustomerContext } from '@/hooks/useCustomerContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';
import {
  useNavigation,
} from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Appbar,
  Button,
  Chip,
  IconButton,
  Menu,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';

export default function AddTransactionScreen({ route }: any) {
  const theme = useTheme();
  const navigation = useNavigation();
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
  const [partyName, setPartyName] = useState('');

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

   useEffect(() => {
    if (route?.params?.postData) {
      // Do something with the post data
      console.log('Received data:', route.params.postData);
      alert('New post: ' + route.params.postData);
      setPartyName(route.params.postData);
    }
  }, [route?.params?.postData]);

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
    <View style={[styles.container, { backgroundColor: '#eee' }]}>
      <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title={menu()} />
      
      <Appbar.Action icon="dots-vertical" onPress={() => {}} />
    </Appbar.Header>
      <ScrollView style={styles.scrollView}>

        <MaterialCard style={{paddingTop  : '25'}}>
            <Chip color='#3c763d' style={{marginBottom: 16, color: '#3c763d', backgroundColor: '#dff0d8', borderColor: '#d6e9c6'}} icon="check" onPress={() => console.log('Pressed')}>Example Chip</Chip>
             <TextInput
              label={t('selectCustomer')}
              value={partyName || 'NA'}
              onChangeText={() => {}}
              onFocus={() => navigation.navigate('select-party', { businessId: selectedBusinessId})}
              mode="outlined"
              style={[styles.input, { marginBottom: 16 }]}
            />

           <View style={styles.transactionTypeRow}>
                <SegmentedButtons
                value={transactionType}
                onValueChange={(value) => setTransactionType(value as 'credit' | 'debit')}
                buttons={[
                  {
                    value: 'credit',
                    checkedColor: transactionType === 'credit' ? '#fff' : '#000',
                    label: t('credit'),
                    style: { flex: 1, borderRadius: 5,
                      backgroundColor: transactionType === 'credit' ? '#01865f' : 'transparent',
                     },
                  },
                  {
                    value: 'debit',
                    checkedColor: transactionType === 'debit' ? '#fff' : '#000',
                    label: t('debit'),
                    style: { flex: 1, borderRadius: 5, 
                      backgroundColor: transactionType === 'debit' ? '#c93b3b' : 'transparent',
                     },
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
            <Button style={{marginTop: 16}} mode="contained" onPress={handleSave}>
              {t('add')}
            </Button>
             <Button style={{marginTop: 16}} mode='outlined' onPress={() => setDialogVisible(false)}>{t('cancel')}</Button>
            
        </MaterialCard>
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
