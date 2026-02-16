import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Card,
  IconButton,
  Text,
  useTheme
} from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { Business } from '@/types/business';
import { router } from 'expo-router';

export default function BusinessScreen() {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { businesses } = useBusinessContext();
  
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
                  {item.createdAt.toLocaleDateString("en-Us",{ year: "numeric", month: "short", day: "numeric"})}  | {item.createdAt.toLocaleTimeString("en-Us",{ hour: "2-digit", minute: "2-digit" })}
                 </Text>
              </View>
              <View style={styles.customerInfo}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                  $10.00
                </Text>
              </View>
              <View style={{}}>
                <IconButton
                  icon="dots-vertical"
                  size={20}
                  onPress={() => {}}
                />
               
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
                                    formName: 'Business',
                                    formAction: "Add",
                                    formType: "Business"
                                     },
                                  })}>
              Add New Business
            </Button>
         
        </View>

        {businesses.length === 0 ? (
          <MaterialCard title={t('noBusiness')} subtitle={t('getStartedBusiness')}>
            <Text variant="bodyMedium" style={{ textAlign: 'center', paddingVertical: 16 }}>
              {t('notCreatedBusiness')}
            </Text>
          </MaterialCard>
        ) : (
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
