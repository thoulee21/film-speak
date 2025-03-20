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
  Avatar,
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

  const renderDrawIcon = useCallback(({
    icon, color
  }: { icon: string, color: string }) => (
    <Avatar.Icon
      size={40}
      color='white'
      style={{ backgroundColor: color }}
      icon={icon}
    />
  ), []);

  return (
    <Drawer
      drawerContent={renderDrawerContent}
      screenOptions={() => ({
        drawerItemStyle: { marginVertical: 2 },
        drawerHideStatusBarOnOpen: true,
        drawerStatusBarAnimation: 'fade',
        drawerActiveBackgroundColor: appTheme.colors.primaryContainer,
        drawerActiveTintColor: appTheme.colors.onPrimaryContainer,
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: packageData.displayName,
          drawerIcon: () => renderDrawIcon({
            icon: 'video',
            color: 'royalblue'
          })
        }}
      />
      <Drawer.Screen
        name="subtitles"
        options={{
          title: t('navigation.subtitles'),
          drawerIcon: () => renderDrawIcon({
            icon: 'subtitles',
            color: 'violet'
          })
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: t('navigation.settings'),
          drawerIcon: () => renderDrawIcon({
            icon: 'cog',
            color: 'tomato'
          })
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: t('navigation.about'),
          drawerIcon: () => renderDrawIcon({
            icon: 'information',
            color: 'orangered'
          })
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
