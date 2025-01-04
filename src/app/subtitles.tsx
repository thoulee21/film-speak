import Clipboard from "@react-native-clipboard/clipboard";
import * as Crypto from "expo-crypto";
import { File, Paths } from "expo-file-system/next";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
  type ListRenderItemInfo,
} from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  Appbar,
  Caption,
  Divider,
  IconButton,
  List,
  Text,
  useTheme
} from "react-native-paper";
import Reanimated, {
  LinearTransition,
} from 'react-native-reanimated';

import LottieAnimation from "@/src/components/LottieAnimation";
import {
  useAppDispatch,
  useAppSelector
} from "@/src/hooks/redux";
import {
  removeSubtitle,
  selectSubtitles,
  type Subtitle,
} from "@/src/redux/slices/subtitles";
import {
  selectVideoSource,
  setVideoSource
} from "@/src/redux/slices/videoSource";

export default function Subtitles() {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const subtitles = useAppSelector(selectSubtitles);
  const videoSource = useAppSelector(selectVideoSource);

  const renderItem = ({
    item
  }: ListRenderItemInfo<Subtitle>) => (
    <List.Item
      title={(props) => (
        <View style={styles.titleSection}>
          <Text {...props}>
            {new Date(item.createAt).toLocaleString()}
          </Text>
          <Caption>
            {item.value.length} line(s)
          </Caption>
        </View>
      )}
      description={item.fileUri}
      style={{
        backgroundColor: videoSource === item.fileUri
          ? appTheme.colors.secondaryContainer
          : undefined
      }}
      onPress={() => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

        if (videoSource !== item.fileUri) {
          dispatch(setVideoSource(item.fileUri));
          router.back();
        }
      }}
      onLongPress={() => {
        HapticFeedback.trigger(
          HapticFeedbackTypes.effectHeavyClick
        );
        Clipboard.setString(item.fileUri);

        ToastAndroid.show(
          "Copied to clipboard",
          ToastAndroid.SHORT
        )
      }}
      left={(props) => (
        <List.Image
          variant="video"
          source={{ uri: item.coverUri }}
          {...props}
        />
      )}
      right={(props) => (
        <IconButton
          {...props}
          icon="delete-forever-outline"
          disabled={videoSource === item.fileUri}
          onPress={async () => {
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectClick
            );
            const fileHash = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA256,
              item.fileUri
            );
            const file2delete = new File(
              Paths.cache,
              `${fileHash.slice(0, 6)}.wav`
            );

            file2delete.exists && file2delete.delete();
            dispatch(removeSubtitle(item.fileUri));
            ToastAndroid.show(
              "Subtitle removed",
              ToastAndroid.SHORT
            );
          }}
        />
      )}
    />
  );

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
        ItemSeparatorComponent={Divider}
        contentContainerStyle={{ flexGrow: 1 }}
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
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  }
})
