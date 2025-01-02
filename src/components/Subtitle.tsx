import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  List,
  useTheme
} from "react-native-paper";
import { type Line } from "srt-parser-2";

import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { addSubtitle, selectSubtitles } from "@/src/redux/slices/subtitles";
import Wav2SubtitleConverter from "@/src/utils/wav2subtitle";

interface SubtitleProps {
  fileUri: string;
  onItemPress: (arg0: Line) => void;
}

export default function Subtitle({ fileUri, onItemPress }: SubtitleProps) {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const subtitles = useAppSelector(selectSubtitles);
  const [selectedID, setSelectedID] = useState("0");

  const subtitle = useMemo(() => {
    let subtitleValue = subtitles.find(
      (subtitle) => subtitle.fileUri === fileUri
    )?.value;

    if (!subtitleValue) {
      const wav2Subtitle = new Wav2SubtitleConverter();

      wav2Subtitle.start(
        fileUri,
        (lines) => {
          dispatch(addSubtitle({ fileUri, value: lines }));
          subtitleValue = lines;
        }
      );
    }

    return subtitleValue;
  }, [subtitles, fileUri, dispatch]);

  const renderItem = useCallback(({ item }: { item: Line }) => (
    <List.Item
      title={item.text.trim()}
      titleNumberOfLines={5}
      description={`${item.startSeconds} - ${item.endSeconds}`}
      onPress={() => {
        HapticFeedback.trigger(
          HapticFeedbackTypes.effectDoubleClick
        );
        setSelectedID(item.id);

        onItemPress(item);
      }}
      style={{
        backgroundColor: selectedID === item.id
          ? appTheme.colors.primaryContainer
          : undefined,
      }}
      left={({ style }) => (
        selectedID !== item.id ? (
          <Avatar.Text
            size={30}
            label={item.id}
            color={appTheme.colors.onSecondaryContainer}
            style={[style, {
              backgroundColor: appTheme.colors.secondaryContainer,
            }]}
          />
        ) : (
          <ActivityIndicator size={30} style={style} />
        )
      )}
    />
  ), [selectedID, appTheme, onItemPress]);

  return (
    <FlatList
      data={subtitle}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={
        <List.Subheader style={{ color: appTheme.colors.primary }}>
          Subtitle
        </List.Subheader>
      }
      extraData={selectedID}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.loadingView}>
          <Button loading>
            Generating Subtitle...
          </Button>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
