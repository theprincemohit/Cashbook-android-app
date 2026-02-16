import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useTeamContext } from '@/context/TeamContext';
import { useCustomerContext } from '@/hooks/useCustomerContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';
import { router } from "expo-router";
import React, { useMemo, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import Contacts from 'react-native-contacts';
import {
  Appbar,
  Divider,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';

 

export default function SelectPartyScreen() {
   const data = [{
  "recordID": "6b2237ee0df85980",
  "givenName": "John",
  "familyName": "Doe",
  "phoneNumbers": [
    { "label": "mobile", "number": "(555) 555-5555" }
  ],
  "emailAddresses": [
    { "label": "work", "email": "john.doe@company.com" }
  ]
},
{
  "recordID": "6b2237ee0df859801",
  "givenName": "John",
  "familyName": "Doe",
  "phoneNumbers": [
    { "label": "mobile", "number": "(555) 555-5555" }
  ],
  "emailAddresses": [
    { "label": "work", "email": "john.doe@company.com" }
  ]
}
]
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
  const [partyName, setPartyName] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [contactsList, setContactsList] = useState<any[]>(data);

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

  async function requestContactPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'This app needs access to your contacts',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

  async function getContacts() {
  const hasPermission = await requestContactPermission();
  if (!hasPermission) {
    console.log("Permission denied");
    return;
  }

  Contacts.getAll()
    .then(contacts => {
    
      console.log("Contacts:", contacts);
      // setContactsList(contacts);
      // Example: contacts[0].phoneNumbers[0].number
    })
    .catch(err => {
      console.log("Error fetching contacts:", err);
    });
}



  const handleAddEntry = () => {
    setAmount('');
    setTransactionType('credit');
    setSelectedCustomerId(customers[0]?.id || '');
    setDialogVisible(true);
  };

  const handleSave = () => {
    if (!amount.trim() || !partyName.trim() || !selectedCustomerId) {
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
      currentUser?.id || 'admin_001'
    );

    setDialogVisible(false);
    setAmount('');
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

   

  

  
 

  return (
    <View style={[styles.container, { backgroundColor: '#eee' }]}>
      <Appbar.Header>
      <Appbar.Content title={ <TextInput
              label={t('description')}
              value={partyName}
              onChangeText={setPartyName}
              mode="outlined"
              placeholder={t('enterTransactionDescription')}
              style={styles.input}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon onPress={() => router.back()}  icon="arrow-left" />}
            />} />
    </Appbar.Header>
      <ScrollView style={styles.scrollView}>
          <View>
            <View>
                <Text 
                  onPress={() =>  router.push({
          pathname: "/add-transaction",
          params: { 'postdata' : partyName },
        })}
                  

                  style={styles.contactName}>{partyName}</Text>
            
            <Divider />
            </View>
            {contactsList.map((contact) => (
              <View key={contact.recordID}>
                <Text style={styles.contactName}>{contact.givenName} {contact.familyName}</Text>
            
            <Divider />
            </View>
            ))}
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
    marginTop: 8,
    marginLeft: 0,
    paddingLeft: 0,
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
  contactName: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
});
