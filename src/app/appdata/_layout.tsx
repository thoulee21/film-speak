import { Tabs as TopTab, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'react-native-paper';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import { MMKVStorageIndicator } from '@/src/components/appData/StorageIndicator';
import TabBarIcon from '@/src/components/TabBarIcon';

const Actions = ({ routeIndex }: { routeIndex: number }) => {
  return (
    routeIndex === 1 && (
      <Animated.View
        entering={FadeIn.easing(Easing.inOut(Easing.quad))}
        exiting={FadeOut.easing(Easing.inOut(Easing.quad))}
      >
        <MMKVStorageIndicator />
      </Animated.View>
    )
  );
};

function AppDataLayout() {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [routeIndex, setRouteIndex] = useState(0);

  const renderActions = useCallback(() => (
    <Actions routeIndex={routeIndex} />
  ), [routeIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderActions,
    });
  }, [appTheme.colors.background, navigation, renderActions, routeIndex]);

  return (
    <TopTab
      backBehavior="none"
      screenOptions={{
        tabBarPosition: 'left',
        headerStatusBarHeight: 0,
        tabBarVariant: 'material',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: appTheme.colors.elevation.level1,
        }
      }}
      screenListeners={() => ({
        state: ({ data }) => {
          setRouteIndex(data.state.index);
        }
      })}
    >
      <TopTab.Screen
        name="reduxState"
        options={{
          title: 'State',
          tabBarIcon: ({
            color, size, focused
          }) => (
            <TabBarIcon
              name={focused ? 'view-list' : 'view-list-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <TopTab.Screen
        name="localStorage"
        options={{
          title: 'Storage',
          tabBarIcon: ({
            color, size, focused
          }) => (
            <TabBarIcon
              name={focused ? 'database-cog' : 'database-cog-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <TopTab.Screen
        name="packageData"
        options={{
          title: 'Package',
          tabBarIcon: ({
            color, size
          }) => (
            <TabBarIcon
              name="package-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </TopTab>
  );
}

export default AppDataLayout;
