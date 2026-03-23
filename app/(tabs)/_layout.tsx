import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Appbar, useTheme } from 'react-native-paper';

import { RouteProvider } from '@/context/RouteContext';
import MyComponent from '../bottomNav';

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
      <RouteProvider>
      <MyComponent />
      </RouteProvider>
    </GestureHandlerRootView>
  );
}
