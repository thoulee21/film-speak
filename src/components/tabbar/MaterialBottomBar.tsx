import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { Easing } from "react-native";
import { BottomNavigation } from "react-native-paper";

import Touchable from "@/src/components/tabbar/Touchable";
import { useAppSelector } from "@/src/hooks/redux";
import { selectDevMode } from "@/src/store/slices/devMode";

export default function MaterialBottomBar({
  navigation,
  state,
  descriptors,
  insets
}: BottomTabBarProps) {
  const devModeEnabled = useAppSelector(selectDevMode);
  return (
    <BottomNavigation.Bar
      compact
      shifting={!devModeEnabled}
      animationEasing={Easing.ease}
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={({
        route, preventDefault
      }) => {
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
      renderIcon={({
        route, focused, color
      }) => {
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
  )
};
