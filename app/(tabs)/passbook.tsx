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

import { createPassbook, deletePassbookById, getPassbookById, updatePassbookById } from '@/api/passbookApi';
import FormDialog from '@/components/FormDialog';
import Loader from '@/components/Loader';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useProtectedRoute } from '@/hooks/useAuthRoute';
import { usePassbookContext } from '@/hooks/usePassbookContext';
import { formatDateTime } from '@/utils';
import { router, useLocalSearchParams } from 'expo-router';

export default function PassbookScreen() {
  useProtectedRoute();
  const theme = useTheme();
  const { activeBusinessId, setActivePassbookId } = useBusinessContext();
  const { t } = useLanguageContext();
  const { entries, setEntries } = usePassbookContext();
  const params = useLocalSearchParams();
  const [visible, setVisible] = useState('0');
  const [showModal, setShowModal] = useState(false);
  const [selectedPassbookId, setSelectedPassbookId] = useState<string>('');

  const [formVisible, setFormVisible] = useState(false);
  const [formInitialValue, setFormInitialValue] = useState('');
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isLoading, setIsLoading] = useState(false);

  const openMenu = (id: any) => setVisible(id);
  const closeMenu = (id: any) => setVisible(id);


  const handleSubmitUpdate = async (data: any) => {
    const param = {
      name: data.name,
      "user_id": 1,  //Question: Should this be dynamic based on logged in user?
    };
    const result = await updatePassbookById(activeBusinessId, selectedPassbookId, param);
    if (result && result.status === 200) {
      setFormVisible(false);
      loadData();
    }
    setIsLoading(false);
    // Implementation for handling form submission
  };

  const handleSubmitAdd = async (data: any) => {
    const param = {
      name: data.name,
      "business_id": activeBusinessId,
    };
    const result = await createPassbook(param);
    if (result && result.status === 201) {
      setFormVisible(false);
      loadData();
    }
    setIsLoading(false);
    // Implementation for handling form submission
  };

  const deletePassbookByIdHandler = async () => {
    const result = await deletePassbookById(activeBusinessId, selectedPassbookId);
    if (result && result.status === 204) {
      loadData();
    }
    setIsLoading(false);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await getPassbookById(activeBusinessId);
      if (status == 200) {
        setEntries(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
      setIsLoading(false);
    }
    
  };

  useEffect(() => {
    loadData();
  }, [activeBusinessId]);

  const renderBusinessItem = ({ item }: { item: any }) => (
    <Card 
     onPress={() => {
              setActivePassbookId(item.id);
              router.push({
              pathname: "/transaction",
              params: {
                formId: item.id,
                formName: item.name,
                formAction: "update",
                formType: "Passbook"
              },
            })}}
    mode='contained' style={[styles.customerCard, { backgroundColor: theme.colors.surface, marginHorizontal: 0, marginBottom: 0, borderRadius: 0 }]}>
      <Card.Content>
        <View style={[styles.customerHeader, { padding: 0 }]} >
          <View style={styles.customerInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.name}


            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
              {/* {item.created_at?.toLocaleDateString("en-Us",{ year: "numeric", month: "short", day: "numeric"})}  |  
                  {item.created_at?.toLocaleTimeString("en-Us",{ hour: "2-digit", minute: "2-digit" })}
                   */}
              {/* {"Apr 15, 2026 | 10:30 AM"} */}
              {formatDateTime(item.created_at)}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            {/* <Text variant="titleMedium" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                    $10.00
                    
                  </Text>
                  <Text variant="titleMedium" style={{ fontWeight: 100, padding:0, backgroundColor: theme.colors.error, textAlign: 'center', fontSize: 8, color: "#fff" }}>
                    Credit
                    
                  </Text> */}
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
                closeMenu('0')
                setSelectedPassbookId(item.id);
                setFormInitialValue(item.name);
                setFormMode('edit');
                setFormVisible(true);
              }} title="Rename" />
              <Divider />
              <Menu.Item onPress={() => {
                setSelectedPassbookId(item.id);
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

         }}
      >
        <Appbar.BackAction onPress={() => router.push({
                  pathname: '/business',
                  params: {},
                })} />
        <Appbar.Content title="Passbook" />
        <Appbar.Action icon="plus" onPress={() => {
          setFormVisible(true);
          setFormMode('add');
          setFormInitialValue('');
        }
        } />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
        <Button
          icon="plus"
          mode="outlined"
          onPress={() => {
            setFormVisible(true);
            setFormMode('add');
            setFormInitialValue('');
          }
          }
        >
          Add New Passbook
        </Button>
        </View>
        {isLoading ? <Loader /> : entries.length === 0 ? (
          <MaterialCard title={t('noPassbook')} subtitle={t('getStartedBusiness')}>
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              {t('notCreatedBusiness')}
            </Text>
          </MaterialCard>
        ) : (
          <><View style={styles.listContainer}>
           {isLoading ? <Loader /> 
           : (
            <FlatList
              data={entries}
              renderItem={renderBusinessItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              contentContainerStyle={{ paddingHorizontal: 5 }}
            />
           )
           } 
          </View>
            <Portal>
              <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                {/* <Dialog.Title>Login Error</Dialog.Title> */}
                <Dialog.Content>
                  <Text variant="bodyMedium">Are you sure you want to delete this Passbook id: {selectedPassbookId}?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => {
                    setIsLoading(true);
                    deletePassbookByIdHandler();

                    setShowModal(false);
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
              title={`${formMode === 'add' ? 'Add' : 'Rename'} Passbook`}
              label="Passbook Name"
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
              isLoading={isLoading}
            />
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
    marginTop: 8,
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
