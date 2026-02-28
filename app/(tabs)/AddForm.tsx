import { createBusiness, updateBusinessById } from '@/api/businessApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';
import { router, useLocalSearchParams } from "expo-router";

import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Appbar,
  Button,
  TextInput,
  useTheme
} from 'react-native-paper';

export default function AddFormScreen({ route }: any) {
  const theme = useTheme();
  const { t } = useLanguageContext(); 
  const { formId, formName, formDescription, formAction, formType } = useLocalSearchParams();

  const { addEntry, deleteEntry, updateEntry, getBusinessEntries, getBusinessBalance } =
    usePassbookContext();
  const { businesses, addBusiness, updateBusiness } = useBusinessContext();
 
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    businesses[0]?.id || ''
  );
 
  const [formData, setFormData] = useState<{id?: number, name?: string, description?: string, formType?: string} | null>(null); 

  const handleFunction = (param: any) => {
      switch(formType) {
        case "Business":
          console.log("Business Form Action:", {formType}, {formAction}, "with data:", param);
          return formAction === "update" ? updateBusinessById(formId, param) : createBusiness(param);
        case "Passbook":
          return formAction === "update" ? updateEntry : addEntry;
        default:
          return () => {};
      }
  };
    const SubmitData = async() => {
      const param = {
        ...formData,
        "user_id": 1,
        "industry": "string",
        "founded_year": 1800,
        "revenue": 0,
        "employees": 1,
        "location": "string"
      }

      const result = await handleFunction(param);
      console.log("Result of handleFunction:", result);
      router.back();
    };
   
 

  const handleSave = () => {
    if (!formData?.name?.trim() || !formData?.description?.trim()) {
      Alert.alert(t('pleaseEnterAllFields'));
      return;
    }
    console.log('Saving Business:', formData);
    SubmitData();
    setFormData(null);
    
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
           {/* Add/Edit Business or Passbook Form */}
        <Appbar.Content title= {` ${formAction} ${formType} ${formId}`} /> 
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
    </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <MaterialCard style={{paddingTop  : 25}}>
             
            <TextInput
              label={t('businesses')}
              value={formData?.name || String(formName) ||  ''}
              onChangeText={(text) => setFormData({...formData, name: text})}
              mode="outlined"
              placeholder={t('enterBusinessName')}
              style={styles.input}
              numberOfLines={1}
            />
             
            <TextInput
              label={t('description')}
              value={formData?.description || String(formDescription) ||  ''}
              onChangeText={(text) => setFormData({...formData, description: text})}
              mode="outlined"
              placeholder={t('enterTransactionDescription')}
              style={styles.input}
              multiline
              numberOfLines={5}
            />
            <Button style={{marginTop: 16}} mode="contained" onPress={handleSave}>
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