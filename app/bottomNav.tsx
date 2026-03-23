import { useRouteContext } from '@/context/RouteContext';
import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import BusinessScreen from './(tabs)/business';
import ProfileScreen from './(tabs)/profile';
import SettingsScreen from './(tabs)/settings';


const MyComponent = () => {
    const {routeIndex, setRouteIndex} = useRouteContext();
//   const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'business', title: 'Business', focusedIcon: 'store', unfocusedIcon: 'store-outline' },
    { key: 'profile', title: 'Profile', unfocusedIcon: 'account' },
    { key: 'setting', title: 'Settings', focusedIcon: 'cog', options: { display: 'none' } },
    // { key: 'passbook', title: 'Passbook', focusedIcon: 'book' },
    // { key: 'transaction', title: 'Transactions', focusedIcon: 'swap-horizontal' },
    // { key: 'add-transaction', title: 'Add Transaction', focusedIcon: 'plus-box',
    //     tabBarVisible : false, // Hide from tab bar
    //  },

  ]);

  const renderScene = BottomNavigation.SceneMap({
    business: BusinessScreen,
    profile: ProfileScreen,
    setting: SettingsScreen,
    // passbook: () => <PassbookScreen />, // Placeholder for Passbook screen
    // transaction: () => <TransactionScreen />, // Placeholder for Transaction screen
   // 'add-transaction': () => <AddTransactionScreen />, // Placeholder for Add Transaction screen
  });

  return (
    <BottomNavigation
      navigationState={{ index: Number(routeIndex), routes }}
      onIndexChange={setRouteIndex}
      renderScene={renderScene}
      style={{ backgroundColor: 'blue' }} // Set background to transparent
    />
  );
};

export default MyComponent;