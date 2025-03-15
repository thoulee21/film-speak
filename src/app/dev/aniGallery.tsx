import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import type LottieView from 'lottie-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import LottieAnimation, {
  ANIMATIONS,
  type AniKeys,
} from '@/src/components/LottieAnimation';
import upperFirst from '@/src/utils/upperFirst';
import haptics from '@/src/utils/haptics';

const BottomTab = createMaterialTopTabNavigator();

const AniPage = ({ name }: { name: AniKeys }) => {
  const aniRef = useRef<LottieView>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = useCallback(() => {
    haptics.light();

    if (isPlaying) { aniRef.current?.pause(); }
    else { aniRef.current?.resume(); }

    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  return (
    <LottieAnimation
      ref={aniRef}
      animation={name}
      caption={upperFirst(name)}
      onPress={togglePlay}
    />
  );
};

const AniGallery = () => {
  const renderAniPage = useCallback((name: AniKeys) => {
    const Page = () => <AniPage name={name} />;
    Page.displayName = name;
    return Page;
  }, []);

  const AniPages = useMemo(() =>
    Object.keys(ANIMATIONS).map((key, index) => (
      <BottomTab.Screen
        key={index}
        name={key}
        component={renderAniPage(key as AniKeys)}
        options={{ tabBarShowLabel: false }}
      />
    )), [renderAniPage]);

  return (
    <>
      <BottomTab.Navigator
        backBehavior="none"
        tabBarPosition="bottom"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarShowIcon: false,
          tabBarStyle: styles.line,
          tabBarIndicatorStyle: styles.line,
        }}
      >
        {AniPages}
      </BottomTab.Navigator>
    </>
  );
};

export default AniGallery;

const styles = StyleSheet.create({
  line: {
    height: 4,
    borderRadius: 10,
  },
});
