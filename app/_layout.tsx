import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { BusinessProvider } from '@/context/BusinessContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { TeamProvider } from '@/context/TeamContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'login',
};

// Material Design 3 themes
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    "primary": "rgb(71, 85, 182)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(223, 224, 255)",
    "onPrimaryContainer": "rgb(0, 13, 95)",
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
     "primary": "rgb(187, 195, 255)",
    "onPrimary": "rgb(17, 34, 134)",
    "primaryContainer": "rgb(45, 60, 156)",
    "onPrimaryContainer": "rgb(223, 224, 255)",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <BusinessProvider>
        <TeamProvider>
          <PaperProvider theme={theme}>
            <Stack>
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
  );
}
