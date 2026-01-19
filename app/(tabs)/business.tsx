import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { Business, useBusinessContext } from '@/hooks/useBusinessContext';

export default function BusinessScreen() {
  const theme = useTheme();
  const { businesses, addBusiness, updateBusiness, deleteBusiness } =
    useBusinessContext();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddBusiness = () => {
    setBusinessName('');
    setEditingId(null);
    setDialogVisible(true);
  };

  const handleEditBusiness = (business: Business) => {
    setBusinessName(business.name);
    setEditingId(business.id);
    setDialogVisible(true);
  };

  const handleSave = () => {
    if (!businessName.trim()) {
      Alert.alert('Error', 'Please enter a business name');
      return;
    }

    if (editingId) {
      updateBusiness(editingId, businessName.trim());
    } else {
      addBusiness(businessName.trim());
    }

    setDialogVisible(false);
    setBusinessName('');
    setEditingId(null);
  };

  const handleDeleteBusiness = (id: string, name: string) => {
    Alert.alert(
      'Delete Business',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => deleteBusiness(id),
          style: 'destructive',
        },
      ]
    );
  };

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <Card style={[styles.businessCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.businessHeader}>
          <View style={styles.businessInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.name}
            </Text>
            {/* <Text
              variant="labelSmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Added: {item.createdAt.toLocaleDateString()}
            </Text> */}
          </View>
          <View style={styles.businessActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleEditBusiness(item)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
              onPress={() => handleDeleteBusiness(item.id, item.name)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Businesses
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Manage your business accounts
          </Text>
        </View>

        {businesses.length === 0 ? (
          <MaterialCard title="No Businesses" subtitle="Get started by creating one">
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              You haven't created any businesses yet. Tap the + button to add one.
            </Text>
          </MaterialCard>
        ) : (
          <View style={styles.listContainer}>
            <Text variant="labelLarge" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              Total: {businesses.length} {businesses.length === 1 ? 'Business' : 'Businesses'}
            </Text>
            <FlatList
              data={businesses}
              renderItem={renderBusinessItem}
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
        onPress={handleAddBusiness}
        label="Add Business"
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingId ? 'Edit Business' : 'Create New Business'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              mode="outlined"
              placeholder="Enter business name"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSave}>
              {editingId ? 'Update' : 'Create'}
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
  businessCard: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 2,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  businessInfo: {
    flex: 1,
    marginRight: 12,
  },
  businessActions: {
    flexDirection: 'row',
    gap: 8,
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
