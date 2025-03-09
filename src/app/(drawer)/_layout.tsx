import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Portal } from 'react-native-paper';

import packageData from '@/package.json';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Portal.Host>
      <Drawer
        backBehavior='none'
      >
        <Drawer.Screen
          name="index"
          options={{
            title: packageData.displayName,
            drawerIcon: ({
              color, focused, size
            }) => (
              <Icon
                source={focused ? 'video' : 'video-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="subtitles"
          options={{
            title: t('navigation.subtitles'),
            drawerIcon: ({
              color, focused, size
            }) => (
              <Icon
                source={focused ? 'subtitles' : 'subtitles-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: t('navigation.settings'),
            drawerIcon: ({
              color, size, focused
            }) => (
              <Icon
                source={focused ? 'cog' : 'cog-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Drawer>
    </Portal.Host>
  );
}
