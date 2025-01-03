import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Button } from 'react-native-paper';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import LocalStorage from '@/src/app/appdata/localStorage';
import PackageData from '@/src/app/appdata/packageData';
import ReduxState from '@/src/app/appdata/reduxState';
import { formatDataSize } from '@/src/utils/formatDataSize';
import { reduxStorage } from '@/src/utils/mmkvStorage';

const TopTab = createMaterialTopTabNavigator();

const Actions = ({ routeIndex }: { routeIndex: number }) => {
  return (
    routeIndex === 1 && (
      <Animated.View
        entering={FadeIn.easing(Easing.inOut(Easing.quad))}
        exiting={FadeOut.easing(Easing.inOut(Easing.quad))}
      >
        <Button icon="database-search-outline">
          {formatDataSize(reduxStorage.size)}
        </Button>
      </Animated.View>
    )
  );
};

export default function AppDataLayout() {
  const navigation = useNavigation();

  const screenListeners = useCallback(() => ({
    state: ({ data }: { data: any }) => {
      navigation.setOptions({
        headerRight: () => (
          <Actions routeIndex={data.state.index} />
        ),
      });
    }
  }), [navigation]);

  return (
    <TopTab.Navigator
      backBehavior="none"
      screenListeners={screenListeners}
      screenOptions={{ lazy: true }}
    >
      <TopTab.Screen
        name="reduxState"
        component={ReduxState}
        options={{ title: 'State' }}
      />
      <TopTab.Screen
        name="localStorage"
        component={LocalStorage}
        options={{ title: 'Storage' }}
      />
      <TopTab.Screen
        name="packageData"
        component={PackageData}
        options={{ title: 'Package' }}
      />
    </TopTab.Navigator>
  );
}
