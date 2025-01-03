import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Platform,
  StyleSheet,
  View,
  type ListRenderItemInfo,
} from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  Appbar,
  Avatar,
  Chip,
  Divider,
  List,
  Text,
  useTheme
} from "react-native-paper";

import {
  useAppDispatch,
  useAppSelector
} from "@/src/hooks/redux";
import {
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
              {item.value.length} lines
            </Chip>

            <Chip
              icon="file-outline"
              mode="outlined"
              textStyle={{ color, fontSize }}
              style={{ marginTop: 10, marginLeft: 10 }}
              ellipsizeMode={ellipsizeMode}
            >
              {item.fileUri.split('.').pop()}
            </Chip>
          </View>
        )}
        left={({ style, color }) => (
          <Avatar.Text
            style={[style, {
              backgroundColor: appTheme.colors.tertiaryContainer,
            }]}
            labelStyle={{ color }}
            size={40}
            label={item.fileUri[0].toUpperCase()}
          />
        )}
        style={{
          backgroundColor: videoSource === item.fileUri
            ? appTheme.colors.primaryContainer
            : undefined
        }}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectClick
          );
          dispatch(setVideoSource(item.fileUri));
        }}
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
