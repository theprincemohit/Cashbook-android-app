import { createTransaction, updateTransactionById } from '@/api/transactionApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { router, useLocalSearchParams } from "expo-router";

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Appbar,
  Button,
  HelperText,
  SegmentedButtons,
  TextInput
} from 'react-native-paper';
import * as yup from 'yup';

import { formatDate } from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';

const schema = yup.object({
  txnDate: yup.date().required('Date is required'),
  transactionType: yup.mixed<'credit' | 'debit'>().oneOf(['credit', 'debit'], 'Please select transaction type').required('Transaction type is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required').typeError('Amount must be a valid number'),
  description: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
}).required();

export default function AddTransactionScreen({ route }: any) {
  const { t } = useLanguageContext();
  const { setActivePassbookId, activePassbookId, setActiveBusinessId } = useBusinessContext();
  const parseQueryParams  = useLocalSearchParams();
  const { formId, formAction, formDate, formDescription, formAmount, formType } = parseQueryParams;
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      txnDate:  new Date(),
      transactionType: (String(formType) || 'credit') as 'credit' | 'debit',
      amount: Number(formAmount) || 0,
      description: String(formDescription) || '',
    }
  });
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [showStartDateDialog, setShowStartDateDialog] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const handleDateChange = (date: string) => {
    setStartDate(new Date(date));
  };
  const onFormSubmit = async (data: any) => {
    let params;
    setIsLoading(true);
     if(formAction === "update") {
      params = {
      passbook_id: activePassbookId, // Placeholder: Replace with actual passbook ID associated with selected business
      txn_type: data.transactionType,
      amount: parseFloat(data.amount),
      txn_date: startDate.toISOString(),
      description: data.description,
      }
      const result  = await updateTransactionById(formId,params);
      if(result.status === 200) {
        handleAddEntry();
        router.push({
          pathname: '/transaction',
          params: { refresh: String(new Date().getTime()) }, // Pass a timestamp
        });
      }
    }
    else {
      params = {
      passbook_id: activePassbookId, // Placeholder: Replace with actual passbook ID associated with selected business
      txn_type: data.transactionType,
      amount: parseFloat(data.amount),
      txn_date: startDate.toISOString(),
      description: data.description,
      }
      const result  = await createTransaction(params);
      if(result.status === 201) {
        handleAddEntry();
        router.push({
          pathname: '/transaction',
          params: { refresh: String(new Date().getTime()) },
        });
      }
    }
      
       
  };

  const handleAddEntry = () => {
    reset();
  };

 useEffect(() => {
    const fetchUserData = async () => {
      // Simulate an API call
      //const result = //await new Promise(resolve => setTimeout(() => resolve(
      const result =   {
      txnDate:  formDate ,
      transactionType: (String(formType) || 'credit') as 'credit' | 'debit',
      amount: formAmount ? Number(formAmount) : 0,
      description: String(formDescription) || '',
    }
    //   ), 200));
      
      setIsLoading(false);
      reset(result); // Resets the form with fetched values
    };

    fetchUserData();
  }, [parseQueryParams.formId, reset]);
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
          borderColor:formType === 'credit' ? '#01865f' : '#c93b3b', 
          borderWidth: 2
        }}>
          
           <Controller
                  control={control}
                  name="txnDate"
                  render={({ field: { onChange, value } }) => (
                    <>
                    <Button 
                   icon="calendar" 
                    mode="outlined"
                     onPress={() => {
                      setShowStartDateDialog(true)
                    }} 
                     style={{marginBottom: 8}}>
                    
    {value ? formatDate(new Date(value)) : 'Select Date'}
  </Button>
                     {showStartDateDialog && <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={'date'}
          is24Hour={true}
          onValueChange={(event, selectedDate) => {
           handleDateChange(selectedDate.toISOString().split('T')[0])
            //handleDateChange('start', selectedDate.toISOString().split('T')[0])}
                 setShowStartDateDialog(false);
        }
            
          }
          onDismiss={() => setShowStartDateDialog(false)}
        />
                  }
                      <HelperText type="error" visible={!!errors.transactionType}>
                        {errors.transactionType?.message}
                      </HelperText>
                    </>
                  )}
                />

                 <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label={t('entryAmount')}
                        value={value !== 0 ? String(value) : ''}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        mode="outlined"
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        style={styles.input}
                        error={!!errors.amount}
                      />
                      <HelperText type="error" visible={!!errors.amount}>
                        {errors.amount?.message}
                      </HelperText>
                    </>
                  )}
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

           


            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label={t('remarks')}
                    value={value !== undefined && value !== null ? String(value) : ''}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    placeholder={t('enterTransactionRemarks')}
                    style={styles.input}
                    multiline
                    numberOfLines={3}
                    error={!!errors.description}
                  />
                  <HelperText type="error" visible={!!errors.description}>
                    {errors.description?.message}
                  </HelperText>
                </>


              )}
            />

            <View style={styles.transactionTypeRow}>
                <Controller
                  control={control}
                  name="transactionType"
                  render={({ field: { onChange, value } }) => (
                    <>
                    
                      <SegmentedButtons
                        value={value || String(formType)}
                        onValueChange={onChange}
                        buttons={[
                          {
                            value: 'credit',
                            checkedColor: value === 'credit' ? '#fff' : '#000',
                            label: t('credit'),
                            style: { flex: 1, borderRadius: 5,
                              backgroundColor: value === 'credit' ? '#01865f' : 'transparent',
                             },
                          },
                          {
                            value: 'debit',
                            checkedColor: value === 'debit' ? '#fff' : '#000',
                            label: t('debit'),
                            style: { flex: 1, borderRadius: 5, 
                              backgroundColor: value === 'debit' ? '#c93b3b' : 'transparent',
                             },
                          },
                        ]}
                      />
                      <HelperText type="error" visible={!!errors.transactionType}>
                        {errors.transactionType?.message}
                      </HelperText>
                    </>
                  )}
                />
            </View>
            <Button style={{marginTop: 2}} 
              mode="contained"
              loading={isloading}
              disabled={isloading}
              onPress={handleSubmit(onFormSubmit)}>
                {t('add')}
            </Button>
             <Button style={{marginTop: 16}} mode='outlined' 
                onPress={() => router.push({pathname: '/transaction'})}>
                  {t('cancel')}
             </Button>
            
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
    marginTop: 2,
  },
  transactionTypeRow: {
    marginBottom: 5,
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
