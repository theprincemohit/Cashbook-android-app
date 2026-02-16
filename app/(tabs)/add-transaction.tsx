import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useTeamContext } from '@/context/TeamContext';
import { useCustomerContext } from '@/hooks/useCustomerContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';
import { router, useLocalSearchParams } from "expo-router";

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
  Menu,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';

export default function AddTransactionScreen({ route }: any) {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { currentUser, canEdit } = useTeamContext();
  const { postdata, businessId } = useLocalSearchParams();

  const { addEntry, deleteEntry, updateEntry, getBusinessEntries, getBusinessBalance } =
    usePassbookContext();
  const { businesses } = useBusinessContext();
  const { customers } = useCustomerContext();
  console.log('businessId from route params:', businessId);
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
  const [partyName, setPartyName] = useState(postdata || ''); // Initialize with postdata from route params 

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
    if (postdata) {
      setPartyName(postdata);
    }
  }, [postdata]);

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
  

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header>
      <Appbar.BackAction  onPress={() => router.push({
                                          pathname: '/transaction',
                                          params: { },
                                        })} />
      <Appbar.Content title={menu()} />
      
      <Appbar.Action icon="dots-vertical" onPress={() => {}} />
    </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <MaterialCard style={{paddingTop  : 25, 
          borderColor:transactionType === 'credit' ? '#01865f' : '#c93b3b', 
          borderWidth: 2
        }}>
            <Chip  style={{marginBottom: 16, backgroundColor: '#dff0d8', borderColor: '#d6e9c6'}} icon="check" onPress={() => console.log('Pressed')}>Example Chip</Chip>
             
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
              label={t('selectCustomer')}
              value=''
              onChangeText={() => {}}
              onFocus={() => router.push({
                        pathname: "/select-party",
                        params: { businessId: selectedBusinessId },
                      })}
              mode="outlined"
              style={[styles.input]}
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
