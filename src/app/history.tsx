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
  Chip,
  Divider,
  IconButton,
  List,
  Text,
  useTheme
} from "react-native-paper";
import Reanimated, {
  LinearTransition,
} from 'react-native-reanimated';

import VIDEO_SOURCE from "@/src/constants/video-source";
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
  }: ListRenderItemInfo<Subtitle>) => {
    return (
      <List.Item
        title={item.fileUri}
        titleNumberOfLines={2}
        description={({
          color, fontSize, ellipsizeMode
        }) => (
          <View style={styles.chips}>
            <Chip
              icon="protocol"
              mode="outlined"
              compact
              textStyle={{ color, fontSize }}
              style={styles.chip}
              ellipsizeMode={ellipsizeMode}
            >
              {item.fileUri.split(':').shift()}
            </Chip>

            <Chip
              icon="subtitles-outline"
              mode="outlined"
              compact
              textStyle={{ color, fontSize }}
              style={styles.chip}
              ellipsizeMode={ellipsizeMode}
            >
              {item.value.length} line(s)
            </Chip>

            <Chip
              icon="file-video-outline"
              mode="outlined"
              compact
              textStyle={{ color, fontSize }}
              style={styles.chip}
              ellipsizeMode={ellipsizeMode}
            >
              {item.fileUri.split('.').pop()}
            </Chip>
          </View>
        )}
        style={{
          backgroundColor: videoSource === item.fileUri
            ? appTheme.colors.secondaryContainer
            : undefined
        }}
        onPress={() => {
          HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

          dispatch(setVideoSource(item.fileUri));
          router.back();
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
        right={(props) => (
          <IconButton
            {...props}
            icon="delete-outline"
            onPress={async () => {
              HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
              const fileHash = (await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                item.fileUri
              )).slice(0, 6);
              const file2delete = new File(Paths.cache, `${fileHash}.wav`);

              file2delete.exists && file2delete.delete();
              dispatch(removeSubtitle(item.fileUri));
              ToastAndroid.show("Subtitle removed", ToastAndroid.SHORT)
            }}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : 'auto'}
      />
      <Appbar.Header
        statusBarHeight={0}
        elevated
      >
        <Appbar.Content title="History" />
        <Appbar.Action icon="drag" />
      </Appbar.Header>

      <Reanimated.FlatList
        data={subtitles.filter(
          (subtitle) =>
            subtitle.fileUri !== VIDEO_SOURCE
        )}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">
              No subtitles found
            </Text>
          </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  chips: {
    marginTop: 5,
    flexDirection: "row",
  },
  chip: {
    marginRight: 4,
  }
})
