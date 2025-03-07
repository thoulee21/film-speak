import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import LocalStorage from '@/src/components/dev/appdata/pages/localStorage';
import PackageData from '@/src/components/dev/appdata/pages/packageData';
import ReduxState from '@/src/components/dev/appdata/pages/reduxState';
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

export default function AppDataScreen() {
  const navigation = useNavigation();
  return (
    <TopTab.Navigator
      backBehavior="none"
      screenListeners={() => ({
        state: ({ data }: { data: any }) => {
          navigation.setOptions({
            headerRight: () => (
              <Actions routeIndex={data.state.index} />
            ),
          });
        }
      })}
      screenOptions={{
        lazy: true,
        lazyPlaceholder: () => (
          <View style={styles.placeholder}>
            <ActivityIndicator size='large' />
          </View>
        ),
        tabBarAndroidRipple: {
          color: 'transparent',
        }
      }}
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

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
