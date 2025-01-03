import Clipboard from "@react-native-clipboard/clipboard";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
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
        titleNumberOfLines={5}
        description={({
          color, fontSize, ellipsizeMode
        }) => (
          <View style={{ flexDirection: "row" }}>
            <Chip
              icon="subtitles-outline"
              mode="outlined"
              textStyle={{ color, fontSize }}
              style={{ marginTop: 10 }}
              ellipsizeMode={ellipsizeMode}
            >
              {item.value.length} line(s)
            </Chip>

            <Chip
              icon="file-document-outline"
              mode="outlined"
              textStyle={{ color, fontSize }}
              style={{ marginTop: 10, marginLeft: 10 }}
              ellipsizeMode={ellipsizeMode}
            >
              {item.fileUri.split('.').pop()?.toLocaleUpperCase()}
            </Chip>
          </View>
        )}
        style={{
          backgroundColor: videoSource === item.fileUri
            ? appTheme.colors.secondaryContainer
            : undefined
        }}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectClick
          );
          dispatch(setVideoSource(item.fileUri));
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
            onPress={() => {
              dispatch(removeSubtitle(item.fileUri));
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

      <FlatList
        data={subtitles}
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
  }
})
