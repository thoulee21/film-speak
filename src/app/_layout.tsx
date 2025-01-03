import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  HeaderStyleInterpolators,
  TransitionPresets,
} from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
  useTheme,
} from 'react-native-paper';
import 'react-native-reanimated';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { JsStack as Stack } from '@/src/layouts/js-stack';
import { persister, store } from '@/src/redux/store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const appTheme = useTheme();
  return (
    <View style={{
      flex: 1,
      backgroundColor: appTheme.colors.background,
    }}>
      <Stack screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
        headerBackButtonDisplayMode: 'default',
        headerMode: 'float',
        gestureEnabled: true,
        freezeOnBlur: true,
        headerTitleAlign: 'center',
      }}>
        <Stack.Screen name="(tabs)" options={{
          headerShown: false,
          headerTitle: 'Home',
        }} />
        <Stack.Screen name="history" options={{
          ...TransitionPresets.ModalPresentationIOS,
          headerShown: false,
        }} />
        <Stack.Screen name="dev/index" options={{
          headerTitle: 'DevOptions',
        }} />
        <Stack.Screen name="about" options={{
          headerTitle: 'About',
        }} />
        <Stack.Screen name="appdata" options={{
          headerTitle: 'App Data',
          gestureEnabled: false,
        }} />
        <Stack.Screen name="dev/cache" options={{
          headerTitle: 'Cache',
        }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <PaperProvider
          theme={colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme}
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
      </PersistGate>
    </ReduxProvider>
  );
}
