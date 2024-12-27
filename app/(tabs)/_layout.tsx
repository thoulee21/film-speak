import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from 'react-native-paper';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Icon>['source'];
  color: string;
}) {
  return (
    <Icon
      size={28}
      source={props.name}
      {...props}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        animation: 'shift',
      }}
      backBehavior='none'
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ padding: 10 }}>
                <Icon
                  source="information-outline"
                  size={25}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          title: 'Video',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'video' : 'video-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
