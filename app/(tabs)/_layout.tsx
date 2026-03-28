import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, Avatar, useTheme } from 'react-native-paper';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
export function BottomTabLayout() {
  const theme = useTheme();
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: theme.colors.primary,  
      headerShown: false ,
       tabBarStyle: {
      height: 50,
    },
     
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="business"
        options={{
          headerShown: false,
          title: 'Businesses',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="briefcase" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="passbook"
        options={{
           href: null,
           headerShown: false,
          title: 'Passbook',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
           href: null,
           headerShown: false,
          title: 'Transactions',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-transaction"
        options={{
           href: null,
           headerShown: false,
          title: 'Add Transaction',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
           href: null,
           headerShown: false,
          title: 'Report',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="select-party"
        options={{
           href: null,
           headerShown: false,
          title: 'Select Party',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="AddForm"
        options={{
           href: null,
           headerShown: false,
          title: 'Add Form',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
           href: null,
           headerShown: false,
          title: 'Explore',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="compass" color={color} />,
        }}
      />
      
    </Tabs>
  );
}

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
      {/* <Drawer
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
      </Drawer> */}
      <BottomTabLayout />
    </GestureHandlerRootView>
  );
}
