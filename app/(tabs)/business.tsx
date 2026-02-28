import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Card,
  Divider,
  IconButton,
  Menu,
  Text,
  useTheme
} from 'react-native-paper';

import { getBusinesses } from '@/api/businessApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { Business } from '@/types/business';
import { router } from 'expo-router';
export default function BusinessScreen() {
   const [visible, setVisible] = useState('0');

  const openMenu = (id:any) => setVisible(id);
  const closeMenu = (id:any) => setVisible(id);
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { businesses, setBusinesses } = useBusinessContext();

  const fetchBusinesses = async () => {
    try {
      const response = await getBusinesses();
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };
  useEffect(() => {
    fetchBusinesses();
  }, []);

  
  const renderBusinessItem = ({ item }: { item: Business }) => (
    <Card  mode='contained' style={[styles.customerCard, { backgroundColor: theme.colors.surface, marginHorizontal:0, marginBottom: 0, borderRadius:0 }]}>
          <Card.Content>
            
            <View 
            style={[styles.customerHeader, { padding:0 }]}
            >
              <View style={styles.customerInfo}>
                <Text onPress={() =>  router.push({
                                    pathname: '/passbook',
                                    params: { formId: item.id, 
                                    formName: item.name,
                                    formAction: "update",
                                    formType: "Business"
                                     },
                                  })} variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {item.name}
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
                  {item.description}
                 </Text>
                 <Text variant="titleMedium" style={{ fontWeight: 100, fontSize: 10, color: theme.colors.onSurfaceVariant }}>
                  {new Date(item.created_at).toLocaleDateString("en-Us",{ year: "numeric", month: "short", day: "numeric"})}  | {new Date(item.created_at).toLocaleTimeString("en-Us",{ hour: "2-digit", minute: "2-digit" })}
                 </Text>
              </View>
                {/* <View style={styles.customerInfo}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                    $10.00
                  </Text>
                </View> */}
              
                
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
                                    params: { formId: item.id, 
                                    formName: item.name,
                                    formDescription: item.description,
                                    formAction: "update",
                                    formType: "Business"
                                     },
                                  })
        } } title="Edit" />
        <Divider />
        <Menu.Item onPress={() => { }} title="Delete" />
        
      </Menu>
                </View>
              
            </View>
          </Card.Content>
        </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor:  '#ecedee' }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            {t('businessManagement')}  {businesses.length}
          </Text>
           <Button icon="plus" mode="outlined" onPress={() =>  router.push({
                                    pathname: '/AddForm',
                                    params: { formId: 0, 
                                    formName: '',
                                    formDescription: '',
                                    formAction: "new",
                                    formType: "Business"
                                     },
                                  })}>
              Add New Business
            </Button>
         
        </View>

        {businesses.length === 0 ? (
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
            <FlatList
              data={businesses}
              renderItem={renderBusinessItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
              contentContainerStyle={{ paddingHorizontal: 5 }}
            />
            
          </View>
          
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
