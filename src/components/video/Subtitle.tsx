import * as Crypto from "expo-crypto";
import { cacheDirectory } from "expo-file-system";
import { File, Paths } from "expo-file-system/next";
import { FFmpegKit, type FFmpegSession, } from "ffmpeg-kit-react-native";
import React, { useCallback, useMemo, useState, } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Divider, List, useTheme } from "react-native-paper";
import { type Line } from "srt-parser-2";

import LottieAnimation from "@/src/components/LottieAnimation";
import SubtitleItem from "@/src/components/video/SubtitleItem";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { addSubtitle, selectSubtitles } from "@/src/redux/slices/subtitles";
import { selectVideoSource } from "@/src/redux/slices/videoSource";
import extractAudioFromVideo from "@/src/utils/extractAudioFromVideo";
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
  }: { item: Line }) => (
    <SubtitleItem
      item={item}
      onItemPress={onItemPress}
      selectedID={selectedID}
      setSelectedID={setSelectedID}
    />
  ), [onItemPress, selectedID]);

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
