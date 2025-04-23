import Clarity from "@microsoft/react-native-clarity";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  HeaderStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";
import { File } from "expo-file-system/next";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import "react-native-gesture-handler";
import {
  PaperProvider,
  adaptNavigationTheme,
  useTheme,
} from "react-native-paper";
import "react-native-reanimated";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// 导入 i18n 初始化配置
import "@/src/i18n";

import ColorTheme from "@/src/constants/colorTheme";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { JsStack as Stack } from "@/src/layouts/js-stack";
import { persister, store } from "@/src/store/store";
import { logFilePath, rootLog } from "@/src/utils/logger";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

Clarity.initialize("r8ph9c7eh7");

// Prevent the splash screen from auto-hiding before loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const appTheme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appTheme.colors.background,
      }}
    >
      <Stack
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
          headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
          headerBackButtonDisplayMode: "default",
          headerMode: "float",
          gestureEnabled: true,
          freezeOnBlur: true,
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            headerTitle: t("navigation.home"),
          }}
        />
        <Stack.Screen
          name="dev/index"
          options={{
            headerTitle: "DevOptions",
          }}
        />
        <Stack.Screen
          name="dev/appdata"
          options={{
            headerTitle: t("dev.appData"),
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="dev/cache"
          options={{
            headerTitle: t("dev.cache"),
          }}
        />
        <Stack.Screen
          name="videoEnhance"
          options={{
            headerTitle: t("videoEnhance.title"),
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="dev/logcat"
          options={{
            headerTitle: t("navigation.logcat"),
            headerBackButtonDisplayMode: "minimal",
            headerTitleAlign: "left",
          }}
        />
        <Stack.Screen
          name="dev/aniGallery"
          options={{
            headerTitle: t("navigation.aniGallery"),
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const createLogFile = async () => {
      const fileExists = new File(logFilePath).exists;

      if (!fileExists) {
        await FileSystem.writeAsStringAsync(logFilePath, "");
        rootLog.info("Log file created.");
      } else {
        const logFile = new File(logFilePath);
        if (logFile.size && logFile.size > 1024 * 1024) {
          // Clear the log file if it exceeds 1MB.
          await FileSystem.writeAsStringAsync(logFilePath, "");
          rootLog.info("Log file cleared due to size limit.");
        }
      }
    };

    createLogFile();
  }, []);

  const { DarkTheme: PaperedDarkTheme, LightTheme: PaperedLightTheme } =
    adaptNavigationTheme({
      reactNavigationDark: DarkTheme,
      reactNavigationLight: DefaultTheme,
      materialDark: ColorTheme.dark,
      materialLight: ColorTheme.light,
    });

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <PaperProvider
          theme={colorScheme === "dark" ? ColorTheme.dark : ColorTheme.light}
        >
          <ThemeProvider
            value={{
              ...(colorScheme === "dark"
                ? PaperedDarkTheme
                : PaperedLightTheme),
              fonts: DefaultTheme.fonts,
            }}
          >
            <StatusBar
              translucent
              style={colorScheme === "dark" ? "light" : "dark"}
            />
            <RootLayoutNav />
          </ThemeProvider>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
