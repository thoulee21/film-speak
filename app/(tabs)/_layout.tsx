import { TransitionPresets } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Easing, Pressable } from 'react-native';
import { BottomNavigation, Icon } from 'react-native-paper';

import Touchable from '@/components/Touchable';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Icon>['source'];
  color: string;
  size: number;
}) {
  return (
    <Icon
      source={props.name}
      {...props}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        ...TransitionPresets.ShiftTransition,
        tabBarHideOnKeyboard: true,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
      backBehavior='none'
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          compact
          shifting
          animationEasing={Easing.ease}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : typeof options.title === 'string'
                  ? options.title
                  : route.name;

            return label;
          }}
          renderTouchable={(props) => (
            <Touchable {...props} key={props.key} />
          )}
        />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Video',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              name={focused ? 'video' : 'video-outline'}
              color={color}
              size={size}
            />
          ),
          headerRight: ({ tintColor }) => (
            <Link href="/modal" asChild>
              <Pressable style={{ padding: 10 }}>
                <Icon
                  source="information-outline"
                  size={25}
                  color={tintColor}
                />
              </Pressable>
            </Link>
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
  );
}
