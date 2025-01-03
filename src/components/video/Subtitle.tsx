import type { FFmpegSession } from "ffmpeg-kit-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  type ListRenderItemInfo,
} from "react-native";
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
import { selectShowSubtitle } from "@/src/redux/slices/showSubtitle";
import { addSubtitle, selectSubtitles } from "@/src/redux/slices/subtitles";
import extractAudioFromVideo from "@/src/utils/extractAudioFromVideo";
import Wav2SubtitleConverter from "@/src/utils/wav2subtitle";

interface SubtitleProps {
  videoFileUri: string;
  onItemPress: (arg0?: Line) => void;
}

export default function Subtitle({
  videoFileUri,
  onItemPress
}: SubtitleProps) {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const subtitles = useAppSelector(selectSubtitles);
  const showSubtitle = useAppSelector(selectShowSubtitle);
  const [selectedID, setSelectedID] = useState("0");

  const subtitle = useMemo(() => {
    let subtitleValue = subtitles.find((subtitle) =>
      subtitle.fileUri === videoFileUri
    )?.value;

    const save = (lines: Line[]) => {
      dispatch(addSubtitle({
        fileUri: videoFileUri,
        value: lines
      }));
      subtitleValue = lines;
    }

    const generateSubtitle = (
      _: FFmpegSession, audioUri: string
    ) => {
      const wav2Subtitle = new Wav2SubtitleConverter();
      wav2Subtitle.start(audioUri, save);
    }

    if (!subtitleValue) {
      extractAudioFromVideo(
        videoFileUri,
        generateSubtitle
      );
    }

    return subtitleValue;
  }, [subtitles, videoFileUri, dispatch]);

  const renderItem = useCallback(({
    item
  }: ListRenderItemInfo<Line>) => (
    <List.Item
      title={`${item.startSeconds} - ${item.endSeconds}`}
      description={showSubtitle && item.text.trim()}
      descriptionNumberOfLines={5}
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
            size={35}
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
  ), [
    showSubtitle,
    selectedID,
    appTheme.colors.primaryContainer,
    appTheme.colors.onSecondaryContainer,
    appTheme.colors.secondaryContainer,
    onItemPress
  ]);

  return (
    <FlatList
      data={subtitle}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={
        <View style={styles.row}>
          <List.Subheader
            style={{ color: appTheme.colors.primary }}
          >
            Subtitle
          </List.Subheader>

          {selectedID !== "0" && (
            <Button
              icon="stop-circle-outline"
              onPress={() => {
                HapticFeedback.trigger(
                  HapticFeedbackTypes.effectDoubleClick
                );
                onItemPress(undefined);
                setSelectedID("0");
              }}
            >
              Stop looping
            </Button>
          )}
        </View>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  }
})
