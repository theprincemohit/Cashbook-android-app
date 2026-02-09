import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Dialog,
  FAB,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { useLanguageContext } from '@/context/LanguageContext';
import { useTeamContext } from '@/context/TeamContext';
import { Customer, useCustomerContext } from '@/hooks/useCustomerContext';
import { router } from 'expo-router';

export default function CustomerScreen() {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { currentUser, canEdit } = useTeamContext();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomerContext();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddCustomer = () => {
    setCustomerName('');
    setMobileNumber('');
    setEditingId(null);
    setDialogVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    if (!canEdit(customer.createdBy)) {
      Alert.alert(t('error'), 'You can only edit customers you created');
      return;
    }
    setCustomerName(customer.name);
    setMobileNumber(customer.mobileNumber);
    setEditingId(customer.id);
    setDialogVisible(true);
  };

  const handleSave = () => {
    if (!customerName.trim() || !mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter both name and mobile number');
      return;
    }

    if (!/^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(mobileNumber.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    if (editingId) {
      updateCustomer(editingId, customerName.trim(), mobileNumber.trim());
    } else {
      addCustomer(customerName.trim(), mobileNumber.trim());
    }

    setDialogVisible(false);
    setCustomerName('');
    setMobileNumber('');
    setEditingId(null);
  };

  const handleDeleteCustomer = (id: string, name: string, createdBy: string) => {
    if (!canEdit(createdBy)) {
      Alert.alert(t('error'), 'You can only delete customers you created');
      return;
    }
    Alert.alert(
      t('deleteCustomer'),
      `${t('areYouSureDelete')} "${name}"?`,
      [
        { text: t('cancel'), onPress: () => {}, style: 'cancel' },
        {
          text: t('delete'),
          onPress: () => deleteCustomer(id),
          style: 'destructive',
        },
      ]
    );
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <Card mode='contained' style={[styles.customerCard, { backgroundColor: theme.colors.surface, marginHorizontal:0, marginBottom: 0 }]}>
      <Card.Content>
        <View style={[styles.customerHeader, { padding:0 }]}>
          <View style={styles.customerInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.name}
              
            </Text>
             <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
              {item.createdAt.toLocaleDateString("en-Us",{ year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              
            </Text>
          </View>
           <View style={styles.customerInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', textAlign: 'right' }}>
              $10.00
              
            </Text>
             <Text variant="titleMedium" style={{ fontWeight: 100, padding:0, backgroundColor: theme.colors.error, textAlign: 'center', fontSize: 8, color: "#fff" }}>
              Credit
              
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor:  '#ecedee'  }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Customer" />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
       
        {customers.length === 0 ? (
          <MaterialCard title="No Customers" subtitle="Get started by adding one">
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              You haven't added any customers yet. Tap the + button to add one.
            </Text>
          </MaterialCard>
        ) : (
          <View style={styles.listContainer}>
            <Text variant="labelLarge" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              Total: {customers.length} {customers.length === 1 ? 'Customer' : 'Customers'}
            </Text>
            <FlatList
              data={customers}
              renderItem={renderCustomerItem}
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
        color={theme.colors.onPrimary}
        onPress={handleAddCustomer}
        label="Add Customer"
      />

      <Portal>
        <Dialog 
        style={{ backgroundColor: theme.colors.surface }}
        visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingId ? 'Edit Customer' : 'Add New Customer'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
              mode="outlined"
              placeholder="Enter customer name"
              style={styles.input}
            />
            <TextInput
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              mode="outlined"
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSave}>
              {editingId ? 'Update' : 'Add'}
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
  listContainer: {
    paddingVertical: 8,
  },
  customerCard: {
  
    
    borderRadius: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerInfo: {
    
  },
 
  actionButton: {
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
});
