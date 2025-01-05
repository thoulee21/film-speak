import * as Crypto from "expo-crypto";
import { cacheDirectory } from "expo-file-system";
import { File, Paths } from "expo-file-system/next";
import {
  FFmpegKit,
  type FFmpegSession,
} from "ffmpeg-kit-react-native";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
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
  Caption,
  Divider,
  List,
  Text,
  useTheme
} from "react-native-paper";
import { type Line } from "srt-parser-2";

import LottieAnimation from "@/src/components/LottieAnimation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { selectShowSubtitle } from "@/src/redux/slices/showSubtitle";
import { addSubtitle, selectSubtitles } from "@/src/redux/slices/subtitles";
import { selectVideoSource } from "@/src/redux/slices/videoSource";
import extractAudioFromVideo from "@/src/utils/extractAudioFromVideo";
import formateTime from "@/src/utils/formatTime";
import Wav2SubtitleConverter from "@/src/utils/wav2subtitle";

interface SubtitleProps {
  onItemPress: (arg0?: Line) => void;
}

export default function Subtitle({
  onItemPress
}: SubtitleProps) {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const videoFileUri = useAppSelector(selectVideoSource);
  const subtitles = useAppSelector(selectSubtitles);
  const showSubtitle = useAppSelector(selectShowSubtitle);
  const [selectedID, setSelectedID] = useState("0");

  const subtitle = useMemo(() => {
    let subtitleValue = subtitles.find((subtitle) =>
      subtitle.fileUri === videoFileUri
    )?.value;

    const save = async (lines: Line[]) => {
      subtitleValue = lines;

      const uriHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        videoFileUri
      );
      const coverFile = new File(
        Paths.cache,
        `cover_${uriHash.slice(0, 6)}_001.jpg`
      );

      const saveSubtitleMetadata = () => {
        const subtitleMatedata = {
          fileUri: videoFileUri,
          value: lines,
          createAt: Date.now(),
          coverUri: coverFile.uri
        };

        dispatch(addSubtitle(subtitleMatedata));
      }

      const outputPattern = `${cacheDirectory}cover_${uriHash.slice(0, 6)}_%03d.jpg`;
      await FFmpegKit.executeAsync(
        `-i ${videoFileUri} -y -f image2 -frames 1 ${outputPattern}`,
        saveSubtitleMetadata
      )
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
      title={({
        color, ellipsizeMode, fontSize, selectable
      }) => (
        <View style={styles.row}>
          <Text
            style={{ color, fontSize }}
            ellipsizeMode={ellipsizeMode}
            selectable={selectable}
          >
            {`${formateTime(item.startTime)} - ${formateTime(item.endTime)}`}
          </Text>

          <Caption>
            {(item.endSeconds - item.startSeconds)
              .toFixed(1)}s
          </Caption>
        </View>)
      }
      description={showSubtitle && item.text.trim()}
      descriptionNumberOfLines={3}
      onPress={() => {
        HapticFeedback.trigger(
          HapticFeedbackTypes.effectDoubleClick
        );

        if (selectedID === item.id) {
          setSelectedID("0");
          onItemPress(undefined);
        } else {
          setSelectedID(item.id);
          onItemPress(item);
        }
      }}
      style={{
        backgroundColor: selectedID === item.id
          ? appTheme.colors.secondaryContainer
          : undefined,
      }}
      left={({
        style, color
      }) => (
        selectedID !== item.id ? (
          <Avatar.Text
            size={40}
            label={item.id}
            color={color}
            style={[style, {
              backgroundColor: appTheme.colors.secondaryContainer,
            }]}
          />
        ) : (
          <ActivityIndicator size={40} style={style} />
        )
      )}
    />
  ), [
    showSubtitle,
    selectedID,
    appTheme.colors.secondaryContainer,
    onItemPress
  ]);

  return (
    <FlatList
      data={subtitle}
      renderItem={renderItem}
      overScrollMode="never"
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={
        <View style={[
          styles.row,
          { backgroundColor: appTheme.colors.background }
        ]}>
          <List.Subheader
            style={{ color: appTheme.colors.primary }}
          >
            Subtitle
          </List.Subheader>
        </View>
      }
      stickyHeaderIndices={[0]}
      extraData={selectedID}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <LottieAnimation
          animation="stackLoading"
          caption="Generating subtitle..."
        />
      }
      // 避免字幕项被 FAB 遮挡
      ListFooterComponent={
        <View style={{ height: 100 }} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})
