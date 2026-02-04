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
import { useLanguageContext } from '@/context/LanguageContext';
import { Business, useBusinessContext } from '@/hooks/useBusinessContext';

export default function BusinessScreen() {
  const theme = useTheme();
  const { t } = useLanguageContext();
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
      Alert.alert(t('error'), t('pleaseEnterName'));
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
      t('deleteBusiness'),
      `${t('areYouSureDelete')} "${name}"?`,
      [
        { text: t('cancel'), onPress: () => {}, style: 'cancel' },
        {
          text: t('delete'),
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
                {t('edit')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
              onPress={() => handleDeleteBusiness(item.id, item.name)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                {t('delete')}
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
            {t('businessManagement')}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {t('manageBusinessAccounts')}
          </Text>
        </View>

        {businesses.length === 0 ? (
          <MaterialCard title={t('noBusiness')} subtitle={t('getStartedBusiness')}>
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              {t('notCreatedBusiness')}
            </Text>
          </MaterialCard>
        ) : (
          <View style={styles.listContainer}>
            <Text variant="labelLarge" style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              {t('totalBusiness')}: {businesses.length} {businesses.length === 1 ? t('business') : t('businessPlural')}
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
        color={theme.colors.onPrimary}
        onPress={handleAddBusiness}
        label={t('addBusiness')}
      />

      <Portal>
        <Dialog 
        style={{ backgroundColor: theme.colors.surface }}
        visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingId ? t('editBusiness') : t('createNewBusiness')}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t('businessName')}
              value={businessName}
              onChangeText={setBusinessName}
              mode="outlined"
              placeholder={t('enterBusinessName')}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>{t('cancel')}</Button>
            <Button mode="contained" onPress={handleSave}>
              {editingId ? t('update') : t('create')}
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
