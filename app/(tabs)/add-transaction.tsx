import { createTransaction, updateTransactionById } from '@/api/transactionApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { router, useLocalSearchParams } from "expo-router";

import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Appbar,
  Button,
  SegmentedButtons,
  TextInput
} from 'react-native-paper';

export default function AddTransactionScreen({ route }: any) {
  const { t } = useLanguageContext();
  const { setActivePassbookId, activePassbookId, setActiveBusinessId } = useBusinessContext();
  const { formId, formAction, customerName, formDescription, formAmount, formType } = useLocalSearchParams();
 

  // const [businessDropdownVisible, setBusinessDropdownVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'| ''>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');


  const handleSubmit = async () => {
    let params;
    console.log("Form Action:", formAction);
     if(formAction === "update") {
      params = {
      passbook_id: activePassbookId, // Placeholder: Replace with actual passbook ID associated with selected business
      txn_type: transactionType,
      amount: parseFloat(amount),
      txn_date: new Date().toISOString(),
      description: description,
      }
      const result  = await updateTransactionById(formId,params);
      console.log("Result of updateTransactionById API call:", result);
      if(result.status === 200) {
        handleAddEntry();
        router.push({
          pathname: '/transaction',
          params: { },
        });
      }
    }
    else {
      params = {
      passbook_id: activePassbookId, // Placeholder: Replace with actual passbook ID associated with selected business
      txn_type: transactionType,
      amount: parseFloat(amount),
      txn_date: new Date().toISOString(),
      description: description,
      }
      const result  = await createTransaction(params);
      console.log("Result of createTransaction API call:", result);
      if(result.status === 201) {
        handleAddEntry();
        router.push({
          pathname: '/transaction',
          params: { },
        });
      }
    }
    
      
       
  };

  const handleAddEntry = () => {
    setAmount('');
    setDescription('');
    setTransactionType('credit');
  };

  const handleSave = () => {
    if (!amount.trim() || !description.trim()) {
      Alert.alert(t('error'), t('pleaseEnterAllFields'));
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert(t('error'), 'Please enter a valid amount');
      return;
    }

    handleSubmit();
  };


  // const menu = () => (
  //    <Menu
  //           visible={businessDropdownVisible}
  //           onDismiss={() => setBusinessDropdownVisible(false)}
  //           anchor={
  //             <TouchableOpacity
  //               style={[
  //                 styles.dropdownButton,
  //                 { backgroundColor: theme.colors.surface },
  //               ]}
  //               onPress={() => setBusinessDropdownVisible(true)}>
  //               <Text
  //                 variant="bodyMedium"
  //                 style={{
  //                   color: selectedBusinessId
  //                     ? theme.colors.onSurface
  //                     : theme.colors.onSurfaceVariant,
  //                   flex: 1,
  //                 }}>
  //                 {selectedBusiness?.name}   ▼
  //               </Text>
  //               {/* <Text
  //                 style={{
  //                   color: theme.colors.onSurfaceVariant,
  //                   fontSize: 18,
  //                 }}>
  //                 ▼
  //               </Text> */}
  //             </TouchableOpacity>
  //           }>
  //           {businesses.map((business) => (
  //             <Menu.Item
  //               key={business.id}
  //               onPress={() => {
  //                 setSelectedBusinessId(business.id);
  //                 setBusinessDropdownVisible(false);
  //               }}
  //               title={business.name}
  //               style={{
  //                 backgroundColor:
  //                   selectedBusinessId === business.id
  //                     ? `${theme.colors.primary}20`
  //                     : 'transparent',
  //               }}
  //             />
  //           ))}
  //         </Menu>
  // );
  

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header>
      <Appbar.BackAction  onPress={() => router.push({
                                          pathname: '/transaction',
                                          params: { },
                                        })} />
      <Appbar.Content title="Add Transaction" />
      
      <Appbar.Action icon="dots-vertical" onPress={() => {}} />
    </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <MaterialCard style={{paddingTop  : 25, 
          borderColor:transactionType === 'credit' ? '#01865f' : '#c93b3b', 
          borderWidth: 2
        }}>
            <View style={styles.transactionTypeRow}>
                <SegmentedButtons
                value={transactionType || String(formType)}
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
              value={amount || (formAmount ? String(formAmount) : '')}
              onChangeText={setAmount}
              mode="outlined"
              placeholder="0.00"
              keyboardType="decimal-pad"
              style={styles.input}
            />

             {/* <TextInput
              label={t('selectCustomer')}
              value={customerName ? String(customerName) : ''}
              onChangeText={() => {}}
              onFocus={() => router.push({
                        pathname: "/select-party",
                        params: { formAction: formAction,
                          formId: formId,
                          customerName: customerName,
                          formAmount: amount || String(formAmount),
                          formType:  transactionType || String(formType),
                          formDescription: description || String(formDescription),
                         },
                      })}
              mode="outlined"
              style={[styles.input]}
            /> */}

           


            <TextInput
              label={t('description')}
              value={description || String(formDescription) || ''}
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
             <Button style={{marginTop: 16}} mode='outlined' onPress={() => {}}>{t('cancel')}</Button>
            
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
