import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { getToken } from '@/api/keychain';
import { BusinessProvider } from '@/context/BusinessContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { TeamProvider } from '@/context/TeamContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
  initialRouteName: 'login',
};

// Material Design 3 themes
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    "primary": "rgb(1, 30, 105)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(223, 224, 255)",
    "onPrimaryContainer": "rgb(0, 13, 95)",
    "background": "rgb(236, 237, 238)",
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
     "primary": "rgb(23, 24, 25)",
    "onPrimary": "rgb(223, 224, 255)",
    "primaryContainer": "rgb(45, 60, 156)",
    "onPrimaryContainer": "rgb(223, 224, 255)",
    "background": "rgb(23, 24, 25)",
    "surface": "rgb(28, 28, 28)",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken('userToken');
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <BusinessProvider>
        <TeamProvider>
          <PaperProvider theme={theme}>
            <Stack>
              {/* {isLoggedIn ? (
                <>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </>
              ) : (
                <Stack.Screen name="login" options={{ headerShown: false }} />
              )} */}
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </PaperProvider>
        </TeamProvider>
        </BusinessProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Add a background color if needed
  },
});
