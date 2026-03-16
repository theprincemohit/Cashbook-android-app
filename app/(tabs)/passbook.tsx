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

import { deletePassbookById, getPassbookById } from '@/api/passbookApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { usePassbookContext } from '@/hooks/usePassbookContext';
import { router, useLocalSearchParams } from 'expo-router';

export default function PassbookScreen() {
  const theme = useTheme();
  const { activeBusinessId } = useBusinessContext();
  const { t } = useLanguageContext();
  const { entries, setEntries } = usePassbookContext();
  const params = useLocalSearchParams();
  const [visible, setVisible] = useState('0');
  const [showModal, setShowModal] = useState(false);
  const [selectedPassbookId, setSelectedPassbookId] = useState<string>('');

  const openMenu = (id: any) => setVisible(id);
  const closeMenu = (id: any) => setVisible(id);

  const loadData = async () => {
    try {
      const { data, status } = await getPassbookById(activeBusinessId);
      console.log("Fetched Passbook Entries for Business ID:", { activeBusinessId }, { status }, data);
      if (status == 200) {
        setEntries(data);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeBusinessId]);

  const renderBusinessItem = ({ item }: { item: any }) => (
    <Card mode='contained' style={[styles.customerCard, { backgroundColor: theme.colors.surface, marginHorizontal: 0, marginBottom: 0, borderRadius: 0 }]}>
      <Card.Content>
        <View style={[styles.customerHeader, { padding: 0 }]} >
          <View style={styles.customerInfo}>
            <Text onPress={() => router.push({
              pathname: "/transaction",
              params: {
                formId: item.id,
                formName: item.name,
                formAction: "update",
                formType: "Passbook"
              },
            })} variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.name}


            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
              {/* {item.created_at?.toLocaleDateString("en-Us",{ year: "numeric", month: "short", day: "numeric"})}  |  
                  {item.created_at?.toLocaleTimeString("en-Us",{ hour: "2-digit", minute: "2-digit" })}
                   */}
              {/* {"Apr 15, 2026 | 10:30 AM"} */}
              {item.description}
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
                router.push({
                  pathname: '/AddForm',
                  params: {
                    formId: item.id,
                    formName: item.name,
                    formDescription: item.description,
                    formAction: "update",
                    formType: "Passbook"
                  },
                })
              }} title="Edit" />
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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Passbook" />
        <Appbar.Action icon="plus" onPress={() => router.push({
          pathname: '/AddForm',
          params: {
            formId: 0,
            formName: '',
            formDescription: '',
            formAction: "new",
            formType: "Passbook"
          },
        })} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        {entries.length === 0 ? (
          <MaterialCard title={t('noPassbook')} subtitle={t('getStartedBusiness')}>
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              {t('notCreatedBusiness')}
            </Text>
          </MaterialCard>
        ) : (
          <><View style={styles.listContainer}>
            <FlatList
              data={entries}
              renderItem={renderBusinessItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              contentContainerStyle={{ paddingHorizontal: 5 }}
            />
          </View>
            <Portal>
              <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                {/* <Dialog.Title>Login Error</Dialog.Title> */}
                <Dialog.Content>
                  <Text variant="bodyMedium">Are you sure you want to delete this Passbook id: {selectedPassbookId}?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => {
                    // setShowError(false);
                    deletePassbookById(activeBusinessId, selectedPassbookId);
                    setShowModal(false);
                    loadData();
                  }}>Yes</Button>
                  <Button onPress={() => {
                    setShowModal(false);
                  }}>No</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
        )}
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
