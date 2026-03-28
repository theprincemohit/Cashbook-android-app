import { createBusiness, updateBusinessById } from '@/api/businessApi';
import { createPassbook, updatePassbookById } from '@/api/passbookApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { router, useLocalSearchParams } from "expo-router";

import { useProtectedRoute } from '@/hooks/useAuthRoute';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  StyleSheet,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Appbar,
  Button,
  HelperText,
  TextInput
} from 'react-native-paper';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  description: yup.string().required('Description is required').min(5, 'Description must be at least 5 characters'),
}).required();

export default function AddFormScreen({ route }: any) {
  useProtectedRoute();
  const { t } = useLanguageContext(); 
  const { formId, formName, formDescription, formAction, formType } = useLocalSearchParams();
  const { activeBusinessId } = useBusinessContext();
  console.log("Received params in AddFormScreen:", { formId, formName, formDescription, formAction, formType, activeBusinessId });
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: String(formName) || '',
      description: String(formDescription) || '',
    }
  }); 

  useEffect(() => {
    if (formId) {
      reset({
      name: String(formName),
      description: String(formDescription),
    }); // Update form values when data arrives
    }
  }, [formId, reset]);

  const handleFunction = (param: any) => {
      switch(formType) {
        case "Business":
          console.log("Business Form Action:", {formType}, {formAction}, "with data:", param);
          return formAction === "update" ? updateBusinessById(formId, param) : createBusiness(param);
        case "Passbook":
          return formAction === "update" ? updatePassbookById(activeBusinessId, formId, param) : createPassbook(param);
        default:
          return () => {};
      }
  };
    const SubmitData = async(data: any) => {
      let param;
      if(formType === "Business") {
       param = {
        ...data,
        "user_id": 1,  //Question: Should this be dynamic based on logged in user?
        "industry": "string", // Optional: Could be added to form in future iterations
        "founded_year": 1800, // Optional: Could be added to form in future iterations
        "revenue": 0, // Optional: Could be added to form in future iterations
        "employees": 1, // Optional: Could be added to form in future iterations
        "location": "string" // Optional: Could be added to form in future iterations
      }
    } else if(formType === "Passbook") {
      param = {
        ...data,
        "business_id": activeBusinessId,
      }
    }

      const result = await handleFunction(param);
      console.log("Result of handleFunction:", result);
      const url = 'passbook/5';
      //router.push(`/${formType === "Business" ? url : "add-transaction"}`);
    };
   
 

  const onSubmit = (data: any) => {
    console.log('Saving Business:', data);
    SubmitData(data);
    reset();
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
           {/* Add/Edit Business or Passbook Form */}
        <Appbar.Content title= {` ${String(formAction).toUpperCase()} ${String(formType).toUpperCase()}`} /> 
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
    </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <MaterialCard style={{paddingTop  : 25}}>
             
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t('businesses')}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  placeholder={t('enterBusinessName')}
                  style={styles.input}
                  numberOfLines={1}
                  error={!!errors.name}
                />
              )}
              name="name"
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name?.message}
            </HelperText>
             
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t('description')}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  placeholder={t('enterTransactionDescription')}
                  style={styles.input}
                  multiline
                  numberOfLines={5}
                  error={!!errors.description}
                />
              )}
              name="description"
            />
            <HelperText type="error" visible={!!errors.description}>
              {errors.description?.message}
            </HelperText>
            <Button style={{marginTop: 16}} mode="contained" onPress={handleSubmit(onSubmit)}>
              {formAction === "update" ? t('update') : t('save')}
            </Button>
            <Button style={{marginTop: 16}} mode='outlined'>{t('cancel')}</Button>
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