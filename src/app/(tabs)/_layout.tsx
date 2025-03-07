import {
  TransitionPresets,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Portal } from 'react-native-paper';

import packageData from '@/package.json';
import MaterialBottomBar from '@/src/components/tabbar/MaterialBottomBar';
import TabBarIcon from '@/src/components/TabBarIcon';
import { useClientOnlyValue } from '@/src/hooks/useClientOnlyValue';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function TabLayout() {
  const { t } = useTranslation();

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
            tabBarIcon: ({
              color, focused, size
            }) => (
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
            title: t('navigation.settings'),
            tabBarIcon: ({
              color, size, focused
            }) => (
              <TabBarIcon
                name={focused ? 'cog' : 'cog-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </Portal.Host>
  );
}
