import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, useTheme } from 'react-native-paper';

import { DrawerContent } from '@/components/DrawerContent';

function HamburgerHeader() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      <Appbar.Action
        icon="menu"
        onPress={() => navigation.toggleDrawer()}
        iconColor={theme.colors.onPrimary}
      />
      <Appbar.Content
        title=""
        titleStyle={{ color: theme.colors.onPrimary }}
      />
    </Appbar.Header>
  );
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          header: () => <HamburgerHeader />,
          headerShown: true,
        }}
        drawerContent={DrawerContent}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />
        <Drawer.Screen
          name="business"
          options={{
            drawerLabel: 'Businesses',
            title: 'Businesses',
          }}
        />
        <Drawer.Screen
          name="AddForm"
          options={{
            drawerLabel: 'Add Form',
            title: 'Add Form',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="add-transaction"
          options={{
            drawerLabel: 'Transaction',
            title: 'Transaction',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="select-party"
          options={{
            drawerLabel: 'Select Party',
            title: 'Select Party',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="passbook"
          options={{
            drawerLabel: 'Passbook',
            title: 'Passbook',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="customer"
          options={{
            drawerLabel: 'Customers',
            title: 'Customers',
            headerShown: false,
          }}
          
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            title: 'Profile',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
