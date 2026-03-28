import React, { useEffect, useState } from 'react';
import {
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
  Divider,
  IconButton,
  Menu,
  Portal,
  Text,
  useTheme
} from 'react-native-paper';

import { createBusiness, deleteBusinessById, getBusinesses, updateBusinessById } from '@/api/businessApi';
import FormDialog from '@/components/FormDialog';
import Loader from '@/components/Loader';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useProtectedRoute } from '@/hooks/useAuthRoute';
import { Business } from '@/types/business';
import { formatDateTime } from '@/utils';
import { router } from 'expo-router';
export default function BusinessScreen() {
  useProtectedRoute();
  const [visible, setVisible] = useState('0');
  const [showModal, setShowModal] = useState(false);
  const openMenu = (id: any) => setVisible(id);
  const closeMenu = (id: any) => setVisible(id);
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { businesses, setBusinesses, deleteBusiness, setActiveBusinessId, activeBusinessId } = useBusinessContext();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');

  const [formVisible, setFormVisible] = useState(false);
  const [formInitialValue, setFormInitialValue] = useState('');
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitUpdate = async (data: any) => {
    const param = {
      name: data.name,
      "user_id": 1,  //Question: Should this be dynamic based on logged in user?
    };
    const result = await updateBusinessById(selectedBusinessId, param);
    if (result && result.status === 200) {
      setFormVisible(false);
      fetchBusinesses();
    }
    setIsLoading(false);
    // Implementation for handling form submission
  };

  const handleSubmitAdd = async (data: any) => {
    const param = {
      name: data.name,
      description: data.name, // Using separate field for description
      "user_id": 1,  //Question: Should this be dynamic based on logged in user?
      "industry": "string", // Optional: Could be added to form in future iterations
      "founded_year": 1800, // Optional: Could be added to form in future iterations
      "revenue": 0, // Optional: Could be added to form in future iterations
      "employees": 1, // Optional: Could be added to form in future iterations
      "location": "string" // Optional: Could be added to form in future iterations
    };
    const result = await createBusiness(param);
    if (result && result.status === 201) {
      setFormVisible(false);
      fetchBusinesses();
    }
    setIsLoading(false);
    // Implementation for handling form submission
  };

  const deleteBusinessByIdHandler = async () => {
    const result = await deleteBusinessById(selectedBusinessId);
    if (result && result.status === 204) {
      fetchBusinesses();
    }
    setIsLoading(false);
  };

  const fetchBusinesses = async () => {
    setIsLoading(true);
    try {
      const response = await getBusinesses();
      setBusinesses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setIsLoading(false);
    }

  };
  useEffect(() => {
    fetchBusinesses();
  }, []);


  const renderBusinessItem = ({ item }: { item: Business }) => (
    <Card mode='contained' style={[styles.customerCard, { backgroundColor: theme.colors.surface, marginHorizontal: 0, marginBottom: 0, borderRadius: 0 }]}>
      <Card.Content>

        <View
          style={[styles.customerHeader, { padding: 0 }]}
        >
          <View style={styles.customerInfo}>
            <Text onPress={() => {
              setActiveBusinessId(Number(item.id));
              router.push({ pathname: '/passbook' })
            }}
              variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.name}
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
              {formatDateTime(item.created_at)}
            </Text>
          </View>

          <View style={{
            paddingTop: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            height: 10,
            zIndex: 999,
            backgroundColor: theme.colors.surface,
          }}>
            <Menu
              visible={item.id === visible}
              onDismiss={() => closeMenu('0')}
              anchor={<IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => openMenu(item.id)}
              />}
            >
              <Menu.Item onPress={() => {
                setSelectedBusinessId(item.id);
                closeMenu('0')
                setFormInitialValue(item.name);
                setFormMode('edit');
                setFormVisible(true);
              }} title="Rename" />
              <Divider />
              <Menu.Item onPress={() => {
                setSelectedBusinessId(item.id);
                setShowModal(true);
                closeMenu('0');
              }} title="Delete" />

            </Menu>
          </View>

        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header dark={true} style={{
        backgroundColor: theme.colors.primary,
        height: 30,
        marginTop: 2,
        paddingTop: 0,
        marginBottom: 8,

      }}>

        <Appbar.Content title={t('businessManagement')} />

      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>

          <Button
            icon="plus"
            mode="outlined"
            onPress={() => {
              setFormVisible(true);
              setFormInitialValue('');
              setFormMode('add');
            }
            }
          >
            Add New Business
          </Button>

        </View>

        {isLoading ? <Loader /> : businesses.length === 0 ? (
          <>
            <MaterialCard title={t('noBusiness')} subtitle={t('getStartedBusiness')}>
              <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
                {t('notCreatedBusiness')}
              </Text>
            </MaterialCard>

          </>
        ) : (
          <>
            <View style={styles.listContainer}>
              {isLoading ? (
                <Loader />
              ) : (
                <FlatList
                  data={businesses}
                  renderItem={renderBusinessItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                  contentContainerStyle={{ paddingHorizontal: 5 }}
                />
              )}
            </View>
            <Portal>
              <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                {/* <Dialog.Title>Login Error</Dialog.Title> */}
                <Dialog.Content>
                  <Text variant="bodyMedium">Are you sure you want to delete this business?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => {
                    setIsLoading(true);
                    deleteBusinessByIdHandler();
                    setShowModal(false);
                    // fetchBusinesses();
                  }}>Yes</Button>
                  <Button onPress={() => {
                    setShowModal(false);
                  }}>No</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>

          </>
        )}
        <FormDialog
          visible={formVisible}
          onDismiss={() => {
            setFormVisible(false);
            setFormInitialValue('');
          }}
          title={`${formMode === 'add' ? 'Add' : 'Rename'} Business`}
          label="Business Name"
          initialValue={formInitialValue}
          onSubmit={(data) => {
            setIsLoading(true);
            if (formMode === 'add') {
              handleSubmitAdd(data);
            } else {
              handleSubmitUpdate(data);
            }
          }}
          mode={formMode}
        />
        {/* {businesses.length > 0 &&
          <BottomDrawer
            business={businesses}
            setActiveBusinessId={setActiveBusinessId}
            activeBusinessId={String(activeBusinessId)}
            handleChange={() => {}}
          />
        } */}
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
});
