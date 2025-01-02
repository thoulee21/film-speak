import { TransitionPresets } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { Easing, Pressable, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';
import { BottomNavigation, Icon, TouchableRipple, type TouchableRippleProps } from "react-native-paper";
import type { BaseRoute } from "react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigation";

import { useAppSelector } from '@/src/hooks/redux';
import { useClientOnlyValue } from '@/src/hooks/useClientOnlyValue';
import { selectDevMode } from '@/src/redux/slices/devMode';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

type TouchableProps<Route extends BaseRoute> = TouchableRippleProps & {
  key: string;
  route: Route;
  children: React.ReactNode;
  borderless?: boolean;
  centered?: boolean;
  rippleColor?: ColorValue;
};

const Touchable = <Route extends BaseRoute>({
  route: _0,
  style,
  children,
  borderless,
  centered,
  rippleColor,
  ...rest
}: TouchableProps<Route>) => (
  TouchableRipple.supported ? (
    <TouchableRipple
      {...rest}
      disabled={rest.disabled || undefined}
      borderless={borderless}
      centered={centered}
      rippleColor={rippleColor}
      style={style}
    >
      {children}
    </TouchableRipple>
  ) : (
    <Pressable style={style as StyleProp<ViewStyle>} {...rest}>
      {children}
    </Pressable>
  )
);

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
  const devModeEnabled = useAppSelector(selectDevMode);

  return (
    <Tabs
      screenOptions={{
        ...TransitionPresets.ShiftTransition,
        animation: 'shift',
        tabBarHideOnKeyboard: true,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerTitleAlign: 'center',
      }}
      backBehavior='none'
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          compact
          shifting={!devModeEnabled}
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
