import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { JsStack as Stack } from '@/src/layouts/js-stack';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{
        ...TransitionPresets.ModalPresentationIOS,
        gestureEnabled: true,
      }} />
    </Stack>
  );
}


export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the splash screen after the loading is complete.
    SplashScreen.hideAsync();
  }, []);

  const {
    DarkTheme: PaperedDarkTheme,
    LightTheme: PaperedLightTheme,
  } = adaptNavigationTheme({
    reactNavigationDark: DarkTheme,
    reactNavigationLight: DefaultTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme,
  });

  return (
    <PaperProvider
      theme={
        colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme
      }
    >
      <ThemeProvider value={{
        ...(colorScheme === 'dark'
          ? PaperedDarkTheme : PaperedLightTheme),
        fonts: DefaultTheme.fonts,
      }}>
        <StatusBar
          translucent
          style={colorScheme === 'dark' ? 'light' : 'dark'}
        />
        <RootLayoutNav />
      </ThemeProvider>
    </PaperProvider>
  );
}
