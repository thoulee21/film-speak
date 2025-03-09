import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import {
  Icon,
  Drawer as PaperDrawer,
  useTheme,
} from 'react-native-paper';

import packageData from '@/package.json';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function TabLayout() {
  const { t } = useTranslation();
  const appTheme = useTheme();

  const renderDrawerContent = useCallback((
    props: DrawerContentComponentProps
  ) => (
    <View style={{ flex: 1 }}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={[styles.bannerImg, {
          backgroundColor: appTheme.colors.primary
        }]}
        resizeMode='cover'
      />

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        <PaperDrawer.Section showDivider={false}>
          <DrawerItemList {...props} />
        </PaperDrawer.Section>
      </DrawerContentScrollView>
    </View>
  ), [appTheme.colors.primary]);

  return (
    <Drawer drawerContent={renderDrawerContent}>
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

const styles = StyleSheet.create({
  bannerImg: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
