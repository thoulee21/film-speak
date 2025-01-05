import {
  TransitionPresets,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { router, Tabs } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { FAB, Portal } from "react-native-paper";

import packageData from '@/package.json';
import MaterialBottomBar from '@/src/components/tabbar/MaterialBottomBar';
import TabBarIcon from '@/src/components/TabBarIcon';
import { useClientOnlyValue } from '@/src/hooks/useClientOnlyValue';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function TabLayout() {
  const renderTabBar = useCallback((
    props: BottomTabBarProps
  ) => (
    <MaterialBottomBar {...props} />
  ), []);

  return (
    <Portal.Host>
      <Tabs
        screenOptions={{
          ...TransitionPresets.ShiftTransition,
          animation: 'shift',
          tabBarHideOnKeyboard: true,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
        backBehavior='none'
        tabBar={renderTabBar}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: packageData.displayName,
            headerShown: false,
            tabBarIcon: ({ color, focused, size }) => (
              <TabBarIcon
                name={focused ? 'video' : 'video-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                name={focused ? 'cog' : 'cog-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>

      <Portal>
        <FAB
          icon="subtitles-outline"
          style={styles.fab}
          onPress={() => {
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectDoubleClick,
            );
            router.push('/subtitles');
          }}
        />
      </Portal>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80
  }
})