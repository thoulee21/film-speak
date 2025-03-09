import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-paper';

import packageData from '@/package.json';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          title: packageData.displayName,
          drawerIcon: (props) => (
            <Icon
              {...props}
              source={props.focused ? 'video' : 'video-outline'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="subtitles"
        options={{
          title: t('navigation.subtitles'),
          drawerIcon: (props) => (
            <Icon
              {...props}
              source={props.focused ? 'subtitles' : 'subtitles-outline'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: t('navigation.settings'),
          drawerIcon: (props) => (
            <Icon
              {...props}
              source={props.focused ? 'cog' : 'cog-outline'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: t('navigation.about'),
          drawerIcon: (props) => (
            <Icon
              {...props}
              source={props.focused ? 'information' : 'information-outline'}
            />
          ),
        }}
      />
    </Drawer>
  );
}
