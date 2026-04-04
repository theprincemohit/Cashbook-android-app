import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { router } from "expo-router";

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Appbar,
  Button,
  HelperText,
  TextInput,
  useTheme
} from 'react-native-paper';
import * as yup from 'yup';

import { createFirstBusiness } from '@/api/businessApi';
import { useProtectedRoute } from '@/hooks/useAuthRoute';

const schema = yup.object({
  name: yup.string().required('Description is required').min(3, 'Description must be at least 3 characters'),
}).required();

export default function AddTransactionScreen({ route }: any) {
  useProtectedRoute();
  const inputRef = useRef<RNTextInput>(null);

  const theme = useTheme();
  const { t } = useLanguageContext();
  const { setActivePassbookId, activePassbookId, setActiveBusinessId, addBusiness } = useBusinessContext();
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    }
  });

  const [isloading, setIsLoading] = useState(false);

  const onFormSubmit = async (data: any) => {
    let params;
    setIsLoading(true);
      params = {
        user_id: 111111,
        name: data.name,
      }
      const result = await createFirstBusiness(params);
      console.log('Create business result:', result.data);
      if (result.status === 201) {
        handleAddEntry();
        setIsLoading(false);
        setActiveBusinessId(result.data.id);
        addBusiness(result.data);
        router.push({
          pathname: '/passbook',
          params: { refresh: String(new Date().getTime()) }, // Pass a timestamp
        });
      }
    
    setIsLoading(false);

  };

  const handleAddEntry = () => {
    reset();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Focusing input', inputRef.current);
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

 
  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header dark={true} style={{
        backgroundColor: theme.colors.primary,
        height: 30,
        marginTop: 2,
        paddingTop: 0,
        marginBottom: 8,

      }}>
        <Appbar.BackAction onPress={() => router.push({
          pathname: '/passbook',
          params: {},
        })} />
        <Appbar.Content title="Create Business" />

        {/* <Appbar.Action icon="dots-vertical" onPress={() => {}} /> */}
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <View style={{
          padding: 25
        }}>


          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  ref={inputRef}
                  label={t('addBusiness')}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  placeholder={t('enterBusinessName')}
                  style={styles.input}
                  error={!!errors.name}
                />
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name?.message}
                </HelperText>
              </>


            )}
          />


          <Button style={{ marginTop: 2 }}
            mode="contained"
            loading={isloading}
            disabled={isloading}
            onPress={handleSubmit(onFormSubmit)}>
            {t('create')}
          </Button>


        </View>
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
