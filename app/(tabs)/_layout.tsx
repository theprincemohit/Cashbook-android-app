import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, Avatar, useTheme } from 'react-native-paper';

import { DrawerContent } from '@/components/DrawerContent';

function HamburgerHeader() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.Action
        icon={ () => <Avatar.Text size={24} label="MK" />}
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
            drawerLabel: 'Add Transaction',
            title: 'Add Transaction',
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
          name="transaction"
          options={{
            drawerLabel: 'Transactions',
            title: 'Transactions',
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
        <Drawer.Screen
          name="report"
          options={{
            drawerLabel: 'Report',
            title: 'Report',
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
