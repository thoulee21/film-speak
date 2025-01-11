import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  HeaderStyleInterpolators,
  TransitionPresets,
} from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import * as FileSystem from 'expo-file-system';
import { File } from 'expo-file-system/next';
import { useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import {
  PaperProvider,
  adaptNavigationTheme,
  useTheme,
} from 'react-native-paper';
import 'react-native-reanimated';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import BlurColorTheme from '@/src/constants/colorTheme';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { JsStack as Stack } from '@/src/layouts/js-stack';
import { persister, store } from '@/src/redux/store';
import { logFilePath } from '@/src/utils/logger';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before loading is complete.
SplashScreen.preventAutoHideAsync();

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  enabled: !__DEV__,
  dsn: 'https://3d6106f276a8cdfb240e2a6282ce777c@o4507198225383424.ingest.de.sentry.io/4508592129441872',
  environment: __DEV__ ? 'development' : 'production',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0,
  attachScreenshot: true,
  attachViewHierarchy: true,
  _experiments: {
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    Sentry.reactNativeTracingIntegration(),
  ],
  // Tracks slow and frozen frames in the application
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

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
        <Stack.Screen name="subtitles" options={{
          ...TransitionPresets.ModalPresentationIOS,
          headerShown: false,
        }} />
        <Stack.Screen name="dev/index" options={{
          headerTitle: 'DevOptions',
        }} />
        <Stack.Screen name="about" options={{
          headerTitle: 'About',
        }} />
        <Stack.Screen name="dev/appdata" options={{
          headerTitle: 'App Data',
          gestureEnabled: false,
        }} />
        <Stack.Screen name="dev/cache" options={{
          headerTitle: 'Cache',
        }} />
        <Stack.Screen name='videoEnhance' options={{
          headerTitle: 'Video Enhancement',
          gestureEnabled: false,
        }} />
        <Stack.Screen name="dev/logcat" options={{
          headerTitle: 'Logcat',
          headerBackButtonDisplayMode: 'minimal',
          headerTitleAlign: 'left',
        }} />
      </Stack>
    </View>
  );
}

function RootLayout() {
  const colorScheme = useColorScheme();

  // Capture the NavigationContainer ref and register it with the integration.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    const createLogFile = async () => {
      const fileExists = new File(logFilePath).exists;

      if (!fileExists) {
        await FileSystem.writeAsStringAsync(logFilePath, '');
      }
    };

    createLogFile();
  }, []);

  const {
    DarkTheme: PaperedDarkTheme,
    LightTheme: PaperedLightTheme,
  } = adaptNavigationTheme({
    reactNavigationDark: DarkTheme,
    reactNavigationLight: DefaultTheme,
    materialDark: BlurColorTheme.dark,
    materialLight: BlurColorTheme.light,
  });

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <PaperProvider
          theme={colorScheme === 'dark'
            ? BlurColorTheme.dark : BlurColorTheme.light}
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

export default Sentry.wrap(RootLayout);
