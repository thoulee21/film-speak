import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type ListRenderItemInfo
} from "react-native";
import { Appbar } from "react-native-paper";
import Reanimated, {
  LinearTransition,
} from 'react-native-reanimated';

import LottieAnimation from "@/src/components/LottieAnimation";
import SubtitleItem from "@/src/components/subtitles/item";
import { useAppSelector } from "@/src/hooks/redux";
import {
  selectSubtitles,
  type Subtitle
} from "@/src/redux/slices/subtitles";

export default function Subtitles() {
  const subtitles = useAppSelector(selectSubtitles);

  const renderItem = useCallback(({
    item
  }: ListRenderItemInfo<Subtitle>) => (
    <SubtitleItem item={item} />
  ), []);

  return (
    <View style={styles.root}>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : 'auto'}
      />
      <Appbar.Header
        statusBarHeight={0}
        elevated
      >
        <Appbar.Content title="Subtitles" />
        <Appbar.Action icon="drag" />
      </Appbar.Header>

      <Reanimated.FlatList
        data={subtitles}
        renderItem={renderItem}
        contentContainerStyle={styles.items}
        ListEmptyComponent={
          <LottieAnimation
            animation="teapot"
            caption="No subtitles found"
          />
        }
        itemLayoutAnimation={LinearTransition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  items: {
    flexGrow: 1,
    marginHorizontal: 10,
  }
})
