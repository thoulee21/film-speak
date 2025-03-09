import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps
} from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import {
  Icon,
  Drawer as PaperDrawer,
  Portal,
} from 'react-native-paper';

import packageData from '@/package.json';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function TabLayout() {
  const { t } = useTranslation();

  const renderDrawerContent = useCallback((
    props: DrawerContentComponentProps
  ) => (
    <View style={{ flex: 1 }}>
      <Image
        source={require('@/assets/images/banner.png')}
        style={styles.bannerImg}
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
  ), []);

  return (
    <Portal.Host>
      <Drawer
        backBehavior='none'
        drawerContent={renderDrawerContent}
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
        <Drawer.Screen
          name="about"
          options={{
            title: t('navigation.about'),
            drawerIcon: ({
              color, size, focused
            }) => (
              <Icon
                source={focused ? 'information' : 'information-outline'}
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

const styles = StyleSheet.create({
  bannerImg: {
    width: '100%',
    height: 250,
  },
});